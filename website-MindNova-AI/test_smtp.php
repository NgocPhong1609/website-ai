<?php

require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

try {
    Illuminate\Support\Facades\Mail::raw('Test SMTP', function($msg) {
        $msg->to('phammtuan2k6@gmail.com')->subject('Test SMTP MindNova');
    });
    echo "SUCCESS: Email sent successfully.\n";
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
