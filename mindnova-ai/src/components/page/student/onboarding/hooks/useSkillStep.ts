"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "./useOnboarding";
import { ONBOARDING_SKILLS } from "@/src/components/page/student/onboarding/constants";
import type { ISkill } from "@/src/components/page/student/onboarding/types";

interface UseSkillStepReturn {
  skills: ISkill[];
  selectedId: number | null;
  error: string | null;
  handleSelect: (id: number, level: string) => void;
  handleContinue: () => void;
  handleBack: () => void;
  retry: () => void;
}

/**
 * Encapsulates skill assessment setup logic without artificial loading delays.
 */
export function useSkillStep(): UseSkillStepReturn {
  const router = useRouter();
  const { selectLevel, formData } = useOnboarding();

  const [skills, setSkills] = useState<ISkill[]>(ONBOARDING_SKILLS);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const initSkills = useCallback(() => {
    setError(null);
    try {
      setSkills(ONBOARDING_SKILLS);
      if (formData.level) {
        const existing = ONBOARDING_SKILLS.find((s) => s.level === formData.level);
        if (existing) setSelectedId(existing.id);
      }
    } catch {
      setError("Could not retrieve skill assessment criteria.");
    }
  }, [formData.level]);

  useEffect(() => {
    initSkills();
  }, [initSkills]);

  const handleSelect = useCallback((id: number, level: string) => {
    setSelectedId(id);
    selectLevel(level);
  }, [selectLevel]);

  const handleContinue = useCallback(() => {
    if (selectedId !== null) {
      router.push("/onboarding/topics");
    }
  }, [selectedId, router]);

  const handleBack = useCallback(() => {
    router.push("/onboarding/goal");
  }, [router]);

  return {
    skills,
    selectedId,
    error,
    handleSelect,
    handleContinue,
    handleBack,
    retry: initSkills,
  };
}
