<?php

use App\Models\ContentVersion;
use App\Models\Course;
use App\Models\Quiz;
use App\Models\ReviewSubmission;
use App\Models\User;

beforeEach(function () {
    $this->teacher = User::factory()->create(['role' => 'teacher']);
    $this->admin = User::factory()->create(['role' => 'admin']);
    $this->course = Course::create([
        'teacher_id' => $this->teacher->id,
        'title' => 'Khóa học đủ nội dung',
        'slug' => 'publication-quiz-check',
        'description' => str_repeat('Mô tả nội dung khóa học. ', 3),
        'thumbnail' => 'https://example.test/cover.jpg',
        'price' => 0,
        'status' => 'draft',
    ]);
    $module = $this->course->modules()->create(['title' => 'Chương 1', 'order' => 1]);
    $module->lessons()->create([
        'course_id' => $this->course->id, 'title' => 'Bài học',
        'type' => 'article', 'content' => 'Nội dung bài học.', 'order' => 1,
    ]);
    foreach (['capability_assessment', 'end_of_course'] as $position) {
        $quiz = Quiz::create(['instructor_id' => $this->teacher->id, 'title' => $position]);
        $quiz->questions()->create(['type' => 'essay', 'content' => 'Trình bày kiến thức đã học.', 'points' => 10, 'order' => 1]);
        $quiz->attachments()->create(['course_id' => $this->course->id, 'position' => $position, 'is_active' => true]);
    }
    $this->actingAs($this->teacher, 'sanctum');
});

test('missing or unusable required quiz blocks health and review submission', function (string $position, string $problem) {
    $attachment = $this->course->quizAttachments()->where('position', $position)->firstOrFail();
    match ($problem) {
        'missing' => $attachment->delete(),
        'inactive' => $attachment->update(['is_active' => false]),
        'empty' => $attachment->quiz->questions()->delete(),
    };

    $health = $this->getJson("/api/instructor/courses/{$this->course->id}/health")
        ->assertOk()->assertJsonPath('data.can_submit', false)->assertJsonPath('data.status', 'blocked');
    expect(collect($health->json('data.issues'))->firstWhere('field', 'course.'.$position)['severity'])->toBe('error');
    $this->postJson("/api/instructor/courses/{$this->course->id}/submit-review")->assertUnprocessable();
    expect($this->course->fresh()->status)->toBe('draft');
    expect(ReviewSubmission::count())->toBe(0);
    expect(ContentVersion::count())->toBe(0);
})->with(['capability_assessment', 'end_of_course'])->with(['missing', 'inactive', 'empty']);

test('both selected quizzes allow review and publication', function () {
    $this->getJson("/api/instructor/courses/{$this->course->id}/health")
        ->assertOk()->assertJsonPath('data.can_submit', true);
    $submissionId = $this->postJson("/api/instructor/courses/{$this->course->id}/submit-review")
        ->assertCreated()->json('data.submission_id');
    $this->actingAs($this->admin, 'sanctum')
        ->patchJson("/api/admin/reviews/{$submissionId}/approve")->assertOk();
    expect($this->course->fresh()->status)->toBe('published');
    expect($this->course->fresh()->published_version_id)->not->toBeNull();
});

test('approval rechecks quizzes on an already submitted course', function (string $position) {
    $submissionId = $this->postJson("/api/instructor/courses/{$this->course->id}/submit-review")
        ->assertCreated()->json('data.submission_id');
    $this->course->quizAttachments()->where('position', $position)->delete();

    $this->actingAs($this->admin, 'sanctum')
        ->patchJson("/api/admin/reviews/{$submissionId}/approve")->assertUnprocessable();
    expect($this->course->fresh()->status)->toBe('pending_review');
    expect($this->course->fresh()->published_version_id)->toBeNull();
    expect(ReviewSubmission::findOrFail($submissionId)->status)->toBe('pending');
    expect(ContentVersion::where('is_published', true)->count())->toBe(0);
})->with(['capability_assessment', 'end_of_course']);
