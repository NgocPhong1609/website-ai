<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * Check if the authenticated user has one of the required roles
     * via the role_user pivot table and roles table.
     *
     * Usage: middleware('role:teacher') or middleware('role:admin,teacher')
     *
     * @param  Closure(Request): (Response)  $next
     * @param  string  ...$roles
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.',
            ], 401);
        }

        // Expand required roles to include aliases (e.g., teacher <-> instructor)
        $expandedRoles = [];
        foreach ($roles as $r) {
            $expandedRoles[] = $r;
            if ($r === 'teacher') $expandedRoles[] = 'instructor';
            if ($r === 'instructor') $expandedRoles[] = 'teacher';
        }

        // Check if user has any of the required roles via pivot table
        $hasRole = $user->roles()->whereIn('name', $expandedRoles)->exists();

        // Fallback: check users.role column
        if (!$hasRole) {
            $legacyRole = (string) ($user->getRawOriginal('role') ?? $user->role ?? '');
            if ($legacyRole !== '' && in_array($legacyRole, $expandedRoles, true)) {
                $hasRole = true;
            }
        }

        if (!$hasRole) {
            return response()->json([
                'success' => false,
                'message' => 'Forbidden. You do not have the required role.',
            ], 403);
        }

        return $next($request);
    }
}