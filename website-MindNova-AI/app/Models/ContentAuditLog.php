<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContentAuditLog extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'user_role',
        'action',
        'entity_type',
        'entity_id',
        'old_status',
        'new_status',
        'version_number',
        'metadata',
        'created_at',
        'course_id',
        'correlation_id',
    ];

    protected $casts = [
        'metadata' => 'array',
        'created_at' => 'datetime',
        'version_number' => 'integer',
    ];

    // ─── Relationships ─────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    // ─── Scopes ────────────────────────────────────────────────

    public function scopeForEntity($query, string $type, int $id)
    {
        return $query->where('entity_type', $type)->where('entity_id', $id);
    }

    public function scopeByAction($query, string $action)
    {
        return $query->where('action', $action);
    }
}
