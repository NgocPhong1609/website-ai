<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AiUsageLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'actor_type',
        'actor_key',
        'provider',
        'model',
        'request_id',
        'provider_request_id',
        'status',
        'error_code',
        'duration_ms',
        'fallback_used',
        'input_text',
        'output_text',
        'input_tokens',
        'output_tokens',
        'token_source',
        'cost_estimate',
        'cost_source',
        'cost_amount',
        'cost_currency',
        'system_prompt',
        'meta',
    ];

    protected $casts = [
        'meta' => 'array',
        'input_tokens' => 'integer',
        'output_tokens' => 'integer',
        'duration_ms' => 'integer',
        'fallback_used' => 'boolean',
        'cost_estimate' => 'decimal:6',
        'cost_amount' => 'decimal:6',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
