<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('quizzes', function (Blueprint $table) {
            $table->text('thumbnail_url')->nullable();
            $table->text('thumbnail_r2_key')->nullable();
        });

        Schema::table('questions', function (Blueprint $table) {
            $table->text('image_url')->nullable();
            $table->text('image_r2_key')->nullable();
        });

        Schema::table('answers', function (Blueprint $table) {
            $table->text('image_url')->nullable();
            $table->text('image_r2_key')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('answers', fn (Blueprint $table) => $table->dropColumn(['image_url', 'image_r2_key']));
        Schema::table('questions', fn (Blueprint $table) => $table->dropColumn(['image_url', 'image_r2_key']));
        Schema::table('quizzes', fn (Blueprint $table) => $table->dropColumn(['thumbnail_url', 'thumbnail_r2_key']));
    }
};
