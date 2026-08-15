<?php 
$user = App\Models\User::where('role', 'teacher')->first();
if (!$user) { echo 'No teacher found'; exit; }
Auth::login($user);
request()->setUserResolver(function () use ($user) { return $user; });

echo '--- Testing StudentController@index ---';
try {
    $c = app(App\Http\Controllers\Api\Instructor\StudentController::class);
    $c->index(request());
    echo 'OK';
} catch (\Throwable $e) {
    echo 'ERROR: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine();
}

echo '--- Testing StudentController@getAnalytics ---';
try {
    $c->getAnalytics(request());
    echo 'OK';
} catch (\Throwable $e) {
    echo 'ERROR: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine();
}

echo '--- Testing StudentAnalyticsController@dashboardMetrics ---';
try {
    $ac = app(App\Http\Controllers\Api\Instructor\StudentAnalyticsController::class);
    $ac->dashboardMetrics();
    echo 'OK';
} catch (\Throwable $e) {
    echo 'ERROR: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine();
}

echo '--- Testing StudentAnalyticsController@engagementChart ---';
try {
    $ac->engagementChart();
    echo 'OK';
} catch (\Throwable $e) {
    echo 'ERROR: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine();
}

