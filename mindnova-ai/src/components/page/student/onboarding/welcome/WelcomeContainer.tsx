"use client";

import { useWelcomeStep } from "@/src/components/page/student/onboarding/hooks";
import HeroSectionLeft from "./HeroSectionLeft";
import HeroSectionRight from "./HeroSectionRight";

export default function WelcomeContainer() {
  const { features, handleGetStarted, handleExplore } = useWelcomeStep();

  return (
    <div className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#F4F6FF] via-white to-[#F8FCFF] px-6 sm:px-10 lg:px-16 py-12 md:py-20">
      {/* Subtle ambient decorative orbs */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#6B6BFF]/15 via-[#818cf8]/10 to-transparent blur-[90px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-[#00C2B3]/10 via-[#4CD7F6]/10 to-transparent blur-[80px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 max-w-[1340px] w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 xl:gap-20 mx-auto">
        <HeroSectionLeft
          features={features}
          onGetStarted={handleGetStarted}
          onExplore={handleExplore}
        />
        <HeroSectionRight />
      </div>
    </div>
  );
}
