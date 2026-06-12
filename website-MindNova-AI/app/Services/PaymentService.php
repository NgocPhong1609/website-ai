<?php // Service chính điều phối quá trình thanh toán

namespace App\Services;

use App\Models\Payment; // Model Payment
use Illuminate\Support\Str; // Hỗ trợ chuỗi

class PaymentService
{
    public function __construct(
        protected MomoService $momoService,
        protected VNPayService $vnPayService,
        protected ZaloPayService $zaloPayService
    ) {
    }

    public function checkout(array $data): array
    {
        $payment = Payment::create(array_merge($data, [ // Tạo bản ghi payment mới
            'status' => $data['status'] ?? 'pending', // Nếu không có status thì mặc định pending
            'transaction_id' => $data['transaction_id'] ?? Str::uuid()->toString(), // Tạo transaction_id khi chưa có
        ]));

        $returnUrl = $data['return_url'] ?? url('/payments/' . $payment->id); // URL trả về khi thanh toán xong

        $payload = match (strtolower($payment->provider ?? '')) { // Chọn service theo provider
            'momo' => $this->momoService->createPayment($payment, $returnUrl),
            'vnpay' => $this->vnPayService->createPayment($payment, $returnUrl),
            'zalopay' => $this->zaloPayService->createPayment($payment, $returnUrl),
            default => [
                'message' => 'No gateway selected. Payment recorded as pending.', // Nếu không chọn cổng thì chỉ lưu payment
            ],
        };

        return array_merge(['payment' => $payment], $payload); // Trả về payment và payload cổng nếu có
    }

    public function processCallback(string $provider, array $params): ?Payment
    {
        $service = match (strtolower($provider)) {
            'momo' => $this->momoService, // Dùng service Momo
            'vnpay' => $this->vnPayService, // Dùng service VNPay
            'zalopay' => $this->zaloPayService, // Dùng service ZaloPay
            default => null,
        };

        if (! $service) {
            return null; // Nếu provider không hợp lệ
        }

        $result = $service->verifyCallback($params); // Xác thực callback

        if (! $result['valid'] || empty($result['payment_id'])) {
            return null; // Nếu callback không hợp lệ hoặc thiếu ID
        }

        $payment = Payment::find($result['payment_id']); // Tìm payment theo ID

        if (! $payment) {
            return null; // Nếu không tìm thấy payment
        }

        $payment->update([
            'status' => $result['status'], // Cập nhật trạng thái mới
            'transaction_id' => $result['transaction_id'] ?? $payment->transaction_id, // Cập nhật transaction_id nếu có
            'metadata' => array_merge($payment->metadata ?? [], $result['metadata'] ?? []), // Gộp metadata mới
        ]);

        return $payment; // Trả về payment đã cập nhật
    }
}
