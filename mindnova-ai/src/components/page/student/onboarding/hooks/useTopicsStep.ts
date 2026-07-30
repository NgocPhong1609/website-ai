"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/src/components/page/student/onboarding/stores/onboardingStore";
import { ONBOARDING_TOPICS } from "@/src/components/page/student/onboarding/constants";
import type { ITopic } from "@/src/components/page/student/onboarding/types";

interface UseTopicsStepReturn {
  topics: ITopic[];
  selectedIds: Set<number>;
  selectedCount: number;
  freeTime: string;
  canGenerate: boolean;
  error: string | null;
  toggleTopic: (topic: ITopic) => void;
  setFreeTime: (time: string) => void;
  handleGenerate: () => void;
  handleBack: () => void;
  retry: () => void;
}

export function useTopicsStep(): UseTopicsStepReturn {
  const router = useRouter();
  const selectTopics = useOnboardingStore((s) => s.selectTopics);
  const selectFreeTime = useOnboardingStore((s) => s.selectFreeTime);
  const formData = useOnboardingStore((s) => s.formData);

  const [topics, setTopics] = useState<ITopic[]>(ONBOARDING_TOPICS);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [freeTime, setFreeTimeState] = useState<string>(formData.freeTime || "2h/day - Dedicated");
  const [error, setError] = useState<string | null>(null);

  const initTopics = useCallback(() => {
    setError(null);
    try {
      setTopics(ONBOARDING_TOPICS);
      if (formData.topics && formData.topics.length > 0) {
        const matchedIds = new Set<number>();
        formData.topics.forEach((label) => {
          const found = ONBOARDING_TOPICS.find((t) => t.label === label);
          if (found) matchedIds.add(found.id);
        });
        setSelectedIds(matchedIds);
      }
    } catch {
      setError("Unable to load topics catalog.");
    }
  }, [formData.topics]);

  useEffect(() => {
    initTopics();
  }, [initTopics]);

  const toggleTopic = useCallback((topic: ITopic) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(topic.id)) {
        next.delete(topic.id);
      } else {
        next.add(topic.id);
      }
      return next;
    });
  }, []);

  const setFreeTime = useCallback((time: string) => {
    setFreeTimeState(time);
    selectFreeTime(time);
  }, [selectFreeTime]);

  const handleGenerate = useCallback(() => {
    const topicLabelMap = new Map(
      ONBOARDING_TOPICS.map((t) => [t.id, t.label]),
    );
    const labels = [...selectedIds]
      .map((id) => topicLabelMap.get(id))
      .filter((label): label is string => label !== undefined);

    selectFreeTime(freeTime);
    selectTopics(labels);
    router.push("/onboarding/generating");
  }, [selectedIds, freeTime, selectFreeTime, selectTopics, router]);

  const handleBack = useCallback(() => {
    router.push("/onboarding/skills");
  }, [router]);

  return {
    topics,
    selectedIds,
    selectedCount: selectedIds.size,
    freeTime,
    canGenerate: selectedIds.size > 0,
    error,
    toggleTopic,
    setFreeTime,
    handleGenerate,
    handleBack,
    retry: initTopics,
  };
}
