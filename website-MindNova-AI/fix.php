<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = App\Models\User::first();
$user->is_onboarded = 1;
$user->onboarding_data = json_encode([
    'goal' => 'Become a Backend Developer',
    'level' => 'Beginner',
    'topics' => ['PHP', 'Laravel', 'REST API'],
    'ai_plan' => [
        'learning_path' => [
            [
                'phase' => 1,
                'title' => 'Foundation & Basics',
                'lessons' => [
                    ['name' => 'Intro to PHP'],
                    ['name' => 'Laravel MVC']
                ]
            ]
        ]
    ]
]);
$user->save();
echo 'Done';
