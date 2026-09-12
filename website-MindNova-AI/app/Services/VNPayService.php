<?php

namespace App\Services;

use App\Models\Payment;

class VNPayService
{
    public function createPayment(Payment $payment, string $returnUrl): array
    {
        $paymentUrl = $this->buildPaymentUrl(
            txnRef: (string) $payment->transaction_id,
            amountVnd: (int) round((float) $payment->amount),
            orderInfo: $payment->description ?? 'Pay with VNPay',
            returnUrl: $returnUrl,
            ipAddr: (string) request()->ip(),
        );

        return [
            'provider' => 'vnpay',
            'payment_url' => $paymentUrl,
            'return_url' => $returnUrl,
        ];
    }

    public function buildPaymentUrl(
        string $txnRef,
        int $amountVnd,
        string $orderInfo,
        string $returnUrl,
        string $ipAddr,
    ): string {
        $config = config('services.vnpay');
        $endpoint = $config['endpoint'] ?? 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';

        $inputData = [
            'vnp_Version' => '2.1.0',
            'vnp_TmnCode' => (string) ($config['tmn_code'] ?? ''),
            'vnp_Amount' => $amountVnd * 100,
            'vnp_Command' => 'pay',
            'vnp_CreateDate' => date('YmdHis'),
            'vnp_CurrCode' => 'VND',
            'vnp_IpAddr' => $ipAddr,
            'vnp_Locale' => 'vn',
            'vnp_OrderInfo' => $orderInfo,
            'vnp_OrderType' => 'billpayment',
            'vnp_ReturnUrl' => $returnUrl,
            'vnp_TxnRef' => $txnRef,
        ];

        ksort($inputData);

        $query = '';
        foreach ($inputData as $key => $value) {
            $query .= urlencode((string) $key).'='.urlencode((string) $value).'&';
        }

        return $endpoint.'?'.$query.'vnp_SecureHash='.$this->secureHash($inputData);
    }

    /**
     * Chuỗi hash theo tài liệu VNPay: ksort + urlencode(key)=urlencode(value) nối bằng &.
     */
    public function hashData(array $params): string
    {
        $inputData = [];
        foreach ($params as $key => $value) {
            if (str_starts_with((string) $key, 'vnp_') && $key !== 'vnp_SecureHash' && $key !== 'vnp_SecureHashType') {
                $inputData[$key] = $value;
            }
        }

        ksort($inputData);

        $hashData = '';
        $first = true;
        foreach ($inputData as $key => $value) {
            $part = urlencode((string) $key).'='.urlencode((string) $value);
            $hashData .= $first ? $part : '&'.$part;
            $first = false;
        }

        return $hashData;
    }

    public function secureHash(array $params): string
    {
        return hash_hmac('sha512', $this->hashData($params), (string) config('services.vnpay.hash_secret'));
    }

    public function verifyCallback(array $params): array
    {
        $vnpSecureHash = (string) ($params['vnp_SecureHash'] ?? '');
        $secureHash = $this->secureHash($params);
        $isValid = $vnpSecureHash !== '' && hash_equals(strtolower($secureHash), strtolower($vnpSecureHash));
        $responseCode = (string) ($params['vnp_ResponseCode'] ?? '');
        $isSuccess = $isValid && $responseCode === '00';

        return [
            'valid' => $isValid,
            'status' => $isSuccess ? 'completed' : 'failed',
            'payment_id' => $params['vnp_TxnRef'] ?? null,
            'transaction_id' => $params['vnp_TransactionNo'] ?? null,
            'amount' => isset($params['vnp_Amount']) ? ((float) $params['vnp_Amount']) / 100 : 0,
            'response_code' => $responseCode,
            'metadata' => [
                'vnp_BankCode' => $params['vnp_BankCode'] ?? null,
                'vnp_PayDate' => $params['vnp_PayDate'] ?? null,
                'vnp_ResponseCode' => $responseCode,
            ],
        ];
    }
}
