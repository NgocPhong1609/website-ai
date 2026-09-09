<?php

namespace App\Services\Ai;

use App\DTOs\AiMessageDto;
use App\Exceptions\AiTransientException;
use Exception;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class BackupAiService extends AbstractAiService
{
    public function getProviderName(): string
    {
        return 'backup';
    }

    public function sendMessage(array $messages, array $options = []): string
    {
        $provider = config('services.backup_ai.provider', 'openai');
        $apiKey = config('services.backup_ai.api_key');

        if (empty($apiKey)) {
            if ($provider === 'groq') {
                $apiKey = config('services.groq.key');
            } else {
                $apiKey = config('services.openai.key');
            }
        }

        if (empty($apiKey)) {
            $this->recordAttempt($options, config('services.backup_ai.model', 'gpt-4o-mini'), microtime(true), 'failed', 'missing_api_key');
            throw new Exception('Chưa cấu hình API key cho Backup AI.');
        }

        $model = config('services.backup_ai.model', 'gpt-4o-mini');

        $openAiMessages = [];
        foreach ($messages as $msg) {
            /** @var AiMessageDto $msg */
            $openAiMessages[] = [
                'role' => $msg->role,
                'content' => $msg->content,
            ];
        }

        $defaultMaxTokens = match ($options['feature'] ?? 'general') {
            'ai_notification' => 300,
            'quiz', 'self_assessment' => 2500,
            'ai_tutor', 'chat' => 1200,
            default => 1500,
        };

        $payload = [
            'model' => $model,
            'messages' => $openAiMessages,
            'temperature' => 0.7,
            'max_tokens' => (int) ($options['max_tokens'] ?? $defaultMaxTokens),
        ];

        if (! empty($options['response_mime_type']) && $options['response_mime_type'] === 'application/json') {
            $payload['response_format'] = ['type' => 'json_object'];
        }

        $maxRetries = max(1, (int) ($options['max_retries'] ?? 1));
        $options['request_id'] ??= (string) Str::uuid();

        $baseUrl = $provider === 'groq'
            ? 'https://api.groq.com/openai/v1/chat/completions'
            : 'https://api.openai.com/v1/chat/completions';

        for ($attempt = 1; $attempt <= $maxRetries; $attempt++) {
            $startedAt = microtime(true);
            try {
                $response = Http::withToken($apiKey)->timeout(90)->post($baseUrl, $payload);
            } catch (ConnectionException $exception) {
                $this->recordAttempt($options, $model, $startedAt, 'failed', 'connection_error');
                if ($attempt < $maxRetries) {
                    sleep(2 ** ($attempt - 1));

                    continue;
                }
                // Never retain the original exception: its message/URL may contain credentials.
                throw new AiTransientException('Backup network temporarily unavailable');
            } catch (Exception $exception) {
                $this->recordAttempt($options, $model, $startedAt, 'failed', 'request_error');
                throw new Exception('Backup request failed');
            }

            if ($response->successful()) {
                $content = $response->json('choices.0.message.content') ?? '';
                $inputTokens = $response->json('usage.prompt_tokens');
                $outputTokens = $response->json('usage.completion_tokens');
                $providerRequestId = $response->json('id') ?? $response->header('x-request-id');

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
                throw new AiTransientException('Backup transient error: '.$status);
            }

            throw new Exception('Lỗi khi gọi Backup AI API: '.$status);
        }

        throw new Exception('Backup request failed');
    }
}
