<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('it removes only E2E test accounts', function () {
    $e2e = User::factory()->create(['email' => 'e2e.student.123@mindnova.test']);
    $real = User::factory()->create(['email' => 'real.student@example.com']);

    $this->artisan('e2e:purge-users')->assertSuccessful();

    expect(User::find($e2e->id))->toBeNull()
        ->and(User::find($real->id))->not->toBeNull();
});

test('dry run keeps every account', function () {
    $e2e = User::factory()->create(['email' => 'e2e.student.456@mindnova.test']);

    $this->artisan('e2e:purge-users', ['--dry-run' => true])->assertSuccessful();

    expect(User::find($e2e->id))->not->toBeNull();
});
