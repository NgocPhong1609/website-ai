<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\AiUsageLog;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use App\Models\UserQuizAttempt;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;

class AnalyticsController extends Controller
{
    public function dashboard(Request $request): JsonResponse
    {
        $period = (string) $request->string('period', 'monthly');
        $start = $this->startDate($period);

        $completedRevenue = (float) Order::where('status', 'completed')
            ->where('created_at', '>=', $start)
            ->sum('total_amount');

        $apiCost = (float) AiUsageLog::where('created_at', '>=', $start)->sum('cost_estimate');

        $completedLessons = DB::table('lesson_completions')
            ->where('completed_at', '>=', $start)
            ->count();

        $passed = $this->safeQuizAttemptCount('passed', $start);

        $failed = $this->safeQuizAttemptCount('failed', $start);

        $traffic = $this->buildTrafficSeries($period, $start);

        $courseRevenue = OrderItem::query()
            ->select([
                'courses.id as course_id',
                'courses.title as course_title',
                'teachers.name as instructor_name',
                DB::raw('COUNT(DISTINCT orders.id) as total_orders'),
                DB::raw('COALESCE(SUM(order_items.price), 0) as revenue'),
            ])
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->join('courses', 'courses.id', '=', 'order_items.course_id')
            ->leftJoin('users as teachers', 'teachers.id', '=', 'courses.teacher_id')
            ->where('orders.status', 'completed')
            ->where('orders.created_at', '>=', $start)
            ->groupBy('courses.id', 'courses.title', 'teachers.name')
            ->orderByDesc('revenue')
            ->limit(12)
            ->get()
            ->map(fn ($row) => [
                'course_id' => (int) $row->course_id,
                'course' => (string) $row->course_title,
                'instructor' => $row->instructor_name ?: 'Chưa gán giảng viên',
                'total_orders' => (int) $row->total_orders,
                'revenue' => (float) $row->revenue,
            ])
            ->values();

        $topSubjects = Course::query()
            ->withCount('enrollments')
            ->with('category:id,name')
            ->orderByDesc('enrollments_count')
            ->take(6)
            ->get()
            ->map(fn (Course $course) => [
                'course' => $course->title,
                'category' => $course->category?->name,
                'enrollments' => $course->enrollments_count,
            ])
            ->values();

        $guestCount = $this->countByRole('guest');
        $studentCount = $this->countByRole('student');

        $guestToStudentConversions = ActivityLog::query()
            ->where('action', 'role_changed')
            ->where('metadata->from', 'guest')
            ->where('metadata->to', 'student')
            ->where('created_at', '>=', $start)
            ->count();

        $conversionRate = $guestCount > 0
            ? round(($guestToStudentConversions / $guestCount) * 100, 2)
            : 0;

        return response()->json([
            'period' => $period,
            'financial' => [
                'tuition_revenue' => $completedRevenue,
                'ai_api_cost' => $apiCost,
                'gross_margin' => $completedRevenue - $apiCost,
            ],
            'learning' => [
                'completed_lessons' => $completedLessons,
                'pass' => $passed,
                'fail' => $failed,
                'pass_rate' => ($passed + $failed) > 0 ? round(($passed / ($passed + $failed)) * 100, 2) : 0,
                'trending_subjects' => $topSubjects,
            ],
            'system' => [
                'traffic' => $traffic,
                'guests' => $guestCount,
                'students' => $studentCount,
                'guest_to_student_conversions' => $guestToStudentConversions,
                'guest_conversion_rate' => $conversionRate,
            ],
            'course_revenue' => $courseRevenue,
        ]);
    }

    private function startDate(string $period): Carbon
    {
        return match ($period) {
            'weekly' => now()->subDays(6)->startOfDay(),
            'yearly' => now()->startOfYear(),
            default => now()->subDays(29)->startOfDay(),
        };
    }

    private function buildTrafficSeries(string $period, Carbon $start): array
    {
        $activityRows = ActivityLog::query()
            ->where('created_at', '>=', $start)
            ->orderBy('created_at')
            ->get(['created_at']);

        if ($period === 'yearly') {
            $counts = $activityRows
                ->groupBy(fn (ActivityLog $log) => $log->created_at->copy()->startOfMonth()->format('Y-m-01'))
                ->map(fn ($items) => $items->count());

            return collect(CarbonPeriod::create($start->copy()->startOfMonth(), '1 month', now()->copy()->startOfMonth()))
                ->map(fn (Carbon $date) => [
                    'date' => $date->format('m/Y'),
                    'total' => (int) ($counts->get($date->format('Y-m-01')) ?? 0),
                ])
                ->values()
                ->all();
        }

        $counts = $activityRows
            ->groupBy(fn (ActivityLog $log) => $log->created_at->toDateString())
            ->map(fn ($items) => $items->count());

        return collect(CarbonPeriod::create($start->copy()->startOfDay(), now()->copy()->startOfDay()))
            ->map(fn (Carbon $date) => [
                'date' => $date->format('d/m'),
                'total' => (int) ($counts->get($date->toDateString()) ?? 0),
            ])
            ->values()
            ->all();
    }

    private function countByRole(string $role): int
    {
        return User::query()
            ->where('role', $role)
            ->orWhereHas('roles', fn ($q) => $q->where('name', $role))
            ->count();
    }

    private function safeQuizAttemptCount(string $status, Carbon $start): int
    {
        if (!Schema::hasTable('user_quiz_attempts')) {
            Log::warning('Admin analytics skipped quiz attempt query because table is missing.', [
                'table' => 'user_quiz_attempts',
                'status' => $status,
            ]);

            return 0;
        }

        return UserQuizAttempt::query()
            ->where('status', $status)
            ->where('created_at', '>=', $start)
            ->count();
    }
}
