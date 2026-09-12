<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ai_usage_logs', function (Blueprint $table) {
            $table->string('request_id', 64)->nullable();
            $table->string('provider_request_id')->nullable();
            $table->string('status', 32)->nullable();
            $table->string('error_code', 100)->nullable();
            $table->unsignedInteger('duration_ms')->nullable();
            $table->boolean('fallback_used')->nullable();
            $table->string('token_source', 32)->nullable();
            $table->string('cost_source', 32)->nullable();
            $table->decimal('cost_amount', 12, 6)->nullable();
            $table->char('cost_currency', 3)->nullable();

            $table->index('request_id', 'ai_usage_logs_request_id_index');
            $table->index('provider_request_id', 'ai_usage_logs_provider_request_id_index');
            $table->index('status', 'ai_usage_logs_status_index');
            $table->index('token_source', 'ai_usage_logs_token_source_index');
            $table->index('cost_source', 'ai_usage_logs_cost_source_index');
            $table->index(
                ['created_at', 'provider', 'model'],
                'ai_usage_logs_created_provider_model_index'
            );
        });
    }

    public function down(): void
    {
        Schema::table('ai_usage_logs', function (Blueprint $table) {
            $table->dropIndex('ai_usage_logs_request_id_index');
            $table->dropIndex('ai_usage_logs_provider_request_id_index');
            $table->dropIndex('ai_usage_logs_status_index');
            $table->dropIndex('ai_usage_logs_token_source_index');
            $table->dropIndex('ai_usage_logs_cost_source_index');
            $table->dropIndex('ai_usage_logs_created_provider_model_index');

            $table->dropColumn([
                'request_id',
                'provider_request_id',
                'status',
                'error_code',
                'duration_ms',
                'fallback_used',
                'token_source',
                'cost_source',
                'cost_amount',
                'cost_currency',
            ]);
        });
    }
};
