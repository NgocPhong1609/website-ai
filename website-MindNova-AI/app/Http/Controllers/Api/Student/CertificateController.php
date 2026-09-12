<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\Enrollment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CertificateController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $issued = Certificate::with('course')
            ->where('user_id', $user->id)
            ->orderByDesc('issued_at')
            ->get();

        $issuedCourseIds = $issued->pluck('course_id');

        $claimable = Enrollment::with('course')
            ->where('user_id', $user->id)
            ->where(function ($query) {
                $query->where('status', 'completed')
                    ->orWhere('progress_percentage', '>=', 100);
            })
            ->whereNotIn('course_id', $issuedCourseIds)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'issued' => $issued->map(fn (Certificate $certificate) => $this->mapCertificate($certificate, $user->name))->values(),
                'claimable' => $claimable->map(fn (Enrollment $enrollment) => [
                    'course_id' => $enrollment->course_id,
                    'course_title' => $enrollment->course?->title ?? 'Khóa học',
                    'progress_percentage' => (int) $enrollment->progress_percentage,
                ])->values(),
                'stats' => [
                    'total_certificates' => $issued->count(),
                    'completed_courses' => $issued->count() + $claimable->count(),
                ],
            ],
        ]);
    }

    public function claim(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'course_id' => 'required|integer|exists:courses,id',
        ]);

        $user = $request->user();
        $enrollment = Enrollment::where('user_id', $user->id)
            ->where('course_id', $validated['course_id'])
            ->first();

        if (! $enrollment || ($enrollment->status !== 'completed' && (int) $enrollment->progress_percentage < 100)) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn chưa hoàn thành khóa học này.',
            ], 403);
        }

        $certificate = Certificate::firstOrCreate(
            [
                'user_id' => $user->id,
                'course_id' => $validated['course_id'],
            ],
            [
                'issued_at' => now(),
            ]
        );

        $certificate->load('course');

        return response()->json([
            'success' => true,
            'data' => $this->mapCertificate($certificate, $user->name),
        ]);
    }

    private function mapCertificate(Certificate $certificate, string $studentName): array
    {
        return [
            'id' => $certificate->id,
            'course_id' => $certificate->course_id,
            'course_title' => $certificate->course?->title ?? 'Khóa học',
            'student_name' => $studentName,
            'certificate_url' => $certificate->certificate_url,
            'issued_at' => optional($certificate->issued_at)->timezone('Asia/Ho_Chi_Minh')?->format('d/m/Y'),
        ];
    }
}
