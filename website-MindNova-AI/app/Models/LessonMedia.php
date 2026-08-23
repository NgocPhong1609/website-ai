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
        'is_temp',
        'uploaded_by',
        'upload_id',
        'idempotency_key',
        'attempts',
        'last_error',
        'processing_started_at',
        'ready_at',
        'expires_at',
    ];

    protected $casts = [
        'is_temp' => 'boolean',
        'attempts' => 'integer',
        'processing_started_at' => 'datetime',
        'ready_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class);
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
