<?php

namespace App\Services;

use App\Models\AdminLog;
use App\Models\PasswordRecoveryCode;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class PasswordRecoveryService
{
    public static function normalize(string $code): string
    {
        return strtolower(str_replace('-', '', trim($code)));
    }

    private function newCode(): string
    {
        return implode('-', str_split(bin2hex(random_bytes(16)), 8));
    }

    public function remaining(User $user): int
    {
        return PasswordRecoveryCode::where('user_id', $user->id)
            ->where('kind', 'saved')->count();
    }

    public function rotateSaved(User $user, string $currentPassword): ?array
    {
        return DB::transaction(function () use ($user, $currentPassword) {
            $fresh = User::whereKey($user->id)->lockForUpdate()->firstOrFail();
            if ($fresh->is_locked || ! Hash::check($currentPassword, $fresh->password)) {
                return null;
            }
            PasswordRecoveryCode::where('user_id', $user->id)->delete();
            $codes = [];
            for ($i = 0; $i < 8; $i++) {
                $code = $this->newCode();
                PasswordRecoveryCode::create([
                    'user_id' => $user->id,
                    'code_hash' => hash('sha256', self::normalize($code)),
                    'kind' => 'saved',
                ]);
                $codes[] = $code;
            }

            return $codes;
        });
    }

    public function issueAdmin(User $actor, User $target, string $note, string $currentPassword): ?array
    {
        return DB::transaction(function () use ($actor, $target, $note, $currentPassword) {
            $actor = User::whereKey($actor->id)->lockForUpdate()->firstOrFail();
            if (! $actor->isAdmin() || $actor->is_locked || ! Hash::check($currentPassword, $actor->password)) {
                return null;
            }
            $target = User::whereKey($target->id)->lockForUpdate()->firstOrFail();
            if ($target->isAdmin() || $target->is_locked) {
                abort(403, 'Không thể cấp mã khôi phục cho tài khoản này.');
            }
            PasswordRecoveryCode::where('user_id', $target->id)->where('kind', 'admin')->delete();
            $code = $this->newCode();
            $expiry = now()->addMinutes(30);
            PasswordRecoveryCode::create([
                'user_id' => $target->id,
                'code_hash' => hash('sha256', self::normalize($code)),
                'kind' => 'admin',
                'expires_at' => $expiry,
            ]);
            AdminLog::create([
                'admin_id' => $actor->id,
                'action' => 'password_recovery_issued',
                'target_type' => User::class,
                'target_id' => $target->id,
                'details' => $note,
            ]);
            $frontend = rtrim(config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:3000')), '/');

            return [
                'reset_url' => $frontend.'/forgot-password#email='.rawurlencode($target->email).'&recovery_code='.rawurlencode($code),
                'expires_at' => $expiry->toIso8601String(),
            ];
        });
    }

    public function reset(string $email, string $code, string $password): bool
    {
        $normalized = self::normalize($code);
        if (! preg_match('/^[a-f0-9]{32}$/', $normalized)) {
            return false;
        }

        return DB::transaction(function () use ($email, $normalized, $password) {
            $user = User::where('email', $email)->lockForUpdate()->first();
            if (! $user) {
                return false;
            }
            $credential = PasswordRecoveryCode::where('user_id', $user->id)
                ->where('code_hash', hash('sha256', $normalized))
                ->where(function ($query) {
                    $query->whereNull('expires_at')->orWhere('expires_at', '>', now());
                })->first();
            if (! $credential) {
                return false;
            }
            $user->forceFill(['password' => Hash::make($password), 'remember_token' => Str::random(60)])->save();
            PasswordRecoveryCode::where('user_id', $user->id)->delete();
            $user->tokens()->delete();
            DB::table('sessions')->where('user_id', $user->id)->delete();

            return true;
        });
    }
}
