<?php

namespace App\Services;

use App\Models\ContentAuditLog;
use App\Models\User;

class ContentAuditService
{
    /**
     * Record a content audit log entry.
     *
     * @param string      $action       e.g. COURSE_CREATED, LESSON_SUBMITTED
     * @param string      $entityType   e.g. Course, Lesson, ReviewSubmission
     * @param int         $entityId
     * @param User        $user
     * @param string|null $oldStatus
     * @param string|null $newStatus
     * @param int|null    $versionNumber
     * @param array|null  $metadata
     */
    public function log(
        string $action,
        string $entityType,
        int $entityId,
        User $user,
        ?string $oldStatus = null,
        ?string $newStatus = null,
        ?int $versionNumber = null,
        ?array $metadata = null,
    ): ContentAuditLog {
        return ContentAuditLog::create([
            'user_id' => $user->id,
            'user_role' => $user->role ?? 'unknown',
            'action' => $action,
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'old_status' => $oldStatus,
            'new_status' => $newStatus,
            'version_number' => $versionNumber,
            'metadata' => $metadata,
            'created_at' => now(),
        ]);
    }
}
