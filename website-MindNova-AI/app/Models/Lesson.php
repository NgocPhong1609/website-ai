<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Lesson extends Model
{
    protected $fillable = [
        'module_id',
        'title',
        'type', // video, article, quiz_module
        'content',
        'video_url',
        'duration_minutes',
        'order',
        'status',
    ];

    public function module(): BelongsTo
    {
        return $this->belongsTo(CourseModule::class, 'module_id');
    }

    public function media()
    {
        return $this->hasMany(LessonMedia::class);
    }
}
