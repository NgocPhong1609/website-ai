<?php

use App\Models\Course;
use App\Models\CourseModule;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\LessonCompletion;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;

uses(RefreshDatabase::class);

function publishedLesson(string $type = 'video', int $durationSeconds = 600): Lesson
{
    $teacher = User::factory()->create();
    $course = Course::create([
        'teacher_id' => $teacher->id,
        'title' => 'Timing course',
        'slug' => 'timing-course-'.uniqid(),
        'description' => 'Course used by lesson completion timing tests.',
        'price' => 0,
        'status' => 'published',
    ]);
    $module = CourseModule::create(['course_id' => $course->id, 'title' => 'Module', 'order' => 1]);
    $lesson = Lesson::create([
        'course_id' => $course->id,
        'module_id' => $module->id,
        'title' => 'Timed lesson',
        'type' => $type,
        'duration_seconds' => $durationSeconds,
        'order' => 1,
        'status' => 'published',
    ]);
    $versionId = DB::table('content_versions')->insertGetId([
        'versionable_type' => Lesson::class,
        'versionable_id' => $lesson->id,
        'version_number' => 1,
        'snapshot_data' => json_encode([]),
        'status' => 'published',
        'is_published' => true,
        'created_at' => now(),
        'updated_at' => now(),
    ]);
    $lesson->forceFill(['published_version_id' => $versionId])->save();

    return $lesson->fresh();
}

function enrolledStudent(Lesson $lesson): User
{
    $student = User::factory()->create();
    Enrollment::create([
        'user_id' => $student->id,
        'course_id' => $lesson->course_id,
        'status' => 'enrolled',
        'progress_percentage' => 0,
        'enrolled_at' => now(),
    ]);

    return $student;
}

test('a video cannot be completed right after opening it, even with a fake playback position', function () {
    $lesson = publishedLesson('video', 600);
    $student = enrolledStudent($lesson);

    $this->actingAs($student, 'sanctum')->postJson("/api/student/lessons/{$lesson->id}/start")
        ->assertOk()
        ->assertJsonPath('data.required_seconds', 300);

    $this->actingAs($student, 'sanctum')
        ->postJson("/api/student/lessons/{$lesson->id}/complete", ['playback_position' => 600])
        ->assertStatus(422)
        ->assertJsonPath('errors.required_seconds', 300);

    expect(LessonCompletion::where('user_id', $student->id)->count())->toBe(0);
});

test('completion without a recorded start is rejected', function () {
    $lesson = publishedLesson('video', 600);
    $student = enrolledStudent($lesson);

    $this->actingAs($student, 'sanctum')
        ->postJson("/api/student/lessons/{$lesson->id}/complete", ['playback_position' => 600])
        ->assertStatus(422);
});

test('a video can be completed once enough real time has passed', function () {
    $lesson = publishedLesson('video', 600);
    $student = enrolledStudent($lesson);

    $this->actingAs($student, 'sanctum')->postJson("/api/student/lessons/{$lesson->id}/start")->assertOk();
    $this->travel(301)->seconds();

    $this->actingAs($student, 'sanctum')
        ->postJson("/api/student/lessons/{$lesson->id}/complete", ['playback_position' => 600])
        ->assertOk();

    expect(LessonCompletion::where('user_id', $student->id)->where('lesson_id', $lesson->id)->exists())->toBeTrue();
});

test('reopening a lesson keeps the original start time', function () {
    $lesson = publishedLesson('article', 300);
    $student = enrolledStudent($lesson);

    $first = $this->actingAs($student, 'sanctum')->postJson("/api/student/lessons/{$lesson->id}/start")->json('data.started_at');
    $this->travel(60)->seconds();
    $second = $this->actingAs($student, 'sanctum')->postJson("/api/student/lessons/{$lesson->id}/start")->json('data.started_at');

    expect($second)->toBe($first);
});

test('students who are not enrolled cannot start a lesson', function () {
    $lesson = publishedLesson('video', 600);
    $outsider = User::factory()->create();

    $this->actingAs($outsider, 'sanctum')
        ->postJson("/api/student/lessons/{$lesson->id}/start")
        ->assertForbidden();
});
