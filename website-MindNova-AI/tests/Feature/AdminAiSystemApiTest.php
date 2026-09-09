<?php

use App\DTOs\AiMessageDto;
use App\Models\AdminSetting;
use App\Models\AiUsageLog;
use App\Models\Subscription;
use App\Models\User;
use App\Services\Ai\AiUsageSummaryService;
use App\Services\Ai\BackupAiService;
use App\Settings\AiSettingsRepository;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Http;

afterEach(function () {
    CarbonImmutable::setTestNow();
});

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

function aiUsageRecord(array $attributes = []): AiUsageLog
{
    $createdAt = $attributes['created_at'] ?? now();
    unset($attributes['created_at']);

    $log = AiUsageLog::query()->create(array_replace([
        'actor_type' => 'system',
        'actor_key' => 'system',
        'provider' => 'gemini',
        'model' => 'gemini-2.5-flash',
        'input_tokens' => 0,
        'output_tokens' => 0,
        'cost_estimate' => 0,
    ], $attributes));

    $log->forceFill([
        'created_at' => $createdAt,
        'updated_at' => $createdAt,
    ])->saveQuietly();

    return $log;
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

it('returns canonical defaults for null and non-string legacy prompts', function (mixed $value) {
    AdminSetting::create(['key' => 'ai.prompts', 'value' => [
        'ai_tro_giang' => $value, 'ai_cham_bai' => $value,
    ]]);

    $this->actingAs(adminForAiConfig(), 'sanctum')->getJson('/api/admin/ai-config')
        ->assertOk()
        ->assertJsonPath('prompts.ai_tro_giang', 'Ban la AI tro giang, tra loi ngan gon, de hieu, uu tien tieng Viet.')
        ->assertJsonPath('prompts.ai_cham_bai', 'Ban la AI cham bai, phan tich theo tieu chi ro rang va cong bang.');
})->with([null, 42, false, [['nested' => 'invalid']]]);

it('preserves stored string prompts independently of invalid legacy values', function () {
    AdminSetting::create(['key' => 'ai.prompts', 'value' => [
        'ai_tro_giang' => 'Stored tutor instruction', 'ai_cham_bai' => null,
    ]]);

    $this->actingAs(adminForAiConfig(), 'sanctum')->getJson('/api/admin/ai-config')
        ->assertOk()
        ->assertJsonPath('prompts.ai_tro_giang', 'Stored tutor instruction')
        ->assertJsonPath('prompts.ai_cham_bai', 'Ban la AI cham bai, phan tich theo tieu chi ro rang va cong bang.');
});

it('reports backup readiness using the same effective key as runtime', function ($provider, $direct, $fallback, $ready, $expectedAuthorization) {
    config([
        'services.backup_ai.provider' => $provider,
        'services.backup_ai.api_key' => $direct,
        'services.openai.key' => $fallback,
        'services.groq.key' => $fallback,
    ]);
    Http::preventStrayRequests();
    $host = $provider === 'groq' ? 'api.groq.com' : 'api.openai.com';
    Http::fake([$host.'/*' => Http::response(['choices' => [['message' => ['content' => 'Backup answer']]]])]);

    $response = $this->actingAs(adminForAiConfig(), 'sanctum')->getJson('/api/admin/ai-config');
    $response->assertOk()->assertJsonPath('providers.backup.configured', $ready);
    expect($response->json('providers.backup'))->toHaveCount(3);
    expect($response->getContent())->not->toContain('fixture-key');

    $caught = null;
    $answer = null;
    try {
        $answer = app(BackupAiService::class)->sendMessage([new AiMessageDto('user', 'Question')]);
    } catch (Exception $exception) {
        $caught = $exception;
    }
    if ($ready) {
        expect($caught)->toBeNull()->and($answer)->toBe('Backup answer');
        Http::assertSent(fn ($request) => $request->hasHeader('Authorization', $expectedAuthorization));
        Http::assertSentCount(1);
    } else {
        expect($caught)->toBeInstanceOf(Exception::class);
        Http::assertNothingSent();
    }
})->with([
    'zero direct without fallback' => ['openai', '0', null, false, null],
    'zero direct with fallback' => ['groq', '0', 'fixture-key', true, 'Bearer fixture-key'],
    'whitespace direct without fallback' => ['openai', '   ', null, true, 'Bearer'],
    'whitespace direct before fallback' => ['groq', '   ', 'fixture-key', true, 'Bearer'],
    'zero fallback' => ['openai', null, '0', false, null],
    'whitespace fallback' => ['groq', null, '   ', true, 'Bearer'],
    'empty keys' => ['openai', '', '', false, null],
    'direct key' => ['groq', 'direct-fixture-key', 'fixture-key', true, 'Bearer direct-fixture-key'],
]);

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

it('summarizes usage within application timezone boundaries', function () {
    config()->set('app.timezone', 'Asia/Ho_Chi_Minh');
    CarbonImmutable::setTestNow(CarbonImmutable::parse('2026-09-09 12:00:00', 'Asia/Ho_Chi_Minh'));

    aiUsageRecord([
        'provider' => 'gemini',
        'model' => 'gemini-2.5-flash',
        'status' => 'success',
        'input_tokens' => 100,
        'output_tokens' => 50,
        'token_source' => 'provider',
        'cost_amount' => 0.12,
        'cost_currency' => 'USD',
        'cost_source' => 'provider',
        'created_at' => CarbonImmutable::parse('2026-09-03 00:00:00', 'Asia/Ho_Chi_Minh'),
    ]);
    aiUsageRecord([
        'provider' => 'openai',
        'model' => 'gpt-5-mini',
        'status' => 'failed',
        'input_tokens' => 30,
        'output_tokens' => 15,
        'token_source' => 'estimated',
        'cost_amount' => 0.03,
        'cost_currency' => 'USD',
        'cost_source' => 'estimated',
        'created_at' => CarbonImmutable::parse('2026-09-09 11:00:00', 'Asia/Ho_Chi_Minh'),
    ]);
    aiUsageRecord([
        'provider' => 'gemini',
        'model' => 'gemini-2.5-flash',
        'status' => null,
        'token_source' => 'unavailable',
        'cost_amount' => null,
        'cost_source' => 'unavailable',
        'created_at' => CarbonImmutable::parse('2026-09-09 11:30:00', 'Asia/Ho_Chi_Minh'),
    ]);

    aiUsageRecord([
        'status' => 'success',
        'token_source' => 'provider',
        'cost_amount' => 99,
        'cost_currency' => 'USD',
        'cost_source' => 'provider',
        'created_at' => CarbonImmutable::parse('2026-09-02 23:59:59', 'Asia/Ho_Chi_Minh'),
    ]);
    aiUsageRecord([
        'status' => 'success',
        'token_source' => 'provider',
        'cost_amount' => 99,
        'cost_currency' => 'USD',
        'cost_source' => 'provider',
        'created_at' => CarbonImmutable::parse('2026-09-10 00:00:00', 'Asia/Ho_Chi_Minh'),
    ]);

    $summary = app(AiUsageSummaryService::class)->summarize('7d');

    expect($summary)
        ->period->toBe('7d')
        ->from->toBe('2026-09-03')
        ->to->toBe('2026-09-09')
        ->coverage->toBe('recorded_requests')
        ->requests->toBe([
            'total' => 3,
            'successful' => 1,
            'failed' => 1,
            'status_unavailable' => 1,
        ])
        ->tokens->toBe([
            'input' => 130,
            'output' => 65,
            'available' => true,
            'source' => 'mixed',
            'coverage' => 'partial',
            'sourced_requests' => 2,
            'recorded_requests' => 3,
        ])
        ->cost->toBe([
            'amount' => 0.15,
            'currency' => 'USD',
            'available' => true,
            'source' => 'mixed',
            'coverage' => 'partial',
            'sourced_requests' => 2,
            'recorded_requests' => 3,
        ])
        ->and($summary['daily_trend'])->toHaveCount(7)
        ->and($summary['daily_trend'][0])->toBe(['date' => '2026-09-03', 'requests' => 1])
        ->and($summary['daily_trend'][6])->toBe(['date' => '2026-09-09', 'requests' => 2])
        ->and($summary['provider_breakdown'])->toBe([
            ['provider' => 'gemini', 'model' => 'gemini-2.5-flash', 'requests' => 2],
            ['provider' => 'openai', 'model' => 'gpt-5-mini', 'requests' => 1],
        ]);
});

it('keeps unavailable usage cost and tokens distinct from real zero values', function () {
    CarbonImmutable::setTestNow(CarbonImmutable::parse('2026-09-09 12:00:00', config('app.timezone')));

    aiUsageRecord([
        'input_tokens' => 120,
        'output_tokens' => 80,
        'cost_estimate' => 4.25,
        'token_source' => 'unavailable',
        'cost_amount' => null,
        'cost_source' => 'unavailable',
    ]);

    $unavailable = app(AiUsageSummaryService::class)->summarize('7d');

    expect($unavailable['requests']['total'])->toBe(1)
        ->and($unavailable['tokens'])->toBe([
            'input' => null,
            'output' => null,
            'available' => false,
            'source' => 'unavailable',
            'coverage' => 'unavailable',
            'sourced_requests' => 0,
            'recorded_requests' => 1,
        ])
        ->and($unavailable['cost'])->toBe([
            'amount' => null,
            'currency' => null,
            'available' => false,
            'source' => 'unavailable',
            'coverage' => 'unavailable',
            'sourced_requests' => 0,
            'recorded_requests' => 1,
        ]);

    AiUsageLog::query()->delete();
    aiUsageRecord([
        'token_source' => 'provider',
        'cost_amount' => 0,
        'cost_currency' => 'USD',
        'cost_source' => 'provider',
    ]);

    $realZero = app(AiUsageSummaryService::class)->summarize('7d');

    expect($realZero['tokens'])->toBe([
        'input' => 0,
        'output' => 0,
        'available' => true,
        'source' => 'provider',
        'coverage' => 'complete',
        'sourced_requests' => 1,
        'recorded_requests' => 1,
    ])->and($realZero['cost'])->toBe([
        'amount' => 0.0,
        'currency' => 'USD',
        'available' => true,
        'source' => 'provider',
        'coverage' => 'complete',
        'sourced_requests' => 1,
        'recorded_requests' => 1,
    ]);
});

it('returns zero recorded usage and defaults an unsupported usage period to seven days', function () {
    CarbonImmutable::setTestNow(CarbonImmutable::parse('2026-09-09 12:00:00', config('app.timezone')));

    $summary = app(AiUsageSummaryService::class)->summarize('yearly');

    expect($summary['period'])->toBe('7d')
        ->and($summary['requests'])->toBe([
            'total' => 0,
            'successful' => 0,
            'failed' => 0,
            'status_unavailable' => 0,
        ])
        ->and($summary['tokens']['available'])->toBeFalse()
        ->and($summary['tokens']['coverage'])->toBe('unavailable')
        ->and($summary['tokens']['sourced_requests'])->toBe(0)
        ->and($summary['tokens']['recorded_requests'])->toBe(0)
        ->and($summary['cost']['available'])->toBeFalse()
        ->and($summary['cost']['coverage'])->toBe('unavailable')
        ->and($summary['cost']['sourced_requests'])->toBe(0)
        ->and($summary['cost']['recorded_requests'])->toBe(0)
        ->and($summary['daily_trend'])->toHaveCount(7)
        ->and(collect($summary['daily_trend'])->sum('requests'))->toBe(0)
        ->and($summary['provider_breakdown'])->toBe([]);
});

it('returns the stored usage summary through the canonical admin API', function () {
    aiUsageRecord([
        'status' => 'success',
        'input_tokens' => 10,
        'output_tokens' => 4,
        'token_source' => 'provider',
        'cost_amount' => null,
        'cost_source' => 'unavailable',
    ]);
    aiUsageRecord([
        'status' => null,
        'input_tokens' => 999,
        'output_tokens' => 999,
        'token_source' => 'unavailable',
        'cost_estimate' => 99,
        'cost_amount' => null,
        'cost_source' => 'unavailable',
    ]);

    $response = $this->actingAs(adminForAiConfig(), 'sanctum')
        ->getJson('/api/admin/ai-config?period=30d');

    $response->assertOk()
        ->assertJsonPath('usage.period', '30d')
        ->assertJsonPath('usage.available', true)
        ->assertJsonPath('usage.requests.total', 2)
        ->assertJsonPath('usage.tokens.input', 10)
        ->assertJsonPath('usage.tokens.coverage', 'partial')
        ->assertJsonPath('usage.tokens.sourced_requests', 1)
        ->assertJsonPath('usage.tokens.recorded_requests', 2)
        ->assertJsonPath('usage.cost.amount', null)
        ->assertJsonPath('usage.cost.available', false)
        ->assertJsonPath('usage.cost.coverage', 'unavailable')
        ->assertJsonPath('usage.cost.sourced_requests', 0)
        ->assertJsonPath('usage.cost.recorded_requests', 2);
});
