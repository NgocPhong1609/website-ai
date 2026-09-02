<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RevenueAllocation extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'order_item_id',
        'course_id',
        'student_id',
        'instructor_id',
        'original_price',
        'discount_amount',
        'paid_amount',
        'platform_fee_percent',
        'platform_fee_amount',
        'instructor_percent',
        'instructor_amount',
        'status',
        'refund_deadline',
        'unlocked_at',
        'refunded_at',
    ];

    protected $casts = [
        'original_price' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'platform_fee_percent' => 'decimal:2',
        'platform_fee_amount' => 'decimal:2',
        'instructor_percent' => 'decimal:2',
        'instructor_amount' => 'decimal:2',
        'refund_deadline' => 'datetime',
        'unlocked_at' => 'datetime',
        'refunded_at' => 'datetime',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function orderItem(): BelongsTo
    {
        return $this->belongsTo(OrderItem::class);
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function instructor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }
}
