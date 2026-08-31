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
        $user = $request->user();
        $payload = $request->validated();

        \Illuminate\Support\Facades\Log::info("[QUIZ_GEN STEP 1] Request Received", [
            'instructor_id' => $user ? $user->id : null,
            'email' => $user ? $user->email : null,
            'payload' => $payload,
        ]);

        try {
            $quizData = $this->aiQuizGeneratorService->generateQuiz($user, $payload);

            \Illuminate\Support\Facades\Log::info("[QUIZ_GEN STEP 11] Controller returning success response", [
                'questions_generated' => count($quizData['questions'] ?? []),
                'title' => $quizData['title'] ?? null,
            ]);

            return $this->successResponse($quizData, 'Quiz generated successfully.');
        } catch (\App\Exceptions\AiQuizGeneratorException $e) {
            \Illuminate\Support\Facades\Log::warning("[QUIZ_GEN ERROR DomainException]", [
                'message' => $e->getMessage(),
                'error_code' => $e->getErrorCode(),
                'status_code' => $e->getStatusCode(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => array_slice(explode("\n", $e->getTraceAsString()), 0, 5),
            ]);

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'error_code' => $e->getErrorCode(),
                'errorCode' => $e->getErrorCode(),
            ], $e->getStatusCode());
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("[QUIZ_GEN ERROR UnexpectedException]", [
                'message' => $e->getMessage(),
                'class' => get_class($e),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => array_slice(explode("\n", $e->getTraceAsString()), 0, 5),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Hệ thống AI đang gặp sự cố khi tạo bài kiểm tra: ' . $e->getMessage(),
                'error_code' => 'AI_GENERATION_FAILED',
                'errorCode' => 'AI_GENERATION_FAILED',
            ], 500);
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
        $courseId = $request->query('course_id') ?? $request->query('courseId');
        $quizzes = $this->quizService->getInstructorQuizzes(
            $request->user(),
            $courseId ? (int) $courseId : null
        );

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
    public function destroy(Request $request, Quiz $quiz)
    {
        Gate::authorize('delete', $quiz);

        $isAttached = $quiz->attachments()->exists() || $quiz->lesson_id !== null;
        $force = $request->boolean('force');

        if ($isAttached && !$force) {
            return $this->errorResponse('Không thể xóa đề kiểm tra này vì đề đang được gắn vào khóa học.', 422);
        }

        \Illuminate\Support\Facades\DB::transaction(function () use ($quiz) {
            foreach ($quiz->questions as $question) {
                $question->answers()->delete();
                $question->delete();
            }
            $quiz->attachments()->delete();
            if ($quiz->lesson_id) {
                $quiz->lesson_id = null;
                $quiz->save();
            }
            $quiz->delete();
        });

        return $this->successResponse(null, $force ? 'Đã gỡ bài thi khỏi khóa học và xóa thành công.' : 'Đã xóa bài kiểm tra thành công.');
    }

    /**
     * POST /api/instructor/ai-quiz/{quiz}/attach
     * Attach quiz to a course, module, or lesson.
     */
    public function attach(AttachQuizRequest $request, Quiz $quiz)
    {
        Gate::authorize('attach', $quiz);
        $user = $request->user();
        $payload = $request->validated();

        \Illuminate\Support\Facades\Log::info("[QUIZ_ATTACH STEP 1] Request received", [
            'quiz_id' => $quiz->id,
            'quiz_title' => $quiz->title,
            'instructor_id' => $user ? $user->id : null,
            'payload' => $payload,
        ]);

        try {
            $attachment = $this->quizService->attachQuizToCourse($quiz, $payload);

            \Illuminate\Support\Facades\Log::info("[QUIZ_ATTACH STEP 2] Attachment created successfully", [
                'attachment_id' => $attachment->id,
                'quiz_id' => $quiz->id,
                'course_id' => $attachment->course_id,
                'position' => $attachment->position,
            ]);

            return $this->createdResponse($attachment, 'Quiz attached to course successfully.');
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("[QUIZ_ATTACH ERROR]", [
                'quiz_id' => $quiz->id,
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Không thể gắn bài kiểm tra vào khóa học: ' . $e->getMessage(),
                'error_code' => 'ATTACH_QUIZ_FAILED',
                'errorCode' => 'ATTACH_QUIZ_FAILED',
            ], 500);
        }
    }
}
