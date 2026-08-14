<?php

namespace App\Services;

use App\Models\ContentVersion;
use App\Models\Course;
use App\Models\CourseModule;
use App\Models\DeletionRequest;
use App\Models\Lesson;
use App\Models\LessonMedia;
use App\Models\ReviewSubmission;
use App\Models\ReviewSubmissionItem;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ContentReviewService
{
    public function __construct(
        private readonly ContentAuditService $auditService,
    ) {}

    // ================================================================
    // SNAPSHOT CREATION
    // ================================================================

    /**
     * Create a frozen JSON snapshot of a course's current state.
     */
    public function createCourseSnapshot(Course $course, User $user): ContentVersion
    {
        $nextVersion = ($course->current_version ?? 0) + 1;

        $snapshotData = [
            'title' => $course->title,
            'slug' => $course->slug,
            'description' => $course->description,
            'thumbnail' => $course->thumbnail,
            'price' => (float) $course->price,
            'level' => $course->level,
            'category_id' => $course->category_id,
            'sale_price' => $course->sale_price ? (float) $course->sale_price : null,
            'sale_start_date' => $course->sale_start_date?->toIso8601String(),
            'sale_end_date' => $course->sale_end_date?->toIso8601String(),
            'is_flash_sale' => (bool) $course->is_flash_sale,
            'modules' => $this->snapshotModules($course),
        ];

        $version = ContentVersion::create([
            'versionable_type' => Course::class,
            'versionable_id' => $course->id,
            'version_number' => $nextVersion,
            'snapshot_data' => $snapshotData,
            'status' => 'pending_review',
            'is_published' => false,
            'created_by' => $user->id,
        ]);

        $course->update(['current_version' => $nextVersion]);

        return $version;
    }

    /**
     * Create a frozen JSON snapshot of a lesson's current state.
     */
    public function createLessonSnapshot(Lesson $lesson, User $user): ContentVersion
    {
        $nextVersion = ($lesson->current_version ?? 0) + 1;

        $snapshotData = $this->buildLessonSnapshotData($lesson);

        $version = ContentVersion::create([
            'versionable_type' => Lesson::class,
            'versionable_id' => $lesson->id,
            'version_number' => $nextVersion,
            'snapshot_data' => $snapshotData,
            'status' => 'pending_review',
            'is_published' => false,
            'created_by' => $user->id,
        ]);

        $lesson->update(['current_version' => $nextVersion]);

        return $version;
    }

    /**
     * Build snapshot data for a lesson.
     */
    private function buildLessonSnapshotData(Lesson $lesson): array
    {
        $mediaData = [];
        foreach ($lesson->media as $media) {
            $mediaData[] = [
                'id' => $media->id,
                'media_type' => $media->media_type,
                'r2_key' => $media->r2_key,
                'original_filename' => $media->original_filename,
                'file_size' => $media->file_size,
                'mime_type' => $media->mime_type,
                'duration_seconds' => $media->duration_seconds,
            ];
        }

        $quizData = null;
        if ($lesson->type === 'quiz_module' && $lesson->quiz) {
            $quiz = $lesson->quiz->load('questions.answers');
            $quizData = [
                'id' => $quiz->id,
                'title' => $quiz->title,
                'time_limit_minutes' => $quiz->time_limit_minutes,
                'passing_score' => $quiz->passing_score,
                'questions' => $quiz->questions->map(fn($q) => [
                    'id' => $q->id,
                    'content' => $q->content,
                    'order' => $q->order,
                    'answers' => $q->answers->map(fn($a) => [
                        'id' => $a->id,
                        'content' => $a->content,
                        'is_correct' => (bool) $a->is_correct,
                    ])->toArray(),
                ])->toArray(),
            ];
        }

        return [
            'title' => $lesson->title,
            'type' => $lesson->type,
            'content' => $lesson->content,
            'video_url' => $lesson->video_url,
            'duration_seconds' => $lesson->duration_seconds ?? 0,
            'order' => $lesson->order,
            'module_id' => $lesson->module_id,
            'course_id' => $lesson->course_id,
            'media' => $mediaData,
            'quiz' => $quizData,
        ];
    }

    /**
     * Snapshot all modules and their lessons for a course.
     */
    private function snapshotModules(Course $course): array
    {
        $modules = [];
        foreach ($course->modules()->with('lessons.media', 'lessons.quiz.questions.answers')->orderBy('order')->get() as $module) {
            $lessons = [];
            foreach ($module->lessons->sortBy('order') as $lesson) {
                $lessons[] = $this->buildLessonSnapshotData($lesson);
            }
            $modules[] = [
                'id' => $module->id,
                'title' => $module->title,
                'order' => $module->order,
                'lessons' => $lessons,
            ];
        }
        return $modules;
    }

    // ================================================================
    // SUBMISSION FOR REVIEW
    // ================================================================

    /**
     * Submit a course for review — creates snapshot and submission record.
     *
     * @throws \Exception
     */
    public function submitForReview(Course $course, User $user): ReviewSubmission
    {
        return DB::transaction(function () use ($course, $user) {
            // Validate: cannot submit if already pending review
            $existingPending = ReviewSubmission::where('course_id', $course->id)
                ->whereIn('status', ['pending', 'under_review'])
                ->exists();

            if ($existingPending) {
                throw new \Exception('Khóa học đang có bản kiểm duyệt chờ xử lý. Không thể gửi thêm.');
            }

            // Validate: course must have at least one lesson
            $lessonCount = Lesson::whereIn('module_id', $course->modules()->select('id'))->count();
            if ($lessonCount === 0) {
                throw new \Exception('Khóa học phải có ít nhất một bài học để gửi kiểm duyệt.');
            }

            // Create course snapshot
            $courseVersion = $this->createCourseSnapshot($course, $user);

            // Create lesson snapshots and submission items
            $lessons = Lesson::whereIn('module_id', $course->modules()->select('id'))->get();
            $newCount = 0;
            $modifiedCount = 0;

            $submissionItems = [];
            foreach ($lessons as $lesson) {
                $lessonVersion = $this->createLessonSnapshot($lesson, $user);

                // Determine change type
                $changeType = 'new';
                if ($lesson->isPublished()) {
                    $changeType = 'modified';
                }

                if ($changeType === 'new') $newCount++;
                if ($changeType === 'modified') $modifiedCount++;

                $submissionItems[] = [
                    'lesson' => $lesson,
                    'version' => $lessonVersion,
                    'change_type' => $changeType,
                ];

                // Update lesson status
                $oldStatus = $lesson->status;
                $lesson->update(['status' => 'pending_review']);

                $this->auditService->log(
                    'LESSON_SUBMITTED', 'Lesson', $lesson->id, $user,
                    $oldStatus, 'pending_review', $lessonVersion->version_number,
                );
            }

            // Include deletion requests
            $deletionRequests = DeletionRequest::where('course_id', $course->id)
                ->where('status', 'pending')
                ->get();
            $deletedCount = $deletionRequests->count();

            // Create submission
            $submission = ReviewSubmission::create([
                'course_id' => $course->id,
                'course_version_id' => $courseVersion->id,
                'submitted_by' => $user->id,
                'submitted_at' => now(),
                'status' => 'pending',
                'metadata' => [
                    'new_lessons' => $newCount,
                    'modified_lessons' => $modifiedCount,
                    'deleted_lessons' => $deletedCount,
                    'total_lessons' => count($submissionItems),
                    'version_number' => $courseVersion->version_number,
                ],
            ]);

            // Create submission items
            foreach ($submissionItems as $item) {
                ReviewSubmissionItem::create([
                    'submission_id' => $submission->id,
                    'lesson_id' => $item['lesson']->id,
                    'lesson_version_id' => $item['version']->id,
                    'change_type' => $item['change_type'],
                ]);
            }

            // Also add deletion request items
            foreach ($deletionRequests as $delReq) {
                $lessonVersion = ContentVersion::where('versionable_type', Lesson::class)
                    ->where('versionable_id', $delReq->lesson_id)
                    ->where('is_published', true)
                    ->first();

                if ($lessonVersion) {
                    ReviewSubmissionItem::create([
                        'submission_id' => $submission->id,
                        'lesson_id' => $delReq->lesson_id,
                        'lesson_version_id' => $lessonVersion->id,
                        'change_type' => 'deleted',
                    ]);
                }
            }

            // Update course status
            $oldStatus = $course->status;
            $course->update(['status' => 'pending_review']);

            $this->auditService->log(
                'COURSE_SUBMITTED', 'Course', $course->id, $user,
                $oldStatus, 'pending_review', $courseVersion->version_number,
                ['submission_id' => $submission->id],
            );

            return $submission;
        });
    }

    // ================================================================
    // ADMIN REVIEW ACTIONS
    // ================================================================

    /**
     * Start reviewing a submission (Admin action).
     */
    public function startReview(ReviewSubmission $submission, User $admin): ReviewSubmission
    {
        if ($submission->status !== 'pending') {
            throw new \Exception('Chỉ có thể bắt đầu kiểm duyệt cho bản gửi đang chờ.');
        }

        $submission->update([
            'status' => 'under_review',
            'reviewed_by' => $admin->id,
        ]);

        // Update course status
        $course = $submission->course;
        $oldStatus = $course->status;
        $course->update(['status' => 'under_review']);

        $this->auditService->log(
            'COURSE_REVIEW_STARTED', 'Course', $course->id, $admin,
            $oldStatus, 'under_review', null,
            ['submission_id' => $submission->id],
        );

        return $submission;
    }

    /**
     * Approve a submission and publish the content (Admin action).
     *
     * Uses database transaction with row locking for concurrency safety.
     */
    public function approveSubmission(ReviewSubmission $submission, User $admin): ReviewSubmission
    {
        return DB::transaction(function () use ($submission, $admin) {
            // Lock the submission row to prevent race conditions
            $submission = ReviewSubmission::lockForUpdate()->findOrFail($submission->id);

            // Validate status
            if (!in_array($submission->status, ['pending', 'under_review'])) {
                throw new \Exception('Không thể duyệt bản gửi ở trạng thái hiện tại.');
            }

            // Check freshness
            if ($submission->isStale()) {
                throw new \Exception('Bản gửi đã cũ. Nội dung đã có thay đổi mới sau khi gửi. Vui lòng yêu cầu giáo viên gửi lại.');
            }

            // Verify the course version still exists
            $courseVersion = ContentVersion::lockForUpdate()->findOrFail($submission->course_version_id);

            // Validate instructor still has permission
            $course = Course::lockForUpdate()->findOrFail($submission->course_id);
            if (!$course->teacher) {
                throw new \Exception('Giáo viên không còn quyền chỉnh sửa khóa học này.');
            }

            // ── Publish the course version ──
            // Unset any previously published course version
            ContentVersion::where('versionable_type', Course::class)
                ->where('versionable_id', $course->id)
                ->where('is_published', true)
                ->update(['is_published' => false, 'status' => 'approved']);

            // Set the new version as published
            $courseVersion->update([
                'is_published' => true,
                'status' => 'published',
            ]);

            // Update course record
            $oldCourseStatus = $course->status;
            $course->update([
                'status' => 'published',
                'published_version_id' => $courseVersion->id,
            ]);

            $this->auditService->log(
                'COURSE_APPROVED', 'Course', $course->id, $admin,
                $oldCourseStatus, 'published', $courseVersion->version_number,
                ['submission_id' => $submission->id],
            );

            $this->auditService->log(
                'COURSE_PUBLISHED', 'Course', $course->id, $admin,
                null, 'published', $courseVersion->version_number,
            );

            // ── Publish lesson versions ──
            foreach ($submission->items as $item) {
                if ($item->change_type === 'deleted') {
                    // Handle deletion
                    $this->processLessonDeletion($item, $admin);
                    continue;
                }

                $lessonVersion = ContentVersion::lockForUpdate()->findOrFail($item->lesson_version_id);
                $lesson = Lesson::lockForUpdate()->findOrFail($item->lesson_id);

                // Unset previous published lesson version
                ContentVersion::where('versionable_type', Lesson::class)
                    ->where('versionable_id', $lesson->id)
                    ->where('is_published', true)
                    ->update(['is_published' => false, 'status' => 'approved']);

                // Set new version as published
                $lessonVersion->update([
                    'is_published' => true,
                    'status' => 'published',
                ]);

                // Update lesson record
                $oldLessonStatus = $lesson->status;
                $lesson->update([
                    'status' => 'published',
                    'published_version_id' => $lessonVersion->id,
                ]);

                // Also set the module as published
                if ($lesson->module && $lesson->module->status !== 'published') {
                    $lesson->module->update(['status' => 'published']);
                }

                $this->auditService->log(
                    'LESSON_APPROVED', 'Lesson', $lesson->id, $admin,
                    $oldLessonStatus, 'published', $lessonVersion->version_number,
                    ['submission_id' => $submission->id],
                );
            }

            // ── Mark submission as approved ──
            $submission->update([
                'status' => 'approved',
                'reviewed_by' => $admin->id,
                'reviewed_at' => now(),
            ]);

            return $submission;
        });
    }

    /**
     * Process a lesson deletion as part of an approved submission.
     */
    private function processLessonDeletion(ReviewSubmissionItem $item, User $admin): void
    {
        $lesson = Lesson::find($item->lesson_id);
        if (!$lesson) return;

        // Unpublish the lesson version
        ContentVersion::where('versionable_type', Lesson::class)
            ->where('versionable_id', $lesson->id)
            ->where('is_published', true)
            ->update(['is_published' => false, 'status' => 'approved']);

        $oldStatus = $lesson->status;
        $lesson->update([
            'status' => 'draft',
            'published_version_id' => null,
        ]);

        // Approve associated deletion requests
        DeletionRequest::where('lesson_id', $lesson->id)
            ->where('status', 'pending')
            ->update([
                'status' => 'approved',
                'reviewed_by' => $admin->id,
                'reviewed_at' => now(),
            ]);

        $this->auditService->log(
            'LESSON_DELETED', 'Lesson', $lesson->id, $admin,
            $oldStatus, 'draft', null,
        );
    }

    /**
     * Reject a submission (Admin action).
     */
    public function rejectSubmission(ReviewSubmission $submission, User $admin, string $feedback): ReviewSubmission
    {
        return DB::transaction(function () use ($submission, $admin, $feedback) {
            $submission = ReviewSubmission::lockForUpdate()->findOrFail($submission->id);

            if (!in_array($submission->status, ['pending', 'under_review'])) {
                throw new \Exception('Không thể từ chối bản gửi ở trạng thái hiện tại.');
            }

            $course = $submission->course;
            $oldStatus = $course->status;

            // Revert course status to draft
            $course->update(['status' => 'rejected']);

            // Revert lesson statuses
            foreach ($submission->items as $item) {
                $lesson = Lesson::find($item->lesson_id);
                if ($lesson && $lesson->status === 'pending_review') {
                    $lesson->update(['status' => 'rejected']);
                }
            }

            // Update version statuses
            ContentVersion::where('id', $submission->course_version_id)
                ->update(['status' => 'rejected']);

            foreach ($submission->items as $item) {
                ContentVersion::where('id', $item->lesson_version_id)
                    ->update(['status' => 'rejected']);
            }

            $submission->update([
                'status' => 'rejected',
                'reviewed_by' => $admin->id,
                'reviewed_at' => now(),
                'review_feedback' => $feedback,
            ]);

            $this->auditService->log(
                'COURSE_REJECTED', 'Course', $course->id, $admin,
                $oldStatus, 'rejected', null,
                ['submission_id' => $submission->id, 'feedback' => $feedback],
            );

            return $submission;
        });
    }

    /**
     * Request fixes for a submission (Admin action).
     */
    public function requestFixes(ReviewSubmission $submission, User $admin, string $feedback): ReviewSubmission
    {
        return DB::transaction(function () use ($submission, $admin, $feedback) {
            $submission = ReviewSubmission::lockForUpdate()->findOrFail($submission->id);

            if (!in_array($submission->status, ['pending', 'under_review'])) {
                throw new \Exception('Không thể yêu cầu chỉnh sửa cho bản gửi ở trạng thái hiện tại.');
            }

            $course = $submission->course;
            $oldStatus = $course->status;

            // Set course to needs_fixes
            $course->update(['status' => 'needs_fixes']);

            // Revert lesson statuses
            foreach ($submission->items as $item) {
                $lesson = Lesson::find($item->lesson_id);
                if ($lesson && $lesson->status === 'pending_review') {
                    $lesson->update(['status' => 'needs_fixes']);
                }
            }

            // Update version statuses
            ContentVersion::where('id', $submission->course_version_id)
                ->update(['status' => 'needs_fixes']);

            foreach ($submission->items as $item) {
                ContentVersion::where('id', $item->lesson_version_id)
                    ->update(['status' => 'needs_fixes']);
            }

            $submission->update([
                'status' => 'needs_fixes',
                'reviewed_by' => $admin->id,
                'reviewed_at' => now(),
                'review_feedback' => $feedback,
            ]);

            $this->auditService->log(
                'COURSE_NEEDS_FIXES', 'Course', $course->id, $admin,
                $oldStatus, 'needs_fixes', null,
                ['submission_id' => $submission->id, 'feedback' => $feedback],
            );

            return $submission;
        });
    }

    // ================================================================
    // DELETION REQUESTS
    // ================================================================

    /**
     * Create a deletion request for a published lesson.
     */
    public function requestLessonDeletion(Lesson $lesson, User $user, ?string $reason = null): DeletionRequest
    {
        if (!$lesson->isPublished()) {
            throw new \Exception('Chỉ có thể yêu cầu xóa bài học đang public.');
        }

        // Check if already pending
        $existing = DeletionRequest::where('lesson_id', $lesson->id)
            ->where('status', 'pending')
            ->exists();

        if ($existing) {
            throw new \Exception('Đã có yêu cầu xóa đang chờ duyệt cho bài học này.');
        }

        $request = DeletionRequest::create([
            'lesson_id' => $lesson->id,
            'course_id' => $lesson->course_id,
            'requested_by' => $user->id,
            'requested_at' => now(),
            'status' => 'pending',
            'reason' => $reason,
        ]);

        $this->auditService->log(
            'LESSON_DELETION_REQUESTED', 'Lesson', $lesson->id, $user,
            'published', 'pending_deletion', null,
            ['reason' => $reason],
        );

        return $request;
    }

    /**
     * Approve a deletion request (standalone, outside of submission).
     */
    public function approveDeletion(DeletionRequest $deletionRequest, User $admin): DeletionRequest
    {
        return DB::transaction(function () use ($deletionRequest, $admin) {
            $deletionRequest = DeletionRequest::lockForUpdate()->findOrFail($deletionRequest->id);

            if ($deletionRequest->status !== 'pending') {
                throw new \Exception('Yêu cầu xóa không ở trạng thái chờ duyệt.');
            }

            $lesson = Lesson::find($deletionRequest->lesson_id);
            if ($lesson) {
                // Unpublish
                ContentVersion::where('versionable_type', Lesson::class)
                    ->where('versionable_id', $lesson->id)
                    ->where('is_published', true)
                    ->update(['is_published' => false]);

                $oldStatus = $lesson->status;
                $lesson->update([
                    'status' => 'draft',
                    'published_version_id' => null,
                ]);

                $this->auditService->log(
                    'LESSON_DELETED', 'Lesson', $lesson->id, $admin,
                    $oldStatus, 'draft', null,
                );
            }

            $deletionRequest->update([
                'status' => 'approved',
                'reviewed_by' => $admin->id,
                'reviewed_at' => now(),
            ]);

            return $deletionRequest;
        });
    }

    /**
     * Reject a deletion request (standalone).
     */
    public function rejectDeletion(DeletionRequest $deletionRequest, User $admin): DeletionRequest
    {
        if ($deletionRequest->status !== 'pending') {
            throw new \Exception('Yêu cầu xóa không ở trạng thái chờ duyệt.');
        }

        $deletionRequest->update([
            'status' => 'rejected',
            'reviewed_by' => $admin->id,
            'reviewed_at' => now(),
        ]);

        return $deletionRequest;
    }

    // ================================================================
    // VERSION DIFFING
    // ================================================================

    /**
     * Compare two versions and return a structured diff.
     */
    public function getVersionDiff(?ContentVersion $oldVersion, ContentVersion $newVersion): array
    {
        $oldData = $oldVersion ? $oldVersion->snapshot : [];
        $newData = $newVersion->snapshot;

        $changes = [];
        $allKeys = array_unique(array_merge(array_keys($oldData), array_keys($newData)));

        foreach ($allKeys as $key) {
            if ($key === 'modules' || $key === 'media' || $key === 'quiz') {
                continue; // Handle nested structures separately
            }

            $oldVal = $oldData[$key] ?? null;
            $newVal = $newData[$key] ?? null;

            if ($oldVal !== $newVal) {
                $changes[] = [
                    'field' => $key,
                    'old_value' => $oldVal,
                    'new_value' => $newVal,
                ];
            }
        }

        return [
            'entity_type' => $newVersion->versionable_type,
            'entity_id' => $newVersion->versionable_id,
            'old_version' => $oldVersion?->version_number,
            'new_version' => $newVersion->version_number,
            'changes' => $changes,
            'old_snapshot' => $oldData,
            'new_snapshot' => $newData,
        ];
    }

    // ================================================================
    // STALENESS CHECK
    // ================================================================

    /**
     * Mark a submission as stale when content changes after submission.
     */
    public function markSubmissionsStale(Course $course): void
    {
        ReviewSubmission::where('course_id', $course->id)
            ->whereIn('status', ['pending', 'under_review'])
            ->whereNull('stale_at')
            ->update(['stale_at' => now()]);
    }

    /**
     * Check if a submission is still fresh.
     */
    public function checkSubmissionFreshness(ReviewSubmission $submission): bool
    {
        return !$submission->isStale();
    }
}
