"use client";

import { useQuery } from "@tanstack/react-query";
import type { ILearningHistoryItem } from "@/types/student";

const MOCK_HISTORY_LOGS: ILearningHistoryItem[] = [
  {
    id: "log_1",
    eventType: "earned_certificate",
    title: "Earned Certificate of Completion (Idempotent Verified)",
    courseName: "AI Mastery for Enterprise Business",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
    metadata: { certificateId: "MN-CERT-2026-89A7" },
  },
  {
    id: "log_2",
    eventType: "submitted_assignment",
    title: "Submitted Capstone Project: RAG Architecture Implementation",
    courseName: "Next.js 16 & Agentic Coding Bootcamp",
    timestamp: new Date(Date.now() - 1000 * 3600 * 3).toISOString(), // 3 hours ago
    metadata: { score: 96 },
  },
  {
    id: "log_3",
    eventType: "watched_lecture",
    title: "Watched Module 4.2: Material Tonal Layering (Watch Time: 100%)",
    courseName: "UI/UX Design & Glassmorphism Masterclass",
    timestamp: new Date(Date.now() - 1000 * 3600 * 18).toISOString(), // 18 hours ago
    metadata: { lessonId: 42, watchDurationSeconds: 840 },
  },
  {
    id: "log_4",
    eventType: "watched_lecture",
    title: "Watched Module 3.1: Server Actions & Cache Tag Invalidations",
    courseName: "Next.js 16 & Agentic Coding Bootcamp",
    timestamp: new Date(Date.now() - 1000 * 3600 * 32).toISOString(), // 1 day ago
    metadata: { lessonId: 31, watchDurationSeconds: 1200 },
  },
  {
    id: "log_5",
    eventType: "submitted_assignment",
    title: "Completed Midterm Practice Quiz: Prompt Injection Defense",
    courseName: "AI Mastery for Enterprise Business",
    timestamp: new Date(Date.now() - 1000 * 3600 * 72).toISOString(), // 3 days ago
    metadata: { score: 92 },
  },
];

async function fetchLearningHistory(): Promise<ILearningHistoryItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 350));
  // Core Rule: Retrieve user logs in real-time sorted in descending order by time (newest first)
  return [...MOCK_HISTORY_LOGS].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

export interface UseLearningHistoryReturn {
  historyItems: ILearningHistoryItem[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useLearningHistory(filterType?: "all" | "watched_lecture" | "submitted_assignment" | "earned_certificate"): UseLearningHistoryReturn {
  const { data, isLoading, error, refetch } = useQuery<ILearningHistoryItem[], Error>({
    queryKey: ["student-learning-history"],
    queryFn: fetchLearningHistory,
    refetchInterval: 30000, // Keep logs fresh in real-time every 30 seconds
  });

  const allItems = data || [];
  const historyItems =
    !filterType || filterType === "all"
      ? allItems
      : allItems.filter((item) => item.eventType === filterType);

  return {
    historyItems,
    isLoading,
    error: error ?? null,
    refetch,
  };
}
