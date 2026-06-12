<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminLog;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(): JsonResponse
    {
        $users = User::latest()->get();

        return response()->json(['data' => $users]);
    }

    public function show(User $user): JsonResponse
    {
        return response()->json(['data' => $user]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['nullable', 'in:user,admin'],
            'is_locked' => ['nullable', 'boolean'],
        ]);

        $data['password'] = bcrypt($data['password']);
        $user = User::create($data);

        $this->logAdminAction($request, 'create_user', $user, 'Created a new user account.');

        return response()->json(['message' => 'User created.', 'data' => $user], 201);
    }

    public function update(Request $request, User $user): JsonResponse
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'password' => ['sometimes', 'nullable', 'string', 'min:8'],
            'role' => ['sometimes', 'in:user,admin'],
            'is_locked' => ['sometimes', 'boolean'],
        ]);

        if (array_key_exists('password', $data) && $data['password']) {
            $data['password'] = bcrypt($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);
        $this->logAdminAction($request, 'update_user', $user, 'Updated user information.');

        return response()->json(['message' => 'User updated.', 'data' => $user]);
    }

    public function destroy(Request $request, User $user): JsonResponse
    {
        $user->delete();
        $this->logAdminAction($request, 'delete_user', $user, 'Deleted a user account.');

        return response()->json(['message' => 'User deleted.']);
    }

    protected function logAdminAction(Request $request, string $action, User $target, string $details): void
    {
        AdminLog::create([
            'admin_id' => $request->header('x-admin-user-id'),
            'action' => $action,
            'target_type' => User::class,
            'target_id' => $target->id,
            'details' => $details,
            'metadata' => [
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ],
        ]);
    }
}
