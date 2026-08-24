"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, ArrowRightIcon } from "@shared/components/ui";
import { useOnboardingStore } from "@/src/features/student/onboarding/stores/onboardingStore";
import { AiProjectionCard } from "./AiProjectionCard";

// ─── Static Icons ─────────────────────────────────────────────────────────────

function SparkleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
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

// ─── Hook ─────────────────────────────────────────────────────────────────────

function useTimeSelection() {
  const router = useRouter();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const selectTimeAvailable = useOnboardingStore((s) => s.selectTimeAvailable);

  const timeOptions = [
    "1-2 tiếng/ngày",
    "2-4 tiếng/ngày",
    "Full time (4+ tiếng/ngày)"
  ];

  const toggleTime = useCallback((time: string) => {
    setSelectedTime(time);
  }, []);

  const handleGenerate = useCallback(() => {
    if (selectedTime) {
      selectTimeAvailable(selectedTime);
      router.push("/onboarding/generating");
    }
  }, [selectedTime, selectTimeAvailable, router]);

  return {
    selectedTime,
    canGenerate: !!selectedTime,
    toggleTime,
    handleGenerate,
    timeOptions
  };
}

// ─── Step Badge ───────────────────────────────────────────────────────────────

function StepBadge() {
  return (
    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#6B6BFF]/8 border border-[#6B6BFF]/20">
      <SparkleIcon />
      <span className="text-xs font-semibold text-[#6B6BFF] tracking-wide">
        Step 3 of 4 — Personalization
      </span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TopicsContainer() {
  const {
    selectedTime,
    canGenerate,
    toggleTime,
    handleGenerate,
    timeOptions
  } = useTimeSelection();

  return (
    <div className="w-full flex flex-col items-center gap-8 px-6 py-12">
      {/* Step badge */}
      <StepBadge />

      {/* Header */}
      <div className="flex flex-col items-center gap-3 text-center max-w-2xl">
        <h1 className="text-4xl font-bold text-[#131B2E] leading-tight tracking-tight">
          Bạn có bao nhiêu{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6B6BFF] to-[#4cd7f6]">
            thời gian rảnh
          </span> mỗi ngày?
        </h1>
        <p className="text-[15px] text-[#64647A] leading-relaxed max-w-lg">
          Chọn thời gian phù hợp để AI tính toán khối lượng bài học tối ưu cho bạn.
        </p>
      </div>

      {/* Content: topics grid + AI sidebar */}
      <div className="flex items-start gap-5 w-full max-w-4xl">
        
        <div className="flex-1 bg-white border border-[#E8E8F0] rounded-3xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#6B6BFF]" />
            <h3 className="text-xs font-bold text-[#84849A] uppercase tracking-wider">Thời gian rảnh</h3>
          </div>

          <div className="flex flex-col gap-3 min-h-[120px] content-start">
            {timeOptions.map((time) => {
              const isSelected = selectedTime === time;
              return (
                <button
                  key={time}
                  type="button"
                  onClick={() => toggleTime(time)}
                  className={`px-4 py-3.5 flex items-center justify-between gap-2 rounded-xl text-sm font-semibold transition-all border ${
                    isSelected
                      ? "bg-[#6B6BFF]/10 text-[#6B6BFF] border-[#6B6BFF] shadow-sm"
                      : "bg-white text-[#464554] border-[#E8E8F0] hover:border-[#C7C4D7] hover:bg-[#F8F8FF]"
                  }`}
                >
                  <span>{time}</span>
                  {isSelected && <span className="text-[#6B6BFF]">✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* KHU VỰC PHẢI: Giữ nguyên Card tĩnh */}
        <AiProjectionCard selectedCount={selectedTime ? 1 : 0} />
      </div>

      {/* CTA */}
      <div className="flex flex-col items-center gap-3">
        <Button
          onClick={handleGenerate}
          disabled={!canGenerate}
          size="unstyled"
          variant="unstyled"
          className={[
            "relative px-12 py-3.5 rounded-xl text-sm font-semibold text-white",
            "bg-gradient-to-r from-[#6B6BFF] to-[#4648D4]",
            "shadow-[0_4px_20px_rgba(107,107,255,0.4)]",
            "hover:shadow-[0_6px_28px_rgba(107,107,255,0.55)] hover:-translate-y-0.5",
            "active:translate-y-0 active:shadow-[0_2px_12px_rgba(107,107,255,0.3)]",
            "transition-all duration-200 ease-out",
            "disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none",
          ].join(" ")}
          rightIcon={<ArrowRightIcon />}
        >
          Generate My Learning Path
        </Button>

        <p className="flex items-center gap-1.5 text-[11px] text-[#ADADC0]">
          <ShieldCheckIcon />
          <span>
            Data-driven pathing based on{" "}
            <span className="text-[#4648D4] font-medium">
              50,000+ career trajectories
            </span>
          </span>
        </p>
      </div>
    </div>
  );
}