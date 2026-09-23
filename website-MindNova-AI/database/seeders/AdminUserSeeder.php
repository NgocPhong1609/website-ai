<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class AdminUserSeeder extends \Illuminate\Database\Seeder
{
    /**
     * Tạo tài khoản admin nếu chưa tồn tại.
     * An toàn để chạy nhiều lần (idempotent).
     */
    public function run(): void
    {
        // Đảm bảo role admin tồn tại
        $adminRole = Role::firstOrCreate(
            ['name' => 'admin'],
            ['display_name' => 'Quản trị viên', 'description' => 'Quản trị toàn quyền hệ thống']
        );

        $email = 'admin@mindnova.ai';
        $user = User::where('email', $email)->first();

        if (! $user) {
            $user = User::create([
                'name' => 'MindNova Admin',
                'email' => $email,
                'password' => Hash::make('admin123'),
                'status' => 'active',
                'is_locked' => 0,
                'email_verified_at' => now(),
            ]);
        } else {
            // Cập nhật lại mật khẩu và trạng thái để chắc chắn login được
            $user->update([
                'password' => Hash::make('admin123'),
                'status' => 'active',
                'is_locked' => 0,
            ]);
        }

        // Gắn role admin (sync để không mất role khác nếu có)
        $user->roles()->syncWithoutDetaching([$adminRole->id]);

        // Đảm bảo có profile và streak (đề phòng migrate chưa seed)
        DB::table('user_profiles')->updateOrInsert(
            ['user_id' => $user->id],
            ['created_at' => now(), 'updated_at' => now()]
        );
        DB::table('user_streaks')->updateOrInsert(
            ['user_id' => $user->id],
            ['updated_at' => now()]
        );

        $this->command?->info("Admin user ready: {$email} / admin123 (role admin id={$adminRole->id})");
    }
}