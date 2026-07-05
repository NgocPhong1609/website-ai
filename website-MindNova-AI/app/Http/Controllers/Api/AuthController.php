<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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

            DB::table('role_user')->insert(['user_id' => $user->id, 'role_id' => 3]);
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
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Sai email hoặc mật khẩu'], 401);
        }

        $user = User::where('email', $request->email)->firstOrFail();
        $user->update(['last_login_at' => now()]);

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

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $request->email],
            ['token' => $otp, 'created_at' => now()]
        );

        Mail::raw("Mã OTP khôi phục mật khẩu là: $otp", function ($message) use ($request) {
            $message->to($request->email)->subject('MindNova AI - Mã OTP');
        });

        return response()->json(['message' => 'Đã gửi mã OTP.'], 200);
    }

    // 5. API Đặt lại mật khẩu
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'otp' => 'required|digits:6',
            'password' => 'required|min:6|confirmed',
        ]);

        $resetRecord = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->where('token', $request->otp)
            ->first();

        if (!$resetRecord) return response()->json(['message' => 'Mã OTP không hợp lệ.'], 400);

        $user = User::where('email', $request->email)->first();
        $user->update(['password' => Hash::make($request->password)]);
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Đặt lại mật khẩu thành công.'], 200);
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
