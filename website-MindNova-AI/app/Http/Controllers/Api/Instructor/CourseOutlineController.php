<?php

namespace App\Http\Controllers\Api\Instructor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Contracts\AiProviderInterface;
use App\DTOs\AiMessageDto;
use Illuminate\Support\Facades\Validator;
use Exception;
use App\Models\Course;
use App\Models\CourseModule;
use App\Models\Lesson;

class CourseOutlineController extends Controller
{
    public function __construct(private readonly \App\Services\Ai\AiRouterService $aiRouter)
    {
    }

    public function generate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'topic' => 'required|string',
            'targetAudience' => 'nullable|string',
            'skillLevel' => 'nullable|string',
            'methodology' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $topic = $request->input('topic');
        $targetAudience = $request->input('targetAudience', 'Beginner');
        $skillLevel = $request->input('skillLevel', 'Beginner');
        $methodology = $request->input('methodology', 'Standard');

        $systemPrompt = "Bạn là chuyên gia thiết kế chương trình giảng dạy. Hãy tạo đề cương khóa học ĐẦY ĐỦ NỘI DUNG cho chủ đề '{$topic}'.
        Đối tượng: {$targetAudience}. Trình độ: {$skillLevel}. Phương pháp: {$methodology}.
        
        QUY TẮC BẮT BUỘC:
        1. Mỗi chương có 3 bài tài liệu (document) và 1 bài trắc nghiệm (quiz) ở cuối.
        2. Bài document PHẢI có trường 'content' chứa nội dung HTML chi tiết (200-400 từ), dùng các thẻ <h3>, <p>, <ul>, <li>, <strong>, <em> để format.
        3. Bài quiz PHẢI có trường 'questions' chứa 3 câu hỏi, mỗi câu hỏi có 4 đáp án và đánh dấu đáp án đúng.
        4. Tạo 4-6 chương.
        
        Trả về CHỈ JSON (không markdown, không backticks):
        {
            \"chapters\": [
                {
                    \"title\": \"Tên chương\",
                    \"lessons\": [
                        {
                            \"title\": \"Tên bài tài liệu\",
                            \"type\": \"document\",
                            \"content\": \"<h3>Tiêu đề</h3><p>Nội dung chi tiết bài học...</p>\"
                        },
                        {
                            \"title\": \"Kiểm tra: Tên bài\",
                            \"type\": \"quiz\",
                            \"questions\": [
                                {
                                    \"content\": \"Nội dung câu hỏi?\",
                                    \"answers\": [
                                        {\"content\": \"Đáp án A\", \"is_correct\": true},
                                        {\"content\": \"Đáp án B\", \"is_correct\": false},
                                        {\"content\": \"Đáp án C\", \"is_correct\": false},
                                        {\"content\": \"Đáp án D\", \"is_correct\": false}
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }";

        try {
            $messages = [
                new AiMessageDto("system", $systemPrompt),
                new AiMessageDto("user", "Tạo đề cương khóa học ngay. Chỉ trả về JSON.")
            ];

            $responseResult = $this->aiRouter->sendMessageWithFallback($messages, [
                'response_mime_type' => 'application/json'
            ]);
            
            $responseJson = $responseResult['content'];
            $meta = $responseResult['meta'];

            // Parse response
            // AI might return with markdown ```json ... ```, so we should clean it if needed
            $cleanJson = preg_replace('/```json|```/', '', $responseJson);
            $outline = json_decode(trim($cleanJson), true);

            if (!$outline || !isset($outline['chapters'])) {
                throw new Exception("AI trả về dữ liệu không hợp lệ. Vui lòng thử lại.");
            }

            return response()->json([
                'success' => true,
                'data' => $outline,
                'meta' => $meta
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể tạo đề cương khóa học: ' . $e->getMessage()
            ], 500);
        }
    }

    public function save(Request $request, Course $course)
    {
        $validator = Validator::make($request->all(), [
            'chapters' => 'required|array',
            'chapters.*.title' => 'required|string',
            'chapters.*.lessons' => 'required|array',
            'chapters.*.lessons.*' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        // Authorize
        if ($course->teacher_id !== $request->user()->id) {
            return response()->json(['success' => false, 'message' => 'Bạn không có quyền thực hiện thao tác này.'], 403);
        }

        $chaptersData = $request->input('chapters');
        
        $orderModule = 1;
        foreach ($chaptersData as $chapterData) {
            $module = CourseModule::create([
                'course_id' => $course->id,
                'title' => $chapterData['title'],
                'order' => $orderModule++,
                'description' => ''
            ]);

            $orderLesson = 1;
            foreach ($chapterData['lessons'] as $lessonTitle) {
                Lesson::create([
                    'course_id' => $course->id,
                    'module_id' => $module->id,
                    'title' => $lessonTitle,
                    'order' => $orderLesson++,
                    'status' => 'draft',
                    'content' => '',
                    'description' => ''
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Đã lưu đề cương khóa học thành công.'
        ]);
    }
}
