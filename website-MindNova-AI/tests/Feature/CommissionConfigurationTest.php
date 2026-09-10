<?php

use App\Models\Course;
use App\Models\InstructorTransaction;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\RevenueAllocation;
use App\Models\TeacherPayout;
use App\Models\User;
use App\Services\CommissionService;
use App\Services\Instructor\InstructorPayoutService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

function commissionUser(string $role, string $email): User
{
    return User::factory()->create([
        'role' => $role,
        'email' => $email,
        'email_verified_at' => now(),
    ]);
}

function commissionOrder(User $teacher, User $student, string $tier = 'standard', float $price = 100000): array
{
    $course = Course::create([
        'teacher_id' => $teacher->id,
        'title' => 'Commission course '.uniqid(),
        'slug' => 'commission-course-'.uniqid(),
        'description' => 'Commission snapshot test',
        'price' => $price,
        'level' => 'beginner',
        'status' => 'published',
        'partnership_tier' => $tier,
    ]);

    $order = Order::create([
        'user_id' => $student->id,
        'total_amount' => $price,
        'payment_method' => 'vnpay',
        'status' => 'completed',
        'transaction_id' => 'COMMISSION-'.uniqid(),
    ]);

    $item = OrderItem::create([
        'order_id' => $order->id,
        'course_id' => $course->id,
        'price' => $price,
    ]);

    return [$course, $order, $item];
}

test('authenticated instructors receive the canonical default commission tiers', function () {
    $teacher = commissionUser('teacher', 'tier-reader@example.com');

    $this->actingAs($teacher, 'sanctum')
        ->getJson('/api/instructor/commission-tiers')
        ->assertOk()
        ->assertJson([
            'data' => [
                [
                    'tier' => 'standard',
                    'label' => 'Đối Tác Tiêu Chuẩn',
                    'platform_commission_percent' => 30.0,
                    'instructor_percent' => 70.0,
                ],
                [
                    'tier' => 'exclusive',
                    'label' => 'Hợp Tác Độc Quyền MindNova',
                    'platform_commission_percent' => 15.0,
                    'instructor_percent' => 85.0,
                ],
            ],
        ]);
});

test('commission quotes use one tier definition and always allocate the full gross amount', function () {
    $quote = app(CommissionService::class)->quote('exclusive', 99999);

    expect($quote)->toBe([
        'tier' => 'exclusive',
        'gross_amount' => 99999.0,
        'platform_commission_percent' => 15.0,
        'platform_amount' => 14999.85,
        'instructor_percent' => 85.0,
        'instructor_amount' => 84999.15,
    ])->and($quote['platform_commission_percent'] + $quote['instructor_percent'])->toBe(100.0)
        ->and($quote['platform_amount'] + $quote['instructor_amount'])->toBe(99999.0);
});

