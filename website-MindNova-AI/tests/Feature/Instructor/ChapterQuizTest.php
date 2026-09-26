<?php

use App\Models\Course;
use App\Models\Quiz;
use App\Models\Role;
use App\Models\User;
use App\Services\Ai\AiRouterService;

beforeEach(function () {
    $this->teacher = User::factory()->create();
    $this->teacher->roles()->attach(Role::firstOrCreate(['name' => 'teacher']));
    $this->course = Course::create(['teacher_id' => $this->teacher->id, 'title' => 'Course', 'slug' => 'chapter-course', 'description' => 'WHOLE_COURSE_DESCRIPTION', 'price' => 0]);
    $this->chapter = $this->course->modules()->create(['title' => 'Chapter A', 'order' => 1]);
    $this->chapter->lessons()->create(['course_id' => $this->course->id, 'title' => 'Lesson A', 'content' => '<p>ONLY_CHAPTER_A</p>', 'type' => 'article', 'order' => 1]);
    $this->chapter->lessons()->create(['course_id' => $this->course->id, 'title' => 'Existing quiz', 'content' => 'OLD_QUIZ_CONTENT', 'type' => 'quiz_module', 'order' => 2]);
    $other = $this->course->modules()->create(['title' => 'Chapter B', 'order' => 2]);
    $other->lessons()->create(['course_id' => $this->course->id, 'title' => 'Lesson B', 'content' => 'OTHER_CHAPTER_B', 'type' => 'article', 'order' => 1]);
    $this->generation = ['source_type' => 'course', 'course_id' => $this->course->id, 'module_id' => $this->chapter->id, 'difficulty' => 'easy', 'total_questions' => 1, 'multiple_choice_count' => 1, 'essay_count' => 0];
    $this->storePayload = ['title' => 'Chapter quiz', 'course_id' => $this->course->id, 'module_id' => $this->chapter->id, 'source_type' => 'course', 'questions' => [[
        'type' => 'multiple_choice', 'content' => 'Question', 'points' => 10,
        'answers' => [['content' => 'A', 'is_correct' => true], ['content' => 'B', 'is_correct' => false]],
    ]]];
    $this->actingAs($this->teacher);
});

test('chapter generation sends only selected chapter content to AI', function () {
    $router = Mockery::mock(AiRouterService::class);
    $router->shouldReceive('sendMessageWithFallback')->once()->withArgs(function ($messages, $options) {
        $prompt = implode("\n", array_map(fn ($message) => $message->content, $messages));
        expect($prompt)->toContain('ONLY_CHAPTER_A')->not->toContain('OTHER_CHAPTER_B', 'OLD_QUIZ_CONTENT', 'WHOLE_COURSE_DESCRIPTION');
        return true;
    })->andReturn(['content' => json_encode(['questions' => [[
        'type' => 'multiple_choice', 'question' => 'Question A', 'options' => ['A', 'B', 'C', 'D'], 'correct_answer_index' => 0, 'points' => 10,
    ]]]), 'meta' => []]);
    $this->app->instance(AiRouterService::class, $router);
    $this->postJson('/api/instructor/ai-quiz/generate', $this->generation)->assertOk()->assertJsonPath('data.module_id', $this->chapter->id);
});

test('chapter single question regeneration keeps the same source scope', function () {
    $router = Mockery::mock(AiRouterService::class);
    $router->shouldReceive('sendMessageWithFallback')->once()->withArgs(function ($messages, $options) {
        $prompt = implode("\n", array_map(fn ($message) => $message->content, $messages));
        expect($prompt)->toContain('ONLY_CHAPTER_A')->not->toContain('OTHER_CHAPTER_B', 'OLD_QUIZ_CONTENT');
        return true;
    })->andReturn(['content' => json_encode(['question' => 'Question A', 'options' => ['A', 'B', 'C', 'D'], 'correct_answer_index' => 0])]);
    $this->app->instance(AiRouterService::class, $router);
    $this->postJson('/api/instructor/ai-quiz/regenerate-question', ['type' => 'multiple_choice', 'difficulty' => 'easy', 'course_id' => $this->course->id, 'module_id' => $this->chapter->id])->assertOk();
});

test('chapter selection rejects another course and missing course on generate and store', function () {
    $course = Course::create(['teacher_id' => $this->teacher->id, 'title' => 'Other', 'slug' => 'other', 'description' => 'Other course', 'price' => 0]);
    $module = $course->modules()->create(['title' => 'Foreign chapter', 'order' => 1]);
    foreach (['generate' => $this->generation, 'store' => $this->storePayload] as $endpoint => $payload) {
        $this->postJson('/api/instructor/ai-quiz/'.$endpoint, array_replace($payload, ['module_id' => $module->id]))->assertUnprocessable()->assertJsonValidationErrors('module_id');
        $this->postJson('/api/instructor/ai-quiz/'.$endpoint, array_replace($payload, ['course_id' => null]))->assertUnprocessable();
    }
});

