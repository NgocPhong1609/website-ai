<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    public function store(Request $request, Course $course)
    {
        $user = $request->user();

        // Check if user is enrolled
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

        // Check if already reviewed
        if (Review::where('user_id', $user->id)->where('course_id', $course->id)->exists()) {
            return response()->json(['message' => 'Bạn đã đánh giá khóa học này rồi.'], 400);
        }

        $review = Review::create([
            'user_id' => $user->id,
            'course_id' => $course->id,
            'rating' => $request->rating,
            'comment' => $request->comment
        ]);

        // Notify teacher
        if ($course->teacher) {
            $course->teacher->notify(new \App\Notifications\NewReview($review));
        }

        return response()->json(['message' => 'Đánh giá thành công!', 'data' => $review], 201);
    }
}
