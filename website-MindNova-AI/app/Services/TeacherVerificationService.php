<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\TeacherCertificate;
use App\Models\TeacherCertificateEvidence;
use App\Models\TeacherVerification;
use App\Models\TeacherVerificationLog;
use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use InvalidArgumentException;

class TeacherVerificationService
{
    /**
     * Upload avatar for teacher to Cloudflare R2
     * Path: Teachers/{teacherId}/Avatar/avatar_xxxxx.webp (or .png/.jpg)
     */
    public function uploadAvatar(User $teacher, UploadedFile $file): string
    {
        $allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
        $allowedExts = ['jpg', 'jpeg', 'png', 'webp'];

        $mime = $file->getMimeType();
        $ext = strtolower($file->getClientOriginalExtension());

        if (!in_array($mime, $allowedMimes) || !in_array($ext, $allowedExts)) {
            throw new InvalidArgumentException('Định dạng ảnh đại diện không hợp lệ. Chỉ chấp nhận JPG, PNG, WEBP.');
        }

        if ($file->getSize() > 5 * 1024 * 1024) {
            throw new InvalidArgumentException('Kích thước ảnh đại diện vượt quá 5MB.');
        }

        $filename = 'avatar_' . Str::random(12) . '.' . $ext;
        $r2Key = "Teachers/{$teacher->id}/Avatar/{$filename}";

        // Save to R2
        Storage::disk('r2')->putFileAs("Teachers/{$teacher->id}/Avatar", $file, $filename);
        $url = Storage::disk('r2')->url($r2Key);

        // Delete old avatar if r2 key exists
        if ($teacher->avatar_url && str_contains($teacher->avatar_url, "Teachers/{$teacher->id}/Avatar")) {
            $oldKey = parse_url($teacher->avatar_url, PHP_URL_PATH);
            if ($oldKey) {
                Storage::disk('r2')->delete(ltrim($oldKey, '/'));
            }
        }

        $teacher->avatar_url = $url;
        $teacher->save();

        return $url;
    }

    /**
     * Get full profile details for teacher
     */
    public function getTeacherProfileData(User $teacher): array
    {
        $profile = UserProfile::firstOrCreate(['user_id' => $teacher->id]);

        $certificates = TeacherCertificate::with('evidences')
            ->where('teacher_id', $teacher->id)
            ->latest()
            ->get();

        $courses = DB::table('courses')
            ->where('teacher_id', $teacher->id)
            ->select('id', 'title', 'slug', 'thumbnail', 'status', 'created_at')
            ->get();

        $latestVerification = TeacherVerification::where('teacher_id', $teacher->id)
            ->latest()
            ->first();

        return [
            'id' => $teacher->id,
            'name' => $teacher->name,
            'email' => $teacher->email,
            'avatar_url' => $teacher->avatar_url,
            'role' => $teacher->role,
            'is_verified' => (bool) $teacher->is_verified,
            'teacher_verification_status' => $teacher->teacher_verification_status ?? 'none',
            'teacher_verification_note' => $teacher->teacher_verification_note,
            'teacher_verified_at' => $teacher->teacher_verified_at,
            'profile' => [
                'bio' => $profile->bio,
                'phone' => $profile->phone,
                'address' => $profile->address,
                'learning_goal' => $profile->learning_goal,
                'skill_level' => $profile->skill_level,
                'cv_path' => $profile->cv_path ? Storage::disk('public')->url($profile->cv_path) : null,
            ],
            'certificates' => $certificates->map(function ($cert) {
                return $this->formatCertificateData($cert, true);
            }),
            'courses' => $courses,
            'verification_request' => $latestVerification ? [
                'id' => $latestVerification->id,
                'status' => $latestVerification->status,
                'submitted_at' => $latestVerification->submitted_at,
                'reviewed_at' => $latestVerification->reviewed_at,
                'rejection_reason' => $latestVerification->rejection_reason,
            ] : null,
        ];
    }

