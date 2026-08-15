<?php

namespace App\Http\Resources\Student;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AiChatResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->resource['id'] ?? uniqid('msg-'),
            'sender' => $this->resource['sender'] ?? 'ai',
            'timestamp' => $this->resource['timestamp'] ?? now()->format('h:i A'),
            'text' => $this->resource['text'] ?? '',
        ];
    }
}
