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
        $data['course_id'] = $module->course_id;
        if (!isset($data['order'])) {
            $maxOrder = $module->lessons()->max('order') ?? 0;
            $data['order'] = $maxOrder + 1;
        }

        return Lesson::create($data);
    }

    public function updateLesson(Lesson $lesson, array $data): Lesson
    {
        $lesson->fill($data);

        if ($lesson->type === 'article') {
            $content = $lesson->content ?? '';
            $text = strip_tags($content);
            // Count words (Unicode friendly)
            $wordCount = count(preg_split('~[^\p{L}\p{N}\']+~u', $text, -1, PREG_SPLIT_NO_EMPTY));
            $lesson->duration_seconds = (int) ceil(($wordCount / 200) * 60);
        }

        $lesson->save();
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

    /**
     * Upload a media file from CKEditor content (image or video) to Cloudflare R2.
     * Returns the public URL for embedding in HTML content.
     */
    public function uploadContentMedia(Lesson $lesson, UploadedFile $file): array
    {
        $uuid = \Illuminate\Support\Str::uuid()->toString();
        $extension = $file->getClientOriginalExtension();

        $isVideo = str_starts_with($file->getMimeType(), 'video/');
        $subfolder = $isVideo ? 'videos' : 'images';
        $mediaType = $isVideo ? 'video' : 'image';

        $filename = "lessons/{$lesson->id}/content/{$subfolder}/{$uuid}.{$extension}";

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
                $subfolder = $media->media_type === 'video' ? 'videos' : 'images';
                $filename = basename($media->r2_key);
                $newKey = "lessons/{$lesson->id}/content/{$subfolder}/{$filename}";

                $oldUrl = Storage::disk('r2')->url($media->r2_key);
                $newUrl = Storage::disk('r2')->url($newKey);

                // Move the file in Cloudflare R2
                if (Storage::disk('r2')->exists($media->r2_key)) {
                    Storage::disk('r2')->move($media->r2_key, $newKey);
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
                if (Storage::disk('r2')->exists($media->r2_key)) {
                    Storage::disk('r2')->delete($media->r2_key);
                }
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
            if (Storage::disk('r2')->exists($media->r2_key)) {
                Storage::disk('r2')->delete($media->r2_key);
            }
            $media->delete();
        }
    }
}
