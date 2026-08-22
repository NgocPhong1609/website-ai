<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use App\Services\Student\SelfAssessmentService;
use App\Traits\ApiResponse;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SelfAssessmentController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly SelfAssessmentService $selfAssessmentService)
    {
    }

    /**
     * POST /api/student/courses/{courseId}/self-assessment/generate
     * Generate dynamic 10 MCQs based on entire lesson contents of a course.
     */
    public function generate(Request $request, $courseId): JsonResponse
    {
        try {
            $user = $request->user('sanctum') ?? $request->user();
            $data = $this->selfAssessmentService->generateSelfAssessment($user, $courseId);

            return $this->successResponse($data, 'Tạo bài đánh giá năng lực bằng AI thành công.');
        } catch (Exception $e) {
            \Illuminate\Support\Facades\Log::error("[SelfAssessmentController] generate error: " . $e->getMessage());
            return $this->errorResponse('Không thể tạo bài đánh giá năng lực: ' . $e->getMessage(), 500);
        }
    }

    /**
     * POST /api/student/self-assessment/submit
     * Submit and evaluate self assessment (0 credits awarded).
     */
    public function submit(Request $request): JsonResponse
    {
        try {
            $user = $request->user('sanctum') ?? $request->user();
            $result = $this->selfAssessmentService->submitSelfAssessment($user, $request->all());

            return $this->successResponse($result, 'Hoàn thành bài đánh giá năng lực thành công.');
        } catch (Exception $e) {
            \Illuminate\Support\Facades\Log::error("[SelfAssessmentController] submit error: " . $e->getMessage());
            return $this->errorResponse('Lỗi khi chấm bài đánh giá năng lực: ' . $e->getMessage(), 500);
        }
    }
}
