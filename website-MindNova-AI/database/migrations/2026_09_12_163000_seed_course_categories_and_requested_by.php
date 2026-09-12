<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('categories')) {
            return;
        }

        if (! Schema::hasColumn('categories', 'requested_by')) {
            Schema::table('categories', function (Blueprint $table) {
                $table->foreignId('requested_by')->nullable()->after('status')->constrained('users')->nullOnDelete();
            });
        }

        $now = now();
        $official = [
            'Lập trình & Công nghệ',
            'Trí tuệ nhân tạo',
            'Khoa học dữ liệu',
            'Thiết kế UI/UX',
            'Marketing số',
            'Kinh doanh',
            'Ngoại ngữ',
            'Toán học',
        ];

        foreach ($official as $name) {
            $slug = Str::slug($name);
            $exists = DB::table('categories')
                ->where(function ($q) use ($slug, $name) {
                    $q->where('slug', $slug)->orWhere('name', $name);
                })
                ->exists();
            if ($exists) {
                DB::table('categories')
                    ->where(function ($q) use ($slug, $name) {
                        $q->where('slug', $slug)->orWhere('name', $name);
                    })
                    ->update(['status' => 'active']);
                continue;
            }

            $row = [
                'name' => $name,
                'slug' => $slug,
                'description' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ];
            if (Schema::hasColumn('categories', 'status')) {
                $row['status'] = 'active';
            }

            DB::table('categories')->insert($row);
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('categories') && Schema::hasColumn('categories', 'requested_by')) {
            Schema::table('categories', function (Blueprint $table) {
                $table->dropConstrainedForeignId('requested_by');
            });
        }
    }
};
