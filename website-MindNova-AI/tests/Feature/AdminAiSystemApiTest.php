<?php

use App\Models\AdminSetting;
use App\Models\Subscription;
use App\Models\User;
use App\Settings\AiSettingsRepository;

function aiConfigPayload(array $overrides = []): array
{
    return array_replace_recursive([
        'packages' => [
            'free' => ['daily_requests' => 45, 'daily_tokens' => null],
            'premium' => ['daily_requests' => 500, 'daily_tokens' => 12000],
        ],
        'prompts' => [
            'ai_tro_giang' => 'Prompt tro giang moi.',
            'ai_cham_bai' => 'Prompt cham bai moi.',
        ],
    ], $overrides);
}

function adminForAiConfig(): User
{
    return User::factory()->create([
        'role' => 'admin',
        'email_verified_at' => now(),
    ]);
}

it('requires authentication to read the admin AI configuration', function () {
    $this->getJson('/api/admin/ai-config')->assertUnauthorized();
});

it('forbids non-admin users from reading the admin AI configuration', function () {
    $student = User::factory()->create(['role' => 'student']);

    $this->actingAs($student, 'sanctum')
        ->getJson('/api/admin/ai-config')
        ->assertForbidden();
});

it('returns the canonical config without secret material', function () {
    config()->set('services.gemini.api_key', 'never-return-this');
    config()->set('services.gemini.model', 'gemini-test-model');
    config()->set('services.backup_ai.api_key', 'backup-secret');
    config()->set('services.backup_ai.model', 'backup-test-model');
    config()->set('services.backup_ai.provider', 'openai');

    $response = $this->actingAs(adminForAiConfig(), 'sanctum')
        ->getJson('/api/admin/ai-config?period=30d');

    $response->assertOk()->assertJsonStructure([
        'providers' => [
            'primary' => ['name', 'model', 'configured'],
            'backup' => ['name', 'model', 'configured'],
        ],
        'usage',
        'packages' => ['free', 'premium'],
        'prompts',
        'updated_at',
    ])->assertJsonPath('providers.primary.name', 'gemini')
        ->assertJsonPath('providers.primary.model', 'gemini-test-model')
        ->assertJsonPath('providers.primary.configured', true)
        ->assertJsonPath('providers.backup.name', 'openai')
        ->assertJsonPath('providers.backup.model', 'backup-test-model')
        ->assertJsonPath('providers.backup.configured', true)
        ->assertJsonPath('usage.period', '30d');

    expect($response->getContent())->not->toContain('never-return-this')
        ->and($response->getContent())->not->toContain('backup-secret')
        ->and($response->json('providers.primary'))->not->toHaveKeys(['api_key', 'apiKeyHint'])
        ->and($response->json('providers.backup'))->not->toHaveKeys(['api_key', 'apiKeyHint']);
});

it('reports a Groq-configured backup as ready when it uses the runtime fallback key', function () {
    config()->set('services.backup_ai.api_key', null);
    config()->set('services.backup_ai.provider', 'groq');
    config()->set('services.groq.key', 'groq-fallback-secret');

    $response = $this->actingAs(adminForAiConfig(), 'sanctum')
        ->getJson('/api/admin/ai-config');

    $response->assertOk()
        ->assertJsonPath('providers.backup.name', 'groq')
        ->assertJsonPath('providers.backup.configured', true);

    expect($response->getContent())->not->toContain('groq-fallback-secret');
});

it('normalizes a blank backup provider to openai and uses its runtime fallback key', function () {
    config()->set('services.backup_ai.api_key', null);
    config()->set('services.backup_ai.provider', '');
    config()->set('services.openai.key', 'openai-fallback-secret');

    $response = $this->actingAs(adminForAiConfig(), 'sanctum')
        ->getJson('/api/admin/ai-config');

    $response->assertOk()
        ->assertJsonPath('providers.backup.name', 'openai')
        ->assertJsonPath('providers.backup.configured', true);

    expect($response->getContent())->not->toContain('openai-fallback-secret');
});

