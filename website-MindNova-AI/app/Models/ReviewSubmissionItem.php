<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReviewSubmissionItem extends Model
{
    protected $fillable = [
        'submission_id',
        'lesson_id',
        'lesson_version_id',
        'change_type',
    ];

    // ─── Relationships ─────────────────────────────────────────

    public function submission(): BelongsTo
    {
        return $this->belongsTo(ReviewSubmission::class, 'submission_id');
    }

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class);
    }

    public function lessonVersion(): BelongsTo
    {
        return $this->belongsTo(ContentVersion::class, 'lesson_version_id');
    }
}
