<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
<<<<<<< HEAD
use App\Services\Student\AiTutorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;

class AiTutorController extends Controller
{
    public function __construct(private readonly AiTutorService $aiTutorService)
    {
    }

    public function chat(Request $request): JsonResponse
    {
        $data = $request->validate([
            'message' => ['required', 'string', 'max:2000'],
            'history' => ['sometimes', 'array', 'max:20'],
            'history.*.role' => ['required_with:history', 'in:user,assistant'],
            'history.*.content' => ['required_with:history', 'string', 'max:2000'],
        ]);

        try {
            $reply = $this->aiTutorService->ask($data['message'], $data['history'] ?? []);
        } catch (RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 502);
        }

        return response()->json(['reply' => $reply]);
=======
use App\Models\ActivityLog;
use App\Models\AdminSetting;
use App\Models\AiModerationFlag;
use App\Models\AiUsageLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AiTutorController extends Controller
{
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
        $actorKey = $user ? 'user:' . $user->id : sha1(($request->ip() ?? 'unknown') . '|' . ($request->userAgent() ?? 'unknown'));

        $quotas = $this->getSetting('ai.quotas', [
            'student_daily_questions' => 30,
            'guest_daily_questions' => 5,
        ]);

        $dailyLimit = $actorType === 'guest'
            ? (int) ($quotas['guest_daily_questions'] ?? 5)
            : (int) ($quotas['student_daily_questions'] ?? 30);

        $todayCount = AiUsageLog::query()
            ->whereDate('created_at', now()->toDateString())
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

        $providers = $this->getSetting('ai.providers', [
            'primary' => 'groq',
        ]);
        $prompts = $this->getSetting('ai.prompts', [
            'ai_tro_giang' => 'Ban la Nova, tro giang AI than thien, tra loi ngan gon va de hieu bang tieng Viet.',
        ]);

        $provider = (string) ($providers['primary'] ?? 'groq');
        $systemPrompt = (string) ($prompts['ai_tro_giang'] ?? 'Ban la tro giang AI than thien, tra loi bang tieng Viet.');
        $model = (string) env('AI_DEFAULT_MODEL', 'llama-3.1-8b-instant');

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

            try {
                $endpoint = rtrim($baseUri, '/') . '/chat/completions';

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

                $assistantOutput = (string) data_get($response->json(), 'choices.0.message.content', '');

                if ($assistantOutput === '') {
                    $assistantOutput = 'He thong AI tam thoi gian doan. Vui long thu lai sau.';
                }

                echo $assistantOutput;
                ob_flush();
                flush();
            } catch (\Throwable $exception) {
                echo 'He thong AI tam thoi gian doan. Vui long thu lai sau.';
            } finally {
                $inputTokens = $this->estimateTokens($userMessage . ' ' . $systemPrompt);
                $outputTokens = $this->estimateTokens($assistantOutput);

                AiUsageLog::create([
                    'user_id' => $user?->id,
                    'actor_type' => $actorType,
                    'actor_key' => $actorKey,
                    'provider' => $provider,
                    'model' => $model,
                    'input_text' => $userMessage,
                    'output_text' => $assistantOutput,
                    'input_tokens' => $inputTokens,
                    'output_tokens' => $outputTokens,
                    'cost_estimate' => $this->estimateCost($inputTokens, $outputTokens),
                    'system_prompt' => $systemPrompt,
                    'meta' => [
                        'ip' => $request->ip(),
                        'user_agent' => $request->userAgent(),
                    ],
                ]);

                if ($user) {
                    ActivityLog::create([
                        'user_id' => $user->id,
                        'action' => 'ai_prompt_submitted',
                        'subject_type' => User::class,
                        'subject_id' => $user->id,
                        'ip_address' => $request->ip(),
                        'user_agent' => $request->userAgent(),
                        'metadata' => [
                            'provider' => $provider,
                            'model' => $model,
                            'input_tokens' => $inputTokens,
                            'output_tokens' => $outputTokens,
                        ],
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
        if (!$user) {
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
            'openai' => (string) env('OPENAI_API_KEY', ''),
            'gemini' => (string) env('GEMINI_API_KEY', ''),
            'claude' => (string) env('CLAUDE_API_KEY', ''),
            'internal' => (string) env('INTERNAL_AI_KEY', ''),
            default => (string) env('GROQ_API_KEY', ''),
        };
    }

    private function resolveBaseUri(string $provider): string
    {
        return match ($provider) {
            'gemini' => (string) env('GEMINI_BASE_URI', ''),
            'claude' => (string) env('CLAUDE_BASE_URI', ''),
            'internal' => (string) env('INTERNAL_AI_BASE_URI', ''),
            'openai' => (string) env('OPENAI_BASE_URI', ''),
            default => 'https://api.groq.com/openai/v1',
        };
    }

    private function estimateTokens(string $text): int
    {
        $words = str_word_count($text);
        return max(1, (int) ceil($words * 1.33));
    }

    private function estimateCost(int $inputTokens, int $outputTokens): float
    {
        $inputCostPerThousand = 0.0002;
        $outputCostPerThousand = 0.0004;

        return round((($inputTokens / 1000) * $inputCostPerThousand) + (($outputTokens / 1000) * $outputCostPerThousand), 6);
    }

    private function getSetting(string $key, mixed $default): mixed
    {
        $setting = AdminSetting::where('key', $key)->first();
        return $setting?->value ?? $default;
>>>>>>> origin/main
    }
}
