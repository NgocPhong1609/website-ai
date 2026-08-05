<?php

namespace App\Services\Student;

use App\Models\User;
use App\Models\UserQuizAttempt;

class HistoryService
{
    /**
     * Retrieve chronological student learning history, activity timeline, and academic milestones.
     */
    public function getHistory(?User $user): array
    {
        $userId = $user ? $user->id : null;
        
        // Default metrics & activity numbers
        $totalActivities = 142;
        $totalLessons = 142;
        $quizAverage = '88%';
        $studyHours = '48.5';
        $aiLevel = 'Level 8';
        $aiXpText = '80 / 100 XP';
        $aiPercentage = 80;
        $streakLabel = '🔥 Chuỗi 30 ngày chuyên cần';

        // Integrate real quiz attempts into history if available
        $realQuizItems = [];
        if ($userId && class_exists(UserQuizAttempt::class)) {
            try {
                $attempts = UserQuizAttempt::where('user_id', $userId)
                    ->orderBy('created_at', 'desc')
                    ->take(5)
                    ->get();
                    
                if ($attempts->isNotEmpty()) {
                    $totalActivities += $attempts->count();
                    $avg = round($attempts->avg('score'));
                    $quizAverage = "{$avg}%";
                    foreach ($attempts as $att) {
                        $score = $att->score ?? 0;
                        $scoreStatus = ($score >= 80) ? 'Xuất sắc' : (($score >= 60) ? 'Đạt tiêu chuẩn' : 'Cần cố gắng');
                        $realQuizItems[] = [
                            'id' => "attempt-{$att->id}",
                            'type' => 'quiz',
                            'badge_text' => 'Bài đánh giá (Thực tế)',
                            'time_text' => $att->created_at ? $att->created_at->format('H:i A') : 'Vừa xong',
                            'title' => "Khảo sát Trắc nghiệm #{$att->id}",
                            'subtitle' => 'Hệ thống đánh giá chuyên môn MindNova Co-Pilot',
                            'score_text' => "{$score} / 100",
                            'score_status' => $scoreStatus,
                            'action_label' => 'Xem kết quả',
                            'action_url' => '/practice/quiz/result',
                        ];
                    }
                }
            } catch (\Exception $e) {
                // Safedev mode fallback
            }
        }

        $timelineItems = collect();

        // 1. Get real quiz attempts
        if ($userId && class_exists(UserQuizAttempt::class)) {
            try {
                $attempts = UserQuizAttempt::with('quiz.lesson.module.course')->where('user_id', $userId)->get();
                foreach ($attempts as $att) {
                    $score = $att->score ?? 0;
                    $scoreStatus = ($score >= 80) ? 'Xuất sắc' : (($score >= 60) ? 'Đạt tiêu chuẩn' : 'Cần cố gắng');
                    $timelineItems->push([
                        'id' => "attempt-{$att->id}",
                        'type' => 'quiz',
                        'badge_text' => 'Bài đánh giá',
                        'created_at' => $att->created_at,
                        'time_text' => $att->created_at ? $att->created_at->format('H:i A') : '',
                        'date_string' => $att->created_at ? $att->created_at->format('Y-m-d') : now()->format('Y-m-d'),
                        'title' => $att->quiz ? $att->quiz->title : "Khảo sát Trắc nghiệm #{$att->id}",
                        'subtitle' => 'Đánh giá chuyên môn MindNova Co-Pilot',
                        'score_text' => "{$score} / 100",
                        'score_status' => $scoreStatus,
                        'action_label' => 'Xem kết quả',
                        'action_url' => '/practice/quiz/result',
                    ]);
                }
            } catch (\Exception $e) {}
        }

        // 2. Get real lesson completions
        if ($userId && class_exists(\App\Models\LessonCompletion::class)) {
            try {
                $completions = \App\Models\LessonCompletion::with('lesson.module.course')->where('user_id', $userId)->get();
                foreach ($completions as $c) {
                    $timelineItems->push([
                        'id' => "lesson-{$c->id}",
                        'type' => 'lesson',
                        'badge_text' => 'Bài học hoàn tất',
                        'created_at' => $c->completed_at ?? $c->created_at ?? now(),
                        'time_text' => ($c->completed_at ?? $c->created_at ?? now())->format('H:i A'),
                        'date_string' => ($c->completed_at ?? $c->created_at ?? now())->format('Y-m-d'),
                        'title' => $c->lesson ? $c->lesson->title : 'Bài học',
                        'subtitle' => $c->lesson && $c->lesson->module ? $c->lesson->module->title : 'Học phần',
                        'progress_percentage' => 100,
                        'progress_label' => '100% Hoàn thành',
                    ]);
                }
            } catch (\Exception $e) {}
        }

        // Sort by newest first
        $timelineItems = $timelineItems->sortByDesc('created_at')->values();
        $totalActivities = $timelineItems->count();
        $totalLessons = $timelineItems->where('type', 'lesson')->count();

        // Group by Date
        $grouped = $timelineItems->groupBy('date_string');
        $timelineGroups = [];

        foreach ($grouped as $date => $items) {
            $dateObj = \Carbon\Carbon::parse($date);
            if ($dateObj->isToday()) {
                $sectionTitle = 'Hôm nay, ' . $dateObj->format('d/m');
                $subtitle = 'Hoạt động rèn luyện vừa hoàn thành trong ngày';
                $iconType = 'calendar';
            } elseif ($dateObj->isYesterday()) {
                $sectionTitle = 'Hôm qua, ' . $dateObj->format('d/m');
                $subtitle = 'Các học phần đã tiếp thu';
                $iconType = 'calendar_light';
            } else {
                $sectionTitle = 'Ngày ' . $dateObj->format('d/m/Y');
                $subtitle = 'Hoạt động học tập trước đây';
                $iconType = 'history';
            }

            $timelineGroups[] = [
                'id' => 'group-' . $date,
                'section_title' => $sectionTitle,
                'subtitle' => $subtitle,
                'icon_type' => $iconType,
                'is_compact' => false,
                'items' => $items->toArray(),
            ];
        }

        return [
            'overview_card' => [
                'total_activities' => $totalActivities,
                'status_badge' => 'Tích cực 100%',
                'status_tag' => 'Active',
                'streak_label' => $streakLabel,
                'next_level_label' => 'Level 8 ➔',
            ],
            'metrics_row' => [
                'total_lessons' => [
                    'value' => $totalLessons,
                    'unit' => 'bài',
                    'change_tag' => '+12% tháng này',
                ],
                'quiz_average' => [
                    'value' => $quizAverage,
                    'progress_tag' => 'Tiến bộ tốt',
                ],
                'study_hours' => [
                    'value' => $studyHours,
                    'unit' => 'giờ',
                    'tag' => 'Chuyên cần cao',
                ],
                'ai_proficiency' => [
                    'level_label' => $aiLevel,
                    'xp_text' => $aiXpText,
                    'percentage' => $aiPercentage,
                    'ranking_tag' => '🌟 Top 10%',
                ],
            ],
            'timeline_groups' => $timelineGroups,
            'total_activities_count' => $totalActivities,
        ];
    }
}
