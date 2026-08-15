<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('discussions', function (Blueprint $table) {
            $table->boolean('is_pinned')->default(false)->after('status');
            $table->boolean('is_resolved')->default(false)->after('is_pinned');
        });

        Schema::table('discussion_replies', function (Blueprint $table) {
            $table->boolean('is_best_answer')->default(false)->after('content');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('discussions', function (Blueprint $table) {
            $table->dropColumn(['is_pinned', 'is_resolved']);
        });

        Schema::table('discussion_replies', function (Blueprint $table) {
            $table->dropColumn('is_best_answer');
        });
    }
};
