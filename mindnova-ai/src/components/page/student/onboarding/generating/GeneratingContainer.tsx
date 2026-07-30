"use client";

import { useGeneratingStep } from "@/src/components/page/student/onboarding/hooks";
import { OrbitAnimation } from "./OrbitAnimation";
import { StepItem } from "./StepItem";
import { LeftFloatingIcons, RightFloatingIcons } from "./FloatingIcons";

export default function GeneratingContainer() {
  const { steps, progressPercent } = useGeneratingStep();

  return (
    <div className="relative w-full min-h-[85vh] flex flex-col items-center justify-center px-6 py-12 overflow-hidden">
      {/* Decorative floating icons — absolutely positioned on sides */}
      <LeftFloatingIcons />
      <RightFloatingIcons />

      {/* Content column */}
      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-lg">
        {/* Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-[#6B6BFF]/10 text-[#6B6BFF] border border-[#6B6BFF]/20 animate-pulse">
            Neural Architecture Search • {progressPercent}%
          </span>
          <h1 className="text-[28px] sm:text-[32px] font-bold text-[#131B2E] leading-tight mt-1">
            MindNova AI is compiling your curriculum…
          </h1>
          <p className="text-sm text-[#84849A] max-w-md leading-relaxed">
            Our autonomous agents are selecting problem sets and video theory lectures optimized for your chosen stack.
          </p>
        </div>

        {/* Orbit animation */}
        <div className="my-2">
          <OrbitAnimation />
        </div>

        {/* Progress steps (Dynamic real-time updates) */}
        <div className="w-full flex flex-col gap-2.5">
          {steps.map((step) => (
            <StepItem key={step.id} label={step.label} status={step.status} />
          ))}
        </div>

        {/* Footer note */}
        <p className="text-xs text-center text-[#84849A] leading-relaxed max-w-sm pt-2">
          MindNova AI cross-references documentation from official docs and enterprise architectures. <br />
          Please remain on this window while verification completes.
        </p>
      </div>
    </div>
  );
}
