<?php

namespace Tests\Feature\Student;

use App\DTOs\AiMessageDto;
use App\Models\User;
use App\Services\Ai\GeminiAiService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class GeminiAiServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_gemini_service_sends_correct_payload_and_logs_usage()
    {
        config(['services.gemini.api_key' => 'fake-gemini-key']);
        $user = User::factory()->create();

        // Fake Http response
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response([
                'candidates' => [
                    [
                        'content' => [
                            'parts' => [
                                ['text' => 'This is a mocked Gemini response'],
                            ],
                        ],
                    ],
                ],
                'usageMetadata' => [
                    'promptTokenCount' => 15,
                    'candidatesTokenCount' => 25,
                ],
            ], 200),
        ]);

        $service = new GeminiAiService;
        $messages = [
            new AiMessageDto('system', 'You are a helpful tutor.'),
            new AiMessageDto('user', 'Hello Gemini!'),
        ];

        $response = $service->sendMessage($messages, [
            'user_id' => $user->id,
            'feature' => 'tutor_test',
        ]);

        $this->assertEquals('This is a mocked Gemini response', $response);

        // Assert request payload
        Http::assertSent(function ($request) {
            $payload = $request->data();

            return isset($payload['systemInstruction']) &&
                   $payload['systemInstruction']['parts'][0]['text'] === 'You are a helpful tutor.' &&
                   $payload['contents'][0]['role'] === 'user' &&
                   $payload['contents'][0]['parts'][0]['text'] === 'Hello Gemini!';
        });

        // Assert log was created
        $this->assertDatabaseHas('ai_usage_logs', [
            'user_id' => $user->id,
            'provider' => 'gemini',
            'meta->feature' => 'tutor_test',
            'input_tokens' => 15,
            'output_tokens' => 25,
            'token_source' => 'provider',
        ]);
    }
}
