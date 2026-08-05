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

        try {
            $response = Http::withHeaders([
                "Content-Type" => "application/json",
            ])->post($url, $payload);

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

            Log::error("Gemini API Error: " . $response->body());
            throw new Exception("Loi khi goi Gemini API: " . $response->status());
            
        } catch (Exception $e) {
            Log::error("Gemini API Exception: " . $e->getMessage());
            throw $e;
        }
    }
}
