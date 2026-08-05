<?php

namespace Tests\Feature\Instructor;

use App\Models\Course;
use App\Models\CourseModule;
use App\Models\User;
use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class InstructorPermissionTest extends TestCase
{
    use RefreshDatabase;

    protected $teacher1;
    protected $teacher2;
    protected $student;
    
    protected function setUp(): void
    {
        parent::setUp();
        
        $roleTeacher = Role::firstOrCreate(['name' => 'teacher']);
        $roleStudent = Role::firstOrCreate(['name' => 'student']);

        $this->teacher1 = User::factory()->create();
        $this->teacher1->roles()->attach($roleTeacher);

        $this->teacher2 = User::factory()->create();
        $this->teacher2->roles()->attach($roleTeacher);

        $this->student = User::factory()->create();
        $this->student->roles()->attach($roleStudent);
    }

    public function test_student_cannot_access_instructor_routes()
    {
        $response = $this->actingAs($this->student)->getJson('/api/instructor/courses');
        $response->assertStatus(403);
    }

    public function test_teacher_can_only_update_their_own_course()
    {
        $category = \App\Models\Category::create(['name' => 'Test', 'slug' => 'test']);
        $course = Course::create([
            'title' => 'Test Course',
            'slug' => 'test-course',
            'description' => 'Desc',
            'level' => 'beginner',
            'teacher_id' => $this->teacher1->id,
            'category_id' => $category->id,
            'price' => 100000,
            'status' => 'draft',
        ]);

        // Teacher 1 (owner) can update
        $response1 = $this->actingAs($this->teacher1)->putJson("/api/instructor/courses/{$course->id}", [
            'title' => 'Updated by owner'
        ]);
        $response1->assertStatus(200);

        // Teacher 2 (not owner) cannot update
        $response2 = $this->actingAs($this->teacher2)->putJson("/api/instructor/courses/{$course->id}", [
            'title' => 'Updated by other'
        ]);
        $response2->assertStatus(403);
    }
}
