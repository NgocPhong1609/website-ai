<?php

namespace App\Services\Student;

use App\Models\Course;
use App\Models\User;
use Illuminate\Support\Collection;

class DashboardService
{
    /**
     * Get dashboard overview data for a student.
     * Implements basic simplified repository logic by querying Eloquent Models directly.
     */
    public function getOverview(?User $user): array
    {
        // 1. Fetch courses from DB or fallback to default learning tracks if DB is empty
        $coursesQuery = Course::query()
            ->latest()
            ->take(4)
            ->get();

        $courses = $coursesQuery->map(function ($course, $index) {
            $progressRates = [72, 45, 85, 30];
            $nextLessons = ['Route Handlers & SSR', 'State Mutations & Cache', 'AI Copilot Integration', 'Advanced Middleware'];
            $gradients = [
                'from-[#0f0c29] via-[#302b63] to-[#24243e]',
                'from-[#0f2027] via-[#203a43] to-[#2c5364]',
                'from-[#1a2a6c] via-[#b21f1f] to-[#fdbb2d]',
                'from-[#34e89e] via-[#0f3443] to-[#000000]'
            ];
            
            return [
                'id' => $course->id,
                'title' => $course->title,
                'next_lesson' => $nextLessons[$index % count($nextLessons)],
                'progress' => $progressRates[$index % count($progressRates)],
                'thumbnail_gradient' => $gradients[$index % count($gradients)],
                'thumbnail_url' => $course->thumbnail ? url($course->thumbnail) : 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop',
            ];
        });

        // Fallback demo courses if no courses exist in database yet
        if ($courses->isEmpty()) {
            $courses = collect([
                [
                    'id' => 1,
                    'title' => 'Next.js 15 Fullstack Architecture',
                    'next_lesson' => 'App Router & Server Components',
                    'progress' => 78,
                    'thumbnail_gradient' => 'from-[#0f0c29] via-[#302b63] to-[#24243e]',
                    'thumbnail_url' => 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop',
                ],
                [
                    'id' => 2,
                    'title' => 'Laravel 13 & AI Agents Mastery',
                    'next_lesson' => 'Sanctum Token Authentication & RBAC',
                    'progress' => 54,
                    'thumbnail_gradient' => 'from-[#0f2027] via-[#203a43] to-[#2c5364]',
                    'thumbnail_url' => 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=600&auto=format&fit=crop',
                ],
            ]);
        }

        // 2. AI Recommended Focus Areas
        $focusAreas = [
            ['id' => 1, 'topic' => 'React Server Components (RSC)', 'accuracy' => 58, 'action' => 'review'],
            ['id' => 2, 'topic' => 'Laravel Service Layer Design', 'accuracy' => 64, 'action' => 'practice'],
            ['id' => 3, 'topic' => 'Sanctum Token Lifecycles', 'accuracy' => 52, 'action' => 'practice'],
        ];

        // 3. AI Suggestion Box
        $aiSuggestion = [
            'badge' => 'MindNova AI Suggestion',
            'message' => 'We noticed you spent 20m on Hydration errors. Try reviewing "Server vs Client Leaf Node Components".',
            'reason' => 'Last diagnostic score 58%',
            'estimated' => '15 minutes',
        ];

        // 5. Overall Stats & Streak
        $overallProgress = [
            'percent' => 74,
            'delta' => '+3.2% vs last week',
        ];

        $studyStreak = [
            'days' => 8,
            'message' => 'Incredible consistency! 2 days until Platinum medal.',
        ];

        // 6. Advanced Learning Recommendations (Các đề xuất học tập nâng cao)
        $advancedRecommendations = [
            [
                'id' => 'adv-01',
                'title' => 'Deep Dive into Multi-Agent Orchestration & RAG Pipelines',
                'category' => 'AI & Autonomous Agents',
                'level' => 'Advanced Specialization',
                'duration' => '10 Weeks • 32 Hours',
                'instructor' => 'Dr. Alex Rivera • AI Principal Engineer',
                'rating' => 4.9,
                'students_count' => 1420,
                'thumbnail_url' => 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=700&auto=format&fit=crop',
                'tags' => ['LangGraph', 'Vector DB', 'Agentic Workflows'],
                'ai_match' => '98% AI Profile Match',
            ],
            [
                'id' => 'adv-02',
                'title' => 'Enterprise Event-Driven Architecture with Laravel & Kafka',
                'category' => 'Fullstack Web & Cloud',
                'level' => 'Expert Track',
                'duration' => '8 Weeks • 24 Hours',
                'instructor' => 'Marcus Vance • Senior Lead Cloud Architect',
                'rating' => 4.8,
                'students_count' => 980,
                'thumbnail_url' => 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=700&auto=format&fit=crop',
                'tags' => ['Kafka', 'Microservices', 'Asynchronous queues'],
                'ai_match' => '95% AI Profile Match',
            ],
            [
                'id' => 'adv-03',
                'title' => 'Fine-Tuning Open Source Large Language Models for Production',
                'category' => 'Data Science & NLP',
                'level' => 'Mastery Boot-camp',
                'duration' => '12 Weeks • 45 Hours',
                'instructor' => 'Elena Rostova • AI Lead & Research Scientist',
                'rating' => 5.0,
                'students_count' => 2150,
                'thumbnail_url' => 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=700&auto=format&fit=crop',
                'tags' => ['LoRA/QLoRA', 'DeepSeek', 'Model Quantization'],
                'ai_match' => '92% AI Profile Match',
            ],
        ];

        return [
            'user' => $user ? ['id' => $user->id, 'name' => $user->name, 'email' => $user->email] : null,
            'courses' => $courses->toArray(),
            'focus_areas' => $focusAreas,
            'ai_suggestion' => $aiSuggestion,
            'overall_progress' => $overallProgress,
            'study_streak' => $studyStreak,
            'advanced_recommendations' => $advancedRecommendations,
        ];
    }
}
