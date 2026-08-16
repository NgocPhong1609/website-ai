<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

#[Signature('test:course-lessons {courseId}')]
#[Description('Query lessons for a course')]
class QueryCourse68Lessons extends Command
{
    public function handle()
    {
        $courseId = $this->argument('courseId');
        $lessons = DB::table('lessons as l')
            ->join('course_modules as cm', 'l.module_id', '=', 'cm.id')
            ->where('cm.course_id', $courseId)
            ->select('l.id', 'l.title', 'l.status', 'l.published_version_id', 'l.type')
            ->get();

        $this->table(['ID', 'Title', 'Status', 'Published?', 'Type'], $lessons->map(fn($l) => [
            $l->id, substr($l->title, 0, 40), $l->status, $l->published_version_id ? 'YES' : 'NO', $l->type
        ]));

        $this->info('Total: ' . $lessons->count() . ' lessons');
        $published = $lessons->filter(fn($l) => $l->status === 'published' && $l->published_version_id !== null);
        $this->info('Published (visible to student): ' . $published->count());
        return 0;
    }
}
