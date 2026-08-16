<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Enrollment;
use App\Models\LessonCompletion;

#[Signature('test:enroll {email} {courseId}')]
#[Description('Enroll a student in a course for testing purposes')]
class EnrollStudentForTesting extends Command
{
    public function handle()
    {
        $email = $this->argument('email');
        $courseId = $this->argument('courseId');

        $user = User::where('email', $email)->first();
        if (!$user) {
            $this->error("User not found: {$email}");
            return 1;
        }
        $this->info("User found: [{$user->id}] {$user->email}");

        $enrollment = Enrollment::updateOrCreate(
            ['user_id' => $user->id, 'course_id' => $courseId],
            ['progress_percentage' => 0, 'enrolled_at' => now(), 'status' => 'enrolled']
        );
        $this->info("Enrolled user {$user->id} in course {$courseId}. Enrollment ID: {$enrollment->id}");

        $deleted = LessonCompletion::where('user_id', $user->id)
            ->whereHas('lesson', fn($q) => $q->where('course_id', $courseId))
            ->delete();
        $this->info("Cleared {$deleted} lesson completions for fresh test.");

        $this->info("Ready to test! Login as: {$email} / password123");
        return 0;
    }
}
