<?php

namespace App\Services\Ai;

use App\Contracts\ConfiguredAiProviderInterface;
use App\DTOs\AiMessageDto;
use App\Models\AiUsageLog;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

abstract class AbstractAiService implements ConfiguredAiProviderInterface
{
    /**
     * Gửi tin nhắn đến AI và nhận phản hồi
     *
     * @param  array<AiMessageDto>  $messages
     */
    abstract public function sendMessage(array $messages, array $options = []): string;

    /**
     * Log usage metrics to database
     */
    protected function logUsage(?int $userId = null, string $model = '', string $feature = '', int $promptTokens = 0, int $completionTokens = 0, float $estimatedCost = 0, array $requestPayload = [], array $metrics = []): void
    {
        try {
            AiUsageLog::create([
                'user_id' => $userId,
                'actor_type' => $userId ? 'user' : 'system',
                'actor_key' => $userId ? 'user:'.$userId : 'system',
                'provider' => $this->getProviderName(),
                'model' => $model,
                'input_tokens' => $promptTokens,
                'output_tokens' => $completionTokens,
                'cost_estimate' => $estimatedCost,
                'request_id' => $metrics['request_id'] ?? (string) Str::uuid(),
                'provider_request_id' => $metrics['provider_request_id'] ?? null,
                'status' => $metrics['status'] ?? 'success',
                'error_code' => $metrics['error_code'] ?? null,
                'duration_ms' => $metrics['duration_ms'] ?? null,
                'fallback_used' => $metrics['fallback_used'] ?? false,
                'token_source' => $metrics['token_source'] ?? 'unavailable',
                'cost_source' => 'unavailable',
                'cost_amount' => null,
                'cost_currency' => null,
                'meta' => [
                    'feature' => $feature,
                ],
            ]);
        } catch (\Exception $e) {
            // Database exceptions can contain the entire INSERT and its bindings.
            Log::error('Failed to log AI usage', ['provider' => $this->getProviderName()]);
        }
    }

    protected function recordAttempt(array $options, string $model, float $startedAt, string $status, ?string $errorCode = null, ?int $inputTokens = null, ?int $outputTokens = null, ?string $providerRequestId = null): void
    {
        $this->logUsage($options['user_id'] ?? null, $model, $options['feature'] ?? 'general',
            $inputTokens ?? 0, $outputTokens ?? 0, 0, [], [
                'request_id' => $options['request_id'] ?? null,
                'provider_request_id' => $providerRequestId,
                'status' => $status,
                'error_code' => $errorCode,
                'duration_ms' => (int) round((microtime(true) - $startedAt) * 1000),
                'fallback_used' => (bool) ($options['fallback_used'] ?? false),
                'token_source' => $inputTokens !== null && $outputTokens !== null ? 'provider' : 'unavailable',
            ]);
    }
}
