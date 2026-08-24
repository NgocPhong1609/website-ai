<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class ReviewComment extends Model
{
    protected $fillable = [
        'submission_id',
        'commentable_type',
        'commentable_id',
        'user_id',
        'content',
    ];

    // ─── Relationships ─────────────────────────────────────────

    public function submission(): BelongsTo
    {
        return $this->belongsTo(ReviewSubmission::class, 'submission_id');
    }

    public function commentable(): MorphTo
    {
        return $this->morphTo();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
