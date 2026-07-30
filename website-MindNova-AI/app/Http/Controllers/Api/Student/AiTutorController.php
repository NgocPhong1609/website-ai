<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;
use OpenAI;

class AiTutorController extends Controller
{
    public function streamChat(Request $request)
    {
        // Lấy câu hỏi từ Frontend gửi lên
        $userMessage = $request->input('message', '');

        return new StreamedResponse(function () use ($userMessage) {
            // Khởi tạo Client, ép trỏ sang Base URL của Groq thay vì OpenAI
            $client = OpenAI::factory()
                ->withApiKey(env('GROQ_API_KEY'))
                ->withBaseUri('https://api.groq.com/openai/v1')
                ->make();

            // Gọi API với model miễn phí siêu tốc độ của Groq
            $stream = $client->chat()->createStreamed([
                'model' => 'llama-3.1-8b-instant',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'Bạn là Nova, một trợ lý học tập AI thân thiện, trả lời ngắn gọn, dễ hiểu và luôn dùng tiếng Việt.'
                    ],
                    [
                        'role' => 'user',
                        'content' => $userMessage
                    ],
                ],
            ]);

            // Xử lý luồng stream trả về
            foreach ($stream as $response) {
                $text = $response->choices[0]->delta->content;
                if (isset($text)) {
                    // Đẩy từng cụm từ về Frontend
                    echo $text;
                    ob_flush();
                    flush();
                }
            }
        }, 200, [
            'Content-Type' => 'text/event-stream',
            'Cache-Control' => 'no-cache',
            'Connection' => 'keep-alive',
            'X-Accel-Buffering' => 'no',
        ]);
    }
}
