"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { GENERATING_STEPS } from "@/src/features/student/onboarding/constants";
import { OrbitAnimation } from "./OrbitAnimation";
import { StepItem } from "./StepItem";
import { LeftFloatingIcons, RightFloatingIcons } from "./FloatingIcons";

export default function GeneratingContainer() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 4000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 py-12 overflow-hidden">
      {/* Decorative floating icons — absolutely positioned on sides */}
      <LeftFloatingIcons />
      <RightFloatingIcons />

      {/* Content column */}
      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-lg">
        {/* Header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-[32px] font-bold text-[#131B2E] leading-tight">
            MindNova AI is creating your study plan…
          </h1>
          <p className="text-sm text-[#84849A] max-w-sm leading-relaxed">
            Our neural network is tailoring content specifically for your goals
            and expertise.
          </p>
        </div>

        {/* Orbit animation */}
        <OrbitAnimation />

        {/* Progress steps */}
        <div className="w-full flex flex-col gap-2">
          {GENERATING_STEPS.map((step) => (
            <StepItem key={step.id} label={step.label} status={step.status} />
          ))}
        </div>

        {/* Footer note */}
        <p className="text-xs text-center text-[#84849A] leading-relaxed max-w-sm">
          MindNova AI uses GPT-4 and custom models to generate your curriculum.{" "}
          <br />
          This usually takes less than 30 seconds.
        </p>
      </div>
    </div>
  );
}
