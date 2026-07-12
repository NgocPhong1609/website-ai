"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button, ArrowRightIcon } from "@shared/components/ui";
import { useOnboardingStore } from "@/src/features/student/onboarding/stores/onboardingStore";
import { ONBOARDING_TOPICS } from "@/src/features/student/onboarding/constants";
import { TopicsGrid } from "./TopicsGrid";
import { AiProjectionCard } from "./AiProjectionCard";
import type { ITopic } from "@/src/features/student/onboarding/types";

// ─── Icons ────────────────────────────────────────────────────────────────────

function SparkleIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Encapsulates topic-selection logic and store integration.
 * Returns derived state and handlers ready to pass to child components.
 */
function useTopicsSelection() {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const selectTopics = useOnboardingStore((s) => s.selectTopics);

  const toggleTopic = useCallback((topic: ITopic) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(topic.id) ? next.delete(topic.id) : next.add(topic.id);
      return next;
    });
  }, []);

  const handleGenerate = useCallback(() => {
    const topicLabelMap = new Map(
      ONBOARDING_TOPICS.map((t) => [t.id, t.label]),
    );
    const labels = [...selectedIds]
      .map((id) => topicLabelMap.get(id))
      .filter((label): label is string => label !== undefined);
    selectTopics(labels);
    router.push("/onboarding/generating");
  }, [selectedIds, selectTopics, router]);


  return {
    selectedIds,
    selectedCount: selectedIds.size,
    canGenerate: selectedIds.size > 0,
    toggleTopic,
    handleGenerate,
  };
}

// ─── Step Badge ───────────────────────────────────────────────────────────────

function StepBadge() {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#6B6BFF]/10 to-[#4cd7f6]/10 border border-[#6B6BFF]/20 backdrop-blur-sm">
      <span className="text-[#6B6BFF]">
        <SparkleIcon />
      </span>
      <span className="text-xs font-bold text-[#6B6BFF] tracking-wider uppercase">
        Step 3 of 4 — Personalization
      </span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

/**
 * Orchestrates the Topics onboarding step.
 * Owns state via `useTopicsSelection` and passes controlled props to children.
 */
export default function TopicsContainer() {
  const {
    selectedIds,
    selectedCount,
    canGenerate,
    toggleTopic,
    handleGenerate,
  } = useTopicsSelection();

  return (
    <div className="w-full flex flex-col items-center gap-8 px-6 py-12">
      {/* Step badge */}
      <StepBadge />

      {/* Header */}
      <div className="flex flex-col items-center gap-3 text-center max-w-2xl">
        <h1 className="text-[44px] font-bold text-[#131B2E] leading-tight tracking-tight">
          Which topics spark{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6B6BFF] via-[#818cf8] to-[#4cd7f6]">
            your curiosity?
          </span>
        </h1>
        <p className="text-base text-[#64647A] leading-relaxed max-w-lg">
          Select one or more topics below. Our AI will curate a{" "}
          <span className="text-[#4648D4] font-semibold">
            personalized curriculum
          </span>{" "}
          built around your exact interests.
        </p>
      </div>

      {/* ── Content Layout: Grid + Sidebar ── */}
      <div className="flex items-start gap-5 w-full max-w-4xl">
        <TopicsGrid selectedIds={selectedIds} onToggle={toggleTopic} />
        <AiProjectionCard selectedCount={selectedCount} />
      </div>

      {/* ── CTA ── */}
      <div className="flex flex-col items-center gap-3">
        <Button
          onClick={handleGenerate}
          disabled={!canGenerate}
          size="unstyled"
          variant="unstyled"
          className={[
            "relative px-14 py-4 rounded-2xl text-sm font-bold tracking-wide",
            "transition-all duration-200 ease-out",
            canGenerate
              ? [
                  "text-white cursor-pointer",
                  "bg-gradient-to-r from-[#6B6BFF] to-[#4648D4]",
                  "shadow-[0_6px_24px_rgba(107,107,255,0.45)]",
                  "hover:shadow-[0_8px_32px_rgba(107,107,255,0.6)] hover:-translate-y-0.5",
                  "active:translate-y-0 active:shadow-[0_3px_14px_rgba(107,107,255,0.35)]",
                ].join(" ")
              : [
                  "text-[#ADADC0] cursor-not-allowed",
                  "bg-[#F0F0F7] border border-[#E2E2EA]",
                ].join(" "),
          ].join(" ")}
          rightIcon={<ArrowRightIcon />}
        >
          Generate My Learning Path
        </Button>

        <p className="flex items-center gap-1.5 text-[11px] text-[#ADADC0]">
          <ShieldCheckIcon />
          <span>
            Data-driven pathing based on{" "}
            <span className="text-[#4648D4] font-semibold">
              50,000+ career trajectories
            </span>
          </span>
        </p>
      </div>
    </div>
  );
}
