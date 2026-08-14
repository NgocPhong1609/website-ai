<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Course;
use App\Http\Controllers\Api\Student\OrderController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class MockRealPurchases extends Command
{
    protected $signature = 'mock:purchases';
    protected $description = 'Mock real purchases via OrderController for 10 students';

    public function handle()
    {
        $names = [
            'Phạm Minh Tuấn', 'Võ Nguyễn Kiều Linh', 'Trần Hoàng Khoa',
            'Lê Thanh Sơn', 'Nguyễn Thị Thu Hương', 'Đặng Ngọc Ánh',
            'Bùi Chí Bảo', 'Hoàng Xuân Vinh', 'Ngô Quốc Đạt', 'Vũ Hải Yến'
        ];

        $courses = Course::where('status', 'published')->get();

        if ($courses->count() < 2) {
            $this->error('Not enough published courses to purchase (need at least 2).');
            return;
        }

        $orderController = app(OrderController::class);

        foreach ($names as $index => $name) {
            $email = 'student_mock_' . $index . '@mindnova.com';
            
            $user = User::firstOrCreate(
                ['email' => $email],
                [
                    'name' => $name,
                    'password' => Hash::make('password123'),
                    'role' => 'student',
                    'email_verified_at' => now(),
                ]
            );

            // Pick 2 random courses
            $randomCourses = $courses->random(2);
            $courseIds = $randomCourses->pluck('id')->toArray();

            $this->info("User {$name} is purchasing courses: " . implode(', ', $courseIds));

            // 1. Create order
            $storeRequest = Request::create('/api/orders', 'POST', [
                'course_ids' => $courseIds,
                'payment_method' => 'vnpay' // Or any payment method
            ]);
            $storeRequest->setUserResolver(function () use ($user) {
                return $user;
            });

            $response = $orderController->store($storeRequest);
            $orderData = json_decode($response->getContent());

            if (!isset($orderData->data->id)) {
                $this->error("Failed to create order for {$name}: " . $response->getContent());
                continue;
            }

            $orderId = $orderData->data->id;
            $this->info("Created Order ID: {$orderId} with transaction: " . $orderData->data->transaction_id);

            // 2. Complete order via dev endpoint
            $completeRequest = Request::create("/api/dev/orders/{$orderId}/complete", 'POST');
            
            $completeResponse = $orderController->devCompleteOrder($completeRequest, $orderId);
            $completeData = json_decode($completeResponse->getContent());

            if (isset($completeData->success) && $completeData->success) {
                $this->info("Completed Order ID: {$orderId} successfully!\n");
            } else {
                $this->error("Failed to complete order for {$name}: " . $completeResponse->getContent() . "\n");
            }
        }

        $this->info("Successfully mocked purchases for 10 students.");
    }
}
