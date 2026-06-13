<?php

use App\Http\Controllers\Api\RoadmapController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Module: AI & Recommendation System
| Prefix: /api (auto-applied by RouteServiceProvider)
|
*/

// AI Roadmap Generation
Route::prefix('ai')->group(function () {
    Route::post('/generate-roadmap', [RoadmapController::class, 'generate'])
        ->name('api.ai.generate-roadmap');
});
