<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$request = Illuminate\Http\Request::create('api/test', 'GET');
$request->headers->set('Accept', 'application/json');
$e = new \Symfony\Component\HttpKernel\Exception\NotFoundHttpException();
$handler = app(\Illuminate\Contracts\Debug\ExceptionHandler::class);
$response = $handler->render($request, $e);
echo $response->getContent();
