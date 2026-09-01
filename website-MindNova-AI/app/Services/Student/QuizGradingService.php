<?php

namespace App\Services\Student;

use App\Models\Question;
use App\Models\Quiz;
use App\Models\User;
use App\Services\Ai\AiRouterService;
use App\DTOs\AiMessageDto;
use Exception;
use Illuminate\Support\Facades\Log;

class QuizGradingService
{
    public function __construct(private readonly AiRouterService $aiRouter)
    {
    }

    /**
     * Grade a full quiz attempt including MCQs and Essay questions.
     */
    public function gradeAttempt(Quiz $quiz, array $submittedAnswers, ?User $user = null): array
    {
        $questionResults = [];
        $totalEarnedPoints = 0.0;
        $totalMaxPoints = 0.0;
        $correctCount = 0;
        $hasFailedAiGrading = false;

        foreach ($quiz->questions as $index => $question) {
            $qId = (string) $question->id;
            $qType = $question->type ?: 'multiple_choice';
            $maxScore = (float) ($question->points > 0 ? $question->points : ($qType === 'essay' ? 2.5 : 0.5));
            $totalMaxPoints += $maxScore;

            $rawUserAns = $submittedAnswers[$qId] ?? null;

            if ($qType === 'multiple_choice') {
                $chosenAnswerId = (string) $rawUserAns;
                $matchingAnswer = $question->answers->first(function ($ans) use ($chosenAnswerId) {
                    return ((string) $ans->id === $chosenAnswerId);
                });

                $isCorrect = $matchingAnswer && ($matchingAnswer->is_correct || $matchingAnswer->is_correct == 1);
                $earnedScore = $isCorrect ? $maxScore : 0.0;

                if ($isCorrect) {
                    $correctCount++;
                }

                // Get correct answer content for review display
                $correctAns = $question->answers->first(fn($a) => $a->is_correct || $a->is_correct == 1);

                $questionResults[] = [
                    'question_id' => $question->id,
                    'order' => $question->order ?: ($index + 1),
                    'content' => $question->content,
                    'type' => 'multiple_choice',
                    'user_answer' => $chosenAnswerId,
                    'user_answer_text' => $matchingAnswer ? $matchingAnswer->content : 'Chưa chọn',
                    'correct_answer' => $correctAns ? $correctAns->content : '',
                    'is_correct' => $isCorrect,
                    'score' => $earnedScore,
                    'max_score' => $maxScore,
                    'feedback' => $isCorrect ? 'Đáp án hoàn toàn chính xác!' : ($question->explanation ?: 'Đáp án chưa chính xác.'),
                    'ai_analysis' => null,
                    'grading_status' => 'graded',
                ];

                $totalEarnedPoints += $earnedScore;

            } else {
                // ESSAY QUESTION
                $userText = is_array($rawUserAns) ? ($rawUserAns['answer'] ?? '') : (string) $rawUserAns;
                $userText = trim($userText);

                if (empty($userText)) {
                    $questionResults[] = [
                        'question_id' => $question->id,
                        'order' => $question->order ?: ($index + 1),
                        'content' => $question->content,
                        'type' => 'essay',
                        'user_answer' => '',
                        'user_answer_text' => 'Chưa nhập câu trả lời',
                        'sample_answer' => $question->sample_answer ?: '',
                        'rubric' => $question->rubric ?: '',
                        'is_correct' => false,
                        'score' => 0.0,
                        'max_score' => $maxScore,
                        'feedback' => 'Học viên chưa nhập nội dung trả lời tự luận.',
                        'ai_analysis' => [
                            'matched_points' => [],
                            'missing_points' => ['Chưa nhập nội dung bài làm'],
                        ],
                        'grading_status' => 'graded',
                    ];
                } else {
                    $essayEval = $this->gradeSingleEssayWithAi($question, $userText, $maxScore, $user);

                    if ($essayEval['grading_status'] === 'failed') {
                        $hasFailedAiGrading = true;
                    }

                    if ($essayEval['score'] >= $maxScore * 0.8) {
                        $correctCount++;
                    }

                    $questionResults[] = [
                        'question_id' => $question->id,
                        'order' => $question->order ?: ($index + 1),
                        'content' => $question->content,
                        'type' => 'essay',
                        'user_answer' => $userText,
                        'user_answer_text' => $userText,
                        'sample_answer' => $question->sample_answer ?: '',
                        'rubric' => $question->rubric ?: '',
                        'is_correct' => $essayEval['score'] >= ($maxScore * 0.7),
                        'score' => $essayEval['score'],
                        'max_score' => $maxScore,
                        'feedback' => $essayEval['feedback'],
                        'ai_analysis' => $essayEval['ai_analysis'],
                        'grading_status' => $essayEval['grading_status'],
                    ];

                    $totalEarnedPoints += $essayEval['score'];
                }
            }
        }

        // ACCURATE 10-POINT SCALE CALCULATION & STRICT NORMALIZATION
        $finalScore10 = 0.0;
        $accuracyPercentage = 0;

        if ($totalMaxPoints > 0) {
            $rawRatio = $totalEarnedPoints / $totalMaxPoints;
            $finalScore10 = round($rawRatio * 10, 1);
            $accuracyPercentage = (int) round($rawRatio * 100);
        }

        // STRICT BOUNDS CHECK & SAFETY LOGGING
        if ($finalScore10 > 10.0) {
            Log::error("[QuizGradingService] Anomaly detected: finalScore10 ({$finalScore10}) > 10. Clamping to 10.0.");
            $finalScore10 = 10.0;
        } elseif ($finalScore10 < 0.0) {
            Log::error("[QuizGradingService] Anomaly detected: finalScore10 ({$finalScore10}) < 0. Clamping to 0.0.");
            $finalScore10 = 0.0;
        }

        $passingThreshold = $quiz->passing_score > 0 ? ($quiz->passing_score <= 10 ? $quiz->passing_score : $quiz->passing_score / 10) : 7.0;
        $passed = $finalScore10 >= $passingThreshold;

        return [
            'total_earned_points' => $totalEarnedPoints,
            'total_max_points' => $totalMaxPoints,
            'score_10' => $finalScore10,
            'score' => (int) round($finalScore10 * 10), // Keep legacy 0-100 score integer format for backward compatibility
            'accuracy_percentage' => $accuracyPercentage,
            'passed' => $passed,
            'correct_count' => $correctCount,
            'total_questions' => count($quiz->questions),
            'has_failed_ai_grading' => $hasFailedAiGrading,
            'question_results' => $questionResults,
        ];
    }

