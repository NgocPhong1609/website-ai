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
    'admin_hidden_at',
    'views_count',
    'sale_price',
    'sale_start_date',
    'sale_end_date',
    'is_flash_sale',
];

    protected $casts = [
    'price' => 'decimal:2',
    'sale_price' => 'decimal:2',
    'sale_start_date' => 'datetime',
    'sale_end_date' => 'datetime',
    'is_flash_sale' => 'boolean',
    'admin_hidden_at' => 'datetime',
];

    protected $appends = [
    'current_price',
];

    public function scopeVisibleInAdmin($query)
    {
        return $query->whereNull('admin_hidden_at');
    }

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

    public function getCurrentPriceAttribute()
    {
        if ($this->is_flash_sale && $this->sale_price > 0 && now()->between($this->sale_start_date, $this->sale_end_date)) {
            return (float) $this->sale_price;
        }
        return (float) $this->price;
    }
}
