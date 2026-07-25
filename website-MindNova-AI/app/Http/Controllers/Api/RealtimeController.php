<?php

namespace App\Http\Controllers\Api;

use App\Events\MessageSent;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RealtimeController extends Controller
{
    public function send(Request $request): JsonResponse
    {
        $data = $request->validate([
            'sender_id' => ['required', 'integer', 'exists:users,id'],
            'recipient_id' => ['nullable', 'integer', 'exists:users,id'],
            'content' => ['required', 'string', 'max:2000'],
            'channel' => ['nullable', 'string', 'max:100'],
            'metadata' => ['nullable', 'array'],
        ]);

        $payload = [
            'sender_id' => $data['sender_id'],
            'recipient_id' => $data['recipient_id'] ?? null,
            'content' => $data['content'],
            'channel' => $data['channel'] ?? 'public',
            'metadata' => $data['metadata'] ?? [],
            'sent_at' => now()->toDateTimeString(),
        ];

        event(new MessageSent($payload));

        return response()->json(['message' => 'Realtime message sent.', 'data' => $payload]);
    }
}
