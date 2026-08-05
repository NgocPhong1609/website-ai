<?php

namespace App\Http\Controllers\Api\Instructor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Enrollment;
use App\Models\Certificate;
use App\Models\ActivityLog;
use App\Models\LessonCompletion;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class StudentAnalyticsController extends Controller
{
    public function dashboardMetrics()
    {
        $teacherId = auth()->id();

        // 1. Total Learning Time (Sum of duration_seconds of completed lessons by students in teacher's courses)
        $totalLearningSeconds = LessonCompletion::whereHas('lesson.module.course', function ($q) use ($teacherId) {
            $q->where('teacher_id', $teacherId);
        })->join('lessons', 'lesson_completions.lesson_id', '=', 'lessons.id')
          ->sum('lessons.duration_seconds');
        
        $totalLearningHours = round($totalLearningSeconds / 3600);

        // 2. Total Certificates
        $totalCertificates = Certificate::whereHas('course', function ($q) use ($teacherId) {
            $q->where('teacher_id', $teacherId);
        })->count();

        // 3. New Students (Enrolled in last 30 days)
        $newStudents = Enrollment::with(['user', 'course'])
            ->whereHas('course', function ($q) use ($teacherId) {
                $q->where('teacher_id', $teacherId);
            })
            ->where('enrolled_at', '>=', Carbon::now()->subDays(30))
            ->latest('enrolled_at')
            ->take(10)
            ->get()
            ->map(function ($enrollment) {
                // Determine active status (active in last 7 days)
                $lastActivity = ActivityLog::where('user_id', $enrollment->user_id)
                    ->latest('created_at')
                    ->first();
                $isActive = $lastActivity && $lastActivity->created_at >= Carbon::now()->subDays(7);
                
                return [
                    'id' => $enrollment->user_id,
                    'name' => $enrollment->user->name,
                    'email' => $enrollment->user->email,
                    'course_name' => $enrollment->course->title,
                    'status' => $isActive ? 'ĐANG HOẠT ĐỘNG' : 'TẠM VẮNG MẶT',
                    'enrolled_at' => $enrollment->enrolled_at->format('Y-m-d')
                ];
            });

        return response()->json([
            'success' => true,
            'data' => [
                'total_learning_hours' => $totalLearningHours,
                'total_certificates' => $totalCertificates,
                'new_students' => $newStudents
            ]
        ]);
    }

    public function engagementChart()
    {
        $teacherId = auth()->id();
        $days = request('days', 7);
        $startDate = Carbon::now()->subDays($days - 1)->startOfDay();

        // Students of this teacher
        $studentIds = Enrollment::whereHas('course', function ($q) use ($teacherId) {
            $q->where('teacher_id', $teacherId);
        })->pluck('user_id')->unique();

        // Count activities grouped by date
        $activities = ActivityLog::whereIn('user_id', $studentIds)
            ->where('created_at', '>=', $startDate)
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as total'))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $chartData = [];
        for ($i = 0; $i < $days; $i++) {
            $date = Carbon::now()->subDays($days - 1 - $i)->format('Y-m-d');
            $chartData[] = [
                'date' => $date,
                'dayLabel' => Carbon::parse($date)->locale('vi')->isoFormat('D/M'),
                'interactions' => isset($activities[$date]) ? $activities[$date]->total : 0
            ];
        }

        return response()->json([
            'success' => true,
            'data' => $chartData
        ]);
    }
}
