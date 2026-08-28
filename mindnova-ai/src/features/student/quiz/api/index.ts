import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../../../../shared/lib/axios";
import type { PracticeOverviewData, QuizGradingResult } from "../types";

export interface StudentAnswer {
 id: string | number;
 content: string;
}

export interface StudentQuestion {
 id: string | number;
 type?: 'multiple_choice' | 'essay';
 content: string;
 points?: number;
 rubric?: string;
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

export function useGetPracticeOverview() {
 return useQuery({
 queryKey: ["student", "practice", "overview"],
 queryFn: async (): Promise<PracticeOverviewData> => {
 const { data } = await axiosClient.get("/api/student/practice/overview");
 return data.data;
 },
 staleTime: 5 * 60 * 1000,
 });
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
 const queryClient = useQueryClient();
 return useMutation({
 mutationFn: async ({
 lessonId,
 answers,
 time_taken_seconds,
 }: {
 lessonId: string | number;
 answers: Record<string, number | string>;
 time_taken_seconds: number;
 }): Promise<QuizGradingResult> => {
 const { data } = await axiosClient.post(`/api/student/lessons/${lessonId}/quiz/submit`, {
 answers,
 time_taken_seconds,
 });
 return data.data;
 },
 onSuccess: () => {
 // Đảm bảo dữ liệu UI toàn hệ thống (sidebar, progress) được cập nhật đồng bộ sau khi nộp
 queryClient.invalidateQueries({ queryKey: ["student", "practice", "overview"] });
 queryClient.invalidateQueries({ queryKey: ["student", "courses", "detail"] });
 queryClient.invalidateQueries({ queryKey: ["student", "courses", "enrolled"] });
 },
 });
}

export * from "../types";
