"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ONBOARDING_GOALS, ONBOARDING_LEVELS, ONBOARDING_TIMES } from "../constants";
import { useOnboardingStore } from "../stores/onboardingStore";
import type { GeneratePlanPayload, OnboardingAnswers } from "../types";

/** Rehydrates the persisted answers on the client; returns true once ready. */
export function useOnboardingHydration(): boolean {
  const hasHydrated = useOnboardingStore((s) => s.hasHydrated);

  useEffect(() => {
    const persistApi = useOnboardingStore.persist;
    if (persistApi && !persistApi.hasHydrated()) {
      void persistApi.rehydrate();
    } else {
      useOnboardingStore.setState({ hasHydrated: true });
    }
  }, []);

  return hasHydrated;
}

export type OnboardingScreen = "skills" | "topics" | "generating" | "plan";

/** First page the learner must go back to before `screen` makes sense, or null. */
export function missingPrerequisite(
  screen: OnboardingScreen,
  answers: OnboardingAnswers & { hasPlan: boolean },
): string | null {
  if (!answers.goalId) return "/onboarding/goal";
  if (screen === "skills") return null;
  if (!answers.levelId) return "/onboarding/skills";
  if (screen === "topics") return null;
  if (!answers.timeId) return "/onboarding/topics";
  if (screen === "plan" && !answers.hasPlan) return "/onboarding/generating";
  return null;
}

/**
 * Sends the learner back to the first unanswered question when a step is
 * opened directly (bookmark, refresh in a new tab). Returns true when the
 * screen can render.
 */
export function useStepGuard(screen: OnboardingScreen): boolean {
  const router = useRouter();
  const hydrated = useOnboardingHydration();
  const goalId = useOnboardingStore((s) => s.goalId);
  const levelId = useOnboardingStore((s) => s.levelId);
  const timeId = useOnboardingStore((s) => s.timeId);
  const topics = useOnboardingStore((s) => s.topics);
  const hasPlan = useOnboardingStore((s) => s.plan !== null);

  const redirect = hydrated
    ? missingPrerequisite(screen, { goalId, levelId, timeId, topics, hasPlan })
    : null;

  useEffect(() => {
    if (redirect) router.replace(redirect);
  }, [redirect, router]);

  return hydrated && !redirect;
}

/** Human-readable labels of the current answers. */
export function useOnboardingSummary() {
  const goalId = useOnboardingStore((s) => s.goalId);
  const levelId = useOnboardingStore((s) => s.levelId);
  const timeId = useOnboardingStore((s) => s.timeId);
  const topics = useOnboardingStore((s) => s.topics);

  return {
    goal: ONBOARDING_GOALS.find((g) => g.id === goalId) ?? null,
    level: ONBOARDING_LEVELS.find((l) => l.id === levelId) ?? null,
    time: ONBOARDING_TIMES.find((t) => t.id === timeId) ?? null,
    topics,
  };
}

export function buildPlanPayload(answers: OnboardingAnswers): GeneratePlanPayload | null {
  const goal = ONBOARDING_GOALS.find((g) => g.id === answers.goalId);
  const level = ONBOARDING_LEVELS.find((l) => l.id === answers.levelId);
  const time = ONBOARDING_TIMES.find((t) => t.id === answers.timeId);
  if (!goal || !level || !time) return null;

  return {
    goal: goal.title,
    currentLevel: level.title,
    timeAvailable: time.title,
    topics: answers.topics,
  };
}
