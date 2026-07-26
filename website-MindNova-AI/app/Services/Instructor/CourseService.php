<?php

namespace App\Services\Instructor;

use App\Models\Course;
use Illuminate\Support\Str;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class CourseService
{
    public function createCourse(array $data, int $teacherId): Course
    {
        $data['teacher_id'] = $teacherId;
        $data['slug'] = $this->generateUniqueSlug($data['title']);
        $data['status'] = 'draft';

        return Course::create($data);
    }

    public function updateCourse(Course $course, array $data): Course
    {
        if (isset($data['title']) && $data['title'] !== $course->title) {
            $data['slug'] = $this->generateUniqueSlug($data['title'], $course->id);
        }

        $course->update($data);

        return $course;
    }

    public function uploadThumbnail(Course $course, UploadedFile $file): Course
    {
        // Delete old thumbnail if exists
        if ($course->thumbnail) {
            $oldPath = str_replace('/storage/', '', parse_url($course->thumbnail, PHP_URL_PATH));
            // In case the old thumbnail was on R2, parse_url will just get the path without domain.
            // But if it was on public, the path might start with /storage/ or be relative.
            // R2 usually doesn't have /storage/ in the URL, so we just remove the leading slash.
            $oldPathR2 = ltrim(parse_url($course->thumbnail, PHP_URL_PATH), '/');
            
            // Try deleting from both disks just in case of migration
            Storage::disk('public')->delete($oldPath);
            Storage::disk('r2')->delete($oldPathR2);
        }

        $path = $file->store('courses/thumbnails', 'r2');
        $url = Storage::disk('r2')->url($path);

        $course->update(['thumbnail' => $url]);

        return $course;
    }

    public function updateStatus(Course $course, string $status): Course
    {
        if ($status === 'published' && $course->status === 'draft') {
            // Need to check for modules and lessons in real scenario
            // $moduleCount = $course->modules()->count();
            // $lessonCount = $course->lessons()->count();
            // if ($moduleCount === 0 || $lessonCount === 0) {
            //    throw new \Exception("Cannot publish a course without modules and lessons.");
            // }
        }

        if ($status === 'draft' && $course->status === 'published') {
            throw new \Exception("Cannot change a published course back to draft.");
        }

        $course->update(['status' => $status]);

        return $course;
    }

    private function generateUniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $slug = Str::slug($title);
        $originalSlug = $slug;
        $count = 1;

        $query = Course::where('slug', $slug);
        if ($ignoreId) {
            $query->where('id', '!=', $ignoreId);
        }

        while ($query->exists()) {
            $slug = "{$originalSlug}-{$count}";
            $query = Course::where('slug', $slug);
            if ($ignoreId) {
                $query->where('id', '!=', $ignoreId);
            }
            $count++;
        }

        return $slug;
    }
}