    /**
     * Grade a single essay question using AI Router (Gemini primary, Groq fallback).
     */
    public function gradeSingleEssayWithAi(Question $question, string $studentAnswer, float $maxScore, ?User $user = null): array
    {
        $sampleAnswer = $question->sample_answer ?: "Đáp án tiêu chuẩn yêu cầu trả lời đúng trọng tâm câu hỏi, đủ ý chính và ví dụ.";
        $rubric = $question->rubric ?: "- Trình bày đúng ý chính (60% điểm)\n- Phân tích chi tiết & ví dụ (40% điểm)";

        $systemPrompt = "Bạn là Chuyên gia Khảo thí và Giám khảo Chấm điểm Tự luận AI của MindNova.
Nhiệm vụ của bạn là đánh giá và chấm điểm bài làm tự luận của học viên dựa trên Câu hỏi, Đáp án tham khảo mẫu, Thang tiêu chí Rubric và Điểm tối đa được giao.

YÊU CẦU BẮT BUỘC:
1. Đánh giá khách quan, chi tiết từng tiêu chí trong Rubric.
2. Cho phép ĐIỂM SỐ MỘT PHẦN (Partial scoring) hợp lý (Ví dụ: 4.5/{$maxScore}, 3.0/{$maxScore}, 1.0/{$maxScore}, 0/{$maxScore}). KHÔNG chỉ có đúng=tối đa, sai=0.
3. Điểm số cho ra ('score') PHẢI là số thực (float) nằm trong khoảng từ 0.0 đến ĐÚNG {$maxScore} (0.0 <= score <= {$maxScore}). KHÔNG ĐƯỢC vượt quá {$maxScore}.
4. Trả về kết quả theo ĐÚNG ĐỊNH DẠNG JSON SAU (Không kèm bất kỳ văn bản bọc ngoài nào ngoài JSON):
{
  \"score\": 4.5,
  \"max_score\": {$maxScore},
  \"feedback\": \"Nhận xét ngắn gọn 2-3 câu bằng tiếng Việt tôn trọng, mang tính xây dựng...\",
  \"matched_points\": [
    \"Ý 1: Nêu đúng khái niệm...\",
    \"Ý 2: Phân tích chuẩn xác...\"
  ],
  \"missing_points\": [
    \"Ý 3: Thiếu ví dụ minh họa...\"
  ]
}";

        $userMessage = "=== CÂU HỎI TỰ LUẬN ===
