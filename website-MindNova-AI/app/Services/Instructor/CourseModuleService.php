<?php

namespace App\Services\Instructor;

use App\Models\Course;
use App\Models\CourseModule;
use App\Services\ContentReviewService;

class CourseModuleService
{
    public function __construct(
        private readonly LessonService $lessonService,
        private readonly ContentReviewService $reviewService,
    ) {}

    public function createModule(Course $course, array $data): CourseModule
    {
        $data['course_id'] = $course->id;
        if (!isset($data['order'])) {
            $maxOrder = $course->modules()->max('order') ?? 0;
            $data['order'] = $maxOrder + 1;
        }

        // New modules in published courses start as draft
        $data['status'] = $course->isPublished() ? 'draft' : 'draft';

        $module = CourseModule::create($data);

        // Mark pending submissions as stale if course is published
        if ($course->isPublished()) {
            $this->reviewService->markSubmissionsStale($course);
        }

        return $module;
    }

    public function updateModule(CourseModule $module, array $data): CourseModule
    {
        $module->update($data);

        // Mark pending submissions as stale if course is published
        $course = $module->course;
        if ($course && $course->isPublished()) {
            $this->reviewService->markSubmissionsStale($course);
        }

        return $module;
    }

    public function deleteModule(CourseModule $module): void
    {
        // If course is published and module has published lessons, prevent deletion
        $course = $module->course;
        if ($course && $course->isPublished()) {
            $hasPublishedLessons = $module->lessons()->where('status', 'published')->exists();
            if ($hasPublishedLessons) {
                throw new \Exception('Không thể xóa section có bài học đang public. Hãy yêu cầu xóa từng bài học trước.');
            }
        }

        foreach ($module->lessons as $lesson) {
            $this->lessonService->deleteLesson($lesson);
        }
        $module->delete();
    }
}
