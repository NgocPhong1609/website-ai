<?php

use App\Models\Course;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\RevenueAllocation;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('overview and sales report return consistent total revenue', function () {
    $teacher = teacher();
    $student = student();

    $course = Course::create([
        'teacher_id' => $teacher->id,
        'title' => 'Test Course',
        'slug' => 'test-course',
        'description' => 'Test Description',
        'price' => 100000,
        'status' => 'published',
    ]);

    $order = Order::create([
        'user_id' => $student->id,
        'total_amount' => 100000,
        'payment_method' => 'vnpay',
        'status' => 'completed',
        'transaction_id' => 'TXN123',
    ]);

    $orderItem = OrderItem::create([
        'order_id' => $order->id,
        'course_id' => $course->id,
        'price' => 100000,
    ]);

    RevenueAllocation::create([
        'instructor_id' => $teacher->id,
        'student_id' => $student->id,
        'order_id' => $order->id,
        'order_item_id' => $orderItem->id,
        'course_id' => $course->id,
        'total_amount' => 100000,
        'instructor_amount' => 70000, // 70% commission
        'platform_amount' => 30000,
        'status' => 'PENDING',
        'created_at' => now(), // within this month / 7 days
    ]);

    // Test Overview API
    $overviewResponse = $this->actingAs($teacher)->getJson('/api/instructor/revenue/overview');
    $overviewResponse->assertStatus(200);
    $overviewRevenue = $overviewResponse->json('data.total_revenue');

    // Test Sales Report API (last 7 days by default, which includes now())
    $salesReportResponse = $this->actingAs($teacher)->getJson('/api/instructor/revenue/sales-report?days=7');
    $salesReportResponse->assertStatus(200);
    $salesReportRevenue = $salesReportResponse->json('data.total_sales');
    $salesReportEnrollments = $salesReportResponse->json('data.total_enrollments');

    expect($overviewRevenue)->toEqual(70000.0);
    expect($salesReportRevenue)->toEqual(70000.0);
    expect($salesReportEnrollments)->toEqual(1);
});
