import type { ITopic } from "@/src/components/page/student/onboarding/types";

export const ONBOARDING_TOPICS: ITopic[] = [
  { id: 1, label: "HTML/CSS", iconKey: "html-css" },
  { id: 2, label: "JavaScript", iconKey: "javascript" },
  { id: 3, label: "TypeScript", iconKey: "typescript" },
  { id: 4, label: "React", iconKey: "react" },
  { id: 5, label: "Next.js", iconKey: "nextjs" },
  { id: 6, label: "Node.js", iconKey: "nodejs" },
  { id: 7, label: "Database", iconKey: "database" },
  { id: 8, label: "API", iconKey: "api" },
  { id: 9, label: "Authentication", iconKey: "authentication" },
  { id: 10, label: "UI/UX", iconKey: "ui-ux" },
];

// Dynamic complexity based on number of selected topics
export const COMPLEXITY_CONFIG = [
  { maxTopics: 0, label: "Select topics to begin", level: 0, percent: 0 },
  { maxTopics: 2, label: "Basic (Level 1/5)", level: 1, percent: 20 },
  { maxTopics: 4, label: "Foundational (Level 2/5)", level: 2, percent: 40 },
  { maxTopics: 6, label: "Moderate (Level 3/5)", level: 3, percent: 60 },
  { maxTopics: 8, label: "Advanced (Level 4/5)", level: 4, percent: 80 },
  { maxTopics: Infinity, label: "Expert (Level 5/5)", level: 5, percent: 100 },
] as const;
