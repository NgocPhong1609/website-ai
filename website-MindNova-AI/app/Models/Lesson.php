<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Lesson extends Model
{
    protected $fillable = [
        'module_id',
        'title',
        'type',
        'content',
        'video_url',
        'duration_minutes',
        'order',
    ];

    protected $casts = [
        'duration_minutes' => 'integer',
        'order' => 'integer',
    ];

    public function module(): BelongsTo
    {
        return $this->belongsTo(CourseModule::class);
    }
}