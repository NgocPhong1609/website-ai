<?php

namespace Tests\Unit;

use App\Http\Controllers\Api\Student\OrderController;
use Illuminate\Http\Request;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class EnvironmentUrlsTest extends TestCase
{
    public static function frontendOrigins(): array
    {
        return [['http://localhost:3100'], ['https://frontend.example/']];
    }

    #[DataProvider('frontendOrigins')]
    public function test_payment_returns_to_configured_frontend(string $origin): void
    {
        config(['app.frontend_url' => $origin]);
        $method = new \ReflectionMethod(OrderController::class, 'handlePaymentMethod');
        $order = (object) ['transaction_id' => 'test-order', 'payment_method' => 'vnpay'];
        $url = $method->invoke(app(OrderController::class), $order, Request::create('/'), 10000, collect([(object) ['id' => 123]]));
        parse_str(parse_url($url, PHP_URL_QUERY), $query);
        $this->assertSame(rtrim($origin, '/').'/payment/callback?course_id=123', $query['vnp_ReturnUrl']);
    }

    public function test_cors_uses_configured_origins_including_custom_local_port(): void
    {
        \Illuminate\Support\Env::getRepository()->set('CORS_ALLOWED_ORIGINS', 'https://frontend.example/, http://localhost:3100, http://192.168.1.20:3000');
        try {
            $cors = require base_path('config/cors.php');
            $this->assertSame(['https://frontend.example', 'http://localhost:3100', 'http://192.168.1.20:3000'], $cors['allowed_origins']);
        } finally {
            \Illuminate\Support\Env::getRepository()->clear('CORS_ALLOWED_ORIGINS');
        }
    }

    #[DataProvider('frontendOrigins')]
    public function test_google_login_returns_to_configured_frontend(string $origin): void
    {
        config(['app.frontend_url' => $origin, 'database.default' => 'sqlite', 'database.connections.sqlite.database' => ':memory:']);
        \Illuminate\Support\Facades\DB::purge('sqlite');
        \Illuminate\Support\Facades\Schema::create('users', function ($table) {
            $table->id();
            $table->string('email');
            $table->string('google_id');
        });
        \Illuminate\Support\Facades\Schema::create('personal_access_tokens', function ($table) {
            $table->id();
            $table->morphs('tokenable');
            $table->string('name');
            $table->string('token');
            $table->text('abilities')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
        });
        \Illuminate\Support\Facades\DB::table('users')->insert(['id' => 1, 'email' => 'test@example.com', 'google_id' => 'google-test']);
        $googleUser = new \Laravel\Socialite\Two\User();
        $googleUser->map(['email' => 'test@example.com']);
        \Laravel\Socialite\Facades\Socialite::shouldReceive('driver->stateless->user')->andReturn($googleUser);
        $response = app(\App\Http\Controllers\Api\Auth\AuthController::class)->handleGoogleCallback();
        $this->assertSame(302, $response->getStatusCode());
        $target = $response->getTargetUrl();
        $this->assertStringStartsWith(rtrim($origin, '/').'/login-success?token=', $target);
        parse_str(parse_url($target, PHP_URL_QUERY), $query);
        $this->assertNotNull(\Laravel\Sanctum\PersonalAccessToken::findToken($query['token']));
        \Illuminate\Support\Facades\DB::disconnect('sqlite');
    }
}
