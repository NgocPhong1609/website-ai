import type { IGeneratingStep } from "@/src/components/page/student/onboarding/types";

export const GENERATING_STEPS: IGeneratingStep[] = [
  { id: 1, label: "Analyzing your goal", status: "completed" },
  { id: 2, label: "Checking your skill level", status: "completed" },
  { id: 3, label: "Selecting the best topics", status: "in-progress" },
  { id: 4, label: "Building your learning path", status: "pending" },
];
