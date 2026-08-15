<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContentAuditLog;
use App\Models\ContentVersion;
use App\Models\DeletionRequest;
use App\Models\ReviewComment;
use App\Models\ReviewSubmission;
use App\Services\ContentReviewService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly ContentReviewService $reviewService,
    ) {}

    /**
     * GET /admin/reviews
     * List all review submissions grouped by status.
     */
    public function index(Request $request): JsonResponse
    {
        $status = $request->input('status');

        $query = ReviewSubmission::with([
            'course:id,title,slug,thumbnail',
            'submittedBy:id,name,email',
            'reviewedBy:id,name',
        ])->latest('submitted_at');

        if ($status) {
            $query->where('status', $status);
        }

        $submissions = $query->paginate($request->input('per_page', 20));

        $data = $submissions->through(fn($s) => [
            'id' => $s->id,
            'course' => [
                'id' => $s->course?->id,
                'title' => $s->course?->title,
                'slug' => $s->course?->slug,
                'thumbnail' => $s->course?->thumbnail,
            ],
            'instructor' => [
                'id' => $s->submittedBy?->id,
                'name' => $s->submittedBy?->name,
                'email' => $s->submittedBy?->email,
            ],
            'status' => $s->status,
            'submitted_at' => $s->submitted_at,
            'reviewed_at' => $s->reviewed_at,
            'reviewed_by' => $s->reviewedBy?->name,
            'is_stale' => $s->isStale(),
            'metadata' => $s->metadata,
        ]);

        // Also get summary counts
        $counts = [
            'pending' => ReviewSubmission::pending()->count(),
            'under_review' => ReviewSubmission::underReview()->count(),
            'needs_fixes' => ReviewSubmission::needsFixes()->count(),
            'approved' => ReviewSubmission::approved()->count(),
            'rejected' => ReviewSubmission::rejected()->count(),
        ];

        return $this->successResponse([
            'submissions' => $data,
            'counts' => $counts,
        ], 'Danh sách bản gửi kiểm duyệt.');
    }

    /**
     * GET /admin/reviews/{submission}
     * View full submission detail with snapshots.
     */
    public function show(ReviewSubmission $submission): JsonResponse
    {
        $submission->load([
            'course.teacher:id,name,email',
            'course.category:id,name',
            'courseVersion',
            'items.lesson:id,title,type,status,module_id,order',
            'items.lessonVersion',
            'comments.user:id,name',
            'submittedBy:id,name,email',
            'reviewedBy:id,name',
        ]);

        $data = [
            'id' => $submission->id,
            'status' => $submission->status,
            'submitted_at' => $submission->submitted_at,
            'reviewed_at' => $submission->reviewed_at,
            'review_feedback' => $submission->review_feedback,
            'is_stale' => $submission->isStale(),
            'metadata' => $submission->metadata,
            'instructor' => [
                'id' => $submission->submittedBy?->id,
                'name' => $submission->submittedBy?->name,
                'email' => $submission->submittedBy?->email,
            ],
            'reviewer' => $submission->reviewedBy ? [
                'id' => $submission->reviewedBy->id,
                'name' => $submission->reviewedBy->name,
            ] : null,
            'course' => [
                'id' => $submission->course?->id,
                'title' => $submission->course?->title,
                'teacher' => $submission->course?->teacher?->name,
                'category' => $submission->course?->category?->name,
                'current_status' => $submission->course?->status,
            ],
            'course_snapshot' => [
                'version_number' => $submission->courseVersion?->version_number,
                'data' => $submission->courseVersion?->snapshot,
            ],
            'items' => $submission->items->map(fn($item) => [
                'id' => $item->id,
                'lesson_id' => $item->lesson_id,
                'lesson_title' => $item->lesson?->title,
                'lesson_type' => $item->lesson?->type,
                'lesson_status' => $item->lesson?->status,
                'change_type' => $item->change_type,
                'version' => [
                    'version_number' => $item->lessonVersion?->version_number,
                    'snapshot' => $item->lessonVersion?->snapshot,
                ],
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
     * GET /admin/reviews/{submission}/diff
     * View diff between published and pending versions.
     */
    public function diff(ReviewSubmission $submission): JsonResponse
    {
        $submission->load(['courseVersion', 'items.lessonVersion']);

        // Course diff
        $course = $submission->course;
        $publishedCourseVersion = $course?->publishedVersion;
        $pendingCourseVersion = $submission->courseVersion;

        $courseDiff = $this->reviewService->getVersionDiff($publishedCourseVersion, $pendingCourseVersion);

        // Lesson diffs
        $lessonDiffs = [];
        foreach ($submission->items as $item) {
            $lesson = $item->lesson;
            if (!$lesson) continue;

            $publishedLessonVersion = $lesson->publishedVersion;
            $pendingLessonVersion = $item->lessonVersion;

            if ($pendingLessonVersion) {
                $lessonDiffs[] = [
                    'lesson_id' => $item->lesson_id,
                    'lesson_title' => $lesson->title,
                    'change_type' => $item->change_type,
                    'diff' => $this->reviewService->getVersionDiff($publishedLessonVersion, $pendingLessonVersion),
                ];
            }
        }

        return $this->successResponse([
            'course_diff' => $courseDiff,
            'lesson_diffs' => $lessonDiffs,
        ], 'So sánh phiên bản.');
    }

    /**
     * PATCH /admin/reviews/{submission}/start
     * Start reviewing a submission.
     */
    public function startReview(Request $request, ReviewSubmission $submission): JsonResponse
    {
        try {
            $submission = $this->reviewService->startReview($submission, $request->user());
            return $this->successResponse([
                'id' => $submission->id,
                'status' => $submission->status,
            ], 'Đã bắt đầu kiểm duyệt.');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }

    /**
     * PATCH /admin/reviews/{submission}/approve
     * Approve and publish the submission.
     */
    public function approve(Request $request, ReviewSubmission $submission): JsonResponse
    {
        try {
            $submission = $this->reviewService->approveSubmission($submission, $request->user());
            return $this->successResponse([
                'id' => $submission->id,
                'status' => $submission->status,
                'reviewed_at' => $submission->reviewed_at,
            ], 'Khóa học đã được duyệt và xuất bản thành công.');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }

    /**
     * PATCH /admin/reviews/{submission}/reject
     * Reject the submission with feedback.
     */
    public function reject(Request $request, ReviewSubmission $submission): JsonResponse
    {
        $request->validate([
            'feedback' => 'required|string|max:5000',
        ]);

        try {
            $submission = $this->reviewService->rejectSubmission(
                $submission,
                $request->user(),
                $request->input('feedback'),
            );
            return $this->successResponse([
                'id' => $submission->id,
                'status' => $submission->status,
            ], 'Đã từ chối bản gửi.');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }

    /**
     * PATCH /admin/reviews/{submission}/request-fixes
     * Request fixes from the teacher.
     */
    public function requestFixes(Request $request, ReviewSubmission $submission): JsonResponse
    {
        $request->validate([
            'feedback' => 'required|string|max:5000',
        ]);

        try {
            $submission = $this->reviewService->requestFixes(
                $submission,
                $request->user(),
                $request->input('feedback'),
            );
            return $this->successResponse([
                'id' => $submission->id,
                'status' => $submission->status,
            ], 'Đã yêu cầu chỉnh sửa.');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }

    /**
     * POST /admin/reviews/{submission}/comments
     * Add a review comment.
     */
    public function addComment(Request $request, ReviewSubmission $submission): JsonResponse
    {
        $request->validate([
            'content' => 'required|string|max:5000',
            'commentable_type' => 'nullable|string',
            'commentable_id' => 'nullable|integer',
        ]);

        $comment = ReviewComment::create([
            'submission_id' => $submission->id,
            'commentable_type' => $request->input('commentable_type'),
            'commentable_id' => $request->input('commentable_id'),
            'user_id' => $request->user()->id,
            'content' => $request->input('content'),
        ]);

        return $this->createdResponse([
            'id' => $comment->id,
            'content' => $comment->content,
            'user' => $request->user()->name,
            'created_at' => $comment->created_at,
        ], 'Đã thêm nhận xét.');
    }

    /**
     * GET /admin/reviews/deletion-requests
     * List pending deletion requests.
     */
    public function deletionRequests(Request $request): JsonResponse
    {
        $status = $request->input('status', 'pending');

        $requests = DeletionRequest::with([
            'lesson:id,title,type,status',
            'course:id,title',
            'requestedBy:id,name,email',
            'reviewedBy:id,name',
        ])
        ->where('status', $status)
        ->latest('requested_at')
        ->get()
        ->map(fn($r) => [
            'id' => $r->id,
            'lesson' => [
                'id' => $r->lesson?->id,
                'title' => $r->lesson?->title,
                'type' => $r->lesson?->type,
            ],
            'course' => [
                'id' => $r->course?->id,
                'title' => $r->course?->title,
            ],
            'requested_by' => [
                'id' => $r->requestedBy?->id,
                'name' => $r->requestedBy?->name,
            ],
            'requested_at' => $r->requested_at,
            'reason' => $r->reason,
            'status' => $r->status,
            'reviewed_by' => $r->reviewedBy?->name,
            'reviewed_at' => $r->reviewed_at,
        ]);

        return $this->successResponse($requests, 'Danh sách yêu cầu xóa.');
    }

    /**
     * PATCH /admin/reviews/deletion-requests/{deletionRequest}/approve
     */
    public function approveDeletion(Request $request, DeletionRequest $deletionRequest): JsonResponse
    {
        try {
            $result = $this->reviewService->approveDeletion($deletionRequest, $request->user());
            return $this->successResponse([
                'id' => $result->id,
                'status' => $result->status,
            ], 'Đã duyệt yêu cầu xóa bài học.');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }

    /**
     * PATCH /admin/reviews/deletion-requests/{deletionRequest}/reject
     */
    public function rejectDeletion(Request $request, DeletionRequest $deletionRequest): JsonResponse
    {
        try {
            $result = $this->reviewService->rejectDeletion($deletionRequest, $request->user());
            return $this->successResponse([
                'id' => $result->id,
                'status' => $result->status,
            ], 'Đã từ chối yêu cầu xóa.');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }

    /**
     * GET /admin/reviews/audit-log
     * View content audit log.
     */
    public function auditLog(Request $request): JsonResponse
    {
        $query = ContentAuditLog::with('user:id,name,email')
            ->latest('created_at');

        if ($request->filled('entity_type')) {
            $query->where('entity_type', $request->input('entity_type'));
        }

        if ($request->filled('entity_id')) {
            $query->where('entity_id', $request->input('entity_id'));
        }

        if ($request->filled('action')) {
            $query->where('action', $request->input('action'));
        }

        $logs = $query->paginate($request->input('per_page', 50));

        $data = $logs->through(fn($log) => [
            'id' => $log->id,
            'user' => [
                'id' => $log->user?->id,
                'name' => $log->user?->name,
                'email' => $log->user?->email,
            ],
            'user_role' => $log->user_role,
            'action' => $log->action,
            'entity_type' => $log->entity_type,
            'entity_id' => $log->entity_id,
            'old_status' => $log->old_status,
            'new_status' => $log->new_status,
            'version_number' => $log->version_number,
            'metadata' => $log->metadata,
            'created_at' => $log->created_at,
        ]);

        return $this->successResponse($data, 'Nhật ký kiểm duyệt nội dung.');
    }
}
