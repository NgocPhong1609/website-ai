<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Course;
use App\Services\Instructor\InstructorPayoutService;
use App\Services\MomoService;
use App\Services\VNPayService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $orders = Order::with('orderItems.course')
            ->where('user_id', $user->id)
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'orders' => $orders->map(function (Order $order) {
                    $titles = $order->orderItems
                        ->map(fn ($item) => $item->course?->title)
                        ->filter()
                        ->values();

                    return [
                        'id' => $order->id,
                        'transaction_id' => $order->transaction_id,
                        'total_amount' => (float) $order->total_amount,
                        'payment_method' => $order->payment_method,
                        'status' => $order->status,
                        'created_at' => optional($order->created_at)->timezone('Asia/Ho_Chi_Minh')?->format('d/m/Y'),
                        'course_id' => $order->orderItems->first()?->course_id,
                        'service' => $titles->implode(', ') ?: 'Thanh toán khóa học',
                    ];
                })->values(),
                'payment_methods' => $orders->pluck('payment_method')->unique()->values(),
            ],
        ]);
    }

    /**
     * Tạo đơn hàng mới
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'course_ids'     => 'required|array|min:1',
            'course_ids.*'   => 'required|integer|exists:courses,id',
            'payment_method' => 'required|string|in:vnpay,momo,banking,free',
            'payment_method_id' => 'nullable|integer',
            'coupon_code'    => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => 'Dữ liệu không hợp lệ.', 'errors' => $validator->errors()], 422);
        }

        $user = $request->user();

        if ($request->payment_method === 'banking') {
            return response()->json([
                'success' => false,
                'message' => 'Vui lòng thanh toán qua VNPAY hoặc MoMo. Website không thu thập số tài khoản ngân hàng.',
            ], 422);
        }

        // Kiểm tra trùng lặp
        if (DB::table('enrollments')->where('user_id', $user->id)->whereIn('course_id', $request->course_ids)->exists()) {
            return response()->json(['success' => false, 'message' => 'Bạn đã đăng ký khóa học này rồi.'], 400);
        }

        if ($request->payment_method === 'free') {
            $this->abandonPendingOrdersForCourses($user->id, $request->course_ids);
        }

        $pendingOrder = $this->findReusablePendingOrder($user->id, $request->course_ids);
        if ($pendingOrder && $request->payment_method !== 'free') {
            $locked = DB::transaction(function () use ($pendingOrder, $request) {
                $order = Order::where('id', $pendingOrder->id)->lockForUpdate()->first();
                if (! $order || $order->status !== 'pending') {
                    return null;
                }

                $order->update([
                    'payment_method' => $request->payment_method,
                    'transaction_id' => $this->newTransactionId(),
                    'status' => 'pending',
                ]);

                return $order->load('orderItems.course');
            });

            if (! $locked) {
                return response()->json([
                    'success' => false,
                    'message' => 'Đơn hàng không còn ở trạng thái chờ thanh toán.',
                ], 409);
            }

            $courses = $locked->orderItems->map->course->filter();
            $paymentUrl = $this->handlePaymentMethod($locked, $request, (float) $locked->total_amount, $courses);

            if (! $paymentUrl) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tạo được liên kết thanh toán. Đơn hàng vẫn đang chờ, vui lòng thử lại.',
                    'data' => $locked->load('orderItems'),
                    'payment_url' => null,
                ], 502);
            }

            return response()->json([
                'success' => true,
                'message' => 'Tiếp tục thanh toán đơn hàng đang chờ.',
                'data' => $locked->load('orderItems'),
                'payment_url' => $paymentUrl,
            ]);
        }

        DB::beginTransaction();
        try {
            $courses = Course::with('teacher')->whereIn('id', $request->course_ids)->get();
            $originalTotal = (float) $courses->sum('price');
            $discountAmount = 0;

            if ($request->filled('coupon_code')) {
                $code = strtoupper(trim($request->coupon_code));
                $coupon = \App\Models\Coupon::where('code', $code)->first();

                if ($coupon && $coupon->status === 'active') {
                    $isExpired = $coupon->expires_at && now()->greaterThan($coupon->expires_at);
                    $limitReached = $coupon->max_uses !== null && (int)$coupon->used_count >= (int)$coupon->max_uses;
                    $courseMismatch = $coupon->course_id && !in_array((int)$coupon->course_id, array_map('intval', $request->course_ids));
                    
                    $instructorMismatch = false;
                    if ($coupon->instructor_id) {
                        foreach ($courses as $c) {
                            $cTeacherId = (int) ($c->teacher_id ?? 0);
                            if ((int) $coupon->instructor_id !== $cTeacherId) {
                                $instructorMismatch = true;
                                break;
                            }
                        }
                    }

                    if (!$isExpired && !$limitReached && !$courseMismatch && !$instructorMismatch) {
                        if ($coupon->type === 'percent') {
                            $discountAmount = round($originalTotal * ((float)$coupon->value / 100));
                        } else {
                            $discountAmount = min($originalTotal, (float)$coupon->value);
                        }
                        $coupon->increment('used_count');
                    }
                }
            }

            $totalAmount = max(0, $originalTotal - $discountAmount);
            if ($totalAmount <= 0) {
                $this->abandonPendingOrdersForCourses($user->id, $request->course_ids);
            }
            $transactionId = $this->newTransactionId();

            $order = Order::create([
                'user_id' => $user->id,
                'total_amount' => $totalAmount,
                'payment_method' => $request->payment_method,
                'status' => 'pending',
                'transaction_id' => $transactionId
            ]);

            $discountFactor = $originalTotal > 0 ? max(0, ($originalTotal - $discountAmount) / $originalTotal) : 1;

            foreach ($courses as $course) {
                $itemNetPrice = round((float) $course->price * $discountFactor, 2);
                OrderItem::create(['order_id' => $order->id, 'course_id' => $course->id, 'price' => $itemNetPrice]);
            }

            if ($totalAmount <= 0) {
                $order->update(['status' => 'completed']);
                $student = \App\Models\User::find($order->user_id);
                foreach ($courses as $course) {
                    $inserted = DB::table('enrollments')->insertOrIgnore([
                        'user_id' => $user->id, 'course_id' => $course->id,
                        'status' => 'enrolled', 'enrolled_at' => now()
                    ]);
                    
                    if ($inserted) {
                        if ($course && $course->teacher && $student) {
                            $course->teacher->notify(new \App\Notifications\StudentEnrolled($course, $student));
                        }

                        // Add student to chat conversation
                        $conversation = \App\Models\ChatConversation::firstOrCreate(
                            ['course_id' => $course->id],
                            ['title' => $course->title, 'type' => 'course']
                        );

                        if ($course->teacher_id) {
                            \App\Models\ChatConversationMember::firstOrCreate([
                                'chat_conversation_id' => $conversation->id,
                                'user_id' => $course->teacher_id
                            ]);
                        }

                        \App\Models\ChatConversationMember::firstOrCreate([
                            'chat_conversation_id' => $conversation->id,
                            'user_id' => $student->id
                        ]);
                    }
                }
                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => 'Đăng ký khóa học miễn phí thành công!',
                    'data' => $order->load('orderItems'),
                    'payment_url' => null
                ], 201);
            }

            DB::commit();

            $paymentUrl = $this->handlePaymentMethod($order, $request, $totalAmount, $courses);

            if (! $paymentUrl) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tạo được liên kết thanh toán. Đơn hàng đang chờ, vui lòng thử lại.',
                    'data' => $order->load('orderItems'),
                    'payment_url' => null,
                ], 502);
            }

            return response()->json([
                'success' => true,
                'message' => 'Tạo đơn hàng thành công!',
                'data' => $order->load('orderItems'),
                'payment_url' => $paymentUrl
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => 'Lỗi hệ thống: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Tạo payment URL qua VNPay/MoMo. Không thu thập số TK/thẻ trên website.
     */
    private function handlePaymentMethod($order, $request, $totalAmount, $courses = null)
    {
        $transactionId = $order->transaction_id;
        $returnUrl = $this->frontendReturnUrl($courses?->first()?->id);
        $amountVnd = (int) round((float) $totalAmount);

        if ($order->payment_method === 'vnpay') {
            $tmnCode = (string) config('services.vnpay.tmn_code');
            $hashSecret = (string) config('services.vnpay.hash_secret');
            if ($tmnCode === '' || $hashSecret === '') {
                return null;
            }

            return app(VNPayService::class)->buildPaymentUrl(
                txnRef: $transactionId,
                amountVnd: $amountVnd,
                orderInfo: 'Thanh toan '.$transactionId,
                returnUrl: $returnUrl,
                ipAddr: (string) $request->ip(),
            );
        }

        if ($order->payment_method === 'momo') {
            $ipnUrl = rtrim((string) config('app.url'), '/').'/api/student/payment/momo-ipn';

            return app(MomoService::class)->createWalletPayment(
                orderId: $transactionId,
                amountVnd: $amountVnd,
                orderInfo: 'Thanh toan don hang '.$transactionId,
                redirectUrl: $returnUrl,
                ipnUrl: $ipnUrl,
            );
        }

        return null;
    }

    /**
     * API nhận IPN VNPay
     */
    public function vnpayIpn(Request $request)
    {
        $result = app(VNPayService::class)->verifyCallback($request->all());

        if (! $result['valid']) {
            return response()->json(['RspCode' => '97', 'Message' => 'Invalid signature']);
        }

        $txnRef = (string) ($result['payment_id'] ?? '');

        return DB::transaction(function () use ($result, $txnRef) {
            $order = Order::where('transaction_id', $txnRef)->lockForUpdate()->first();
            if (! $order) {
                return response()->json(['RspCode' => '01', 'Message' => 'Order not found']);
            }

            $expectedAmount = (int) round((float) $order->total_amount * 100);
            $callbackAmount = (int) round(((float) $result['amount']) * 100);
            if ($callbackAmount !== $expectedAmount) {
                return response()->json(['RspCode' => '04', 'Message' => 'Invalid amount']);
            }

            if ($order->status === 'completed') {
                return response()->json(['RspCode' => '02', 'Message' => 'Order already confirmed']);
            }

            if ($order->status !== 'pending') {
                return response()->json(['RspCode' => '00', 'Message' => 'Confirm Success']);
            }

            if (($result['response_code'] ?? '') === '00' && $result['status'] === 'completed') {
                $this->fulfillCompletedOrder($order);

                return response()->json(['RspCode' => '00', 'Message' => 'Confirm Success']);
            }

            $order->update(['status' => 'failed']);

            return response()->json(['RspCode' => '00', 'Message' => 'Confirm Success']);
        });
    }

    /**
     * API nhận IPN Momo
     */
    public function momoIpn(Request $request)
    {
        $result = app(MomoService::class)->verifyCallback($request->all());

        if (! $result['valid']) {
            return response()->json(['message' => 'Invalid signature'], 400);
        }

        $orderId = (string) ($result['payment_id'] ?? '');

        return DB::transaction(function () use ($result, $orderId) {
            $order = Order::where('transaction_id', $orderId)->lockForUpdate()->first();
            if (! $order) {
                return response()->json(['message' => 'Order not found'], 404);
            }

            $expectedAmount = (int) round((float) $order->total_amount);
            $callbackAmount = (int) round((float) $result['amount']);
            if ($callbackAmount !== $expectedAmount) {
                return response()->json(['message' => 'Invalid amount'], 400);
            }

            if ($order->status === 'completed') {
                return response()->json(['message' => 'Success']);
            }

            if ($order->status !== 'pending') {
                return response()->json(['message' => 'Ignored']);
            }

            if ($result['status'] === 'completed') {
                $this->fulfillCompletedOrder($order);

                return response()->json(['message' => 'Success']);
            }

            $order->update(['status' => 'failed']);

            return response()->json(['message' => 'Payment failed']);
        });
    }

    public function retryPayment(Request $request, int $id)
    {
        $validator = Validator::make($request->all(), [
            'payment_method' => 'required|string|in:vnpay,momo',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => 'Vui lòng chọn VNPAY hoặc MoMo.', 'errors' => $validator->errors()], 422);
        }

        $order = Order::with('orderItems.course')
            ->where('user_id', $request->user()->id)
            ->find($id);

        if (! $order) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy đơn hàng.'], 404);
        }

        if (! in_array($order->status, ['pending', 'failed'], true)) {
            return response()->json(['success' => false, 'message' => 'Đơn hàng này không thể thanh toán lại.'], 422);
        }

        if ((float) $order->total_amount <= 0) {
            return response()->json(['success' => false, 'message' => 'Đơn hàng miễn phí không cần cổng thanh toán.'], 422);
        }

        $locked = DB::transaction(function () use ($order, $request) {
            $fresh = Order::where('id', $order->id)->lockForUpdate()->first();
            if (! $fresh || ! in_array($fresh->status, ['pending', 'failed'], true)) {
                return null;
            }

            $fresh->update([
                'payment_method' => $request->payment_method,
                'transaction_id' => $this->newTransactionId(),
                'status' => 'pending',
            ]);

            return $fresh->load('orderItems.course');
        });

        if (! $locked) {
            return response()->json(['success' => false, 'message' => 'Đơn hàng này không thể thanh toán lại.'], 422);
        }

        $courses = $locked->orderItems->map->course->filter();
        $paymentUrl = $this->handlePaymentMethod($locked, $request, (float) $locked->total_amount, $courses);

        if (! $paymentUrl) {
            return response()->json([
                'success' => false,
                'message' => 'Không tạo được liên kết thanh toán. Vui lòng thử lại.',
                'data' => $locked->fresh('orderItems'),
            ], 502);
        }

        return response()->json([
            'success' => true,
            'message' => 'Đã tạo liên kết thanh toán mới.',
            'data' => $locked->fresh('orderItems'),
            'payment_url' => $paymentUrl,
        ]);
    }

    /**
     * API for fetching order status securely by transaction ID
     */
    public function showByTransaction(Request $request, $transactionId)
    {
        $order = Order::with('orderItems.course')->where('transaction_id', $transactionId)->first();
        if (!$order) {
            return response()->json(['success' => false, 'message' => 'Order not found'], 404);
        }
        
        // Ensure user can only check their own order
        if ($order->user_id !== $request->user()->id) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $order
        ]);
    }

    /**
     * Dev Endpoint to force complete an order for testing
     */
    public function devCompleteOrder(Request $request, $orderId)
    {
        if (!app()->environment('local', 'testing')) {
            return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
        }

        $order = Order::find($orderId);
        if (!$order) {
            return response()->json(['success' => false, 'message' => 'Order not found'], 404);
        }

        if ($order->status !== 'pending') {
            return response()->json(['success' => false, 'message' => 'Order is not pending'], 400);
        }

        DB::beginTransaction();
        try {
            $order->update(['status' => 'completed']);
            $items = OrderItem::with('course.teacher')->where('order_id', $order->id)->get();
            $student = \App\Models\User::find($order->user_id);
            
            foreach ($items as $item) {
                $inserted = DB::table('enrollments')->insertOrIgnore([
                    'user_id' => $order->user_id, 'course_id' => $item->course_id,
                    'status' => 'enrolled', 'enrolled_at' => now()
                ]);
                
                if ($inserted) {
                    $course = $item->course;
                    if ($course && $course->teacher && $student) {
                        $course->teacher->notify(new \App\Notifications\StudentEnrolled($course, $student));
                    }

                    // Add student to chat conversation
                    if ($course) {
                        $conversation = \App\Models\ChatConversation::firstOrCreate(
                            ['course_id' => $course->id],
                            ['title' => $course->title, 'type' => 'course']
                        );

                        if ($course->teacher_id) {
                            \App\Models\ChatConversationMember::firstOrCreate([
                                'chat_conversation_id' => $conversation->id,
                                'user_id' => $course->teacher_id
                            ]);
                        }

                        \App\Models\ChatConversationMember::firstOrCreate([
                            'chat_conversation_id' => $conversation->id,
                            'user_id' => $order->user_id
                        ]);
                    }
                }
            }
            
            if (class_exists(\App\Services\Instructor\InstructorPayoutService::class)) {
                app(\App\Services\Instructor\InstructorPayoutService::class)->createForOrder($order);
            }
            
            DB::commit();
            return response()->json([
                'success' => true,
                'message' => 'Order forcefully completed for testing',
                'data' => $order->load('orderItems')
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            \Illuminate\Support\Facades\Log::error('devCompleteOrder failed', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
    /**
     * Dev Endpoint to force refund an order for testing
     */
    public function devRefundOrder(Request $request, $orderId)
    {
        if (!app()->environment('local', 'testing')) {
            return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
        }

        $order = Order::find($orderId);
        if (!$order) {
            return response()->json(['success' => false, 'message' => 'Order not found'], 404);
        }

        if ($order->status !== 'completed') {
            return response()->json(['success' => false, 'message' => 'Order is not completed'], 400);
        }

        DB::beginTransaction();
        try {
            $order->update(['status' => 'refunded']);
            $items = OrderItem::with('course.teacher')->where('order_id', $order->id)->get();
            
            foreach ($items as $item) {
                DB::table('enrollments')->where('user_id', $order->user_id)->where('course_id', $item->course_id)->delete();
                
                $conversation = \App\Models\ChatConversation::where('course_id', $item->course_id)->first();
                if ($conversation) {
                    \App\Models\ChatConversationMember::where('chat_conversation_id', $conversation->id)
                        ->where('user_id', $order->user_id)
                        ->delete();
                }
                
                $course = $item->course;
                if ($course && $course->teacher_id) {
                    $allocation = $this->allocationSnapshot($order->id, $course->id, $item->id);
                    $teacherAmount = $allocation?->instructor_amount;

                    if ($allocation) {
                        $allocation->update(['status' => 'REFUNDED', 'refunded_at' => now()]);
                    }

                    if ($teacherAmount === null) {
                        $teacherAmount = \App\Models\TeacherPayout::where('order_id', $order->id)
                            ->where('course_id', $course->id)
                            ->value('teacher_amount');
                    }

                    if ($teacherAmount !== null) {
                        \App\Models\InstructorTransaction::create([
                            'instructor_id' => $course->teacher_id,
                            'type' => 'refund',
                            'amount' => (float) $teacherAmount,
                            'status' => 'completed',
                            'reference_type' => 'App\Models\OrderItem',
                            'reference_id' => $item->id,
                            'description' => 'Hoàn tiền cho khóa học: ' . $course->title,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                    
                    \App\Models\TeacherPayout::where('order_id', $order->id)->where('course_id', $course->id)->update(['status' => 'refunded']);
                }
            }
            
            DB::commit();
            return response()->json([
                'success' => true,
                'message' => 'Order forcefully refunded for testing'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Check student refund eligibility for a course
     */
    public function checkRefundEligibility(Request $request, $courseId)
    {
        $user = $request->user('sanctum') ?? $request->user();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $order = Order::where('user_id', $user->id)
            ->where('status', 'completed')
            ->whereHas('orderItems', function ($q) use ($courseId) {
                $q->where('course_id', $courseId);
            })
            ->latest()
            ->first();

        if (!$order) {
            return response()->json([
                'success' => true,
                'data' => [
                    'is_eligible' => false,
                    'reason' => 'Bạn chưa mua hoặc khóa học này đã được hoàn tiền trước đó.',
                ]
            ]);
        }

        $daysDiff = (int) now()->diffInDays($order->created_at);
        $within30Days = $daysDiff <= 30;

        $course = Course::find($courseId);
        if (!$course) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy khóa học.'], 404);
        }

        $courseService = app(\App\Services\Student\CourseService::class);
        $progressData = $courseService->calculateStudentProgress($course, $user->id);

        $progressPercentage = $progressData['progress_percentage'] ?? 0;
        $completedLessonsCount = $progressData['completed_lessons'] ?? 0;

        $progressEligible = ($progressPercentage <= 10) && ($completedLessonsCount <= 5);
        $isEligible = $within30Days && $progressEligible;

        $reasons = [];
        if (!$within30Days) {
            $reasons[] = "Đã quá 30 ngày kể từ khi mua khóa học (Đã mua {$daysDiff} ngày).";
        }
        if (!$progressEligible) {
            $reasons[] = "Tiến độ học vượt quá điều kiện quy định (Yêu cầu tiến độ ≤10% và ≤5 bài. Tiến độ hiện tại của bạn: {$progressPercentage}%, bài đã học: {$completedLessonsCount}).";
        }

        return response()->json([
            'success' => true,
            'data' => [
                'is_eligible' => $isEligible,
                'order_id' => $order->id,
                'course_id' => (int) $courseId,
                'course_title' => $course->title,
                'purchased_at' => $order->created_at->format('Y-m-d H:i:s'),
                'days_since_purchase' => $daysDiff,
                'within_30_days' => $within30Days,
                'progress_percentage' => $progressPercentage,
                'completed_lessons' => $completedLessonsCount,
                'progress_eligible' => $progressEligible,
                'reasons' => $reasons,
                'amount' => (float) $order->total_amount,
            ]
        ]);
    }

    /**
     * Student Endpoint to request refund for a course
     */
    public function requestRefund(Request $request)
    {
        $user = $request->user('sanctum') ?? $request->user();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $courseId = $request->input('course_id');
        $orderId = $request->input('order_id');

        if (!$courseId && !$orderId) {
            return response()->json(['success' => false, 'message' => 'Vui lòng chọn khóa học hoặc đơn hàng để hoàn tiền.'], 422);
        }

        $orderQuery = Order::where('user_id', $user->id)->where('status', 'completed');
        if ($orderId) {
            $orderQuery->where('id', $orderId);
        }
        if ($courseId) {
            $orderQuery->whereHas('orderItems', function ($q) use ($courseId) {
                $q->where('course_id', $courseId);
            });
        }

        $order = $orderQuery->latest()->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy đơn hàng đủ điều kiện hoặc đơn hàng đã được hoàn tiền trước đó.'
            ], 404);
        }

        $daysDiff = (int) now()->diffInDays($order->created_at);
        if ($daysDiff > 30) {
            return response()->json([
                'success' => false,
                'message' => "Khóa học đã mua quá 30 ngày (Đã mua {$daysDiff} ngày), không đủ điều kiện hoàn tiền theo chính sách."
            ], 422);
        }

        $targetCourseId = $courseId;
        if (!$targetCourseId) {
            $firstItem = $order->orderItems->first();
            $targetCourseId = $firstItem ? $firstItem->course_id : null;
        }

        $course = Course::find($targetCourseId);
        if (!$course) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy khóa học.'], 404);
        }

        $courseService = app(\App\Services\Student\CourseService::class);
        $progressData = $courseService->calculateStudentProgress($course, $user->id);

        $progressPercentage = $progressData['progress_percentage'] ?? 0;
        $completedLessonsCount = $progressData['completed_lessons'] ?? 0;

        $isEligible = ($progressPercentage <= 10) && ($completedLessonsCount <= 5);

        if (!$isEligible) {
            return response()->json([
                'success' => false,
                'message' => "Không đủ điều kiện hoàn tiền. Khóa học chỉ được hoàn tiền khi tiến độ ≤10% và chưa học quá 5 bài. Tiến độ hiện tại của bạn là {$progressPercentage}% ({$completedLessonsCount} bài đã học)."
            ], 422);
        }

        DB::beginTransaction();
        try {
            // Remove enrollment
            DB::table('enrollments')->where('user_id', $user->id)->where('course_id', $course->id)->delete();

            // Remove from chat group
            $conversation = \App\Models\ChatConversation::where('course_id', $course->id)->first();
            if ($conversation) {
                \App\Models\ChatConversationMember::where('chat_conversation_id', $conversation->id)
                    ->where('user_id', $user->id)
                    ->delete();
            }

            // Record instructor refund transaction
            if ($course->teacher_id) {
                $orderItem = OrderItem::where('order_id', $order->id)->where('course_id', $course->id)->first();
                // Update RevenueAllocation to REFUNDED
                $allocation = $this->allocationSnapshot($order->id, $course->id, $orderItem?->id);

                $teacherAmount = $allocation?->instructor_amount;

                if ($allocation) {
                    $allocation->update([
                        'status' => 'REFUNDED',
                        'refunded_at' => now(),
                    ]);
                }

                if ($teacherAmount === null) {
                    $teacherAmount = \App\Models\TeacherPayout::where('order_id', $order->id)
                        ->where('course_id', $course->id)
                        ->value('teacher_amount');
                }

                if ($teacherAmount !== null) {
                    \App\Models\InstructorTransaction::create([
                        'instructor_id' => $course->teacher_id,
                        'type' => 'refund',
                        'amount' => (float) $teacherAmount,
                        'status' => 'completed',
                        'reference_type' => 'App\Models\OrderItem',
                        'reference_id' => $orderItem ? $orderItem->id : $course->id,
                        'description' => 'Hoàn tiền cho khóa học: ' . $course->title,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }

                \App\Models\TeacherPayout::where('order_id', $order->id)->where('course_id', $course->id)->update(['status' => 'refunded']);
            }

            $order->update(['status' => 'refunded']);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Hoàn tiền khóa học '{$course->title}' thành công! Số tiền " . number_format($order->total_amount) . " VNĐ sẽ được hoàn theo phương thức thanh toán ban đầu (VNPAY/MoMo).",
                'data' => [
                    'order_id' => $order->id,
                    'course_id' => $course->id,
                    'refunded_amount' => $order->total_amount,
                    'payment_method' => $order->payment_method,
                ]
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => 'Lỗi khi xử lý hoàn tiền: ' . $e->getMessage()], 500);
        }
    }

    private function fulfillCompletedOrder(Order $order): void
    {
        if ($order->status === 'completed') {
            return;
        }

        $order->update(['status' => 'completed']);

        $items = OrderItem::with('course.teacher')->where('order_id', $order->id)->get();
        $student = \App\Models\User::find($order->user_id);

        foreach ($items as $item) {
            $inserted = DB::table('enrollments')->insertOrIgnore([
                'user_id' => $order->user_id,
                'course_id' => $item->course_id,
                'status' => 'enrolled',
                'enrolled_at' => now(),
            ]);

            if (! $inserted) {
                continue;
            }

            $course = $item->course;
            if ($course && $course->teacher && $student) {
                $course->teacher->notify(new \App\Notifications\StudentEnrolled($course, $student));
            }

            if ($course) {
                $conversation = \App\Models\ChatConversation::firstOrCreate(
                    ['course_id' => $course->id],
                    ['title' => $course->title, 'type' => 'course']
                );

                if ($course->teacher_id) {
                    \App\Models\ChatConversationMember::firstOrCreate([
                        'chat_conversation_id' => $conversation->id,
                        'user_id' => $course->teacher_id,
                    ]);
                }

                \App\Models\ChatConversationMember::firstOrCreate([
                    'chat_conversation_id' => $conversation->id,
                    'user_id' => $order->user_id,
                ]);
            }
        }

        app(InstructorPayoutService::class)->createForOrder($order->fresh());
    }

    private function newTransactionId(): string
    {
        return 'ORD-'.strtoupper(bin2hex(random_bytes(6)));
    }

    private function frontendReturnUrl($courseId = null): string
    {
        $frontend = rtrim((string) config('services.frontend_url', 'http://localhost:3000'), '/');
        $url = $frontend.'/payment/callback';

        if ($courseId) {
            $url .= '?course_id='.$courseId;
        }

        return $url;
    }

    private function abandonPendingOrdersForCourses(int $userId, array $courseIds): void
    {
        $wanted = collect($courseIds)->map(fn ($id) => (int) $id)->sort()->values();

        $candidates = Order::with('orderItems')
            ->where('user_id', $userId)
            ->where('status', 'pending')
            ->get();

        foreach ($candidates as $order) {
            $ids = $order->orderItems->pluck('course_id')->map(fn ($id) => (int) $id)->sort()->values();
            if ($ids->toJson() === $wanted->toJson()) {
                $order->update(['status' => 'failed']);
            }
        }
    }

    private function findReusablePendingOrder(int $userId, array $courseIds): ?Order
    {
        $wanted = collect($courseIds)->map(fn ($id) => (int) $id)->sort()->values();

        $candidates = Order::with('orderItems')
            ->where('user_id', $userId)
            ->where('status', 'pending')
            ->where('total_amount', '>', 0)
            ->latest()
            ->get();

        return $candidates->first(function (Order $order) use ($wanted) {
            $ids = $order->orderItems->pluck('course_id')->map(fn ($id) => (int) $id)->sort()->values();

            return $ids->toJson() === $wanted->toJson();
        });
    }

    private function allocationSnapshot(int $orderId, int $courseId, ?int $orderItemId): ?\App\Models\RevenueAllocation
    {
        if ($orderItemId !== null) {
            $exact = \App\Models\RevenueAllocation::where('order_id', $orderId)
                ->where('course_id', $courseId)
                ->where('order_item_id', $orderItemId)
                ->first();

            if ($exact !== null) {
                return $exact;
            }
        }

        return \App\Models\RevenueAllocation::where('order_id', $orderId)
            ->where('course_id', $courseId)
            ->whereNull('order_item_id')
            ->first();
    }
}
