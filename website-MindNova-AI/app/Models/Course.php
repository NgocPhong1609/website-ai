<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
    'published_version_id',
    'current_version',
];

    protected $casts = [
    'price' => 'decimal:2',
    'sale_price' => 'decimal:2',
    'sale_start_date' => 'datetime',
    'sale_end_date' => 'datetime',
    'is_flash_sale' => 'boolean',
    'admin_hidden_at' => 'datetime',
    'current_version' => 'integer',
];

    protected $appends = [
    'current_price',
    'duration_hours',
];

    // ─── Events ────────────────────────────────────────────────
    protected static function booted()
    {
        static::created(function ($course) {
            $conversation = \App\Models\ChatConversation::create([
                'course_id' => $course->id,
                'title' => $course->title,
                'type' => 'course'
            ]);

            if ($course->teacher_id) {
                \App\Models\ChatConversationMember::firstOrCreate([
                    'chat_conversation_id' => $conversation->id,
                    'user_id' => $course->teacher_id,
                ]);
            }
        });
    }

    // ─── Scopes ────────────────────────────────────────────────

    public function scopeVisibleInAdmin($query)
    {
        return $query->whereNull('admin_hidden_at');
    }

    /**
     * Only courses that have been published and approved.
     */
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    // ─── Existing Relationships ────────────────────────────────

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

    // ─── Versioning Relationships ──────────────────────────────

    /**
     * The currently published version snapshot.
     */
    public function publishedVersion(): BelongsTo
    {
        return $this->belongsTo(ContentVersion::class, 'published_version_id');
    }

    /**
     * All versions of this course.
     */
    public function versions(): HasMany
    {
        return $this->hasMany(ContentVersion::class, 'versionable_id')
                    ->where('versionable_type', self::class)
                    ->orderByDesc('version_number');
    }

    /**
     * All review submissions for this course.
     */
    public function submissions(): HasMany
    {
        return $this->hasMany(ReviewSubmission::class);
    }

    /**
     * All deletion requests for lessons in this course.
     */
    public function deletionRequests(): HasMany
    {
        return $this->hasMany(DeletionRequest::class);
    }

    // ─── Computed Attributes ───────────────────────────────────

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

    // ─── Versioning Helpers ────────────────────────────────────

    /**
     * Whether this course is currently published and has an approved version.
     */
    public function isPublished(): bool
    {
        return $this->status === 'published' && $this->published_version_id !== null;
    }

    /**
     * Whether a review submission is currently pending for this course.
     */
    public function hasPendingSubmission(): bool
    {
        return $this->submissions()
            ->whereIn('status', ['pending', 'under_review'])
            ->exists();
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
