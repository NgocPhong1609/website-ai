import type { IPlanPhase, TopicIconKey } from "@/src/features/student/onboarding/types";

// ─── Topic → Phase mapping ────────────────────────────────────────────────────
// Each topic key maps to the phase index it belongs to (0 = Phase 1, etc.)

export const TOPIC_PHASE_MAP: Record<TopicIconKey, number> = {
  "html-css":     0,
  javascript:     0,
  typescript:     1,
  react:          1,
  nextjs:         1,
  nodejs:         2,
  database:       2,
  api:            2,
  authentication: 2,
  "ui-ux":        0,
};

// ─── Default plan phases ───────────────────────────────────────────────────────

export const DEFAULT_PLAN_PHASES: IPlanPhase[] = [
  {
    id: 1,
    title: "Phase 1 — Foundation",
    duration: "2–4 weeks",
    items: [
      { id: 1, label: "HTML & CSS Fundamentals", status: "ready",    duration: "1 week"  },
      { id: 2, label: "JavaScript Core Concepts", status: "ready",   duration: "1 week"  },
      { id: 3, label: "UI/UX Design Principles",  status: "ready",   duration: "3 days"  },
    ],
  },
  {
    id: 2,
    title: "Phase 2 — Core Framework",
    duration: "1–2 months",
    items: [
      { id: 4, label: "TypeScript Essentials",   status: "upcoming", duration: "1 week"  },
      { id: 5, label: "React Fundamentals",       status: "upcoming", duration: "2 weeks" },
      { id: 6, label: "Next.js App Router",       status: "upcoming", duration: "1 week"  },
    ],
  },
  {
    id: 3,
    title: "Phase 3 — Backend & APIs",
    duration: "2–3 months",
    items: [
      { id: 7, label: "Node.js & Express",       status: "locked",   duration: "2 weeks" },
      { id: 8, label: "Database Design",          status: "locked",   duration: "2 weeks" },
      { id: 9, label: "REST API Development",     status: "locked",   duration: "2 weeks" },
      { id: 10, label: "Authentication & Auth",   status: "locked",   duration: "1 week"  },
    ],
  },
];

// ─── Skill level → phase unlock map ──────────────────────────────────────────

export const LEVEL_PHASE_CONFIG: Record<string, { unlockedPhases: number }> = {
  Beginner:     { unlockedPhases: 1 },
  Intermediate: { unlockedPhases: 2 },
  Advanced:     { unlockedPhases: 3 },
};
