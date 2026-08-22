<?php

namespace App\Services\Instructor;

use App\Services\Ai\AiRouterService;
use App\DTOs\AiMessageDto;
use App\Models\AiGenerationLog;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Log;

class AiQuizGeneratorService
{
    public function __construct(private readonly AiRouterService $aiRouter)
    {
    }

    /**
     * Generate quiz questions based on content or topic using AI.
     */
    public function generateQuiz(User $instructor, array $data): array
    {
        $sourceType = $data['source_type'];
        $content = $data['content'] ?? '';
        $topic = $data['topic'] ?? '';
        $difficulty = $data['difficulty'] ?? 'mixed';
        $total = (int) $data['total_questions'];
        $mcCount = (int) $data['multiple_choice_count'];
        $essayCount = (int) $data['essay_count'];

        $sourceDescription = $sourceType === 'content'
            ? "Nội dung tài liệu/bài học sau:\n\n{$content}"
            : "Chủ đề kiến thức: '{$topic}'";

        $systemPrompt = "Bạn là một chuyên gia khảo thí và thiết kế đề kiểm tra hàng đầu.
Nhiệm vụ của bạn là tạo một đề kiểm tra gồm TỔNG CỘNG ĐÚNG {$total} CÂU HỎI dựa trên {$sourceDescription}.

CẤU TRÚC ĐỀ THI BẮT BUỘC:
- Mức độ khó chung: {$difficulty} (nếu là 'mixed' hãy phân bố hài hòa giữa easy, medium, hard).
- Số câu trắc nghiệm (multiple_choice): ĐÚNG {$mcCount} CÂU.
- Số câu tự luận (essay): ĐÚNG {$essayCount} CÂU.

YÊU CẦU ĐỐI VỚI CÂU TRẮC NGHIỆM (multiple_choice):
1. Mỗi câu có đúng 4 đáp án trong mảng 'options'.
2. Chỉ định rõ 'correct_answer_index' (số nguyên từ 0 đến 3 chỉ định đáp án đúng trong mảng 'options').
3. Cung cấp 'explanation' giải thích chi tiết tại sao đáp án đó đúng.
4. Mặc định 'points': 1.

YÊU CẦU ĐỐI VỚI CÂU TỰ LUẬN (essay):
1. Cung cấp 'sample_answer' (đáp án tham khảo chi tiết).
2. Cung cấp 'rubric' (gợi ý chấm điểm chi tiết chia theo ý chính/thang điểm).
3. Mặc định 'points': 5 (hoặc điều chỉnh phù hợp với độ phức tạp).

QUY TẮC ĐỊNH DẠNG ĐẦU RA:
- Trả về DUY NHẤT một chuỗi JSON chuẩn (Response MIME type: application/json).
- KHÔNG bọc trong markdown ```json ... ```, KHÔNG ghi chú hay bình luận nào khác ngoài JSON.

CẤU TRÚC JSON MẪU:
{
  \"title\": \"Tiêu đề đề kiểm tra ngắn gọn, phù hợp\",
  \"description\": \"Mô tả tổng quan bài kiểm tra\",
  \"questions\": [
    {
      \"id\": \"q-1\",
      \"type\": \"multiple_choice\",
      \"difficulty\": \"easy\",
      \"question\": \"Nội dung câu hỏi trắc nghiệm...?\",
      \"options\": [\"Đáp án A\", \"Đáp án B\", \"Đáp án C\", \"Đáp án D\"],
      \"correct_answer_index\": 0,
      \"explanation\": \"Giải thích vì sao đáp án A đúng...\",
      \"points\": 1
    },
    {
      \"id\": \"q-2\",
      \"type\": \"essay\",
      \"difficulty\": \"medium\",
      \"question\": \"Nội dung câu hỏi tự luận...?\",
      \"sample_answer\": \"Nội dung câu trả lời tham khảo mẫu...\",
      \"rubric\": \"1. Ý 1 (2đ). 2. Ý 2 (3đ)...\",
      \"points\": 5
    }
  ]
}";

