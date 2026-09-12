<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AiDailyQuotaUsage extends Model
{
    protected $fillable = ['user_id', 'feature', 'usage_date', 'used'];

    protected $casts = [
        'usage_date' => 'date',
        'used' => 'integer',
    ];
}
