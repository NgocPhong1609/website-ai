<?php

namespace App\Services\Ai;

use App\Contracts\AiProviderInterface;
use App\DTOs\AiMessageDto;
use App\Models\AiUsageLog;
use Illuminate\Support\Facades\Log;

abstract class AbstractAiService implements AiProviderInterface
{
    /**
     * Gửi tin nhắn đến AI và nhận phản hồi
     *
     * @param array<AiMessageDto> $messages
     * @param array $options
     * @return string
     */
    abstract public function sendMessage(array $messages, array $options = []): string;

    /**
     * Log usage metrics to database
     */
    protected function logUsage(?int $userId = null, string $model = '', string $feature = '', int $promptTokens = 0, int $completionTokens = 0, float $estimatedCost = 0, array $requestPayload = []): void
    {
        try {
            AiUsageLog::create([
                "user_id" => $userId,
                "actor_type" => $userId ? "user" : "system",
                "actor_key" => $userId ? "user:" . $userId : "system",
                "provider" => $this->getProviderName(),
                "model" => $model,
                "input_tokens" => $promptTokens,
                "output_tokens" => $completionTokens,
                "cost_estimate" => $estimatedCost,
                "meta" => [
                    "feature" => $feature,
                    "request_payload" => $requestPayload,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error("Failed to log AI usage: " . $e->getMessage());
        }
    }

}
