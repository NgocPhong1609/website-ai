<?php

use App\Exceptions\CourseAiContextException;
use App\Models\Course;
use App\Models\CourseModule;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\LessonAttachment;
use App\Models\User;
use App\Services\Student\CourseAiContextService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;

uses(RefreshDatabase::class);

function createCourseAiTestCourse(User $teacher, array $attributes = []): Course
{
    return Course::create(array_merge([
        'teacher_id' => $teacher->id,
        'title' => 'Khóa học Laravel',
        'slug' => 'khoa-hoc-laravel-'.Str::uuid(),
        'description' => 'Nội dung khóa học',
        'price' => 0,
        'level' => 'beginner',
        'status' => 'published',
    ], $attributes));
}

function createCourseAiTestLesson(Course $course, array $attributes = []): Lesson
{
    $module = CourseModule::create([
        'course_id' => $course->id,
        'title' => $attributes['module_title'] ?? 'Routing',
        'order' => $attributes['module_order'] ?? 1,
        'status' => $attributes['module_status'] ?? 'published',
    ]);

    unset($attributes['module_title'], $attributes['module_order'], $attributes['module_status']);

    return Lesson::create(array_merge([
        'course_id' => $course->id,
        'module_id' => $module->id,
        'title' => 'Route model binding',
        'content' => '<p>Implicit binding</p>',
        'order' => 1,
        'status' => 'published',
    ], $attributes));
}

test('context contains only the enrolled published lesson', function () {
    $teacher = User::factory()->create();
    $student = User::factory()->create();
    $course = createCourseAiTestCourse($teacher, [
        'title' => 'Laravel căn bản',
        'description' => '<p>MVC</p>',
    ]);
    Enrollment::create([
        'user_id' => $student->id,
        'course_id' => $course->id,
        'status' => 'enrolled',
        'enrolled_at' => now(),
    ]);
    $lesson = createCourseAiTestLesson($course);
    LessonAttachment::create([
        'lesson_id' => $lesson->id,
        'uploaded_by' => $course->teacher_id,
        'display_name' => 'route-notes.pdf',
        'original_name' => 'secret.pdf',
        'mime_type' => 'application/pdf',
        'extension' => 'pdf',
        'size_bytes' => 10,
        'r2_key' => 'private/key',
    ]);

    $context = app(CourseAiContextService::class)->resolve($student, $lesson->id);

    expect($context)
        ->course_id->toBe($course->id)
        ->course_title->toBe('Laravel căn bản')
        ->course_description->toBe('MVC')
        ->module_id->toBe($lesson->module_id)
        ->module_title->toBe('Routing')
        ->lesson_id->toBe($lesson->id)
        ->lesson_title->toBe('Route model binding')
        ->lesson_content->toBe('Implicit binding')
        ->attachments->toBe([
            ['display_name' => 'route-notes.pdf', 'mime_type' => 'application/pdf'],
        ]);
    expect(json_encode($context))
        ->not->toContain('private/key')
        ->not->toContain('secret.pdf');
});

test('another students lesson and a missing lesson have the same generic forbidden failure', function () {
    $teacher = User::factory()->create();
    $student = User::factory()->create();
    $otherStudent = User::factory()->create();
    $course = createCourseAiTestCourse($teacher);
    Enrollment::create([
        'user_id' => $otherStudent->id,
        'course_id' => $course->id,
        'status' => 'enrolled',
        'enrolled_at' => now(),
    ]);
    $lesson = createCourseAiTestLesson($course);
    $service = app(CourseAiContextService::class);

    $failures = [];
    foreach ([$lesson->id, $lesson->id + 1000] as $lessonId) {
        try {
            $service->resolve($student, $lessonId);
        } catch (CourseAiContextException $exception) {
            $failures[] = [$exception->status(), $exception->getMessage()];
        }
    }

    expect($failures)->toBe([
        [403, 'Bạn không có quyền truy cập bài học này.'],
        [403, 'Bạn không có quyền truy cập bài học này.'],
    ]);
});

