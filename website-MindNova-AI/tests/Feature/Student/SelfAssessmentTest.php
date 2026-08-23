<?php

use App\Models\Course;
use App\Models\CourseModule as Module;
use App\Models\Lesson;
use App\Models\User;
use App\Models\Role;
use App\Services\Ai\AiRouterService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->studentRole = Role::firstOrCreate(['name' => 'student']);
    $this->student = User::factory()->create();
    $this->student->roles()->attach($this->studentRole);

    $this->teacherRole = Role::firstOrCreate(['name' => 'teacher']);
    $this->teacher = User::factory()->create();
    $this->teacher->roles()->attach($this->teacherRole);

    $this->course = Course::create([
        'teacher_id' => $this->teacher->id,
        'title' => 'Khóa học Lập trình AI Pro',
        'slug' => 'ai-pro-course',
        'description' => 'Mô tả khóa học lập trình AI',
        'level' => 'intermediate',
        'price' => 0,
        'status' => 'published',
    ]);

    $this->module = Module::create([
        'course_id' => $this->course->id,
        'title' => 'Module 1: Nền tảng AI',
        'order' => 1,
    ]);

    $this->lesson1 = Lesson::create([
        'course_id' => $this->course->id,
        'module_id' => $this->module->id,
        'title' => 'Bài 1: Tổng quan về Deep Learning',
        'content' => 'Nội dung bài học Deep Learning cơ bản và mạng thần kinh nhân tạo.',
        'type' => 'article',
        'order' => 1,
    ]);

    $this->lesson2 = Lesson::create([
        'course_id' => $this->course->id,
        'module_id' => $this->module->id,
        'title' => 'Bài 2: Kiến trúc Transformer',
        'content' => 'Nội dung bài học cơ chế Self-Attention và Transformer Architecture.',
        'type' => 'article',
        'order' => 2,
    ]);
});

test('student can generate AI self-assessment with 10 questions and 0 credits', function () {
    $mockAi = Mockery::mock(AiRouterService::class);
    $mockAi->shouldReceive('sendMessage')
        ->once()
        ->andReturn(json_encode([
            'title' => 'Bài Đánh giá Năng lực: Khóa học Lập trình AI Pro',
            'questions' => array_map(fn($i) => [
                'id' => "q{$i}",
                'content' => "Câu hỏi {$i} về AI?",
                'lesson_title' => "Bài 1: Tổng quan về Deep Learning",
                'options' => [
                    ['id' => 'opt_a', 'content' => 'Phương án A'],
                    ['id' => 'opt_b', 'content' => 'Phương án B'],
                    ['id' => 'opt_c', 'content' => 'Phương án C'],
                    ['id' => 'opt_d', 'content' => 'Phương án D'],
                ],
                'correct_option_id' => 'opt_a',
                'explanation' => 'Giải thích phương án A đúng.',
            ], range(1, 10))
        ]));

    $this->app->instance(AiRouterService::class, $mockAi);

    $response = $this->actingAs($this->student)
        ->postJson("/api/student/courses/{$this->course->id}/self-assessment/generate");

    $response->assertStatus(200)
        ->assertJsonPath('data.total_questions', 10)
        ->assertJsonPath('data.credits', 0);

    expect($response->json('data.questions'))->toHaveCount(10);
});

test('student can submit self-assessment and receive grade with zero credits', function () {
    $secretAnswers = [];
    for ($i = 1; $i <= 10; $i++) {
        $secretAnswers["q{$i}"] = [
            'correct_option_id' => 'opt_a',
            'explanation' => 'Giải thích câu A',
            'lesson_title' => 'Bài 1: Tổng quan',
            'question_content' => "Câu hỏi {$i}?",
        ];
    }

    $secretKey = encrypt([
        'course_id' => $this->course->id,
        'answers' => $secretAnswers,
    ]);

    $submittedAnswers = [];
    for ($i = 1; $i <= 8; $i++) {
        $submittedAnswers["q{$i}"] = 'opt_a'; // 8 correct
    }
    $submittedAnswers["q9"] = 'opt_b';
    $submittedAnswers["q10"] = 'opt_b';

    $response = $this->actingAs($this->student)
        ->postJson('/api/student/self-assessment/submit', [
            'course_id' => $this->course->id,
            'secret_key' => $secretKey,
            'answers' => $submittedAnswers,
            'time_taken_seconds' => 120,
        ]);

    $response->assertStatus(200)
        ->assertJsonPath('data.correct_count', 8)
        ->assertJsonPath('data.score_percentage', 80)
        ->assertJsonPath('data.credits_awarded', 0);
});
