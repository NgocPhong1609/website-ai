<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller; // Phải import base Controller vì khác namespace
use App\Models\UserStreak;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Carbon\Carbon;

class StreakController extends Controller
{
    public function checkIn(Request $request)
    {
        $user = $request->user();

        // Mốc thời gian chuẩn theo giờ Việt Nam
        $today = Carbon::now('Asia/Ho_Chi_Minh')->toDateString();
        $yesterday = Carbon::now('Asia/Ho_Chi_Minh')->subDay()->startOfDay();

        // Lấy hoặc tạo mới dữ liệu Streak của user này
        $streak = UserStreak::firstOrCreate(
            ['user_id' => $user->id],
            ['current_streak' => 0, 'longest_streak' => 0, 'freeze_count' => 1]
        );

        // Ngày check-in cuối cùng dạng Carbon object
        $lastCheckin = $streak->last_checkin_date ? Carbon::parse($streak->last_checkin_date)->startOfDay() : null;

        // 1. Kiểm tra: Hôm nay điểm danh chưa?
        if ($lastCheckin && $lastCheckin->equalTo($today)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Hôm nay bạn đã điểm danh rồi!'
            ], 400);
        }

        // 2. Logic tính toán chuỗi
        if ($lastCheckin && $lastCheckin->equalTo($yesterday)) {
            // Hôm qua có học -> Cộng dồn chuỗi
            $streak->current_streak += 1;
        } else {
            // Hôm qua bỏ lỡ -> Đứt chuỗi, tính lại từ 1
            $streak->current_streak = 1;
        }

        // Cập nhật kỷ lục nếu phá đảo
        if ($streak->current_streak > $streak->longest_streak) {
            $streak->longest_streak = $streak->current_streak;
        }

        // Cập nhật ngày điểm danh
        $streak->last_checkin_date = $today;
        $streak->save();

        // 3. Lưu log hành động vào ActivityLog
        ActivityLog::create([
            'user_id'    => $user->id,
            'action'     => 'check_in_daily',
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'metadata'   => [
                'device' => 'web',
                'auto'   => $request->input('type') === 'auto' ? true : false
            ]
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Ghi nhận tiến độ thành công!',
            'data' => [
                'current_streak' => $streak->current_streak,
                'longest_streak' => $streak->longest_streak
            ]
        ], 200);
    }
}
