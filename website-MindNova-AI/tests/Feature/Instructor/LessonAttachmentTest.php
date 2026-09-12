<?php

use App\Models\Course;
use App\Models\CourseModule;
use App\Models\Lesson;
use App\Models\LessonAttachment;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

function createAttachmentLesson(User $teacher): Lesson
{
    $course = Course::create([
        'teacher_id' => $teacher->id,
        'title' => 'Attachment API course',
        'slug' => 'attachment-api-course-'.$teacher->id,
        'description' => 'Course used by attachment API tests.',
        'price' => 0,
        'status' => 'draft',
    ]);
    $module = CourseModule::create([
        'course_id' => $course->id,
        'title' => 'Attachment module',
        'order' => 1,
    ]);

    return Lesson::create([
        'course_id' => $course->id,
        'module_id' => $module->id,
        'title' => 'Attachment lesson',
        'type' => 'article',
        'order' => 1,
    ]);
}

function createAttachmentTeacher(): User
{
    $role = Role::firstOrCreate(['name' => 'teacher']);
    $teacher = User::factory()->create();
    $teacher->roles()->attach($role);

    return $teacher;
}

test('lesson attachment metadata is persisted and cascades with its lesson', function () {
    $teacher = User::factory()->create();
    $course = Course::create([
        'teacher_id' => $teacher->id,
        'title' => 'Attachment course',
        'slug' => 'attachment-course',
        'description' => 'Course used by the attachment schema test.',
        'price' => 0,
        'status' => 'draft',
    ]);
    $lesson = Lesson::create([
        'course_id' => $course->id,
        'title' => 'Attachment lesson',
        'type' => 'article',
        'order' => 1,
    ]);

    $attachment = $lesson->attachments()->create([
        'uploaded_by' => $teacher->id,
        'display_name' => 'Slides',
        'original_name' => 'slides.pptx',
        'mime_type' => 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'extension' => 'pptx',
        'size_bytes' => 4096,
        'r2_key' => "lessons/{$lesson->id}/attachments/file.pptx",
    ]);

    expect($attachment)->toBeInstanceOf(LessonAttachment::class)
        ->and($attachment->size_bytes)->toBe(4096)
        ->and($lesson->attachments()->count())->toBe(1);

    $lesson->delete();

    expect(LessonAttachment::query()->whereKey($attachment->id)->exists())->toBeFalse();
});

test('lesson owner can upload an allowed document to managed storage', function () {
    Storage::fake('r2');
    $teacher = createAttachmentTeacher();
    $lesson = createAttachmentLesson($teacher);

    $response = $this->actingAs($teacher)->postJson(
        "/api/instructor/lessons/{$lesson->id}/attachments",
        ['attachments' => [UploadedFile::fake()->create('slides.pdf', 128, 'application/pdf')]],
    );

    $response->assertCreated()
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.0.original_name', 'slides.pdf')
        ->assertJsonPath('data.0.extension', 'pdf');

    $attachment = LessonAttachment::query()->sole();
    Storage::disk('r2')->assertExists($attachment->r2_key);
});

test('lesson attachment upload rejects unsafe files and oversized documents', function () {
    Storage::fake('r2');
    $teacher = createAttachmentTeacher();
    $lesson = createAttachmentLesson($teacher);

    $this->actingAs($teacher)->postJson(
        "/api/instructor/lessons/{$lesson->id}/attachments",
        ['attachments' => [UploadedFile::fake()->create('payload.exe', 1, 'application/x-msdownload')]],
    )->assertUnprocessable()->assertJsonValidationErrors(['attachments.0']);

    $this->actingAs($teacher)->postJson(
        "/api/instructor/lessons/{$lesson->id}/attachments",
        ['attachments' => [UploadedFile::fake()->create('large.pdf', 25 * 1024 + 1, 'application/pdf')]],
    )->assertUnprocessable()->assertJsonValidationErrors(['attachments.0']);
});

test('another teacher cannot manage lesson attachments', function () {
    Storage::fake('r2');
    $owner = createAttachmentTeacher();
    $otherTeacher = createAttachmentTeacher();
    $lesson = createAttachmentLesson($owner);

    $this->actingAs($otherTeacher)->postJson(
        "/api/instructor/lessons/{$lesson->id}/attachments",
        ['attachments' => [UploadedFile::fake()->create('notes.pdf', 8, 'application/pdf')]],
    )->assertForbidden();
});

test('lesson owner can rename and delete a managed attachment', function () {
    Storage::fake('r2');
    $teacher = createAttachmentTeacher();
    $lesson = createAttachmentLesson($teacher);
    $key = "lessons/{$lesson->id}/attachments/document.pdf";
    Storage::disk('r2')->put($key, 'document');
    $attachment = $lesson->attachments()->create([
        'uploaded_by' => $teacher->id,
        'display_name' => 'Original name',
        'original_name' => 'document.pdf',
        'mime_type' => 'application/pdf',
        'extension' => 'pdf',
        'size_bytes' => 8,
        'r2_key' => $key,
    ]);

    $this->actingAs($teacher)->patchJson(
        "/api/instructor/lessons/{$lesson->id}/attachments/{$attachment->id}",
        ['display_name' => 'Course handout'],
    )->assertOk()->assertJsonPath('data.display_name', 'Course handout');

    $this->actingAs($teacher)->deleteJson(
        "/api/instructor/lessons/{$lesson->id}/attachments/{$attachment->id}",
    )->assertNoContent();

    expect($attachment->fresh())->toBeNull();
    Storage::disk('r2')->assertMissing($key);
});

test('lesson owner can request a signed attachment download URL', function () {
    Storage::fake('r2');
    Storage::disk('r2')->buildTemporaryUrlsUsing(
        fn (string $path) => "https://signed.example/{$path}",
    );
    $teacher = createAttachmentTeacher();
    $lesson = createAttachmentLesson($teacher);
    $attachment = $lesson->attachments()->create([
        'uploaded_by' => $teacher->id,
        'display_name' => 'Handout',
        'original_name' => 'handout.pdf',
        'mime_type' => 'application/pdf',
        'extension' => 'pdf',
        'size_bytes' => 8,
        'r2_key' => "lessons/{$lesson->id}/attachments/handout.pdf",
    ]);

    $this->actingAs($teacher)->getJson(
        "/api/instructor/lessons/{$lesson->id}/attachments/{$attachment->id}/download",
    )->assertOk()->assertJsonPath(
        'data.signed_url',
        "https://signed.example/lessons/{$lesson->id}/attachments/handout.pdf",
    );
});

test('deleting a draft lesson removes its managed attachment objects', function () {
    Storage::fake('r2');
    $teacher = createAttachmentTeacher();
    $lesson = createAttachmentLesson($teacher);
    $key = "lessons/{$lesson->id}/attachments/handout.pdf";
    Storage::disk('r2')->put($key, 'document');
    $lesson->attachments()->create([
        'uploaded_by' => $teacher->id,
        'display_name' => 'Handout',
        'original_name' => 'handout.pdf',
        'mime_type' => 'application/pdf',
        'extension' => 'pdf',
        'size_bytes' => 8,
        'r2_key' => $key,
    ]);

    app(\App\Services\Instructor\LessonService::class)->deleteLesson($lesson);

    Storage::disk('r2')->assertMissing($key);
});
