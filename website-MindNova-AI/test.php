<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$user = \App\Models\User::find(83);
$req = Illuminate\Http\Request::create('/api/instructor/discussions', 'GET');
// By passing the user, Laravel might still redirect if we don't bind it to the auth guard
$app['auth']->guard('sanctum')->setUser($user);
$req->setUserResolver(function() use ($user) { return $user; });
$response = $kernel->handle($req);
echo $response->getContent();
