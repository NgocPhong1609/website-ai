<?php

namespace App\Services\Student;

use App\Exceptions\CourseAiContextException;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;

final class CourseAiContextService
{
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

        return [
            'course_id' => $lesson->course->id,
            'course_title' => $lesson->course->title,
            'course_description' => mb_substr(
                $this->plainText($lesson->course->description),
                0,
                self::COURSE_DESCRIPTION_LIMIT,
            ),
            'module_id' => $lesson->module?->id,
            'module_title' => $lesson->module?->title,
            'lesson_id' => $lesson->id,
            'lesson_title' => $lesson->title,
            'lesson_content' => mb_substr(
                $this->plainText($lesson->content),
                0,
                self::LESSON_CONTENT_LIMIT,
            ),
            'attachments' => $lesson->attachments()
                ->get(['display_name', 'mime_type'])
                ->map(fn ($attachment): array => [
                    'display_name' => $attachment->display_name,
                    'mime_type' => $attachment->mime_type,
                ])
                ->values()
                ->all(),
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
                ->where('course_id', $enrollment->course_id)
                ->orderBy('order')
                ->orderBy('id')
                ->first();

        if ($lesson === null) {
            throw new CourseAiContextException(self::MISSING_CONTEXT_MESSAGE, 422);
        }

        return $lesson;
    }

    private function publishedLessons(): Builder
    {
        return Lesson::query()
            ->where('status', 'published')
            ->whereHas('course', fn (Builder $query) => $query->where('status', 'published'))
            ->where(function (Builder $query): void {
                $query->whereNull('module_id')
                    ->orWhereHas('module', fn (Builder $moduleQuery) => $moduleQuery
                        ->where('status', 'published'));
            })
            ->with([
                'course:id,title,description',
                'module:id,course_id,title',
            ]);
    }

    private function plainText(?string $content): string
    {
        return trim(preg_replace('/\s+/u', ' ', strip_tags($content ?? '')) ?? '');
    }
}
