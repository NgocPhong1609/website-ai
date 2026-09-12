<?php

namespace App\Services\Instructor;

use App\Models\Course;
use App\Models\InstructorTransaction;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\RevenueAllocation;
use App\Models\TeacherPayout;
use App\Services\CommissionService;

class InstructorPayoutService
{
    public function __construct(private readonly CommissionService $commission) {}

    public function createForOrder(Order $order): void
    {
        if ($order->status !== 'completed') {
            return;
        }

        $items = OrderItem::where('order_id', $order->id)->get();

        foreach ($items as $item) {
            $course = Course::find($item->course_id);
            if (! $course || ! $course->teacher_id) {
                continue;
            }

            $payout = TeacherPayout::where('order_id', $order->id)
                ->where('course_id', $course->id)
                ->where('teacher_id', $course->teacher_id)
                ->first();
            $payoutExisted = $payout !== null;
            $allocation = RevenueAllocation::where('order_id', $order->id)
                ->where('course_id', $course->id)
                ->where('order_item_id', $item->id)
                ->first()
                ?? RevenueAllocation::where('order_id', $order->id)
                    ->where('course_id', $course->id)
                    ->whereNull('order_item_id')
                    ->first();
            $quote = $allocation !== null
                ? $this->quoteFromAllocation($allocation)
                : ($payout !== null
                    ? $this->quoteFromPayout($payout, $course)
                    : $this->commission->quote($course->partnership_tier ?? 'standard', $item->price));

            if ($payout === null) {
                $payout = TeacherPayout::create([
                    'order_id' => $order->id,
                    'course_id' => $course->id,
                    'teacher_id' => $course->teacher_id,
                    'student_id' => $order->user_id,
                    'gross_amount' => $quote['gross_amount'],
                    'teacher_amount' => $quote['instructor_amount'],
                    'admin_share_amount' => $quote['platform_amount'],
                    'commission_rate' => $quote['platform_commission_percent'],
                    'status' => 'pending',
                    'paid_at' => now(),
                    'metadata' => [
                        'source' => 'order_completion',
                        'partnership_tier' => $quote['tier'],
                        'platform_commission_percent' => $quote['platform_commission_percent'],
                        'instructor_percent' => $quote['instructor_percent'],
                    ],
                ]);
            }

            // Create RevenueAllocation Snapshot per transaction
            if ($allocation === null) {
                $originalPrice = $payoutExisted
                    ? $quote['gross_amount']
                    : ($course->price ?? $quote['gross_amount']);
                $allocation = RevenueAllocation::create([
                    'order_id' => $order->id,
                    'order_item_id' => $item->id,
                    'course_id' => $course->id,
                    'student_id' => $order->user_id,
                    'instructor_id' => $course->teacher_id,
                    'partnership_tier' => $quote['tier'],
                    'original_price' => $originalPrice,
                    'discount_amount' => max(0, $originalPrice - $quote['gross_amount']),
                    'paid_amount' => $quote['gross_amount'],
                    'platform_fee_percent' => $quote['platform_commission_percent'],
                    'platform_fee_amount' => $quote['platform_amount'],
                    'instructor_percent' => $quote['instructor_percent'],
                    'instructor_amount' => $quote['instructor_amount'],
                    'status' => 'PENDING',
                    'refund_deadline' => now()->addDays(30),
                ]);
            }

            // Create InstructorTransaction for Revenue Dashboard with PENDING/HOLD status initially
            InstructorTransaction::firstOrCreate(
                [
                    'reference_type' => 'App\Models\OrderItem',
                    'reference_id' => $item->id,
                    'type' => 'revenue',
                ],
                [
                    'instructor_id' => $course->teacher_id,
                    'amount' => $quote['instructor_amount'],
                    'status' => 'pending', // PENDING/HOLD until refund period expires or progress threshold is crossed
                    'description' => 'Doanh thu từ khóa học: '.$course->title,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }

    private function quoteFromAllocation(RevenueAllocation $allocation): array
    {
        return [
            'tier' => $allocation->partnership_tier,
            'gross_amount' => (float) $allocation->paid_amount,
            'platform_commission_percent' => (float) $allocation->platform_fee_percent,
            'platform_amount' => (float) $allocation->platform_fee_amount,
            'instructor_percent' => (float) $allocation->instructor_percent,
            'instructor_amount' => (float) $allocation->instructor_amount,
        ];
    }

    private function quoteFromPayout(TeacherPayout $payout, Course $course): array
    {
        $metadata = $payout->metadata ?? [];
        $platformPercent = (float) $payout->commission_rate;

        return [
            'tier' => $metadata['partnership_tier'] ?? $course->partnership_tier ?? 'standard',
            'gross_amount' => (float) $payout->gross_amount,
            'platform_commission_percent' => $platformPercent,
            'platform_amount' => (float) $payout->admin_share_amount,
            'instructor_percent' => (float) ($metadata['instructor_percent'] ?? round(100 - $platformPercent, 2)),
            'instructor_amount' => (float) $payout->teacher_amount,
        ];
    }
}
