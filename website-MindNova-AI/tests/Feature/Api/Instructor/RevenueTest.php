<?php

namespace Tests\Feature\Api\Instructor;

use App\Models\User;
use App\Models\Role;
use App\Models\InstructorTransaction;
use App\Models\Withdrawal;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class RevenueTest extends TestCase
{
    use RefreshDatabase;

    protected $teacherRole;
    protected $studentRole;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->teacherRole = Role::firstOrCreate(['name' => 'teacher', 'display_name' => 'Teacher']);
        $this->studentRole = Role::firstOrCreate(['name' => 'student', 'display_name' => 'Student']);
    }

    private function createTeacher(): User
    {
        $user = User::factory()->create();
        $user->roles()->attach($this->teacherRole);
        return $user;
    }

    private function createStudent(): User
    {
        $user = User::factory()->create();
        $user->roles()->attach($this->studentRole);
        return $user;
    }

    public function test_unauthorized_access_without_login()
    {
        $response = $this->getJson('/api/instructor/revenue/overview');
        $response->assertStatus(401);
    }

    public function test_unauthorized_access_for_student()
    {
        $student = $this->createStudent();
        
        $response = $this->actingAs($student)->getJson('/api/instructor/revenue/overview');
        $response->assertStatus(403); 
    }

    public function test_overview_empty_data()
    {
        $teacher = $this->createTeacher();

        $response = $this->actingAs($teacher)->getJson('/api/instructor/revenue/overview');

        $response->assertStatus(200);
        $response->assertJson([
            'data' => [
                'total_revenue' => 0,
                'available_balance' => 0,
                'escrow_balance' => 0,
                'refund_rate' => 0,
                'revenue_growth' => 0,
                'recent_transactions' => [],
            ]
        ]);
    }

    public function test_revenue_calculations()
    {
        $teacher = $this->createTeacher();

        InstructorTransaction::create([
            'instructor_id' => $teacher->id,
            'type' => 'revenue',
            'amount' => 1000000,
            'status' => 'available',
            'created_at' => Carbon::now(),
        ]);

        InstructorTransaction::create([
            'instructor_id' => $teacher->id,
            'type' => 'revenue',
            'amount' => 500000,
            'status' => 'escrow',
            'created_at' => Carbon::now(),
        ]);

        InstructorTransaction::create([
            'instructor_id' => $teacher->id,
            'type' => 'refund',
            'amount' => 100000,
            'status' => 'completed',
            'created_at' => Carbon::now(),
        ]);

        Withdrawal::create([
            'instructor_id' => $teacher->id,
            'amount' => 200000,
            'bank_info' => ['bank_name' => 'MB'],
            'status' => 'completed'
        ]);

        $response = $this->actingAs($teacher)->getJson('/api/instructor/revenue/overview');
        $response->assertStatus(200);
        
        $response->assertJsonPath('data.total_revenue', 1500000);
        $response->assertJsonPath('data.available_balance', 800000);
        $response->assertJsonPath('data.escrow_balance', 500000);
        $response->assertJsonPath('data.refund_rate', 33.3);
    }

    public function test_successful_withdrawal()
    {
        $teacher = $this->createTeacher();

        InstructorTransaction::create([
            'instructor_id' => $teacher->id,
            'type' => 'revenue',
            'amount' => 500000,
            'status' => 'available'
        ]);

        $payload = [
            'amount' => 100000,
            'bank_info' => [
                'bank_name' => 'Vietcombank',
                'account_number' => '123456789',
                'account_name' => 'NGUYEN VAN A'
            ]
        ];

        $response = $this->actingAs($teacher)->postJson('/api/instructor/revenue/withdraw', $payload);
        
        $response->assertStatus(200);
        $response->assertJsonPath('success', true);

        $this->assertDatabaseHas('withdrawals', [
            'instructor_id' => $teacher->id,
            'amount' => 100000,
            'status' => 'processing'
        ]);

        $this->assertDatabaseHas('instructor_transactions', [
            'instructor_id' => $teacher->id,
            'type' => 'withdrawal',
            'amount' => 100000,
            'status' => 'processing'
        ]);
    }

    public function test_withdrawal_insufficient_balance()
    {
        $teacher = $this->createTeacher();

        $payload = [
            'amount' => 100000,
            'bank_info' => [
                'bank_name' => 'Vietcombank',
                'account_number' => '123456789',
                'account_name' => 'NGUYEN VAN A'
            ]
        ];

        $response = $this->actingAs($teacher)->postJson('/api/instructor/revenue/withdraw', $payload);
        
        $response->assertStatus(400); 
        $response->assertJsonPath('message', 'Số dư khả dụng không đủ để rút tiền.');
    }

    public function test_withdrawal_incorrect_parameters()
    {
        $teacher = $this->createTeacher();

        $payload = [
            'amount' => 40000, 
            'bank_info' => [] 
        ];

        $response = $this->actingAs($teacher)->postJson('/api/instructor/revenue/withdraw', $payload);
        
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['amount', 'bank_info.bank_name', 'bank_info.account_number']);
    }
}
