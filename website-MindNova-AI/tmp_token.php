<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$user = App\Models\User::where('role', 'admin')->orWhereHas('roles', fn($q) => $q->where('name', 'admin'))->first();
if ($user) {
    echo $user->createToken('test')->plainTextToken;
} else {
    echo "No admin found";
}
