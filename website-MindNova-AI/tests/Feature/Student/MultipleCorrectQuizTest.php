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
