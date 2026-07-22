<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LessonMedia extends Model
{
    protected $fillable = [
        'lesson_id',
        'media_type',
        'r2_key',
        'original_filename',
        'file_size',
        'mime_type',
        'duration_seconds',
        'status',
    ];

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class);
    }
}
