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
  ready: { dotClass: "bg-blue-500", labelClass: "text-blue-500 font-semibold", label: "Ready" },
  upcoming: { dotClass: "bg-emerald-600", labelClass: "text-emerald-600 font-semibold", label: "Tiếp theo" },
  locked: { dotClass: "bg-slate-300", labelClass: "text-slate-400", label: "Locked" },
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
  if (status === "ready") return <CheckIcon />;
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
            "bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-[0_2px_8px_rgba(59, 130, 246,0.35)]"
          )}
        >
          {phaseIndex + 1}
        </div>
        <div>
          <span className="text-xs font-bold tracking-wide text-slate-900">
            {phase.phase_name}
          </span>
        </div>
      </div>

      <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full border bg-slate-500/8 text-blue-500 border-slate-500/15">
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
          className="absolute left-[9px] top-[20px] w-px h-full bg-slate-200"
          aria-hidden="true"
        />
      )}

      <div className="relative z-10 w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0 text-white bg-blue-500">
        <CheckIcon />
      </div>

      <div className="flex-1 flex items-center justify-between py-2">
        {/* Bấm vào tên khóa học */}
        <span
          onClick={() => onLessonClick(course.title)}
          className="text-xs leading-snug transition-colors text-slate-900 font-medium hover:text-slate-500 cursor-pointer underline-offset-4 hover:underline"
        >
          {course.title}
        </span>
        <span className="text-[10px] shrink-0 ml-2 text-blue-500 font-semibold">
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
    <div className="rounded-xl border p-4 transition-all duration-300 bg-white border-slate-200 shadow-[0_2px_12px_rgba(59, 130, 246,0.06)]">
      <PhaseHeader phase={phase} phaseIndex={phaseIndex} />
      <p className="text-xs text-slate-500 mb-3 leading-relaxed">{phase.description}</p>
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
      <div className="flex-1 bg-white/70 backdrop-blur-sm border border-slate-200 rounded-3xl shadow-[0_2px_8px_rgba(0,0,0,0.06),0_8px_32px_rgba(59, 130, 246,0.06)]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50 rounded-t-3xl">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-500 opacity-60" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-slate-500" />
            </span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-[0.12em]">
              Lộ trình học tập của bạn
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-500 text-white shadow-[0_2px_10px_rgba(59, 130, 246,0.35)]">
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

          <p className="text-[11px] text-slate-400 text-center leading-relaxed mt-1">
            Hoàn thành từng giai đoạn để mở giai đoạn tiếp theo. Bấm vào bài học để xem phân tích của AI và khóa học gợi ý.
          </p>
        </div>
      </div>

      {/* Modal hiển thị phân tích AI & Gợi ý khóa học */}
      <LessonDetailModal
        lessonTitle={selectedLesson || ""}
        goal={formData.goal || "Học tập tổng quát"}
        isOpen={!!selectedLesson}
        onClose={() => setSelectedLesson(null)}
      />
    </>
  );
}