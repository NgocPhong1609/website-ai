import { useOnboardingStore } from "@/src/components/page/student/onboarding/stores";
import type { OnboardingStep } from "@/src/components/page/student/onboarding/types";

/**
 * Custom hook that provides a clean abstraction over the onboarding store.
 */
export function useOnboarding() {
  const currentStep = useOnboardingStore((s) => s.currentStep);
  const progressData = useOnboardingStore((s) => s.progressData);
  const formData = useOnboardingStore((s) => s.formData);
  const isAuthenticated = useOnboardingStore((s) => s.isAuthenticated);

  const setStep = useOnboardingStore((s) => s.setStep);
  const setAuth = useOnboardingStore((s) => s.setAuth);
  const setProgress = useOnboardingStore((s) => s.setProgress);
  const selectGoal = useOnboardingStore((s) => s.selectGoal);
  const selectLevel = useOnboardingStore((s) => s.selectLevel);
  const selectTopics = useOnboardingStore((s) => s.selectTopics);
  const selectFreeTime = useOnboardingStore((s) => s.selectFreeTime);
  const completeSignUp = useOnboardingStore((s) => s.completeSignUp);
  const resetOnboarding = useOnboardingStore((s) => s.resetOnboarding);

  const isStepActive = (step: OnboardingStep): boolean => currentStep === step;

  return {
    // State
    currentStep,
    progressData,
    formData,
    isAuthenticated,

    // Derived
    isStepActive,

    // Actions
    setStep,
    setAuth,
    setProgress,
    selectGoal,
    selectLevel,
    selectTopics,
    selectFreeTime,
    completeSignUp,
    resetOnboarding,
  };
}
