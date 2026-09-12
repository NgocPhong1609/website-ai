<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateCommissionSettingsRequest;
use App\Models\Category;
use App\Models\Course;
use App\Models\Discussion;
use App\Models\Enrollment;
use App\Models\Order;
use App\Models\User;
use App\Settings\CommissionSettingsRepository;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
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
            return $current > 0 ? '' : '0%';
        }

        $change = (($current - $previous) / $previous) * 100;

        return ($change >= 0 ? '+' : '').number_format($change, 1).'%';
    }

    public function overview(): JsonResponse
    {
        $totalUsers = User::count();
        $totalCourses = Course::count();
        $totalRevenue = (float) Order::where('status', 'completed')->sum('total_amount');
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
                    'id' => $user->id,
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
        $freePercent = ($freeBytes !== false && $totalBytes !== false && $totalBytes > 0)
            ? ($freeBytes / $totalBytes) * 100 : null;

        $health = [
            [
                'title' => 'Hàng đợi tác vụ',
                'status' => $failedJobs.' tác vụ thất bại được ghi nhận',
                'color' => $failedJobs > 0 ? 'bg-amber-500' : 'bg-cyan-500',
            ],
            [
                'title' => 'Lưu trữ',
                'status' => $freePercent === null ? 'Chưa có dữ liệu' : round($freePercent, 1).'% dung lượng trống',
                'color' => $freePercent === null || $freePercent < 15 ? 'bg-amber-500' : 'bg-emerald-500',
            ],
        ];

        return response()->json([
            'hero' => [
                'title' => 'Xin chào, Quản trị viên',
                'description' => 'Tổng quan người dùng, khóa học và doanh thu.',
                'primaryAction' => 'Quản lý nội dung',
                'secondaryAction' => 'Xem báo cáo',
            ],
            'stats' => [
                [
                    'label' => 'Tổng người dùng',
                    'value' => number_format($totalUsers),
                    'trend' => $this->percentChange(User::query()),
                    'note' => 'so với 30 ngày trước',
                ],
                [
                    'label' => 'Tổng khóa học',
                    'value' => number_format($totalCourses),
                    'trend' => $this->percentChange(Course::query()),
                    'note' => 'so với 30 ngày trước',
                ],
                [
                    'label' => 'Doanh thu',
                    'value' => number_format($totalRevenue, 0, ',', '.').' VNĐ',
                    'trend' => '',
                    'note' => 'tổng doanh số đã thanh toán',
                ],
                [
                    'label' => 'Tỉ lệ hoàn thành',
                    'value' => $completionRate.'%',
                    'trend' => '',
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
            ->withRole(['teacher', 'instructor'])
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
                'cvUrl' => $user->profile?->cv_path ? asset('storage/'.$user->profile->cv_path) : null,
                'expertise' => $user->profile?->skill_level ?? 'General instruction',
                'status' => $status,
                'submittedAt' => $user->created_at?->toDateString() ?? now()->toDateString(),
                'experience' => $user->teacher_verification_note ?? 'Chưa cập nhật',
                'credentialCount' => $user->credentials->count(),
                'credentials' => $user->credentials->map(fn ($credential) => [
                    'id' => $credential->id,
                    'title' => $credential->title,
                    'fileUrl' => asset('storage/'.$credential->file_path),
                ])->values(),
                'rating' => $user->courses()->count() > 0
                    ? round((float) $user->courses()->avg('price'), 1)
                    : 0.0,
            ];
        })->values();

        return response()->json(['data' => $rows]);
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

    public function revenue(CommissionSettingsRepository $commissionSettings): JsonResponse
    {
        $courseSummary = DB::table('order_items as oi')
            ->join('orders as o', 'o.id', '=', 'oi.order_id')
            ->join('courses as c', 'c.id', '=', 'oi.course_id')
            ->leftJoin('users as teacher', 'teacher.id', '=', 'c.teacher_id')
            ->leftJoin('teacher_payouts as tp', function ($join) {
                $join->on('tp.order_id', '=', 'oi.order_id')
                    ->on('tp.course_id', '=', 'oi.course_id');
            })
            ->leftJoin('revenue_allocations as ra', function ($join) {
                $join->on('ra.id', '=', DB::raw('(SELECT ra_pick.id FROM revenue_allocations ra_pick WHERE ra_pick.order_id = oi.order_id AND ra_pick.course_id = oi.course_id AND (ra_pick.order_item_id = oi.id OR ra_pick.order_item_id IS NULL) ORDER BY CASE WHEN ra_pick.order_item_id = oi.id THEN 0 ELSE 1 END, ra_pick.id DESC LIMIT 1)'));
            })
            ->where('o.status', 'completed')
            ->select([
                'c.id as courseId',
                'c.title as courseTitle',
                DB::raw('MAX(COALESCE(ra.partnership_tier, JSON_UNQUOTE(JSON_EXTRACT(tp.metadata, "$.partnership_tier")))) as partnershipTier'),
                DB::raw('COUNT(DISTINCT COALESCE(ra.partnership_tier, JSON_UNQUOTE(JSON_EXTRACT(tp.metadata, "$.partnership_tier")), "__unknown__")) as partnershipTierCount'),
                DB::raw('COALESCE(teacher.name, "Unassigned") as instructorName'),
                DB::raw('SUM(oi.price) as grossRevenue'),
                DB::raw('SUM(COALESCE(ra.platform_fee_amount, tp.admin_share_amount, 0)) as adminRevenue'),
                DB::raw('SUM(COALESCE(ra.instructor_amount, tp.teacher_amount, 0)) as teacherRevenue'),
                DB::raw('COUNT(DISTINCT o.user_id) as students'),
            ])
            ->groupBy('c.id', 'c.title', 'teacher.name')
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
                'partnershipTier' => (int) $row->partnershipTierCount > 1
                    ? 'mixed'
                    : $row->partnershipTier,
                'grossRevenue' => (float) $row->grossRevenue,
                'adminRevenue' => (float) $row->adminRevenue,
                'teacherRevenue' => (float) $row->teacherRevenue,
                'platformCommissionPercent' => (float) $row->grossRevenue > 0
                    ? round((float) $row->adminRevenue / (float) $row->grossRevenue * 100, 2)
                    : null,
                'instructorPercent' => (float) $row->grossRevenue > 0
                    ? round((float) $row->teacherRevenue / (float) $row->grossRevenue * 100, 2)
                    : null,
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
                $join->on('ra.id', '=', DB::raw('(SELECT ra_pick.id FROM revenue_allocations ra_pick WHERE ra_pick.order_id = o.id AND ra_pick.course_id = c.id AND (ra_pick.order_item_id = oi.id OR ra_pick.order_item_id IS NULL) ORDER BY CASE WHEN ra_pick.order_item_id = oi.id THEN 0 ELSE 1 END, ra_pick.id DESC LIMIT 1)'));
            })
            ->leftJoin('teacher_payouts as tp', function ($join) {
                $join->on('tp.order_id', '=', 'o.id')
                    ->on('tp.course_id', '=', 'c.id');
            })
            ->select([
                'o.id as orderId',
                'o.transaction_id as transactionCode',
                'o.status as orderStatus',
                'o.created_at as purchasedAt',
                'student.name as studentName',
                'student.email as studentEmail',
                'c.title as courseTitle',
                DB::raw('COALESCE(ra.partnership_tier, JSON_UNQUOTE(JSON_EXTRACT(tp.metadata, "$.partnership_tier")), "legacy") as partnershipTier'),
                DB::raw('COALESCE(teacher.name, "Unassigned") as instructorName'),
                DB::raw('COALESCE(ra.original_price, tp.gross_amount, oi.price) as originalPrice'),
                DB::raw('COALESCE(ra.discount_amount, 0) as discountAmount'),
                DB::raw('COALESCE(ra.paid_amount, tp.gross_amount, oi.price) as paidAmount'),
                DB::raw('COALESCE(ra.instructor_percent, 100 - tp.commission_rate) as instructorPercent'),
                DB::raw('COALESCE(ra.platform_fee_percent, tp.commission_rate) as platformCommissionPercent'),
                DB::raw('COALESCE(ra.instructor_amount, tp.teacher_amount, 0) as teacherAmount'),
                DB::raw('COALESCE(ra.platform_fee_amount, tp.admin_share_amount, 0) as adminAmount'),
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
                    $refundedAtFormatted = $dt ? Carbon::parse($dt)->format('d/m/Y H:i') : null;
                }

                return [
                    'orderId' => (int) $row->orderId,
                    'transactionCode' => $row->transactionCode ? '#ORD-'.str_pad($row->orderId, 5, '0', STR_PAD_LEFT) : '#ORD-'.str_pad($row->orderId, 5, '0', STR_PAD_LEFT),
                    'purchasedAt' => Carbon::parse($row->purchasedAt)->format('d/m/Y H:i'),
                    'studentName' => $row->studentName,
                    'studentEmail' => $row->studentEmail,
                    'courseTitle' => $row->courseTitle,
                    'instructorName' => $row->instructorName,
                    'partnershipTier' => $row->partnershipTier ?? 'standard',
                    'originalPrice' => (float) $row->originalPrice,
                    'discountAmount' => (float) $row->discountAmount,
                    'paidAmount' => (float) $row->paidAmount,
                    'instructorPercent' => $row->instructorPercent === null ? null : (float) $row->instructorPercent,
                    'platformCommissionPercent' => $row->platformCommissionPercent === null ? null : (float) $row->platformCommissionPercent,
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
            'commissionTiers' => $commissionSettings->tiers(),
            'courses' => $courses,
            'orderHistory' => $orderHistory,
        ];

        return response()->json(array_merge(
            ['data' => $responseData],
            $responseData
        ));
    }

    public function updateCommissionTiers(
        UpdateCommissionSettingsRequest $request,
        CommissionSettingsRepository $commissionSettings,
    ): JsonResponse {
        return response()->json([
            'message' => 'Commission tiers updated.',
            'data' => $commissionSettings->save($request->validated('tiers')),
        ]);
    }

    public function analytics(): JsonResponse
    {
        $totalLearners = User::count();
        $totalEnrollments = Enrollment::count();
        $completedEnrollments = Enrollment::where('status', 'completed')->count();
        $completionRate = $totalEnrollments > 0 ? round(($completedEnrollments / $totalEnrollments) * 100, 1) : 0;

        $teacherCount = User::query()->withRole(['teacher', 'instructor'])->count();
        $activeTeacherCount = User::query()->withRole(['teacher', 'instructor'])->where('status', 'active')->count();
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
                'label' => 'W'.(6 - $weeksAgo),
                'value' => $weekTotal > 0 ? (int) round(($weekCompleted / $weekTotal) * 100) : 0,
            ];
        })->values()->all();

        return response()->json([
            'data' => [
                'metrics' => [
                    ['label' => 'Total learners', 'value' => number_format($totalLearners), 'change' => $this->percentChange(User::query())],
                    ['label' => 'Completion rate', 'value' => $completionRate.'%', 'change' => $this->percentChange(Enrollment::where('status', 'completed'), 'enrolled_at')],
                    ['label' => 'Avg. progress', 'value' => $avgProgress.'%', 'change' => $this->percentChange(Enrollment::query(), 'enrolled_at')],
                    ['label' => 'Teacher retention', 'value' => $teacherRetention.'%', 'change' => $this->percentChange(User::query()->withRole(['teacher', 'instructor']))],
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
