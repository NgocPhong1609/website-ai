"use client";

import { twMerge } from "tailwind-merge";
import type { IPlanPhase, IPlanItem, PlanItemStatus } from "@/src/features/student/onboarding/types";

// ─── Status config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  PlanItemStatus,
  { dotClass: string; labelClass: string; label: string }
> = {
  ready:    { dotClass: "bg-[#4648D4]",        labelClass: "text-[#4648D4] font-semibold",  label: "Ready"    },
  upcoming: { dotClass: "bg-[#00A896]",        labelClass: "text-[#00A896] font-semibold",  label: "Up Next"  },
  locked:   { dotClass: "bg-[#C7C4D7]",        labelClass: "text-[#ADADC0]",                label: "Locked"   },
};

// ─── Icons ────────────────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M3.5 2L7 5L3.5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function PhaseIcon({ status }: { status: PlanItemStatus }) {
  if (status === "ready")    return <CheckIcon />;
  if (status === "upcoming") return <ArrowIcon />;
  return <LockIcon />;
}

// ─── Phase header badge ────────────────────────────────────────────────────────

interface PhaseHeaderProps {
  phase: IPlanPhase;
  phaseIndex: number;
  isUnlocked: boolean;
}

function PhaseHeader({ phase, phaseIndex, isUnlocked }: PhaseHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2.5">
        {/* Phase number circle */}
        <div
          className={twMerge(
            "w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0",
            isUnlocked
              ? "bg-gradient-to-br from-[#6B6BFF] to-[#4648D4] text-white shadow-[0_2px_8px_rgba(107,107,255,0.35)]"
              : "bg-[#E8E8F0] text-[#ADADC0]",
          )}
        >
          {phaseIndex + 1}
        </div>
        <div>
          <span
            className={twMerge(
              "text-xs font-bold tracking-wide",
              isUnlocked ? "text-[#131B2E]" : "text-[#ADADC0]",
            )}
          >
            {phase.title}
          </span>
        </div>
      </div>

      {/* Duration badge */}
      <span
        className={twMerge(
          "text-[10px] font-semibold px-2.5 py-1 rounded-full border",
          isUnlocked
            ? "bg-[#6B6BFF]/8 text-[#4648D4] border-[#6B6BFF]/15"
            : "bg-[#F5F5F8] text-[#C7C4D7] border-[#EDEDF2]",
        )}
      >
        {phase.duration}
      </span>
    </div>
  );
}

// ─── Individual item row ──────────────────────────────────────────────────────

interface PlanItemRowProps {
  item: IPlanItem;
  isLast: boolean;
}

function PlanItemRow({ item, isLast }: PlanItemRowProps) {
  const cfg = STATUS_CONFIG[item.status];

  return (
    <div className="flex items-center gap-3 relative">
      {/* Vertical connector line */}
      {!isLast && (
        <div
          className="absolute left-[9px] top-[20px] w-px h-full bg-[#E8E8F0]"
          aria-hidden="true"
        />
      )}

      {/* Status dot */}
      <div
        className={twMerge(
          "relative z-10 w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0 text-white",
          cfg.dotClass,
          item.status === "locked" && "text-[#ADADC0]",
        )}
      >
        <PhaseIcon status={item.status} />
      </div>

      {/* Label + duration */}
      <div className="flex-1 flex items-center justify-between py-2">
        <span
          className={twMerge(
            "text-xs leading-snug",
            item.status === "locked" ? "text-[#ADADC0]" : "text-[#464554] font-medium",
          )}
        >
          {item.label}
        </span>
        <span
          className={twMerge(
            "text-[10px] shrink-0 ml-2",
            cfg.labelClass,
          )}
        >
          {item.status !== "locked" ? item.duration : cfg.label}
        </span>
      </div>
    </div>
  );
}

// ─── Phase block ──────────────────────────────────────────────────────────────

interface PhaseBlockProps {
  phase: IPlanPhase;
  phaseIndex: number;
  isUnlocked: boolean;
}

function PhaseBlock({ phase, phaseIndex, isUnlocked }: PhaseBlockProps) {
  return (
    <div
      className={twMerge(
        "rounded-2xl border p-4 transition-all duration-300",
        isUnlocked
          ? "bg-white border-[#E8E8F0] shadow-[0_2px_12px_rgba(107,107,255,0.06)]"
          : "bg-[#FAFAFA] border-[#F0F0F7]",
      )}
    >
      <PhaseHeader phase={phase} phaseIndex={phaseIndex} isUnlocked={isUnlocked} />

      <div className="pl-1 space-y-0.5">
        {phase.items.map((item, idx) => (
          <PlanItemRow key={item.id} item={item} isLast={idx === phase.items.length - 1} />
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export interface LearningPathCardProps {
  phases: IPlanPhase[];
  unlockedPhases: number;
}

export function LearningPathCard({ phases, unlockedPhases }: LearningPathCardProps) {
  return (
    <div className="flex-1 bg-white/70 backdrop-blur-sm border border-[#E8E8F0] rounded-3xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06),0_8px_32px_rgba(107,107,255,0.06)]">
      {/* Card header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0F0F7] bg-gradient-to-r from-white to-[#F8F8FF]">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6B6BFF] opacity-60" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#6B6BFF]" />
          </span>
          <span className="text-xs font-bold text-[#84849A] uppercase tracking-[0.12em]">
            Your Learning Path
          </span>
        </div>

        {/* Progress pill */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#6B6BFF] text-white shadow-[0_2px_10px_rgba(107,107,255,0.35)]">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path d="M2 5L4 7L8 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {unlockedPhases} / {phases.length} phases unlocked
        </div>
      </div>

      {/* Phase list */}
      <div className="p-5 flex flex-col gap-3">
        {phases.map((phase, idx) => (
          <PhaseBlock
            key={phase.id}
            phase={phase}
            phaseIndex={idx}
            isUnlocked={idx < unlockedPhases}
          />
        ))}

        {/* Footer hint */}
        <p className="text-[11px] text-[#ADADC0] text-center leading-relaxed mt-1">
          Complete each phase to unlock the next — powered by adaptive AI.
        </p>
      </div>
    </div>
  );
}
