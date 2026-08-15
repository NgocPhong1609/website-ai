<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Enrollment extends Model
{
    protected $fillable = [
        'user_id',
        'course_id',
        'progress_percentage',
        'enrolled_at',
        'course_class_id',
        'status',
    ];

    public $timestamps = false;

    protected $casts = [
        'enrolled_at' => 'datetime',
        'progress_percentage' => 'integer',
    ];

    protected static function booted()
    {
        static::created(function ($enrollment) {
            $conversation = \App\Models\ChatConversation::where('course_id', $enrollment->course_id)->first();
            if ($conversation) {
                \App\Models\ChatConversationMember::firstOrCreate([
                    'chat_conversation_id' => $conversation->id,
                    'user_id' => $enrollment->user_id
                ], [
                    'joined_at' => now(),
                ]);
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function courseClass(): BelongsTo
    {
        return $this->belongsTo(CourseClass::class);
    }
}
