"use client";

import { useState, useCallback } from "react";
import { QuizConfig, GeneratedQuestion, QuizSummary } from "../types/quizGenerator.types";
import { quizGeneratorApi } from "../api/quizGeneratorApi";

export function useAiQuizWizard() {
  const [step, setStep] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [savedQuiz, setSavedQuiz] = useState<QuizSummary | null>(null);

  const [config, setConfig] = useState<QuizConfig>({
    title: "Kiểm tra kiến thức",
    description: "Đề kiểm tra trắc nghiệm & tự luận được tạo bởi AI",
    source_type: "topic",
    source_content: "",
    topic: "Toán hệ nhị phân",
    difficulty: "mixed",
    total_questions: 20,
    multiple_choice_count: 15,
    essay_count: 5,
    time_limit_minutes: 20,
    passing_score: 70,
  });

  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);

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
      setError(err.response?.data?.message || err.message || "Đã xảy ra lỗi khi tạo câu hỏi bằng AI");
      setStep(2); // Fallback to step 2 on error
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

      const response = await quizGeneratorApi.saveQuiz({
        title: config.title,
        description: config.description,
        source_type: config.source_type,
        source_content: config.source_type === "content" ? config.source_content : config.topic,
        difficulty: config.difficulty,
        time_limit_minutes: config.time_limit_minutes,
        passing_score: config.passing_score,
        status,
        questions: activeQuestions,
      });

      if (response.success && response.data) {
        setSavedQuiz(response.data);
        setStep(5); // Move to Step 5 (Attachment & Success)
        return response.data;
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

  return {
    step,
    setStep,
    config,
    updateConfig,
    questions,
    isGenerating,
    isSaving,
    error,
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
