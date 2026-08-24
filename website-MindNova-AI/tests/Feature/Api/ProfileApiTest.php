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

test('api password can be changed', function () {
    $user = User::factory()->create([
        'password' => Hash::make('old-password'),
    ]);

    $response = $this->actingAs($user, 'sanctum')
        ->postJson('/api/profile/change-password', [
            'current_password' => 'old-password',
            'new_password' => 'new-password',
            'new_password_confirmation' => 'new-password',
        ]);

    $response->assertOk()
        ->assertJson([
            'message' => 'Đổi mật khẩu thành công',
        ]);

    $user->refresh();
    expect(Hash::check('new-password', $user->password))->toBeTrue();
});

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
