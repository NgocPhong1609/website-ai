<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use App\Models\Course;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CouponController extends Controller
{
    use ApiResponse;

    /**
     * POST /api/coupons/apply
     * Validate and calculate discount for a coupon code on checkout.
     */
    public function apply(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string',
            'course_id' => 'required|integer|exists:courses,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Vui lòng nhập mã giảm giá hợp lệ.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $code = strtoupper(trim($request->code));
        $courseId = (int) $request->course_id;

        $coupon = Coupon::where('code', $code)->first();

        if (!$coupon) {
            return response()->json([
                'success' => false,
                'message' => 'Mã giảm giá không tồn tại.',
            ], 404);
        }

        if ($coupon->status !== 'active') {
            return response()->json([
                'success' => false,
                'message' => 'Mã giảm giá này hiện không còn hoạt động.',
            ], 400);
        }

        if ($coupon->starts_at && now()->lessThan($coupon->starts_at)) {
            return response()->json([
                'success' => false,
                'message' => 'Chương trình khuyến mãi chưa bắt đầu.',
            ], 400);
        }

        if ($coupon->expires_at && now()->greaterThan($coupon->expires_at)) {
            return response()->json([
                'success' => false,
                'message' => 'Mã giảm giá này đã hết hạn sử dụng.',
            ], 400);
        }

        if ($coupon->max_uses !== null && (int) $coupon->used_count >= (int) $coupon->max_uses) {
            return response()->json([
                'success' => false,
                'message' => 'Mã giảm giá này đã hết lượt sử dụng.',
            ], 400);
        }

        $course = Course::find($courseId);
        if (!$course) {
            return response()->json([
                'success' => false,
                'message' => 'Khóa học không tồn tại.',
            ], 404);
        }

        // Rule 1: Teacher isolation check - If coupon belongs to a specific instructor, course MUST belong to that instructor!
        if ($coupon->instructor_id) {
            $courseTeacherId = (int) ($course->teacher_id ?? 0);
            if ((int) $coupon->instructor_id !== $courseTeacherId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Mã giảm giá này chỉ được áp dụng cho các khóa học của giảng viên tạo mã.',
                ], 400);
            }
        }

        // Rule 2: Specific course scope check
        if ($coupon->course_id && (int) $coupon->course_id !== $courseId) {
            return response()->json([
                'success' => false,
                'message' => 'Mã giảm giá này chỉ áp dụng cho khóa học được chỉ định.',
            ], 400);
        }

        $originalPrice = (float) $course->price;

        $discountAmount = 0;
        if ($coupon->type === 'percent') {
            $discountAmount = round($originalPrice * ((float) $coupon->value / 100));
        } else {
            $discountAmount = min($originalPrice, (float) $coupon->value);
        }

        $finalPrice = max(0, $originalPrice - $discountAmount);
        $isFree = $finalPrice <= 0;

        return response()->json([
            'success' => true,
            'message' => 'Áp dụng mã giảm giá thành công!',
            'data' => [
                'code' => $coupon->code,
                'type' => $coupon->type,
                'value' => (float) $coupon->value,
                'discount_amount' => $discountAmount,
                'original_price' => $originalPrice,
                'final_price' => $finalPrice,
                'is_free' => $isFree,
            ]
        ]);
    }
}
