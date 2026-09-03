<?php

namespace App\Http\Controllers\Api\Instructor;

use App\Http\Controllers\Controller;
use App\Http\Resources\StudentResource;
use App\Services\Instructor\StudentService;
use App\Models\Notification;
use App\Models\User;
use App\Contracts\AiProviderInterface;
use App\DTOs\AiMessageDto;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Exception;

class StudentController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly StudentService $studentService,
        private readonly AiProviderInterface $aiService
    ) {
    }

    public function index(Request $request)
    {
        $teacherId = $request->user()->id;
        $courseId = $request->input('course_id');
        $search = $request->input('search');

        $query = $this->studentService->getStudentsForInstructor($teacherId, $courseId, $search);

        $perPage = $request->input('per_page', $request->input('limit', 10));
        $enrollments = $query->paginate($perPage);

        // Preload all quiz attempts for all students in this page to eliminate N+1 queries
        $userIds = $enrollments->pluck('user_id')->unique()->filter();
        $courseIds = $enrollments->pluck('course_id')->unique()->filter();

        $allAttempts = \App\Models\UserQuizAttempt::whereIn('user_id', $userIds)
            ->whereHas('quiz', function($q) use ($courseIds) {
                $q->whereHas('attachments', fn($att) => $att->whereIn('course_id', $courseIds))
                  ->orWhereHas('lesson.module', fn($m) => $m->whereIn('course_id', $courseIds));
            })
            ->with(['quiz.attachments'])
            ->get()
            ->groupBy('user_id');

        // Map results to include average quiz score and proper status
        $enrollments->getCollection()->transform(function ($enrollment) use ($allAttempts) {
            $student = $enrollment->user;
            
            // Calculate status based on rule
            $status = 'Đang học';
            $progress = $enrollment->progress_percentage ?? 0;
            
            if ($progress == 0) {
                $status = 'Chưa bắt đầu';
            } elseif ($progress == 100) {
                $status = 'Hoàn tất';
            } elseif ($progress < 30 && $enrollment->enrolled_at && $enrollment->enrolled_at->diffInDays(now()) > 30) {
                $status = 'Nguy cơ trễ';
            }

            // Calculate quiz scores from preloaded attempts
            $attempts = $allAttempts->get($student->id, collect());

            $quizScores = [];
            $totalCredits = 0;
            $weightedScoreSum = 0;

            if ($attempts->isNotEmpty()) {
                $grouped = $attempts->groupBy('quiz_id');
                foreach ($grouped as $quizId => $quizAttempts) {
                    $quiz = $quizAttempts->first()->quiz;
                    if (!$quiz) continue;

                    $isCap = $quiz->type === 'capability_assessment' || 
                             ($quiz->relationLoaded('attachments') && $quiz->attachments->contains('position', 'capability_assessment')) ||
                             \App\Models\QuizCourseAttachment::where('quiz_id', $quiz->id)->where('position', 'capability_assessment')->exists();

                    $isSelfAssessment = $quiz->type === 'self_assessment';
                    $credits = $isSelfAssessment ? 0 : ($isCap ? 3 : 1);
                    $bestScore = (int) round($quizAttempts->max('score'));
                    $quizType = $isSelfAssessment ? 'self_assessment' : ($isCap ? 'capability_assessment' : 'normal');

                    $quizScores[] = [
                        'quiz_id' => $quiz->id,
                        'title' => $isCap && !str_contains($quiz->title, 'Kiểm tra tổng quát') ? "📝 Kiểm tra tổng quát ({$quiz->title})" : ($isSelfAssessment ? "🧠 Đánh giá năng lực ({$quiz->title})" : $quiz->title),
                        'score' => $bestScore,
                        'credits' => $credits,
                        'type' => $quizType,
                    ];

                    if (!$isSelfAssessment) {
                        $totalCredits += $credits;
                        $weightedScoreSum += ($bestScore * $credits);
                    }
                }
            }

            $avgScore = $totalCredits > 0 ? round($weightedScoreSum / $totalCredits) : null;

            return [
                'id' => $student->id,
                'enrollment_id' => $enrollment->id,
                'name' => $student->name,
                'email' => $student->email,
                'avatar_url' => $student->avatar_url,
                'course' => [
                    'id' => $enrollment->course->id,
                    'title' => $enrollment->course->title,
                ],
                'progress' => $progress,
                'status' => $status,
                'average_score' => $avgScore,
                'total_credits' => $totalCredits,
                'quiz_scores' => $quizScores,
                'enrolled_at' => $enrollment->enrolled_at ? $enrollment->enrolled_at->toIso8601String() : null,
            ];
        });

        return response()->json($enrollments, 200);
    }

    public function progress(Request $request, int $studentId)
    {
        // ... this might not be needed anymore, but keeping for compatibility
        return $this->successResponse(['message' => 'Deprecated in favor of index list']);
    }
    
    public function exportCsv(Request $request)
    {
        $teacherId = $request->user()->id;
        $courseId = $request->input('course_id');
        $search = $request->input('search');

        $query = $this->studentService->getStudentsForInstructor($teacherId, $courseId, $search);
        $enrollments = $query->get();

        $csvData = "ID,Họ tên,Email,Khóa học,Tiến độ (%),Trạng thái,Điểm TB,Tổng tín chỉ,Ngày ghi danh\n";
        
        // Use UTF-8 BOM for Excel
        $csvData = "\xEF\xBB\xBF" . $csvData;

        foreach ($enrollments as $enrollment) {
            $student = $enrollment->user;
            $progress = $enrollment->progress_percentage ?? 0;
            
            $status = 'Đang học';
            if ($progress == 0) {
                $status = 'Chưa bắt đầu';
            } elseif ($progress == 100) {
                $status = 'Hoàn tất';
            } elseif ($progress < 30 && $enrollment->enrolled_at && $enrollment->enrolled_at->diffInDays(now()) > 30) {
                $status = 'Nguy cơ trễ';
            }

            $attempts = \App\Models\UserQuizAttempt::where('user_id', $student->id)
                ->whereHas('quiz', function($q) use ($enrollment) {
                    $q->whereHas('attachments', fn($att) => $att->where('course_id', $enrollment->course_id))
                      ->orWhereHas('lesson.module', fn($m) => $m->where('course_id', $enrollment->course_id));
                })
                ->with(['quiz.attachments'])
                ->get();

            $totalCredits = 0;
            $weightedScoreSum = 0;
            if ($attempts->isNotEmpty()) {
                $grouped = $attempts->groupBy('quiz_id');
                foreach ($grouped as $quizId => $quizAttempts) {
                    $quiz = $quizAttempts->first()->quiz;
                    if (!$quiz) continue;

                    $isCap = $quiz->type === 'capability_assessment' || 
                             ($quiz->relationLoaded('attachments') && $quiz->attachments->contains('position', 'capability_assessment')) ||
                             \App\Models\QuizCourseAttachment::where('quiz_id', $quiz->id)->where('position', 'capability_assessment')->exists();

                    $isSelfAssessment = $quiz->type === 'self_assessment';
                    if (!$isSelfAssessment) {
                        $credits = $isCap ? 3 : 1;
                        $bestScore = (int) round($quizAttempts->max('score'));

                        $totalCredits += $credits;
                        $weightedScoreSum += ($bestScore * $credits);
                    }
                }
            }

            $avgScore = $totalCredits > 0 ? round($weightedScoreSum / $totalCredits) : null;
            $avgScoreFormatted = $avgScore !== null ? "{$avgScore}/100" : 'N/A';
            
            $enrolledAt = $enrollment->enrolled_at ? $enrollment->enrolled_at->format('Y-m-d H:i:s') : 'N/A';

            $csvData .= sprintf(
                "\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\"\n",
                $student->id,
                str_replace('"', '""', $student->name),
                str_replace('"', '""', $student->email),
                str_replace('"', '""', $enrollment->course->title),
                $progress,
                $status,
                $avgScoreFormatted,
                $totalCredits,
                $enrolledAt
            );
        }

        return response($csvData)
            ->header('Content-Type', 'text/csv; charset=UTF-8')
            ->header('Content-Disposition', 'attachment; filename="student_list.csv"');
    }

    public function getAnalytics(Request $request)
    {
        $teacherId = $request->user()->id;
        $courseId = $request->input('course_id');
        
        $analytics = $this->studentService->getAnalytics($teacherId, $courseId);
        
        return response()->json($analytics, 200);
    }

    public function getDiscussions(Request $request)
    {
        $teacherId = $request->user()->id;
        $limit = $request->input('limit', 3);
        
        $discussions = $this->studentService->getLatestDiscussions($teacherId, $limit);
        
        return response()->json($discussions, 200);
    }

    public function generateAiNotification(Request $request)
    {
        $teacherId = $request->user()->id;
        $courseId = $request->input('course_id');
        $prompt = $request->input('prompt', 'Cập nhật tiến độ học tập'); // The prompt topic
        $tone = $request->input('tone', 'friendly'); // Tone

        $systemPrompt = "You are an AI teaching assistant. Generate a short, engaging notification (max 3 sentences) for students in Vietnamese.
        Topic: {$prompt}
        Tone: {$tone}
        Return ONLY the notification text string. Do not include quotes or markdown.";

        try {
            /** @var \App\Services\Ai\AiRouterService $aiRouter */
            $aiRouter = app(\App\Services\Ai\AiRouterService::class);
            $result = $aiRouter->sendMessageWithFallback([
                new AiMessageDto("system", $systemPrompt),
                new AiMessageDto("user", "Generate notification for topic: {$prompt}")
            ]);

            $generatedContent = trim($result['content'] ?? '');
            if (!empty($generatedContent)) {
                return response()->json([
                    'generated_content' => $generatedContent
                ], 200);
            }
        } catch (\Throwable $e) {
            logger()->warning('[AiNotification] AI service failed, using template notification fallback: ' . $e->getMessage());
        }

        // High quality fallback notification based on tone & prompt
        $fallbackContent = match ($tone) {
            'urgent' => "📢 THÔNG BÁO KHẨN: {$prompt}. Các bạn học viên chú ý theo dõi và thực hiện đúng thời hạn nhé!",
            'encouraging' => "🌟 Cố gắng lên các bạn! {$prompt}. Hãy tiếp tục hoàn thành các bài học và bài tập hôm nay!",
            default => "📣 Thông báo mới: {$prompt}. Chúc các bạn học viên học tập hiệu quả cùng MindNova AI!",
        };

        return response()->json([
            'generated_content' => $fallbackContent
        ], 200);
    }

    public function getNotificationOptions(Request $request)
    {
        $teacherId = $request->user()->id;
        
        $courses = \App\Models\Course::where('teacher_id', $teacherId)
            ->where('status', 'published') // Optional: depend on requirements, usually you only notify published course students, but let's just use all non-deleted courses. Wait, let's keep it simple.
            ->withCount('enrollments')
            ->having('enrollments_count', '>=', 1)
            ->get(['id', 'title', 'enrollments_count'])
            ->map(function ($course) {
                return [
                    'value' => $course->id,
                    'label' => "{$course->title} ({$course->enrollments_count})",
                    'title' => $course->title,
                    'student_count' => $course->enrollments_count
                ];
            });

        return response()->json($courses, 200);
    }

    public function sendNotification(Request $request)
    {
        $teacherId = $request->user()->id;
        $content = $request->input('content');
        $courseIds = $request->input('course_ids'); // array of course IDs
        $schedule = $request->input('schedule');

        // Validation
        if (empty($courseIds) || !is_array($courseIds)) {
            return response()->json(['message' => 'Vui lòng chọn ít nhất một khóa học.'], 400);
        }

        // Get distinct student IDs from selected courses
        $studentIds = \App\Models\Enrollment::whereIn('course_id', $courseIds)
            ->distinct()
            ->pluck('user_id')
            ->toArray();

        if (empty($studentIds)) {
            return response()->json(['message' => 'Không tìm thấy học viên nào để gửi thông báo.'], 404);
        }

        $now = now();
        $notifications = [];
        
        $meta = json_encode([
            'sender_id' => $teacherId,
            'course_ids' => $courseIds,
            'action_url' => count($courseIds) === 1 ? "/courses/detail?courseId={$courseIds[0]}" : "/"
        ]);
        
        foreach ($studentIds as $sId) {
            $notifications[] = [
                'user_id' => $sId,
                'title' => 'Thông báo từ giảng viên',
                'body' => $content,
                'type' => 'instructor_announcement',
                'metadata' => $meta,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }
        
        // Bulk insert
        Notification::insert($notifications);
        
        return response()->json([
            'message' => 'Đã gửi thông báo thành công đến ' . count($studentIds) . ' học viên.'
        ], 200);
    }
}
