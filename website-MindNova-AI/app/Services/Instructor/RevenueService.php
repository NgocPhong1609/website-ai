<?php

namespace App\Services\Instructor;

use App\Models\InstructorTransaction;
use App\Models\User;
use App\Models\Withdrawal;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class RevenueService
{
    /**
     * Get revenue overview for an instructor.
     */
    public function getOverview(User $instructor): array
    {
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $startOfLastMonth = $now->copy()->subMonth()->startOfMonth();
        $endOfLastMonth = $now->copy()->subMonth()->endOfMonth();

        // 1. Total revenue this month (type: revenue, status: available or escrow)
        $currentMonthRevenue = InstructorTransaction::where('instructor_id', $instructor->id)
            ->where('type', 'revenue')
            ->whereIn('status', ['available', 'escrow'])
            ->whereBetween('created_at', [$startOfMonth, $now])
            ->sum('amount');

        $currentMonthRefund = InstructorTransaction::where('instructor_id', $instructor->id)
            ->where('type', 'refund')
            ->whereBetween('created_at', [$startOfMonth, $now])
            ->sum('amount');
            
        $currentMonthNetRevenue = max(0, $currentMonthRevenue - $currentMonthRefund);

        // Total revenue last month
        $lastMonthRevenue = InstructorTransaction::where('instructor_id', $instructor->id)
            ->where('type', 'revenue')
            ->whereIn('status', ['available', 'escrow'])
            ->whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])
            ->sum('amount');
            
        $lastMonthRefund = InstructorTransaction::where('instructor_id', $instructor->id)
            ->where('type', 'refund')
            ->whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])
            ->sum('amount');
            
        $lastMonthNetRevenue = max(0, $lastMonthRevenue - $lastMonthRefund);

        $revenueGrowth = 0;
        if ($lastMonthNetRevenue > 0) {
            $revenueGrowth = (($currentMonthNetRevenue - $lastMonthNetRevenue) / $lastMonthNetRevenue) * 100;
        }

        // 2. Available balance
        $availableRevenue = InstructorTransaction::where('instructor_id', $instructor->id)
            ->where('type', 'revenue')
            ->where('status', 'available')
            ->sum('amount');
            
        $totalWithdrawn = Withdrawal::where('instructor_id', $instructor->id)
            ->whereIn('status', ['processing', 'completed'])
            ->sum('amount');
            
        $totalRefund = InstructorTransaction::where('instructor_id', $instructor->id)
            ->where('type', 'refund')
            ->sum('amount');
            
        $availableBalance = max(0, $availableRevenue - $totalWithdrawn - $totalRefund);

        // 3. Escrow balance
        $escrowBalance = InstructorTransaction::where('instructor_id', $instructor->id)
            ->where('type', 'revenue')
            ->where('status', 'escrow')
            ->sum('amount');

        // 4. Refund rate (this month)
        $refundCount = InstructorTransaction::where('instructor_id', $instructor->id)
            ->where('type', 'refund')
            ->whereBetween('created_at', [$startOfMonth, $now])
            ->count();
            
        $revenueCount = InstructorTransaction::where('instructor_id', $instructor->id)
            ->where('type', 'revenue')
            ->whereBetween('created_at', [$startOfMonth, $now])
            ->count();
            
        $totalTransactions = $refundCount + $revenueCount;
        $refundRate = $totalTransactions > 0 ? ($refundCount / $totalTransactions) * 100 : 0;

        // 5. Chart Data (Last 7 days revenue)
        $chartData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = $now->copy()->subDays($i);
            $dailyRevenue = InstructorTransaction::where('instructor_id', $instructor->id)
                ->where('type', 'revenue')
                ->whereIn('status', ['available', 'escrow'])
                ->whereDate('created_at', $date->toDateString())
                ->sum('amount');
                
            $chartData[] = [
                'date' => $date->format('Y-m-d'),
                'day' => $date->format('d/m/Y'),
                'revenue' => (float) $dailyRevenue
            ];
        }

        // 6. Recent Transactions
        $recentTransactions = InstructorTransaction::where('instructor_id', $instructor->id)
            ->orderBy('created_at', 'desc')
            ->limit(4)
            ->get()
            ->map(function ($tx) {
                return [
                    'id' => $tx->id,
                    'transaction_code' => '#TXN-' . str_pad($tx->id, 5, '0', STR_PAD_LEFT),
                    'type' => $tx->type,
                    'amount' => (float) $tx->amount,
                    'status' => $tx->status,
                    'description' => $tx->description,
                    'created_at' => $tx->created_at->toIso8601String(),
                ];
            });

        // 7. Mock AI Forecast
        $aiForecast = [
            'expected_end_month' => $currentMonthNetRevenue * 1.5,
            'growth_prediction' => 43,
            'top_course' => 'AI Mastery for Business', 
            'top_course_percentage' => 68
        ];

        return [
            'total_revenue' => (float) $currentMonthNetRevenue,
            'revenue_growth' => round($revenueGrowth, 1),
            'available_balance' => (float) $availableBalance,
            'escrow_balance' => (float) $escrowBalance,
            'refund_rate' => round($refundRate, 1),
            'chart_data' => $chartData,
            'recent_transactions' => $recentTransactions,
            'ai_forecast' => $aiForecast
        ];
    }

    /**
     * Request a withdrawal.
     */
    public function requestWithdrawal(User $instructor, float $amount, array $bankInfo): array
    {
        return DB::transaction(function () use ($instructor, $amount, $bankInfo) {
            $availableRevenue = InstructorTransaction::where('instructor_id', $instructor->id)
                ->where('type', 'revenue')
                ->where('status', 'available')
                ->lockForUpdate()
                ->sum('amount');
                
            $totalWithdrawn = Withdrawal::where('instructor_id', $instructor->id)
                ->whereIn('status', ['processing', 'completed'])
                ->lockForUpdate()
                ->sum('amount');
                
            $totalRefunds = InstructorTransaction::where('instructor_id', $instructor->id)
                ->where('type', 'refund')
                ->lockForUpdate()
                ->sum('amount');
                
            $availableBalance = $availableRevenue - $totalWithdrawn - $totalRefunds;

            if ($amount > $availableBalance) {
                throw new \Exception('Số dư khả dụng không đủ để rút tiền.');
            }

            if ($amount < 50000) {
                throw new \Exception('Số tiền rút tối thiểu là 50,000đ.');
            }

            $withdrawal = Withdrawal::create([
                'instructor_id' => $instructor->id,
                'amount' => $amount,
                'bank_info' => $bankInfo,
                'status' => 'processing',
            ]);

            InstructorTransaction::create([
                'instructor_id' => $instructor->id,
                'type' => 'withdrawal',
                'amount' => $amount,
                'status' => 'processing',
                'reference_type' => Withdrawal::class,
                'reference_id' => $withdrawal->id,
                'description' => 'Rút tiền về Ngân hàng (' . ($bankInfo['bank_name'] ?? 'Unknown') . ')',
            ]);

            return ['success' => true, 'message' => 'Yêu cầu rút tiền đã được tạo thành công.', 'withdrawal_id' => $withdrawal->id];
        });
    }

    /**
     * Get transaction history with filters and pagination.
     */
    public function getTransactionHistory(User $instructor, array $filters = [])
    {
        $query = InstructorTransaction::where('instructor_id', $instructor->id);

        if (!empty($filters['type']) && $filters['type'] !== 'all') {
            $query->where('type', $filters['type']);
        }

        if (!empty($filters['status']) && $filters['status'] !== 'all') {
            $query->where('status', $filters['status']);
        }
        
        if (!empty($filters['search'])) {
            $query->where('description', 'like', '%' . $filters['search'] . '%');
        }
        
        if (!empty($filters['date_range']) && $filters['date_range'] !== 'all') {
            $now = Carbon::now();
            switch ($filters['date_range']) {
                case 'today':
                    $query->whereDate('created_at', $now->toDateString());
                    break;
                case 'week':
                    $query->whereBetween('created_at', [$now->copy()->startOfWeek(), $now->copy()->endOfWeek()]);
                    break;
                case 'month':
                    $query->whereBetween('created_at', [$now->copy()->startOfMonth(), $now->copy()->endOfMonth()]);
                    break;
                case 'last_month':
                    $query->whereBetween('created_at', [$now->copy()->subMonth()->startOfMonth(), $now->copy()->subMonth()->endOfMonth()]);
                    break;
                case 'custom':
                    if (!empty($filters['start_date']) && !empty($filters['end_date'])) {
                        $start = Carbon::parse($filters['start_date'])->startOfDay();
                        $end = Carbon::parse($filters['end_date'])->endOfDay();
                        $query->whereBetween('created_at', [$start, $end]);
                    }
                    break;
            }
        }

        return $query->orderBy('created_at', 'desc')->paginate(10)->through(function ($tx) {
            return [
                'id' => $tx->id,
                'transaction_code' => '#TXN-' . str_pad($tx->id, 5, '0', STR_PAD_LEFT),
                'type' => $tx->type,
                'amount' => (float) $tx->amount,
                'status' => $tx->status,
                'description' => $tx->description,
                'created_at' => $tx->created_at->toIso8601String(),
            ];
        });
    }

    /**
     * Get sales report by courses.
     */
    public function getSalesReport(User $instructor, int $days = 7): array
    {
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $startOfLastMonth = $now->copy()->subMonth()->startOfMonth();
        $endOfLastMonth = $now->copy()->subMonth()->endOfMonth();

        $courses = \App\Models\Course::where('teacher_id', $instructor->id)->get();
        
        $totalSales = 0;
        $totalEnrollments = 0;
        $totalViews = 0;
        
        $lastMonthSales = 0;
        $lastMonthEnrollments = 0;
        // Views growth is tricky since views_count is just an absolute number on course table, not a time series.
        // We will assume 0 for last month views if we can't track it, or just return 0% growth.
        
        $coursesReport = [];
        
        foreach ($courses as $course) {
            $enrollmentsCount = \App\Models\Enrollment::where('course_id', $course->id)->count();
            
            $lastMonthEnrollmentsCount = \App\Models\Enrollment::where('course_id', $course->id)
                ->whereBetween('enrolled_at', [$startOfLastMonth, $endOfLastMonth])
                ->count();
            
            $revenue = InstructorTransaction::where('instructor_id', $instructor->id)
                ->where('type', 'revenue')
                ->whereIn('status', ['available', 'escrow'])
                ->whereHasMorph('reference', [\App\Models\OrderItem::class, \App\Models\Enrollment::class], function ($q) use ($course) {
                    $q->where('course_id', $course->id);
                })->sum('amount');
                
            $refund = InstructorTransaction::where('instructor_id', $instructor->id)
                ->where('type', 'refund')
                ->whereHasMorph('reference', [\App\Models\OrderItem::class, \App\Models\Enrollment::class], function ($q) use ($course) {
                    $q->where('course_id', $course->id);
                })->sum('amount');
                
            $revenue = max(0, $revenue - $refund);
                
            $lastMonthRev = InstructorTransaction::where('instructor_id', $instructor->id)
                ->where('type', 'revenue')
                ->whereIn('status', ['available', 'escrow'])
                ->whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])
                ->whereHasMorph('reference', [\App\Models\OrderItem::class, \App\Models\Enrollment::class], function ($q) use ($course) {
                    $q->where('course_id', $course->id);
                })->sum('amount');
                
            $lastMonthRefund = InstructorTransaction::where('instructor_id', $instructor->id)
                ->where('type', 'refund')
                ->whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])
                ->whereHasMorph('reference', [\App\Models\OrderItem::class, \App\Models\Enrollment::class], function ($q) use ($course) {
                    $q->where('course_id', $course->id);
                })->sum('amount');
                
            $lastMonthRev = max(0, $lastMonthRev - $lastMonthRefund);
                
            $views = (int) $course->views_count;
            $conversionRate = $views > 0 ? ($enrollmentsCount / $views) * 100 : 0;
            
            $totalSales += $revenue;
            $totalEnrollments += $enrollmentsCount;
            $totalViews += $views;
            
            $lastMonthSales += $lastMonthRev;
            $lastMonthEnrollments += $lastMonthEnrollmentsCount;
            
            $coursesReport[] = [
                'course_id' => $course->id,
                'course_name' => $course->title,
                'price' => (float) $course->price,
                'views' => $views,
                'enrollments' => $enrollmentsCount,
                'conversion_rate' => round($conversionRate, 1),
                'revenue' => (float) $revenue,
            ];
        }
        
        $avgConversion = $totalViews > 0 ? ($totalEnrollments / $totalViews) * 100 : 0;
        
        // Calculate Growth Percentages
        $salesGrowth = $lastMonthSales > 0 ? (($totalSales - $lastMonthSales) / $lastMonthSales) * 100 : ($totalSales > 0 ? 100 : 0);
        $enrollmentsGrowth = $lastMonthEnrollments > 0 ? (($totalEnrollments - $lastMonthEnrollments) / $lastMonthEnrollments) * 100 : ($totalEnrollments > 0 ? 100 : 0);
        
        // Chart Data (Last X Days)
        $chartData = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $date = $now->copy()->subDays($i);
            $dayStart = $date->copy()->startOfDay();
            $dayEnd = $date->copy()->endOfDay();
            
            $dayRev = InstructorTransaction::where('instructor_id', $instructor->id)
                ->where('type', 'revenue')
                ->whereIn('status', ['available', 'escrow'])
                ->whereBetween('created_at', [$dayStart, $dayEnd])
                ->sum('amount');
                
            $dayRefund = InstructorTransaction::where('instructor_id', $instructor->id)
                ->where('type', 'refund')
                ->whereBetween('created_at', [$dayStart, $dayEnd])
                ->sum('amount');
                
            $label = $date->locale('vi')->isoFormat('D/M');
                
            $chartData[] = [
                'label' => $label,
                'revenue' => (float) $dayRev,
                'refund' => (float) $dayRefund
            ];
        }
        
        return [
            'overview' => [
                'total_sales' => (float) $totalSales,
                'sales_growth' => round($salesGrowth, 1),
                'total_enrollments' => $totalEnrollments,
                'enrollments_growth' => round($enrollmentsGrowth, 1),
                'avg_conversion_rate' => round($avgConversion, 1),
                'conversion_growth' => 0, // Mocked as 0 for now since we don't have historical views
                'total_views' => $totalViews,
                'views_growth' => 0,
            ],
            'chart_data' => $chartData,
            'courses' => $coursesReport
        ];
    }
}
