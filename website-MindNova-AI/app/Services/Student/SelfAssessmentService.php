<?php

namespace App\Services\Student;

use App\Models\Course;
use App\Models\Lesson;
use App\Models\Quiz;
use App\Models\User;
use App\Models\UserQuizAttempt;
use App\Services\Ai\AiRouterService;
use App\DTOs\AiMessageDto;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;

class SelfAssessmentService
{
    public function __construct(private readonly AiRouterService $aiRouter)
    {
    }

    /**
     * Generate 10 AI Multiple Choice questions based on the complete lesson content of a course.
     */
    public function generateSelfAssessment(?User $user, int|string $courseOrLessonId): array
    {
        set_time_limit(120);

        // 1. Resolve target Course
        $course = null;
        $numericId = is_numeric($courseOrLessonId) ? (int) $courseOrLessonId : (int) filter_var($courseOrLessonId, FILTER_SANITIZE_NUMBER_INT);

        if ($numericId > 0) {
            $course = Course::with(['modules.lessons', 'lessons'])->find($numericId);
            if (!$course) {
                $lesson = Lesson::with('module.course.modules.lessons')->find($numericId);
                if ($lesson && $lesson->module && $lesson->module->course) {
                    $course = $lesson->module->course;
                }
            }
        }

        if (!$course) {
            $course = Course::with(['modules.lessons', 'lessons'])->first();
        }

        if (!$course) {
            throw new Exception("Không tìm thấy dữ liệu khóa học để tạo bài đánh giá năng lực.");
        }

        // 2. Aggregate concise lesson summaries across modules (token-optimized)
        $lessonCount = 0;
        $aggregatedContent = "";

        if ($course->modules && $course->modules->isNotEmpty()) {
            foreach ($course->modules as $module) {
                foreach ($module->lessons as $lesson) {
                    $lessonCount++;
                    $cleanText = trim(preg_replace('/\s+/', ' ', strip_tags($lesson->content ?? '')));
                    $aggregatedContent .= "=== Bài {$lessonCount}: {$lesson->title} (Module: {$module->title}) ===\n";
                    if (!empty($cleanText)) {
                        $words = explode(' ', $cleanText);
                        $truncated = implode(' ', array_slice($words, 0, 150));
                        if (count($words) > 150) {
                            $truncated .= '...';
                        }
                        $aggregatedContent .= $truncated . "\n\n";
                    } else {
                        $aggregatedContent .= "Nội dung bài học về chủ đề: {$lesson->title}.\n\n";
                    }
                }
            }
        }

        if ($lessonCount === 0 && $course->lessons && $course->lessons->isNotEmpty()) {
            foreach ($course->lessons as $lesson) {
                $lessonCount++;
                $cleanText = trim(preg_replace('/\s+/', ' ', strip_tags($lesson->content ?? '')));
                $aggregatedContent .= "=== Bài {$lessonCount}: {$lesson->title} ===\n";
                if (!empty($cleanText)) {
                    $words = explode(' ', $cleanText);
                    $truncated = implode(' ', array_slice($words, 0, 150));
                    if (count($words) > 150) {
                        $truncated .= '...';
                    }
                    $aggregatedContent .= $truncated . "\n\n";
                } else {
                    $aggregatedContent .= "Nội dung bài học về chủ đề: {$lesson->title}.\n\n";
                }
            }
        }

        // Hard cap total aggregated prompt context to 12,000 chars (~2,500 words / ~3,000 tokens)
        if (mb_strlen($aggregatedContent) > 12000) {
            $aggregatedContent = mb_substr($aggregatedContent, 0, 12000) . "\n... [Tóm tắt thêm nội dung khóa học]";
        }

        if (empty(trim($aggregatedContent))) {
            $aggregatedContent = "Khóa học '{$course->title}'. Mô tả chi tiết: {$course->description}";
        }

        // Limit context string size to avoid payload overflow while keeping full coverage
        if (mb_strlen($aggregatedContent) > 25000) {
            $aggregatedContent = mb_substr($aggregatedContent, 0, 25000) . "\n...[Nội dung bổ sung]";
        }

        // 3. Construct Gemini AI Prompt
        $systemPrompt = "Bạn là Chuyên gia Khảo thí và Đánh giá Năng lực AI của MindNova.
Nhiệm vụ của bạn là biên soạn bộ 10 câu hỏi trắc nghiệm đánh giá năng lực tự học của học viên dựa trên TOÀN BỘ nội dung các bài học được cung cấp.

YÊU CẦU BẮT BUỘC:
1. Tạo ĐÚNG 10 CÂU HỎI TRẮC NGHIỆM (questionCount = 10).
2. Mỗi câu hỏi bao gồm 4 phương án lựa chọn (A, B, C, D) và chỉ có ĐÚNG 1 ĐÁP ÁN ĐÚNG.
3. Phân bố câu hỏi bao phủ kiến thức của toàn bộ các bài học trong khóa học.
4. Ngẫu nhiên hóa cách đặt câu hỏi giữa các lần sinh để câu hỏi đa dạng, phong phú.
5. Nội dung câu hỏi và đáp án phải hoàn toàn nằm trong phạm vi kiến thức được cung cấp, KHÔNG BỊA kiến thức bên ngoài.
6. Trả về kết quả theo ĐÚNG CẤU TRÚC JSON sau (KHÔNG kèm bất kỳ văn bản bọc ngoài nào ngoại trừ JSON thuần):
{
  \"title\": \"Bài Đánh giá Năng lực: {$course->title}\",
  \"questions\": [
    {
      \"id\": \"q1\",
      \"content\": \"Nội dung câu hỏi 1...\",
      \"lesson_title\": \"Tên bài học liên quan\",
      \"options\": [
        {\"id\": \"opt_a\", \"content\": \"Phương án A\"},
        {\"id\": \"opt_b\", \"content\": \"Phương án B\"},
        {\"id\": \"opt_c\", \"content\": \"Phương án C\"},
        {\"id\": \"opt_d\", \"content\": \"Phương án D\"}
      ],
      \"correct_option_id\": \"opt_a\",
      \"explanation\": \"Giải thích chi tiết vì sao phương án này đúng...\"
    }
  ]
}";

        $userMessage = "Hãy sinh bộ 10 câu hỏi đánh giá năng lực cho khóa học '{$course->title}' dựa trên nội dung các bài học sau:\n\n{$aggregatedContent}";

        $messages = [
            new AiMessageDto("system", $systemPrompt),
            new AiMessageDto("user", $userMessage),
        ];

        try {
            $aiResponseStr = $this->aiRouter->sendMessage($messages, [
                'feature' => 'self_assessment',
                'user_id' => $user?->id,
                'max_tokens' => 2500,
                'response_mime_type' => 'application/json',
            ]);

            // Clean json Markdown wrapping if present
            $cleanedJson = preg_replace('/^```(?:json)?\s*|\s*```$/i', '', trim($aiResponseStr));
            $parsed = json_decode($cleanedJson, true);

            if (!is_array($parsed) || empty($parsed['questions'])) {
                Log::warning("[SelfAssessmentService] Failed to parse AI JSON response: " . substr($aiResponseStr, 0, 300));
                return $this->getFallbackAssessment($course);
            }

            $questions = $parsed['questions'];
            // Ensure exactly 10 questions
            $questions = array_slice($questions, 0, 10);

            // Hide correct_option_id from client view payload, but keep secret key for server evaluation
            $clientQuestions = [];
            $secretAnswers = [];
            $order = 1;

            foreach ($questions as $index => $q) {
                $qId = "q" . ($index + 1);
                $correctOpt = $q['correct_option_id'] ?? 'opt_a';
                $secretAnswers[$qId] = [
                    'correct_option_id' => $correctOpt,
                    'explanation' => $q['explanation'] ?? '',
                    'lesson_title' => $q['lesson_title'] ?? "Bài " . ($index + 1),
                    'question_content' => $q['content'] ?? '',
                ];

                $clientQuestions[] = [
                    'id' => $qId,
                    'order' => $order++,
                    'content' => $q['content'] ?? "Câu hỏi {$order}",
                    'lesson_title' => $q['lesson_title'] ?? "Bài học {$order}",
                    'options' => $q['options'] ?? [],
                ];
            }

            return [
                'course_id' => $course->id,
                'course_title' => $course->title,
                'title' => "🧠 Bài Đánh giá Năng lực AI: {$course->title}",
                'total_questions' => count($clientQuestions),
                'time_limit_minutes' => 15,
                'credits' => 0, // Mandatory: 0 credits
                'questions' => $clientQuestions,
                'secret_key' => encrypt([
                    'course_id' => $course->id,
                    'answers' => $secretAnswers,
                ]),
            ];

        } catch (Exception $e) {
            Log::error("[SelfAssessmentService] AI generation error: " . $e->getMessage());
            return $this->getFallbackAssessment($course);
        }
    }

    /**
     * Evaluate student submission for Self-Assessment.
     */
    public function submitSelfAssessment(?User $user, array $payload): array
    {
        $submittedAnswers = $payload['answers'] ?? [];
        $secretKey = $payload['secret_key'] ?? null;
        $timeTaken = (int) ($payload['time_taken_seconds'] ?? 120);

        $secretData = null;
        if ($secretKey) {
            try {
                $secretData = decrypt($secretKey);
            } catch (Exception $e) {
                Log::warning("[SelfAssessmentService] Failed decrypting secret_key: " . $e->getMessage());
            }
        }

        $secretAnswers = $secretData['answers'] ?? [];
        $courseId = $secretData['course_id'] ?? ($payload['course_id'] ?? null);
        $course = $courseId ? Course::find($courseId) : null;
        $courseTitle = $course ? $course->title : "Khóa học MindNova";

        $correctCount = 0;
        $totalQuestions = count($secretAnswers) > 0 ? count($secretAnswers) : 10;
        $reviewLessons = [];
        $questionDetails = [];

        foreach ($secretAnswers as $qId => $info) {
            $correctOpt = $info['correct_option_id'];
            $userOpt = $submittedAnswers[$qId] ?? null;
            $isCorrect = ($userOpt && (string)$userOpt === (string)$correctOpt);

            if ($isCorrect) {
                $correctCount++;
            } else {
                if (!empty($info['lesson_title']) && !in_array($info['lesson_title'], $reviewLessons)) {
                    $reviewLessons[] = $info['lesson_title'];
                }
            }

            $questionDetails[] = [
                'id' => $qId,
                'content' => $info['question_content'],
                'is_correct' => $isCorrect,
                'lesson_title' => $info['lesson_title'],
                'user_choice' => $userOpt,
                'correct_choice' => $correctOpt,
                'explanation' => $info['explanation'],
            ];
        }

        $scorePercentage = (int) round(($correctCount / ($totalQuestions ?: 10)) * 100);
        $passed = $scorePercentage >= 70;

        // Persist attempt with 0 credits and mark as self_assessment
        if ($user && Schema::hasTable('user_quiz_attempts')) {
            try {
                $quiz = Quiz::where('type', 'self_assessment')->first();
                if (!$quiz) {
                    $quiz = Quiz::where('title', 'like', '%Đánh giá năng lực%')->first() ?: Quiz::first();
                }

                if ($quiz) {
                    UserQuizAttempt::create([
                        'user_id' => $user->id,
                        'quiz_id' => $quiz->id,
                        'score' => $scorePercentage,
                        'accuracy' => $scorePercentage,
                        'time_taken_seconds' => $timeTaken,
                        'status' => $passed ? 'passed' : 'failed',
                    ]);
                }
            } catch (Exception $e) {
                Log::warning("[SelfAssessmentService] Failed saving attempt: " . $e->getMessage());
            }
        }

        // Custom AI feedback summary
        if ($scorePercentage >= 90) {
            $aiInsight = "Tuyệt vời! Bạn đạt {$correctCount}/10 câu ({$scorePercentage}%). Bạn đã nắm vững lý thuyết và thực hành kiến thức của khóa '{$courseTitle}'.";
        } elseif ($scorePercentage >= 70) {
            $aiInsight = "Khá tốt! Bạn đạt {$correctCount}/10 câu ({$scorePercentage}%). Bạn đã hiểu phần lớn nội dung chính nhưng nên rà soát thêm một số điểm chi tiết.";
        } else {
            $aiInsight = "Bạn đạt {$correctCount}/10 câu ({$scorePercentage}%). Hãy dành thêm thời gian đọc kỹ lại các bài học trọng tâm để củng cố kiến thức.";
        }

        return [
            'course_title' => $courseTitle,
            'score_text' => "{$correctCount}/{$totalQuestions}",
            'correct_count' => $correctCount,
            'total_questions' => $totalQuestions,
            'score_percentage' => $scorePercentage,
            'passed' => $passed,
            'credits_awarded' => 0, // Mandatory: 0 credits
            'ai_insight' => $aiInsight,
            'review_lessons' => $reviewLessons,
            'question_details' => $questionDetails,
        ];
    }

    /**
     * Fallback assessment generator when AI API is unavailable.
     */
    private function getFallbackAssessment(Course $course): array
    {
        $questions = [];
        for ($i = 1; $i <= 10; $i++) {
            $questions[] = [
                'id' => "q{$i}",
                'order' => $i,
                'content' => "Câu hỏi {$i}: Khía cạnh kiến thức cốt lõi bài {$i} của khóa '{$course->title}'?",
                'lesson_title' => "Bài {$i}: Chuyên đề tổng hợp",
                'options' => [
                    ['id' => 'opt_a', 'content' => "Khái niệm và ứng dụng chuẩn xác của bài {$i}"],
                    ['id' => 'opt_b', 'content' => "Phương án định cấu hình tùy chọn b"],
                    ['id' => 'opt_c', 'content' => "Cấu trúc triển khai nâng cao c"],
                    ['id' => 'opt_d', 'content' => "Quy trình xử lý ngoại lệ d"],
                ]
            ];
        }

        $secretAnswers = [];
        foreach ($questions as $q) {
            $secretAnswers[$q['id']] = [
                'correct_option_id' => 'opt_a',
                'explanation' => "Phương án A đại diện cho kiến thức chuẩn xác theo tài liệu bài học.",
                'lesson_title' => $q['lesson_title'],
                'question_content' => $q['content'],
            ];
        }

        return [
            'course_id' => $course->id,
            'course_title' => $course->title,
            'title' => "🧠 Bài Đánh giá Năng lực AI: {$course->title}",
            'total_questions' => 10,
            'time_limit_minutes' => 15,
            'credits' => 0,
            'questions' => $questions,
            'secret_key' => encrypt([
                'course_id' => $course->id,
                'answers' => $secretAnswers,
            ]),
        ];
    }
}
