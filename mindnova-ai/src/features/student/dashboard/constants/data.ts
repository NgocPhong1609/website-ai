import type { ICourse } from "@features/student/courses/types";
import type { IFocusArea, IActivityGroup } from "@features/student/dashboard/types";

// ─── Mock data ────────────────────────────────────────────────────────────────
// Replace with real API calls when backend is ready.

export const DASHBOARD_COURSES: ICourse[] = [
  {
    id: 1,
    title: "Next.js Fullstack",
    nextLesson: "Route Handlers",
    progress: 72,
    thumbnailGradient: "from-[#0f0c29] via-[#302b63] to-[#24243e]",
    thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "React Query Mastery",
    nextLesson: "Mutations",
    progress: 45,
    thumbnailGradient: "from-[#0f2027] via-[#203a43] to-[#2c5364]",
    thumbnailUrl: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=600&auto=format&fit=crop",
  },
];

export const FOCUS_AREAS: IFocusArea[] = [
  { id: 1, topic: "React useEffect",    accuracy: 58, action: "review" },
  { id: 2, topic: "Async/Await",        accuracy: 62, action: "practice" },
  { id: 3, topic: "API Error Handling", accuracy: 55, action: "practice" },
];

export const RECENT_ACTIVITY: IActivityGroup[] = [
  {
    day: "Today",
    items: [
      { label: "Completed: Server Actions" },
      { label: "Took quiz: Route Handlers" },
      { label: "Reviewed: useEffect" },
    ],
  },
  {
    day: "Yesterday",
    items: [
      { label: "Started course: React Query" },
    ],
  },
];

export const AI_SUGGESTION = {
  badge: "MindNova AI Suggestion",
  message: "You should review 'React useEffect Dependency Array' today.",
  reason: "Last quiz score 58%",
  estimated: "15 minutes",
} as const;

export const OVERALL_PROGRESS = {
  percent: 68,
  delta: "+2.4% vs last week",
} as const;

export const STUDY_STREAK = {
  days: 7,
  message: "Keep it up! 3 days to gold.",
} as const;
