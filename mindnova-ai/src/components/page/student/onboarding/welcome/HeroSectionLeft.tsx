import Image from "next/image";
import Button from "@/src/components/ui/Button";
import FeatureCard from "./FeatureCard";
import type { IFeature } from "@/src/components/page/student/onboarding/types";
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
    <div className="flex-1 max-w-2xl flex flex-col items-start gap-6 z-10">
      {/* High-tech badge */}
      <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#6B6BFF]/10 via-[#818CF8]/10 to-[#4CD7F6]/10 border border-[#6B6BFF]/25 shadow-sm backdrop-blur-sm">
        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-[#6B6BFF]/20 animate-pulse">
          <Image
            src="/icons/gemini.svg"
            alt=""
            aria-hidden="true"
            width={16}
            height={16}
          />
        </div>
        <span className="text-xs font-bold bg-gradient-to-r from-[#4648D4] via-[#6B6BFF] to-[#00A896] bg-clip-text text-transparent uppercase tracking-wider">
          MindNova AI • Autonomous Learning Engine
        </span>
      </div>

      {/* Hero Headline */}
      <h1 className="text-[40px] sm:text-[48px] lg:text-[54px] font-extrabold text-[#131B2E] tracking-tight leading-[1.12]">
        Master new skills with{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6B6BFF] via-[#5848DF] to-[#00C2B3]">
          Generative Intelligence
        </span>
      </h1>

      {/* Hero Description */}
      <p className="text-base sm:text-lg text-[#525266] leading-relaxed max-w-xl font-normal">
        Harness advanced neural models to dynamically curate your custom programming syllabus, calibrating exercises to your exact expertise level in real time.
      </p>

      {/* CTA Button Group */}
      <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-2">
        <Button
          onClick={onGetStarted}
          className="group relative px-8 py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-[#6B6BFF] via-[#5848DF] to-[#4648D4] shadow-[0_8px_30px_rgba(107,107,255,0.4)] hover:shadow-[0_12px_40px_rgba(107,107,255,0.6)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 overflow-hidden"
        >
          <span>Start Your AI Roadmap</span>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="group-hover:translate-x-1 transition-transform duration-200"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Button>

        <Button
          onClick={onExplore}
          className="px-7 py-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm hover:border-[#6B6BFF]/50 hover:bg-[#F8F9FE] text-[#464554] font-semibold text-base transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Explore Platform</span>
          <span className="text-[#6B6BFF] font-bold">→</span>
        </Button>
      </div>

      {/* Trust metric & assurance */}
      <div className="flex items-center gap-4 text-xs text-[#7A7A90] pt-1 font-medium">
        <span className="flex items-center gap-1.5">
          <span className="text-green-500">✔</span> No credit card needed
        </span>
        <span>•</span>
        <span className="flex items-center gap-1.5">
          <span className="text-[#6B6BFF]">⚡</span> Takes under 60 seconds
        </span>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mt-4">
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
