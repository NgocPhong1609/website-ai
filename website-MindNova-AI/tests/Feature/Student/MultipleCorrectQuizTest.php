<?php

use App\Models\Question;
use App\Models\Quiz;
use App\Models\User;
use App\Models\UserQuizAttempt;
use App\Models\UserQuizAttemptAnswer;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('schema keeps legacy questions single choice and stores selected answer ids', function () {
    $user = User::factory()->create();
    $quiz = Quiz::create([
        'instructor_id' => $user->id,
        'title' => 'Compatibility quiz',
        'total_questions' => 1,
    ]);
    $question = Question::create([
        'quiz_id' => $quiz->id,
        'content' => 'Choose every correct answer',
    ]);
    $attempt = UserQuizAttempt::create([
        'user_id' => $user->id,
        'quiz_id' => $quiz->id,
        'score' => 0,
        'accuracy' => 0,
        'time_taken_seconds' => 0,
        'status' => 'failed',
    ]);

    $attemptAnswer = UserQuizAttemptAnswer::create([
        'user_quiz_attempt_id' => $attempt->id,
        'question_id' => $question->id,
        'question_type' => 'multiple_choice',
        'user_answer' => '11',
        'selected_answer_ids' => [11, 13],
    ]);

    expect($question->fresh()->selection_type)->toBe('single_choice')
        ->and($attemptAnswer->fresh()->selected_answer_ids)->toBe([11, 13])
        ->and($attemptAnswer->fresh()->user_answer)->toBe('11');
})->group('schema');

test('student submission persists multiple selections and returns partial scoring detail', function () {
    $user = User::factory()->create();
    $quiz = Quiz::create([
        'instructor_id' => $user->id,
        'title' => 'Multiple correct quiz',
        'total_questions' => 1,
        'total_points' => 2,
        'passing_score' => 70,
        'status' => 'published',
    ]);
    $question = $quiz->questions()->create([
        'type' => 'multiple_choice',
        'selection_type' => 'multiple_choice',
        'content' => 'Select both correct answers',
        'points' => 2,
        'order' => 1,
    ]);
    $firstCorrect = $question->answers()->create(['content' => 'A', 'is_correct' => true]);
    $question->answers()->create(['content' => 'B', 'is_correct' => true]);
    $question->answers()->create(['content' => 'C', 'is_correct' => false]);

    $response = $this->actingAs($user)->postJson(
        "/api/student/lessons/quiz-{$quiz->id}/quiz/submit",
        ['answers' => [(string) $question->id => [$firstCorrect->id]]],
    );

    $response->assertOk()
        ->assertJsonPath('data.question_results.0.selection_type', 'multiple_choice')
        ->assertJsonPath('data.question_results.0.selected_answer_ids.0', $firstCorrect->id)
        ->assertJsonPath('data.question_results.0.score', 1)
        ->assertJsonPath('data.question_results.0.max_score', 2);

    $attemptAnswer = UserQuizAttemptAnswer::latest('id')->firstOrFail();
    expect($attemptAnswer->selected_answer_ids)->toBe([$firstCorrect->id])
        ->and($attemptAnswer->user_answer)->toBeNull();
});

test('student submission rejects an answer id outside its question', function () {
    $user = User::factory()->create();
    $quiz = Quiz::create([
        'instructor_id' => $user->id,
        'title' => 'Answer membership quiz',
        'total_questions' => 1,
        'total_points' => 2,
        'status' => 'published',
    ]);
    $question = $quiz->questions()->create([
        'type' => 'multiple_choice',
        'selection_type' => 'multiple_choice',
        'content' => 'Select valid answers',
        'points' => 2,
    ]);
    $question->answers()->create(['content' => 'A', 'is_correct' => true]);
    $question->answers()->create(['content' => 'B', 'is_correct' => true]);

    $this->actingAs($user)->postJson(
        "/api/student/lessons/quiz-{$quiz->id}/quiz/submit",
        ['answers' => [(string) $question->id => [999999]]],
    )->assertUnprocessable()
        ->assertJsonValidationErrors(["answers.{$question->id}"]);
});

test('student quiz and result responses expose media without leaking correctness before submission', function () {
    $user = User::factory()->create();
    $quiz = Quiz::create([
        'instructor_id' => $user->id,
        'title' => 'Illustrated quiz',
        'thumbnail_url' => 'https://cdn.example/quiz-cover.png',
        'total_questions' => 1,
        'total_points' => 2,
        'status' => 'published',
    ]);
    $question = $quiz->questions()->create([
        'type' => 'multiple_choice',
        'selection_type' => 'multiple_choice',
        'content' => 'Identify both diagrams',
        'image_url' => 'https://cdn.example/question.png',
        'points' => 2,
        'order' => 1,
    ]);
    $correct = $question->answers()->create([
        'content' => 'Diagram A',
        'image_url' => 'https://cdn.example/answer-a.png',
        'is_correct' => true,
    ]);
    $question->answers()->create([
        'content' => 'Diagram B',
        'image_url' => 'https://cdn.example/answer-b.png',
        'is_correct' => true,
    ]);

    $show = $this->actingAs($user)->getJson("/api/student/lessons/quiz-{$quiz->id}/quiz");

    $show->assertOk()
        ->assertJsonPath('data.thumbnail_url', 'https://cdn.example/quiz-cover.png')
        ->assertJsonPath('data.questions.0.image_url', 'https://cdn.example/question.png')
        ->assertJsonFragment(['image_url' => 'https://cdn.example/answer-a.png'])
        ->assertJsonMissing(['is_correct' => true]);

    $submit = $this->actingAs($user)->postJson(
        "/api/student/lessons/quiz-{$quiz->id}/quiz/submit",
        ['answers' => [(string) $question->id => [$correct->id]]],
    );

    $submit->assertOk()
        ->assertJsonPath('data.question_results.0.image_url', 'https://cdn.example/question.png')
        ->assertJsonFragment([
            'content' => 'Diagram A',
            'image_url' => 'https://cdn.example/answer-a.png',
        ]);

    $attemptId = $submit->json('data.attempt_id');
    $this->actingAs($user)->getJson("/api/student/quiz-attempts/{$attemptId}")
        ->assertOk()
        ->assertJsonPath('data.question_results.0.image_url', 'https://cdn.example/question.png')
        ->assertJsonFragment([
            'content' => 'Diagram B',
            'image_url' => 'https://cdn.example/answer-b.png',
        ]);
});
