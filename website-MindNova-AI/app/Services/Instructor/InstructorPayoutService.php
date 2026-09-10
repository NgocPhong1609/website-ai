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

            $quote = $this->commission->quote($course->partnership_tier ?? 'standard', $item->price);

            $payout = TeacherPayout::firstOrCreate(
                [
                    'order_id' => $order->id,
                    'course_id' => $course->id,
                    'teacher_id' => $course->teacher_id,
                ],
                [
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
                ]
            );

            // Create RevenueAllocation Snapshot per transaction
            $allocation = RevenueAllocation::firstOrCreate(
                [
                    'order_id' => $order->id,
                    'order_item_id' => $item->id,
                    'course_id' => $course->id,
                ],
                [
                    'student_id' => $order->user_id,
                    'instructor_id' => $course->teacher_id,
                    'partnership_tier' => $quote['tier'],
                    'original_price' => $course->price ?? $quote['gross_amount'],
                    'discount_amount' => max(0, ($course->price ?? $quote['gross_amount']) - $quote['gross_amount']),
                    'paid_amount' => $quote['gross_amount'],
                    'platform_fee_percent' => $quote['platform_commission_percent'],
                    'platform_fee_amount' => $quote['platform_amount'],
                    'instructor_percent' => $quote['instructor_percent'],
                    'instructor_amount' => $quote['instructor_amount'],
                    'status' => 'PENDING',
                    'refund_deadline' => now()->addDays(30),
                ]
            );

            // Create InstructorTransaction for Revenue Dashboard with PENDING/HOLD status initially
            if ($payout->wasRecentlyCreated || $allocation->wasRecentlyCreated) {
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
    }
}
