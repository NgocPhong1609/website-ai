<?php

namespace App\Services\Instructor;

use App\Models\CourseModule;
use App\Models\Lesson;
use App\Models\LessonMedia;
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
        // Delete associated media from R2
        foreach ($lesson->media as $media) {
            Storage::disk('r2')->delete($media->r2_key);
        }
        
        $lesson->delete();
    }

    public function uploadVideo(Lesson $lesson, UploadedFile $file): array
    {
        $uuid = \Illuminate\Support\Str::uuid()->toString();
        $extension = $file->getClientOriginalExtension();
        $filename = "lessons/{$lesson->id}/videos/{$uuid}.{$extension}";

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
}
