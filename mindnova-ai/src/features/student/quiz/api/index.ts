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

export function useGetCourseQuiz(courseId: string | number, quizType: string) {
 return useQuery({
 queryKey: ["student", "course", courseId, "quiz", quizType],
 queryFn: async (): Promise<StudentQuizData> => {
 const { data } = await axiosClient.get(`/api/student/courses/${courseId}/quiz/${quizType}`);
 return data.data;
 },
 enabled: !!courseId && !!quizType,
 retry: false,
 });
}

export function useGetQuizAttemptResult(attemptId: string | number) {
 return useQuery({
 queryKey: ["student", "quiz-attempt", attemptId],
 queryFn: async (): Promise<QuizGradingResult> => {
 const { data } = await axiosClient.get(`/api/student/quiz-attempts/${attemptId}`);
 return data.data;
 },
 enabled: !!attemptId,
 });
}

export function useSubmitQuiz() {
 const queryClient = useQueryClient();
 return useMutation({
 mutationFn: async ({
 lessonId,
 courseId,
 quizType,
 answers,
 time_taken_seconds,
 }: {
 lessonId?: string | number;
 courseId?: string | number;
 quizType?: string;
 answers: Record<string, number | string>;
 time_taken_seconds: number;
 }): Promise<QuizGradingResult> => {
 const endpoint = (courseId && quizType)
   ? `/api/student/courses/${courseId}/quiz/${quizType}/submit`
   : `/api/student/lessons/${lessonId}/quiz/submit`;
 const { data } = await axiosClient.post(endpoint, {
 answers,
 time_taken_seconds,
 });
 return data.data;
 },
 onSuccess: (_, variables) => {
 queryClient.invalidateQueries({ queryKey: ["student", "practice", "overview"] });
 queryClient.invalidateQueries({ queryKey: ["student", "courses"] });
 },
 });
}

export * from "../types";

