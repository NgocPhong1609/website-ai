<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = \App\Models\User::find(1);
$service = new \App\Services\Student\StudyPlanService();
$overview = $service->getOverview($user);

echo json_encode($overview, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
