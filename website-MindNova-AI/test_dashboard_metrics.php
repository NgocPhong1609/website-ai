<?php 
$user = App\Models\User::where('role', 'teacher')->first();
if (!$user) { echo 'No teacher found'; exit; }
Auth::login($user);
request()->setUserResolver(function () use ($user) { return $user; });

echo '--- Testing StudentAnalyticsController@dashboardMetrics ---';
try {
    $ac = app(App\Http\Controllers\Api\Instructor\StudentAnalyticsController::class);
    $ac->dashboardMetrics();
    echo 'OK';
} catch (\Throwable $e) {
    echo 'ERROR: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine();
}

