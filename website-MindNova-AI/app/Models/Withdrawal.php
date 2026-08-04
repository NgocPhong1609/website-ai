<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Withdrawal extends Model
{
    protected $fillable = [
        'instructor_id',
        'amount',
        'bank_info',
        'status',
        'admin_note',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'bank_info' => 'array',
    ];

    public function instructor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }
}
