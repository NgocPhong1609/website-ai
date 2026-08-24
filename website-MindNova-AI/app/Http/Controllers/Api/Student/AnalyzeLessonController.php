<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use App\Services\Student\AiLessonService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AnalyzeLessonController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly AiLessonService $aiLessonService)
    {
    }

    /**
     * Analyze lesson and recommend courses using AI.
     */
    public function analyze(Request $request): JsonResponse
    {
        $lessonTitle = $request->input('lesson_title', '');
        $goal = $request->input('goal', '');

        if (empty($lessonTitle) || empty($goal)) {
            return response()->json([
                'status' => 'error',
                'message' => 'lesson_title and goal are required'
            ], 422);
        }

        $result = $this->aiLessonService->analyzeLesson($lessonTitle, $goal);

        return response()->json([
            'status' => 'success',
            'data' => $result
        ], 200);
    }
}
