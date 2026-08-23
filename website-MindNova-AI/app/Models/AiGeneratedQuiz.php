<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AiGeneratedQuiz extends Model
{
    protected $table = 'ai_generated_quizzes';

    protected $fillable = [
        'user_id',
        'title',
        'topic',
        'difficulty',
        'questions_count',
        'time_limit_minutes',
        'passing_percentage',
        'description',
        'questions_data',
        'user_answers',
        'score',
        'correct_count',
        'is_completed',
    ];

    protected $casts = [
        'questions_data' => 'array',
        'user_answers' => 'array',
        'is_completed' => 'boolean',
        'score' => 'integer',
        'correct_count' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
