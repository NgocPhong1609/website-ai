<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(
            \App\Contracts\AiProviderInterface::class,
            \App\Services\Ai\GeminiAiService::class
        );
        
        $this->app->bind(\App\Services\Ai\AiRouterService::class, function ($app) {
            return new \App\Services\Ai\AiRouterService(
                $app->make(\App\Services\Ai\GeminiAiService::class),
                $app->make(\App\Services\Ai\BackupAiService::class)
            );
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
