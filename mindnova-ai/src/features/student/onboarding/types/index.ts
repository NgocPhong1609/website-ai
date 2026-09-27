import type { LucideIcon } from "lucide-react";

export type GoalId = "frontend" | "backend" | "fullstack" | "english" | "certificate" | "ai-data";
export type LevelId = "beginner" | "intermediate" | "advanced";
export type TimeId = "30m" | "1-2h" | "2-4h" | "4h+";

export interface OnboardingOption<TId extends string> {
  id: TId;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface OnboardingGoal extends OnboardingOption<GoalId> {
  /** Topics suggested on step 3 for this goal. */
  topics: string[];
}

export interface OnboardingAnswers {
  goalId: GoalId | null;
  levelId: LevelId | null;
  topics: string[];
  timeId: TimeId | null;
}

/** Route segment of each question step; used for guards and the stepper. */
export type OnboardingStepKey = "goal" | "skills" | "topics";

// ─── API contract (POST /api/student/onboarding) ─────────────────────────────

export interface GeneratePlanPayload {
  goal: string;
  currentLevel: string;
  timeAvailable: string;
  topics: string[];
}

export interface RecommendedCourse {
  id: number;
  title: string;
  slug?: string | null;
  thumbnail?: string | null;
  price: number;
  instructor?: string | null;
  students_count: number;
  rating: number | null;
}

export interface PlanLesson {
  name: string;
  duration: string;
}

export interface PlanPhase {
  phase: number;
  title: string;
  description: string;
  duration: string;
  status: "unlocked" | "locked";
  lessons: PlanLesson[];
  courses: RecommendedCourse[];
}

export interface GeneratedPlan {
  profile: {
    goal: string;
    level: string;
    time_available: string;
    topics: string[];
    est_time: string;
  };
  learning_path: PlanPhase[];
  source: "ai" | "fallback";
}

export interface LessonAnalysis {
  overview: string;
  key_takeaways: string[];
  recommended_courses: RecommendedCourse[];
  source: "ai" | "fallback";
}
