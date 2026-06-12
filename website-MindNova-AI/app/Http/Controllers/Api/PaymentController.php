<?php // Controller xử lý API thanh toán

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller; // Controller cơ sở
use App\Http\Requests\StorePaymentRequest; // Request xác thực dữ liệu thanh toán
use App\Models\Payment; // Model Payment
use App\Notifications\NewPaymentNotification; // Thông báo thanh toán mới
use App\Services\PaymentService; // Service quản lý thanh toán
use Illuminate\Http\JsonResponse; // Kiểu trả về JSON
use Illuminate\Http\Request; // Request chung

class PaymentController extends Controller
{
    public function index(): JsonResponse
    {
        $payments = Payment::with('user')->latest()->get(); // Lấy danh sách payments kèm user, sắp xếp mới nhất trước

        return response()->json(['data' => $payments]); // Trả về JSON danh sách payments
    }

    public function store(StorePaymentRequest $request, PaymentService $paymentService): JsonResponse
    {
        $data = $request->validated(); // Lấy dữ liệu đã xác thực
        $payment = $paymentService->checkout($data); // Khởi tạo thanh toán và chọn cổng nếu có

        if (isset($payment['payment']) && $payment['payment']->user) {
            $payment['payment']->user->notify(new NewPaymentNotification($payment['payment'])); // Gửi email thông báo nếu có user
        }

        return response()->json([
            'message' => 'Payment has been recorded successfully.',
            'data' => $payment,
        ], 201); // Trả về kết quả tạo payment
    }

    public function checkout(StorePaymentRequest $request, PaymentService $paymentService): JsonResponse
    {
        $result = $paymentService->checkout($request->validated()); // Khởi tạo luồng checkout thanh toán

        return response()->json([
            'message' => 'Payment checkout initialized.',
            'data' => $result,
        ], 201); // Trả về payload cho cổng thanh toán
    }

    public function callback(Request $request, string $provider): JsonResponse
    {
        $paymentService = app(PaymentService::class); // Lấy service thanh toán từ container
        $payment = $paymentService->processCallback($provider, $request->all()); // Xử lý callback từ cổng

        if (! $payment) {
            return response()->json(['message' => 'Unable to verify payment callback or payment not found.'], 422); // Nếu không xác thực được hoặc không tìm thấy payment
        }

        if ($payment->user) {
            $payment->user->notify(new NewPaymentNotification($payment)); // Gửi thông báo khi payment đã xác nhận
        }

        return response()->json([
            'message' => 'Payment callback processed.',
            'data' => $payment,
        ]); // Trả về payment đã cập nhật
    }

    public function show(Payment $payment): JsonResponse
    {
        $payment->load('user'); // Nạp relationship user

        return response()->json(['data' => $payment]); // Trả về chi tiết payment
    }
}
