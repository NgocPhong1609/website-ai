<?php

namespace Tests\Feature\Student;

use App\Models\ActivityLog;
use App\Models\AdminSetting;
use App\Models\AiDailyQuotaUsage;
use App\Models\AiUsageLog;
use App\Models\Subscription;
use App\Models\User;
use App\Services\Ai\AiUsageSummaryService;
use App\Settings\AiSettingsRepository;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class AiTutorEntitlementTest extends TestCase
{
    use RefreshDatabase;

    public function test_free_package_uses_one_counter_across_live_and_compatibility_tutor_routes(): void
    {
        $user = User::factory()->create(['role' => 'student', 'email_verified_at' => now()]);
        $lesson = CourseAiTutorServiceTest::enrolledLesson($user);
        config([
            'services.ai_tutor.provider' => 'groq',
            'services.groq.key' => 'compatibility-key',
            'services.gemini.api_key' => 'live-key',
            'services.gemini.force_failure' => false,
        ]);
        AdminSetting::create(['key' => 'ai.packages.v1', 'value' => [
            'free' => ['daily_requests' => 2], 'premium' => ['daily_requests' => 4],
        ]]);
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response([
                'candidates' => [['content' => ['parts' => [['text' => 'Live answer']]]]],
            ]),
            'api.groq.com/*' => Http::response([
                'choices' => [['message' => ['content' => 'Compatibility answer']]],
            ]),
        ]);

        $this->actingAs($user, 'sanctum')->postJson('/api/student/study-plan/chat', [
            'message' => 'Explain route binding',
            'lesson_id' => $lesson->id,
            'history' => [],
        ])->assertOk()->assertJsonPath('meta.quota.used', 1);
        Http::assertSentCount(1);

        $lastAllowed = $this->actingAs($user)->postJson('/api/student/ai-tutor/chat', [
            'message' => 'Explain addition',
        ]);
        $lastAllowed->assertOk()
            ->assertHeader('Content-Type', 'text/event-stream; charset=UTF-8')
            ->assertHeader('X-AI-Daily-Limit', '2')
            ->assertHeader('X-AI-Used', '2')
            ->assertHeader('X-AI-Remaining', '0');
        $this->assertSame(2, AiDailyQuotaUsage::sole()->used);
        Http::assertSentCount(1);
        $this->assertSame('Compatibility answer', $lastAllowed->streamedContent());
        Http::assertSentCount(2);

        $this->actingAs($user)->postJson('/api/student/ai-tutor/chat', [
            'message' => 'One request too many',
        ])->assertStatus(429)
            ->assertJsonStructure(['message', 'meta' => ['allowed', 'package', 'daily_limit', 'used', 'remaining', 'resets_at']])
            ->assertJsonPath('meta.allowed', false)
            ->assertJsonPath('meta.package', 'free')
            ->assertJsonPath('meta.daily_limit', 2)
            ->assertJsonPath('meta.used', 2)
            ->assertJsonPath('meta.remaining', 0)
            ->assertJsonPath('meta.resets_at', fn ($value) => is_string($value) && $value !== '');
        Http::assertSentCount(2);
    }

    public function test_active_premium_package_uses_its_configured_shared_limit(): void
    {
        $user = User::factory()->create(['role' => 'student', 'email_verified_at' => now()]);
        $lesson = CourseAiTutorServiceTest::enrolledLesson($user);
        Subscription::create([
            'user_id' => $user->id,
            'plan' => 'premium',
            'status' => 'active',
            'expires_at' => now()->addDay(),
        ]);
        AdminSetting::create(['key' => 'ai.packages.v1', 'value' => [
            'free' => ['daily_requests' => 1], 'premium' => ['daily_requests' => 3],
        ]]);
        config([
            'services.ai_tutor.provider' => 'groq',
            'services.groq.key' => 'compatibility-key',
            'services.gemini.api_key' => 'live-key',
            'services.gemini.force_failure' => false,
        ]);
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response([
                'candidates' => [['content' => ['parts' => [['text' => 'Live premium answer']]]]],
            ]),
            'api.groq.com/*' => Http::response([
                'choices' => [['message' => ['content' => 'Compatibility premium answer']]],
            ]),
        ]);

        $this->actingAs($user, 'sanctum')->postJson('/api/student/study-plan/chat', [
            'message' => 'Explain route binding',
            'lesson_id' => $lesson->id,
            'history' => [],
        ])->assertOk()->assertJsonPath('meta.quota.daily_limit', 3)
            ->assertJsonPath('meta.quota.used', 1);

        foreach ([2, 3] as $used) {
            $response = $this->actingAs($user)->postJson('/api/student/ai-tutor/chat', [
                'message' => 'Premium question '.$used,
            ]);
            $response->assertOk()
                ->assertHeader('X-AI-Daily-Limit', '3')
                ->assertHeader('X-AI-Used', (string) $used)
                ->assertHeader('X-AI-Remaining', (string) (3 - $used));
            $this->assertSame('Compatibility premium answer', $response->streamedContent());
        }

        $this->actingAs($user)->postJson('/api/student/ai-tutor/chat', [
            'message' => 'Premium request too many',
        ])->assertStatus(429)
            ->assertJsonPath('meta.package', 'premium')
            ->assertJsonPath('meta.daily_limit', 3)
            ->assertJsonPath('meta.used', 3)
            ->assertJsonPath('meta.remaining', 0);
        $this->assertSame(3, AiDailyQuotaUsage::sole()->used);
        Http::assertSentCount(3);
    }

    public function test_sensitive_input_is_rejected_before_quota_reservation_or_provider_io(): void
    {
        $user = User::factory()->create();
        config(['services.ai_tutor.provider' => 'groq', 'services.groq.key' => 'secret-key']);
        Http::fake();

        $this->actingAs($user)->postJson('/api/student/ai-tutor/chat', [
            'message' => 'This asks about racist content',
        ])->assertUnprocessable()
            ->assertJsonPath('message', 'Noi dung da bi gan co de admin kiem duyet thu cong.');

        $this->assertDatabaseHas('ai_moderation_flags', [
            'user_id' => $user->id,
            'source' => 'ai_tutor',
            'reason' => 'toxic_or_policy_sensitive_prompt',
        ]);
        $this->assertSame(0, AiDailyQuotaUsage::count());
        Http::assertNothingSent();
    }

    public static function missingLocalConfiguration(): array
    {
        return [
            'no counter or key' => [null, null, 'https://api.openai.com/v1'],
            'existing counter without key' => [2, '', 'https://api.openai.com/v1'],
            'blank key' => [null, '   ', 'https://api.openai.com/v1'],
            'missing base uri' => [null, 'test-key', ''],
            'unsupported base uri scheme' => [null, 'test-key', 'ftp://example.invalid'],
        ];
    }

    #[DataProvider('missingLocalConfiguration')]
    public function test_missing_local_configuration_does_not_spend_quota(?int $used, ?string $key, string $baseUri): void
    {
        $user = User::factory()->create();
        config([
            'services.ai_tutor.provider' => 'openai', 'services.openai.key' => $key,
            'services.ai_tutor.openai_base_uri' => $baseUri,
        ]);
        if ($used !== null) {
            AiDailyQuotaUsage::create([
                'user_id' => $user->id, 'feature' => 'ai_tutor',
                'usage_date' => now()->toDateString(), 'used' => $used,
            ]);
        }
        Http::fake();

        $this->actingAs($user)->postJson('/api/student/ai-tutor/chat', ['message' => 'Explain addition'])
            ->assertUnprocessable()->assertExactJson(['message' => 'Chua cau hinh API key cho nha cung cap AI hien tai.']);

        $this->assertSame($used === null ? 0 : 1, AiDailyQuotaUsage::count());
        $this->assertSame($used, AiDailyQuotaUsage::first()?->used);
        $this->assertSame(0, AiUsageLog::count());
        Http::assertNothingSent();
    }

    public function test_stream_finishes_fallible_prompt_preparation_before_reserving_quota(): void
    {
        $user = User::factory()->create();
        config(['services.ai_tutor.provider' => 'groq', 'services.groq.key' => 'test-key']);
        $this->partialMock(AiSettingsRepository::class, function ($mock) {
            $mock->shouldReceive('prompts')->once()->andThrow(new \RuntimeException('private-prompt-settings-failure'));
        });
        Http::fake();
        $this->withoutExceptionHandling();
        $caught = null;
        try {
            $this->actingAs($user)->postJson('/api/student/ai-tutor/chat', ['message' => 'Explain addition']);
        } catch (\RuntimeException $exception) {
            $caught = $exception;
        }

        $this->assertNotNull($caught);
        $this->assertSame(0, AiDailyQuotaUsage::count());
        $this->assertSame(0, AiUsageLog::count());
        Http::assertNothingSent();
    }

    public function test_stream_records_sanitized_provider_usage(): void
    {
        $user = User::factory()->create();
        config(['services.ai_tutor.provider' => 'groq', 'services.groq.key' => 'secret-key']);
        AdminSetting::create(['key' => 'ai.packages.v1', 'value' => ['free' => ['daily_requests' => 2]]]);
        AdminSetting::create(['key' => 'ai.prompts', 'value' => ['ai_tro_giang' => 'Stored tutor instruction']]);
        AiUsageLog::create(['user_id' => $user->id, 'meta' => ['feature' => 'quiz']]);
        AiUsageLog::create(['user_id' => $user->id, 'meta' => ['feature' => 'ai_notification']]);
        // Legacy tutor and unrelated observability rows are not quota reservations.
        AiUsageLog::create(['user_id' => $user->id, 'input_text' => 'Legacy question', 'system_prompt' => 'Legacy tutor instruction']);
        Http::fake(['api.groq.com/*' => Http::response([
            'id' => 'chat-request-1', 'choices' => [['message' => ['content' => 'Four']]],
            'usage' => ['prompt_tokens' => 11, 'completion_tokens' => 3],
        ])]);
        $response = $this->actingAs($user)->postJson('/api/student/ai-tutor/chat', ['message' => 'What is two plus two?']);
        $response->assertOk()->assertHeader('Content-Type', 'text/event-stream; charset=UTF-8');
        $this->assertSame('Four', $response->streamedContent());
        Http::assertSent(fn ($request) => $request['messages'][0]['content'] === 'Stored tutor instruction');
        $log = AiUsageLog::latest('id')->first();
        $this->assertSame(['feature' => 'ai_tutor'], $log->meta);
        $this->assertSame('provider', $log->token_source);
        $this->assertSame(11, $log->input_tokens);
        $this->assertSame(3, $log->output_tokens);
        $this->assertSame('success', $log->status);
        $this->assertSame('chat-request-1', $log->provider_request_id);
        $this->assertNotNull($log->request_id);
        $this->assertNotNull($log->duration_ms);
        $this->assertNull($log->cost_amount);
        $this->assertSame('unavailable', $log->cost_source);
        $this->assertNull($log->input_text);
        $this->assertNull($log->output_text);
        $this->assertNull($log->system_prompt);
        $activity = ActivityLog::where('action', 'ai_prompt_submitted')->sole();
        $this->assertSame('provider', $activity->metadata['token_source']);
        $this->assertSame(11, $activity->metadata['input_tokens']);
        $this->assertSame(3, $activity->metadata['output_tokens']);
        $this->actingAs($user)->postJson('/api/student/ai-tutor/chat', ['message' => 'Another question'])
            ->assertOk()->assertHeader('X-AI-Used', '2');
        Http::assertSentCount(1);
    }

    public static function providerFailures(): array
    {
        return [['http', 'http_503'], ['connection', 'connection_error']];
    }

    public static function tutorProviders(): array
    {
        return [
            'missing setting preserves legacy openai' => [null, 'openai', 'openai'],
            'blank setting preserves legacy openai' => ['', 'openai', 'openai'],
            'whitespace setting preserves legacy openai' => ['   ', 'openai', 'openai'],
            'legacy groq stays supported' => [null, 'groq', 'groq'],
            'explicit groq wins over legacy openai' => ['groq', 'openai', 'groq'],
            'explicit openai wins over legacy groq' => ['openai', 'groq', 'openai'],
            'unsupported legacy provider uses safe default' => [null, 'claude', 'groq'],
            'legacy gemini does not select the router primary' => [null, 'gemini', 'groq'],
            'absent legacy primary uses safe default' => [null, null, 'groq'],
        ];
    }

    #[DataProvider('tutorProviders')]
    public function test_tutor_provider_compatibility(?string $configured, ?string $legacy, string $expected): void
    {
        config([
            'services.ai_tutor.provider' => $configured,
            'services.ai_tutor.openai_base_uri' => 'https://api.openai.com/v1',
            'services.openai.key' => 'openai-fixture-key',
            'services.groq.key' => 'groq-fixture-key',
        ]);
        AdminSetting::create(['key' => 'ai.providers', 'value' => ['primary' => $legacy]]);
        Http::preventStrayRequests();
        $host = $expected === 'openai' ? 'api.openai.com' : 'api.groq.com';
        Http::fake([$host.'/*' => Http::response([
            'choices' => [['message' => ['content' => 'Compatible tutor answer']]],
        ])]);

        $response = $this->actingAs(User::factory()->create())
            ->postJson('/api/student/ai-tutor/chat', ['message' => 'Explain addition']);
        $response->assertOk();
        $this->assertSame('Compatible tutor answer', $response->streamedContent());
        Http::assertSent(fn ($request) => $request->url() === 'https://'.$host.'/'.($expected === 'groq' ? 'openai/' : '').'v1/chat/completions'
            && $request->hasHeader('Authorization', 'Bearer '.$expected.'-fixture-key'));
        Http::assertSentCount(1);
        $this->assertSame($expected, AiUsageLog::sole()->provider);
        $this->assertStringNotContainsString('fixture-key', AiUsageLog::sole()->toJson());
    }

    #[DataProvider('providerFailures')]
    public function test_failed_tutor_requests_do_not_invent_usage(string $failure, string $errorCode): void
    {
        $user = User::factory()->create();
        config(['services.ai_tutor.provider' => 'groq', 'services.groq.key' => 'secret-key']);
        $transactionLevel = DB::transactionLevel();
        $attempts = 0;
        Http::fake(['api.groq.com/*' => function () use ($transactionLevel, &$attempts, $failure) {
            $attempts++;
            $this->assertSame($transactionLevel, DB::transactionLevel());
            $this->assertSame(1, AiDailyQuotaUsage::sole()->used);

            return $failure === 'http'
                ? Http::response(['error' => 'private-provider-body'], 503)
                : throw new ConnectionException('private-connection-detail');
        }]);

        $response = $this->actingAs($user)->postJson('/api/student/ai-tutor/chat', ['message' => 'Explain addition']);
        $response->assertOk();
        $this->assertSame('He thong AI tam thoi gian doan. Vui long thu lai sau.', $response->streamedContent());
        $this->assertSame(1, $attempts);
        $this->assertSame(1, AiDailyQuotaUsage::sole()->used);
        $log = AiUsageLog::sole();
        $this->assertSame('failed', $log->status);
        $this->assertSame($errorCode, $log->error_code);
        $this->assertSame('unavailable', $log->token_source);
        $this->assertSame(0, $log->input_tokens);
        $this->assertSame(0, $log->output_tokens);
        $activity = ActivityLog::where('action', 'ai_prompt_submitted')->sole();
        $this->assertSame('unavailable', $activity->metadata['token_source']);
        $this->assertArrayNotHasKey('input_tokens', $activity->metadata);
        $this->assertArrayNotHasKey('output_tokens', $activity->metadata);
        $tokens = app(AiUsageSummaryService::class)->summarize('7d')['tokens'];
        $this->assertFalse($tokens['available']);
        $this->assertNull($tokens['input']);
        $this->assertNull($tokens['output']);
    }

    public function test_successful_tutor_estimates_are_explicit_in_usage_and_activity_logs(): void
    {
        $user = User::factory()->create();
        config(['services.ai_tutor.provider' => 'groq', 'services.groq.key' => 'secret-key']);
        AdminSetting::create(['key' => 'ai.prompts', 'value' => ['ai_tro_giang' => 'Tutor instruction']]);
        Http::fake(['api.groq.com/*' => Http::response([
            'choices' => [['message' => ['content' => 'Two plus two equals four']]],
        ])]);

        $response = $this->actingAs($user)->postJson('/api/student/ai-tutor/chat', ['message' => 'Explain addition']);
        $response->assertOk();
        $this->assertSame('Two plus two equals four', $response->streamedContent());
        $log = AiUsageLog::sole();
        $this->assertSame('success', $log->status);
        $this->assertSame('estimated', $log->token_source);
        $this->assertSame(6, $log->input_tokens);
        $this->assertSame(7, $log->output_tokens);
        $activity = ActivityLog::where('action', 'ai_prompt_submitted')->sole();
        $this->assertSame('estimated', $activity->metadata['token_source']);
        $this->assertSame(6, $activity->metadata['input_tokens']);
        $this->assertSame(7, $activity->metadata['output_tokens']);
    }
}
