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
        if (!Schema::hasTable('categories') || Schema::hasColumn('categories', 'status')) {
            return;
        }

        Schema::table('categories', function (Blueprint $table) {
            $table->string('status')->default('active');
        });
    }

    public function down(): void
    {
        if (!Schema::hasTable('categories') || !Schema::hasColumn('categories', 'status')) {
            return;
        }

        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};
