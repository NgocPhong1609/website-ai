<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

test('api profile can be updated', function () {
    $user = User::factory()->create([
        'name' => 'Old Name',
        'email' => 'old@example.com',
    ]);

    $response = $this->actingAs($user, 'sanctum')
        ->postJson('/api/profile/update', [
            'name' => 'New Name',
            'email' => 'new@example.com',
        ]);

    $response->assertOk()
        ->assertJson([
            'message' => 'Cập nhật hồ sơ thành công',
        ]);

    $user->refresh();
    expect($user->name)->toBe('New Name');
    expect($user->email)->toBe('new@example.com');
});

test('api password can be changed with valid passwords', function () {
    $user = User::factory()->create([
        'password' => Hash::make('Abcdef1!'),
    ]);

    $response = $this->actingAs($user, 'sanctum')
        ->postJson('/api/profile/change-password', [
            'current_password' => 'Abcdef1!',
            'new_password' => 'NewSecret9@',
            'new_password_confirmation' => 'NewSecret9@',
        ]);

    $response->assertOk()
        ->assertJson([
            'message' => 'Đổi mật khẩu thành công',
        ]);

    $user->refresh();
    expect(Hash::check('NewSecret9@', $user->password))->toBeTrue();
});

test('current_password validation requires min 8 chars, uppercase, digit, special character', function (string $password, bool $isValid) {
    $user = User::factory()->create([
        'password' => Hash::make($password),
    ]);

    $response = $this->actingAs($user, 'sanctum')
        ->postJson('/api/profile/change-password', [
            'current_password' => $password,
            'new_password' => 'ValidPass1!',
            'new_password_confirmation' => 'ValidPass1!',
        ]);

    if ($isValid) {
        $response->assertOk();
    } else {
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['current_password']);
    }
})->with([
    ['12345678', false],  // thiếu hoa, đặc biệt
    ['abcdefgh', false],  // thiếu hoa, số, đặc biệt
    ['Abcdefgh', false],  // thiếu số, đặc biệt
    ['Abcdefg1', false],  // thiếu đặc biệt
    ['Abcdef1!', true],   // hợp lệ: 8 ký tự, 1 hoa, 1 số, 1 đặc biệt
    ['Abc123!', false],   // không hợp lệ vì dưới 8 ký tự
]);

test('api settings can be saved', function () {
    $user = User::factory()->create([
        'notification_email' => true,
        'weekly_report' => true,
        'ai_suggestions' => true,
    ]);

    $response = $this->actingAs($user, 'sanctum')
        ->postJson('/api/profile/settings', [
            'notification_email' => false,
            'weekly_report' => false,
            'ai_suggestions' => false,
        ]);

    $response->assertOk()
        ->assertJson([
            'message' => 'Cập nhật cài đặt thành công',
            'data' => [
                'notification_email' => false,
                'weekly_report' => false,
                'ai_suggestions' => false,
            ]
        ]);

    $user->refresh();
    expect($user->notification_email)->toBeFalse();
    expect($user->weekly_report)->toBeFalse();
    expect($user->ai_suggestions)->toBeFalse();
});
