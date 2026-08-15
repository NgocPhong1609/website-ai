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

        $payment = Payment::find($result['payment_id']);

        if (! $payment) {
            return null;
        }

        $payment->update([
            'status' => $result['status'],
            'transaction_id' => $result['transaction_id'] ?? $payment->transaction_id,
            'metadata' => array_merge($payment->metadata ?? [], $result['metadata'] ?? []),
        ]);

        if ($payment->status === 'completed' && ! empty($payment->metadata['course_ids'] ?? [])) {
            $courseIds = array_map('intval', (array) $payment->metadata['course_ids']);

            foreach ($courseIds as $courseId) {
                $alreadyEnrolled = \App\Models\Enrollment::where('user_id', $payment->user_id)
                    ->where('course_id', $courseId)
                    ->exists();

                if ($alreadyEnrolled) {
                    continue;
                }

                \App\Models\Enrollment::create([
                    'user_id' => $payment->user_id,
                    'course_id' => $courseId,
                    'progress_percentage' => 0,
                    'enrolled_at' => now(),
                    'status' => 'enrolled',
                ]);
            }
        }

        return $payment;
    }
}
