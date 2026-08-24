<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['user_id', 'type', 'title', 'body', 'is_read', 'metadata'])]
class Notification extends Model
{
    protected $casts = [
        'is_read' => 'boolean',
        'metadata' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    protected static function booted()
    {
        static::created(function ($notification) {
            $count = static::where('user_id', $notification->user_id)->count();
            if ($count > 50) {
                $excess = $count - 50;
                $oldestIds = static::where('user_id', $notification->user_id)
                    ->orderBy('id', 'asc')
                    ->limit($excess)
                    ->pluck('id');
                static::whereIn('id', $oldestIds)->delete();
            }
        });
    }
}
