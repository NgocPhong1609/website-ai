<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $table = 'payments';

    protected $fillable = [
        'user_id',
        'amount',
        'provider',
        'status',
        'transaction_id',
        'description',
        'metadata',
    ];

    // Tự động encode mảng thành JSON khi lưu và decode khi đọc
    protected $casts = [
        'metadata' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
