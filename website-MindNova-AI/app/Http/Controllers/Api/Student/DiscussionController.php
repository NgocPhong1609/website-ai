<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use App\Models\Discussion;
use App\Models\Lesson;
use App\Models\Notification;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DiscussionController extends Controller
{
    use ApiResponse;

    public function index(Request $request, Lesson $lesson)
    {
        $discussions = Discussion::where('lesson_id', $lesson->id)
            ->with(['student', 'replies.user'])
            ->orderBy('created_at', 'desc')
            ->get();

        return $this->successResponse($discussions);
    }

    public function store(Request $request, Lesson $lesson)
    {
        $request->validate([
            'content' => 'required|string|max:2000',
        ]);

        $student = $request->user();

        $discussion = DB::transaction(function () use ($request, $lesson, $student) {
            $discussion = Discussion::create([
                'lesson_id' => $lesson->id,
                'student_id' => $student->id,
                'title' => mb_substr($request->content, 0, 50) . (mb_strlen($request->content) > 50 ? '...' : ''),
                'content' => $request->content,
                'status' => 'open',
            ]);

            // Notify Instructor
            $instructorId = $lesson->module->course->teacher_id ?? null;
            
            if ($instructorId && $instructorId !== $student->id) {
                Notification::create([
                    'user_id' => $instructorId,
                    'type' => 'student_question',
                    'title' => 'Câu hỏi mới từ học viên',
                    'body' => $student->name . ' đã đặt câu hỏi trong bài "' . $lesson->title . '"',
                    'metadata' => [
                        'discussion_id' => $discussion->id,
                        'lesson_id' => $lesson->id,
                        'module_id' => $lesson->module_id,
                        'course_id' => $lesson->module->course_id ?? null,
                    ],
                ]);
            }

            return $discussion->load(['student', 'replies.user']);
        });

        return $this->createdResponse($discussion, 'Discussion created successfully.');
    }

    public function update(Request $request, Lesson $lesson, Discussion $discussion)
    {
        $student = $request->user();

        if ($discussion->student_id !== $student->id) {
            return $this->forbiddenResponse('Bạn không có quyền sửa bình luận này.');
        }

        $request->validate([
            'content' => 'required|string|max:2000',
        ]);

        $discussion->update([
            'content' => $request->content,
            'title' => mb_substr($request->content, 0, 50) . (mb_strlen($request->content) > 50 ? '...' : ''),
        ]);

        return $this->successResponse($discussion->load(['student', 'replies.user']), 'Cập nhật bình luận thành công.');
    }

    public function destroy(Request $request, Lesson $lesson, Discussion $discussion)
    {
        $student = $request->user();

        if ($discussion->student_id !== $student->id) {
            return $this->forbiddenResponse('Bạn không có quyền xóa bình luận này.');
        }

        $discussion->delete();

        return $this->successResponse(null, 'Xóa bình luận thành công.');
    }
}
