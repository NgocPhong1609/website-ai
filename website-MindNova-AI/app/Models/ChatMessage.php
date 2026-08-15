<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatMessage extends Model
{
    protected $fillable = ['chat_conversation_id', 'sender_id', 'content', 'type', 'is_recalled'];

    protected $casts = [
        'is_recalled' => 'boolean',
    ];

    public function conversation() {
        return $this->belongsTo(ChatConversation::class, 'chat_conversation_id');
    }
    
    public function sender() {
        return $this->belongsTo(User::class, 'sender_id');
    }
    
    public function attachments() {
        return $this->hasMany(ChatAttachment::class);
    }
}
