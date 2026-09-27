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

        $avatars = [
            'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150',
            'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
            'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150',
            'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
        ];

        for ($i = 0; $i < 10; $i++) {
            $email = $i === 0 ? 'admin@mindnova.ai' : "admin{$i}@mindnova.ai";
            $name = $i === 0 ? 'MindNova Admin' : "Admin {$i}";

            $user = User::where('email', $email)->first();

            if (! $user) {
                $user = User::create([
                    'name' => $name,
                    'email' => $email,
                    'password' => Hash::make('admin123'),
                    'status' => 'active',
                    'avatar_url' => $avatars[$i],
                    'is_locked' => 0,
                    'email_verified_at' => now(),
                ]);
            } else {
                $user->update([
                    'password' => Hash::make('admin123'),
                    'status' => 'active',
                    'avatar_url' => $avatars[$i],
                    'is_locked' => 0,
                ]);
            }

            $user->roles()->syncWithoutDetaching([$adminRole->id]);

            DB::table('user_profiles')->updateOrInsert(
                ['user_id' => $user->id],
                ['created_at' => now(), 'updated_at' => now()]
            );
            DB::table('user_streaks')->updateOrInsert(
                ['user_id' => $user->id],
                ['updated_at' => now()]
            );
        }

        $this->command?->info("10 Admin users ready");
    }
}