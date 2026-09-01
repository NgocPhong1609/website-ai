import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../../../../shared/lib/axios";

// ─── Interfaces ─────────────────────────────────────────────────────────────

export interface Lesson {
 id: string | number;
 title: string;
 type: "video" | "document" | "quiz" | "article" | "quiz_module";
 duration_seconds: number;
 status: "published" | "draft";
 content?: string;
 signed_url?: string;
 order: number;
 quizData?: any;
}

export interface Chapter {
 id: string | number;
 title: string;
 order: number;
 lessons: Lesson[];
}

interface ModulesResponse {
 data: Chapter[];
}

// ─── Hooks ──────────────────────────────────────────────────────────────────

export function useCourseModules(courseId: string) {
 return useQuery({
 queryKey: ["instructor", "course", courseId, "modules"],
 queryFn: async (): Promise<Chapter[]> => {
 if (!courseId) return [];
 const { data } = await axiosClient.get<ModulesResponse>(`/api/instructor/courses/${courseId}/modules`);
 return data.data;
 },
 enabled: !!courseId,
 });
}

export function useCreateModule() {
 const queryClient = useQueryClient();
 return useMutation({
 mutationFn: async ({ courseId, title, description, order }: { courseId: string; title: string; description?: string; order: number }) => {
 const { data } = await axiosClient.post(`/api/instructor/courses/${courseId}/modules`, {
 title,
 description,
 order,
 });
 return data.data;
 },
 onSuccess: (_, { courseId }) => {
 queryClient.invalidateQueries({ queryKey: ["instructor", "course", courseId, "modules"] });
 },
 });
}

export function useUpdateModule() {
 const queryClient = useQueryClient();
 return useMutation({
 mutationFn: async ({ courseId, moduleId, title, description }: { courseId: string; moduleId: string | number; title: string; description?: string }) => {
 const { data } = await axiosClient.put(`/api/instructor/modules/${moduleId}`, {
 title,
 description,
 });
 return data.data;
 },
 onSuccess: (_, { courseId }) => {
 queryClient.invalidateQueries({ queryKey: ["instructor", "course", courseId, "modules"] });
 },
 });
}

export function useDeleteModule() {
 const queryClient = useQueryClient();
 return useMutation({
 mutationFn: async ({ courseId, moduleId }: { courseId: string; moduleId: string | number }) => {
 await axiosClient.delete(`/api/instructor/modules/${moduleId}`);
 },
 onSuccess: (_, { courseId }) => {
 queryClient.invalidateQueries({ queryKey: ["instructor", "course", courseId, "modules"] });
 },
 });
}

export function useCreateLesson() {
 const queryClient = useQueryClient();
 return useMutation({
 mutationFn: async ({ courseId, moduleId, payload }: { courseId: string; moduleId: string | number; payload: any }) => {
 const { data } = await axiosClient.post(`/api/instructor/modules/${moduleId}/lessons`, payload);
 return data.data;
 },
 onSuccess: (_, { courseId }) => {
 queryClient.invalidateQueries({ queryKey: ["instructor", "course", courseId, "modules"] });
 },
 });
}

export function useUpdateLesson() {
 const queryClient = useQueryClient();
 return useMutation({
 mutationFn: async ({ courseId, lessonId, payload }: { courseId: string; lessonId: string | number; payload: any }) => {
 const { data } = await axiosClient.put(`/api/instructor/lessons/${lessonId}`, payload);
 return data.data;
 },
 onSuccess: (_, { courseId }) => {
 queryClient.invalidateQueries({ queryKey: ["instructor", "course", courseId, "modules"] });
 },
 });
}

export function useDeleteLesson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ courseId, lessonId }: { courseId: string; lessonId: string | number }) => {
      await axiosClient.delete(`/api/instructor/lessons/${lessonId}`);
    },
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: ["instructor", "course", courseId, "modules"] });
    },
  });
}

export function useReorderModuleItems() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ courseId, moduleId, items }: { courseId: string; moduleId: string | number; items: Array<{ id: string | number; order: number }> }) => {
      const { data } = await axiosClient.put(`/api/instructor/modules/${moduleId}/reorder-items`, { items });
      return data;
    },
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: ["instructor", "courses", courseId, "modules"] });
      queryClient.invalidateQueries({ queryKey: ["instructor", "course", courseId, "modules"] });
    },
  });
}

