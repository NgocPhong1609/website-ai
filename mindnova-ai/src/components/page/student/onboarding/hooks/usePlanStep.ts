"use client";

import { useMemo, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/src/components/page/student/onboarding/stores/onboardingStore";
import {
  DEFAULT_PLAN_PHASES,
  LEVEL_PHASE_CONFIG,
  COMPLEXITY_CONFIG,
} from "@/src/components/page/student/onboarding/constants";
import type { IPlanPhase } from "@/src/components/page/student/onboarding/types";

interface UsePlanStepReturn {
  goal: string;
  level: string;
  topics: string[];
  freeTime: string;
  unlockedPhases: number;
  estimatedTime: string;
  phases: IPlanPhase[];
  isUninitialized: boolean;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authReason: string;
  openAuthModal: (reason: string) => void;
  closeAuthModal: () => void;
  handleSaveRoadmap: () => void;
  handleStart: () => void;
  handleBack: () => void;
  handleRestartOnboarding: () => void;
  handleAuthSuccess: () => void;
}

export function usePlanStep(): UsePlanStepReturn {
  const router = useRouter();
  const { goal, level, topics, freeTime } = useOnboardingStore((s) => s.formData);
  const isAuthenticated = useOnboardingStore((s) => s.isAuthenticated);
  const resetOnboarding = useOnboardingStore((s) => s.resetOnboarding);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authReason, setAuthReason] = useState("Log in now to save your amazing learning progress!");
  const [pendingAction, setPendingAction] = useState<"save" | "start" | null>(null);

  const isUninitialized = !goal && (!topics || topics.length === 0);

  const unlockedPhases = useMemo(() => {
    if (!level) return 1;
    const cfg = LEVEL_PHASE_CONFIG[level as keyof typeof LEVEL_PHASE_CONFIG];
    return cfg?.unlockedPhases ?? 1;
  }, [level]);

  const estimatedTime = useMemo(() => {
    const count = topics ? topics.length : 0;
    const complexity =
      COMPLEXITY_CONFIG.find((c) => count <= c.maxTopics) ??
      COMPLEXITY_CONFIG[COMPLEXITY_CONFIG.length - 1];
    const TIME_MAP: Record<number, string> = {
      0: "—",
      1: "2–4 weeks",
      2: "1–2 months",
      3: "2–3 months",
      4: "3–5 months",
      5: "5–8 months",
    };
    return TIME_MAP[complexity?.level ?? 1] ?? "3 months";
  }, [topics]);

  const phases = useMemo(
    (): IPlanPhase[] =>
      DEFAULT_PLAN_PHASES.map((phase, idx) => {
        if (idx >= unlockedPhases) return phase;
        const itemStatus = idx === 0 ? ("ready" as const) : ("upcoming" as const);
        return {
          ...phase,
          items: phase.items.map((item) => ({ ...item, status: itemStatus })),
        };
      }),
    [unlockedPhases],
  );

  const openAuthModal = useCallback((reason: string) => {
    setAuthReason(reason);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  // Rule: Guests cannot "Save" this roadmap without logging in.
  const handleSaveRoadmap = useCallback(() => {
    if (!isAuthenticated) {
      setPendingAction("save");
      openAuthModal("Create your free account to bookmark this custom roadmap & track milestones!");
      return;
    }
    alert("✨ Roadmap saved successfully to your MindNova profile!");
  }, [isAuthenticated, openAuthModal]);

  const handleStart = useCallback(() => {
    if (!isAuthenticated) {
      setPendingAction("start");
      openAuthModal("Log in now to save your amazing learning progress and access course content!");
      return;
    }
    router.push("/");
  }, [isAuthenticated, openAuthModal, router]);

  const handleAuthSuccess = useCallback(() => {
    if (pendingAction === "save") {
      alert("✨ Roadmap bookmarked successfully to your account!");
    } else if (pendingAction === "start") {
      router.push("/");
    }
    setPendingAction(null);
  }, [pendingAction, router]);

  const handleBack = useCallback(() => {
    router.push("/onboarding/topics");
  }, [router]);

  const handleRestartOnboarding = useCallback(() => {
    resetOnboarding();
    router.push("/onboarding/goal");
  }, [resetOnboarding, router]);

  return {
    goal: goal || "General Mastery",
    level: level || "Beginner",
    topics: topics || [],
    freeTime: freeTime || "2h/day",
    unlockedPhases,
    estimatedTime,
    phases,
    isUninitialized,
    isAuthenticated,
    isAuthModalOpen,
    authReason,
    openAuthModal,
    closeAuthModal,
    handleSaveRoadmap,
    handleStart,
    handleBack,
    handleRestartOnboarding,
    handleAuthSuccess,
  };
}
