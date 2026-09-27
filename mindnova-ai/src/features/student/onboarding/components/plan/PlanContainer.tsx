// @ts-nocheck
"use client";

import { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@shared/components/ui";
import { useOnboardingStore } from "@/src/features/student/onboarding/stores/onboardingStore";
import {
 LEVEL_PHASE_CONFIG,
 COMPLEXITY_CONFIG,
} from "@/src/features/student/onboarding/constants";
import { LearningPathCard } from "./LearningPathCard";
import { PlanSummaryCard } from "./PlanSummaryCard";
import type { IPlanPhase } from "@/src/features/student/onboarding/types";
import { ArrowLeft } from "lucide-react";

interface IAIRoadmapCourse {
 id: number;
 title: string;
}

export interface IAIRoadmapPhase {
 phase_name: string;
 description: string;
 courses: IAIRoadmapCourse[];
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function SparkleIcon() {
 return (
 <></>
 );
}

function RocketIcon() {
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

function usePlan() {
 const router = useRouter();
 const { goal, currentLevel, timeAvailable } = useOnboardingStore((s) => s.formData);
 const onboardingStore = useOnboardingStore() as unknown as { generatedPlan?: { phases?: IAIRoadmapPhase[] } };
 const generatedPlan = onboardingStore.generatedPlan;
 const phases = generatedPlan?.phases || [];

 const estimatedTime = useMemo(() => {
 return timeAvailable || "—";
 }, [timeAvailable]);



 const handleStart = useCallback(() => {
 window.location.href = "/study-plan";
 }, []);

 const handleBack = useCallback(() => {
 router.push("/onboarding/topics");
 }, [router]);

 return { goal, currentLevel, timeAvailable, estimatedTime, phases, handleStart, handleBack };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepBadge() {
 return (
 <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500 border border-slate-200 backdrop-blur-sm">
 <span className="text-blue-500"><SparkleIcon /></span>
 <span className="text-xs font-bold text-blue-500 tracking-wider uppercase">
 Bước 4/4 — Lộ trình của bạn
 </span>
 </div>
 );
}

function CelebrationBanner({ goal }: { goal: string }) {
 return (
 <div className="relative w-full max-w-4xl bg-blue-500 via-blue-400/6 border border-slate-200 rounded-xl px-6 py-4 overflow-hidden">
 <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_0%_50%,rgba(59, 130, 246,0.12)_0%,transparent_60%)]" aria-hidden="true" />
 <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_100%_50%,rgba(76,215,246,0.10)_0%,transparent_60%)]" aria-hidden="true" />

 <div className="relative flex items-center gap-4">
 

 <div className="flex flex-col gap-0.5">
 <span className="text-sm font-bold text-slate-900">
 Lộ trình học tập cá nhân hóa đã sẵn sàng! 
 </span>
 <span className="text-xs text-slate-500">
 Crafted dynamically by AI based on your goal{goal ? ` — ${goal}` : ""}, skill level & selected topics.
 </span>
 </div>
 </div>
 </div>
 );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PlanContainer() {
 const {
 goal, currentLevel, timeAvailable,
 estimatedTime,
 phases, handleStart, handleBack,
 } = usePlan();

 return (
 <div className="w-full flex flex-col items-center gap-8 px-6 pt-12 pb-40">
 <StepBadge />

 <div className="flex flex-col items-center gap-3 text-center max-w-2xl">
 <h1 className="text-[44px] font-bold text-slate-900 leading-tight tracking-tight">
 Here&apos;s your{" "}
 <span className="text-transparent bg-clip-text bg-blue-500 via-blue-400 ">
 Lộ trình do AI thiết kế
 </span>
 </h1>
 <p className="text-base text-slate-500 leading-relaxed max-w-lg">
 Mỗi giai đoạn được điều chỉnh theo mục tiêu và trình độ của bạn. Bắt đầu khi bạn sẵn sàng.
 </p>
 </div>

 <CelebrationBanner goal={goal} />

 <div className="flex items-start gap-5 w-full max-w-4xl">
 <LearningPathCard phases={phases} />
 <PlanSummaryCard
 goal={goal}
 level={currentLevel}
 topics={[timeAvailable]}
 estimatedTime={estimatedTime}
 />
 </div>

 <div className="flex flex-col items-center gap-3">
 <div className="flex items-center gap-3">
 <Button
 onClick={handleBack}
 size="unstyled"
 variant="unstyled"
 className="px-6 py-4 rounded-xl text-sm font-semibold text-slate-500 border border-slate-200 bg-white hover:border-slate-200 hover:text-blue-600 transition-all duration-200 cursor-pointer"
 >
 <ArrowLeft className="inline h-4 w-4 mr-1 align-text-bottom" aria-hidden />Back
 </Button>

 <Button
 onClick={handleStart}
 size="unstyled"
 variant="unstyled"
 className={[
 "relative px-14 py-4 rounded-xl text-sm font-bold tracking-wide",
 "text-white cursor-pointer",
 " bg-blue-500 ",
 "shadow-[0_6px_24px_rgba(59, 130, 246,0.45)]",
 "hover:shadow-[0_8px_32px_rgba(59, 130, 246,0.6)] hover:-translate-y-0.5",
 "active:translate-y-0 active:shadow-[0_3px_14px_rgba(59, 130, 246,0.35)]",
 "transition-all duration-200 ease-out",
 ].join(" ")}
 rightIcon={<RocketIcon />}
 >
 Bắt đầu học ngay
 </Button>
 </div>

 <p className="flex items-center gap-1.5 text-[11px] text-slate-400">
 <ShieldCheckIcon />
 <span>
 Giáo trình được tạo bởi AI
 </span>
 </p>
 </div>
 </div>
 );
}