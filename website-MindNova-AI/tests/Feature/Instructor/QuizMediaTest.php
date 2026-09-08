<?php

use App\Models\Quiz;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

beforeEach(function () {
    $teacherRole = Role::firstOrCreate(['name' => 'teacher']);
    $this->teacher = User::factory()->create();
    $this->teacher->roles()->attach($teacherRole);
    $studentRole = Role::firstOrCreate(['name' => 'student']);
    $this->student = User::factory()->create();
    $this->student->roles()->attach($studentRole);

    $this->uploadMedia = function (User $user, string $purpose, string $name = 'image.png') {
        return $this->actingAs($user)->postJson('/api/instructor/quiz-media', [
            'purpose' => $purpose,
            'file' => UploadedFile::fake()->create($name, 20, 'image/png'),
        ])->assertCreated()->json('data');
    };

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

test('teacher can upload quiz media into an owned temporary namespace', function () {
    Storage::fake('r2');

    $response = $this->actingAs($this->teacher)->postJson('/api/instructor/quiz-media', [
        'purpose' => 'question',
        'file' => UploadedFile::fake()->create('question.png', 200, 'image/png'),
    ]);

    $response->assertCreated()
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.mime_type', 'image/png')
        ->assertJsonPath('data.size_bytes', 200 * 1024);

    $key = $response->json('data.r2_key');
    expect($key)->toStartWith("temp/quiz-media/{$this->teacher->id}/")
        ->and($response->json('data.url'))->not->toBeEmpty();
    Storage::disk('r2')->assertExists($key);
});

test('quiz media upload validates size format and purpose', function () {
    Storage::fake('r2');

    $this->actingAs($this->teacher)->postJson('/api/instructor/quiz-media', [
        'purpose' => 'thumbnail',
        'file' => UploadedFile::fake()->create('large.webp', 5121, 'image/webp'),
    ])->assertUnprocessable()->assertJsonValidationErrors(['file']);

    $this->actingAs($this->teacher)->postJson('/api/instructor/quiz-media', [
        'purpose' => 'question',
        'file' => UploadedFile::fake()->create('vector.svg', 10, 'image/svg+xml'),
    ])->assertUnprocessable()->assertJsonValidationErrors(['file']);

    $this->actingAs($this->teacher)->postJson('/api/instructor/quiz-media', [
        'purpose' => 'cover',
        'file' => UploadedFile::fake()->create('image.jpg', 10, 'image/jpeg'),
    ])->assertUnprocessable()->assertJsonValidationErrors(['purpose']);
});

test('quiz media upload requires an authenticated teacher', function () {
    Storage::fake('r2');
    $payload = [
        'purpose' => 'answer',
        'file' => UploadedFile::fake()->create('answer.gif', 10, 'image/gif'),
    ];

    $this->postJson('/api/instructor/quiz-media', $payload)->assertUnauthorized();
    $this->actingAs($this->student)->postJson('/api/instructor/quiz-media', $payload)->assertForbidden();
});

test('store promotes only temporary media owned by the instructor', function () {
    Storage::fake('r2');
    $thumbnail = ($this->uploadMedia)($this->teacher, 'thumbnail');
    $questionImage = ($this->uploadMedia)($this->teacher, 'question');
    $answerImage = ($this->uploadMedia)($this->teacher, 'answer');
    $payload = ($this->mediaPayload)();
    $payload['thumbnail_url'] = $thumbnail['url'];
    $payload['thumbnail_r2_key'] = $thumbnail['r2_key'];
    $payload['questions'][0]['image_url'] = $questionImage['url'];
    $payload['questions'][0]['image_r2_key'] = $questionImage['r2_key'];
    $payload['questions'][0]['answers'][0]['image_url'] = $answerImage['url'];
    $payload['questions'][0]['answers'][0]['image_r2_key'] = $answerImage['r2_key'];

    $response = $this->actingAs($this->teacher)
        ->postJson('/api/instructor/ai-quiz/store', $payload)
        ->assertCreated();

    $quiz = Quiz::findOrFail($response->json('data.id'));
    expect($quiz->thumbnail_r2_key)->toStartWith("quizzes/{$quiz->id}/thumbnail/")
        ->and($quiz->questions()->firstOrFail()->image_r2_key)->toStartWith("quizzes/{$quiz->id}/questions/")
        ->and($quiz->questions()->firstOrFail()->answers()->firstOrFail()->image_r2_key)->toStartWith("quizzes/{$quiz->id}/answers/");
    Storage::disk('r2')->assertMissing($thumbnail['r2_key']);
    Storage::disk('r2')->assertExists($quiz->thumbnail_r2_key);
});

test('store rejects foreign stale and arbitrary managed keys', function () {
    Storage::fake('r2');
    $otherTeacher = User::factory()->create();
    $otherTeacher->roles()->attach(Role::firstWhere('name', 'teacher'));
    $foreign = ($this->uploadMedia)($otherTeacher, 'thumbnail');

    foreach ([$foreign['r2_key'], "temp/quiz-media/{$this->teacher->id}/missing.png", 'arbitrary/image.png'] as $key) {
        $payload = ($this->mediaPayload)();
        $payload['thumbnail_url'] = 'https://cdn.example.test/temp.png';
        $payload['thumbnail_r2_key'] = $key;

        $this->actingAs($this->teacher)
            ->postJson('/api/instructor/ai-quiz/store', $payload)
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['thumbnail_r2_key']);
    }
});

test('replacing and deleting a quiz cleans managed media but never external urls', function () {
    Storage::fake('r2');
    Storage::disk('r2')->put('unrelated/external-marker.png', 'keep');
    $first = ($this->uploadMedia)($this->teacher, 'thumbnail', 'first.png');
    $payload = ($this->mediaPayload)();
    $payload['thumbnail_url'] = $first['url'];
    $payload['thumbnail_r2_key'] = $first['r2_key'];
    $quizId = $this->actingAs($this->teacher)
        ->postJson('/api/instructor/ai-quiz/store', $payload)
        ->assertCreated()
        ->json('data.id');
    $oldKey = Quiz::findOrFail($quizId)->thumbnail_r2_key;

    $replacement = ($this->uploadMedia)($this->teacher, 'thumbnail', 'replacement.png');
    $payload['thumbnail_url'] = $replacement['url'];
    $payload['thumbnail_r2_key'] = $replacement['r2_key'];
    $this->actingAs($this->teacher)
        ->putJson("/api/instructor/ai-quiz/{$quizId}", $payload)
        ->assertOk();
    $newKey = Quiz::findOrFail($quizId)->thumbnail_r2_key;

    Storage::disk('r2')->assertMissing($oldKey);
    Storage::disk('r2')->assertExists($newKey);
    Storage::disk('r2')->assertExists('unrelated/external-marker.png');

    $this->actingAs($this->teacher)
        ->deleteJson("/api/instructor/ai-quiz/{$quizId}")
        ->assertOk();
    Storage::disk('r2')->assertMissing($newKey);
    Storage::disk('r2')->assertExists('unrelated/external-marker.png');
});
