<?php

namespace Tests\Feature\Instructor;

use App\Models\Course;
use App\Models\Category;
use App\Models\Review;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class NotificationTest extends TestCase
{
    use RefreshDatabase;

    protected $teacher;
    protected $student;
    protected $course;

    protected function setUp(): void
    {
        parent::setUp();
        
        $roleTeacher = Role::firstOrCreate(['name' => 'teacher']);
        $roleStudent = Role::firstOrCreate(['name' => 'student']);

        $this->teacher = User::factory()->create();
        $this->teacher->roles()->attach($roleTeacher);

        $this->student = User::factory()->create();
        $this->student->roles()->attach($roleStudent);

        $category = Category::create(['name' => 'Test', 'slug' => 'test']);
        
        $this->course = Course::create([
            'title' => 'Test Course',
            'slug' => 'test-course',
            'description' => 'Desc',
            'level' => 'beginner',
            'teacher_id' => $this->teacher->id,
            'category_id' => $category->id,
            'price' => 100000,
            'status' => 'draft',
        ]);
    }

    public function test_course_published_notification_is_sent()
    {
        Notification::fake();

        $response = $this->actingAs($this->teacher)
            ->patchJson("/api/instructor/courses/{$this->course->id}/status", [
                'status' => 'published'
            ]);

        $response->assertStatus(200);

        Notification::assertSentTo(
            [$this->teacher], \App\Notifications\CoursePublished::class
        );
    }

    public function test_new_review_notification_is_sent()
    {
        Notification::fake();

        \Illuminate\Support\Facades\DB::table('enrollments')->insert([
            'user_id' => $this->student->id,
            'course_id' => $this->course->id,
            'status' => 'enrolled',
            'enrolled_at' => now(),
        ]);

        $response = $this->actingAs($this->student)
            ->postJson("/api/student/courses/{$this->course->id}/reviews", [
                'rating' => 5,
                'comment' => 'Great!'
            ]);

        $response->assertStatus(201);

        Notification::assertSentTo(
            [$this->teacher], \App\Notifications\NewReview::class
        );
    }

    public function test_student_enrolled_notification_is_sent_via_vnpay()
    {
        Notification::fake();
        
        $order = \App\Models\Order::create([
            'user_id' => $this->student->id,
            'total_amount' => 100000,
            'payment_method' => 'vnpay',
            'status' => 'pending',
            'transaction_id' => 'TXN123'
        ]);

        \App\Models\OrderItem::create([
            'order_id' => $order->id,
            'course_id' => $this->course->id,
            'price' => 100000,
        ]);

        $vnp_HashSecret = env('VNPAY_HASH_SECRET', 'secret');
        
        $inputData = [
            'vnp_TxnRef' => 'TXN123',
            'vnp_ResponseCode' => '00'
        ];
        
        ksort($inputData);
        $hashData = http_build_query($inputData);
        $vnp_SecureHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);
        $inputData['vnp_SecureHash'] = $vnp_SecureHash;

        $response = $this->getJson('/api/student/payment/vnpay-ipn?' . http_build_query($inputData));
        $response->assertStatus(200);

        Notification::assertSentTo(
            [$this->teacher], \App\Notifications\StudentEnrolled::class
        );
    }
}
