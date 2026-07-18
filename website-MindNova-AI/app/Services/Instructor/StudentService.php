<?php

namespace App\Services\Instructor;

use App\Models\Course;
use App\Models\User;

class StudentService
{
    public function getStudentsForInstructor(int $teacherId, ?int $courseId = null)
    {
        $query = User::whereHas('enrollments.course', function ($q) use ($teacherId, $courseId) {
            $q->where('teacher_id', $teacherId);
            if ($courseId) {
                $q->where('id', $courseId);
            }
        })->with(['enrollments' => function ($q) use ($teacherId, $courseId) {
            $q->whereHas('course', function ($q2) use ($teacherId, $courseId) {
                $q2->where('teacher_id', $teacherId);
                if ($courseId) {
                    $q2->where('id', $courseId);
                }
            });
        }]);

        return $query;
    }
}
