<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // 1. Kiểm tra xem người dùng đã đăng nhập chưa
        if (!$request->user()) {
            return response()->json(['message' => 'Bạn chưa đăng nhập!'], 401);
        }

        // 2. Lấy danh sách các quyền (role) của user hiện tại
        $userRoles = $request->user()->roles->pluck('name')->toArray();

        // 3. Kiểm tra xem user có quyền nào khớp với quyền được yêu cầu không
        foreach ($roles as $role) {
            if (in_array($role, $userRoles)) {
                return $next($request); // Cho phép đi tiếp
            }
        }

        // 4. Nếu không có quyền -> Báo lỗi 403
        return response()->json([
            'message' => 'Bạn không có quyền truy cập chức năng này (Forbidden)'
        ], 403);
    }
}
