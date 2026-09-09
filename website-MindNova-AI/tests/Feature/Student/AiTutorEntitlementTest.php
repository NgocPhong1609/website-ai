<?php

namespace Tests\Feature\Student;

use App\Models\ActivityLog;
use App\Models\AdminSetting;
use App\Models\AiUsageLog;
use App\Models\Subscription;
use App\Models\User;
use App\Services\Ai\AiUsageSummaryService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class AiTutorEntitlementTest extends TestCase
{
    use RefreshDatabase;

    public static function packages(): array
    {
        return [['none', 2], ['active', 4], ['expired', 2], ['overlapping', 4]];
    }

    #[DataProvider('packages')]
    public function test_package_boundary_blocks_http(string $subscription, int $limit): void
    {
        $user = User::factory()->create();
        AdminSetting::create(['key' => 'ai.packages.v1', 'value' => [
            'free' => ['daily_requests' => 2], 'premium' => ['daily_requests' => 4],
        ]]);
        if ($subscription !== 'none') {
            Subscription::create(['user_id' => $user->id, 'plan' => 'premium', 'status' => 'active',
                'expires_at' => $subscription === 'expired' ? now()->subDay() : now()->addDay(),
                'created_at' => now()->subDays(2)]);
        }
        if ($subscription === 'overlapping') {
            Subscription::create(['user_id' => $user->id, 'plan' => 'premium', 'status' => 'cancelled',
                'expires_at' => now()->addDays(2)]);
        }
        for ($i = 0; $i < $limit; $i++) {
            AiUsageLog::create(['user_id' => $user->id, 'meta' => ['feature' => 'ai_tutor']]);
        }
        Http::fake();
        $this->actingAs($user)->postJson('/api/student/ai-tutor/chat', ['message' => 'Explain addition'])
            ->assertStatus(429)->assertJsonPath('meta.daily_limit', $limit)->assertJsonPath('meta.used', $limit);
        Http::assertNothingSent();
    }

    public function test_only_tutor_rows_count_and_stream_records_sanitized_provider_usage(): void
    {
        $user = User::factory()->create();
        config(['services.ai_tutor.provider' => 'groq', 'services.groq.key' => 'secret-key']);
        AdminSetting::create(['key' => 'ai.packages.v1', 'value' => ['free' => ['daily_requests' => 2]]]);
        AdminSetting::create(['key' => 'ai.prompts', 'value' => ['ai_tro_giang' => 'Stored tutor instruction']]);
        AiUsageLog::create(['user_id' => $user->id, 'meta' => ['feature' => 'quiz']]);
        AiUsageLog::create(['user_id' => $user->id, 'meta' => ['feature' => 'ai_notification']]);
        // Legacy tutor rows have no feature but retain tutor content; unrelated system rows do not.
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
            ->assertStatus(429)->assertJsonPath('meta.used', 2);
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
        Http::fake(['api.groq.com/*' => $failure === 'http'
            ? Http::response(['error' => 'private-provider-body'], 503)
            : fn () => throw new ConnectionException('private-connection-detail')]);

        $response = $this->actingAs($user)->postJson('/api/student/ai-tutor/chat', ['message' => 'Explain addition']);
        $response->assertOk();
        $this->assertSame('He thong AI tam thoi gian doan. Vui long thu lai sau.', $response->streamedContent());
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
