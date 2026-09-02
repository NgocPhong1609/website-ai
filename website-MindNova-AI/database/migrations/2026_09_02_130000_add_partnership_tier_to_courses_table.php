<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('courses', 'partnership_tier')) {
            Schema::table('courses', function (Blueprint $table) {
                $table->string('partnership_tier', 20)->default('standard')->after('price');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('courses', 'partnership_tier')) {
            Schema::table('courses', function (Blueprint $table) {
                $table->dropColumn('partnership_tier');
            });
        }
    }
};
