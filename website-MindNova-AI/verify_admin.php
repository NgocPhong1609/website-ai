<?php
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\DB;

$u = User::where('email', 'admin@mindnova.ai')->first();
if (! $u) {
    echo "User NOT FOUND\n";
    exit(1);
}
echo "User: " . $u->name . " (id=" . $u->id . ")\n";
echo "Roles: " . $u->roles->pluck('name')->implode(', ') . "\n";
echo "isAdmin: " . ($u->isAdmin() ? 'YES' : 'NO') . "\n";
echo "isLocked: " . ($u->is_locked ? 'YES' : 'NO') . "\n";
echo "status: " . $u->status . "\n";
echo "role_user rows for this user: " . DB::table('role_user')->where('user_id', $u->id)->count() . "\n";