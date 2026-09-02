<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Course;
use App\Models\Discussion;
use App\Models\Enrollment;
use App\Models\Order;
use App\Models\Subscription;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Percentage change between the last 30 days and the 30 days before that, for a given query builder.
     */
    private function percentChange($query, string $column = 'created_at'): string
    {
        $current = (clone $query)->where($column, '>=', now()->subDays(30))->count();
        $previous = (clone $query)->whereBetween($column, [now()->subDays(60), now()->subDays(30)])->count();

        if ($previous === 0) {
            return $current > 0 ? '+100%' : '0%';
        }

        $change = (($current - $previous) / $previous) * 100;

        return ($change >= 0 ? '+' : '') . number_format($change, 1) . '%';
    }

    public function overview(Request $request): JsonResponse
    {
        $totalUsers = User::count();
        $totalCourses = Course::count();
        $totalRevenue = (float) Order::where('status', 'completed')->sum('total_amount');
        $activeSubscriptions = Subscription::where('status', 'active')->count();
        $completedEnrollments = Enrollment::where('status', 'completed')->count();
        $totalEnrollments = Enrollment::count();
        $completionRate = $totalEnrollments > 0 ? round(($completedEnrollments / $totalEnrollments) * 100, 1) : 0;

        $recentUsers = User::query()
            ->latest()
            ->take(5)
            ->get()
            ->map(function (User $user) {
                $role = strtolower((string) ($user->role ?? 'user'));

                if (str_contains($role, 'admin')) {
                    $roleLabel = 'Quản trị viên';
                } elseif (str_contains($role, 'teacher') || str_contains($role, 'instructor')) {
                    $roleLabel = 'Giảng viên';
                } else {
                    $roleLabel = 'Học viên';
                }

                return [
                    'name' => $user->name,
                    'role' => $roleLabel,
                    'status' => $user->status === 'active' ? 'Đang hoạt động' : 'Ngưng hoạt động',
                ];
            })
            ->values()
            ->all();

        // Real new-user signups for each of the last 7 days.
        $activities = collect(range(6, 0))->map(function (int $daysAgo) {
            $day = now()->subDays($daysAgo);

            return [
                'label' => $day->translatedFormat('D'),
                'value' => User::whereDate('created_at', $day->toDateString())->count(),
            ];
        })->values()->all();

        $failedJobs = DB::table('failed_jobs')->count();
        $freeBytes = @disk_free_space(storage_path());
        $totalBytes = @disk_total_space(storage_path());
        $freePercent = ($freeBytes && $totalBytes) ? ($freeBytes / $totalBytes) * 100 : 100;

        $health = [
            ['title' => 'API Laravel', 'status' => 'Ổn định', 'color' => 'bg-emerald-500'],
            [
                'title' => 'Hàng đợi tác vụ',
                'status' => $failedJobs > 0 ? 'Cảnh báo' : 'Ổn định',
                'color' => $failedJobs > 0 ? 'bg-amber-500' : 'bg-cyan-500',
            ],
            [
                'title' => 'Lưu trữ',
                'status' => $freePercent < 15 ? 'Cảnh báo' : 'Ổn định',
                'color' => $freePercent < 15 ? 'bg-amber-500' : 'bg-emerald-500',
            ],
            [
                'title' => 'Dịch vụ AI',
                'status' => filled(config('services.groq.key')) ? 'Ổn định' : 'Cảnh báo',
                'color' => filled(config('services.groq.key')) ? 'bg-violet-500' : 'bg-amber-500',
            ],
        ];

        return response()->json([
            'hero' => [
                'title' => 'Xin chào, Quản trị viên',
                'description' => 'Trang quản trị để bạn theo dõi người dùng, khóa học, doanh thu và trạng thái hệ thống theo thời gian thực.',
                'primaryAction' => 'Thêm mới',
                'secondaryAction' => 'Xuất báo cáo',
            ],
            'stats' => [
                [
                    'label' => 'Tổng người dùng',
                    'value' => number_format($totalUsers),
                    'trend' => $this->percentChange(User::query()),
                    'note' => 'so với 30 ngày trước',
                ],
                [
                    'label' => 'Khóa học đang hoạt động',
                    'value' => number_format($totalCourses),
                    'trend' => $this->percentChange(Course::query()),
                    'note' => 'so với 30 ngày trước',
                ],
                [
                    'label' => 'Doanh thu',
                    'value' => '$' . number_format($totalRevenue, 1),
                    'trend' => $this->percentChange(Order::where('status', 'completed')),
                    'note' => 'tổng doanh số đã thanh toán',
                ],
                [
                    'label' => 'Tỉ lệ hoàn thành',
                    'value' => $completionRate . '%',
                    'trend' => $this->percentChange(Enrollment::where('status', 'completed'), 'enrolled_at'),
                    'note' => 'trên tổng số lượt ghi danh',
                ],
            ],
            'activities' => $activities,
            'health' => $health,
            'users' => $recentUsers,
            'quickActions' => [
                'Quản lý danh mục khóa học',
                'Quản lý khóa học',
                'Lọc và tìm kiếm khóa học',
                'Kiểm duyệt và khóa người dùng',
                'Gửi email thông báo',
            ],
        ]);
    }

    public function teacherApprovals(): JsonResponse
    {
        $teachers = User::query()
            ->where(function ($query) {
                $query->where('role', 'teacher')->orWhere('role', 'instructor');
            })
            ->with(['profile', 'credentials'])
            ->latest()
            ->take(10)
            ->get();

        $rows = $teachers->map(function (User $user) {
            $status = match ($user->teacher_verification_status) {
                'approved' => 'approved',
                'rejected' => 'rejected',
                default => 'pending',
            };

            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'avatarUrl' => $user->avatar_url,
                'cvUrl' => $user->profile?->cv_path ? asset('storage/' . $user->profile->cv_path) : null,
                'expertise' => $user->profile?->skill_level ?? 'General instruction',
                'status' => $status,
                'submittedAt' => $user->created_at?->toDateString() ?? now()->toDateString(),
                'experience' => $user->teacher_verification_note ?? 'Chưa cập nhật',
                'credentialCount' => $user->credentials->count(),
                'credentials' => $user->credentials->map(fn ($credential) => [
                    'id' => $credential->id,
                    'title' => $credential->title,
                    'fileUrl' => asset('storage/' . $credential->file_path),
                ])->values(),
                'rating' => $user->courses()->count() > 0
                    ? round((float) $user->courses()->avg('price'), 1)
                    : 0.0,
            ];
        })->values();

        return response()->json(['data' => $rows]);
    }

    public function aiSystem(): JsonResponse
    {
        $totalUsers = User::count();
        $totalCourses = Course::count();
        $totalEnrollments = Enrollment::count();

        $groqConnected = filled(config('services.groq.key'));
        $geminiConnected = filled(config('services.gemini.key'));

        return response()->json([
            'data' => [
                'providers' => [
                    ['provider' => 'Groq (Học sinh hỏi đáp)', 'model' => config('services.groq.model'), 'status' => $groqConnected ? 'connected' : 'offline', 'apiKeyHint' => $groqConnected ? '••••••••••••••••' : 'Chưa cấu hình'],
                    ['provider' => 'Gemini (Tạo nội dung)', 'model' => config('services.gemini.model'), 'status' => $geminiConnected ? 'connected' : 'offline', 'apiKeyHint' => $geminiConnected ? '••••••••••••••••' : 'Chưa cấu hình'],
                ],
                'quotas' => [
                    ['label' => 'Daily generation quota', 'limit' => 3000, 'used' => min(3000, (int) round($totalEnrollments * 12))],
                    ['label' => 'Course evaluation calls', 'limit' => 1200, 'used' => min(1200, (int) round($totalCourses * 14))],
                    ['label' => 'Teacher assistant usage', 'limit' => 900, 'used' => min(900, (int) round($totalUsers * 3))],
                ],
                // No system-prompt table exists yet; this remains a fixed placeholder until one is added.
                'systemPrompts' => [
                    ['id' => 1, 'name' => 'Learning Coach', 'purpose' => 'Guide personal study paths', 'status' => 'active', 'updatedAt' => now()->subDay()->toDateString()],
                    ['id' => 2, 'name' => 'Course Reviewer', 'purpose' => 'Check quality and structure', 'status' => 'draft', 'updatedAt' => now()->subDays(3)->toDateString()],
                ],
            ],
        ]);
    }

    public function content(): JsonResponse
    {
        $rows = Course::query()
            ->with('teacher')
            ->withCount('enrollments')
            ->withAvg('enrollments', 'progress_percentage')
            ->latest()
            ->take(10)
            ->get()
            ->map(function (Course $course) {
                $score = $course->enrollments_count > 0
                    ? round((float) $course->enrollments_avg_progress_percentage, 0)
                    : ($course->price > 0 ? 60 : 40);

                return [
                    'id' => $course->id,
                    'title' => $course->title,
                    'type' => 'Course',
                    'instructor' => $course->teacher?->name ?? 'Unassigned',
                    'status' => $course->status === 'published' ? 'approved' : ($course->status === 'draft' ? 'pending' : 'rejected'),
                    'submittedAt' => $course->created_at?->toDateString() ?? now()->toDateString(),
                    'score' => (int) $score,
                ];
            })
            ->values();

        return response()->json(['data' => $rows]);
    }

    public function revenue(): JsonResponse
    {
        $courseSummary = DB::table('order_items as oi')
            ->join('orders as o', 'o.id', '=', 'oi.order_id')
            ->join('courses as c', 'c.id', '=', 'oi.course_id')
            ->leftJoin('users as teacher', 'teacher.id', '=', 'c.teacher_id')
            ->leftJoin('teacher_payouts as tp', function ($join) {
                $join->on('tp.order_id', '=', 'oi.order_id')
                     ->on('tp.course_id', '=', 'oi.course_id');
            })
            ->where('o.status', 'completed')
            ->select([
                'c.id as courseId',
                'c.title as courseTitle',
                'c.partnership_tier as partnershipTier',
                DB::raw('COALESCE(teacher.name, "Unassigned") as instructorName'),
                DB::raw('SUM(oi.price) as grossRevenue'),
                DB::raw('COALESCE(SUM(tp.admin_share_amount), SUM(oi.price * IF(c.partnership_tier = "exclusive", 0.15, 0.30))) as adminRevenue'),
                DB::raw('COALESCE(SUM(tp.teacher_amount), SUM(oi.price * IF(c.partnership_tier = "exclusive", 0.85, 0.70))) as teacherRevenue'),
                DB::raw('COUNT(DISTINCT o.user_id) as students'),
            ])
            ->groupBy('c.id', 'c.title', 'c.partnership_tier', 'teacher.name')
            ->orderByDesc('grossRevenue')
            ->get();

        $totalGrossRevenue = (float) $courseSummary->sum('grossRevenue');
        $totalAdminRevenue = (float) $courseSummary->sum('adminRevenue');
        $totalTeacherRevenue = (float) $courseSummary->sum('teacherRevenue');

        $courses = $courseSummary->map(function ($row) {
            $students = (int) $row->students;

            return [
                'courseId' => (int) $row->courseId,
                'courseTitle' => $row->courseTitle,
                'instructorName' => $row->instructorName ?? 'Unassigned',
                'partnershipTier' => $row->partnershipTier ?? 'standard',
                'grossRevenue' => (float) $row->grossRevenue,
                'adminRevenue' => (float) $row->adminRevenue,
                'teacherRevenue' => (float) $row->teacherRevenue,
                'revenue' => (float) $row->grossRevenue,
                'students' => $students,
                'conversionRate' => $students > 0 ? 100.0 : 0.0,
            ];
        })->values();

        $orderHistory = DB::table('orders as o')
            ->join('order_items as oi', 'oi.order_id', '=', 'o.id')
            ->join('courses as c', 'c.id', '=', 'oi.course_id')
            ->join('users as student', 'student.id', '=', 'o.user_id')
            ->leftJoin('users as teacher', 'teacher.id', '=', 'c.teacher_id')
            ->leftJoin('revenue_allocations as ra', function ($join) {
                $join->on('ra.order_id', '=', 'o.id')
                     ->on('ra.course_id', '=', 'c.id');
            })
            ->select([
                'o.id as orderId',
                'o.transaction_id as transactionCode',
                'o.status as orderStatus',
                'o.created_at as purchasedAt',
                'student.name as studentName',
                'student.email as studentEmail',
                'c.title as courseTitle',
                'c.partnership_tier as partnershipTier',
                DB::raw('COALESCE(teacher.name, "Unassigned") as instructorName'),
                DB::raw('COALESCE(ra.original_price, c.price, oi.price) as originalPrice'),
                DB::raw('COALESCE(ra.discount_amount, GREATEST(0, COALESCE(c.price, oi.price) - oi.price)) as discountAmount'),
                DB::raw('oi.price as paidAmount'),
                DB::raw('COALESCE(ra.instructor_amount, oi.price * IF(c.partnership_tier = "exclusive", 0.85, 0.70)) as teacherAmount'),
                DB::raw('COALESCE(ra.platform_fee_amount, oi.price * IF(c.partnership_tier = "exclusive", 0.15, 0.30)) as adminAmount'),
                DB::raw('COALESCE(ra.status, IF(o.status = "refunded", "REFUNDED", "AVAILABLE")) as allocationStatus'),
                'ra.refunded_at as refundedAt',
                'o.updated_at as orderUpdatedAt',
            ])
            ->orderByDesc('o.created_at')
            ->take(200)
            ->get()
            ->map(function ($row) {
                $refundedAtFormatted = null;
                if ($row->allocationStatus === 'REFUNDED' || $row->orderStatus === 'refunded') {
                    $dt = $row->refundedAt ? $row->refundedAt : $row->orderUpdatedAt;
                    $refundedAtFormatted = $dt ? \Carbon\Carbon::parse($dt)->format('d/m/Y H:i') : null;
                }

                return [
                    'orderId' => (int) $row->orderId,
                    'transactionCode' => $row->transactionCode ? '#ORD-' . str_pad($row->orderId, 5, '0', STR_PAD_LEFT) : '#ORD-' . str_pad($row->orderId, 5, '0', STR_PAD_LEFT),
                    'purchasedAt' => \Carbon\Carbon::parse($row->purchasedAt)->format('d/m/Y H:i'),
                    'studentName' => $row->studentName,
                    'studentEmail' => $row->studentEmail,
                    'courseTitle' => $row->courseTitle,
                    'instructorName' => $row->instructorName,
                    'partnershipTier' => $row->partnershipTier ?? 'standard',
                    'originalPrice' => (float) $row->originalPrice,
                    'discountAmount' => (float) $row->discountAmount,
                    'paidAmount' => (float) $row->paidAmount,
                    'teacherAmount' => (float) $row->teacherAmount,
                    'adminAmount' => (float) $row->adminAmount,
                    'allocationStatus' => $row->allocationStatus,
                    'orderStatus' => $row->orderStatus,
                    'refundedAt' => $refundedAtFormatted,
                ];
            })
            ->values();

        $responseData = [
            'totalRevenue' => $totalGrossRevenue,
            'totalAdminRevenue' => $totalAdminRevenue,
            'totalTeacherRevenue' => $totalTeacherRevenue,
            'courseCount' => $courses->count(),
            'courses' => $courses,
            'orderHistory' => $orderHistory,
        ];

        return response()->json(array_merge(
            ['data' => $responseData],
            $responseData
        ));
    }

    public function analytics(): JsonResponse
    {
        $totalLearners = User::count();
        $totalEnrollments = Enrollment::count();
        $completedEnrollments = Enrollment::where('status', 'completed')->count();
        $completionRate = $totalEnrollments > 0 ? round(($completedEnrollments / $totalEnrollments) * 100, 1) : 0;

        $teacherCount = User::whereIn('role', ['teacher', 'instructor'])->count();
        $activeTeacherCount = User::whereIn('role', ['teacher', 'instructor'])->where('status', 'active')->count();
        $teacherRetention = $teacherCount > 0 ? round(($activeTeacherCount / $teacherCount) * 100, 0) : 0;

        $avgProgress = round((float) Enrollment::avg('progress_percentage'), 0);

        // Enrollments per month for the last 6 months.
        $traffic = collect(range(5, 0))->map(function (int $monthsAgo) {
            $month = now()->subMonths($monthsAgo);

            return [
                'label' => $month->translatedFormat('M'),
                'value' => Enrollment::whereYear('enrolled_at', $month->year)
                    ->whereMonth('enrolled_at', $month->month)
                    ->count(),
            ];
        })->values()->all();

        // Enrollment volume per course category.
        $subjects = Category::query()
            ->withCount(['courses as enrollments_count' => function ($query) {
                $query->join('enrollments', 'enrollments.course_id', '=', 'courses.id');
            }])
            ->orderByDesc('enrollments_count')
            ->take(5)
            ->get()
            ->map(fn (Category $category) => [
                'label' => $category->name,
                'value' => $category->enrollments_count,
            ])
            ->values()
            ->all();

        // Completion rate per week for the last 6 weeks.
        $conversion = collect(range(5, 0))->map(function (int $weeksAgo) {
            $weekStart = now()->subWeeks($weeksAgo)->startOfWeek();
            $weekEnd = now()->subWeeks($weeksAgo)->endOfWeek();

            $weekTotal = Enrollment::whereBetween('enrolled_at', [$weekStart, $weekEnd])->count();
            $weekCompleted = Enrollment::whereBetween('enrolled_at', [$weekStart, $weekEnd])->where('status', 'completed')->count();

            return [
                'label' => 'W' . (6 - $weeksAgo),
                'value' => $weekTotal > 0 ? (int) round(($weekCompleted / $weekTotal) * 100) : 0,
            ];
        })->values()->all();

        return response()->json([
            'data' => [
                'metrics' => [
                    ['label' => 'Total learners', 'value' => number_format($totalLearners), 'change' => $this->percentChange(User::query())],
                    ['label' => 'Completion rate', 'value' => $completionRate . '%', 'change' => $this->percentChange(Enrollment::where('status', 'completed'), 'enrolled_at')],
                    ['label' => 'Avg. progress', 'value' => $avgProgress . '%', 'change' => $this->percentChange(Enrollment::query(), 'enrolled_at')],
                    ['label' => 'Teacher retention', 'value' => $teacherRetention . '%', 'change' => $this->percentChange(User::whereIn('role', ['teacher', 'instructor']))],
                ],
                'traffic' => $traffic,
                'subjects' => $subjects,
                'conversion' => $conversion,
            ],
        ]);
    }

    public function moderationSupport(): JsonResponse
    {
        $rows = Discussion::query()
            ->with('student')
            ->latest()
            ->take(10)
            ->get()
            ->map(function (Discussion $discussion) {
                $status = match ($discussion->status) {
                    'answered' => 'in_review',
                    'closed' => 'resolved',
                    default => 'open',
                };

                $replyCount = $discussion->replies()->count();
                $severity = $replyCount === 0 ? 'high' : ($replyCount < 3 ? 'medium' : 'low');

                return [
                    'id' => $discussion->id,
                    'type' => 'Support Ticket',
                    'title' => $discussion->title,
                    'reporter' => $discussion->student?->name ?? 'Unknown',
                    'severity' => $severity,
                    'status' => $status,
                    'createdAt' => $discussion->created_at?->toDateString() ?? now()->toDateString(),
                ];
            })
            ->values();

        return response()->json(['data' => $rows]);
    }
}
