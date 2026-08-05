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

                                    $mLessons[] = [
                                        'id' => $les->id,
                                        'order' => $les->order ?: $lOrder,
                                        'title' => $les->title,
                                        'duration' => $les->duration_seconds ? round($les->duration_seconds / 60) . ' phút' : '15 phút',
                                        'status' => $status,
                                        'video_url' => $les->video_url,
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
}