    /**
     * Update teacher profile info
     */
    public function updateProfile(User $teacher, array $data): UserProfile
    {
        $profile = UserProfile::firstOrCreate(['user_id' => $teacher->id]);

        if (array_key_exists('name', $data) && !empty($data['name'])) {
            $teacher->name = $data['name'];
            $teacher->save();
        }

        $profile->update([
            'bio' => $data['bio'] ?? $profile->bio,
            'phone' => $data['phone'] ?? $profile->phone,
            'address' => $data['address'] ?? $profile->address,
            'skill_level' => $data['expertise'] ?? $data['skill_level'] ?? $profile->skill_level,
            'learning_goal' => $data['experience'] ?? $data['learning_goal'] ?? $profile->learning_goal,
        ]);

        return $profile;
    }

    /**
     * Create new Certificate with metadata, certificate image, and evidence documents
     */
    public function createCertificate(User $teacher, array $data, ?UploadedFile $certImage, array $evidenceFiles = []): TeacherCertificate
    {
        return DB::transaction(function () use ($teacher, $data, $certImage, $evidenceFiles) {
            $certificate = TeacherCertificate::create([
                'teacher_id' => $teacher->id,
                'certificate_name' => $data['certificate_name'],
                'issuing_organization' => $data['issuing_organization'] ?? null,
                'certificate_number' => $data['certificate_number'] ?? null,
                'specialization' => $data['specialization'] ?? null,
                'issue_date' => $data['issue_date'] ?? null,
                'expiry_date' => $data['expiry_date'] ?? null,
                'description' => $data['description'] ?? null,
                'verification_url' => $data['verification_url'] ?? null,
                'verification_status' => 'pending',
                'is_public' => isset($data['is_public']) ? (bool) $data['is_public'] : true,
            ]);

            // Handle Certificate Public Image upload to R2
            // Path: Teachers/{teacherId}/Certificates/{certificateId}/{image}
            if ($certImage) {
                $ext = strtolower($certImage->getClientOriginalExtension());
                $filename = 'cert_' . Str::random(10) . '.' . $ext;
                $r2Key = "Teachers/{$teacher->id}/Certificates/{$certificate->id}/{$filename}";
                
                Storage::disk('r2')->putFileAs("Teachers/{$teacher->id}/Certificates/{$certificate->id}", $certImage, $filename);
                $certificate->certificate_image = Storage::disk('r2')->url($r2Key);
                $certificate->save();
            }

            // Handle Private Evidence Files upload to R2
            // Path: Teachers/{teacherId}/Certificates/{certificateId}/Confirm/{evidence}
            foreach ($evidenceFiles as $evidenceFile) {
                if ($evidenceFile instanceof UploadedFile) {
                    $ext = strtolower($evidenceFile->getClientOriginalExtension());
                    $filename = 'notarized_' . Str::random(10) . '.' . $ext;
                    $r2Key = "Teachers/{$teacher->id}/Certificates/{$certificate->id}/Confirm/{$filename}";

                    Storage::disk('r2')->putFileAs("Teachers/{$teacher->id}/Certificates/{$certificate->id}/Confirm", $evidenceFile, $filename);

                    TeacherCertificateEvidence::create([
                        'certificate_id' => $certificate->id,
                        'evidence_path' => $r2Key,
                        'evidence_type' => $data['evidence_type'] ?? 'notarized',
                        'original_name' => $evidenceFile->getClientOriginalName(),
                        'file_size' => $evidenceFile->getSize(),
                        'mime_type' => $evidenceFile->getMimeType(),
                    ]);
                }
            }

            $this->logAction($teacher->id, null, $certificate->id, 'create_certificate', null, 'pending', null, [
                'name' => $certificate->certificate_name,
            ]);

            return $certificate;
        });
    }

