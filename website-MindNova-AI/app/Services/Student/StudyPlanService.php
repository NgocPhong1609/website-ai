<?php

namespace App\Services\Student;

use App\Models\AiTutorConversation;
use App\Models\AiTutorMessage;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class StudyPlanService
{
    /**
     * Get the active syllabus overview and context inspector data for the student study plan page.
     */
    public function getOverview(?User $user): array
    {
        $userId = $user ? $user->id : null;

        // Try to fetch real conversation history
        $initialMessages = [];
        if ($userId) {
            try {
                $recentConversation = AiTutorConversation::where('user_id', $userId)->latest()->first();
                if ($recentConversation) {
                    $messages = AiTutorMessage::where('conversation_id', $recentConversation->id)
                        ->oldest()
                        ->take(10)
                        ->get();
                    
                    foreach ($messages as $msg) {
                        $initialMessages[] = [
                            'id' => 'msg-' . $msg->id,
                            'sender' => $msg->sender,
                            'timestamp' => $msg->created_at->format('h:i A'),
                            'text' => $msg->message,
                        ];
                    }
                }
            } catch (\Exception $e) {
                // Ignore DB errors
            }
        }

        $activeCourse = null;
        $activeSyllabus = null;
        $coreConcepts = [];
        $lessonResources = [];
        $courseTitle = 'Chưa có khóa học';

        // 1. Try to load AI Onboarding Plan FIRST
        $hasAiPlan = false;
        if ($user && $user->is_onboarded && $user->onboarding_data) {
            $onboarding = is_string($user->onboarding_data) ? json_decode($user->onboarding_data, true) : $user->onboarding_data;
            if (isset($onboarding['ai_plan']) && isset($onboarding['ai_plan']['learning_path']) && !empty($onboarding['ai_plan']['learning_path'])) {
                $hasAiPlan = true;
                $learningPath = $onboarding['ai_plan']['learning_path'];
                
                $courseTitle = 'Lộ trình AI: ' . ($onboarding['goal'] ?? 'Cá nhân hóa');
                $totalModules = count($learningPath);
                
                $currentModuleIndex = 1;
                $currentModuleTitle = $learningPath[0]['title'] ?? 'Bắt đầu học';
                $completedTopics = 0;
                $totalTopics = 0;
                
                foreach ($learningPath as $phase) {
                    $lessons = $phase['lessons'] ?? [];
                    $totalTopics += count($lessons);
                    
                    if ($phase['phase'] == $currentModuleIndex) {
                        $currentModuleTitle = $phase['title'] ?? $currentModuleTitle;
                        foreach ($lessons as $idx => $les) {
                            if (count($coreConcepts) < 5) {
                                $coreConcepts[] = [
                                    'id' => 'concept-ai-' . $phase['phase'] . '-' . $idx,
                                    'title' => mb_substr($les['name'] ?? 'Chủ đề', 0, 40, 'UTF-8'),
                                    'status' => $idx === 0 ? 'In Progress' : 'Queued',
                                    'status_color' => $idx === 0 ? 'amber' : 'neutral',
                                    'description' => ($les['duration'] ?? 'Chưa rõ') . ' học',
                                ];
                            }
                        }
                    }
                }
                
                $lessonResources = [
                    ['id' => 'res-ai-1', 'type' => 'pdf', 'title' => 'Tổng quan lộ trình ' . ($onboarding['goal'] ?? ''), 'meta' => 'Tài liệu AI', 'url' => '#'],
                    ['id' => 'res-ai-2', 'type' => 'video', 'title' => 'Hướng dẫn tiếp cận ' . ($onboarding['topics'][0] ?? 'chủ đề'), 'meta' => 'Bài giảng AI', 'url' => '#']
                ];

                $activeSyllabus = [
                    'id' => 'ai-custom-' . $userId,
                    'title' => $courseTitle,
                    'current_module_index' => $currentModuleIndex,
                    'total_modules' => $totalModules,
                    'module_title' => $currentModuleTitle,
                    'description' => 'Lộ trình học tập được AI thiết kế riêng dựa trên mục tiêu của bạn.',
                    'progress_percentage' => 0,
                    'completed_topics' => 0,
                    'total_topics' => $totalTopics,
                    'status_badge' => 'Bắt đầu',
                ];
            }
        }

        // 2. Get latest active enrollment ONLY if no AI Plan exists
        if (!$hasAiPlan && $userId && class_exists(\App\Models\Enrollment::class)) {
            $enrollment = \App\Models\Enrollment::with('course.modules.lessons')->where('user_id', $userId)->latest('enrolled_at')->first();
            
            if ($enrollment && $enrollment->course) {
                $activeCourse = $enrollment->course;
                $courseTitle = $activeCourse->title;
                $progressPercentage = $enrollment->progress_percentage ?? 0;
                
                $totalModules = $activeCourse->modules->count();
                $currentModuleIndex = 1;
                $currentModuleTitle = 'Bắt đầu học';
                $completedTopics = 0;
                $totalTopics = 0;
                
                $completedLessonIds = [];
                if (class_exists(\App\Models\LessonCompletion::class)) {
                    $completedLessonIds = \App\Models\LessonCompletion::where('user_id', $userId)->pluck('lesson_id')->toArray();
                }

                // Loop through modules to determine current module and populate concepts
                $modIdx = 1;
                foreach ($activeCourse->modules as $mod) {
                    $totalTopics += $mod->lessons->count();
                    $modCompleted = true;
                    
                    foreach ($mod->lessons as $les) {
                        $isCompleted = in_array($les->id, $completedLessonIds);
                        if ($isCompleted) {
                            $completedTopics++;
                        } else {
                            $modCompleted = false;
                        }
                        
                        // Extract concepts based on lessons
                        if (count($coreConcepts) < 5) {
                            $conceptStatus = $isCompleted ? 'Mastered' : 'Queued';
                            $conceptColor = $isCompleted ? 'teal' : 'neutral';
                            if (!$isCompleted && $modIdx === $currentModuleIndex && count($coreConcepts) > 0 && last($coreConcepts)['status'] === 'Mastered') {
                                $conceptStatus = 'In Progress';
                                $conceptColor = 'amber';
                            }
                            
                            $coreConcepts[] = [
                                'id' => 'concept-' . $les->id,
                                'title' => mb_substr($les->title, 0, 40, 'UTF-8'),
                                'status' => $conceptStatus,
                                'status_color' => $conceptColor,
                                'description' => $les->duration_seconds ? ($les->duration_seconds / 60) . ' phút học' : 'Tài nguyên bài học',
                            ];
                        }
                        
                        // Extract resources from lessons
                        if (count($lessonResources) < 4 && $les->video_url) {
                            $lessonResources[] = [
                                'id' => 'res-' . $les->id,
                                'type' => 'video',
                                'title' => $les->title,
                                'meta' => 'Bài giảng Video',
                                'url' => $les->video_url,
                            ];
                        }
                    }
                    
                    if (!$modCompleted && $currentModuleIndex === 1) {
                        $currentModuleIndex = $modIdx;
                        $currentModuleTitle = $mod->title;
                    }
                    $modIdx++;
                }

                if (empty($lessonResources)) {
                     $lessonResources = [
                         ['id' => 'res-fb-1', 'type' => 'pdf', 'title' => 'Tài liệu hướng dẫn', 'meta' => '1.2 MB PDF', 'url' => '#']
                     ];
                }

                $activeSyllabus = [
                    'id' => 'syllabus-' . $activeCourse->id,
                    'title' => $activeCourse->title,
                    'current_module_index' => $currentModuleIndex,
                    'total_modules' => $totalModules,
                    'module_title' => $currentModuleTitle,
                    'description' => $activeCourse->description ?: 'Lộ trình học tập cá nhân hóa',
                    'progress_percentage' => $progressPercentage,
                    'completed_topics' => $completedTopics,
                    'total_topics' => $totalTopics,
                    'status_badge' => $progressPercentage >= 100 ? 'Hoàn thành' : 'Đang tiến hành',
                ];
            }
        }

        if (empty($initialMessages)) {
            $initialMessages = [
                [
                    'id' => 'msg-init',
                    'sender' => 'ai',
                    'timestamp' => now()->format('h:i A'),
                    'text' => "Chào bạn! 👋 Mình là **Nova**, trợ lý AI Co-Pilot đồng hành cùng bạn tại khóa học **{$courseTitle}**.\n\nBạn có câu hỏi gì về bài học hoặc lộ trình học tập hôm nay không?",
                ],
            ];
        }

        return [
            'active_syllabus' => $activeSyllabus,
            'core_concepts' => $coreConcepts,
            'lesson_resources' => $lessonResources,
            'ai_insight' => "Hãy hỏi Gia sư Nova bất kỳ khái niệm nào bạn đang gặp khó khăn trong khóa học {$courseTitle}.",
            'initial_messages' => $initialMessages,
        ];
    }

    /**
     * Process an AI Tutor chat question using configured LLM providers in .env with intelligent conversational fallback.
     */
    public function askAiTutor(?User $user, string $message, ?int $lessonId = null, array $history = []): array
    {
        $userId = $user ? $user->id : null;
        $systemPrompt = "You are Nova, an empathetic, genius AI Study Co-Pilot for MindNova AI. You converse natively and fluently in whatever language the student speaks (especially Vietnamese and English). Provide encouraging, scientifically accurate, deep educational explanations in Modern Computer Science, Quantum Computing, and Fullstack Engineering using structured Markdown formatting, clear bullet points, and code examples.";

        // 1. Save conversation attempt to database if DB migration is available
        $conversationId = null;
        try {
            if ($userId) {
                $conversation = AiTutorConversation::firstOrCreate(
                    ['user_id' => $userId, 'lesson_id' => $lessonId],
                    ['title' => 'Study Plan Session • ' . mb_substr($message, 0, 40, 'UTF-8')]
                );
                $conversationId = $conversation->id;

                AiTutorMessage::create([
                    'conversation_id' => $conversationId,
                    'sender' => 'user',
                    'message' => $message,
                ]);
            }
        } catch (\Throwable $e) {
            // Table might not exist in dev sandbox; proceed gracefully without halting AI chat
            Log::info('AI Tutor DB logging skipped: ' . $e->getMessage());
        }

        // 2. Generate response using Gemini API first, falling back to OpenAI (gpt-4o-mini) if Gemini fails
        $aiResponseText = null;
        $geminiKey = $this->getEnvKey('GEMINI_API_KEY') ?: config('services.gemini.key');
        $openAiKey = $this->getEnvKey('OPENAI_API_KEY') ?: config('services.openai.key');

        // Bước 1 & 2: Luôn gọi Gemini API đầu tiên. Nếu thành công -> Gửi kết quả về cho học sinh (Bỏ qua GPT).
        if (!empty($geminiKey)) {
            $aiResponseText = $this->callGemini($geminiKey, $systemPrompt, $message, $history);
        }

        // Bước 3 & 4: Nếu Gemini bị lỗi (quá tải 429, sập API, hết lượt request -> trả về null) -> Tự động gọi sang OpenAI (gpt-4o-mini) để chữa cháy.
        if (empty($aiResponseText) && !empty($openAiKey)) {
            Log::info('[AI Fallback] Gemini unavailable or exceeded quota; automatically switching to OpenAI (gpt-4o-mini) transparently.');
            $aiResponseText = $this->callOpenAi($openAiKey, $systemPrompt, $message, $history);
        }

        // 3. Fallback intelligence or user-friendly status notice if both APIs fail or keys are unassigned
        if (empty($aiResponseText)) {
            $aiResponseText = $this->generateIntelligentFallback($message, $history);
        }

        // 4. Save AI response to DB
        try {
            if ($conversationId) {
                AiTutorMessage::create([
                    'conversation_id' => $conversationId,
                    'sender' => 'ai',
                    'message' => $aiResponseText,
                ]);
            }
        } catch (\Throwable $e) {
            // Silent fallback for DB
        }

        return [
            'id' => 'msg-' . uniqid(),
            'sender' => 'ai',
            'timestamp' => now()->format('h:i A'),
            'text' => $aiResponseText,
        ];
    }

    /**
     * Dynamically retrieve an environment key from memory or directly from the .env filesystem.
     * This ensures developer updates to .env take immediate effect without needing to restart running servers.
     */
    private function getEnvKey(string $key): ?string
    {
        $val = env($key) ?: getenv($key);
        if (!empty($val)) {
            return $val;
        }
        $envPath = base_path('.env');
        if (file_exists($envPath)) {
            $contents = file_get_contents($envPath);
            if (preg_match('/^' . preg_quote($key, '/') . '\s*=\s*([^\r\n]+)$/m', $contents, $matches)) {
                $trimmed = trim(trim($matches[1]), '"\' ');
                if (!empty($trimmed)) {
                    return $trimmed;
                }
            }
        }
        return null;
    }

    /**
     * Invoke OpenAI Chat Completion API (e.g. gpt-4o-mini as emergency backup).
     */
    private function callOpenAi(string $apiKey, string $systemPrompt, string $userMessage, array $history): ?string
    {
        try {
            $model = $this->getEnvKey('OPENAI_MODEL') ?: config('services.openai.model', 'gpt-4o-mini');
            $messages = [
                ['role' => 'system', 'content' => $systemPrompt],
            ];

            foreach (array_slice($history, -6) as $item) {
                $role = ($item['sender'] ?? '') === 'user' ? 'user' : 'assistant';
                if (!empty($item['text']) && !str_starts_with($item['id'] ?? '', 'err-')) {
                    $messages[] = ['role' => $role, 'content' => $item['text']];
                }
            }
            $messages[] = ['role' => 'user', 'content' => $userMessage];

            $response = Http::withToken($apiKey)
                ->timeout(30)
                ->post('https://api.openai.com/v1/chat/completions', [
                    'model' => $model,
                    'messages' => $messages,
                    'temperature' => 0.7,
                    'max_tokens' => 1200,
                ]);

            if ($response->successful()) {
                return $response->json('choices.0.message.content');
            }
            Log::warning('[AI Fallback] OpenAI API request failed: ' . $response->body());
        } catch (\Exception $e) {
            Log::warning('[AI Fallback] OpenAI API invocation exception: ' . $e->getMessage());
        }

        return null;
    }

    /**
     * Invoke Google Gemini Generate Content API with conversation memory.
     */
    private function callGemini(string $apiKey, string $systemPrompt, string $userMessage, array $history = []): ?string
    {
        try {
            $model = $this->getEnvKey('GEMINI_MODEL') ?: config('services.gemini.model', 'gemini-3.5-flash');
            if (str_contains($model, '1.5')) {
                $model = 'gemini-3.5-flash';
            }
            $url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}";
            
            $contents = [];
            foreach (array_slice($history, -4) as $item) {
                $role = ($item['sender'] ?? '') === 'user' ? 'user' : 'model';
                if (!empty($item['text'])) {
                    $contents[] = [
                        'role' => $role,
                        'parts' => [['text' => $item['text']]]
                    ];
                }
            }

            $contents[] = [
                'role' => 'user',
                'parts' => [['text' => "System Instruction: {$systemPrompt}\n\nUser Message: {$userMessage}"]]
            ];

            $response = Http::timeout(35)->post($url, [
                'contents' => $contents
            ]);

            if ($response->successful()) {
                $parts = $response->json('candidates.0.content.parts') ?? [];
                foreach ($parts as $part) {
                    if (!empty($part['text'])) {
                        return $part['text'];
                    }
                }
                return $response->json('candidates.0.content.parts.0.text');
            }
            Log::warning("[Gemini Fallback] Gemini API request unsuccessful (status {$response->status()}): " . $response->body());
        } catch (\Exception $e) {
            Log::warning('[Gemini Fallback] Gemini API exception encountered: ' . $e->getMessage());
        }

        // Return null on any error, 429 quota limit, or exception so the flow automatically falls back to OpenAI
        return null;
    }

    /**
     * Generates responsive, conversational Vietnamese/English fallback responses when .env API keys are empty or APIs fail.
     */
    private function generateIntelligentFallback(string $message, array $history = []): string
    {
        $hasKey = !empty($this->getEnvKey('GEMINI_API_KEY')) || !empty($this->getEnvKey('OPENAI_API_KEY'));

        // If at least one API key was configured in .env but BOTH Gemini and OpenAI failed (or both reached rate limits), display friendly UI guidance
        if ($hasKey) {
            return "⏳ **Gia sư Nova hiện đang bận xíu (Hệ thống vừa chạm giới hạn tần suất yêu cầu hoặc đang bảo trì tải cao). Bạn vui lòng chờ khoảng 1 phút rồi quay lại trò chuyện với mình nhé!** 😊";
        }

        // Local Intelligent Engine demonstration when no API keys are provided in .env
        $query = mb_strtolower($message, 'UTF-8');

        // Check for casual greetings or introducing chat
        if (in_array(trim($query), ['hi', 'hello', 'chào', 'xin chào', 'chào bạn', 'hey', 'nova ơi', 'bạn ơi', 'ping', 'chao ban'])) {
            return "Chào bạn! 👋 Mình là **Nova AI Co-Pilot**, luôn ở đây để đồng hành cùng lộ trình học tập của bạn tại MindNova.\n\n*(Hiện tại mình đang phản hồi qua **Local Intelligent Engine** vì file `.env` chưa có `OPENAI_API_KEY` hoặc `GEMINI_API_KEY`).*\n\nBạn có câu hỏi nào về lý thuyết **Module 4: Quantum Computing Fundamentals**, hay cần giải thích bài tập lập trình nào không? Hãy đặt câu hỏi cho mình nhé!";
        }

        // Quantum Computing - Superposition & Bloch Sphere
        if (str_contains($query, 'superposition') || str_contains($query, 'chồng chập') || str_contains($query, 'bloch') || str_contains($query, 'qubit')) {
            return "### 🌌 Hiểu sâu về Chồng Chập Lượng Tử (Superposition)\n\nKhác với bit cổ điển chỉ mang giá trị tuyệt đối $0$ hoặc $1$, một **Qubit** (Bit lượng tử) tận dụng nguyên lý chồng chập trong cơ học lượng tử để tồn tại ở tổ hợp tuyến tính của cả hai trạng thái:\n\n```math\n|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle\n```\n\n- **Biên độ xác suất ($\\alpha, \\beta$):** Là các số phức thỏa mãn điều kiện chuẩn hóa $|\\alpha|^2 + |\\beta|^2 = 1$.\n- **Mặt cầu Bloch (Bloch Sphere):** Khi biểu diễn Qubit trong không gian 3D, mọi thao tác áp dụng cổng lượng tử (như **Hadamard Gate** hay **Pauli-X**) chính là phép xoay tọa độ trạng thái trên mặt cầu này!\n\n💡 *Bạn có muốn mình viết đoạn code mẫu bằng Python (Qiskit) để tạo mạch mô phỏng cổng Hadamard không?*";
        }

        // Quantum Computing - Entanglement
        if (str_contains($query, 'entanglement') || str_contains($query, 'rối lượng tử') || str_contains($query, 'vướng víu') || str_contains($query, 'correlation')) {
            return "### ⚡ Vướng Víu Lượng Tử (Quantum Entanglement)\n\n**Quantum Entanglement** xảy ra khi hai hay nhiều hạt mang tương quan nội tại mạnh mẽ đến mức trạng thái của hạt này phụ thuộc tức thì vào hạt kia, ngay cả khi chúng xa nhau vô hạn!\n\n```python\n# Mạch tạo Cặp Trạng Thái Bell (Entangled Pair) bằng Qiskit\nfrom qiskit import QuantumCircuit\n\nqc = QuantumCircuit(2, 2)\nqc.h(0)         # Đưa Qubit 0 vào trạng thái chồng chập\nqc.cx(0, 1)     # Cổng CNOT tạo liên kết rối giữa Qubit 0 và Qubit 1\nqc.measure_all()\n```\n\nKhi bạn đo Qubit $0$, Qubit $1$ ngay lập tức sụp đổ về trạng thái tương ứng! Bạn có muốn tìm hiểu ứng dụng của hiện tượng này trong **Mật mã lượng tử (QKD)** không?";
        }

        // Software Architecture & Programming
        if (str_contains($query, 'next') || str_contains($query, 'react') || str_contains($query, 'laravel') || str_contains($query, 'api') || str_contains($query, 'code') || str_contains($query, 'lỗi') || str_contains($query, 'error')) {
            return "### 🚀 Phân tích Kiến trúc Kỹ thuật\n\nĐể tích hợp hệ thống AI vào ứng dụng hiện đại kết hợp **Next.js 15 (App Router)** và **Laravel 13**, chúng ta tuân thủ các ranh giới thiết kế:\n\n1. **React Server Components (RSC):** Lấy dữ liệu ở tầng Server nhằm đạt hiệu năng render tối đa và không mang mã thư viện node_modules nặng xuống trình duyệt.\n2. **Service Layer ở Backend:** Không viết code nghiệp vụ trong Controller. Tách rời toàn bộ logic tính toán AI, gọi LLM, xử lý database vào Service nhằm gia tăng khả năng tái sử dụng.\n3. **Sanctum Authentication / RBAC:** Phân Quyền chặt chẽ giữa học sinh (Student), giảng viên (Instructor) và quản trị viên (Admin).\n\n✨ Bạn cần kiểm tra hay debug chi tiết mô-đun hoặc API endpoint nào trong hệ thống?";
        }

        // Dynamic conversational echo for custom input when offline
        $shortMessage = htmlspecialchars(mb_strimwidth($message, 0, 150, '...', 'UTF-8'));
        $noticeBox = "> [!NOTE]\n> **Chế độ AI Cục bộ (Offline Mode Notification):**\n> Hiện tại hệ thống Backend kiểm tra thấy biến `OPENAI_API_KEY` và `GEMINI_API_KEY` trong file `.env` **đang bị để trống (chưa điền key)**.\n> 👉 Để trợ lý **Nova** trả lời tự do bằng Trí tuệ Nhân tạo thông minh (LLM), trò chuyện theo chính xác từng ý hỏi của bạn một cách không giới hạn, bạn hãy điền API Key thật của OpenAI hoặc Gemini vào file `.env` của Backend nhé!";

        return "### 💡 Phân tích yêu cầu từ bạn\n\nMình đã tiếp nhận thông điệp của bạn: **\"{$shortMessage}\"**\n\nTrong lộ trình của **Module 4: Quantum Computing Fundamentals**, đây là một góc nhìn rất đáng quan tâm. Để tháo gỡ vấn đề này hiệu quả nhất, bạn có thể áp dụng chiến thuật sau:\n\n1. **Phủ định và xác định bản chất:** Đặt ra các câu hỏi cốt lõi để loại bỏ những ràng buộc không liên quan, tập trung thẳng vào logic nền tảng.\n2. **Đối chiếu với kiến thức chủ chốt:** Liên hệ với tài liệu trong phần *Study Inspector* bên phải, đặc biệt là các công thức toán học và biểu đồ mặt cầu.\n3. **Mô hình hóa thực nghiệm:** Nếu bạn đang triển khai giải thuật hoặc phân tích, hãy thử chia nhỏ thành từng bước hàm (function steps) để kiểm chứng giá trị đầu ra.\n\n{$noticeBox}\n\n✨ *Bạn muốn cùng mình đào sâu chi tiết hơn vào khía cạnh nào ở trên?*";
    }
}
