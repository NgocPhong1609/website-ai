<?php

namespace App\Http\Controllers\Api\Student;

use App\Exceptions\AiQuotaExceededException;
use App\Exceptions\AiTutorInputRejectedException;
use App\Exceptions\CourseAiContextException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Student\AiChatRequest;
use App\Models\User;
use App\Services\Student\CourseAiTutorService;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AiTutorController extends Controller
{
    public function __construct(private readonly CourseAiTutorService $courseAiTutor) {}

    public function streamChat(AiChatRequest $request)
    {
        $user = $request->user('sanctum') ?? $request->user();
        if (! $user instanceof User) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $validated = $request->validated();

        try {
            $answer = $this->courseAiTutor->answer(
                $user,
                $validated['message'],
                $validated['lesson_id'] ?? null,
                $validated['history'] ?? [],
            );
        } catch (CourseAiContextException $exception) {
            return response()->json(['message' => $exception->getMessage()], $exception->status());
        } catch (AiTutorInputRejectedException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        } catch (AiQuotaExceededException $exception) {
            return response()->json([
                'message' => $exception->getMessage(),
                'meta' => $exception->quota(),
            ], 429);
        } catch (\Throwable) {
            return response()->json([
                'message' => 'AI Tutor hiện không khả dụng. Vui lòng thử lại sau.',
            ], 503);
        }

        $quota = $answer['quota'];

        return new StreamedResponse(static function () use ($answer): void {
            echo $answer['content'];
        }, 200, [
            'Content-Type' => 'text/event-stream',
            'Cache-Control' => 'no-cache',
            'Connection' => 'keep-alive',
            'X-Accel-Buffering' => 'no',
            'X-AI-Daily-Limit' => (string) $quota['daily_limit'],
            'X-AI-Used' => (string) $quota['used'],
            'X-AI-Remaining' => (string) $quota['remaining'],
        ]);
    }
}
