<?php

namespace App\Services;

use App\Models\Payment;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class MomoService
{
    public function createPayment(Payment $payment, string $returnUrl): array
    {
        $ipnUrl = rtrim((string) config('app.url'), '/').'/api/student/payment/momo-ipn';
        $payUrl = $this->createWalletPayment(
            orderId: (string) $payment->transaction_id,
            amountVnd: (int) round((float) $payment->amount),
            orderInfo: $payment->description ?? 'Pay with MoMo',
            redirectUrl: $returnUrl,
            ipnUrl: $ipnUrl,
        );

        return [
            'provider' => 'momo',
            'payment_url' => $payUrl,
            'return_url' => $returnUrl,
        ];
    }

    public function createWalletPayment(
        string $orderId,
        int $amountVnd,
        string $orderInfo,
        string $redirectUrl,
        string $ipnUrl,
    ): ?string {
        $config = config('services.momo');
        $partnerCode = (string) ($config['partner_code'] ?? '');
        $accessKey = (string) ($config['access_key'] ?? '');
        $secretKey = (string) ($config['secret_key'] ?? '');
        $endpoint = (string) ($config['endpoint'] ?? 'https://test-payment.momo.vn/v2/gateway/api/create');

        if ($partnerCode === '' || $accessKey === '' || $secretKey === '') {
            Log::warning('MoMo credentials are missing; cannot create payment.');

            return null;
        }

        $requestId = (string) Str::uuid();
        $extraData = '';
        $requestType = 'captureWallet';
        $amount = (string) $amountVnd;

        $rawHash = "accessKey={$accessKey}&amount={$amount}&extraData={$extraData}&ipnUrl={$ipnUrl}&orderId={$orderId}&orderInfo={$orderInfo}&partnerCode={$partnerCode}&redirectUrl={$redirectUrl}&requestId={$requestId}&requestType={$requestType}";
        $signature = hash_hmac('sha256', $rawHash, $secretKey);

        $payload = [
            'partnerCode' => $partnerCode,
            'partnerName' => 'MindNova',
            'storeId' => 'MindNova',
            'requestId' => $requestId,
            'amount' => $amount,
            'orderId' => $orderId,
            'orderInfo' => $orderInfo,
            'redirectUrl' => $redirectUrl,
            'ipnUrl' => $ipnUrl,
            'lang' => 'vi',
            'extraData' => $extraData,
            'requestType' => $requestType,
            'signature' => $signature,
        ];

        try {
            $response = Http::timeout(20)->acceptJson()->asJson()->post($endpoint, $payload);
            if (! $response->successful()) {
                Log::warning('MoMo create payment failed', [
                    'status' => $response->status(),
                    'body' => $response->json(),
                ]);

                return null;
            }

            $json = $response->json();

            return $json['payUrl'] ?? $json['deeplink'] ?? $json['qrCodeUrl'] ?? null;
        } catch (\Throwable $e) {
            Log::warning('MoMo create payment exception', ['error' => $e->getMessage()]);

            return null;
        }
    }

    public function verifyCallback(array $params): array
    {
        $config = config('services.momo');
        $accessKey = (string) ($config['access_key'] ?? '');
        $secretKey = (string) ($config['secret_key'] ?? '');

        $partnerCode = (string) ($params['partnerCode'] ?? '');
        $orderId = (string) ($params['orderId'] ?? '');
        $requestId = (string) ($params['requestId'] ?? '');
        $amount = (string) ($params['amount'] ?? '');
        $orderInfo = (string) ($params['orderInfo'] ?? '');
        $orderType = (string) ($params['orderType'] ?? '');
        $transId = (string) ($params['transId'] ?? '');
        $resultCode = (string) ($params['resultCode'] ?? '');
        $message = (string) ($params['message'] ?? '');
        $payType = (string) ($params['payType'] ?? '');
        $responseTime = (string) ($params['responseTime'] ?? '');
        $extraData = (string) ($params['extraData'] ?? '');
        $signature = (string) ($params['signature'] ?? '');

        $rawHash = "accessKey={$accessKey}&amount={$amount}&extraData={$extraData}&message={$message}&orderId={$orderId}&orderInfo={$orderInfo}&orderType={$orderType}&partnerCode={$partnerCode}&payType={$payType}&requestId={$requestId}&responseTime={$responseTime}&resultCode={$resultCode}&transId={$transId}";
        $expected = hash_hmac('sha256', $rawHash, $secretKey);
        $isValid = $signature !== '' && hash_equals($expected, $signature);
        $isSuccess = $isValid && (int) $resultCode === 0;

        return [
            'valid' => $isValid,
            'payment_id' => $orderId !== '' ? $orderId : null,
            'status' => $isSuccess ? 'completed' : 'failed',
            'transaction_id' => $params['transId'] ?? $params['requestId'] ?? null,
            'amount' => $amount !== '' ? (float) $amount : 0,
            'result_code' => $resultCode,
            'metadata' => [
                'resultCode' => $resultCode,
                'transId' => $params['transId'] ?? null,
                'message' => $params['message'] ?? null,
            ],
        ];
    }
}
