<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AiModerationFlag extends Model
{
    protected $fillable = [
        'user_id',
        'actor_type',
        'actor_key',
        'source',
        'reason',
        'input_text',
        'output_text',
        'status',
        'review_notes',
        'reviewed_by',
        'reviewed_at',
    ];

    protected $casts = [
        'reviewed_at' => 'datetime',
    ];
}
