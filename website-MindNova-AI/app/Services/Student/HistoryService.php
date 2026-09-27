<?php

namespace App\Services\Student;

use App\Models\User;
use App\Models\UserQuizAttempt;

class HistoryService
{
    /**
      * Retrieve chronological student learning history, activity timeline, and academic milestones.
      */
     public function getHistory(?User $user, int $page = 1, int $perPage = 10): array
     {
         $userId = $user ? $user->id : null;
         $page = max(1, $page);
         $perPage = max(1, $perPage);
         
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
                         'time_text' => $att->created_at ? $att->created_at->format('H:i') : '',
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
                         'time_text' => ($c->completed_at ?? $c->created_at ?? now())->format('H:i'),
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
         $totalPages = max(1, (int) ceil($totalActivities / $perPage));

         // Paginate items
         $offset = ($page - 1) * $perPage;
         $paginatedItems = $timelineItems->slice($offset, $perPage)->values();

         // Group by Date
         $grouped = $paginatedItems->groupBy('date_string');
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

         $metrics = $this->buildMetrics($userId, $timelineItems);

         return [
             'overview_card' => [
                 'total_activities' => $totalActivities,
                 'status_badge' => $metrics['active_this_week'] ? 'Hoạt động tuần này' : 'Chưa hoạt động tuần này',
                 'status_tag' => $metrics['active_this_week'] ? 'Active' : 'Idle',
                 'streak_label' => $metrics['streak'] > 0 ? "Chuỗi {$metrics['streak']} ngày chuyên cần" : 'Chưa có chuỗi chuyên cần',
                 'next_level_label' => "Level {$metrics['level']}",
             ],
             'metrics_row' => [
                 'total_lessons' => [
                     'value' => $totalLessons,
                     'unit' => 'bài',
                     'change_tag' => $metrics['lessons_this_month'] > 0 ? "+{$metrics['lessons_this_month']} tháng này" : null,
                 ],
                 'quiz_average' => [
                     'value' => $metrics['quiz_average'] !== null ? "{$metrics['quiz_average']}%" : '—',
                     'progress_tag' => $metrics['quiz_average'] === null ? 'Chưa làm bài' : ($metrics['quiz_average'] >= 80 ? 'Tốt' : ($metrics['quiz_average'] >= 50 ? 'Đạt' : 'Cần cố gắng')),
                 ],
                 'study_hours' => [
                     'value' => $metrics['study_hours'],
                     'unit' => 'giờ',
                     'tag' => 'Theo bài đã học',
                 ],
                 'ai_proficiency' => [
                     'level_label' => "Level {$metrics['level']}",
                     'xp_text' => "{$metrics['xp_in_level']} / 100 XP",
                     'percentage' => $metrics['xp_in_level'],
                     'ranking_tag' => null,
                 ],
             ],
             'timeline_groups' => $timelineGroups,
             'total_activities_count' => $totalActivities,
             'pagination' => [
                 'current_page' => $page,
                 'per_page' => $perPage,
                 'total_items' => $totalActivities,
                 'total_pages' => $totalPages,
                 'has_more' => $page < $totalPages,
             ],
         ];
     }

     /**
      * Real learner metrics. XP: 10 per completed lesson, 20 per finished quiz; 100 XP per level.
      */
     private function buildMetrics(?int $userId, \Illuminate\Support\Collection $timelineItems): array
     {
         $empty = ['quiz_average' => null, 'study_hours' => '0', 'streak' => 0, 'level' => 1, 'xp_in_level' => 0, 'lessons_this_month' => 0, 'active_this_week' => false];
         if (!$userId) {
             return $empty;
         }

         $courseScores = UserQuizAttempt::where('user_id', $userId)->pluck('score');
         $aiScores = \App\Models\AiGeneratedQuiz::where('user_id', $userId)->where('is_completed', true)->pluck('score');
         $scores = $courseScores->merge($aiScores)->filter(fn ($v) => $v !== null);
         $quizAverage = $scores->isNotEmpty() ? (int) round($scores->avg()) : null;

         $seconds = \App\Models\LessonCompletion::where('lesson_completions.user_id', $userId)
             ->join('lessons', 'lessons.id', '=', 'lesson_completions.lesson_id')
             ->sum('lessons.duration_seconds');

         $streak = (int) (\App\Models\UserStreak::where('user_id', $userId)->value('current_streak') ?? 0);

         $xp = $timelineItems->where('type', 'lesson')->count() * 10 + $scores->count() * 20;

         return [
             'quiz_average' => $quizAverage,
             'study_hours' => rtrim(rtrim(number_format($seconds / 3600, 1, '.', ''), '0'), '.') ?: '0',
             'streak' => $streak,
             'level' => intdiv($xp, 100) + 1,
             'xp_in_level' => $xp % 100,
             'lessons_this_month' => $timelineItems->where('type', 'lesson')->filter(fn ($i) => \Carbon\Carbon::parse($i['created_at'])->isCurrentMonth())->count(),
             'active_this_week' => $timelineItems->contains(fn ($i) => \Carbon\Carbon::parse($i['created_at'])->greaterThanOrEqualTo(now()->subDays(7))),
         ];
     }
}
