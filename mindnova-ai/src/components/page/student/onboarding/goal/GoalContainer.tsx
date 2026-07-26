"use client";

import Image from "next/image";
import { useGoalStep } from "@/src/components/page/student/onboarding/hooks";
import { Button, ArrowRightIcon } from "@/src/components/ui";
import GoalCard from "./GoalCard";

// ─── Defensive UI Fallbacks ───────────────────────────────────────────────────

function GoalErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="max-w-lg w-full p-8 rounded-2xl bg-red-50 border border-red-200 text-center flex flex-col items-center gap-4 my-6 shadow-sm">
      <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xl font-bold">
        ✕
      </div>
      <h3 className="text-lg font-bold text-red-900">Unable to load objectives</h3>
      <p className="text-sm text-red-700 max-w-md">{message}</p>
      <Button
        variant="unstyled"
        size="unstyled"
        onClick={onRetry}
        className="px-6 py-2.5 bg-white border border-red-300 text-red-700 text-xs font-bold rounded-xl shadow-sm hover:bg-red-50 transition-colors"
      >
        Retry Loading Goals
      </Button>
    </div>
  );
}

function GoalEmptyState() {
  return (
    <div className="max-w-lg w-full p-8 rounded-2xl bg-gray-50 border border-gray-200 text-center flex flex-col items-center gap-3 my-6">
      <span className="text-2xl">📭</span>
      <h3 className="text-base font-bold text-gray-800">No Learning Goals Found</h3>
      <p className="text-xs text-gray-500 max-w-sm">
        There are currently no objectives configured in the curriculum database.
      </p>
    </div>
  );
}

// ─── Main Dumb Presentation Component ─────────────────────────────────────────

export default function GoalContainer() {
  const {
    goals,
    selectedId,
    error,
    handleSelect,
    handleContinue,
    retry,
  } = useGoalStep();

  return (
    <div className="w-full flex flex-col items-center gap-8 px-6 py-12">
      {/* Header */}
      <div className="max-w-3xl flex flex-col items-center justify-center gap-4 text-center">
        <div className="w-[151.5px] px-3 py-1 flex justify-center items-center gap-2.5 rounded-full bg-[#57DFFE]/10 border border-[#57DFFE]/20">
          <Image
            src="/icons/gemini2.svg"
            width={16.5}
            height={16.5}
            alt=""
            aria-hidden="true"
          />
          <span className="text-[13px] font-semibold text-[#00687A]">
            MINDNOVA AI
          </span>
        </div>
        <h1 className="text-[36px] sm:text-[44px] lg:text-[48px] font-bold text-[#131B2E] tracking-tight leading-tight">
          What is your learning goal?
        </h1>
        <p className="text-base sm:text-lg text-[#464554] max-w-xl">
          Choose one main goal to help MindNova AI personalize your syllabus and experience.
        </p>
      </div>

      {/* Defensive UI Render (Early Return Principle) */}
      {error ? (
        <GoalErrorState message={error} onRetry={retry} />
      ) : goals.length === 0 ? (
        <GoalEmptyState />
      ) : (
        <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              icon={goal.icon}
              title={goal.title}
              description={goal.description}
              isActive={selectedId === goal.id}
              onClick={() => handleSelect(goal.id, goal.title)}
            />
          ))}
        </div>
      )}

      {/* Continue CTA */}
      <div className="w-full flex flex-col items-center justify-center gap-3 mt-4">
        <Button
          variant="unstyled"
          size="unstyled"
          disabled={selectedId === null}
          onClick={handleContinue}
          className={
            selectedId !== null
              ? "py-5 px-14 rounded-xl bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] text-white font-bold text-sm shadow-[0_6px_24px_rgba(107,107,255,0.35)] hover:shadow-[0_8px_28px_rgba(107,107,255,0.5)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              : "py-5 px-14 rounded-xl bg-[#F0F0F7] border border-[#E2E2EA] text-[#A0A0C0] font-semibold text-sm cursor-not-allowed"
          }
          rightIcon={<ArrowRightIcon />}
        >
          Continue to Skill Assessment
        </Button>
        <span className="text-xs text-[#64647A]">
          You can always change or refine your active objectives later in settings.
        </span>
      </div>
    </div>
  );
}
