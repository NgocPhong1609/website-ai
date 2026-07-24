"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/src/features/student/onboarding/hooks/useOnboarding";
import { ONBOARDING_GOALS } from "@/src/features/student/onboarding/constants";
import { Button, ArrowRightIcon } from "@shared/components/ui";
import GoalCard from "./GoalCard";

export default function GoalContainer() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { selectGoal } = useOnboarding();

  const handleSelect = (id: number, goalTitle: string) => {
    setSelectedId(id);
    selectGoal(goalTitle);
  };

  return (
    <div className="w-full flex flex-col items-center gap-8 px-6 py-12">
      {/* Header */}
      <div className="w-3xl flex flex-col items-center justify-center gap-4">
        <div className="w-[151.5px] px-3 py-1 flex justify-center items-center gap-3 rounded-full bg-[#57DFFE]/10 border border-[#57DFFE]/20">
          <Image
            src="/icons/gemini2.svg"
            width={16.5}
            height={16.5}
            alt=""
            aria-hidden="true"
          />
          <span className="text-[14px] font-semibold text-[#00687A]">
            MINDNOVA AI
          </span>
        </div>
        <h1 className="text-[48px] font-bold text-[#131B2E]">
          What is your learning goal?
        </h1>
        <p className="text-lg text-[#464554]">
          Choose one main goal to help MindNova AI personalize your experience.
        </p>
      </div>

      {/* Goal Cards Grid */}
      <div className="max-w-5xl w-full grid grid-cols-3 gap-6">
        {ONBOARDING_GOALS.map((goal) => (
          <GoalCard
            key={goal.id}
            icon={goal.icon}
            title={goal.title}
            description={goal.description}
            isActive={selectedId === goal.id}
            onClick={() => handleSelect(goal.id, goal.title)}
          />
        ))}
      </div>

      {/* Continue CTA */}
      <div className="w-full flex flex-col items-center justify-center gap-4 mt-8">
        <Button
          variant="unstyled"
          size="unstyled"
          disabled={selectedId === null}
          onClick={() => router.push("/onboarding/skills")}
          className="py-6 px-16 rounded-lg bg-[#E2E8F0] text-[#464554]/40 disabled:cursor-not-allowed"
          rightIcon={<ArrowRightIcon />}
        >
          Continue
        </Button>
        <span className="text-[14px] text-[#464554]">
          You can always change your goal later in settings.
        </span>
      </div>
    </div>
  );
}
