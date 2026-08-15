<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\TeacherPayout;
use App\Models\User;
use App\Services\Instructor\InstructorPayoutService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InstructorPayoutTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_creates_teacher_and_admin_payouts_when_order_is_completed(): void
    {
        $teacher = User::create([
            'name' => 'Teacher One',
            'email' => 'teacher@example.com',
            'password' => bcrypt('password'),
            'role' => 'teacher',
        ]);

        $student = User::create([
            'name' => 'Student One',
            'email' => 'student@example.com',
            'password' => bcrypt('password'),
            'role' => 'student',
        ]);

        $course = Course::create([
            'teacher_id' => $teacher->id,
            'title' => 'Laravel Basics',
            'slug' => 'laravel-basics',
            'description' => 'Test course',
            'price' => 100000,
            'level' => 'beginner',
            'status' => 'published',
        ]);

        $order = Order::create([
            'user_id' => $student->id,
            'total_amount' => 100000,
            'payment_method' => 'vnpay',
            'status' => 'completed',
            'transaction_id' => 'ORD-TEST-1',
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'course_id' => $course->id,
            'price' => $course->price,
        ]);

        $service = new InstructorPayoutService();
        $service->createForOrder($order);

        $this->assertDatabaseCount('teacher_payouts', 1);
        $payout = TeacherPayout::first();

        $this->assertSame($teacher->id, $payout->teacher_id);
        $this->assertSame($course->id, $payout->course_id);
        $this->assertSame(90000.0, (float) $payout->teacher_amount);
        $this->assertSame(10000.0, (float) $payout->admin_share_amount);
        $this->assertSame('completed', $payout->status);
    }
}
