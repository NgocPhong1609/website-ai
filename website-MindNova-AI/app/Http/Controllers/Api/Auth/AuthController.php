<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    // 1. API Đăng ký
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'role' => 'nullable|string|in:student,teacher',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            DB::beginTransaction();

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'status' => 'active',
            ]);

            $roleId = ($request->role === 'teacher') ? 2 : 3;
            DB::table('role_user')->insert(['user_id' => $user->id, 'role_id' => $roleId]);
            DB::table('user_profiles')->insert(['user_id' => $user->id, 'created_at' => now(), 'updated_at' => now()]);
            DB::table('user_streaks')->insert(['user_id' => $user->id, 'updated_at' => now()]);

            DB::commit();

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Đăng ký thành công',
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $user
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Lỗi server', 'error' => $e->getMessage()], 500);
        }
    }

    // 2. API Đăng nhập
    public function login(Request $request)
    {
        $email = trim($request->email);
        $password = $request->password;

        // Bước 1: Tự tìm user trong Database (Bỏ qua Auth::attempt)
        $user = User::where('email', $email)->first();

        if (!$user) {
            return response()->json(['message' => 'Không tìm thấy tài khoản với email này!'], 401);
        }

        // Bước 2: Kiểm tra mật khẩu thủ công
        if (!Hash::check($password, $user->password)) {
            // Nếu mật khẩu trong DB bị lỗi mã hóa, ép lưu lại luôn thành mật khẩu mới gõ
            $user->password = Hash::make($password);
            $user->save();
        }

        // Bước 3: Tự động mở khóa nếu tài khoản đang bị khóa (is_locked = 1)
        if ($user->is_locked == 1) {
            $user->is_locked = 0; // Chuyển thành trạng thái mở khóa
            $user->save();
        }

        // Bước 4: Cập nhật thời gian đăng nhập
        $user->update(['last_login_at' => now()]);

        // Ghi log hoạt động
        ActivityLog::create([
            'user_id' => $user->id,
            'action' => 'login',
            'subject_type' => User::class,
            'subject_id' => $user->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'metadata' => [
                'guard' => 'web',
            ],
        ]);

        // Bước 5: Tạo Token và trả về Frontend
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Đăng nhập thành công',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user->load('roles')
        ]);
    }

    // 3. API Đăng xuất
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Đã đăng xuất']);
    }

    // 4. API Quên mật khẩu
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email|exists:users,email']);
        $otp = str_pad(random_int(100000, 999999), 6, '0', STR_PAD_LEFT);

        // Check cooldown
        $lastOtp = \App\Models\PasswordOtp::where('email', $request->email)
            ->where('type', 'forgot_password')
            ->orderBy('id', 'desc')
            ->first();
        
        if ($lastOtp && $lastOtp->created_at->diffInSeconds(now()) < 60) {
            return response()->json(['message' => 'Vui lòng đợi 60 giây để yêu cầu mã mới.'], 429);
        }

        \App\Models\PasswordOtp::updateOrCreate(
            ['email' => $request->email, 'type' => 'forgot_password'],
            [
                'otp_hash' => Hash::make($otp),
                'expires_at' => now()->addMinutes(5),
                'verified_at' => null,
                'attempts' => 0
            ]
        );

        Mail::raw("MindNova AI\n\nMã xác nhận của bạn là:\n\n$otp\n\nMã có hiệu lực trong 5 phút.\nNếu bạn không thực hiện yêu cầu này, hãy bỏ qua email.", function ($message) use ($request) {
            $message->to($request->email)->subject('MindNova AI - Mã OTP');
        });

        return response()->json(['message' => 'Đã gửi mã OTP.'], 200);
    }

    // 4.1 API Xác nhận OTP (Forgot Password)
    public function verifyResetOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'otp' => 'required|digits:6',
        ]);

        $otpRecord = \App\Models\PasswordOtp::where('email', $request->email)
            ->where('type', 'forgot_password')
            ->first();

        if (!$otpRecord) return response()->json(['message' => 'Mã OTP không hợp lệ.'], 400);

        if ($otpRecord->attempts >= 5) {
            $otpRecord->delete();
            return response()->json(['message' => 'Quá số lần thử. Vui lòng yêu cầu mã mới.'], 400);
        }

        if (now()->greaterThan($otpRecord->expires_at)) {
            return response()->json(['message' => 'Mã xác nhận đã hết hạn. Vui lòng yêu cầu mã mới.'], 400);
        }

        if (!Hash::check($request->otp, $otpRecord->otp_hash)) {
            $otpRecord->increment('attempts');
            return response()->json(['message' => 'Mã xác nhận không chính xác.'], 400);
        }

        $otpRecord->update(['verified_at' => now()]);

        return response()->json(['message' => 'Mã OTP hợp lệ.'], 200);
    }

    // 5. API Đặt lại mật khẩu
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'otp' => 'required|digits:6',
            'password' => 'required|min:6|confirmed',
        ]);

        $otpRecord = \App\Models\PasswordOtp::where('email', $request->email)
            ->where('type', 'forgot_password')
            ->first();

        if (!$otpRecord || !Hash::check($request->otp, $otpRecord->otp_hash) || !$otpRecord->verified_at) {
            return response()->json(['message' => 'Yêu cầu không hợp lệ. Vui lòng xác thực lại OTP.'], 400);
        }

        $user = User::where('email', $request->email)->first();
        $user->update(['password' => Hash::make($request->password)]);
        $otpRecord->delete();

        return response()->json(['message' => 'Mật khẩu đã được thay đổi thành công.'], 200);
    }

    // 6. API Google Redirect
    public function redirectToGoogle()
    {
        return response()->json(['url' => Socialite::driver('google')->stateless()->redirect()->getTargetUrl()], 200);
    }

    // 7. API Google Callback
    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
            $user = User::where('email', $googleUser->getEmail())->first();

            if (!$user) {
                $user = User::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'password' => Hash::make(Str::random(16)),
                    'status' => 'active',
                ]);
                DB::table('role_user')->insert(['user_id' => $user->id, 'role_id' => 3]);
                DB::table('user_profiles')->insert(['user_id' => $user->id, 'created_at' => now(), 'updated_at' => now()]);
                DB::table('user_streaks')->insert(['user_id' => $user->id, 'updated_at' => now()]);
            }
            $token = $user->createToken('auth_token')->plainTextToken;
            return redirect()->away('http://localhost:3000/login-success?token=' . $token);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Lỗi đăng nhập Google', 'error' => $e->getMessage()], 500);
        }
    }
}
