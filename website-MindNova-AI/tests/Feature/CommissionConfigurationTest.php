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

function legacyAllocation(Course $course, Order $order, ?OrderItem $item, float $instructorAmount, string $tier = 'standard'): RevenueAllocation
{
    $paidAmount = (float) ($item?->price ?? $order->total_amount);
    $platformAmount = $paidAmount - $instructorAmount;

    return RevenueAllocation::create([
        'order_id' => $order->id,
        'order_item_id' => $item?->id,
        'course_id' => $course->id,
        'student_id' => $order->user_id,
        'instructor_id' => $course->teacher_id,
        'partnership_tier' => $tier,
        'original_price' => $paidAmount,
        'discount_amount' => 0,
        'paid_amount' => $paidAmount,
        'platform_fee_percent' => $platformAmount / $paidAmount * 100,
        'platform_fee_amount' => $platformAmount,
        'instructor_percent' => $instructorAmount / $paidAmount * 100,
        'instructor_amount' => $instructorAmount,
        'status' => 'PENDING',
        'refund_deadline' => now()->addDays(30),
    ]);
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

test('replaying payout creation repairs missing companions once from the existing payout snapshot', function () {
    $admin = commissionUser('admin', 'replay-admin@example.com');
    $teacher = commissionUser('teacher', 'replay-teacher@example.com');
    $student = commissionUser('student', 'replay-student@example.com');
    [$course, $order] = commissionOrder($teacher, $student);

    TeacherPayout::create([
        'order_id' => $order->id,
        'course_id' => $course->id,
        'teacher_id' => $teacher->id,
        'student_id' => $student->id,
        'gross_amount' => 100000,
        'teacher_amount' => 70000,
        'admin_share_amount' => 30000,
        'commission_rate' => 30,
        'status' => 'pending',
        'metadata' => ['partnership_tier' => 'standard', 'instructor_percent' => 70],
    ]);

    $this->actingAs($admin, 'sanctum')->putJson('/api/admin/revenue/commission-tiers', [
        'tiers' => [
            ['tier' => 'standard', 'platform_commission_percent' => 5],
            ['tier' => 'exclusive', 'platform_commission_percent' => 10],
        ],
    ])->assertOk();

    $course->update(['price' => 250000]);

    app(InstructorPayoutService::class)->createForOrder($order);

    $allocation = RevenueAllocation::firstOrFail();
    expect((float) $allocation->platform_fee_percent)->toBe(30.0)
        ->and((float) $allocation->instructor_percent)->toBe(70.0)
        ->and((float) $allocation->instructor_amount)->toBe(70000.0)
        ->and((float) $allocation->original_price)->toBe(100000.0)
        ->and((float) $allocation->discount_amount)->toBe(0.0)
        ->and((float) $allocation->paid_amount)->toBe(100000.0)
        ->and((float) InstructorTransaction::where('type', 'revenue')->value('amount'))->toBe(70000.0)
        ->and(InstructorTransaction::where('type', 'revenue')->count())->toBe(1);

    app(InstructorPayoutService::class)->createForOrder($order);

    expect(InstructorTransaction::where('type', 'revenue')->count())->toBe(1)
        ->and((float) InstructorTransaction::where('type', 'revenue')->value('amount'))->toBe(70000.0);
});

test('commission percentages are normalized to stored precision before deriving the complement', function () {
    $admin = commissionUser('admin', 'precision-admin@example.com');

    $this->actingAs($admin, 'sanctum')->putJson('/api/admin/revenue/commission-tiers', [
        'tiers' => [
            ['tier' => 'standard', 'platform_commission_percent' => 12.345],
            ['tier' => 'exclusive', 'platform_commission_percent' => 15],
        ],
    ])->assertOk()
        ->assertJsonPath('data.0.platform_commission_percent', 12.35)
        ->assertJsonPath('data.0.instructor_percent', 87.65);

    $quote = app(CommissionService::class)->quote('standard', 100000);
    expect($quote['platform_commission_percent'] + $quote['instructor_percent'])->toBe(100.0);
});

test('tier identifiers longer than the snapshot column are rejected', function () {
    $admin = commissionUser('admin', 'tier-length-admin@example.com');

    $this->actingAs($admin, 'sanctum')->putJson('/api/admin/revenue/commission-tiers', [
        'tiers' => [
            ['tier' => str_repeat('x', 21), 'platform_commission_percent' => 20],
        ],
    ])->assertUnprocessable()
        ->assertJsonValidationErrors('tiers.0.tier');
});

test('legacy nullable allocations remain reportable and refundable', function () {
    $admin = commissionUser('admin', 'legacy-admin@example.com');
    $teacher = commissionUser('teacher', 'legacy-teacher@example.com');
    $student = commissionUser('student', 'legacy-student@example.com');
    [$course, $order, $item] = commissionOrder($teacher, $student);
    legacyAllocation($course, $order, null, 64000);

    $this->actingAs($admin, 'sanctum')->getJson('/api/admin/revenue')
        ->assertOk()
        ->assertJsonPath('orderHistory.0.teacherAmount', 64000)
        ->assertJsonPath('orderHistory.0.platformCommissionPercent', 36);

    $this->actingAs($student, 'sanctum')->postJson("/api/dev/orders/{$order->id}/refund")->assertOk();

    expect((float) InstructorTransaction::where('reference_id', $item->id)->where('type', 'refund')->value('amount'))->toBe(64000.0)
        ->and(RevenueAllocation::first()->status)->toBe('REFUNDED');
});

test('normal refunds prefer the exact item allocation over the legacy order and course fallback', function () {
    $teacher = commissionUser('teacher', 'precedence-teacher@example.com');
    $student = commissionUser('student', 'precedence-student@example.com');
    [$course, $order, $item] = commissionOrder($teacher, $student);
    $legacy = legacyAllocation($course, $order, null, 64000);
    $exact = legacyAllocation($course, $order, $item, 71000);

    $this->actingAs($student, 'sanctum')->postJson('/api/student/orders/refund', [
        'order_id' => $order->id,
        'course_id' => $course->id,
    ])->assertOk();

    expect((float) InstructorTransaction::where('reference_id', $item->id)->where('type', 'refund')->value('amount'))->toBe(71000.0)
        ->and($exact->refresh()->status)->toBe('REFUNDED')
        ->and($legacy->refresh()->status)->toBe('PENDING');
});

test('allocation tier backfill prefers payout metadata before the current course tier', function () {
    $teacher = commissionUser('teacher', 'backfill-teacher@example.com');
    $student = commissionUser('student', 'backfill-student@example.com');
    [$course, $order, $item] = commissionOrder($teacher, $student, 'exclusive');
    $allocation = legacyAllocation($course, $order, $item, 70000, 'standard');
    $allocation->update(['partnership_tier' => null]);
    TeacherPayout::create([
        'order_id' => $order->id,
        'course_id' => $course->id,
        'teacher_id' => $teacher->id,
        'student_id' => $student->id,
        'gross_amount' => 100000,
        'teacher_amount' => 70000,
        'admin_share_amount' => 30000,
        'commission_rate' => 30,
        'status' => 'pending',
        'metadata' => ['partnership_tier' => 'standard'],
    ]);

    $migration = require database_path('migrations/2026_09_10_000001_add_partnership_tier_to_revenue_allocations_table.php');
    $migration->up();

    expect($allocation->refresh()->partnership_tier)->toBe('standard');
});
