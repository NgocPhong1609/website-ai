<?php

namespace Tests\Feature\Instructor;

use App\Models\Course;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CourseManagementTest extends TestCase
{
    use RefreshDatabase;

    private User $teacher;
    private User $student;
    private Role $teacherRole;

    protected function setUp(): void
    {
        parent::setUp();

        // Setup Roles
        $this->teacherRole = Role::create(['name' => 'teacher', 'display_name' => 'Teacher']);
        $studentRole = Role::create(['name' => 'student', 'display_name' => 'Student']);

        // Setup Users
        $this->teacher = User::factory()->create();
        $this->teacher->roles()->attach($this->teacherRole->id);

        $this->student = User::factory()->create();
        $this->student->roles()->attach($studentRole->id);
    }

    public function test_teacher_can_create_course()
    {
        $response = $this->actingAs($this->teacher)
            ->postJson('/api/instructor/courses', [
                'title' => 'Laravel Mastery',
                'description' => 'Learn Laravel from scratch.',
                'level' => 'beginner',
                'price' => 49.99,
            ]);

        $response->assertStatus(201)
                 ->assertJsonPath('data.title', 'Laravel Mastery')
                 ->assertJsonPath('data.status', 'draft');

        $this->assertDatabaseHas('courses', [
            'title' => 'Laravel Mastery',
            'teacher_id' => $this->teacher->id,
            'status' => 'draft',
        ]);
    }

    public function test_student_cannot_create_course()
    {
        $response = $this->actingAs($this->student)
            ->postJson('/api/instructor/courses', [
                'title' => 'Hacker Course',
                'description' => 'Hack stuff',
                'level' => 'advanced',
                'price' => 0,
            ]);

        $response->assertStatus(403);
    }

    public function test_teacher_can_list_their_courses()
    {
        Course::create([
            'teacher_id' => $this->teacher->id,
            'title' => 'Course 1',
            'slug' => 'course-1',
            'description' => 'Desc 1',
            'level' => 'beginner',
            'price' => 0,
            'status' => 'draft',
        ]);

        $response = $this->actingAs($this->teacher)
            ->getJson('/api/instructor/courses');

        $response->assertStatus(200)
                 ->assertJsonCount(1, 'data');
    }

    public function test_teacher_can_update_course_status()
    {
        $course = Course::create([
            'teacher_id' => $this->teacher->id,
            'title' => 'Course to publish',
            'slug' => 'course-to-publish',
            'description' => 'Desc',
            'level' => 'beginner',
            'price' => 0,
            'status' => 'draft',
        ]);

        $response = $this->actingAs($this->teacher)
            ->patchJson("/api/instructor/courses/{$course->id}/status", [
                'status' => 'published',
            ]);

        $response->assertStatus(200)
                 ->assertJsonPath('data.status', 'published');
    }

    public function test_teacher_can_update_course_price()
    {
        $course = Course::create([
            'teacher_id' => $this->teacher->id,
            'title' => 'Priced Course',
            'slug' => 'priced-course',
            'description' => 'Desc',
            'level' => 'beginner',
            'price' => 0,
            'status' => 'draft',
        ]);

        $response = $this->actingAs($this->teacher)
            ->patchJson("/api/instructor/courses/{$course->id}/price", [
                'price' => 99.99,
            ]);

        $response->assertStatus(200)
                 ->assertJsonPath('data.price', 99.99);
    }
}
