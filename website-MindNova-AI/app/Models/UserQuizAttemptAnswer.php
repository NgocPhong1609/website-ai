<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserQuizAttemptAnswer extends Model
{
    protected $fillable = [
        'user_quiz_attempt_id',
        'question_id',
        'question_type',
        'user_answer',
        'is_correct',
        'score',
        'max_score',
        'feedback',
        'ai_analysis',
        'grading_status',
    ];

    protected $casts = [
        'is_correct' => 'boolean',
        'score' => 'float',
        'max_score' => 'float',
        'ai_analysis' => 'array',
    ];

    public function attempt(): BelongsTo
    {
        return $this->belongsTo(UserQuizAttempt::class, 'user_quiz_attempt_id');
    }

    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class, 'question_id');
    }
}
