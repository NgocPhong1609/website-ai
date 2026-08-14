<?php

namespace App\Http\Controllers\Api\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\ReviewSubmission;
use App\Services\ContentReviewService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ReviewController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly ContentReviewService $reviewService,
    ) {}

    /**
     * POST /instructor/courses/{course}/submit-review
     * Submit a course for admin review.
     */
    public function submitForReview(Request $request, Course $course): JsonResponse
    {
        Gate::authorize('submitForReview', $course);

        try {
            $submission = $this->reviewService->submitForReview($course, $request->user());

            return $this->createdResponse([
                'submission_id' => $submission->id,
                'status' => $submission->status,
                'submitted_at' => $submission->submitted_at,
                'version_number' => $submission->metadata['version_number'] ?? null,
                'metadata' => $submission->metadata,
            ], 'Khóa học đã được gửi kiểm duyệt thành công.');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }

    /**
     * GET /instructor/courses/{course}/versions
     * List all content versions of a course.
     */
    public function versions(Course $course): JsonResponse
    {
        Gate::authorize('view', $course);

        $versions = $course->versions()
            ->select('id', 'version_number', 'status', 'is_published', 'created_at')
            ->orderByDesc('version_number')
            ->get();

        return $this->successResponse($versions, 'Danh sách phiên bản khóa học.');
    }

    /**
     * GET /instructor/courses/{course}/submissions
     * List all review submissions for a course.
     */
    public function submissions(Course $course): JsonResponse
    {
        Gate::authorize('view', $course);

        $submissions = ReviewSubmission::where('course_id', $course->id)
            ->with(['submittedBy:id,name', 'reviewedBy:id,name'])
            ->orderByDesc('submitted_at')
            ->get()
            ->map(fn($s) => [
                'id' => $s->id,
                'status' => $s->status,
                'submitted_at' => $s->submitted_at,
                'submitted_by' => $s->submittedBy?->name,
                'reviewed_at' => $s->reviewed_at,
                'reviewed_by' => $s->reviewedBy?->name,
                'review_feedback' => $s->review_feedback,
                'is_stale' => $s->isStale(),
                'metadata' => $s->metadata,
            ]);

        return $this->successResponse($submissions, 'Lịch sử gửi kiểm duyệt.');
    }

    /**
     * GET /instructor/submissions/{submission}
     * View a specific submission detail.
     */
    public function showSubmission(ReviewSubmission $submission): JsonResponse
    {
        // Verify the teacher owns this course
        $course = $submission->course;
        Gate::authorize('view', $course);

        $submission->load([
            'courseVersion',
            'items.lesson:id,title,type,status',
            'items.lessonVersion',
            'comments.user:id,name',
        ]);

        $data = [
            'id' => $submission->id,
            'status' => $submission->status,
            'submitted_at' => $submission->submitted_at,
            'reviewed_at' => $submission->reviewed_at,
            'review_feedback' => $submission->review_feedback,
            'is_stale' => $submission->isStale(),
            'metadata' => $submission->metadata,
            'course_version' => [
                'version_number' => $submission->courseVersion->version_number,
                'snapshot' => $submission->courseVersion->snapshot,
            ],
            'items' => $submission->items->map(fn($item) => [
                'lesson_id' => $item->lesson_id,
                'lesson_title' => $item->lesson?->title,
                'lesson_type' => $item->lesson?->type,
                'change_type' => $item->change_type,
                'version_number' => $item->lessonVersion?->version_number,
            ]),
            'comments' => $submission->comments->map(fn($c) => [
                'id' => $c->id,
                'content' => $c->content,
                'user' => $c->user?->name,
                'created_at' => $c->created_at,
            ]),
        ];

        return $this->successResponse($data, 'Chi tiết bản gửi kiểm duyệt.');
    }

    /**
     * POST /instructor/lessons/{lesson}/request-deletion
     * Request deletion of a published lesson.
     */
    public function requestLessonDeletion(Request $request, \App\Models\Lesson $lesson): JsonResponse
    {
        Gate::authorize('manage', $lesson);

        $request->validate([
            'reason' => 'nullable|string|max:1000',
        ]);

        try {
            $lessonService = app(\App\Services\Instructor\LessonService::class);
            $deletionRequest = $lessonService->requestDeletion(
                $lesson,
                $request->user(),
                $request->input('reason'),
            );

            return $this->createdResponse([
                'id' => $deletionRequest->id,
                'status' => $deletionRequest->status,
                'requested_at' => $deletionRequest->requested_at,
            ], 'Yêu cầu xóa bài học đã được gửi.');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }
}
