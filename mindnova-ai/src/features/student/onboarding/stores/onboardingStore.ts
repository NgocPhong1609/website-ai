import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { MAX_TOPICS } from "../constants";
import type { GeneratedPlan, GoalId, LevelId, OnboardingAnswers, TimeId } from "../types";

interface OnboardingState extends OnboardingAnswers {
  plan: GeneratedPlan | null;
  hasHydrated: boolean;

  selectGoal: (goalId: GoalId) => void;
  selectLevel: (levelId: LevelId) => void;
  toggleTopic: (topic: string) => void;
  selectTime: (timeId: TimeId) => void;
  setPlan: (plan: GeneratedPlan) => void;
  reset: () => void;
}

const INITIAL_ANSWERS: OnboardingAnswers & { plan: GeneratedPlan | null } = {
  goalId: null,
  levelId: null,
  topics: [],
  timeId: null,
  plan: null,
};

/**
 * Answers survive a refresh within the tab (sessionStorage). Hydration is
 * triggered manually by `useOnboardingHydration` to avoid SSR mismatches.
 * Any change to an answer drops the generated plan so it is never stale.
 */
export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      ...INITIAL_ANSWERS,
      hasHydrated: false,

      selectGoal: (goalId) =>
        set((state) =>
          state.goalId === goalId ? state : { goalId, topics: [], plan: null },
        ),
      selectLevel: (levelId) => set({ levelId, plan: null }),
      toggleTopic: (topic) =>
        set((state) => {
          if (state.topics.includes(topic)) {
            return { topics: state.topics.filter((t) => t !== topic), plan: null };
          }
          if (state.topics.length >= MAX_TOPICS) return state;
          return { topics: [...state.topics, topic], plan: null };
        }),
      selectTime: (timeId) => set({ timeId, plan: null }),
      setPlan: (plan) => set({ plan }),
      reset: () => set(INITIAL_ANSWERS),
    }),
    {
      name: "mindnova_onboarding",
      storage: createJSONStorage(() => sessionStorage),
      skipHydration: true,
      partialize: ({ goalId, levelId, topics, timeId, plan }) => ({ goalId, levelId, topics, timeId, plan }),
      onRehydrateStorage: () => () => {
        useOnboardingStore.setState({ hasHydrated: true });
      },
    },
  ),
);
