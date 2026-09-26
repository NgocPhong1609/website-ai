<?php

namespace App\Providers;

use App\Contracts\AiProviderInterface;
use App\Services\Ai\AiRouterService;
use App\Services\Ai\BackupAiService;
use App\Services\Ai\GeminiAiService;
use Illuminate\Auth\Events\Login;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(
            AiProviderInterface::class,
            GeminiAiService::class
        );

        $this->app->bind(AiRouterService::class, function ($app) {
            return new AiRouterService(
                $app->make(GeminiAiService::class),
                $app->make(BackupAiService::class)
            );
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Event::listen(Login::class, function (Login $event): void {
            if ($event->guard === 'web') {
                session()->put('password_recovery_version', $event->user->password_recovery_version);
            }
        });

        RateLimiter::for('recovery-reset', fn (Request $request) => [
            Limit::perMinute(10)->by('recovery-reset-ip:'.$request->ip()),
            Limit::perMinute(5)->by('recovery-reset-email:'.hash('sha256', strtolower(trim((string) $request->input('email'))))),
        ]);
        RateLimiter::for('recovery-support', fn (Request $request) => Limit::perMinute(5)->by('recovery-support-ip:'.$request->ip()));
        RateLimiter::for('recovery-generate', fn (Request $request) => Limit::perMinute(5)->by('recovery-generate:'.$request->user()?->id));
        RateLimiter::for('recovery-admin', fn (Request $request) => Limit::perMinute(10)->by('recovery-admin:'.$request->user()?->id));
    }
}
