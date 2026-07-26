"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "./useOnboarding";
import { ONBOARDING_GOALS } from "@/src/components/page/student/onboarding/constants";
import type { IGoal } from "@/src/components/page/student/onboarding/types";

interface UseGoalStepReturn {
  goals: IGoal[];
  selectedId: number | null;
  error: string | null;
  handleSelect: (id: number, goalTitle: string) => void;
  handleContinue: () => void;
  retry: () => void;
}

/**
 * Encapsulates learning goals retrieval, defensive error state, user selection,
 * and store updates without artificial loading delay.
 */
export function useGoalStep(): UseGoalStepReturn {
  const router = useRouter();
  const { selectGoal, formData } = useOnboarding();

  const [goals, setGoals] = useState<IGoal[]>(ONBOARDING_GOALS);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const initGoals = useCallback(() => {
    setError(null);
    try {
      setGoals(ONBOARDING_GOALS);
      if (formData.goal) {
        const existing = ONBOARDING_GOALS.find((g) => g.title === formData.goal);
        if (existing) setSelectedId(existing.id);
      }
    } catch {
      setError("Failed to initialize learning goals. Please try again.");
    }
  }, [formData.goal]);

  useEffect(() => {
    initGoals();
  }, [initGoals]);

  const handleSelect = useCallback((id: number, goalTitle: string) => {
    setSelectedId(id);
    selectGoal(goalTitle);
  }, [selectGoal]);

  const handleContinue = useCallback(() => {
    if (selectedId !== null) {
      router.push("/onboarding/skills");
    }
  }, [selectedId, router]);

  return {
    goals,
    selectedId,
    error,
    handleSelect,
    handleContinue,
    retry: initGoals,
  };
}
