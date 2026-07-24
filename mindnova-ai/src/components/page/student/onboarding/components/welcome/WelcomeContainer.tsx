"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { ONBOARDING_FEATURES } from "@/src/components/page/student/onboarding/constants";
import HeroSectionLeft from "./HeroSectionLeft";
import HeroSectionRight from "./HeroSectionRight";

export default function WelcomeContainer() {
  const router = useRouter();

  const handleGetStarted = useCallback(() => {
    router.push("/onboarding/goal");
  }, [router]);

  const handleExplore = useCallback(() => {
    router.push("/login");
  }, [router]);

  return (
    <div className="w-full flex-1 flex items-center justify-between px-12 py-10">
      <HeroSectionLeft
        features={ONBOARDING_FEATURES}
        onGetStarted={handleGetStarted}
        onExplore={handleExplore}
      />
      <HeroSectionRight />
    </div>
  );
}
