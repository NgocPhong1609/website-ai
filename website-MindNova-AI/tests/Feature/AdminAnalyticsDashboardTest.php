<?php

use App\Models\ActivityLog;
use App\Models\AiUsageLog;
use App\Models\Course;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('admin analytics dashboard returns traffic series and course revenue by period', function () {
    $admin = User::factory()->create([
        'role' => 'admin',
        'email_verified_at' => now(),
    ]);

    $teacher = User::factory()->create([
        'role' => 'teacher',
        'email_verified_at' => now(),
        'name' => 'Giang vien A',
    ]);

    $student = User::factory()->create([
        'role' => 'student',
        'email_verified_at' => now(),
    ]);

    $course = Course::create([
        'teacher_id' => $teacher->id,
        'category_id' => null,
        'title' => 'Laravel nang cao',
        'slug' => 'laravel-nang-cao',
        'description' => 'Noi dung khoa hoc',
        'price' => 120,
        'level' => 'advanced',
        'status' => 'published',
    ]);

    $order = Order::create([
        'user_id' => $student->id,
        'total_amount' => 120,
        'payment_method' => 'stripe',
        'status' => 'completed',
        'transaction_id' => 'txn-analytics-1',
    ]);

    $order->forceFill([
        'created_at' => now()->subDays(2),
        'updated_at' => now()->subDays(2),
    ])->save();

    OrderItem::create([
        'order_id' => $order->id,
        'course_id' => $course->id,
        'price' => 120,
    ]);

    AiUsageLog::create([
        'user_id' => $admin->id,
        'actor_type' => 'admin',
        'actor_key' => 'admin-' . $admin->id,
        'provider' => 'openai',
        'model' => 'gpt-5.4',
        'cost_estimate' => 1.25,
    ]);

    ActivityLog::create([
        'user_id' => $student->id,
        'action' => 'page_view',
        'subject_type' => Course::class,
        'subject_id' => $course->id,
        'metadata' => ['path' => '/courses/' . $course->slug],
    ]);

    ActivityLog::query()->update([
        'created_at' => now()->subDay(),
        'updated_at' => now()->subDay(),
    ]);

    AiUsageLog::query()->update([
        'created_at' => now()->subDay(),
        'updated_at' => now()->subDay(),
    ]);

    $response = $this->actingAs($admin, 'sanctum')->getJson('/api/admin/analytics/dashboard?period=weekly');

    $response->assertOk()
        ->assertJsonPath('period', 'weekly')
        ->assertJsonPath('financial.tuition_revenue', 120)
        ->assertJsonPath('financial.ai_api_cost', 1.25)
        ->assertJsonPath('course_revenue.0.course', 'Laravel nang cao')
        ->assertJsonPath('course_revenue.0.instructor', 'Giang vien A')
        ->assertJsonPath('course_revenue.0.total_orders', 1)
        ->assertJsonPath('course_revenue.0.revenue', 120)
        ->assertJsonCount(7, 'system.traffic');
});