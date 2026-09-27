<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use App\Services\Student\OnboardingPlanService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OnboardingController extends Controller
{
    public function __construct(private readonly OnboardingPlanService $planService)
    {
    }

    /**
     * Generate the personalised learning path and, for signed-in learners,
     * store it on the user so the dashboard and study plan can reuse it.
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'goal' => 'required|string|max:150',
            'currentLevel' => 'required|string|max:60',
            'timeAvailable' => 'required|string|max:60',
            'topics' => 'sometimes|array|max:8',
            'topics.*' => 'string|max:60',
        ], [
            'goal.required' => 'Vui lòng chọn mục tiêu học tập.',
            'currentLevel.required' => 'Vui lòng chọn trình độ hiện tại.',
            'timeAvailable.required' => 'Vui lòng chọn thời gian học mỗi ngày.',
            'topics.max' => 'Chỉ chọn tối đa 8 chủ đề.',
        ]);

        $user = $request->user('sanctum') ?? $request->user();

        return response()->json([
            'status' => 'success',
            'data' => $this->planService->generate($data, $user),
        ]);
    }

    /**
     * Category names that can be used as topic suggestions.
     */
    public function getAvailableTopics(): JsonResponse
    {
        $categories = DB::table('categories')->pluck('name');

        return response()->json([
            'status' => 'success',
            'topics' => $categories,
        ]);
    }
}
