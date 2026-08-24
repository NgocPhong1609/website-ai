<?php

use App\Models\Category;
use App\Models\Course;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('admin can fetch total revenue and revenue by course', function () {
    $admin = User::factory()->create([
        'role' => 'admin',
        'email_verified_at' => now(),
    ]);

    $teacher = User::factory()->create([
        'role' => 'teacher',
        'email_verified_at' => now(),
    ]);

    $category = Category::create([
        'name' => 'Lập trình',
        'slug' => 'lap-trinh',
        'status' => 'active',
    ]);

    $courseA = Course::create([
        'teacher_id' => $teacher->id,
        'category_id' => $category->id,
        'title' => 'Khóa học React Cơ bản',
        'slug' => 'khoa-hoc-react-co-ban',
        'description' => 'Demo',
        'price' => 250000,
        'level' => 'beginner',
        'status' => 'published',
    ]);

    $courseB = Course::create([
        'teacher_id' => $teacher->id,
        'category_id' => $category->id,
        'title' => 'Khóa học Laravel Nâng cao',
        'slug' => 'khoa-hoc-laravel-nang-cao',
        'description' => 'Demo',
        'price' => 350000,
        'level' => 'intermediate',
        'status' => 'published',
    ]);

    $completedOrder = Order::create([
        'user_id' => $admin->id,
        'total_amount' => 600000,
        'payment_method' => 'vnpay',
        'status' => 'completed',
        'transaction_id' => 'txn-revenue-1',
    ]);

    $pendingOrder = Order::create([
        'user_id' => $admin->id,
        'total_amount' => 200000,
        'payment_method' => 'momo',
        'status' => 'pending',
        'transaction_id' => 'txn-revenue-2',
    ]);

    OrderItem::create([
        'order_id' => $completedOrder->id,
        'course_id' => $courseA->id,
        'price' => 250000,
    ]);

    OrderItem::create([
        'order_id' => $completedOrder->id,
        'course_id' => $courseB->id,
        'price' => 350000,
    ]);

    OrderItem::create([
        'order_id' => $pendingOrder->id,
        'course_id' => $courseA->id,
        'price' => 250000,
    ]);

    $response = $this->actingAs($admin, 'sanctum')->getJson('/api/admin/revenue');

    $response->assertOk()
        ->assertJsonStructure([
            'totalRevenue',
            'courseCount',
            'courses' => [['courseId', 'courseTitle', 'instructorName', 'revenue', 'students', 'conversionRate']],
        ])
        ->assertJsonPath('totalRevenue', 600000)
        ->assertJsonPath('courses.0.courseTitle', 'Khóa học Laravel Nâng cao');
});
