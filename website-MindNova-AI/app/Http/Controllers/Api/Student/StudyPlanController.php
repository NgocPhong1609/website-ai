<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\Student\AiChatRequest;
use App\Http\Resources\Student\AiChatResource;
use App\Http\Resources\Student\StudyPlanResource;
use App\Services\Student\StudyPlanService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StudyPlanController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly StudyPlanService $studyPlanService)
    {
    }

    /**
     * Display the active syllabus overview and context inspector data for Study Plan page.
     */
    public function overview(Request $request): JsonResponse
    {
        $user = $request->user('sanctum') ?? $request->user();

        $planData = $this->studyPlanService->getOverview($user);

        return $this->successResponse(
            new StudyPlanResource($planData),
            'Study plan overview retrieved successfully.'
        );
    }

    /**
     * Process an interactive chat query with the AI Study Co-Pilot (Nova).
     */
    public function chat(AiChatRequest $request): JsonResponse
    {
        $user = $request->user('sanctum') ?? $request->user();

        $aiResponse = $this->studyPlanService->askAiTutor(
            $user,
            $request->input('message'),
            $request->input('lesson_id'),
            $request->input('history', [])
        );

        return $this->successResponse(
            new AiChatResource($aiResponse),
            'AI Tutor generated response successfully.'
        );
    }
}
