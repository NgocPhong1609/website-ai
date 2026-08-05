<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;
use App\Contracts\AiProviderInterface;
use App\DTOs\AiMessageDto;
use App\Models\AiTutorConversation;
use App\Models\AiTutorMessage;
use Illuminate\Support\Facades\DB;

class AiTutorController extends Controller
{
    public function __construct(private AiProviderInterface $aiService)
    {
    }

    public function chat(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
            'lesson_id' => 'nullable|exists:lessons,id'
        ]);

        $user = $request->user();
        $userMessage = $request->input('message');
        $lessonId = $request->input('lesson_id');

        // Tìm hoặc tạo conversation
        $conversation = AiTutorConversation::firstOrCreate([
            'user_id' => $user->id,
            'lesson_id' => $lessonId
        ]);

        // Lưu tin nhắn của user
        AiTutorMessage::create([
            'conversation_id' => $conversation->id,
            'sender' => 'user',
            'message' => $userMessage
        ]);

        $messagesDto = [
            new AiMessageDto('system', 'Bạn là trợ lý ảo MindNova.'),
            new AiMessageDto('user', $userMessage)
        ];

        // Gọi Mock AI Service
        $responseContent = $this->aiService->sendMessage($messagesDto, [
            'user_id' => $user->id,
            'feature' => 'tutor'
        ]);

        // Lưu tin nhắn của AI
        $aiMessage = AiTutorMessage::create([
            'conversation_id' => $conversation->id,
            'sender' => 'ai',
            'message' => $responseContent
        ]);

        return response()->json([
            'message' => $aiMessage->message,
            'conversation_id' => $conversation->id
        ]);
    }
}
