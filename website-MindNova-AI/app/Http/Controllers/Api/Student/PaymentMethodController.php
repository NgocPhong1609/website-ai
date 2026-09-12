<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use App\Models\StudentPaymentMethod;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentMethodController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $methods = StudentPaymentMethod::where('user_id', $request->user()->id)
            ->orderByDesc('is_default')
            ->latest()
            ->get()
            ->map(fn (StudentPaymentMethod $method) => $method->toPublicArray())
            ->values();

        return response()->json(['success' => true, 'data' => $methods]);
    }

    public function store(Request $request): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => 'Website không lưu số tài khoản, số ví hoặc thông tin ngân hàng. Vui lòng thanh toán trực tiếp qua VNPAY hoặc MoMo.',
        ], 422);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $method = StudentPaymentMethod::where('user_id', $request->user()->id)->findOrFail($id);
        $wasDefault = $method->is_default;
        $method->delete();

        if ($wasDefault) {
            $next = StudentPaymentMethod::where('user_id', $request->user()->id)->latest()->first();
            $next?->update(['is_default' => true]);
        }

        return response()->json(['success' => true]);
    }

    public function setDefault(Request $request, int $id): JsonResponse
    {
        $method = StudentPaymentMethod::where('user_id', $request->user()->id)->findOrFail($id);
        StudentPaymentMethod::where('user_id', $request->user()->id)->update(['is_default' => false]);
        $method->update(['is_default' => true]);

        return response()->json(['success' => true, 'data' => $method->fresh()->toPublicArray()]);
    }
}
