<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$adminRole = App\Models\Role::firstOrCreate(['name' => 'admin']);
$admin = App\Models\User::firstOrCreate(
    ['email' => 'admin@mindnova.ai'],
    ['name' => 'Admin User', 'password' => bcrypt('password'), 'status' => 'active', 'email_verified_at' => now()]
);
$admin->roles()->syncWithoutDetaching([$adminRole->id]);

echo "Admin account created successfully: admin@mindnova.ai / password\n";
