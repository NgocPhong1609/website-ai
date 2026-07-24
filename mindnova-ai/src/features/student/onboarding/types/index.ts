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
  | "generating";

export interface OnboardingFormData {
  goal: string;
  level: string;
  topics: string[];
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
