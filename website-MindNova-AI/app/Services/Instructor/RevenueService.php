<?php

namespace App\Services\Instructor;

use App\Models\InstructorTransaction;
use App\Models\RevenueAllocation;
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
        // On-demand unlock of eligible PENDING allocations
        app(RevenueUnlockService::class)->unlockEligibleAllocations($instructor->id);

        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $startOfLastMonth = $now->copy()->subMonth()->startOfMonth();
        $endOfLastMonth = $now->copy()->subMonth()->endOfMonth();

        // 1. Pending Balance (Allocations in PENDING/HOLD status)
        $pendingBalance = (float) RevenueAllocation::where('instructor_id', $instructor->id)
            ->where('status', 'PENDING')
            ->sum('instructor_amount');

        // 2. Available Revenue (Allocations in AVAILABLE status)
        $availableAllocationsRevenue = (float) RevenueAllocation::where('instructor_id', $instructor->id)
            ->where('status', 'AVAILABLE')
            ->sum('instructor_amount');

        $legacyAvailableRevenue = (float) InstructorTransaction::where('instructor_id', $instructor->id)
            ->where('type', 'revenue')
            ->where('status', 'available')
            ->whereNotIn('reference_id', RevenueAllocation::where('instructor_id', $instructor->id)->pluck('order_item_id'))
            ->sum('amount');

        $availableRevenue = $availableAllocationsRevenue + $legacyAvailableRevenue;

        // Total Withdrawn
        $totalWithdrawn = (float) Withdrawal::where('instructor_id', $instructor->id)
            ->whereIn('status', ['processing', 'completed'])
            ->sum('amount');

        $availableBalance = max(0, $availableRevenue - $totalWithdrawn);

        // Month Net Revenue
        $currentMonthRevenue = (float) RevenueAllocation::where('instructor_id', $instructor->id)
            ->whereIn('status', ['PENDING', 'AVAILABLE'])
            ->whereBetween('created_at', [$startOfMonth, $now])
            ->sum('instructor_amount');

        if ($currentMonthRevenue == 0) {
            $currentMonthRevenue = (float) InstructorTransaction::where('instructor_id', $instructor->id)
                ->where('type', 'revenue')
                ->whereBetween('created_at', [$startOfMonth, $now])
                ->sum('amount');
        }

        $lastMonthRevenue = (float) RevenueAllocation::where('instructor_id', $instructor->id)
            ->whereIn('status', ['PENDING', 'AVAILABLE'])
            ->whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])
            ->sum('instructor_amount');

        $revenueGrowth = 0;
        if ($lastMonthRevenue > 0) {
            $revenueGrowth = (($currentMonthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100;
        }

        // Refund rate this month
        $refundCount = RevenueAllocation::where('instructor_id', $instructor->id)
            ->where('status', 'REFUNDED')
            ->whereBetween('created_at', [$startOfMonth, $now])
            ->count();

        $totalAllocationsCount = RevenueAllocation::where('instructor_id', $instructor->id)
            ->whereBetween('created_at', [$startOfMonth, $now])
            ->count();

        $refundRate = $totalAllocationsCount > 0 ? ($refundCount / $totalAllocationsCount) * 100 : 0;

        // Chart Data (Last 7 days revenue)
        $chartData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = $now->copy()->subDays($i);
            $dailyRevenue = (float) RevenueAllocation::where('instructor_id', $instructor->id)
                ->whereIn('status', ['PENDING', 'AVAILABLE'])
                ->whereDate('created_at', $date->toDateString())
                ->sum('instructor_amount');

            if ($dailyRevenue == 0) {
                $dailyRevenue = (float) InstructorTransaction::where('instructor_id', $instructor->id)
                    ->where('type', 'revenue')
                    ->whereDate('created_at', $date->toDateString())
                    ->sum('amount');
            }

            $chartData[] = [
                'date' => $date->format('Y-m-d'),
                'day' => $date->format('d/m/Y'),
                'revenue' => (float) $dailyRevenue
            ];
        }

        // Recent Transactions
        $recentTransactions = InstructorTransaction::where('instructor_id', $instructor->id)
            ->orderBy('created_at', 'desc')
            ->limit(6)
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

        // AI Forecast
        $aiForecast = [
            'expected_end_month' => $currentMonthRevenue * 1.5,
            'growth_prediction' => 43,
            'top_course' => 'AI Mastery for Business', 
            'top_course_percentage' => 68
        ];

        return [
            'total_revenue' => (float) ($currentMonthRevenue + $pendingBalance),
            'revenue_growth' => round($revenueGrowth, 1),
            'available_balance' => (float) $availableBalance,
            'escrow_balance' => (float) $pendingBalance, // Mapped to Pending/Hold Balance
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
            // Trigger unlock check first
            app(RevenueUnlockService::class)->unlockEligibleAllocations($instructor->id);

            $availableAllocationsRevenue = (float) RevenueAllocation::where('instructor_id', $instructor->id)
                ->where('status', 'AVAILABLE')
                ->lockForUpdate()
                ->sum('instructor_amount');

            $legacyAvailableRevenue = (float) InstructorTransaction::where('instructor_id', $instructor->id)
                ->where('type', 'revenue')
                ->where('status', 'available')
                ->whereNotIn('reference_id', RevenueAllocation::where('instructor_id', $instructor->id)->pluck('order_item_id'))
                ->lockForUpdate()
                ->sum('amount');

            $availableRevenue = $availableAllocationsRevenue + $legacyAvailableRevenue;

            $totalWithdrawn = (float) Withdrawal::where('instructor_id', $instructor->id)
                ->whereIn('status', ['processing', 'completed'])
                ->lockForUpdate()
                ->sum('amount');

            $availableBalance = max(0, $availableRevenue - $totalWithdrawn);

            if ($amount > $availableBalance) {
                $pendingBalance = (float) RevenueAllocation::where('instructor_id', $instructor->id)
                    ->where('status', 'PENDING')
                    ->sum('instructor_amount');

                if ($pendingBalance > 0) {
                    throw new \Exception("Số dư khả dụng không đủ để rút tiền. Bạn hiện có " . number_format($pendingBalance) . "đ đang ở trạng thái HOLD (chờ hết điều kiện hoàn tiền).");
                }
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

        return $query->orderBy('created_at', 'desc')->paginate(15);
    }

    /**
     * Get sales report.
     */
    public function getSalesReport(User $instructor, int $days = 7): array
    {
        $now = Carbon::now();
        $chartData = [];

        for ($i = $days - 1; $i >= 0; $i--) {
            $date = $now->copy()->subDays($i);

            $dayRevenue = (float) RevenueAllocation::where('instructor_id', $instructor->id)
                ->whereIn('status', ['PENDING', 'AVAILABLE'])
                ->whereDate('created_at', $date->toDateString())
                ->sum('instructor_amount');

            $dayRefund = (float) RevenueAllocation::where('instructor_id', $instructor->id)
                ->where('status', 'REFUNDED')
                ->whereDate('created_at', $date->toDateString())
                ->sum('instructor_amount');

            $chartData[] = [
                'date' => $date->format('Y-m-d'),
                'day' => $date->format('d/m'),
                'revenue' => $dayRevenue,
                'refund' => $dayRefund
            ];
        }

        return $chartData;
    }
}
