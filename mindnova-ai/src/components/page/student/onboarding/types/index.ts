export interface IGoal {
  id: number;
  icon: string;
  title: string;
  description: string;
}

export interface IFeature {
  id: number;
  icon: string;
  title: string;
  description: string;
}

export type SkillLevel = "Beginner" | "Intermediate" | "Advanced";

export interface ISkill {
  id: number;
  level: SkillLevel;
  iconPath: string;
  iconBgColor?: string;
  description: string;
}

export type OnboardingStep =
  | "welcome"
  | "goal"
  | "level"
  | "topics"
  | "signup"
  | "generating"
  | "plan";

export interface OnboardingFormData {
  goal: string;
  level: string;
  topics: string[];
  freeTime: string;
}

export type GeneratingStepStatus = "completed" | "in-progress" | "pending";

export interface IGeneratingStep {
  id: number;
  label: string;
  status: GeneratingStepStatus;
}

export type TopicIconKey =
  | "html-css"
  | "javascript"
  | "typescript"
  | "react"
  | "nextjs"
  | "nodejs"
  | "database"
  | "api"
  | "authentication"
  | "ui-ux";

export interface ITopic {
  id: number;
  label: string;
  iconKey: TopicIconKey;
}

export type PlanItemStatus = "ready" | "upcoming" | "locked";

export interface IPlanItem {
  id: number;
  label: string;
  status: PlanItemStatus;
  duration: string;
  courseTitle?: string;
  instructor?: string;
  rating?: number;
  originalPrice?: string;
  discountPrice?: string;
}

export interface IPlanPhase {
  id: number;
  title: string;
  duration: string;
  description?: string;
  items: IPlanItem[];
}

// ─── AI Chat & Guest Recommendation Models ────────────────────────────────────

export interface IAICourseRecommendation {
  id: string;
  title: string;
  instructor: string;
  rating: number;
  reviewCount: number;
  originalPrice: string;
  price: string;
  discountPercent: string;
  level: string;
  duration: string;
  thumbnail: string;
}

export interface IChatMessage {
  id: string;
  sender: "user" | "ai";
  text?: string;
  recommendation?: IAICourseRecommendation;
  timestamp: string;
}

export interface IAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "login" | "register" | "forgot";
  compellingReason?: string;
  onSuccess?: () => void;
}
