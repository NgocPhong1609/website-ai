<?php

namespace App\Services\Student;

use App\Exceptions\CourseAiContextException;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;

final class CourseAiContextService
{
    // Together these caps keep serialized context below 100 KiB, including worst-case JSON escaping.
    private const TITLE_LIMIT = 200;

    private const COURSE_DESCRIPTION_LIMIT = 2000;

    private const LESSON_CONTENT_LIMIT = 12000;

    private const FORBIDDEN_MESSAGE = 'Bạn không có quyền truy cập bài học này.';

    private const MISSING_CONTEXT_MESSAGE = 'Không tìm thấy nội dung khóa học phù hợp để hỗ trợ.';

    /**
     * @return array{
     *     course_id: int,
     *     course_title: string,
     *     course_description: string,
     *     module_id: int|null,
     *     module_title: string|null,
     *     lesson_id: int,
     *     lesson_title: string,
     *     lesson_content: string,
     *     attachments: array<int, array{display_name: string, mime_type: string|null}>
     * }
     */
    public function resolve(User $user, ?int $lessonId): array
    {
        $lesson = $lessonId === null
            ? $this->resolveImplicitLesson($user)
            : $this->resolveExplicitLesson($user, $lessonId);
        $courseSnapshot = $lesson->course->publishedVersion?->snapshot ?? [];
        $lessonSnapshot = $lesson->publishedVersion?->snapshot ?? [];
        $moduleSnapshot = collect($courseSnapshot['modules'] ?? [])
            ->first(fn (array $module): bool => ($module['id'] ?? null) === $lesson->module_id);

        return [
            'course_id' => $lesson->course->id,
            'course_title' => mb_substr((string) ($courseSnapshot['title'] ?? ''), 0, self::TITLE_LIMIT),
            'course_description' => mb_substr(
                $this->plainText($courseSnapshot['description'] ?? null),
                0,
                self::COURSE_DESCRIPTION_LIMIT,
            ),
            'module_id' => $lesson->module?->id,
            'module_title' => isset($moduleSnapshot['title'])
                ? mb_substr($moduleSnapshot['title'], 0, self::TITLE_LIMIT) : null,
            'lesson_id' => $lesson->id,
            'lesson_title' => mb_substr((string) ($lessonSnapshot['title'] ?? ''), 0, self::TITLE_LIMIT),
            'lesson_content' => mb_substr(
                $this->plainText($lessonSnapshot['content'] ?? null),
                0,
                self::LESSON_CONTENT_LIMIT,
            ),
            // Lesson attachment rows are mutable and are not part of ContentVersion snapshots.
            'attachments' => [],
        ];
    }

    private function resolveExplicitLesson(User $user, int $lessonId): Lesson
    {
        $lesson = $this->publishedLessons()
            ->whereKey($lessonId)
            ->whereHas('course.enrollments', fn (Builder $query) => $query
                ->where('user_id', $user->id)
                ->where('status', 'enrolled'))
            ->first();

        if ($lesson === null) {
            throw new CourseAiContextException(self::FORBIDDEN_MESSAGE, 403);
        }

        return $lesson;
    }

    private function resolveImplicitLesson(User $user): Lesson
    {
        $enrollment = Enrollment::query()
            ->where('user_id', $user->id)
            ->where('status', 'enrolled')
            ->whereHas('course', fn (Builder $query) => $query->where('status', 'published'))
            ->orderByDesc('enrolled_at')
            ->orderByDesc('id')
            ->first();

        $lesson = $enrollment === null
            ? null
            : $this->publishedLessons()
                ->where('lessons.course_id', $enrollment->course_id)
                ->leftJoin('course_modules as context_modules', 'context_modules.id', '=', 'lessons.module_id')
                ->select('lessons.*')
                ->orderByRaw('context_modules.id IS NULL')
                ->orderBy('context_modules.order')
                ->orderBy('context_modules.id')
                ->orderBy('lessons.order')
                ->orderBy('lessons.id')
                ->first();

        if ($lesson === null) {
            throw new CourseAiContextException(self::MISSING_CONTEXT_MESSAGE, 422);
        }

        return $lesson;
    }

    private function publishedLessons(): Builder
    {
        return Lesson::query()
            ->whereHas('publishedVersion', fn (Builder $versionQuery) => $versionQuery
                ->where('status', 'published')
                ->where('is_published', true))
            ->whereHas('course', fn (Builder $query) => $query
                ->where('status', 'published')
                ->whereHas('publishedVersion', fn (Builder $versionQuery) => $versionQuery
                    ->where('status', 'published')
                    ->where('is_published', true)))
            ->where(function (Builder $query): void {
                $query->whereNull('lessons.module_id')
                    ->orWhereHas('module', fn (Builder $moduleQuery) => $moduleQuery
                        ->where('status', 'published'));
            })
            ->with([
                'course:id,published_version_id',
                'course.publishedVersion:id,snapshot_data',
                'module:id,course_id',
                'publishedVersion:id,snapshot_data,status,is_published',
            ]);
    }

    private function plainText(?string $content): string
    {
        return trim(preg_replace('/\s+/u', ' ', strip_tags($content ?? '')) ?? '');
    }
}
