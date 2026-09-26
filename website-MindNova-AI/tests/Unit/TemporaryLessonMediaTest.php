<?php

namespace Tests\Unit;

use App\Models\Lesson;
use App\Models\LessonMedia;
use App\Services\Instructor\LessonService;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class TemporaryLessonMediaTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        config(['database.default' => 'sqlite', 'database.connections.sqlite.database' => ':memory:']);
        DB::purge('sqlite');
        Schema::create('lessons', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('course_id');
            $table->unsignedBigInteger('module_id');
            $table->string('type');
            $table->text('content')->nullable();
            $table->string('video_url')->nullable();
            $table->timestamps();
        });
        foreach (['2026_07_21_070737_create_lesson_media_table.php', '2026_07_27_044324_add_temp_fields_to_lesson_media_table.php'] as $file) {
            (require database_path('migrations/'.$file))->up();
        }
        foreach (glob(database_path('migrations/*_allow_unassigned_lesson_media.php')) as $file) {
            (require $file)->up();
        }
        Storage::fake('r2');
    }

    protected function tearDown(): void
    {
        DB::disconnect('sqlite');
        parent::tearDown();
    }

    public function test_uploaded_image_is_persisted_and_attached_with_a_durable_url(): void
    {
        $service = app(LessonService::class);
        $result = $service->uploadTempMedia(UploadedFile::fake()->create('image.png', 1, 'image/png'));
        $media = LessonMedia::findOrFail($result['media_id']);
        $this->assertNull($media->lesson_id);
        $this->assertTrue($media->is_temp);
        $oldKey = $media->r2_key;
        Storage::disk('r2')->assertExists($oldKey);
        $lesson = Lesson::withoutEvents(fn () => Lesson::forceCreate([
            'course_id' => 1, 'module_id' => 1, 'type' => 'article',
            'content' => '<p>Document</p><img src="'.$result['url'].'">',
        ]));
        $service->confirmTempMedia([$media->id], $lesson);
        $media->refresh();
        $this->assertSame($lesson->id, $media->lesson_id);
        $this->assertFalse($media->is_temp);
        Storage::disk('r2')->assertExists($media->r2_key);
        Storage::disk('r2')->assertMissing($oldKey);
        $this->assertStringContainsString(Storage::disk('r2')->url($media->r2_key), $lesson->fresh()->content);
        $lesson->delete();
        $this->assertNull(LessonMedia::find($media->id));
    }

    public function test_failed_move_keeps_the_original_media_and_does_not_claim_permanent_storage(): void
    {
        $service = app(LessonService::class);
        $result = $service->uploadTempMedia(UploadedFile::fake()->create('image.png', 1, 'image/png'));
        $media = LessonMedia::findOrFail($result['media_id']);
        $oldKey = $media->r2_key;
        $lesson = Lesson::withoutEvents(fn () => Lesson::forceCreate([
            'course_id' => 1, 'module_id' => 1, 'type' => 'article',
            'content' => '<img src="'.$result['url'].'">',
        ]));
        Storage::shouldReceive('disk')->with('r2')->andReturn($disk = \Mockery::mock());
        $disk->shouldReceive('url')->andReturnUsing(fn ($key) => 'https://example.test/'.$key);
        $disk->shouldReceive('move')->once()->andReturn(false);
        try {
            $service->confirmTempMedia([$media->id], $lesson);
            $this->fail('A failed move must throw.');
        } catch (\RuntimeException $error) {
            $this->assertStringContainsString('lưu', $error->getMessage());
        }
        $media->refresh();
        $this->assertTrue($media->is_temp);
        $this->assertNull($media->lesson_id);
        $this->assertSame($oldKey, $media->r2_key);
        $this->assertStringContainsString($result['url'], $lesson->fresh()->content);
    }

    public function test_a_later_move_failure_does_not_break_an_image_already_attached(): void
    {
        $service = app(LessonService::class);
        $first = $service->uploadTempMedia(UploadedFile::fake()->create('first.png', 1, 'image/png'));
        $second = $service->uploadTempMedia(UploadedFile::fake()->create('second.png', 1, 'image/png'));
        $lesson = Lesson::withoutEvents(fn () => Lesson::forceCreate([
            'course_id' => 1, 'module_id' => 1, 'type' => 'article',
            'content' => '<img src="'.$first['url'].'"><img src="'.$second['url'].'">',
        ]));
        $realDisk = Storage::disk('r2');
        Storage::shouldReceive('disk')->with('r2')->andReturn($disk = \Mockery::mock());
        $disk->shouldReceive('url')->andReturnUsing(fn ($key) => $realDisk->url($key));
        $calls = 0;
        $disk->shouldReceive('move')->twice()->andReturnUsing(function ($from, $to) use ($realDisk, &$calls) {
            return ++$calls === 1 ? $realDisk->move($from, $to) : false;
        });
        try {
            $service->confirmTempMedia([$first['media_id'], $second['media_id']], $lesson);
            $this->fail('The second move must fail.');
        } catch (\RuntimeException $error) {
            $this->assertStringContainsString('lưu', $error->getMessage());
        }
        $firstMedia = LessonMedia::findOrFail($first['media_id']);
        $this->assertFalse($firstMedia->is_temp);
        $realDisk->assertExists($firstMedia->r2_key);
        $this->assertStringContainsString($realDisk->url($firstMedia->r2_key), $lesson->fresh()->content);
        $this->assertStringContainsString($second['url'], $lesson->fresh()->content);
        $this->assertTrue(LessonMedia::findOrFail($second['media_id'])->is_temp);
        Storage::swap($manager = new \Illuminate\Filesystem\FilesystemManager(app()));
        $manager->set('r2', $realDisk);
        // The editor retries with its original HTML, as the update endpoint does.
        $lesson->content = '<img src="'.$first['url'].'"><img src="'.$second['url'].'">';
        $lesson->save();
        $service->confirmTempMedia([$first['media_id'], $second['media_id']], $lesson->fresh());
        $secondMedia = LessonMedia::findOrFail($second['media_id']);
        $this->assertFalse($secondMedia->is_temp);
        $realDisk->assertExists($secondMedia->r2_key);
        $this->assertStringContainsString($realDisk->url($firstMedia->r2_key), $lesson->fresh()->content);
        $this->assertStringContainsString($realDisk->url($secondMedia->r2_key), $lesson->fresh()->content);
    }

    public function test_failed_storage_write_does_not_report_an_uploaded_image(): void
    {
        Storage::shouldReceive('disk')->with('r2')->andReturn($disk = \Mockery::mock());
        $disk->shouldReceive('putFileAs')->once()->andReturn(false);
        try {
            app(LessonService::class)->uploadTempMedia(UploadedFile::fake()->create('image.png', 1, 'image/png'));
            $this->fail('A failed upload must throw.');
        } catch (\RuntimeException $error) {
            $this->assertStringContainsString('tải', $error->getMessage());
        }
        $this->assertSame(0, LessonMedia::count());
    }
}
