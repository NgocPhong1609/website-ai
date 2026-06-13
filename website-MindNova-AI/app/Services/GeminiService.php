<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiService
{
    /**
     * Gemini API endpoint base URL.
     */
    private string $baseUrl;

    /**
     * Gemini API key.
     */
    private string $apiKey;

    /**
     * Gemini model name.
     */
    private string $model;

    public function __construct()
    {
        $this->apiKey = config('services.gemini.api_key', '');
        $this->model = config('services.gemini.model', 'gemini-2.0-flash');
        $this->baseUrl = config(
            'services.gemini.base_url',
            'https://generativelanguage.googleapis.com/v1beta'
        );
    }

    /**
     * Gửi prompt đến Gemini và nhận JSON response.
     *
     * @param string $systemPrompt System instruction cho Gemini
     * @param string $userPrompt User message chứa dữ liệu
     * @return array|null Parsed JSON response hoặc null nếu lỗi
     */
    public function generateJson(string $systemPrompt, string $userPrompt): ?array
    {
        if (empty($this->apiKey)) {
            Log::error('GeminiService: API key is not configured.');
            return null;
        }

        $url = sprintf(
            '%s/models/%s:generateContent?key=%s',
            $this->baseUrl,
            $this->model,
            $this->apiKey
        );

        $payload = [
            'system_instruction' => [
                'parts' => [
                    ['text' => $systemPrompt],
                ],
            ],
            'contents' => [
                [
                    'parts' => [
                        ['text' => $userPrompt],
                    ],
                ],
            ],
            'generationConfig' => [
                'responseMimeType' => 'application/json',
                'temperature' => 0.3,
            ],
        ];

        try {
            $response = Http::timeout(30)
                ->withHeaders(['Content-Type' => 'application/json'])
                ->post($url, $payload);

            if (!$response->successful()) {
                Log::error('GeminiService: API request failed.', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
                return null;
            }

            $body = $response->json();

            // Extract text from Gemini response structure
            $text = $body['candidates'][0]['content']['parts'][0]['text'] ?? null;

            if (empty($text)) {
                Log::error('GeminiService: Empty response from Gemini.', [
                    'body' => $body,
                ]);
                return null;
            }

            // Parse JSON from response text
            $decoded = json_decode($text, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                Log::error('GeminiService: Failed to parse JSON response.', [
                    'text' => $text,
                    'error' => json_last_error_msg(),
                ]);
                return null;
            }

            return $decoded;
        } catch (\Exception $e) {
            Log::error('GeminiService: Exception occurred.', [
                'message' => $e->getMessage(),
            ]);
            return null;
        }
    }
}
