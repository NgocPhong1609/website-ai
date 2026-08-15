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
            'learning_goal' => 'sometimes|string|max:255',
            'skill_level' => 'sometimes|in:beginner,intermediate,advanced',
            'bio' => 'sometimes|string',
            'phone' => 'sometimes|string|max:20',
            'address' => 'sometimes|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Cập nhật bảng users (nếu có gửi lên name)
        if ($request->has('name')) {
            $user->update(['name' => $request->name]);
        }

        // Cập nhật bảng user_profiles
        // Sử dụng updateOrCreate để phòng trường hợp user chưa có record trong bảng profiles
        $user->profile()->updateOrCreate(
            ['user_id' => $user->id],
            $request->only(['learning_goal', 'skill_level', 'bio', 'phone', 'address'])
        );

        return response()->json([
            'message' => 'Cập nhật hồ sơ thành công',
            'data' => $user->load('profile')
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
            // Bắt buộc phải là file ảnh, tối đa 2MB
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $user = $request->user();

        if ($request->hasFile('avatar')) {
            // Xóa ảnh cũ nếu có (tùy chọn, để tiết kiệm dung lượng server)
            if ($user->avatar_url) {
                $oldPath = str_replace(asset('storage/'), '', $user->avatar_url);
                \Illuminate\Support\Facades\Storage::disk('public')->delete($oldPath);
            }

            // Lưu ảnh mới vào thư mục storage/app/public/avatars
            $avatarName = time() . '_' . $user->id . '.' . $request->avatar->extension();
            $path = $request->avatar->storeAs('avatars', $avatarName, 'public');

            // Cập nhật URL vào database
            $user->update([
                'avatar_url' => asset('storage/' . $path)
            ]);

            return response()->json([
                'message' => 'Cập nhật ảnh đại diện thành công',
                'avatar_url' => $user->avatar_url
            ], 200);
        }

        return response()->json(['message' => 'Không tìm thấy file ảnh'], 400);
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
}
