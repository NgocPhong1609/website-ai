<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class LearningRoadmap extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'goal',
        'level',
        'status',
        'generated_by',
        'estimated_total_days',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'estimated_total_days' => 'integer',
        ];
    }

    /**
     * Roadmap thuộc về 1 user.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Roadmap có nhiều courses.
     */
    public function courses(): HasMany
    {
        return $this->hasMany(RoadmapCourse::class, 'roadmap_id')
            ->orderBy('priority', 'asc');
    }
}
