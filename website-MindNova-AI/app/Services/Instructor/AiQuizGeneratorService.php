<?php

namespace App\Services\Instructor;

use App\Exceptions\AiQuizGeneratorException;
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
        $sourceType = $data['source_type'] ?? 'topic';
        $content = $data['content'] ?? '';
        $topic = $data['topic'] ?? '';
        $courseId = $data['course_id'] ?? null;
        $difficulty = $data['difficulty'] ?? 'mixed';
        $total = (int) $data['total_questions'];
        $mcCount = (int) $data['multiple_choice_count'];
        $essayCount = (int) $data['essay_count'];

        Log::info("[QUIZ_GEN STEP 2] Start generateQuiz", [
            'instructor_id' => $instructor->id,
            'source_type' => $sourceType,
            'course_id' => $courseId,
            'difficulty' => $difficulty,
            'total_questions' => $total,
            'mc_count' => $mcCount,
            'essay_count' => $essayCount,
        ]);

        $courseTitle = null;
        $moduleCount = 0;
        $lessonCount = 0;

        if (($sourceType === 'course' || !empty($courseId)) && $courseId) {
            $courseQuery = \App\Models\Course::with(['modules.lessons']);
            if (\Illuminate\Support\Facades\Schema::hasColumn('lessons', 'course_id')) {
                $courseQuery->with('lessons');
            }
            $course = $courseQuery->where('id', $courseId)->first();

            if (!$course) {
                throw new AiQuizGeneratorException("Không tìm thấy khóa học với ID {$courseId}.", "COURSE_NOT_FOUND", 404);
            }

            if ((int) $course->teacher_id !== (int) $instructor->id && !$instructor->hasRole('admin')) {
                throw new AiQuizGeneratorException("Bạn không có quyền quản lý khóa học '{$course->title}'.", "UNAUTHORIZED_COURSE_ACCESS", 403);
            }

            $courseTitle = $course->title;
            $moduleCount = $course->modules ? $course->modules->count() : 0;
            $aggregatedContent = "";

            if ($moduleCount > 0) {
                foreach ($course->modules as $modIndex => $module) {
                    foreach ($module->lessons as $lesIndex => $lesson) {
                        $lessonCount++;
                        $lessonText = trim(strip_tags($lesson->content ?? ''));
                        $aggregatedContent .= "--- Bài " . ($lessonCount) . ": {$lesson->title} (Module: {$module->title}) ---\n";
                        if (!empty($lessonText)) {
                            $aggregatedContent .= $lessonText . "\n\n";
                        } else {
                            $aggregatedContent .= "Kiến thức bài học lý thuyết về {$lesson->title}.\n\n";
                        }
                    }
                }
            }

            // Fallback to direct lessons if modular lessons count is 0
            if ($lessonCount === 0 && $course->relationLoaded('lessons') && $course->lessons->isNotEmpty()) {
                foreach ($course->lessons as $lesIndex => $lesson) {
                    $lessonCount++;
                    $lessonText = trim(strip_tags($lesson->content ?? ''));
                    $aggregatedContent .= "--- Bài " . ($lessonCount) . ": {$lesson->title} ---\n";
                    if (!empty($lessonText)) {
                        $aggregatedContent .= $lessonText . "\n\n";
                    } else {
                        $aggregatedContent .= "Kiến thức bài học lý thuyết về {$lesson->title}.\n\n";
                    }
                }
            } elseif ($lessonCount === 0 && \Illuminate\Support\Facades\Schema::hasColumn('lessons', 'course_id')) {
                $directLessons = \App\Models\Lesson::where('course_id', $course->id)->orderBy('order')->get();
                if ($directLessons->isNotEmpty()) {
                    foreach ($directLessons as $lesIndex => $lesson) {
                        $lessonCount++;
                        $lessonText = trim(strip_tags($lesson->content ?? ''));
                        $aggregatedContent .= "--- Bài " . ($lessonCount) . ": {$lesson->title} ---\n";
                        if (!empty($lessonText)) {
                            $aggregatedContent .= $lessonText . "\n\n";
                        } else {
                            $aggregatedContent .= "Kiến thức bài học lý thuyết về {$lesson->title}.\n\n";
                        }
                    }
                }
            }

            if (empty(trim($aggregatedContent))) {
                $aggregatedContent = "Khóa học '{$courseTitle}' với {$moduleCount} Module và {$lessonCount} Bài học. Mô tả: {$course->description}";
            }

            Log::info("[QUIZ_GEN STEP 3] Course Lookup & Auth Success", [
                'course_id' => $course->id,
                'course_title' => $courseTitle,
                'teacher_id' => $course->teacher_id,
                'instructor_id' => $instructor->id,
                'module_count' => $moduleCount,
                'lesson_count' => $lessonCount,
                'aggregated_content_length' => strlen($aggregatedContent),
                'content_snippet' => substr($aggregatedContent, 0, 150),
            ]);

            $sourceDescription = "Nội dung kiến thức bài học của Khóa học: '{$courseTitle}' (Gồm {$moduleCount} Module, {$lessonCount} Bài học):\n\n{$aggregatedContent}";
        } elseif ($sourceType === 'content') {
            $sourceDescription = "Nội dung tài liệu/bài học sau:\n\n{$content}";
        } else {
            $sourceDescription = "Chủ đề kiến thức: '{$topic}'";
        }

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

            Log::info("[QUIZ_GEN STEP 4] Dispatching AI Request", [
                'prompt_length' => strlen($systemPrompt),
            ]);

            $aiResult = $this->aiRouter->sendMessageWithFallback($messages, [
                'response_mime_type' => 'application/json',
                'user_id' => $instructor->id,
                'feature' => 'ai_quiz_generator'
            ]);

            Log::info("[QUIZ_GEN STEP 5] AI Response Received", [
                'provider' => $aiResult['meta']['provider'] ?? 'unknown',
                'fallbackUsed' => $aiResult['meta']['fallbackUsed'] ?? false,
                'durationMs' => $aiResult['meta']['durationMs'] ?? 0,
                'content_length' => strlen($aiResult['content'] ?? ''),
                'raw_snippet' => substr($aiResult['content'] ?? '', 0, 150),
            ]);

            $parsed = $this->cleanAndParseJson($aiResult['content']);

            Log::info("[QUIZ_GEN STEP 6] JSON Parsed Successfully", [
                'parsed_title' => $parsed['title'] ?? null,
                'questions_count' => count($parsed['questions'] ?? []),
            ]);

            if (!isset($parsed['questions']) || !is_array($parsed['questions'])) {
                throw new AiQuizGeneratorException("Dữ liệu JSON trả về từ AI không chứa mảng câu hỏi 'questions'.", "AI_INVALID_RESPONSE", 422);
            }

            // Standardize output
            $questions = [];
            foreach ($parsed['questions'] as $index => $q) {
                $rawType = strtolower($q['type'] ?? '');
                $qType = ($rawType === 'essay' || $rawType === 'tu_luan') ? 'essay' : 'multiple_choice';

                $options = [];
                if ($qType === 'multiple_choice') {
                    $rawOptions = $q['options'] ?? [];
                    if (is_array($rawOptions)) {
                        foreach ($rawOptions as $opt) {
                            $options[] = is_string($opt) ? trim($opt) : (string) json_encode($opt);
                        }
                    }
                    while (count($options) < 4) {
                        $options[] = 'Lựa chọn ' . chr(65 + count($options));
                    }
                    if (count($options) > 4) {
                        $options = array_slice($options, 0, 4);
                    }
                }

                $correctIndex = 0;
                if ($qType === 'multiple_choice') {
                    $idx = $q['correct_answer_index'] ?? 0;
                    if (is_numeric($idx) && (int)$idx >= 0 && (int)$idx < count($options)) {
                        $correctIndex = (int) $idx;
                    }
                }

                $questions[] = [
                    'id' => 'gen_' . ($index + 1) . '_' . uniqid(),
                    'type' => $qType,
                    'difficulty' => in_array($q['difficulty'] ?? '', ['easy', 'medium', 'hard']) ? $q['difficulty'] : ($difficulty !== 'mixed' ? $difficulty : 'medium'),
                    'question' => !empty($q['question']) ? $q['question'] : ('Câu hỏi ' . ($index + 1)),
                    'options' => $options,
                    'correct_answer_index' => $qType === 'multiple_choice' ? $correctIndex : null,
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
                'title' => $parsed['title'] ?? ($courseTitle ? "Đề kiểm tra: {$courseTitle}" : ($sourceType === 'topic' ? "Kiểm tra: {$topic}" : "Bài kiểm tra từ tài liệu")),
                'description' => $parsed['description'] ?? "Bài kiểm tra sinh tự động bởi AI",
                'source_type' => $sourceType,
                'source_content' => $sourceType === 'course' ? $courseTitle : ($sourceType === 'content' ? $content : $topic),
                'course_id' => $courseId ? (int) $courseId : null,
                'course_title' => $courseTitle,
                'difficulty' => $difficulty,
                'total_questions' => count($questions),
                'mc_questions_count' => count(array_filter($questions, fn($q) => $q['type'] === 'multiple_choice')),
                'essay_questions_count' => count(array_filter($questions, fn($q) => $q['type'] === 'essay')),
                'questions' => $questions,
                'meta' => $aiResult['meta'] ?? []
            ];

        } catch (AiQuizGeneratorException $e) {
            Log::warning("[AiQuizGeneratorService] Generator exception: " . $e->getMessage(), [
                'errorCode' => $e->getErrorCode(),
                'statusCode' => $e->getStatusCode()
            ]);

            AiGenerationLog::create([
                'instructor_id' => $instructor->id,
                'feature' => 'ai_quiz_generator',
                'status' => 'failed',
                'error_message' => $e->getMessage()
            ]);

            throw $e;
        } catch (Exception $e) {
            Log::error("[AiQuizGeneratorService] Failed: " . $e->getMessage());

            AiGenerationLog::create([
                'instructor_id' => $instructor->id,
                'feature' => 'ai_quiz_generator',
                'status' => 'failed',
                'error_message' => $e->getMessage()
            ]);

            $code = str_contains($e->getMessage(), 'AI') ? 'AI_PROVIDER_ERROR' : 'AI_GENERATION_FAILED';
            throw new AiQuizGeneratorException("Không thể tạo đề kiểm tra bằng AI: " . $e->getMessage(), $code, 500, $e);
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

        $parsed = $this->cleanAndParseJson($aiResult['content']);

        if (!isset($parsed['question'])) {
            throw new Exception("AI không trả về câu hỏi hợp lệ.");
        }

        $options = [];
        if ($type === 'multiple_choice') {
            $rawOptions = $parsed['options'] ?? [];
            if (is_array($rawOptions)) {
                foreach ($rawOptions as $opt) {
                    $options[] = is_string($opt) ? trim($opt) : (string) json_encode($opt);
                }
            }
            while (count($options) < 4) {
                $options[] = 'Lựa chọn ' . chr(65 + count($options));
            }
            if (count($options) > 4) {
                $options = array_slice($options, 0, 4);
            }
        }

        return [
            'id' => 'regen_' . uniqid(),
            'type' => $type,
            'difficulty' => $difficulty,
            'question' => $parsed['question'],
            'options' => $type === 'multiple_choice' ? $options : [],
            'correct_answer_index' => $type === 'multiple_choice' ? (int) ($parsed['correct_answer_index'] ?? 0) : null,
            'explanation' => $parsed['explanation'] ?? '',
            'sample_answer' => $type === 'essay' ? ($parsed['sample_answer'] ?? '') : '',
            'rubric' => $type === 'essay' ? ($parsed['rubric'] ?? '') : '',
            'points' => (float) ($parsed['points'] ?? ($type === 'essay' ? 5.0 : 1.0)),
            'reviewStatus' => 'pending'
        ];
    }

    /**
     * Safely extract and parse JSON from AI string output.
     */
    private function cleanAndParseJson(string $rawResponse): array
    {
        // 1. Strip UTF-8 BOM if present
        $clean = preg_replace('/^\xEF\xBB\xBF/', '', trim($rawResponse));

        // 2. Extract content from markdown code fences ```json ... ```
        if (preg_match('/```(?:json)?\s*(.*?)\s*```/s', $clean, $matches)) {
            $clean = $matches[1];
        }

        // 3. Extract substring between first `{` and last `}`
        $firstBrace = strpos($clean, '{');
        $lastBrace = strrpos($clean, '}');
        if ($firstBrace !== false && $lastBrace !== false && $lastBrace > $firstBrace) {
            $clean = substr($clean, $firstBrace, $lastBrace - $firstBrace + 1);
        }

        // 4. Decode JSON
        $decoded = json_decode($clean, true);

        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
            return $decoded;
        }

        // 5. Attempt cleanup on control characters inside JSON strings if initial decode failed
        $fixedJson = preg_replace_callback('/"([^"\\]*(?:\\.[^"\\]*)*)"/s', function ($m) {
            return '"' . str_replace(["\r", "\n", "\t"], ["\\r", "\\n", "\\t"], $m[1]) . '"';
        }, $clean);

        $decodedFixed = json_decode($fixedJson, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($decodedFixed)) {
            return $decodedFixed;
        }

        Log::error("[AiQuizGeneratorService] JSON decode failed: " . json_last_error_msg() . " | Raw: " . substr($rawResponse, 0, 500));
        throw new AiQuizGeneratorException(
            "AI không trả về dữ liệu câu hỏi hợp lệ (Lỗi định dạng JSON).",
            "AI_INVALID_RESPONSE",
            422
        );
    }
}
