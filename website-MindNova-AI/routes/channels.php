<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Chat Conversation Channel Authorization
Broadcast::channel('chat.conversation.{conversationId}', function ($user, $conversationId) {
    // Only members of the conversation can listen
    return \App\Models\ChatConversationMember::where('chat_conversation_id', $conversationId)
        ->where('user_id', $user->id)
        ->exists();
});
