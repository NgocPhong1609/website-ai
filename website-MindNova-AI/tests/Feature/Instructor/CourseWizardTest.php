<?php

use App\Models\Course;
use App\Models\LessonMedia;
use App\Models\User;
use App\Models\Category;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

beforeEach(function () {
    $this->teacher = User::factory()->create();
    $this->teacher->roles()->attach(\App\Models\Role::idFor('teacher'));
    $this->actingAs($this->teacher);
    
    $this->category = Category::create([
        'name' => 'Test Category',
        'slug' => 'test-category',
    ]);
    $this->tempMedia = LessonMedia::create([
        'uploaded_by' => $this->teacher->id,
        'r2_key' => 'img.jpg',
        'original_filename' => 'img.jpg',
        'file_size' => 1024,
        'mime_type' => 'image/jpeg',
        'is_temp' => true,
    ]);

    $this->validPayload = [
        'title' => 'Khóa học Test Wizard',
        'description' => 'Mô tả chi tiết phải dài ít nhất 30 ký tự để validate pass.',
        'level' => 'beginner',
        'category_id' => $this->category->id,
        'thumbnail_media_id' => $this->tempMedia->id,
        'price' => 500000,
        'partnership_tier' => 'standard',
        'modules' => [
            [
                'title' => 'Chương 1',
                'order' => 1,
                'lessons' => [
                    [
                        'title' => 'Bài học 1',
                        'type' => 'video',
                        'order' => 1,
                        'video_url' => 'https://youtube.com/watch?v=123',
                    ],
                    [
                        'title' => 'Bài quiz 1',
                        'type' => 'quiz_module',
                        'order' => 2,
                        'quiz' => [
                            'title' => 'Quiz Chương 1',
                            'passing_score' => 80,
                            'questions' => [
                                [
                                    'type' => 'multiple_choice',
                                    'question' => '1 + 1 = ?',
                                    'points' => 1,
                                    'difficulty' => 'easy',
                                    'answers' => [
                                        ['content' => '2', 'is_correct' => true],
                                        ['content' => '3', 'is_correct' => false],
                                    ],
                                ]
                            ]
                        ]
                    ]
                ]
            ]
        ]
    ];
});

it('creates course with modules lessons quizzes successfully', function () {
    $key = Str::uuid()->toString();

    $response = $this->postJson('/api/instructor/courses/wizard', $this->validPayload, [
        'Idempotency-Key' => $key,
    ]);

    $response->assertStatus(200);
    $courseId = $response->json('data.id');
    
    $this->assertDatabaseHas('courses', [
        'id' => $courseId,
        'title' => 'Khóa học Test Wizard',
        'price' => 500000,
    ]);

    $this->assertDatabaseHas('course_modules', [
        'course_id' => $courseId,
        'title' => 'Chương 1',
    ]);

    $this->assertDatabaseHas('lessons', [
        'title' => 'Bài học 1',
        'type' => 'video',
    ]);

    $this->assertDatabaseHas('quizzes', [
        'title' => 'Quiz Chương 1',
        'passing_score' => 80,
    ]);
});

it('returns 422 if payload is missing required fields', function () {
    $key = Str::uuid()->toString();

    $invalidPayload = $this->validPayload;
    unset($invalidPayload['title']);

    $response = $this->postJson('/api/instructor/courses/wizard', $invalidPayload, [
        'Idempotency-Key' => $key,
    ]);

    $response->assertStatus(422);
    $this->assertDatabaseCount('courses', 0);
});

it('returns 400 if idempotency key is missing', function () {
    $response = $this->postJson('/api/instructor/courses/wizard', $this->validPayload);
    
    $response->assertStatus(400);
});

it('returns existing course if same idempotency key is used', function () {
    $key = Str::uuid()->toString();

    $response1 = $this->postJson('/api/instructor/courses/wizard', $this->validPayload, [
        'Idempotency-Key' => $key,
    ]);
    
    $response1->assertStatus(200);
    $courseId1 = $response1->json('data.id');

    // Call again
    $response2 = $this->postJson('/api/instructor/courses/wizard', $this->validPayload, [
        'Idempotency-Key' => $key,
    ]);
    
    $response2->assertStatus(200);
    $courseId2 = $response2->json('data.id');

    expect($courseId1)->toBe($courseId2);
    $this->assertDatabaseCount('courses', 1);
});

it('rolls back completely if an error occurs mid-transaction', function () {
    // We can mock QuizService to throw an exception
    $mockQuizService = \Mockery::mock(\App\Services\Instructor\QuizService::class);
    $mockQuizService->shouldReceive('createQuiz')->andThrow(new \Exception('Test rollback exception'));
    
    $this->app->instance(\App\Services\Instructor\QuizService::class, $mockQuizService);

    $key = Str::uuid()->toString();

    $response = $this->postJson('/api/instructor/courses/wizard', $this->validPayload, [
        'Idempotency-Key' => $key,
    ]);

    $response->assertStatus(500);
    
    // Nothing should be saved
    $this->assertDatabaseCount('courses', 0);
    $this->assertDatabaseCount('course_modules', 0);
    $this->assertDatabaseCount('lessons', 0);
    $this->assertDatabaseCount('quizzes', 0);
});

it('prevents using another teachers temp media', function () {
    $otherTeacher = User::factory()->create();
    $otherMedia = LessonMedia::create([
        'uploaded_by' => $otherTeacher->id,
        'r2_key' => 'other.jpg',
        'original_filename' => 'other.jpg',
        'file_size' => 1024,
        'mime_type' => 'image/jpeg',
        'is_temp' => true,
    ]);

    $payload = $this->validPayload;
    $payload['thumbnail_media_id'] = $otherMedia->id;

    $key = Str::uuid()->toString();

    $response = $this->postJson('/api/instructor/courses/wizard', $payload, [
        'Idempotency-Key' => $key,
    ]);

    $response->assertStatus(500); // Because it throws Exception from Service
    // No course created
    $this->assertDatabaseCount('courses', 0);
});
