<?php

namespace Tests\Feature;

use App\Http\Controllers\Api\Instructor\CourseOutlineController;
use App\Services\Ai\AiRouterService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class CourseOutlineCompletenessTest extends TestCase
{
    private function outline(): array
    {
        $answers = array_map(fn ($i) => ['content' => 'Answer '.$i, 'is_correct' => $i === 0], range(0, 3));
        $question = ['content' => 'Question', 'answers' => $answers];
        $lessons = array_fill(0, 3, ['title' => 'Lesson', 'type' => 'document', 'content' => '<p>Learning material</p>']);
        $lessons[] = ['title' => 'Quiz', 'type' => 'quiz', 'questions' => array_fill(0, 3, $question)];

        return ['chapters' => array_fill(0, 4, ['title' => 'Chapter', 'lessons' => $lessons])];
    }

    private function generate(): JsonResponse
    {
        return app(CourseOutlineController::class)->generate(Request::create('/test', 'POST', ['topic' => 'Python']));
    }

    public function test_partial_outline_is_retried_and_only_complete_outline_is_returned(): void
    {
        config(['services.gemini.api_key' => 'fake', 'services.gemini.model' => 'gemini-3.8-flash',
            'services.gemini.fallback_models' => [], 'services.gemini.force_failure' => false]);
        $full = $this->outline();
        $partial = ['chapters' => [$full['chapters'][0], ['title' => 'Chapter 2', 'lessons' => [$full['chapters'][0]['lessons'][0]]]]];
        $response = fn ($data) => ['candidates' => [['content' => ['parts' => [['text' => json_encode($data)]]]]]];
        Http::preventStrayRequests();
        Http::fakeSequence()->push($response($partial))->push($response($full));
        $result = $this->generate();
        $this->assertSame(200, $result->getStatusCode());
        $this->assertCount(4, $result->getData(true)['data']['chapters']);
        Http::assertSentCount(2);
        Http::assertSent(fn ($r) => $r['generationConfig']['maxOutputTokens'] === 32768);
    }

    public function test_incomplete_backup_output_is_not_reported_as_success(): void
    {
        config(['services.gemini.api_key' => 'fake', 'services.gemini.fallback_models' => [],
            'services.gemini.force_failure' => false, 'services.backup_ai.provider' => 'groq',
            'services.backup_ai.api_key' => 'fake-backup']);
        Http::preventStrayRequests();
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response([], 503),
            'api.groq.com/*' => Http::response(['choices' => [['message' => ['content' => '{"chapters":[]}']]]]),
        ]);
        $result = $this->generate();
        $this->assertSame(500, $result->getStatusCode());
        $this->assertFalse($result->getData(true)['success']);
        Http::assertSentCount(3);
    }

    public function test_controller_rejects_missing_lessons_or_invalid_quiz_even_if_router_returns_them(): void
    {
        $full = $this->outline();
        $invalid = $full;
        $invalid['chapters'][1]['lessons'] = [$invalid['chapters'][1]['lessons'][0]];
        $badQuiz = $full;
        $badQuiz['chapters'][0]['lessons'][3]['questions'][0]['answers'][0]['is_correct'] = false;
        foreach ([$invalid, $badQuiz, ['chapters' => []]] as $data) {
            $router = \Mockery::mock(AiRouterService::class);
            $router->shouldReceive('sendMessageWithFallback')->once()->andReturn(['content' => json_encode($data), 'meta' => []]);
            $r = (new CourseOutlineController($router))->generate(Request::create('/test', 'POST', ['topic' => 'Python']));
            $this->assertSame(500, $r->getStatusCode());
            $this->assertFalse($r->getData(true)['success']);
        }
    }
}
