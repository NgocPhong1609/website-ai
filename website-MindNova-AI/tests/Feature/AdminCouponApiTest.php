<?php

use App\Models\Course;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('admin can fetch discount coupons through the api', function () {
    $admin = User::factory()->create([
        'role' => 'admin',
        'email_verified_at' => now(),
    ]);

    $response = $this->actingAs($admin, 'sanctum')->getJson('/api/admin/coupons');

    $response->assertOk()
        ->assertJsonStructure([
            'data' => [],
        ]);
});

test('admin can create coupons for all orders and for a specific course', function () {
    $admin = User::factory()->create([
        'role' => 'admin',
        'email_verified_at' => now(),
    ]);

    $teacher = User::factory()->create([
        'role' => 'teacher',
        'email_verified_at' => now(),
    ]);

    $course = Course::create([
        'teacher_id' => $teacher->id,
        'category_id' => null,
        'title' => 'React cho người mới',
        'slug' => 'react-cho-nguoi-moi',
        'description' => 'Khóa học React cơ bản',
        'price' => 199000,
        'level' => 'beginner',
        'status' => 'draft',
    ]);

    $globalResponse = $this->actingAs($admin, 'sanctum')->postJson('/api/admin/coupons', [
        'code' => 'GLOBAL10',
        'title' => 'Giảm giá toàn đơn',
        'description' => 'Áp dụng cho tất cả đơn hàng',
        'discount_type' => 'percent',
        'value' => 10,
        'min_order_amount' => 0,
        'max_discount_amount' => 200000,
        'course_id' => null,
        'is_active' => true,
    ]);

    $globalResponse->assertCreated()
        ->assertJsonPath('data.course_id', null);

    $courseResponse = $this->actingAs($admin, 'sanctum')->postJson('/api/admin/coupons', [
        'code' => 'COURSE20',
        'title' => 'Giảm giá khóa học',
        'description' => 'Áp dụng cho khóa học cụ thể',
        'discount_type' => 'percent',
        'value' => 20,
        'min_order_amount' => 0,
        'max_discount_amount' => 500000,
        'course_id' => $course->id,
        'is_active' => true,
    ]);

    $courseResponse->assertCreated()
        ->assertJsonPath('data.course_id', $course->id);
});
