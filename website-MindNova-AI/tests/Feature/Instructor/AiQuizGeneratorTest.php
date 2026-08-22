<?php

use App\Models\Course;
use App\Models\Quiz;
use App\Models\Role;
use App\Models\User;
use App\Services\Ai\AiRouterService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->teacherRole = Role::firstOrCreate(['name' => 'teacher']);
    $this->studentRole = Role::firstOrCreate(['name' => 'student']);

    $this->teacher = User::factory()->create();
    $this->teacher->roles()->attach($this->teacherRole);

    $this->otherTeacher = User::factory()->create();
    $this->otherTeacher->roles()->attach($this->teacherRole);

    $this->student = User::factory()->create();
    $this->student->roles()->attach($this->studentRole);
});

test('unauthenticated user cannot access ai quiz generator endpoints', function () {
    $this->postJson('/api/instructor/ai-quiz/generate', [
        'source_type' => 'topic',
        'topic' => 'JavaScript',
        'difficulty' => 'easy',
        'total_questions' => 10,
        'multiple_choice_count' => 8,
        'essay_count' => 2,
    ])->assertStatus(401);
});

test('student cannot access ai quiz generator endpoints', function () {
    $this->actingAs($this->student)
        ->postJson('/api/instructor/ai-quiz/generate', [
            'source_type' => 'topic',
            'topic' => 'JavaScript',
            'difficulty' => 'easy',
            'total_questions' => 10,
            'multiple_choice_count' => 8,
            'essay_count' => 2,
        ])->assertStatus(403);
});

test('validation fails if mc_count plus essay_count does not equal total_questions', function () {
    $this->actingAs($this->teacher)
        ->postJson('/api/instructor/ai-quiz/generate', [
            'source_type' => 'topic',
            'topic' => 'Hệ nhị phân',
            'difficulty' => 'easy',
            'total_questions' => 10,
            'multiple_choice_count' => 5,
            'essay_count' => 3, // 5 + 3 = 8 != 10
        ])->assertStatus(422)
        ->assertJsonValidationErrors(['total_questions']);
});

test('instructor can generate ai quiz with mock ai provider', function () {
    $mockAiRouter = Mockery::mock(AiRouterService::class);
    $mockAiRouter->shouldReceive('sendMessageWithFallback')
        ->once()
        ->andReturn([
            'content' => json_encode([
                'title' => 'Kiểm tra Hệ nhị phân',
                'description' => 'Mô tả bài kiểm tra',
                'questions' => [
                    [
                        'id' => 'q1',
                        'type' => 'multiple_choice',
                        'difficulty' => 'easy',
                        'question' => '1010 trong hệ 10 là bao nhiêu?',
                        'options' => ['8', '10', '12', '14'],
                        'correct_answer_index' => 1,
                        'explanation' => '1010 = 10',
                        'points' => 1
                    ],
                    [
                        'id' => 'q2',
                        'type' => 'essay',
                        'difficulty' => 'medium',
                        'question' => 'Trình bày khái niệm Bù 2?',
                        'sample_answer' => 'Đáp án mẫu bù 2',
                        'rubric' => '1. Định nghĩa (2đ). 2. Ví dụ (3đ)',
                        'points' => 5
                    ]
                ]
            ]),
            'meta' => ['provider' => 'mock', 'fallbackUsed' => false]
        ]);

    $this->app->instance(AiRouterService::class, $mockAiRouter);

    $response = $this->actingAs($this->teacher)
        ->postJson('/api/instructor/ai-quiz/generate', [
            'source_type' => 'topic',
            'topic' => 'Hệ nhị phân',
            'difficulty' => 'mixed',
            'total_questions' => 2,
            'multiple_choice_count' => 1,
            'essay_count' => 1,
        ]);

    $response->assertStatus(200)
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.total_questions', 2)
        ->assertJsonPath('data.mc_questions_count', 1)
        ->assertJsonPath('data.essay_questions_count', 1);

    $this->assertDatabaseHas('ai_generation_logs', [
        'instructor_id' => $this->teacher->id,
        'status' => 'success'
    ]);
});

