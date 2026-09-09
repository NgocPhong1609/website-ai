<?php

use App\Exceptions\CourseAiContextException;
use App\Models\ContentVersion;
use App\Models\Course;
use App\Models\CourseModule;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\LessonAttachment;
use App\Models\User;
use App\Services\Instructor\CourseModuleService;
use App\Services\Student\CourseAiContextService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;

uses(RefreshDatabase::class);

function createCourseAiTestCourse(User $teacher, array $attributes = []): Course
{
    $course = Course::create(array_merge([
        'teacher_id' => $teacher->id,
        'title' => 'Khóa học Laravel',
        'slug' => 'khoa-hoc-laravel-'.Str::uuid(),
        'description' => 'Nội dung khóa học',
        'price' => 0,
        'level' => 'beginner',
        'status' => 'published',
    ], $attributes));

    $version = ContentVersion::create([
        'versionable_type' => Course::class,
        'versionable_id' => $course->id,
        'version_number' => 1,
        'snapshot_data' => [
            'title' => $course->title,
            'description' => $course->description,
        ],
        'status' => 'published',
        'is_published' => true,
        'created_by' => $teacher->id,
    ]);
    $course->update(['published_version_id' => $version->id]);

    return $course;
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

    $version = $course->publishedVersion;
    $snapshot = $version->snapshot;
    $snapshot['modules'][] = ['id' => $module->id, 'title' => $module->title, 'order' => $module->order];
    $version->update(['snapshot_data' => $snapshot]);

    $lesson = Lesson::create(array_merge([
        'course_id' => $course->id,
        'module_id' => $module->id,
        'title' => 'Route model binding',
        'content' => '<p>Implicit binding</p>',
        'order' => 1,
        'status' => 'published',
    ], $attributes));

    if ($lesson->status === 'published') {
        $lessonVersion = ContentVersion::create([
            'versionable_type' => Lesson::class,
            'versionable_id' => $lesson->id,
            'version_number' => 1,
            'snapshot_data' => [
                'title' => $lesson->title,
                'content' => $lesson->content,
                'module_id' => $lesson->module_id,
                'course_id' => $lesson->course_id,
            ],
            'status' => 'published',
            'is_published' => true,
            'created_by' => $course->teacher_id,
        ]);
        $lesson->update(['published_version_id' => $lessonVersion->id]);
    }

    return $lesson->fresh();
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
        ->attachments->toBe([]);
    expect(json_encode($context))
        ->not->toContain('private/key')
        ->not->toContain('secret.pdf');
});

test('context uses the approved lesson snapshot while unpublished working edits stay private', function () {
    $teacher = User::factory()->create();
    $student = User::factory()->create();
    $course = createCourseAiTestCourse($teacher);
    Enrollment::create([
        'user_id' => $student->id, 'course_id' => $course->id,
        'status' => 'enrolled', 'enrolled_at' => now(),
    ]);
    $lesson = createCourseAiTestLesson($course, [
        'title' => 'Approved lesson title',
        'content' => '<p>Approved lesson content</p>',
    ]);
    $lesson->update([
        'title' => 'private-unreviewed-lesson-title',
        'content' => '<p>private-unreviewed-lesson-content</p>',
        'status' => 'draft',
    ]);
    LessonAttachment::create([
        'lesson_id' => $lesson->id, 'uploaded_by' => $teacher->id,
        'display_name' => 'private-unreviewed-attachment.pdf', 'original_name' => 'private.pdf',
        'mime_type' => 'application/pdf', 'extension' => 'pdf', 'size_bytes' => 10,
        'r2_key' => 'private-unreviewed-key',
    ]);

    $context = app(CourseAiContextService::class)->resolve($student, $lesson->id);

    expect($context['lesson_title'])->toBe('Approved lesson title')
        ->and($context['lesson_content'])->toBe('Approved lesson content')
        ->and($context['attachments'])->toBe([])
        ->and(json_encode($context))->not->toContain('private-unreviewed');
});

test('context rejects a lesson that has no approved published version', function () {
    $teacher = User::factory()->create();
    $student = User::factory()->create();
    $course = createCourseAiTestCourse($teacher);
    Enrollment::create([
        'user_id' => $student->id, 'course_id' => $course->id,
        'status' => 'enrolled', 'enrolled_at' => now(),
    ]);
    $lesson = createCourseAiTestLesson($course);
    $lesson->update(['published_version_id' => null]);

    expect(fn () => app(CourseAiContextService::class)->resolve($student, $lesson->id))
        ->toThrow(CourseAiContextException::class, 'Bạn không có quyền truy cập bài học này.');
});

test('context uses approved course metadata instead of unpublished working edits', function () {
    $teacher = User::factory()->create();
    $student = User::factory()->create();
    $course = createCourseAiTestCourse($teacher, [
        'title' => 'Tiêu đề đã duyệt',
        'description' => '<p>Mô tả đã duyệt</p>',
    ]);
    Enrollment::create([
        'user_id' => $student->id,
        'course_id' => $course->id,
        'status' => 'enrolled',
        'enrolled_at' => now(),
    ]);
    $lesson = createCourseAiTestLesson($course);
    $course->update([
        'title' => 'Tiêu đề nháp chưa duyệt',
        'description' => '<p>Mô tả nháp chưa duyệt</p>',
    ]);

    $context = app(CourseAiContextService::class)->resolve($student, $lesson->id);

    expect($context)
        ->course_title->toBe('Tiêu đề đã duyệt')
        ->course_description->toBe('Mô tả đã duyệt');
    expect(json_encode($context))
        ->not->toContain('Tiêu đề nháp chưa duyệt')
        ->not->toContain('Mô tả nháp chưa duyệt');
});

