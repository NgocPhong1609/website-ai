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

        // 2. AI Recommended Focus Areas (Mock based on progress)
        $focusAreas = [];

        // 3. AI Suggestion Box
        $aiSuggestion = null;

        // 5. Overall Stats & Streak
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
            'advanced_recommendations' => $advancedRecommendations,
        ];
    }
}
