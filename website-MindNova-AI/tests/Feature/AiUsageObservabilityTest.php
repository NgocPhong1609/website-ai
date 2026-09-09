<?php

namespace Tests\Feature;

use App\DTOs\AiMessageDto;
use App\Models\AiUsageLog;
use App\Services\Ai\AiRouterService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class AiUsageObservabilityTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        config(['services.gemini.api_key' => 'secret-key', 'services.backup_ai.api_key' => 'backup-secret',
            'services.backup_ai.provider' => 'openai']);
        Http::preventStrayRequests();
    }

    private function send(): array
    {
        return app(AiRouterService::class)->sendMessageWithFallback([new AiMessageDto('user', 'private-prompt')],
            ['feature' => 'ai_tutor', 'authorization' => 'Bearer private-key', 'ip' => '192.0.2.1', 'user_agent' => 'private-agent']);
    }

    public function test_primary_success_logs_provider_tokens_and_only_safe_metadata(): void
    {
        Http::fake(['generativelanguage.googleapis.com/*' => Http::response([
            'responseId' => 'gemini-response-1', 'candidates' => [['content' => ['parts' => [['text' => 'Answer']]]]],
            'usageMetadata' => ['promptTokenCount' => 12, 'candidatesTokenCount' => 8],
        ])]);
        $result = $this->send();
        $log = AiUsageLog::sole();
        $this->assertSame('success', $log->status);
        $this->assertSame($result['meta']['requestId'], $log->request_id);
        $this->assertSame('gemini-response-1', $log->provider_request_id);
        $this->assertFalse($log->fallback_used);
        $this->assertGreaterThanOrEqual(0, $log->duration_ms);
        $this->assertSame('provider', $log->token_source);
        $this->assertSame(12, $log->input_tokens);
        $this->assertSame(8, $log->output_tokens);
        $this->assertSame('unavailable', $log->cost_source);
        $this->assertNull($log->cost_amount);
        $this->assertSame(['feature' => 'ai_tutor'], $log->meta);
        $this->assertStringNotContainsString('private-', $log->toJson());
        Http::assertSentCount(1);
    }

    public function test_transient_failures_log_each_attempt_then_backup_once_with_shared_request_id(): void
    {
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response(['error' => 'private-provider-body'], 503),
            'api.openai.com/*' => Http::response(['id' => 'backup-response-1',
                'choices' => [['message' => ['content' => 'Backup answer']]],
                'usage' => ['prompt_tokens' => 9, 'completion_tokens' => 5]], 200),
        ]);
        $result = $this->send();
        $logs = AiUsageLog::orderBy('id')->get();
        $this->assertSame(['gemini', 'gemini', 'backup'], $logs->pluck('provider')->all());
        $this->assertSame(['failed', 'failed', 'success'], $logs->pluck('status')->all());
        $this->assertSame(['http_503', 'http_503', null], $logs->pluck('error_code')->all());
        $this->assertSame([false, false, true], $logs->pluck('fallback_used')->all());
        $this->assertSame([$result['meta']['requestId']], $logs->pluck('request_id')->unique()->values()->all());
        $this->assertSame('provider', $logs->last()->token_source);
        $this->assertSame('unavailable', $logs->first()->token_source);
        $this->assertSame(9, $logs->last()->input_tokens);
        $this->assertSame('backup-response-1', $logs->last()->provider_request_id);
        Http::assertSentCount(3);
    }

    public static function configurationFailures(): array
    {
        return [[401], [403], [404]];
    }

    #[DataProvider('configurationFailures')]
    public function test_authentication_and_configuration_errors_never_fall_back(int $status): void
    {
        Http::fake(['generativelanguage.googleapis.com/*' => Http::response('private-provider-body', $status)]);
        $exception = null;
        try {
            $this->send();
        } catch (\Exception $caught) {
            $exception = $caught;
        }
        $this->assertInstanceOf(\Exception::class, $exception, 'Expected a provider exception');
        $this->assertStringNotContainsString('private-provider-body', $exception->getMessage());
        $this->assertNull($exception->getPrevious());
        Http::assertSentCount(1);
        $log = AiUsageLog::sole();
        $this->assertSame('failed', $log->status);
        $this->assertSame('http_'.$status, $log->error_code);
        $this->assertFalse($log->fallback_used);
    }

    public function test_error_bodies_and_connection_secrets_never_reach_logs_or_public_exception(): void
    {
        Log::spy();
        Http::fake([
            'generativelanguage.googleapis.com/*' => fn () => throw new ConnectionException('cURL private-key private-prompt'),
            'api.openai.com/*' => Http::response('private-provider-body', 401),
        ]);
        $exception = null;
        try {
            $this->send();
        } catch (\Exception $caught) {
            $exception = $caught;
        }
        $this->assertInstanceOf(\Exception::class, $exception, 'Expected both providers to fail');
        $this->assertStringNotContainsString('private-', $exception->getMessage());
        $this->assertNull($exception->getPrevious());
        foreach (['error', 'warning', 'info'] as $level) {
            Log::shouldNotHaveReceived($level, fn ($message, $context = []) => str_contains($message.json_encode($context), 'private-'));
        }
        $this->assertSame(['connection_error', 'connection_error', 'http_401'],
            AiUsageLog::orderBy('id')->pluck('error_code')->all());
    }

    public function test_missing_provider_usage_is_unavailable_instead_of_reported_zero(): void
    {
        Http::fake(['generativelanguage.googleapis.com/*' => Http::response([
            'candidates' => [['content' => ['parts' => [['text' => 'Answer']]]]],
        ])]);
        $this->send();
        $this->assertSame('unavailable', AiUsageLog::sole()->token_source);
    }

    public function test_missing_primary_key_surfaces_configuration_failure_without_http(): void
    {
        config(['services.gemini.api_key' => null]);
        Http::fake(['*' => Http::response([
            'candidates' => [['content' => ['parts' => [['text' => 'Answer']]]]],
        ])]);
        $exception = null;
        try {
            $this->send();
        } catch (\Exception $caught) {
            $exception = $caught;
        }
        $this->assertNotNull($exception);
        Http::assertNothingSent();
        $this->assertSame('missing_api_key', AiUsageLog::sole()->error_code);
    }
}
