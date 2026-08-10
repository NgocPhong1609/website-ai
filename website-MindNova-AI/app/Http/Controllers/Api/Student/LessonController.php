<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use App\Models\Answer;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\LessonCompletion;
use App\Models\UserQuizAttempt;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class LessonController extends Controller
{
    use ApiResponse;

    /**
     * GET /api/student/lessons/{lesson}/video-url
     * Generate a signed URL for an uploaded video lesson.
     * Falls back to the stored video_url for external videos.
     */
    public function videoUrl(Request $request, Lesson $lesson): JsonResponse
    {
        $user = $request->user('sanctum') ?? $request->user();
        if (!$user) {
            return $this->unauthorizedResponse('Bạn cần đăng nhập.');
        }

        // Verify enrollment
        $courseId = $lesson->module?->course_id;
        if ($courseId && !Enrollment::where('user_id', $user->id)->where('course_id', $courseId)->exists()) {
            return $this->forbiddenResponse('Bạn chưa đăng ký khóa học này.');
        }

        // Try to find uploaded video media (R2)
        $media = $lesson->media()
            ->where('media_type', 'video')
            ->where('status', 'ready')
            ->latest()
            ->first();

        if ($media) {
            try {
                $signedUrl = Storage::disk('r2')->temporaryUrl($media->r2_key, now()->addHours(1));
                return $this->successResponse([
                    'signed_url' => $signedUrl,
                    'source' => 'uploaded',
                    'duration_seconds' => $media->duration_seconds ?? $lesson->duration_seconds ?? 0,
                ], 'Video URL generated.');
            } catch (\Exception $e) {
                // R2 may not be configured, fall through to video_url
            }
        }

        // Fallback to stored video_url (YouTube, external, etc.)
        if ($lesson->video_url) {
            return $this->successResponse([
                'signed_url' => $lesson->video_url,
                'source' => 'external',
                'duration_seconds' => $lesson->duration_seconds ?? 0,
            ], 'External video URL returned.');
        }

        return $this->notFoundResponse('Không tìm thấy video cho bài học này.');
    }

    /**
     * POST /api/student/lessons/{lesson}/complete
     * Mark a lesson as completed with server-side validation.
     */
    public function complete(Request $request, Lesson $lesson): JsonResponse
    {
        $user = $request->user('sanctum') ?? $request->user();
        if (!$user) {
            return $this->unauthorizedResponse('Bạn cần đăng nhập.');
        }

        // Verify enrollment
        $courseId = $lesson->module?->course_id;
        if (!$courseId) {
            return $this->errorResponse('Bài học không thuộc khóa học nào.', 400);
        }

        $enrollment = Enrollment::where('user_id', $user->id)->where('course_id', $courseId)->first();
        if (!$enrollment) {
            return $this->forbiddenResponse('Bạn chưa đăng ký khóa học này.');
        }

        // Check if already completed
        $existing = LessonCompletion::where('user_id', $user->id)->where('lesson_id', $lesson->id)->first();
        if ($existing) {
            // Already completed, just return current progress
            return $this->successResponse(
                $this->calculateProgress($user->id, $courseId, $enrollment),
                'Bài học đã được hoàn thành trước đó.'
            );
        }

        $lessonType = $lesson->type ?? 'video';
        $durationSeconds = $lesson->duration_seconds ?? (($lesson->duration_minutes ?? 0) * 60);

        // Server-side validation based on lesson type
        if ($lessonType === 'video') {
            $playbackPosition = (float) $request->input('playback_position', 0);
            $threshold = max($durationSeconds - 10, 0);
            // Allow completion if: duration is 0 (unknown), or playback position is near end
            if ($durationSeconds > 10 && $playbackPosition < $threshold) {
                return $this->errorResponse(
                    "Bạn cần xem video đến ít nhất giây thứ {$threshold}.",
                    422
                );
            }
        } elseif ($lessonType === 'article') {
            $timeSpent = (int) $request->input('time_spent_seconds', 0);
            $requiredTime = (int) ceil($durationSeconds * 1 / 3);
            if ($durationSeconds > 0 && $timeSpent < $requiredTime) {
                return $this->errorResponse(
                    "Bạn cần đọc ít nhất {$requiredTime} giây.",
                    422
                );
            }
        } elseif ($lessonType === 'quiz_module') {
            // For quiz, check that a passing attempt exists
            $quiz = $lesson->quiz;
            if ($quiz) {
                $passingAttempt = UserQuizAttempt::where('user_id', $user->id)
                    ->where('quiz_id', $quiz->id)
                    ->where('status', 'passed')
                    ->exists();
                if (!$passingAttempt) {
                    return $this->errorResponse('Bạn cần hoàn thành bài kiểm tra trước.', 422);
                }
            }
        }

        // Create completion record
        LessonCompletion::create([
            'user_id' => $user->id,
            'lesson_id' => $lesson->id,
            'completed_at' => now(),
        ]);

        // Update enrollment progress
        $progressData = $this->calculateProgress($user->id, $courseId, $enrollment);

        return $this->successResponse($progressData, 'Hoàn thành bài học thành công!');
    }

    /**
     * POST /api/student/lessons/{lesson}/quiz/check-answer
     * Check a single answer without revealing the correct answer.
     */
    public function checkAnswer(Request $request, Lesson $lesson): JsonResponse
    {
        $request->validate([
            'question_id' => 'required|integer',
            'answer_id' => 'required|integer',
        ]);

        $questionId = $request->input('question_id');
        $answerId = $request->input('answer_id');

        // Find the answer and verify it belongs to the right question and lesson
        $answer = Answer::where('id', $answerId)
            ->where('question_id', $questionId)
            ->first();

        if (!$answer) {
            return $this->errorResponse('Đáp án không hợp lệ.', 400);
        }

        // Verify the question belongs to this lesson's quiz
        $quiz = $lesson->quiz;
        if (!$quiz) {
            return $this->errorResponse('Bài học không có bài kiểm tra.', 404);
        }

        $questionBelongsToQuiz = $quiz->questions()->where('id', $questionId)->exists();
        if (!$questionBelongsToQuiz) {
            return $this->errorResponse('Câu hỏi không thuộc bài kiểm tra này.', 400);
        }

        // Return only correct/incorrect — NEVER reveal the correct answer
        return $this->successResponse([
            'correct' => (bool) $answer->is_correct,
        ], $answer->is_correct ? 'Chính xác!' : 'Chưa đúng.');
    }

    /**
     * Calculate and update enrollment progress.
     */
    private function calculateProgress(int $userId, int $courseId, Enrollment $enrollment): array
    {
        // Count total lessons and completed lessons for this course
        $course = \App\Models\Course::with('modules.lessons')->find($courseId);
        $totalLessons = 0;
        $completedLessonIds = LessonCompletion::where('user_id', $userId)->pluck('lesson_id')->toArray();
        $completedCount = 0;

        if ($course && $course->modules) {
            foreach ($course->modules as $mod) {
                if ($mod->lessons) {
                    foreach ($mod->lessons as $les) {
                        $totalLessons++;
                        if (in_array($les->id, $completedLessonIds)) {
                            $completedCount++;
                        }
                    }
                }
            }
        }

        $progressPercentage = $totalLessons > 0 ? round(($completedCount / $totalLessons) * 100) : 0;

        // Update enrollment record
        $enrollment->progress_percentage = $progressPercentage;
        $enrollment->updated_at = now();
        $enrollment->save();

        return [
            'progress_percentage' => $progressPercentage,
            'completed_lessons_count' => $completedCount,
            'total_lessons_count' => $totalLessons,
            'completed_lesson_ids' => $completedLessonIds,
        ];
    }
}
