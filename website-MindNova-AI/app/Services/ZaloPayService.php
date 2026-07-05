<?php // Service hỗ trợ thanh toán qua ZaloPay

namespace App\Services;

use App\Models\Payment; // Model Payment

class ZaloPayService
{
    public function createPayment(Payment $payment, string $returnUrl): array
    {
        $config = config('services.zalopay'); // Lấy cấu hình ZaloPay

        return [
            'provider' => 'zalopay', // Tên cổng ZaloPay
            'payment_url' => $config['endpoint'] ?? 'https://sandbox.zalopay.vn/v2/gateway', // URL tạo đơn ZaloPay
            'return_url' => $returnUrl, // URL trả về sau khi thanh toán
            'payload' => [
                'app_id' => $config['app_id'] ?? '', // App ID ZaloPay
                'app_trans_id' => sprintf('payment_%s', $payment->id), // Mã đơn hàng ZaloPay
                'app_user' => $payment->user_id ? "user_{$payment->user_id}" : 'guest', // Tên user hoặc guest
                'amount' => (int) $payment->amount, // Số tiền
                'description' => $payment->description ?? 'Pay with ZaloPay', // Mô tả
                'callback_url' => $returnUrl, // URL callback
            ],
        ];
    }

    public function verifyCallback(array $params): array
    {
        $valid = isset($params['apptransid'], $params['returncode']) && (int) $params['returncode'] === 1; // returncode 1 là thành công
        $paymentId = null; // Khởi tạo biến paymentId

        if (! empty($params['apptransid'])) {
            $parts = explode('_', $params['apptransid']); // Tách apptransid theo dấu gạch dưới
            $paymentId = end($parts); // Lấy phần cuối làm payment_id
        }

        return [
            'valid' => $valid, // Callback hợp lệ hay không
            'payment_id' => $paymentId, // ID payment trích từ apptransid
            'status' => $valid ? 'completed' : 'failed', // Trạng thái thanh toán
            'transaction_id' => $params['zptranstoken'] ?? null, // Mã giao dịch ZaloPay nếu có
            'metadata' => $params, // Lưu toàn bộ dữ liệu callback
        ];
    }
}
