<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatConversationMember extends Model
{
    protected $fillable = ['chat_conversation_id', 'user_id', 'last_read_message_id'];

    public function conversation() {
        return $this->belongsTo(ChatConversation::class, 'chat_conversation_id');
    }
    
    public function user() {
        return $this->belongsTo(User::class);
    }
}
