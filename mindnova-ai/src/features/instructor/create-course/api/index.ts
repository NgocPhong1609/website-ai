import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../../../../shared/lib/axios";
import type { CourseBasicInfo } from "../types";

export interface CreateCoursePayload {
  title: string;
  description?: string;
  level?: string;
  category_id: number;
}

export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateCoursePayload) => {
      const { data } = await axiosClient.post("/api/instructor/courses", payload);
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
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
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
  return useMutation({
    mutationFn: async ({ courseId, status }: { courseId: string; status: "published" | "draft" }) => {
      const { data } = await axiosClient.patch(`/api/instructor/courses/${courseId}/status`, {
        status,
      });
      return data.data;
    },
  });
}
