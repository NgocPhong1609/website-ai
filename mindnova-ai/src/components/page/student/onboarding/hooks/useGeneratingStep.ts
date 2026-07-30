"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { IGeneratingStep } from "@/src/components/page/student/onboarding/types";

const INITIAL_STEPS: IGeneratingStep[] = [
  { id: 1, label: "AI is analyzing career data and competency metrics...", status: "in-progress" },
  { id: 2, label: "Calibrating platform course difficulty for your level...", status: "pending" },
  { id: 3, label: "Matching target domain subjects and daily free time...", status: "pending" },
  { id: 4, label: "Drawing your personalized roadmap & learning timeline...", status: "pending" },
];

interface UseGeneratingStepReturn {
  steps: IGeneratingStep[];
  activeStepIndex: number;
  progressPercent: number;
  isCompleted: boolean;
}

export function useGeneratingStep(): UseGeneratingStepReturn {
  const router = useRouter();
  const [steps, setSteps] = useState<IGeneratingStep[]>(INITIAL_STEPS);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStepIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        if (nextIndex >= INITIAL_STEPS.length) {
          clearInterval(interval);
          return prevIndex;
        }

        setSteps((currentSteps) =>
          currentSteps.map((s, idx) => {
            if (idx < nextIndex) return { ...s, status: "completed" };
            if (idx === nextIndex) return { ...s, status: "in-progress" };
            return { ...s, status: "pending" };
          })
        );

        return nextIndex;
      });
    }, 950);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeStepIndex === INITIAL_STEPS.length - 1) {
      const completionTimer = setTimeout(() => {
        setSteps((currentSteps) =>
          currentSteps.map((s) => ({ ...s, status: "completed" }))
        );
      }, 900);

      const navigationTimer = setTimeout(() => {
        router.push("/onboarding/plan");
      }, 1600);

      return () => {
        clearTimeout(completionTimer);
        clearTimeout(navigationTimer);
      };
    }
  }, [activeStepIndex, router]);

  const allDone = steps.every((s) => s.status === "completed");
  const completedCount = steps.filter((s) => s.status === "completed").length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  return {
    steps,
    activeStepIndex,
    progressPercent,
    isCompleted: allDone,
  };
}
