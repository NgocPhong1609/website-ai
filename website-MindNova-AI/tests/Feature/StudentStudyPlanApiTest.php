<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('live tutor requires authentication', function () {
    $this->postJson('/api/student/study-plan/chat', ['message' => 'Giải thích bài học'])
        ->assertUnauthorized();
});

test('live tutor validates bounded lesson and history input', function () {
    $student = User::factory()->create([
        'role' => 'student',
        'email_verified_at' => now(),
    ]);

    $this->actingAs($student, 'sanctum')->postJson('/api/student/study-plan/chat', [
        'message' => 'Giải thích bài học',
        'lesson_id' => 0,
        'history' => [
            ['sender' => 'user', 'text' => '1'],
            ['sender' => 'ai', 'text' => '2'],
            ['sender' => 'user', 'text' => '3'],
            ['sender' => 'ai', 'text' => '4'],
            ['sender' => 'user', 'text' => str_repeat('x', 2001)],
        ],
    ])->assertUnprocessable()
        ->assertJsonValidationErrors(['lesson_id', 'history', 'history.4.text']);
});

test('student can fetch study plan overview data through the api with localized content', function () {
    $student = User::factory()->create([
        'role' => 'student',
        'email_verified_at' => now(),
    ]);

    $response = $this->actingAs($student, 'sanctum')->getJson('/api/student/study-plan');

    $response->assertOk()
        ->assertJsonStructure([
            'success',
            'data' => [
                'active_syllabus',
                'core_concepts',
                'lesson_resources',
                'ai_insight',
                'initial_messages',
            ],
            'message'
        ])
        ->assertJsonFragment([
            'success' => true,
            'title' => 'Superposition (Chồng chập lượng tử)'
        ]);
});

test('student can interact with ai tutor study plan chat endpoint', function () {
    $student = User::factory()->create([
        'role' => 'student',
        'email_verified_at' => now(),
    ]);

    $response = $this->actingAs($student, 'sanctum')->postJson('/api/student/study-plan/chat', [
        'message' => 'Chào Nova, hãy giải thích về Superposition (Chồng chập lượng tử) giúp mình nhé!',
        'history' => [],
    ]);

    $response->assertOk()
        ->assertJsonStructure([
            'success',
            'data' => [
                'id',
                'sender',
                'timestamp',
                'text',
            ],
            'message'
        ])
        ->assertJson([
            'success' => true,
            'data' => [
                'sender' => 'ai',
            ]
        ]);
});

test('ai tutor chat endpoint validates required message parameter', function () {
    $student = User::factory()->create([
        'role' => 'student',
        'email_verified_at' => now(),
    ]);

    $response = $this->actingAs($student, 'sanctum')->postJson('/api/student/study-plan/chat', [
        'history' => [],
    ]);

    $response->assertStatus(422);
});

test('ai tutor responds with intelligent fallback when requested', function () {
    $student = User::factory()->create([
        'role' => 'student',
        'email_verified_at' => now(),
    ]);

    $response = $this->actingAs($student, 'sanctum')->postJson('/api/student/study-plan/chat', [
        'message' => 'Hãy giải thích về entanglement rốii lượng tử',
    ]);

    $response->assertOk();
    $responseText = $response->json('data.text');
    expect($responseText)->not->toBeEmpty();
});
