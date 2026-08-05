<?php

namespace Tests\Feature\Student;

use App\Models\User;
use App\Models\Role;
use App\Models\AiTutorConversation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Services\Ai\MockAiService;

class AiTutorTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Setup mock service binding
        $this->app->bind(\App\Services\Ai\MockAiService::class, function () {
            return new MockAiService();
        });
    }

    public function test_student_can_chat_with_ai_tutor()
    {
        $roleStudent = Role::firstOrCreate(['name' => 'student']);
        $student = User::factory()->create();
        $student->roles()->attach($roleStudent);

        $response = $this->actingAs($student)
            ->postJson('/api/student/ai-tutor/chat', [
                'message' => 'Hello AI, can you help me?'
            ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'conversation_id'
            ]);

        // Check if conversation was created
        $this->assertDatabaseHas('ai_tutor_conversations', [
            'user_id' => $student->id
        ]);

        // Check if messages were stored
        $conversationId = $response->json('conversation_id');
        
        $this->assertDatabaseHas('ai_tutor_messages', [
            'conversation_id' => $conversationId,
            'sender' => 'user',
            'message' => 'Hello AI, can you help me?'
        ]);

        $this->assertDatabaseHas('ai_tutor_messages', [
            'conversation_id' => $conversationId,
            'sender' => 'ai'
        ]);

        // Check usage log
        $this->assertDatabaseHas('ai_usage_logs', [
            'user_id' => $student->id,
            'provider' => 'mock_ai',
            'feature' => 'tutor'
        ]);
    }
}
