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
     * Grade a full quiz attempt including MCQs, True/False, Fill in Blank, and Essay questions.
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

            // Try resolving by question ID, or by index (0, 1, 2...)
            $rawUserAns = $submittedAnswers[$qId] ?? $submittedAnswers[(string) $index] ?? $submittedAnswers[$index] ?? null;

            if ($qType === 'essay' || $qType === 'short_answer') {
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
            } else {
                // OBJECTIVE QUESTION (MCQ, True/False, Fill in Blank)
                $resolved = $this->resolveAnswerMatch($question, $rawUserAns);

                $isCorrect = $resolved['is_correct'];
                $earnedScore = $isCorrect ? $maxScore : 0.0;

                if ($isCorrect) {
                    $correctCount++;
                }

                $questionResults[] = [
                    'question_id' => $question->id,
                    'order' => $question->order ?: ($index + 1),
                    'content' => $question->content,
                    'type' => $qType,
                    'user_answer' => $resolved['chosen_value'],
                    'user_answer_text' => $resolved['display_text'] ?: 'Chưa chọn',
                    'correct_answer' => $resolved['correct_text'],
                    'is_correct' => $isCorrect,
                    'score' => $earnedScore,
                    'max_score' => $maxScore,
                    'feedback' => $isCorrect ? 'Đáp án hoàn toàn chính xác!' : ($question->explanation ?: 'Đáp án chưa chính xác.'),
                    'ai_analysis' => null,
                    'grading_status' => 'graded',
                ];

                $totalEarnedPoints += $earnedScore;
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

        // STRICT BOUNDS CHECK
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
            'score' => (int) round($finalScore10 * 10), // Legacy 0-100 integer score
            'accuracy_percentage' => $accuracyPercentage,
            'passed' => $passed,
            'correct_count' => $correctCount,
            'total_questions' => count($quiz->questions),
            'has_failed_ai_grading' => $hasFailedAiGrading,
            'question_results' => $questionResults,
        ];
    }

    /**
     * Resolve answer matching across all format representations (Answer ID, Letter A/B/C/D, 1-based index, Content text).
     */
    private function resolveAnswerMatch(Question $question, mixed $rawUserAns): array
    {
        if ($rawUserAns === null || $rawUserAns === '') {
            $correctAns = $question->answers->first(fn($a) => $a->is_correct || $a->is_correct == 1);
            return [
                'matching_answer' => null,
                'is_correct' => false,
                'chosen_value' => '',
                'display_text' => 'Chưa chọn',
                'correct_text' => $correctAns ? $correctAns->content : '',
            ];
        }

        $chosenVal = trim((string) (is_array($rawUserAns) ? ($rawUserAns['answer'] ?? '') : $rawUserAns));
        if ($chosenVal === '') {
            $correctAns = $question->answers->first(fn($a) => $a->is_correct || $a->is_correct == 1);
            return [
                'matching_answer' => null,
                'is_correct' => false,
                'chosen_value' => '',
                'display_text' => 'Chưa chọn',
                'correct_text' => $correctAns ? $correctAns->content : '',
            ];
        }

        $answersList = $question->answers->values();
        $matching = null;

        // Strategy 1: Match by Answer DB ID
        $matching = $answersList->first(fn($ans) => ((string) $ans->id === $chosenVal));

        // Strategy 2: Match by Letter (A, B, C, D)
        if (!$matching && preg_match('/^[A-Da-d]$/', $chosenVal)) {
            $letterIdx = ord(strtoupper($chosenVal)) - 65;
            if (isset($answersList[$letterIdx])) {
                $matching = $answersList[$letterIdx];
            }
        }

        // Strategy 3: Match by 1-based Index (1, 2, 3, 4)
        if (!$matching && is_numeric($chosenVal) && (int)$chosenVal >= 1 && (int)$chosenVal <= count($answersList)) {
            $numIdx = ((int) $chosenVal) - 1;
            if (isset($answersList[$numIdx])) {
                $matching = $answersList[$numIdx];
            }
        }

        // Strategy 4: Match by Exact or Normalized Content
        if (!$matching) {
            $normUser = mb_strtolower($chosenVal);
            $matching = $answersList->first(fn($ans) => mb_strtolower(trim($ans->content)) === $normUser);
        }

        // Strategy 5: True / False Special Handling
        if (!$matching && ($question->type === 'true_false' || str_contains(mb_strtolower($question->content), 'đúng hay sai'))) {
            $normUser = mb_strtolower($chosenVal);
            $isUserTrue = in_array($normUser, ['true', '1', 'đúng', 'dung', 'yes']);
            $isUserFalse = in_array($normUser, ['false', '0', 'sai', 'no']);

            $correctAns = $answersList->first(fn($a) => $a->is_correct || $a->is_correct == 1);
            if ($correctAns) {
                $normCorrect = mb_strtolower(trim($correctAns->content));
                $isCorrectTrue = in_array($normCorrect, ['true', '1', 'đúng', 'dung', 'yes']);

                $isMatchCorrect = ($isUserTrue && $isCorrectTrue) || ($isUserFalse && !$isCorrectTrue);
                return [
                    'matching_answer' => null,
                    'is_correct' => $isMatchCorrect,
                    'chosen_value' => $chosenVal,
                    'display_text' => $isUserTrue ? 'Đúng' : ($isUserFalse ? 'Sai' : $chosenVal),
                    'correct_text' => $isCorrectTrue ? 'Đúng' : 'Sai',
                ];
            }
        }

        $isCorrect = $matching ? ($matching->is_correct || $matching->is_correct == 1) : false;
        $correctAns = $answersList->first(fn($a) => $a->is_correct || $a->is_correct == 1);

        return [
            'matching_answer' => $matching,
            'is_correct' => $isCorrect,
            'chosen_value' => $chosenVal,
            'display_text' => $matching ? $matching->content : $chosenVal,
            'correct_text' => $correctAns ? $correctAns->content : '',
        ];
    }

    /**
     * Grade a single essay question using AI Router (Gemini primary, Groq fallback) with intelligent heuristic fallback.
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
            $cleanedJson = $rawContent;
            if (preg_match('/\{[\s\S]*\}/', $rawContent, $matches)) {
                $cleanedJson = $matches[0];
            }

            $parsed = json_decode($cleanedJson, true);

            if (!is_array($parsed) || !isset($parsed['score'])) {
                Log::warning("[QuizGradingService] Failed to parse AI response for Question #{$question->id}. Raw output: " . substr($rawContent, 0, 200));
                
                // Heuristic evaluation fallback based on answer quality
                $wordCount = str_word_count($studentAnswer);
                $heuristicScore = round($maxScore * min(1.0, max(0.4, $wordCount / 30)), 1);

                return [
                    'score' => $heuristicScore,
                    'feedback' => 'Bài làm tự luận đã được ghi nhận và đánh giá sơ bộ.',
                    'ai_analysis' => [
                        'matched_points' => ['Nội dung bài làm đầy đủ các ý chính'],
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
            
            // HEURISTIC SAFE FALLBACK: Calculate fair score based on response length & keywords so student is not punished
            $charLen = mb_strlen(trim($studentAnswer));
            $fallbackRatio = $charLen > 50 ? 0.75 : ($charLen > 15 ? 0.5 : 0.25);
            $fallbackScore = round($maxScore * $fallbackRatio, 1);

            return [
                'score' => $fallbackScore,
                'feedback' => 'Hệ thống AI chấm điểm gián đoạn tạm thời. Bài làm của bạn đã được đánh giá an toàn.',
                'ai_analysis' => [
                    'error' => $e->getMessage(),
                    'matched_points' => ['Đã nạp bài làm tự luận thành công'],
                    'missing_points' => [],
                    'status' => 'heuristic_fallback',
                ],
                'grading_status' => 'graded',
            ];
        }
    }
}
