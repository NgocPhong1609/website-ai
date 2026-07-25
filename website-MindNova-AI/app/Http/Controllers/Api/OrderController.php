<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    /**
     * Khởi tạo Đơn hàng mới (Checkout)
     * POST: /api/orders
     */
    public function store(Request $request)
    {
        // 1. Kiểm tra tính hợp lệ dữ liệu đầu vào
        $validator = Validator::make($request->all(), [
            'course_ids'     => 'required|array|min:1',
            'course_ids.*'   => 'required|integer|exists:courses,id',
            'payment_method' => 'required|string|in:vnpay,momo,stripe,banking'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = $request->user(); // Lấy học viên đang đăng nhập qua token Sanctum
        $courseIds = $request->course_ids;

        // 2. Kiểm tra xem học viên đã mua hoặc đang sở hữu khóa học này chưa
        $alreadyEnrolled = DB::table('enrollments')
            ->where('user_id', $user->id)
            ->whereIn('course_id', $courseIds)
            ->exists();

        if ($alreadyEnrolled) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn đã đăng ký một trong số các khóa học này trong tài khoản rồi.'
            ], 400);
        }

        // 3. Sử dụng Database Transaction
        DB::beginTransaction();

        try {
            // Truy vấn lấy danh sách khóa học thực tế từ CSDL
            $courses = Course::whereIn('id', $courseIds)->get();
            $totalAmount = 0;
            $orderItemsData = [];

            foreach ($courses as $course) {
                $totalAmount += $course->price;

                $orderItemsData[] = [
                    'course_id'  => $course->id,
                    'price'      => $course->price,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            // Tạo bản ghi Đơn hàng tổng
            $order = Order::create([
                'user_id'        => $user->id,
                'total_amount'   => $totalAmount,
                'payment_method' => $request->payment_method,
                'status'         => 'pending', // Trạng thái chờ thanh toán
                'transaction_id' => null
            ]);

            // Gán ID đơn hàng vừa tạo vào từng chi tiết khóa học
            foreach ($orderItemsData as &$item) {
                $item['order_id'] = $order->id;
            }

            // Insert hàng loạt để tối ưu hiệu năng DB
            OrderItem::insert($orderItemsData);

            DB::commit(); // Mọi thứ trơn tru -> Chốt lưu vào CSDL

            return response()->json([
                'success' => true,
                'message' => 'Tạo đơn hàng thành công! Đang chuyển hướng đến cổng thanh toán.',
                'data'    => $order->load('orderItems')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack(); // Có lỗi phát sinh -> Hủy bỏ toàn bộ thao tác DB vừa rồi

            return response()->json([
                'success' => false,
                'message' => 'Không thể tạo đơn hàng vào lúc này. Vui lòng thử lại!',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Lấy lịch sử đơn hàng của học viên
     * GET: /api/orders
     */
    public function index(Request $request)
    {
        $orders = Order::with('orderItems')
            ->where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $orders
        ]);
    }
}
