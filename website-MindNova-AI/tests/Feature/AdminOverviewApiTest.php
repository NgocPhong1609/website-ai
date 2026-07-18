<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('admin can fetch dashboard overview data through the api', function () {
    $admin = User::factory()->create([
        'email_verified_at' => now(),
    ]);

    $admin->roles()->sync([1]);

    $response = $this->actingAs($admin, 'sanctum')->getJson('/api/admin/overview');

    $response->assertOk()
        ->assertJsonStructure([
            'hero' => ['title', 'description', 'primaryAction', 'secondaryAction'],
            'stats' => [['label', 'value', 'trend', 'note']],
            'activities' => [['label', 'value']],
            'health' => [['title', 'status', 'color']],
            'users' => [['name', 'role', 'status']],
            'quickActions' => ['0'],
        ]);
});
