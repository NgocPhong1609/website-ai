<?php

use App\Models\Role;
use App\Models\User;

test('api register creates a student even when roles were never seeded with fixed ids', function () {
    Role::query()->delete();

    $response = $this->postJson('/api/register', [
        'name' => 'Hoc Vien Moi',
        'email' => 'new.student@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
        'role' => 'student',
    ]);

    $response->assertCreated();

    $user = User::where('email', 'new.student@example.com')->first();
    expect($user)->not->toBeNull();
    expect($user->roles()->where('name', 'student')->exists())->toBeTrue();
});

test('api register creates a teacher role by name not by hardcoded id', function () {
    Role::query()->delete();

    $response = $this->postJson('/api/register', [
        'name' => 'Giao Vien Moi',
        'email' => 'new.teacher@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
        'role' => 'teacher',
    ]);

    $response->assertCreated();

    $user = User::where('email', 'new.teacher@example.com')->first();
    expect($user->roles()->where('name', 'teacher')->exists())->toBeTrue();
});
