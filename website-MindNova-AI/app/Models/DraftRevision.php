<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class DraftRevision extends Model
{
    protected $fillable = [
        'revisionable_type',
        'revisionable_id',
        'revision_number',
        'snapshot_data',
        'content_hash',
        'idempotency_key',
        'reason',
        'created_by',
        'parent_revision_id',
    ];

    protected $casts = [
        'snapshot_data' => 'array',
        'revision_number' => 'integer',
    ];

    public function revisionable(): MorphTo
    {
        return $this->morphTo();
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_revision_id');
    }
}