it('preserves a whitespace-wrapped provider and follows the runtime openai fallback', function () {
    config()->set('services.backup_ai.api_key', null);
    config()->set('services.backup_ai.provider', ' groq ');
    config()->set('services.groq.key', null);
    config()->set('services.openai.key', 'openai-whitespace-fallback-secret');

    $response = $this->actingAs(adminForAiConfig(), 'sanctum')
        ->getJson('/api/admin/ai-config');

    $response->assertOk()
        ->assertJsonPath('providers.backup.name', ' groq ')
        ->assertJsonPath('providers.backup.configured', true);

    expect($response->getContent())->not->toContain('openai-whitespace-fallback-secret');
});

it('persists exactly the writable free premium packages and prompts', function () {
    $response = $this->actingAs(adminForAiConfig(), 'sanctum')
        ->putJson('/api/admin/ai-config', aiConfigPayload());

    $response->assertOk();

    $packages = AdminSetting::query()->where('key', 'ai.packages.v1')->value('value');
    $prompts = AdminSetting::query()->where('key', 'ai.prompts')->value('value');

    expect($packages)->toHaveKeys(['free', 'premium'])
        ->and($packages['free'])->toMatchArray(['daily_requests' => 45, 'daily_tokens' => null])
        ->and($packages['premium'])->toMatchArray(['daily_requests' => 500, 'daily_tokens' => 12000])
        ->and($prompts)->toMatchArray([
            'ai_tro_giang' => 'Prompt tro giang moi.',
            'ai_cham_bai' => 'Prompt cham bai moi.',
        ]);
});

it('uses the legacy student quota as the free package fallback', function () {
    AdminSetting::create([
        'key' => 'ai.quotas',
        'value' => ['student_daily_questions' => 77, 'guest_daily_questions' => 5],
    ]);

    $response = $this->actingAs(adminForAiConfig(), 'sanctum')
        ->getJson('/api/admin/ai-config');

    $response->assertOk()
        ->assertJsonPath('packages.free.daily_requests', 77)
        ->assertJsonPath('packages.free.daily_tokens', null)
        ->assertJsonPath('packages.premium.daily_requests', 200)
        ->assertJsonPath('packages.premium.daily_tokens', null);
});

it('rejects package values outside the configured numeric bounds', function () {
    $response = $this->actingAs(adminForAiConfig(), 'sanctum')
        ->putJson('/api/admin/ai-config', aiConfigPayload([
            'packages' => ['free' => ['daily_requests' => 0]],
        ]));

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['packages.free.daily_requests']);
});

it('rejects provider secrets connections and unknown writable fields', function () {
    $response = $this->actingAs(adminForAiConfig(), 'sanctum')
        ->putJson('/api/admin/ai-config', aiConfigPayload([
            'providers' => ['primary' => 'attacker'],
            'connections' => ['external'],
            'api_key' => 'do-not-save',
            'unexpected' => true,
            'packages' => ['free' => ['hidden_limit' => 1]],
        ]));

    $response->assertUnprocessable()
        ->assertJsonValidationErrors([
            'providers',
            'connections',
            'api_key',
            'unexpected',
            'packages.free.hidden_limit',
        ]);

    expect(AdminSetting::query()->whereIn('key', ['ai.packages.v1', 'ai.prompts'])->exists())->toBeFalse();
});

it('resolves only a current active premium subscription as premium', function () {
    $premiumUser = User::factory()->create();
    Subscription::query()->create([
        'user_id' => $premiumUser->id,
        'plan' => 'premium',
        'status' => 'active',
        'expires_at' => now()->addDay(),
    ]);

    $expiredPremiumUser = User::factory()->create();
    Subscription::query()->create([
        'user_id' => $expiredPremiumUser->id,
        'plan' => 'premium',
        'status' => 'active',
        'expires_at' => now()->subSecond(),
    ]);

    $repository = app(AiSettingsRepository::class);

    expect($repository->packageForUser($premiumUser))->toBe('premium')
        ->and($repository->packageForUser($expiredPremiumUser))->toBe('free')
        ->and($repository->packageForUser(null))->toBe('free');
});
