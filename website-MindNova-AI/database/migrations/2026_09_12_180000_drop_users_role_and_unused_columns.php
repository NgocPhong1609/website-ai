<?php

use App\Models\Role;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('users') && Schema::hasColumn('users', 'role') && Schema::hasTable('roles') && Schema::hasTable('role_user')) {
            $users = DB::table('users')->select('id', 'role')->whereNotNull('role')->get();

            foreach ($users as $user) {
                $name = strtolower(trim((string) $user->role));
                if ($name === '') {
                    continue;
                }
                if (in_array($name, ['instructor', 'lecturer'], true)) {
                    $name = 'teacher';
                }

                $hasPivot = DB::table('role_user')->where('user_id', $user->id)->exists();
                if ($hasPivot) {
                    continue;
                }

                $roleId = Role::idFor($name);
                DB::table('role_user')->insert([
                    'user_id' => $user->id,
                    'role_id' => $roleId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('role');
            });
        }

        if (Schema::hasTable('users') && Schema::hasColumn('users', 'deleted_at')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('deleted_at');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('users') && ! Schema::hasColumn('users', 'role')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('role')->default('student')->after('password');
            });
        }

        if (Schema::hasTable('users') && ! Schema::hasColumn('users', 'deleted_at')) {
            Schema::table('users', function (Blueprint $table) {
                $table->timestamp('deleted_at')->nullable();
            });
        }
    }
};
