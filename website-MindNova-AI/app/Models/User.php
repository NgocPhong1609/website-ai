<?php

namespace App\Models;

use App\Models\Notification;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'email', 'password', 'google_id', 'avatar_url', 'status'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
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

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    public function activityLogs(): HasMany
    {
        return $this->hasMany(ActivityLog::class);
    }

    public function adminLogs(): HasMany
    {
        return $this->hasMany(AdminLog::class, 'admin_id');
    }

    public function roles(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
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
        return $this->roles()->where('name', 'teacher')->exists();
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
