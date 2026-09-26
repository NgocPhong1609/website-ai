<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
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
                'is_locked' => 0,
            ]);

            $roleName = $request->role === 'teacher' ? 'teacher' : 'student';
            $roleId = Role::idFor($roleName);

DB::table('role_user')->insert([
    'user_id' => $user->id, 
    'role_id' => $roleId,
    'created_at' => now(),
    'updated_at' => now()
]);

DB::table('user_profiles')->insert([
    'user_id' => $user->id, 
    'created_at' => now(), 
    'updated_at' => now()
]);

// Bảng này không có cột created_at
DB::table('user_streaks')->insert([
    'user_id' => $user->id, 
    'updated_at' => now()
]);

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
            return response()->json([
                'message' => 'Lỗi server khi đăng ký', 
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // 2. API Đăng nhập
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        return DB::transaction(function () use ($request) {
            $user = User::where('email', trim($request->email))->lockForUpdate()->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json(['message' => 'Email hoặc mật khẩu không chính xác!'], 401);
            }

            if ($user->is_locked == 1) {
                return response()->json(['message' => 'Tài khoản của bạn hiện đang bị khóa!'], 403);
            }

            $user->update(['last_login_at' => now()]);

            ActivityLog::create([
                'user_id' => $user->id,
                'action' => 'login',
                'subject_type' => User::class,
                'subject_id' => $user->id,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'metadata' => ['guard' => 'web'],
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Đăng nhập thành công',
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $user->load('roles')
            ], 200);
        });
    }

    // 3. API Đăng xuất
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Đã đăng xuất']);
    }

    // 6. Google Redirect
    public function redirectToGoogle()
    {
        return response()->json(['url' => Socialite::driver('google')->stateless()->redirect()->getTargetUrl()], 200);
    }

    // 7. Google Callback
    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
            
            DB::beginTransaction();

            $user = User::where('email', $googleUser->getEmail())->first();

            if (!$user) {
                $user = User::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'password' => Hash::make(Str::random(16)),
                    'status' => 'active',
                    'is_locked' => 0,
                ]);

                DB::table('role_user')->insert([
                    'user_id' => $user->id,
                    'role_id' => Role::idFor('student'),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                DB::table('user_profiles')->insert(['user_id' => $user->id, 'created_at' => now(), 'updated_at' => now()]);
                DB::table('user_streaks')->insert(['user_id' => $user->id, 'created_at' => now(), 'updated_at' => now()]);
            } else {
                if (empty($user->google_id)) {
                    $user->update(['google_id' => $googleUser->getId()]);
                }
            }

            DB::commit();

            $token = $user->createToken('auth_token')->plainTextToken;
            return redirect()->away(rtrim(config('app.frontend_url'), '/') . '/login-success?token=' . rawurlencode($token));

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Lỗi đăng nhập Google', 'error' => $e->getMessage()], 500);
        }
    }
}
