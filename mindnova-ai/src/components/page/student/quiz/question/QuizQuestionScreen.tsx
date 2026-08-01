"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuizTimer } from "@/src/hooks/useQuizTimer";
import { MOCK_QUIZ } from "@/src/components/page/student/courses/constants/detail";
import type { IQuizQuestion } from "@/src/components/page/student/courses/types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface QuizSessionData {
  quizId: number;
  startedAt: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function loadSession(): QuizSessionData {
  if (typeof window === "undefined") {
    return { quizId: MOCK_QUIZ.id, startedAt: Date.now() };
  }
  try {
    const raw = sessionStorage.getItem("quizSession");
    if (raw) return JSON.parse(raw) as QuizSessionData;
  } catch {
    // ignore
  }
  // Fallback: create a new session (shouldn't happen in normal flow)
  const session = { quizId: MOCK_QUIZ.id, startedAt: Date.now() };
  sessionStorage.setItem("quizSession", JSON.stringify(session));
  return session;
}

// ─── Option Button ────────────────────────────────────────────────────────────

interface OptionButtonProps {
  optionId: string;
  label: string;
  text: string;
  isSelected: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

function OptionButton({ optionId, label, text, isSelected, isDisabled, onClick }: OptionButtonProps) {
  return (
    <button
      id={`option-${optionId}`}
      onClick={onClick}
      disabled={isDisabled}
      className={[
        "flex items-center p-4 rounded-xl border-2 transition-all text-left w-full",
        isSelected
          ? "border-[#4F46E5] bg-[#EEF2FF]/40 shadow-2xs"
          : "border-gray-200 bg-white hover:border-gray-300",
        isDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
      ].join(" ")}
    >
      <div className={[
        "w-10 h-10 rounded-lg flex items-center justify-center font-bold text-[15px] shrink-0 shadow-2xs",
        isSelected ? "bg-[#4F46E5] text-white" : "bg-gray-100 text-gray-500",
      ].join(" ")}>
        {label}
      </div>
      <span className={[
        "ml-4 text-[15px] flex-1",
        isSelected ? "font-bold text-gray-900" : "font-medium text-gray-700",
      ].join(" ")}>
        {text}
      </span>
      {isSelected && (
        <div className="shrink-0 text-[#6B6BFF] ml-4">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </div>
      )}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function QuizQuestionScreen({ lessonId: _lessonId }: { lessonId?: string } = {}) {
  const router = useRouter();
  const quiz = MOCK_QUIZ;

  // ── Session & Timer ────────────────────────────────────────────────────────
  const [session] = useState<QuizSessionData>(loadSession);

  // ── Quiz State ─────────────────────────────────────────────────────────────
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion: IQuizQuestion | undefined = quiz.questions[currentIndex];
  const totalQuestions = quiz.questions.length;
  const completionPercent = Math.round((currentIndex / totalQuestions) * 100);
  const selectedOption = currentQuestion ? answers[currentQuestion.id] : undefined;

  // ── Auto-submit on timer expire ────────────────────────────────────────────
  const handleExpire = useCallback(() => {
    handleSubmit(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers]);

  const { formattedTime, isExpired, isUrgent } = useQuizTimer({
    durationSeconds: quiz.durationSeconds,
    startedAt: session.startedAt,
    onExpire: handleExpire,
    enabled: !isSubmitting,
  });

  // ── Deadline check on mount ────────────────────────────────────────────────
  useEffect(() => {
    if (quiz.deadline && new Date(quiz.deadline) < new Date()) {
      // Deadline passed — submit immediately
      handleSubmit(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleSelectOption = useCallback((questionId: number, optionId: string) => {
    if (isExpired || isSubmitting) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  }, [isExpired, isSubmitting]);

  const handleNext = useCallback(() => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, totalQuestions]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  }, [currentIndex]);

  async function handleSubmit(autoSubmit = false) {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Calculate score server-side (simulated)
    const correct = quiz.questions.filter((q) => answers[q.id] === q.correctOptionId).length;
    const score = Math.round((correct / totalQuestions) * 100);
    const timeTaken = Math.floor((Date.now() - session.startedAt) / 1000);

    // In production: POST /api/quizzes/[quizId]/submit { answers, sessionId }
    console.info(`[Quiz] Submitted — score: ${score}%, timeTaken: ${timeTaken}s, autoSubmit: ${autoSubmit}`);

    // Persist result for the result page
    sessionStorage.setItem("quizResult", JSON.stringify({ score, correct, total: totalQuestions, timeTaken }));

    // Small delay to show the submitting state
    await new Promise<void>((resolve) => setTimeout(resolve, 600));

    // Clear quiz session
    sessionStorage.removeItem("quizSession");
    router.push("/practice/quiz/result");
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-[#F4F4F8] flex items-center justify-center">
        <p className="text-[#6B7280]">No questions available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F4F8] flex flex-col font-sans">

      {/* ─── Topbar ────────────────────────────────────────────────────────── */}
      <header className="h-[72px] bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 sticky top-0 z-20">
        {/* Left: Close & Brand */}
        <div className="flex items-center gap-4">
          <Link href="/practice" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-[#6B7280]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </Link>
          <div className="h-8 w-px bg-gray-200" />
          <div className="flex flex-col">
            <span className="text-[#4F46E5] font-extrabold text-lg leading-tight">MindNova</span>
            <span className="text-gray-400 text-[11px] font-medium leading-tight">Next.js Advanced Patterns</span>
          </div>
        </div>

        {/* Right: Timer & Submit */}
        <div className="flex items-center gap-4">
          {/* Live Timer */}
          <div className={[
            "flex items-center gap-2 px-3.5 py-1.5 rounded-full shadow-2xs transition-colors border",
            isUrgent
              ? "bg-red-50 text-red-600 border-red-200 animate-pulse"
              : "bg-[#EEF2FF] text-[#4F46E5] border-indigo-100",
          ].join(" ")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="text-[13px] font-extrabold tracking-wide tabular-nums">
              {formattedTime} remaining
            </span>
          </div>

          {/* Submit Early */}
          <button
            onClick={() => handleSubmit(false)}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl bg-[#4F46E5] text-white text-[13px] font-bold hover:bg-[#4338CA] transition-colors shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? "Submitting..." : "Submit Quiz"}
          </button>
        </div>
      </header>

      {/* ─── Main Content ────────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto pb-32">
        <div className="max-w-[760px] mx-auto px-6 pt-10">

          {/* Progress Section */}
          <div className="mb-8">
            <span className="text-[#6B6BFF] text-[11px] font-bold tracking-widest uppercase">
              Quiz · {quiz.title}
            </span>
            <div className="flex items-end justify-between mt-1">
              <h1 className="text-[28px] font-bold text-[#1F2937] leading-tight">
                Question {currentIndex + 1} of {totalQuestions}
              </h1>
              <span className="text-[13px] font-medium text-gray-500 mb-1">
                Answered: {Object.keys(answers).length}/{totalQuestions}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-gray-200 rounded-full mt-4 overflow-hidden">
              <div
                className="h-full bg-[#4F46E5] rounded-full transition-all duration-500"
                style={{ width: `${completionPercent}%` }}
              />
            </div>

            {/* Question nav dots */}
            <div className="flex gap-1.5 mt-3 flex-wrap">
              {quiz.questions.map((q, i) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(i)}
                  aria-label={`Go to question ${i + 1}`}
                  className={[
                    "w-7 h-7 rounded-lg text-[11px] font-bold transition-all cursor-pointer",
                    i === currentIndex
                      ? "bg-[#4F46E5] text-white shadow-2xs"
                      : answers[q.id]
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-gray-100 text-[#6B7280] hover:bg-gray-200",
                  ].join(" ")}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-2xl p-8 shadow-[0_2px_12px_rgb(0,0,0,0.03)] border border-[#F3F4F6] mb-6">
            <p className="text-[17px] text-gray-800 font-medium leading-relaxed">
              {currentQuestion.question}
            </p>
          </div>

          {/* Options */}
          <div className="flex flex-col gap-4">
            {currentQuestion.options.map((opt, i) => (
              <OptionButton
                key={opt.id}
                optionId={opt.id}
                label={String.fromCharCode(65 + i)} // A, B, C, D
                text={opt.text}
                isSelected={selectedOption === opt.id}
                isDisabled={isExpired || isSubmitting}
                onClick={() => handleSelectOption(currentQuestion.id, opt.id)}
              />
            ))}
          </div>

          {/* AI Tutor Hint */}
          <div className="mt-8 bg-white border border-[#F3F4F6] rounded-2xl p-6 shadow-sm flex gap-4 items-start">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#2E3192] text-white flex items-center justify-center shrink-0 shadow-md">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
              </svg>
            </div>
            <div className="pt-0.5">
              <h4 className="text-[11px] font-bold text-[#6B6BFF] uppercase tracking-widest mb-1.5">AI Tutor Hint</h4>
              <p className="text-[14px] text-gray-600 leading-relaxed">
                Think about how Next.js handles requests that don't return HTML, but rather JSON or other data formats for external consumption.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* ─── Footer Action Bar ──────────────────────────────────────────────── */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-[#F0F2F5] py-4 px-6 z-20">
        <div className="max-w-[760px] mx-auto flex items-center justify-between">

          {/* Previous */}
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold text-[14px] hover:bg-gray-50 transition-colors focus:outline-none focus:ring-4 focus:ring-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
            Previous
          </button>

          {/* Right: Skip / Next / Submit */}
          <div className="flex items-center gap-6">
            {currentIndex < totalQuestions - 1 && !selectedOption && (
              <button
                onClick={handleNext}
                className="text-[14px] font-bold text-[#4F46E5] hover:text-[#4338CA] hover:underline transition-all cursor-pointer"
              >
                Skip for now
              </button>
            )}

            {currentIndex < totalQuestions - 1 ? (
              <button
                onClick={handleNext}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold text-[14px] shadow-2xs hover:shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                Next Question
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            ) : (
              <button
                onClick={() => handleSubmit(false)}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[14px] shadow-2xs hover:shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit Quiz"}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
