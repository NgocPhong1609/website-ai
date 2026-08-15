<?php

namespace App\Services\Ai;

use App\DTOs\AiMessageDto;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

class GeminiAiService extends AbstractAiService
{
    public function getProviderName(): string
    {
        return "gemini";
    }

    public function sendMessage(array $messages, array $options = []): string
    {
        $apiKey = config("services.gemini.api_key");
        $model = config("services.gemini.model", "gemini-1.5-flash");
        $url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}";

        // Chuyen doi messages tu AiMessageDto sang format cua Gemini
        $contents = [];
        $systemInstruction = null;

        foreach ($messages as $msg) {
            /** @var AiMessageDto $msg */
            if ($msg->role === "system") {
                $systemInstruction = [
                    "parts" => [
                        ["text" => $msg->content]
                    ]
                ];
            } else {
                $role = $msg->role === "user" ? "user" : "model";
                $contents[] = [
                    "role" => $role,
                    "parts" => [
                        ["text" => $msg->content]
                    ]
                ];
            }
        }

        $payload = [
            "contents" => $contents,
        ];

        if ($systemInstruction) {
            $payload["systemInstruction"] = $systemInstruction;
        }

        if (!empty($options['response_mime_type'])) {
            $payload['generationConfig'] = [
                'responseMimeType' => $options['response_mime_type']
            ];
        }

        $maxRetries = $options['max_retries'] ?? 4;
        $lastException = null;

        for ($attempt = 1; $attempt <= $maxRetries; $attempt++) {
            try {
                // Simulate failure in development
                if (env('AI_FORCE_PRIMARY_FAILURE', false)) {
                    Log::warning("AI_FORCE_PRIMARY_FAILURE is true, simulating 503 error.");
                    $response = Http::response('Service Unavailable', 503);
                } else {
                    $response = Http::withHeaders([
                        "Content-Type" => "application/json",
                    ])->timeout(90)->post($url, $payload);
                }

                if ($response->successful()) {
                    $data = $response->json();
                    
                    // Trich xuat noi dung tra ve
                    $responseContent = $data["candidates"][0]["content"]["parts"][0]["text"] ?? "No response";

                    // Trich xuat usage metadata
                    $promptTokens = $data["usageMetadata"]["promptTokenCount"] ?? 0;
                    $completionTokens = $data["usageMetadata"]["candidatesTokenCount"] ?? 0;

                    // Ghi log (co the dieu chinh model, feature, user_id tu $options)
                    $userId = $options["user_id"] ?? null;
                    $feature = $options["feature"] ?? "general";
                    
                    if ($userId) {
                        $this->logUsage($userId, $model, $feature, $promptTokens, $completionTokens, 0, $payload);
                    }

                    return $responseContent;
                }

                // Neu gap loi 503 (Service Unavailable) hoac 429 (Rate Limit) hoac timeout, retry
                if (in_array($response->status(), [503, 429, 500, 502, 504]) && $attempt <= $maxRetries) {
                    if ($attempt < $maxRetries) {
                        $waitSeconds = pow(2, $attempt - 1); // 1s, 2s, 4s
                        Log::warning("Gemini API returned {$response->status()}, retrying in {$waitSeconds}s (attempt {$attempt}/{$maxRetries})");
                        sleep($waitSeconds);
                        continue;
                    } else {
                        // Thrown on max attempts reached
                        Log::error("Gemini API Error: Transient error {$response->status()} after {$maxRetries} attempts. " . $response->body());
                        throw new \App\Exceptions\AiTransientException("Gemini transient error: " . $response->status());
                    }
                }
                
                // 404 is usually a wrong model name, but we should fallback to Backup AI to not disrupt user experience
                if ($response->status() === 404) {
                    Log::error("Gemini API Error 404: Model not found. Throwing transient exception to trigger fallback immediately. " . $response->body());
                    throw new \App\Exceptions\AiTransientException("Gemini model not found (404)");
                }

                Log::error("Gemini API Error: " . $response->body());
                throw new Exception("Loi khi goi Gemini API: " . $response->status());
                
            } catch (Exception $e) {
                $lastException = $e;
                if ($e instanceof \App\Exceptions\AiTransientException) {
                    throw $e;
                }
                if (str_contains($e->getMessage(), 'Loi khi goi Gemini API') && $attempt >= $maxRetries) {
                    throw $e;
                }
                
                // If it's a network error (like ConnectionException), we can treat it as transient
                $isNetworkError = $e instanceof \Illuminate\Http\Client\ConnectionException || str_contains($e->getMessage(), 'cURL error');
                if ($isNetworkError && $attempt <= $maxRetries) {
                    if ($attempt < $maxRetries) {
                        $waitSeconds = pow(2, $attempt - 1);
                        Log::warning("Gemini API Network Exception on attempt {$attempt}: {$e->getMessage()}, retrying in {$waitSeconds}s");
                        sleep($waitSeconds);
                        continue;
                    } else {
                        throw new \App\Exceptions\AiTransientException("Gemini network transient error: " . $e->getMessage());
                    }
                }
                
                Log::error("Gemini API Exception after {$maxRetries} attempts: " . $e->getMessage());
                throw $e;
            }
        }

        throw $lastException ?? new Exception("Gemini API failed after {$maxRetries} attempts");
    }
}