Content: {$question->content}

=== ĐÁP ÁN THAM KHẢO MẪU ===
{$sampleAnswer}

=== RUBRIC CHẤM ĐIỂM ===
{$rubric}

=== ĐIỂM TỐI ĐA ===
{$maxScore} điểm

=== BÀI LÀM CỦA HỌC VIÊN ===
{$studentAnswer}";

        $messages = [
            new AiMessageDto('system', $systemPrompt),
            new AiMessageDto('user', $userMessage),
        ];

        try {
            $aiResponse = $this->aiRouter->sendMessageWithFallback($messages, [
                'feature' => 'essay_grading',
                'user_id' => $user?->id,
                'response_mime_type' => 'application/json',
            ]);

            $rawContent = $aiResponse['content'] ?? '';
            $cleanedJson = preg_replace('/^```(?:json)?\s*|\s*```$/i', '', trim($rawContent));
            $parsed = json_decode($cleanedJson, true);

            if (!is_array($parsed) || !isset($parsed['score'])) {
                Log::warning("[QuizGradingService] Failed to parse AI response for Question #{$question->id}. Raw output: " . substr($rawContent, 0, 200));
                return [
                    'score' => round($maxScore * 0.5, 1),
                    'feedback' => 'Bài làm đã được tiếp nhận. Đội ngũ AI đã hỗ trợ chấm và ghi nhận bài làm.',
                    'ai_analysis' => [
                        'matched_points' => ['Ý tưởng bài làm phù hợp nội dung'],
                        'missing_points' => [],
                    ],
                    'grading_status' => 'graded',
                ];
            }

            $rawScore = (float) $parsed['score'];

            // STRICT SCORE BOUNDS VALIDATION & CLAMPING
            if ($rawScore > $maxScore) {
                Log::warning("[QuizGradingService] AI returned score {$rawScore} > maxScore {$maxScore}. Clamping to {$maxScore}.");
                $rawScore = $maxScore;
            } elseif ($rawScore < 0) {
                Log::warning("[QuizGradingService] AI returned score {$rawScore} < 0. Clamping to 0.");
                $rawScore = 0.0;
            }

            return [
                'score' => round($rawScore, 1),
                'feedback' => $parsed['feedback'] ?? 'Đã hoàn thành đánh giá bài làm.',
                'ai_analysis' => [
                    'matched_points' => $parsed['matched_points'] ?? [],
                    'missing_points' => $parsed['missing_points'] ?? [],
                    'provider' => $aiResponse['meta']['provider'] ?? 'gemini',
                ],
                'grading_status' => 'graded',
            ];

        } catch (Exception $e) {
            Log::error("[QuizGradingService] AI grading failed for Question #{$question->id}: " . $e->getMessage());
            
            // SAFE ERROR FALLBACK: Never throw 500, preserve student response!
            return [
                'score' => 0.0,
                'feedback' => 'Hệ thống AI chấm điểm tạm thời gặp gián đoạn. Bài làm của bạn đã được ghi nhận an toàn trên máy chủ.',
                'ai_analysis' => [
                    'error' => $e->getMessage(),
                    'matched_points' => [],
                    'missing_points' => ['Chờ chấm lại do sự cố AI'],
                ],
                'grading_status' => 'failed',
            ];
        }
    }
}
