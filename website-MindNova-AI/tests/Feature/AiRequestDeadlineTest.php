<?php

namespace Tests\Feature;

use App\DTOs\AiMessageDto;
use App\Exceptions\AiTransientException;
use App\Services\Ai\BackupAiService;
use App\Services\Ai\GeminiAiService;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class AiRequestDeadlineTest extends TestCase
{
    public function test_expired_deadline_prevents_requests_to_both_providers(): void
    {
        config(['services.gemini.api_key' => 'test', 'services.gemini.fallback_models' => [],
            'services.gemini.force_failure' => false, 'services.backup_ai.api_key' => 'test']);
        Http::fake(['*' => Http::response(['candidates' => [['content' => ['parts' => [['text' => 'OK']]]]],
            'choices' => [['message' => ['content' => 'OK']]]])]);
        foreach ([new GeminiAiService, new BackupAiService] as $service) {
            try {
                $service->sendMessage([new AiMessageDto('user', 'Hi')], ['deadline' => microtime(true) - 1]);
                $this->fail('Expired requests must stop');
            } catch (AiTransientException $e) {
                $this->assertStringContainsString('deadline', $e->getMessage());
            }
        }
        Http::assertNothingSent();
    }

    public function test_model_fallback_does_not_reset_total_deadline(): void
    {
        config(['services.gemini.api_key' => 'test', 'services.gemini.model' => 'gemini-3.8-flash',
            'services.gemini.fallback_models' => ['gemini-3.7-flash'], 'services.gemini.force_failure' => false]);
        Http::fake(function () {
            usleep(50000);

            return Http::response([], 503);
        });
        try {
            (new GeminiAiService)->sendMessage([new AiMessageDto('user', 'Hi')],
                ['max_retries' => 1, 'deadline' => microtime(true) + 0.02]);
            $this->fail('Expected deadline exceeded');
        } catch (AiTransientException $e) {
            $this->assertStringContainsString('deadline', $e->getMessage());
        }
        Http::assertSentCount(1);
    }
}
