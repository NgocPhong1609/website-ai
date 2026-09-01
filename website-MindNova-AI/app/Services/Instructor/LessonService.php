<?php

namespace App\Services\Instructor;

use App\Models\ContentVersion;
use App\Models\CourseModule;
use App\Models\DeletionRequest;
use App\Models\Lesson;
use App\Models\LessonMedia;
use App\Services\ContentAuditService;
use App\Services\ContentReviewService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class LessonService
{
    public function __construct(
        private readonly ContentAuditService $auditService,
        private readonly ContentReviewService $reviewService,
    ) {}

    public function createLesson(CourseModule $module, array $data): Lesson
    {
        $data['module_id'] = $module->id;
        $data['course_id'] = $module->course_id;
        if (!isset($data['order'])) {
            $maxOrder = $module->lessons()->max('order') ?? 0;
            $data['order'] = $maxOrder + 1;
        }

        // ── RULE 4: New lessons ALWAYS start as draft ──
        $data['status'] = 'draft';
        $data['current_version'] = 1;

        if ($data['type'] === 'article' && isset($data['content'])) {
            $content = $data['content'] ?? '';
            $text = strip_tags($content);
            $wordCount = count(preg_split('~[^\p{L}\p{N}\']+~u', $text, -1, PREG_SPLIT_NO_EMPTY));
            $imageCount = substr_count($content, '<img ');
            $data['duration_seconds'] = (int) ceil(($wordCount / 200) * 60) + ($imageCount * 10);
        } elseif ($data['type'] === 'quiz_module' && isset($data['quizData']['time_limit_minutes'])) {
            $data['duration_seconds'] = (int) $data['quizData']['time_limit_minutes'] * 60;
        }

        $lesson = Lesson::create($data);

        // Save Quiz Data if present
        if ($lesson->type === 'quiz_module' && isset($data['quizData'])) {
            $this->saveQuizData($lesson, $data['quizData']);
        }

        // Mark pending submissions as stale if course is published
        $course = $module->course;
        if ($course && $course->isPublished()) {
            $this->reviewService->markSubmissionsStale($course);
        }

        return $lesson;
    }

    /**
     * Update a lesson with version awareness.
     *
     * RULE 5: If lesson is published, teacher edits go to the working copy
     * but published_version_id stays the same — students see old version.
     */
    public function updateLesson(Lesson $lesson, array $data): Lesson
    {
        // ── RULE 3: Cannot directly modify published version's snapshot ──
        // The teacher edits the live lesson record (working draft),
        // but the published snapshot in content_versions remains unchanged.
        // Students always read from the published_version's snapshot_data.

        $lesson->fill($data);

        if ($lesson->type === 'article') {
            $content = $lesson->content ?? '';
            $text = strip_tags($content);
            $wordCount = count(preg_split('~[^\p{L}\p{N}\']+~u', $text, -1, PREG_SPLIT_NO_EMPTY));
            $imageCount = substr_count($content, '<img ');
            $lesson->duration_seconds = (int) ceil(($wordCount / 200) * 60) + ($imageCount * 10);
        } elseif ($lesson->type === 'quiz_module' && isset($data['quizData']['time_limit_minutes'])) {
            $lesson->duration_seconds = (int) $data['quizData']['time_limit_minutes'] * 60;
        }

        // If lesson was published, mark it as having a draft revision
        // but keep the published_version_id so students see old version
        if ($lesson->isPublished() && $lesson->status === 'published') {
            // Change status to draft to indicate there's a working revision
            $lesson->status = 'draft';
        }

        $lesson->save();

        // Save Quiz Data if present
        if ($lesson->type === 'quiz_module' && isset($data['quizData'])) {
            $this->saveQuizData($lesson, $data['quizData']);
        }

        // Mark pending submissions as stale
        $course = $lesson->module?->course;
        if ($course) {
            $this->reviewService->markSubmissionsStale($course);
        }

        return $lesson;
    }

    /**
     * Delete a lesson with version awareness.
     *
     * RULE 9: If lesson is published, create deletion request instead.
     */
    public function deleteLesson(Lesson $lesson): void
    {
        if ($lesson->isPublished()) {
            throw new \Exception('Không thể xóa trực tiếp bài học đang public. Hãy tạo yêu cầu xóa.');
        }

        // Delete associated media from R2
        foreach ($lesson->media as $media) {
            Storage::disk('r2')->delete($media->r2_key);
        }

        $lesson->delete();
    }

    /**
     * Request deletion of a published lesson.
     */
    public function requestDeletion(Lesson $lesson, \App\Models\User $user, ?string $reason = null): DeletionRequest
    {
        return $this->reviewService->requestLessonDeletion($lesson, $user, $reason);
    }

    public function uploadVideo(Lesson $lesson, UploadedFile $file): array
    {
        $uuid = \Illuminate\Support\Str::uuid()->toString();
        $extension = $file->getClientOriginalExtension();
        $filename = "Courses/{$lesson->course_id}/Modules/{$lesson->module_id}/Lessons/{$lesson->id}/Videos/{$uuid}.{$extension}";

        // Upload to Cloudflare R2
        Storage::disk('r2')->put($filename, file_get_contents($file));

        $media = LessonMedia::create([
            'lesson_id' => $lesson->id,
            'media_type' => 'video',
            'r2_key' => $filename,
            'original_filename' => $file->getClientOriginalName(),
            'file_size' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
            'status' => 'ready', // We can mark it ready immediately or use a queue for processing later
        ]);

        return [
            'media_id' => $media->id,
            'signed_url' => Storage::disk('r2')->temporaryUrl($filename, now()->addHours(1)),
            'status' => $media->status,
        ];
    }

    public function generateVideoUrl(Lesson $lesson): ?array
    {
        $media = $lesson->media()->where('media_type', 'video')->where('status', 'ready')->latest()->first();

        if (!$media) {
            return null;
        }

        $expiresAt = now()->addHours(1);
        $signedUrl = Storage::disk('r2')->temporaryUrl($media->r2_key, $expiresAt);

        return [
            'signed_url' => $signedUrl,
            'expires_at' => $expiresAt,
        ];
    }

    /**
     * Upload a media file from CKEditor content (image or video) to Cloudflare R2.
     * Returns the public URL for embedding in HTML content.
     */
    public function uploadContentMedia(Lesson $lesson, UploadedFile $file): array
    {
        $uuid = \Illuminate\Support\Str::uuid()->toString();
        $extension = $file->getClientOriginalExtension();

        $isVideo = str_starts_with($file->getMimeType(), 'video/');
        $subfolder = $isVideo ? 'Videos' : 'Images';
        $mediaType = $isVideo ? 'video' : 'image';

        $filename = "Courses/{$lesson->course_id}/Modules/{$lesson->module_id}/Lessons/{$lesson->id}/{$subfolder}/{$uuid}.{$extension}";

        // Upload to Cloudflare R2 securely without loading into memory
        Storage::disk('r2')->putFileAs(
            "lessons/{$lesson->id}/content/{$subfolder}",
            $file,
            "{$uuid}.{$extension}"
        );

        $media = LessonMedia::create([
            'lesson_id' => $lesson->id,
            'media_type' => $mediaType,
            'r2_key' => $filename,
            'original_filename' => $file->getClientOriginalName(),
            'file_size' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
            'status' => 'ready',
        ]);

        $url = Storage::disk('r2')->url($filename);

        return [
            'media_id' => $media->id,
            'url' => $url,
            'media_type' => $mediaType,
        ];
    }

    /**
     * Upload a temporary media file to Cloudflare R2.
     * Returns the public URL and media ID for CKEditor preview.
     */
    public function uploadTempMedia(UploadedFile $file): array
    {
        $uuid = \Illuminate\Support\Str::uuid()->toString();
        $extension = $file->getClientOriginalExtension();

        $isVideo = str_starts_with($file->getMimeType(), 'video/');
        $subfolder = $isVideo ? 'videos' : 'images';
        $mediaType = $isVideo ? 'video' : 'image';

        $durationSeconds = 0;
        if ($isVideo) {
            $getID3 = new \getID3();
            $fileInfo = $getID3->analyze($file->getPathname());
            if (isset($fileInfo['playtime_seconds'])) {
                $durationSeconds = round($fileInfo['playtime_seconds']);
            }
        }

        $filename = "temp/{$subfolder}/{$uuid}.{$extension}";

        Storage::disk('r2')->putFileAs("temp/{$subfolder}", $file, "{$uuid}.{$extension}");

        $media = LessonMedia::create([
            'lesson_id' => null,
            'media_type' => $mediaType,
            'r2_key' => $filename,
            'original_filename' => $file->getClientOriginalName(),
            'file_size' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
            'duration_seconds' => $durationSeconds,
            'status' => 'ready',
            'is_temp' => true,
        ]);

        $url = Storage::disk('r2')->url($filename);

        return [
            'media_id' => $media->id,
            'url' => $url,
            'media_type' => $mediaType,
            'file_name' => $file->getClientOriginalName(),
            'file_size' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
        ];
    }

    /**
     * Move temporary media to official lesson folder, mark as active, update lesson content URLs, and clean orphans.
     */
    public function confirmTempMedia(array $mediaIds, Lesson $lesson): void
    {
        $contentChanged = false;
        $content = $lesson->content ?? '';
        $videoUrl = $lesson->video_url ?? '';

        // 1. Move and update new media from temp folder
        if (!empty($mediaIds)) {
            $mediaList = LessonMedia::whereIn('id', $mediaIds)
                ->where('is_temp', true)
                ->get();

            foreach ($mediaList as $media) {
                $subfolder = $media->media_type === 'video' ? 'Videos' : 'Images';
                $filename = basename($media->r2_key);
                $newKey = "Courses/{$lesson->course_id}/Modules/{$lesson->module_id}/Lessons/{$lesson->id}/{$subfolder}/{$filename}";

                $oldUrl = Storage::disk('r2')->url($media->r2_key);
                $newUrl = Storage::disk('r2')->url($newKey);

                // Move the file in Cloudflare R2
                try {
                    Storage::disk('r2')->move($media->r2_key, $newKey);
                } catch (\Exception $e) {
                    \Log::error("Failed to move temp media: " . $e->getMessage());
                }

                $media->update([
                    'lesson_id' => $lesson->id,
                    'r2_key' => $newKey,
                    'is_temp' => false,
                ]);

                // Replace old URL with new URL in content
                if (str_contains($content, $oldUrl)) {
                    $content = str_replace($oldUrl, $newUrl, $content);
                    $contentChanged = true;
                }

                // Replace old URL with new URL in video_url
                if (str_contains($videoUrl, $oldUrl)) {
                    $videoUrl = str_replace($oldUrl, $newUrl, $videoUrl);
                    $contentChanged = true;
                }

                if ($lesson->type === 'video' && $media->media_type === 'video' && $media->duration_seconds > 0) {
                    $lesson->duration_seconds = $media->duration_seconds;
                    $contentChanged = true;
                }
            }
        }

        // 2. Clean up orphaned media (files in DB but no longer in HTML content or video_url)
        $existingMedia = $lesson->media()->where('is_temp', false)->get();
        foreach ($existingMedia as $media) {
            $mediaUrl = Storage::disk('r2')->url($media->r2_key);
            // If the URL is no longer in the HTML content or video_url, delete the file and record
            if (!str_contains($content, $mediaUrl) && !str_contains($videoUrl, $mediaUrl)) {
                Storage::disk('r2')->delete($media->r2_key);
                $media->delete();
            }
        }

        // Save lesson if content or video_url was updated with new URLs
        if ($contentChanged) {
            $lesson->content = $content;
            $lesson->video_url = $videoUrl;
            $lesson->save();
        }
    }

    /**
     * Delete a temporary media file.
     */
    public function deleteTempMedia(int $mediaId): void
    {
        $media = LessonMedia::where('id', $mediaId)->where('is_temp', true)->first();

        if ($media) {
            Storage::disk('r2')->delete($media->r2_key);
            $media->delete();
        }
    }

    private function saveQuizData(Lesson $lesson, array $quizData): void
    {
        $questionsData = $quizData['questions'] ?? [];
        $mcCount = 0;
        $essayCount = 0;
        $totalPoints = 0.0;

        foreach ($questionsData as $q) {
            if (($q['type'] ?? 'multiple_choice') === 'essay') {
                $essayCount++;
            } else {
                $mcCount++;
            }
            $totalPoints += (float) ($q['points'] ?? 0.0);
        }

        $teacherId = auth()->id() ?? ($lesson->course->teacher_id ?? ($lesson->module->course->teacher_id ?? null));

        $targetQuizId = $quizData['quiz_id'] ?? ($quizData['id'] ?? null);
        $quiz = null;

        if ($targetQuizId && is_numeric($targetQuizId)) {
            $foundQuiz = \App\Models\Quiz::find((int) $targetQuizId);
            if ($foundQuiz) {
                $foundQuiz->update([
                    'lesson_id' => $lesson->id,
                    'instructor_id' => $teacherId ?? $foundQuiz->instructor_id,
                    'title' => $quizData['title'] ?? $foundQuiz->title,
                    'description' => $quizData['description'] ?? $foundQuiz->description,
                    'time_limit_minutes' => $quizData['time_limit_minutes'] ?? $foundQuiz->time_limit_minutes ?? 15,
                    'passing_score' => $quizData['passing_score'] ?? $foundQuiz->passing_score ?? 70,
                    'difficulty' => $quizData['difficulty'] ?? $foundQuiz->difficulty ?? 'mixed',
                    'total_questions' => count($questionsData),
                    'mc_questions_count' => $mcCount,
                    'essay_questions_count' => $essayCount,
                    'total_points' => round($totalPoints, 2),
                ]);
                $quiz = $foundQuiz;
            }
        }

        if (!$quiz) {
            $quiz = \App\Models\Quiz::updateOrCreate(
                ['lesson_id' => $lesson->id],
                [
                    'instructor_id' => $teacherId,
                    'title' => $quizData['title'] ?? 'Bài kiểm tra',
                    'description' => $quizData['description'] ?? null,
                    'time_limit_minutes' => $quizData['time_limit_minutes'] ?? 15,
                    'passing_score' => $quizData['passing_score'] ?? 70,
                    'difficulty' => $quizData['difficulty'] ?? 'mixed',
                    'total_questions' => count($questionsData),
                    'mc_questions_count' => $mcCount,
                    'essay_questions_count' => $essayCount,
                    'total_points' => round($totalPoints, 2),
                ]
            );
        }

        $courseId = $lesson->course_id ?? ($lesson->module->course_id ?? null);
        if ($courseId) {
            \App\Models\QuizCourseAttachment::updateOrCreate(
                ['quiz_id' => $quiz->id],
                [
                    'course_id' => $courseId,
                    'module_id' => $lesson->module_id,
                    'after_lesson_id' => $lesson->id,
                    'position' => 'after_lesson',
                ]
            );
        }

        if (!empty($questionsData)) {
            $quiz->questions()->delete();

            foreach ($questionsData as $index => $qData) {
                $type = $qData['type'] ?? 'multiple_choice';
                $content = !empty($qData['question']) ? $qData['question'] : (!empty($qData['content']) ? $qData['content'] : 'Câu hỏi');

                $question = $quiz->questions()->create([
                    'type' => $type,
                    'content' => $content,
                    'explanation' => $qData['explanation'] ?? null,
                    'sample_answer' => $type === 'essay' ? ($qData['sample_answer'] ?? null) : null,
                    'rubric' => $type === 'essay' ? ($qData['rubric'] ?? null) : null,
                    'points' => (float) ($qData['points'] ?? ($type === 'essay' ? 5.0 : 1.0)),
                    'difficulty' => $qData['difficulty'] ?? 'medium',
                    'order' => $index + 1,
                ]);

                if ($type !== 'essay') {
                    $answersList = $qData['answers'] ?? [];

                    if (empty($answersList) && !empty($qData['options']) && is_array($qData['options'])) {
                        $correctIdx = is_numeric($qData['correct_answer_index'] ?? null) ? (int)$qData['correct_answer_index'] : 0;
                        foreach ($qData['options'] as $optIdx => $optContent) {
                            $answersList[] = [
                                'content' => (string) $optContent,
                                'is_correct' => $optIdx == $correctIdx,
                            ];
                        }
                    }

                    foreach ($answersList as $aData) {
                        $question->answers()->create([
                            'content' => $aData['content'] ?? $aData['answer'] ?? '',
                            'is_correct' => !empty($aData['is_correct']),
                        ]);
                    }
                }
            }
        }
    }
}
