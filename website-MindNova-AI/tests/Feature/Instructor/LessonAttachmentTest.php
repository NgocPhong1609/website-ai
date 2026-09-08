<?php

use App\Models\Course;
use App\Models\Lesson;
use App\Models\LessonAttachment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

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
