<?php

namespace App\Models;

use App\Models\Notification;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name', 'email', 'password', 'google_id', 'avatar_url', 'status', 'last_login_at', 'is_locked'
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected $appends = [
        'role',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_locked' => 'boolean',
        ];
    }

    // Quan hệ với bảng Profiles
    public function profile()
    {
        return $this->hasOne(UserProfile::class);
    }

    // Quan hệ với bảng Roles (Nhiều - Nhiều)
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'role_user');
    }

    // Quan hệ với bảng Subscriptions (Một - Nhiều)
    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    // Quan hệ với bảng Payments (Một - Nhiều)
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    // Quan hệ với bảng Notifications (Một - Nhiều)
    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    // Hàm phụ trợ kiểm tra quyền nhanh
    public function hasRole($roleName)
    {
        return $this->roles()->where('name', $roleName)->exists();
    }

    // Kiểm tra xem người dùng có quyền admin không
    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    public function getRoleAttribute(): ?string
    {
        return $this->roles->pluck('name')->first();
    }
}
