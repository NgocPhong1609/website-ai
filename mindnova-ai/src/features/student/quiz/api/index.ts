import { useQuery, useMutation } from "@tanstack/react-query";
import { axiosClient } from "../../../../shared/lib/axios";

export interface StudentAnswer {
  id: string | number;
  content: string;
}

export interface StudentQuestion {
  id: string | number;
  content: string;
  order: number;
  answers: StudentAnswer[];
}

export interface StudentQuizData {
  id: string | number;
  title: string;
  time_limit_minutes: number;
  passing_score: number;
  questions_count: number;
  questions: StudentQuestion[];
}

export function useGetStudentQuiz(lessonId: string | number) {
  return useQuery({
    queryKey: ["student", "lesson", lessonId, "quiz"],
    queryFn: async (): Promise<StudentQuizData> => {
      const { data } = await axiosClient.get(`/api/student/lessons/${lessonId}/quiz`);
      return data.data;
    },
    enabled: !!lessonId,
  });
}

export function useSubmitQuiz() {
  return useMutation({
    mutationFn: async ({
      lessonId,
      answers,
      time_taken_seconds,
    }: {
      lessonId: string | number;
      answers: Record<string, number>;
      time_taken_seconds: number;
    }) => {
      const { data } = await axiosClient.post(`/api/student/lessons/${lessonId}/quiz/submit`, {
        answers,
        time_taken_seconds,
      });
      return data.data;
    },
  });
}
