<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    /**
     * Tạo đơn hàng mới
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'course_ids'     => 'required|array|min:1',
            'course_ids.*'   => 'required|integer|exists:courses,id',
            'payment_method' => 'required|string|in:vnpay,momo,banking'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => 'Dữ liệu không hợp lệ.', 'errors' => $validator->errors()], 422);
        }

        $user = $request->user();

        // Kiểm tra trùng lặp
        if (DB::table('enrollments')->where('user_id', $user->id)->whereIn('course_id', $request->course_ids)->exists()) {
            return response()->json(['success' => false, 'message' => 'Bạn đã đăng ký khóa học này rồi.'], 400);
        }

        DB::beginTransaction();
        try {
            $courses = Course::whereIn('id', $request->course_ids)->get();
            $totalAmount = $courses->sum('price');
            $transactionId = 'ORD-' . strtoupper(Str::random(6));

            $order = Order::create([
                'user_id' => $user->id,
                'total_amount' => $totalAmount,
                'payment_method' => $request->payment_method,
                'status' => 'pending',
                'transaction_id' => $transactionId
            ]);

            foreach ($courses as $course) {
                OrderItem::create(['order_id' => $order->id, 'course_id' => $course->id, 'price' => $course->price]);
            }
            DB::commit();

            // Xử lý phương thức thanh toán
            $paymentUrl = $this->handlePaymentMethod($order, $request, $totalAmount);

            return response()->json([
                'success' => true,
                'message' => 'Tạo đơn hàng thành công!',
                'data' => $order->load('orderItems'),
                'payment_url' => $paymentUrl
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => 'Lỗi hệ thống: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Tách logic xử lý các cổng thanh toán ra riêng
     */
    private function handlePaymentMethod($order, $request, $totalAmount)
    {
        $transactionId = $order->transaction_id;

        if ($order->payment_method === 'vnpay') {
            $inputData = [
                "vnp_Version" => "2.1.0", "vnp_TmnCode" => env('VNPAY_TMN_CODE'),
                "vnp_Amount" => $totalAmount * 100, "vnp_Command" => "pay",
                "vnp_CreateDate" => date('YmdHis'), "vnp_CurrCode" => "VND",
                "vnp_IpAddr" => $request->ip(), "vnp_Locale" => "vn",
                "vnp_OrderInfo" => "Thanh toan " . $transactionId,
                "vnp_OrderType" => "billpayment",
                "vnp_ReturnUrl" => "http://localhost:3000/payment/callback",
                "vnp_TxnRef" => $transactionId,
            ];
            ksort($inputData);
            $query = http_build_query($inputData);
            $hash = hash_hmac('sha512', $query, env('VNPAY_HASH_SECRET'));
            return "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?" . $query . "&vnp_SecureHash=" . $hash;
        }

        if ($order->payment_method === 'momo') {
            // Nếu bạn muốn bỏ Momo thì để đoạn này trả về null hoặc thông báo
            return "Momo is disabled";
        }

        return "https://your-website.com/banking-instruction"; // Link trang hướng dẫn banking
    }

    /**
     * API nhận IPN VNPay
     */
    public function vnpayIpn(Request $request)
    {
        // Giữ nguyên logic IPN của bạn vì nó đang hoạt động tốt
        $vnp_HashSecret = env('VNPAY_HASH_SECRET');
        $inputData = array_filter($request->all(), fn($k) => str_starts_with($k, 'vnp_'), ARRAY_FILTER_USE_KEY);
        $vnp_SecureHash = $inputData['vnp_SecureHash'];
        unset($inputData['vnp_SecureHash'], $inputData['vnp_SecureHashType']);
        ksort($inputData);
        $hashData = http_build_query($inputData);

        if (hash_hmac('sha512', $hashData, $vnp_HashSecret) === $vnp_SecureHash) {
            $order = Order::where('transaction_id', $inputData['vnp_TxnRef'])->first();
            if ($order && $order->status === 'pending') {
                if ($inputData['vnp_ResponseCode'] == '00') {
                    $order->update(['status' => 'completed']);
                    // Tự động cấp quyền
                    $items = OrderItem::where('order_id', $order->id)->get();
                    foreach ($items as $item) {
                        DB::table('enrollments')->insertOrIgnore([
                            'user_id' => $order->user_id, 'course_id' => $item->course_id,
                            'status' => 'enrolled', 'enrolled_at' => now()
                        ]);
                    }
                }
            }
            return response()->json(['RspCode' => '00', 'Message' => 'Confirm Success']);
        }
        return response()->json(['RspCode' => '97', 'Message' => 'Invalid signature']);
    }
}
