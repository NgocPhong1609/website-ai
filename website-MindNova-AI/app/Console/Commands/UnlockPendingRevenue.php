<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\Instructor\RevenueUnlockService;

class UnlockPendingRevenue extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'revenue:unlock-pending {--instructor= : Optional instructor ID to process}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Evaluate PENDING revenue allocations and unlock to AVAILABLE if no longer eligible for refund';

    /**
     * Execute the console command.
     */
    public function handle(RevenueUnlockService $unlockService)
    {
        $instructorId = $this->option('instructor') ? (int) $this->option('instructor') : null;

        $this->info("Scanning PENDING revenue allocations" . ($instructorId ? " for instructor ID {$instructorId}..." : "..."));

        $unlockedCount = $unlockService->unlockEligibleAllocations($instructorId);

        $this->info("Successfully evaluated and unlocked {$unlockedCount} allocations to AVAILABLE status.");

        return Command::SUCCESS;
    }
}
