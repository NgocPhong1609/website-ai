<?php

use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('overview requires an authenticated administrator', function () {
    $this->getJson('/api/admin/overview')->assertUnauthorized();
    $this->actingAs(User::factory()->create(['role' => 'student']), 'sanctum')
        ->getJson('/api/admin/overview')->assertForbidden();
});

test('admin can fetch dashboard overview data through the api', function () {
    $admin = User::factory()->create([
        'role' => 'admin',
        'email_verified_at' => now(),
    ]);
    User::factory()->count(2)->create();

    $response = $this->actingAs($admin, 'sanctum')->getJson('/api/admin/overview');

    $response->assertOk()
        ->assertJsonStructure([
            'hero' => ['title', 'description', 'primaryAction', 'secondaryAction'],
            'stats' => [['label', 'value', 'trend', 'note']],
            'activities' => [['label', 'value']],
            'health' => [['title', 'status', 'color']],
            'users' => [['id', 'name', 'role', 'status']],
            'quickActions' => ['0'],
        ])
        ->assertJsonPath('stats.0.value', '3')
        ->assertJsonPath('activities.6.value', 3)
        ->assertJsonMissingPath('ai_summary');
});

test('admin ai-config endpoints are removed', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $this->actingAs($admin, 'sanctum')->getJson('/api/admin/ai-config')->assertNotFound();
    $this->actingAs($admin, 'sanctum')->putJson('/api/admin/ai-config', [])->assertNotFound();
});

test('overview reports only paid revenue in the application currency', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    Order::create(['user_id' => $admin->id, 'total_amount' => 125000, 'payment_method' => 'vnpay', 'status' => 'completed']);
    Order::create(['user_id' => $admin->id, 'total_amount' => 50000, 'payment_method' => 'vnpay', 'status' => 'pending']);

    $this->actingAs($admin, 'sanctum')->getJson('/api/admin/overview')->assertOk()
        ->assertJsonPath('stats.2.value', '125.000 VNĐ')
        ->assertJsonPath('stats.2.trend', '');
});

test('overview does not invent a growth rate when the previous period has no users', function () {
    $this->actingAs(User::factory()->create(['role' => 'admin']), 'sanctum')
        ->getJson('/api/admin/overview')->assertOk()->assertJsonPath('stats.0.trend', '');
});
