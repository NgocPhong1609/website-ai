<?php

namespace Tests\Concerns;

use App\Models\Role;
use App\Models\User;

/**
 * Provides helper methods for creating users with properly assigned roles
 * in tests. This avoids duplicate pivot entries and "roles_name_unique"
 * constraint violations caused by calling Role::create() when the
 * seed-default-roles migration has already inserted them.
 *
 * Each helper passes the desired role name through the factory `role`
 * attribute so that User::setRoleAttribute → syncNamedRole handles
 * the pivot row in a single idempotent operation.
 */
trait CreatesUsersWithRoles
{
    /**
     * Create a user with the "teacher" role via the pivot table.
     *
     * @param  array<string, mixed>  $attributes  Extra User attributes
     */
    protected function createTeacher(array $attributes = []): User
    {
        return User::factory()->create(array_merge(['role' => 'teacher'], $attributes));
    }

    /**
     * Create a user with the "student" role via the pivot table.
     *
     * @param  array<string, mixed>  $attributes  Extra User attributes
     */
    protected function createStudent(array $attributes = []): User
    {
        return User::factory()->create(array_merge(['role' => 'student'], $attributes));
    }

    /**
     * Create a user with the "admin" role via the pivot table.
     *
     * @param  array<string, mixed>  $attributes  Extra User attributes
     */
    protected function createAdmin(array $attributes = []): User
    {
        return User::factory()->create(array_merge(['role' => 'admin'], $attributes));
    }
}
