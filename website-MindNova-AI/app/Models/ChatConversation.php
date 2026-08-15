<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatConversation extends Model
{
    protected $fillable = ['course_id', 'title', 'type'];

    public function course() {
        return $this->belongsTo(Course::class);
    }
    
    public function members() {
        return $this->hasMany(ChatConversationMember::class);
    }
    
    public function messages() {
        return $this->hasMany(ChatMessage::class);
    }
}
