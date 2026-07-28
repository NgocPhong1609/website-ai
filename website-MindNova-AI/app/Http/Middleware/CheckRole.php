<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (!$request->user()) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Bạn chưa đăng nhập!'], 401);
            }

            return redirect()->route('login');
        }

        $user = $request->user();
        $userRoles = $user->roles->pluck('name')->toArray();
        $legacyRole = (string) ($user->getRawOriginal('role') ?? '');

        if ($legacyRole !== '') {
            $userRoles[] = $legacyRole;
        }

        foreach ($roles as $role) {
            if (in_array($role, $userRoles, true)) {
                return $next($request);
            }
        }

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Bạn không có quyền truy cập chức năng này (Forbidden)',
            ], 403);
        }

        if (in_array('admin', $roles, true)) {
            return redirect()->route('client.dashboard');
        }

        return redirect()->route('dashboard');
    }
}
