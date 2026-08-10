<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use App\Http\Resources\Student\CourseDetailResource;
use App\Models\Course;
use App\Models\Enrollment;
use App\Services\Student\CourseService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly CourseService $courseService)
    {
    }

    /**
     * Retrieve list of published available courses.
     */
    public function getAvailableCourses(Request $request): JsonResponse
    {
        $query = Course::where('status', 'published');
        $courses = $query->get();

        $user = $request->user('sanctum') ?? $request->user();
        if ($user) {
            $enrolledIds = Enrollment::where('user_id', $user->id)
                            ->pluck('course_id')->toArray();
            
            $courses->map(function ($course) use ($enrolledIds) {
                $course->is_enrolled = in_array($course->id, $enrolledIds);
                return $course;
            });
        }

        return response()->json($courses);
    }

    /**
     * Display detailed curriculum, AI tutor analytics, and student progress for a course.
     */
    public function detail(Request $request, $id = 1): JsonResponse
    {
        $user = $request->user('sanctum') ?? $request->user();

        $courseData = $this->courseService->getCourseDetail($id, $user);

        return $this->successResponse(
            new CourseDetailResource($courseData),
            'Course detail retrieved successfully.'
        );
    }

    /**
     * Retrieve all enrolled courses for the student with progress metrics.
     */
    public function enrolledCourses(Request $request): JsonResponse
    {
        $user = $request->user('sanctum') ?? $request->user();

        $enrolledCourses = $this->courseService->getEnrolledCourses($user);

        return $this->successResponse(
            $enrolledCourses,
            'Enrolled courses retrieved successfully.'
        );
    }
}
