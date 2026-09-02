<?php // Service chính điều phối quá trình thanh toán

namespace App\Services;

use App\Models\Payment;
use App\Models\Order;
use App\Models\User;
use App\Models\Enrollment;
use App\Models\Course;
use App\Models\ChatConversation;
use App\Models\ChatConversationMember;
use App\Notifications\StudentEnrolled;
use App\Services\Instructor\InstructorPayoutService;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

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
            'transaction_id' => $data['transaction_id'] ?? 'ORD-' . strtoupper(Str::random(6)),
        ]));

        $returnUrl = $data['return_url'] ?? url('/payments/' . $payment->id);

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

        // 1. Look up Order in orders table by transaction_id (e.g. ORD-XXXXXX)
        $order = Order::with(['orderItems.course', 'user'])->where('transaction_id', $txnRef)->first();

        // Determine user_id safely
        $userId = null;
        if ($order && $order->user_id) {
            $userId = $order->user_id;
        } elseif (!empty($params['current_user_id']) && User::where('id', $params['current_user_id'])->exists()) {
            $userId = (int) $params['current_user_id'];
        } elseif (auth('sanctum')->check()) {
            $userId = auth('sanctum')->id();
        } elseif (request()->user('sanctum')) {
            $userId = request()->user('sanctum')->id;
        }

        // Fallback if userId is invalid/deleted
        if (!$userId || !User::where('id', $userId)->exists()) {
            $firstUser = User::first();
            $userId = $firstUser ? $firstUser->id : null;
        }

        if (!$userId) {
            return null;
        }

        // Determine amount and course IDs
        $amount = isset($params['vnp_Amount'])
            ? ((float) $params['vnp_Amount']) / 100
            : ($order ? (float) $order->total_amount : 0);

        $courseIds = $order
            ? $order->orderItems->pluck('course_id')->filter()->toArray()
            : (!empty($params['course_id']) ? [(int)$params['course_id']] : []);

        if (!empty($params['course_id']) && !in_array((int)$params['course_id'], $courseIds)) {
            $courseIds[] = (int) $params['course_id'];
        }

        // 2. Find or Create Payment record
        $payment = Payment::where('transaction_id', $txnRef)
            ->orWhere('id', $txnRef)
            ->first();

        if (! $payment) {
            $payment = Payment::create([
                'user_id' => $userId,
                'amount' => $amount,
                'provider' => strtolower($provider),
                'status' => $isSuccess ? 'completed' : 'failed',
                'transaction_id' => $txnRef,
                'description' => $params['vnp_OrderInfo'] ?? ('Thanh toán ' . strtoupper($provider)),
                'metadata' => [
                    'course_ids' => array_values(array_unique($courseIds)),
                    'vnp_TransactionNo' => $params['vnp_TransactionNo'] ?? null,
                ],
            ]);
        } else {
            $meta = is_array($payment->metadata) ? $payment->metadata : json_decode($payment->metadata ?? '[]', true) ?? [];
            $meta['course_ids'] = array_values(array_unique(array_merge($meta['course_ids'] ?? [], $courseIds)));
            if (!empty($params['vnp_TransactionNo'])) {
                $meta['vnp_TransactionNo'] = $params['vnp_TransactionNo'];
            }

            $payment->update([
                'status' => $isSuccess ? 'completed' : 'failed',
                'user_id' => $userId,
                'metadata' => $meta,
            ]);
        }

        // 3. If Payment is successful, complete Order, create Payouts, and Enroll user
        if ($isSuccess) {
            if ($order && $order->status !== 'completed') {
                $order->update(['status' => 'completed']);

                if (class_exists(InstructorPayoutService::class)) {
                    app(InstructorPayoutService::class)->createForOrder($order);
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

                    // Add to chat conversation
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
        }

        return $payment;
    }
}
