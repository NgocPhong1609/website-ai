<?php
$user = \App\Models\User::where('email', 'teacher@mindnova.ai')->first();
if ($user) {
    echo "TOKEN: " . $user->createToken('dev-token')->plainTextToken;
} else {
    echo "User not found";
}
