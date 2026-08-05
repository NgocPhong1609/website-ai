<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'teacher_verification_status')) {
                $table->string('teacher_verification_status')->default('pending')->after('status');
            }

            if (!Schema::hasColumn('users', 'teacher_verified_at')) {
                $table->timestamp('teacher_verified_at')->nullable()->after('teacher_verification_status');
            }

            if (!Schema::hasColumn('users', 'teacher_verification_note')) {
                $table->text('teacher_verification_note')->nullable()->after('teacher_verified_at');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'teacher_verification_note')) {
                $table->dropColumn('teacher_verification_note');
            }
            if (Schema::hasColumn('users', 'teacher_verified_at')) {
                $table->dropColumn('teacher_verified_at');
            }
            if (Schema::hasColumn('users', 'teacher_verification_status')) {
                $table->dropColumn('teacher_verification_status');
            }
        });
    }
};
