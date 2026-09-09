<?php

namespace Tests\Feature\Student;

use App\Exceptions\AiQuotaExceededException;
use App\Models\AdminSetting;
use App\Models\AiDailyQuotaUsage;
use App\Models\Subscription;
use App\Models\User;
use App\Services\Ai\AiDailyQuotaService;
use Carbon\CarbonImmutable;
use Illuminate\Database\Events\QueryExecuted;
use Illuminate\Database\QueryException;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Concurrency;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class AiDailyQuotaServiceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        config(['app.timezone' => 'Asia/Ho_Chi_Minh']);
        CarbonImmutable::setTestNow(CarbonImmutable::parse('2026-09-09 23:59:59', 'Asia/Ho_Chi_Minh'));
    }

    protected function tearDown(): void
    {
        CarbonImmutable::setTestNow();
        parent::tearDown();
    }

    public function test_free_default_is_five_but_stored_admin_value_wins(): void
    {
        $user = User::factory()->create();
        $service = app(AiDailyQuotaService::class);

        $this->assertSame(5, $service->reserve($user)['daily_limit']);

        AdminSetting::updateOrCreate(['key' => 'ai.packages.v1'], ['value' => [
            'free' => ['daily_requests' => 9],
            'premium' => ['daily_requests' => 200],
        ]]);
        $other = User::factory()->create();
        $this->assertSame(9, $service->reserve($other)['daily_limit']);
    }

    public function test_last_request_is_allowed_exhaustion_does_not_increment_and_midnight_resets(): void
    {
        $user = User::factory()->create();
        $service = app(AiDailyQuotaService::class);

        for ($used = 1; $used <= 5; $used++) {
            $quota = $service->reserve($user);
            $this->assertTrue($quota['allowed']);
            $this->assertSame($used, $quota['used']);
        }

        $this->assertSame([
            'allowed' => false, 'package' => 'free', 'daily_limit' => 5,
            'used' => 5, 'remaining' => 0, 'resets_at' => '2026-09-10T00:00:00+07:00',
        ], $quota = $service->reserve($user));
        $this->assertDatabaseHas('ai_daily_quota_usages', [
            'user_id' => $user->id, 'feature' => 'ai_tutor', 'usage_date' => '2026-09-09', 'used' => 5,
        ]);

        $exception = new AiQuotaExceededException($quota);
        $this->assertSame($quota, $exception->quota());
        $this->assertSame('Bạn đã sử dụng hết lượt AI hôm nay.', $exception->getMessage());

        CarbonImmutable::setTestNow(CarbonImmutable::parse('2026-09-10 00:00:00', 'Asia/Ho_Chi_Minh'));
        $this->assertSame([
            'allowed' => true, 'package' => 'free', 'daily_limit' => 5,
            'used' => 1, 'remaining' => 4, 'resets_at' => '2026-09-11T00:00:00+07:00',
        ], $service->reserve($user));
        $this->assertDatabaseCount('ai_daily_quota_usages', 2);
    }

    public function test_package_changes_keep_the_same_daily_counter(): void
    {
        $user = User::factory()->create();
        $service = app(AiDailyQuotaService::class);
        $service->reserve($user);
        $subscription = Subscription::create([
            'user_id' => $user->id, 'plan' => 'premium', 'status' => 'active',
            'started_at' => now(), 'expires_at' => now()->addDay(),
        ]);
        $this->assertSame([
            'allowed' => true, 'package' => 'premium', 'daily_limit' => 200,
            'used' => 2, 'remaining' => 198, 'resets_at' => '2026-09-10T00:00:00+07:00',
        ], $service->reserve($user));

        AdminSetting::create(['key' => 'ai.packages.v1', 'value' => [
            'free' => ['daily_requests' => 1], 'premium' => ['daily_requests' => 9],
        ]]);
        $this->assertSame(9, $service->reserve($user)['daily_limit']);
        $subscription->update(['expires_at' => now()->subSecond()]);
        $this->assertSame([
            'allowed' => false, 'package' => 'free', 'daily_limit' => 1,
            'used' => 3, 'remaining' => 0, 'resets_at' => '2026-09-10T00:00:00+07:00',
        ], $service->reserve($user));
        $this->assertDatabaseCount('ai_daily_quota_usages', 1);
    }

    public function test_legacy_limits_are_honored_and_users_and_features_are_independent(): void
    {
        AdminSetting::create(['key' => 'ai.quotas', 'value' => ['student_daily_questions' => '7']]);
        $user = User::factory()->create();
        $other = User::factory()->create();
        $service = app(AiDailyQuotaService::class);
        $this->assertSame(7, $service->reserve($user)['daily_limit']);
        $this->assertSame(2, $service->reserve($user)['used']);
        $this->assertSame(1, $service->reserve($user, 'ai_quiz')['used']);
        $this->assertSame(1, $service->reserve($other)['used']);
        $this->assertDatabaseCount('ai_daily_quota_usages', 3);
    }

    #[DataProvider('invalidLimits')]
    public function test_invalid_stored_limits_fail_before_a_counter_is_written(string $package, mixed $limit): void
    {
        $user = User::factory()->create();
        if ($package === 'premium') {
            Subscription::create(['user_id' => $user->id, 'plan' => 'premium', 'status' => 'active']);
        }
        AdminSetting::create(['key' => 'ai.packages.v1', 'value' => [$package => ['daily_requests' => $limit]]]);

        try {
            app(AiDailyQuotaService::class)->reserve($user);
            $this->fail('Invalid limits must not reserve a request.');
        } catch (ValidationException $exception) {
            $this->assertArrayHasKey('daily_requests', $exception->errors());
            $this->assertDatabaseCount('ai_daily_quota_usages', 0);
        }
    }

    public static function invalidLimits(): array
    {
        return [
            'zero' => ['free', 0], 'negative' => ['free', -1],
            'free above maximum' => ['free', 2001], 'premium above maximum' => ['premium', 10001],
            'fraction' => ['free', 1.5], 'text' => ['free', 'unlimited'],
            'null' => ['free', null], 'array' => ['free', []],
        ];
    }

    #[DataProvider('maximumLimits')]
    public function test_admin_maximum_limits_are_accepted(string $package, int $limit): void
    {
        $user = User::factory()->create();
        if ($package === 'premium') {
            Subscription::create(['user_id' => $user->id, 'plan' => 'premium', 'status' => 'active']);
        }
        AdminSetting::create(['key' => 'ai.packages.v1', 'value' => [$package => ['daily_requests' => $limit]]]);
        $quota = app(AiDailyQuotaService::class)->reserve($user);
        $this->assertTrue($quota['allowed']);
        $this->assertSame($limit, $quota['daily_limit']);
    }

    public static function maximumLimits(): array
    {
        return [['free', 2000], ['premium', 10000]];
    }

    public function test_unrelated_database_failures_propagate_and_roll_back(): void
    {
        $user = User::factory()->create();
        $service = app(AiDailyQuotaService::class);
        $user->delete();

        try {
            $service->reserve($user);
            $this->fail('A deleted user must cause a foreign-key failure.');
        } catch (QueryException $exception) {
            $this->assertNotInstanceOf(UniqueConstraintViolationException::class, $exception);
            $this->assertSame(1452, $exception->errorInfo[1]);
            $this->assertDatabaseCount('ai_daily_quota_usages', 0);
            $this->assertSame(1, DB::transactionLevel());
        }
    }

    public function test_database_rejects_duplicate_daily_identity(): void
    {
        $user = User::factory()->create();
        app(AiDailyQuotaService::class)->reserve($user);
        $usage = AiDailyQuotaUsage::sole();
        $this->assertSame(1, $usage->used);
        $this->assertSame('2026-09-09', $usage->usage_date->toDateString());
        $this->expectException(UniqueConstraintViolationException::class);
        AiDailyQuotaUsage::create([
            'user_id' => $user->id, 'feature' => 'ai_tutor', 'usage_date' => '2026-09-09', 'used' => 0,
        ]);
    }

    #[DataProvider('concurrentCounters')]
    public function test_real_mysql_processes_share_one_authoritative_counter(?int $initialUsed, array $allowed, int $finalUsed): void
    {
        $this->assertSame('mysql', DB::connection()->getDriverName());
        $user = User::factory()->create();
        $userId = $user->id;
        if ($initialUsed !== null) {
            AiDailyQuotaUsage::create([
                'user_id' => $userId, 'feature' => 'ai_tutor', 'usage_date' => '2026-09-09', 'used' => $initialUsed,
            ]);
        }
        $connection = config('database.connections.mysql');
        $barrier = sys_get_temp_dir().'/ai-quota-'.bin2hex(random_bytes(12));
        mkdir($barrier);
        // Process workers need committed fixtures, not RefreshDatabase's outer transaction.
        DB::commit();

        try {
            $worker = static function () use ($userId, $connection, $barrier): array {
                config(['database.default' => 'mysql', 'database.connections.mysql' => $connection, 'app.timezone' => 'Asia/Ho_Chi_Minh']);
                DB::purge('mysql');
                CarbonImmutable::setTestNow(CarbonImmutable::parse('2026-09-09 23:59:59', 'Asia/Ho_Chi_Minh'));
                $user = User::findOrFail($userId);
                $synchronized = false;
                DB::listen(static function (QueryExecuted $query) use ($barrier, &$synchronized): void {
                    if ($synchronized || ! str_starts_with($query->sql, 'select') || ! str_contains($query->sql, 'ai_daily_quota_usages')) {
                        return;
                    }
                    $synchronized = true;
                    touch($barrier.'/'.getmypid());
                    $deadline = microtime(true) + 10;
                    while (count(glob($barrier.'/*')) < 2) {
                        if (microtime(true) > $deadline) {
                            throw new \RuntimeException('Both quota processes did not reach the first counter read.');
                        }
                        usleep(10000);
                    }
                });
                $quota = app(AiDailyQuotaService::class)->reserve($user);

                return [
                    'quota' => $quota, 'pid' => getmypid(), 'driver' => DB::connection()->getDriverName(),
                    'database' => DB::connection()->getDatabaseName(), 'transaction_level' => DB::transactionLevel(),
                ];
            };
            $results = Concurrency::driver('process')->run([$worker, $worker]);
            $outcomes = array_column(array_column($results, 'quota'), 'allowed');
            sort($outcomes);
            $this->assertSame($allowed, $outcomes);
            $this->assertNotSame($results[0]['pid'], $results[1]['pid']);
            $this->assertSame(['mysql', 'mysql'], array_column($results, 'driver'));
            $this->assertSame([$connection['database'], $connection['database']], array_column($results, 'database'));
            $this->assertSame([0, 0], array_column($results, 'transaction_level'));
            $this->assertSame($finalUsed, AiDailyQuotaUsage::where('user_id', $userId)->sole()->used);
            $this->assertDatabaseCount('ai_daily_quota_usages', 1);
        } finally {
            User::whereKey($userId)->delete();
            foreach (glob($barrier.'/*') as $file) {
                unlink($file);
            }
            rmdir($barrier);
            DB::beginTransaction();
        }
    }

    public static function concurrentCounters(): array
    {
        return [
            'last free request' => [4, [false, true], 5],
            'first row race' => [null, [true, true], 2],
        ];
    }
}
