import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/src/shared/lib/axios";
import type { GeneratedPlan, GeneratePlanPayload, LessonAnalysis } from "../types";

/** AI generation can take a while; the shared client has no timeout by default. */
const AI_TIMEOUT_MS = 60_000;

export async function generatePlan(payload: GeneratePlanPayload): Promise<GeneratedPlan> {
  const { data } = await axiosClient.post<{ status: string; data: GeneratedPlan }>(
    "/api/student/onboarding",
    payload,
    { timeout: AI_TIMEOUT_MS },
  );
  if (!data?.data?.learning_path?.length) {
    throw Object.assign(new Error("Invalid plan"), { code: "INVALID_RESPONSE" });
  }
  return data.data;
}

export function useLessonAnalysis(lessonTitle: string | null, goal: string) {
  return useQuery<LessonAnalysis>({
    queryKey: ["student", "onboarding", "lesson-analysis", lessonTitle, goal],
    queryFn: async () => {
      const { data } = await axiosClient.post<{ status: string; data: LessonAnalysis }>(
        "/api/student/analyze-lesson",
        { lesson_title: lessonTitle, goal },
        { timeout: AI_TIMEOUT_MS },
      );
      return data.data;
    },
    enabled: Boolean(lessonTitle && goal),
    staleTime: Infinity,
    retry: false,
  });
}
