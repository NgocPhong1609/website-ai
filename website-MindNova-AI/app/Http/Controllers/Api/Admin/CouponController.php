<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CouponController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Coupon::query()->with('course:id,title')->latest();

        if ($request->filled('search')) {
            $keyword = trim((string) $request->string('search'));
            $query->where(function ($q) use ($keyword) {
                $q->where('code', 'like', "%{$keyword}%")
                    ->orWhere('title', 'like', "%{$keyword}%");
            });
        }

        if ($request->has('is_active')) {
            $query->where('is_active', filter_var($request->boolean('is_active'), FILTER_VALIDATE_BOOLEAN));
        }

        if ($request->filled('course_id')) {
            $query->where('course_id', (int) $request->input('course_id'));
        }

        return response()->json([
            'data' => $query->get(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'code' => ['required', 'string', 'max:50', 'unique:coupons,code'],
            'title' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'discount_type' => ['required', 'in:percent,fixed'],
            'value' => ['required', 'numeric', 'min:0'],
            'course_id' => ['nullable', 'integer', 'exists:courses,id'],
            'min_order_amount' => ['nullable', 'numeric', 'min:0'],
            'max_discount_amount' => ['nullable', 'numeric', 'min:0'],
            'starts_at' => ['nullable', 'date'],
            'expires_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'usage_limit' => ['nullable', 'integer', 'min:1'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $data['code'] = Str::upper(trim((string) $data['code']));

        $coupon = Coupon::create([
            'code' => $data['code'],
            'title' => $data['title'] ?? $data['code'],
            'description' => $data['description'] ?? null,
            'discount_type' => $data['discount_type'],
            'value' => $data['value'],
            'course_id' => $data['course_id'] ?? null,
            'min_order_amount' => $data['min_order_amount'] ?? null,
            'max_discount_amount' => $data['max_discount_amount'] ?? null,
            'starts_at' => $data['starts_at'] ?? now(),
            'expires_at' => $data['expires_at'] ?? null,
            'usage_limit' => $data['usage_limit'] ?? null,
            'is_active' => $data['is_active'] ?? true,
            'used_count' => 0,
        ]);

        return response()->json([
            'message' => 'Coupon created successfully.',
            'data' => $coupon->load('course:id,title'),
        ], 201);
    }

    public function update(Request $request, Coupon $coupon): JsonResponse
    {
        $data = $request->validate([
            'code' => ['sometimes', 'string', 'max:50', 'unique:coupons,code,' . $coupon->id],
            'title' => ['sometimes', 'nullable', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'discount_type' => ['sometimes', 'in:percent,fixed'],
            'value' => ['sometimes', 'numeric', 'min:0'],
            'course_id' => ['sometimes', 'nullable', 'integer', 'exists:courses,id'],
            'min_order_amount' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'max_discount_amount' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'starts_at' => ['sometimes', 'nullable', 'date'],
            'expires_at' => ['sometimes', 'nullable', 'date', 'after_or_equal:starts_at'],
            'usage_limit' => ['sometimes', 'nullable', 'integer', 'min:1'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        if (array_key_exists('code', $data)) {
            $data['code'] = Str::upper(trim((string) $data['code']));
        }

        $coupon->update($data);

        return response()->json([
            'message' => 'Coupon updated successfully.',
            'data' => $coupon->fresh()->load('course:id,title'),
        ]);
    }

    public function destroy(Coupon $coupon): JsonResponse
    {
        $coupon->delete();

        return response()->json([
            'message' => 'Coupon deleted successfully.',
        ]);
    }
}
