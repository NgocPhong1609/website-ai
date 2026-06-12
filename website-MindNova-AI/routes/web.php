<?php

use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\RealtimeController;
use App\Http\Controllers\Api\SubscriptionController;
use App\Http\Controllers\Api\Admin\CourseController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Middleware\AdminMiddleware;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::prefix('api')->group(function () {
    Route::post('/payments', [PaymentController::class, 'store']);
    Route::post('/payments/checkout', [PaymentController::class, 'checkout']);
    Route::any('/payments/callback/{provider}', [PaymentController::class, 'callback']);
    Route::get('/payments', [PaymentController::class, 'index']);
    Route::get('/payments/{payment}', [PaymentController::class, 'show']);

    Route::get('/subscriptions', [SubscriptionController::class, 'index']);
    Route::post('/subscriptions', [SubscriptionController::class, 'store']);
    Route::get('/subscriptions/{subscription}', [SubscriptionController::class, 'show']);
    Route::post('/subscriptions/{subscription}/upgrade', [SubscriptionController::class, 'upgrade']);
    Route::post('/subscriptions/{subscription}/cancel', [SubscriptionController::class, 'cancel']);

    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications', [NotificationController::class, 'store']);
    Route::post('/notifications/{notification}/read', [NotificationController::class, 'markRead']);
    Route::delete('/notifications/{notification}', [NotificationController::class, 'destroy']);

    Route::post('/realtime/messages', [RealtimeController::class, 'send']);

    Route::middleware([AdminMiddleware::class])->prefix('admin')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::get('/users/{user}', [UserController::class, 'show']);
        Route::put('/users/{user}', [UserController::class, 'update']);
        Route::delete('/users/{user}', [UserController::class, 'destroy']);

        Route::get('/courses', [CourseController::class, 'index']);
        Route::post('/courses', [CourseController::class, 'store']);
        Route::get('/courses/{course}', [CourseController::class, 'show']);
        Route::put('/courses/{course}', [CourseController::class, 'update']);
        Route::delete('/courses/{course}', [CourseController::class, 'destroy']);
    });
});
