<?php

namespace App\Services\Instructor;

use App\Exceptions\DraftConflictException;
use App\Models\Course;
use App\Models\DraftRevision;
use App\Models\User;
use App\Services\ContentAuditService;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DraftRevisionService
{
    private const COURSE_FIELDS = [
        'title',
        'description',
        'category_id',
        'level',
        'price',
        'sale_price',
        'sale_start_date',
        'sale_end_date',
        'is_flash_sale',
    ];

    public function __construct(private readonly ContentAuditService $auditService)
    {
    }

    /**
     * Persist a course working copy and immutable draft revision atomically.
     * Content-review versions intentionally remain untouched until submission.
     *
     * @return array{course: Course, revision: DraftRevision, idempotent: bool}
     */
    public function saveCourseDraft(
        Course $course,
        User $actor,
        array $changes,
        int $expectedLockVersion,
        ?string $idempotencyKey,
        string $correlationId,
    ): array {
        return DB::transaction(function () use ($course, $actor, $changes, $expectedLockVersion, $idempotencyKey, $correlationId) {
            $lockedCourse = Course::query()->lockForUpdate()->findOrFail($course->id);

            if ($idempotencyKey) {
                $existing = DraftRevision::query()->where('idempotency_key', $idempotencyKey)->first();

                if ($existing) {
                    if ($existing->revisionable_type !== Course::class || $existing->revisionable_id !== $lockedCourse->id) {
                        throw new \InvalidArgumentException('Idempotency key đã được dùng cho một tài nguyên khác.');
                    }

                    return ['course' => $lockedCourse, 'revision' => $existing, 'idempotent' => true];
                }
            }

            if ($lockedCourse->lock_version !== $expectedLockVersion) {
                throw new DraftConflictException($lockedCourse->lock_version);
            }

            $safeChanges = Arr::only($changes, self::COURSE_FIELDS);
            $oldValues = Arr::only($lockedCourse->getAttributes(), array_keys($safeChanges));

            if (array_key_exists('title', $safeChanges) && $safeChanges['title'] !== $lockedCourse->title) {
                $safeChanges['slug'] = $this->uniqueSlug($safeChanges['title'], $lockedCourse->id);
            }

            $lockedCourse->fill($safeChanges);
            $snapshot = $this->courseSnapshot($lockedCourse);
            $contentHash = hash('sha256', json_encode($snapshot, JSON_THROW_ON_ERROR));

            $latest = DraftRevision::query()
                ->where('revisionable_type', Course::class)
                ->where('revisionable_id', $lockedCourse->id)
                ->latest('revision_number')
                ->lockForUpdate()
                ->first();

            if ($latest && hash_equals($latest->content_hash, $contentHash)) {
                return ['course' => $lockedCourse, 'revision' => $latest, 'idempotent' => true];
            }

            $lockedCourse->lock_version++;
            $lockedCourse->save();

            $revision = DraftRevision::create([
                'revisionable_type' => Course::class,
                'revisionable_id' => $lockedCourse->id,
                'revision_number' => ($latest?->revision_number ?? 0) + 1,
                'snapshot_data' => $snapshot,
                'content_hash' => $contentHash,
                'idempotency_key' => $idempotencyKey,
                'reason' => 'autosave',
                'created_by' => $actor->id,
                'parent_revision_id' => $latest?->id,
            ]);

            $this->auditService->log(
                'COURSE_DRAFT_AUTOSAVED',
                'Course',
                $lockedCourse->id,
                $actor,
                null,
                null,
                $revision->revision_number,
                [
                    'old_values' => $oldValues,
                    'new_values' => Arr::only($lockedCourse->getAttributes(), array_keys($safeChanges)),
                    'draft_revision_id' => $revision->id,
                ],
                $lockedCourse->id,
                $correlationId,
            );

            return ['course' => $lockedCourse, 'revision' => $revision, 'idempotent' => false];
        });
    }

    public function diff(?DraftRevision $oldRevision, DraftRevision $newRevision): array
    {
        $oldData = $oldRevision?->snapshot_data ?? [];
        $newData = $newRevision->snapshot_data ?? [];
        $changes = [];

        foreach (array_unique([...array_keys($oldData), ...array_keys($newData)]) as $field) {
            $oldValue = $oldData[$field] ?? null;
            $newValue = $newData[$field] ?? null;

            if ($oldValue !== $newValue) {
                $changes[] = [
                    'field' => $field,
                    'old_value' => $oldValue,
                    'new_value' => $newValue,
                ];
            }
        }

        return [
            'old_revision' => $oldRevision?->revision_number,
            'new_revision' => $newRevision->revision_number,
            'changes' => $changes,
        ];
    }

    /** @return array{course: Course, revision: DraftRevision} */
    public function restoreCourseDraft(
        Course $course,
        DraftRevision $sourceRevision,
        User $actor,
        int $expectedLockVersion,
        string $correlationId,
    ): array {
        return DB::transaction(function () use ($course, $sourceRevision, $actor, $expectedLockVersion, $correlationId) {
            $lockedCourse = Course::query()->lockForUpdate()->findOrFail($course->id);
            if ($lockedCourse->lock_version !== $expectedLockVersion) {
                throw new DraftConflictException($lockedCourse->lock_version);
            }

            $changes = Arr::only($sourceRevision->snapshot_data, self::COURSE_FIELDS);
            $oldValues = Arr::only($lockedCourse->getAttributes(), self::COURSE_FIELDS);
            if (($changes['title'] ?? $lockedCourse->title) !== $lockedCourse->title) {
                $changes['slug'] = $this->uniqueSlug($changes['title'], $lockedCourse->id);
            }

            $lockedCourse->fill($changes);
            $snapshot = $this->courseSnapshot($lockedCourse);
            $latest = DraftRevision::query()
                ->where('revisionable_type', Course::class)
                ->where('revisionable_id', $lockedCourse->id)
                ->latest('revision_number')
                ->lockForUpdate()
                ->first();

            $lockedCourse->lock_version++;
            $lockedCourse->save();

            $revision = DraftRevision::create([
                'revisionable_type' => Course::class,
                'revisionable_id' => $lockedCourse->id,
                'revision_number' => ($latest?->revision_number ?? 0) + 1,
                'snapshot_data' => $snapshot,
                'content_hash' => hash('sha256', json_encode($snapshot, JSON_THROW_ON_ERROR)),
                'reason' => 'restore',
                'created_by' => $actor->id,
                'parent_revision_id' => $sourceRevision->id,
            ]);

            $this->auditService->log(
                'COURSE_DRAFT_RESTORED', 'Course', $lockedCourse->id, $actor,
                null, null, $revision->revision_number,
                [
                    'old_values' => $oldValues,
                    'source_draft_revision_id' => $sourceRevision->id,
                    'restored_draft_revision_id' => $revision->id,
                ],
                $lockedCourse->id,
                $correlationId,
            );

            return ['course' => $lockedCourse, 'revision' => $revision];
        });
    }

    private function courseSnapshot(Course $course): array
    {
        return [
            'title' => $course->title,
            'description' => $course->description,
            'category_id' => $course->category_id,
            'level' => $course->level,
            'price' => (float) $course->price,
            'sale_price' => $course->sale_price === null ? null : (float) $course->sale_price,
            'sale_start_date' => $course->sale_start_date?->toIso8601String(),
            'sale_end_date' => $course->sale_end_date?->toIso8601String(),
            'is_flash_sale' => (bool) $course->is_flash_sale,
        ];
    }

    private function uniqueSlug(string $title, int $courseId): string
    {
        $base = Str::slug($title) ?: 'course';
        $candidate = $base;
        $suffix = 1;

        while (Course::query()->where('slug', $candidate)->where('id', '!=', $courseId)->exists()) {
            $candidate = "{$base}-{$suffix}";
            $suffix++;
        }

        return $candidate;
    }
}
