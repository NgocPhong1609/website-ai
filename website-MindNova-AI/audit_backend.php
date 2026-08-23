<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

echo "=== QUIZ COURSE ATTACHMENTS SCHEMA ===\n";
print_r(Schema::getColumnListing('quiz_course_attachments'));

echo "\n=== QUIZ COURSE ATTACHMENTS SAMPLE ===\n";
print_r(DB::table('quiz_course_attachments')->get());

echo "\n=== QUIZZES SAMPLE ===\n";
$quizzes = DB::table('quizzes')->limit(10)->get();
print_r($quizzes);

echo "\n=== FAILED JOBS ===\n";
$failedJobs = DB::table('failed_jobs')->orderBy('id', 'desc')->limit(5)->get(['id', 'connection', 'queue', 'exception', 'failed_at']);
print_r($failedJobs);
