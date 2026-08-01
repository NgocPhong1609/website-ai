<?php
$media = App\Models\LessonMedia::where('is_temp', true)->orderBy('id', 'desc')->first();
$lesson = App\Models\Lesson::first();
$lesson->content = '<img src="' . Storage::disk('r2')->url($media->r2_key) . '">';
$lesson->save();
$service = app(App\Services\Instructor\LessonService::class);
$service->confirmTempMedia([$media->id], $lesson);
echo "New is_temp: " . $media->fresh()->is_temp . ", new r2_key: " . $media->fresh()->r2_key;
echo "\n";
