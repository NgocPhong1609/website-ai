<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PasswordOtp extends Model
{
    use HasFactory;

    protected $fillable = [
        'email',
        'otp_hash',
        'type',
        'expires_at',
        'verified_at',
        'attempts'
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'verified_at' => 'datetime',
        'attempts' => 'integer',
    ];
}
