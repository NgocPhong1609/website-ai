<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$u = App\Models\User::where('email', 'tuans@gmail.com')->first();
if ($u) {
    $u->password = Illuminate\Support\Facades\Hash::make('password123');
    $u->save();
    echo "Instructor password reset to password123\n";
} else {
    echo "Instructor not found\n";
}
