import { useOnboardingStore } from "@/src/features/student/onboarding/stores";
import type { OnboardingStep } from "@/src/features/student/onboarding/types";

/**
 * Custom hook that provides a clean abstraction over the onboarding store.
 * Components should use this hook instead of importing the store directly,
 * making it easy to swap the underlying state management without touching components.
 */
export function useOnboarding() {
  const currentStep = useOnboardingStore((s) => s.currentStep);
  const progressData = useOnboardingStore((s) => s.progressData);
  const formData = useOnboardingStore((s) => s.formData);
  const isAuthenticated = useOnboardingStore((s) => s.isAuthenticated);

  const setStep = useOnboardingStore((s) => s.setStep);
  const setProgress = useOnboardingStore((s) => s.setProgress);
  const selectGoal = useOnboardingStore((s) => s.selectGoal);
  const selectLevel = useOnboardingStore((s) => s.selectLevel);
  const selectTopics = useOnboardingStore((s) => s.selectTopics);
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
    setProgress,
    selectGoal,
    selectLevel,
    selectTopics,
    completeSignUp,
    resetOnboarding,
  };
}
