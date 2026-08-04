<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('questions')) {
            Schema::table('questions', function (Blueprint $table) {
                if (!Schema::hasColumn('questions', 'question_category')) {
                    $table->string('question_category')->nullable()->after('content');
                }
            });
        }

        Schema::create('shared_resources', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('type')->default('ebook');
            $table->string('url');
            $table->text('description')->nullable();
            $table->string('status')->default('active');
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shared_resources');

        if (Schema::hasTable('questions')) {
            Schema::table('questions', function (Blueprint $table) {
                if (Schema::hasColumn('questions', 'question_category')) {
                    $table->dropColumn('question_category');
                }
            });
        }
    }
};
