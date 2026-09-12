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
                'vnp_TxnRef' => (string) $payment->transaction_id, // Mã tham chiếu đơn hàng
                'vnp_Amount' => (int) ($payment->amount * 100), // VNPay tính tiền bằng đồng và nhân 100
                'vnp_OrderInfo' => $payment->description ?? 'Pay with VNPay', // Mô tả đơn hàng
                'vnp_ReturnUrl' => $returnUrl, // URL trả về
                'vnp_IpAddr' => request()->ip(), // IP của client
            ],
        ];
    }


public function verifyCallback(array $params): array
    {
        $vnpSecureHash = $params['vnp_SecureHash'] ?? '';

        // 1. Chỉ lấy đúng các tham số của VNPay (bắt đầu bằng 'vnp_') để kiểm tra chữ ký
        $inputData = [];
        foreach ($params as $key => $value) {
            if (str_starts_with($key, 'vnp_') && $key !== 'vnp_SecureHash' && $key !== 'vnp_SecureHashType') {
                $inputData[$key] = $value;
            }
        }

        ksort($inputData);

        // 2. Tạo chuỗi hash data theo chuẩn VNPay
        $hashData = '';
        $i = 0;
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashData .= '&' . urlencode($key) . '=' . urlencode((string)$value);
            } else {
                $hashData .= urlencode($key) . '=' . urlencode((string)$value);
                $i = 1;
            }
        }

        $secureHash = hash_hmac('sha512', $hashData, config('services.vnpay.hash_secret'));

        // 3. Kiểm tra tính hợp lệ
        $isValid = hash_equals(strtolower($secureHash), strtolower($vnpSecureHash));
        $responseCode = $params['vnp_ResponseCode'] ?? '';
        $isSuccess = $isValid && ($responseCode === '00');

        return [
            'valid' => $isValid,
            'status' => $isSuccess ? 'completed' : 'failed',
            'payment_id' => $params['vnp_TxnRef'] ?? null,
            'transaction_id' => $params['vnp_TransactionNo'] ?? null,
            'amount' => isset($params['vnp_Amount']) ? ((float) $params['vnp_Amount']) / 100 : 0,
            'metadata' => [
                'vnp_BankCode' => $params['vnp_BankCode'] ?? null,
                'vnp_PayDate' => $params['vnp_PayDate'] ?? null,
                'vnp_ResponseCode' => $responseCode,
            ],
        ];
    }
}
