<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'), // Token Slack
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'), // Kênh Slack
        ],
    ],

    'momo' => [
        'partner_code' => env('MOMO_PARTNER_CODE'), // Mã đối tác MoMo
        'access_key' => env('MOMO_ACCESS_KEY'), // Access key MoMo
        'secret_key' => env('MOMO_SECRET_KEY'), // Secret key MoMo
        'endpoint' => env('MOMO_ENDPOINT', 'https://test-payment.momo.vn/v2/gateway/api/create'), // URL endpoint MoMo
        'return_url' => env('MOMO_RETURN_URL'), // URL trả về sau khi thanh toán MoMo
    ],

    'vnpay' => [
        'merchant_code' => env('VNPAY_MERCHANT_CODE'), // Mã merchant VNPay
        'hash_secret' => env('VNPAY_HASH_SECRET'), // Hash secret VNPay
        'endpoint' => env('VNPAY_ENDPOINT', 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'), // Endpoint VNPay
        'return_url' => env('VNPAY_RETURN_URL'), // URL trả về sau khi thanh toán VNPay
    ],

    'zalopay' => [
        'app_id' => env('ZALOPAY_APP_ID'), // App ID ZaloPay
        'key1' => env('ZALOPAY_KEY1'), // Key1 ZaloPay
        'key2' => env('ZALOPAY_KEY2'), // Key2 ZaloPay
        'endpoint' => env('ZALOPAY_ENDPOINT', 'https://sandbox.zalopay.vn/v2/gateway'), // Endpoint ZaloPay
        'return_url' => env('ZALOPAY_RETURN_URL'), // URL trả về sau khi thanh toán ZaloPay
    ],

];
