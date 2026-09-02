<?php

namespace App\Services\Instructor;

use App\Models\RevenueAllocation;
use App\Models\InstructorTransaction;
use App\Models\Course;
use App\Services\Student\CourseService;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class RevenueUnlockService
{
    /**
     * Evaluate and unlock all eligible PENDING allocations for a specific instructor or all instructors
     */
    public function unlockEligibleAllocations(?int $instructorId = null): int
    {
        $query = RevenueAllocation::where('status', 'PENDING');

        if ($instructorId) {
            $query->where('instructor_id', $instructorId);
        }

        $pendingAllocations = $query->get();
        $unlockedCount = 0;

        foreach ($pendingAllocations as $allocation) {
            if ($this->evaluateAndUnlock($allocation)) {
                $unlockedCount++;
            }
        }

        return $unlockedCount;
    }

    /**
     * Evaluate a single allocation and unlock if no longer eligible for refund.
     * Returns true if unlocked.
     */
    public function evaluateAndUnlock(RevenueAllocation $allocation): bool
    {
        if ($allocation->status !== 'PENDING') {
            return false;
        }

        return DB::transaction(function () use ($allocation) {
            // Lock row for update to ensure idempotency
            $alloc = RevenueAllocation::where('id', $allocation->id)
                ->where('status', 'PENDING')
                ->lockForUpdate()
                ->first();

            if (!$alloc) {
                return false;
            }

            $within30Days = Carbon::now()->diffInDays($alloc->created_at) <= 30;

            $course = Course::find($alloc->course_id);
            if (!$course) {
                return false;
            }

            $courseService = app(CourseService::class);
            $progressData = $courseService->calculateStudentProgress($course, $alloc->student_id);

            $progressPercentage = $progressData['progress_percentage'] ?? 0;
            $completedLessons = $progressData['completed_lessons'] ?? 0;

            // Refund eligibility rule:
            // refundEligible = within30Days AND (progressPercentage <= 10 AND completedLessons <= 5)
            $progressEligible = ($progressPercentage <= 10) && ($completedLessons <= 5);
            $refundEligible = $within30Days && $progressEligible;

            // If refundEligible is FALSE, unlock the revenue to AVAILABLE!
            if (!$refundEligible) {
                $alloc->update([
                    'status' => 'AVAILABLE',
                    'unlocked_at' => now(),
                ]);

                // Update corresponding InstructorTransaction
                InstructorTransaction::where('reference_type', 'App\Models\OrderItem')
                    ->where('reference_id', $alloc->order_item_id)
                    ->update(['status' => 'available']);

                return true;
            }

            return false;
        });
    }
}
