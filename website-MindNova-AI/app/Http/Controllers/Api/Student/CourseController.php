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
     *
     * SECURITY: Only returns courses with status = 'published'
     * and a valid published_version_id.
     */
    public function getAvailableCourses(Request $request): JsonResponse
    {
        // ── RULE 6 & 15: Only published courses with approved version ──
        $query = Course::with(['teacher', 'category'])
            ->where('status', 'published')
            ->whereNotNull('published_version_id');

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
     *
     * SECURITY: Only returns published lessons from approved versions.
     * Draft/pending/rejected lessons are completely invisible.
     */
    public function detail(Request $request, $id = 1): JsonResponse
    {
        // Verify the course is published
        $course = Course::where('status', 'published')
            ->whereNotNull('published_version_id')
            ->find($id);

        if (!$course) {
            return $this->notFoundResponse('Không tìm thấy khóa học.');
        }

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

    /**
     * Retrieve course assessment status, progress %, General Quiz & Final Quiz status, and unlock conditions.
     */
    public function assessmentStatus(Request $request, $courseId): JsonResponse
    {
        $user = $request->user('sanctum') ?? $request->user();
        $data = $this->courseService->getCourseAssessmentStatus((int) $courseId, $user);

        return $this->successResponse($data, 'Lấy trạng thái bài kiểm tra thành công.');
    }
}

