<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AiTutorMessage extends Model
{
    use HasFactory;

    const UPDATED_AT = null;

    protected $fillable = [
        'conversation_id',
        'sender',
        'message',
    ];

    public function conversation(): BelongsTo
    {
        return $this->belongsTo(AiTutorConversation::class, 'conversation_id');
    }
}
