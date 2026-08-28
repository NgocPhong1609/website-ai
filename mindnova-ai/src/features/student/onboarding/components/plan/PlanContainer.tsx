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
 <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C0392B] border border-[#E8E2D9] backdrop-blur-sm">
 <span className="text-[#C0392B]"><SparkleIcon /></span>
 <span className="text-xs font-bold text-[#C0392B] tracking-wider uppercase">
 Step 4 of 4 — Your Plan
 </span>
 </div>
 );
}

function CelebrationBanner({ goal }: { goal: string }) {
 return (
 <div className="relative w-full max-w-4xl bg-[#C0392B] via-[#818cf8]/6 border border-[#E8E2D9] rounded-2xl px-6 py-4 overflow-hidden">
 <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_0%_50%,rgba(107,107,255,0.12)_0%,transparent_60%)]" aria-hidden="true" />
 <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_100%_50%,rgba(76,215,246,0.10)_0%,transparent_60%)]" aria-hidden="true" />

 <div className="relative flex items-center gap-4">
 

 <div className="flex flex-col gap-0.5">
 <span className="text-sm font-bold text-[#131B2E]">
 Your personalized learning path is ready! 
 </span>
 <span className="text-xs text-[#8A8478]">
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
 <h1 className="text-[44px] font-bold text-[#131B2E] leading-tight tracking-tight">
 Here&apos;s your{" "}
 <span className="text-transparent bg-clip-text bg-[#C0392B] via-[#818cf8] ">
 AI-crafted path
 </span>
 </h1>
 <p className="text-base text-[#8A8478] leading-relaxed max-w-lg">
 Every phase is dynamically tailored to your unique goal and expertise — start when you&apos;re ready.
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
 className="px-6 py-4 rounded-2xl text-sm font-semibold text-[#84849A] border border-[#E2E2EA] bg-white hover:border-[#E8E2D9] hover:text-[#C0392B] transition-all duration-200 cursor-pointer"
 >
 ← Back
 </Button>

 <Button
 onClick={handleStart}
 size="unstyled"
 variant="unstyled"
 className={[
 "relative px-14 py-4 rounded-2xl text-sm font-bold tracking-wide",
 "text-white cursor-pointer",
 " bg-[#C0392B] ",
 "shadow-[0_6px_24px_rgba(107,107,255,0.45)]",
 "hover:shadow-[0_8px_32px_rgba(107,107,255,0.6)] hover:-translate-y-0.5",
 "active:translate-y-0 active:shadow-[0_3px_14px_rgba(107,107,255,0.35)]",
 "transition-all duration-200 ease-out",
 ].join(" ")}
 rightIcon={<RocketIcon />}
 >
 Start My Learning Journey
 </Button>
 </div>

 <p className="flex items-center gap-1.5 text-[11px] text-[#ADADC0]">
 <ShieldCheckIcon />
 <span>
 AI-powered intelligent curriculum generation engine
 </span>
 </p>
 </div>
 </div>
 );
}