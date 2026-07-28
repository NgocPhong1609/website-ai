<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function getAvailableCourses(Request $request)
    {
        $query = Course::where('status', 'published');

        // Nếu người dùng đã đăng nhập, lọc bỏ các khóa họ đã mua
        if ($request->user()) {
            $enrolledIds = Enrollment::where('user_id', $request->user()->id)
                            ->pluck('course_id');
            $query->whereNotIn('id', $enrolledIds);
        }

        return response()->json($query->get());
    }
}
