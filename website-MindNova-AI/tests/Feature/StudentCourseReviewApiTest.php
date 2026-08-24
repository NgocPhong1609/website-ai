<?php

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Review;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('student can list course reviews with average rating', function () {
    $teacher = User::factory()->create(['role' => 'teacher', 'email_verified_at' => now()]);
    $student = User::factory()->create(['role' => 'student', 'email_verified_at' => now()]);

    $course = Course::create([
        'teacher_id' => $teacher->id,
        'category_id' => null,
        'title' => 'AI Sample Course',
        'slug' => 'ai-sample-course-reviews',
        'description' => 'Course for reviews',
        'price' => 0,
        'level' => 'beginner',
        'status' => 'published',
        'published_version_id' => 1,
    ]);

    Review::create([
        'course_id' => $course->id,
        'user_id' => $student->id,
        'rating' => 5,
        'comment' => 'Khóa học rất hay',
    ]);

    Review::create([
        'course_id' => $course->id,
        'user_id' => User::factory()->create(['role' => 'student', 'email_verified_at' => now()])->id,
        'rating' => 4,
        'comment' => 'Nội dung rõ ràng',
    ]);

    $response = $this->getJson("/api/student/courses/{$course->id}/reviews");

    $response->assertOk()
        ->assertJsonPath('data.count', 2)
        ->assertJsonPath('data.average_rating', 4.5)
        ->assertJsonPath('data.reviews.0.comment', 'Khóa học rất hay');
});

test('student can submit a course review after enrollment', function () {
    $teacher = User::factory()->create(['role' => 'teacher', 'email_verified_at' => now()]);
    $student = User::factory()->create(['role' => 'student', 'email_verified_at' => now()]);

    $course = Course::create([
        'teacher_id' => $teacher->id,
        'category_id' => null,
        'title' => 'AI Sample Course 2',
        'slug' => 'ai-sample-course-reviews-2',
        'description' => 'Course for review submit',
        'price' => 0,
        'level' => 'beginner',
        'status' => 'published',
        'published_version_id' => 1,
    ]);

    Enrollment::create([
        'user_id' => $student->id,
        'course_id' => $course->id,
        'status' => 'active',
        'enrolled_at' => now(),
    ]);

    $response = $this->actingAs($student, 'sanctum')->postJson("/api/student/courses/{$course->id}/reviews", [
        'rating' => 5,
        'comment' => 'Bài giảng rất dễ hiểu',
    ]);

    $response->assertCreated()
        ->assertJsonPath('data.comment', 'Bài giảng rất dễ hiểu')
        ->assertJsonPath('data.rating', 5);
});
