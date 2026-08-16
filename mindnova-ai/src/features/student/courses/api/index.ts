import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../../../../shared/lib/axios";
import type { CourseDetailData, MyCourse } from "../types";

export function useGetCourseDetail(courseId: string | number = 1) {
  const normalizedId = String(courseId);
  return useQuery({
    queryKey: ["student", "courses", "detail", normalizedId],
    queryFn: async (): Promise<CourseDetailData> => {
      const { data } = await axiosClient.get(`/api/student/courses/detail/${normalizedId}`);
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useGetMyCourses() {
  return useQuery({
    queryKey: ["student", "courses", "enrolled"],
    queryFn: async (): Promise<MyCourse[]> => {
      const { data } = await axiosClient.get("/api/student/courses/enrolled");
      return data.data; // Note: ApiResponse traits typically return data in a 'data' field.
    },
    staleTime: 5 * 60 * 1000,
  });
}

// ─── Lesson APIs ──────────────────────────────────────────────────────────────

/** Get signed video URL for a lesson */
export async function fetchVideoUrl(lessonId: number | string): Promise<{
  signed_url: string;
  source: 'uploaded' | 'external';
  duration_seconds: number;
}> {
  const { data } = await axiosClient.get(`/api/student/lessons/${lessonId}/video-url`);
  return data.data;
}

/** Mark a lesson as completed */
export async function completeLesson(
  lessonId: number | string,
  payload: {
    playback_position?: number;
    time_spent_seconds?: number;
  } = {}
): Promise<{
  progress_percentage: number;
  completed_lessons_count: number;
  total_lessons_count: number;
  completed_lesson_ids: number[];
}> {
  const { data } = await axiosClient.post(`/api/student/lessons/${lessonId}/complete`, payload);
  return data.data;
}

/** Fetch quiz data for a lesson */
export async function fetchQuiz(lessonId: number | string): Promise<{
  id: string;
  quiz_id: number;
  title: string;
  course_title: string;
  time_limit_minutes: number;
  passing_score: number;
  questions_count: number;
  questions: {
    id: string;
    content: string;
    order: number;
    answers: { id: string; content: string }[];
  }[];
}> {
  const { data } = await axiosClient.get(`/api/student/lessons/${lessonId}/quiz`);
  return data.data;
}

/** Check a single quiz answer */
export async function checkQuizAnswer(
  lessonId: number | string,
  questionId: string,
  answerId: string
): Promise<{ correct: boolean }> {
  const { data } = await axiosClient.post(
    `/api/student/lessons/${lessonId}/quiz/check-answer`,
    { question_id: questionId, answer_id: answerId }
  );
  return data.data;
}

/** Submit full quiz for grading */
export async function submitQuiz(
  lessonId: number | string,
  answers: Record<string, string>,
  timeTakenSeconds: number
): Promise<{
  score: number;
  passed: boolean;
  correct_count: number;
  total_questions: number;
}> {
  const { data } = await axiosClient.post(`/api/student/lessons/${lessonId}/quiz/submit`, {
    answers,
    time_taken_seconds: timeTakenSeconds,
  });
  return data.data;
}

/** Hook to invalidate course detail cache after completion */
export function useInvalidateCourseDetail() {
  const queryClient = useQueryClient();
  return (courseId: string | number) => {
    queryClient.invalidateQueries({ queryKey: ["student", "courses", "detail", String(courseId)] });
    queryClient.invalidateQueries({ queryKey: ["student", "courses", "enrolled"] });
  };
}

// ─── Discussion APIs ─────────────────────────────────────────────────────────

export interface DiscussionReplyData {
  id: number | string;
  content: string;
  created_at: string;
  user: {
    id: number;
    name: string;
    avatar?: string;
  };
}

export interface DiscussionData {
  id: number | string;
  content: string;
  status: string;
  created_at: string;
  student: {
    id: number;
    name: string;
    avatar?: string;
  };
  replies: DiscussionReplyData[];
}

export function useGetDiscussions(lessonId: string | number) {
  return useQuery({
    queryKey: ["student", "lessons", lessonId, "discussions"],
    queryFn: async (): Promise<DiscussionData[]> => {
      const { data } = await axiosClient.get(`/api/student/lessons/${lessonId}/discussions`);
      return data.data;
    },
    enabled: !!lessonId,
  });
}

export function useCreateDiscussion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ lessonId, content }: { lessonId: string | number, content: string }) => {
      const { data } = await axiosClient.post(`/api/student/lessons/${lessonId}/discussions`, { content });
      return data.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["student", "lessons", variables.lessonId, "discussions"] });
    },
  });
}
