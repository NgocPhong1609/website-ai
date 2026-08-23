<?php



namespace App\Http\Controllers\Api\Student;



use App\Http\Controllers\Controller;

use Illuminate\Http\Request;

use App\Models\UserStreak;

use App\Models\ActivityLog;

use Carbon\Carbon;



class DashboardController extends Controller

{

    public function overview(Request $request)
    {
        $user = $request->user();

        // 1. Lấy thông tin streak của user
        $streak = UserStreak::firstOrCreate(
            ['user_id' => $user->id],
            ['current_streak' => 0, 'longest_streak' => 0, 'freeze_count' => 1]
        );

        // 2. Kiểm tra xem hôm nay đã điểm danh chưa (Dựa trực tiếp vào last_checkin_date)
        $today = Carbon::now('Asia/Ho_Chi_Minh')->toDateString();

        // So sánh trực tiếp chuỗi ngày (VD: "2026-08-23")
        $isCheckedInToday = $streak->last_checkin_date && Carbon::parse($streak->last_checkin_date)->toDateString() === $today;

        // 3. Lấy danh sách các ngày đã điểm danh trong tháng này
        $checkedInDates = ActivityLog::where('user_id', $user->id)
            ->where('action', 'check_in_daily')
            ->whereMonth('created_at', Carbon::now('Asia/Ho_Chi_Minh')->month)
            ->pluck('created_at')
            ->map(fn($date) => Carbon::parse($date)->toDateString())
            ->toArray();

        // Nếu hôm nay đã điểm danh (lưu ở user_streaks) nhưng trong ActivityLog chưa kịp đẩy vào mảng checkedInDates, ta cộng thêm vào để lịch sáng luôn
        if ($isCheckedInToday && !in_array($today, $checkedInDates)) {
            $checkedInDates[] = $today;
        }

        // 4. Trả về cấu trúc JSON đồng bộ hoàn toàn với Frontend Next.js
        return response()->json([
            'success' => true,
            'data' => [
                'user' => [
                    'name' => $user->name,
                ],
                'study_streak' => [
                    'days' => $streak->current_streak,
                    'longest' => $streak->longest_streak,
                    'is_checked_in_today' => $isCheckedInToday, // 🚀 Trạng thái chuẩn xác tuyệt đối
                    'freeze_count' => $streak->freeze_count,
                ],
                'checked_in_dates' => $checkedInDates,
                'overall_progress' => [
                    'percentage' => 68,
                    'delta' => 'Tiến trình học tập',
                    'level' => 4
                ],
                'daily_goal' => [
                    'percentage' => 0,
                    'completed' => 0,
                    'target' => 3
                ],
                'weekly_activity' => [
                    "T2" => true, "T3" => true, "T4" => true, "T5" => true, "T6" => false, "T7" => false, "CN" => false
                ],
                'courses' => [],
                'focus_areas' => [],
                'ai_suggestion' => null,
                'advanced_recommendations' => [],
            ]
        ], 200);
    }

}
