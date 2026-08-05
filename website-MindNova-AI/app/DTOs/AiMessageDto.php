<?php

namespace App\DTOs;

class AiMessageDto
{
    public function __construct(
        public readonly string $role, // system, user, assistant
        public readonly string $content
    ) {}

    public function toArray(): array
    {
        return [
            "role" => $this->role,
            "content" => $this->content,
        ];
    }
}
