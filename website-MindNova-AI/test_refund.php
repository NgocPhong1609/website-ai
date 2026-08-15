<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = App\Models\User::find(82);
if (!$user) {
    die("User not found\n");
}

$order = App\Models\Order::where('user_id', 82)->orderBy('id', 'desc')->first();
if (!$order) {
    die("Order not found\n");
}

echo "Found order: {$order->id} for course. Refunding...\n";

// Use the controller directly
$request = Illuminate\Http\Request::create("/api/dev/orders/{$order->id}/refund", 'POST');
$controller = app(App\Http\Controllers\Api\Student\OrderController::class);
$response = $controller->devRefundOrder($request, $order->id);

echo "Response:\n";
echo $response->getContent() . "\n";
