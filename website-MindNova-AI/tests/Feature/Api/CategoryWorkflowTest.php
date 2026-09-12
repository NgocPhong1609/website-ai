<?php

use App\Models\Category;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

function makeRoleUser(string $roleName): User
{
    $role = Role::query()->firstOrCreate(
        ['name' => $roleName],
        ['display_name' => $roleName, 'description' => $roleName]
    );

    $user = User::factory()->create([
        'password' => Hash::make('password'),
        'status' => 'active',
        'is_locked' => 0,
    ]);
    $user->roles()->syncWithoutDetaching([$role->id]);

    return $user;
}

test('instructor can list only active categories and propose a pending one', function () {
    Category::query()->create([
        'name' => 'Trí tuệ nhân tạo',
        'slug' => 'tri-tue-nhan-tao',
        'status' => 'active',
    ]);
    Category::query()->create([
        'name' => 'Chờ duyệt ẩn',
        'slug' => 'cho-duyet-an',
        'status' => 'pending',
    ]);

    $teacher = makeRoleUser('teacher');

    $this->actingAs($teacher, 'sanctum')
        ->getJson('/api/instructor/categories')
        ->assertOk()
        ->assertJsonMissing(['name' => 'Chờ duyệt ẩn'])
        ->assertJsonFragment(['name' => 'Trí tuệ nhân tạo']);

    $this->actingAs($teacher, 'sanctum')
        ->postJson('/api/instructor/categories', ['name' => 'Blockchain nông nghiệp'])
        ->assertCreated()
        ->assertJsonPath('data.status', 'pending');

    $this->assertDatabaseHas('categories', [
        'name' => 'Blockchain nông nghiệp',
        'status' => 'pending',
        'requested_by' => $teacher->id,
    ]);
});

test('admin can approve a teacher-requested category', function () {
    $admin = makeRoleUser('admin');
    $category = Category::query()->create([
        'name' => 'Fintech',
        'slug' => 'fintech',
        'status' => 'pending',
    ]);

    $this->actingAs($admin, 'sanctum')
        ->putJson('/api/admin/categories/'.$category->id, ['status' => 'active'])
        ->assertOk();

    expect($category->fresh()->status)->toBe('active');
});
