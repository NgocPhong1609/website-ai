<?php

namespace Tests\Feature\Instructor;

use App\Models\Course;
use App\Models\CourseModule;
use App\Models\Lesson;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ModuleAndLessonManagementTest extends TestCase
{
    use RefreshDatabase;

    private User $teacher;
    private Course $course;

    protected function setUp(): void
    {
        parent::setUp();

        $role = Role::create(['name' => 'teacher', 'display_name' => 'Teacher']);
        $this->teacher = User::factory()->create();
        $this->teacher->roles()->attach($role->id);

        $this->course = Course::create([
            'teacher_id' => $this->teacher->id,
            'title' => 'Test Course',
            'slug' => 'test-course',
            'description' => 'A test course',
            'level' => 'beginner',
            'price' => 0,
            'status' => 'draft',
        ]);
    }

    public function test_teacher_can_create_module()
    {
        $response = $this->actingAs($this->teacher)
            ->postJson("/api/instructor/courses/{$this->course->id}/modules", [
                'title' => 'Module 1',
                'order' => 1,
            ]);

        $response->assertStatus(201)
                 ->assertJsonPath('data.title', 'Module 1');

        $this->assertDatabaseHas('course_modules', [
            'course_id' => $this->course->id,
            'title' => 'Module 1',
        ]);
    }

    public function test_teacher_can_create_lesson()
    {
        $module = CourseModule::create([
            'course_id' => $this->course->id,
            'title' => 'Module 1',
            'order' => 1,
        ]);

        $response = $this->actingAs($this->teacher)
            ->postJson("/api/instructor/modules/{$module->id}/lessons", [
                'title' => 'Lesson 1',
                'type' => 'video',
                'content' => 'Some content',
                'order' => 1,
                'duration_minutes' => 10,
            ]);

        $response->assertStatus(201)
                 ->assertJsonPath('data.title', 'Lesson 1');

        $this->assertDatabaseHas('lessons', [
            'module_id' => $module->id,
            'title' => 'Lesson 1',
        ]);
    }

    public function test_teacher_can_upload_video()
    {
        Storage::fake('public');

        $module = CourseModule::create([
            'course_id' => $this->course->id,
            'title' => 'Module 1',
            'order' => 1,
        ]);

        $lesson = Lesson::create([
            'module_id' => $module->id,
            'title' => 'Lesson 1',
            'type' => 'video',
            'order' => 1,
        ]);

        $file = UploadedFile::fake()->create('video.mp4', 1000, 'video/mp4');

        $response = $this->actingAs($this->teacher)
            ->postJson("/api/instructor/lessons/{$lesson->id}/video", [
                'video' => $file,
            ]);

        $response->assertStatus(200);
        $this->assertNotNull($response->json('data.video_url'));
    }
}
