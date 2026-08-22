<?php

namespace App\Http\Controllers\Api\Instructor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Instructor\AttachQuizRequest;
use App\Http\Requests\Instructor\GenerateAiQuizRequest;
use App\Http\Requests\Instructor\StoreAiQuizRequest;
use App\Models\Quiz;
use App\Services\Instructor\AiQuizGeneratorService;
use App\Services\Instructor\QuizService;
use App\Traits\ApiResponse;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class QuizGeneratorController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly AiQuizGeneratorService $aiQuizGeneratorService,
        private readonly QuizService $quizService
    ) {
    }

    /**
     * POST /api/instructor/ai-quiz/generate
     * Generate quiz questions from content or topic using AI.
     */
    public function generate(GenerateAiQuizRequest $request)
    {
        set_time_limit(180);
        try {
            $quizData = $this->aiQuizGeneratorService->generateQuiz($request->user(), $request->validated());

            return $this->successResponse($quizData, 'Quiz generated successfully.');
        } catch (Exception $e) {
            \Illuminate\Support\Facades\Log::error("[QuizGeneratorController] generate error: " . $e->getMessage(), [
                'exception' => $e
            ]);
            return $this->errorResponse('Không thể tạo bài kiểm tra bằng AI: ' . $e->getMessage(), 500);
        }
    }

    /**
     * POST /api/instructor/ai-quiz/regenerate-question
     * Regenerate a single question using AI.
     */
    public function regenerateQuestion(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string|in:multiple_choice,essay',
            'difficulty' => 'nullable|string|in:easy,medium,hard',
            'context' => 'nullable|string',
        ]);

        try {
            $question = $this->aiQuizGeneratorService->regenerateSingleQuestion($request->user(), $validated);

            return $this->successResponse($question, 'Single question regenerated successfully.');
        } catch (Exception $e) {
            return $this->errorResponse('Failed to regenerate single question: ' . $e->getMessage(), 500);
        }
    }

    /**
     * GET /api/instructor/ai-quiz
     * List all quizzes created by instructor.
     */
    public function index(Request $request)
    {
        $quizzes = $this->quizService->getInstructorQuizzes($request->user());

        return $this->successResponse($quizzes, 'Instructor quizzes retrieved.');
    }

    /**
     * POST /api/instructor/ai-quiz/store
     * Store a new standalone quiz.
     */
    public function store(StoreAiQuizRequest $request)
    {
        try {
            $quiz = $this->quizService->createStandaloneQuiz($request->user(), $request->validated());

            return $this->createdResponse($quiz, 'Quiz saved successfully.');
        } catch (Exception $e) {
            return $this->errorResponse('Failed to save quiz: ' . $e->getMessage(), 500);
        }
    }

    /**
     * GET /api/instructor/ai-quiz/{quiz}
     * Show quiz details.
     */
    public function show(Quiz $quiz)
    {
        Gate::authorize('view', $quiz);

        return $this->successResponse($quiz->load('questions.answers', 'attachments.course'), 'Quiz details retrieved.');
    }

    /**
     * PUT /api/instructor/ai-quiz/{quiz}
     * Update standalone quiz.
     */
    public function update(StoreAiQuizRequest $request, Quiz $quiz)
    {
        Gate::authorize('update', $quiz);

        try {
            $updated = $this->quizService->updateStandaloneQuiz($quiz, $request->validated());

            return $this->successResponse($updated, 'Quiz updated successfully.');
        } catch (Exception $e) {
            return $this->errorResponse('Failed to update quiz: ' . $e->getMessage(), 500);
        }
    }

    /**
     * DELETE /api/instructor/ai-quiz/{quiz}
     * Delete quiz.
     */
    public function destroy(Quiz $quiz)
    {
        Gate::authorize('delete', $quiz);

        if ($quiz->attachments()->exists() || $quiz->lesson_id !== null) {
            return $this->errorResponse('Không thể xóa đề kiểm tra này vì đề đang được gắn vào khóa học.', 422);
        }

        \Illuminate\Support\Facades\DB::transaction(function () use ($quiz) {
            foreach ($quiz->questions as $question) {
                $question->answers()->delete();
                $question->delete();
            }
            $quiz->attachments()->delete();
            $quiz->delete();
        });

        return $this->successResponse(null, 'Đã xóa bài kiểm tra thành công.');
    }

    /**
     * POST /api/instructor/ai-quiz/{quiz}/attach
     * Attach quiz to a course, module, or lesson.
     */
    public function attach(AttachQuizRequest $request, Quiz $quiz)
    {
        Gate::authorize('attach', $quiz);

        try {
            $attachment = $this->quizService->attachQuizToCourse($quiz, $request->validated());

            return $this->createdResponse($attachment, 'Quiz attached to course successfully.');
        } catch (Exception $e) {
            return $this->errorResponse('Failed to attach quiz to course: ' . $e->getMessage(), 500);
        }
    }
}
