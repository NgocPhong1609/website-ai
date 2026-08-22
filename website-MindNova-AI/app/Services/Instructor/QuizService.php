<?php

namespace App\Services\Instructor;

use App\Models\Answer;
use App\Models\Lesson;
use App\Models\Question;
use App\Models\Quiz;
use App\Models\QuizCourseAttachment;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class QuizService
{
    /**
     * Create a standalone quiz with MCQ and Essay questions.
     */
    public function createStandaloneQuiz(User $instructor, array $data): Quiz
    {
        return DB::transaction(function () use ($instructor, $data) {
            $questionsData = $data['questions'] ?? [];
            $mcCount = 0;
            $essayCount = 0;
            $totalPoints = 0;

            foreach ($questionsData as $q) {
                if (($q['type'] ?? 'multiple_choice') === 'essay') {
                    $essayCount++;
                    $totalPoints += (float) ($q['points'] ?? 5.0);
                } else {
                    $mcCount++;
                    $totalPoints += (float) ($q['points'] ?? 1.0);
                }
            }

            $quiz = Quiz::create([
                'instructor_id' => $instructor->id,
                'title' => $data['title'],
                'description' => $data['description'] ?? null,
                'source_type' => $data['source_type'] ?? 'topic',
                'source_content' => $data['source_content'] ?? null,
                'difficulty' => $data['difficulty'] ?? 'mixed',
                'total_questions' => count($questionsData),
                'mc_questions_count' => $mcCount,
                'essay_questions_count' => $essayCount,
                'time_limit_minutes' => $data['time_limit_minutes'] ?? 15,
                'passing_score' => $data['passing_score'] ?? 70,
                'total_points' => $totalPoints,
                'status' => $data['status'] ?? 'published',
            ]);

            if (!empty($data['course_id'])) {
                QuizCourseAttachment::create([
                    'quiz_id' => $quiz->id,
                    'course_id' => $data['course_id'],
                    'position' => 'end_of_course',
                ]);
            }

            $this->saveQuestionsAndAnswers($quiz, $questionsData);

            return $quiz->load('questions.answers', 'attachments.course');
        });
    }

    /**
     * Update an existing quiz and its questions.
     */
    public function updateStandaloneQuiz(Quiz $quiz, array $data): Quiz
    {
        return DB::transaction(function () use ($quiz, $data) {
            $questionsData = $data['questions'] ?? [];
            $mcCount = 0;
            $essayCount = 0;
            $totalPoints = 0;

            foreach ($questionsData as $q) {
                if (($q['type'] ?? 'multiple_choice') === 'essay') {
                    $essayCount++;
                    $totalPoints += (float) ($q['points'] ?? 5.0);
                } else {
                    $mcCount++;
                    $totalPoints += (float) ($q['points'] ?? 1.0);
                }
            }

            $quiz->update([
                'title' => $data['title'] ?? $quiz->title,
                'description' => $data['description'] ?? $quiz->description,
                'source_type' => $data['source_type'] ?? $quiz->source_type,
                'source_content' => $data['source_content'] ?? $quiz->source_content,
                'difficulty' => $data['difficulty'] ?? $quiz->difficulty,
                'total_questions' => count($questionsData),
                'mc_questions_count' => $mcCount,
                'essay_questions_count' => $essayCount,
                'time_limit_minutes' => $data['time_limit_minutes'] ?? $quiz->time_limit_minutes,
                'passing_score' => $data['passing_score'] ?? $quiz->passing_score,
                'total_points' => $totalPoints,
                'status' => $data['status'] ?? $quiz->status,
            ]);

            if (!empty($data['course_id'])) {
                QuizCourseAttachment::updateOrCreate(
                    ['quiz_id' => $quiz->id],
                    [
                        'course_id' => $data['course_id'],
                        'position' => 'end_of_course',
                    ]
                );
            }

            // Re-create questions
            $quiz->questions()->delete();
            $this->saveQuestionsAndAnswers($quiz, $questionsData);

            return $quiz->load('questions.answers', 'attachments.course');
        });
    }

    /**
     * Helper to save questions and answers.
     */
    private function saveQuestionsAndAnswers(Quiz $quiz, array $questionsData): void
    {
        foreach ($questionsData as $qIndex => $qData) {
            $type = $qData['type'] ?? 'multiple_choice';

            $question = $quiz->questions()->create([
                'type' => $type,
                'difficulty' => $qData['difficulty'] ?? 'medium',
                'content' => $qData['content'] ?? $qData['question'] ?? '',
                'explanation' => $qData['explanation'] ?? null,
                'sample_answer' => $type === 'essay' ? ($qData['sample_answer'] ?? null) : null,
                'rubric' => $type === 'essay' ? ($qData['rubric'] ?? null) : null,
                'points' => (float) ($qData['points'] ?? ($type === 'essay' ? 5.0 : 1.0)),
                'order' => $qIndex + 1,
            ]);

            if ($type === 'multiple_choice' && !empty($qData['answers'])) {
                foreach ($qData['answers'] as $aData) {
                    $question->answers()->create([
                        'content' => $aData['content'],
                        'is_correct' => (bool) $aData['is_correct'],
                    ]);
                }
            }
        }
    }

    /**
     * Attach a quiz to a course, module, or lesson.
     */
    public function attachQuizToCourse(Quiz $quiz, array $attachData): QuizCourseAttachment
    {
        return QuizCourseAttachment::updateOrCreate(
            ['quiz_id' => $quiz->id],
            [
                'course_id' => $attachData['course_id'],
                'module_id' => $attachData['module_id'] ?? null,
                'after_lesson_id' => $attachData['after_lesson_id'] ?? null,
                'position' => $attachData['position'] ?? 'end_of_course',
            ]
        );
    }

    /**
     * Get all standalone quizzes for an instructor.
     */
    public function getInstructorQuizzes(User $instructor)
    {
        return Quiz::where('instructor_id', $instructor->id)
            ->withCount('questions')
            ->with('attachments.course')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Legacy support: Create or update a quiz for a lesson.
     */
    public function createOrUpdateQuiz(Lesson $lesson, array $data): Quiz
    {
        return DB::transaction(function () use ($lesson, $data) {
            $quiz = Quiz::updateOrCreate(
                ['lesson_id' => $lesson->id],
                [
                    'instructor_id' => $lesson->module->course->teacher_id ?? null,
                    'title' => $data['title'],
                    'time_limit_minutes' => $data['time_limit_minutes'] ?? 0,
                    'passing_score' => $data['passing_score'] ?? 70,
                ]
            );

            $quiz->questions()->delete();

            foreach ($data['questions'] as $qIndex => $questionData) {
                $question = $quiz->questions()->create([
                    'content' => $questionData['content'],
                    'order' => $qIndex + 1,
                    'topic_id' => $questionData['topic_id'] ?? null,
                    'ai_insight' => $questionData['ai_insight'] ?? null,
                ]);

                if (!empty($questionData['answers'])) {
                    foreach ($questionData['answers'] as $answerData) {
                        $question->answers()->create([
                            'content' => $answerData['content'],
                            'is_correct' => $answerData['is_correct'],
                        ]);
                    }
                }
            }

            $lesson->update([
                'duration_seconds' => $quiz->time_limit_minutes * 60,
            ]);

            return $quiz->load('questions.answers');
        });
    }

    public function getQuizWithDetails(Lesson $lesson): ?Quiz
    {
        return Quiz::where('lesson_id', $lesson->id)
            ->with('questions.answers')
            ->first();
    }

    public function deleteQuiz(Lesson $lesson): void
    {
        Quiz::where('lesson_id', $lesson->id)->delete();
    }

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