test('explicit context rejects unpublished course module or lesson content', function (array $states) {
    $teacher = User::factory()->create();
    $student = User::factory()->create();
    $course = createCourseAiTestCourse($teacher, ['status' => $states['course']]);
    Enrollment::create([
        'user_id' => $student->id,
        'course_id' => $course->id,
        'status' => 'enrolled',
        'enrolled_at' => now(),
    ]);
    $lesson = createCourseAiTestLesson($course, [
        'module_status' => $states['module'],
        'status' => $states['lesson'],
        'content' => '<p>Unpublished secret</p>',
    ]);

    expect(fn () => app(CourseAiContextService::class)->resolve($student, $lesson->id))
        ->toThrow(CourseAiContextException::class, 'Bạn không có quyền truy cập bài học này.');
})->with([
    'draft course' => [['course' => 'draft', 'module' => 'published', 'lesson' => 'published']],
    'draft module' => [['course' => 'published', 'module' => 'draft', 'lesson' => 'published']],
    'draft lesson' => [['course' => 'published', 'module' => 'published', 'lesson' => 'draft']],
]);

test('missing lesson id resolves the first published lesson from the latest active enrollment', function () {
    $teacher = User::factory()->create();
    $student = User::factory()->create();
    $olderCourse = createCourseAiTestCourse($teacher, ['title' => 'Khóa cũ']);
    $latestCourse = createCourseAiTestCourse($teacher, ['title' => 'Khóa mới']);
    Enrollment::create([
        'user_id' => $student->id,
        'course_id' => $olderCourse->id,
        'status' => 'enrolled',
        'enrolled_at' => now()->subDay(),
    ]);
    Enrollment::create([
        'user_id' => $student->id,
        'course_id' => $latestCourse->id,
        'status' => 'enrolled',
        'enrolled_at' => now(),
    ]);
    createCourseAiTestLesson($olderCourse, ['title' => 'Bài khóa cũ']);
    createCourseAiTestLesson($latestCourse, [
        'title' => 'Bài thứ hai',
        'order' => 2,
    ]);
    $firstLesson = createCourseAiTestLesson($latestCourse, [
        'module_title' => 'Nhập môn',
        'module_order' => 1,
        'title' => 'Bài đầu tiên',
        'order' => 1,
    ]);

    $context = app(CourseAiContextService::class)->resolve($student, null);

    expect($context)
        ->course_id->toBe($latestCourse->id)
        ->lesson_id->toBe($firstLesson->id)
        ->lesson_title->toBe('Bài đầu tiên');
});

test('student without usable implicit context receives an unprocessable failure', function () {
    $teacher = User::factory()->create();
    $student = User::factory()->create();
    $course = createCourseAiTestCourse($teacher);
    Enrollment::create([
        'user_id' => $student->id,
        'course_id' => $course->id,
        'status' => 'waiting',
        'enrolled_at' => now(),
    ]);
    createCourseAiTestLesson($course);

    try {
        app(CourseAiContextService::class)->resolve($student, null);
        $this->fail('Expected context resolution to fail.');
    } catch (CourseAiContextException $exception) {
        expect($exception->status())->toBe(422)
            ->and($exception->getMessage())->toBe('Không tìm thấy nội dung khóa học phù hợp để hỗ trợ.');
    }
});

test('context text is normalized and capped at its configured unicode limits', function () {
    $teacher = User::factory()->create();
    $student = User::factory()->create();
    $course = createCourseAiTestCourse($teacher, [
        'description' => '<p>'.str_repeat('đ', 2100).'</p>',
    ]);
    Enrollment::create([
        'user_id' => $student->id,
        'course_id' => $course->id,
        'status' => 'enrolled',
        'enrolled_at' => now(),
    ]);
    $lesson = createCourseAiTestLesson($course, [
        'content' => '<div>'.str_repeat('ệ', 12100).'</div>',
    ]);

    $context = app(CourseAiContextService::class)->resolve($student, $lesson->id);

    expect(mb_strlen($context['course_description']))->toBe(2000)
        ->and(mb_strlen($context['lesson_content']))->toBe(12000)
        ->and($context['course_description'])->not->toContain('<p>')
        ->and($context['lesson_content'])->not->toContain('<div>');
});
