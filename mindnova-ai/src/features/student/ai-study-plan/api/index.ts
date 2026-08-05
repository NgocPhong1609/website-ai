import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "../../../../shared/lib/axios";
import type { AiChatMessage, CoreConcept, LessonResource } from "../types";

export interface StudyPlanOverview {
  active_syllabus: any | null;
  core_concepts: CoreConcept[];
  lesson_resources: LessonResource[];
  ai_insight: string;
  initial_messages: AiChatMessage[];
}

export const useGetStudyPlan = () => {
  return useQuery<StudyPlanOverview>({
    queryKey: ["student", "study-plan", "overview"],
    queryFn: async () => {
      const { data } = await axiosClient.get("/api/student/study-plan");
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
