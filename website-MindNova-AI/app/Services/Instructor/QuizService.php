<?php

namespace App\Services\Instructor;

use App\Models\Answer;
use App\Models\Lesson;
use App\Models\Question;
use App\Models\Quiz;
use Illuminate\Support\Facades\DB;

class QuizService
{
    /**
     * Create or update a quiz for a lesson, including all questions and answers.
     * Uses a transaction to ensure data consistency.
     */
    public function createOrUpdateQuiz(Lesson $lesson, array $data): Quiz
    {
        return DB::transaction(function () use ($lesson, $data) {
            // Create or update quiz
            $quiz = Quiz::updateOrCreate(
                ['lesson_id' => $lesson->id],
                [
                    'title' => $data['title'],
                    'time_limit_minutes' => $data['time_limit_minutes'] ?? 0,
                    'passing_score' => $data['passing_score'] ?? 70,
                ]
            );

            // Delete existing questions (cascade deletes answers)
            $quiz->questions()->delete();

            // Create new questions and answers
            foreach ($data['questions'] as $qIndex => $questionData) {
                $question = $quiz->questions()->create([
                    'content' => $questionData['content'],
                    'order' => $qIndex + 1,
                    'topic_id' => $questionData['topic_id'] ?? null,
                    'ai_insight' => $questionData['ai_insight'] ?? null,
                ]);

                foreach ($questionData['answers'] as $answerData) {
                    $question->answers()->create([
                        'content' => $answerData['content'],
                        'is_correct' => $answerData['is_correct'],
                    ]);
                }
            }

            // Update lesson duration based on quiz time limit
            $lesson->update([
                'duration_seconds' => $quiz->time_limit_minutes * 60,
            ]);

            return $quiz->load('questions.answers');
        });
    }

    /**
     * Get quiz with all questions and answers for a lesson.
     */
    public function getQuizWithDetails(Lesson $lesson): ?Quiz
    {
        return Quiz::where('lesson_id', $lesson->id)
            ->with('questions.answers')
            ->first();
    }

    /**
     * Delete quiz for a lesson (cascade deletes questions and answers).
     */
    public function deleteQuiz(Lesson $lesson): void
    {
        Quiz::where('lesson_id', $lesson->id)->delete();
    }

    /**
     * Grade a student's quiz submission.
     * Returns an array with score, accuracy, and whether they passed.
     */
    public function gradeSubmission(Quiz $quiz, array $submittedAnswers): array
    {
        $quiz->load('questions.answers');

        $totalQuestions = $quiz->questions->count();
        $correctCount = 0;

        foreach ($quiz->questions as $question) {
            $submittedAnswerId = $submittedAnswers[$question->id] ?? null;
            if ($submittedAnswerId) {
                $correctAnswer = $question->answers->firstWhere('is_correct', true);
                if ($correctAnswer && (int) $correctAnswer->id === (int) $submittedAnswerId) {
                    $correctCount++;
                }
            }
        }

        $accuracy = $totalQuestions > 0 ? round(($correctCount / $totalQuestions) * 100) : 0;
        $passed = $accuracy >= $quiz->passing_score;

        return [
            'total_questions' => $totalQuestions,
            'correct_answers' => $correctCount,
            'score' => $correctCount,
            'accuracy' => $accuracy,
            'passed' => $passed,
            'passing_score' => $quiz->passing_score,
        ];
    }
}
