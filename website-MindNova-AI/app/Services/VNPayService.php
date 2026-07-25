<?php // Service hỗ trợ thanh toán qua VNPay

namespace App\Services;

use App\Models\Payment; // Model Payment

class VNPayService
{
    public function createPayment(Payment $payment, string $returnUrl): array
    {
        $config = config('services.vnpay'); // Lấy cấu hình VNPay từ services.php

        return [
            'provider' => 'vnpay', // Tên cổng VNPay
            'payment_url' => $config['endpoint'] ?? 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html', // URL thanh toán VNPay
            'return_url' => $returnUrl, // URL trả về sau thanh toán
            'payload' => [
                'vnp_TxnRef' => (string) $payment->id, // Mã tham chiếu đơn hàng
                'vnp_Amount' => (int) ($payment->amount * 100), // VNPay tính tiền bằng đồng và nhân 100
                'vnp_OrderInfo' => $payment->description ?? 'Pay with VNPay', // Mô tả đơn hàng
                'vnp_ReturnUrl' => $returnUrl, // URL trả về
                'vnp_IpAddr' => request()->ip(), // IP của client
            ],
        ];
    }

    public function verifyCallback(array $params): array
    {
        $valid = isset($params['vnp_TxnRef'], $params['vnp_ResponseCode']) && $params['vnp_ResponseCode'] === '00'; // ResponseCode 00 nghĩa là thành công

        return [
            'valid' => $valid, // Callback hợp lệ hay không
            'payment_id' => $params['vnp_TxnRef'] ?? null, // Lấy payment_id từ vnp_TxnRef
            'status' => $valid ? 'completed' : 'failed', // Trạng thái payment
            'transaction_id' => $params['vnp_TransactionNo'] ?? $params['vnp_TransactionStatus'] ?? null, // Mã giao dịch VNPay
            'metadata' => $params, // Lưu toàn bộ dữ liệu callback
        ];
    }
}
