<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Order;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function overview(Request $request): JsonResponse
    {
        $totalUsers = User::count();
        $totalCourses = Course::count();
        $totalRevenue = (float) Order::where('status', 'completed')->sum('total_amount');
        $activeSubscriptions = Subscription::where('status', 'active')->count();

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
                    'trend' => '+8.2%',
                    'note' => 'so với tháng trước',
                ],
                [
                    'label' => 'Khóa học đang hoạt động',
                    'value' => number_format($totalCourses),
                    'trend' => '+14',
                    'note' => 'mới cập nhật',
                ],
                [
                    'label' => 'Doanh thu',
                    'value' => '$' . number_format($totalRevenue, 1) . 'K',
                    'trend' => '+12.6%',
                    'note' => 'tổng doanh số',
                ],
                [
                    'label' => 'Tỉ lệ hoàn thành',
                    'value' => '76%',
                    'trend' => '+4.1%',
                    'note' => 'độ hài lòng học viên',
                ],
            ],
            'activities' => [
                ['label' => 'T1', 'value' => 48],
                ['label' => 'T2', 'value' => 78],
                ['label' => 'T3', 'value' => 62],
                ['label' => 'T4', 'value' => 95],
                ['label' => 'T5', 'value' => 88],
                ['label' => 'T6', 'value' => 110],
                ['label' => 'T7', 'value' => 130],
            ],
            'health' => [
                ['title' => 'API Laravel', 'status' => 'Ổn định', 'color' => 'bg-emerald-500'],
                ['title' => 'Hàng đợi tác vụ', 'status' => 'Ổn định', 'color' => 'bg-cyan-500'],
                ['title' => 'Lưu trữ', 'status' => 'Cảnh báo', 'color' => 'bg-amber-500'],
                ['title' => 'Dịch vụ AI', 'status' => 'Ổn định', 'color' => 'bg-violet-500'],
            ],
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
}
