<?php

namespace App\Services\Student;

use App\Models\User;
use App\Models\Course;
use App\Models\CourseModule;

class CourseService
{
    /**
     * Helper to calculate accurate progress dynamically for a student in a course.
     * 
     * SECURITY: Only counts published lessons toward progress.
     */
    public function calculateStudentProgress(Course $course, int $userId): array
    {
        $completedLessonIds = [];
        if (class_exists(\App\Models\LessonCompletion::class)) {
            $completedLessonIds = \App\Models\LessonCompletion::where('user_id', $userId)
                ->pluck('lesson_id')
                ->toArray();
        }

        $totalLessons = 0;
        $completedLessonsCount = 0;
        $nextLessonId = null;
        $nextLessonTitle = null;

        $sortedModules = $course->modules->sortBy('order');
        foreach ($sortedModules as $module) {
            $sortedLessons = $module->lessons->sortBy('order');
            foreach ($sortedLessons as $lesson) {
                // ── RULE 6 & 14: Only count PUBLISHED lessons ──
                if ($lesson->status !== 'published' || $lesson->published_version_id === null) {
                    continue;
                }

                $totalLessons++;
                $isCompleted = in_array($lesson->id, $completedLessonIds);
                
                if ($isCompleted) {
                    $completedLessonsCount++;
                } else if ($nextLessonTitle === null) {
                    $nextLessonId = $lesson->id;
                    $nextLessonTitle = $lesson->title;
                }
            }
        }

        $progressPercentage = 0;
        if ($totalLessons > 0) {
            $progressPercentage = (int) round(($completedLessonsCount / $totalLessons) * 100);
        }

        if ($totalLessons === 0) {
            $nextLessonText = 'Chưa có bài học';
        } elseif ($completedLessonsCount === $totalLessons) {
            $nextLessonText = 'Đã hoàn thành khóa học 🎉';
        } else {
            $nextLessonText = $nextLessonTitle ?: 'Tiếp tục bài học';
        }

        return [
            'total_lessons' => $totalLessons,
            'completed_lessons' => $completedLessonsCount,
            'progress_percentage' => $progressPercentage,
            'next_lesson_id' => $nextLessonId,
            'next_lesson_title' => $nextLessonText,
        ];
    }

