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
        $validated = $request->validate([
            'provider' => 'required|string|in:vnpay,momo,banking',
            'holder_name' => 'required|string|max:120',
            'account_number' => 'required|string|min:6|max:40',
            'bank_name' => 'nullable|string|max:120',
            'is_default' => 'sometimes|boolean',
        ]);

        if ($validated['provider'] === 'banking' && blank($validated['bank_name'] ?? null)) {
            return response()->json([
                'success' => false,
                'message' => 'Vui lòng nhập tên ngân hàng.',
            ], 422);
        }

        $user = $request->user();
        $isFirst = ! StudentPaymentMethod::where('user_id', $user->id)->exists();
        $makeDefault = $isFirst || $request->boolean('is_default');

        if ($makeDefault) {
            StudentPaymentMethod::where('user_id', $user->id)->update(['is_default' => false]);
        }

        $method = StudentPaymentMethod::create([
            'user_id' => $user->id,
            'provider' => $validated['provider'],
            'holder_name' => $validated['holder_name'],
            'account_number' => preg_replace('/\s+/', '', $validated['account_number']),
            'bank_name' => $validated['bank_name'] ?? null,
            'is_default' => $makeDefault,
        ]);

        return response()->json(['success' => true, 'data' => $method->toPublicArray()], 201);
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
