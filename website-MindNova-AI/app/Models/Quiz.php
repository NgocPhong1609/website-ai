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
        'thumbnail_url',
        'thumbnail_r2_key',
        'source_type',
        'source_content',
        'type', // normal, capability_assessment
        'credits', // 1 for normal, 3 for capability_assessment
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
        'credits' => 'integer',
        'time_limit_minutes' => 'integer',
        'passing_score' => 'integer',
        'total_questions' => 'integer',
        'mc_questions_count' => 'integer',
        'essay_questions_count' => 'integer',
        'total_points' => 'float',
    ];

    public function getCreditsAttribute(): int
    {
        if ($this->attributes['type'] ?? '' === 'capability_assessment') {
            return 3;
        }
        if ($this->relationLoaded('attachments') && $this->attachments->contains('position', 'capability_assessment')) {
            return 3;
        }
        return (int) ($this->attributes['credits'] ?? 1);
    }

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

    /**
     * Check if the quiz is owned by the given user — either directly
     * via instructor_id, or indirectly because the quiz is attached
     * to (or placed inside a lesson of) one of the user's courses.
     *
     * This mirrors the same ownership logic used by
     * QuizService::getInstructorQuizzes().
     */
    public function isOwnedBy(User $user): bool
    {
        if ((int) $this->instructor_id === (int) $user->id) {
            return true;
        }

        $courseIds = \App\Models\Course::where('teacher_id', $user->id)->pluck('id');

        if ($courseIds->isEmpty()) {
            return false;
        }

        // Quiz attached to one of the instructor's courses
        if ($this->attachments()->whereIn('course_id', $courseIds)->exists()) {
            return true;
        }

        // Quiz inside a lesson that belongs to one of the instructor's courses
        if ($this->lesson_id) {
            $lesson = $this->lesson;
            if ($lesson) {
                $lessonCourseId = $lesson->course_id
                    ?? optional($lesson->module)->course_id;
                if ($lessonCourseId && $courseIds->contains($lessonCourseId)) {
                    return true;
                }
            }
        }

        return false;
    }
}
