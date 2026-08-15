<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Question;
use App\Models\SharedResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ContentManagementController extends Controller
{
    public function overview(): JsonResponse
    {
        return response()->json([
            'summary' => [
                'pending_courses' => Course::visibleInAdmin()->whereIn('status', ['draft', 'pending'])->count(),
                'published_courses' => Course::visibleInAdmin()->where('status', 'published')->count(),
                'shared_resources' => SharedResource::count(),
                'question_bank_total' => Question::count(),
            ],
        ]);
    }

    public function courses(Request $request): JsonResponse
    {
        $visibility = (string) $request->string('visibility', 'visible');

        $query = Course::query()->with(['teacher:id,name,email', 'category:id,name'])->latest();

        if ($visibility === 'hidden') {
            $query->whereNotNull('admin_hidden_at');
        } elseif ($visibility !== 'all') {
            $query->visibleInAdmin();
        }

        if ($request->filled('status')) {
            $query->where('status', (string) $request->string('status'));
        }

        if ($request->filled('search')) {
            $keyword = trim((string) $request->string('search'));
            $query->where('title', 'like', '%' . $keyword . '%');
        }

        return response()->json([
            'data' => $query->take(100)->get(),
        ]);
    }

    public function showCourse(Course $course): JsonResponse
    {
        $course->load([
            'teacher:id,name,email',
            'category:id,name',
            'modules.lessons:id,module_id,title,type,status,duration_seconds,order',
        ]);

        $revenue = (float) DB::table('order_items')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->where('order_items.course_id', $course->id)
            ->where('orders.status', 'completed')
            ->sum('order_items.price');

        return response()->json([
            'data' => [
                'id' => $course->id,
                'title' => $course->title,
                'description' => $course->description,
                'status' => $course->status,
                'level' => $course->level,
                'price' => (float) $course->price,
                'category' => $course->category?->name,
                'teacher' => $course->teacher,
                'enrollments' => $course->enrollments()->count(),
                'revenue' => $revenue,
                'admin_hidden_at' => $course->admin_hidden_at,
                'modules' => $course->modules->map(fn ($module) => [
                    'id' => $module->id,
                    'title' => $module->title,
                    'order' => $module->order,
                    'lessons' => $module->lessons->map(fn ($lesson) => [
                        'id' => $lesson->id,
                        'title' => $lesson->title,
                        'type' => $lesson->type,
                        'status' => $lesson->status,
                        'duration_seconds' => $lesson->duration_seconds,
                        'order' => $lesson->order,
                    ])->values(),
                ])->values(),
            ],
        ]);
    }

    public function moderateCourse(Request $request, Course $course): JsonResponse
    {
        $data = $request->validate([
            'status' => ['required', 'string', 'in:archived,draft,published'],
        ]);

        if ($data['status'] === 'published') {
            $reviewService = app(\App\Services\ContentReviewService::class);
            $admin = $request->user();
            
            // Check if there is an active submission
            $submission = \App\Models\ReviewSubmission::where('course_id', $course->id)
                ->whereIn('status', ['pending', 'under_review'])
                ->latest()
                ->first();
                
            if (!$submission) {
                // Self-healing: if no submission exists but we are publishing,
                // force create one so the course can be published properly with snapshots.
                $teacher = $course->teacher ?? $admin;
                
                try {
                    // Update status to draft first so submitForReview allows it
                    $course->update(['status' => 'draft']);
                    $submission = $reviewService->submitForReview($course, $teacher);
                } catch (\Exception $e) {
                    return response()->json(['message' => 'Lỗi tạo snapshot: ' . $e->getMessage()], 422);
                }
            }
            
            try {
                if ($submission->status === 'pending') {
                    $submission = $reviewService->startReview($submission, $admin);
                }
                $reviewService->approveSubmission($submission, $admin);
            } catch (\Exception $e) {
                return response()->json(['message' => 'Lỗi duyệt khóa học: ' . $e->getMessage()], 422);
            }
            
            return response()->json([
                'message' => 'Duyệt khóa học và tạo phiên bản thành công.',
                'data' => $course->fresh(),
            ]);
        }

        // For archived and draft
        $course->status = $data['status'];
        $course->save();

        return response()->json([
            'message' => 'Cập nhật trạng thái khóa học thành công.',
            'data' => $course,
        ]);
    }

    public function removeCourse(Course $course): JsonResponse
    {
        if ($this->courseHasOrders($course)) {
            if ($course->status === 'archived') {
                $course->forceFill([
                    'admin_hidden_at' => now(),
                ])->save();

                return response()->json([
                    'message' => 'Khóa học đã được xóa khỏi danh sách quản trị.',
                ]);
            }

            return response()->json([
                'message' => 'Khóa học đã phát sinh đơn hàng nên chưa thể xóa. Hãy chuyển sang trạng thái Gỡ bỏ trước, sau đó xóa khỏi danh sách quản trị.',
            ], 422);
        }

        $course->delete();

        return response()->json([
            'message' => 'Da go bo khoa hoc.',
        ]);
    }

    public function restoreCourse(Course $course): JsonResponse
    {
        if ($course->admin_hidden_at === null) {
            return response()->json([
                'message' => 'Khóa học này đang hiển thị trong danh sách quản trị.',
            ]);
        }

        $course->forceFill([
            'admin_hidden_at' => null,
        ])->save();

        return response()->json([
            'message' => 'Khóa học đã được khôi phục vào danh sách quản trị.',
        ]);
    }

    public function resources(Request $request): JsonResponse
    {
        $query = SharedResource::query()->latest();

        if ($request->filled('status')) {
            $query->where('status', (string) $request->string('status'));
        }

        return response()->json([
            'data' => $query->get(),
        ]);
    }

    public function storeResource(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', 'in:ebook,document,video,link'],
            'url' => ['required', 'url', 'max:2000'],
            'description' => ['nullable', 'string'],
            'status' => ['nullable', 'string', 'in:active,hidden'],
        ]);

        $resource = SharedResource::create([
            ...$data,
            'status' => $data['status'] ?? 'active',
            'uploaded_by' => $request->user()?->id,
        ]);

        return response()->json([
            'message' => 'Them tai lieu mau thanh cong.',
            'data' => $resource,
        ], 201);
    }

    public function updateResource(Request $request, SharedResource $resource): JsonResponse
    {
        $data = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'type' => ['sometimes', 'string', 'in:ebook,document,video,link'],
            'url' => ['sometimes', 'url', 'max:2000'],
            'description' => ['nullable', 'string'],
            'status' => ['sometimes', 'string', 'in:active,hidden'],
        ]);

        $resource->update($data);

        return response()->json([
            'message' => 'Cap nhat tai lieu thanh cong.',
            'data' => $resource,
        ]);
    }

    public function deleteResource(SharedResource $resource): JsonResponse
    {
        $resource->delete();

        return response()->json([
            'message' => 'Da xoa tai lieu.',
        ]);
    }

    public function questionBank(Request $request): JsonResponse
    {
        $query = Question::query()->with(['quiz.lesson.module.course:id,title', 'quiz.lesson:id,module_id,title']);

        if ($request->filled('category')) {
            $query->where('question_category', (string) $request->string('category'));
        }

        if ($request->filled('search')) {
            $keyword = trim((string) $request->string('search'));
            $query->where('content', 'like', '%' . $keyword . '%');
        }

        $rows = $query->latest()->take(150)->get()->map(function (Question $question) {
            return [
                'id' => $question->id,
                'content' => $question->content,
                'question_category' => $question->question_category,
                'quiz_title' => $question->quiz?->title,
                'lesson_title' => $question->quiz?->lesson?->title,
                'course_title' => $question->quiz?->lesson?->module?->course?->title,
                'created_at' => $question->created_at,
            ];
        })->values();

        return response()->json([
            'data' => $rows,
        ]);
    }

    public function updateQuestionCategory(Request $request, Question $question): JsonResponse
    {
        $data = $request->validate([
            'question_category' => ['required', 'string', 'max:120'],
        ]);

        $question->question_category = $data['question_category'];
        $question->save();

        return response()->json([
            'message' => 'Phan loai cau hoi thanh cong.',
            'data' => $question,
        ]);
    }

    private function courseHasOrders(Course $course): bool
    {
        return DB::table('order_items')
            ->where('course_id', $course->id)
            ->exists();
    }
}
