<?php

use App\Models\Category;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use App\Services\PaymentService;
use App\Services\VNPayService;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Notification;

function gatewayCoursePair(): array
{
    $teacher = User::factory()->create(['role' => 'teacher', 'email_verified_at' => now()]);
    $student = User::factory()->create(['role' => 'student', 'email_verified_at' => now()]);
    $category = Category::create([
        'name' => 'Payment Test',
        'slug' => 'payment-test-'.uniqid(),
    ]);
    $course = Course::create([
        'teacher_id' => $teacher->id,
        'category_id' => $category->id,
        'title' => 'Khóa học thanh toán',
        'slug' => 'khoa-hoc-thanh-toan-'.uniqid(),
        'description' => 'Demo',
        'price' => 150000,
        'level' => 'beginner',
        'status' => 'published',
    ]);

    return [$student, $course];
}

function pendingOrderFor(User $student, Course $course, string $method = 'vnpay'): Order
{
    $order = Order::create([
        'user_id' => $student->id,
        'total_amount' => $course->price,
        'payment_method' => $method,
        'status' => 'pending',
        'transaction_id' => 'ORD-TEST'.strtoupper(bin2hex(random_bytes(3))),
    ]);
    OrderItem::create([
        'order_id' => $order->id,
        'course_id' => $course->id,
        'price' => $course->price,
    ]);

    return $order;
}

test('vnpay ipn with official signature completes pending order once', function () {
    Notification::fake();
    config(['services.vnpay.hash_secret' => 'test-vnpay-secret']);
    [$student, $course] = gatewayCoursePair();
    $order = pendingOrderFor($student, $course);

    $payload = [
        'vnp_TxnRef' => $order->transaction_id,
        'vnp_Amount' => (int) $order->total_amount * 100,
        'vnp_ResponseCode' => '00',
        'vnp_TransactionNo' => 'VNP999',
    ];
    $payload['vnp_SecureHash'] = app(VNPayService::class)->secureHash($payload);

    $this->getJson('/api/student/payment/vnpay-ipn?'.http_build_query($payload))
        ->assertOk()
        ->assertJsonPath('RspCode', '00');

    expect($order->fresh()->status)->toBe('completed');
    expect(Enrollment::where('user_id', $student->id)->where('course_id', $course->id)->count())->toBe(1);

    $this->getJson('/api/student/payment/vnpay-ipn?'.http_build_query($payload))
        ->assertOk()
        ->assertJsonPath('RspCode', '02');

    expect(Enrollment::where('user_id', $student->id)->where('course_id', $course->id)->count())->toBe(1);
});

test('vnpay ipn rejects invalid signature and does not complete order', function () {
    config(['services.vnpay.hash_secret' => 'test-vnpay-secret']);
    [$student, $course] = gatewayCoursePair();
    $order = pendingOrderFor($student, $course);

    $payload = [
        'vnp_TxnRef' => $order->transaction_id,
        'vnp_Amount' => (int) $order->total_amount * 100,
        'vnp_ResponseCode' => '00',
        'vnp_SecureHash' => 'deadbeef',
    ];

    $this->getJson('/api/student/payment/vnpay-ipn?'.http_build_query($payload))
        ->assertOk()
        ->assertJsonPath('RspCode', '97');

    expect($order->fresh()->status)->toBe('pending');
    expect(Enrollment::where('user_id', $student->id)->exists())->toBeFalse();
});

test('vnpay ipn rejects amount mismatch', function () {
    config(['services.vnpay.hash_secret' => 'test-vnpay-secret']);
    [$student, $course] = gatewayCoursePair();
    $order = pendingOrderFor($student, $course);

    $payload = [
        'vnp_TxnRef' => $order->transaction_id,
        'vnp_Amount' => 100,
        'vnp_ResponseCode' => '00',
    ];
    $payload['vnp_SecureHash'] = app(VNPayService::class)->secureHash($payload);

    $this->getJson('/api/student/payment/vnpay-ipn?'.http_build_query($payload))
        ->assertOk()
        ->assertJsonPath('RspCode', '04');

    expect($order->fresh()->status)->toBe('pending');
});

