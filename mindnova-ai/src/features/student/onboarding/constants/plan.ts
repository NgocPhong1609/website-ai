// @ts-nocheck
import type { IPlanPhase, TopicIconKey } from "@/src/features/student/onboarding/types";

// ─── Topic → Phase mapping ────────────────────────────────────────────────────
// Each topic key maps to the phase index it belongs to (0 = Phase 1, etc.)

export const TOPIC_PHASE_MAP: Record<TopicIconKey, number> = {
 "html-css": 0,
 javascript: 0,
 typescript: 1,
 react: 1,
 nextjs: 1,
 nodejs: 2,
 database: 2,
 api: 2,
 authentication: 2,
 "ui-ux": 0,
};

// ─── Default plan phases ───────────────────────────────────────────────────────

export const DEFAULT_PLAN_PHASES: IPlanPhase[] = [
 {
 id: 1,
 title: "Giai đoạn 1 — Nền tảng",
 duration: "2–4 weeks",
 items: [
 { id: 1, label: "Nền tảng HTML & CSS", status: "ready", duration: "1 week" },
 { id: 2, label: "Khái niệm cốt lõi JavaScript", status: "ready", duration: "1 week" },
 { id: 3, label: "Nguyên tắc thiết kế UI/UX", status: "ready", duration: "3 days" },
 ],
 },
 {
 id: 2,
 title: "Giai đoạn 2 — Framework cốt lõi",
 duration: "1–2 months",
 items: [
 { id: 4, label: "TypeScript thiết yếu", status: "upcoming", duration: "1 week" },
 { id: 5, label: "Nền tảng React", status: "upcoming", duration: "2 weeks" },
 { id: 6, label: "Next.js App Router", status: "upcoming", duration: "1 week" },
 ],
 },
 {
 id: 3,
 title: "Giai đoạn 3 — Backend & API",
 duration: "2–3 months",
 items: [
 { id: 7, label: "Node.js & Express", status: "locked", duration: "2 weeks" },
 { id: 8, label: "Thiết kế cơ sở dữ liệu", status: "locked", duration: "2 weeks" },
 { id: 9, label: "Phát triển REST API", status: "locked", duration: "2 weeks" },
 { id: 10, label: "Xác thực & phân quyền", status: "locked", duration: "1 week" },
 ],
 },
];

// ─── Skill level → phase unlock map ──────────────────────────────────────────

export const LEVEL_PHASE_CONFIG: Record<string, { unlockedPhases: number }> = {
 Beginner: { unlockedPhases: 1 },
 Intermediate: { unlockedPhases: 2 },
 Advanced: { unlockedPhases: 3 },
};
