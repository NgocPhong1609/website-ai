<?php

namespace App\Http\Controllers\Api\Instructor;

use App\Http\Controllers\Controller;
use App\Http\Resources\StudentResource;
use App\Services\Instructor\StudentService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly StudentService $studentService)
    {
    }

    public function index(Request $request)
    {
        $teacherId = $request->user()->id;
        $courseId = $request->input('course_id');
        $search = $request->input('search');

        $query = $this->studentService->getStudentsForInstructor($teacherId, $courseId, $search);

        $perPage = $request->input('per_page', 10);
        $enrollments = $query->paginate($perPage);

        // Map results to include average quiz score and proper status
        $enrollments->getCollection()->transform(function ($enrollment) {
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

            // Calculate quiz score for this specific course
            $avgScore = \App\Models\UserQuizAttempt::where('user_id', $student->id)
                ->whereHas('quiz.lesson.module', function($q) use ($enrollment) {
                    $q->where('course_id', $enrollment->course_id);
                })
                ->avg('score');

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
                'average_score' => $avgScore ? round($avgScore) : null,
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

        $csvData = "ID,Họ tên,Email,Khóa học,Tiến độ (%),Trạng thái,Điểm TB,Ngày ghi danh\n";
        
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

            $avgScore = \App\Models\UserQuizAttempt::where('user_id', $student->id)
                ->whereHas('quiz.lesson.module', function($q) use ($enrollment) {
                    $q->where('course_id', $enrollment->course_id);
                })
                ->avg('score');
            $avgScoreFormatted = $avgScore ? round($avgScore) : 'N/A';
            
            $enrolledAt = $enrollment->enrolled_at ? $enrollment->enrolled_at->format('Y-m-d H:i:s') : 'N/A';

            $csvData .= sprintf(
                "\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\"\n",
                $student->id,
                str_replace('"', '""', $student->name),
                str_replace('"', '""', $student->email),
                str_replace('"', '""', $enrollment->course->title),
                $progress,
                $status,
                $avgScoreFormatted,
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
        $prompt = $request->input('prompt'); // The prompt topic

        // Normally, this would call an external LLM (OpenAI/Gemini).
        // Since we are simulating, we'll return a smart mock based on the prompt type.
        
        $responses = [
            'Động viên học tập' => 'Chào bạn, Thầy/Cô thấy bạn đang có tiến độ rất tốt trong khóa học. Hãy tiếp tục phát huy nhé! Nếu có bất kỳ thắc mắc nào, đừng ngại đặt câu hỏi trong phần thảo luận.',
            'Nhắc lịch kiểm tra' => 'Xin chào, đừng quên tuần này chúng ta có một bài kiểm tra quan trọng nhé. Hãy ôn tập thật kỹ các kiến thức đã học. Chúc bạn đạt điểm cao!',
            'Cập nhật bài giảng mới' => 'Chào bạn, khóa học vừa được cập nhật thêm một số tài liệu và bài giảng mới cực kỳ hữu ích. Bạn hãy vào kiểm tra và học ngay nhé!',
        ];

        $content = $responses[$prompt] ?? 'Chào bạn, đây là thông báo nhắc nhở tự động từ MindNova AI. Chúc bạn học tập hiệu quả!';

        return response()->json([
            'generated_content' => $content
        ], 200);
    }

    public function sendNotification(Request $request)
    {
        $teacherId = $request->user()->id;
        $content = $request->input('content');
        $target = $request->input('target'); // 'all' or specific student_id
        $courseId = $request->input('course_id');

        // Logic to insert into notifications table would go here
        
        return response()->json([
            'message' => 'Đã gửi thông báo thành công đến học viên.'
        ], 200);
    }
}
