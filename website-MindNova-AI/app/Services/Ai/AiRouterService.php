<?php

namespace App\Services\Ai;

use App\Contracts\AiProviderInterface;
use App\DTOs\AiMessageDto;
use App\Exceptions\AiTransientException;
use Illuminate\Support\Facades\Log;
use Exception;

class AiRouterService
{
    private array $providers;

    public function __construct(
        private readonly AiProviderInterface $primaryProvider, // Gemini
        private readonly AiProviderInterface $backupProvider   // Backup AI
    ) {
        $this->providers = [
            'primary' => $primaryProvider,
            'backup' => $backupProvider
        ];
    }

    /**
     * Gửi tin nhắn qua Router.
     * Sử dụng Primary trước. Nếu có lỗi tạm thời, retry tuỳ thuộc max_retries của primary.
     * Nếu vẫn lỗi tạm thời, fallback sang Backup AI.
     */
    public function sendMessageWithFallback(array $messages, array $options = []): array
    {
        $requestId = uniqid('ai_req_');
        $startTime = microtime(true);
        $primaryOptions = array_merge($options, ['max_retries' => 2]); // Total 2 attempts (1 initial + 1 retry)
        $backupOptions = array_merge($options, ['max_retries' => 1]);  // Total 1 attempt (0 retries)

        $primaryError = "Unknown error";
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
                    'durationMs' => $duration
                ]
            ];
            
        } catch (\Throwable $e) {
            $primaryError = $e->getMessage();
            Log::warning("[AI Router] Primary provider failed ({$this->primaryProvider->getProviderName()}): {$e->getMessage()}");
            Log::warning("[AI Router] Switching to Backup AI provider ({$this->backupProvider->getProviderName()})");
        }

        // Fallback execution
        try {
            $fallbackStartTime = microtime(true);
            Log::info("[AI Router] Backup provider: {$this->backupProvider->getProviderName()}");
            Log::info("[AI Router] Backup request started");
            $response = $this->backupProvider->sendMessage($messages, $backupOptions);
            
            $duration = round((microtime(true) - $fallbackStartTime) * 1000);
            $totalDuration = round((microtime(true) - $startTime) * 1000);
            Log::info("[AI Router] Backup request succeeded");
            Log::info("[AI Router] fallbackUsed=true");

            return [
                'content' => $response,
                'meta' => [
                    'provider' => $this->backupProvider->getProviderName(),
                    'fallbackUsed' => true,
                    'requestId' => $requestId,
                    'durationMs' => $totalDuration
                ]
            ];
            
        } catch (Exception $e) {
            $duration = round((microtime(true) - $startTime) * 1000);
            Log::error("[AI Router] Backup failed: {$e->getMessage()}. Total Duration: {$duration}ms");
            
            $backupError = $e->getMessage();
            throw new Exception("Tất cả các dịch vụ AI đều gặp sự cố. Lỗi Primary: {$primaryError} | Lỗi Backup: {$backupError}", 0, $e);
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
