<?php

namespace Tests\Feature\Instructor;

use App\Models\Course;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DraftRevisionApiTest extends TestCase
{
    use RefreshDatabase;

    private User $teacher;
    private User $otherTeacher;
    private Course $course;

    protected function setUp(): void
    {
        parent::setUp();

        $teacherRole = Role::create(['name' => 'teacher', 'display_name' => 'Teacher']);
        $this->teacher = User::factory()->create();
        $this->teacher->roles()->attach($teacherRole);
        $this->otherTeacher = User::factory()->create();
        $this->otherTeacher->roles()->attach($teacherRole);

        $this->course = Course::create([
            'teacher_id' => $this->teacher->id,
            'title' => 'Original title',
            'slug' => 'original-title',
            'description' => 'Original description',
            'level' => 'beginner',
            'price' => 0,
            'status' => 'draft',
        ]);
    }

    public function test_owner_can_autosave_a_course_draft_idempotently(): void
    {
        $payload = [
            'expected_lock_version' => 1,
            'changes' => [
                'title' => 'Updated title',
                'description' => 'Updated description',
            ],
        ];

        $response = $this->actingAs($this->teacher)->withHeaders([
            'Idempotency-Key' => 'draft-revision-0001',
            'X-Correlation-ID' => '5bd32f21-681e-4f6b-90ce-bac42fcaa2ad',
        ])->putJson("/api/instructor/courses/{$this->course->id}/draft", $payload);

        $response->assertOk()
            ->assertJsonPath('data.lock_version', 2)
            ->assertJsonPath('data.idempotent', false)
            ->assertJsonPath('data.revision.revision_number', 1);

        $this->assertDatabaseHas('courses', [
            'id' => $this->course->id,
            'title' => 'Updated title',
            'lock_version' => 2,
        ]);
        $this->assertDatabaseHas('draft_revisions', [
            'revisionable_type' => Course::class,
            'revisionable_id' => $this->course->id,
            'revision_number' => 1,
            'created_by' => $this->teacher->id,
            'idempotency_key' => 'draft-revision-0001',
        ]);
        $this->assertDatabaseHas('content_audit_logs', [
            'action' => 'COURSE_DRAFT_AUTOSAVED',
            'course_id' => $this->course->id,
            'correlation_id' => '5bd32f21-681e-4f6b-90ce-bac42fcaa2ad',
        ]);

        $retry = $this->actingAs($this->teacher)->withHeaders([
            'Idempotency-Key' => 'draft-revision-0001',
        ])->putJson("/api/instructor/courses/{$this->course->id}/draft", $payload);

        $retry->assertOk()->assertJsonPath('data.idempotent', true);
        $this->assertDatabaseCount('draft_revisions', 1);
    }

    public function test_autosave_returns_conflict_when_lock_version_is_stale(): void
    {
        $this->course->update(['lock_version' => 2]);

        $response = $this->actingAs($this->teacher)->putJson("/api/instructor/courses/{$this->course->id}/draft", [
            'expected_lock_version' => 1,
            'changes' => ['title' => 'Attempted stale write'],
        ]);

        $response->assertStatus(409)
            ->assertJsonPath('errors.current_lock_version', 2);
    }

    public function test_other_teacher_cannot_read_or_write_drafts(): void
    {
        $this->actingAs($this->otherTeacher)
            ->getJson("/api/instructor/courses/{$this->course->id}/draft-revisions")
            ->assertForbidden();

        $this->actingAs($this->otherTeacher)
            ->putJson("/api/instructor/courses/{$this->course->id}/draft", [
                'expected_lock_version' => 1,
                'changes' => ['title' => 'Unauthorized edit'],
            ])
            ->assertForbidden();
    }
}
