<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Quiz extends Model
{
    protected $fillable = [
        'instructor_id',
        'lesson_id',
        'title',
        'description',
        'source_type',
        'source_content',
        'difficulty',
        'total_questions',
        'mc_questions_count',
        'essay_questions_count',
        'time_limit_minutes',
        'passing_score',
        'total_points',
        'status',
    ];

    protected $casts = [
        'time_limit_minutes' => 'integer',
        'passing_score' => 'integer',
        'total_questions' => 'integer',
        'mc_questions_count' => 'integer',
        'essay_questions_count' => 'integer',
        'total_points' => 'float',
    ];

    public function instructor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class);
    }

    public function questions(): HasMany
    {
        return $this->hasMany(Question::class)->orderBy('order');
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(QuizCourseAttachment::class);
    }
}
