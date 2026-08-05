<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AiUsageLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'provider',
        'model',
        'feature',
        'prompt_tokens',
        'completion_tokens',
        'total_tokens',
        'estimated_cost',
        'request_payload',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
