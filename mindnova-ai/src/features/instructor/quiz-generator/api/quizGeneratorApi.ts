import { axiosClient } from "../../../../shared/lib/axios";
import { QuizConfig, GeneratedQuestion, QuizSummary, QuizAttachmentPayload } from "../types/quizGenerator.types";
import { serializeQuizQuestion } from "./serializeQuizQuestion";

export const quizGeneratorApi = {
 uploadMedia: async (file: File, purpose: "thumbnail" | "question" | "answer") => {
 const formData = new FormData();
 formData.append("file", file);
 formData.append("purpose", purpose);
 const res = await axiosClient.post("/api/instructor/quiz-media", formData, {
 headers: { "Content-Type": "multipart/form-data" },
 });
 return res.data.data;
 },

 // Generate quiz questions via AI
 generateQuiz: async (config: QuizConfig) => {
 const payload = {
 source_type: config.source_type,
 course_id: config.course_id ? Number(config.course_id) : undefined,
 content: config.source_type === "content" ? config.source_content : undefined,
 topic: config.source_type === "topic" ? config.topic : undefined,
 difficulty: config.difficulty,
 total_questions: config.total_questions,
 multiple_choice_count: config.multiple_choice_count,
 essay_count: config.essay_count,
 time_limit_minutes: config.time_limit_minutes,
 passing_score: config.passing_score,
 };

 const res = await axiosClient.post("/api/instructor/ai-quiz/generate", payload, {
 timeout: 120000,
 });
 return res.data;
 },

 // Regenerate a single question
 regenerateSingleQuestion: async (type: "multiple_choice" | "essay", difficulty: string, context: string) => {
 const res = await axiosClient.post("/api/instructor/ai-quiz/regenerate-question", {
 type,
 difficulty,
 context,
 }, {
 timeout: 60000,
 });
 return res.data;
 },

 // Update existing quiz and points
 updateQuiz: async (
 quizId: number,
 quizData: {
 title: string;
 description?: string;
 thumbnail_url?: string | null;
 thumbnail_r2_key?: string | null;
 source_type?: string;
 source_content?: string;
 course_id?: number | null;
 difficulty?: string;
 time_limit_minutes?: number;
 passing_score?: number;
 status?: "draft" | "published";
 questions: any[];
 }
 ) => {
 const payload = {
 ...quizData,
 questions: quizData.questions.map((q: any) => ({
 type: q.type === "trac_nghiem" ? "multiple_choice" : (q.type === "tu_luan" ? "essay" : q.type),
 selection_type: q.selection_type || "single_choice",
 difficulty: q.difficulty || "medium",
 content: q.content || q.question || "",
 image_url: q.image_url || null,
 image_r2_key: q.image_r2_key || null,
 explanation: q.explanation || "",
 sample_answer: q.type === "essay" || q.type === "tu_luan" ? (q.sample_answer || "") : undefined,
 rubric: q.type === "essay" || q.type === "tu_luan" ? (q.rubric || "") : undefined,
 points: parseFloat(q.points) || 0,
 answers: (q.type === "multiple_choice" || q.type === "trac_nghiem") && Array.isArray(q.answers)
 ? q.answers.map((a: any, idx: number) => ({
 content: a.content || a.text || "",
 is_correct: Boolean(a.is_correct),
 image_url: a.image_url || q.answer_images?.[idx]?.url || null,
 image_r2_key: a.image_r2_key || q.answer_images?.[idx]?.r2_key || null,
 }))
 : (q.type === "multiple_choice" || q.type === "trac_nghiem") && Array.isArray(q.options)
 ? q.options.map((opt: string, idx: number) => ({
 content: opt,
 is_correct: q.selection_type === "multiple_choice"
 ? (q.correct_answer_indices || []).includes(idx)
 : idx === q.correct_answer_index,
 image_url: q.answer_images?.[idx]?.url || null,
 image_r2_key: q.answer_images?.[idx]?.r2_key || null,
 }))
 : undefined,
 })),
 };

 const res = await axiosClient.put(`/api/instructor/ai-quiz/${quizId}`, payload);
 return res.data;
 },

 // Save standalone quiz
 saveQuiz: async (quizData: {
 title: string;
 description: string;
 thumbnail_url?: string | null;
 thumbnail_r2_key?: string | null;
 source_type: string;
 source_content: string;
 course_id?: number | null;
 difficulty: string;
 time_limit_minutes: number;
 passing_score: number;
 status: "draft" | "published";
 questions: GeneratedQuestion[];
 }) => {
 const payload = {
 ...quizData,
 questions: quizData.questions.map(serializeQuizQuestion),
 };

 const res = await axiosClient.post("/api/instructor/ai-quiz/store", payload);
 return res.data;
 },

 // Get list of instructor quizzes
 getQuizzes: async (courseId?: number): Promise<{ success: boolean; data: QuizSummary[] }> => {
 const url = courseId ? `/api/instructor/ai-quiz?course_id=${courseId}` : "/api/instructor/ai-quiz";
 const res = await axiosClient.get(url);
 return res.data;
 },

 // Get quiz details
 getQuizById: async (quizId: number) => {
 const res = await axiosClient.get(`/api/instructor/ai-quiz/${quizId}`);
 return res.data?.data || res.data;
 },

 // Delete quiz (supports optional force parameter to un-attach attached quizzes)
 deleteQuiz: async (quizId: number, force: boolean = false) => {
 const res = await axiosClient.delete(`/api/instructor/ai-quiz/${quizId}`, {
 params: force ? { force: 1 } : {},
 });
 return res.data;
 },

 // Attach quiz to course
 attachQuiz: async (quizId: number, attachment: QuizAttachmentPayload) => {
 const res = await axiosClient.post(`/api/instructor/ai-quiz/${quizId}/attach`, attachment);
 return res.data;
 },

  // Set active quiz for a course position
  setActiveQuiz: async (quizId: number, courseId: number, position?: string) => {
    const res = await axiosClient.post(`/api/instructor/ai-quiz/${quizId}/set-active`, {
      course_id: courseId,
      position,
    });
    return res.data;
  },

 // Get instructor courses for attachment dropdown
 getInstructorCourses: async (): Promise<{ success: boolean; data: any[] }> => {
 const res = await axiosClient.get("/api/instructor/courses?per_page=100");
 const raw = res.data;
 let list: any[] = [];
 if (Array.isArray(raw?.data)) {
 list = raw.data;
 } else if (Array.isArray(raw?.data?.data)) {
 list = raw.data.data;
 } else if (Array.isArray(raw)) {
 list = raw;
 }
 return { success: true, data: list };
 },

 // Get full course details with modules and lessons
 getCourseDetails: async (courseId: number) => {
 const res = await axiosClient.get(`/api/instructor/courses/${courseId}`);
 return res.data?.data || res.data;
 },
};
