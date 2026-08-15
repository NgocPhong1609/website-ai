<?php

namespace Tests\Feature;

use App\Services\Ai\AiRouterService;
use App\Services\Ai\GeminiAiService;
use App\Services\Ai\BackupAiService;
use App\DTOs\AiMessageDto;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Config;
use Tests\TestCase;

class AiFallbackTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        
        // Mock configurations
        Config::set('services.gemini.api_key', 'fake-gemini-key');
        Config::set('services.backup_ai.api_key', 'fake-backup-key');
    }

    public function test_case_1_gemini_success_returns_gemini_result_and_backup_not_called()
    {
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response([
                'candidates' => [
                    ['content' => ['parts' => [['text' => 'gemini_response']]]]
                ],
                'usageMetadata' => ['promptTokenCount' => 10, 'candidatesTokenCount' => 10]
            ], 200),
            'api.openai.com/*' => Http::response([], 500) // Should not be called
        ]);

        $router = app(AiRouterService::class);
        
        $messages = [new AiMessageDto('user', 'Hello')];
        $result = $router->sendMessageWithFallback($messages);
        
        $this->assertEquals('gemini_response', $result['content']);
        $this->assertEquals('gemini', $result['meta']['provider']);
        $this->assertFalse($result['meta']['fallbackUsed']);
        
        Http::assertSentCount(1);
    }

    public function test_case_2_gemini_503_then_success_returns_gemini_result()
    {
        Http::fakeSequence('generativelanguage.googleapis.com/*')
            ->push('Service Unavailable', 503)
            ->push([
                'candidates' => [
                    ['content' => ['parts' => [['text' => 'gemini_response']]]]
                ],
                'usageMetadata' => ['promptTokenCount' => 10, 'candidatesTokenCount' => 10]
            ], 200);

        $router = app(AiRouterService::class);
        
        $messages = [new AiMessageDto('user', 'Hello')];
        $result = $router->sendMessageWithFallback($messages);
        
        $this->assertEquals('gemini_response', $result['content']);
        $this->assertEquals('gemini', $result['meta']['provider']);
        $this->assertFalse($result['meta']['fallbackUsed']);
        
        // 1 retry + 1 success = 2 requests to Gemini
        Http::assertSentCount(2); 
    }

    public function test_case_3_gemini_503_twice_then_backup_success()
    {
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::sequence()
                ->push('Service Unavailable', 503)
                ->push('Service Unavailable', 503),
            'api.openai.com/*' => Http::response([
                'choices' => [
                    ['message' => ['content' => 'backup_response']]
                ],
                'usage' => ['prompt_tokens' => 10, 'completion_tokens' => 10]
            ], 200)
        ]);

        $router = app(AiRouterService::class);
        
        $messages = [new AiMessageDto('user', 'Hello')];
        $result = $router->sendMessageWithFallback($messages);
        
        $this->assertEquals('backup_response', $result['content']);
        $this->assertEquals('backup', $result['meta']['provider']);
        $this->assertTrue($result['meta']['fallbackUsed']);
        
        Http::assertSentCount(3); // 2 gemini, 1 backup
    }

    public function test_case_4_gemini_401_no_fallback()
    {
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response('Unauthorized', 401),
            'api.openai.com/*' => Http::response([], 200) // Should not be called
        ]);

        $router = app(AiRouterService::class);
        
        $messages = [new AiMessageDto('user', 'Hello')];
        
        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('Loi khi goi Gemini API: 401');
        
        $router->sendMessageWithFallback($messages);
    }

    public function test_case_5_gemini_503_and_backup_503_throws_exception()
    {
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::sequence()
                ->push('Service Unavailable', 503)
                ->push('Service Unavailable', 503),
            'api.openai.com/*' => Http::response('Service Unavailable', 503)
        ]);

        $router = app(AiRouterService::class);
        
        $messages = [new AiMessageDto('user', 'Hello')];
        
        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('Tất cả các dịch vụ AI đều gặp sự cố');
        
        $router->sendMessageWithFallback($messages);
    }

    public function test_case_6_gemini_and_backup_receive_same_prompt()
    {
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::sequence()
                ->push('Service Unavailable', 503)
                ->push('Service Unavailable', 503),
            'api.openai.com/*' => Http::response([
                'choices' => [
                    ['message' => ['content' => 'backup_response']]
                ],
                'usage' => ['prompt_tokens' => 10, 'completion_tokens' => 10]
            ], 200)
        ]);

        $router = app(AiRouterService::class);
        
        $systemPrompt = "This is system prompt";
        $userPrompt = "This is user prompt";
        $messages = [
            new AiMessageDto('system', $systemPrompt),
            new AiMessageDto('user', $userPrompt)
        ];
        
        $router->sendMessageWithFallback($messages);
        
        $recorded = Http::recorded();
        
        $geminiRequest = $recorded[0][0]; // first request is gemini
        $backupRequest = $recorded[2][0]; // third request is backup (after 2 gemini fails)
        
        $geminiPayload = $geminiRequest->data();
        $backupPayload = $backupRequest->data();
        
        // Assert system prompt
        $this->assertEquals($systemPrompt, $geminiPayload['systemInstruction']['parts'][0]['text']);
        $this->assertEquals($systemPrompt, $backupPayload['messages'][0]['content']);
        $this->assertEquals('system', $backupPayload['messages'][0]['role']);
        
        // Assert user prompt
        $this->assertEquals($userPrompt, $geminiPayload['contents'][0]['parts'][0]['text']);
        $this->assertEquals($userPrompt, $backupPayload['messages'][1]['content']);
        $this->assertEquals('user', $backupPayload['messages'][1]['role']);
    }
}
