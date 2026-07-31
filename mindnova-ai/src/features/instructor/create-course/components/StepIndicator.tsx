"use client";

import { twMerge } from "tailwind-merge";
import type { StepKey } from "../types";

// ─── Step config ──────────────────────────────────────────────────────────────

const STEPS: { id: StepKey; label: string; description: string }[] = [
  { id: 1, label: "Thông tin cơ bản", description: "Tên, mô tả, danh mục" },
  { id: 2, label: "Cấu trúc khóa học", description: "Modules & bài học" },
  { id: 3, label: "Cài đặt & Giá", description: "Định giá & xuất bản" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function StepIndicator({ currentStep }: { currentStep: StepKey }) {
  return (
    <nav aria-label="Các bước tạo khóa học" className="flex items-center gap-0">
      {STEPS.map((step, index) => {
        const isDone = currentStep > step.id;
        const isCurrent = currentStep === step.id;

        return (
          <div key={step.id} className="flex items-center">
            {/* Step bubble + label */}
            <div className="flex items-center gap-2.5">
              {/* Bubble */}
              <div
                className={twMerge(
                  "w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0 border-2 transition-all duration-200",
                  isDone
                    ? "bg-[#4648D4] border-[#4648D4] text-white"
                    : isCurrent
                    ? "bg-white border-[#4648D4] text-[#4648D4]"
                    : "bg-white border-[#D0D0E8] text-[#B0B0C8]"
                )}
              >
                {isDone ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  step.id
                )}
              </div>

              {/* Labels */}
              <div className="hidden sm:flex flex-col leading-tight">
                <span
                  className={twMerge(
                    "text-[12px] font-bold transition-colors",
                    isCurrent ? "text-[#1A1A2E]" : isDone ? "text-[#4648D4]" : "text-[#B0B0C8]"
                  )}
                >
                  {step.label}
                </span>
                <span className="text-[10px] text-[#B0B0C8]">{step.description}</span>
              </div>
            </div>

            {/* Connector line (not after last step) */}
            {index < STEPS.length - 1 && (
              <div
                className={twMerge(
                  "mx-3 h-[2px] w-8 sm:w-12 rounded-full transition-colors duration-300",
                  isDone ? "bg-[#4648D4]" : "bg-[#EAEAF4]"
                )}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
