<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuizCourseAttachment extends Model
{
    protected $fillable = [
        'quiz_id',
        'course_id',
        'module_id',
        'after_lesson_id',
        'position',
        'order',
    ];

    public function quiz(): BelongsTo
    {
        return $this->belongsTo(Quiz::class);
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function module(): BelongsTo
    {
        return $this->belongsTo(CourseModule::class);
    }

    public function afterLesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class, 'after_lesson_id');
    }
}
