"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { QuizConfig, GeneratedQuestion, QuizSummary } from "../types/quizGenerator.types";
import { quizGeneratorApi } from "../api/quizGeneratorApi";

export function useAiQuizWizard(options?: {
  initialCourseId?: number;
  initialModuleId?: number;
  initialAfterLessonId?: number;
  embeddedMode?: boolean;
  onSuccessComplete?: (savedQuiz?: any) => void;
}) {
 const searchParams = useSearchParams();
 const rawCourseId = searchParams ? (searchParams.get("course_id") || searchParams.get("courseId")) : null;
 const rawModuleId = searchParams ? (searchParams.get("module_id") || searchParams.get("moduleId")) : null;
 const rawAfterLessonId = searchParams ? (searchParams.get("after_lesson_id") || searchParams.get("afterLessonId")) : null;
 const positionParam = searchParams ? searchParams.get("position") : null;

 const courseIdParam = rawCourseId ? Number(rawCourseId) : options?.initialCourseId;
 const moduleIdParam = rawModuleId ? Number(rawModuleId) : options?.initialModuleId;
 const afterLessonIdParam = rawAfterLessonId ? Number(rawAfterLessonId) : options?.initialAfterLessonId;

 const [step, setStep] = useState<number>(options?.embeddedMode ? 2 : 1);
 const [isGenerating, setIsGenerating] = useState<boolean>(false);
 const [isSaving, setIsSaving] = useState<boolean>(false);
 const [error, setError] = useState<string | null>(null);
 const [savedQuiz, setSavedQuiz] = useState<QuizSummary | null>(null);

 const [config, setConfig] = useState<QuizConfig>({
 title: "Kiểm tra kiến thức",
 description: "Đề kiểm tra trắc nghiệm & tự luận được tạo bởi AI",
 source_type: courseIdParam ? "course" : "topic",
 course_id: courseIdParam || undefined,
 source_content: "",
 topic: "Kiến thức bài học",
 difficulty: "mixed",
 total_questions: 20,
 multiple_choice_count: 15,
 essay_count: 5,
 time_limit_minutes: 20,
 passing_score: 70,
 });

 useEffect(() => {
   if (courseIdParam) {
     setConfig((prev) => ({
       ...prev,
       source_type: "course",
       course_id: Number(courseIdParam),
     }));
   }
 }, [courseIdParam]);

 const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);

 const [errorInfo, setErrorInfo] = useState<{ message: string; errorCode: string } | null>(null);

 // Update Config
 const updateConfig = useCallback((fields: Partial<QuizConfig>) => {
 setConfig((prev) => {
 const next = { ...prev, ...fields };
 return next;
 });
 }, []);

 // Generate Questions from AI
 const handleGenerate = useCallback(async () => {
 setIsGenerating(true);
 setError(null);
 setErrorInfo(null);
 setStep(3); // Transition to generating step

 try {
 const response = await quizGeneratorApi.generateQuiz(config);

 if (response.success && response.data?.questions) {
 const genQuestions: GeneratedQuestion[] = response.data.questions.map((q: any) => ({
 ...q,
 reviewStatus: "pending",
 }));
 setQuestions(genQuestions);
 if (response.data.title) {
 updateConfig({ title: response.data.title, description: response.data.description || config.description });
 }
 setStep(4); // Move to Step 4 (Review)
 } else {
 throw new Error(response.message || "Không thể sinh câu hỏi bằng AI");
 }
 } catch (err: any) {
 console.error("AI Quiz Generator error:", err);
 const apiData = err.response?.data;
 const errorCode = apiData?.error_code || apiData?.errorCode || "AI_GENERATION_FAILED";

 let msg = apiData?.message || err.message;
 if (!msg || typeof msg !== "string" || msg.includes("status code 500") || msg.includes("AxiosError")) {
 msg = "Hệ thống AI đang gặp lỗi khi tạo câu hỏi. Vui lòng thử lại.";
 }

 setErrorInfo({
 message: msg,
 errorCode,
 });
 setError(msg);
 setStep(2); // Fallback to step 2 on error so user can adjust & retry
 } finally {
 setIsGenerating(false);
 }
 }, [config, updateConfig]);

 // Question editing
 const updateQuestion = useCallback((id: string, updatedFields: Partial<GeneratedQuestion>) => {
 setQuestions((prev) =>
 prev.map((q) => (q.id === id ? { ...q, ...updatedFields, reviewStatus: "edited" } : q))
 );
 }, []);

 const approveQuestion = useCallback((id: string) => {
 setQuestions((prev) =>
 prev.map((q) => (q.id === id ? { ...q, reviewStatus: "approved" } : q))
 );
 }, []);

 const deleteQuestion = useCallback((id: string) => {
 setQuestions((prev) => prev.filter((q) => q.id !== id));
 }, []);

 // Regenerate Single Question
 const regenerateSingleQuestion = useCallback(async (id: string, type: "multiple_choice" | "essay", difficulty: string) => {
 try {
 const contextText = config.source_type === "content" ? config.source_content : config.topic;
 const res = await quizGeneratorApi.regenerateSingleQuestion(type, difficulty, contextText);

 if (res.success && res.data) {
 const newQ: GeneratedQuestion = res.data;
 setQuestions((prev) => prev.map((q) => (q.id === id ? { ...newQ, id } : q)));
 }
 } catch (err: any) {
 alert("Không thể sinh lại câu hỏi: " + (err.message || "Lỗi AI"));
 }
 }, [config]);

 // Save Quiz
 const handleSaveQuiz = useCallback(async (status: "draft" | "published" = "published") => {
 setIsSaving(true);
 setError(null);

 try {
 const activeQuestions = questions.filter((q) => q.reviewStatus !== "discarded");

  const targetCourseId = config.course_id || (courseIdParam ? Number(courseIdParam) : undefined);

  const response = await quizGeneratorApi.saveQuiz({
    title: config.title,
    description: config.description,
    source_type: config.source_type,
    source_content: config.source_type === "course" ? (config.course_title || "") : (config.source_type === "content" ? config.source_content : config.topic),
    course_id: targetCourseId,
    difficulty: config.difficulty,
    time_limit_minutes: config.time_limit_minutes,
    passing_score: config.passing_score,
    status,
    questions: activeQuestions,
  });

  if (response.success && response.data) {
    const quizData = response.data;
    setSavedQuiz(quizData);

    // If in embedded course mode, auto attach if course_id exists and bypass Step 5 modal unconditionally
    if (options?.embeddedMode || options?.onSuccessComplete) {
      if (targetCourseId && options?.initialModuleId) {
        try {
          await quizGeneratorApi.attachQuiz(quizData.id, {
            course_id: targetCourseId,
            module_id: options.initialModuleId,
            position: "in_module",
            order: 99,
          });
        } catch (attachErr) {
          console.warn("Auto attach failed:", attachErr);
        }
      }
          if (options?.onSuccessComplete) {
            options.onSuccessComplete(quizData);
            return quizData;
          }
        }

        setStep(5); // Move to Step 5 only if standalone mode
        return quizData;
      } else {
 throw new Error(response.message || "Lưu bài kiểm tra thất bại");
 }
 } catch (err: any) {
 setError(err.response?.data?.message || err.message || "Lỗi khi lưu bài kiểm tra");
 } finally {
 setIsSaving(false);
 }
 }, [config, questions]);

 const approvedCount = questions.filter((q) => q.reviewStatus === "approved" || q.reviewStatus === "edited").length;

 const clearError = useCallback(() => {
 setError(null);
 setErrorInfo(null);
 }, []);

 return {
 step,
 setStep,
 config,
 updateConfig,
 questions,
 isGenerating,
 isSaving,
 error,
 errorInfo,
 setError,
 clearError,
 savedQuiz,
 handleGenerate,
 updateQuestion,
 approveQuestion,
 deleteQuestion,
 regenerateSingleQuestion,
 handleSaveQuiz,
 approvedCount,
 };
}
