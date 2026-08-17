<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserManagementController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = User::query()->with(['roles:id,name', 'profile']);

        if ($request->filled('search')) {
            $keyword = trim((string) $request->string('search'));
            $query->where(function ($subQuery) use ($keyword): void {
                $subQuery->where('name', 'like', '%' . $keyword . '%')
                    ->orWhere('email', 'like', '%' . $keyword . '%');
            });
        }

        if ($request->filled('role')) {
            $role = (string) $request->string('role');
            $query->where(function ($subQuery) use ($role): void {
                $subQuery->where('role', $role)
                    ->orWhereHas('roles', fn ($q) => $q->where('name', $role));
            });
        }

        if ($request->filled('status')) {
            $query->where('status', (string) $request->string('status'));
        }

        $users = $query->latest()->paginate(15);

        $rows = $users->getCollection()->map(function (User $user) {
            $role = $this->resolveRole($user);

            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $role,
                'status' => $user->status,
                'is_locked' => (bool) $user->is_locked,
                'last_login_at' => $user->last_login_at,
                'teacher_verification_status' => $user->teacher_verification_status ?? 'pending',
                'teacher_verification_note' => $user->teacher_verification_note,
                'profile' => [
                    'bio' => $user->profile?->bio,
                    'phone' => $user->profile?->phone,
                    'address' => $user->profile?->address,
                ],
                'created_at' => $user->created_at,
            ];
        })->values();

        return response()->json([
            'data' => $rows,
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'total' => $users->total(),
            ],
            'summary' => [
                'teachers' => $this->countByRole('teacher'),
                'students' => $this->countByRole('student'),
                'guests' => $this->countByRole('guest'),
                'locked' => User::where('is_locked', true)->count(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['required', 'string', 'in:teacher,student,guest'],
            'status' => ['nullable', 'string', 'in:active,inactive,banned'],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => $data['role'],
            'status' => $data['status'] ?? 'active',
            'is_locked' => false,
            'teacher_verification_status' => $data['role'] === 'teacher' ? 'pending' : 'approved',
        ]);

        $this->syncRole($user, $data['role']);

        $this->writeActivity((int) Auth::id(), 'admin_create_user', User::class, $user->id, [
            'created_role' => $data['role'],
        ]);

        return response()->json([
            'message' => 'Tao tai khoan thanh cong.',
            'data' => $user->fresh(['roles:id,name']),
        ], 201);
    }

    public function updateRole(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'role' => ['required', 'string', 'in:teacher,student,guest'],
        ]);

        $user = User::findOrFail($id);
        $oldRole = $this->resolveRole($user);

        if (Auth::id() === $user->id) {
            return response()->json(['message' => 'Khong the doi role cua chinh minh.'], 422);
        }

        $user->role = $data['role'];

        if ($data['role'] === 'teacher' && !isset($user->teacher_verification_status)) {
            $user->teacher_verification_status = 'pending';
        }

        if ($data['role'] !== 'teacher') {
            $user->teacher_verification_status = 'approved';
            $user->teacher_verified_at = now();
        }

        $user->save();

        $this->syncRole($user, $data['role']);

        $this->writeActivity((int) Auth::id(), 'role_changed', User::class, $user->id, [
            'from' => $oldRole,
            'to' => $data['role'],
        ]);

        return response()->json([
            'message' => 'Cap nhat vai tro thanh cong.',
            'data' => $user->fresh(['roles:id,name']),
        ]);
    }

    public function lock(int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        if (Auth::id() === $user->id) {
            return response()->json(['message' => 'Khong the tu khoa tai khoan cua minh.'], 422);
        }

        $user->update([
            'is_locked' => true,
            'status' => 'banned',
        ]);

        $this->writeActivity((int) Auth::id(), 'admin_lock_user', User::class, $user->id, null);

        return response()->json([
            'message' => 'Da khoa tai khoan.',
            'data' => $user,
        ]);
    }

    public function unlock(int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        $user->update([
            'is_locked' => false,
            'status' => 'active',
        ]);

        $this->writeActivity((int) Auth::id(), 'admin_unlock_user', User::class, $user->id, null);

        return response()->json([
            'message' => 'Da mo khoa tai khoan.',
            'data' => $user,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        if (Auth::id() === $user->id) {
            return response()->json(['message' => 'Khong the xoa chinh minh.'], 422);
        }

        $deletedId = $user->id;
        $user->delete();

        $this->writeActivity((int) Auth::id(), 'admin_delete_user', User::class, $deletedId, null);

        return response()->json(['message' => 'Xoa tai khoan thanh cong.']);
    }

    public function teacherQueue(Request $request): JsonResponse
    {
        $query = User::query()
            ->with(['profile', 'teacherCertificates.evidences'])
            ->where(function ($builder) {
                $builder->where('role', 'teacher')
                    ->orWhereHas('roles', fn ($q) => $q->where('name', 'teacher'));
            })
            ->latest();

        if ($request->filled('status') && $request->string('status') !== 'all') {
            $query->where('teacher_verification_status', (string) $request->string('status'));
        }

        $verificationService = app(\App\Services\TeacherVerificationService::class);

        return response()->json([
            'data' => $query->get()->map(function (User $user) use ($verificationService) {
                return $verificationService->getTeacherProfileData($user);
            })->values(),
        ]);
    }

    public function showTeacherVerificationDetail(int $id): JsonResponse
    {
        $user = User::where(function ($builder) {
            $builder->where('role', 'teacher')
                ->orWhereHas('roles', fn ($q) => $q->where('name', 'teacher'));
        })->findOrFail($id);

        $verificationService = app(\App\Services\TeacherVerificationService::class);
        $data = $verificationService->getTeacherProfileData($user);

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    public function verifyTeacher(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'status' => ['required', 'string', 'in:approved,rejected,pending,revoked'],
            'note' => ['nullable', 'string', 'max:1000'],
            'reason' => ['nullable', 'string', 'max:1000'],
        ]);

        $user = User::findOrFail($id);
        $admin = Auth::user();
        $verificationService = app(\App\Services\TeacherVerificationService::class);

        if ($data['status'] === 'approved') {
            $user = $verificationService->approveTeacherVerification($admin, $user, $data['note'] ?? null);
        } elseif ($data['status'] === 'rejected') {
            $reason = $data['reason'] ?? $data['note'] ?? 'Không đáp ứng đủ yêu cầu xác minh.';
            $user = $verificationService->rejectTeacherVerification($admin, $user, $reason);
        } elseif ($data['status'] === 'revoked') {
            $reason = $data['reason'] ?? $data['note'] ?? 'Thu hồi tích xanh theo quyết định của Admin.';
            $user = $verificationService->revokeTeacherVerification($admin, $user, $reason);
        } else {
            $user->teacher_verification_status = 'pending';
            $user->save();
        }

        $this->writeActivity((int) Auth::id(), 'teacher_verification_reviewed', User::class, $user->id, [
            'status' => $data['status'],
            'note' => $data['note'] ?? $data['reason'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Đã cập nhật trạng thái xác minh giáo viên.',
            'data' => $verificationService->getTeacherProfileData($user),
        ]);
    }

    public function revokeVerification(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'reason' => ['required', 'string', 'max:1000'],
        ]);

        $user = User::findOrFail($id);
        $admin = Auth::user();
        $verificationService = app(\App\Services\TeacherVerificationService::class);

        $updatedUser = $verificationService->revokeTeacherVerification($admin, $user, $data['reason']);

        return response()->json([
            'success' => true,
            'message' => 'Đã thu hồi tích xanh của giáo viên.',
            'data' => $verificationService->getTeacherProfileData($updatedUser),
        ]);
    }

    public function approveCertificate(Request $request, int $certId): JsonResponse
    {
        $data = $request->validate([
            'note' => ['nullable', 'string', 'max:1000'],
        ]);

        $cert = \App\Models\TeacherCertificate::findOrFail($certId);
        $admin = Auth::user();
        $verificationService = app(\App\Services\TeacherVerificationService::class);

        $approvedCert = $verificationService->approveCertificate($admin, $cert, $data['note'] ?? null);

        return response()->json([
            'success' => true,
            'message' => 'Đã duyệt bằng cấp/chứng chỉ.',
            'data' => $verificationService->formatCertificateData($approvedCert->load('evidences'), true),
        ]);
    }

    public function rejectCertificate(Request $request, int $certId): JsonResponse
    {
        $data = $request->validate([
            'reason' => ['required', 'string', 'max:1000'],
        ]);

        $cert = \App\Models\TeacherCertificate::findOrFail($certId);
        $admin = Auth::user();
        $verificationService = app(\App\Services\TeacherVerificationService::class);

        $rejectedCert = $verificationService->rejectCertificate($admin, $cert, $data['reason']);

        return response()->json([
            'success' => true,
            'message' => 'Đã từ chối bằng cấp/chứng chỉ.',
            'data' => $verificationService->formatCertificateData($rejectedCert->load('evidences'), true),
        ]);
    }

    public function getEvidenceSignedUrl(Request $request, int $evidenceId): JsonResponse
    {
        $evidence = \App\Models\TeacherCertificateEvidence::with('certificate')->findOrFail($evidenceId);
        $admin = Auth::user();
        $verificationService = app(\App\Services\TeacherVerificationService::class);

        try {
            $signedUrl = $verificationService->getEvidenceSignedUrl($admin, $evidence);

            return response()->json([
                'success' => true,
                'data' => [
                    'signed_url' => $signedUrl,
                    'original_name' => $evidence->original_name,
                    'mime_type' => $evidence->mime_type,
                    'file_size' => $evidence->file_size,
                    'evidence_type' => $evidence->evidence_type,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 403);
        }
    }

    public function activity(int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        $activityRows = ActivityLog::query()
            ->where('user_id', $user->id)
            ->latest()
            ->take(50)
            ->get();

        $loginLogs = $activityRows
            ->where('action', 'login')
            ->take(20)
            ->map(fn (ActivityLog $log) => [
                'time' => $log->created_at,
                'ip_address' => $log->ip_address,
                'user_agent' => $log->user_agent,
            ])
            ->values();

        $studySeconds = (int) DB::table('lesson_completions')
            ->join('lessons', 'lessons.id', '=', 'lesson_completions.lesson_id')
            ->where('lesson_completions.user_id', $user->id)
            ->sum('lessons.duration_seconds');

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $this->resolveRole($user),
            ],
            'login_logs' => $loginLogs,
            'study_time_seconds' => $studySeconds,
            'history' => $activityRows->map(fn (ActivityLog $log) => [
                'action' => $log->action,
                'subject_type' => $log->subject_type,
                'subject_id' => $log->subject_id,
                'metadata' => $log->metadata,
                'time' => $log->created_at,
            ])->values(),
        ]);
    }

    private function syncRole(User $user, string $roleName): void
    {
        $role = Role::query()->firstOrCreate(['name' => $roleName], ['description' => $roleName]);
        $user->roles()->sync([$role->id]);
    }

    private function resolveRole(User $user): string
    {
        return $user->roles->pluck('name')->first() ?? (string) ($user->role ?? 'guest');
    }

    private function countByRole(string $role): int
    {
        return User::query()
            ->where('role', $role)
            ->orWhereHas('roles', fn ($q) => $q->where('name', $role))
            ->count();
    }

    private function writeActivity(int $adminId, string $action, string $subjectType, int $subjectId, ?array $metadata): void
    {
        ActivityLog::create([
            'user_id' => $adminId,
            'action' => $action,
            'subject_type' => $subjectType,
            'subject_id' => $subjectId,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'metadata' => $metadata,
        ]);
    }
}
