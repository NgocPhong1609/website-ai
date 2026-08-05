<?php

namespace Tests\Feature\Instructor;

use App\Models\Course;
use App\Models\CourseModule;
use App\Models\Lesson;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class R2UploadTest extends TestCase
{
    use RefreshDatabase;

    protected $teacher;

    protected function setUp(): void
    {
        parent::setUp();
        
        $roleTeacher = Role::firstOrCreate(['name' => 'teacher']);
        $this->teacher = User::factory()->create();
        $this->teacher->roles()->attach($roleTeacher);
    }

    public function test_teacher_can_upload_video_to_r2()
    {
        $category = \App\Models\Category::create(['name' => 'Test', 'slug' => 'test']);
        $course = Course::create([
            'title' => 'R2 Test Course',
            'slug' => 'r2-test-course',
            'description' => 'Desc',
            'level' => 'beginner',
            'teacher_id' => $this->teacher->id,
            'category_id' => $category->id,
            'price' => 100000,
            'status' => 'draft',
        ]);

        $module = CourseModule::create([
            'course_id' => $course->id,
            'title' => 'Module 1',
            'order' => 1,
        ]);

        $lesson = Lesson::create([
            'module_id' => $module->id,
            'course_id' => $course->id,
            'title' => 'Video Lesson',
            'type' => 'video',
            'order' => 1,
        ]);

        // Create a fake MP4 file
        $file = UploadedFile::fake()->create('test_video.mp4', 1024, 'video/mp4');

        $response = $this->actingAs($this->teacher)
            ->postJson("/api/instructor/lessons/{$lesson->id}/video", [
                'video' => $file
            ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('lesson_media', [
            'lesson_id' => $lesson->id,
            'media_type' => 'video',
        ]);
    }
}
