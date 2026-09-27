<?php

namespace Tests\Feature;

use App\DTOs\AiMessageDto;
use App\Exceptions\AiTransientException;
use App\Services\Ai\GeminiAiService;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class GeminiModelFallbackTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        config(['services.gemini.api_key' => 'test-key', 'services.gemini.model' => 'gemini-3.8-flash',
            'services.gemini.fallback_models' => ['gemini-3.7-flash', 'gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-2.5-flash-lite'],
            'services.gemini.force_failure' => false]);
        Http::preventStrayRequests();
    }

    public function test_transient_failures_try_models_in_order_and_preserve_payload(): void
    {
        Http::fakeSequence()->push([], 503)->push([], 429)->push([], 503)->push([], 503)
            ->push(['candidates' => [['content' => ['parts' => [['text' => '{"chapters":[]}']]]]]]);
        $result = (new GeminiAiService)->sendMessage([new AiMessageDto('user', 'Course outline')],
            ['max_retries' => 1, 'max_tokens' => 8192, 'response_mime_type' => 'application/json']);
        $this->assertSame('{"chapters":[]}', $result);
        $requests = Http::recorded();
        $this->assertCount(5, $requests);
        foreach (['gemini-3.8-flash', 'gemini-3.7-flash', 'gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-2.5-flash-lite'] as $i => $model) {
            $this->assertStringContainsString('/models/'.$model.':generateContent', $requests[$i][0]->url());
            $this->assertSame($requests[0][0]->data(), $requests[$i][0]->data());
        }
    }

    public function test_primary_success_does_not_call_fallbacks(): void
    {
        Http::fakeSequence()->push(['candidates' => [['content' => ['parts' => [['text' => 'OK']]]]]]);
        $this->assertSame('OK', (new GeminiAiService)->sendMessage([new AiMessageDto('user', 'Hi')]));
        Http::assertSentCount(1);
    }

    public function test_auth_failure_does_not_retry_same_key_across_models(): void
    {
        Http::fakeSequence()->push([], 403);
        try {
            (new GeminiAiService)->sendMessage([new AiMessageDto('user', 'Hi')], ['max_retries' => 1]);
            $this->fail('Expected authentication error');
        } catch (\Exception $e) {
            $this->assertStringContainsString('403', $e->getMessage());
        }
        Http::assertSentCount(1);
    }

    public function test_exhausted_models_raise_transient_error_for_provider_fallback(): void
    {
        Http::fakeSequence()->push([], 503)->push([], 503)->push([], 503)->push([], 503)->push([], 503);
        try {
            (new GeminiAiService)->sendMessage([new AiMessageDto('user', 'Hi')], ['max_retries' => 1]);
            $this->fail('Expected transient error');
        } catch (AiTransientException $e) {
            Http::assertSentCount(5);
        }
    }
}
