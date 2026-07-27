<?php

namespace App\Http\Controllers\Api\Instructor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Instructor\StoreQuizRequest;
use App\Http\Resources\QuizResource;
use App\Models\Lesson;
use App\Services\Instructor\QuizService;
use App\Traits\ApiResponse;
use Illuminate\Support\Facades\Gate;

class QuizController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly QuizService $quizService)
    {
    }

    /**
     * GET /instructor/lessons/{lesson}/quiz
     */
    public function show(Lesson $lesson)
    {
        Gate::authorize('manage', $lesson);

        $quiz = $this->quizService->getQuizWithDetails($lesson);

        if (!$quiz) {
            return $this->notFoundResponse('Bài kiểm tra chưa được tạo cho bài học này.');
        }

        return $this->successResponse(new QuizResource($quiz), 'Quiz retrieved successfully.');
    }

    /**
     * POST /instructor/lessons/{lesson}/quiz
     */
    public function store(StoreQuizRequest $request, Lesson $lesson)
    {
        Gate::authorize('manage', $lesson);

        $quiz = $this->quizService->createOrUpdateQuiz($lesson, $request->validated());

        return $this->createdResponse(new QuizResource($quiz), 'Quiz saved successfully.');
    }

    /**
     * DELETE /instructor/lessons/{lesson}/quiz
     */
    public function destroy(Lesson $lesson)
    {
        Gate::authorize('manage', $lesson);

        $this->quizService->deleteQuiz($lesson);

        return $this->noContentResponse();
    }
}