test('momo ipn with official signature completes pending order', function () {
    Notification::fake();
    config([
        'services.momo.partner_code' => 'MOMO',
        'services.momo.access_key' => 'access',
        'services.momo.secret_key' => 'secret',
    ]);
    [$student, $course] = gatewayCoursePair();
    $order = pendingOrderFor($student, $course, 'momo');

    $payload = [
        'partnerCode' => 'MOMO',
        'orderId' => $order->transaction_id,
        'requestId' => 'req-1',
        'amount' => (string) (int) $order->total_amount,
        'orderInfo' => 'Thanh toan',
        'orderType' => 'momo_wallet',
        'transId' => '123',
        'resultCode' => 0,
        'message' => 'Success',
        'payType' => 'qr',
        'responseTime' => '1',
        'extraData' => '',
    ];
    $accessKey = 'access';
    $rawHash = "accessKey={$accessKey}&amount={$payload['amount']}&extraData={$payload['extraData']}&message={$payload['message']}&orderId={$payload['orderId']}&orderInfo={$payload['orderInfo']}&orderType={$payload['orderType']}&partnerCode={$payload['partnerCode']}&payType={$payload['payType']}&requestId={$payload['requestId']}&responseTime={$payload['responseTime']}&resultCode={$payload['resultCode']}&transId={$payload['transId']}";
    $payload['signature'] = hash_hmac('sha256', $rawHash, 'secret');

    $this->postJson('/api/student/payment/momo-ipn', $payload)
        ->assertOk()
        ->assertJsonPath('message', 'Success');

    expect($order->fresh()->status)->toBe('completed');
    expect(Enrollment::where('user_id', $student->id)->where('course_id', $course->id)->exists())->toBeTrue();
});

test('checkout creates signed vnpay url and does not treat missing url as success', function () {
    config([
        'services.vnpay.tmn_code' => 'TMNCODE',
        'services.vnpay.hash_secret' => 'test-vnpay-secret',
        'services.vnpay.endpoint' => 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
        'services.frontend_url' => 'http://localhost:3000',
    ]);
    [$student, $course] = gatewayCoursePair();

    $response = $this->actingAs($student, 'sanctum')->postJson('/api/orders', [
        'course_ids' => [$course->id],
        'payment_method' => 'vnpay',
    ]);

    $response->assertCreated()
        ->assertJsonPath('success', true);
    expect($response->json('payment_url'))->toStartWith('https://sandbox.vnpayment.vn/paymentv2/vpcpay.html');
    expect($response->json('payment_url'))->toContain('vnp_SecureHash=');
    expect($response->json('data.status'))->toBe('pending');
});

test('momo checkout uses sandbox create endpoint and returns payUrl', function () {
    config([
        'services.momo.partner_code' => 'MOMO',
        'services.momo.access_key' => 'access',
        'services.momo.secret_key' => 'secret',
        'services.momo.endpoint' => 'https://test-payment.momo.vn/v2/gateway/api/create',
        'services.frontend_url' => 'http://localhost:3000',
    ]);
    Http::fake([
        'https://test-payment.momo.vn/*' => Http::response(['payUrl' => 'https://test-payment.momo.vn/pay/abc'], 200),
    ]);
    [$student, $course] = gatewayCoursePair();

    $response = $this->actingAs($student, 'sanctum')->postJson('/api/orders', [
        'course_ids' => [$course->id],
        'payment_method' => 'momo',
    ]);

    $response->assertCreated()->assertJsonPath('payment_url', 'https://test-payment.momo.vn/pay/abc');
    Http::assertSent(fn ($request) => str_contains($request->url(), 'test-payment.momo.vn'));
});

test('banking checkout is rejected and payment method store no longer saves accounts', function () {
    [$student, $course] = gatewayCoursePair();

    $this->actingAs($student, 'sanctum')->postJson('/api/orders', [
        'course_ids' => [$course->id],
        'payment_method' => 'banking',
    ])->assertStatus(422);

    $this->actingAs($student, 'sanctum')->postJson('/api/student/payment-methods', [
        'provider' => 'banking',
        'holder_name' => 'NGUYEN VAN A',
        'account_number' => '1234567890',
        'bank_name' => 'Vietcombank',
    ])->assertStatus(422);
});

test('vnpay return callback without matching order does not enroll a random user', function () {
    User::factory()->create(['role' => 'student', 'email_verified_at' => now()]);
    config(['services.vnpay.hash_secret' => 'test-vnpay-secret']);

    $callback = [
        'vnp_TxnRef' => 'ORD-UNKNOWN',
        'vnp_Amount' => 15000000,
        'vnp_ResponseCode' => '00',
    ];
    $callback['vnp_SecureHash'] = app(VNPayService::class)->secureHash($callback);

    $result = app(PaymentService::class)->processCallback('vnpay', $callback);

    expect($result)->toBeNull();
    expect(Enrollment::count())->toBe(0);
});

test('retry payment issues a new transaction id for a pending order', function () {
    config([
        'services.vnpay.tmn_code' => 'TMNCODE',
        'services.vnpay.hash_secret' => 'test-vnpay-secret',
        'services.frontend_url' => 'http://localhost:3000',
    ]);
    [$student, $course] = gatewayCoursePair();
    $order = pendingOrderFor($student, $course);
    $oldTxn = $order->transaction_id;

    $response = $this->actingAs($student, 'sanctum')->postJson("/api/student/orders/{$order->id}/pay", [
        'payment_method' => 'vnpay',
    ]);

    $response->assertOk()->assertJsonPath('success', true);
    expect($order->fresh()->transaction_id)->not->toBe($oldTxn);
    expect($response->json('payment_url'))->toContain('vnp_SecureHash=');
});
