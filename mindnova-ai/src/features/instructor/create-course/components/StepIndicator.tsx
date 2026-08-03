// ─── StepIndicator ────────────────────────────────────────────────────────────
// Three-step progress bar shown at the top of the form.

import { twMerge } from "tailwind-merge";
import { CheckIcon } from "./icons";
import type { StepKey } from "../types";
import { STEPS } from "../constants";

interface StepIndicatorProps {
  currentStep: StepKey;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-0 w-full max-w-md mx-auto">
      {STEPS.map((step, index) => {
        const isDone = step.id < currentStep;
        const isActive = step.id === currentStep;
        const isLast = index === STEPS.length - 1;

        return (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            {/* Step circle + label */}
            <div className="flex flex-col items-center gap-2 min-w-[72px]">
              {/* Circle */}
              <div
                aria-current={isActive ? "step" : undefined}
                className={twMerge(
                  "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300",
                  isDone
                    ? "bg-[#4648D4] text-white shadow-[0_0_0_4px_rgba(70,72,212,0.15)]"
                    : isActive
                      ? "bg-[#4648D4] text-white shadow-[0_0_0_6px_rgba(70,72,212,0.18)] scale-105"
                      : "bg-[#EAEAF4] text-[#9090B0]",
                )}
              >
                {isDone ? <CheckIcon size={14} /> : step.id}
              </div>

              {/* Label */}
              <span
                className={twMerge(
                  "text-xs font-medium transition-colors duration-200",
                  isActive
                    ? "text-[#4648D4] font-semibold"
                    : isDone
                      ? "text-[#4648D4]"
                      : "text-[#B0B0C8]",
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {!isLast && (
              <div className="flex-1 h-[2px] mx-1 mb-5 rounded-full overflow-hidden bg-[#EAEAF4]">
                <div
                  className="h-full bg-[#4648D4] transition-all duration-500 ease-out"
                  style={{ width: isDone ? "100%" : "0%" }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
