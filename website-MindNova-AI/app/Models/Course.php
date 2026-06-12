<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['author_id', 'title', 'description', 'status', 'is_published', 'published_at', 'metadata'])]
class Course extends Model
{
    protected $casts = [
        'is_published' => 'boolean',
        'published_at' => 'datetime',
        'metadata' => 'array',
    ];

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
