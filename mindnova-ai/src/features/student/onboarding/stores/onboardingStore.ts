import { create } from "zustand";
import type { OnboardingStep, OnboardingFormData } from "@/src/features/student/onboarding/types";

// ─── State Flow ──────────────────────────────────────────────────────────────
// welcome → goal → level → topics → [signup | generating]

interface IOnboardingState {
  currentStep: OnboardingStep;
  isAuthenticated: boolean;
  progressData: number;
  formData: OnboardingFormData;
  generatedPlan: unknown; // Thêm trường lưu kết quả từ AI

  // Actions
  setStep: (step: OnboardingStep) => void;
  setAuth: (isAuth: boolean) => void;
  setProgress: (progress: number) => void;
  selectGoal: (goal: string) => void;
  selectLevel: (level: string) => void;
  selectTopics: (topics: string[]) => void;
  completeSignUp: () => void;
  resetOnboarding: () => void;
  setGeneratedPlan: (plan: unknown) => void; // Thêm action lưu kết quả AI
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
  generatedPlan: null, // Khởi tạo ban đầu là null

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

  // Action lưu kết quả AI vào store
  setGeneratedPlan: (plan) => set({ generatedPlan: plan }),

  resetOnboarding: () =>
    set({
      currentStep: "welcome",
      progressData: 0,
      formData: INITIAL_FORM_DATA,
      generatedPlan: null,
    }),
}));