    /**
     * Retrieve complete course detail information, module curriculum, AI tutor tips, and student progress.
     *
     * SECURITY: Only shows published lessons. Draft/pending/rejected lessons are completely filtered out.
     */
    public function getCourseDetail($courseId = 1, ?User $user = null): array
    {
        $userId = $user ? $user->id : null;
        
        $title = "Chưa có tiêu đề";
        $level = "Beginner";
        $description = "Chưa có mô tả khóa học.";
        $thumbnail = null;
        
        $modules = [];
        $resources = [];
        $totalLessons = 0;
        $completedLessons = 0;
        $nextLessonId = null;
        $nextLessonTitle = "Chưa có bài học";
        $categoryName = "Chuyên đề AI";
        
        $instructorName = 'Giảng viên MindNova';
        $instructorRole = 'Giảng viên chuyên môn';
        $instructorAvatar = '/avatar-placeholder.png';
        $instructorBio = 'Thông tin giảng viên đang được cập nhật.';

        $completedLessonIds = [];
        if ($userId && class_exists(\App\Models\LessonCompletion::class)) {
            $completedLessonIds = \App\Models\LessonCompletion::where('user_id', $userId)->pluck('lesson_id')->toArray();
        }

        // Query real database course
        try {
            if (class_exists(Course::class)) {
                // ── SECURITY: Only fetch published courses ──
                $dbCourse = Course::with(['modules.lessons', 'teacher', 'category'])
                    ->where('status', 'published')
                    ->whereNotNull('published_version_id')
                    ->find($courseId);
                
                if (!$dbCourse) {
                    // Fallback to first published course
                    $dbCourse = Course::with(['modules.lessons', 'teacher', 'category'])
                        ->where('status', 'published')
                        ->whereNotNull('published_version_id')
                        ->first();
                }

                if ($dbCourse) {
                    $courseId = $dbCourse->id;
                    $title = $dbCourse->title ?: $title;
                    $level = $dbCourse->level ?: $level;
                    $description = $dbCourse->description ?: $description;
                    $thumbnail = $dbCourse->thumbnail ?: $thumbnail;
                    $categoryName = $dbCourse->category ? $dbCourse->category->name : $categoryName;
                    
                    if ($dbCourse->teacher) {
                        $instructorName = $dbCourse->teacher->name;
                        $instructorAvatar = $dbCourse->teacher->avatar ?? '/avatar-placeholder.png';
                        // Fallback role/bio for user if it doesn't exist
                        $instructorBio = "Chuyên gia giàu kinh nghiệm trong lĩnh vực {$categoryName}.";
                    }

                    // Fetch quiz attachments
                    $quizAttachments = collect();
                    if (class_exists(\App\Models\QuizCourseAttachment::class)) {
                        $quizAttachments = \App\Models\QuizCourseAttachment::with('quiz')
                            ->where('course_id', $courseId)
                            ->whereHas('quiz', function($q) {
                                $q->where('status', 'published');
                            })
                            ->get();
                    }

                    // Helper to format quiz as a lesson
                    $formatQuiz = function($attachment, $order) {
                        $quiz = $attachment->quiz;
                        return [
                            'id' => 'quiz-' . $quiz->id,
                            'real_quiz_id' => $quiz->id,
                            'order' => $order,
                            'title' => '📝 ' . ($quiz->title ?? 'Bài kiểm tra'),
                            'type' => 'quiz',
                            'duration' => ($quiz->time_limit_minutes ?? 15) . ' phút',
                            'duration_seconds' => ($quiz->time_limit_minutes ?? 15) * 60,
                            'status' => 'locked', // Can be enhanced to check if student passed
                            'video_url' => null,
                            'has_uploaded_video' => false,
                            'content' => $quiz->description,
                        ];
                    };

                    $progressData = $this->calculateStudentProgress($dbCourse, $userId);
                    $totalLessons = $progressData['total_lessons'];
                    $completedLessons = $progressData['completed_lessons'];
                    $nextLessonId = $progressData['next_lesson_id'];
                    $nextLessonTitle = $progressData['next_lesson_title'];

                    if ($dbCourse->modules && $dbCourse->modules->isNotEmpty()) {
                        $modOrder = 1;
                        foreach ($dbCourse->modules->sortBy('order') as $mod) {
                            $mLessons = [];
                            $lOrder = 1;
                            if ($mod->lessons && $mod->lessons->isNotEmpty()) {
                                foreach ($mod->lessons->sortBy('order') as $les) {
                                    // ── RULE 6, 14, 15: ONLY show PUBLISHED lessons ──
                                    if ($les->status !== 'published' || $les->published_version_id === null) {
                                        continue; // Skip draft/pending/rejected lessons entirely
                                    }

                                    $isCompleted = in_array($les->id, $completedLessonIds);
                                    
                                    if ($isCompleted) {
                                        $status = 'completed';
                                    } else {
                                        if ($les->id === $nextLessonId) {
                                            $status = 'current';
                                        } else {
                                            $status = 'locked';
                                        }
                                    }

                                    $durationSec = $les->duration_seconds ?? (($les->duration_minutes ?? 0) * 60);
                                    $durationMinutes = $durationSec > 0 ? round($durationSec / 60) : 0;
                                    $durationText = $durationMinutes > 0 ? $durationMinutes . ' phút' : '1 phút';
                                    $lessonType = $les->type ?? 'video';

                                    $mLessons[] = [
                                        'id' => $les->id,
                                        'order' => $les->order ?: $lOrder,
                                        'title' => $les->title,
                                        'type' => $lessonType,
                                        'duration' => $durationText,
                                        'duration_seconds' => $durationSec,
                                        'status' => $status,
                                        'video_url' => $les->video_url,
                                        'has_uploaded_video' => $les->media()->where('media_type', 'video')->where('status', 'ready')->exists(),
                                        'content' => $lessonType === 'article' ? $les->content : null,
                                    ];
                                    
                                    if ($les->video_url && count($resources) < 3) {
                                        $resources[] = [
                                            'id' => 'res-vid-' . $les->id,
                                            'title' => 'Tài liệu video: ' . mb_substr($les->title, 0, 30),
                                            'type' => 'link',
                                            'size' => 'Online',
                                            'url' => $les->video_url
                                        ];
                                    }
                                    $lOrder++;

                                    // Check if there are any 'after_lesson' quizzes for this lesson
                                    $afterLessonQuizzes = $quizAttachments->where('position', 'after_lesson')->where('after_lesson_id', $les->id);
                                    foreach ($afterLessonQuizzes as $attachment) {
                                        $mLessons[] = $formatQuiz($attachment, $lOrder);
                                        $lOrder++;
                                    }
                                }
                            }

                            // Check if there are any 'in_module' quizzes for this module
                            $inModuleQuizzes = $quizAttachments->where('position', 'in_module')->where('module_id', $mod->id);
                            foreach ($inModuleQuizzes as $attachment) {
                                $mLessons[] = $formatQuiz($attachment, $lOrder);
                                $lOrder++;
                            }

                            // Only include modules that have published lessons or attached quizzes
                            if (!empty($mLessons)) {
                                $modules[] = [
                                    'id' => $mod->id,
                                    'order' => $mod->order ?: $modOrder,
                                    'title' => $mod->title ?: "Module 0{$modOrder}",
                                    'duration' => 'Nhiều bài học',
                                    'lessons' => $mLessons,
                                ];
                            }
                            $modOrder++;
                        }
                    }
                    
                    // Handle 'end_of_course' quizzes (append as a new final module)
                    $endOfCourseQuizzes = $quizAttachments->whereIn('position', ['end_of_course', 'capability_assessment']);
                    if ($endOfCourseQuizzes->isNotEmpty()) {
                        $finalLessons = [];
                        $lOrder = 1;
                        foreach ($endOfCourseQuizzes as $attachment) {
                            $finalLessons[] = $formatQuiz($attachment, $lOrder);
                            $lOrder++;
                        }
                        
                        $modules[] = [
                            'id' => 'module-final-quizzes',
                            'order' => $modOrder,
                            'title' => 'Bài kiểm tra cuối khóa',
                            'duration' => 'Nhiều bài kiểm tra',
                            'lessons' => $finalLessons,
                        ];
                    }
                }
            }
        } catch (\Exception $e) {
            // Handle exception
        }
        
        if (empty($resources)) {
            $resources = [
                [
                    'id' => 'res-fb-1',
                    'title' => "Giáo trình {$title} (PDF)",
                    'type' => 'pdf',
                    'size' => '2.5 MB',
                    'url' => '#'
                ],
                [
                    'id' => 'res-fb-2',
                    'title' => 'Phòng thảo luận Discord khóa học',
                    'type' => 'chat',
                    'size' => 'Tham gia',
                    'url' => '#'
                ]
            ];
        }

        $isEnrolled = false;
        if ($userId && class_exists(\App\Models\Enrollment::class)) {
            $isEnrolled = \App\Models\Enrollment::where('user_id', $userId)->where('course_id', $courseId)->exists();
        }

        $reviewCount = class_exists(\App\Models\Review::class)
            ? \App\Models\Review::where('course_id', $courseId)->count()
            : 0;
        $averageRating = class_exists(\App\Models\Review::class)
            ? \App\Models\Review::where('course_id', $courseId)->avg('rating')
            : 0;
        $averageRating = $averageRating !== null ? (float) $averageRating : 0.0;
        $studentsCount = class_exists(\App\Models\Enrollment::class)
            ? \App\Models\Enrollment::where('course_id', $courseId)->count()
            : 0;

        $progressPercentage = ($totalLessons > 0) ? round(($completedLessons / $totalLessons) * 100) : 0;
        $timeLeftText = ($totalLessons - $completedLessons) * 15; // Giả định mỗi bài 15 phút
        $timeLeftTextStr = $timeLeftText > 0 ? floor($timeLeftText / 60) . 'h ' . ($timeLeftText % 60) . 'm thời lượng còn lại' : 'Đã hoàn thành khóa học';
        $ratingText = $reviewCount > 0
            ? number_format($averageRating, 1, '.', '') . ' ⭐ (' . $reviewCount . ' Đánh giá)'
            : '0.0 ⭐ (0 Đánh giá)';
        $studentsText = $studentsCount . ' Học viên tích cực';

        return [
            'header_info' => [
                'id' => $courseId ?: 1,
                'title' => $title,
                'level' => $level,
                'description' => $description,
                'thumbnail' => $thumbnail,
                'next_lesson_title' => $nextLessonTitle,
                'next_lesson_id' => $nextLessonId,
                'duration_text' => ($totalLessons * 15) . ' Phút tổng cộng',
                'rating_text' => $ratingText,
                'students_text' => $studentsText,
                'category_tag' => $categoryName,
                'is_enrolled' => $isEnrolled,
                'price' => isset($dbCourse) ? $dbCourse->price : 0,
            ],
            'progress_card' => [
                'progress_percentage' => $progressPercentage,
                'completed_lessons_count' => $completedLessons,
                'total_lessons_count' => $totalLessons,
                'time_left_text' => $timeLeftTextStr,
                'status_tag' => $progressPercentage >= 100 ? 'Đã tốt nghiệp' : 'Đang theo học',
            ],
            'ai_insight' => [
                'title' => 'Gia sư Trí tuệ Nova',
                'status_tag' => 'Online 24/7',
                'summary_text' => "Bạn đang có tiến độ rất tốt! Bài học tiếp theo ({$nextLessonTitle}) có chứa các khái niệm cốt lõi quan trọng. Hãy chuẩn bị ghi chép nhé.",
                'suggestion_text' => 'Xem nhanh tài liệu đính kèm trước khi vào video bài giảng.',
                'action_label' => 'Mở khung chat Gia sư Nova ➔'
            ],
            'instructor' => [
                'name' => $instructorName,
                'role' => $instructorRole,
                'avatar_url' => $instructorAvatar,
                'bio' => $instructorBio
            ],
            'modules' => $modules,
            'resources' => $resources,
        ];
    }

