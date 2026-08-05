<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TeacherPayout extends Model
{
    protected $fillable = [
        'order_id',
        'course_id',
        'teacher_id',
        'student_id',
        'gross_amount',
        'teacher_amount',
        'admin_share_amount',
        'commission_rate',
        'status',
        'paid_at',
        'metadata',
    ];

    protected $casts = [
        'gross_amount' => 'decimal:2',
        'teacher_amount' => 'decimal:2',
        'admin_share_amount' => 'decimal:2',
        'commission_rate' => 'decimal:2',
        'metadata' => 'array',
        'paid_at' => 'datetime',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }
}
