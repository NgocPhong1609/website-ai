<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('draft_revisions')) {
            Schema::create('draft_revisions', function (Blueprint $table) {
                $table->id();
                $table->string('revisionable_type');
                $table->unsignedBigInteger('revisionable_id');
                $table->unsignedInteger('revision_number');
                $table->json('snapshot_data');
                $table->char('content_hash', 64);
                $table->char('idempotency_key', 64)->nullable()->unique();
                $table->string('reason', 32)->default('autosave');
                $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
                $table->foreignId('parent_revision_id')->nullable()->constrained('draft_revisions')->nullOnDelete();
                $table->timestamps();

                $table->unique(['revisionable_type', 'revisionable_id', 'revision_number'], 'draft_revisions_entity_number_unique');
                $table->index(['revisionable_type', 'revisionable_id', 'created_at'], 'draft_revisions_entity_created_index');
                $table->index(['revisionable_type', 'revisionable_id', 'content_hash'], 'draft_revisions_entity_hash_index');
            });
        }

        foreach (['courses', 'lessons'] as $tableName) {
            if (Schema::hasTable($tableName) && ! Schema::hasColumn($tableName, 'lock_version')) {
                Schema::table($tableName, function (Blueprint $table) {
                    $table->unsignedInteger('lock_version')->default(1);
                });
            }
        }

        if (Schema::hasTable('lesson_media')) {
            Schema::table('lesson_media', function (Blueprint $table) {
                if (! Schema::hasColumn('lesson_media', 'uploaded_by')) {
                    $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
                }
                if (! Schema::hasColumn('lesson_media', 'upload_id')) {
                    $table->string('upload_id')->nullable()->unique();
                }
                if (! Schema::hasColumn('lesson_media', 'idempotency_key')) {
                    $table->char('idempotency_key', 64)->nullable()->unique();
                }
                if (! Schema::hasColumn('lesson_media', 'attempts')) {
                    $table->unsignedSmallInteger('attempts')->default(0);
                }
                if (! Schema::hasColumn('lesson_media', 'last_error')) {
                    $table->text('last_error')->nullable();
                }
                if (! Schema::hasColumn('lesson_media', 'processing_started_at')) {
                    $table->timestamp('processing_started_at')->nullable();
                }
                if (! Schema::hasColumn('lesson_media', 'ready_at')) {
                    $table->timestamp('ready_at')->nullable();
                }
                if (! Schema::hasColumn('lesson_media', 'expires_at')) {
                    $table->timestamp('expires_at')->nullable()->index();
                }
            });
        }

        if (Schema::hasTable('content_audit_logs')) {
            Schema::table('content_audit_logs', function (Blueprint $table) {
                if (! Schema::hasColumn('content_audit_logs', 'course_id')) {
                    $table->foreignId('course_id')->nullable()->constrained('courses')->nullOnDelete()->index();
                }
                if (! Schema::hasColumn('content_audit_logs', 'correlation_id')) {
                    $table->uuid('correlation_id')->nullable()->index();
                }
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('content_audit_logs')) {
            Schema::table('content_audit_logs', function (Blueprint $table) {
                if (Schema::hasColumn('content_audit_logs', 'course_id')) {
                    $table->dropConstrainedForeignId('course_id');
                }
                if (Schema::hasColumn('content_audit_logs', 'correlation_id')) {
                    $table->dropColumn('correlation_id');
                }
            });
        }

        if (Schema::hasTable('lesson_media')) {
            Schema::table('lesson_media', function (Blueprint $table) {
                if (Schema::hasColumn('lesson_media', 'uploaded_by')) {
                    $table->dropConstrainedForeignId('uploaded_by');
                }
                foreach (['upload_id', 'idempotency_key', 'attempts', 'last_error', 'processing_started_at', 'ready_at', 'expires_at'] as $column) {
                    if (Schema::hasColumn('lesson_media', $column)) {
                        $table->dropColumn($column);
                    }
                }
            });
        }

        foreach (['courses', 'lessons'] as $tableName) {
            if (Schema::hasTable($tableName) && Schema::hasColumn($tableName, 'lock_version')) {
                Schema::table($tableName, function (Blueprint $table) {
                    $table->dropColumn('lock_version');
                });
            }
        }

        Schema::dropIfExists('draft_revisions');
    }
};