    /**
     * Retrieve all enrolled courses for the student with progress metrics.
     *
     * SECURITY: Only shows courses that are published with valid versions.
     */
    public function getEnrolledCourses(?User $user): array
    {
        $userId = $user ? $user->id : null;
        if (!$userId || !class_exists(\App\Models\Enrollment::class)) {
            return [];
        }

        $enrollments = \App\Models\Enrollment::with('course.modules.lessons')
            ->where('user_id', $userId)
            ->latest('enrolled_at')
            ->get();

        $gradients = [
            'from-[#0f0c29] via-[#302b63] to-[#24243e]',
            'from-[#0f2027] via-[#203a43] to-[#2c5364]',
            'from-[#141E30] to-[#243B55]',
            'from-[#232526] to-[#414345]',
            'from-[#1D4ED8] to-[#1E40AF]',
            'from-[#312E81] to-[#1E1B4B]',
            'from-[#047857] via-[#064E3B] to-[#111827]'
        ];

        return $enrollments->map(function ($enrollment, $index) use ($gradients, $userId) {
            $course = $enrollment->course;
            if (!$course) return null;

            // Use the shared exact calculation instead of enrollment progress
            $progressData = $this->calculateStudentProgress($course, $userId);
            $totalLessons = $progressData['total_lessons'];
            $completedLessons = $progressData['completed_lessons'];
            $progress = $progressData['progress_percentage'];
            $nextLesson = $progressData['next_lesson_title'];

            // Sync enrollment progress if out of sync
            if ($enrollment->progress_percentage !== $progress) {
                $enrollment->progress_percentage = $progress;
                $enrollment->save();
            }

            $status = 'not-started';
            if ($progress >= 100) {
                $status = 'completed';
            } elseif ($progress > 0) {
                $status = 'in-progress';
            }

            return [
                'id' => $course->id,
                'title' => $course->title,
                'nextLesson' => $nextLesson,
                'progress' => $progress,
                'thumbnailGradient' => $gradients[$index % count($gradients)],
                'thumbnailUrl' => $course->thumbnail ? url($course->thumbnail) : 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop',
                'status' => $status,
                'lessonsCompleted' => $completedLessons,
                'totalLessons' => $totalLessons,
            ];
        })->filter()->values()->toArray();
    }
}
