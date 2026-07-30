"use client";

import { useCallback, useState } from "react";

// ─── Types & Interfaces ───────────────────────────────────────────────────────

export interface ICourseRating {
  rating: number;
  reviewText: string;
  updatedAt: string;
}

interface UseCourseRatingOptions {
  courseId: number;
  courseProgress: number;
  minProgressThreshold?: number;
  initialRating?: ICourseRating | null;
}

interface UseCourseRatingReturn {
  isEligible: boolean;
  rating: number;
  reviewText: string;
  isSubmitting: boolean;
  isSaved: boolean;
  profanityError: string | null;
  hasExistingRating: boolean;
  setRating: (v: number) => void;
  setReviewText: (v: string) => void;
  handleSubmit: () => Promise<void>;
}

// ─── Simple Profanity Filter ──────────────────────────────────────────────────

const BAD_WORDS = ["spam", "fake", "scam", "idiot", "stupid", "fuck", "shit", "bitch"];

function checkProfanity(text: string): string | null {
  const lower = text.toLowerCase();
  for (const word of BAD_WORDS) {
    if (lower.includes(word)) {
      return `Review contains inappropriate language ("${word}"). Please revise.`;
    }
  }
  return null;
}

// ─── Custom Hook ──────────────────────────────────────────────────────────────

/**
 * Enforces business logic for course rating:
 * 1. Gated by minimum progress threshold (default 20%).
 * 2. One rating per course per user (submitting overwrites existing record).
 * 3. Profanity filtering on review text before submission.
 */
export function useCourseRating({
  courseId,
  courseProgress,
  minProgressThreshold = 20,
  initialRating = null,
}: UseCourseRatingOptions): UseCourseRatingReturn {
  const [rating, setRating] = useState<number>(initialRating?.rating ?? 5);
  const [reviewText, setReviewTextRaw] = useState<string>(initialRating?.reviewText ?? "");
  const [hasExistingRating, setHasExistingRating] = useState<boolean>(!!initialRating);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [profanityError, setProfanityError] = useState<string | null>(null);

  const isEligible = courseProgress >= minProgressThreshold;

  const setReviewText = useCallback((text: string) => {
    setReviewTextRaw(text);
    if (profanityError) {
      setProfanityError(null);
    }
    if (isSaved) {
      setIsSaved(false);
    }
  }, [profanityError, isSaved]);

  const handleSubmit = useCallback(async () => {
    if (!isEligible || isSubmitting) return;

    // Check profanity
    const error = checkProfanity(reviewText);
    if (error) {
      setProfanityError(error);
      return;
    }
    setProfanityError(null);
    setIsSubmitting(true);

    // Simulate API save (atomic upsert per one-rating-per-course rule)
    console.info(`[CourseRating] Upserting rating for course ${courseId}:`, { rating, reviewText });
    await new Promise((resolve) => setTimeout(resolve, 800));

    setIsSubmitting(false);
    setIsSaved(true);
    setHasExistingRating(true);
  }, [isEligible, isSubmitting, reviewText, courseId, rating]);

  return {
    isEligible,
    rating,
    reviewText,
    isSubmitting,
    isSaved,
    profanityError,
    hasExistingRating,
    setRating,
    setReviewText,
    handleSubmit,
  };
}
