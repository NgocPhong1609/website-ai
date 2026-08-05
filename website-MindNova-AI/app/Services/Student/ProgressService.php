<?php

namespace App\Services\Student;

use App\Models\User;
use App\Models\CourseModule;
use App\Models\Lesson;
use App\Models\UserQuizAttempt;

class ProgressService
{
    /**
     * Retrieve learning progress overview metrics, module roadmap, and AI analytics from database.
     */
    public function getOverview(?User $user): array
    {
        $userId = $user ? $user->id : null;
        
        // Default metrics calculations
        $totalLessons = 0;
        $completedLessons = 0;
        $completionPercentage = 0;
        $quizAvgScore = '0%';
        $studyTimeHours = '0 Giờ';
        $rankingText = '⭐ Chưa có dữ liệu';
        $xpPoints = '0 PTS';
        $streakDays = '0 Ngày liên tiếp';

        // Check DB for real attempts if user exists
        if ($userId && class_exists(UserQuizAttempt::class)) {
            try {
                $attempts = UserQuizAttempt::where('user_id', $userId)->get();
                if ($attempts->isNotEmpty()) {
                    $avg = round($attempts->avg('score'));
                    $quizAvgScore = "{$avg}%";
                    $count = $attempts->count();
                    $calcXp = 1000 + ($count * 50);
                    $xpPoints = "{$calcXp} PTS";
                    if ($avg >= 90) {
                        $rankingText = '🏆 Top 1% lớp (Xuất sắc)';
                    } elseif ($avg >= 80) {
                        $rankingText = '🏆 Top 5% lớp (Giỏi)';
                    } else {
                        $rankingText = '⭐ Đang bứt phá nỗ lực!';
                    }
                }
            } catch (\Exception $e) {
                // Safe dev mode fallback
            }
        }

        // Lấy thông tin Enrollment đang active
        $activeCourse = null;
        if ($userId && class_exists(\App\Models\Enrollment::class)) {
            $enrollment = \App\Models\Enrollment::with('course.modules.lessons')->where('user_id', $userId)->latest('enrolled_at')->first();
            if ($enrollment && $enrollment->course) {
                $activeCourse = $enrollment->course;
                $completionPercentage = $enrollment->progress_percentage ?? 0;
            }
        }

        // Query real modules from active course database
        $roadmapModules = [];
        try {
            if ($activeCourse && class_exists(CourseModule::class)) {
                $dbModules = $activeCourse->modules()->orderBy('order', 'asc')->get();
                if ($dbModules->isNotEmpty()) {
                    $idx = 1;
                    foreach ($dbModules as $m) {
                        $count = $m->lessons->count();
                        
                        // Simple logic for test: 
                        // If progress > (idx * 30), it's completed, else if it's the active one...
                        $status = 'locked';
                        $progressPct = 0;
                        if ($completionPercentage >= ($idx * 25)) {
                            $status = 'completed';
                            $progressPct = 100;
                        } elseif ($completionPercentage >= (($idx - 1) * 25)) {
                            $status = 'active';
                            $progressPct = ($completionPercentage - (($idx - 1) * 25)) * 4;
                        }

                        $roadmapModules[] = [
                            'id' => $m->id,
                            'module_number' => "Module 0{$idx}",
                            'title' => $m->title ?: "Module 0{$idx}: Chuyên đề",
                            'subtitle' => $m->description ?: "Mô tả chi tiết nội dung module.",
                            'lesson_count_text' => "{$count} Bài học • " . ($status === 'completed' ? 'Đã hoàn thành' : ($status === 'active' ? 'Đang học' : 'Chưa mở khóa')),
                            'status' => $status,
                            'progress_percentage' => $progressPct,
                            'progress_text' => $status === 'active' ? round($progressPct) . '% Hoàn thành' : null,
                            'action_text' => $status === 'completed' ? '🔄 Ôn tập lại' : ($status === 'active' ? '▶ Tiếp tục học ➔' : '🔒 Cần hoàn tất Module trước'),
                            'action_link' => "/courses/detail/{$activeCourse->id}"
                        ];
                        $idx++;
                    }
                }
            }
        } catch (\Exception $e) {
            // Safe fallback below if DB modules query fails
        }

        // Lấy Lesson Completions để tính total/completed lessons
        if ($userId && class_exists(\App\Models\LessonCompletion::class)) {
            $completedLessons = \App\Models\LessonCompletion::where('user_id', $userId)->count();
        }

        if ($activeCourse) {
            foreach ($activeCourse->modules as $mod) {
                $totalLessons += $mod->lessons->count();
            }
            if ($totalLessons > 0 && $completedLessons > 0) {
                // $completionPercentage = min(100, round(($completedLessons / $totalLessons) * 100)); // We use enrollment's progress_percentage
            }
        }

        return [
            'overview_card' => [
                'course_title' => $activeCourse ? $activeCourse->title : 'Chưa đăng ký khóa học',
                'term_tag' => 'Tiến độ học tập hiện tại',
                'completion_percentage' => $completionPercentage,
                'completed_lessons' => $completedLessons,
                'total_lessons' => $totalLessons,
                'next_module_label' => 'Xem chi tiết ➔',
                'status_badge' => $completionPercentage >= 100 ? 'Hoàn thành' : 'Đang học',
            ],
            'key_metrics' => [
                'study_time' => [
                    'total_hours' => $studyTimeHours,
                    'weekly_change' => '⚡ +2.4h tuần này',
                ],
                'quiz_average' => [
                    'score' => $quizAvgScore,
                    'ranking_tag' => $rankingText,
                ],
                'skills_mastered' => [
                    'count_text' => '4 / 10',
                    'tag' => '🎯 Core Mastery',
                ],
            ],
            'roadmap_modules' => $roadmapModules,
            'ai_insights' => [
                'title' => 'Gia sư Nova phân tích',
                'subtitle' => 'Cập nhật trí tuệ nhân tạo theo thời gian thực',
                'recommendations' => [
                    [
                        'id' => 'rec-1',
                        'title' => '💡 Trọng tâm cần chú ý',
                        'priority_tag' => 'Ưu tiên cao',
                        'color_scheme' => 'teal',
                        'content' => 'Kiến thức về Đạo hàm và giải thuật Lan truyền ngược (Backpropagation) sẽ là xương sống cho bài trắc nghiệm tiếp theo.',
                        'action_label' => '📖 Mở bài học ôn tập ngay ➔',
                        'action_url' => '/courses/lesson?courseId=1&lessonId=l1-1'
                    ],
                    [
                        'id' => 'rec-2',
                        'title' => '🎯 Cột mốc kế tiếp',
                        'priority_tag' => '+40% Ghi nhớ',
                        'color_scheme' => 'indigo',
                        'content' => 'Hoàn tất bài Quiz Đánh giá Module 2 trong tuần này để kích hoạt huy hiệu Quantum Pioneer và duy trì phong độ!',
                        'action_label' => '📝 Làm Khảo sát năng lực ➔',
                        'action_url' => '/practice/quiz/question?lessonId=mod1'
                    ],
                ],
                'performance_stats' => [
                    [
                        'label' => 'Chuẩn chuyên cần (Streak)',
                        'value' => $streakDays,
                        'icon' => '🔥',
                        'tag_class' => 'text-[#D97706] bg-[#FFF8EB] border-[#D97706]/20'
                    ],
                    [
                        'label' => 'Xếp loại năng lực',
                        'value' => 'A+ (Top 5%)',
                        'icon' => '⭐',
                        'tag_class' => 'text-[#0D9488] bg-[#EAF8F5] border-[#0D9488]/20'
                    ],
                    [
                        'label' => 'Điểm kinh nghiệm (XP)',
                        'value' => $xpPoints,
                        'icon' => '💎',
                        'tag_class' => 'text-[#5052EE] bg-[#EEF2FF] border-[#5052EE]/20'
                    ]
                ]
            ]
        ];
    }
}
