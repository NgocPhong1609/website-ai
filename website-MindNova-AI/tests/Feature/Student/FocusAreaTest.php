<?php

use App\Models\AiGeneratedQuiz;
use App\Models\User;
use App\Services\Student\FocusAreaService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;

uses(RefreshDatabase::class);

function focusAiQuiz(User $user, string $topic, ?int $score, bool $completed = true): void
{
    AiGeneratedQuiz::create([
        'user_id' => $user->id,
        'title' => "Quiz {$topic}",
        'topic' => $topic,
        'questions_data' => [],
        'score' => $score,
        'is_completed' => $completed,
    ]);
}

test('focus areas come from the learner\'s own quiz results, weakest first', function () {
    $student = User::factory()->create();
    $other = User::factory()->create();

    focusAiQuiz($student, 'React Hooks', 40);
    focusAiQuiz($student, 'react hooks ', 60);      // same topic, averaged → 50
    focusAiQuiz($student, 'SQL', 30);
    focusAiQuiz($student, 'HTML', 95);              // mastered → hidden
    focusAiQuiz($student, 'Python', null, false);   // not submitted → ignored
    focusAiQuiz($other, 'SQL', 0);                  // someone else's result

    $quizId = DB::table('quizzes')->insertGetId(['title' => 'Kiểm tra JavaScript', 'created_at' => now(), 'updated_at' => now()]);
    DB::table('user_quiz_attempts')->insert([
        ['user_id' => $student->id, 'quiz_id' => $quizId, 'score' => 7, 'accuracy' => 70, 'time_taken_seconds' => 60, 'status' => 'passed'],
        ['user_id' => $student->id, 'quiz_id' => $quizId, 'score' => 5, 'accuracy' => 50, 'time_taken_seconds' => 60, 'status' => 'failed'],
    ]);

    $areas = app(FocusAreaService::class)->forUser($student->id, 5);

    expect(array_column($areas, 'topic'))->toBe(['SQL', 'React Hooks', 'Kiểm tra JavaScript'])
        ->and(array_column($areas, 'accuracy'))->toBe([30, 50, 60])
        ->and(array_column($areas, 'action'))->toBe(['review', 'practice', 'practice']);
});

test('the dashboard shows the two weakest topics and nothing for a new learner', function () {
    $student = User::factory()->create();

    $this->actingAs($student, 'sanctum')->getJson('/api/student/dashboard')
        ->assertOk()
        ->assertJsonPath('data.focus_areas', []);

    focusAiQuiz($student, 'SQL', 30);
    focusAiQuiz($student, 'CSS', 45);
    focusAiQuiz($student, 'Git', 70);

    $this->actingAs($student, 'sanctum')->getJson('/api/student/dashboard')
        ->assertOk()
        ->assertJsonCount(2, 'data.focus_areas')
        ->assertJsonPath('data.focus_areas.0.topic', 'SQL')
        ->assertJsonPath('data.focus_areas.1.topic', 'CSS');
});
