<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InstructorTransaction extends Model
{
    protected $fillable = [
        'instructor_id',
        'type',
        'amount',
        'status',
        'reference_type',
        'reference_id',
        'description',
        'available_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'available_at' => 'datetime',
    ];

    public function instructor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    public function reference()
    {
        return $this->morphTo();
    }
}
