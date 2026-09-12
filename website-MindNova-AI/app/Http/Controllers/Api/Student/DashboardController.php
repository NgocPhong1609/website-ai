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
        $user = $request->user('sanctum') ?? $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // 1. Lấy thông tin streak của user
        $streak = UserStreak::firstOrCreate(
            ['user_id' => $user->id],
            ['current_streak' => 0, 'longest_streak' => 0, 'freeze_count' => 1]
        );

        // 2. Kiểm tra xem hôm nay đã điểm danh chưa (Dựa trực tiếp vào last_checkin_date)
        $today = Carbon::now('Asia/Ho_Chi_Minh')->toDateString();

        // So sánh trực tiếp chuỗi ngày (VD: "2026-08-23")
        $isCheckedInToday = $streak->last_checkin_date
            && Carbon::parse($streak->last_checkin_date)->timezone('Asia/Ho_Chi_Minh')->toDateString() === $today;

        $nowVn = Carbon::now('Asia/Ho_Chi_Minh');
        $monthStartUtc = $nowVn->copy()->startOfMonth()->utc();
        $monthEndUtc = $nowVn->copy()->endOfMonth()->utc();

        $checkedInDates = ActivityLog::where('user_id', $user->id)
            ->where('action', 'check_in_daily')
            ->whereBetween('created_at', [$monthStartUtc, $monthEndUtc])
            ->pluck('created_at')
            ->map(fn ($date) => Carbon::parse($date)->timezone('Asia/Ho_Chi_Minh')->toDateString())
            ->unique()
            ->values()
            ->all();

        if ($isCheckedInToday && ! in_array($today, $checkedInDates, true)) {
            $checkedInDates[] = $today;
        }

        $weekStart = $nowVn->copy()->startOfWeek(Carbon::MONDAY);
        $weekKeys = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
        $weeklyActivity = [];
        foreach ($weekKeys as $offset => $key) {
            $date = $weekStart->copy()->addDays($offset)->toDateString();
            $weeklyActivity[$key] = in_array($date, $checkedInDates, true);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'user' => [
                    'name' => $user->name,
                ],
                'study_streak' => [
                    'days' => $streak->current_streak,
                    'longest' => $streak->longest_streak,
                    'is_checked_in_today' => $isCheckedInToday,
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
                'weekly_activity' => $weeklyActivity,
                'courses' => [],
                'focus_areas' => [],
                'ai_suggestion' => null,
                'advanced_recommendations' => [],
            ]
        ], 200);
    }

}
