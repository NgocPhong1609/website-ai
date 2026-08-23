<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserQuizAttempt extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'quiz_id',
        'score',
        'score_10',
        'accuracy',
        'time_taken_seconds',
        'status',
        'grading_status',
    ];

    protected $casts = [
        'score' => 'integer',
        'score_10' => 'float',
        'accuracy' => 'integer',
        'time_taken_seconds' => 'integer',
        'created_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function quiz(): BelongsTo
    {
        return $this->belongsTo(Quiz::class);
    }

    public function answers(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(UserQuizAttemptAnswer::class, 'user_quiz_attempt_id');
    }
}
