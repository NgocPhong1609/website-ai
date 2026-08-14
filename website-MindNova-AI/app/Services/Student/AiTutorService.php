<?php

namespace App\Services\Student;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class AiTutorService
{
    private const ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

    private const SYSTEM_PROMPT = <<<'PROMPT'
Bạn là Nova, trợ lý học tập AI của nền tảng MindNova. Nhiệm vụ của bạn là hỗ trợ học sinh:
- Giải thích khái niệm khó bằng ngôn ngữ dễ hiểu, có ví dụ.
- Tóm tắt nội dung khóa học khi được yêu cầu.
- Đặt câu hỏi kiểm tra kiến thức và nhận xét câu trả lời của học sinh.
- Gợi ý kế hoạch học tập phù hợp.
Luôn trả lời bằng tiếng Việt, ngắn gọn, thân thiện và khích lệ tinh thần học tập.
PROMPT;

    /**
     * Send a chat message to Groq and return the assistant's reply.
     *
     * @param  array<int, array{role: string, content: string}>  $history
     */
    public function ask(string $message, array $history = []): string
    {
        $apiKey = config('services.groq.key');

        if (blank($apiKey)) {
            throw new RuntimeException('Groq API key chưa được cấu hình (GROQ_API_KEY).');
        }

        $messages = array_merge(
            [['role' => 'system', 'content' => self::SYSTEM_PROMPT]],
            $history,
            [['role' => 'user', 'content' => $message]]
        );

        $response = Http::withToken($apiKey)
            ->timeout(30)
            ->post(self::ENDPOINT, [
                'model' => config('services.groq.model'),
                'messages' => $messages,
                'temperature' => 0.6,
                'max_tokens' => 800,
            ]);

        if ($response->failed()) {
            Log::error('Groq AI tutor request failed', ['body' => $response->body()]);

            throw new RuntimeException('Không thể kết nối tới dịch vụ AI. Vui lòng thử lại sau.');
        }

        $reply = $response->json('choices.0.message.content');

        if (blank($reply)) {
            throw new RuntimeException('Dịch vụ AI không trả về nội dung hợp lệ.');
        }

        return trim($reply);
    }
}
