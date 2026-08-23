<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Add is_verified to users if missing
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'is_verified')) {
                $table->boolean('is_verified')->default(false)->after('teacher_verification_note')->index();
            }
        });

        // 2. Teacher certificates table
        if (!Schema::hasTable('teacher_certificates')) {
            Schema::create('teacher_certificates', function (Blueprint $table) {
                $table->id();
                $table->foreignId('teacher_id')->constrained('users')->onDelete('cascade');
                $table->string('certificate_name');
                $table->string('issuing_organization')->nullable();
                $table->string('certificate_number')->nullable();
                $table->string('specialization')->nullable();
                $table->date('issue_date')->nullable();
                $table->date('expiry_date')->nullable();
                $table->text('description')->nullable();
                $table->string('certificate_image')->nullable();
                $table->string('verification_url')->nullable();
                $table->string('verification_status')->default('pending');
                $table->text('verification_note')->nullable();
                $table->timestamp('verified_at')->nullable();
                $table->foreignId('verified_by')->nullable()->constrained('users')->onDelete('set null');
                $table->boolean('is_public')->default(true);
                $table->timestamps();

                $table->index(['teacher_id', 'verification_status']);
            });
        }

        // 3. Teacher certificate evidences (private proof for admin)
        if (!Schema::hasTable('teacher_certificate_evidences')) {
            Schema::create('teacher_certificate_evidences', function (Blueprint $table) {
                $table->id();
                $table->foreignId('certificate_id')->constrained('teacher_certificates')->onDelete('cascade');
                $table->string('evidence_path');
                $table->string('evidence_type')->default('document');
                $table->string('original_name')->nullable();
                $table->unsignedBigInteger('file_size')->nullable();
                $table->string('mime_type')->nullable();
                $table->timestamps();
            });
        }

        // 4. Teacher verification requests
        if (!Schema::hasTable('teacher_verifications')) {
            Schema::create('teacher_verifications', function (Blueprint $table) {
                $table->id();
                $table->foreignId('teacher_id')->constrained('users')->onDelete('cascade');
                $table->string('status')->default('pending');
                $table->timestamp('submitted_at')->useCurrent();
                $table->timestamp('reviewed_at')->nullable();
                $table->foreignId('reviewed_by')->nullable()->constrained('users')->onDelete('set null');
                $table->text('rejection_reason')->nullable();
                $table->text('admin_note')->nullable();
                $table->timestamp('verified_at')->nullable();
                $table->timestamp('revoked_at')->nullable();
                $table->timestamps();

                $table->index(['teacher_id', 'status']);
            });
        }

        // 5. Teacher verification audit logs
        if (!Schema::hasTable('teacher_verification_logs')) {
            Schema::create('teacher_verification_logs', function (Blueprint $table) {
                $table->id();
                $table->foreignId('teacher_id')->constrained('users')->onDelete('cascade');
                $table->foreignId('admin_id')->nullable()->constrained('users')->onDelete('set null');
                $table->foreignId('certificate_id')->nullable()->constrained('teacher_certificates')->onDelete('cascade');
                $table->string('action');
                $table->string('old_status')->nullable();
                $table->string('new_status')->nullable();
                $table->text('reason')->nullable();
                $table->json('metadata')->nullable();
                $table->timestamps();

                $table->index(['teacher_id', 'created_at']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('teacher_verification_logs');
        Schema::dropIfExists('teacher_verifications');
        Schema::dropIfExists('teacher_certificate_evidences');
        Schema::dropIfExists('teacher_certificates');

        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'is_verified')) {
                $table->dropColumn('is_verified');
            }
        });
    }
};
