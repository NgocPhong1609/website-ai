<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Backfill quizzes.instructor_id for rows where it is NULL.
     *
     * We infer the instructor from:
     *   1. lesson → course.teacher_id
     *   2. lesson → module → course.teacher_id
     *   3. quiz_course_attachments → course.teacher_id
     *
     * If multiple distinct teacher_ids are found, the quiz is skipped.
     */
    public function up(): void
    {
        $nullQuizzes = DB::table('quizzes')
            ->whereNull('instructor_id')
            ->pluck('id');

        foreach ($nullQuizzes as $quizId) {
            $teacherIds = collect();

            // Via lesson → course
            $viaDirect = DB::table('quizzes')
                ->join('lessons', 'lessons.id', '=', 'quizzes.lesson_id')
                ->join('courses', 'courses.id', '=', 'lessons.course_id')
                ->where('quizzes.id', $quizId)
                ->whereNotNull('lessons.course_id')
                ->pluck('courses.teacher_id');
            $teacherIds = $teacherIds->merge($viaDirect);

            // Via lesson → module → course
            $viaModule = DB::table('quizzes')
                ->join('lessons', 'lessons.id', '=', 'quizzes.lesson_id')
                ->join('course_modules', 'course_modules.id', '=', 'lessons.module_id')
                ->join('courses', 'courses.id', '=', 'course_modules.course_id')
                ->where('quizzes.id', $quizId)
                ->pluck('courses.teacher_id');
            $teacherIds = $teacherIds->merge($viaModule);

            // Via quiz_course_attachments → course
            $viaAttachment = DB::table('quiz_course_attachments')
                ->join('courses', 'courses.id', '=', 'quiz_course_attachments.course_id')
                ->where('quiz_course_attachments.quiz_id', $quizId)
                ->pluck('courses.teacher_id');
            $teacherIds = $teacherIds->merge($viaAttachment);

            $unique = $teacherIds->unique()->filter();

            if ($unique->count() === 1) {
                DB::table('quizzes')
                    ->where('id', $quizId)
                    ->update(['instructor_id' => $unique->first()]);
            }
        }
    }

    public function down(): void
    {
        // Cannot reverse — we don't know which were originally null.
    }
};
