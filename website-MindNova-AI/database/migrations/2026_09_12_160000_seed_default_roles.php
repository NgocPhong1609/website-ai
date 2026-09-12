<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('roles')) {
            return;
        }

        $now = now();
        $roles = [
            ['name' => 'admin', 'display_name' => 'Quản trị viên', 'description' => 'Quản trị toàn quyền hệ thống'],
            ['name' => 'teacher', 'display_name' => 'Giáo viên', 'description' => 'Người tạo, quản lý khóa học và xem tiến độ học sinh'],
            ['name' => 'student', 'display_name' => 'Học sinh', 'description' => 'Người tham gia học tập và làm quiz'],
        ];

        $hasDisplayName = Schema::hasColumn('roles', 'display_name');

        foreach ($roles as $role) {
            $exists = DB::table('roles')->where('name', $role['name'])->exists();
            if ($exists) {
                continue;
            }

            $row = [
                'name' => $role['name'],
                'description' => $role['description'],
                'created_at' => $now,
                'updated_at' => $now,
            ];
            if ($hasDisplayName) {
                $row['display_name'] = $role['display_name'];
            }

            DB::table('roles')->insert($row);
        }
    }

    public function down(): void
    {
        // Keep roles; other rows may already reference them.
    }
};
