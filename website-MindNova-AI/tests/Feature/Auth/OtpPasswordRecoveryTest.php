<?php

namespace Tests\Feature\Auth;

use App\Models\PasswordOtp;
use App\Models\User;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class OtpPasswordRecoveryTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        config(['database.default' => 'sqlite', 'database.connections.sqlite.database' => ':memory:']);
        DB::purge('sqlite');
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->timestamps();
        });
        (require database_path('migrations/2026_08_17_165322_create_password_otps_table.php'))->up();
        User::forceCreate(['name' => 'OTP test', 'email' => 'otp@example.test', 'password' => Hash::make('OldPassword1!')]);
    }

    protected function tearDown(): void
    {
        DB::disconnect('sqlite');
        parent::tearDown();
    }

    public function test_email_otp_can_be_verified_then_used_to_reset_once(): void
    {
        $otp = null;
        Mail::shouldReceive('raw')->once()->andReturnUsing(function ($body) use (&$otp) {
            preg_match('/\b(\d{6})\b/', $body, $match);
            $otp = $match[1];
        });
        $this->postJson('/api/forgot-password', ['email' => 'otp@example.test'])->assertOk();
        $this->assertTrue(Hash::check($otp, PasswordOtp::first()->otp_hash));
        $payload = ['email' => 'otp@example.test', 'otp' => $otp, 'password' => 'NewPassword1!', 'password_confirmation' => 'NewPassword1!'];
        $this->postJson('/api/reset-password', $payload)->assertStatus(400);
        $this->postJson('/api/forgot-password/verify-otp', ['email' => 'otp@example.test', 'otp' => $otp])->assertOk();
        $this->postJson('/api/reset-password', $payload)->assertOk();
        $this->assertTrue(Hash::check('NewPassword1!', User::first()->password));
        $this->assertSame(0, PasswordOtp::count());
        $this->postJson('/api/reset-password', $payload)->assertStatus(400);
    }

    public function test_wrong_and_expired_otp_cannot_be_verified(): void
    {
        PasswordOtp::create(['email' => 'otp@example.test', 'otp_hash' => Hash::make('123456'), 'expires_at' => now()->addMinutes(5), 'attempts' => 0]);
        $this->postJson('/api/forgot-password/verify-otp', ['email' => 'otp@example.test', 'otp' => '654321'])->assertStatus(400);
        $this->assertSame(1, PasswordOtp::first()->attempts);
        PasswordOtp::first()->update(['expires_at' => now()->subSecond()]);
        $this->postJson('/api/forgot-password/verify-otp', ['email' => 'otp@example.test', 'otp' => '123456'])->assertStatus(400);
        $this->assertNull(PasswordOtp::first()->verified_at);
    }

    public function test_mail_failure_does_not_claim_success_or_keep_a_code(): void
    {
        Mail::shouldReceive('raw')->once()->andThrow(new \RuntimeException('Test mail transport unavailable'));
        $this->postJson('/api/forgot-password', ['email' => 'otp@example.test'])->assertStatus(500)->assertJsonPath('message', 'Không thể gửi mã OTP. Vui lòng thử lại sau.');
        $this->assertSame(0, PasswordOtp::count());
    }

    public function test_saved_code_support_endpoint_is_no_longer_available(): void
    {
        $this->postJson('/api/password-recovery/support', ['email' => 'otp@example.test'])->assertNotFound();
        $this->postJson('/api/reset-password', ['email' => 'otp@example.test', 'recovery_code' => str_repeat('a', 32), 'password' => 'NewPassword1!', 'password_confirmation' => 'NewPassword1!'])->assertUnprocessable()->assertJsonValidationErrors('otp');
    }
}
