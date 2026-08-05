<?php

namespace App\Services\Ai;

use App\Contracts\AiProviderInterface;
use App\DTOs\AiMessageDto;
use App\Models\AiUsageLog;
use Illuminate\Support\Facades\Log;

abstract class AbstractAiService implements AiProviderInterface
{
    /**
     * G?i tin nh?n d?n AI và nh?n ph?n h?i
     *
     * @param array<AiMessageDto> $messages
     * @param array $options
     * @return string
     */
    abstract public function sendMessage(array $messages, array $options = []): string;

    /**
     * Log usage metrics to database
     */
    protected function logUsage(int $userId, string $model, string $feature, int $promptTokens, int $completionTokens, float $estimatedCost = 0, array $requestPayload = []): void
    {
        try {
            AiUsageLog::create([
                "user_id" => $userId,
                "provider" => $this->getProviderName(),
                "model" => $model,
                "feature" => $feature,
                "prompt_tokens" => $promptTokens,
                "completion_tokens" => $completionTokens,
                "total_tokens" => $promptTokens + $completionTokens,
                "estimated_cost" => $estimatedCost,
                "request_payload" => json_encode($requestPayload),
            ]);
        } catch (\Exception $e) {
            Log::error("Failed to log AI usage: " . $e->getMessage());
        }
    }
}