    /**
     * Update existing certificate. Resets status to 'pending' if modified after approval.
     */
    public function updateCertificate(User $teacher, TeacherCertificate $certificate, array $data, ?UploadedFile $certImage = null, array $evidenceFiles = []): TeacherCertificate
    {
        if ($certificate->teacher_id !== $teacher->id) {
            throw new InvalidArgumentException('Bạn không có quyền sửa chứng chỉ này.');
        }

        return DB::transaction(function () use ($teacher, $certificate, $data, $certImage, $evidenceFiles) {
            $oldStatus = $certificate->verification_status;
            
            $certificate->certificate_name = $data['certificate_name'] ?? $certificate->certificate_name;
            $certificate->issuing_organization = $data['issuing_organization'] ?? $certificate->issuing_organization;
            $certificate->certificate_number = $data['certificate_number'] ?? $certificate->certificate_number;
            $certificate->specialization = $data['specialization'] ?? $certificate->specialization;
            $certificate->issue_date = $data['issue_date'] ?? $certificate->issue_date;
            $certificate->expiry_date = $data['expiry_date'] ?? $certificate->expiry_date;
            $certificate->description = $data['description'] ?? $certificate->description;
            $certificate->verification_url = $data['verification_url'] ?? $certificate->verification_url;
            if (isset($data['is_public'])) {
                $certificate->is_public = (bool) $data['is_public'];
            }

            // Rule #30: If teacher updates certificate details, status resets to pending for Admin review
            $certificate->verification_status = 'pending';
            $certificate->verified_at = null;
            $certificate->verified_by = null;

            if ($certImage) {
                $ext = strtolower($certImage->getClientOriginalExtension());
                $filename = 'cert_' . Str::random(10) . '.' . $ext;
                $r2Key = "Teachers/{$teacher->id}/Certificates/{$certificate->id}/{$filename}";
                
                Storage::disk('r2')->putFileAs("Teachers/{$teacher->id}/Certificates/{$certificate->id}", $certImage, $filename);
                $certificate->certificate_image = Storage::disk('r2')->url($r2Key);
            }

            $certificate->save();

            // Add new evidence files if provided
            foreach ($evidenceFiles as $evidenceFile) {
                if ($evidenceFile instanceof UploadedFile) {
                    $ext = strtolower($evidenceFile->getClientOriginalExtension());
                    $filename = 'notarized_' . Str::random(10) . '.' . $ext;
                    $r2Key = "Teachers/{$teacher->id}/Certificates/{$certificate->id}/Confirm/{$filename}";

                    Storage::disk('r2')->putFileAs("Teachers/{$teacher->id}/Certificates/{$certificate->id}/Confirm", $evidenceFile, $filename);

                    TeacherCertificateEvidence::create([
                        'certificate_id' => $certificate->id,
                        'evidence_path' => $r2Key,
                        'evidence_type' => $data['evidence_type'] ?? 'notarized',
                        'original_name' => $evidenceFile->getClientOriginalName(),
                        'file_size' => $evidenceFile->getSize(),
                        'mime_type' => $evidenceFile->getMimeType(),
                    ]);
                }
            }

            $this->logAction($teacher->id, null, $certificate->id, 'update_certificate', $oldStatus, 'pending', 'Thông tin bằng cấp được cập nhật, cần duyệt lại');

            return $certificate;
        });
    }

    /**
     * Delete certificate
     */
    public function deleteCertificate(User $teacher, TeacherCertificate $certificate): void
    {
        if ($certificate->teacher_id !== $teacher->id) {
            throw new InvalidArgumentException('Bạn không có quyền xóa chứng chỉ này.');
        }

        DB::transaction(function () use ($teacher, $certificate) {
            // Delete R2 files
            Storage::disk('r2')->deleteDirectory("Teachers/{$teacher->id}/Certificates/{$certificate->id}");
            
            $this->logAction($teacher->id, null, $certificate->id, 'delete_certificate', $certificate->verification_status, null, 'Xóa bằng cấp');
            $certificate->delete();
        });
    }

    /**
     * Submit verification request to Admin
     */
    public function submitVerificationRequest(User $teacher, ?string $note = null): TeacherVerification
    {
        $hasCerts = TeacherCertificate::where('teacher_id', $teacher->id)->exists();
        if (!$hasCerts) {
            throw new InvalidArgumentException('Bạn phải thêm ít nhất 1 bằng cấp/chứng chỉ trước khi yêu cầu xác minh.');
        }

        $pendingRequest = TeacherVerification::where('teacher_id', $teacher->id)
            ->where('status', 'pending')
            ->first();

        if ($pendingRequest) {
            throw new InvalidArgumentException('Yêu cầu xác minh của bạn đang chờ xét duyệt. Vui lòng không gửi lặp lại.');
        }

        return DB::transaction(function () use ($teacher, $note) {
            $verification = TeacherVerification::create([
                'teacher_id' => $teacher->id,
                'status' => 'pending',
                'submitted_at' => now(),
                'admin_note' => $note,
            ]);

            $teacher->teacher_verification_status = 'pending';
            $teacher->teacher_verification_note = $note;
            $teacher->save();

            $this->logAction($teacher->id, null, null, 'submit_verification_request', null, 'pending', $note);

            return $verification;
        });
    }

