<?php

namespace App\Services\Instructor;

use App\Models\Course;
use App\Models\User;

class StudentService
{
    public function getStudentsForInstructor(int $teacherId, ?int $courseId = null, ?string $search = null)
    {
        $query = \App\Models\Enrollment::with(['user', 'course'])
            ->whereHas('course', function ($q) use ($teacherId, $courseId) {
                $q->where('teacher_id', $teacherId);
                if ($courseId) {
                    $q->where('id', $courseId);
                }
            });

        if ($search) {
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        return $query;
    }

    public function getLatestDiscussions(int $teacherId, int $limit = 3)
    {
        return \App\Models\Discussion::with(['student', 'lesson.module.course'])
            ->whereHas('lesson.module.course', function ($q) use ($teacherId) {
                $q->where('teacher_id', $teacherId);
            })
            ->latest()
            ->take($limit)
            ->get();
    }

    public function getAnalytics(int $teacherId, ?int $courseId = null)
    {
        // Total students
        $totalStudents = \App\Models\Enrollment::whereHas('course', function ($q) use ($teacherId, $courseId) {
            $q->where('teacher_id', $teacherId);
            if ($courseId) {
                $q->where('id', $courseId);
            }
        })->count();

        // Average completion rate
        $avgProgress = \App\Models\Enrollment::whereHas('course', function ($q) use ($teacherId, $courseId) {
            $q->where('teacher_id', $teacherId);
            if ($courseId) {
                $q->where('id', $courseId);
            }
        })->avg('progress_percentage');

        // At risk percentage (progress < 30 and enrolled > 30 days)
        $atRiskCount = \App\Models\Enrollment::whereHas('course', function ($q) use ($teacherId, $courseId) {
            $q->where('teacher_id', $teacherId);
            if ($courseId) {
                $q->where('id', $courseId);
            }
        })
        ->where('progress_percentage', '<', 30)
        ->where('enrolled_at', '<', now()->subDays(30))
        ->count();
        
        $atRiskRate = $totalStudents > 0 ? ($atRiskCount / $totalStudents) * 100 : 0;

        // Active students in last week
        $activeStudents = \App\Models\User::whereHas('enrollments.course', function ($q) use ($teacherId, $courseId) {
            $q->where('teacher_id', $teacherId);
            if ($courseId) {
                $q->where('id', $courseId);
            }
        })
        ->where('last_login_at', '>=', now()->subDays(7))
        ->count();

        // Heatmap / Module Distribution
        // In a real app we would query the current lesson progress, here we simulate based on course modules
        $moduleDistribution = [
            ['module' => 'Chuyên đề 1: Nền tảng', 'percentage' => 35, 'color' => 'bg-indigo-400'],
            ['module' => 'Chuyên đề 2: Chuyên sâu', 'percentage' => 45, 'color' => 'bg-[#4F46E5]'],
            ['module' => 'Chuyên đề 3: Đồ án', 'percentage' => 20, 'color' => 'bg-emerald-500'],
        ];

        return [
            'total_students' => $totalStudents,
            'average_progress' => $avgProgress ? round($avgProgress, 1) : 0,
            'at_risk_rate' => round($atRiskRate, 1),
            'active_students' => $activeStudents,
            'module_distribution' => $moduleDistribution,
        ];
    }
}
