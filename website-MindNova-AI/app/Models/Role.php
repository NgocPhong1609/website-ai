<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Role extends Model
{
    protected $fillable = [
        'name',
        'display_name',
        'description',
    ];

    /**
     * The users that belong to this role.
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'role_user');
    }

    /**
     * The permissions that belong to this role.
     */
    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class, 'permission_role');
    }

    /**
     * Check if this role has a specific permission.
     */
    public function hasPermission(string $permissionName): bool
    {
        return $this->permissions()->where('name', $permissionName)->exists();
    }

    /**
     * Resolve a role by name. Creates the row if migrate ran without db:seed.
     */
    public static function idFor(string $name): int
    {
        $defaults = [
            'admin' => [
                'display_name' => 'Quản trị viên',
                'description' => 'Quản trị toàn quyền hệ thống',
            ],
            'teacher' => [
                'display_name' => 'Giáo viên',
                'description' => 'Người tạo, quản lý khóa học và xem tiến độ học sinh',
            ],
            'student' => [
                'display_name' => 'Học sinh',
                'description' => 'Người tham gia học tập và làm quiz',
            ],
        ];

        $meta = $defaults[$name] ?? ['display_name' => $name, 'description' => null];

        return static::query()->firstOrCreate(['name' => $name], $meta)->id;
    }
}
