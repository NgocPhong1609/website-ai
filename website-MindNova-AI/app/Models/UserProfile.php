<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'learning_goal',
        'skill_level',
        'bio',
        'phone',
        'address'
    ];

    // Quan hệ ngược lại: Mỗi Profile thuộc về 1 User
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
