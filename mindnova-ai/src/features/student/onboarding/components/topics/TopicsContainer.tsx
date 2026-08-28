"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, ArrowRightIcon } from "@shared/components/ui";
import { useOnboardingStore } from "@/src/features/student/onboarding/stores/onboardingStore";
import { AiProjectionCard } from "./AiProjectionCard";

// ─── Static Icons ─────────────────────────────────────────────────────────────

function SparkleIcon() {
 return (
 <></>
 );
}

function ShieldCheckIcon() {
 return (
 <></>
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
 <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF7F2] border border-[#E8E2D9]">
 <SparkleIcon />
 <span className="text-xs font-semibold text-[#C0392B] tracking-wide">
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
 <span className="text-transparent bg-clip-text bg-[#C0392B] ">
 thời gian rảnh
 </span> mỗi ngày?
 </h1>
 <p className="text-[15px] text-[#8A8478] leading-relaxed max-w-lg">
 Chọn thời gian phù hợp để AI tính toán khối lượng bài học tối ưu cho bạn.
 </p>
 </div>

 {/* Content: topics grid + AI sidebar */}
 <div className="flex items-start gap-5 w-full max-w-4xl">
 
 <div className="flex-1 bg-white border border-[#E8E8F0] rounded-3xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col gap-4">
 <div className="flex items-center gap-2 mb-2">
 <div className="w-1.5 h-1.5 rounded-full bg-[#FAF7F2]" />
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
 ? "bg-[#FAF7F2] text-[#C0392B] border-[#E8E2D9] shadow-sm"
 : "bg-white text-[#464554] border-[#E8E8F0] hover:border-[#C7C4D7] hover:bg-[#F8F8FF]"
 }`}
 >
 <span>{time}</span>
 {isSelected && <span className="text-[#C0392B]"></span>}
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
 " bg-[#C0392B] ",
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
 <span className="text-[#C0392B] font-medium">
 50,000+ career trajectories
 </span>
 </span>
 </p>
 </div>
 </div>
 );
}