        $startTime = microtime(true);
        try {
            $messages = [
                new AiMessageDto('system', $systemPrompt),
                new AiMessageDto('user', "Hãy tạo đề kiểm tra ngay bây giờ. Trả về đúng JSON theo yêu cầu.")
            ];

            $aiResult = $this->aiRouter->sendMessageWithFallback($messages, [
                'response_mime_type' => 'application/json',
                'user_id' => $instructor->id,
                'feature' => 'ai_quiz_generator'
            ]);

            $responseJson = $aiResult['content'];
            $cleanJson = preg_replace('/^```json\s*|\s*```$/i', '', trim($responseJson));
            $parsed = json_decode($cleanJson, true);

            if (!$parsed || !isset($parsed['questions']) || !is_array($parsed['questions'])) {
                throw new Exception("Dữ liệu JSON trả về từ AI không đúng cấu trúc.");
            }

            // Standardize output
            $questions = [];
            foreach ($parsed['questions'] as $index => $q) {
                $qType = $q['type'] ?? 'multiple_choice';
                $questions[] = [
                    'id' => 'gen_' . ($index + 1) . '_' . uniqid(),
                    'type' => $qType,
                    'difficulty' => $q['difficulty'] ?? 'medium',
                    'question' => $q['question'] ?? 'Câu hỏi ' . ($index + 1),
                    'options' => $qType === 'multiple_choice' ? ($q['options'] ?? []) : [],
                    'correct_answer_index' => $qType === 'multiple_choice' ? (int) ($q['correct_answer_index'] ?? 0) : null,
                    'explanation' => $q['explanation'] ?? '',
                    'sample_answer' => $qType === 'essay' ? ($q['sample_answer'] ?? '') : '',
                    'rubric' => $qType === 'essay' ? ($q['rubric'] ?? '') : '',
                    'points' => (float) ($q['points'] ?? ($qType === 'essay' ? 5.0 : 1.0)),
                    'reviewStatus' => 'pending'
                ];
            }

            // Log AI generation
            AiGenerationLog::create([
                'instructor_id' => $instructor->id,
                'feature' => 'ai_quiz_generator',
                'prompt_tokens' => 0,
                'completion_tokens' => 0,
                'raw_response' => $parsed,
                'status' => 'success'
            ]);

            return [
                'title' => $parsed['title'] ?? ($sourceType === 'topic' ? "Kiểm tra: {$topic}" : "Bài kiểm tra từ tài liệu"),
                'description' => $parsed['description'] ?? "Bài kiểm tra sinh tự động bởi AI",
                'source_type' => $sourceType,
                'source_content' => $sourceType === 'content' ? $content : $topic,
                'difficulty' => $difficulty,
                'total_questions' => count($questions),
                'mc_questions_count' => count(array_filter($questions, fn($q) => $q['type'] === 'multiple_choice')),
                'essay_questions_count' => count(array_filter($questions, fn($q) => $q['type'] === 'essay')),
                'questions' => $questions,
                'meta' => $aiResult['meta'] ?? []
            ];

        } catch (Exception $e) {
            Log::error("[AiQuizGeneratorService] Failed: " . $e->getMessage());

            AiGenerationLog::create([
                'instructor_id' => $instructor->id,
                'feature' => 'ai_quiz_generator',
                'status' => 'failed',
                'error_message' => $e->getMessage()
            ]);

            throw new Exception("Không thể tạo đề kiểm tra bằng AI: " . $e->getMessage());
        }
    }

    /**
     * Regenerate a single question.
     */
    public function regenerateSingleQuestion(User $instructor, array $data): array
    {
        $type = $data['type'] ?? 'multiple_choice';
        $difficulty = $data['difficulty'] ?? 'medium';
        $context = $data['context'] ?? '';

        $prompt = "Bạn là chuyên gia thiết kế đề thi. Hãy tạo MỘT CÂU HỎI MỚI dạng '{$type}' ở độ khó '{$difficulty}'.
Ngữ cảnh chủ đề: {$context}.

Trả về CHỈ JSON theo định dạng:
{
  \"type\": \"{$type}\",
  \"difficulty\": \"{$difficulty}\",
  \"question\": \"...\",
  \"options\": [\"A\", \"B\", \"C\", \"D\"],
  \"correct_answer_index\": 0,
  \"explanation\": \"...\",
  \"sample_answer\": \"...\",
  \"rubric\": \"...\",
  \"points\": " . ($type === 'essay' ? 5 : 1) . "
}";

        $messages = [
            new AiMessageDto('system', "Trả về duy nhất JSON cho 1 câu hỏi."),
            new AiMessageDto('user', $prompt)
        ];

        $aiResult = $this->aiRouter->sendMessageWithFallback($messages, [
            'response_mime_type' => 'application/json',
            'user_id' => $instructor->id,
            'feature' => 'ai_quiz_single_question'
        ]);

        $cleanJson = preg_replace('/^```json\s*|\s*```$/i', '', trim($aiResult['content']));
        $parsed = json_decode($cleanJson, true);

        if (!$parsed || !isset($parsed['question'])) {
            throw new Exception("AI không trả về câu hỏi hợp lệ.");
        }

        return [
            'id' => 'regen_' . uniqid(),
            'type' => $type,
            'difficulty' => $difficulty,
            'question' => $parsed['question'],
            'options' => $type === 'multiple_choice' ? ($parsed['options'] ?? []) : [],
            'correct_answer_index' => $type === 'multiple_choice' ? (int) ($parsed['correct_answer_index'] ?? 0) : null,
            'explanation' => $parsed['explanation'] ?? '',
            'sample_answer' => $type === 'essay' ? ($parsed['sample_answer'] ?? '') : '',
            'rubric' => $type === 'essay' ? ($parsed['rubric'] ?? '') : '',
            'points' => (float) ($parsed['points'] ?? ($type === 'essay' ? 5.0 : 1.0)),
            'reviewStatus' => 'pending'
        ];
    }
}
