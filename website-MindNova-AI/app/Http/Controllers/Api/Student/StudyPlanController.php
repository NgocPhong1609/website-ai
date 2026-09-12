<?php

namespace App\Http\Controllers\Api\Student;

use App\Exceptions\AiQuotaExceededException;
use App\Exceptions\AiTutorInputRejectedException;
use App\Exceptions\CourseAiContextException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Student\AiChatRequest;
use App\Http\Resources\Student\AiChatResource;
use App\Http\Resources\Student\StudyPlanResource;
use App\Models\User;
use App\Services\Student\StudyPlanService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StudyPlanController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly StudyPlanService $studyPlanService) {}

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

        if (! $user instanceof User) {
            return $this->unauthorizedResponse();
        }

        try {
            $aiResponse = $this->studyPlanService->askAiTutor(
                $user,
                $request->input('message'),
                $request->input('lesson_id'),
                $request->input('history') ?? [],
            );
        } catch (CourseAiContextException $exception) {
            return $this->errorResponse($exception->getMessage(), $exception->status());
        } catch (AiTutorInputRejectedException $exception) {
            return $this->errorResponse($exception->getMessage(), 422);
        } catch (AiQuotaExceededException $exception) {
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage(),
                'meta' => ['quota' => $exception->quota()],
            ], 429);
        } catch (\Throwable) {
            return $this->errorResponse('AI Tutor hiện không khả dụng. Vui lòng thử lại sau.', 503);
        }

        return response()->json([
            'success' => true,
            'message' => 'AI Tutor generated response successfully.',
            'data' => (new AiChatResource($aiResponse))->resolve($request),
            'meta' => ['quota' => $aiResponse['quota']],
        ]);
    }
}
