import { create } from "zustand";
import type {
  OnboardingStep,
  OnboardingFormData,
} from "@/src/components/page/student/onboarding/types";

// ─── State Flow ──────────────────────────────────────────────────────────────
// welcome → goal → level → topics & time → generating → plan

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
  selectFreeTime: (freeTime: string) => void;
  completeSignUp: () => void;
  resetOnboarding: () => void;
}

const INITIAL_FORM_DATA: OnboardingFormData = {
  goal: "",
  level: "",
  topics: [],
  freeTime: "2h/day - Dedicated",
};

export const useOnboardingStore = create<IOnboardingState>((set) => ({
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
    set((state) => ({
      formData: { ...state.formData, topics },
      currentStep: "generating",
    }));
  },

  selectFreeTime: (freeTime) =>
    set((state) => ({
      formData: { ...state.formData, freeTime },
    })),

  completeSignUp: () => {
    set({ isAuthenticated: true });
  },

  resetOnboarding: () =>
    set({
      currentStep: "welcome",
      progressData: 0,
      formData: INITIAL_FORM_DATA,
    }),
}));
