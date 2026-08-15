<?php

namespace App\Services\Instructor;

use App\Models\ContentVersion;
use App\Models\Course;
use App\Services\ContentAuditService;
use App\Services\ContentReviewService;
use Illuminate\Support\Str;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class CourseService
{
    public function __construct(
        private readonly CourseModuleService $moduleService,
        private readonly ContentAuditService $auditService,
        private readonly ContentReviewService $reviewService,
    ) {}

    public function createCourse(array $data, int $teacherId): Course
    {
        $thumbnail = $data['thumbnail'] ?? null;
        unset($data['thumbnail']);

        $data['teacher_id'] = $teacherId;
        $data['slug'] = $this->generateUniqueSlug($data['title']);
        $data['status'] = 'draft'; // Always start as draft
        $data['current_version'] = 1;

        $course = Course::create($data);

        if ($thumbnail instanceof UploadedFile) {
            $this->uploadThumbnail($course, $thumbnail);
        }

        // Log creation
        $user = \App\Models\User::find($teacherId);
        if ($user) {
            $this->auditService->log(
                'COURSE_CREATED', 'Course', $course->id, $user,
                null, 'draft', 1,
            );
        }

        return $course;
    }

    public function updateCourse(Course $course, array $data): Course
    {
        // If course is published, teacher edits create a draft revision
        // The actual published version remains unchanged
        if ($course->isPublished()) {
            // Mark any pending submissions as stale since content is changing
            $this->reviewService->markSubmissionsStale($course);
        }

        if (isset($data['title']) && $data['title'] !== $course->title) {
            $data['slug'] = $this->generateUniqueSlug($data['title'], $course->id);
        }

        // If course was published and is being edited, revert to draft
        // but preserve the published_version_id so students still see old version
        if ($course->isPublished() && $course->status === 'published') {
            // Don't change status here — teacher will need to submit for review
            // The published_version_id stays intact = students see old version
        }

        $course->update($data);

        return $course;
    }

    public function deleteCourse(Course $course): void
    {
        // Only allow deleting draft courses
        if ($course->isPublished()) {
            throw new \Exception('Không thể xóa khóa học đang public. Hãy liên hệ Admin.');
        }

        // Delete course thumbnail if exists
        if ($course->thumbnail) {
            $oldPath = str_replace('/storage/', '', parse_url($course->thumbnail, PHP_URL_PATH));
            $oldPathR2 = ltrim(parse_url($course->thumbnail, PHP_URL_PATH), '/');
            Storage::disk('public')->delete($oldPath);
            Storage::disk('r2')->delete($oldPathR2);
        }

        foreach ($course->modules as $module) {
            $this->moduleService->deleteModule($module);
        }
        $course->delete();
    }

    public function uploadThumbnail(Course $course, UploadedFile $file): Course
    {
        // Delete old thumbnail if exists
        if ($course->thumbnail) {
            $oldPath = str_replace('/storage/', '', parse_url($course->thumbnail, PHP_URL_PATH));
            // In case the old thumbnail was on R2, parse_url will just get the path without domain.
            // But if it was on public, the path might start with /storage/ or be relative.
            // R2 usually doesn't have /storage/ in the URL, so we just remove the leading slash.
            $oldPathR2 = ltrim(parse_url($course->thumbnail, PHP_URL_PATH), '/');
            
            // Try deleting from both disks just in case of migration
            Storage::disk('public')->delete($oldPath);
            Storage::disk('r2')->delete($oldPathR2);
        }

        $disk = env('CLOUDFLARE_R2_ACCESS_KEY_ID') ? 'r2' : 'public';
        $path = $file->store("Courses/{$course->id}/Thumbnails", $disk);
        $url = Storage::disk($disk)->url($path);

        $course->update(['thumbnail' => $url]);

        return $course;
    }

    /**
     * Update course status with strict business rules.
     *
     * Teachers can ONLY set: draft, pending_review (via submit)
     * Teachers CANNOT set: published, approved, archived
     */
    public function updateStatus(Course $course, string $status, ?\App\Models\User $user = null): Course
    {
        if ($course->status === $status) {
            return $course;
        }

        // ── RULE 1 & 2: Teacher CANNOT set published or approved ──
        $teacherForbidden = ['published', 'approved', 'archived'];
        if ($user && !$user->isAdmin() && in_array($status, $teacherForbidden)) {
            throw new \Exception('Giáo viên không được phép tự chuyển khóa học sang trạng thái này. Vui lòng gửi kiểm duyệt.');
        }

        // ── Validate state transitions ──
        $allowedTransitions = [
            'draft' => ['pending_review'],
            'pending_review' => ['draft'],       // Teacher can withdraw
            'under_review' => [],                 // Only admin can change
            'approved' => [],                     // Transient, becomes published
            'needs_fixes' => ['draft'],           // Teacher fixes and reverts to draft
            'rejected' => ['draft'],              // Teacher can start over
            'published' => ['draft'],             // Teacher can create revision (draft copy)
            'archived' => ['draft'],              // Re-activate
        ];

        $allowed = $allowedTransitions[$course->status] ?? [];
        if (!in_array($status, $allowed)) {
            throw new \Exception("Không thể chuyển từ '{$course->status}' sang '{$status}'.");
        }

        $oldStatus = $course->status;

        // Special handling: published → draft means "create revision"
        // Don't lose the published_version_id
        if ($oldStatus === 'published' && $status === 'draft') {
            // Keep published_version_id intact — students still see old version
            $course->update(['status' => $status]);
        } else {
            $course->update(['status' => $status]);
        }

        if ($status === 'published' && $oldStatus !== 'published') {
            if ($course->teacher) {
                $course->teacher->notify(new \App\Notifications\CoursePublished($course));
            }
        }

        // Log the status change
        if ($user) {
            $this->auditService->log(
                'COURSE_STATUS_CHANGED', 'Course', $course->id, $user,
                $oldStatus, $status, $course->current_version,
            );
        }

        return $course;
    }

    private function generateUniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $slug = Str::slug($title);
        $originalSlug = $slug;
        $count = 1;

        $query = Course::where('slug', $slug);
        if ($ignoreId) {
            $query->where('id', '!=', $ignoreId);
        }

        while ($query->exists()) {
            $slug = "{$originalSlug}-{$count}";
            $query = Course::where('slug', $slug);
            if ($ignoreId) {
                $query->where('id', '!=', $ignoreId);
            }
            $count++;
        }

        return $slug;
    }
}
