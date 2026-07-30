"use client";

import { Button, ArrowRightIcon } from "@/src/components/ui";
import { useTopicsStep } from "@/src/components/page/student/onboarding/hooks";
import { TopicsGrid } from "./TopicsGrid";
import { AiProjectionCard } from "./AiProjectionCard";

// ─── Icons ────────────────────────────────────────────────────────────────────

function SparkleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#6B6BFF]">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
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

const FREE_TIME_OPTIONS = [
  { label: "1h/day - Casual", desc: "Steady pace, weekends flexible" },
  { label: "2h/day - Dedicated", desc: "Recommended for steady mastery" },
  { label: "3+h/day - Intensive", desc: "Fast-track career pivot" },
];

function StepBadge() {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#6B6BFF]/10 to-[#4cd7f6]/10 border border-[#6B6BFF]/20 backdrop-blur-sm">
      <span className="text-[#6B6BFF]">
        <SparkleIcon />
      </span>
      <span className="text-xs font-bold text-[#6B6BFF] tracking-wider uppercase">
        Step 3 of 3 — Topics & Commitment
      </span>
    </div>
  );
}

export default function TopicsContainer() {
  const {
    selectedIds,
    selectedCount,
    freeTime,
    canGenerate,
    error,
    toggleTopic,
    setFreeTime,
    handleGenerate,
    handleBack,
    retry,
  } = useTopicsStep();

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center gap-8 px-6 sm:px-8 py-12 md:py-16">
      <StepBadge />

      <div className="flex flex-col items-center gap-3 text-center max-w-2xl">
        <h1 className="text-[36px] sm:text-[44px] font-extrabold text-[#131B2E] leading-tight tracking-tight">
          Customize Your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6B6BFF] via-[#818cf8] to-[#4cd7f6]">
            Study Parameters
          </span>
        </h1>
        <p className="text-base text-[#64647A] leading-relaxed max-w-lg">
          Select your daily learning time commitment and core domain subjects. Our AI will compute an optimized roadmap with exact timelines.
        </p>
      </div>

      {error ? (
        <div className="p-8 rounded-2xl bg-red-50 border border-red-200 text-center flex flex-col items-center gap-4">
          <p className="text-sm text-red-700 font-bold">{error}</p>
          <button type="button" onClick={retry} className="px-5 py-2 bg-white rounded-xl text-xs font-bold border border-red-300">Retry</button>
        </div>
      ) : (
        <div className="w-full max-w-5xl flex flex-col gap-8">
          {/* Section 1: Free Time Commitment */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white/80 backdrop-blur-md border border-[#E2E8F0] shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <ClockIcon />
              <h3 className="text-base font-extrabold text-[#131B2E]">Daily Free Time Commitment</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {FREE_TIME_OPTIONS.map((opt) => {
                const isSelected = freeTime.startsWith(opt.label.split(" - ")[0]);
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setFreeTime(opt.label)}
                    className={`p-4 rounded-2xl text-left border transition-all cursor-pointer flex flex-col gap-1 ${
                      isSelected
                        ? "bg-gradient-to-r from-[#6B6BFF]/10 to-[#4648D4]/5 border-[#6B6BFF] shadow-sm scale-[1.01]"
                        : "bg-[#F8F9FE]/60 border-[#E2E8F0] hover:border-[#6B6BFF]/50 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-bold ${isSelected ? "text-[#4648D4]" : "text-[#131B2E]"}`}>
                        {opt.label}
                      </span>
                      {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-[#6B6BFF] animate-pulse" />}
                    </div>
                    <span className="text-xs text-[#64647A] font-normal">{opt.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Topics Grid & Projection */}
          <div className="flex flex-col lg:flex-row items-start gap-6 w-full">
            <div className="flex-1 w-full">
              <div className="mb-3 px-1 flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-[#131B2E]">Domain Subjects of Interest</h3>
                <span className="text-xs text-[#6B6BFF] font-bold">({selectedCount} selected)</span>
              </div>
              <TopicsGrid selectedIds={selectedIds} onToggle={toggleTopic} />
            </div>
            <div className="w-full lg:w-80 shrink-0">
              <AiProjectionCard selectedCount={selectedCount} />
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="flex flex-col items-center gap-3 mt-4">
        <div className="flex items-center gap-4">
          <Button
            onClick={handleBack}
            size="unstyled"
            variant="unstyled"
            className="px-6 py-4 rounded-2xl text-sm font-semibold text-[#64647A] border border-[#E2E2EA] bg-white hover:bg-gray-50 transition-colors cursor-pointer"
          >
            ← Back
          </Button>

          <Button
            onClick={handleGenerate}
            disabled={!canGenerate}
            size="unstyled"
            variant="unstyled"
            className={[
              "relative px-12 py-4 rounded-2xl text-sm font-bold tracking-wide transition-all duration-200 ease-out",
              canGenerate
                ? "text-white bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] shadow-[0_6px_24px_rgba(107,107,255,0.45)] hover:shadow-[0_8px_32px_rgba(107,107,255,0.6)] hover:-translate-y-0.5 cursor-pointer"
                : "text-[#ADADC0] bg-[#F0F0F7] border border-[#E2E2EA] cursor-not-allowed",
            ].join(" ")}
            rightIcon={<ArrowRightIcon />}
          >
            Generate My AI Roadmap ({selectedCount})
          </Button>
        </div>

        <p className="flex items-center gap-1.5 text-[11px] text-[#ADADC0] mt-1">
          <ShieldCheckIcon />
          <span>
            Calibrated against <span className="text-[#4648D4] font-semibold">50,000+ platform training paths</span>
          </span>
        </p>
      </div>
    </div>
  );
}
