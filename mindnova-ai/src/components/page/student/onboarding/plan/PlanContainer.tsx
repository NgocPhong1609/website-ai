"use client";

import { Button } from "@/src/components/ui";
import { usePlanStep } from "@/src/components/page/student/onboarding/hooks";
import { LearningPathCard } from "./LearningPathCard";
import { PlanSummaryCard } from "./PlanSummaryCard";
import { GuestAuthModal } from "@/src/components/page/student/onboarding/auth/GuestAuthModal";

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

function BookmarkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
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

function UninitializedPlanState({ onRestart }: { onRestart: () => void }) {
  return (
    <div className="max-w-md mx-auto my-16 p-8 rounded-2xl bg-white border border-[#E2E8F0] text-center shadow-lg flex flex-col items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl font-bold">
        💡
      </div>
      <h2 className="text-xl font-bold text-gray-900">Plan Not Initialized</h2>
      <p className="text-sm text-gray-600 leading-relaxed">
        We noticed you haven&apos;t completed your learning profile assessment yet. Let&apos;s take 1 minute to define your targets!
      </p>
      <button
        type="button"
        onClick={onRestart}
        className="mt-2 px-8 py-3 rounded-xl bg-[#6B6BFF] hover:bg-[#5858E0] text-white font-bold text-sm shadow-md transition-colors"
      >
        Start Assessment Survey
      </button>
    </div>
  );
}

function StepBadge() {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#6B6BFF]/10 to-[#4cd7f6]/10 border border-[#6B6BFF]/20 backdrop-blur-sm">
      <span className="text-[#6B6BFF]">
        <SparkleIcon />
      </span>
      <span className="text-xs font-bold text-[#6B6BFF] tracking-wider uppercase">
        Step 4 of 4 — Your AI Syllabus & Timeline
      </span>
    </div>
  );
}

function CelebrationBanner({ goal, freeTime }: { goal: string; freeTime: string }) {
  return (
    <div className="relative w-full max-w-5xl bg-gradient-to-r from-[#6B6BFF]/10 via-[#818cf8]/10 to-[#4cd7f6]/10 border border-[#6B6BFF]/25 rounded-3xl px-7 py-6 overflow-hidden shadow-sm">
      <div className="relative flex items-center gap-5">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6B6BFF] to-[#4648D4] flex items-center justify-center shrink-0 shadow-[0_4px_20px_rgba(107,107,255,0.5)] text-white text-2xl">
          🎯
        </div>

        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-lg font-extrabold text-[#131B2E] truncate">
            Your AI-Generated Timeline is Fully Compiled!
          </span>
          <span className="text-xs sm:text-sm text-[#525266] leading-relaxed">
            Optimized for <strong className="text-[#4648D4]">{goal}</strong> with a daily pace of <strong className="text-[#00A896]">{freeTime}</strong>. Save this roadmap to track your real-time progress.
          </span>
        </div>
      </div>
    </div>
  );
}

export default function PlanContainer() {
  const {
    goal,
    level,
    topics,
    freeTime,
    unlockedPhases,
    estimatedTime,
    phases,
    isUninitialized,
    isAuthModalOpen,
    authReason,
    closeAuthModal,
    handleSaveRoadmap,
    handleStart,
    handleBack,
    handleRestartOnboarding,
    handleAuthSuccess,
  } = usePlanStep();

  if (isUninitialized) {
    return <UninitializedPlanState onRestart={handleRestartOnboarding} />;
  }

  return (
    <>
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center gap-8 px-6 sm:px-8 py-12 md:py-16">
        <StepBadge />

        <div className="flex flex-col items-center gap-3 text-center max-w-3xl">
          <h1 className="text-[38px] sm:text-[48px] font-black text-[#131B2E] leading-tight tracking-tight">
            Your Personal{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6B6BFF] via-[#818cf8] to-[#4cd7f6]">
              Learning Timeline
            </span>
          </h1>
          <p className="text-base text-[#525266] leading-relaxed max-w-xl">
            Every phase represents a critical skill milestone. Bookmark your roadmap or enroll immediately to unlock video lectures and instructor feedback.
          </p>
        </div>

        <CelebrationBanner goal={goal} freeTime={freeTime} />

        <div className="flex flex-col lg:flex-row items-start gap-6 w-full max-w-5xl">
          <div className="flex-1 w-full min-w-0">
            <LearningPathCard phases={phases} unlockedPhases={unlockedPhases} />
          </div>
          <div className="w-full lg:w-72 shrink-0">
            <PlanSummaryCard
              goal={goal}
              level={level}
              topics={topics}
              freeTime={freeTime}
              estimatedTime={estimatedTime}
            />
          </div>
        </div>

        {/* Action Button Group - "All Roads Lead to Registration" */}
        <div className="flex flex-col items-center gap-4 mt-4 w-full max-w-2xl">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 w-full">
            <Button
              onClick={handleSaveRoadmap}
              size="unstyled"
              variant="unstyled"
              className="px-8 py-4 rounded-2xl text-sm font-extrabold text-[#4648D4] border-2 border-[#6B6BFF]/40 bg-indigo-50/70 hover:bg-indigo-100/80 hover:border-[#6B6BFF] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-xs hover:scale-[1.02]"
            >
              <BookmarkIcon />
              <span>Save My Roadmap</span>
            </Button>

            <Button
              onClick={handleStart}
              size="unstyled"
              variant="unstyled"
              className="relative px-10 py-4 rounded-2xl text-sm font-black tracking-wide text-white bg-gradient-to-r from-[#6B6BFF] via-[#5848DF] to-[#4648D4] shadow-[0_8px_28px_rgba(107,107,255,0.45)] hover:shadow-[0_12px_36px_rgba(107,107,255,0.6)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 ease-out cursor-pointer flex items-center justify-center gap-2.5"
            >
              <span>Enroll & Start Training</span>
              <RocketIcon />
            </Button>
          </div>

          <div className="flex items-center gap-4 text-xs text-[#84849A] font-semibold pt-1">
            <button
              type="button"
              onClick={handleBack}
              className="hover:text-[#6B6BFF] transition-colors underline cursor-pointer"
            >
              ← Re-calibrate Parameters
            </button>
            <span>•</span>
            <p className="flex items-center gap-1">
              <ShieldCheckIcon />
              <span>Free guest preview mode active</span>
            </p>
          </div>
        </div>
      </div>

      {/* Embedded Modal adhering to zero-bounce rate strategy */}
      <GuestAuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        compellingReason={authReason}
        defaultTab="register"
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}
