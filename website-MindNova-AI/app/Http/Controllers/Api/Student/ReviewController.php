<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    public function index(Course $course)
    {
        if (!Schema::hasTable('reviews')) {
            return response()->json([
                'message' => 'Danh sách đánh giá khóa học.',
                'data' => [
                    'count' => 0,
                    'average_rating' => 0,
                    'reviews' => [],
                ],
            ]);
        }

        $reviews = Review::with('user:id,name,avatar_url')
            ->where('course_id', $course->id)
            ->latest()
            ->get()
            ->map(function ($review) {
                return [
                    'id' => $review->id,
                    'user' => [
                        'id' => $review->user?->id,
                        'name' => $review->user?->name ?? 'Học viên',
                        'avatar_url' => $review->user?->avatar_url ?? null,
                    ],
                    'rating' => (int) $review->rating,
                    'comment' => $review->comment,
                    'created_at' => $review->created_at?->toISOString(),
                ];
            });

        $averageRating = $reviews->isNotEmpty() ? round($reviews->avg('rating'), 1) : 0;

        return response()->json([
            'message' => 'Danh sách đánh giá khóa học.',
            'data' => [
                'count' => $reviews->count(),
                'average_rating' => $averageRating,
                'reviews' => $reviews,
            ],
        ]);
    }

    public function store(Request $request, Course $course)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Bạn cần đăng nhập để đánh giá khóa học.'], 401);
        }

        $isEnrolled = DB::table('enrollments')
            ->where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->exists();

        if (!$isEnrolled) {
            return response()->json(['message' => 'Bạn phải mua khóa học này mới có thể đánh giá.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000'
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Dữ liệu không hợp lệ.', 'errors' => $validator->errors()], 422);
        }

        if (Review::where('user_id', $user->id)->where('course_id', $course->id)->exists()) {
            return response()->json(['message' => 'Bạn đã đánh giá khóa học này rồi.'], 400);
        }

        $review = Review::create([
            'user_id' => $user->id,
            'course_id' => $course->id,
            'rating' => $request->rating,
            'comment' => $request->comment
        ]);

        if ($course->teacher) {
            $course->teacher->notify(new \App\Notifications\NewReview($review));
        }

        return response()->json([
            'message' => 'Đánh giá thành công!',
            'data' => [
                'id' => $review->id,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'avatar_url' => $user->avatar_url ?? null,
                ],
                'rating' => (int) $review->rating,
                'comment' => $review->comment,
                'created_at' => $review->created_at?->toISOString(),
            ]
        ], 201);
    }

    public function update(Request $request, Course $course, Review $review)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Bạn cần đăng nhập.'], 401);
        }

        if ($review->user_id !== $user->id) {
            return response()->json(['message' => 'Bạn không có quyền sửa nhận xét này.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000'
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Dữ liệu không hợp lệ.', 'errors' => $validator->errors()], 422);
        }

        $review->update([
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        return response()->json([
            'message' => 'Cập nhật nhận xét thành công!',
            'data' => [
                'id' => $review->id,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'avatar_url' => $user->avatar_url ?? null,
                ],
                'rating' => (int) $review->rating,
                'comment' => $review->comment,
                'created_at' => $review->created_at?->toISOString(),
            ]
        ]);
    }

    public function destroy(Request $request, Course $course, Review $review)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Bạn cần đăng nhập.'], 401);
        }

        if ($review->user_id !== $user->id) {
            return response()->json(['message' => 'Bạn không có quyền xóa nhận xét này.'], 403);
        }

        $review->delete();

        return response()->json([
            'message' => 'Xóa nhận xét thành công!',
        ]);
    }
}
