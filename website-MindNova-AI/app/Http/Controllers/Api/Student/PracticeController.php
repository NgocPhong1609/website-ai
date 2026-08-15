<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use App\Http\Resources\Student\PracticeOverviewResource;
use App\Services\Student\PracticeService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PracticeController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly PracticeService $practiceService)
    {
    }

    /**
     * Display the assessment overview, AI tutor insight, and historical attempt status for Practice page.
     */
    public function overview(Request $request): JsonResponse
    {
        $user = $request->user('sanctum') ?? $request->user();

        $practiceData = $this->practiceService->getOverview($user);

        return $this->successResponse(
            new PracticeOverviewResource($practiceData),
            'Practice assessment overview retrieved successfully.'
        );
    }
}
