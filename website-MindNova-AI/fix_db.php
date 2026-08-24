<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

DB::statement("ALTER TABLE orders MODIFY COLUMN payment_method ENUM('vnpay', 'momo', 'banking', 'free') NOT NULL");
echo "DB Updated\n";
