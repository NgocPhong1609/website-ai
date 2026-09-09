<?php

namespace App\Services\Ai;

use App\Contracts\AiProviderInterface;
use App\Exceptions\AiTransientException;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class AiRouterService
{
    private array $providers;

    public function __construct(
        private readonly AiProviderInterface $primaryProvider, // Gemini
        private readonly AiProviderInterface $backupProvider   // Backup AI
    ) {
        $this->providers = [
            'primary' => $primaryProvider,
            'backup' => $backupProvider,
        ];
    }

    /**
     * Gửi tin nhắn qua Router.
     * Sử dụng Primary trước. Nếu có lỗi tạm thời, retry tuỳ thuộc max_retries của primary.
     * Nếu vẫn lỗi tạm thời, fallback sang Backup AI.
     */
    public function sendMessageWithFallback(array $messages, array $options = []): array
    {
        $requestId = (string) Str::uuid();
        $startTime = microtime(true);
        $primaryOptions = array_merge($options, ['max_retries' => 2, 'request_id' => $requestId, 'fallback_used' => false]); // Total 2 attempts
        $backupOptions = array_merge($options, ['max_retries' => 1, 'request_id' => $requestId, 'fallback_used' => true]); // Total 1 attempt

        try {
            Log::info("[AI Router] Primary provider: {$this->primaryProvider->getProviderName()}");
            $response = $this->primaryProvider->sendMessage($messages, $primaryOptions);

            $duration = round((microtime(true) - $startTime) * 1000);
            Log::info("AI Request Route: [{$requestId}] Primary Success. Duration: {$duration}ms");

            return [
                'content' => $response,
                'meta' => [
                    'provider' => $this->primaryProvider->getProviderName(),
                    'fallbackUsed' => false,
                    'requestId' => $requestId,
                    'durationMs' => $duration,
                ],
            ];

        } catch (AiTransientException $e) {
            Log::warning("[AI Router] Primary provider unavailable ({$this->primaryProvider->getProviderName()})", ['request_id' => $requestId]);
            Log::warning("[AI Router] Switching to Backup AI provider ({$this->backupProvider->getProviderName()})");
        }

        // Fallback execution
        try {
            $fallbackStartTime = microtime(true);
            Log::info("[AI Router] Backup provider: {$this->backupProvider->getProviderName()}");
            Log::info('[AI Router] Backup request started');
            $response = $this->backupProvider->sendMessage($messages, $backupOptions);

            $duration = round((microtime(true) - $fallbackStartTime) * 1000);
            $totalDuration = round((microtime(true) - $startTime) * 1000);
            Log::info('[AI Router] Backup request succeeded');
            Log::info('[AI Router] fallbackUsed=true');

            return [
                'content' => $response,
                'meta' => [
                    'provider' => $this->backupProvider->getProviderName(),
                    'fallbackUsed' => true,
                    'requestId' => $requestId,
                    'durationMs' => $totalDuration,
                ],
            ];

        } catch (Exception $e) {
            $duration = round((microtime(true) - $startTime) * 1000);
            Log::error("[AI Router] Backup failed. Total Duration: {$duration}ms", ['request_id' => $requestId]);
            throw new Exception('Tất cả các dịch vụ AI đều gặp sự cố. Vui lòng thử lại sau.');
        }
    }

    /**
     * Compatibility wrapper for services expecting a direct string response from sendMessage.
     */
    public function sendMessage(array $messages, array|string $options = []): string
    {
        $opts = is_array($options) ? $options : ['response_format' => $options];
        $res = $this->sendMessageWithFallback($messages, $opts);

        return $res['content'] ?? '';
    }
}