test('empty chapter never falls back to full course content', function () {
    $this->chapter->lessons()->delete();
    $router = Mockery::mock(AiRouterService::class);
    $router->shouldNotReceive('sendMessageWithFallback');
    $this->app->instance(AiRouterService::class, $router);
    $this->postJson('/api/instructor/ai-quiz/generate', $this->generation)->assertUnprocessable()->assertJsonPath('error_code', 'EMPTY_MODULE_CONTENT');
});

test('saving chapter quiz creates exactly one end of chapter attachment', function () {
    $response = $this->postJson('/api/instructor/ai-quiz/store', $this->storePayload)->assertCreated();
    $quiz = Quiz::findOrFail($response->json('data.id'));
    expect($quiz->attachments)->toHaveCount(1);
    expect($quiz->attachments->first()->position)->toBe('in_module');
    expect($quiz->attachments->first()->module_id)->toBe($this->chapter->id);
    expect($quiz->attachments->first()->after_lesson_id)->toBeNull();
});

test('editing a saved chapter quiz preserves its chapter attachment', function () {
    $quiz = Quiz::create(['instructor_id' => $this->teacher->id, 'title' => 'Chapter quiz', 'status' => 'draft']);
    $quiz->attachments()->create(['course_id' => $this->course->id, 'module_id' => $this->chapter->id, 'position' => 'in_module']);
    $payload = $this->storePayload;
    unset($payload['module_id']);
    $this->putJson('/api/instructor/ai-quiz/'.$quiz->id, $payload)->assertOk();
    expect($quiz->attachments()->first()->position)->toBe('in_module');
    expect($quiz->attachments()->first()->module_id)->toBe($this->chapter->id);
});


test('chapter quiz appears after lessons in the selected chapter for students', function () {
    $version = \App\Models\ContentVersion::create([
        'versionable_type' => Course::class, 'versionable_id' => $this->course->id,
        'version_number' => 1, 'snapshot_data' => [], 'status' => 'published',
        'is_published' => true, 'created_by' => $this->teacher->id,
    ]);
    $this->course->update(['status' => 'published', 'published_version_id' => $version->id]);
    $this->chapter->lessons()->update(['status' => 'published', 'published_version_id' => $version->id]);
    $response = $this->postJson('/api/instructor/ai-quiz/store', $this->storePayload)->assertCreated();
    $detail = app(\App\Services\Student\CourseService::class)->getCourseDetail($this->course->id, $this->teacher);
    $module = collect($detail['modules'])->firstWhere('id', $this->chapter->id);
    expect($module)->not->toBeNull();
    expect($module['lessons'])->toHaveCount(3);
    expect($module['lessons'][0]['title'])->toBe('Lesson A');
    expect($module['lessons'][2]['quiz_id'])->toBe($response->json('data.id'));
    expect(collect($detail['modules'])->flatMap(fn ($item) => $item['lessons'])->where('quiz_id', $response->json('data.id')))->toHaveCount(1);
});

test('another teacher cannot generate regenerate or save in the selected chapter', function () {
    $other = User::factory()->create(['role' => 'teacher']);
    $this->actingAs($other);
    $this->postJson('/api/instructor/ai-quiz/generate', $this->generation)->assertUnprocessable();
    $this->postJson('/api/instructor/ai-quiz/store', $this->storePayload)->assertUnprocessable();
    $this->postJson('/api/instructor/ai-quiz/regenerate-question', [
        'type' => 'multiple_choice', 'course_id' => $this->course->id, 'module_id' => $this->chapter->id,
    ])->assertForbidden();
});

test('whole course save then attach keeps the final quiz active', function () {
    $payload = $this->storePayload;
    unset($payload['module_id']);
    $response = $this->postJson('/api/instructor/ai-quiz/store', $payload)->assertCreated();
    $id = $response->json('data.id');
    $this->postJson("/api/instructor/ai-quiz/{$id}/attach", ['course_id' => $this->course->id, 'position' => 'end_of_course'])->assertCreated();
    $attachment = Quiz::findOrFail($id)->attachments()->first();
    expect($attachment->position)->toBe('end_of_course');
    expect($attachment->is_active)->toBeTrue();
    expect($attachment->module_id)->toBeNull();
});
