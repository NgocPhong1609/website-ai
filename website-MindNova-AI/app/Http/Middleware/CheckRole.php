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
        $legacyRole = (string) ($user->getRawOriginal('role') ?? $user->role ?? '');

        if ($legacyRole !== '') {
            $userRoles[] = $legacyRole;
        }

        // Expand required roles to include aliases
        $expandedRoles = [];
        foreach ($roles as $r) {
            $expandedRoles[] = $r;
            if ($r === 'teacher') $expandedRoles[] = 'instructor';
            if ($r === 'instructor') $expandedRoles[] = 'teacher';
            if ($r === 'student') $expandedRoles[] = 'learner';
        }

        $hasRole = false;
        foreach ($expandedRoles as $role) {
            if (in_array(strtolower($role), array_map('strtolower', $userRoles), true)) {
                $hasRole = true;
                break;
            }
        }

        if (!$hasRole) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Bạn không có quyền truy cập chức năng này (Forbidden)',
                ], 403);
            }

            if (in_array('admin', $roles, true)) {
                return redirect()->route('client.dashboard');
            }

            return redirect()->route('dashboard');
        }

        return $next($request);
    }
}
