<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AiUsageLog extends Model
{
    protected $fillable = [
        'user_id',
        'actor_type',
        'actor_key',
        'provider',
        'model',
        'input_text',
        'output_text',
        'input_tokens',
        'output_tokens',
        'cost_estimate',
        'system_prompt',
        'meta',
    ];

    protected $casts = [
        'meta' => 'array',
        'cost_estimate' => 'decimal:6',
    ];
}
