<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('quiz_course_attachments')) {
            Schema::table('quiz_course_attachments', function (Blueprint $table) {
                if (!Schema::hasColumn('quiz_course_attachments', 'is_active')) {
                    $table->boolean('is_active')->default(false)->after('order');
                }
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('quiz_course_attachments')) {
            Schema::table('quiz_course_attachments', function (Blueprint $table) {
                if (Schema::hasColumn('quiz_course_attachments', 'is_active')) {
                    $table->dropColumn('is_active');
                }
            });
        }
    }
};