// ─── Quiz Helper ─────────────────────────────────────────────────────────────

export function formatQuizPayloadForBackend(payload: any) {
  if (!payload) return payload;

  const title = payload.title || "Bài kiểm tra";
  const timeLimit = payload.time_limit_minutes !== undefined ? Number(payload.time_limit_minutes) : 15;
  const passingScore = payload.passing_score !== undefined ? Number(payload.passing_score) : 70;
  const rawQuestions = Array.isArray(payload.questions) ? payload.questions : [];

  const formattedQuestions = rawQuestions.map((q: any) => {
    const isMcq = q.type === "multiple_choice" || q.type === "trac_nghiem" || (!q.type && (Array.isArray(q.options) || Array.isArray(q.answers)));
    const type = isMcq ? "multiple_choice" : "essay";
    const content = q.content || q.question || "Nội dung câu hỏi";
    const points = typeof q.points === "number" ? q.points : (parseFloat(q.points) || (type === "essay" ? 5.0 : 1.0));
    const explanation = q.explanation || "";

    if (type === "essay") {
      return {
        type: "essay",
        content,
        explanation,
        sample_answer: q.sample_answer || "",
        rubric: q.rubric || "",
        points,
        answers: [],
      };
    }

    let answers: Array<{ content: string; is_correct: boolean }> = [];
    if (Array.isArray(q.answers) && q.answers.length > 0) {
      answers = q.answers.map((a: any) => ({
        content: String(a.content || a.answer || ""),
        is_correct: Boolean(a.is_correct),
      }));
    } else if (Array.isArray(q.options) && q.options.length > 0) {
      const correctIdx = typeof q.correct_answer_index === "number" ? q.correct_answer_index : 0;
      answers = q.options.map((opt: any, i: number) => ({
        content: String(opt),
        is_correct: i === correctIdx,
      }));
    }

    if (answers.length < 2) {
      answers = [
        { content: answers[0]?.content || "Đáp án 1", is_correct: true },
        { content: "Đáp án 2", is_correct: false },
      ];
    }
    const correctCount = answers.filter((a) => a.is_correct).length;
    if (correctCount === 0) {
      answers[0].is_correct = true;
    } else if (correctCount > 1) {
      let firstFound = false;
      answers = answers.map((a) => {
        if (a.is_correct && !firstFound) {
          firstFound = true;
          return a;
        }
        return { ...a, is_correct: false };
      });
    }

    return {
      type: "multiple_choice",
      content,
      explanation,
      points,
      answers,
    };
  });

  return {
    title,
    time_limit_minutes: timeLimit,
    passing_score: passingScore,
    questions: formattedQuestions,
  };
}

// ─── Quiz Hooks ─────────────────────────────────────────────────────────────

export function useCreateQuiz() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ lessonId, payload }: { lessonId: string | number; payload: any }) => {
      const formattedPayload = formatQuizPayloadForBackend(payload);
      const { data } = await axiosClient.post(`/api/instructor/lessons/${lessonId}/quiz`, formattedPayload);
      return data.data;
    },
    onSuccess: (_, { lessonId }) => {
      queryClient.invalidateQueries({ queryKey: ["instructor", "lesson", lessonId, "quiz"] });
    },
  });
}

export function useUploadContentMedia() {
 return useMutation({
 mutationFn: async ({ lessonId, file, onUploadProgress }: { lessonId: string | number; file: File; onUploadProgress?: (progressEvent: any) => void }) => {
 const formData = new FormData();
 formData.append("file", file);

 const { data } = await axiosClient.post(
 `/api/instructor/lessons/${lessonId}/content-media`,
 formData,
 {
 onUploadProgress,
 }
 );
 return data.data;
 },
 });
}

export function useUploadTempMedia() {
 return useMutation({
 mutationFn: async ({ file, onUploadProgress, signal }: { file: File; onUploadProgress?: (progressEvent: any) => void; signal?: AbortSignal }) => {
 const formData = new FormData();
 formData.append("file", file);

 const { data } = await axiosClient.post(
 `/api/instructor/media/temp`,
 formData,
 {
 onUploadProgress,
 signal
 }
 );
 return data;
 },
 });
}

export function useDeleteTempMedia() {
 return useMutation({
 mutationFn: async (mediaId: number | string) => {
 const { data } = await axiosClient.delete(`/api/instructor/media/temp/${mediaId}`);
 return data;
 },
 });
}
