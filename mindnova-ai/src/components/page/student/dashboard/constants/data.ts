import type { ICourse } from "@/src/components/page/student/courses/types";
import type { IFocusArea, IActivityGroup } from "@/src/components/page/student/dashboard/types";

// ─── Mock data ────────────────────────────────────────────────────────────────

export const DASHBOARD_COURSES: ICourse[] = [
  {
    id: 1,
    title: "Next.js 15 Fullstack Architecture & Route Handlers",
    nextLesson: "Route Handlers & Advanced APIs",
    progress: 72,
    thumbnailGradient: "from-[#0f0c29] via-[#302b63] to-[#24243e]",
    thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop",
    lastWatchedTimestamp: "08:14 / 15:30",
    status: "in-progress",
    category: "Fullstack Web",
    instructorName: "David Miller",
  },
  {
    id: 2,
    title: "React Query & State Management Mastery",
    nextLesson: "Optimistic Mutations & Cache Invalidation",
    progress: 45,
    thumbnailGradient: "from-[#0f2027] via-[#203a43] to-[#2c5364]",
    thumbnailUrl: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=600&auto=format&fit=crop",
    lastWatchedTimestamp: "03:45 / 12:00",
    status: "in-progress",
    category: "React Ecosystem",
    instructorName: "Elena Rostova",
  },
  {
    id: 3,
    title: "Legacy PHP Backend Fundamentals",
    nextLesson: "Session Handling",
    progress: 12,
    thumbnailGradient: "from-[#2C3E50] via-[#3498DB] to-[#2980B9]",
    thumbnailUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop",
    lastWatchedTimestamp: "02:10 / 25:00 (Inactive for 45 days)",
    status: "abandoned",
    category: "Legacy Systems",
    instructorName: "Alex Vance",
  },
  {
    id: 4,
    title: "Tailwind CSS 4 & Modern UI Design Systems",
    nextLesson: "Course Completed 🎉",
    progress: 100,
    thumbnailGradient: "from-[#134E5E] via-[#71B280] to-[#2ECC71]",
    thumbnailUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=600&auto=format&fit=crop",
    lastWatchedTimestamp: "Completed • Cryptographic Certificate Issued",
    status: "completed",
    category: "Design Systems",
    instructorName: "Sarah Jenkins",
  }
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
