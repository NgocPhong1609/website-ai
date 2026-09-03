<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use App\Models\AiGeneratedQuiz;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AiQuizGeneratorController extends Controller
{
    public function generate(Request $request)
    {
        $validated = $request->validate([
            'topic' => 'required|string|max:255',
            'title' => 'nullable|string|max:255',
            'question_count' => 'required|integer|min:1|max:30',
            'difficulty' => 'required|string',
            'question_types' => 'required|array',
            'time_limit_minutes' => 'required|integer|min:0|max:180',
            'custom_prompt' => 'nullable|string|max:1000',
        ]);

        $userId = auth('sanctum')->id() ?? request()->user('sanctum')?->id ?? 201;
        $groqKey = env('GROQ_API_KEY');

        if (!$groqKey) {
            return response()->json(['message' => 'Chưa cấu hình GROQ_API_KEY trong file .env'], 500);
        }

        $targetCount = (int)$validated['question_count'];
        $typesString = implode(', ', $validated['question_types']);

        $systemPrompt = <<<PROMPT
Bạn là Giảng viên Đại học và Chuyên gia Khảo thí chuyên sâu. Nhiệm vụ của bạn là soạn bộ đề thi thực chiến bằng TIẾNG VIỆT dưới định dạng JSON thuần túy (không bọc markdown, không thêm bất kỳ lời chào nào ngoài JSON).

TIÊU CHÍ BẮT BUỘC:
1. SỐ LƯỢNG: Bắt buộc tạo ĐỦ CHÍNH XÁC {$targetCount} CÂU HỎI trong mảng "questions", đánh số ID tăng dần từ 1 đến {$targetCount}.
2. TÍNH TOÁN THỰC CHIẾN 100%:
   - Môn Toán / Tự nhiên: Mỗi câu hỏi PHẢI là một bài toán cụ thể kèm hàm số, phương trình, số liệu tính toán (khai triển nhị thức Newton, cực trị hàm số, tích phân, hình không gian, xác suất...). TUYỆT ĐỐI KHÔNG hỏi lý thuyết sáo rỗng.
   - Tin học / Lập trình: PHẢI có đoạn mã code, bài toán debug, phân tích output.
3. PHÂN LOẠI DẠNG BÀI:
   - "Trắc nghiệm": type = "multiple_choice", options gồm 4 đáp án số liệu ["A. ...", "B. ...", "C. ...", "D. ..."], correct_answer là "A"|"B"|"C"|"D".
   - "Đúng / Sai": type = "true_false", options gồm ["A. Đúng", "B. Sai"], correct_answer là "A" hoặc "B".
   - "Điền vào chỗ trống": type = "fill_blank", options = [], correct_answer là số/kết quả tính toán ngắn gọn.
   - "Tự luận ngắn": type = "essay", options = [], correct_answer là đáp số và tóm tắt bước giải.
4. LỜI GIẢI (explanation): Trình bày ngắn gọn công thức toán học và các bước tính ra đáp án.

ĐỊNH DẠNG JSON YÊU CẦU:
{
  "title": "Tên bài thi",
  "description": "Mô tả bài thi",
  "questions": [
    {
      "id": 1,
      "type": "multiple_choice",
      "question": "Nội dung bài toán...",
      "options": ["A. Đáp án 1", "B. Đáp án 2", "C. Đáp án 3", "D. Đáp án 4"],
      "correct_answer": "A",
      "explanation": "Công thức và các bước tính..."
    }
  ]
}
PROMPT;

        $userPrompt = "Soạn đề thi bài tập thực tế gồm chính xác {$targetCount} câu hỏi:\n"
            . "- Chủ đề: " . $validated['topic'] . "\n"
            . ($validated['title'] ? "- Tiêu đề: " . $validated['title'] . "\n" : "")
            . "- Số lượng: ĐỦ {$targetCount} câu hỏi (id từ 1 đến {$targetCount})\n"
            . "- Mức độ: " . $validated['difficulty'] . "\n"
            . "- Các dạng bài bắt buộc: " . $typesString . "\n"
            . ($validated['custom_prompt'] ? "- Yêu cầu thêm: " . $validated['custom_prompt'] . "\n" : "");

        // Priority static model selection (avoids wasteful extra cURL request per user call)
        $availableModels = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'];

        $aiData = null;
        $lastError = '';

        foreach ($availableModels as $model) {
            $payload = [
                'model' => $model,
                'messages' => [
                    ['role' => 'system', 'content' => $systemPrompt],
                    ['role' => 'user', 'content' => $userPrompt],
                ],
                'temperature' => 0.35,
                'max_tokens' => 2500,
            ];

            $ch = curl_init('https://api.groq.com/openai/v1/chat/completions');
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Authorization: Bearer ' . trim($groqKey),
                'Content-Type: application/json',
            ]);
            curl_setopt($ch, CURLOPT_PROXY, '');
            curl_setopt($ch, CURLOPT_NOPROXY, '*');
            curl_setopt($ch, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
            curl_setopt($ch, CURLOPT_TIMEOUT, 45);

            $responseBody = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $curlError = curl_error($ch);
            curl_close($ch);

            if ($curlError) {
                $lastError = 'Lỗi kết nối mạng cURL: ' . $curlError;
                continue;
            }

            if ($httpCode === 200 && $responseBody) {
                $response = json_decode($responseBody, true);
                $rawContent = $response['choices'][0]['message']['content'] ?? '';

                $clean = trim($rawContent);
                if (preg_match('/\{[\s\S]*\}/', $clean, $matches)) {
                    $clean = $matches[0];
                }

                $parsed = json_decode($clean, true);
                if (is_array($parsed) && !isset($parsed['questions']) && isset($parsed[0]['question'])) {
                    $parsed = [
                        'title' => $validated['title'] ?: 'Đề thi: ' . $validated['topic'],
                        'questions' => $parsed
                    ];
                }

                if (isset($parsed['questions']) && is_array($parsed['questions']) && !empty($parsed['questions'])) {
                    $aiData = $parsed;
                    break;
                }
            } else {
                $errRes = json_decode($responseBody, true);
                $lastError = $errRes['error']['message'] ?? ("HTTP " . $httpCode);
                Log::warning("Model {$model} failed: " . $lastError);
            }
        }

        if (!$aiData || !isset($aiData['questions']) || empty($aiData['questions'])) {
            return response()->json(['message' => 'Lỗi từ Groq AI: ' . ($lastError ?: 'Không thể tạo đề thi lúc này.')], 500);
        }

        $questions = $aiData['questions'];

        foreach ($questions as $idx => &$q) {
            $q['id'] = $idx + 1;
        }

        try {
            $quiz = AiGeneratedQuiz::create([
                'user_id' => $userId,
                'title' => $validated['title'] ?: ($aiData['title'] ?? ('Đề thi: ' . $validated['topic'])),
                'topic' => $validated['topic'],
                'difficulty' => $validated['difficulty'],
                'questions_count' => count($questions),
                'time_limit_minutes' => $validated['time_limit_minutes'],
                'passing_percentage' => 70,
                'description' => $aiData['description'] ?? 'Đề thi thực chiến tạo bởi MindNova AI.',
                'questions_data' => $questions,
                'is_completed' => false,
            ]);

            return response()->json([
                'success' => true,
                'data' => $quiz,
            ]);
        } catch (\Throwable $e) {
            Log::error('AI Quiz Save Error: ' . $e->getMessage());
            return response()->json(['message' => 'Lỗi lưu CSDL: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Tự động lấy danh sách Model Text Generation đang hoạt động trên tài khoản Groq của bạn
     */
    private function fetchAvailableGroqModels($apiKey)
    {
        try {
            $ch = curl_init('https://api.groq.com/openai/v1/models');
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Authorization: Bearer ' . trim($apiKey),
                'Content-Type: application/json',
            ]);
            curl_setopt($ch, CURLOPT_PROXY, '');
            curl_setopt($ch, CURLOPT_NOPROXY, '*');
            curl_setopt($ch, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
            curl_setopt($ch, CURLOPT_TIMEOUT, 10);

            $resBody = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            if ($httpCode === 200 && $resBody) {
                $data = json_decode($resBody, true);
                if (isset($data['data']) && is_array($data['data'])) {
                    $models = [];
                    foreach ($data['data'] as $item) {
                        $id = $item['id'] ?? '';
                        // Lọc bỏ model âm thanh, kiểm duyệt, vision
                        if (!str_contains($id, 'whisper') && !str_contains($id, 'guard') && !str_contains($id, 'vision') && !str_contains($id, 'embed')) {
                            $models[] = $id;
                        }
                    }
                    return $models;
                }
            }
        } catch (\Throwable $e) {
            Log::warning("Fetch models error: " . $e->getMessage());
        }

        return [];
    }

    public function history(Request $request)
    {
        $userId = auth('sanctum')->id() ?? request()->user('sanctum')?->id ?? 201;

        $quizzes = AiGeneratedQuiz::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->take(15)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $quizzes,
        ]);
    }

    public function show($id)
    {
        $userId = auth('sanctum')->id() ?? request()->user('sanctum')?->id ?? 201;

        $quiz = AiGeneratedQuiz::where('id', $id)
            ->where('user_id', $userId)
            ->first();

        if (!$quiz) {
            return response()->json(['message' => 'Không tìm thấy bài thi.'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $quiz,
        ]);
    }

    public function submit(Request $request, $id)
    {
        $userId = auth('sanctum')->id() ?? request()->user('sanctum')?->id ?? 201;
        $userAnswers = $request->input('answers', []);

        $quiz = AiGeneratedQuiz::where('id', $id)->where('user_id', $userId)->first();
        if (!$quiz) {
            return response()->json(['message' => 'Không tìm thấy bài thi.'], 404);
        }

        $questions = $quiz->questions_data ?? [];
        $correctCount = 0;
        $totalQuestions = count($questions);

        foreach ($questions as $q) {
            $qId = (string)($q['id'] ?? '');
            $selected = trim((string)($userAnswers[$qId] ?? ''));
            $rawCorrect = trim((string)($q['correct_answer'] ?? ''));
            $type = $q['type'] ?? (empty($q['options']) ? 'essay' : 'multiple_choice');

            if ($type === 'multiple_choice' || $type === 'true_false') {
                $cleanUser = preg_match('/^[A-D]/i', $selected, $m1) ? strtoupper($m1[0]) : '';
                $cleanCorrect = preg_match('/^[A-D]/i', $rawCorrect, $m2) ? strtoupper($m2[0]) : '';

                if ($cleanUser !== '' && $cleanUser === $cleanCorrect) {
                    $correctCount++;
                }
            } elseif ($type === 'fill_blank') {
                $normUser = mb_strtolower(preg_replace('/\s+/', '', $selected));
                $normCorrect = mb_strtolower(preg_replace('/\s+/', '', $rawCorrect));
                if ($normUser !== '' && ($normUser === $normCorrect || str_contains($normCorrect, $normUser))) {
                    $correctCount++;
                }
            } elseif ($type === 'essay') {
                if (mb_strlen($selected) >= 8) {
                    $correctCount++;
                }
            }
        }

        $score = $totalQuestions > 0 ? (int)round(($correctCount / $totalQuestions) * 100) : 0;

        $quiz->update([
            'user_answers' => $userAnswers,
            'score' => $score,
            'correct_count' => $correctCount,
            'is_completed' => true,
        ]);

        return response()->json([
            'success' => true,
            'data' => $quiz,
        ]);
    }

    public function destroy($id)
    {
        $userId = auth('sanctum')->id() ?? request()->user('sanctum')?->id ?? 201;

        $quiz = AiGeneratedQuiz::where('id', $id)
            ->where('user_id', $userId)
            ->first();

        if (!$quiz) {
            return response()->json(['message' => 'Không tìm thấy bài thi cần xóa.'], 404);
        }

        $quiz->delete();

        return response()->json([
            'success' => true,
            'message' => 'Đã xóa bài thi thành công.',
        ]);
    }
}
