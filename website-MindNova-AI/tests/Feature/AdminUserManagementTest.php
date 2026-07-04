<?php

use App\Models\User;

test('admin users can view and create account entries from the admin panel', function () {
    $admin = User::factory()->create([
        'role' => 'admin',
        'email_verified_at' => now(),
    ]);

    $viewResponse = $this->actingAs($admin)->get('/admin/users');
    $viewResponse->assertOk();

    $createResponse = $this->actingAs($admin)->post('/admin/users', [
        'name' => 'New Client',
        'email' => 'new-client@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'role' => 'user',
        'is_locked' => false,
    ]);

    $createResponse->assertRedirect(route('admin.users.index'));
    $this->assertDatabaseHas('users', [
        'email' => 'new-client@example.com',
        'role' => 'user',
    ]);
});
