<?php

namespace App\Services\Ai;

class MockAiService extends AbstractAiService
{
    public function isReady(): bool
    {
        return true;
    }

    public function getProviderName(): string
    {
        return 'mock_ai';
    }

    public function sendMessage(array $messages, array $options = []): string
    {
        $userId = $options['user_id'] ?? 1;
        $feature = $options['feature'] ?? 'unknown';
        $model = $options['model'] ?? 'mock-model';

        // Gia lap xu ly cua AI
        $responseContent = 'Day la cau tra loi gia lap tu Mock AI. Toi co the giup gi them cho ban?';

        // Ghi log
        $this->logUsage($userId, $model, $feature, 10, 20, 0.0001, ['messages' => count($messages)]);

        return $responseContent;
    }
}
