<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentPaymentMethod extends Model
{
    protected $fillable = [
        'user_id',
        'provider',
        'holder_name',
        'account_number',
        'bank_name',
        'is_default',
    ];

    protected $hidden = [
        'account_number',
    ];

    protected $casts = [
        'is_default' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function last4(): string
    {
        $digits = preg_replace('/\D+/', '', (string) $this->account_number) ?: $this->account_number;

        return substr((string) $digits, -4);
    }

    public function toPublicArray(): array
    {
        return [
            'id' => $this->id,
            'provider' => $this->provider,
            'holder_name' => $this->holder_name,
            'bank_name' => $this->bank_name,
            'last4' => $this->last4(),
            'is_default' => (bool) $this->is_default,
            'label' => trim(($this->bank_name ? $this->bank_name.' ' : '').$this->holder_name.' •••• '.$this->last4()),
        ];
    }
}
