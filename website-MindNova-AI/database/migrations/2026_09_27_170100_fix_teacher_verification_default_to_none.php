<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Change the default of users.teacher_verification_status from
     * 'pending' to 'none', and backfill existing users who have
     * 'pending' but never actually submitted a verification request.
     */
    public function up(): void
    {
        if (! Schema::hasColumn('users', 'teacher_verification_status')) {
            return;
        }

        Schema::table('users', function (Blueprint $table) {
            $table->string('teacher_verification_status')->default('none')->change();
        });

        // Backfill: set 'pending' → 'none' for users who have no
        // teacher_verifications record (i.e. never submitted).
        $verificationTable = Schema::hasTable('teacher_verifications')
            ? 'teacher_verifications'
            : null;

        if ($verificationTable) {
            DB::table('users')
                ->where('teacher_verification_status', 'pending')
                ->whereNotExists(function ($query) use ($verificationTable) {
                    $query->select(DB::raw(1))
                        ->from($verificationTable)
                        ->whereColumn("{$verificationTable}.teacher_id", 'users.id');
                })
                ->update(['teacher_verification_status' => 'none']);
        }
    }

    public function down(): void
    {
        if (! Schema::hasColumn('users', 'teacher_verification_status')) {
            return;
        }

        Schema::table('users', function (Blueprint $table) {
            $table->string('teacher_verification_status')->default('pending')->change();
        });
    }
};
