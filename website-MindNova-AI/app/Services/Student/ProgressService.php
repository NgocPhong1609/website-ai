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
        $studyTimeWeeklyChange = '⚡ +0h tuần này';
        $rankingText = '⭐ Chưa có dữ liệu';
        $performanceRating = 'Chưa xếp loại';
        $xpPoints = '0 PTS';
        $streakDays = '0 Ngày liên tiếp';
        $skillsMasteredText = '0 / 0';
        $skillsMasteredTag = '🌱 Bắt đầu học';

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
                        $performanceRating = 'S (Xuất sắc)';
                    } elseif ($avg >= 80) {
                        $rankingText = '🏆 Top 5% lớp (Giỏi)';
                        $performanceRating = 'A+ (Giỏi)';
                    } else {
                        $rankingText = '⭐ Đang bứt phá nỗ lực!';
                        $performanceRating = 'B (Khá)';
                    }
                }
            } catch (\Exception $e) {
                // Safe dev mode fallback
            }
        }

        // Streak calculation
        if ($userId && class_exists(\App\Models\UserStreak::class)) {
            $streak = \App\Models\UserStreak::where('user_id', $userId)->first();
            if ($streak) {
                $streakDays = "{$streak->current_streak} Ngày liên tiếp";
            }
        }

        // Study Time calculation
        if ($userId && class_exists(\App\Models\LessonCompletion::class) && class_exists(\App\Models\Lesson::class)) {
            $completions = \Illuminate\Support\Facades\DB::table('lesson_completions')
                ->join('lessons', 'lesson_completions.lesson_id', '=', 'lessons.id')
                ->where('lesson_completions.user_id', $userId)
                ->select('lesson_completions.completed_at', 'lessons.duration_seconds')
                ->get();
            
            if ($completions->isNotEmpty()) {
                $totalSeconds = $completions->sum('duration_seconds');
                $studyTimeHours = round($totalSeconds / 3600, 1) . ' Giờ';

                $now = \Carbon\Carbon::now();
                $thisWeekSeconds = $completions->filter(function($c) use ($now) {
                    return \Carbon\Carbon::parse($c->completed_at)->greaterThanOrEqualTo($now->copy()->subDays(7));
                })->sum('duration_seconds');

                $lastWeekSeconds = $completions->filter(function($c) use ($now) {
                    return \Carbon\Carbon::parse($c->completed_at)->between($now->copy()->subDays(14), $now->copy()->subDays(7));
                })->sum('duration_seconds');

                $diffHours = round(($thisWeekSeconds - $lastWeekSeconds) / 3600, 1);
                $sign = $diffHours >= 0 ? '+' : '';
                $studyTimeWeeklyChange = "⚡ {$sign}{$diffHours}h tuần này";
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
            
            if ($activeCourse && class_exists(\App\Models\KnowledgeTopic::class)) {
                $totalTopics = \App\Models\KnowledgeTopic::where('course_id', $activeCourse->id)->count();
                if ($totalTopics > 0) {
                    $masteredCount = \Illuminate\Support\Facades\DB::table('user_topic_performance')
                        ->join('knowledge_topics', 'user_topic_performance.topic_id', '=', 'knowledge_topics.id')
                        ->where('user_topic_performance.user_id', $userId)
                        ->where('knowledge_topics.course_id', $activeCourse->id)
                        ->where('user_topic_performance.accuracy_percentage', '>=', 80)
                        ->count();

                    $skillsMasteredText = "{$masteredCount} / {$totalTopics}";
                    if ($masteredCount === $totalTopics) {
                        $skillsMasteredTag = '🏆 Mastered All';
                    } elseif ($masteredCount > 0) {
                        $skillsMasteredTag = '🎯 Core Mastery';
                    } else {
                        $skillsMasteredTag = '🌱 Đang phát triển';
                    }
                }
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

        // Dynamic AI Recommendations
        $activeModule = collect($roadmapModules)->firstWhere('status', 'active');
        $nextActionUrl = $activeModule ? $activeModule['action_link'] : "/courses";
        
        $weakestTopic = null;
        if ($userId && $activeCourse && class_exists(\App\Models\KnowledgeTopic::class)) {
            $weakestTopic = \Illuminate\Support\Facades\DB::table('user_topic_performance')
                    ->join('knowledge_topics', 'user_topic_performance.topic_id', '=', 'knowledge_topics.id')
                    ->where('user_topic_performance.user_id', $userId)
                    ->where('knowledge_topics.course_id', $activeCourse->id)
                    ->orderBy('user_topic_performance.accuracy_percentage', 'asc')
                    ->select('knowledge_topics.name', 'user_topic_performance.accuracy_percentage')
                    ->first();
        }

        $recommendations = [];
        if ($activeModule) {
            $recommendations[] = [
                'id' => 'rec-1',
                'title' => '🎯 Cột mốc kế tiếp',
                'priority_tag' => 'Ưu tiên cao',
                'color_scheme' => 'indigo',
                'content' => "Tiếp tục hoàn thành '{$activeModule['title']}' để duy trì nhịp độ học tập của bạn.",
                'action_label' => '▶ Tiếp tục học ➔',
                'action_url' => $nextActionUrl
            ];
        }

        if ($weakestTopic && $weakestTopic->accuracy_percentage < 80) {
            $recommendations[] = [
                'id' => 'rec-2',
                'title' => '💡 Trọng tâm cần ôn tập',
                'priority_tag' => '+40% Ghi nhớ',
                'color_scheme' => 'teal',
                'content' => "Kiến thức về '{$weakestTopic->name}' đang cần được củng cố (Hiện tại: {$weakestTopic->accuracy_percentage}%). Hãy làm vài bài tập nhỏ để nắm vững hơn nhé.",
                'action_label' => '📝 Ôn tập chuyên đề ➔',
                'action_url' => "/practice/topic?courseId=" . ($activeCourse ? $activeCourse->id : 1)
            ];
        } else {
            $recommendations[] = [
                'id' => 'rec-2',
                'title' => '🏆 Phong độ xuất sắc',
                'priority_tag' => 'Duy trì',
                'color_scheme' => 'teal',
                'content' => 'Bạn đang làm rất tốt tất cả các chuyên đề! Hãy thử sức với bài kiểm tra tổng hợp để rèn luyện kỹ năng thực tế.',
                'action_label' => '📝 Làm bài Test tổng hợp ➔',
                'action_url' => "/practice/quiz/question?courseId=" . ($activeCourse ? $activeCourse->id : 1)
            ];
        }

        return [
            'overview_card' => [
                'course_title' => $activeCourse ? $activeCourse->title : 'Chưa đăng ký khóa học',
                'term_tag' => 'Tiến độ học tập hiện tại',
                'completion_percentage' => $completionPercentage,
                'completed_lessons' => $completedLessons,
                'total_lessons' => $totalLessons,
                'next_module_label' => $activeModule ? $activeModule['module_number'] . ' ➔' : 'Xem chi tiết ➔',
                'status_badge' => $completionPercentage >= 100 ? 'Hoàn thành' : 'Đang học',
            ],
            'key_metrics' => [
                'study_time' => [
                    'total_hours' => $studyTimeHours,
                    'weekly_change' => $studyTimeWeeklyChange,
                ],
                'quiz_average' => [
                    'score' => $quizAvgScore,
                    'ranking_tag' => $rankingText,
                ],
                'skills_mastered' => [
                    'count_text' => $skillsMasteredText,
                    'tag' => $skillsMasteredTag,
                ],
            ],
            'roadmap_modules' => $roadmapModules,
            'ai_insights' => [
                'title' => 'Gia sư Nova phân tích',
                'subtitle' => 'Cập nhật trí tuệ nhân tạo theo thời gian thực',
                'recommendations' => $recommendations,
                'performance_stats' => [
                    [
                        'label' => 'Chuẩn chuyên cần (Streak)',
                        'value' => $streakDays,
                        'icon' => '🔥',
                        'tag_class' => 'text-[#D97706] bg-[#FFF8EB] border-[#D97706]/20'
                    ],
                    [
                        'label' => 'Xếp loại năng lực',
                        'value' => $performanceRating,
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
