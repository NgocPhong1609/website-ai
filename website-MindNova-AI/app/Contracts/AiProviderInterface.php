<?php

namespace App\Contracts;

use App\DTOs\AiMessageDto;

interface AiProviderInterface
{
    /**
     * G?i tin nh?n d?n AI và nh?n ph?n h?i
     *
     * @param array<AiMessageDto> $messages
     * @param array $options (model, temperature, etc)
     * @return string Tr? v? n?i dung ph?n h?i t? AI
     */
    public function sendMessage(array $messages, array $options = []): string;

    /**
     * L?y tên c?a provider (ví d?: openai, gemini)
     */
    public function getProviderName(): string;
}
