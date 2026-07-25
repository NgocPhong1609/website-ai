<?php

namespace App\Http\Controllers\Api\Instructor;

use App\Http\Controllers\Controller;
use App\Http\Resources\StudentResource;
use App\Services\Instructor\StudentService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly StudentService $studentService)
    {
    }

    public function index(Request $request)
    {
        $teacherId = $request->user()->id;
        $courseId = $request->input('course_id');
        $search = $request->input('search');

        $query = $this->studentService->getStudentsForInstructor($teacherId, $courseId);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $perPage = $request->input('per_page', 15);
        $students = $query->paginate($perPage);

        return $this->successResponse(StudentResource::collection($students)->response()->getData(true));
    }

    public function progress(Request $request, int $studentId)
    {
        $teacherId = $request->user()->id;
        $courseId = $request->input('course_id');

        if (!$courseId) {
            return $this->errorResponse('course_id is required to fetch progress', 422);
        }

        $student = $this->studentService->getStudentsForInstructor($teacherId, $courseId)
            ->where('id', $studentId)
            ->first();

        if (!$student) {
            return $this->notFoundResponse('Student not found in your courses.');
        }

        $enrollment = $student->enrollments->first();

        return $this->successResponse([
            'student_id' => $student->id,
            'course_id' => $courseId,
            'progress_percentage' => $enrollment ? $enrollment->progress_percentage : 0,
            'enrolled_at' => $enrollment ? $enrollment->enrolled_at : null,
        ]);
    }
}
