<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use App\Http\Resources\Student\ProgressOverviewResource;
use App\Services\Student\ProgressService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProgressController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly ProgressService $progressService)
    {
    }

    /**
     * Display the learning progress overview, study roadmap, and AI tutor insight for Student Progress page.
     */
    public function overview(Request $request): JsonResponse
    {
        $user = $request->user('sanctum') ?? $request->user();

        $progressData = $this->progressService->getOverview($user);

        return $this->successResponse(
            new ProgressOverviewResource($progressData),
            'Student learning progress retrieved successfully.'
        );
    }
}