test('only admins can update validated commission tiers', function () {
    $admin = commissionUser('admin', 'commission-admin@example.com');
    $teacher = commissionUser('teacher', 'commission-teacher@example.com');
    $payload = [
        'tiers' => [
            ['tier' => 'standard', 'platform_commission_percent' => 25],
            ['tier' => 'exclusive', 'platform_commission_percent' => 12.5],
        ],
    ];

    $this->actingAs($teacher, 'sanctum')
        ->putJson('/api/admin/revenue/commission-tiers', $payload)
        ->assertForbidden();

    $this->actingAs($admin, 'sanctum')
        ->putJson('/api/admin/revenue/commission-tiers', $payload)
        ->assertOk()
        ->assertJsonPath('data.0.platform_commission_percent', 25)
        ->assertJsonPath('data.0.instructor_percent', 75)
        ->assertJsonPath('data.1.platform_commission_percent', 12.5)
        ->assertJsonPath('data.1.instructor_percent', 87.5);

    $this->actingAs($admin, 'sanctum')
        ->putJson('/api/admin/revenue/commission-tiers', [
            'tiers' => [
                ['tier' => 'standard', 'platform_commission_percent' => 101],
                ['tier' => 'exclusive', 'platform_commission_percent' => 12.5],
            ],
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('tiers.0.platform_commission_percent');
});

test('configuration changes affect new allocations without changing old snapshots', function () {
    $admin = commissionUser('admin', 'snapshot-admin@example.com');
    $teacher = commissionUser('teacher', 'snapshot-teacher@example.com');
    $student = commissionUser('student', 'snapshot-student@example.com');

    [$oldCourse, $oldOrder] = commissionOrder($teacher, $student);
    app(InstructorPayoutService::class)->createForOrder($oldOrder);

    $this->actingAs($admin, 'sanctum')->putJson('/api/admin/revenue/commission-tiers', [
        'tiers' => [
            ['tier' => 'standard', 'platform_commission_percent' => 25],
            ['tier' => 'exclusive', 'platform_commission_percent' => 12.5],
        ],
    ])->assertOk();

    [$newCourse, $newOrder] = commissionOrder($teacher, $student);
    app(InstructorPayoutService::class)->createForOrder($newOrder);

    $oldAllocation = RevenueAllocation::where('course_id', $oldCourse->id)->firstOrFail();
    $newAllocation = RevenueAllocation::where('course_id', $newCourse->id)->firstOrFail();

    expect((float) $oldAllocation->platform_fee_percent)->toBe(30.0)
        ->and((float) $oldAllocation->instructor_percent)->toBe(70.0)
        ->and((float) $oldAllocation->platform_fee_amount)->toBe(30000.0)
        ->and((float) $oldAllocation->instructor_amount)->toBe(70000.0)
        ->and($oldAllocation->partnership_tier)->toBe('standard')
        ->and((float) $newAllocation->platform_fee_percent)->toBe(25.0)
        ->and((float) $newAllocation->instructor_percent)->toBe(75.0)
        ->and((float) $newAllocation->platform_fee_amount)->toBe(25000.0)
        ->and((float) $newAllocation->instructor_amount)->toBe(75000.0)
        ->and((float) TeacherPayout::where('course_id', $oldCourse->id)->value('commission_rate'))->toBe(30.0)
        ->and((float) TeacherPayout::where('course_id', $newCourse->id)->value('commission_rate'))->toBe(25.0);
});

test('refunds use the allocation snapshot after commission configuration changes', function () {
    $admin = commissionUser('admin', 'refund-admin@example.com');
    $teacher = commissionUser('teacher', 'refund-teacher@example.com');
    $student = commissionUser('student', 'refund-student@example.com');

    [$course, $order, $item] = commissionOrder($teacher, $student);
    app(InstructorPayoutService::class)->createForOrder($order);

    $this->actingAs($admin, 'sanctum')->putJson('/api/admin/revenue/commission-tiers', [
        'tiers' => [
            ['tier' => 'standard', 'platform_commission_percent' => 5],
            ['tier' => 'exclusive', 'platform_commission_percent' => 10],
        ],
    ])->assertOk();

    $this->actingAs($student, 'sanctum')
        ->postJson("/api/dev/orders/{$order->id}/refund")
        ->assertOk();

    expect((float) InstructorTransaction::where('reference_id', $item->id)->where('type', 'refund')->value('amount'))->toBe(70000.0)
        ->and(RevenueAllocation::where('order_id', $order->id)->where('course_id', $course->id)->value('status'))->toBe('REFUNDED');
});

test('admin revenue returns canonical tiers and transaction snapshot fields', function () {
    $admin = commissionUser('admin', 'report-admin@example.com');
    $teacher = commissionUser('teacher', 'report-teacher@example.com');
    $student = commissionUser('student', 'report-student@example.com');

    [$course, $order] = commissionOrder($teacher, $student);
    app(InstructorPayoutService::class)->createForOrder($order);

    $course->update(['partnership_tier' => 'exclusive']);

    $this->actingAs($admin, 'sanctum')
        ->getJson('/api/admin/revenue')
        ->assertOk()
        ->assertJsonPath('commissionTiers.0.tier', 'standard')
        ->assertJsonPath('data.commissionTiers.1.tier', 'exclusive')
        ->assertJsonPath('orderHistory.0.partnershipTier', 'standard')
        ->assertJsonPath('orderHistory.0.platformCommissionPercent', 30)
        ->assertJsonPath('orderHistory.0.instructorPercent', 70)
        ->assertJsonPath('orderHistory.0.adminAmount', 30000)
        ->assertJsonPath('orderHistory.0.teacherAmount', 70000);
});
