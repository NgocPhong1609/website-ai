<?php

namespace App\Policies;

use App\Models\CourseModule;
use App\Models\User;

class CourseModulePolicy
{
    /**
     * Determine whether the user can manage the model.
     */
    public function manage(User $user, CourseModule $module): bool
    {
        return $user->id === $module->course->teacher_id;
    }

    /**
     * Determine whether the teacher can delete this module.
     * Modules with published lessons cannot be deleted.
     */
    public function delete(User $user, CourseModule $module): bool
    {
        if ($user->id !== $module->course->teacher_id) {
            return false;
        }

        // If course is published and module has published lessons, deny
        $course = $module->course;
        if ($course && $course->isPublished()) {
            $hasPublishedLessons = $module->lessons()->where('status', 'published')->exists();
            if ($hasPublishedLessons) {
                return false;
            }
        }

        return true;
    }
}
