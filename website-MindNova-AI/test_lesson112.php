<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Lesson;
use App\Models\Quiz;

echo "=================== CHECKING LESSON #112 & QUIZ RESOLUTION ===================\n";
$lesson112 = Lesson::with('quiz')->find(112);
if ($lesson112) {
    echo "Lesson #112 EXISTS!\n";
    echo "  Lesson Title: {$lesson112->title}\n";
    echo "  Lesson Module ID: {$lesson112->module_id}\n";
    echo "  Lesson Quiz ID: " . ($lesson112->quiz ? $lesson112->quiz->id : 'NULL') . "\n";
    if ($lesson112->quiz) {
        echo "  Quiz Title: {$lesson112->quiz->title}\n";
    }
} else {
    echo "Lesson #112 does NOT exist.\n";
}

echo "\n--- CHECKING QUIZ #131 ---\n";
$quiz131 = Quiz::with('questions.answers')->find(131);
if ($quiz131) {
    echo "Quiz #131 EXISTS!\n";
    echo "  Quiz Title: {$quiz131->title}\n";
    echo "  Questions Count: " . $quiz131->questions->count() . "\n";
} else {
    echo "Quiz #131 does NOT exist.\n";
}
