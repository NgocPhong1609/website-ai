<?php

namespace App\Http\Controllers\Api\Instructor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Coupon;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class CouponController extends Controller
{
    public function index(Request $request)
    {
        $teacherId = auth()->id();
        
        $query = Coupon::where('instructor_id', $teacherId);

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $coupons = $query->orderBy('created_at', 'desc')->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $coupons->items(),
            'total' => $coupons->total(),
            'stats' => [
                'total_codes' => Coupon::where('instructor_id', $teacherId)->count(),
                'used_count' => Coupon::where('instructor_id', $teacherId)->sum('used_count'),
                'discount_amount' => 0 // Can calculate based on usage history later
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|unique:coupons,code|max:50',
            'type' => 'required|in:percent,fixed',
            'value' => 'required|numeric|min:0',
            'max_uses' => 'nullable|integer|min:1',
            'expires_at' => 'nullable|date',
            'status' => 'required|in:active,disabled',
            'course_id' => 'nullable|exists:courses,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $coupon = Coupon::create(array_merge(
            $request->all(),
            ['instructor_id' => auth()->id()]
        ));

        return response()->json([
            'success' => true,
            'message' => 'Coupon created successfully',
            'data' => $coupon
        ]);
    }

    public function update(Request $request, $id)
    {
        $coupon = Coupon::where('id', $id)->where('instructor_id', auth()->id())->firstOrFail();

        $validator = Validator::make($request->all(), [
            'code' => ['required', 'string', 'max:50', Rule::unique('coupons')->ignore($coupon->id)],
            'type' => 'required|in:percent,fixed',
            'value' => 'required|numeric|min:0',
            'max_uses' => 'nullable|integer|min:1',
            'expires_at' => 'nullable|date',
            'status' => 'required|in:active,disabled',
            'course_id' => 'nullable|exists:courses,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $coupon->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Coupon updated successfully',
            'data' => $coupon
        ]);
    }

    public function destroy($id)
    {
        $coupon = Coupon::where('id', $id)->where('instructor_id', auth()->id())->firstOrFail();
        $coupon->delete();

        return response()->json([
            'success' => true,
            'message' => 'Coupon deleted successfully'
        ]);
    }

    public function toggleStatus(Request $request, $id)
    {
        $coupon = Coupon::where('id', $id)->where('instructor_id', auth()->id())->firstOrFail();
        
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:active,disabled,expired'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $coupon->update(['status' => $request->status]);

        return response()->json([
            'success' => true,
            'message' => 'Coupon status updated successfully',
            'data' => $coupon
        ]);
    }
}