test('instructor can store standalone quiz with mcq and essay questions', function () {
    $payload = [
        'title' => 'Đề kiểm tra hệ nhị phân chính thức',
        'description' => 'Mô tả đề thi',
        'source_type' => 'topic',
        'difficulty' => 'mixed',
        'time_limit_minutes' => 30,
        'passing_score' => 70,
        'status' => 'published',
        'questions' => [
            [
                'type' => 'multiple_choice',
                'content' => 'Câu 1: 1010 là gì?',
                'explanation' => 'Giải thích 1',
                'points' => 1,
                'answers' => [
                    ['content' => '8', 'is_correct' => false],
                    ['content' => '10', 'is_correct' => true],
                    ['content' => '12', 'is_correct' => false],
                    ['content' => '14', 'is_correct' => false],
                ]
            ],
            [
                'type' => 'essay',
                'content' => 'Câu 2: Phân biệt bù 1 và bù 2?',
                'sample_answer' => 'Đáp án tham khảo mẫu',
                'rubric' => 'Thang điểm chi tiết',
                'points' => 5,
            ]
        ]
    ];

    $response = $this->actingAs($this->teacher)
        ->postJson('/api/instructor/ai-quiz/store', $payload);

    $response->assertStatus(201)
        ->assertJsonPath('success', true);

    $this->assertDatabaseHas('quizzes', [
        'instructor_id' => $this->teacher->id,
        'title' => 'Đề kiểm tra hệ nhị phân chính thức',
        'mc_questions_count' => 1,
        'essay_questions_count' => 1,
        'total_points' => 6.0
    ]);
});

test('instructor cannot attach quiz owned by another teacher', function () {
    $quiz = Quiz::create([
        'instructor_id' => $this->otherTeacher->id,
        'title' => 'Đề của giáo viên khác',
        'total_questions' => 1,
        'status' => 'published'
    ]);

    $course = Course::create([
        'teacher_id' => $this->teacher->id,
        'title' => 'Khóa học React Native',
        'slug' => 'khoa-hoc-react-native',
        'description' => 'Mô tả khóa học React Native',
        'price' => 100
    ]);

    $this->actingAs($this->teacher)
        ->postJson("/api/instructor/ai-quiz/{$quiz->id}/attach", [
            'course_id' => $course->id,
            'position' => 'end_of_course'
        ])->assertStatus(403);
});

test('instructor cannot generate quiz using a course owned by another teacher', function () {
    $otherCourse = Course::create([
        'teacher_id' => $this->otherTeacher->id,
        'title' => 'Khóa học của người khác',
        'slug' => 'khoa-hoc-nguoi-khac',
        'description' => 'Mô tả khóa học của giáo viên khác',
        'price' => 200
    ]);

    $this->actingAs($this->teacher)
        ->postJson('/api/instructor/ai-quiz/generate', [
            'source_type' => 'course',
            'course_id' => $otherCourse->id,
            'difficulty' => 'easy',
            'total_questions' => 2,
            'multiple_choice_count' => 2,
            'essay_count' => 0,
        ])->assertStatus(422)
        ->assertJsonValidationErrors(['course_id']);
});

test('instructor can generate quiz from owned course with lessons', function () {
    $course = Course::create([
        'teacher_id' => $this->teacher->id,
        'title' => 'Toán hệ nhị phân',
        'slug' => 'toan-he-nhi-phan',
        'description' => 'Mô tả khóa học hệ nhị phân',
        'price' => 150
    ]);

    $module = $course->modules()->create([
        'title' => 'Module 1: Nhập môn',
        'order' => 1,
    ]);

    $module->lessons()->create([
        'course_id' => $course->id,
        'title' => 'Bài 1: Khái niệm hệ nhị phân',
        'content' => 'Hệ nhị phân chỉ bao gồm hai ký tự 0 và 1.',
        'order' => 1,
    ]);

    $mockAiRouter = Mockery::mock(AiRouterService::class);
    $mockAiRouter->shouldReceive('sendMessageWithFallback')
        ->once()
        ->andReturn([
            'content' => json_encode([
                'title' => 'Đề kiểm tra: Toán hệ nhị phân',
                'description' => 'Mô tả đề kiểm tra',
                'questions' => [
                    [
                        'id' => 'q1',
                        'type' => 'multiple_choice',
                        'difficulty' => 'easy',
                        'question' => 'Hệ nhị phân dùng bao nhiêu ký hiệu?',
                        'options' => ['2', '8', '10', '16'],
                        'correct_answer_index' => 0,
                        'explanation' => 'Dùng 2 ký hiệu 0 và 1',
                        'points' => 1
                    ],
                    [
                        'id' => 'q2',
                        'type' => 'essay',
                        'difficulty' => 'medium',
                        'question' => 'Giải thích khái niệm hệ nhị phân?',
                        'sample_answer' => 'Hệ thống đếm cơ số 2',
                        'rubric' => 'Thang điểm chi tiết',
                        'points' => 5
                    ]
                ]
            ]),
            'meta' => ['provider' => 'mock', 'fallbackUsed' => false]
        ]);

    $this->app->instance(AiRouterService::class, $mockAiRouter);

    $response = $this->actingAs($this->teacher)
        ->postJson('/api/instructor/ai-quiz/generate', [
            'source_type' => 'course',
            'course_id' => $course->id,
            'difficulty' => 'mixed',
            'total_questions' => 2,
            'multiple_choice_count' => 1,
            'essay_count' => 1,
        ]);

    $response->assertStatus(200)
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.course_id', $course->id)
        ->assertJsonPath('data.course_title', 'Toán hệ nhị phân');
});
