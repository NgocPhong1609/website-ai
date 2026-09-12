<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    private ?string $pendingRoleName = null;

    protected $fillable = [
        'name',
        'email',
        'password',
        'google_id',
        'avatar_url',
        'status',
        'teacher_verification_status',
        'teacher_verified_at',
        'teacher_verification_note',
        'last_login_at',
        'is_locked',
        'role',
        'onboarding_data',
        'is_onboarded',
        'notification_email',
        'weekly_report',
        'ai_suggestions',
        'payout_info',
    ];

    protected $hidden = [
        'password',
        'remember_token',
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
            'teacher_verified_at' => 'datetime',
            'is_onboarded' => 'boolean',
            'onboarding_data' => 'array',
            'notification_email' => 'boolean',
            'weekly_report' => 'boolean',
            'ai_suggestions' => 'boolean',
            'payout_info' => 'array',
        ];
    }

    // --- Các quan hệ ---
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }

    public function courses(): HasMany
    {
        return $this->hasMany(Course::class, 'teacher_id');
    }

    public function credentials(): HasMany
    {
        return $this->hasMany(TeacherCredential::class);
    }

    public function teacherCertificates(): HasMany
    {
        return $this->hasMany(TeacherCertificate::class, 'teacher_id');
    }

    public function teacherVerifications(): HasMany
    {
        return $this->hasMany(TeacherVerification::class, 'teacher_id');
    }

    public function teacherVerification(): HasOne
    {
        return $this->hasOne(TeacherVerification::class, 'teacher_id')->latestOfMany();
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    public function studentPaymentMethods(): HasMany
    {
        return $this->hasMany(StudentPaymentMethod::class);
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

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'role_user', 'user_id', 'role_id');
    }

    public function profile(): HasOne
    {
        return $this->hasOne(UserProfile::class);
    }

    public function hasRole(string $roleName): bool
    {
        $roleName = $this->normalizeRoleName($roleName) ?? strtolower(trim($roleName));
        $aliases = $this->roleAliases($roleName);

        if ($this->relationLoaded('roles')) {
            return $this->roles->contains(fn (Role $role) => in_array(strtolower((string) $role->name), $aliases, true));
        }

        return $this->roles()->whereIn('name', $aliases)->exists();
    }

    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    public function isTeacher(): bool
    {
        return $this->hasRole('teacher');
    }

    public function scopeWithRole($query, string|array $names)
    {
        $aliases = collect((array) $names)
            ->flatMap(fn (string $name) => $this->roleAliases($this->normalizeRoleName($name) ?? $name))
            ->unique()
            ->values()
            ->all();

        return $query->whereHas('roles', fn ($q) => $q->whereIn('name', $aliases));
    }

    public function getRoleAttribute(): ?string
    {
        $role = $this->relationLoaded('roles')
            ? $this->roles->pluck('name')->first()
            : $this->roles()->value('name');

        if (! is_string($role) && array_key_exists('role', $this->attributes)) {
            $role = $this->attributes['role'];
        }

        return $this->normalizeRoleName(is_string($role) ? $role : null);
    }

    public function setRoleAttribute(?string $value): void
    {
        $name = $this->normalizeRoleName($value);
        if ($name === null) {
            return;
        }

        unset($this->attributes['role']);

        if ($this->exists) {
            $this->syncNamedRole($name);

            return;
        }

        $this->pendingRoleName = $name;
    }

    protected static function booted(): void
    {
        static::saved(function (User $user): void {
            if ($user->pendingRoleName === null) {
                return;
            }

            $user->syncNamedRole($user->pendingRoleName);
            $user->pendingRoleName = null;
        });
    }

    public function syncNamedRole(string $roleName): void
    {
        $roleName = $this->normalizeRoleName($roleName) ?? $roleName;
        $this->roles()->sync([Role::idFor($roleName)]);
        $this->unsetRelation('roles');
    }

    private function normalizeRoleName(?string $value): ?string
    {
        if (! is_string($value)) {
            return null;
        }

        $role = strtolower(trim($value));
        if ($role === '') {
            return null;
        }

        if (in_array($role, ['instructor', 'lecturer'], true)) {
            return 'teacher';
        }

        return $role;
    }

    private function roleAliases(string $roleName): array
    {
        if (in_array($roleName, ['teacher', 'instructor', 'lecturer'], true)) {
            return ['teacher', 'instructor', 'lecturer'];
        }

        if (in_array($roleName, ['student', 'learner'], true)) {
            return ['student', 'learner'];
        }

        return [$roleName];
    }
}
