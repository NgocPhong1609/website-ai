<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserStreak extends Model
{
    use HasFactory;

    // Các trường được phép thêm dữ liệu
    protected $fillable = [
        'user_id',
        'current_streak',
        'longest_streak',
        'freeze_count',
        'last_checkin_date',
    ];

    // Ép kiểu cho ngày tháng dễ xử lý bằng Carbon
    protected $casts = [
        'last_checkin_date' => 'date',
    ];

    // Liên kết với bảng users
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
