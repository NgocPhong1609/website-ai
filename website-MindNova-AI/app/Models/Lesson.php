<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Lesson extends Model
{
    protected $fillable = [
        'course_id',
        'module_id',
        'title',
        'type', // video, article, quiz_module
        'content',
        'video_url',
        'duration_seconds',
        'order',
        'status',
        'published_version_id',
        'current_version',
        'lock_version',
    ];

    protected $casts = [
        'current_version' => 'integer',
        'duration_seconds' => 'integer',
        'order' => 'integer',
        'lock_version' => 'integer',
    ];

    // ─── Existing Relationships ────────────────────────────────

    public function module(): BelongsTo
    {
        return $this->belongsTo(CourseModule::class, 'module_id');
    }

    public function media()
    {
        return $this->hasMany(LessonMedia::class);
    }

    public function quiz()
    {
        return $this->hasOne(Quiz::class);
    }

    // ─── Versioning Relationships ──────────────────────────────

    /**
     * The currently published version snapshot.
     */
    public function publishedVersion(): BelongsTo
    {
        return $this->belongsTo(ContentVersion::class, 'published_version_id');
    }

    /**
     * All versions of this lesson.
     */
    public function versions(): HasMany
    {
        return $this->hasMany(ContentVersion::class, 'versionable_id')
                    ->where('versionable_type', self::class)
                    ->orderByDesc('version_number');
    }

    /** Draft snapshots are independent from immutable content-review versions. */
    public function draftRevisions(): \Illuminate\Database\Eloquent\Relations\MorphMany
    {
        return $this->morphMany(DraftRevision::class, 'revisionable')->latest('revision_number');
    }

    /**
     * All deletion requests for this lesson.
     */
    public function deletionRequests(): HasMany
    {
        return $this->hasMany(DeletionRequest::class);
    }

    // ─── Scopes ────────────────────────────────────────────────

    /**
     * Only published lessons with an approved version.
     */
    public function scopePublished($query)
    {
        return $query->where('status', 'published')
                     ->whereNotNull('published_version_id');
    }

    // ─── Helpers ───────────────────────────────────────────────

    /**
     * Whether this lesson is currently published.
     */
    public function isPublished(): bool
    {
        return $this->status === 'published' && $this->published_version_id !== null;
    }

    /**
     * Whether the parent course is published.
     */
    public function courseIsPublished(): bool
    {
        return $this->module?->course?->isPublished() ?? false;
    }

    /**
     * Get the published snapshot data.
     */
    public function getPublishedSnapshotAttribute(): ?array
    {
        if ($this->publishedVersion) {
            return $this->publishedVersion->snapshot;
        }
        return null;
    }
}
