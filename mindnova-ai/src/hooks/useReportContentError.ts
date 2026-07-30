"use client";

import { useCallback, useEffect, useState } from "react";

// ─── Types & Interfaces ───────────────────────────────────────────────────────

export type ContentErrorType =
  | "Audio/Video Glitch"
  | "Typo in Transcript"
  | "Broken Code Example"
  | "Inaccurate Concept"
  | "Other";

export interface ErrorReportContext {
  userId: string;
  courseId: number;
  lessonId: number;
  userAgent: string;
  timestamp: string;
  pageUrl: string;
}

interface UseReportContentErrorOptions {
  courseId?: number;
  lessonId?: number;
}

interface UseReportContentErrorReturn {
  errorType: ContentErrorType;
  description: string;
  context: ErrorReportContext;
  isSubmitting: boolean;
  isSubmitted: boolean;
  setErrorType: (v: ContentErrorType) => void;
  setDescription: (v: string) => void;
  handleSubmitReport: () => Promise<void>;
  resetForm: () => void;
}

// ─── Custom Hook ──────────────────────────────────────────────────────────────

/**
 * Automates content error diagnostics by bundling ambient user/system context
 * directly into the report payload without requiring extra user inputs.
 */
export function useReportContentError({
  courseId = 1,
  lessonId = 101,
}: UseReportContentErrorOptions = {}): UseReportContentErrorReturn {
  const [errorType, setErrorType] = useState<ContentErrorType>("Audio/Video Glitch");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Safely grab browser/client environmental context
  const [clientInfo, setClientInfo] = useState({ userAgent: "Modern Browser / React RSC", pageUrl: "/courses/detail" });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setClientInfo({
        userAgent: window.navigator.userAgent || "Unknown Browser",
        pageUrl: window.location.href,
      });
    }
  }, []);

  const context: ErrorReportContext = {
    userId: "usr-alex-rivera-882",
    courseId,
    lessonId,
    userAgent: clientInfo.userAgent,
    timestamp: new Date().toISOString(),
    pageUrl: clientInfo.pageUrl,
  };

  const handleSubmitReport = useCallback(async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    const payload = {
      ...context,
      errorType,
      description: description.trim(),
    };

    console.info("[ReportContentError] Transmitting error diagnostics payload to instructor queue:", payload);
    // Simulate API call to POST /api/courses/report-error
    await new Promise((res) => setTimeout(res, 900));

    setIsSubmitting(false);
    setIsSubmitted(true);
    setDescription("");
  }, [isSubmitting, context, errorType, description]);

  const resetForm = useCallback(() => {
    setIsSubmitted(false);
    setErrorType("Audio/Video Glitch");
    setDescription("");
  }, []);

  return {
    errorType,
    description,
    context,
    isSubmitting,
    isSubmitted,
    setErrorType,
    setDescription,
    handleSubmitReport,
    resetForm,
  };
}
