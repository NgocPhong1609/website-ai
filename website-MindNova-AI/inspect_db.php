<?php
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

echo "DB: " . DB::connection()->getDatabaseName() . "\n";
echo "user_streaks columns: " . implode(', ', Schema::getColumnListing('user_streaks')) . "\n";
echo "role_user columns: " . implode(', ', Schema::getColumnListing('role_user')) . "\n";
echo "user_profiles columns: " . implode(', ', Schema::getColumnListing('user_profiles')) . "\n";
echo "roles: " . DB::table('roles')->count() . "\n";
foreach (DB::table('roles')->get() as $r) {
    echo "  id={$r->id} name={$r->name}\n";
}
echo "users: " . DB::table('users')->count() . "\n";