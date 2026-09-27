<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureRecoverySessionCurrent
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::guard('web')->user();
        if ($user && $user->password_recovery_version !== null) {
            $sessionVersion = session()->get('password_recovery_version');
            if (! is_string($sessionVersion) || ! hash_equals($user->password_recovery_version, $sessionVersion)) {
                Auth::guard('web')->logoutCurrentDevice();
                session()->invalidate();
                session()->regenerateToken();

                return $request->expectsJson()
                    ? response()->json(['message' => 'Phiên đăng nhập đã hết hạn.'], 401)
                    : redirect()->route('login');
            }
        }

        return $next($request);
    }
}
