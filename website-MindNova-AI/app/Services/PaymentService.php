<?php

// Service chính điều phối quá trình thanh toán

namespace App\Services;

use App\Models\ChatConversation;
use App\Models\ChatConversationMember;
use App\Models\Course;
use App\Models\Order;
use App\Models\Payment;
use App\Models\User;
use App\Notifications\StudentEnrolled;
use App\Services\Instructor\InstructorPayoutService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PaymentService
{
    public function __construct(
        protected MomoService $momoService,
        protected VNPayService $vnPayService,
        protected ZaloPayService $zaloPayService
    ) {}

    public function checkout(array $data): array
    {
        $payment = Payment::create(array_merge($data, [
            'status' => $data['status'] ?? 'pending',
            'transaction_id' => $data['transaction_id'] ?? 'ORD-'.strtoupper(Str::random(6)),
        ]));

        $returnUrl = $data['return_url'] ?? url('/payments/'.$payment->id);

        $payload = match (strtolower($payment->provider ?? '')) {
            'momo' => $this->momoService->createPayment($payment, $returnUrl),
            'vnpay' => $this->vnPayService->createPayment($payment, $returnUrl),
            'zalopay' => $this->zaloPayService->createPayment($payment, $returnUrl),
            default => [
                'message' => 'No gateway selected. Payment recorded as pending.',
            ],
        };

        return array_merge(['payment' => $payment], $payload);
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
        $isSuccess = ($result['status'] === 'completed');

        // Chỉ tin transaction/order đã tạo ở backend. Không tin user_id/course_id từ frontend.
        $order = Order::with(['orderItems.course', 'user'])->where('transaction_id', $txnRef)->first();
        $existingPayment = Payment::where('transaction_id', $txnRef)->first();

        $userId = $order?->user_id ?: $existingPayment?->user_id;
        if (! $userId || ! User::where('id', $userId)->exists()) {
            return null;
        }

        $expectedAmount = $order
            ? (float) $order->total_amount
            : (float) ($existingPayment?->amount ?? 0);
        $callbackAmount = (float) ($result['amount'] ?? 0);
        if ($expectedAmount > 0 && $callbackAmount > 0 && (int) round($callbackAmount) !== (int) round($expectedAmount)) {
            $isSuccess = false;
        }

        $amount = $expectedAmount > 0 ? $expectedAmount : $callbackAmount;

        $paymentMetadata = is_array($existingPayment?->metadata)
            ? $existingPayment->metadata
            : [];

        $courseIds = $order
            ? $order->orderItems->pluck('course_id')->filter()->map(fn ($id) => (int) $id)->all()
            : array_map('intval', $paymentMetadata['course_ids'] ?? []);

        // 2. Find or Create Payment record
        $payment = $existingPayment;

        if (! $payment) {
            $payment = Payment::create([
                'user_id' => $userId,
                'amount' => $amount,
                'provider' => strtolower($provider),
                'status' => $isSuccess ? 'completed' : 'failed',
                'transaction_id' => $txnRef,
                'description' => $params['vnp_OrderInfo'] ?? ('Thanh toán '.strtoupper($provider)),
                'metadata' => [
                    'course_ids' => array_values(array_unique($courseIds)),
                    'vnp_TransactionNo' => $params['vnp_TransactionNo'] ?? null,
                ],
            ]);
        } else {
            $meta = is_array($payment->metadata) ? $payment->metadata : json_decode($payment->metadata ?? '[]', true) ?? [];
            $meta['course_ids'] = array_values(array_unique(array_merge($meta['course_ids'] ?? [], $courseIds)));
            if (! empty($params['vnp_TransactionNo'])) {
                $meta['vnp_TransactionNo'] = $params['vnp_TransactionNo'];
            }

            $nextStatus = $payment->status === 'completed'
                ? 'completed'
                : ($isSuccess ? 'completed' : 'failed');

            $payment->update([
                'status' => $nextStatus,
                'user_id' => $userId,
                'metadata' => $meta,
            ]);
        }

        // 3. If Payment is successful, complete Order, create Payouts, and Enroll user
        if ($isSuccess) {
            DB::transaction(function () use ($order, $userId, $courseIds) {
                if ($order && $order->status !== 'completed') {
                    $locked = Order::where('id', $order->id)->lockForUpdate()->first();
                    if ($locked && $locked->status !== 'completed') {
                        $locked->update(['status' => 'completed']);

                        if (class_exists(InstructorPayoutService::class)) {
                            app(InstructorPayoutService::class)->createForOrder($locked);
                        }
                    }
                }

                $studentUser = User::find($userId);

                foreach (array_unique($courseIds) as $cId) {
                    $inserted = DB::table('enrollments')->insertOrIgnore([
                        'user_id' => $userId,
                        'course_id' => (int) $cId,
                        'status' => 'enrolled',
                        'enrolled_at' => now(),
                    ]);

                    if ($inserted && $studentUser) {
                        $courseObj = Course::with('teacher')->find($cId);
                        if ($courseObj && $courseObj->teacher) {
                            $courseObj->teacher->notify(new StudentEnrolled($courseObj, $studentUser));
                        }

                        if ($courseObj) {
                            $conversation = ChatConversation::firstOrCreate(
                                ['course_id' => $cId],
                                ['title' => $courseObj->title, 'type' => 'course']
                            );

                            if ($courseObj->teacher_id) {
                                ChatConversationMember::firstOrCreate([
                                    'chat_conversation_id' => $conversation->id,
                                    'user_id' => $courseObj->teacher_id,
                                ]);
                            }

                            ChatConversationMember::firstOrCreate([
                                'chat_conversation_id' => $conversation->id,
                                'user_id' => $userId,
                            ]);
                        }
                    }
                }
            });
        }

        return $payment;
    }
}
