<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    /**
     * Tạo đơn hàng mới
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'course_ids'     => 'required|array|min:1',
            'course_ids.*'   => 'required|integer|exists:courses,id',
            'payment_method' => 'required|string|in:vnpay,momo,banking,free',
            'coupon_code'    => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => 'Dữ liệu không hợp lệ.', 'errors' => $validator->errors()], 422);
        }

        $user = $request->user();

        // Kiểm tra trùng lặp
        if (DB::table('enrollments')->where('user_id', $user->id)->whereIn('course_id', $request->course_ids)->exists()) {
            return response()->json(['success' => false, 'message' => 'Bạn đã đăng ký khóa học này rồi.'], 400);
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
            $transactionId = 'ORD-' . strtoupper(Str::random(6));

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

            // Xử lý phương thức thanh toán
            $paymentUrl = $this->handlePaymentMethod($order, $request, $totalAmount, $courses);

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
     * Tách logic xử lý các cổng thanh toán ra riêng
     */
    private function handlePaymentMethod($order, $request, $totalAmount, $courses = null)
    {
        $transactionId = $order->transaction_id;
        $courseId = $courses ? $courses->first()->id : '';
        $returnUrl = "http://localhost:3000/payment/callback" . ($courseId ? "?course_id=" . $courseId : "");

        if ($order->payment_method === 'vnpay') {
            $inputData = [
                "vnp_Version" => "2.1.0", "vnp_TmnCode" => env('VNPAY_TMN_CODE'),
                "vnp_Amount" => $totalAmount * 100, "vnp_Command" => "pay",
                "vnp_CreateDate" => date('YmdHis'), "vnp_CurrCode" => "VND",
                "vnp_IpAddr" => $request->ip(), "vnp_Locale" => "vn",
                "vnp_OrderInfo" => "Thanh toan " . $transactionId,
                "vnp_OrderType" => "billpayment",
                "vnp_ReturnUrl" => $returnUrl,
                "vnp_TxnRef" => $transactionId,
            ];
            ksort($inputData);
            $query = http_build_query($inputData);
            $hash = hash_hmac('sha512', $query, env('VNPAY_HASH_SECRET'));
            return "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?" . $query . "&vnp_SecureHash=" . $hash;
        }

        if ($order->payment_method === 'momo') {
            $partnerCode = env('MOMO_PARTNER_CODE', 'MOMO');
            $accessKey = env('MOMO_ACCESS_KEY', 'access_key');
            $secretKey = env('MOMO_SECRET_KEY', 'secret_key');
            $endpoint = env('MOMO_ENDPOINT', 'https://test-payment.momo.vn/v2/gateway/api/create');
            $redirectUrl = $returnUrl;
            $ipnUrl = env('APP_URL', 'http://localhost:8000') . "/api/student/payment/momo-ipn";
            $amount = (string)$totalAmount;
            $orderInfo = "Thanh toan don hang " . $transactionId;
            $requestId = time() . "";
            $extraData = "";
            $requestType = "captureWallet";

            $rawHash = "accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$transactionId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType";
            $signature = hash_hmac('sha256', $rawHash, $secretKey);

            $data = [
                'partnerCode' => $partnerCode,
                'partnerName' => 'MindNova',
                'storeId' => 'MindNova',
                'requestId' => $requestId,
                'amount' => $amount,
                'orderId' => $transactionId,
                'orderInfo' => $orderInfo,
                'redirectUrl' => $redirectUrl,
                'ipnUrl' => $ipnUrl,
                'lang' => 'vi',
                'extraData' => $extraData,
                'requestType' => $requestType,
                'signature' => $signature
            ];

            try {
                $response = \Illuminate\Support\Facades\Http::post($endpoint, $data);
                if ($response->successful()) {
                    $json = $response->json();
                    return $json['payUrl'] ?? null;
                }
            } catch (\Exception $e) {
                // Return null if Momo fails
            }
            return null;
        }

        return "https://your-website.com/banking-instruction"; // Link trang hướng dẫn banking
    }

    /**
     * API nhận IPN VNPay
     */
    public function vnpayIpn(Request $request)
    {
        // Giữ nguyên logic IPN của bạn vì nó đang hoạt động tốt
        $vnp_HashSecret = env('VNPAY_HASH_SECRET');
        $inputData = array_filter($request->all(), fn($k) => str_starts_with($k, 'vnp_'), ARRAY_FILTER_USE_KEY);
        $vnp_SecureHash = $inputData['vnp_SecureHash'];
        unset($inputData['vnp_SecureHash'], $inputData['vnp_SecureHashType']);
        ksort($inputData);
        $hashData = http_build_query($inputData);

        if (hash_hmac('sha512', $hashData, $vnp_HashSecret) === $vnp_SecureHash) {
            $order = Order::where('transaction_id', $inputData['vnp_TxnRef'])->first();
            if ($order && $order->status === 'pending') {
                if ($inputData['vnp_ResponseCode'] == '00') {
                    $order->update(['status' => 'completed']);
                    // Tự động cấp quyền
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
                    
                    app(InstructorPayoutService::class)->createForOrder($order);
                }
            }
            return response()->json(['RspCode' => '00', 'Message' => 'Confirm Success']);
        }
    }
    /**
     * API nhận IPN Momo
     */
    public function momoIpn(Request $request)
    {
        $partnerCode = env('MOMO_PARTNER_CODE', 'MOMO');
        $accessKey = env('MOMO_ACCESS_KEY', 'access_key');
        $secretKey = env('MOMO_SECRET_KEY', 'secret_key');

        $partnerCodeParam = $request->partnerCode;
        $orderId = $request->orderId;
        $requestId = $request->requestId;
        $amount = $request->amount;
        $orderInfo = $request->orderInfo;
        $orderType = $request->orderType;
        $transId = $request->transId;
        $resultCode = $request->resultCode;
        $message = $request->message;
        $payType = $request->payType;
        $responseTime = $request->responseTime;
        $extraData = $request->extraData;
        $signature = $request->signature;

        $rawHash = "accessKey=$accessKey&amount=$amount&extraData=$extraData&message=$message&orderId=$orderId&orderInfo=$orderInfo&orderType=$orderType&partnerCode=$partnerCodeParam&payType=$payType&requestId=$requestId&responseTime=$responseTime&resultCode=$resultCode&transId=$transId";
        
        $mySignature = hash_hmac('sha256', $rawHash, $secretKey);

        if ($mySignature === $signature) {
            if ($resultCode == 0) {
                // Success
                $order = Order::where('transaction_id', $orderId)->first();
                if ($order && $order->status === 'pending') {
                    $order->update(['status' => 'completed']);
                    // Tự động cấp quyền
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
                    
                    app(InstructorPayoutService::class)->createForOrder($order);
                }
                return response()->json(['message' => 'Success']);
            }
            return response()->json(['message' => 'Payment failed']);
        }

        return response()->json(['message' => 'Invalid signature'], 400);
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
                    $grossAmount = (float) $item->price;
                    $commissionRate = 0.10;
                    $teacherAmount = round($grossAmount - ($grossAmount * $commissionRate), 2);
                    
                    \App\Models\InstructorTransaction::create([
                        'instructor_id' => $course->teacher_id,
                        'type' => 'refund',
                        'amount' => $teacherAmount,
                        'status' => 'completed',
                        'reference_type' => 'App\Models\OrderItem',
                        'reference_id' => $item->id,
                        'description' => 'Hoàn tiền cho khóa học: ' . $course->title,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                    
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

        $progressEligible = ($progressPercentage <= 10) || ($completedLessonsCount <= 5);
        $isEligible = $within30Days && $progressEligible;

        $reasons = [];
        if (!$within30Days) {
            $reasons[] = "Đã quá 30 ngày kể từ khi mua khóa học (Đã mua {$daysDiff} ngày).";
        }
        if (!$progressEligible) {
            $reasons[] = "Tiến độ học vượt quá điều kiện quy định (Tiến độ: {$progressPercentage}%, bài đã học: {$completedLessonsCount}).";
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

        $isEligible = ($progressPercentage <= 10) || ($completedLessonsCount <= 5);

        if (!$isEligible) {
            return response()->json([
                'success' => false,
                'message' => "Không đủ điều kiện hoàn tiền. Khóa học chỉ được hoàn tiền khi tiến độ ≤10% hoặc chưa học quá 5 bài. Tiến độ hiện tại của bạn là {$progressPercentage}% ({$completedLessonsCount} bài đã học)."
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
                $itemPrice = $orderItem ? (float)$orderItem->price : (float)$course->price;
                $commissionRate = ($course->partnership_tier === 'exclusive') ? 0.15 : 0.30;
                $teacherAmount = round($itemPrice * (1 - $commissionRate), 2);

                \App\Models\InstructorTransaction::create([
                    'instructor_id' => $course->teacher_id,
                    'type' => 'refund',
                    'amount' => $teacherAmount,
                    'status' => 'completed',
                    'reference_type' => 'App\Models\OrderItem',
                    'reference_id' => $orderItem ? $orderItem->id : $course->id,
                    'description' => 'Hoàn tiền cho khóa học: ' . $course->title,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                \App\Models\TeacherPayout::where('order_id', $order->id)->where('course_id', $course->id)->update(['status' => 'refunded']);
            }

            $order->update(['status' => 'refunded']);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Hoàn tiền khóa học '{$course->title}' thành công! Số tiền " . number_format($order->total_amount) . " VNĐ đã được hoàn trả.",
                'data' => [
                    'order_id' => $order->id,
                    'course_id' => $course->id,
                    'refunded_amount' => $order->total_amount,
                ]
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => 'Lỗi khi xử lý hoàn tiền: ' . $e->getMessage()], 500);
        }
    }
}
