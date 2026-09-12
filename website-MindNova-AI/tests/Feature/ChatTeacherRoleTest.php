<?php

use App\Events\ChatMessageSent;
use App\Models\ChatConversation;
use App\Models\ChatConversationMember;
use App\Models\ChatMessage;
use App\Models\User;
use Illuminate\Support\Facades\Event;

beforeEach(function () {
    $this->teacher = User::factory()->create(['role' => ' Teacher ']);
    $this->student = User::factory()->create(['role' => 'student']);
    $this->conversation = ChatConversation::create([
        'title' => 'Course chat',
        'type' => 'group',
    ]);

    ChatConversationMember::create([
        'chat_conversation_id' => $this->conversation->id,
        'user_id' => $this->teacher->id,
    ]);
    ChatConversationMember::create([
        'chat_conversation_id' => $this->conversation->id,
        'user_id' => $this->student->id,
    ]);
});

it('includes a normalized sender role in initial messages', function () {
    ChatMessage::create([
        'chat_conversation_id' => $this->conversation->id,
        'sender_id' => $this->teacher->id,
        'content' => 'Welcome',
        'type' => 'text',
    ]);

    $this->actingAs($this->student, 'sanctum')
        ->getJson("/api/chat/conversations/{$this->conversation->id}/messages")
        ->assertOk()
        ->assertJsonPath('data.0.sender.role', 'teacher');
});

it('includes a normalized sender role in the sent message response', function () {
    Event::fake([ChatMessageSent::class]);
    $this->teacher->forceFill(['role' => ' INSTRUCTOR '])->save();

    $this->actingAs($this->teacher, 'sanctum')
        ->postJson("/api/chat/conversations/{$this->conversation->id}/messages", [
            'content' => 'Please review chapter two',
            'type' => 'text',
        ])
        ->assertOk()
        ->assertJsonPath('data.sender.role', 'instructor');
});

it('includes a normalized sender role in the recalled message response', function () {
    $message = ChatMessage::create([
        'chat_conversation_id' => $this->conversation->id,
        'sender_id' => $this->teacher->id,
        'content' => 'Old guidance',
        'type' => 'text',
    ]);

    $this->actingAs($this->teacher, 'sanctum')
        ->postJson("/api/chat/conversations/{$this->conversation->id}/messages/{$message->id}/recall")
        ->assertOk()
        ->assertJsonPath('data.sender.role', 'teacher');
});

it('includes a normalized sender role in the sent message broadcast', function () {
    $message = ChatMessage::create([
        'chat_conversation_id' => $this->conversation->id,
        'sender_id' => $this->teacher->id,
        'content' => 'Realtime guidance',
        'type' => 'text',
    ]);

    $payload = (new ChatMessageSent($message))->broadcastWith();

    expect($payload['sender'])->toBe([
        'id' => $this->teacher->id,
        'name' => $this->teacher->name,
        'avatar_url' => null,
        'role' => 'teacher',
    ]);
});
