<?php

namespace App\Policies;

use App\Models\Course;
use App\Models\User;

class CoursePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasRole('teacher');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Course $course): bool
    {
        return $user->id === $course->teacher_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasRole('teacher');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Course $course): bool
    {
        return $user->id === $course->teacher_id;
    }

    /**
     * Determine whether the user can delete the model.
     * Published courses cannot be deleted by teacher.
     */
    public function delete(User $user, Course $course): bool
    {
        if ($course->isPublished()) {
            return false; // Published courses require admin action
        }
        return $user->id === $course->teacher_id;
    }

    /**
     * Determine whether the teacher can submit this course for review.
     */
    public function submitForReview(User $user, Course $course): bool
    {
        if ($user->id !== $course->teacher_id) {
            return false;
        }

        // Can only submit from draft, needs_fixes, or rejected states
        return in_array($course->status, ['draft', 'needs_fixes', 'rejected']);
    }
}
