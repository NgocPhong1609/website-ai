<?php

use App\Models\Quiz;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $teacherRole = Role::firstOrCreate(['name' => 'teacher']);
    $this->teacher = User::factory()->create();
    $this->teacher->roles()->attach($teacherRole);

    $this->mediaPayload = fn () => [
        'title' => 'Quiz with media',
        'thumbnail_url' => 'https://cdn.example.test/quiz.webp',
        'questions' => [[
            'type' => 'multiple_choice',
            'selection_type' => 'single_choice',
            'content' => 'Question with image',
            'image_url' => 'http://cdn.example.test/question.png',
            'points' => 10,
            'answers' => [
                [
                    'content' => 'Correct',
                    'is_correct' => true,
                    'image_url' => 'https://cdn.example.test/answer.jpg',
                ],
                ['content' => 'Wrong', 'is_correct' => false],
            ],
        ]],
    ];
});

test('persists and reloads external quiz question and answer media', function () {
    $response = $this->actingAs($this->teacher)
        ->postJson('/api/instructor/ai-quiz/store', ($this->mediaPayload)());

    $response->assertCreated()
        ->assertJsonPath('data.thumbnail_url', 'https://cdn.example.test/quiz.webp')
        ->assertJsonPath('data.questions.0.image_url', 'http://cdn.example.test/question.png')
        ->assertJsonPath('data.questions.0.answers.0.image_url', 'https://cdn.example.test/answer.jpg');

    $quiz = Quiz::where('title', 'Quiz with media')->firstOrFail();
    expect($quiz->thumbnail_url)->toBe('https://cdn.example.test/quiz.webp')
        ->and($quiz->questions()->firstOrFail()->image_url)->toBe('http://cdn.example.test/question.png')
        ->and($quiz->questions()->firstOrFail()->answers()->firstOrFail()->image_url)
        ->toBe('https://cdn.example.test/answer.jpg');
});

test('persists media changes when updating a quiz', function () {
    $quizId = $this->actingAs($this->teacher)
        ->postJson('/api/instructor/ai-quiz/store', ($this->mediaPayload)())
        ->json('data.id');
    $payload = ($this->mediaPayload)();
    $payload['thumbnail_url'] = 'https://cdn.example.test/replaced.png';
    $payload['questions'][0]['image_url'] = null;

    $this->actingAs($this->teacher)
        ->putJson("/api/instructor/ai-quiz/{$quizId}", $payload)
        ->assertOk()
        ->assertJsonPath('data.thumbnail_url', 'https://cdn.example.test/replaced.png')
        ->assertJsonPath('data.questions.0.image_url', null);
});

test('persists old quiz payload without media fields', function () {
    $payload = ($this->mediaPayload)();
    unset($payload['thumbnail_url'], $payload['questions'][0]['image_url'], $payload['questions'][0]['answers'][0]['image_url']);

    $this->actingAs($this->teacher)
        ->postJson('/api/instructor/ai-quiz/store', $payload)
        ->assertCreated()
        ->assertJsonPath('data.thumbnail_url', null);
});

test('rejects non http media urls', function () {
    $payload = ($this->mediaPayload)();
    $payload['thumbnail_url'] = 'javascript:alert(1)';
    $payload['questions'][0]['image_url'] = 'ftp://example.test/question.png';

    $this->actingAs($this->teacher)
        ->postJson('/api/instructor/ai-quiz/store', $payload)
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['thumbnail_url', 'questions.0.image_url']);
});