    /**
     * Admin: Approve individual certificate
     */
    public function approveCertificate(User $admin, TeacherCertificate $certificate, ?string $note = null): TeacherCertificate
    {
        return DB::transaction(function () use ($admin, $certificate, $note) {
            $oldStatus = $certificate->verification_status;

            $certificate->verification_status = 'approved';
            $certificate->verified_at = now();
            $certificate->verified_by = $admin->id;
            $certificate->verification_note = $note;
            $certificate->save();

            $this->logAction($certificate->teacher_id, $admin->id, $certificate->id, 'approve_certificate', $oldStatus, 'approved', $note);

            return $certificate;
        });
    }

    /**
     * Admin: Reject individual certificate
     */
    public function rejectCertificate(User $admin, TeacherCertificate $certificate, string $reason): TeacherCertificate
    {
        if (empty(trim($reason))) {
            throw new InvalidArgumentException('Bắt buộc phải nhập lý do khi từ chối chứng chỉ.');
        }

        return DB::transaction(function () use ($admin, $certificate, $reason) {
            $oldStatus = $certificate->verification_status;

            $certificate->verification_status = 'rejected';
            $certificate->verification_note = $reason;
            $certificate->save();

            $this->logAction($certificate->teacher_id, $admin->id, $certificate->id, 'reject_certificate', $oldStatus, 'rejected', $reason);

            return $certificate;
        });
    }

    /**
     * Admin: Approve teacher verification -> Grants Verified Blue Star Badge
     */
    public function approveTeacherVerification(User $admin, User $teacher, ?string $note = null): User
    {
        return DB::transaction(function () use ($admin, $teacher, $note) {
            $oldStatus = $teacher->teacher_verification_status;

            $teacher->is_verified = true;
            $teacher->teacher_verification_status = 'approved';
            $teacher->teacher_verified_at = now();
            $teacher->teacher_verification_note = $note;
            $teacher->save();

            // Update request
            TeacherVerification::where('teacher_id', $teacher->id)
                ->where('status', 'pending')
                ->update([
                    'status' => 'approved',
                    'reviewed_at' => now(),
                    'reviewed_by' => $admin->id,
                    'verified_at' => now(),
                    'admin_note' => $note,
                ]);

            // Notification
            Notification::create([
                'user_id' => $teacher->id,
                'type' => 'teacher_verification_approved',
                'title' => 'Xác minh thành công ✦✓',
                'message' => 'Hồ sơ của bạn đã được xác minh thành công. Bạn đã được cấp tích xanh trên toàn hệ thống MindNova AI.',
                'is_read' => false,
            ]);

            $this->logAction($teacher->id, $admin->id, null, 'approve_teacher_verification', $oldStatus, 'approved', $note);

            return $teacher;
        });
    }

    /**
     * Admin: Reject teacher verification
     */
    public function rejectTeacherVerification(User $admin, User $teacher, string $reason): User
    {
        if (empty(trim($reason))) {
            throw new InvalidArgumentException('Bắt buộc phải nhập lý do khi từ chối cấp tích xanh.');
        }

        return DB::transaction(function () use ($admin, $teacher, $reason) {
            $oldStatus = $teacher->teacher_verification_status;

            $teacher->is_verified = false;
            $teacher->teacher_verification_status = 'rejected';
            $teacher->teacher_verification_note = $reason;
            $teacher->save();

            // Update request
            TeacherVerification::where('teacher_id', $teacher->id)
                ->where('status', 'pending')
                ->update([
                    'status' => 'rejected',
                    'reviewed_at' => now(),
                    'reviewed_by' => $admin->id,
                    'rejection_reason' => $reason,
                ]);

            // Notification
            Notification::create([
                'user_id' => $teacher->id,
                'type' => 'teacher_verification_rejected',
                'title' => 'Yêu cầu xác minh bị từ chối',
                'message' => "Hồ sơ xác minh của bạn chưa được chấp thuận. Lý do: {$reason}",
                'is_read' => false,
            ]);

            $this->logAction($teacher->id, $admin->id, null, 'reject_teacher_verification', $oldStatus, 'rejected', $reason);

            return $teacher;
        });
    }

