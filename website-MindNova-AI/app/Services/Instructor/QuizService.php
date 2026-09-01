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

        // Clean module/lesson IDs for course-level positions
        $moduleId = ($position === 'capability_assessment' || $position === 'end_of_course')
            ? null
            : ($attachData['module_id'] ?? null);

        $afterLessonId = ($position === 'capability_assessment' || $position === 'end_of_course' || $position === 'in_module')
            ? null
            : ($attachData['after_lesson_id'] ?? null);

        // Check if another active attachment exists for this position in the course
        $hasActive = QuizCourseAttachment::where('course_id', $attachData['course_id'])
            ->where('position', $position)
            ->where('is_active', true)
            ->exists();

        $isActive = !$hasActive;

        return QuizCourseAttachment::updateOrCreate(
            ['quiz_id' => $quiz->id],
            [
                'course_id' => $attachData['course_id'],
                'module_id' => $moduleId,
                'after_lesson_id' => $afterLessonId,
                'position' => $position,
                'order' => (int) $order,
                'is_active' => $isActive,
            ]
        );
    }

    /**
     * Set a quiz attachment as the active/primary quiz for a specific position in a course.
     */
    public function setActiveQuiz(Quiz $quiz, int $courseId, ?string $position = null): bool
    {
        $attachment = QuizCourseAttachment::where('quiz_id', $quiz->id)->first();

        if (!$attachment) {
            // Create attachment if not existing
            $pos = $position ?? 'capability_assessment';
            $attachment = $this->attachQuizToCourse($quiz, [
                'course_id' => $courseId,
                'position' => $pos,
            ]);
        }

        $targetPosition = $position ?? $attachment->position;

        // Reset is_active for all other attachments of this course and position
        QuizCourseAttachment::where('course_id', $courseId)
            ->where('position', $targetPosition)
            ->update(['is_active' => false]);

        // Set target attachment as active
        $attachment->update([
            'course_id' => $courseId,
            'position' => $targetPosition,
            'is_active' => true,
        ]);

        return true;
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
        $instructorCourseIds = \App\Models\Course::where('teacher_id', $instructor->id)->pluck('id')->toArray();

        $query = Quiz::where(function ($q) use ($instructor, $instructorCourseIds) {
            $q->where('instructor_id', $instructor->id);

            if (!empty($instructorCourseIds)) {
                $q->orWhereHas('attachments', function ($att) use ($instructorCourseIds) {
                    $att->whereIn('course_id', $instructorCourseIds);
                })->orWhereHas('lesson', function ($les) use ($instructorCourseIds) {
                    $les->whereIn('course_id', $instructorCourseIds)
                        ->orWhereHas('module', function ($mod) use ($instructorCourseIds) {
                            $mod->whereIn('course_id', $instructorCourseIds);
                        });
                });
            }
        });

        if ($courseId) {
            $ownsCourse = \App\Models\Course::where('id', $courseId)
                ->where('teacher_id', $instructor->id)
                ->exists();

            if (!$ownsCourse) {
                return collect();
            }

            $query->where(function ($q) use ($courseId) {
                $q->whereHas('attachments', function ($att) use ($courseId) {
                    $att->where('course_id', $courseId);
                })->orWhereHas('lesson', function ($les) use ($courseId) {
                    $les->where('course_id', $courseId)
                        ->orWhereHas('module', function ($mod) use ($courseId) {
                            $mod->where('course_id', $courseId);
                        });
                });
            });
        }

        $quizzes = $query->withCount('questions')
            ->with(['questions.answers', 'attachments.course', 'attachments.module', 'lesson.module.course', 'lesson.course'])
            ->orderBy('created_at', 'desc')
            ->get();

        return $quizzes->map(function ($quiz) {
            $attachment = $quiz->attachments->first();
            $course = $attachment?->course ?? $quiz->lesson?->module?->course ?? $quiz->lesson?->course;
            $module = $attachment?->module ?? $quiz->lesson?->module;

            $mcCount = $quiz->questions->where('type', 'multiple_choice')->count();
            $essayCount = $quiz->questions->where('type', 'essay')->count();

            return [
                'id' => $quiz->id,
                'instructor_id' => $quiz->instructor_id,
                'lesson_id' => $quiz->lesson_id,
                'title' => $quiz->title,
                'description' => $quiz->description,
                'source_type' => $quiz->source_type ?? 'topic',
                'type' => $quiz->type ?? 'normal',
                'difficulty' => $quiz->difficulty ?? 'mixed',
                'total_questions' => $quiz->questions_count ?? $quiz->questions->count(),
                'mc_questions_count' => $mcCount ?: ($quiz->mc_questions_count ?? 0),
                'essay_questions_count' => $essayCount ?: ($quiz->essay_questions_count ?? 0),
                'time_limit_minutes' => $quiz->time_limit_minutes ?? 15,
                'passing_score' => $quiz->passing_score ?? 70,
                'total_points' => $quiz->total_points ?? 10.0,
                'status' => $quiz->status ?? 'published',
                'created_at' => $quiz->created_at ? $quiz->created_at->toISOString() : null,
                'is_active' => (bool) ($attachment?->is_active ?? false),
                'position' => $attachment?->position ?? ($quiz->type === 'capability_assessment' ? 'capability_assessment' : 'end_of_course'),
                'course' => $course ? [
                    'id' => $course->id,
                    'title' => $course->title,
                ] : null,
                'module' => $module ? [
                    'id' => $module->id,
                    'title' => $module->title,
                ] : null,
                'attachments' => $quiz->attachments->map(function ($att) {
                    return [
                        'id' => $att->id,
                        'course_id' => $att->course_id,
                        'module_id' => $att->module_id,
                        'position' => $att->position,
                        'is_active' => (bool) $att->is_active,
                        'course' => $att->course ? ['id' => $att->course->id, 'title' => $att->course->title] : null,
                        'module' => $att->module ? ['id' => $att->module->id, 'title' => $att->module->title] : null,
                    ];
                })->toArray(),
                'questions' => $quiz->questions->map(function ($q) {
                    $answers = $q->answers ? $q->answers->map(function ($a) {
                        return [
                            'id' => $a->id,
                            'content' => $a->content,
                            'is_correct' => (bool) $a->is_correct,
                        ];
                    })->values()->toArray() : [];

                    $options = $q->answers ? $q->answers->pluck('content')->toArray() : [];
                    $correctIdx = 0;
                    if ($q->answers) {
                        $found = $q->answers->search(fn($a) => (bool)$a->is_correct);
                        if ($found !== false) {
                            $correctIdx = $found;
                        }
                    }

                    return [
                        'id' => $q->id,
                        'type' => $q->type ?? 'multiple_choice',
                        'question' => $q->content,
                        'content' => $q->content,
                        'explanation' => $q->explanation,
                        'sample_answer' => $q->sample_answer,
                        'rubric' => $q->rubric,
                        'points' => (float) ($q->points ?? 1.0),
                        'difficulty' => $q->difficulty ?? 'medium',
                        'order' => $q->order,
                        'options' => $options,
                        'correct_answer_index' => $correctIdx,
                        'answers' => $answers,
                    ];
                })->values()->toArray(),
            ];
        });
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

            $teacherId = auth()->id() ?? ($lesson->course->teacher_id ?? ($lesson->module->course->teacher_id ?? null));

            $targetQuizId = $data['quiz_id'] ?? ($data['id'] ?? null);
            $quiz = null;

            if ($targetQuizId && is_numeric($targetQuizId)) {
                $foundQuiz = Quiz::find((int) $targetQuizId);
                if ($foundQuiz) {
                    $foundQuiz->update([
                        'lesson_id' => $lesson->id,
                        'instructor_id' => $teacherId ?? $foundQuiz->instructor_id,
                        'title' => $data['title'] ?? $foundQuiz->title,
                        'description' => $data['description'] ?? $foundQuiz->description,
                        'time_limit_minutes' => $data['time_limit_minutes'] ?? $foundQuiz->time_limit_minutes ?? 15,
                        'passing_score' => $data['passing_score'] ?? $foundQuiz->passing_score ?? 70,
                        'difficulty' => $data['difficulty'] ?? $foundQuiz->difficulty ?? 'mixed',
                        'total_questions' => count($questionsData),
                        'mc_questions_count' => $mcCount,
                        'essay_questions_count' => $essayCount,
                        'total_points' => round($totalPoints, 2),
                    ]);
                    $quiz = $foundQuiz;
                }
            }

            if (!$quiz) {
                $quiz = Quiz::updateOrCreate(
                    ['lesson_id' => $lesson->id],
                    [
                        'instructor_id' => $teacherId,
                        'title' => $data['title'],
                        'description' => $data['description'] ?? null,
                        'time_limit_minutes' => $data['time_limit_minutes'] ?? 15,
                        'passing_score' => $data['passing_score'] ?? 70,
                        'difficulty' => $data['difficulty'] ?? 'mixed',
                        'total_questions' => count($questionsData),
                        'mc_questions_count' => $mcCount,
                        'essay_questions_count' => $essayCount,
                        'total_points' => round($totalPoints, 2),
                    ]
                );
            }

            $courseId = $lesson->course_id ?? ($lesson->module->course_id ?? null);
            if ($courseId) {
                QuizCourseAttachment::updateOrCreate(
                    ['quiz_id' => $quiz->id],
                    [
                        'course_id' => $courseId,
                        'module_id' => $lesson->module_id,
                        'after_lesson_id' => $lesson->id,
                        'position' => 'after_lesson',
                    ]
                );
            }

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

                if ($type !== 'essay') {
                    $answersList = $questionData['answers'] ?? [];

                    if (empty($answersList) && !empty($questionData['options']) && is_array($questionData['options'])) {
                        $correctIdx = is_numeric($questionData['correct_answer_index'] ?? null) ? (int)$questionData['correct_answer_index'] : 0;
                        foreach ($questionData['options'] as $optIdx => $optContent) {
                            $answersList[] = [
                                'content' => (string) $optContent,
                                'is_correct' => $optIdx == $correctIdx,
                            ];
                        }
                    }

                    foreach ($answersList as $answerData) {
                        $question->answers()->create([
                            'content' => $answerData['content'] ?? $answerData['answer'] ?? '',
                            'is_correct' => !empty($answerData['is_correct']),
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
