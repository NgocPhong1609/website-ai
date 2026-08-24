<?php

namespace App\Http\Controllers\Api\Instructor;

use App\Exceptions\DraftConflictException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Instructor\SaveCourseDraftRequest;
use App\Http\Requests\Instructor\RestoreCourseDraftRequest;
use App\Models\Course;
use App\Models\DraftRevision;
use App\Services\Instructor\DraftRevisionService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;

class DraftRevisionController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly DraftRevisionService $draftRevisionService)
    {
    }

    public function saveCourseDraft(SaveCourseDraftRequest $request, Course $course)
    {
        Gate::authorize('update', $course);

        $idempotencyKey = $request->header('Idempotency-Key', $request->validated('idempotency_key'));
        if ($idempotencyKey !== null && mb_strlen($idempotencyKey) > 64) {
            return $this->validationErrorResponse(['idempotency_key' => ['Idempotency key tối đa 64 ký tự.']]);
        }

        try {
            $result = $this->draftRevisionService->saveCourseDraft(
                $course,
                $request->user(),
                $request->validated('changes'),
                $request->integer('expected_lock_version'),
                $idempotencyKey,
                $request->header('X-Correlation-ID', (string) Str::uuid()),
            );
        } catch (DraftConflictException $exception) {
            return $this->errorResponse($exception->getMessage(), 409, [
                'current_lock_version' => $exception->currentLockVersion,
            ]);
        } catch (\InvalidArgumentException $exception) {
            return $this->validationErrorResponse(['idempotency_key' => [$exception->getMessage()]]);
        }

        return $this->successResponse([
            'course_id' => $result['course']->id,
            'lock_version' => $result['course']->lock_version,
            'revision' => $result['revision'],
            'idempotent' => $result['idempotent'],
        ], 'Bản nháp đã được lưu.');
    }

    public function index(Request $request, Course $course)
    {
        Gate::authorize('view', $course);

        $perPage = min(max($request->integer('per_page', 20), 1), 100);
        $revisions = $course->draftRevisions()->with('creator:id,name')->paginate($perPage);

        return $this->successResponse($revisions);
    }

    public function diff(Request $request, Course $course, DraftRevision $revision)
    {
        Gate::authorize('view', $course);
        $this->ensureCourseRevision($course, $revision);

        $compareToId = $request->integer('compare_to');
        $oldRevision = $compareToId
            ? $course->draftRevisions()->findOrFail($compareToId)
            : $revision->parent;

        return $this->successResponse($this->draftRevisionService->diff($oldRevision, $revision));
    }

    public function restore(RestoreCourseDraftRequest $request, Course $course, DraftRevision $revision)
    {
        Gate::authorize('update', $course);
        $this->ensureCourseRevision($course, $revision);

        try {
            $result = $this->draftRevisionService->restoreCourseDraft(
                $course,
                $revision,
                $request->user(),
                $request->integer('expected_lock_version'),
                $request->header('X-Correlation-ID', (string) Str::uuid()),
            );
        } catch (DraftConflictException $exception) {
            return $this->errorResponse($exception->getMessage(), 409, [
                'current_lock_version' => $exception->currentLockVersion,
            ]);
        }

        return $this->successResponse([
            'course_id' => $result['course']->id,
            'lock_version' => $result['course']->lock_version,
            'revision' => $result['revision'],
        ], 'Đã khôi phục bản nháp.');
    }

    private function ensureCourseRevision(Course $course, DraftRevision $revision): void
    {
        abort_unless(
            $revision->revisionable_type === Course::class && $revision->revisionable_id === $course->id,
            404,
        );
    }
}
