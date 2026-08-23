<?php

namespace App\Http\Controllers\Api\Instructor;

use App\Http\Controllers\Controller;
use App\Models\TeacherCertificate;
use App\Services\TeacherVerificationService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TeacherProfileController extends Controller
{
    protected TeacherVerificationService $verificationService;

    public function __construct(TeacherVerificationService $verificationService)
    {
        $this->verificationService = $verificationService;
    }

    public function getProfile(Request $request): JsonResponse
    {
        $teacher = $request->user();
        $data = $this->verificationService->getTeacherProfileData($teacher);

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $teacher = $request->user();

        $data = $request->validate([
            'name' => ['nullable', 'string', 'max:255'],
            'bio' => ['nullable', 'string', 'max:2000'],
            'phone' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'string', 'max:255'],
            'expertise' => ['nullable', 'string', 'max:255'],
            'experience' => ['nullable', 'string', 'max:255'],
        ]);

        $this->verificationService->updateProfile($teacher, $data);
        $updatedData = $this->verificationService->getTeacherProfileData($teacher);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật thông tin thành công.',
            'data' => $updatedData,
        ]);
    }

    public function uploadAvatar(Request $request): JsonResponse
    {
        $request->validate([
            'avatar' => ['required', 'file', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ]);

        try {
            $url = $this->verificationService->uploadAvatar($request->user(), $request->file('avatar'));

            return response()->json([
                'success' => true,
                'message' => 'Tải lên ảnh đại diện thành công.',
                'data' => ['avatar_url' => $url],
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    public function getCertificates(Request $request): JsonResponse
    {
        $teacher = $request->user();
        $certificates = TeacherCertificate::with('evidences')
            ->where('teacher_id', $teacher->id)
            ->latest()
            ->get();

        $rows = $certificates->map(function ($cert) {
            return $this->verificationService->formatCertificateData($cert, true);
        });

        return response()->json([
            'success' => true,
            'data' => $rows,
        ]);
    }

    public function storeCertificate(Request $request): JsonResponse
    {
        $data = $request->validate([
            'certificate_name' => ['required', 'string', 'max:255'],
            'issuing_organization' => ['nullable', 'string', 'max:255'],
            'certificate_number' => ['nullable', 'string', 'max:255'],
            'specialization' => ['nullable', 'string', 'max:255'],
            'issue_date' => ['nullable', 'date'],
            'expiry_date' => ['nullable', 'date', 'after_or_equal:issue_date'],
            'description' => ['nullable', 'string', 'max:2000'],
            'verification_url' => ['nullable', 'url', 'max:500'],
            'is_public' => ['nullable', 'boolean'],
            'certificate_image' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp', 'max:10240'],
            'evidence_files' => ['nullable', 'array'],
            'evidence_files.*' => ['file', 'mimes:jpg,jpeg,png,webp,pdf', 'max:15360'],
            'evidence_type' => ['nullable', 'string', 'in:notarized,id_document,qr_verification,other'],
        ]);

        try {
            $certImage = $request->file('certificate_image');
            $evidenceFiles = $request->file('evidence_files') ?? [];

            $cert = $this->verificationService->createCertificate($request->user(), $data, $certImage, $evidenceFiles);

            return response()->json([
                'success' => true,
                'message' => 'Thêm chứng chỉ thành công.',
                'data' => $this->verificationService->formatCertificateData($cert->load('evidences'), true),
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    public function updateCertificate(Request $request, int $id): JsonResponse
    {
        $cert = TeacherCertificate::where('teacher_id', $request->user()->id)->findOrFail($id);

        $data = $request->validate([
            'certificate_name' => ['nullable', 'string', 'max:255'],
            'issuing_organization' => ['nullable', 'string', 'max:255'],
            'certificate_number' => ['nullable', 'string', 'max:255'],
            'specialization' => ['nullable', 'string', 'max:255'],
            'issue_date' => ['nullable', 'date'],
            'expiry_date' => ['nullable', 'date'],
            'description' => ['nullable', 'string', 'max:2000'],
            'verification_url' => ['nullable', 'url', 'max:500'],
            'is_public' => ['nullable', 'boolean'],
            'certificate_image' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp', 'max:10240'],
            'evidence_files' => ['nullable', 'array'],
            'evidence_files.*' => ['file', 'mimes:jpg,jpeg,png,webp,pdf', 'max:15360'],
            'evidence_type' => ['nullable', 'string'],
        ]);

        try {
            $certImage = $request->file('certificate_image');
            $evidenceFiles = $request->file('evidence_files') ?? [];

            $updated = $this->verificationService->updateCertificate($request->user(), $cert, $data, $certImage, $evidenceFiles);

            return response()->json([
                'success' => true,
                'message' => 'Cập nhật chứng chỉ thành công.',
                'data' => $this->verificationService->formatCertificateData($updated->load('evidences'), true),
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    public function destroyCertificate(Request $request, int $id): JsonResponse
    {
        $cert = TeacherCertificate::where('teacher_id', $request->user()->id)->findOrFail($id);

        try {
            $this->verificationService->deleteCertificate($request->user(), $cert);

            return response()->json([
                'success' => true,
                'message' => 'Xóa chứng chỉ thành công.',
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    public function submitVerificationRequest(Request $request): JsonResponse
    {
        $data = $request->validate([
            'note' => ['nullable', 'string', 'max:1000'],
        ]);

        try {
            $verification = $this->verificationService->submitVerificationRequest($request->user(), $data['note'] ?? null);

            return response()->json([
                'success' => true,
                'message' => 'Đã gửi yêu cầu xác minh giáo viên tới Admin thành công.',
                'data' => $verification,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    public function getVerificationStatus(Request $request): JsonResponse
    {
        $teacher = $request->user();

        return response()->json([
            'success' => true,
            'data' => [
                'is_verified' => (bool) $teacher->is_verified,
                'status' => $teacher->teacher_verification_status ?? 'none',
                'verified_at' => $teacher->teacher_verified_at,
                'note' => $teacher->teacher_verification_note,
            ],
        ]);
    }
}
