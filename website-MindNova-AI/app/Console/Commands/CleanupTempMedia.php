<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('app:cleanup-temp-media')]
#[Description('Cleans up temporary media files older than 24 hours')]
class CleanupTempMedia extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(\App\Services\Instructor\LessonService $lessonService)
    {
        $this->info('Starting temporary media cleanup...');

        $staleMedia = \App\Models\LessonMedia::where('is_temp', true)
            ->where('created_at', '<', now()->subHours(24))
            ->get();

        $count = 0;
        foreach ($staleMedia as $media) {
            $lessonService->deleteTempMedia($media->id);
            $count++;
        }

        $this->info("Cleanup completed. Deleted {$count} temporary files.");
    }
}
