<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class ContentVersion extends Model
{
    protected $fillable = [
        'versionable_type',
        'versionable_id',
        'version_number',
        'snapshot_data',
        'status',
        'is_published',
        'created_by',
    ];

    protected $casts = [
        'snapshot_data' => 'array',
        'is_published' => 'boolean',
        'version_number' => 'integer',
    ];

    // ─── Relationships ─────────────────────────────────────────

    public function versionable(): MorphTo
    {
        return $this->morphTo();
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // ─── Scopes ────────────────────────────────────────────────

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeForEntity($query, string $type, int $id)
    {
        return $query->where('versionable_type', $type)
                     ->where('versionable_id', $id);
    }

    public function scopeLatestVersion($query)
    {
        return $query->orderByDesc('version_number');
    }

    // ─── Helpers ───────────────────────────────────────────────

    /**
     * Get the decoded snapshot data.
     */
    public function getSnapshotAttribute(): array
    {
        return is_array($this->snapshot_data) ? $this->snapshot_data : json_decode($this->snapshot_data, true) ?? [];
    }
}
