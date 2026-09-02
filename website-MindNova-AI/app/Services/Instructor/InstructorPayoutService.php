<?php

namespace App\Services\Instructor;

use App\Models\Course;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\TeacherPayout;
use App\Models\RevenueAllocation;
use App\Models\InstructorTransaction;
use Illuminate\Support\Facades\DB;

class InstructorPayoutService
{
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

            $grossAmount = (float) $item->price;
            $commissionRate = ($course->partnership_tier === 'exclusive') ? 0.15 : 0.30;
            $adminShareAmount = round($grossAmount * $commissionRate, 2);
            $teacherAmount = round($grossAmount - $adminShareAmount, 2);

            $payout = TeacherPayout::firstOrCreate(
                [
                    'order_id' => $order->id,
                    'course_id' => $course->id,
                    'teacher_id' => $course->teacher_id,
                ],
                [
                    'student_id' => $order->user_id,
                    'gross_amount' => $grossAmount,
                    'teacher_amount' => $teacherAmount,
                    'admin_share_amount' => $adminShareAmount,
                    'commission_rate' => $commissionRate * 100,
                    'status' => 'pending',
                    'paid_at' => now(),
                    'metadata' => [
                        'source' => 'order_completion',
                        'partnership_tier' => $course->partnership_tier ?? 'standard',
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
                    'original_price' => $course->price ?? $grossAmount,
                    'discount_amount' => max(0, ($course->price ?? $grossAmount) - $grossAmount),
                    'paid_amount' => $grossAmount,
                    'platform_fee_percent' => $commissionRate * 100,
                    'platform_fee_amount' => $adminShareAmount,
                    'instructor_percent' => (1 - $commissionRate) * 100,
                    'instructor_amount' => $teacherAmount,
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
                        'amount' => $teacherAmount,
                        'status' => 'pending', // PENDING/HOLD until refund period expires or progress threshold is crossed
                        'description' => 'Doanh thu từ khóa học: ' . $course->title,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );
            }
        }
    }
}
