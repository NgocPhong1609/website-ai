export type FocusActionKind = "review" | "practice";

export interface FocusArea {
 id: number;
 topic: string;
 accuracy: number;
 action: FocusActionKind;
}
export interface DashboardCourse {
 id: number;
 title: string;
 next_lesson?: string;
 nextLesson?: string;
 progress: number;
 thumbnail_gradient?: string;
 thumbnailGradient?: string;
 thumbnail_url?: string;
 thumbnailUrl?: string;
}

export interface AiSuggestion {
 badge: string;
 message: string;
 reason: string;
 estimated: string;
}

export interface OverallProgress {
 percent: number;
 delta: string;
}

export interface StudyStreak {
 days: number;
 message: string;
}

export interface UserProfileSummary {
 id: number;
 name: string;
 email: string;
}

export interface AdvancedRecommendation {
 id: string;
 title: string;
 category: string;
 level: string;
 duration: string;
 instructor: string;
 rating: number;
 students_count?: number;
 studentsCount?: number;
 thumbnail_url?: string;
 thumbnailUrl?: string;
 tags?: string[];
 ai_match?: string;
 aiMatch?: string;
}

export interface DailyGoal {
 target: number;
 completed: number;
 percentage: number;
}

export interface DashboardOverview {
 user: UserProfileSummary | null;
 courses: DashboardCourse[];
 focus_areas: FocusArea[];
 ai_suggestion: AiSuggestion;
 overall_progress: OverallProgress;
 study_streak: StudyStreak;
 advanced_recommendations?: AdvancedRecommendation[];
 daily_goal?: DailyGoal;
 weekly_activity?: Record<string, boolean>;
}

export interface DashboardApiResponse {
 success: boolean;
 message: string;
 data: DashboardOverview;
}

// Deprecated aliases for backward compatibility during transition
export type IFocusArea = FocusArea;
