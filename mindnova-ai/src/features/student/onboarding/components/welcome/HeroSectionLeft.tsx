import Button from "@shared/components/ui/Button";
import Image from "next/image";
import FeatureCard from "./FeatureCard";
import type { IFeature } from "@/src/features/student/onboarding/types";
import { memo } from "react";

interface HeroSectionLeftProps {
  features: IFeature[];
  onGetStarted: () => void;
  onExplore: () => void;
}

export default memo(function HeroSectionLeft({
  features,
  onGetStarted,
  onExplore,
}: HeroSectionLeftProps) {
  return (
    <div className="w-145 flex flex-col items-start gap-4.5">
      <div className="min-w-45.25 flex items-center justify-center gap-2 p-2 rounded-full bg-[#4648D4]/10">
        <Image
          src="/icons/gemini.svg"
          alt=""
          aria-hidden="true"
          width={22}
          height={22}
        />
        <span className="text-xs text-primary">The Future of Learning</span>
      </div>
      <h1 className="text-[48px] font-bold min-w-127.5">
        Welcome to <span className="text-linear-brand-bright">MindNova AI</span>
      </h1>
      <p className="text-lg max-w-120 text-[#464554]">
        Harness the power of generative intelligence to architect your
        personalized learning journey. Skills mastery, reimagined for the modern
        age.
      </p>
      <div className="mt-5 max-w-112.25 w-full flex gap-3">
        <Button
          onClick={onGetStarted}
          className="max-w-60.5 w-full py-4 rounded-xl text-[20px] font-semibold bg-linear-brand"
        >
          Get Started
        </Button>
        <Button
          onClick={onExplore}
          className="max-w-47.75 w-full rounded-xl bg-white"
        >
          <div className="flex items-center gap-2">
            <span className="text-[14px] text-[#464554]">Explore Platform</span>
            <Image
              src="/icons/arrow.svg"
              alt=""
              aria-hidden="true"
              width={12}
              height={12}
            />
          </div>
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-2 max-w-139 w-full">
        {features.map((feature) => (
          <FeatureCard
            key={feature.id}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </div>
  );
});
