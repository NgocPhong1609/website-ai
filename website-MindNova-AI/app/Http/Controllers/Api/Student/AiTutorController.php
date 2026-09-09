<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\AiModerationFlag;
use App\Models\AiUsageLog;
use App\Models\User;
use App\Settings\AiSettingsRepository;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AiTutorController extends Controller
{
    public function __construct(private readonly AiSettingsRepository $settings) {}

    public function streamChat(Request $request)
    {
        $userMessage = trim((string) $request->input('message', ''));

        if ($userMessage === '') {
            return response()->json([
                'message' => 'Noi dung cau hoi khong duoc de trong.',
            ], 422);
        }

        $user = $request->user();
        $actorType = $this->resolveActorType($user);
        $actorKey = $user ? 'user:'.$user->id : sha1(($request->ip() ?? 'unknown').'|'.($request->userAgent() ?? 'unknown'));

        $package = $this->settings->packageForUser($user);
        $dailyLimit = (int) $this->settings->packages()[$package]['daily_requests'];

        $todayCount = AiUsageLog::query()
            ->whereDate('created_at', now()->toDateString())
            ->where(function ($query) {
                $query->where('meta->feature', 'ai_tutor')
                    ->orWhere(function ($legacy) {
                        // Older tutor rows retained these fields but had no feature metadata.
                        $legacy->whereNull('meta->feature')
                            ->whereNotNull('input_text')->whereNotNull('system_prompt');
                    });
            })
            ->where(function ($query) use ($user, $actorKey) {
                if ($user) {
                    $query->where('user_id', $user->id);
                } else {
                    $query->where('actor_key', $actorKey);
                }
            })
            ->count();

        if ($todayCount >= $dailyLimit) {
            return response()->json([
                'message' => 'Da vuot han muc so luot hoi AI trong ngay.',
                'meta' => [
                    'daily_limit' => $dailyLimit,
                    'used' => $todayCount,
                ],
            ], 429);
        }

        if ($this->containsSensitiveContent($userMessage)) {
            AiModerationFlag::create([
                'user_id' => $user?->id,
                'actor_type' => $actorType,
                'actor_key' => $actorKey,
                'source' => 'ai_tutor',
                'reason' => 'toxic_or_policy_sensitive_prompt',
                'input_text' => $userMessage,
                'status' => 'pending',
            ]);

            return response()->json([
                'message' => 'Noi dung da bi gan co de admin kiem duyet thu cong.',
            ], 422);
        }

        $provider = $this->settings->tutorProvider();
        $systemPrompt = $this->settings->prompts()['ai_tro_giang'];
        $model = (string) config('services.ai_tutor.model', 'llama-3.1-8b-instant');

        $apiKey = $this->resolveApiKey($provider);
        $baseUri = $this->resolveBaseUri($provider);

        if ($apiKey === '') {
            return response()->json([
                'message' => 'Chua cau hinh API key cho nha cung cap AI hien tai.',
            ], 422);
        }

        return new StreamedResponse(function () use (
            $userMessage,
            $apiKey,
            $baseUri,
            $model,
            $systemPrompt,
            $provider,
            $user,
            $actorType,
            $actorKey,
            $request
        ) {
            $assistantOutput = '';
            $startedAt = microtime(true);
            $requestId = (string) Str::uuid();
            $response = null;
            $status = 'failed';
            $errorCode = null;

            try {
                $endpoint = rtrim($baseUri, '/').'/chat/completions';

                $response = Http::withToken($apiKey)
                    ->acceptJson()
                    ->timeout(90)
                    ->post($endpoint, [
                        'model' => $model,
                        'messages' => [
                            [
                                'role' => 'system',
                                'content' => $systemPrompt,
                            ],
                            [
                                'role' => 'user',
                                'content' => $userMessage,
                            ],
                        ],
                    ]);

                $assistantOutput = $response->successful()
                    ? (string) data_get($response->json(), 'choices.0.message.content', '') : '';
                $status = $response->successful() && $assistantOutput !== '' ? 'success' : 'failed';
                $errorCode = $response->successful() ? ($assistantOutput === '' ? 'empty_response' : null) : 'http_'.$response->status();

                if ($assistantOutput === '') {
                    $assistantOutput = 'He thong AI tam thoi gian doan. Vui long thu lai sau.';
                }

                echo $assistantOutput;
                ob_flush();
                flush();
            } catch (\Throwable $exception) {
                $errorCode = $exception instanceof ConnectionException ? 'connection_error' : 'request_error';
                echo 'He thong AI tam thoi gian doan. Vui long thu lai sau.';
            } finally {
                $providerInputTokens = $response?->json('usage.prompt_tokens');
                $providerOutputTokens = $response?->json('usage.completion_tokens');
                $hasProviderTokens = is_int($providerInputTokens) && is_int($providerOutputTokens);
                $tokenSource = $hasProviderTokens ? 'provider' : ($status === 'success' ? 'estimated' : 'unavailable');
                $inputTokens = 0;
                $outputTokens = 0;
                if ($hasProviderTokens) {
                    $inputTokens = $providerInputTokens;
                    $outputTokens = $providerOutputTokens;
                } elseif ($status === 'success') {
                    $inputTokens = $this->estimateTokens($userMessage.' '.$systemPrompt);
                    $outputTokens = $this->estimateTokens($assistantOutput);
                }

                AiUsageLog::create([
                    'user_id' => $user?->id,
                    'actor_type' => $actorType,
                    'actor_key' => $actorKey,
                    'provider' => $provider,
                    'model' => $model,
                    'request_id' => $requestId,
                    'provider_request_id' => $response?->json('id') ?? $response?->header('x-request-id'),
                    'status' => $status,
                    'error_code' => $errorCode,
                    'duration_ms' => (int) round((microtime(true) - $startedAt) * 1000),
                    'fallback_used' => false,
                    'input_tokens' => $inputTokens,
                    'output_tokens' => $outputTokens,
                    'token_source' => $tokenSource,
                    'cost_source' => 'unavailable',
                    'cost_amount' => null,
                    'cost_currency' => null,
                    'meta' => [
                        'feature' => 'ai_tutor',
                    ],
                ]);

                if ($user) {
                    $activityMetadata = [
                        'provider' => $provider,
                        'model' => $model,
                        'token_source' => $tokenSource,
                    ];
                    if ($tokenSource !== 'unavailable') {
                        $activityMetadata['input_tokens'] = $inputTokens;
                        $activityMetadata['output_tokens'] = $outputTokens;
                    }

                    ActivityLog::create([
                        'user_id' => $user->id,
                        'action' => 'ai_prompt_submitted',
                        'subject_type' => User::class,
                        'subject_id' => $user->id,
                        'ip_address' => $request->ip(),
                        'user_agent' => $request->userAgent(),
                        'metadata' => $activityMetadata,
                    ]);
                }
            }
        }, 200, [
            'Content-Type' => 'text/event-stream',
            'Cache-Control' => 'no-cache',
            'Connection' => 'keep-alive',
            'X-Accel-Buffering' => 'no',
        ]);
    }

    private function containsSensitiveContent(string $message): bool
    {
        $blacklist = [
            'hate',
            'kill',
            'racist',
            'sex with',
            'khung bo',
            'noi dung doc hai',
            'tu tu',
            'ma tuy',
        ];

        $content = mb_strtolower($message);

        foreach ($blacklist as $keyword) {
            if (str_contains($content, $keyword)) {
                return true;
            }
        }

        return false;
    }

    private function resolveActorType(?User $user): string
    {
        if (! $user) {
            return 'guest';
        }

        $role = strtolower((string) ($user->role ?? 'student'));

        return match ($role) {
            'guest' => 'guest',
            'teacher' => 'teacher',
            'admin' => 'admin',
            default => 'student',
        };
    }

    private function resolveApiKey(string $provider): string
    {
        return match ($provider) {
            'openai' => (string) config('services.openai.key', ''),
            'gemini' => (string) config('services.gemini.api_key', ''),
            'claude' => (string) config('services.ai_tutor.claude_key', ''),
            'internal' => (string) config('services.ai_tutor.internal_key', ''),
            default => (string) config('services.groq.key', ''),
        };
    }

    private function resolveBaseUri(string $provider): string
    {
        return match ($provider) {
            'gemini' => (string) config('services.ai_tutor.gemini_base_uri', ''),
            'claude' => (string) config('services.ai_tutor.claude_base_uri', ''),
            'internal' => (string) config('services.ai_tutor.internal_base_uri', ''),
            'openai' => (string) config('services.ai_tutor.openai_base_uri', ''),
            default => 'https://api.groq.com/openai/v1',
        };
    }

    private function estimateTokens(string $text): int
    {
        $words = str_word_count($text);

        return max(1, (int) ceil($words * 1.33));
    }
}
