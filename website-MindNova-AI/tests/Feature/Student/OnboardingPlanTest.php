<?php

use App\Models\Course;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;

uses(RefreshDatabase::class);

function onboardingCourse(string $title, string $status = 'published'): Course
{
    return Course::create([
        'teacher_id' => User::factory()->create()->id,
        'title' => $title,
        'slug' => 'onboarding-'.uniqid(),
        'description' => 'Khóa học dùng cho kiểm thử onboarding.',
        'price' => 0,
        'status' => $status,
    ]);
}

function fakeGroq(array $content): void
{
    config(['services.groq.key' => 'test-key']);
    Http::fake(['api.groq.com/*' => Http::response([
        'choices' => [['message' => ['content' => json_encode($content)]]],
    ])]);
}

$payload = [
    'goal' => 'Trở thành lập trình viên Frontend',
    'currentLevel' => 'Mới bắt đầu',
    'timeAvailable' => '1–2 giờ/ngày',
    'topics' => ['React', 'TypeScript'],
];

test('it returns the AI plan with matched published courses and saves it on the learner', function () use ($payload) {
    $react = onboardingCourse('React từ cơ bản đến nâng cao');
    onboardingCourse('React bản nháp', 'draft');
    fakeGroq([
        'est_time' => '3 tháng',
        'learning_path' => [
            ['title' => 'Nền tảng', 'description' => 'Làm quen', 'duration' => '3 tuần', 'search_keywords' => ['React'],
                'lessons' => [['name' => 'JSX và component', 'duration' => '3 ngày']]],
            ['title' => 'Nâng cao', 'duration' => '1 tháng', 'search_keywords' => ['Next.js'],
                'lessons' => [['name' => 'Server Components', 'duration' => '1 tuần']]],
        ],
    ]);
    $student = User::factory()->create();

    $response = $this->actingAs($student, 'sanctum')->postJson('/api/student/onboarding', $payload);

    $response->assertOk()
        ->assertJsonPath('status', 'success')
        ->assertJsonPath('data.source', 'ai')
        ->assertJsonPath('data.profile.topics', ['React', 'TypeScript'])
        ->assertJsonPath('data.profile.est_time', '3 tháng')
        ->assertJsonPath('data.learning_path.0.phase', 1)
        ->assertJsonPath('data.learning_path.0.lessons.0.name', 'JSX và component')
        ->assertJsonPath('data.learning_path.0.courses.0.id', $react->id)
        ->assertJsonCount(1, 'data.learning_path.0.courses')
        ->assertJsonMissingPath('data.learning_path.0.search_keywords');

    $saved = $student->fresh();
    expect($saved->is_onboarded)->toBeTrue()
        ->and($saved->onboarding_data['goal'])->toBe($payload['goal'])
        ->and($saved->onboarding_data['topics'])->toBe(['React', 'TypeScript'])
        ->and($saved->onboarding_data['ai_plan']['learning_path'])->toHaveCount(2);
});

test('it falls back to a Vietnamese plan built from the chosen topics when AI output is unusable', function () use ($payload) {
    fakeGroq(['phases' => []]);

    $response = $this->postJson('/api/student/onboarding', $payload);

    $response->assertOk()
        ->assertJsonPath('data.source', 'fallback')
        ->assertJsonPath('data.learning_path.0.title', 'Nền tảng')
        ->assertJsonPath('data.learning_path.0.lessons.1.name', 'Kiến thức cơ bản về React')
        ->assertJsonPath('data.learning_path.1.lessons.0.name', 'Thực hành TypeScript');
});

test('it validates the answers with Vietnamese messages', function () {
    $this->postJson('/api/student/onboarding', ['topics' => array_fill(0, 9, 'x')])
        ->assertStatus(422)
        ->assertJsonPath('errors.goal.0', 'Vui lòng chọn mục tiêu học tập.')
        ->assertJsonPath('errors.topics.0', 'Chỉ chọn tối đa 8 chủ đề.');
});

test('lesson analysis only recommends published courses with real stats', function () {
    config(['services.groq.key' => null]);
    $published = onboardingCourse('Nhập môn TypeScript');
    onboardingCourse('TypeScript nội bộ', 'draft');

    $response = $this->postJson('/api/student/analyze-lesson', [
        'lesson_title' => 'TypeScript',
        'goal' => 'Frontend',
    ]);

    $response->assertOk()
        ->assertJsonPath('data.source', 'fallback')
        ->assertJsonCount(1, 'data.recommended_courses')
        ->assertJsonPath('data.recommended_courses.0.id', $published->id)
        ->assertJsonPath('data.recommended_courses.0.students_count', 0)
        ->assertJsonPath('data.recommended_courses.0.rating', null);
});
