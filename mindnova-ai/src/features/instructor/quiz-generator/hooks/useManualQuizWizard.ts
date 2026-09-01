"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { QuizConfig, GeneratedQuestion, QuizSummary } from "../types/quizGenerator.types";
import { quizGeneratorApi } from "../api/quizGeneratorApi";

export function useManualQuizWizard(options?: {
  initialCourseId?: number;
  initialModuleId?: number;
  initialAfterLessonId?: number;
  embeddedMode?: boolean;
  onSuccessComplete?: (savedQuiz?: any) => void;
}) {
  const searchParams = useSearchParams();
  const rawCourseId = searchParams ? (searchParams.get("course_id") || searchParams.get("courseId")) : null;
  const courseIdParam = rawCourseId ? Number(rawCourseId) : options?.initialCourseId;

  const [step, setStep] = useState<number>(1);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [savedQuiz, setSavedQuiz] = useState<QuizSummary | null>(null);

  const [config, setConfig] = useState<QuizConfig>({
    title: "Bài kiểm tra mới",
    description: "Đề kiểm tra trắc nghiệm & tự luận",
    source_type: "manual" as any,
    course_id: courseIdParam || undefined,
    source_content: "",
    topic: "Kiến thức bài học",
    difficulty: "mixed",
    total_questions: 0,
    multiple_choice_count: 0,
    essay_count: 0,
    time_limit_minutes: 20,
    passing_score: 70,
  });

  useEffect(() => {
    if (courseIdParam) {
      setConfig((prev) => ({
        ...prev,
        course_id: Number(courseIdParam),
      }));
    }
  }, [courseIdParam]);

  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);

  // Update Config
  const updateConfig = useCallback((fields: Partial<QuizConfig>) => {
    setConfig((prev) => {
      const next = { ...prev, ...fields };
      return next;
    });
  }, []);

  // Question editing
  const addQuestion = useCallback((type: "multiple_choice" | "essay") => {
    setQuestions((prev) => [
      ...prev,
      {
        id: `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type,
        difficulty: "medium",
        question: "",
        options: type === "multiple_choice" ? ["", "", "", ""] : [],
        correct_answer_index: type === "multiple_choice" ? 0 : null,
        explanation: "",
        sample_answer: "",
        rubric: "",
        points: type === "essay" ? 2.5 : 0.5,
        reviewStatus: "edited", // manually added is auto edited
      },
    ]);
  }, []);

  const updateQuestion = useCallback((id: string, updatedFields: Partial<GeneratedQuestion>) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...updatedFields, reviewStatus: "edited" } : q))
    );
  }, []);

  const deleteQuestion = useCallback((id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  }, []);

  // Save Quiz
  const handleSaveQuiz = useCallback(async (status: "draft" | "published" = "published") => {
    setIsSaving(true);
    setError(null);

    try {
      const activeQuestions = questions.filter((q) => q.reviewStatus !== "discarded");

      if (activeQuestions.length === 0) {
        throw new Error("Bài kiểm tra phải có ít nhất 1 câu hỏi.");
      }

      const mcCount = activeQuestions.filter((q) => q.type === "multiple_choice").length;
      const essayCount = activeQuestions.filter((q) => q.type === "essay").length;

      const response = await quizGeneratorApi.saveQuiz({
        title: config.title,
        description: config.description,
        source_type: "manual",
        source_content: config.title,
        course_id: config.course_id,
        difficulty: config.difficulty,
        time_limit_minutes: config.time_limit_minutes,
        passing_score: config.passing_score,
        status,
        questions: activeQuestions,
      });

      if (response.success && response.data) {
        const quizData = response.data;
        setSavedQuiz(quizData);

        // If in embedded course mode, auto attach if course_id exists and bypass Step 3 modal unconditionally
        if (options?.embeddedMode || options?.onSuccessComplete) {
          if (config.course_id && options?.initialModuleId) {
            try {
              await quizGeneratorApi.attachQuiz(quizData.id, {
                course_id: config.course_id,
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

        setStep(3); // Move to Step 3 only if standalone mode
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

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    step,
    setStep,
    config,
    updateConfig,
    questions,
    isSaving,
    error,
    setError,
    clearError,
    savedQuiz,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    handleSaveQuiz,
  };
}
