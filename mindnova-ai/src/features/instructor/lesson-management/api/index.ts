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

// ─── Quiz Hooks ─────────────────────────────────────────────────────────────

export function useCreateQuiz() {
 const queryClient = useQueryClient();
 return useMutation({
 mutationFn: async ({ lessonId, payload }: { lessonId: string | number; payload: any }) => {
 const { data } = await axiosClient.post(`/api/instructor/lessons/${lessonId}/quiz`, payload);
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
