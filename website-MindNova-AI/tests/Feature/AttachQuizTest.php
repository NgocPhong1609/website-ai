<?php

use App\Models\Course;
use App\Models\CourseModule;
use App\Models\Lesson;
use App\Models\Quiz;
use App\Models\User;
use App\Models\Role;

beforeEach(function () {
    Role::firstOrCreate(['name' => 'teacher'], ['title' => 'Giảng viên']);
    Role::firstOrCreate(['name' => 'admin'], ['title' => 'Quản trị viên']);
    Role::firstOrCreate(['name' => 'student'], ['title' => 'Học viên']);
});

test('instructor can attach quiz to course with all 4 placement positions', function ($position) {
    $teacher = User::create([
        'name' => 'Test Instructor',
        'email' => 'teacher_' . uniqid() . '@example.com',
        'password' => bcrypt('password'),
    ]);
    $teacher->roles()->syncWithoutDetaching(Role::where('name', 'teacher')->pluck('id'));

    $course = Course::create([
        'title' => 'Test Course for Attach',
        'slug' => 'test-course-' . uniqid(),
        'teacher_id' => $teacher->id,
        'description' => 'Test Description',
        'price' => 100000,
        'status' => 'published',
    ]);

    $module = CourseModule::create([
        'course_id' => $course->id,
        'title' => 'Module 1',
        'order' => 1,
    ]);

    $lesson = Lesson::create([
        'course_id' => $course->id,
        'module_id' => $module->id,
        'title' => 'Lesson 1',
        'type' => 'article',
        'order' => 1,
    ]);

    $quiz = Quiz::create([
        'instructor_id' => $teacher->id,
        'title' => 'Test Quiz Title',
        'source_type' => 'course',
        'difficulty' => 'medium',
        'total_questions' => 5,
        'mc_questions_count' => 5,
        'essay_questions_count' => 0,
        'status' => 'draft',
    ]);

    $payload = [
        'course_id' => $course->id,
        'position' => $position,
        'module_id' => $position === 'in_module' ? $module->id : null,
        'after_lesson_id' => $position === 'after_lesson' ? $lesson->id : null,
    ];

    $response = $this->actingAs($teacher)
        ->postJson("/api/instructor/ai-quiz/{$quiz->id}/attach", $payload);

    $response->assertStatus(201)
        ->assertJson([
            'success' => true,
            'message' => 'Quiz attached to course successfully.',
        ]);

    $this->assertDatabaseHas('quiz_course_attachments', [
        'quiz_id' => $quiz->id,
        'course_id' => $course->id,
        'position' => $position,
    ]);
})->with(['capability_assessment', 'end_of_course', 'in_module', 'after_lesson']);
