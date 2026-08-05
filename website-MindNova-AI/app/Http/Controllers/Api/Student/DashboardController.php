<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use App\Http\Resources\Student\DashboardResource;
use App\Services\Student\DashboardService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly DashboardService $dashboardService)
    {
    }

    /**
     * Display the overview stats and active courses for the student dashboard.
     */
    public function overview(Request $request): JsonResponse
    {
        // Retrieve optional sanctum authenticated user or null if running as local guest
        $user = $request->user('sanctum') ?? $request->user();

        $dashboardData = $this->dashboardService->getOverview($user);

        return $this->successResponse(
            new DashboardResource($dashboardData),
            'Dashboard overview retrieved successfully.'
        );
    }
}
