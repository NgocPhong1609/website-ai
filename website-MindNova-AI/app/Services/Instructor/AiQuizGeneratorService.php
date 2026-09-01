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

QUY TẮC PHÂN BỔ ĐIỂM BẮT BUỘC:
- TỔNG ĐIỂM CỦA TẤT CẢ CÂU HỎI PHẢI ĐÚNG BẰNG 10.0 ĐIỂM.
- Mỗi câu trắc nghiệm (multiple_choice) có điểm 'points' phù hợp (ví dụ: 0.5, 0.4, 0.25...).
- Mỗi câu tự luận (essay) có điểm 'points' phù hợp (ví dụ: 2.5, 4.0, 1.5...).
- Tổng điểm của toàn bộ bài thi PHẢI BẰNG 10.0 ĐIỂM.

YÊU CẦU ĐỐI VỚI CÂU TRẮC NGHIỆM (multiple_choice):
1. Mỗi câu có đúng 4 đáp án trong mảng 'options'.
2. Chỉ định rõ 'correct_answer_index' (số nguyên từ 0 đến 3 chỉ định đáp án đúng trong mảng 'options').
3. Cung cấp 'explanation' giải thích chi tiết tại sao đáp án đó đúng.

YÊU CẦU ĐỐI VỚI CÂU TỰ LUẬN (essay):
1. Cung cấp 'sample_answer' (đáp án tham khảo chi tiết).
2. Cung cấp 'rubric' (Thang điểm chấm mô tả từng ý chính kèm % điểm chiếm trong tổng điểm câu, ví dụ:
   '- Ý 1 (Nêu đúng khái niệm): 40% = 1.0 điểm\n- Ý 2 (Phân tích nguyên nhân): 30% = 0.75 điểm\n- Ý 3 (Ví dụ minh họa): 30% = 0.75 điểm\nTổng: 100% = 2.5 điểm'
).

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
      \"points\": 0.5
    },
    {
      \"id\": \"q-2\",
      \"type\": \"essay\",
      \"difficulty\": \"medium\",
      \"question\": \"Nội dung câu hỏi tự luận...?\",
      \"sample_answer\": \"Nội dung câu trả lời tham khảo mẫu...\",
      \"rubric\": \"- Ý 1 (Nêu đúng khái niệm): 40% = 1.0 điểm\\n- Ý 2 (Phân tích nguyên nhân): 30% = 0.75 điểm\\n- Ý 3 (Ví dụ): 30% = 0.75 điểm\\nTổng: 100% = 2.5 điểm\",
      \"points\": 2.5
    }
  ]
}";

        $startTime = microtime(true);
        try {
            $userPrompt = "HÃY TẠO ĐỀ KIỂM TRA NGAY BÂY GIỜ.
YÊU CẦU BẮT BUỘC KHÔNG ĐƯỢC VI PHẠM:
1. Mảng 'questions' phải chứa ĐÚNG CHÍNH XÁC {$total} câu hỏi.
2. Trong đó có ĐÚNG CHÍNH XÁC {$mcCount} câu Trắc nghiệm (type: 'multiple_choice').
3. Trong đó có ĐÚNG CHÍNH XÁC {$essayCount} câu Tự luận (type: 'essay').
4. Không được tự ý rút ngắn thành 10 câu hay bỏ câu tự luận. Trả về duy nhất JSON.";

            $messages = [
                new AiMessageDto('system', $systemPrompt),
                new AiMessageDto('user', $userPrompt)
            ];

            Log::info("[QUIZ_GEN STEP 4] Dispatching AI Request", [
                'prompt_length' => strlen($systemPrompt),
                'target_total' => $total,
                'target_mc' => $mcCount,
                'target_essay' => $essayCount,
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

            // Separate AI output into Multiple Choice & Essay arrays
            $mcQuestions = [];
            $essayQuestions = [];

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

                $formattedQ = [
                    'id' => 'gen_' . ($index + 1) . '_' . uniqid(),
                    'type' => $qType,
                    'difficulty' => in_array($q['difficulty'] ?? '', ['easy', 'medium', 'hard']) ? $q['difficulty'] : ($difficulty !== 'mixed' ? $difficulty : 'medium'),
                    'question' => !empty($q['question']) ? $q['question'] : ('Câu hỏi ' . ($index + 1)),
                    'options' => $options,
                    'correct_answer_index' => $qType === 'multiple_choice' ? $correctIndex : null,
                    'explanation' => $q['explanation'] ?? '',
                    'sample_answer' => $qType === 'essay' ? ($q['sample_answer'] ?? '') : '',
                    'rubric' => $qType === 'essay' ? ($q['rubric'] ?? '') : '',
                    'points' => isset($q['points']) && is_numeric($q['points']) && (float)$q['points'] > 0 ? (float)$q['points'] : 0.0,
                    'reviewStatus' => 'pending'
                ];

                if ($qType === 'essay') {
                    $essayQuestions[] = $formattedQ;
                } else {
                    $mcQuestions[] = $formattedQ;
                }
            }

            // ── ENFORCE STRICT COUNT BREAKDOWN FOR MC AND ESSAY ──
            // Case A: Missing Essay questions -> convert excess MC questions or generate fallback Essays
            while (count($essayQuestions) < $essayCount) {
                if (count($mcQuestions) > $mcCount) {
                    $convertQ = array_pop($mcQuestions);
                    $convertQ['type'] = 'essay';
                    $convertQ['options'] = [];
                    $convertQ['correct_answer_index'] = null;
                    $convertQ['sample_answer'] = "Đáp án gợi ý chi tiết: " . ($convertQ['explanation'] ?: "Phân tích và giải thích chi tiết kiến thức bài học.");
                    $convertQ['rubric'] = "- Trình bày đúng khái niệm cốt lõi: 50% = 1.25 điểm\n- Phân tích ví dụ & ứng dụng: 50% = 1.25 điểm\nTổng: 100% = 2.5 điểm";
                    $essayQuestions[] = $convertQ;
                } else {
                    $essayIdx = count($essayQuestions) + 1;
                    $essayQuestions[] = [
                        'id' => 'gen_essay_' . $essayIdx . '_' . uniqid(),
                        'type' => 'essay',
                        'difficulty' => $difficulty !== 'mixed' ? $difficulty : 'medium',
                        'question' => "Phân tích và trình bày quan điểm chuyên sâu về nội dung trọng tâm trong khóa học (" . ($courseTitle ?: "Bài học") . " - Câu tự luận " . $essayIdx . ").",
                        'options' => [],
                        'correct_answer_index' => null,
                        'explanation' => 'Giải thích khái niệm chính và phân tích ứng dụng thực tế.',
                        'sample_answer' => "Dựa trên nội dung kiến thức được học, người học cần nêu được khái niệm nền tảng, đưa ra ví dụ minh họa cụ thể và phân tích ưu nhược điểm.",
                        'rubric' => "- Ý 1 (Nêu đúng khái niệm & nguyên lý): 40% = 1.0 điểm\n- Ý 2 (Phân tích ứng dụng & ví dụ): 40% = 1.0 điểm\n- Ý 3 (Trình bày mạch lạc, logic): 20% = 0.5 điểm\nTổng: 100% = 2.5 điểm",
                        'points' => 2.5,
                        'reviewStatus' => 'pending'
                    ];
                }
            }

            // Case B: Missing MC questions -> convert excess Essays or generate fallback MCs
            while (count($mcQuestions) < $mcCount) {
                if (count($essayQuestions) > $essayCount) {
                    $convertQ = array_pop($essayQuestions);
                    $convertQ['type'] = 'multiple_choice';
                    $convertQ['options'] = [
                        'Khái niệm đúng theo bài học',
                        'Khái niệm sai lệch về nguyên lý',
                        'Trường hợp ngoại lệ không thuộc bài học',
                        'Tất cả các phương án trên đều sai'
                    ];
                    $convertQ['correct_answer_index'] = 0;
                    $convertQ['sample_answer'] = '';
                    $convertQ['rubric'] = '';
                    $mcQuestions[] = $convertQ;
                } else {
                    $mcIdx = count($mcQuestions) + 1;
                    $mcQuestions[] = [
                        'id' => 'gen_mc_' . $mcIdx . '_' . uniqid(),
                        'type' => 'multiple_choice',
                        'difficulty' => $difficulty !== 'mixed' ? $difficulty : 'medium',
                        'question' => "Khẳng định nào sau đây là ĐÚNG khi nói về kiến thức bài học (" . ($courseTitle ?: "Khóa học") . " - Câu trắc nghiệm " . $mcIdx . ")?",
                        'options' => [
                            "Đặc điểm cốt lõi chính xác theo nội dung bài học số {$mcIdx}.",
                            "Phương án giả định không chính xác về nguyên lý.",
                            "Khái niệm chỉ áp dụng trong trường hợp đặc biệt.",
                            "Tất cả các đáp án trên đều không chính xác."
                        ],
                        'correct_answer_index' => 0,
                        'explanation' => "Dựa trên nội dung lý thuyết đã học, đáp án A thể hiện đúng nhất bản chất vấn đề.",
                        'sample_answer' => '',
                        'rubric' => '',
                        'points' => 0.5,
                        'reviewStatus' => 'pending'
                    ];
                }
            }

            // Slice arrays to exact target counts
            $mcQuestions = array_slice($mcQuestions, 0, $mcCount);
            $essayQuestions = array_slice($essayQuestions, 0, $essayCount);

            // Re-combine and re-index questions
            $questions = array_merge($mcQuestions, $essayQuestions);
            foreach ($questions as $idx => &$q) {
                $q['id'] = 'gen_' . ($idx + 1) . '_' . uniqid();
            }
            unset($q);

            // AUTO-NORMALIZE QUESTION POINTS TO EXACTLY 10.0 TOTAL POINTS
            $this->normalizeQuestionPoints($questions);

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

    /**
     * Auto-normalize generated question points so that total sum equals exactly 10.0 points.
     */
    private function normalizeQuestionPoints(array &$questions): void
    {
        $totalCount = count($questions);
        if ($totalCount === 0) return;

        $mcCount = 0;
        $essayCount = 0;

        foreach ($questions as $q) {
            if (($q['type'] ?? '') === 'essay') {
                $essayCount++;
            } else {
                $mcCount++;
            }
        }

        // Check if points are already summing to 10.0
        $currentSum = 0.0;
        foreach ($questions as $q) {
            $currentSum += (float) ($q['points'] ?? 0);
        }

        // If sum is already 10.0 (with 0.01 tolerance) and all points > 0, keep them
        if (abs($currentSum - 10.0) < 0.01 && min(array_column($questions, 'points')) > 0) {
            return;
        }

        // Distribute 10.0 total points
        if ($essayCount === 0) {
            $baseMc = round(10.0 / $mcCount, 2);
            foreach ($questions as &$q) {
                $q['points'] = $baseMc;
            }
        } elseif ($mcCount === 0) {
            $baseEssay = round(10.0 / $essayCount, 2);
            foreach ($questions as &$q) {
                $q['points'] = $baseEssay;
            }
        } else {
            // Mixed MCQ & Essay: Give Essay 2.5x weight of MCQ
            $weightTotal = ($mcCount * 1.0) + ($essayCount * 2.5);
            $baseUnit = 10.0 / $weightTotal;
            $baseMc = round($baseUnit * 1.0, 2);
            $baseEssay = round($baseUnit * 2.5, 2);

            foreach ($questions as &$q) {
                if (($q['type'] ?? '') === 'essay') {
                    $q['points'] = $baseEssay;
                } else {
                    $q['points'] = $baseMc;
                }
            }
        }
        unset($q);

        // Adjust rounding residual on the last question to ensure exact sum === 10.0
        $newSum = array_sum(array_column($questions, 'points'));
        $diff = round(10.0 - $newSum, 2);
        if (abs($diff) > 0.0001 && count($questions) > 0) {
            $lastIdx = count($questions) - 1;
            $questions[$lastIdx]['points'] = round($questions[$lastIdx]['points'] + $diff, 2);
        }
    }
}
