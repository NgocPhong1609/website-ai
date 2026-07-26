"use client";

import { useSkillStep } from "@/src/components/page/student/onboarding/hooks";
import { Stepper, Button, ArrowRightIcon } from "@/src/components/ui";
import SkillCard from "./SkillCard";

// ─── Defensive UI Fallbacks ───────────────────────────────────────────────────

function SkillErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="max-w-lg w-full p-8 rounded-2xl bg-red-50 border border-red-200 text-center flex flex-col items-center gap-3 my-8">
      <span className="text-2xl">⚠️</span>
      <h3 className="text-base font-bold text-red-900">Assessment Error</h3>
      <p className="text-xs text-red-700 max-w-sm">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-2 px-5 py-2 bg-white border border-red-300 text-red-700 text-xs font-bold rounded-xl shadow-sm hover:bg-red-100 transition-colors"
      >
        Reload Skill Matrix
      </button>
    </div>
  );
}

// ─── Main Dumb Presentation Component ─────────────────────────────────────────

export default function SkillContainer() {
  const {
    skills,
    selectedId,
    error,
    handleSelect,
    handleContinue,
    handleBack,
    retry,
  } = useSkillStep();

  return (
    <div className="max-w-5xl w-full mx-auto flex flex-col items-center gap-6 px-6 sm:px-8 py-12 md:py-20">
      <div className="w-full max-w-md pb-6">
        <Stepper currentStep={2} totalSteps={4} title="Skill Profiling" />
      </div>

      {/* Header */}
      <div className="w-full flex flex-col items-center gap-3 text-center">
        <h1 className="font-bold text-[36px] sm:text-[40px] text-[#131B2E] tracking-tight leading-tight">
          What is your current skill level?
        </h1>
        <p className="text-base text-[#64647A] max-w-xl leading-relaxed">
          This helps our neural engine calibrate the technical depth, quiz complexity, and programming tasks to your exact starting point.
        </p>
      </div>

      {/* Defensive UI (Early Return Principle) */}
      {error ? (
        <SkillErrorState message={error} onRetry={retry} />
      ) : skills.length === 0 ? (
        <div className="p-8 text-center text-gray-500 text-sm">No skill matrices available in catalogue.</div>
      ) : (
        <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-3 gap-6 mt-3">
          {skills.map((skill) => (
            <SkillCard
              key={skill.id}
              level={skill.level}
              description={skill.description}
              iconPath={skill.iconPath}
              iconBgColor={skill.iconBgColor}
              isActive={selectedId === skill.id}
              onClick={() => handleSelect(skill.id, skill.level)}
            />
          ))}
        </div>
      )}

      {/* CTA Buttons */}
      <div className="flex items-center gap-4 mt-6">
        <Button
          variant="unstyled"
          size="unstyled"
          onClick={handleBack}
          className="px-6 py-4 rounded-xl text-sm font-semibold text-[#64647A] bg-white border border-[#E2E2EA] hover:bg-gray-50 hover:text-[#1A1A2E] transition-colors cursor-pointer"
        >
          ← Back
        </Button>

        <Button
          variant="unstyled"
          size="unstyled"
          disabled={selectedId === null}
          onClick={handleContinue}
          className={
            selectedId !== null
              ? "py-4 px-12 rounded-xl bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] text-white text-sm font-bold shadow-[0_6px_20px_rgba(107,107,255,0.35)] hover:shadow-[0_8px_26px_rgba(107,107,255,0.5)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              : "py-4 px-12 rounded-xl bg-[#F0F0F7] border border-[#E2E2EA] text-[#A0A0C0] text-sm font-semibold cursor-not-allowed"
          }
          rightIcon={<ArrowRightIcon />}
        >
          Continue to Topics
        </Button>
      </div>
    </div>
  );
}
