// @ts-nocheck
"use client";

import { useState } from "react";
import { twMerge } from "tailwind-merge";
import type { IAIRoadmapPhase } from "./PlanContainer";
import { LessonDetailModal } from "./LessonDetailModal";
import { useOnboardingStore } from "@/src/features/student/onboarding/stores/onboardingStore";

// ─── Status config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  PlanItemStatus,
  { dotClass: string; labelClass: string; label: string }
> = {
  ready:    { dotClass: "bg-[#C0392B]",        labelClass: "text-[#C0392B] font-semibold",  label: "Ready"    },
  upcoming: { dotClass: "bg-[#00A896]",        labelClass: "text-[#00A896] font-semibold",  label: "Up Next"  },
  locked:   { dotClass: "bg-[#C7C4D7]",        labelClass: "text-[#ADADC0]",                label: "Locked"   },
};

// ─── Icons ────────────────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <></>
  );
}

function ArrowIcon() {
  return (
    <></>
  );
}

function LockIcon() {
  return (
    <></>
  );
}

function PhaseIcon({ status }: { status: PlanItemStatus }) {
  if (status === "ready")    return <CheckIcon />;
  if (status === "upcoming") return <ArrowIcon />;
  return <LockIcon />;
}

// ─── Phase header badge ────────────────────────────────────────────────────────

interface PhaseHeaderProps {
  phase: IAIRoadmapPhase;
  phaseIndex: number;
}

function PhaseHeader({ phase, phaseIndex }: PhaseHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2.5">
        <div
          className={twMerge(
            "w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0",
            "bg-gradient-to-br from-[#A93226] to-[#C0392B] text-white shadow-[0_2px_8px_rgba(192,57,43,0.35)]"
          )}
        >
          {phaseIndex + 1}
        </div>
        <div>
          <span className="text-xs font-bold tracking-wide text-[#131B2E]">
            {phase.phase_name}
          </span>
        </div>
      </div>

      <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full border bg-[#8A8478]/8 text-[#C0392B] border-[#8A8478]/15">
        {phase.courses.length} courses
      </span>
    </div>
  );
}

// ─── Individual item row ──────────────────────────────────────────────────────

interface PlanItemRowProps {
  course: { id: number; title: string };
  isLast: boolean;
  onLessonClick: (title: string) => void;
}

function PlanItemRow({ course, isLast, onLessonClick }: PlanItemRowProps) {

  return (
    <div className="flex items-center gap-3 relative">
      {!isLast && (
        <div
          className="absolute left-[9px] top-[20px] w-px h-full bg-[#E8E8F0]"
          aria-hidden="true"
        />
      )}

      <div className="relative z-10 w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0 text-white bg-[#C0392B]">
        <CheckIcon />
      </div>

      <div className="flex-1 flex items-center justify-between py-2">
        {/* Bấm vào tên khóa học */}
        <span
          onClick={() => onLessonClick(course.title)}
          className="text-xs leading-snug transition-colors text-[#464554] font-medium hover:text-[#8A8478] cursor-pointer underline-offset-4 hover:underline"
        >
          {course.title}
        </span>
        <span className="text-[10px] shrink-0 ml-2 text-[#C0392B] font-semibold">
          Course
        </span>
      </div>
    </div>
  );
}

// ─── Phase block ──────────────────────────────────────────────────────────────

interface PhaseBlockProps {
  phase: IAIRoadmapPhase;
  phaseIndex: number;
  onLessonClick: (title: string) => void;
}

function PhaseBlock({ phase, phaseIndex, onLessonClick }: PhaseBlockProps) {
  return (
    <div className="rounded-2xl border p-4 transition-all duration-300 bg-white border-[#E8E8F0] shadow-[0_2px_12px_rgba(192,57,43,0.06)]">
      <PhaseHeader phase={phase} phaseIndex={phaseIndex} />
      <p className="text-xs text-[#84849A] mb-3 leading-relaxed">{phase.description}</p>
      <div className="pl-1 space-y-0.5">
        {phase.courses.map((course, idx) => (
          <PlanItemRow 
            key={course.id} 
            course={course} 
            isLast={idx === phase.courses.length - 1} 
            onLessonClick={onLessonClick}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export interface LearningPathCardProps {
  phases: IAIRoadmapPhase[];
}

export function LearningPathCard({ phases }: LearningPathCardProps) {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const formData = useOnboardingStore((s) => s.formData) as { goal?: string };

  return (
    <>
      <div className="flex-1 bg-white/70 backdrop-blur-sm border border-[#E8E8F0] rounded-3xl shadow-[0_2px_8px_rgba(0,0,0,0.06),0_8px_32px_rgba(192,57,43,0.06)]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0F0F7] bg-gradient-to-r from-white to-[#F8F8FF] rounded-t-3xl">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8A8478] opacity-60" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#8A8478]" />
            </span>
            <span className="text-xs font-bold text-[#84849A] uppercase tracking-[0.12em]">
              Your Learning Path
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#8A8478] text-white shadow-[0_2px_10px_rgba(192,57,43,0.35)]">
            <></>
            {phases.length} phases
          </div>
        </div>

        <div className="p-5 flex flex-col gap-3">
          {phases.map((phase, idx) => (
            <PhaseBlock
              key={idx}
              phase={phase}
              phaseIndex={idx}
              onLessonClick={(title) => setSelectedLesson(title)}
            />
          ))}

          <p className="text-[11px] text-[#ADADC0] text-center leading-relaxed mt-1">
            Complete each phase to unlock the next — powered by adaptive AI. Click any lesson to view AI insights & recommended instructor courses.
          </p>
        </div>
      </div>

      {/* Modal hiển thị phân tích AI & Gợi ý khóa học */}
      <LessonDetailModal
        lessonTitle={selectedLesson || ""}
        goal={formData.goal || "General Learning"}
        isOpen={!!selectedLesson}
        onClose={() => setSelectedLesson(null)}
      />
    </>
  );
}