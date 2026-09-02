<?php

namespace App\Http\Controllers\Api\Instructor;

use App\Http\Controllers\Controller;
use App\Services\Instructor\RevenueService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class RevenueController extends Controller
{
    protected RevenueService $revenueService;

    public function __construct(RevenueService $revenueService)
    {
        $this->revenueService = $revenueService;
    }

    /**
     * Lấy tổng quan doanh thu của giảng viên
     */
    public function getOverview(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user || !$user->isTeacher()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            $data = $this->revenueService->getOverview($user);
            return response()->json(['data' => $data], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Lỗi khi lấy dữ liệu tổng quan doanh thu.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Yêu cầu rút tiền
     */
    public function requestWithdraw(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user || !$user->isTeacher()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric|min:50000',
            'bank_info' => 'required|array',
            'bank_info.bank_name' => 'required|string|max:255',
            'bank_info.account_number' => 'required|string|max:50',
            'bank_info.account_name' => 'required|string|max:255',
        ], [
            'amount.min' => 'Số tiền rút tối thiểu là 50,000đ.',
            'bank_info.required' => 'Thông tin ngân hàng là bắt buộc.',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Dữ liệu không hợp lệ.', 'errors' => $validator->errors()], 422);
        }

        try {
            $result = $this->revenueService->requestWithdrawal($user, $request->amount, $request->bank_info);
            return response()->json($result, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400); // 400 for business logic errors like insufficient balance
        }
    }

    /**
     * Lấy danh sách giao dịch có phân trang
     */
    public function getTransactions(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user || !$user->isTeacher()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            $filters = $request->only(['type', 'status', 'search', 'date_range', 'start_date', 'end_date']);
            $data = $this->revenueService->getTransactionHistory($user, $filters);
            return response()->json($data, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Lỗi khi lấy dữ liệu giao dịch.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Lấy báo cáo bán hàng
     */
    public function getSalesReport(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user || !$user->isTeacher()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            $days = (int) request('days', 7);
            $data = $this->revenueService->getSalesReport($user, $days);
            return response()->json(['data' => $data], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Lỗi khi lấy báo cáo bán hàng.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Lấy thông tin tài khoản nhận tiền của giảng viên
     */
    public function getPayoutMethods(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user || !$user->isTeacher()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json([
            'data' => $user->payout_info ?? [
                'bank_name' => '',
                'account_number' => '',
                'account_name' => '',
            ]
        ], 200);
    }

    /**
     * Cập nhật thông tin tài khoản nhận tiền
     */
    public function updatePayoutMethods(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user || !$user->isTeacher()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'bank_name' => 'required|string|max:255',
            'account_number' => 'required|string|max:100',
            'account_name' => 'required|string|max:255',
        ], [
            'bank_name.required' => 'Tên ngân hàng / cổng thanh toán là bắt buộc.',
            'account_number.required' => 'Số tài khoản / Email là bắt buộc.',
            'account_name.required' => 'Tên người thụ hưởng là bắt buộc.',
        ]);

        $user->update(['payout_info' => $validated]);

        return response()->json([
            'message' => 'Cập nhật thông tin tài khoản nhận tiền thành công.',
            'data' => $validated
        ], 200);
    }
}
