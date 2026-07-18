"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/src/features/student/onboarding/hooks/useOnboarding";
import { ONBOARDING_SKILLS } from "@/src/features/student/onboarding/constants";
import { Stepper, Button, ArrowRightIcon } from "@shared/components/ui";
import SkillCard from "./SkillCard";

export default function SkillContainer() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { selectLevel } = useOnboarding();

  const handleSelect = (id: number, level: string) => {
    setSelectedId(id);
    selectLevel(level);
  };

  return (
    <div className="max-w-5xl w-full flex flex-col items-center gap-4 px-8 py-32">
      <div className="w-full max-w-md pb-10">
        <Stepper currentStep={4} totalSteps={6} title="Profile Setup" />
      </div>

      {/* Header */}
      <div className="w-full flex flex-col items-center gap-3">
        <h1 className="font-bold text-[32px] text-[#131B2E]">
          What is your current skill level?
        </h1>
        <p className="text-[16px] max-w-127.5 w-full text-center text-[#464554]">
          This helps our AI tailor the complexity of your study plan and
          practice exercises to your specific needs.
        </p>
      </div>

      {/* Skill Cards Grid */}
      <div className="max-w-240 w-full grid grid-cols-3 gap-6 mt-5">
        {ONBOARDING_SKILLS.map((skill) => (
          <SkillCard
            key={skill.id}
            level={skill.level}
            description={skill.description}
            iconPath={skill.iconPath}
            iconBgColor={skill.iconBgColor}
            isActive={selectedId === skill.id}
            onClick={() => handleSelect(skill.id, skill.level)}
          />
        ))}
      </div>

      <Button
        variant="unstyled"
        size="unstyled"
        disabled={selectedId === null}
        onClick={() => router.push("/onboarding/topics")}
        className= {
          selectedId !== null
            ? "py-6 px-16 rounded-lg bg-[#4F46E5] text-white shadow-md hover:bg-[#4338CA] transition-all duration-200 cursor-pointer"
            : "py-6 px-16 rounded-lg bg-[#E2E8F0] text-[#464554]/40 cursor-not-allowed"
        }
        rightIcon={<ArrowRightIcon />}
      >
        Continue
      </Button>
    </div>
  );
}
