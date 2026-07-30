"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { ONBOARDING_FEATURES } from "@/src/components/page/student/onboarding/constants";

export function useWelcomeStep() {
  const router = useRouter();

  const handleGetStarted = useCallback(() => {
    router.push("/onboarding/goal");
  }, [router]);

  const handleExplore = useCallback(() => {
    router.push("/login");
  }, [router]);

  return {
    features: ONBOARDING_FEATURES,
    handleGetStarted,
    handleExplore,
  };
}
