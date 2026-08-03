<<<<<<< HEAD
import type { IFocusArea } from "../types";
=======
import type { ICourse } from "@features/student/courses/types";
import type { IFocusArea, IActivityGroup } from "@features/student/dashboard/types";
>>>>>>> 7e154dade1d41e3edc19ae56dfd6b83146d023b7

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

export const ADVANCED_RECOMMENDATIONS = [
  {
    id: "adv-01",
    title: "Deep Dive into Multi-Agent Orchestration & RAG Pipelines",
    category: "AI & Autonomous Agents",
    level: "Advanced Specialization",
    duration: "10 Weeks • 32 Hours",
    instructor: "Dr. Alex Rivera • AI Principal Engineer",
    rating: 4.9,
    studentsCount: 1420,
    thumbnailUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=700&auto=format&fit=crop",
    tags: ["LangGraph", "Vector DB", "Agentic Workflows"],
    aiMatch: "98% AI Profile Match",
  },
  {
    id: "adv-02",
    title: "Enterprise Event-Driven Architecture with Laravel & Kafka",
    category: "Fullstack Web & Cloud",
    level: "Expert Track",
    duration: "8 Weeks • 24 Hours",
    instructor: "Marcus Vance • Senior Lead Cloud Architect",
    rating: 4.8,
    studentsCount: 980,
    thumbnailUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=700&auto=format&fit=crop",
    tags: ["Kafka", "Microservices", "Asynchronous queues"],
    aiMatch: "95% AI Profile Match",
  },
  {
    id: "adv-03",
    title: "Fine-Tuning Open Source Large Language Models for Production",
    category: "Data Science & NLP",
    level: "Mastery Boot-camp",
    duration: "12 Weeks • 45 Hours",
    instructor: "Elena Rostova • AI Lead & Research Scientist",
    rating: 5.0,
    studentsCount: 2150,
    thumbnailUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=700&auto=format&fit=crop",
    tags: ["LoRA/QLoRA", "DeepSeek", "Model Quantization"],
    aiMatch: "92% AI Profile Match",
  },
];
