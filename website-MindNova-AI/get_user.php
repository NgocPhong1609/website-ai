<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$u = App\Models\User::find(82);
if ($u) {
    $u->password = Illuminate\Support\Facades\Hash::make('password123');
    $u->save();
    echo 'EMAIL:' . $u->email;
} else {
    echo 'USER_NOT_FOUND';
}