    /**
     * Admin: Revoke teacher verification -> Removes Verified Blue Star Badge
     */
    public function revokeTeacherVerification(User $admin, User $teacher, string $reason): User
    {
        if (empty(trim($reason))) {
            throw new InvalidArgumentException('Bắt buộc phải nhập lý do khi thu hồi tích xanh.');
        }

        return DB::transaction(function () use ($admin, $teacher, $reason) {
            $oldStatus = $teacher->teacher_verification_status;

            $teacher->is_verified = false;
            $teacher->teacher_verification_status = 'revoked';
            $teacher->teacher_verification_note = $reason;
            $teacher->save();

            TeacherVerification::where('teacher_id', $teacher->id)
                ->latest()
                ->first()
                ?->update([
                    'status' => 'revoked',
                    'revoked_at' => now(),
                    'admin_note' => $reason,
                ]);

            // Notification
            Notification::create([
                'user_id' => $teacher->id,
                'type' => 'teacher_verification_revoked',
                'title' => 'Tích xanh bị thu hồi',
                'message' => "Tích xanh của bạn đã bị thu hồi. Lý do: {$reason}",
                'is_read' => false,
            ]);

            $this->logAction($teacher->id, $admin->id, null, 'revoke_teacher_verification', $oldStatus, 'revoked', $reason);

            return $teacher;
        });
    }

    /**
     * Securely get time-limited signed URL for private evidence document
     * Requires current user to be Admin or the owner Teacher
     */
    public function getEvidenceSignedUrl(User $user, TeacherCertificateEvidence $evidence): string
    {
        $teacherId = $evidence->certificate->teacher_id;

        if (!$user->isAdmin() && $user->id !== $teacherId) {
            throw new InvalidArgumentException('Bạn không có quyền truy cập tài liệu xác minh này.');
        }

        // Generate 15-minute temporary URL
        return Storage::disk('r2')->temporaryUrl($evidence->evidence_path, now()->addMinutes(15));
    }

    /**
     * Format certificate data for response
     */
    public function formatCertificateData(TeacherCertificate $cert, bool $includeEvidences = false): array
    {
        // Auto-check expiry date
        $isExpired = $cert->expiry_date && $cert->expiry_date->isPast();
        $status = $isExpired ? 'expired' : $cert->verification_status;

        $data = [
            'id' => $cert->id,
            'teacher_id' => $cert->teacher_id,
            'certificate_name' => $cert->certificate_name,
            'issuing_organization' => $cert->issuing_organization,
            'certificate_number' => $cert->certificate_number,
            'specialization' => $cert->specialization,
            'issue_date' => $cert->issue_date?->format('Y-m-d'),
            'expiry_date' => $cert->expiry_date?->format('Y-m-d'),
            'description' => $cert->description,
            'certificate_image' => $cert->certificate_image,
            'verification_url' => $cert->verification_url,
            'verification_status' => $status,
            'verification_note' => $cert->verification_note,
            'verified_at' => $cert->verified_at,
            'is_public' => (bool) $cert->is_public,
            'created_at' => $cert->created_at,
        ];

        if ($includeEvidences && $cert->relationLoaded('evidences')) {
            $data['evidences'] = $cert->evidences->map(function ($ev) {
                return [
                    'id' => $ev->id,
                    'evidence_type' => $ev->evidence_type,
                    'original_name' => $ev->original_name,
                    'file_size' => $ev->file_size,
                    'mime_type' => $ev->mime_type,
                    'created_at' => $ev->created_at,
                ];
            });
        }

        return $data;
    }

    private function logAction(int $teacherId, ?int $adminId, ?int $certId, string $action, ?string $oldStatus, ?string $newStatus, ?string $reason = null, ?array $metadata = null): void
    {
        TeacherVerificationLog::create([
            'teacher_id' => $teacherId,
            'admin_id' => $adminId,
            'certificate_id' => $certId,
            'action' => $action,
            'old_status' => $oldStatus,
            'new_status' => $newStatus,
            'reason' => $reason,
            'metadata' => $metadata,
        ]);
    }
}
