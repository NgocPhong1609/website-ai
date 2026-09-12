<?php

use App\Models\Quiz;
use App\Models\Role;
use App\Models\User;
use App\Services\Instructor\QuizMediaService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

beforeEach(function () {
    config([
        'filesystems.disks.r2.key' => 'test-key',
        'filesystems.disks.r2.secret' => 'test-secret',
        'filesystems.disks.r2.bucket' => 'test-bucket',
        'filesystems.disks.r2.endpoint' => 'https://example.test',
    ]);
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

test('quiz media upload falls back to public storage when r2 is not configured', function () {
    config([
        'filesystems.disks.r2.key' => null,
        'filesystems.disks.r2.secret' => null,
        'filesystems.disks.r2.bucket' => null,
        'filesystems.disks.r2.endpoint' => null,
    ]);
    Storage::fake('public');

    $response = $this->actingAs($this->teacher)->postJson('/api/instructor/quiz-media', [
        'purpose' => 'thumbnail',
        'file' => UploadedFile::fake()->create('cover.png', 200, 'image/png'),
    ]);

    $response->assertCreated()
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.storage_disk', 'public');

    $temporaryKey = $response->json('data.r2_key');
    expect($temporaryKey)->toStartWith('public:temp/quiz-media/');
    Storage::disk('public')->assertExists(substr($temporaryKey, strlen('public:')));

    $payload = ($this->mediaPayload)();
    $payload['thumbnail_url'] = $response->json('data.url');
    $payload['thumbnail_r2_key'] = $temporaryKey;

    $stored = $this->actingAs($this->teacher)
        ->postJson('/api/instructor/ai-quiz/store', $payload)
        ->assertCreated();

    $permanentKey = $stored->json('data.thumbnail_r2_key');
    expect($permanentKey)->toStartWith('public:quizzes/');
    Storage::disk('public')->assertMissing(substr($temporaryKey, strlen('public:')));
    Storage::disk('public')->assertExists(substr($permanentKey, strlen('public:')));
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

test('quiz media upload returns a clear error when storage fails', function () {
    $service = Mockery::mock(QuizMediaService::class);
    $service->shouldReceive('uploadTemporary')
        ->once()
        ->andThrow(new RuntimeException('storage offline'));
    app()->instance(QuizMediaService::class, $service);

    $this->actingAs($this->teacher)->postJson('/api/instructor/quiz-media', [
        'purpose' => 'question',
        'file' => UploadedFile::fake()->create('question.png', 20, 'image/png'),
    ])->assertStatus(500)
        ->assertJsonPath('success', false)
        ->assertJsonPath('message', 'Không thể tải ảnh lên. Vui lòng thử lại.');
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

test('existing r2 media remains editable when r2 is temporarily unavailable', function () {
    Storage::fake('r2');
    $thumbnail = ($this->uploadMedia)($this->teacher, 'thumbnail');
    $payload = ($this->mediaPayload)();
    $payload['thumbnail_url'] = $thumbnail['url'];
    $payload['thumbnail_r2_key'] = $thumbnail['r2_key'];
    $quizId = $this->actingAs($this->teacher)
        ->postJson('/api/instructor/ai-quiz/store', $payload)
        ->assertCreated()
        ->json('data.id');
    $storedKey = Quiz::findOrFail($quizId)->thumbnail_r2_key;

    config([
        'filesystems.disks.r2.key' => null,
        'filesystems.disks.r2.secret' => null,
        'filesystems.disks.r2.bucket' => null,
        'filesystems.disks.r2.endpoint' => null,
    ]);
    $payload['title'] = 'Updated without R2 credentials';
    $payload['thumbnail_url'] = Quiz::findOrFail($quizId)->thumbnail_url;
    $payload['thumbnail_r2_key'] = $storedKey;

    $this->actingAs($this->teacher)
        ->putJson("/api/instructor/ai-quiz/{$quizId}", $payload)
        ->assertOk()
        ->assertJsonPath('data.thumbnail_r2_key', $storedKey);

    Storage::disk('r2')->assertExists($storedKey);
});

test('public media promotion records disk-aware keys for rollback cleanup', function () {
    config([
        'filesystems.disks.r2.key' => null,
        'filesystems.disks.r2.secret' => null,
        'filesystems.disks.r2.bucket' => null,
        'filesystems.disks.r2.endpoint' => null,
    ]);
    Storage::fake('public');
    $quizId = $this->actingAs($this->teacher)
        ->postJson('/api/instructor/ai-quiz/store', ($this->mediaPayload)())
        ->assertCreated()
        ->json('data.id');
    $uploaded = ($this->uploadMedia)($this->teacher, 'thumbnail');
    $payload = ($this->mediaPayload)();
    $payload['thumbnail_url'] = $uploaded['url'];
    $payload['thumbnail_r2_key'] = $uploaded['r2_key'];

    $promotion = app(QuizMediaService::class)->promotePayload(
        $this->teacher,
        Quiz::findOrFail($quizId),
        $payload,
    );

    expect($promotion['promoted_keys'])->toHaveCount(1)
        ->and($promotion['promoted_keys'][0])->toStartWith('public:quizzes/');

    app(QuizMediaService::class)->deleteKeys($promotion['promoted_keys']);
    Storage::disk('public')->assertMissing(substr($promotion['promoted_keys'][0], strlen('public:')));
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

test('persists and promotes question and answer media when saving quiz inside a lesson', function () {
    Storage::fake('public');
    config([
        'filesystems.disks.r2.key' => null,
        'filesystems.disks.r2.secret' => null,
        'filesystems.disks.r2.bucket' => null,
        'filesystems.disks.r2.endpoint' => null,
    ]);

    $course = \App\Models\Course::create([
        'teacher_id' => $this->teacher->id,
        'title' => 'Test Course for Quiz Media',
        'slug' => 'test-course-quiz-media-'.\Illuminate\Support\Str::uuid(),
        'description' => 'Test course description',
        'price' => 100000,
        'level' => 'beginner',
        'status' => 'published',
    ]);
    $module = \App\Models\CourseModule::create([
        'course_id' => $course->id,
        'title' => 'Test Module',
        'order' => 1,
    ]);

    $thumb = ($this->uploadMedia)($this->teacher, 'thumbnail', 'thumb.png');
    $qMedia = ($this->uploadMedia)($this->teacher, 'question', 'q1.png');
    $aMedia = ($this->uploadMedia)($this->teacher, 'answer', 'a1.png');

    $payload = [
        'title' => 'Lesson with Quiz Media',
        'type' => 'quiz_module',
        'quizData' => [
            'title' => 'Quiz inside Lesson',
            'thumbnail_url' => $thumb['url'],
            'thumbnail_r2_key' => $thumb['r2_key'],
            'questions' => [
                [
                    'type' => 'multiple_choice',
                    'selection_type' => 'single_choice',
                    'content' => 'Question 1 with image',
                    'image_url' => $qMedia['url'],
                    'image_r2_key' => $qMedia['r2_key'],
                    'points' => 1.0,
                    'options' => ['Option A', 'Option B'],
                    'correct_answer_index' => 0,
                    'answer_images' => [
                        ['url' => $aMedia['url'], 'r2_key' => $aMedia['r2_key']],
                        ['url' => null, 'r2_key' => null],
                    ],
                ],
            ],
        ],
    ];

    $response = $this->actingAs($this->teacher)
        ->postJson("/api/instructor/modules/{$module->id}/lessons", $payload);

    $response->assertCreated()
        ->assertJsonPath('data.quizData.thumbnail_r2_key', fn ($val) => str_contains($val, 'quizzes/'))
        ->assertJsonPath('data.quizData.questions.0.image_r2_key', fn ($val) => str_contains($val, 'quizzes/'))
        ->assertJsonPath('data.quizData.questions.0.answers.0.image_r2_key', fn ($val) => str_contains($val, 'quizzes/'));

    $lessonId = $response->json('data.id');
    $showResp = $this->actingAs($this->teacher)->getJson("/api/instructor/lessons/{$lessonId}");
    $showResp->assertOk()
        ->assertJsonPath('data.quizData.questions.0.image_url', fn ($val) => !empty($val))
        ->assertJsonPath('data.quizData.questions.0.answers.0.image_url', fn ($val) => !empty($val));
});
