<?php

use App\Models\AdminSetting;
use App\Models\AiUsageLog;
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
    config()->set('services.gemini.api_key', 'overview-primary-secret');
    config()->set('services.backup_ai.api_key', 'overview-backup-secret');
    AiUsageLog::create([
        'actor_type' => 'system', 'actor_key' => 'system', 'provider' => 'gemini',
        'status' => 'success', 'input_tokens' => 12, 'output_tokens' => 8,
        'token_source' => 'provider', 'input_text' => 'private-question',
        'output_text' => 'private-response', 'system_prompt' => 'private-prompt',
    ]);

    $response = $this->actingAs($admin, 'sanctum')->getJson('/api/admin/overview');

    $response->assertOk()
        ->assertJsonStructure([
            'hero' => ['title', 'description', 'primaryAction', 'secondaryAction'],
            'stats' => [['label', 'value', 'trend', 'note']],
            'activities' => [['label', 'value']],
            'health' => [['title', 'status', 'color']],
            'users' => [['id', 'name', 'role', 'status']],
            'quickActions' => ['0'],
            'ai_summary' => ['providers' => ['primary', 'backup'], 'usage', 'packages' => ['free', 'premium']],
        ])
        ->assertJsonPath('stats.0.value', '3')
        ->assertJsonPath('activities.6.value', 3)
        ->assertJsonPath('ai_summary.providers.primary.configured', true)
        ->assertJsonPath('ai_summary.providers.backup.configured', true)
        ->assertJsonPath('ai_summary.usage.period', '7d')
        ->assertJsonPath('ai_summary.usage.requests.total', 1)
        ->assertJsonPath('ai_summary.usage.tokens.input', 12)
        ->assertJsonPath('ai_summary.usage.tokens.output', 8)
        ->assertJsonPath('ai_summary.usage.cost.available', false)
        ->assertJsonPath('ai_summary.usage.cost.amount', null)
        ->assertJsonPath('ai_summary.packages.free.daily_requests', 5)
        ->assertJsonPath('ai_summary.packages.premium.daily_requests', 200);

    foreach (['overview-primary-secret', 'overview-backup-secret', 'private-question', 'private-response', 'private-prompt', 'latency', 'apiKeyHint', 'Ổn định'] as $forbidden) {
        expect(json_encode($response->json(), JSON_UNESCAPED_UNICODE))->not->toContain($forbidden);
    }
    expect($response->json('ai_summary'))->not->toHaveKeys(['prompts', 'systemPrompts', 'quotas']);
});

test('overview returns canonical stored and legacy package limits', function () {
    AdminSetting::create(['key' => 'ai.quotas', 'value' => ['student_daily_questions' => 77]]);
    $this->actingAs(User::factory()->create(['role' => 'admin']), 'sanctum')
        ->getJson('/api/admin/overview')->assertOk()
        ->assertJsonPath('ai_summary.packages.free.daily_requests', 77)
        ->assertJsonPath('ai_summary.packages.premium.daily_requests', 200);

    AdminSetting::create(['key' => 'ai.packages.v1', 'value' => [
        'free' => ['daily_requests' => 42, 'daily_tokens' => null],
        'premium' => ['daily_requests' => 600, 'daily_tokens' => 9000],
    ]]);
    $this->getJson('/api/admin/overview')->assertOk()
        ->assertJsonPath('ai_summary.packages.free.daily_requests', 42)
        ->assertJsonPath('ai_summary.packages.premium.daily_requests', 600)
        ->assertJsonPath('ai_summary.packages.premium.daily_tokens', 9000);
});

test('overview distinguishes zero recorded requests from unavailable AI measurements', function () {
    config()->set('services.gemini.api_key', null);
    config()->set('services.backup_ai.api_key', null);
    config()->set('services.backup_ai.provider', 'openai');
    config()->set('services.openai.key', null);

    $this->actingAs(User::factory()->create(['role' => 'admin']), 'sanctum')
        ->getJson('/api/admin/overview')->assertOk()
        ->assertJsonPath('ai_summary.providers.primary.configured', false)
        ->assertJsonPath('ai_summary.providers.backup.configured', false)
        ->assertJsonPath('ai_summary.usage.available', true)
        ->assertJsonPath('ai_summary.usage.requests.total', 0)
        ->assertJsonPath('ai_summary.usage.tokens.available', false)
        ->assertJsonPath('ai_summary.usage.tokens.input', null)
        ->assertJsonPath('ai_summary.usage.cost.available', false);
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
