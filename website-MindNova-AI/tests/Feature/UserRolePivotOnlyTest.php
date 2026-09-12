<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;

uses(RefreshDatabase::class);

test('users table no longer stores a duplicate role column', function () {
    expect(Schema::hasColumn('users', 'role'))->toBeFalse();
    expect(Schema::hasColumn('users', 'deleted_at'))->toBeFalse();
});

test('factory role is stored on the roles pivot and exposed as user.role', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $teacher = User::factory()->create(['role' => ' INSTRUCTOR ']);

    expect($admin->roles()->where('name', 'admin')->exists())->toBeTrue();
    expect($admin->role)->toBe('admin');
    expect($teacher->roles()->where('name', 'teacher')->exists())->toBeTrue();
    expect($teacher->fresh()->role)->toBe('teacher');
    expect(User::query()->withRole('teacher')->whereKey($teacher->id)->exists())->toBeTrue();
});
