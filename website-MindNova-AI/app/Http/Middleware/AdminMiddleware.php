<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $adminSecret = env('ADMIN_SECRET', 'admin-secret');
        if ($request->header('x-admin-secret') === $adminSecret) {
            return $next($request);
        }

        $userId = $request->header('x-user-id');
        if ($userId && User::find($userId)?->isAdmin()) {
            return $next($request);
        }

        return response()->json(['message' => 'Unauthorized. Admin access required.'], 401);
    }
}
