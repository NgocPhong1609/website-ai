<?php

use App\Models\Category;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('payment success auto grants course access to the student', function () {
    $student = User::factory()->create([
        'role' => 'student',
        'email_verified_at' => now(),
    ]);

    $category = Category::create([
        'name' => 'Lập trình',
        'slug' => 'lap-trinh',
        'status' => 'active',
    ]);

    $course = Course::create([
        'teacher_id' => User::factory()->create(['role' => 'teacher', 'email_verified_at' => now()])->id,
        'category_id' => $category->id,
        'title' => 'Khóa học React thực chiến',
        'slug' => 'khoa-hoc-react-thuc-chien',
        'description' => 'Demo',
        'price' => 299000,
        'level' => 'beginner',
        'status' => 'published',
    ]);

    $payment = Payment::create([
        'user_id' => $student->id,
        'transaction_id' => 'txn-pay-001',
        'amount' => 299000,
        'currency' => 'VND',
        'provider' => 'vnpay',
        'status' => 'pending',
        'payment_method' => 'vnpay',
        'description' => 'Mua khóa học React thực chiến',
        'metadata' => [
            'course_ids' => [$course->id],
        ],
    ]);

    $service = app(\App\Services\PaymentService::class);
    $service->processCallback('vnpay', [
        'vnp_TxnRef' => (string) $payment->id,
        'vnp_ResponseCode' => '00',
        'vnp_TransactionNo' => 'VNP123456',
    ]);

    $this->assertDatabaseHas('enrollments', [
        'user_id' => $student->id,
        'course_id' => $course->id,
        'status' => 'enrolled',
    ]);
    $this->assertTrue(Enrollment::where('user_id', $student->id)->where('course_id', $course->id)->exists());
});
