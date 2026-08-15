<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\InstructorTransaction;
use App\Models\ActivityLog;
use App\Models\User;
use App\Models\Course;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Enrollment;
use Carbon\Carbon;

class GenerateRevenueData3 extends Command
{
    protected $signature = 'demo:revenue3';
    protected $description = 'Generate complete revenue data for admin';

    public function handle()
    {
        $this->info("Clearing old transactions and orders...");
        \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        InstructorTransaction::truncate();
        ActivityLog::truncate();
        OrderItem::truncate();
        Order::truncate();
        Enrollment::truncate();
        \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $instructor = User::find(1);
        if (!$instructor) {
            $this->error("Instructor 1 not found.");
            return;
        }

        $students = User::where('role', 'user')->get();
        if ($students->isEmpty()) {
            $this->error("No students found.");
            return;
        }

        // Make sure all courses belong to this instructor for the demo to look nice
        Course::query()->update(['teacher_id' => $instructor->id]);
        $courses = Course::where('teacher_id', $instructor->id)->get();

        if ($courses->isEmpty()) {
            $this->error("No courses found.");
            return;
        }

        $startDate = Carbon::create(2026, 7, 21);
        $endDate = Carbon::create(2026, 8, 28);

        $this->info("Generating correct data from " . $startDate->format('Y-m-d') . " to " . $endDate->format('Y-m-d') . "...");

        $currentDate = $startDate->copy();

        while ($currentDate->lte($endDate)) {
            // Generate Revenue
            $salesCount = rand(2, 6);
            for ($i = 0; $i < $salesCount; $i++) {
                $student = $students->random();
                $course = $courses->random();
                $amount = $course->price > 0 ? $course->price : rand(5, 50) * 10000;
                
                $orderDate = $currentDate->copy()->addHours(rand(8, 22))->addMinutes(rand(0, 59));

                $order = Order::create([
                    'user_id' => $student->id,
                    'total_amount' => $amount,
                    'status' => 'completed',
                    'payment_method' => rand(0, 1) ? 'momo' : 'vnpay',
                    'created_at' => $orderDate,
                    'updated_at' => $orderDate,
                ]);

                $orderItem = OrderItem::create([
                    'order_id' => $order->id,
                    'course_id' => $course->id,
                    'price' => $amount,
                    'created_at' => $orderDate,
                    'updated_at' => $orderDate,
                ]);

                Enrollment::create([
                    'user_id' => $student->id,
                    'course_id' => $course->id,
                    'progress_percentage' => rand(0, 100),
                    'status' => 'enrolled',
                    'enrolled_at' => $orderDate,
                    'created_at' => $orderDate,
                    'updated_at' => $orderDate,
                ]);
                
                $instructorAmount = $amount * 0.7; // 70% share

                InstructorTransaction::create([
                    'instructor_id' => $instructor->id,
                    'type' => 'revenue',
                    'amount' => $instructorAmount,
                    'status' => 'available',
                    'reference_type' => 'App\Models\OrderItem',
                    'reference_id' => $orderItem->id,
                    'created_at' => $orderDate,
                    'updated_at' => $orderDate,
                ]);
            }

            // Occasional refund (10% chance per day)
            if (rand(1, 100) <= 10) {
                $student = $students->random();
                $course = $courses->random();
                $amount = $course->price > 0 ? $course->price : rand(5, 50) * 10000;
                $refundAmount = $amount * 0.7;
                $refundDate = $currentDate->copy()->addHours(rand(8, 22))->addMinutes(rand(0, 59));

                // We need an order item to link to
                $order = Order::create([
                    'user_id' => $student->id,
                    'total_amount' => $amount,
                    'status' => 'refunded',
                    'payment_method' => 'momo',
                    'created_at' => $refundDate->copy()->subDays(2),
                    'updated_at' => $refundDate,
                ]);

                $orderItem = OrderItem::create([
                    'order_id' => $order->id,
                    'course_id' => $course->id,
                    'price' => $amount,
                    'created_at' => $refundDate->copy()->subDays(2),
                    'updated_at' => $refundDate,
                ]);

                InstructorTransaction::create([
                    'instructor_id' => $instructor->id,
                    'type' => 'refund',
                    'amount' => $refundAmount,
                    'status' => 'completed',
                    'reference_type' => 'App\Models\OrderItem',
                    'reference_id' => $orderItem->id,
                    'created_at' => $refundDate,
                    'updated_at' => $refundDate,
                ]);
            }

            // Generate Engagement (Activity Logs)
            $interactionsCount = rand(10, 30);
            for ($j = 0; $j < $interactionsCount; $j++) {
                $student = $students->random();
                ActivityLog::create([
                    'user_id' => $student->id,
                    'action' => 'course_engagement',
                    'subject_type' => 'App\Models\Course',
                    'subject_id' => $courses->random()->id,
                    'metadata' => json_encode(['description' => 'Student watched a video']),
                    'created_at' => $currentDate->copy()->addHours(rand(7, 23))->addMinutes(rand(0, 59)),
                    'updated_at' => $currentDate->copy()->addHours(rand(7, 23))->addMinutes(rand(0, 59)),
                ]);
            }
            
            // Add some views to the courses
            $course = $courses->random();
            $course->views_count = $course->views_count + rand(10, 50);
            $course->save();

            $currentDate->addDay();
        }

        $this->info("Fake revenue and engagement data generated successfully!");
    }
}
