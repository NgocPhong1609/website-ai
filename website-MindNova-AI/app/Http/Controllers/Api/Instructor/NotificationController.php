<?php

namespace App\Http\Controllers\Api\Instructor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Instructor\StoreNotificationRequest;
use App\Models\Course;
use App\Models\Notification;
use App\Traits\ApiResponse;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    use ApiResponse;

    public function store(StoreNotificationRequest $request)
    {
        $course = Course::findOrFail($request->course_id);
        
        if ($course->teacher_id !== $request->user()->id) {
            return $this->forbiddenResponse('You do not own this course.');
        }

        $studentIds = $request->input('student_ids');
        
        if (empty($studentIds)) {
            // Get all enrolled students if no specific students are selected
            $studentIds = $course->enrollments()->pluck('user_id')->toArray();
        } else {
            // Verify all selected students are actually enrolled in the course
            $enrolledStudentIds = $course->enrollments()->whereIn('user_id', $studentIds)->pluck('user_id')->toArray();
            if (count($studentIds) !== count($enrolledStudentIds)) {
                return $this->errorResponse('One or more selected students are not enrolled in this course.', 422);
            }
        }

        if (empty($studentIds)) {
            return $this->errorResponse('No students found to notify.', 422);
        }

        $notifications = [];
        foreach ($studentIds as $studentId) {
            $notifications[] = [
                'id' => Str::uuid()->toString(),
                'type' => 'instructor_announcement',
                'notifiable_type' => \App\Models\User::class,
                'notifiable_id' => $studentId,
                'data' => json_encode([
                    'title' => $request->title,
                    'message' => $request->message,
                    'course_id' => $course->id,
                    'instructor_name' => $request->user()->name,
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        Notification::insert($notifications);

        return $this->createdResponse(null, 'Notification sent to ' . count($studentIds) . ' students.');
    }
}