test('context uses approved module metadata after a published module is renamed', function () {
    $teacher = User::factory()->create();
    $student = User::factory()->create();
    $course = createCourseAiTestCourse($teacher);
    Enrollment::create([
        'user_id' => $student->id, 'course_id' => $course->id,
        'status' => 'enrolled', 'enrolled_at' => now(),
    ]);
    createCourseAiTestLesson($course, ['module_title' => 'Another approved module']);
    $lesson = createCourseAiTestLesson($course);

    app(CourseModuleService::class)->updateModule($lesson->module, ['title' => 'private-unreviewed-module-title']);

    $context = app(CourseAiContextService::class)->resolve($student, $lesson->id);

    expect($lesson->module->fresh()->status)->toBe('published')
        ->and($context['module_id'])->toBe($lesson->module_id)
        ->and($context['module_title'])->toBe('Routing')
        ->and(json_encode($context))->not->toContain('private-unreviewed-module-title');
});

test('context excludes module titles absent from the approved snapshot', function () {
    $teacher = User::factory()->create();
    $student = User::factory()->create();
    $course = createCourseAiTestCourse($teacher);
    Enrollment::create([
        'user_id' => $student->id, 'course_id' => $course->id,
        'status' => 'enrolled', 'enrolled_at' => now(),
    ]);
    $lesson = createCourseAiTestLesson($course, ['module_title' => 'private-unreviewed-module-title']);
    $version = $course->publishedVersion;
    $snapshot = $version->snapshot;
    $snapshot['modules'] = [['id' => $lesson->module_id + 1, 'title' => 'Another approved module']];
    $version->update(['snapshot_data' => $snapshot]);

    $context = app(CourseAiContextService::class)->resolve($student, $lesson->id);

    expect($context['module_id'])->toBe($lesson->module_id)
        ->and($context['module_title'])->toBeNull()
        ->and(json_encode($context))->not->toContain('private-unreviewed-module-title');
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

test('missing lesson id resolves by module then lesson order from the latest active enrollment', function () {
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
        'module_title' => 'Module sau',
        'module_order' => 2,
        'title' => 'Bài đầu module sau',
        'order' => 1,
    ]);
    $firstLesson = createCourseAiTestLesson($latestCourse, [
        'module_title' => 'Module trước',
        'module_order' => 1,
        'title' => 'Bài thứ hai module trước',
        'order' => 2,
    ]);

    $context = app(CourseAiContextService::class)->resolve($student, null);

    expect($context)
        ->course_id->toBe($latestCourse->id)
        ->lesson_id->toBe($firstLesson->id)
        ->lesson_title->toBe('Bài thứ hai module trước');
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
    $lesson = createCourseAiTestLesson($course, ['content' => '<div>'.str_repeat('ệ', 12100).'</div>']);

    $context = app(CourseAiContextService::class)->resolve($student, $lesson->id);

    expect(mb_strlen($context['course_description']))->toBe(2000)
        ->and(mb_strlen($context['lesson_content']))->toBe(12000)
        ->and($context['course_description'])->not->toContain('<p>')
        ->and($context['lesson_content'])->not->toContain('<div>');
});

test('context excludes live attachment metadata because it is absent from the approved snapshot', function () {
    $teacher = User::factory()->create();
    $student = User::factory()->create();
    $course = createCourseAiTestCourse($teacher);
    Enrollment::create([
        'user_id' => $student->id, 'course_id' => $course->id,
        'status' => 'enrolled', 'enrolled_at' => now(),
    ]);
    $lesson = createCourseAiTestLesson($course);
    foreach (array_reverse(range(1, 40)) as $index) {
        LessonAttachment::query()->insert([
            'id' => 9000 + $index,
            'lesson_id' => $lesson->id, 'uploaded_by' => $teacher->id,
            'display_name' => sprintf('%02d-', $index).str_repeat('📘', 252),
            'mime_type' => 'application/'.str_repeat('ệ', 138),
            'original_name' => 'private-original.pdf', 'extension' => 'pdf',
            'size_bytes' => 10, 'r2_key' => 'private-storage-key-'.$index,
        ]);
    }

    $context = app(CourseAiContextService::class)->resolve($student, $lesson->id);

    expect($context['attachments'])->toBe([]);
    expect(json_encode($context, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR))->not->toContain('private-');
    expect($lesson->attachments()->count())->toBe(40)
        ->and(LessonAttachment::findOrFail(9001)->display_name)->toBe('01-'.str_repeat('📘', 252));
});

test('context caps every title including oversized approved snapshot metadata by unicode code point', function () {
    $teacher = User::factory()->create();
    $student = User::factory()->create();
    $course = createCourseAiTestCourse($teacher);
    Enrollment::create([
        'user_id' => $student->id, 'course_id' => $course->id,
        'status' => 'enrolled', 'enrolled_at' => now(),
    ]);
    $lesson = createCourseAiTestLesson($course, ['title' => str_repeat('📘', 255)]);
    $version = $course->publishedVersion;
    $snapshot = $version->snapshot;
    $snapshot['title'] = str_repeat('📘', 5000);
    $snapshot['modules'][0]['title'] = str_repeat('📘', 5000);
    $version->update(['snapshot_data' => $snapshot]);

    $context = app(CourseAiContextService::class)->resolve($student, $lesson->id);

    expect($context['course_title'])->toBe(str_repeat('📘', 200))
        ->and($context['module_title'])->toBe(str_repeat('📘', 200))
        ->and($context['lesson_title'])->toBe(str_repeat('📘', 200));
});
