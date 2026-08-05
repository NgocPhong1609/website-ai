<?php

namespace App\Services\Student;

use App\Models\Course;
use App\Models\User;
use Illuminate\Support\Collection;

class DashboardService
{
    /**
     * Get dashboard overview data for a student.
     * Implements basic simplified repository logic by querying Eloquent Models directly.
     */
    public function getOverview(?User $user): array
    {
        $userId = $user ? $user->id : null;

        // 1. Fetch enrolled courses from DB
        $courses = collect();
        if ($userId && class_exists(\App\Models\Enrollment::class)) {
            $enrollments = \App\Models\Enrollment::with('course.modules.lessons')->where('user_id', $userId)->latest('enrolled_at')->take(4)->get();
            $courses = $enrollments->map(function ($enrollment, $index) {
                $course = $enrollment->course;
                if (!$course) return null;
                
                $gradients = [
                    'from-[#0f0c29] via-[#302b63] to-[#24243e]',
                    'from-[#0f2027] via-[#203a43] to-[#2c5364]',
                    'from-[#1a2a6c] via-[#b21f1f] to-[#fdbb2d]',
                    'from-[#34e89e] via-[#0f3443] to-[#000000]'
                ];
                
                // Lấy tổng số bài học của khóa
                $totalLessons = 0;
                foreach ($course->modules as $module) {
                    $totalLessons += $module->lessons->count();
                }

                // Lấy bài học tiếp theo (nếu có logic xác định, hiện tạm thời mock)
                $nextLesson = 'Tiếp tục học phần mới';

                return [
                    'id' => $course->id,
                    'title' => $course->title,
                    'next_lesson' => $nextLesson,
                    'progress' => $enrollment->progress_percentage ?? 0,
                    'thumbnail_gradient' => $gradients[$index % count($gradients)],
                    'thumbnail_url' => $course->thumbnail ? url($course->thumbnail) : 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop',
                ];
            })->filter()->values();
        }

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
