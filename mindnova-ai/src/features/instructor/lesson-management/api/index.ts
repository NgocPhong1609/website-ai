import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../../../../shared/lib/axios";

// ─── Interfaces ─────────────────────────────────────────────────────────────

export interface Lesson {
  id: string | number;
  title: string;
  type: "video" | "document" | "quiz" | "article" | "quiz_module";
  duration_minutes: number;
  status: "published" | "draft";
  content?: string;
  signed_url?: string;
  order: number;
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
    mutationFn: async ({ courseId, title, order }: { courseId: string; title: string; order: number }) => {
      const { data } = await axiosClient.post(`/api/instructor/courses/${courseId}/modules`, {
        title,
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
    mutationFn: async ({ courseId, moduleId, title }: { courseId: string; moduleId: string | number; title: string }) => {
      const { data } = await axiosClient.put(`/api/instructor/modules/${moduleId}`, {
        title,
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
