<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('users', 'payout_info')) {
            Schema::table('users', function (Blueprint $table) {
                $table->json('payout_info')->nullable()->after('ai_suggestions');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('users', 'payout_info')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('payout_info');
            });
        }
    }
};
