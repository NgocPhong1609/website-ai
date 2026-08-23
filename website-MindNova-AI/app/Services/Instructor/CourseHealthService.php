<?php

namespace App\Services\Instructor;

use App\Models\Course;
use App\Models\Lesson;

class CourseHealthService
{
    /** @return array{status: string, score: int, can_submit: bool, issues: array<int, array<string, mixed>>} */
    public function evaluate(Course $course): array
    {
        $course->loadMissing('modules.lessons.media', 'modules.lessons.quiz.questions.answers');
        $issues = [];

        $this->require($issues, filled($course->title) && mb_strlen(trim($course->title)) >= 3, 'course.title', 'Khóa học cần có tiêu đề tối thiểu 3 ký tự.');
        $this->require($issues, filled($course->description) && mb_strlen(trim(strip_tags($course->description))) >= 30, 'course.description', 'Khóa học cần có mô tả tối thiểu 30 ký tự.');
        $this->require($issues, filled($course->thumbnail), 'course.thumbnail', 'Khóa học cần có ảnh bìa.');
        $this->require($issues, (float) $course->price >= 0, 'course.price', 'Giá khóa học không hợp lệ.');

        if ($course->is_flash_sale) {
            $this->require($issues, $course->sale_price !== null && (float) $course->sale_price > 0, 'course.sale_price', 'Flash sale cần có giá khuyến mãi lớn hơn 0.');
            $this->require($issues, $course->sale_price !== null && (float) $course->sale_price < (float) $course->price, 'course.sale_price', 'Giá khuyến mãi phải thấp hơn giá gốc.');
            $this->require($issues, $course->sale_start_date !== null && $course->sale_end_date !== null && $course->sale_end_date->greaterThanOrEqualTo($course->sale_start_date), 'course.sale_dates', 'Khoảng thời gian flash sale không hợp lệ.');
        }

        $this->require($issues, $course->modules->isNotEmpty(), 'course.modules', 'Khóa học cần có ít nhất một chương.');
        $lessonCount = 0;

        foreach ($course->modules as $module) {
            if (!filled($module->title)) {
                $this->warning($issues, "module.{$module->id}.title", 'Chương chưa có tiêu đề.');
            }

            foreach ($module->lessons as $lesson) {
                $lessonCount++;
                $this->evaluateLesson($issues, $lesson);
            }
        }

        $this->require($issues, $lessonCount > 0, 'course.lessons', 'Khóa học cần có ít nhất một bài học.');

        $errorCount = count(array_filter($issues, fn (array $issue): bool => $issue['severity'] === 'error'));
        $warningCount = count(array_filter($issues, fn (array $issue): bool => $issue['severity'] === 'warning'));

        return [
            'status' => $errorCount > 0 ? 'blocked' : ($warningCount > 0 ? 'ready_with_warnings' : 'ready'),
            'score' => max(0, 100 - ($errorCount * 15) - ($warningCount * 5)),
            'can_submit' => $errorCount === 0,
            'issues' => $issues,
        ];
    }

    /** @param array<int, array<string, mixed>> $issues */
    private function evaluateLesson(array &$issues, Lesson $lesson): void
    {
        $prefix = "lesson.{$lesson->id}";
        $this->require($issues, filled($lesson->title), "{$prefix}.title", 'Bài học chưa có tiêu đề.');

        if ($lesson->type === 'article') {
            $this->require($issues, filled(trim(strip_tags((string) $lesson->content))), "{$prefix}.content", 'Bài viết chưa có nội dung.');
            return;
        }

        if ($lesson->type === 'video') {
            $videos = $lesson->media->where('media_type', 'video');
            $hasReadyVideo = $videos->contains(fn ($media): bool => $media->status === 'ready');
            $hasVideoUrl = filled($lesson->video_url);

            $this->require($issues, $hasReadyVideo || $hasVideoUrl, "{$prefix}.media", 'Bài video chưa có video sẵn sàng phát.');

            if ($videos->contains(fn ($media): bool => $media->status === 'failed')) {
                $this->require($issues, false, "{$prefix}.media", 'Video tải lên đã xử lý thất bại. Hãy thử tải lại.');
            }
            if ($videos->contains(fn ($media): bool => in_array($media->status, ['uploading', 'uploaded', 'queued', 'processing'], true))) {
                $this->warning($issues, "{$prefix}.media", 'Video vẫn đang tải lên hoặc xử lý.');
            }
            return;
        }

        if ($lesson->type === 'quiz_module') {
            $quiz = $lesson->quiz;
            $this->require($issues, $quiz !== null, "{$prefix}.quiz", 'Bài quiz chưa có bộ câu hỏi.');
            if (!$quiz) {
                return;
            }

            $this->require($issues, $quiz->questions->isNotEmpty(), "{$prefix}.quiz.questions", 'Quiz cần có ít nhất một câu hỏi.');
            foreach ($quiz->questions as $question) {
                $this->require($issues, $question->answers->count() >= 2, "{$prefix}.quiz.question.{$question->id}", 'Mỗi câu hỏi cần ít nhất hai đáp án.');
            }
            return;
        }

        $this->warning($issues, "{$prefix}.type", 'Loại bài học chưa được Course Health kiểm tra tự động.');
    }

    /** @param array<int, array<string, mixed>> $issues */
    private function require(array &$issues, bool $condition, string $field, string $message): void
    {
        if (!$condition) {
            $issues[] = ['severity' => 'error', 'field' => $field, 'message' => $message];
        }
    }

    /** @param array<int, array<string, mixed>> $issues */
    private function warning(array &$issues, string $field, string $message): void
    {
        $issues[] = ['severity' => 'warning', 'field' => $field, 'message' => $message];
    }
}
