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
            $totalPoints = 0.0;

            foreach ($questionsData as $q) {
                if (($q['type'] ?? 'multiple_choice') === 'essay') {
                    $essayCount++;
                } else {
                    $mcCount++;
                }
                $totalPoints += (float) ($q['points'] ?? 0.0);
            }

            $quiz = Quiz::create([
                'instructor_id' => $instructor->id,
                'title' => $data['title'],
                'description' => $data['description'] ?? null,
                'source_type' => $data['source_type'] ?? 'topic',
                'source_content' => $data['source_content'] ?? null,
                'type' => $data['type'] ?? 'normal',
                'difficulty' => $data['difficulty'] ?? 'mixed',
                'total_questions' => count($questionsData),
                'mc_questions_count' => $mcCount,
                'essay_questions_count' => $essayCount,
                'time_limit_minutes' => $data['time_limit_minutes'] ?? 15,
                'passing_score' => $data['passing_score'] ?? 70,
                'total_points' => round($totalPoints, 2),
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
            $totalPoints = 0.0;

            foreach ($questionsData as $q) {
                if (($q['type'] ?? 'multiple_choice') === 'essay') {
                    $essayCount++;
                } else {
                    $mcCount++;
                }
                $totalPoints += (float) ($q['points'] ?? 0.0);
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
                'total_points' => round($totalPoints, 2),
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
                'points' => (float) ($qData['points'] ?? 0.0),
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
        $position = $attachData['position'] ?? 'end_of_course';

        $targetType = ($position === 'capability_assessment')
            ? 'capability_assessment'
            : (($quiz->type === 'capability_assessment' || !$quiz->type) ? 'normal' : $quiz->type);

        $quiz->update([
            'type' => $targetType,
            'credits' => $targetType === 'capability_assessment' ? 3 : ($quiz->credits ?? 1),
        ]);

        $order = $attachData['order'] ?? null;
        if ($order === null || $order === 0) {
            $maxOrder = QuizCourseAttachment::where('course_id', $attachData['course_id'])->max('order') ?? 0;
            $order = $maxOrder + 1;
        }

        return QuizCourseAttachment::updateOrCreate(
            ['quiz_id' => $quiz->id],
            [
                'course_id' => $attachData['course_id'],
                'module_id' => $attachData['module_id'] ?? null,
                'after_lesson_id' => $attachData['after_lesson_id'] ?? null,
                'position' => $position,
                'order' => (int) $order,
            ]
        );
    }

    public function detachQuizFromCourse(Quiz $quiz, ?int $courseId = null): bool
    {
        $query = QuizCourseAttachment::where('quiz_id', $quiz->id);
        if ($courseId) {
            $query->where('course_id', $courseId);
        }
        return (bool) $query->delete();
    }

    /**
     * Get all standalone or course-bound quizzes for an instructor.
     */
    public function getInstructorQuizzes(User $instructor, ?int $courseId = null)
    {
        $query = Quiz::where('instructor_id', $instructor->id);

        if ($courseId) {
            // Verify that course belongs to instructor
            $ownsCourse = \App\Models\Course::where('id', $courseId)
                ->where('teacher_id', $instructor->id)
                ->exists();

            if (!$ownsCourse) {
                return collect();
            }

            $query->where(function ($q) use ($courseId) {
                $q->whereHas('attachments', function ($att) use ($courseId) {
                    $att->where('course_id', $courseId);
                })->orWhereHas('lesson.module', function ($mod) use ($courseId) {
                    $mod->where('course_id', $courseId);
                })->orWhereHas('lesson', function ($les) use ($courseId) {
                    $les->where('course_id', $courseId);
                });
            });
        }

        return $query->withCount('questions')
            ->with(['attachments.course', 'lesson.module.course'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Legacy support: Create or update a quiz for a lesson.
     */
    public function createOrUpdateQuiz(Lesson $lesson, array $data): Quiz
    {
        return DB::transaction(function () use ($lesson, $data) {
            $questionsData = $data['questions'] ?? [];
            $mcCount = 0;
            $essayCount = 0;
            $totalPoints = 0.0;

            foreach ($questionsData as $q) {
                if (($q['type'] ?? 'multiple_choice') === 'essay') {
                    $essayCount++;
                } else {
                    $mcCount++;
                }
                $totalPoints += (float) ($q['points'] ?? 0.0);
            }

            $quiz = Quiz::updateOrCreate(
                ['lesson_id' => $lesson->id],
                [
                    'instructor_id' => $lesson->module->course->teacher_id ?? null,
                    'title' => $data['title'],
                    'time_limit_minutes' => $data['time_limit_minutes'] ?? 15,
                    'passing_score' => $data['passing_score'] ?? 70,
                    'total_questions' => count($questionsData),
                    'mc_questions_count' => $mcCount,
                    'essay_questions_count' => $essayCount,
                    'total_points' => round($totalPoints, 2),
                ]
            );

            $quiz->questions()->delete();

            foreach ($questionsData as $qIndex => $questionData) {
                $type = $questionData['type'] ?? 'multiple_choice';
                $question = $quiz->questions()->create([
                    'type' => $type,
                    'content' => $questionData['content'] ?? $questionData['question'] ?? '',
                    'explanation' => $questionData['explanation'] ?? null,
                    'sample_answer' => $type === 'essay' ? ($questionData['sample_answer'] ?? null) : null,
                    'rubric' => $type === 'essay' ? ($questionData['rubric'] ?? null) : null,
                    'points' => (float) ($questionData['points'] ?? ($type === 'essay' ? 5.0 : 1.0)),
                    'difficulty' => $questionData['difficulty'] ?? 'medium',
                    'order' => $qIndex + 1,
                    'topic_id' => $questionData['topic_id'] ?? null,
                    'ai_insight' => $questionData['ai_insight'] ?? null,
                ]);

                if ($type !== 'essay' && !empty($questionData['answers'])) {
                    foreach ($questionData['answers'] as $answerData) {
                        $question->answers()->create([
                            'content' => $answerData['content'],
                            'is_correct' => (bool) $answerData['is_correct'],
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
