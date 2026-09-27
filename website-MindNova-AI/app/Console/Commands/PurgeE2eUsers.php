<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

/**
 * Removes the throwaway accounts created by the Playwright E2E suite
 * (e2e.student.*@mindnova.test) together with everything they generated.
 * Refuses to run outside local/testing environments.
 */
class PurgeE2eUsers extends Command
{
    protected $signature = 'e2e:purge-users {--dry-run : Only report what would be deleted}';

    protected $description = 'Delete E2E test accounts (e2e.student.*@mindnova.test) and their data';

    private const USER_TABLES = [
        'ai_tutor_conversations', 'activity_logs', 'ai_daily_quota_usages', 'ai_generated_quizzes',
        'ai_usage_logs', 'chat_conversation_members', 'enrollments', 'lesson_completions',
        'reviews', 'role_user', 'user_profiles', 'user_streaks', 'user_quiz_attempts',
        'notifications', 'student_payment_methods',
    ];

    public function handle(): int
    {
        if (!app()->environment(['local', 'testing'])) {
            $this->error('This command only runs in local or testing environments.');
            return self::FAILURE;
        }

        $users = DB::table('users')->where('email', 'like', 'e2e.student.%@mindnova.test')->get(['id', 'name', 'email']);
        if ($users->isEmpty()) {
            $this->info('No E2E users found.');
            return self::SUCCESS;
        }

        $ids = $users->pluck('id');
        $names = $users->pluck('name')->unique();
        $this->info("Found {$users->count()} E2E user(s).");
        if ($this->option('dry-run')) {
            $users->each(fn ($u) => $this->line(" - {$u->email}"));
            return self::SUCCESS;
        }

        $counts = DB::transaction(function () use ($ids, $names) {
            $counts = [];
            $orderIds = DB::table('orders')->whereIn('user_id', $ids)->pluck('id');
            $conversationIds = DB::table('ai_tutor_conversations')->whereIn('user_id', $ids)->pluck('id');

            foreach (['order_items', 'payments', 'revenue_allocations'] as $table) {
                if (\Schema::hasTable($table) && \Schema::hasColumn($table, 'order_id')) {
                    $counts[$table] = DB::table($table)->whereIn('order_id', $orderIds)->delete();
                }
            }
            $counts['orders'] = DB::table('orders')->whereIn('user_id', $ids)->delete();
            $counts['ai_tutor_messages'] = DB::table('ai_tutor_messages')->whereIn('conversation_id', $conversationIds)->delete();

            foreach (self::USER_TABLES as $table) {
                if (\Schema::hasTable($table) && \Schema::hasColumn($table, 'user_id')) {
                    $counts[$table] = DB::table($table)->whereIn('user_id', $ids)->delete();
                }
            }

            // Notifications sent to instructors about these students (enrolment / review).
            $counts['instructor_notifications'] = DB::table('notifications')
                ->whereIn('type', ['App\\Notifications\\StudentEnrolled', 'App\\Notifications\\NewReview'])
                ->where(function ($q) use ($names) {
                    foreach ($names as $name) {
                        $q->orWhere('body', 'like', '%' . $name . '%');
                    }
                })
                ->delete();

            $counts['personal_access_tokens'] = DB::table('personal_access_tokens')
                ->where('tokenable_type', 'App\\Models\\User')->whereIn('tokenable_id', $ids)->delete();
            $counts['users'] = DB::table('users')->whereIn('id', $ids)->delete();

            return $counts;
        });

        foreach (array_filter($counts) as $table => $n) {
            $this->line(" {$table}: {$n}");
        }
        $this->info('E2E data removed.');
        return self::SUCCESS;
    }
}
