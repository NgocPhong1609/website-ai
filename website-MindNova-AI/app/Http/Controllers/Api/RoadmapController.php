<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\GenerateRoadmapRequest;
use App\Models\User;
use App\Services\RoadmapGeneratorService;
use Illuminate\Http\JsonResponse;

class RoadmapController extends Controller
{
    private RoadmapGeneratorService $roadmapService;

    public function __construct(RoadmapGeneratorService $roadmapService)
    {
        $this->roadmapService = $roadmapService;
    }

    /**
     * Generate a learning roadmap.
     *
     * POST /api/ai/generate-roadmap
     *
     * Business logic nằm trong RoadmapGeneratorService.
     * Controller chỉ validate input, gọi service, format response.
     */
    public function generate(GenerateRoadmapRequest $request): JsonResponse
    {
        try {
            // TODO: Thay bằng Auth::user() khi có authentication
            // Hiện tại dùng user_id từ request hoặc user đầu tiên cho development
            $user = User::findOrFail($request->input('user_id', 1));

            $roadmap = $this->roadmapService->generateRoadmap($user, [
                'goal' => $request->input('goal'),
                'level' => $request->input('level'),
                'topics' => $request->input('topics'),
            ]);

            return response()->json([
                'success' => true,
                'data' => [
                    'roadmap_id' => $roadmap->id,
                    'goal' => $roadmap->goal,
                    'level' => $roadmap->level,
                    'status' => $roadmap->status,
                    'generated_by' => $roadmap->generated_by,
                    'estimated_total_days' => $roadmap->estimated_total_days,
                    'courses' => $roadmap->courses->map(function ($course) {
                        return [
                            'course_id' => $course->course_id,
                            'priority' => $course->priority,
                            'reason' => $course->reason,
                            'estimated_days' => $course->estimated_days,
                        ];
                    }),
                ],
                'message' => 'Roadmap generated successfully.',
                'timestamp' => now()->toISOString(),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => 'Failed to generate roadmap.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error.',
                'timestamp' => now()->toISOString(),
            ], 500);
        }
    }
}
