<?php

namespace App\Policies;

use App\Models\Quiz;
use App\Models\User;

class QuizPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole('teacher');
    }

    public function view(User $user, Quiz $quiz): bool
    {
        return (int) $user->id === (int) $quiz->instructor_id || $user->isAdmin();
    }

    public function create(User $user): bool
    {
        return $user->hasRole('teacher') || $user->isAdmin();
    }

    public function update(User $user, Quiz $quiz): bool
    {
        return (int) $user->id === (int) $quiz->instructor_id || $user->isAdmin();
    }

    public function delete(User $user, Quiz $quiz): bool
    {
        return (int) $user->id === (int) $quiz->instructor_id || $user->isAdmin();
    }

    public function attach(User $user, Quiz $quiz): bool
    {
        return (int) $user->id === (int) $quiz->instructor_id || $user->isAdmin();
    }
}
