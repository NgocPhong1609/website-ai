<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\SupportTicket;
use App\Models\User;
use App\Services\PasswordRecoveryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PasswordRecoveryController extends Controller
{
    public function __construct(private PasswordRecoveryService $recovery) {}

    public function gone(): JsonResponse
    {
        return response()->json(['message' => 'Phương thức OTP đã ngừng hỗ trợ.'], 410);
    }

    public function remaining(Request $request): JsonResponse
    {
        return response()->json(['remaining' => $this->recovery->remaining($request->user())]);
    }

    public function generate(Request $request): JsonResponse
    {
        $data = $request->validate(['current_password' => ['required', 'string', 'max:128']]);
        if ($request->user()->refresh()->is_locked) {
            return response()->json(['message' => 'Tài khoản đã bị khóa.'], 403);
        }
        $codes = $this->recovery->rotateSaved($request->user(), $data['current_password']);
        if ($codes === null) {
            return response()->json(['message' => 'Mật khẩu hiện tại không chính xác.', 'errors' => ['current_password' => ['Mật khẩu hiện tại không chính xác.']]], 422);
        }

        return response()->json(['codes' => $codes])->header('Cache-Control', 'no-store');
    }

    public function reset(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email', 'max:255'],
            'recovery_code' => ['required', 'string', 'max:64'],
            'password' => ['required', 'string', 'min:8', 'max:128', 'regex:/[A-Z]/', 'regex:/[0-9]/', 'regex:/[^A-Za-z0-9]/', 'confirmed'],
        ]);
        if (! $this->recovery->reset($data['email'], $data['recovery_code'], $data['password'])) {
            return response()->json(['message' => 'Email hoặc mã khôi phục không hợp lệ.'], 400);
        }

        return response()->json(['message' => 'Mật khẩu đã được thay đổi thành công.']);
    }

    public function support(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email', 'max:255'],
            'contact' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'min:20', 'max:2000'],
        ]);
        SupportTicket::create([
            'reporter_id' => null,
            'target_user_id' => User::where('email', $data['email'])->value('id'),
            'type' => 'other',
            'title' => 'Yêu cầu hỗ trợ khôi phục mật khẩu',
            'description' => "Email: {$data['email']}\nLiên hệ: {$data['contact']}\nMô tả: {$data['description']}",
            'status' => 'open',
        ]);

        return response()->json(['message' => 'Yêu cầu hỗ trợ đã được ghi nhận.']);
    }

    public function issueAdmin(Request $request, User $user): JsonResponse
    {
        $data = $request->validate([
            'current_password' => ['required', 'string', 'max:128'],
            'verification_note' => ['required', 'string', 'min:20', 'max:2000'],
        ]);
        $issued = $this->recovery->issueAdmin($request->user(), $user, $data['verification_note'], $data['current_password']);
        if ($issued === null) {
            return response()->json(['message' => 'Mật khẩu hiện tại không chính xác.', 'errors' => ['current_password' => ['Mật khẩu hiện tại không chính xác.']]], 422);
        }

        return response()->json($issued)->header('Cache-Control', 'no-store');
    }
}
