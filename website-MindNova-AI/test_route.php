<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$request = Illuminate\Http\Request::create('api/admin/teacher-approvals', 'GET');
try {
    $route = app('router')->getRoutes()->match($request);
    echo "Route matched: " . $route->uri();
} catch (\Exception $e) {
    echo "Exception: " . get_class($e) . " - " . $e->getMessage();
}
