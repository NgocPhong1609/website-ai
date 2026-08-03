<?php

namespace App\Policies;

use App\Models\Lesson;
use App\Models\User;

class LessonPolicy
{
    /**
     * Determine whether the user can manage the model.
     */
    public function manage(User $user, Lesson $lesson): bool
    {
        return $user->id === $lesson->module->course->teacher_id;
    }
}
