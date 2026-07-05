import React from "react";
import { twMerge } from "tailwind-merge";

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  title?: string;
  className?: string;
}

export default function Stepper({
  currentStep,
  totalSteps,
  title,
  className,
}: StepperProps) {
  // Outer Container: Đổi thành flex-col và thêm gap-2 để tạo khoảng cách giữa 2 hàng
  const containerClasses = twMerge("w-full flex flex-col gap-2.5", className);

  return (
    <div className={containerClasses}>
      {/* HÀNG TRÊN: Khối chứa 2 dòng chữ */}
      <div className="w-full flex justify-between items-center text-sm font-semibold">
        <span
          className="text-[#6B6BFF] uppercase tracking-wide"
          aria-live="polite"
        >
          STEP {currentStep} OF {totalSteps}
        </span>

        {title && <span className="text-[#84849A]">{title}</span>}
      </div>

      {/* HÀNG DƯỚI: Khối chứa các vạch tiến trình trải dài 100% width */}
      <div
        className="w-full flex items-center gap-2"
        role="progressbar"
        aria-valuenow={currentStep}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
      >
        {Array.from({ length: totalSteps }).map((_, index) => {
          const isActive = index < currentStep;
          return (
            <div
              key={index}
              className={twMerge(
                "h-2 flex-1 rounded-full transition-colors duration-300",
                isActive ? "bg-[#6B6BFF]" : "bg-[#E2E2EA]",
              )}
            />
          );
        })}
      </div>
    </div>
  );
}
