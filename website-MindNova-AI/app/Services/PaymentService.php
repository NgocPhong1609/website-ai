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
        $payment = Payment::create(array_merge($data, [
    'status' => $data['status'] ?? 'pending',
    'transaction_id' => $data['transaction_id'] ?? 'ORD-' . strtoupper(Str::random(6)), // Tạo mã ngắn dạng ORD-XXXXXX
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
            'momo' => $this->momoService,
            'vnpay' => $this->vnPayService,
            'zalopay' => $this->zaloPayService,
            default => null,
        };

        if (! $service) {
            return null;
        }

        $result = $service->verifyCallback($params);

        if (! $result['valid'] || empty($result['payment_id'])) {
            return null;
        }

        $txnRef = (string) $result['payment_id'];

        // 1. Tìm payment theo transaction_id hoặc id
        $payment = Payment::where('transaction_id', $txnRef)
            ->orWhere('id', $txnRef)
            ->first();

        // 2. Nếu chưa có trong DB, tạo mới cho User hiện tại (ID 201)
        if (! $payment) {
            $amount = isset($params['vnp_Amount']) ? $params['vnp_Amount'] / 100 : 0;
            $courseId = $params['course_id'] ?? null;
            $userId = $params['current_user_id']
                ?? auth('sanctum')->id()
                ?? request()->user('sanctum')?->id
                ?? 201;

            $payment = Payment::create([
                'user_id' => $userId,
                'amount' => $amount,
                'provider' => $provider,
                'status' => 'completed',
                'transaction_id' => $txnRef,
                'description' => $params['vnp_OrderInfo'] ?? 'Thanh toán VNPay',
                'metadata' => [
                    'course_ids' => $courseId ? [(int)$courseId] : [],
                    'vnp_TransactionNo' => $params['vnp_TransactionNo'] ?? null,
                ],
            ]);
        } else {
            // Giữ nguyên transaction_id gốc (ORD-...), không ghi đè mã ngân hàng
            $meta = is_array($payment->metadata) ? $payment->metadata : json_decode($payment->metadata ?? '[]', true) ?? [];
            if (!empty($params['course_id'])) {
                $meta['course_ids'] = array_values(array_unique(array_merge($meta['course_ids'] ?? [], [(int)$params['course_id']])));
            }
            $meta['vnp_TransactionNo'] = $params['vnp_TransactionNo'] ?? ($meta['vnp_TransactionNo'] ?? null);

            $payment->update([
                'status' => 'completed',
                'metadata' => $meta,
            ]);
        }

        // 3. Tự động ghi danh vào bảng enrollments (chống trùng lặp và luôn set status = enrolled)
        $metadata = is_array($payment->metadata) ? $payment->metadata : json_decode($payment->metadata ?? '[]', true) ?? [];
        $courseIds = $metadata['course_ids'] ?? [];
        if (!empty($params['course_id']) && !in_array((int)$params['course_id'], $courseIds)) {
            $courseIds[] = (int)$params['course_id'];
        }

        foreach ($courseIds as $cId) {
            \App\Models\Enrollment::updateOrCreate(
                [
                    'user_id' => $payment->user_id,
                    'course_id' => (int)$cId,
                ],
                [
                    'status' => 'enrolled',
                    'progress_percentage' => 0,
                    'enrolled_at' => now(),
                ]
            );
        }

        return $payment;
    }
}
