<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Payment;
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
        $totalRevenue = (float) Payment::where('status', 'completed')->sum('amount');
        $activeSubscriptions = Subscription::where('status', 'active')->count();

        $recentUsers = User::query()
            ->latest()
            ->take(5)
            ->get()
            ->map(function (User $user) {
                return [
                    'name' => $user->name,
                    'role' => $user->role ?? 'user',
                    'status' => $user->status === 'active' ? 'Active' : 'Inactive',
                ];
            })
            ->values()
            ->all();

        return response()->json([
            'hero' => [
                'title' => 'Xin chào, Admin',
                'description' => 'Trang quản trị để bạn theo dõi người dùng, khóa học, doanh thu và trạng thái hệ thống real-time.',
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
                ['title' => 'API Laravel', 'status' => 'Healthy', 'color' => 'bg-emerald-500'],
                ['title' => 'Queue Jobs', 'status' => 'Stable', 'color' => 'bg-cyan-500'],
                ['title' => 'Storage', 'status' => 'Warning', 'color' => 'bg-amber-500'],
                ['title' => 'AI Service', 'status' => 'Healthy', 'color' => 'bg-violet-500'],
            ],
            'users' => $recentUsers,
            'quickActions' => [
                'Quản lý khóa học',
                'Quản lý người dùng',
                'Báo cáo doanh thu',
                'Cấu hình hệ thống',
            ],
        ]);
    }
}
