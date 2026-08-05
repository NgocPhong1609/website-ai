<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('lessons') || Schema::hasColumn('lessons', 'status')) {
            return;
        }

        Schema::table('lessons', function (Blueprint $table) {
            $table->enum('status', ['draft', 'published'])->default('draft')->after('order');
        });
    }

    public function down(): void
    {
        if (!Schema::hasTable('lessons') || !Schema::hasColumn('lessons', 'status')) {
            return;
        }

        Schema::table('lessons', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};
