<?php

namespace Tests\Feature\Instructor;

use App\Models\Course;
use App\Models\Discussion;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\Role;
use App\Models\User;
use App\Models\CourseModule;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StudentManagementTest extends TestCase
{
    use RefreshDatabase;

    private User $teacher;
    private User $student;
    private Course $course;

    protected function setUp(): void
    {
        parent::setUp();

        $role = Role::create(['name' => 'teacher']);
        $this->teacher = User::factory()->create();
        $this->teacher->roles()->attach($role->id);

        $studentRole = Role::create(['name' => 'student']);
        $this->student = User::factory()->create();
        $this->student->roles()->attach($studentRole->id);

        $this->course = Course::create([
            'teacher_id' => $this->teacher->id,
            'title' => 'Test Course',
            'slug' => 'test-course',
            'description' => 'A test course',
            'level' => 'beginner',
            'price' => 0,
            'status' => 'published',
        ]);

        Enrollment::create([
            'user_id' => $this->student->id,
            'course_id' => $this->course->id,
            'progress_percentage' => 50,
            'enrolled_at' => now(),
        ]);
    }

    public function test_teacher_can_list_students()
    {
        $response = $this->actingAs($this->teacher)
            ->getJson('/api/instructor/students');

        $response->assertStatus(200)
                 ->assertJsonPath('data.0.id', $this->student->id);
    }

    public function test_teacher_can_view_student_progress()
    {
        $response = $this->actingAs($this->teacher)
            ->getJson("/api/instructor/students/{$this->student->id}/progress?course_id={$this->course->id}");

        $response->assertStatus(200)
                 ->assertJsonPath('data.progress_percentage', 50);
    }

    public function test_teacher_can_reply_to_discussion()
    {
        $module = CourseModule::create(['course_id' => $this->course->id, 'title' => 'M1']);
        $lesson = Lesson::create(['module_id' => $module->id, 'title' => 'L1', 'type' => 'video']);
        $discussion = Discussion::create([
            'lesson_id' => $lesson->id,
            'student_id' => $this->student->id,
            'title' => 'Help',
            'content' => 'I need help',
        ]);

        $response = $this->actingAs($this->teacher)
            ->postJson("/api/instructor/discussions/{$discussion->id}/replies", [
                'content' => 'Here is the answer.',
            ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('discussion_replies', [
            'discussion_id' => $discussion->id,
            'content' => 'Here is the answer.',
        ]);
        $this->assertDatabaseHas('discussions', [
            'id' => $discussion->id,
            'status' => 'answered',
        ]);
    }
}
