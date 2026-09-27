<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'broadcasting/auth', 'api/broadcasting/auth'],

    'allowed_methods' => ['*'],

    // Override the complete list for each environment; keep existing defaults.
    'allowed_origins' => array_values(array_unique(array_filter(array_map(
        static fn (string $origin): string => rtrim(trim($origin), '/'),
        explode(',', env('CORS_ALLOWED_ORIGINS', implode(',', [
            env('FRONTEND_URL', 'http://localhost:3000'),
            'http://127.0.0.1:3000',
            'http://localhost:3000',
            'http://127.0.0.1:8000',
        ])))
    )))),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];
