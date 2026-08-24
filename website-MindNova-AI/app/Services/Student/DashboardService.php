<?php

namespace App\Services\Student;

use App\Models\Course;
use App\Models\User;
use Illuminate\Support\Collection;

class DashboardService
{
    public function __construct(private readonly CourseService $courseService)
    {
    }

    /**
     * Get dashboard overview data for a student.
     * Implements basic simplified repository logic by querying Eloquent Models directly.
     */
    public function getOverview(?User $user): array
    {
        $userId = $user ? $user->id : null;

        // 1. Fetch enrolled courses from DB using CourseService to ensure 100% identical logic
        $coursesList = $this->courseService->getEnrolledCourses($user);
        $courses = collect($coursesList)->map(function ($courseData) {
            return [
                'id' => $courseData['id'],
                'title' => $courseData['title'],
                'next_lesson' => $courseData['nextLesson'],
                'progress' => $courseData['progress'],
                'thumbnail_gradient' => $courseData['thumbnailGradient'],
                'thumbnail_url' => $courseData['thumbnailUrl'],
            ];
        })->take(4);

        // Fallback for empty state (Test Case 1)
        if ($courses->isEmpty()) {
            $courses = collect();
        }

        // Add the AI Onboarding Generated Plan to courses
        if ($user && $user->is_onboarded && $user->onboarding_data) {
            $onboarding = is_string($user->onboarding_data) ? json_decode($user->onboarding_data, true) : $user->onboarding_data;
            if ($onboarding && isset($onboarding['goal'])) {
                $aiPlanTitle = "Lộ trình AI: " . $onboarding['goal'];
                
                $learningPath = $onboarding['ai_plan']['learning_path'] ?? [];
                $nextLesson = $learningPath[0]['lessons'][0]['name'] ?? 'Bắt đầu lộ trình đặc biệt của bạn';

                $courses->prepend([
                    'id' => 'ai-custom-' . $user->id,
                    'title' => $aiPlanTitle,
                    'next_lesson' => $nextLesson,
                    'progress' => 0,
                    'thumbnail_gradient' => 'from-[#6B6BFF] via-[#818cf8] to-[#4cd7f6]',
                    'thumbnail_url' => 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=600&auto=format&fit=crop',
                ]);
            }
        }

        // 2. AI Recommended Focus Areas (Mock based on progress)
        $focusAreas = [];

        // 3. AI Suggestion Box
        $aiSuggestion = null;
        if ($user && $user->is_onboarded && $user->onboarding_data) {
            $onboarding = is_string($user->onboarding_data) ? json_decode($user->onboarding_data, true) : $user->onboarding_data;
            if ($onboarding && isset($onboarding['goal'])) {
                $topicsText = is_array($onboarding['topics'] ?? null) ? implode(', ', $onboarding['topics']) : 'các chủ đề đã chọn';
                $aiSuggestion = [
                    'message' => 'Dựa trên mục tiêu "' . $onboarding['goal'] . '", bạn nên tập trung vào ' . $topicsText . ' để đạt hiệu quả cao nhất trong tuần này.',
                    'action_text' => 'Tiếp tục lộ trình AI',
                    'action_url' => '/study-plan'
                ];
            }
        }

        // Daily Goal
        $dailyTarget = 3; // Default daily goal
        $completedToday = 0;
        $weeklyActivity = [
            'T2' => false, 'T3' => false, 'T4' => false, 'T5' => false, 
            'T6' => false, 'T7' => false, 'CN' => false
        ];
        
        if ($userId && class_exists(\App\Models\LessonCompletion::class)) {
            $completedToday = \App\Models\LessonCompletion::where('user_id', $userId)
                ->whereDate('completed_at', \Carbon\Carbon::today())
                ->count();
                
            // Weekly activity
            $startOfWeek = \Carbon\Carbon::now()->startOfWeek();
            $completionsThisWeek = \App\Models\LessonCompletion::where('user_id', $userId)
                ->whereBetween('completed_at', [$startOfWeek, \Carbon\Carbon::now()->endOfWeek()])
                ->get();
                
            foreach ($completionsThisWeek as $completion) {
                $dayOfWeek = \Carbon\Carbon::parse($completion->completed_at)->dayOfWeekIso; // 1 (Mon) to 7 (Sun)
                $map = [1 => 'T2', 2 => 'T3', 3 => 'T4', 4 => 'T5', 5 => 'T6', 6 => 'T7', 7 => 'CN'];
                $weeklyActivity[$map[$dayOfWeek]] = true;
            }
        }

        $dailyGoal = [
            'target' => $dailyTarget,
            'completed' => $completedToday,
            'percentage' => $dailyTarget > 0 ? min(100, round(($completedToday / $dailyTarget) * 100)) : 0
        ];

        // Overall Stats & Streak
        $overallProgressPct = 0;
        if ($userId && class_exists(\App\Models\Enrollment::class)) {
            $overallProgressPct = (int) \App\Models\Enrollment::where('user_id', $userId)->avg('progress_percentage');
        }

        $overallProgress = [
            'percent' => $overallProgressPct,
            'delta' => 'Tiến trình học tập tổng quan',
        ];

        // Lấy Streak thực tế từ user profile (nếu có)
        $studyStreakDays = 0;
        if ($user && $user->profile) {
            $studyStreakDays = $user->profile->streak_days ?? 0;
        }

        $studyStreak = [
            'days' => $studyStreakDays,
            'message' => $studyStreakDays > 0 ? "Bạn đang giữ chuỗi $studyStreakDays ngày!" : 'Hãy bắt đầu chuỗi học tập ngay hôm nay!',
        ];

        // 6. Advanced Learning Recommendations
        $advancedRecommendations = [];

        return [
            'user' => $user ? ['id' => $user->id, 'name' => $user->name, 'email' => $user->email] : null,
            'courses' => $courses->toArray(),
            'focus_areas' => $focusAreas,
            'ai_suggestion' => $aiSuggestion,
            'overall_progress' => $overallProgress,
            'study_streak' => $studyStreak,
            'daily_goal' => $dailyGoal,
            'weekly_activity' => $weeklyActivity,
            'advanced_recommendations' => $advancedRecommendations,
        ];
    }
}
