<?php

use App\Models\Course;
use App\Models\CourseModule;
use App\Models\Lesson;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('admin can view course detail for moderation with modules lessons and revenue', function () {
    $admin = User::factory()->create([
        'role' => 'admin',
        'email_verified_at' => now(),
    ]);

    $teacher = User::factory()->create([
        'role' => 'teacher',
        'email_verified_at' => now(),
        'name' => 'MindNova Admin',
    ]);

    $student = User::factory()->create([
        'role' => 'student',
        'email_verified_at' => now(),
    ]);

    $course = Course::create([
        'teacher_id' => $teacher->id,
        'category_id' => null,
        'title' => 'PHP co ban',
        'slug' => 'php-co-ban',
        'description' => 'Khoa hoc nen tang ve PHP',
        'price' => 99,
        'level' => 'beginner',
        'status' => 'draft',
    ]);

    $module = CourseModule::create([
        'course_id' => $course->id,
        'title' => 'Khoi dong',
        'order' => 1,
    ]);

    Lesson::create([
        'course_id' => $course->id,
        'module_id' => $module->id,
        'title' => 'Cai dat moi truong',
        'type' => 'video',
        'content' => 'Huong dan cai dat',
        'duration_seconds' => 900,
        'order' => 1,
        'status' => 'published',
    ]);

    $order = Order::create([
        'user_id' => $student->id,
        'total_amount' => 99,
        'payment_method' => 'vnpay',
        'status' => 'completed',
        'transaction_id' => 'txn-content-1',
    ]);

    OrderItem::create([
        'order_id' => $order->id,
        'course_id' => $course->id,
        'price' => 99,
    ]);

    $response = $this->actingAs($admin, 'sanctum')->getJson("/api/admin/content/courses/{$course->id}");

    $response->assertOk()
        ->assertJsonPath('data.title', 'PHP co ban')
        ->assertJsonPath('data.teacher.name', 'MindNova Admin')
        ->assertJsonPath('data.revenue', 99)
        ->assertJsonPath('data.modules.0.title', 'Khoi dong')
        ->assertJsonPath('data.modules.0.lessons.0.title', 'Cai dat moi truong');
});

test('admin cannot delete a published course that already has order items before archiving it', function () {
    $admin = User::factory()->create([
        'role' => 'admin',
        'email_verified_at' => now(),
    ]);

    $teacher = User::factory()->create([
        'role' => 'teacher',
        'email_verified_at' => now(),
    ]);

    $student = User::factory()->create([
        'role' => 'student',
        'email_verified_at' => now(),
    ]);

    $course = Course::create([
        'teacher_id' => $teacher->id,
        'category_id' => null,
        'title' => 'Khoa hoc da ban',
        'slug' => 'khoa-hoc-da-ban',
        'description' => 'Khong the xoa vi da co don hang',
        'price' => 149,
        'level' => 'intermediate',
        'status' => 'published',
    ]);

    $order = Order::create([
        'user_id' => $student->id,
        'total_amount' => 149,
        'payment_method' => 'vnpay',
        'status' => 'completed',
        'transaction_id' => 'txn-locked-delete-1',
    ]);

    OrderItem::create([
        'order_id' => $order->id,
        'course_id' => $course->id,
        'price' => 149,
    ]);

    $response = $this->actingAs($admin, 'sanctum')->deleteJson("/api/admin/content/courses/{$course->id}");

    $response->assertStatus(422)
        ->assertJsonPath('message', 'Khóa học đã phát sinh đơn hàng nên chưa thể xóa. Hãy chuyển sang trạng thái Gỡ bỏ trước, sau đó xóa khỏi danh sách quản trị.');

    expect(Course::query()->whereKey($course->id)->exists())->toBeTrue();
});

test('admin can hide an archived course with order items from the moderation list', function () {
    $admin = User::factory()->create([
        'role' => 'admin',
        'email_verified_at' => now(),
    ]);

    $teacher = User::factory()->create([
        'role' => 'teacher',
        'email_verified_at' => now(),
    ]);

    $student = User::factory()->create([
        'role' => 'student',
        'email_verified_at' => now(),
    ]);

    $course = Course::create([
        'teacher_id' => $teacher->id,
        'category_id' => null,
        'title' => 'Khoa hoc da go bo',
        'slug' => 'khoa-hoc-da-go-bo',
        'description' => 'Van giu lich su don hang',
        'price' => 199,
        'level' => 'advanced',
        'status' => 'archived',
    ]);

    $order = Order::create([
        'user_id' => $student->id,
        'total_amount' => 199,
        'payment_method' => 'vnpay',
        'status' => 'completed',
        'transaction_id' => 'txn-hidden-course-1',
    ]);

    OrderItem::create([
        'order_id' => $order->id,
        'course_id' => $course->id,
        'price' => 199,
    ]);

    $response = $this->actingAs($admin, 'sanctum')->deleteJson("/api/admin/content/courses/{$course->id}");

    $response->assertOk()
        ->assertJsonPath('message', 'Khóa học đã được xóa khỏi danh sách quản trị.');

    expect(Course::query()->whereKey($course->id)->exists())->toBeTrue();
    expect(Course::query()->find($course->id)?->admin_hidden_at)->not->toBeNull();

    $listResponse = $this->actingAs($admin, 'sanctum')->getJson('/api/admin/content/courses');
    $listResponse->assertOk();
    expect(collect($listResponse->json('data'))->pluck('id'))->not->toContain($course->id);

    $hiddenListResponse = $this->actingAs($admin, 'sanctum')->getJson('/api/admin/content/courses?visibility=hidden');
    $hiddenListResponse->assertOk();
    expect(collect($hiddenListResponse->json('data'))->pluck('id'))->toContain($course->id);
});

test('admin can restore a course hidden from admin list', function () {
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
        'title' => 'Khoa hoc an khoi admin',
        'slug' => 'khoa-hoc-an-khoi-admin',
        'description' => 'Da an khoi danh sach admin',
        'price' => 59,
        'level' => 'beginner',
        'status' => 'archived',
        'admin_hidden_at' => now(),
    ]);

    $response = $this->actingAs($admin, 'sanctum')->patchJson("/api/admin/content/courses/{$course->id}/restore-admin");

    $response->assertOk()
        ->assertJsonPath('message', 'Khóa học đã được khôi phục vào danh sách quản trị.');

    expect(Course::query()->find($course->id)?->admin_hidden_at)->toBeNull();

    $visibleListResponse = $this->actingAs($admin, 'sanctum')->getJson('/api/admin/content/courses');
    $visibleListResponse->assertOk();
    expect(collect($visibleListResponse->json('data'))->pluck('id'))->toContain($course->id);
});

test('admin can permanently delete a course with no order items', function () {
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
        'title' => 'Khoa hoc co the xoa',
        'slug' => 'khoa-hoc-co-the-xoa',
        'description' => 'Chua co don hang',
        'price' => 0,
        'level' => 'beginner',
        'status' => 'draft',
    ]);

    $response = $this->actingAs($admin, 'sanctum')->deleteJson("/api/admin/content/courses/{$course->id}");

    $response->assertOk()
        ->assertJsonPath('message', 'Da go bo khoa hoc.');

    expect(Course::query()->whereKey($course->id)->exists())->toBeFalse();
});