<?php

namespace Tests\Feature\Instructor;

use App\Models\User;
use App\Services\Ai\AiRouterService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class QuizGenerationTimeoutTest extends TestCase
{
    use RefreshDatabase;

    private function payload(): array
    {
        return ['source_type' => 'topic', 'topic' => 'Hệ nhị phân', 'difficulty' => 'easy',
            'total_questions' => 1, 'multiple_choice_count' => 1, 'essay_count' => 0];
    }

    private function aiContent(): string
    {
        return json_encode(['questions' => [[
            'type' => 'multiple_choice', 'question' => 'Hệ nhị phân có bao nhiêu ký hiệu?',
            'options' => ['2', '8', '10', '16'], 'correct_answer_index' => 0, 'points' => 10,
        ]]]);
    }

    public function test_quiz_moves_to_next_model_after_one_transient_failure(): void
    {
        $teacher = User::factory()->create(['role' => 'teacher']);
        config(['services.gemini.api_key' => 'test', 'services.gemini.model' => 'primary-model',
            'services.gemini.fallback_models' => ['fallback-model'], 'services.gemini.force_failure' => false]);
        Http::preventStrayRequests();
        Http::fake([
            '*models/primary-model:*' => Http::response([], 503),
            '*models/fallback-model:*' => Http::response(['candidates' => [['content' => ['parts' => [['text' => $this->aiContent()]]]]]]),
        ]);
        $this->actingAs($teacher)->postJson('/api/instructor/ai-quiz/generate', $this->payload())->assertOk();
        Http::assertSentCount(2);
        $this->assertStringContainsString('fallback-model', Http::recorded()[1][0]->url());
    }

    public function test_quiz_shares_a_finite_budget_below_the_web_execution_limit(): void
    {
        $teacher = User::factory()->create(['role' => 'teacher']);
        $started = microtime(true);
        $router = \Mockery::mock(AiRouterService::class);
        $router->shouldReceive('sendMessageWithFallback')->once()->withArgs(function ($messages, $options) use ($started) {
            $this->assertArrayHasKey('deadline', $options);
            $budget = $options['deadline'] - $started;
            $this->assertGreaterThan(170, $budget);
            $this->assertLessThanOrEqual(181, $budget);
            $this->assertGreaterThan($budget, (int) ini_get('max_execution_time'));
            return true;
        })->andReturn(['content' => $this->aiContent(), 'meta' => []]);
        $this->app->instance(AiRouterService::class, $router);
        $this->actingAs($teacher)->postJson('/api/instructor/ai-quiz/generate', $this->payload())->assertOk();
    }
}
