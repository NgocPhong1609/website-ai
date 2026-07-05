import { create } from "zustand";
import type { OnboardingStep, OnboardingFormData } from "@/src/features/student/onboarding/types";

// ─── State Flow ──────────────────────────────────────────────────────────────
// welcome → goal → level → topics → [signup | generating]

interface IOnboardingState {
  currentStep: OnboardingStep;
  isAuthenticated: boolean;
  progressData: number;
  formData: OnboardingFormData;

  // Actions
  setStep: (step: OnboardingStep) => void;
  setAuth: (isAuth: boolean) => void;
  setProgress: (progress: number) => void;
  selectGoal: (goal: string) => void;
  selectLevel: (level: string) => void;
  selectTopics: (topics: string[]) => void;
  completeSignUp: () => void;
  resetOnboarding: () => void;
}

const INITIAL_FORM_DATA: OnboardingFormData = {
  goal: "",
  level: "",
  topics: [],
};

export const useOnboardingStore = create<IOnboardingState>((set, get) => ({
  currentStep: "welcome",
  isAuthenticated: false,
  progressData: 0,
  formData: INITIAL_FORM_DATA,

  setStep: (step) => set({ currentStep: step }),
  setAuth: (isAuth) => set({ isAuthenticated: isAuth }),
  setProgress: (progress) => set({ progressData: progress }),

  selectGoal: (goal) =>
    set((state) => ({
      formData: { ...state.formData, goal },
      currentStep: "level",
    })),

  selectLevel: (level) =>
    set((state) => ({
      formData: { ...state.formData, level },
      currentStep: "topics",
    })),

  selectTopics: (topics) => {
    const { isAuthenticated } = get();
    set((state) => ({
      formData: { ...state.formData, topics },
      currentStep: isAuthenticated ? "generating" : "signup",
    }));
  },

  completeSignUp: () => {
    set({ isAuthenticated: true, currentStep: "generating" });
  },

  resetOnboarding: () =>
    set({
      currentStep: "welcome",
      progressData: 0,
      formData: INITIAL_FORM_DATA,
    }),
}));