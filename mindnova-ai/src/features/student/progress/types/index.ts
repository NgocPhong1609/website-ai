export interface ProgressOverviewCard {
 course_title: string;
 term_tag: string;
 completion_percentage: number;
 completed_lessons: number;
 total_lessons: number;
 next_module_label: string;
 status_badge: string;
}

export interface ProgressMetricItem {
 total_hours?: string;
 weekly_change?: string;
 score?: string;
 ranking_tag?: string;
 count_text?: string;
 tag?: string;
}

export interface ProgressRoadmapModule {
 id: string | number;
 module_number: string;
 title: string;
 subtitle: string;
 lesson_count_text: string;
 status: 'completed' | 'active' | 'locked' | string;
 progress_percentage?: number;
 progress_text?: string;
 action_text?: string;
 action_link?: string;
}

export interface AIRecommendation {
 id: string;
 title: string;
 priority_tag: string;
 color_scheme?: string;
 content: string;
 action_label?: string;
 action_url?: string;
}

export interface AIPerformanceStat {
 label: string;
 value: string;
 icon: string;
 tag_class: string;
}

export interface ProgressAIInsights {
 title: string;
 subtitle: string;
 recommendations: AIRecommendation[];
 performance_stats: AIPerformanceStat[];
}

export interface ProgressOverviewData {
 overview_card: ProgressOverviewCard;
 key_metrics: {
 study_time: ProgressMetricItem;
 quiz_average: ProgressMetricItem;
 skills_mastered: ProgressMetricItem;
 };
 roadmap_modules: ProgressRoadmapModule[];
 ai_insights: ProgressAIInsights;
}
