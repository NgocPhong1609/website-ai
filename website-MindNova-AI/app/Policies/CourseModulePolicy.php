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
}
