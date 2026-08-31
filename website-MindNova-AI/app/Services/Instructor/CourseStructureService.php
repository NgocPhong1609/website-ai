<?php

namespace App\Services\Instructor;

use App\Models\Course;
use App\Models\CourseModule;
use App\Models\QuizCourseAttachment;

class CourseStructureService
{
    /**
     * Get complete unified course structure (modules + lessons + attached quizzes).
     *
     * @param Course $course
     * @param bool $publishedOnly (If true, filter for published items only)
     * @return array
     */
    public function getCourseStructure(Course $course, bool $publishedOnly = false): array
    {
        // 1. Fetch modules with lessons
        $modulesQuery = $course->modules()->orderBy('order');
        if ($publishedOnly) {
            $modulesQuery->where('status', 'published');
        }
        $modules = $modulesQuery->with(['lessons' => function ($q) use ($publishedOnly) {
            if ($publishedOnly) {
                $q->where('status', 'published')->whereNotNull('published_version_id');
            }
            $q->orderBy('order')->with('quiz.questions.answers');
        }])->get();

        // 2. Fetch all quiz attachments for this course
        $attachmentsQuery = QuizCourseAttachment::with(['quiz.questions.answers'])
            ->where('course_id', $course->id);

        if ($publishedOnly) {
            $attachmentsQuery->whereHas('quiz', function ($q) {
                $q->where('status', 'published');
            });
        }

        $allAttachments = $attachmentsQuery->get();

        $structuredModules = [];
        $modOrder = 1;

        foreach ($modules as $mod) {
            $moduleItems = [];

            // Get lessons for this module
            $lessons = $mod->lessons;

            // Map lessons to structure items
            foreach ($lessons as $les) {
                $durationSec = $les->duration_seconds ?? (($les->duration_minutes ?? 0) * 60);
                $durationMinutes = $durationSec > 0 ? round($durationSec / 60) : 0;
                $durationText = $durationMinutes > 0 ? $durationMinutes . ' phút' : '1 phút';

                $lessonQuizData = null;
                if ($les->quiz) {
                    $qModel = $les->quiz;
                    $lessonQuizData = [
                        'id' => $qModel->id,
                        'quiz_id' => $qModel->id,
                        'title' => $qModel->title,
                        'description' => $qModel->description,
                        'time_limit_minutes' => $qModel->time_limit_minutes ?? 15,
                        'passing_score' => $qModel->passing_score ?? 70,
                        'difficulty' => $qModel->difficulty ?? 'mixed',
                        'total_questions' => $qModel->total_questions ?? ($qModel->questions ? $qModel->questions->count() : 0),
                        'questions' => $qModel->questions ? $qModel->questions->map(function ($q) {
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
                        })->values()->toArray() : [],
                    ];
                }

                $moduleItems[] = [
                    'id' => $les->id,
                    'item_type' => 'lesson',
                    'order' => (int) $les->order,
                    'title' => $les->title,
                    'type' => $les->type ?? 'video',
                    'duration' => $durationText,
                    'duration_seconds' => $durationSec,
                    'status' => $les->status,
                    'video_url' => $les->video_url,
                    'content' => $les->type === 'article' ? $les->content : null,
                    'quizData' => $lessonQuizData,
                ];

                // Check if any quiz is attached AFTER this lesson
                $afterLessonQuizzes = $allAttachments->where('position', 'after_lesson')
                    ->where('after_lesson_id', $les->id);

                foreach ($afterLessonQuizzes as $att) {
                    if (!$att->quiz) continue;
                    $quiz = $att->quiz;
                    $moduleItems[] = [
                        'id' => 'quiz-' . $quiz->id,
                        'item_type' => 'quiz',
                        'attachment_id' => $att->id,
                        'quiz_id' => $quiz->id,
                        'order' => (int) ($att->order ?: ($les->order + 0.5)),
                        'title' => '📝 ' . ($quiz->title ?? 'Bài kiểm tra'),
                        'type' => 'quiz',
                        'position' => 'after_lesson',
                        'after_lesson_id' => $les->id,
                        'duration' => ($quiz->time_limit_minutes ?? 15) . ' phút',
                        'duration_seconds' => ($quiz->time_limit_minutes ?? 15) * 60,
                        'status' => $quiz->status ?? 'published',
                        'time_limit_minutes' => $quiz->time_limit_minutes ?? 15,
                        'passing_score' => $quiz->passing_score ?? 70,
                        'total_questions' => $quiz->questions ? $quiz->questions->count() : ($quiz->total_questions ?? 0),
                        'content' => $quiz->description,
                        'quizData' => [
                            'id' => $quiz->id,
                            'title' => $quiz->title,
                            'time_limit_minutes' => $quiz->time_limit_minutes,
                            'passing_score' => $quiz->passing_score,
                            'questions' => $quiz->questions ? $quiz->questions->map(function ($q) {
                                return [
                                    'id' => $q->id,
                                    'content' => $q->content,
                                    'order' => $q->order,
                                    'answers' => $q->answers ? $q->answers->map(function ($a) {
                                        return [
                                            'id' => $a->id,
                                            'content' => $a->content,
                                            'is_correct' => (bool) $a->is_correct,
                                        ];
                                    })->toArray() : [],
                                ];
                            })->toArray() : [],
                        ],
                    ];
                }
            }

            // Get quizzes attached IN MODULE
            $inModuleQuizzes = $allAttachments->where('position', 'in_module')
                ->where('module_id', $mod->id);

            foreach ($inModuleQuizzes as $att) {
                if (!$att->quiz) continue;
                $quiz = $att->quiz;
                $moduleItems[] = [
                    'id' => 'quiz-' . $quiz->id,
                    'item_type' => 'quiz',
                    'attachment_id' => $att->id,
                    'quiz_id' => $quiz->id,
                    'order' => (int) ($att->order ?: 999),
                    'title' => '📝 ' . ($quiz->title ?? 'Bài kiểm tra'),
                    'type' => 'quiz',
                    'position' => 'in_module',
                    'module_id' => $mod->id,
                    'duration' => ($quiz->time_limit_minutes ?? 15) . ' phút',
                    'duration_seconds' => ($quiz->time_limit_minutes ?? 15) * 60,
                    'status' => $quiz->status ?? 'published',
                    'time_limit_minutes' => $quiz->time_limit_minutes ?? 15,
                    'passing_score' => $quiz->passing_score ?? 70,
                    'total_questions' => $quiz->questions ? $quiz->questions->count() : ($quiz->total_questions ?? 0),
                    'content' => $quiz->description,
                    'quizData' => [
                        'id' => $quiz->id,
                        'title' => $quiz->title,
                        'time_limit_minutes' => $quiz->time_limit_minutes,
                        'passing_score' => $quiz->passing_score,
                    ],
                ];
            }

            // Sort module items by order
            usort($moduleItems, function ($a, $b) {
                return $a['order'] <=> $b['order'];
            });

            $structuredModules[] = [
                'id' => $mod->id,
                'order' => $mod->order ?: $modOrder,
                'title' => $mod->title,
                'status' => $mod->status ?? 'published',
                'lessons' => $moduleItems,
                'items' => $moduleItems,
            ];

            $modOrder++;
        }

        // 3. Handle end of course / capability assessment quizzes
        $endOfCourseQuizzes = $allAttachments->whereIn('position', ['end_of_course', 'capability_assessment']);
        if ($endOfCourseQuizzes->isNotEmpty()) {
            $finalItems = [];
            $fOrder = 1;
            foreach ($endOfCourseQuizzes as $att) {
                if (!$att->quiz) continue;
                $quiz = $att->quiz;
                $finalItems[] = [
                    'id' => 'quiz-' . $quiz->id,
                    'item_type' => 'quiz',
                    'attachment_id' => $att->id,
                    'quiz_id' => $quiz->id,
                    'order' => (int) ($att->order ?: $fOrder),
                    'title' => '🏆 ' . ($quiz->title ?? 'Bài kiểm tra cuối khóa'),
                    'type' => 'quiz',
                    'position' => $att->position,
                    'duration' => ($quiz->time_limit_minutes ?? 15) . ' phút',
                    'duration_seconds' => ($quiz->time_limit_minutes ?? 15) * 60,
                    'status' => $quiz->status ?? 'published',
                    'time_limit_minutes' => $quiz->time_limit_minutes ?? 15,
                    'passing_score' => $quiz->passing_score ?? 70,
                    'total_questions' => $quiz->questions ? $quiz->questions->count() : ($quiz->total_questions ?? 0),
                    'content' => $quiz->description,
                    'quizData' => [
                        'id' => $quiz->id,
                        'title' => $quiz->title,
                        'time_limit_minutes' => $quiz->time_limit_minutes,
                        'passing_score' => $quiz->passing_score,
                    ],
                ];
                $fOrder++;
            }

            if (!empty($finalItems)) {
                $structuredModules[] = [
                    'id' => 'final-assessment-module',
                    'order' => $modOrder,
                    'title' => 'Bài kiểm tra cuối khóa & Đánh giá năng lực',
                    'status' => 'published',
                    'is_final_module' => true,
                    'lessons' => $finalItems,
                    'items' => $finalItems,
                ];
            }
        }

        return $structuredModules;
    }
}
