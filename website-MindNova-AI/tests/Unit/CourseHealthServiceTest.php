<?php

namespace Tests\Unit;

use App\Models\Course;
use App\Models\CourseModule;
use App\Models\Lesson;
use App\Services\Instructor\CourseHealthService;
use Tests\TestCase;

class CourseHealthServiceTest extends TestCase
{
    public function test_incomplete_course_is_blocked(): void
    {
        $course = new Course(['title' => 'AI', 'price' => 0]);
        $course->setRelation('modules', collect());

        $report = app(CourseHealthService::class)->evaluate($course);

        $this->assertFalse($report['can_submit']);
        $this->assertSame('blocked', $report['status']);
        $this->assertNotEmpty($report['issues']);
    }

    public function test_complete_article_course_is_ready(): void
    {
        $lesson = new Lesson([
            'id' => 10,
            'title' => 'Bài viết đầu tiên',
            'type' => 'article',
            'content' => str_repeat('Nội dung bài học. ', 4),
        ]);
        $lesson->setRelation('media', collect());
        $lesson->setRelation('quiz', null);

        $module = new CourseModule(['id' => 2, 'title' => 'Chương 1']);
        $module->setRelation('lessons', collect([$lesson]));

        $course = new Course([
            'id' => 1,
            'title' => 'Khóa học AI cơ bản',
            'description' => str_repeat('Mô tả khóa học. ', 3),
            'thumbnail' => 'https://example.test/thumbnail.png',
            'price' => 100000,
            'level' => 'beginner',
        ]);
        $course->setRelation('modules', collect([$module]));

        $report = app(CourseHealthService::class)->evaluate($course);

        $this->assertTrue($report['can_submit']);
        $this->assertSame('ready', $report['status']);
        $this->assertSame(100, $report['score']);
    }
}
