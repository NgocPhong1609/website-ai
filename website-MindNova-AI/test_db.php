<?php require 'vendor/autoload.php'; require_once 'bootstrap/app.php'; \->make('Illuminate\Contracts\Console\Kernel')->bootstrap(); print_r(DB::select('DESCRIBE courses'));
