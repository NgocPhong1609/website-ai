<?php

namespace App\Policies;

use App\Models\Lesson;
use App\Models\User;

class LessonPolicy
{
    /**
     * Determine whether the user can manage the model.
     * Teachers can manage their own lessons.
     */
    public function manage(User $user, Lesson $lesson): bool
    {
        return $user->id === $lesson->module->course->teacher_id;
    }

    /**
     * Determine whether the teacher can delete this lesson.
     * Published lessons cannot be directly deleted.
     */
    public function delete(User $user, Lesson $lesson): bool
    {
        if ($user->id !== $lesson->module->course->teacher_id) {
            return false;
        }

        // Published lessons require a deletion request, not direct delete
        if ($lesson->isPublished()) {
            return false;
        }

        return true;
    }
}
