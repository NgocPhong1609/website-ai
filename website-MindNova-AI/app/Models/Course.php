<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Course extends Model
{
    protected $fillable = [
        'teacher_id',
        'category_id',
        'title',
        'slug',
        'description',
        'thumbnail',
        'price',
        'level',
        'status',
        'views_count',
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    // Alias to keep compatibility with old code paths that still call author().
    public function author(): BelongsTo
    {
        return $this->teacher();
    }

    public function modules(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(CourseModule::class)->orderBy('order');
    }

    public function enrollments(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Enrollment::class);
    }

    public function classes(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(CourseClass::class);
    }

    public function getTotalLessonsAttribute(): int
    {
        return \App\Models\Lesson::whereIn('module_id', $this->modules()->select('id'))->count();
    }

    public function getDurationHoursAttribute(): float
    {
        $totalSeconds = \App\Models\Lesson::whereIn('module_id', $this->modules()->select('id'))->sum('duration_seconds');
        return round($totalSeconds / 3600, 1);
    }
}
