<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ReviewSubmission extends Model
{
    protected $fillable = [
        'course_id',
        'course_version_id',
        'submitted_by',
        'submitted_at',
        'status',
        'reviewed_by',
        'reviewed_at',
        'review_feedback',
        'stale_at',
        'metadata',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'reviewed_at' => 'datetime',
        'stale_at' => 'datetime',
        'metadata' => 'array',
    ];

    // ─── Relationships ─────────────────────────────────────────

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function courseVersion(): BelongsTo
    {
        return $this->belongsTo(ContentVersion::class, 'course_version_id');
    }

    public function submittedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'submitted_by');
    }

    public function reviewedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function items(): HasMany
    {
        return $this->hasMany(ReviewSubmissionItem::class, 'submission_id');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(ReviewComment::class, 'submission_id');
    }

    // ─── Scopes ────────────────────────────────────────────────

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeUnderReview($query)
    {
        return $query->where('status', 'under_review');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    public function scopeNeedsFixes($query)
    {
        return $query->where('status', 'needs_fixes');
    }

    // ─── Helpers ───────────────────────────────────────────────

    public function isStale(): bool
    {
        return $this->stale_at !== null;
    }

    public function isPending(): bool
    {
        return in_array($this->status, ['pending', 'under_review']);
    }
}
