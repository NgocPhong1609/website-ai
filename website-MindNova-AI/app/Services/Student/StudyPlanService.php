<?php

namespace App\Services\Student;

use App\Models\AiTutorConversation;
use App\Models\AiTutorMessage;
use App\Models\Enrollment;
use App\Models\LessonCompletion;
use App\Models\User;

class StudyPlanService
{
    public function __construct(private readonly CourseAiTutorService $courseAiTutor) {}

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
                            'id' => 'msg-'.$msg->id,
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
        $courseTitle = null;

        // 1. Try to load AI Onboarding Plan FIRST
        $hasAiPlan = false;
        if ($user && $user->is_onboarded && $user->onboarding_data) {
            $onboarding = is_string($user->onboarding_data) ? json_decode($user->onboarding_data, true) : $user->onboarding_data;
            if (isset($onboarding['ai_plan']) && isset($onboarding['ai_plan']['learning_path']) && ! empty($onboarding['ai_plan']['learning_path'])) {
                $hasAiPlan = true;
                $learningPath = $onboarding['ai_plan']['learning_path'];

                $courseTitle = 'Lộ trình AI: '.($onboarding['goal'] ?? 'Cá nhân hóa');
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
                                    'id' => 'concept-ai-'.$phase['phase'].'-'.$idx,
                                    'title' => mb_substr($les['name'] ?? 'Chủ đề', 0, 40, 'UTF-8'),
                                    'status' => $idx === 0 ? 'In Progress' : 'Queued',
                                    'status_color' => $idx === 0 ? 'amber' : 'neutral',
                                    'description' => ($les['duration'] ?? 'Chưa rõ').' học',
                                ];
                            }
                        }
                    }
                }

                $activeSyllabus = [
                    'id' => 'ai-custom-'.$userId,
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
        if (! $hasAiPlan && $userId && class_exists(Enrollment::class)) {
            $enrollment = Enrollment::with('course.modules.lessons')->where('user_id', $userId)->latest('enrolled_at')->first();

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
                if (class_exists(LessonCompletion::class)) {
                    $completedLessonIds = LessonCompletion::where('user_id', $userId)->pluck('lesson_id')->toArray();
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
                            if (! $isCompleted && $modIdx === $currentModuleIndex && count($coreConcepts) > 0 && last($coreConcepts)['status'] === 'Mastered') {
                                $conceptStatus = 'In Progress';
                                $conceptColor = 'amber';
                            }

                            $coreConcepts[] = [
                                'id' => 'concept-'.$les->id,
                                'title' => $les->title,
                                'status' => $conceptStatus,
                                'status_color' => $conceptColor,
                                'description' => $les->duration_seconds
                                    ? $this->formatStudyMinutes((int) $les->duration_seconds)
                                    : 'Tài nguyên bài học',
                            ];
                        }

                        // Extract resources from lessons
                        if (count($lessonResources) < 4 && $les->video_url) {
                            $lessonResources[] = [
                                'id' => 'res-'.$les->id,
                                'type' => 'video',
                                'title' => $les->title,
                                'meta' => 'Bài giảng Video',
                                'url' => $les->video_url,
                            ];
                        }
                    }

                    if (! $modCompleted && $currentModuleIndex === 1) {
                        $currentModuleIndex = $modIdx;
                        $currentModuleTitle = $mod->title;
                    }
                    $modIdx++;
                }

                $activeSyllabus = [
                    'id' => 'syllabus-'.$activeCourse->id,
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
                    'text' => $courseTitle
                        ? "Chào bạn! Mình là **Nova**, trợ lý AI đồng hành cùng bạn trong **{$courseTitle}**.\n\nBạn có câu hỏi gì về bài học hoặc lộ trình học tập hôm nay không?"
                        : "Chào bạn! Mình là **Nova**, trợ lý AI của MindNova.\n\nBạn chưa đăng ký khóa học nào, nhưng vẫn có thể hỏi mình về bất kỳ chủ đề nào bạn đang tìm hiểu.",
                ],
            ];
        }

        return [
            'active_syllabus' => $activeSyllabus,
            'core_concepts' => $coreConcepts,
            'lesson_resources' => $lessonResources,
            'ai_insight' => $courseTitle
                ? "Hãy hỏi Gia sư Nova bất kỳ khái niệm nào bạn đang gặp khó khăn trong {$courseTitle}."
                : 'Đăng ký một khóa học hoặc hoàn tất khảo sát mục tiêu để Nova đề xuất lộ trình học phù hợp.',
            'initial_messages' => $initialMessages,
        ];
    }

    /**
     * Process a course-scoped Tutor question and preserve the existing chat envelope.
     */
    public function askAiTutor(User $user, string $message, ?int $lessonId = null, array $history = []): array
    {
        $answer = $this->courseAiTutor->answer($user, $message, $lessonId, $history);

        return [
            'id' => 'msg-'.uniqid(),
            'sender' => 'ai',
            'timestamp' => now()->format('h:i A'),
            'text' => $answer['content'],
            'quota' => $answer['quota'],
        ];
    }

    private function formatStudyMinutes(int $seconds): string
    {
        $minutes = round($seconds / 60, 1);
        $label = abs($minutes - round($minutes)) < 0.05
            ? (string) (int) round($minutes)
            : number_format($minutes, 1, '.', '');

        return $label.' phút học';
    }
}
