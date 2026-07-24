"use client";

import { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button, ArrowRightIcon } from "@/src/components/ui";
import { useOnboardingStore } from "@/src/components/page/student/onboarding/stores/onboardingStore";
import {
  DEFAULT_PLAN_PHASES,
  LEVEL_PHASE_CONFIG,
  COMPLEXITY_CONFIG,
} from "@/src/components/page/student/onboarding/constants";
import { LearningPathCard } from "./LearningPathCard";
import { PlanSummaryCard } from "./PlanSummaryCard";
import type { IPlanPhase } from "@/src/components/page/student/onboarding/types";

// ─── Icons ────────────────────────────────────────────────────────────────────

function SparkleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  );
}

function RocketIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Derives the final plan data from onboarding store state.
 * Applies phase unlocking based on skill level.
 */
function usePlan() {
  const router = useRouter();
  const { goal, level, topics } = useOnboardingStore((s) => s.formData);

  // Determine how many phases to unlock based on skill level
  const unlockedPhases = useMemo(() => {
    const cfg = LEVEL_PHASE_CONFIG[level];
    return cfg?.unlockedPhases ?? 1;
  }, [level]);

  // Derive estimated time from topic count
  const estimatedTime = useMemo(() => {
    const count = topics.length;
    const complexity =
      COMPLEXITY_CONFIG.find((c) => count <= c.maxTopics) ??
      COMPLEXITY_CONFIG[COMPLEXITY_CONFIG.length - 1];
    const TIME_MAP: Record<number, string> = {
      0: "—", 1: "2–4 weeks", 2: "1–2 months", 3: "2–3 months", 4: "3–5 months", 5: "5–8 months",
    };
    return TIME_MAP[complexity.level] ?? "—";
  }, [topics]);

  // Produce phases with item statuses adapted to unlock level
  const phases = useMemo((): IPlanPhase[] =>
    DEFAULT_PLAN_PHASES.map((phase, idx) => {
      if (idx >= unlockedPhases) return phase; // keep locked
      // First unlocked phase: "ready"; subsequent: "upcoming"
      const itemStatus = idx === 0 ? ("ready" as const) : ("upcoming" as const);
      return {
        ...phase,
        items: phase.items.map((item) => ({ ...item, status: itemStatus })),
      };
    }),
    [unlockedPhases],
  );

  const handleStart = useCallback(() => {
    router.push("/");
  }, [router]);

  const handleBack = useCallback(() => {
    router.push("/onboarding/topics");
  }, [router]);

  return { goal, level, topics, unlockedPhases, estimatedTime, phases, handleStart, handleBack };
}

// ─── Step Badge ───────────────────────────────────────────────────────────────

function StepBadge() {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#6B6BFF]/10 to-[#4cd7f6]/10 border border-[#6B6BFF]/20 backdrop-blur-sm">
      <span className="text-[#6B6BFF]"><SparkleIcon /></span>
      <span className="text-xs font-bold text-[#6B6BFF] tracking-wider uppercase">
        Step 4 of 4 — Your Plan
      </span>
    </div>
  );
}

// ─── Celebration banner ───────────────────────────────────────────────────────

function CelebrationBanner({ goal }: { goal: string }) {
  return (
    <div className="relative w-full max-w-4xl bg-gradient-to-r from-[#6B6BFF]/8 via-[#818cf8]/6 to-[#4cd7f6]/8 border border-[#6B6BFF]/15 rounded-2xl px-6 py-4 overflow-hidden">
      {/* Decorative shimmer */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_0%_50%,rgba(107,107,255,0.12)_0%,transparent_60%)]" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_100%_50%,rgba(76,215,246,0.10)_0%,transparent_60%)]" aria-hidden="true" />

      <div className="relative flex items-center gap-4">
        {/* Checkmark circle */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6B6BFF] to-[#4648D4] flex items-center justify-center shrink-0 shadow-[0_4px_16px_rgba(107,107,255,0.45)]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-bold text-[#131B2E]">
            Your personalized learning path is ready! 🎉
          </span>
          <span className="text-xs text-[#64647A]">
            Crafted by AI based on your goal{goal ? ` — ${goal}` : ""}, skill level & selected topics.
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

/**
 * Orchestrates the Plan onboarding step.
 * Displays the AI-generated learning path with phase breakdown and profile summary.
 */
export default function PlanContainer() {
  const {
    goal, level, topics,
    unlockedPhases, estimatedTime,
    phases, handleStart, handleBack,
  } = usePlan();

  return (
    <div className="w-full flex flex-col items-center gap-8 px-6 py-12">
      {/* Step badge */}
      <StepBadge />

      {/* Header */}
      <div className="flex flex-col items-center gap-3 text-center max-w-2xl">
        <h1 className="text-[44px] font-bold text-[#131B2E] leading-tight tracking-tight">
          Here&apos;s your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6B6BFF] via-[#818cf8] to-[#4cd7f6]">
            AI-crafted path
          </span>
        </h1>
        <p className="text-base text-[#64647A] leading-relaxed max-w-lg">
          Every phase is tailored to your unique goal and expertise — start when you&apos;re ready.
        </p>
      </div>

      {/* Celebration banner */}
      <CelebrationBanner goal={goal} />

      {/* ── Content: Learning Path + Summary Sidebar ── */}
      <div className="flex items-start gap-5 w-full max-w-4xl">
        <LearningPathCard phases={phases} unlockedPhases={unlockedPhases} />
        <PlanSummaryCard
          goal={goal}
          level={level}
          topics={topics}
          estimatedTime={estimatedTime}
        />
      </div>

      {/* ── CTA ── */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-3">
          {/* Back button */}
          <Button
            onClick={handleBack}
            size="unstyled"
            variant="unstyled"
            className="px-6 py-4 rounded-2xl text-sm font-semibold text-[#84849A] border border-[#E2E2EA] bg-white hover:border-[#6B6BFF]/40 hover:text-[#6B6BFF] transition-all duration-200 cursor-pointer"
          >
            ← Back
          </Button>

          {/* Primary CTA */}
          <Button
            onClick={handleStart}
            size="unstyled"
            variant="unstyled"
            className={[
              "relative px-14 py-4 rounded-2xl text-sm font-bold tracking-wide",
              "text-white cursor-pointer",
              "bg-gradient-to-r from-[#6B6BFF] to-[#4648D4]",
              "shadow-[0_6px_24px_rgba(107,107,255,0.45)]",
              "hover:shadow-[0_8px_32px_rgba(107,107,255,0.6)] hover:-translate-y-0.5",
              "active:translate-y-0 active:shadow-[0_3px_14px_rgba(107,107,255,0.35)]",
              "transition-all duration-200 ease-out",
            ].join(" ")}
            rightIcon={<RocketIcon />}
          >
            Start My Learning Journey
          </Button>
        </div>

        <p className="flex items-center gap-1.5 text-[11px] text-[#ADADC0]">
          <ShieldCheckIcon />
          <span>
            Data-driven pathing based on{" "}
            <span className="text-[#4648D4] font-semibold">50,000+ career trajectories</span>
          </span>
        </p>
      </div>
    </div>
  );
}
