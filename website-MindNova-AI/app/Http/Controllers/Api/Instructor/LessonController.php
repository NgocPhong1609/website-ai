<?php

namespace App\Http\Controllers\Api\Instructor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Instructor\StoreLessonRequest;
use App\Http\Resources\LessonResource;
use App\Models\CourseModule;
use App\Models\Lesson;
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

        return $this->successResponse(
            LessonResource::collection($module->lessons), 
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

        $lesson = $this->lessonService->createLesson($module, $request->validated());

        return $this->createdResponse(new LessonResource($lesson), 'Lesson created successfully.');
    }

    public function update(StoreLessonRequest $request, Lesson $lesson)
    {
        Gate::authorize('manage', $lesson);

        $lesson = $this->lessonService->updateLesson($lesson, $request->validated());

        return $this->successResponse(new LessonResource($lesson), 'Lesson updated successfully.');
    }

    public function destroy(Lesson $lesson)
    {
        Gate::authorize('manage', $lesson);

        $this->lessonService->deleteLesson($lesson);

        return $this->noContentResponse();
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
}
