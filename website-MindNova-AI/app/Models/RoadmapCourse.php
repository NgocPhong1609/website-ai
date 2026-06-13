<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RoadmapCourse extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'roadmap_id',
        'course_id',
        'priority',
        'reason',
        'estimated_days',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'course_id' => 'integer',
            'priority' => 'integer',
            'estimated_days' => 'integer',
        ];
    }

    /**
     * Course thuộc về 1 roadmap.
     */
    public function roadmap(): BelongsTo
    {
        return $this->belongsTo(LearningRoadmap::class, 'roadmap_id');
    }
}
