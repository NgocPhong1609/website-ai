<?php

namespace App\Services\Student;

use App\Models\User;
use App\Models\Course;
use App\Models\CourseModule;

class CourseService
{
    /**
     * Retrieve complete course detail information, module curriculum, AI tutor tips, and student progress.
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
                // Fetch course with teacher and category
                $dbCourse = Course::with(['modules.lessons', 'teacher', 'category'])->find($courseId);
                
                if (!$dbCourse) {
                    $dbCourse = Course::with(['modules.lessons', 'teacher', 'category'])->first();
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

                    if ($dbCourse->modules && $dbCourse->modules->isNotEmpty()) {
                        $modOrder = 1;
                        $foundCurrent = false;

                        foreach ($dbCourse->modules as $mod) {
                            $mLessons = [];
                            if ($mod->lessons && $mod->lessons->isNotEmpty()) {
                                $lOrder = 1;
                                foreach ($mod->lessons as $les) {
                                    $totalLessons++;
                                    $isCompleted = in_array($les->id, $completedLessonIds);
                                    
                                    if ($isCompleted) {
                                        $status = 'completed';
                                        $completedLessons++;
                                    } else {
                                        if (!$foundCurrent) {
                                            $status = 'current';
                                            $foundCurrent = true;
                                            $nextLessonId = $les->id;
                                            $nextLessonTitle = $les->title;
                                        } else {
                                            $status = 'locked';
                                        }
                                    }

                                    // Determine duration: prefer duration_seconds, fallback to duration_minutes * 60
                                    $durationSec = $les->duration_seconds ?? (($les->duration_minutes ?? 0) * 60);
                                    $durationMinutes = $durationSec > 0 ? round($durationSec / 60) : 0;
                                    $durationText = $durationMinutes > 0 ? $durationMinutes . ' phút' : '1 phút';

                                    // Determine lesson type
                                    $lessonType = $les->type ?? 'video';

                                    // Build lesson item
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
                                    
                                    // Extract resource from lesson if it has video
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
                                }
                            }
                            $modules[] = [
                                'id' => $mod->id,
                                'order' => $mod->order ?: $modOrder,
                                'title' => $mod->title ?: "Module 0{$modOrder}",
                                'duration' => 'Nhiều bài học',
                                'lessons' => $mLessons,
                            ];
                            $modOrder++;
                        }
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

        $progressPercentage = ($totalLessons > 0) ? round(($completedLessons / $totalLessons) * 100) : 0;
        $timeLeftText = ($totalLessons - $completedLessons) * 15; // Giả định mỗi bài 15 phút
        $timeLeftTextStr = $timeLeftText > 0 ? floor($timeLeftText / 60) . 'h ' . ($timeLeftText % 60) . 'm thời lượng còn lại' : 'Đã hoàn thành khóa học';

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
                'rating_text' => '4.9 ⭐ (' . rand(100, 500) . ' Đánh giá)',
                'students_text' => rand(500, 2000) . ' Học viên tích cực',
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

        return $enrollments->map(function ($enrollment, $index) use ($gradients) {
            $course = $enrollment->course;
            if (!$course) return null;

            $totalLessons = 0;
            $progress = $enrollment->progress_percentage ?? 0;

            if ($course->modules) {
                foreach ($course->modules as $mod) {
                    $totalLessons += $mod->lessons ? $mod->lessons->count() : 0;
                }
            }
            
            $completedLessons = round(($progress / 100) * $totalLessons);
            $nextLesson = 'Tiếp tục học phần mới';

            $status = 'not-started';
            if ($progress >= 100) {
                $status = 'completed';
                $nextLesson = 'Đã hoàn thành khóa học 🎉';
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
