import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../../../../shared/lib/axios";
import type { CourseBasicInfo } from "../types";

export interface CreateCoursePayload {
  title: string;
  description?: string;
  level?: string;
  category_id: number;
  thumbnail?: File;
}

export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateCoursePayload) => {
      const formData = new FormData();
      formData.append("title", payload.title);
      if (payload.description) formData.append("description", payload.description);
      if (payload.level) formData.append("level", payload.level);
      formData.append("category_id", String(payload.category_id));
      if (payload.thumbnail) {
        formData.append("thumbnail", payload.thumbnail);
      }

      const { data } = await axiosClient.post("/api/instructor/courses", formData);
      return data.data; // Assumes ApiResponse returns { data: { id, title... } }
    },
    onSuccess: () => {
      // Invalidate the courses list so it refreshes on the management page
      queryClient.invalidateQueries({ queryKey: ["instructor", "courses"] });
    },
  });
}

export function useUploadCourseThumbnail() {
  return useMutation({
    mutationFn: async ({ courseId, file }: { courseId: string; file: File }) => {
      const formData = new FormData();
      formData.append("thumbnail", file);

      const { data } = await axiosClient.post(
        `/api/instructor/courses/${courseId}/thumbnail`,
        formData
      );
      return data.data;
    },
  });
}

export function useUpdateCoursePrice() {
  return useMutation({
    mutationFn: async ({ courseId, price }: { courseId: string; price: number }) => {
      const { data } = await axiosClient.patch(`/api/instructor/courses/${courseId}/price`, {
        price,
      });
      return data.data;
    },
  });
}

export function useUpdateCourseStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ courseId, status }: { courseId: string; status: "published" | "draft" }) => {
      const { data } = await axiosClient.patch(`/api/instructor/courses/${courseId}/status`, {
        status,
      });
      return data.data;
    },
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: ["instructor", "courses"] });
      queryClient.invalidateQueries({ queryKey: ["instructor", "course", courseId] });
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
          signal,
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

export function useUpdateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ courseId, payload }: { courseId: string; payload: Partial<CreateCoursePayload> }) => {
      const formData = new FormData();
      if (payload.title) formData.append("title", payload.title);
      if (payload.description) formData.append("description", payload.description);
      if (payload.level) formData.append("level", payload.level);
      if (payload.category_id) formData.append("category_id", String(payload.category_id));
      if (payload.thumbnail) formData.append("thumbnail", payload.thumbnail);
      formData.append("_method", "PATCH");

      const { data } = await axiosClient.post(`/api/instructor/courses/${courseId}`, formData);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instructor", "courses"] });
    },
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (courseId: string) => {
      const { data } = await axiosClient.delete(`/api/instructor/courses/${courseId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instructor", "courses"] });
    },
  });
}
