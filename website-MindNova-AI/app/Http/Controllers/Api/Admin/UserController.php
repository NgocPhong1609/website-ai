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
    public function index(Request $request): JsonResponse
    {
        $query = User::with(['roles']);

        if ($request->filled('search')) {
            $keyword = trim((string) $request->string('search'));
            $query->where(function ($subQuery) use ($keyword): void {
                $subQuery->where('name', 'like', '%' . $keyword . '%')
                    ->orWhere('email', 'like', '%' . $keyword . '%');
            });
        }

        $users = $query->latest()->paginate(10);

        return response()->json($users);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['nullable', 'string', 'in:student,teacher,admin'],
            'status' => ['nullable', 'in:active,banned'],
            'is_locked' => ['nullable', 'boolean'],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => $data['role'] ?? 'student',
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

    public function toggleStatus(int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        if (Auth::id() == $user->id) {
            return response()->json(['message' => 'Không thể tự khóa tài khoản của mình!'], 403);
        }

        $isBanned = $user->status === 'active';
        $user->status = $isBanned ? 'banned' : 'active';
        $user->is_locked = $isBanned;
        $user->save();

        return response()->json([
            'message' => 'Đã thay đổi trạng thái tài khoản thành ' . $user->status,
            'data' => $user,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        if (Auth::id() == $user->id) {
            return response()->json(['message' => 'Không thể tự xóa chính mình!'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'Xóa người dùng thành công']);
    }
}
