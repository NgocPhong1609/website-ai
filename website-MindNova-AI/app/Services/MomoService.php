<?php // Service hỗ trợ thanh toán qua MoMo

namespace App\Services;

use App\Models\Payment; // Model Payment

class MomoService
{
    public function createPayment(Payment $payment, string $returnUrl): array
    {
        $config = config('services.momo'); // Lấy cấu hình MoMo từ services.php

        return [
            'provider' => 'momo', // Tên cổng thanh toán
            'payment_url' => $config['endpoint'] ?? 'https://test-payment.momo.vn/v2/gateway/api/create', // URL API MoMo
            'return_url' => $returnUrl, // URL trả về sau khi thanh toán xong
            'payload' => [
                'partnerCode' => $config['partner_code'] ?? '', // Mã đối tác MoMo
                'accessKey' => $config['access_key'] ?? '', // Access key MoMo
                'amount' => (string) $payment->amount, // Số tiền thanh toán dưới dạng chuỗi
                'orderId' => (string) $payment->id, // Mã đơn hàng dùng để liên kết payment
                'orderInfo' => $payment->description ?? 'Pay with MoMo', // Mô tả đơn hàng
                'redirectUrl' => $returnUrl, // URL redirect sau khi thanh toán
                'extraData' => json_encode($payment->metadata ?? []), // Dữ liệu bổ sung
            ],
        ];
    }

    public function verifyCallback(array $params): array
    {
        $valid = isset($params['orderId'], $params['resultCode']) && (int) $params['resultCode'] === 0; // Xác thực callback bằng resultCode

        return [
            'valid' => $valid, // Callback hợp lệ hay không
            'payment_id' => $params['orderId'] ?? null, // ID payment từ callback
            'status' => $valid ? 'completed' : 'failed', // Trạng thái sau khi callback
            'transaction_id' => $params['transId'] ?? $params['requestId'] ?? null, // Mã giao dịch từ MoMo
            'metadata' => $params, // Lưu toàn bộ param callback
        ];
    }
}
