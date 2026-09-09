<?php

namespace App\Services\Ai;

use App\DTOs\AiMessageDto;
use App\Exceptions\AiTransientException;
use Exception;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class GeminiAiService extends AbstractAiService
{
    public function getProviderName(): string
    {
        return 'gemini';
    }

    public function isReady(): bool
    {
        return $this->resolveApiKey() !== null && ! config('services.gemini.force_failure', false);
    }

    private function resolveApiKey(): ?string
    {
        $apiKey = config('services.gemini.api_key');

        return is_string($apiKey) && trim($apiKey) !== '' ? $apiKey : null;
    }

    public function sendMessage(array $messages, array $options = []): string
    {
        $apiKey = $this->resolveApiKey();
        $model = config('services.gemini.model', 'gemini-3.6-flash');
        if ($apiKey === null) {
            $this->recordAttempt($options, $model, microtime(true), 'failed', 'missing_api_key');
            throw new Exception('Chưa cấu hình API key cho Gemini.');
        }
        $url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}";

        // Chuyen doi messages tu AiMessageDto sang format cua Gemini
        $contents = [];
        $systemInstruction = null;

        foreach ($messages as $msg) {
            /** @var AiMessageDto $msg */
            if ($msg->role === 'system') {
                $systemInstruction = [
                    'parts' => [
                        ['text' => $msg->content],
                    ],
                ];
            } else {
                $role = $msg->role === 'user' ? 'user' : 'model';
                $contents[] = [
                    'role' => $role,
                    'parts' => [
                        ['text' => $msg->content],
                    ],
                ];
            }
        }

        $payload = [
            'contents' => $contents,
        ];

        if ($systemInstruction) {
            $payload['systemInstruction'] = $systemInstruction;
        }

        $defaultMaxTokens = match ($options['feature'] ?? 'general') {
            'ai_notification' => 300,
            'quiz', 'self_assessment' => 2500,
            'ai_tutor', 'chat' => 1200,
            default => 1500,
        };

        $generationConfig = [
            'maxOutputTokens' => (int) ($options['max_tokens'] ?? $defaultMaxTokens),
        ];

        if (! empty($options['response_mime_type'])) {
            $generationConfig['responseMimeType'] = $options['response_mime_type'];
        }

        $payload['generationConfig'] = $generationConfig;

        $maxRetries = max(1, (int) ($options['max_retries'] ?? 4));
        $options['request_id'] ??= (string) Str::uuid();

        for ($attempt = 1; $attempt <= $maxRetries; $attempt++) {
            $startedAt = microtime(true);
            try {
                if (config('services.gemini.force_failure', false)) {
                    throw new AiTransientException('Gemini temporarily unavailable');
                }
                $response = Http::withHeaders(['Content-Type' => 'application/json'])
                    ->timeout(90)->post($url, $payload);
            } catch (ConnectionException $exception) {
                $this->recordAttempt($options, $model, $startedAt, 'failed', 'connection_error');
                if ($attempt < $maxRetries) {
                    sleep(2 ** ($attempt - 1));

                    continue;
                }
                // Never retain the original exception: its message/URL may contain credentials.
                throw new AiTransientException('Gemini network temporarily unavailable');
            } catch (AiTransientException $exception) {
                $this->recordAttempt($options, $model, $startedAt, 'failed', 'http_503');
                if ($attempt < $maxRetries) {
                    sleep(2 ** ($attempt - 1));

                    continue;
                }
                throw $exception;
            } catch (Exception $exception) {
                $this->recordAttempt($options, $model, $startedAt, 'failed', 'request_error');
                throw new Exception('Gemini request failed');
            }

            if ($response->successful()) {
                $data = $response->json();
                $content = $data['candidates'][0]['content']['parts'][0]['text'] ?? null;
                $inputTokens = $data['usageMetadata']['promptTokenCount'] ?? null;
                $outputTokens = $data['usageMetadata']['candidatesTokenCount'] ?? null;
                $providerRequestId = $data['responseId'] ?? $response->header('x-request-id');

                if (! is_string($content) || trim($content) === '') {
                    $this->recordAttempt($options, $model, $startedAt, 'failed', 'empty_response',
                        $inputTokens, $outputTokens, $providerRequestId ?: null);
                    if ($attempt < $maxRetries) {
                        continue;
                    }
                    throw new AiTransientException('Gemini returned an empty response');
                }

                $this->recordAttempt($options, $model, $startedAt, 'success', null,
                    $inputTokens, $outputTokens, $providerRequestId ?: null);

                return $content;
            }

            $status = $response->status();
            $this->recordAttempt($options, $model, $startedAt, 'failed', 'http_'.$status);
            if (in_array($status, [429, 500, 502, 503, 504], true)) {
                if ($attempt < $maxRetries) {
                    sleep(2 ** ($attempt - 1));

                    continue;
                }
                throw new AiTransientException('Gemini transient error: '.$status);
            }

            throw new Exception('Loi khi goi Gemini API: '.$status);
        }

        throw new Exception('Gemini request failed');
    }
}
