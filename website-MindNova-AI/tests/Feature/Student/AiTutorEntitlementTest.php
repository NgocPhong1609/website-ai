<?php

namespace Tests\Feature\Student;

use App\Models\AdminSetting;
use App\Models\AiDailyQuotaUsage;
use App\Models\AiUsageLog;
use App\Models\Subscription;
use App\Models\User;
use App\Settings\AiSettingsRepository;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class AiTutorEntitlementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'services.gemini.api_key' => 'course-primary-key',
            'services.gemini.force_failure' => false,
            'services.backup_ai.api_key' => null,
            'services.openai.key' => null,
            'services.groq.key' => null,
        ]);
        Http::preventStrayRequests();
    }

    public function test_free_package_uses_one_counter_across_live_and_compatibility_tutor_routes(): void
    {
        $user = User::factory()->create(['role' => 'student', 'email_verified_at' => now()]);
        $lesson = CourseAiTutorServiceTest::enrolledLesson($user);
        AdminSetting::create(['key' => 'ai.packages.v1', 'value' => [
            'free' => ['daily_requests' => 2], 'premium' => ['daily_requests' => 4],
        ]]);
        Http::fake(['generativelanguage.googleapis.com/*' => Http::sequence()
            ->push(['candidates' => [['content' => ['parts' => [['text' => 'Live answer']]]]]])
            ->push(['candidates' => [['content' => ['parts' => [['text' => 'Compatibility answer']]]]]])]);

        $this->actingAs($user, 'sanctum')->postJson('/api/student/study-plan/chat', [
            'message' => 'Explain route binding',
            'lesson_id' => $lesson->id,
            'history' => [],
        ])->assertOk()->assertJsonPath('meta.quota.used', 1);

        $lastAllowed = $this->actingAs($user, 'sanctum')->postJson('/api/student/ai-tutor/chat', [
            'message' => 'Explain addition',
        ]);
        $lastAllowed->assertOk()
            ->assertHeader('X-AI-Daily-Limit', '2')
            ->assertHeader('X-AI-Used', '2')
            ->assertHeader('X-AI-Remaining', '0');
        $this->assertSame('Compatibility answer', $lastAllowed->streamedContent());
        $this->assertSame(2, AiDailyQuotaUsage::sole()->used);

        $this->actingAs($user, 'sanctum')->postJson('/api/student/ai-tutor/chat', [
            'message' => 'One request too many',
        ])->assertStatus(429)
            ->assertJsonPath('message', 'Bạn đã sử dụng hết lượt AI hôm nay.')
            ->assertJsonPath('meta.allowed', false)
            ->assertJsonPath('meta.package', 'free')
            ->assertJsonPath('meta.daily_limit', 2)
            ->assertJsonPath('meta.used', 2)
            ->assertJsonPath('meta.remaining', 0)
            ->assertJsonPath('meta.resets_at', fn ($value) => is_string($value) && $value !== '');
        $this->assertSame(2, AiDailyQuotaUsage::sole()->used);
        Http::assertSentCount(2);
    }

    public function test_active_premium_package_uses_its_configured_shared_limit(): void
    {
        $user = User::factory()->create(['role' => 'student', 'email_verified_at' => now()]);
        CourseAiTutorServiceTest::enrolledLesson($user);
        Subscription::create([
            'user_id' => $user->id,
            'plan' => 'premium',
            'status' => 'active',
            'expires_at' => now()->addDay(),
        ]);
        AdminSetting::create(['key' => 'ai.packages.v1', 'value' => [
            'free' => ['daily_requests' => 1], 'premium' => ['daily_requests' => 3],
        ]]);
        Http::fake(['generativelanguage.googleapis.com/*' => Http::response([
            'candidates' => [['content' => ['parts' => [['text' => 'Premium answer']]]]],
        ])]);

        foreach ([1, 2, 3] as $used) {
            $response = $this->actingAs($user, 'sanctum')->postJson('/api/student/ai-tutor/chat', [
                'message' => 'Premium question '.$used,
            ]);
            $response->assertOk()
                ->assertHeader('X-AI-Daily-Limit', '3')
                ->assertHeader('X-AI-Used', (string) $used)
                ->assertHeader('X-AI-Remaining', (string) (3 - $used));
            $this->assertSame('Premium answer', $response->streamedContent());
        }

        $this->actingAs($user, 'sanctum')->postJson('/api/student/ai-tutor/chat', [
            'message' => 'Premium request too many',
        ])->assertStatus(429)
            ->assertJsonPath('meta.package', 'premium')
            ->assertJsonPath('meta.daily_limit', 3)
            ->assertJsonPath('meta.used', 3)
            ->assertJsonPath('meta.remaining', 0);
        $this->assertSame(3, AiDailyQuotaUsage::sole()->used);
        Http::assertSentCount(3);
    }

    public function test_missing_router_configuration_does_not_spend_quota_or_call_a_provider(): void
    {
        $user = User::factory()->create(['role' => 'student', 'email_verified_at' => now()]);
        CourseAiTutorServiceTest::enrolledLesson($user);
        AiDailyQuotaUsage::create([
            'user_id' => $user->id,
            'feature' => 'ai_tutor',
            'usage_date' => now()->toDateString(),
            'used' => 2,
        ]);
        config([
            'services.gemini.api_key' => null,
            'services.backup_ai.api_key' => null,
            'services.openai.key' => null,
            'services.groq.key' => null,
        ]);
        Http::fake();

        $this->actingAs($user, 'sanctum')->postJson('/api/student/ai-tutor/chat', [
            'message' => 'Explain addition',
        ])->assertStatus(503)
            ->assertExactJson(['message' => 'AI Tutor hiện không khả dụng. Vui lòng thử lại sau.']);

        $this->assertSame(2, AiDailyQuotaUsage::sole()->used);
        $this->assertSame(0, AiUsageLog::count());
        Http::assertNothingSent();
    }

    public function test_fallible_prompt_preparation_finishes_before_quota_reservation(): void
    {
        $user = User::factory()->create(['role' => 'student', 'email_verified_at' => now()]);
        CourseAiTutorServiceTest::enrolledLesson($user);
        $this->partialMock(AiSettingsRepository::class, function ($mock) {
            $mock->shouldReceive('prompts')->once()->andThrow(new \RuntimeException('private-prompt-settings-failure'));
        });
        Http::fake();

        $this->actingAs($user, 'sanctum')->postJson('/api/student/ai-tutor/chat', [
            'message' => 'Explain addition',
        ])->assertStatus(503)
            ->assertExactJson(['message' => 'AI Tutor hiện không khả dụng. Vui lòng thử lại sau.']);

        $this->assertSame(0, AiDailyQuotaUsage::count());
        $this->assertSame(0, AiUsageLog::count());
        Http::assertNothingSent();
    }
}
