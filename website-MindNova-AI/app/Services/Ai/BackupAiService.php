<?php

namespace App\Services\Ai;

use App\DTOs\AiMessageDto;
use App\Contracts\AiProviderInterface;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

class BackupAiService extends AbstractAiService
{
    public function getProviderName(): string
    {
        return "backup";
    }

    public function sendMessage(array $messages, array $options = []): string
    {
        $provider = env('BACKUP_AI_PROVIDER', 'openai');
        $apiKey = config('services.backup_ai.api_key');
        
        if (empty($apiKey)) {
            if ($provider === 'groq') {
                $apiKey = env('GROQ_API_KEY');
            } else {
                $apiKey = env('OPENAI_API_KEY') ?: config('services.openai.key'); // fallback to old config
            }
        }
        
        if (empty($apiKey)) {
            throw new Exception("Chưa cấu hình API key cho Backup AI.");
        }

        $model = config('services.backup_ai.model', 'gpt-4o-mini');
        
        $openAiMessages = [];
        foreach ($messages as $msg) {
            /** @var AiMessageDto $msg */
            $openAiMessages[] = [
                'role' => $msg->role,
                'content' => $msg->content
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
        
        if (!empty($options['response_mime_type']) && $options['response_mime_type'] === 'application/json') {
            $payload['response_format'] = ['type' => 'json_object'];
        }

        $maxRetries = $options['max_retries'] ?? 1;
        $lastException = null;

        $baseUrl = 'https://api.openai.com/v1/chat/completions';
        if ($provider === 'groq') {
            $baseUrl = 'https://api.groq.com/openai/v1/chat/completions';
        }

        for ($attempt = 1; $attempt <= $maxRetries; $attempt++) {
            try {
                $response = Http::withToken($apiKey)
                    ->timeout(90)
                    ->post($baseUrl, $payload);

                if ($response->successful()) {
                    $responseContent = $response->json('choices.0.message.content') ?? '';
                    
                    // Trich xuat usage metadata
                    $data = $response->json();
                    $promptTokens = $data['usage']['prompt_tokens'] ?? 0;
                    $completionTokens = $data['usage']['completion_tokens'] ?? 0;
                    
                    $userId = $options["user_id"] ?? null;
                    $feature = $options["feature"] ?? "general";
                    $this->logUsage($userId, $model, $feature, $promptTokens, $completionTokens, 0, $payload);

                    return $responseContent;
                }
                
                // Transient error handle
                if (in_array($response->status(), [503, 429, 500, 502, 504]) && $attempt <= $maxRetries) {
                    if ($attempt < $maxRetries) {
                        $waitSeconds = pow(2, $attempt - 1);
                        Log::warning("Backup AI returned {$response->status()}, retrying in {$waitSeconds}s (attempt {$attempt}/{$maxRetries})");
                        sleep($waitSeconds);
                        continue;
                    } else {
                        Log::error("Backup AI Error: Transient error {$response->status()} after {$maxRetries} attempts. " . $response->body());
                        throw new \App\Exceptions\AiTransientException("Backup AI transient error: " . $response->status());
                    }
                }

                Log::error("Backup AI Error (" . $response->status() . "): " . $response->body());
                throw new Exception("Lỗi khi gọi Backup AI API ({$response->status()}): " . $response->body());

            } catch (Exception $e) {
                $lastException = $e;
                if ($e instanceof \App\Exceptions\AiTransientException) {
                    throw $e;
                }
                
                $isNetworkError = $e instanceof \Illuminate\Http\Client\ConnectionException || str_contains($e->getMessage(), 'cURL error');
                if ($isNetworkError && $attempt <= $maxRetries) {
                    if ($attempt < $maxRetries) {
                        $waitSeconds = pow(2, $attempt - 1);
                        Log::warning("Backup AI Network Exception on attempt {$attempt}: {$e->getMessage()}, retrying in {$waitSeconds}s");
                        sleep($waitSeconds);
                        continue;
                    } else {
                        throw new \App\Exceptions\AiTransientException("Backup AI network transient error: " . $e->getMessage());
                    }
                }

                Log::error("Backup AI Exception after {$maxRetries} attempts: " . $e->getMessage());
                throw $e;
            }
        }

        throw $lastException ?? new Exception("Backup AI failed after {$maxRetries} attempts");
    }
}
