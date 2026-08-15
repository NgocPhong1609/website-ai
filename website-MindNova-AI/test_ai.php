<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$req = \Illuminate\Http\Request::create('/api/instructor/courses/ai-outline/generate', 'POST', ['topic' => 'Test Topic']);
$controller = app(\App\Http\Controllers\Api\Instructor\CourseOutlineController::class);
try {
    $resp = $controller->generate($req);
    print_r($resp->getContent());
} catch (\Exception $e) {
    echo "Exception: " . $e->getMessage() . "\n";
}
