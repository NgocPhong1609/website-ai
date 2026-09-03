<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

class UserController extends Controller
{
    // 1. Lấy thông tin chi tiết của người dùng hiện tại đang đăng nhập
    public function getProfile(Request $request)
    {
        // Load kèm profile và danh sách quyền để Next.js dễ hiển thị UI
        $user = $request->user()->load(['profile', 'roles']);

        return response()->json([
            'message' => 'Lấy thông tin thành công',
            'data' => $user
        ], 200);
    }

    // 2. Cập nhật thông tin cá nhân
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|max:255|unique:users,email,' . $user->id,
            'learning_goal' => 'sometimes|string|max:255',
            'skill_level' => 'sometimes|in:beginner,intermediate,advanced',
            'bio' => 'sometimes|string',
            'phone' => 'sometimes|string|max:20',
            'address' => 'sometimes|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $userData = [];

        if ($request->has('name')) {
            $userData['name'] = $request->name;
        }

        if ($request->has('email')) {
            $userData['email'] = $request->email;
        }

        if (!empty($userData)) {
            $user->update($userData);
        }

        $user->profile()->updateOrCreate(
            ['user_id' => $user->id],
            $request->only(['learning_goal', 'skill_level', 'bio', 'phone', 'address'])
        );

        return response()->json([
            'message' => 'Cập nhật hồ sơ thành công',
            'data' => $user->fresh()->load('profile')
        ], 200);
    }

    // 3. Đổi mật khẩu
    public function changePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'current_password' => 'required',
            'new_password' => 'required|min:6|confirmed', // Yêu cầu biến new_password_confirmation
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = $request->user();

        // Kiểm tra mật khẩu cũ có khớp không
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Mật khẩu hiện tại không chính xác'], 400);
        }

        // Cập nhật mật khẩu mới
        $user->update([
            'password' => Hash::make($request->new_password)
        ]);

        return response()->json(['message' => 'Đổi mật khẩu thành công'], 200);
    }

    // 4. Upload ảnh đại diện (Avatar)
    public function uploadAvatar(Request $request)
    {
        $request->validate([
            'avatar' => ['required', 'file', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ]);

        $user = $request->user();

        if (!$request->hasFile('avatar')) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy file ảnh đại diện'
            ], 400);
        }

        try {
            $file = $request->file('avatar');
            $ext = strtolower($file->getClientOriginalExtension());
            if (!in_array($ext, ['jpg', 'jpeg', 'png', 'webp'])) {
                $ext = 'png';
            }

            $filename = 'avatar_' . \Illuminate\Support\Str::random(12) . '.' . $ext;
            $r2Folder = "Students/{$user->id}/Avatar";
            $r2Key = "{$r2Folder}/{$filename}";

            // Upload lên Cloudflare R2 với fallback local public disk
            try {
                \Illuminate\Support\Facades\Storage::disk('r2')->putFileAs($r2Folder, $file, $filename);
                $url = \Illuminate\Support\Facades\Storage::disk('r2')->url($r2Key);
            } catch (\Exception $e) {
                // Dự phòng nếu R2 không khả dụng
                $path = $file->storeAs('avatars', $filename, 'public');
                $url = asset('storage/' . $path);
            }

            // Xóa ảnh cũ nếu có
            if ($user->avatar_url) {
                if (str_contains($user->avatar_url, "Students/{$user->id}/Avatar")) {
                    $oldKey = parse_url($user->avatar_url, PHP_URL_PATH);
                    if ($oldKey) {
                        try {
                            \Illuminate\Support\Facades\Storage::disk('r2')->delete(ltrim($oldKey, '/'));
                        } catch (\Exception $e) {
                            // Suppress deletion error
                        }
                    }
                } elseif (str_contains($user->avatar_url, 'storage/avatars/')) {
                    $oldPath = str_replace(asset('storage/'), '', $user->avatar_url);
                    \Illuminate\Support\Facades\Storage::disk('public')->delete($oldPath);
                }
            }

            $user->avatar_url = $url;
            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'Cập nhật ảnh đại diện thành công',
                'avatar_url' => $url,
                'data' => [
                    'avatar_url' => $url,
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage() ?: 'Có lỗi xảy ra khi tải lên ảnh đại diện.',
            ], 422);
        }
    }

    // 5. Upload CV (dành cho giáo viên gửi hồ sơ xét duyệt)
    public function uploadCv(Request $request)
    {
        $request->validate([
            'cv' => 'required|mimes:pdf,doc,docx|max:5120',
        ]);

        $user = $request->user();
        $profile = $user->profile;

        if ($profile && $profile->cv_path) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($profile->cv_path);
        }

        $path = $request->file('cv')->store('teacher-cv', 'public');

        $user->profile()->updateOrCreate(['user_id' => $user->id], ['cv_path' => $path]);

        return response()->json([
            'message' => 'Tải lên CV thành công',
            'cv_url' => asset('storage/' . $path),
        ], 200);
    }

    // 6. Upload ảnh bằng cấp / chứng chỉ (có thể tải lên nhiều ảnh)
    public function uploadCredential(Request $request)
    {
        $request->validate([
            'credential' => 'required|image|mimes:jpeg,png,jpg,webp|max:4096',
            'title' => 'sometimes|string|max:255',
        ]);

        $user = $request->user();
        $path = $request->file('credential')->store('teacher-credentials', 'public');

        $credential = $user->credentials()->create([
            'title' => $request->input('title'),
            'file_path' => $path,
        ]);

        return response()->json([
            'message' => 'Tải lên bằng cấp thành công',
            'data' => [
                'id' => $credential->id,
                'title' => $credential->title,
                'file_url' => asset('storage/' . $credential->file_path),
            ],
        ], 201);
    }

    // 7. Xoá ảnh bằng cấp / chứng chỉ
    public function deleteCredential(Request $request, int $credentialId)
    {
        $credential = $request->user()->credentials()->where('id', $credentialId)->firstOrFail();

        \Illuminate\Support\Facades\Storage::disk('public')->delete($credential->file_path);
        $credential->delete();

        return response()->json(['message' => 'Xoá bằng cấp thành công'], 200);
    }

    // 8. Lưu cài đặt thông báo
    public function saveSettings(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'notification_email' => 'sometimes|boolean',
            'weekly_report' => 'sometimes|boolean',
            'ai_suggestions' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $settingsData = [];

        if ($request->has('notification_email')) {
            $settingsData['notification_email'] = (bool)$request->notification_email;
        }

        if ($request->has('weekly_report')) {
            $settingsData['weekly_report'] = (bool)$request->weekly_report;
        }

        if ($request->has('ai_suggestions')) {
            $settingsData['ai_suggestions'] = (bool)$request->ai_suggestions;
        }

        $user->update($settingsData);

        return response()->json([
            'message' => 'Cập nhật cài đặt thành công',
            'data' => [
                'notification_email' => $user->notification_email,
                'weekly_report' => $user->weekly_report,
                'ai_suggestions' => $user->ai_suggestions,
            ]
        ], 200);
    }
}
