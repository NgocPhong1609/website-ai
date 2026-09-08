<?php

namespace App\Http\Controllers\Api\Instructor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Instructor\StoreLessonRequest;
use App\Http\Requests\Instructor\UpdateLessonAttachmentRequest;
use App\Http\Requests\Instructor\UploadLessonAttachmentRequest;
use App\Http\Resources\LessonResource;
use App\Models\CourseModule;
use App\Models\Lesson;
use App\Models\LessonAttachment;
use App\Services\Instructor\LessonService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class LessonController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly LessonService $lessonService)
    {
    }

    public function index(CourseModule $module)
    {
        Gate::authorize('manage', $module);

        $lessons = $module->lessons()->with(['media', 'quiz.questions.answers'])->get();

        return $this->successResponse(
            LessonResource::collection($lessons), 
            'Lessons retrieved successfully.'
        );
    }

    public function show(Lesson $lesson)
    {
        Gate::authorize('manage', $lesson);

        return $this->successResponse(new LessonResource($lesson), 'Lesson retrieved successfully.');
    }

    public function store(StoreLessonRequest $request, CourseModule $module)
    {
        Gate::authorize('manage', $module);

        $validated = $request->validated();
        $tempMediaIds = $validated['temp_media_ids'] ?? [];
        unset($validated['temp_media_ids']);

        $lesson = $this->lessonService->createLesson($module, $validated);

        if (!empty($tempMediaIds)) {
            $this->lessonService->confirmTempMedia($tempMediaIds, $lesson);
        }

        return $this->createdResponse(new LessonResource($lesson), 'Lesson created successfully.');
    }

    public function update(StoreLessonRequest $request, Lesson $lesson)
    {
        Gate::authorize('manage', $lesson);

        $validated = $request->validated();
        $tempMediaIds = $validated['temp_media_ids'] ?? [];
        unset($validated['temp_media_ids']);

        $lesson = $this->lessonService->updateLesson($lesson, $validated);

        if (!empty($tempMediaIds) || count($lesson->media) > 0) {
            $this->lessonService->confirmTempMedia($tempMediaIds, $lesson);
        }

        return $this->successResponse(new LessonResource($lesson), 'Lesson updated successfully.');
    }

    public function destroy(Lesson $lesson)
    {
        Gate::authorize('manage', $lesson);

        try {
            $this->lessonService->deleteLesson($lesson);
            return $this->noContentResponse();
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }

    public function uploadVideo(Request $request, Lesson $lesson)
    {
        Gate::authorize('manage', $lesson);

        $request->validate([
            'video' => 'required|file|mimes:mp4,mov,avi,webm|max:512000', // 500MB
        ]);

        $result = $this->lessonService->uploadVideo($lesson, $request->file('video'));

        return $this->successResponse($result, 'Video uploaded to R2 successfully.');
    }

    public function getVideoUrl(Lesson $lesson)
    {
        Gate::authorize('manage', $lesson); // Assuming instructor role here. Update policy if student needs access.

        $result = $this->lessonService->generateVideoUrl($lesson);

        if (!$result) {
            return $this->notFoundResponse('No video media found for this lesson.');
        }

        return $this->successResponse($result, 'Signed URL generated.');
    }

    public function uploadContentMedia(Request $request, Lesson $lesson)
    {
        Gate::authorize('manage', $lesson);

        $request->validate([
            'file' => 'required|file|mimes:jpg,jpeg,png,gif,webp,mp4,mov,avi,webm|max:512000', // 500MB
        ]);

        $result = $this->lessonService->uploadContentMedia($lesson, $request->file('file'));

        return $this->successResponse($result, 'Content media uploaded to R2 successfully.');
    }

    public function uploadAttachments(UploadLessonAttachmentRequest $request, Lesson $lesson)
    {
        Gate::authorize('manage', $lesson);

        $attachments = $this->lessonService->uploadAttachments(
            $lesson,
            $request->file('attachments'),
            $request->user()->id,
        );

        return $this->createdResponse($attachments, 'Lesson attachments uploaded successfully.');
    }

    public function renameAttachment(
        UpdateLessonAttachmentRequest $request,
        Lesson $lesson,
        LessonAttachment $attachment,
    ) {
        Gate::authorize('manage', $lesson);
        abort_unless($attachment->lesson_id === $lesson->id, 404);

        $attachment = $this->lessonService->renameAttachment(
            $attachment,
            $request->validated('display_name'),
        );

        return $this->successResponse($attachment, 'Lesson attachment renamed successfully.');
    }

    public function deleteAttachment(Lesson $lesson, LessonAttachment $attachment)
    {
        Gate::authorize('manage', $lesson);
        abort_unless($attachment->lesson_id === $lesson->id, 404);

        $this->lessonService->deleteAttachment($attachment);

        return $this->noContentResponse();
    }

    public function attachmentDownloadUrl(Lesson $lesson, LessonAttachment $attachment)
    {
        Gate::authorize('manage', $lesson);
        abort_unless($attachment->lesson_id === $lesson->id, 404);

        return $this->successResponse(
            $this->lessonService->attachmentDownloadUrl($attachment),
            'Signed attachment URL generated.',
        );
    }

}
