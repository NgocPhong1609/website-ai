<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Instructor\CourseController;

use App\Http\Controllers\Api\Instructor\CourseModuleController;
use App\Http\Controllers\Api\Instructor\LessonController;

Route::middleware(['auth:sanctum', 'role:teacher'])->prefix('instructor')->group(function () {
    Route::apiResource('courses', CourseController::class);
    Route::post('courses/{course}/thumbnail', [CourseController::class, 'uploadThumbnail']);
    Route::patch('courses/{course}/status', [CourseController::class, 'updateStatus']);
    Route::patch('courses/{course}/price', [CourseController::class, 'updatePrice']);

    // Modules
    Route::post('courses/{course}/modules', [CourseModuleController::class, 'store']);
    Route::put('modules/{module}', [CourseModuleController::class, 'update']);
    Route::delete('modules/{module}', [CourseModuleController::class, 'destroy']);

    // Lessons
    Route::post('modules/{module}/lessons', [LessonController::class, 'store']);
    Route::put('lessons/{lesson}', [LessonController::class, 'update']);
    Route::delete('lessons/{lesson}', [LessonController::class, 'destroy']);
    Route::post('lessons/{lesson}/video', [LessonController::class, 'uploadVideo']);
});
