<?php

use App\Models\ContentVersion;
use App\Models\Course;
use App\Models\CourseModule;
use App\Models\Enrollment;
use App\Models\LessonAttachment;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

function createStudentAccessTeacher(): User
{
    $role = Role::firstOrCreate(['name' => 'teacher']);
    $teacher = User::factory()->create();
    $teacher->roles()->attach($role);

    return $teacher;
}

function createStudentAccessLesson(User $teacher): \App\Models\Lesson
{
    $course = Course::create([
        'teacher_id' => $teacher->id,
        'title' => 'Student attachment course',
        'slug' => 'student-attachment-course-'.uniqid(),
        'description' => 'Course used by student attachment tests.',
        'price' => 0,
        'status' => 'draft',
    ]);
    $module = CourseModule::create([
        'course_id' => $course->id,
        'title' => 'Attachment module',
        'order' => 1,
    ]);

    return \App\Models\Lesson::create([
        'course_id' => $course->id,
        'module_id' => $module->id,
        'title' => 'Attachment lesson',
        'type' => 'article',
        'order' => 1,
    ]);
}

function publishAttachmentLesson(\App\Models\Lesson $lesson, User $teacher): void
{
    $version = ContentVersion::create([
        'versionable_type' => $lesson::class,
        'versionable_id' => $lesson->id,
        'version_number' => 1,
        'snapshot_data' => ['title' => $lesson->title],
        'status' => 'published',
        'is_published' => true,
        'created_by' => $teacher->id,
    ]);
    $lesson->update([
        'status' => 'published',
        'published_version_id' => $version->id,
    ]);
}

test('enrolled student can request a signed URL for a published lesson attachment', function () {
    Storage::fake('r2');
    Storage::disk('r2')->buildTemporaryUrlsUsing(
        fn (string $path) => "https://signed.example/{$path}",
    );
    $teacher = createStudentAccessTeacher();
    $lesson = createStudentAccessLesson($teacher);
    publishAttachmentLesson($lesson, $teacher);
    $studentRole = Role::firstOrCreate(['name' => 'student']);
    $student = User::factory()->create();
    $student->roles()->attach($studentRole);
    Enrollment::create([
        'user_id' => $student->id,
        'course_id' => $lesson->course_id,
        'status' => 'enrolled',
        'enrolled_at' => now(),
    ]);
    $attachment = $lesson->attachments()->create([
        'uploaded_by' => $teacher->id,
        'display_name' => 'Workbook',
        'original_name' => 'workbook.xlsx',
        'mime_type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'extension' => 'xlsx',
        'size_bytes' => 1024,
        'r2_key' => "lessons/{$lesson->id}/attachments/workbook.xlsx",
    ]);

    $this->actingAs($student)->getJson(
        "/api/student/lessons/{$lesson->id}/attachments/{$attachment->id}/download",
    )->assertOk()->assertJsonPath(
        'data.signed_url',
        "https://signed.example/lessons/{$lesson->id}/attachments/workbook.xlsx",
    );
});

test('student attachment download requires enrollment and matching lesson', function () {
    Storage::fake('r2');
    $teacher = createStudentAccessTeacher();
    $lesson = createStudentAccessLesson($teacher);
    publishAttachmentLesson($lesson, $teacher);
    $otherLesson = createStudentAccessLesson($teacher);
    publishAttachmentLesson($otherLesson, $teacher);
    $studentRole = Role::firstOrCreate(['name' => 'student']);
    $student = User::factory()->create();
    $student->roles()->attach($studentRole);
    $attachment = $lesson->attachments()->create([
        'uploaded_by' => $teacher->id,
        'display_name' => 'Workbook',
        'original_name' => 'workbook.xlsx',
        'mime_type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'extension' => 'xlsx',
        'size_bytes' => 1024,
        'r2_key' => "lessons/{$lesson->id}/attachments/workbook.xlsx",
    ]);

    $this->actingAs($student)->getJson(
        "/api/student/lessons/{$lesson->id}/attachments/{$attachment->id}/download",
    )->assertForbidden();

    Enrollment::create([
        'user_id' => $student->id,
        'course_id' => $lesson->course_id,
        'status' => 'enrolled',
        'enrolled_at' => now(),
    ]);

    $this->actingAs($student)->getJson(
        "/api/student/lessons/{$otherLesson->id}/attachments/{$attachment->id}/download",
    )->assertNotFound();
});

test('instructor lesson response includes attachment metadata without a signed URL', function () {
    $teacher = createStudentAccessTeacher();
    $lesson = createStudentAccessLesson($teacher);
    $lesson->attachments()->create([
        'uploaded_by' => $teacher->id,
        'display_name' => 'Slides',
        'original_name' => 'slides.pptx',
        'mime_type' => 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'extension' => 'pptx',
        'size_bytes' => 2048,
        'r2_key' => "lessons/{$lesson->id}/attachments/slides.pptx",
    ]);

    $this->actingAs($teacher)->getJson("/api/instructor/lessons/{$lesson->id}")
        ->assertOk()
        ->assertJsonPath('data.attachments.0.display_name', 'Slides')
        ->assertJsonMissingPath('data.attachments.0.signed_url');
});
