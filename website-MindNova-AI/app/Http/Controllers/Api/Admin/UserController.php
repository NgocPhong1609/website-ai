<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // 1. Lấy danh sách toàn bộ người dùng (Có phân trang)
    public function index(Request $request)
    {
        // Có thể thêm tính năng tìm kiếm theo tên hoặc email
        $query = User::with(['profile', 'roles']);

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
        }

        // Trả về danh sách, mỗi trang 10 người
        $users = $query->paginate(10);

        return response()->json($users, 200);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['nullable', 'string', 'in:student,teacher,admin'],
            'status' => ['nullable', 'string', 'max:50'],
            'is_locked' => ['nullable', 'boolean'],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'status' => $data['status'] ?? 'active',
            'is_locked' => $data['is_locked'] ?? false,
        ]);

        $roleName = $data['role'] ?? 'student';
        $role = Role::where('name', $roleName)->first();

        if ($role) {
            $user->roles()->sync([$role->id]);
        }

        return response()->json([
            'message' => 'User created successfully.',
            'data' => $user,
        ], 201);
    }

    // 2. Khóa / Mở khóa tài khoản người dùng
    public function toggleStatus($id)
    {
        $user = User::findOrFail($id);

        // Không cho phép Admin tự khóa chính mình
        if (Auth::id() == $user->id) {
            return response()->json(['message' => 'Không thể tự khóa tài khoản của mình!'], 403);
        }

        $user->status = $user->status === 'active' ? 'banned' : 'active';
        $user->save();

        return response()->json([
            'message' => 'Đã thay đổi trạng thái tài khoản thành ' . $user->status,
            'user' => $user
        ], 200);
    }

    // 3. Xóa người dùng (Tùy chọn)
    public function destroy($id)
    {
        $user = User::findOrFail($id);

        if (Auth::d() == $user->id) {
            return response()->json(['message' => 'Không thể tự xóa chính mình!'], 403);
        }

        $user->delete(); // Sẽ thực hiện Soft Delete vì bạn đã cấu hình trong DB

        return response()->json(['message' => 'Xóa người dùng thành công'], 200);
    }
}
