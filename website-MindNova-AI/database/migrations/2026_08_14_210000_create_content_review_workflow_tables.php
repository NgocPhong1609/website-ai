<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // ============================================================
        // 1. CREATE NEW TABLES
        // ============================================================

        // 1a. content_versions — central versioning for courses & lessons
        Schema::create('content_versions', function (Blueprint $table) {
            $table->id();
            $table->string('versionable_type'); // App\Models\Course or App\Models\Lesson
            $table->unsignedBigInteger('versionable_id');
            $table->unsignedInteger('version_number')->default(1);
            $table->json('snapshot_data'); // frozen snapshot of entity
            $table->enum('status', [
                'draft', 'pending_review', 'under_review',
                'approved', 'rejected', 'needs_fixes', 'published',
            ])->default('draft');
            $table->boolean('is_published')->default(false);
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();

            $table->index(['versionable_type', 'versionable_id', 'is_published'], 'cv_published_idx');
            $table->index(['versionable_type', 'versionable_id', 'version_number'], 'cv_version_idx');
            $table->foreign('created_by')->references('id')->on('users')->nullOnDelete();
        });

        // 1b. review_submissions — each submission for admin review
        Schema::create('review_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
            $table->unsignedBigInteger('course_version_id');
            $table->foreignId('submitted_by')->constrained('users')->cascadeOnDelete();
            $table->timestamp('submitted_at');
            $table->enum('status', [
                'pending', 'under_review', 'approved', 'rejected', 'needs_fixes',
            ])->default('pending');
            $table->unsignedBigInteger('reviewed_by')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->text('review_feedback')->nullable();
            $table->timestamp('stale_at')->nullable();
            $table->json('metadata')->nullable(); // summary of changes
            $table->timestamps();

            $table->foreign('course_version_id')->references('id')->on('content_versions')->cascadeOnDelete();
            $table->foreign('reviewed_by')->references('id')->on('users')->nullOnDelete();
            $table->index(['course_id', 'status']);
            $table->index(['status', 'submitted_at']);
        });

        // 1c. review_submission_items — links lesson versions to a submission
        Schema::create('review_submission_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('submission_id')->constrained('review_submissions')->cascadeOnDelete();
            $table->foreignId('lesson_id')->constrained('lessons')->cascadeOnDelete();
            $table->unsignedBigInteger('lesson_version_id');
            $table->enum('change_type', ['new', 'modified', 'deleted', 'reordered'])->default('new');
            $table->timestamps();

            $table->foreign('lesson_version_id')->references('id')->on('content_versions')->cascadeOnDelete();
            $table->index('submission_id');
        });

        // 1d. review_comments — admin comments on submissions
        Schema::create('review_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('submission_id')->constrained('review_submissions')->cascadeOnDelete();
            $table->string('commentable_type')->nullable(); // polymorphic
            $table->unsignedBigInteger('commentable_id')->nullable();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->text('content');
            $table->timestamps();
        });

        // 1e. content_audit_logs — detailed audit trail
        Schema::create('content_audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('user_role', 50);
            $table->string('action', 100); // COURSE_CREATED, LESSON_SUBMITTED, etc.
            $table->string('entity_type', 100); // Course, Lesson, ReviewSubmission
            $table->unsignedBigInteger('entity_id');
            $table->string('old_status', 50)->nullable();
            $table->string('new_status', 50)->nullable();
            $table->unsignedInteger('version_number')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['entity_type', 'entity_id']);
            $table->index('action');
            $table->index('user_id');
        });

        // 1f. deletion_requests — requests to delete published lessons
        Schema::create('deletion_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lesson_id')->constrained('lessons')->cascadeOnDelete();
            $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
            $table->foreignId('requested_by')->constrained('users')->cascadeOnDelete();
            $table->timestamp('requested_at');
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->unsignedBigInteger('reviewed_by')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->text('reason')->nullable();
            $table->timestamps();

            $table->foreign('reviewed_by')->references('id')->on('users')->nullOnDelete();
        });

        // ============================================================
        // 2. MODIFY EXISTING TABLES
        // ============================================================

        // 2a. Modify courses — change status enum, add versioning columns
        // Since SQLite doesn't support ALTER COLUMN for enums, we use a
        // raw SQL approach for MySQL (which is the production DB).
        // For safety, we add columns first, then alter the enum.
        Schema::table('courses', function (Blueprint $table) {
            if (!Schema::hasColumn('courses', 'published_version_id')) {
                $table->unsignedBigInteger('published_version_id')->nullable()->after('status');
            }
            if (!Schema::hasColumn('courses', 'current_version')) {
                $table->unsignedInteger('current_version')->default(1)->after('published_version_id');
            }
        });

        // Expand the courses.status enum
        // We need to handle this carefully for MySQL
        try {
            DB::statement("ALTER TABLE courses MODIFY COLUMN status ENUM('draft','pending_review','under_review','approved','needs_fixes','rejected','published','archived') DEFAULT 'draft'");
        } catch (\Exception $e) {
            // If it fails (e.g., SQLite), we'll handle it differently
            // SQLite doesn't support MODIFY COLUMN, but the string column should work
        }

        // Add foreign key for published_version_id
        try {
            Schema::table('courses', function (Blueprint $table) {
                $table->foreign('published_version_id')->references('id')->on('content_versions')->nullOnDelete();
            });
        } catch (\Exception $e) {
            // FK may already exist or DB doesn't support it
        }

        // 2b. Modify lessons — change status enum, add versioning columns
        Schema::table('lessons', function (Blueprint $table) {
            if (!Schema::hasColumn('lessons', 'published_version_id')) {
                $table->unsignedBigInteger('published_version_id')->nullable()->after('status');
            }
            if (!Schema::hasColumn('lessons', 'current_version')) {
                $table->unsignedInteger('current_version')->default(1)->after('published_version_id');
            }
        });

        // Expand lessons.status enum
        try {
            DB::statement("ALTER TABLE lessons MODIFY COLUMN status ENUM('draft','pending_review','under_review','approved','needs_fixes','rejected','published') DEFAULT 'draft'");
        } catch (\Exception $e) {
            // Handle SQLite
        }

        // Add foreign key for published_version_id
        try {
            Schema::table('lessons', function (Blueprint $table) {
                $table->foreign('published_version_id')->references('id')->on('content_versions')->nullOnDelete();
            });
        } catch (\Exception $e) {
            // FK may already exist
        }

        // 2c. Modify course_modules — add status column
        if (!Schema::hasColumn('course_modules', 'status')) {
            Schema::table('course_modules', function (Blueprint $table) {
                $table->enum('status', ['draft', 'published'])->default('draft')->after('order');
            });
        }

        // ============================================================
        // 3. MIGRATE EXISTING DATA
        // ============================================================
        $this->migrateExistingData();
    }

    /**
     * Migrate existing published content into the versioning system.
     * - Published courses/lessons get a ContentVersion with is_published = true
     * - Draft content gets current_version = 1 with no published version
     */
    private function migrateExistingData(): void
    {
        // Migrate published courses
        $publishedCourses = DB::table('courses')->where('status', 'published')->get();
        foreach ($publishedCourses as $course) {
            $snapshotData = json_encode([
                'title' => $course->title,
                'slug' => $course->slug,
                'description' => $course->description,
                'thumbnail' => $course->thumbnail,
                'price' => $course->price,
                'level' => $course->level,
                'category_id' => $course->category_id,
                'sale_price' => $course->sale_price ?? null,
                'sale_start_date' => $course->sale_start_date ?? null,
                'sale_end_date' => $course->sale_end_date ?? null,
                'is_flash_sale' => $course->is_flash_sale ?? false,
            ]);

            $versionId = DB::table('content_versions')->insertGetId([
                'versionable_type' => 'App\\Models\\Course',
                'versionable_id' => $course->id,
                'version_number' => 1,
                'snapshot_data' => $snapshotData,
                'status' => 'published',
                'is_published' => true,
                'created_by' => $course->teacher_id,
                'created_at' => $course->updated_at ?? now(),
                'updated_at' => $course->updated_at ?? now(),
            ]);

            DB::table('courses')->where('id', $course->id)->update([
                'published_version_id' => $versionId,
                'current_version' => 1,
            ]);
        }

        // Set current_version for draft courses
        DB::table('courses')
            ->whereNull('published_version_id')
            ->update(['current_version' => 1]);

        // Migrate published lessons
        $publishedLessons = DB::table('lessons')->where('status', 'published')->get();
        foreach ($publishedLessons as $lesson) {
            $snapshotData = json_encode([
                'title' => $lesson->title,
                'type' => $lesson->type ?? 'video',
                'content' => $lesson->content,
                'video_url' => $lesson->video_url,
                'duration_seconds' => $lesson->duration_seconds ?? 0,
                'order' => $lesson->order,
                'module_id' => $lesson->module_id,
                'course_id' => $lesson->course_id,
            ]);

            $versionId = DB::table('content_versions')->insertGetId([
                'versionable_type' => 'App\\Models\\Lesson',
                'versionable_id' => $lesson->id,
                'version_number' => 1,
                'snapshot_data' => $snapshotData,
                'status' => 'published',
                'is_published' => true,
                'created_by' => null, // No teacher_id on lessons directly
                'created_at' => $lesson->updated_at ?? now(),
                'updated_at' => $lesson->updated_at ?? now(),
            ]);

            DB::table('lessons')->where('id', $lesson->id)->update([
                'published_version_id' => $versionId,
                'current_version' => 1,
            ]);
        }

        // Set current_version for draft lessons
        DB::table('lessons')
            ->whereNull('published_version_id')
            ->update(['current_version' => 1]);

        // Set published modules' status
        $publishedCourseIds = DB::table('courses')->where('status', 'published')->pluck('id');
        if ($publishedCourseIds->isNotEmpty()) {
            DB::table('course_modules')
                ->whereIn('course_id', $publishedCourseIds)
                ->update(['status' => 'published']);
        }
    }

    public function down(): void
    {
        // Remove foreign keys first
        try {
            Schema::table('courses', function (Blueprint $table) {
                $table->dropForeign(['published_version_id']);
            });
        } catch (\Exception $e) {}

        try {
            Schema::table('lessons', function (Blueprint $table) {
                $table->dropForeign(['published_version_id']);
            });
        } catch (\Exception $e) {}

        // Drop new tables in reverse dependency order
        Schema::dropIfExists('review_comments');
        Schema::dropIfExists('review_submission_items');
        Schema::dropIfExists('review_submissions');
        Schema::dropIfExists('deletion_requests');
        Schema::dropIfExists('content_audit_logs');
        Schema::dropIfExists('content_versions');

        // Revert courses columns
        Schema::table('courses', function (Blueprint $table) {
            if (Schema::hasColumn('courses', 'published_version_id')) {
                $table->dropColumn('published_version_id');
            }
            if (Schema::hasColumn('courses', 'current_version')) {
                $table->dropColumn('current_version');
            }
        });

        // Revert status enum
        try {
            DB::statement("ALTER TABLE courses MODIFY COLUMN status ENUM('draft','published','archived') DEFAULT 'draft'");
        } catch (\Exception $e) {}

        // Revert lessons columns
        Schema::table('lessons', function (Blueprint $table) {
            if (Schema::hasColumn('lessons', 'published_version_id')) {
                $table->dropColumn('published_version_id');
            }
            if (Schema::hasColumn('lessons', 'current_version')) {
                $table->dropColumn('current_version');
            }
        });

        // Revert lessons status enum
        try {
            DB::statement("ALTER TABLE lessons MODIFY COLUMN status ENUM('draft','published') DEFAULT 'draft'");
        } catch (\Exception $e) {}

        // Remove course_modules status
        if (Schema::hasColumn('course_modules', 'status')) {
            Schema::table('course_modules', function (Blueprint $table) {
                $table->dropColumn('status');
            });
        }
    }
};
