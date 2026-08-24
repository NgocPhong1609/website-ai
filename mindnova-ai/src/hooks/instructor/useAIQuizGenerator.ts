"use client";

import { useState, useCallback } from "react";
import { axiosClient } from "@/src/shared/lib/axios";

export type QuestionType = "multiple_choice" | "true_false" | "coding_challenge";
export type ReviewStatus = "pending" | "approved" | "edited" | "discarded";

export interface GeneratedQuestion {
  id: string;
  type: QuestionType;
  question: string;
  correctAnswer: string;
  distractors: string[]; // for multiple choice
  explanation: string;
  codeSnippet?: string;
  reviewStatus: ReviewStatus;
}

export interface UseAIQuizGeneratorReturn {
  isGenerating: boolean;
  error: string | null;
  questions: GeneratedQuestion[];
  transcriptSource: string;
  setTranscriptSource: (txt: string) => void;
  generateFromTranscript: (lessonTitle: string, count?: number, difficulty?: string, types?: string[]) => void;
  approveQuestion: (id: string) => void;
  editQuestion: (id: string, newText: string, newAnswer: string) => void;
  discardQuestion: (id: string) => void;
  approvedCount: number;
}

export function useAIQuizGenerator(): UseAIQuizGeneratorReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [transcriptSource, setTranscriptSource] = useState<string>("");

  const generateFromTranscript = useCallback(async (
    lessonTitle: string,
    count: number = 3,
    difficulty: string = "intermediate",
    types: string[] = ["multiple_choice", "true_false", "coding_challenge"]
  ) => {
    setIsGenerating(true);
    setError(null);
    setQuestions([]);

    try {
      const response = await axiosClient.post("/api/instructor/ai-quiz/generate", {
        content: transcriptSource,
        count,
        difficulty,
        types
      });

      if (response.data?.success && response.data?.data) {
        const generated = response.data.data.map((q: any) => ({
          ...q,
          reviewStatus: "pending" as ReviewStatus
        }));
        setQuestions(generated);
      } else {
        throw new Error(response.data?.message || "Failed to generate quiz");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "An unexpected error occurred");
    } finally {
      setIsGenerating(false);
    }
  }, [transcriptSource]);

  const approveQuestion = useCallback((id: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, reviewStatus: "approved" } : q))
    );
  }, []);

  const editQuestion = useCallback((id: string, newText: string, newAnswer: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, question: newText, correctAnswer: newAnswer, reviewStatus: "edited" } : q
      )
    );
  }, []);

  const discardQuestion = useCallback((id: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, reviewStatus: "discarded" } : q))
    );
  }, []);

  const approvedCount = questions.filter((q) => q.reviewStatus === "approved" || q.reviewStatus === "edited").length;

  return {
    isGenerating,
    error,
    questions,
    transcriptSource,
    setTranscriptSource,
    generateFromTranscript,
    approveQuestion,
    editQuestion,
    discardQuestion,
    approvedCount,
  };
}