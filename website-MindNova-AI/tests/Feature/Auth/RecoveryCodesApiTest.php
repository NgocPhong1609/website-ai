<?php

namespace Tests\Feature\Auth;

use App\Http\Middleware\EnsureRecoverySessionCurrent;
use App\Models\Role;
use App\Models\User;
use App\Services\PasswordRecoveryService;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Schema;
use Laravel\Sanctum\PersonalAccessToken;
use Tests\TestCase;

class RecoveryCodesApiTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        config(['database.default' => 'sqlite', 'database.connections.sqlite.database' => ':memory:', 'session.driver' => 'database']);
        DB::purge('sqlite');
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('status')->default('active');
            $table->boolean('is_locked')->default(false);
            $table->timestamp('last_login_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('display_name')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });
        Schema::create('role_user', function (Blueprint $table) {
            $table->unsignedBigInteger('role_id');
            $table->unsignedBigInteger('user_id');
            $table->timestamps();
        });
        Schema::create('personal_access_tokens', function (Blueprint $table) {
            $table->id();
            $table->morphs('tokenable');
            $table->string('name');
            $table->string('token', 64)->unique();
            $table->text('abilities')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
        });
        foreach (['2026_06_02_175022_create_activity_logs_table.php', '2026_06_02_175023_create_admin_logs_table.php', '2026_07_23_000002_create_user_profiles_table.php', '2026_08_02_200004_create_support_tickets_table.php', '2026_08_23_163755_create_user_streaks_table.php'] as $file) {
            (require database_path('migrations/'.$file))->up();
        }
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->unsignedBigInteger('user_id')->nullable()->index();
            $table->string('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity');
        });
        foreach (glob(database_path('migrations/*_create_password_recovery_codes_table.php')) as $file) {
            (require $file)->up();
        }
        (require database_path('migrations/2026_09_26_000001_add_password_recovery_version_to_users_table.php'))->up();
    }

    protected function tearDown(): void
    {
        DB::disconnect('sqlite');
        parent::tearDown();
    }

    private function user(string $role = 'student', string $email = 'learner@example.test'): User
    {
        $user = User::forceCreate(['name' => 'Learner', 'email' => $email, 'password' => Hash::make('OldPassword1!'), 'remember_token' => 'old-remember']);
        $user->roles()->attach(Role::idFor($role));

        return $user;
    }

    private function auth(User $user): array
    {
        app('auth')->forgetGuards();

        return ['Authorization' => 'Bearer '.$user->createToken('test')->plainTextToken];
    }

    public function test_profile_generation_requires_auth_and_current_password_and_stores_only_digests(): void
    {
        $user = $this->user();
        $this->postJson('/api/profile/recovery-codes', ['current_password' => 'OldPassword1!'])->assertUnauthorized();
        $headers = $this->auth($user);
        $this->postJson('/api/profile/recovery-codes', ['current_password' => 'wrong'], $headers)->assertUnprocessable();
        $generated = $this->postJson('/api/profile/recovery-codes', ['current_password' => 'OldPassword1!'], $headers)->assertOk();
        $this->assertStringContainsString('no-store', $generated->headers->get('Cache-Control'));
        $codes = $generated->json('codes');
        $this->assertCount(8, $codes);
        $this->assertMatchesRegularExpression('/^[a-f0-9]{8}(?:-[a-f0-9]{8}){3}$/', $codes[0]);
        $this->assertSame(8, $this->getJson('/api/profile/recovery-codes', $headers)->assertOk()->json('remaining'));
        $this->assertSame(64, strlen(DB::table('password_recovery_codes')->first()->code_hash));
        $this->assertDatabaseMissing('password_recovery_codes', ['code_hash' => $codes[0]]);
        $newCodes = $this->postJson('/api/profile/recovery-codes', ['current_password' => 'OldPassword1!'], $headers)->assertOk()->json('codes');
        $this->assertCount(8, $newCodes);
        $this->assertSame(8, DB::table('password_recovery_codes')->count());
        $this->postJson('/api/reset-password', ['email' => $user->email, 'recovery_code' => $codes[0], 'password' => 'NewPassword1!', 'password_confirmation' => 'NewPassword1!'])->assertStatus(400);
        $user->update(['is_locked' => true]);
        $this->postJson('/api/profile/recovery-codes', ['current_password' => 'OldPassword1!'], $headers)->assertForbidden();
    }

    public function test_reset_is_single_use_and_revokes_all_credentials_sessions_and_tokens_without_unlocking(): void
    {
        $user = $this->user();
        $headers = $this->auth($user);
        $other = $user->createToken('other');
        DB::table('sessions')->insert(['id' => 'saved-session', 'user_id' => $user->id, 'payload' => 'x', 'last_activity' => time()]);
        $code = $this->postJson('/api/profile/recovery-codes', ['current_password' => 'OldPassword1!'], $headers)->json('codes.0');
        $user->update(['is_locked' => true]);
        $payload = ['email' => $user->email, 'recovery_code' => strtoupper(str_replace('-', '', $code)), 'password' => 'NewPassword1!', 'password_confirmation' => 'NewPassword1!'];
        $this->postJson('/api/reset-password', $payload)->assertOk();
        $this->assertTrue(Hash::check('NewPassword1!', $user->fresh()->password));
        $this->assertTrue($user->fresh()->is_locked);
        $this->assertNotSame('old-remember', $user->fresh()->remember_token);
        $this->assertSame(0, DB::table('password_recovery_codes')->count());
        $this->assertSame(0, DB::table('personal_access_tokens')->count());
        $this->assertSame(0, DB::table('sessions')->where('user_id', $user->id)->count());
        $this->postJson('/api/reset-password', $payload)->assertStatus(400);
    }

    public function test_reset_error_does_not_reveal_whether_email_exists_and_expired_codes_fail(): void
    {
        $user = $this->user();
        $code = $this->postJson('/api/profile/recovery-codes', ['current_password' => 'OldPassword1!'], $this->auth($user))->json('codes.0');
        $base = ['recovery_code' => $code, 'password' => 'NewPassword1!', 'password_confirmation' => 'NewPassword1!'];
        $unknown = $this->postJson('/api/reset-password', $base + ['email' => 'missing@example.test'])->assertStatus(400)->json('message');
        $wrong = $this->postJson('/api/reset-password', array_merge($base, ['email' => $user->email, 'recovery_code' => str_repeat('a', 32)]))->assertStatus(400)->json('message');
        $this->assertSame($unknown, $wrong);
        DB::table('password_recovery_codes')->update(['expires_at' => now()->subMinute()]);
        $expired = $this->postJson('/api/reset-password', $base + ['email' => $user->email])->assertStatus(400)->json('message');
        $this->assertSame($unknown, $expired);
    }

    public function test_admin_issue_checks_role_password_note_and_target_and_audits_without_secret(): void
    {
        $admin = $this->user('admin', 'admin@example.test');
        $target = $this->user('student', 'target@example.test');
        $url = '/api/admin/users/'.$target->id.'/password-recovery';
        $payload = ['current_password' => 'OldPassword1!', 'verification_note' => 'Verified identity using established support process.'];
        $this->postJson($url, $payload, $this->auth($target))->assertForbidden();
        $headers = $this->auth($admin);
        $this->postJson($url, array_merge($payload, ['current_password' => 'wrong']), $headers)->assertUnprocessable();
        $this->postJson($url, array_merge($payload, ['verification_note' => 'too short']), $headers)->assertUnprocessable();
        $this->postJson('/api/admin/users/'.$admin->id.'/password-recovery', $payload, $headers)->assertStatus(403);
        $target->update(['is_locked' => true]);
        $this->postJson($url, $payload, $headers)->assertStatus(403);
        $target->update(['is_locked' => false]);
        $result = $this->postJson($url, $payload, $headers)->assertOk();
        $this->assertStringContainsString('no-store', $result->headers->get('Cache-Control'));
        $this->assertStringContainsString('/forgot-password#email=', $result->json('reset_url'));
        $this->assertNotNull($result->json('expires_at'));
        $this->assertSame(1, DB::table('password_recovery_codes')->where('kind', 'admin')->count());
        $audit = DB::table('admin_logs')->first();
        $this->assertSame($admin->id, $audit->admin_id);
        $this->assertSame($target->id, $audit->target_id);
        $this->assertStringContainsString('Verified identity', $audit->details);
        $this->assertStringNotContainsString('recovery_code=', json_encode($audit));
        $this->postJson($url, $payload, $headers)->assertOk();
        $this->assertSame(1, DB::table('password_recovery_codes')->where('kind', 'admin')->count());
    }

    public function test_support_request_is_generic_and_legacy_otp_routes_are_gone(): void
    {
        Mail::fake();
        $user = $this->user();
        $payload = ['email' => $user->email, 'contact' => 'Contact by phone 123', 'description' => 'I cannot access my saved recovery codes.'];
        $known = $this->postJson('/api/password-recovery/support', $payload)->assertOk()->json();
        $unknown = $this->postJson('/api/password-recovery/support', array_merge($payload, ['email' => 'missing@example.test']))->assertOk()->json();
        $this->assertSame($known, $unknown);
        $this->assertSame(2, DB::table('support_tickets')->count());
        $this->assertSame($user->id, DB::table('support_tickets')->first()->target_user_id);
        $this->assertNull(DB::table('support_tickets')->first()->reporter_id);
        $this->postJson('/api/forgot-password', ['email' => $user->email])->assertStatus(410);
        $this->postJson('/api/forgot-password/verify-otp', ['email' => $user->email, 'otp' => '123456'])->assertStatus(410);
        $this->postJson('/api/profile/change-password/request-otp', [], $this->auth($user))->assertStatus(410);
        Mail::assertNothingSent();
    }

    public function test_public_recovery_endpoints_limit_repeated_requests(): void
    {
        $support = ['email' => 'missing@example.test', 'contact' => 'Contact by phone 123', 'description' => 'I cannot access my saved recovery codes.'];
        for ($attempt = 0; $attempt < 5; $attempt++) {
            $this->postJson('/api/password-recovery/support', $support)->assertOk();
        }
        $this->postJson('/api/password-recovery/support', $support)->assertStatus(429);

        $reset = ['email' => 'missing@example.test', 'recovery_code' => str_repeat('a', 32), 'password' => 'NewPassword1!', 'password_confirmation' => 'NewPassword1!'];
        for ($attempt = 0; $attempt < 5; $attempt++) {
            $this->postJson('/api/reset-password', $reset)->assertStatus(400);
        }
        $this->postJson('/api/reset-password', $reset)->assertStatus(429);
    }

    public function test_reset_ip_limit_applies_when_emails_change(): void
    {
        $reset = ['recovery_code' => str_repeat('a', 32), 'password' => 'NewPassword1!', 'password_confirmation' => 'NewPassword1!'];
        for ($attempt = 0; $attempt < 10; $attempt++) {
            $this->postJson('/api/reset-password', $reset + ['email' => "different{$attempt}@example.test"])->assertStatus(400);
        }
        $this->postJson('/api/reset-password', $reset + ['email' => 'another@example.test'])->assertStatus(429);
    }

    public function test_admin_link_is_redeemable_once_and_expires_after_thirty_minutes(): void
    {
        $admin = $this->user('admin', 'admin@example.test');
        $target = $this->user('teacher', 'teacher@example.test');
        $headers = $this->auth($admin);
        $url = '/api/admin/users/'.$target->id.'/password-recovery';
        $input = ['current_password' => 'OldPassword1!', 'verification_note' => 'Identity verified through a separate established channel.'];
        $issued = $this->postJson($url, $input, $headers)->assertOk()->json();
        parse_str(parse_url($issued['reset_url'], PHP_URL_FRAGMENT), $fragment);
        $this->assertSame($target->email, $fragment['email']);
        $this->assertTrue(Carbon::parse($issued['expires_at'])->between(now()->addMinutes(29), now()->addMinutes(30)));
        $payload = ['email' => $target->email, 'recovery_code' => $fragment['recovery_code'], 'password' => 'NewPassword1!', 'password_confirmation' => 'NewPassword1!'];
        $this->travel(31)->minutes();
        $this->postJson('/api/reset-password', $payload)->assertStatus(400);
        $this->travelBack();
        $this->postJson('/api/reset-password', $payload)->assertOk();
        $this->postJson('/api/reset-password', $payload)->assertStatus(400);
    }

    public function test_registration_and_login_continue_to_issue_tokens_and_reject_locked_accounts(): void
    {
        $input = ['name' => 'Learner', 'email' => 'new@example.test', 'password' => 'OldPassword1!', 'password_confirmation' => 'OldPassword1!'];
        $this->postJson('/api/register', $input)->assertCreated()->assertJsonPath('user.role', 'student');
        $this->postJson('/api/login', ['email' => $input['email'], 'password' => $input['password']])->assertOk()->assertJsonStructure(['access_token']);
        User::where('email', $input['email'])->update(['is_locked' => true]);
        $this->postJson('/api/login', ['email' => $input['email'], 'password' => $input['password']])->assertForbidden();
    }

    public function test_saved_code_generation_rechecks_password_after_locking_fresh_user(): void
    {
        $staleUser = $this->user();
        User::whereKey($staleUser->id)->update(['password' => Hash::make('NewPassword1!')]);
        $this->assertNull(app(PasswordRecoveryService::class)->rotateSaved($staleUser, 'OldPassword1!'));
        $this->assertSame(0, DB::table('password_recovery_codes')->count());
    }

    public function test_reset_requires_password_strength_used_by_existing_change_password_flow(): void
    {
        $user = $this->user();
        $code = $this->postJson('/api/profile/recovery-codes', ['current_password' => 'OldPassword1!'], $this->auth($user))->json('codes.0');
        $input = ['email' => $user->email, 'recovery_code' => $code, 'password' => 'weakpass', 'password_confirmation' => 'weakpass'];
        $this->postJson('/api/reset-password', $input)->assertUnprocessable();
        $this->assertTrue(Hash::check('OldPassword1!', $user->fresh()->password));
    }

    public function test_existing_authenticated_change_password_requires_current_password(): void
    {
        $user = $this->user();
        $headers = $this->auth($user);
        $input = ['current_password' => 'WrongPassword1!', 'new_password' => 'NewPassword1!', 'new_password_confirmation' => 'NewPassword1!'];
        $this->postJson('/api/profile/change-password', $input, $headers)->assertStatus(400);
        $this->postJson('/api/profile/change-password', array_merge($input, ['current_password' => 'OldPassword1!']), $headers)->assertOk();
        $this->assertTrue(Hash::check('NewPassword1!', $user->fresh()->password));
    }

    public function test_reset_invalidates_existing_remember_cookie_token(): void
    {
        $user = $this->user();
        $oldToken = $user->remember_token;
        $provider = app('auth')->createUserProvider(config('auth.guards.web.provider'));
        $this->assertNotNull($provider->retrieveByToken($user->id, $oldToken));
        $code = $this->postJson('/api/profile/recovery-codes', ['current_password' => 'OldPassword1!'], $this->auth($user))->json('codes.0');
        $this->postJson('/api/reset-password', ['email' => $user->email, 'recovery_code' => $code, 'password' => 'NewPassword1!', 'password_confirmation' => 'NewPassword1!'])->assertOk();
        $this->assertNull($provider->retrieveByToken($user->id, $oldToken));
    }

    public function test_recovery_rejects_old_file_web_session_and_new_login_can_use_new_password(): void
    {
        $user = $this->user();
        $sessionPath = sys_get_temp_dir().'/mindnova-recovery-sessions-'.uniqid();
        mkdir($sessionPath);
        config(['session.driver' => 'file', 'session.files' => $sessionPath, 'app.key' => 'base64:'.base64_encode(random_bytes(32))]);
        app('session')->forgetDrivers();
        app()->forgetInstance('session.store');
        app('auth')->forgetGuards();
        $this->withoutVite();
        $this->assertContains(EnsureRecoverySessionCurrent::class, app('router')->getMiddlewareGroups()['web']);

        $login = $this->post('/login', ['email' => $user->email, 'password' => 'OldPassword1!'])->assertRedirect();
        $sessionCookie = collect($login->headers->getCookies())->first(fn ($cookie) => $cookie->getName() === config('session.cookie'));
        $this->assertNotNull($sessionCookie);
        $this->assertNotEmpty(glob($sessionPath.'/*'));
        app('auth')->forgetGuards();
        $this->withUnencryptedCookie($sessionCookie->getName(), $sessionCookie->getValue())->get('/profile')->assertOk();

        $code = $this->postJson('/api/profile/recovery-codes', ['current_password' => 'OldPassword1!'], $this->auth($user))->json('codes.0');
        $this->postJson('/api/reset-password', ['email' => $user->email, 'recovery_code' => $code, 'password' => 'NewPassword1!', 'password_confirmation' => 'NewPassword1!'])->assertOk();
        $this->assertNotNull($user->fresh()->password_recovery_version);
        $rememberAfterReset = $user->fresh()->remember_token;
        app('auth')->forgetGuards();
        app('auth')->shouldUse('web');
        $this->withUnencryptedCookie($sessionCookie->getName(), $sessionCookie->getValue())->get('/profile')->assertRedirect('/login');
        $this->assertSame($rememberAfterReset, $user->fresh()->remember_token);

        app('auth')->shouldUse('web');
        $newLogin = $this->post('/login', ['email' => $user->email, 'password' => 'NewPassword1!'])->assertRedirect();
        $this->assertSame($user->fresh()->password_recovery_version, session()->get('password_recovery_version'));
        $newCookie = collect($newLogin->headers->getCookies())->first(fn ($cookie) => $cookie->getName() === config('session.cookie'));
        $this->assertNotNull($newCookie);
        app('auth')->forgetGuards();
        $this->withUnencryptedCookie($newCookie->getName(), $newCookie->getValue())->get('/profile')->assertOk();
    }

    public function test_api_login_holds_transaction_through_password_check_and_token_creation(): void
    {
        $user = $this->user();
        $writeTransactionLevels = [];
        User::updating(function (User $updating) use (&$writeTransactionLevels): void {
            if ($updating->isDirty('last_login_at')) {
                $writeTransactionLevels[] = DB::transactionLevel();
            }
        });
        PersonalAccessToken::creating(function () use (&$writeTransactionLevels): void {
            $writeTransactionLevels[] = DB::transactionLevel();
        });
        $this->postJson('/api/login', ['email' => $user->email, 'password' => 'OldPassword1!'])->assertOk();
        $this->assertSame([1, 1], $writeTransactionLevels);
    }

    public function test_recovery_of_another_account_keeps_unrelated_file_web_session(): void
    {
        $signedIn = $this->user('student', 'signed-in@example.test');
        $recovering = $this->user('student', 'recovering@example.test');
        $code = app(PasswordRecoveryService::class)->rotateSaved($recovering, 'OldPassword1!')[0];
        $sessionPath = sys_get_temp_dir().'/mindnova-recovery-sessions-'.uniqid();
        mkdir($sessionPath);
        config(['session.driver' => 'file', 'session.files' => $sessionPath, 'app.key' => 'base64:'.base64_encode(random_bytes(32))]);
        app('session')->forgetDrivers();
        app()->forgetInstance('session.store');
        app('auth')->forgetGuards();
        $this->withoutVite();

        $this->post('/login', ['email' => $signedIn->email, 'password' => 'OldPassword1!'])->assertRedirect();
        $this->get('/profile')->assertOk();
        $this->postJson('/api/reset-password', ['email' => $recovering->email, 'recovery_code' => $code, 'password' => 'NewPassword1!', 'password_confirmation' => 'NewPassword1!'])->assertOk();
        app('auth')->forgetGuards();
        $this->get('/profile')->assertOk();
    }
}
