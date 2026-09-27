<?php

namespace App\Http\Controllers\Api\Instructor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Instructor\CourseWizardRequest;
use App\Services\Instructor\CourseWizardService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class CourseWizardController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly CourseWizardService $wizardService
    ) {}

    public function store(CourseWizardRequest $request)
    {
        $idempotencyKey = $request->header('Idempotency-Key');
        if (!$idempotencyKey) {
            return $this->errorResponse('Missing Idempotency-Key header', 400);
        }

        $course = $this->wizardService->create(
            $request->user(),
            $request->validated(),
            $idempotencyKey
        );

        return $this->successResponse(
            $course,
            'Tạo khóa học thành công',
            200
        );
    }
}
