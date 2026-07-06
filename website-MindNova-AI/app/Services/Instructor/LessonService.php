<?php

namespace App\Services\Instructor;

use App\Models\CourseModule;
use App\Models\Lesson;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class LessonService
{
    public function createLesson(CourseModule $module, array $data): Lesson
    {
        $data['module_id'] = $module->id;
        if (!isset($data['order'])) {
            $maxOrder = $module->lessons()->max('order') ?? 0;
            $data['order'] = $maxOrder + 1;
        }

        return Lesson::create($data);
    }

    public function updateLesson(Lesson $lesson, array $data): Lesson
    {
        $lesson->update($data);
        return $lesson;
    }

    public function deleteLesson(Lesson $lesson): void
    {
        // Delete video file if exists
        if ($lesson->video_url) {
            $oldPath = str_replace('storage/', 'public/', $lesson->video_url);
            Storage::delete($oldPath);
        }
        
        $lesson->delete();
    }

    public function uploadVideo(Lesson $lesson, UploadedFile $file): Lesson
    {
        // Delete old video if exists
        if ($lesson->video_url) {
            $oldPath = str_replace('storage/', 'public/', $lesson->video_url);
            Storage::delete($oldPath);
        }

        $path = $file->store('public/lessons/videos');
        $url = Storage::url($path);

        $lesson->update([
            'video_url' => $url,
            // duration_minutes calculation could be handled here if we use a library like getID3 or ffmpeg.
        ]);

        return $lesson;
    }
}
