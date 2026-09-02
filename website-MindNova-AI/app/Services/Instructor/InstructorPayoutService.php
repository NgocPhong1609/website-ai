<?php

namespace App\Services\Instructor;

use App\Models\Course;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\TeacherPayout;
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
                    'status' => 'completed',
                    'paid_at' => now(),
                    'metadata' => [
                        'source' => 'order_completion',
                        'partnership_tier' => $course->partnership_tier ?? 'standard',
                    ],
                ]
            );

            // Create InstructorTransaction for Revenue Dashboard
            if ($payout->wasRecentlyCreated) {
                \App\Models\InstructorTransaction::create([
                    'instructor_id' => $course->teacher_id,
                    'type' => 'revenue',
                    'amount' => $teacherAmount,
                    'status' => 'available',
                    'reference_type' => 'App\Models\OrderItem',
                    'reference_id' => $item->id,
                    'description' => 'Doanh thu từ khóa học: ' . $course->title,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
