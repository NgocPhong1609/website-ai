import React from "react";
import { twMerge } from "tailwind-merge";
import { CheckIcon } from "./icons";
import type { StepKey } from "./types";
import { STEPS } from "./constants";

interface StepIndicatorProps {
  currentStep: StepKey;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-0 w-full max-w-md mx-auto py-2">
      {STEPS.map((step, index) => {
        const isDone = step.id < currentStep;
        const isActive = step.id === currentStep;
        const isLast = index === STEPS.length - 1;

        return (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5 min-w-[80px]">
              <div
                aria-current={isActive ? "step" : undefined}
                className={twMerge(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300",
                  isDone
                    ? "bg-[#4F46E5] text-white shadow-2xs"
                    : isActive
                    ? "bg-[#4F46E5] text-white ring-4 ring-indigo-100 shadow-sm"
                    : "bg-gray-200 text-gray-500"
                )}
              >
                {isDone ? <CheckIcon size={14} /> : step.id}
              </div>

              <span
                className={twMerge(
                  "text-[11px] transition-colors duration-200 text-center",
                  isActive
                    ? "text-gray-900 font-extrabold"
                    : isDone
                    ? "text-[#4F46E5] font-bold"
                    : "text-gray-400 font-medium"
                )}
              >
                {step.label}
              </span>
            </div>

            {!isLast && (
              <div className="flex-1 h-[2px] mx-2 mb-5 rounded-full overflow-hidden bg-gray-200">
                <div
                  className="h-full bg-[#4F46E5] transition-all duration-500 ease-out"
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
