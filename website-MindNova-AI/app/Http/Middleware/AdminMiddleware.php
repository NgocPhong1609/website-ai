<?php

namespace App\Http\Middleware;

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

        $user = $request->user();
        if ($user?->isAdmin()) {
            return $next($request);
        }

        if ($request->expectsJson()) {
            return response()->json(['message' => 'Unauthorized. Admin access required.'], 403);
        }

        return redirect()->route('client.dashboard');
    }
}
