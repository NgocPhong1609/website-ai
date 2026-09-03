"use client";

import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "@/src/shared/lib/axios";
import { useGetCourseDetail, useGetCourseAssessmentStatus, useInvalidateCourseDetail, completeLesson, fetchQuiz, checkQuizAnswer, submitQuiz, useGetDiscussions, useCreateDiscussion, useUpdateDiscussion, useDeleteDiscussion } from "../../api";
import type { CourseDetailLessonItem, CourseDetailData } from "../../types";
import { CustomVideoPlayer } from "./CustomVideoPlayer";
import { VerifiedTeacherBadge } from "@/src/shared/components/VerifiedTeacherBadge";
import { quizGeneratorApi } from "@/src/features/instructor/quiz-generator/api/quizGeneratorApi";

// ─── Icons ────────────────────────────────────────────────────────────────────
function CheckIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function PlayCircleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
    </svg>
  );
}

function ChevronIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function ArrowLeftIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );
}

function ChevronRightIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

// ─── Interfaces ───────────────────────────────────────────────────────────────
export interface LessonData {
 id: string;
 title: string;
 type: 'video' | 'article' | 'quiz_module' | 'quiz' | string;
 duration: string;
 durationSeconds: number;
 completed: boolean;
 videoUrl: string;
 hasUploadedVideo: boolean;
 content: string; // HTML for article
 quiz_id?: number | string | null;
 quizData?: any;
 questions?: any[];
}

interface ModuleData {
 id: string;
 title: string;
 subtitle: string;
 lessons: LessonData[];
}

interface CommentItem {
 id: string;
 author: string;
 avatar: string;
 role: string;
 time: string;
 content: string;
 isAi?: boolean;
}

// ─── Quiz Types ───────────────────────────────────────────────────────────────
interface QuizQuestion {
 id: string;
 content: string;
 order: number;
 answers: { id: string; content: string }[];
}

interface QuizData {
  id?: string;
  quiz_id: number;
  title: string;
  course_title?: string;
  questions_count?: number;
  time_limit_minutes: number;
  passing_score: number;
  questions: QuizQuestion[];
}

// ─── Lesson Type Labels ───────────────────────────────────────────────────────
function getLessonTypeLabel(type: string): string {
 switch (type) {
 case 'video': return 'Video';
 case 'article': return 'Văn bản';
 case 'quiz_module': return 'Câu hỏi';
 default: return 'Bài học';
 }
}

function getLessonTypeColor(type: string): string {
 switch (type) {
 case 'video': return 'bg-[#F5F0E8] text-[#2C3039]';
 case 'article': return 'bg-[#ECFDF5] text-[#2C3039]';
 case 'quiz_module': return 'bg-[#FFF7ED] text-[#EA580C]';
 default: return 'bg-[#F5F0E8] text-[#4A4F5C]';
 }
}

// ─── Text/Article Renderer ────────────────────────────────────────────────────
function ArticleRenderer({
 lesson,
 onComplete,
}: {
 lesson: LessonData;
 onComplete: () => void;
}) {
 const [timeSpent, setTimeSpent] = useState(0);
 const completedRef = useRef(false);
 const requiredTime = Math.ceil((lesson.durationSeconds || 60) * 1 / 3);

 useEffect(() => {
 completedRef.current = false;
 setTimeSpent(0);
 }, [lesson.id]);

 useEffect(() => {
 if (completedRef.current) return;

 const interval = setInterval(() => {
 // Only count time when the tab is visible
 if (document.visibilityState === 'visible') {
 setTimeSpent((prev) => {
 const next = prev + 1;
 if (next >= requiredTime && !completedRef.current) {
 completedRef.current = true;
 onComplete();
 }
 return next;
 });
 }
 }, 1000);

 return () => clearInterval(interval);
 }, [requiredTime, onComplete, lesson.id]);

 const progressPercent = Math.min((timeSpent / requiredTime) * 100, 100);

 if (!lesson.content) {
 return (
 <div className="w-full p-12 flex flex-col items-center justify-center text-gray-400 bg-[#FEFCF9] rounded-2xl border border-[#E8E2D9]">
 <></>
 <span className="text-sm font-medium mt-3">Nội dung bài học chưa được cập nhật.</span>
 </div>
 );
 }

 return (
 <div className="flex flex-col gap-4">
 {/* Reading progress bar */}
 {!completedRef.current && (
 <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FEFCF9] border border-[#E8E2D9]">
 <></>
 <div className="flex-1">
 <div className="w-full h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
 <div
 className="h-full bg-[#C0392B] rounded-full transition-all duration-1000"
 style={{ width: `${progressPercent}%` }}
 />
 </div>
 </div>
 <span className="text-[11px] font-semibold text-[#8A8478] shrink-0">
 {Math.floor(timeSpent / 60)}:{String(timeSpent % 60).padStart(2, '0')} / {Math.floor(requiredTime / 60)}:{String(requiredTime % 60).padStart(2, '0')}
 </span>
 </div>
 )}

 {/* CKEditor HTML Content — Styled Container */}
 <div
 className="ck-content prose prose-sm sm:prose max-w-none
 bg-white rounded-2xl border border-[#E8E2D9] p-6 sm:p-8 shadow-sm
 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-[#2C3039] [&_h1]:mb-4 [&_h1]:mt-6
 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[#2C3039] [&_h2]:mb-3 [&_h2]:mt-5
 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-[#2C3039] [&_h3]:mb-2 [&_h3]:mt-4
 [&_h4]:text-base [&_h4]:font-semibold [&_h4]:text-[#374151] [&_h4]:mb-2
 [&_p]:text-[15px] [&_p]:text-[#374151] [&_p]:leading-relaxed [&_p]:mb-4
 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:text-[#374151]
 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:text-[#374151]
 [&_li]:mb-1.5 [&_li]:text-[15px] [&_li]:leading-relaxed
 [&_a]:text-[#2C3039] [&_a]:underline [&_a]:hover:text-[#A93226]
 [&_img]:rounded-xl [&_img]:shadow-sm [&_img]:my-4 [&_img]:max-w-full [&_img]:h-auto
 [&_blockquote]:border-l-4 [&_blockquote]:border-[#C0392B] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-[#8A8478] [&_blockquote]:my-4
 [&_table]:w-full [&_table]:border-collapse [&_table]:my-4
 [&_th]:bg-[#F5F0E8] [&_th]:border [&_th]:border-[#E8E2D9] [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_th]:text-sm
 [&_td]:border [&_td]:border-[#E8E2D9] [&_td]:px-3 [&_td]:py-2 [&_td]:text-sm
 [&_pre]:bg-[#1F2937] [&_pre]:text-gray-200 [&_pre]:rounded-xl [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:my-4
 [&_code]:font-mono [&_code]:text-sm
 [&_hr]:border-[#E8E2D9] [&_hr]:my-6
 [&_figure]:my-4 [&_figure]:mx-auto
 [&_figcaption]:text-center [&_figcaption]:text-sm [&_figcaption]:text-[#8A8478] [&_figcaption]:mt-2
 [&_strong]:font-bold [&_em]:italic
 [&_mark]:bg-yellow-200 [&_mark]:px-1 [&_mark]:rounded"
 dangerouslySetInnerHTML={{ __html: lesson.content }}
 />
 </div>
 );
}

// ─── Quiz Component ───────────────────────────────────────────────────────────
function QuizRenderer({
 lesson,
 onComplete,
}: {
 lesson: LessonData;
 onComplete: () => void;
}) {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [essayText, setEssayText] = useState<string>("");
  const [answerResult, setAnswerResult] = useState<boolean | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [phase, setPhase] = useState<'quiz' | 'result'>('quiz');
  const [submitting, setSubmitting] = useState(false);
  const [submittingFinal, setSubmittingFinal] = useState(false);
  const [allAnswers, setAllAnswers] = useState<Record<string, string>>({});
  const [essayResult, setEssayResult] = useState<Record<string, any>>({});
  const [quizResult, setQuizResult] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasCompletedRef = useRef(false);

  // Helper to normalize questions from any source
  const normalizeQuestions = useCallback((rawQuestions: any[]) => {
    if (!Array.isArray(rawQuestions)) return [];
    return rawQuestions.map((q, idx) => {
      const isEssay = q.type === "essay" || q.type === "tu_luan";
      const content = q.content || q.question || q.title || `Câu hỏi #${idx + 1}`;

      let answers: any[] = [];
      if (Array.isArray(q.answers) && q.answers.length > 0) {
        answers = q.answers.map((a: any, aIdx: number) => ({
          id: a.id ? String(a.id) : String(aIdx + 1),
          content: typeof a === "string" ? a : (a.content || a.text || a.option || `Lựa chọn ${aIdx + 1}`),
          is_correct: Boolean(a.is_correct),
        }));
      } else if (Array.isArray(q.options) && q.options.length > 0) {
        answers = q.options.map((opt: any, aIdx: number) => ({
          id: String(aIdx + 1),
          content: typeof opt === "string" ? opt : (opt.content || opt.text || `Lựa chọn ${aIdx + 1}`),
          is_correct: aIdx === q.correct_answer_index,
        }));
      }

      return {
        id: q.id ? String(q.id) : `q_${idx + 1}`,
        content,
        type: isEssay ? "essay" : "multiple_choice",
        sample_answer: q.sample_answer || q.sampleAnswer || "",
        rubric: q.rubric || "",
        explanation: q.explanation || "",
        points: q.points || 1.0,
        answers,
      };
    });
  }, []);

  // Load quiz
  useEffect(() => {
    setLoading(true);
    setError("");
    setCurrentIndex(0);
    setSelectedAnswer("");
    setEssayText("");
    setAnswerResult(null);
    setAnswered(false);
    setCorrectCount(0);
    setAllAnswers({});

    // Restore saved quiz result if student already completed this quiz
    if (typeof window !== "undefined") {
      const savedRes = window.localStorage.getItem(`student_quiz_result_${lesson.id}`);
      if (savedRes) {
        try {
          const parsed = JSON.parse(savedRes);
          if (parsed && typeof parsed === "object" && typeof parsed.score !== "undefined") {
            setQuizResult(parsed);
            setPhase('result');
            hasCompletedRef.current = true;
          } else {
            setQuizResult(null);
            setPhase('quiz');
          }
        } catch (e) {
          setQuizResult(null);
          setPhase('quiz');
        }
      } else {
        setQuizResult(null);
        setPhase('quiz');
      }
    } else {
      setQuizResult(null);
      setPhase('quiz');
    }

    const loadQuizData = async () => {
      // 0. Check localStorage for instructor edited quiz
      if (typeof window !== "undefined") {
        const stored = window.localStorage.getItem(`instructor_quiz_${lesson.id}`);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            const rawQs = Array.isArray(parsed) ? parsed : (parsed.questions || parsed.quiz_questions || []);
            if (Array.isArray(rawQs) && rawQs.length > 0) {
              const normQuestions = normalizeQuestions(rawQs);
              setQuizData({
                id: String(lesson.id),
                quiz_id: Number((lesson as any).quiz_id || lesson.id),
                title: parsed.title || lesson.title || "Bài kiểm tra",
                course_title: "",
                time_limit_minutes: parsed.time_limit_minutes || 15,
                passing_score: parsed.passing_score || 70,
                questions_count: normQuestions.length,
                questions: normQuestions as any,
              });
              setTimeLeft((parsed.time_limit_minutes || 15) * 60);
              setLoading(false);
              return;
            }
          } catch (e) {}
        }
      }

      // 1. Embedded lesson quizData or questions first
      const embedded = (lesson as any).quizData || (lesson as any).quiz || (lesson as any).questions || (lesson as any).quiz_questions;
      if (embedded) {
        const rawQs = Array.isArray(embedded) ? embedded : (embedded.questions || embedded.quiz_questions || []);
        if (Array.isArray(rawQs) && rawQs.length > 0) {
          const normQuestions = normalizeQuestions(rawQs);
          setQuizData({
            id: String(lesson.id),
            quiz_id: Number((lesson as any).quiz_id || lesson.id),
            title: embedded.title || lesson.title || "Bài kiểm tra",
            course_title: "",
            time_limit_minutes: embedded.time_limit_minutes || 15,
            passing_score: embedded.passing_score || 70,
            questions_count: normQuestions.length,
            questions: normQuestions as any,
          });
          setTimeLeft((embedded.time_limit_minutes || 15) * 60);
          setLoading(false);
          return;
        }
      }

      // 2. Instructor API by targetQuizId
      const targetQuizId = (lesson as any).quiz_id || (lesson as any).quizId || lesson.id;
      if (targetQuizId) {
        try {
          const instData = await quizGeneratorApi.getQuizById(Number(targetQuizId));
          if (instData && Array.isArray(instData.questions) && instData.questions.length > 0) {
            const normQuestions = normalizeQuestions(instData.questions);
            setQuizData({
              id: String(instData.id),
              quiz_id: instData.id,
              title: instData.title || lesson.title || "Bài kiểm tra",
              course_title: "",
              time_limit_minutes: instData.time_limit_minutes || 15,
              passing_score: instData.passing_score || 70,
              questions_count: normQuestions.length,
              questions: normQuestions as any,
            });
            if (instData.time_limit_minutes > 0) {
              setTimeLeft(instData.time_limit_minutes * 60);
            }
            setLoading(false);
            return;
          }
        } catch (e) {}
      }

      // 3. Fallback: No quiz data available from any source
      setQuizData(null as any);
      setError("Bài kiểm tra chưa có câu hỏi. Vui lòng liên hệ giảng viên để cập nhật nội dung.");
      setLoading(false);
    };

    loadQuizData();
  }, [lesson, normalizeQuestions]);

  const handleFinishQuiz = useCallback(async (currentAnswers: Record<string, string>) => {
    if (!quizData) return;
    setSubmittingFinal(true);
    if (timerRef.current) clearInterval(timerRef.current);
    try {
      const timeTaken = quizData.time_limit_minutes > 0 && timeLeft !== null 
        ? (quizData.time_limit_minutes * 60) - timeLeft 
        : 60;
      const res = await submitQuiz(lesson.id, currentAnswers, timeTaken);
      setQuizResult(res);
      setPhase('result');

      // Save result to localStorage for persistence upon page refresh (F5)
      if (typeof window !== "undefined") {
        window.localStorage.setItem(`student_quiz_result_${lesson.id}`, JSON.stringify(res));
      }

      // Báo hiệu hoàn thành để Component cha cập nhật Progress / Sidebar
      if (res.passed) {
        onComplete();
      }
    } catch (err) {
      setError("Lỗi khi nộp bài. Vui lòng tải lại trang.");
    }
    setSubmittingFinal(false);
  }, [quizData, lesson.id, timeLeft, onComplete]);

 // Timer
 useEffect(() => {
 if (timeLeft === null || phase !== 'quiz') return;
 if (timeLeft <= 0 && !submittingFinal) {
 // Time's up — force finish
 handleFinishQuiz(allAnswers);
 return;
 }
 timerRef.current = setInterval(() => {
 setTimeLeft((prev) => {
 if (prev === null) return null;
 if (prev <= 1) {
 clearInterval(timerRef.current!);
 if (!submittingFinal) handleFinishQuiz(allAnswers);
 return 0;
 }
 return prev - 1;
 });
 }, 1000);
 return () => { if (timerRef.current) clearInterval(timerRef.current); };
 }, [timeLeft, phase, submittingFinal, handleFinishQuiz, allAnswers]);

 // Auto-completion effect for result phase (Top Level Hook)
 useEffect(() => {
 if (phase === 'result' && quizResult) {
 const passed = quizResult.passed;
 if (passed && !hasCompletedRef.current) {
 hasCompletedRef.current = true;
 onComplete();
 }
 }
 }, [phase, quizResult, onComplete]);

  const handleAnswer = async () => {
    if (!quizData || answered) return;
    const currentQ = quizData.questions[currentIndex] as any;
    const isEssayQ = currentQ?.type === "essay" || !currentQ?.answers || currentQ?.answers.length === 0;

    if (isEssayQ) {
      if (!essayText.trim()) return;
      setSubmitting(true);
      setAllAnswers((prev) => ({ ...prev, [currentQ.id]: essayText }));

      try {
        const res = await axiosClient.post("/api/student/quiz/grade-essay", {
          question_id: currentQ.id,
          question_content: currentQ.content,
          sample_answer: currentQ.sample_answer || "",
          rubric: currentQ.rubric || "",
          max_score: currentQ.points || 2.5,
          student_answer: essayText,
        });
        const evalData = res.data?.data || res.data;
        if (evalData) {
          setEssayResult((prev) => ({ ...prev, [currentQ.id]: evalData }));
          if (evalData.score >= (currentQ.points || 2.5) * 0.7) {
            setCorrectCount((c) => c + 1);
          }
        }
      } catch (err) {
        console.warn("AI grading single essay fallback:", err);
      } finally {
        setAnswered(true);
        setAnswerResult(true);
        setSubmitting(false);
      }
      return;
    }

    if (!selectedAnswer) return;
    setSubmitting(true);

    let isCorrect = false;

    // Check locally if answers array has is_correct property
    if (Array.isArray(currentQ.answers) && currentQ.answers.length > 0) {
      const selectedAnsObj = currentQ.answers.find(
        (ans: any) => String(ans.id) === String(selectedAnswer)
      ) || currentQ.answers.find(
        (ans: any) => ans.content === selectedAnswer
      );

      if (selectedAnsObj && typeof selectedAnsObj.is_correct !== "undefined") {
        isCorrect = Boolean(selectedAnsObj.is_correct);
      } else {
        const correctIdx = typeof currentQ.correct_answer_index === "number" ? currentQ.correct_answer_index : 0;
        const selectedIdx = currentQ.answers.findIndex(
          (ans: any) => String(ans.id) === String(selectedAnswer)
        );
        isCorrect = selectedIdx >= 0 && selectedIdx === correctIdx;
      }
      setAnswered(true);
      setAnswerResult(isCorrect);
      if (isCorrect) setCorrectCount((c) => c + 1);
      setAllAnswers((prev) => ({ ...prev, [currentQ.id]: selectedAnswer }));
    } else {
      try {
        const result = await checkQuizAnswer(lesson.id, currentQ.id, selectedAnswer);
        isCorrect = Boolean(result.correct);
        setAnswered(true);
        setAnswerResult(isCorrect);
        if (isCorrect) setCorrectCount((c) => c + 1);
        setAllAnswers((prev) => ({ ...prev, [currentQ.id]: selectedAnswer }));
      } catch {
        const correctIdx = typeof currentQ.correct_answer_index === "number" ? currentQ.correct_answer_index : 0;
        const answersList = currentQ.options || [];
        const foundIdx = answersList.indexOf(selectedAnswer);
        isCorrect = foundIdx >= 0 && foundIdx === correctIdx;
        setAnswered(true);
        setAnswerResult(isCorrect);
        if (isCorrect) setCorrectCount((c) => c + 1);
        setAllAnswers((prev) => ({ ...prev, [currentQ.id]: selectedAnswer }));
      }
    }
    setSubmitting(false);
  };

  const handleNext = () => {
    if (!quizData) return;
    if (currentIndex < quizData.questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer("");
      setEssayText("");
      setAnswerResult(null);
      setAnswered(false);
    } else {
      handleFinishQuiz(allAnswers);
    }
  };

  const handleRetry = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(`student_quiz_result_${lesson.id}`);
    }
    setCurrentIndex(0);
    setSelectedAnswer("");
    setEssayText("");
    setAnswerResult(null);
    setAnswered(false);
    setCorrectCount(0);
    setAllAnswers({});
    setQuizResult(null);
    setPhase('quiz');
    hasCompletedRef.current = false;
    if (quizData && quizData.time_limit_minutes > 0) {
      setTimeLeft(quizData.time_limit_minutes * 60);
    }
  };

 if (loading) {
 return (
 <div className="w-full p-12 flex flex-col items-center justify-center bg-[#FEFCF9] rounded-2xl border border-[#E8E2D9]">
 <div className="w-10 h-10 border-3 border-[#C0392B] border-t-transparent rounded-full animate-spin" />
 <span className="text-sm text-[#8A8478] font-medium mt-3">Đang tải bài kiểm tra...</span>
 </div>
 );
 }

 if (error || !quizData || quizData.questions.length === 0) {
 return (
 <div className="w-full p-12 flex flex-col items-center justify-center text-gray-400 bg-[#FEFCF9] rounded-2xl border border-[#E8E2D9]">
 <></>
 <span className="text-sm font-medium mt-3">{error || "Bài kiểm tra chưa có câu hỏi."}</span>
 </div>
 );
 }

 // Result Phase
 if (submittingFinal) {
 return (
 <div className="w-full p-12 flex flex-col items-center justify-center bg-[#FEFCF9] rounded-2xl border border-[#E8E2D9]">
 <div className="w-10 h-10 border-3 border-[#C0392B] border-t-transparent rounded-full animate-spin" />
 <span className="text-sm text-[#8A8478] font-medium mt-3">Đang nộp bài...</span>
 </div>
 );
 }

  if (phase === 'result' && quizResult) {
    const passed = quizResult.passed;
    const scorePercent = quizResult.score;
    const totalQ = quizResult.total_questions;
    const actualCorrect = quizResult.correct_count;

    const score10 = typeof quizResult.score_10 === 'number' 
      ? quizResult.score_10 
      : (typeof quizResult.total_earned_points === 'number' 
          ? Number(quizResult.total_earned_points.toFixed(1)) 
          : Number(((scorePercent / 100) * 10).toFixed(1)));

    return (
      <div className="w-full bg-white rounded-2xl border border-[#E8E2D9] shadow-sm p-8 flex flex-col items-center gap-6">
        <div className={twMerge(
          "w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold",
          passed ? "bg-[#FAF7F2] text-[#065F46]" : "bg-[#FAF7F2] text-[#C0392B]"
        )}>
          {passed ? "🎉" : "⚠️"}
        </div>

        <h2 className="text-2xl font-bold text-[#2C3039]">
          {passed ? "Chúc mừng! Bạn đã vượt qua!" : "Chưa đạt yêu cầu"}
        </h2>

        <div className="text-center space-y-1">
          <p className="text-2xl font-extrabold text-[#2C3039]">
            {score10} / 10 điểm
          </p>
          <p className="text-xs font-semibold text-[#8A8478]">
            Tỷ lệ đạt: {scorePercent}% — Yêu cầu tối thiểu: {quizData?.passing_score}%
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">
            (Đã trả lời đúng {actualCorrect}/{totalQ} câu)
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-xs">
          <div className="w-full h-3 bg-[#F5F0E8] rounded-full overflow-hidden">
            <div
              className={twMerge(
                "h-full rounded-full transition-all duration-700",
                passed ? "bg-[#059669]" : "bg-[#DC2626]"
              )}
              style={{ width: `${scorePercent}%` }}
            />
          </div>
        </div>

 {passed ? (
 <div className="flex flex-col items-center gap-3">
 <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FAF7F2] text-[#065F46] font-semibold text-sm">
 HOÀN THÀNH
 </div>
 <button
 onClick={handleRetry}
 className="px-4 py-2 text-sm text-[#2C3039] hover:text-[#A93226] font-medium transition-colors cursor-pointer"
 >
 Làm lại để luyện tập
 </button>
 </div>
 ) : (
 <button
 onClick={handleRetry}
 className="px-6 py-3 rounded-xl bg-[#C0392B] hover:bg-[#A93226] text-white font-semibold text-sm transition-colors cursor-pointer shadow-sm"
 >
 Làm lại
 </button>
 )}
 </div>
 );
 }

// Quiz Phase — Show one question at a time
 const question = quizData.questions[currentIndex];
 const isLast = currentIndex === quizData.questions.length - 1;

 return (
 <div className="w-full bg-white rounded-2xl border border-[#E8E2D9] shadow-sm overflow-hidden">
 {/* Quiz Header */}
 <div className="flex items-center justify-between px-6 py-4 bg-[#FEFCF9] border-b border-[#E8E2D9]">
 <div className="flex items-center gap-3">
 <span className="text-sm font-bold text-[#2C3039]">{quizData.title}</span>
 <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#F5F0E8] text-[#2C3039]">
 Câu {currentIndex + 1}/{quizData.questions.length}
 </span>
 </div>
 {timeLeft !== null && (
 <span className={twMerge(
 "text-sm font-semibold px-3 py-1 rounded-full",
 timeLeft < 60 ? "bg-red-100 text-red-700 animate-pulse" : "bg-[#F5F0E8] text-[#4A4F5C]"
 )}>
 {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
 </span>
 )}
 </div>

 {/* Question */}
 <div className="p-6 sm:p-8">
  <h3 className="text-lg font-bold text-[#2C3039] mb-6 leading-relaxed">
  {question.content}
  </h3>

  {/* Answers - MCQ or Essay */}
  {((question as any).type === "essay" || !question.answers || question.answers.length === 0) ? (
  <div className="flex flex-col gap-3 mb-6">
  <label className="text-xs font-bold text-[#2C3039]">Câu trả lời tự luận của bạn:</label>
  <textarea
  value={essayText}
  onChange={(e) => setEssayText(e.target.value)}
  disabled={answered}
  rows={4}
  placeholder="Nhập nội dung bài làm tự luận của bạn..."
  className="w-full p-4 rounded-xl border border-[#E8E2D9] text-sm text-[#2C3039] focus:border-[#C0392B] focus:outline-none bg-white font-medium shadow-2xs"
  />

  {answered && (
  <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-indigo-100 flex flex-col gap-4 text-xs animate-fadeIn mt-2 shadow-2xs">
  {essayResult[question.id] ? (
  <div className="flex flex-col gap-3 p-4 rounded-xl bg-white border border-indigo-100 shadow-2xs">
    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
      <div className="flex items-center gap-2">
        <span className="text-base">🤖</span>
        <span className="font-extrabold text-indigo-900 text-sm">Kết quả đánh giá từ Gia sư AI (Gemini):</span>
      </div>
      <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs">
        🎯 Điểm: {essayResult[question.id].score} / {essayResult[question.id].max_score || (question as any).points || 2.5} điểm
      </div>
    </div>

    <p className="text-gray-800 font-medium text-xs leading-relaxed bg-indigo-50/50 p-3 rounded-lg border border-indigo-100/60">
      💬 <strong>Nhận xét AI:</strong> {essayResult[question.id].feedback}
    </p>

    {Array.isArray(essayResult[question.id].ai_analysis?.matched_points) && essayResult[question.id].ai_analysis.matched_points.length > 0 && (
      <div className="flex flex-col gap-1">
        <span className="font-bold text-emerald-800 text-[11px]">✅ Ý trả lời tốt:</span>
        <ul className="list-disc list-inside text-emerald-900 text-xs space-y-0.5 pl-1">
          {essayResult[question.id].ai_analysis.matched_points.map((pt: string, pIdx: number) => (
            <li key={pIdx}>{pt}</li>
          ))}
        </ul>
      </div>
    )}

    {Array.isArray(essayResult[question.id].ai_analysis?.missing_points) && essayResult[question.id].ai_analysis.missing_points.length > 0 && (
      <div className="flex flex-col gap-1">
        <span className="font-bold text-amber-800 text-[11px]">⚠️ Cần bổ sung / hoàn thiện:</span>
        <ul className="list-disc list-inside text-amber-900 text-xs space-y-0.5 pl-1">
          {essayResult[question.id].ai_analysis.missing_points.map((pt: string, pIdx: number) => (
            <li key={pIdx}>{pt}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
  ) : (
  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs font-bold flex items-center justify-between">
    <span>✅ Đã nộp bài tự luận - Thang điểm: <strong>{(question as any).points || 2.5} điểm</strong></span>
    <span className="px-2.5 py-0.5 rounded bg-emerald-600 text-white text-[10px] uppercase font-black">Đã ghi nhận</span>
  </div>
  )}

  <div className="flex flex-col gap-1.5">
    <span className="text-indigo-900 font-extrabold text-xs">💡 Đáp án tham khảo mẫu từ Giảng viên:</span>
    <p className="text-gray-800 font-medium leading-relaxed whitespace-pre-line bg-white p-4 rounded-xl border border-indigo-50 shadow-2xs">
      {(question as any).sample_answer || "Yêu cầu học viên phân tích đầy đủ các luận điểm chính trong bài học."}
    </p>
  </div>

  {(question as any).rubric && (
  <div className="flex flex-col gap-1.5 pt-2 border-t border-indigo-100">
  <span className="font-extrabold text-amber-900 text-xs">📋 Thang điểm & Rubric chấm điểm:</span>
  <p className="text-amber-950 font-medium leading-relaxed whitespace-pre-line bg-amber-50/60 p-3.5 rounded-xl border border-amber-200/60">
    {(question as any).rubric}
  </p>
  </div>
  )}
  </div>
  )}
  </div>
  ) : (
  <div className="flex flex-col gap-3 mb-6">
  {question.answers.map((ans: any, idx: number) => {
  const letter = String.fromCharCode(65 + idx);
  const isSelected = selectedAnswer === ans.id;
  let ansStyle = "bg-white border-[#E8E2D9] hover:border-[#A5B4FC] hover:bg-[#FEFCF9]";

  if (answered && isSelected) {
  ansStyle = answerResult
  ? "bg-[#FAF7F2] border-[#34D399] text-[#065F46]"
  : "bg-[#FAF7F2] border-[#F87171] text-[#991B1B]";
  } else if (isSelected) {
  ansStyle = "bg-[#F5F0E8] border-[#C0392B]";
  }

  return (
  <button
  key={ans.id || idx}
  onClick={() => !answered && setSelectedAnswer(ans.id)}
  disabled={answered}
  className={twMerge(
  "flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left cursor-pointer",
  ansStyle,
  answered && !isSelected && "opacity-60"
  )}
  >
  <span className={twMerge(
  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 border-2",
  isSelected && !answered ? "bg-[#C0392B] text-white border-[#C0392B]" :
  answered && isSelected && answerResult ? "bg-[#059669] text-white border-[#059669]" :
  answered && isSelected && !answerResult ? "bg-[#DC2626] text-white border-[#DC2626]" :
  "bg-[#F5F0E8] text-[#8A8478] border-[#E8E2D9]"
  )}>
  {letter}
  </span>
  <span className="text-[15px] font-medium">{ans.content}</span>
  </button>
  );
  })}
  </div>
  )}

  {/* Answer feedback */}
  {answered && !((question as any).type === "essay" || !question.answers || question.answers.length === 0) && (
  <div className={twMerge(
  "p-4 rounded-xl mb-4 text-sm font-semibold",
  answerResult ? "bg-[#FAF7F2] text-[#065F46]" : "bg-[#FAF7F2] text-[#991B1B]"
  )}>
  {answerResult ? " Chính xác!" : " Chưa đúng. Hãy cố gắng ở câu tiếp theo!"}
  </div>
  )}

  {/* Action buttons */}
 <div className="flex justify-end gap-3">
 {!answered ? (
  <button
  onClick={handleAnswer}
  disabled={
    ((question as any).type === "essay" || !question.answers || question.answers.length === 0)
      ? (!essayText.trim() || submitting)
      : (!selectedAnswer || submitting)
  }
  className="px-6 py-2.5 rounded-xl bg-[#C0392B] hover:bg-[#A93226] text-white font-semibold text-sm transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-sm flex items-center gap-2"
  >
  {submitting ? (
    ((question as any).type === "essay" || !question.answers || question.answers.length === 0)
      ? "🤖 Gia sư AI đang chấm điểm..."
      : "Đang kiểm tra..."
  ) : "Trả lời"}
  </button>
 ) : (
 <button
 onClick={handleNext}
 className="px-6 py-2.5 rounded-xl bg-[#C0392B] hover:bg-[#A93226] text-white font-semibold text-sm transition-colors cursor-pointer shadow-sm flex items-center gap-2"
 >
 {isLast ? "Hoàn thành" : "Câu tiếp theo"}
 <></>
 </button>
 )}
 </div>
 </div>
 </div>
 );
}

// ─── Inner Workspace Content ─────────────────────────────────────────────────
function LessonWorkspaceContent() {
  const searchParams = useSearchParams();
  const courseIdParam = searchParams ? (searchParams.get("courseId") || searchParams.get("course_id")) : null;
  const initialLessonParam = searchParams ? (searchParams.get("lessonId") || searchParams.get("lesson_id")) : null;
  const isPreview = searchParams ? searchParams.get("preview") === "true" : false;

  const parsedCourseId = courseIdParam ? Number(courseIdParam) : 0;
  const { data: apiDetail, isLoading, error } = useGetCourseDetail(parsedCourseId);
  const { data: assessmentStatus } = useGetCourseAssessmentStatus(parsedCourseId);
  const invalidateCourseDetail = useInvalidateCourseDetail();

  const queryClient = useQueryClient();

  const [instructorModules, setInstructorModules] = useState<any[] | null>(null);

  useEffect(() => {
    if (isPreview) {
      axiosClient
        .get(`/api/instructor/courses/${parsedCourseId}/modules`)
        .then((res) => {
          if (res.data && (res.data.data || res.data)) {
            setInstructorModules(res.data.data || res.data);
          }
        })
        .catch((e) => {
          console.warn("Failed to fetch instructor preview modules:", e);
        });
    }
  }, [isPreview, parsedCourseId]);

  useEffect(() => {
    if (error && (error as any).response?.status === 403 && !isPreview) {
      window.location.href = `/courses/detail?courseId=${parsedCourseId}`;
    }
  }, [error, parsedCourseId, isPreview]);

  const [activeLessonId, setActiveLessonId] = useState<string>("");
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  // Compute curriculum directly from API response or instructor preview fallback
  const curriculum: ModuleData[] = React.useMemo(() => {
    const modulesSource = isPreview ? (instructorModules || apiDetail?.modules) : (apiDetail?.modules || instructorModules);
    if (!modulesSource || !Array.isArray(modulesSource)) return [];

    return modulesSource.map((mod: any) => ({
      id: String(mod.id),
      title: mod.title,
      subtitle: mod.duration || "",
      lessons: (mod.lessons || []).map((l: any) => ({
        id: String(l.id),
        title: l.title,
        type: l.type || 'video',
        duration: l.duration || "05:00",
        durationSeconds: l.duration_seconds || 300,
        completed: l.status === "completed",
        videoUrl: l.video_url || l.videoUrl || "",
        hasUploadedVideo: Boolean(l.has_uploaded_video || l.video_url || l.videoUrl),
        content: l.content || "",
        quiz_id: l.quiz_id || l.quizId || null,
        quizData: l.quizData || l.quiz || null,
        questions: l.questions || l.quiz_questions || null,
      })),
    }));
  }, [apiDetail, instructorModules]);

 const hasInitialized = useRef(false);
 useEffect(() => {
 if (curriculum.length > 0 && !hasInitialized.current) {
 const initialExpanded: Record<string, boolean> = {};
 curriculum.forEach((mod) => {
 initialExpanded[mod.id] = true;
 });
 setExpandedModules(initialExpanded);

 const allL = curriculum.flatMap((m) => m.lessons);
 if (initialLessonParam) {
 const match = allL.find((l) => l.id === initialLessonParam || l.id.endsWith(initialLessonParam));
 if (match) setActiveLessonId(match.id);
 } else {
 const firstIncomplete = allL.find((l) => !l.completed);
 setActiveLessonId(firstIncomplete ? firstIncomplete.id : allL[0]?.id || "");
 }
 hasInitialized.current = true;
 }
 }, [curriculum, initialLessonParam]);

 const allLessons = React.useMemo(() => curriculum.flatMap((m) => m.lessons), [curriculum]);

 const activeLesson: LessonData | undefined = React.useMemo(
 () => allLessons.find((l) => l.id === activeLessonId) || allLessons[0],
 [allLessons, activeLessonId]
 );

 // Tab & comment states
 const [activeTab, setActiveTab] = useState<"content" | "ai_tips" | "discussion">("content");
 const { data: apiDiscussions, isLoading: isDiscussionsLoading } = useGetDiscussions(activeLessonId);
 const { mutate: submitDiscussion, isPending: isSubmittingDiscussion } = useCreateDiscussion();
 const { mutate: updateDiscussion, isPending: isUpdatingDiscussion } = useUpdateDiscussion();
 const { mutate: deleteDiscussion, isPending: isDeletingDiscussion } = useDeleteDiscussion();
 const [newCommentText, setNewCommentText] = useState("");
 const [editingDiscussionId, setEditingDiscussionId] = useState<string | number | null>(null);
 const [editDiscussionText, setEditDiscussionText] = useState("");

 const toggleModule = (modId: string) => {
 setExpandedModules((prev) => ({ ...prev, [modId]: !prev[modId] }));
 };

 // Progress
 const totalLessonCount = allLessons.length;
 const completedCount = allLessons.filter((l) => l.completed).length;
 const computedProgressPercentage = Math.round((completedCount / (totalLessonCount || 1)) * 100);

 const handleSelectLesson = (lessonId: string) => {
 setActiveLessonId(lessonId);
 setActiveTab("content");
 };

 // Handle lesson completion
 const handleLessonComplete = useCallback(async () => {
 if (!activeLesson || activeLesson.completed) return;

 // Instant UI Update: Modify the TanStack Query Cache directly!
 queryClient.setQueryData(["student", "courses", "detail", String(parsedCourseId)], (oldData: CourseDetailData | undefined) => {
 if (!oldData) return oldData;
 return {
 ...oldData,
 modules: oldData.modules.map(mod => ({
 ...mod,
 lessons: mod.lessons.map(les => ({
 ...les,
 status: les.id.toString() === activeLesson.id ? 'completed' : les.status
 }))
 })),
 progress_card: oldData.progress_card ? {
 ...oldData.progress_card,
 progress_percentage: (typeof window !== 'undefined' && (window as any).isPreview) ? oldData.progress_card.progress_percentage : oldData.progress_card.progress_percentage, // Simplified placeholder for logic consistency
 completed_lessons_count: oldData.progress_card.completed_lessons_count,
 total_lessons_count: oldData.progress_card.total_lessons_count,
 } : undefined
 };
 });

 if (typeof window !== 'undefined' && (window as any).isPreview) {
 return;
 }

 const payload: { playback_position?: number; time_spent_seconds?: number } = {};
 if (activeLesson.type === 'video') {
 payload.playback_position = activeLesson.durationSeconds; // Video reached end
 } else if (activeLesson.type === 'article') {
 payload.time_spent_seconds = Math.ceil(activeLesson.durationSeconds * 1 / 3);
 }
 // For quiz, the backend auto-completes via quiz submit

 try {
 const response = await completeLesson(activeLesson.id, payload);

 // Instant UI Update: Modify the TanStack Query Cache directly!
 queryClient.setQueryData(["student", "courses", "detail", String(parsedCourseId)], (oldData: CourseDetailData | undefined) => {
 if (!oldData) return oldData;
 return {
 ...oldData,
 modules: oldData.modules.map(mod => ({
 ...mod,
 lessons: mod.lessons.map(les => ({
 ...les,
 status: les.id.toString() === activeLesson.id ? 'completed' : les.status
 }))
 })),
 progress_card: oldData.progress_card ? {
 ...oldData.progress_card,
 progress_percentage: response.progress_percentage,
 completed_lessons_count: response.completed_lessons_count,
 total_lessons_count: response.total_lessons_count,
 } : undefined
 };
 });

 // Background refetch to guarantee synchronization
 invalidateCourseDetail(parsedCourseId);
 } catch (err) {
 console.warn("Completion API error:", err);
 }
 }, [activeLesson, invalidateCourseDetail, parsedCourseId]);

 // Post comment
 const handlePostComment = (e: React.FormEvent) => {
 e.preventDefault();
 if (!newCommentText.trim() || isSubmittingDiscussion) return;
 submitDiscussion(
 { lessonId: activeLessonId, content: newCommentText.trim() },
 {
 onSuccess: () => {
 setNewCommentText("");
 }
 }
 );
 };

 const handleEditDiscussion = (discussionId: string | number, content: string) => {
 setEditingDiscussionId(discussionId);
 setEditDiscussionText(content);
 };

 const handleEditDiscussionSubmit = (e: React.FormEvent, discussionId: string | number) => {
 e.preventDefault();
 if (!editDiscussionText.trim()) return;

 updateDiscussion(
 { lessonId: activeLessonId, discussionId, content: editDiscussionText.trim() },
 {
 onSuccess: () => {
 setEditingDiscussionId(null);
 }
 }
 );
 };

 const handleDeleteDiscussion = (discussionId: string | number) => {
 if (!window.confirm("Bạn có chắc muốn xóa bình luận này?")) return;

 deleteDiscussion({
 lessonId: activeLessonId,
 discussionId,
 });
 };

 // Navigation
 const currentIndex = allLessons.findIndex((l) => l.id === activeLessonId);
 const hasPrevious = currentIndex > 0;
 const hasNext = currentIndex < allLessons.length - 1;

 const handleGoPrevious = () => {
 if (hasPrevious) handleSelectLesson(allLessons[currentIndex - 1].id);
 };
 const handleGoNext = () => {
 if (hasNext) handleSelectLesson(allLessons[currentIndex + 1].id);
 };

 if (!parsedCourseId || parsedCourseId <= 0) {
 return (
 <div className="w-full h-screen flex flex-col items-center justify-center bg-[#FEFCF9] p-6">
 <div className="bg-white p-8 rounded-3xl shadow-sm max-w-md w-full text-center border border-[#E8E2D9]">
 <h2 className="text-xl font-bold text-[#2C3039] mb-2">Không tìm thấy khóa học</h2>
 <p className="text-sm text-[#8A8478] mb-6">Vui lòng chọn một khóa học để bắt đầu học.</p>
 <a href="/courses" className="inline-flex items-center justify-center w-full px-5 py-3 rounded-xl bg-[#C0392B] hover:bg-[#A93226] text-white font-semibold transition-all shadow-sm">
 Xem danh sách khóa học
 </a>
 </div>
 </div>
 );
 }

 if (!activeLesson) {
 return <div className="p-12 text-center text-[#8A8478]">Không tìm thấy bài học nào cho khóa này.</div>;
 }

 // Course title from API
 const courseTitle = apiDetail?.header_info?.title || "Khóa học";

 // Render check for enrollment
 if (apiDetail && !apiDetail.header_info?.is_enrolled && !isPreview) {
 return (
 <div className="w-full h-screen flex flex-col items-center justify-center bg-[#FEFCF9] p-6">
 <div className="bg-white p-8 rounded-3xl shadow-sm max-w-md w-full text-center border border-[#E8E2D9]">
 
 <h2 className="text-xl font-bold text-[#2C3039] mb-2">Bạn chưa đăng ký khóa học này</h2>
 <p className="text-sm text-[#8A8478] mb-6">Hãy đăng ký khóa học để bắt đầu học và trải nghiệm toàn bộ nội dung.</p>
 <Link
 href={`/courses/detail?courseId=${parsedCourseId}`}
 className="inline-flex items-center justify-center w-full px-5 py-3 rounded-xl bg-[#C0392B] hover:bg-[#A93226] text-white font-semibold transition-all shadow-sm"
 >
 Xem khóa học
 </Link>
 </div>
 </div>
 );
 }

 return (
    <div className="flex flex-col min-h-screen bg-white pb-24 relative">
      {/* ─── Instructor Preview Mode Sticky Banner ─── */}
      {isPreview && (
        <div className="sticky top-0 z-50 bg-[#1E233E] text-white px-6 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md border-b border-indigo-900 animate-fadeIn">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded bg-[#C0392B] text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
              👁️ CHẾ ĐỘ XEM TRƯỚC
            </span>
            <span className="text-xs font-bold text-gray-200">
              🎓 Giao diện Học viên - Giảng viên trải nghiệm Video, Bài đọc &amp; Thi thử Quiz (Dữ liệu tiến độ &amp; bài thi không lưu vào hệ thống)
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined" && window.history.length > 1) {
                window.close();
              }
              window.location.href = `/instructor/courses/${parsedCourseId}/edit`;
            }}
            className="px-3.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs transition-all cursor-pointer border border-white/20 shrink-0 flex items-center gap-1.5 shadow-2xs"
          >
            <span>✕</span>
            <span>Thoát xem trước</span>
          </button>
        </div>
      )}

      {/* ─── Top Header & Breadcrumb ─── */}
      <header className="w-full bg-white border-b border-[#E8E2D9] px-6 py-4 sticky top-0 z-30 shadow-2xs">
 <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
 <div className="flex items-center gap-3 min-w-0">
 <Link
 href={`/courses/detail?courseId=${parsedCourseId}`}
 className="w-9 h-9 rounded-xl bg-white border border-[#E8E2D9] hover:bg-[#FEFCF9] flex items-center justify-center text-[#4A4F5C] hover:text-[#2C3039] transition-colors shrink-0 text-decoration-none shadow-2xs"
 title="Quay lại chi tiết Khóa học"
 >
 <></>
 </Link>
 <div className="min-w-0">
 <nav className="flex items-center gap-2 text-[13px] font-medium text-[#8A8478] mb-0.5 truncate">
 <Link href="/courses" className="hover:text-[#2C3039] transition-colors text-decoration-none">Khoá học</Link>
 <></>
 <span className="text-[#2C3039] font-semibold truncate">{courseTitle}</span>
 </nav>
 <h1 className="text-base sm:text-lg font-bold text-[#2C3039] truncate">{activeLesson.title}</h1>
 </div>
 </div>

 <div className="flex items-center gap-3 shrink-0">
 <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#F5F0E8] text-[#2C3039]">
 <span className="w-2 h-2 rounded-full bg-[#C0392B]" />
 <span>Tiến độ: {computedProgressPercentage}% ({completedCount}/{totalLessonCount} bài)</span>
 </div>
 </div>
 </div>
 </header>

 {/* ─── Main Content Grid ─── */}
 <div className="max-w-[1400px] w-full mx-auto p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

 {/* ─── Left Column (8 cols): Lesson Content ─── */}
 <main className="lg:col-span-8 flex flex-col gap-6 w-full min-w-0">

 {/* AI Notice */}
 <div className="w-full p-4 rounded-xl bg-[#F5F0E8] border border-[#C7D2FE] flex items-center justify-between gap-3 text-[#1E1B4B]">
 <div className="flex items-center gap-2.5 min-w-0">
 <span className="w-2 h-2 rounded-full bg-[#C0392B] shrink-0" />
 <span className="text-[#2C3039] font-bold text-xs sm:text-sm shrink-0">Gia sư AI Nova:</span>
 <span className="text-xs sm:text-sm text-[#4A4F5C] truncate">
 {activeLesson.type === 'video' ? "Video bài giảng nhúng trực tiếp. Hãy theo dõi thực hành mã nguồn ở các thẻ Tab phía dưới!" :
 activeLesson.type === 'article' ? "Đọc kỹ nội dung bài học. Thời gian đọc sẽ được ghi nhận tự động." :
 "Hãy hoàn thành bài kiểm tra để đánh giá kiến thức của bạn!"}
 </span>
 </div>
 <span className="hidden sm:inline-block px-2.5 py-1 rounded text-[10px] font-bold bg-[#C0392B] text-white tracking-wider uppercase shrink-0">
 {activeLesson.type === 'video' ? '4K STREAM' : activeLesson.type === 'article' ? 'VĂN BẢN' : 'KIỂM TRA'}
 </span>
 </div>

 {/* ─── Content by Type ─── */}
 {activeLesson.type === 'video' && (
 <CustomVideoPlayer lesson={activeLesson} onComplete={handleLessonComplete} />
 )}

 {activeLesson.type === 'article' && (
 <ArticleRenderer lesson={activeLesson} onComplete={handleLessonComplete} />
 )}

 {(activeLesson.type === 'quiz_module' || activeLesson.type === 'quiz') && (
 <QuizRenderer lesson={activeLesson} onComplete={handleLessonComplete} />
 )}

 {/* Fallback for unknown type — show as video */}
 {!['video', 'article', 'quiz_module', 'quiz'].includes(activeLesson.type) && (
 <CustomVideoPlayer lesson={activeLesson} onComplete={handleLessonComplete} />
 )}

 {/* ─── Tabs: Content Info / AI / Discussion ─── */}
 <div className="bg-white rounded-2xl border border-[#E8E2D9] shadow-sm overflow-hidden">
 <div className="flex items-center border-b border-[#E8E2D9] px-6 gap-6 bg-white overflow-x-auto">
 <button
 onClick={() => setActiveTab("content")}
 className={twMerge(
 "py-3.5 font-semibold text-xs sm:text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 focus:outline-none",
 activeTab === "content" ? "border-[#C0392B] text-[#2C3039]" : "border-transparent text-[#8A8478] hover:text-[#2C3039]"
 )}
 >
 <span>Nội dung & Mã nguồn</span>
 </button>
 <button
 onClick={() => setActiveTab("ai_tips")}
 className={twMerge(
 "py-3.5 font-semibold text-xs sm:text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 focus:outline-none",
 activeTab === "ai_tips" ? "border-[#C0392B] text-[#2C3039]" : "border-transparent text-[#8A8478] hover:text-[#2C3039]"
 )}
 >
 <span>Cố vấn AI Nova</span>
 <span className="px-2 py-0.5 rounded-full bg-[#F5F0E8] text-[#2C3039] text-[10px] font-bold">0</span>
 </button>
 <button
 onClick={() => setActiveTab("discussion")}
 className={twMerge(
 "py-3.5 font-semibold text-xs sm:text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 focus:outline-none",
 activeTab === "discussion" ? "border-[#C0392B] text-[#2C3039]" : "border-transparent text-[#8A8478] hover:text-[#2C3039]"
 )}
 >
 <span>Thảo luận & Ghi chú</span>
 <span className="px-2 py-0.5 rounded-full bg-[#F5F0E8] text-[#4A4F5C] text-[10px] font-bold">{apiDiscussions?.length || 0}</span>
 </button>
 </div>

 <div className="p-6 sm:p-8">
 {/* Tab 1: Content Info */}
 {activeTab === "content" && (
 <div className="flex flex-col gap-6">
 <div className="flex flex-wrap items-center gap-2">
 <span className={twMerge("inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold", getLessonTypeColor(activeLesson.type))}>
 {getLessonTypeLabel(activeLesson.type)}
 </span>
 <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F5F0E8] text-[#4A4F5C]">
 <span>Thời lượng:</span> {activeLesson.duration}
 </span>
 {activeLesson.completed ? (
 <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#FAF7F2] text-[#065F46]">
 HOÀN THÀNH
 </span>
 ) : (
 <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#F5F0E8] text-[#2C3039]">
 Đang học
 </span>
 )}
 </div>
 </div>
 )}

 {/* Tab 2: AI Tips */}
 {activeTab === "ai_tips" && (
 <div className="flex flex-col gap-5">
 <div className="p-4 rounded-xl bg-[#FEFCF9] border border-[#E8E2D9] flex items-center gap-4">
 <span className="text-2xl"></span>
 <div>
 <h3 className="font-bold text-[#2C3039] text-sm sm:text-base">Phân tích chuyên sâu từ MindNova Co-Pilot</h3>
 <p className="text-xs sm:text-sm text-[#8A8478]">Các lưu ý chuyên môn được đúc kết từ thực tiễn.</p>
 </div>
 </div>
 </div>
 )}

 {/* Tab 3: Discussion */}
 {activeTab === "discussion" && (
 <div className="flex flex-col gap-6">
 <form onSubmit={handlePostComment} className="flex flex-col gap-3 p-5 rounded-xl bg-[#FEFCF9] border border-[#E8E2D9]">
 <h4 className="font-semibold text-sm text-[#2C3039]">Gửi câu hỏi cho Gia sư AI hoặc thảo luận cùng lớp học</h4>
 <textarea
 rows={3}
 value={newCommentText}
 onChange={(e) => setNewCommentText(e.target.value)}
 placeholder="Nhập câu hỏi hoặc ghi chú học tập cá nhân..."
 className="w-full p-3.5 rounded-xl border border-[#E8E2D9] bg-white text-[#2C3039] text-sm placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#C0392B] focus:ring-2 focus:ring-[#C0392B]/20 transition-all resize-none"
 />
 <div className="flex justify-end">
 <button disabled={isSubmittingDiscussion} type="submit" className="px-5 py-2.5 rounded-xl bg-[#C0392B] hover:bg-[#A93226] text-white text-xs sm:text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer shadow-sm">
 {isSubmittingDiscussion ? "Đang gửi..." : "Gửi thảo luận"}
 </button>
 </div>
 </form>

 <div className="flex flex-col gap-4">
 {isDiscussionsLoading ? (
 <div className="p-8 text-center text-[#8A8478]">Đang tải thảo luận...</div>
 ) : apiDiscussions?.length === 0 ? (
 <div className="p-8 text-center text-[#8A8478]">Chưa có thảo luận nào cho bài học này.</div>
 ) : (
 apiDiscussions?.map((item) => (
 <div key={item.id} className="flex flex-col gap-3">
 {/* Student Question */}
 {editingDiscussionId === item.id ? (
 <form onSubmit={(e) => handleEditDiscussionSubmit(e, item.id)} className="p-4 sm:p-5 rounded-xl border border-[#E8E2D9] bg-white flex flex-col gap-3">
 <textarea
 value={editDiscussionText}
 onChange={(e) => setEditDiscussionText(e.target.value)}
 rows={3}
 className="w-full resize-none rounded-xl border border-[#D8DCEB] bg-white px-4 py-3 text-sm text-[#2C3039] outline-none focus:border-[#C0392B]"
 />
 <div className="flex justify-end gap-2">
 <button
 type="button"
 onClick={() => setEditingDiscussionId(null)}
 className="rounded-xl border border-[#E8E2D9] px-4 py-2 text-xs font-semibold text-[#8A8478] hover:bg-[#FEFCF9]"
 >
 Hủy
 </button>
 <button
 type="submit"
 disabled={isUpdatingDiscussion}
 className="rounded-xl bg-[#C0392B] px-4 py-2 text-xs font-semibold text-white hover:bg-[#A93226] disabled:opacity-60"
 >
 {isUpdatingDiscussion ? "Đang lưu..." : "Lưu"}
 </button>
 </div>
 </form>
 ) : (
 <div className="p-4 sm:p-5 rounded-xl border transition-all flex items-start gap-3.5 bg-white border-[#E8E2D9]">
 <div className="w-10 h-10 rounded-full flex items-center justify-center -[#FAF7F2] -[#C0392B] font-bold shrink-0 border -[#FAF7F2]">
 {item.student.name.slice(0, 2).toUpperCase()}
 </div>
 <div className="flex-1 min-w-0">
 <div className="flex items-center justify-between gap-2 mb-1">
 <span className="font-bold text-sm text-[#2C3039]">{item.student.name}</span>
 <div className="flex items-center gap-2">
 <span className="text-xs text-[#8A8478]">{new Date(item.created_at).toLocaleString('vi-VN')}</span>
 <button
 onClick={() => handleEditDiscussion(item.id, item.content)}
 className="text-xs font-semibold text-[#2C3039] hover:text-[#A93226] transition-colors"
 >
 Sửa
 </button>
 <button
 onClick={() => handleDeleteDiscussion(item.id)}
 disabled={isDeletingDiscussion}
 className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors disabled:opacity-60"
 >
 Xóa
 </button>
 </div>
 </div>
 <p className="text-xs sm:text-sm text-[#4A4F5C] leading-relaxed">{item.content}</p>
 </div>
 </div>
 )}
 
 {/* Teacher Replies */}
 {item.replies.map((reply) => (
 <div key={reply.id} className="ml-8 p-4 sm:p-5 rounded-xl border transition-all flex items-start gap-3.5 bg-[#F5F0E8]/50 border-[#C7D2FE]">
 <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#C0392B] text-white font-bold shrink-0 border border-[#C7D2FE]">
 GV
 </div>
 <div className="flex-1 min-w-0">
 <div className="flex items-center justify-between gap-2 mb-1">
 <span className="font-bold text-sm text-[#2C3039] flex items-center gap-1.5">
 <span>{reply.user.name}</span>
 <VerifiedTeacherBadge isVerified={(reply.user as any).is_verified ?? true} size="xs" />
 <span className="px-2 py-0.5 rounded text-[10px] font-bold text-white bg-[#C0392B] uppercase tracking-wider">Giảng viên</span>
 </span>
 <span className="text-xs text-[#8A8478]">{new Date(reply.created_at).toLocaleString('vi-VN')}</span>
 </div>
 <p className="text-xs sm:text-sm text-[#4A4F5C] leading-relaxed">{reply.content}</p>
 </div>
 </div>
 ))}
 </div>
 ))
 )}
 </div>
 </div>
 )}
 </div>
 </div>
 </main>

 {/* ─── Right Column (4 cols): Sidebar ─── */}
 <aside className="lg:col-span-4 w-full flex flex-col gap-5 sticky top-24 max-h-[calc(100vh-100px)] overflow-y-auto pr-1">

 {/* Progress Header */}
 <div className="bg-white rounded-2xl border border-[#E8E2D9] shadow-sm p-5 flex flex-col gap-3.5 shrink-0">
 <div className="flex items-center justify-between">
 <div>
 <h2 className="text-[17px] font-extrabold text-[#2C3039] flex items-center gap-2">
 <span>Lộ trình Học tập</span>
 </h2>
 <p className="text-[12px] font-medium text-[#8A8478] mt-0.5">Tiến trình hoàn thành toàn khóa</p>
 </div>
 <span className="text-xs font-bold text-[#2C3039] bg-[#F5F0E8] border border-[#C7D2FE]/60 px-3 py-1.5 rounded-full shrink-0 shadow-2xs">
 {completedCount}/{totalLessonCount} Bài học
 </span>
 </div>
 <div className="w-full h-2.5 bg-[#F5F0E8] rounded-full overflow-hidden p-0.5 border border-[#E8E2D9]">
 <div className="h-full bg-[#C0392B] rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(79,70,229,0.35)]" style={{ width: `${computedProgressPercentage}%` }} />
 </div>
 </div>

 {/* Module Accordion */}
 <div className="flex flex-col gap-4">
 {curriculum.map((mod, moduleIndex) => {
 const isExpanded = expandedModules[mod.id] ?? true;
 const modCompletedCount = mod.lessons.filter((l) => l.completed).length;
 const isModuleCompleted = mod.lessons.length > 0 && modCompletedCount === mod.lessons.length;
 const isModuleCurrent = mod.lessons.some((l) => l.id === activeLessonId);

 return (
 <div
 key={mod.id}
 className={twMerge(
 "rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm",
 isModuleCurrent ? "bg-[#F8FAFC] border-[#A5B4FC]" : "bg-white border-[#E8E2D9]"
 )}
 >
 {/* Module Header */}
 <div
 onClick={() => toggleModule(mod.id)}
 className="flex items-start justify-between p-4.5 cursor-pointer hover:bg-[#FEFCF9]/70 transition-colors group select-none"
 >
 <div className="flex items-start gap-3.5 min-w-0 pr-2">
 <div className={twMerge(
 "w-8 h-8 rounded-full flex items-center justify-center font-bold text-[13px] shrink-0 mt-0.5 transition-all shadow-2xs",
 isModuleCompleted ? "bg-[#C0392B] text-white" :
 isModuleCurrent ? "bg-white border-2 border-[#C0392B] text-[#2C3039]" :
 "bg-gray-100 text-[#8A8478]"
 )}>
 {isModuleCompleted ? "" : moduleIndex + 1}
 </div>
 <div className="min-w-0 flex-1">
 <p className="text-[11px] font-bold uppercase tracking-wider text-[#2C3039] truncate">{mod.title}</p>
 <h3 className="text-[15px] font-bold text-[#2C3039] mt-1 leading-snug">Nhiều bài học</h3>
 <div className="flex items-center gap-2 mt-2">
 <span className="text-[12px] font-semibold text-[#8A8478]">
 {modCompletedCount}/{mod.lessons.length} bài đã học
 </span>
 {isModuleCurrent && <span className="w-1.5 h-1.5 rounded-full bg-[#C0392B]" />}
 </div>
 </div>
 </div>
 <button className="text-[#9CA3AF] group-hover:text-[#2C3039] transition-colors p-1 shrink-0">
 ↕
 </button>
 </div>

 {/* Lessons */}
 {isExpanded && (
 <div className="flex flex-col border-t border-[#E8E2D9] pt-2.5 pb-3 px-3 gap-2 bg-white/60">
 {mod.lessons.map((lesson) => {
 const isCurrent = lesson.id === activeLessonId;
 const isCompleted = lesson.completed;

 return (
 <div
 key={lesson.id}
 onClick={() => handleSelectLesson(lesson.id)}
 className={twMerge(
 "flex items-center justify-between py-3 px-3.5 rounded-xl relative cursor-pointer transition-all duration-150 border",
 isCurrent ? "bg-[#F5F0E8] border-[#A5B4FC] shadow-xs" : "bg-white border-[#E8E2D9]/60 hover:border-[#E8E2D9] hover:bg-[#FEFCF9]"
 )}
 >
 {isCurrent && <div className="absolute left-0 top-2 bottom-2 w-[3.5px] bg-[#C0392B] rounded-r-full" />}

 <div className="flex items-center gap-3 min-w-0 pr-2">
 <div className={twMerge(
 "w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all",
 isCompleted ? "bg-[#C0392B] text-white shadow-2xs" :
 isCurrent ? "bg-white border-2 border-[#C0392B] text-[#2C3039]" :
 "border-2 border-gray-300 text-transparent bg-[#FEFCF9]"
 )}>
 {isCompleted ? "" : isCurrent ? "▶" : <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />}
 </div>

 <div className="min-w-0 flex-1">
 <h4 className={twMerge(
 "text-[13.5px] sm:text-[14px] leading-snug truncate",
 isCurrent ? "text-[#2C3039] font-extrabold" : "text-[#2C3039] font-bold"
 )}>
 {lesson.title}
 </h4>
 <div className="flex items-center gap-2 mt-1 flex-wrap">
 {/* Lesson Type Label */}
 <span className={twMerge(
 "inline-flex items-center px-1.5 py-0.5 rounded text-[9.5px] font-bold",
 getLessonTypeColor(lesson.type)
 )}>
 {getLessonTypeLabel(lesson.type)}
 </span>
 <span className="text-[11px] font-medium text-[#8A8478]"> {lesson.duration}</span>
 {/* Status Badge */}
 {isCurrent && !isCompleted && (
 <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9.5px] font-black text-[#2C3039] bg-white border border-[#A5B4FC] uppercase tracking-wider shadow-2xs">
 <span className="w-1.5 h-1.5 rounded-full bg-[#2C3039] animate-pulse" />
 ĐANG HỌC
 </span>
 )}
 {isCompleted && (
 <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9.5px] font-black text-[#2C3039] bg-[#FAF7F2] border border-[#6EE7B7] uppercase tracking-wider">
 HOÀN THÀNH
 </span>
 )}
 </div>
 </div>
 </div>

 <div className="shrink-0 text-[#9CA3AF]">
 {isCurrent ? (
 <span className="w-2.5 h-2.5 rounded-full bg-[#C0392B] inline-block animate-ping" />
 ) : (
 <></>
 )}
 </div>
 </div>
 );
 })}
 </div>
 )}
 </div>
 );
 })}
 </div>
 </aside>
 </div>

 {/* ─── Sticky Bottom Toolbar ─── */}
 <footer className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#E8E2D9] px-6 py-3.5 z-40 shadow-sm">
 <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-4">
 <button
 onClick={handleGoPrevious}
 disabled={!hasPrevious}
 className="flex items-center gap-2 px-5 py-2 rounded-xl border border-[#E8E2D9] bg-white hover:bg-[#FEFCF9] text-[#4A4F5C] font-semibold text-xs sm:text-sm transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-sm"
 >
 <></>
 <span>Bài trước</span>
 </button>

 {/* Completion status indicator — no manual "Mark Complete" */}
 {activeLesson.completed ? (
 <div className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#FAF7F2] text-[#065F46] font-semibold text-xs sm:text-sm border border-[#6EE7B7]">
 <></>
 <span>Đã hoàn thành</span>
 </div>
 ) : (
 <div className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#F5F0E8] text-[#2C3039] font-semibold text-xs sm:text-sm border border-[#C7D2FE]">
 <span className="w-2 h-2 rounded-full bg-[#C0392B] animate-pulse" />
 <span>Đang học — hoàn thành tự động</span>
 </div>
 )}

 <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
  {/* General Quiz Button */}
  <button
    type="button"
    onClick={() => {
      if (assessmentStatus?.general_quiz?.is_setup) {
        window.location.href = `/practice/quiz/question?courseId=${parsedCourseId}&quizType=general&quizId=${assessmentStatus.general_quiz.quiz_id}`;
      } else if (isPreview) {
        alert("Khóa học này chưa có bài kiểm tra tổng quát.");
      } else {
        alert("Bài kiểm tra tổng quát hiện chưa được giáo viên thiết lập cho khóa học này.");
      }
    }}
    className="flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold text-[#2C3039] bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-all cursor-pointer shadow-2xs"
    title={assessmentStatus?.general_quiz?.is_setup ? "Bắt đầu làm bài kiểm tra tổng quát" : "Chưa thiết lập đề thi tổng quát"}
  >
    <span>📝 Kiểm tra tổng quát</span>
    {assessmentStatus?.general_quiz?.is_passed && (
      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded-md">✓ Đã đạt</span>
    )}
  </button>

  {/* Final Quiz Button (🏁 Làm bài kiểm tra cuối khóa) */}
  {(() => {
    const isUnlocked = assessmentStatus?.can_take_final_quiz === true;
    const lockReason = assessmentStatus?.final_quiz_lock_reason || "🔒 Hoàn thành 100% khóa học & qua bài kiểm tra tổng quát";

    return (
      <div className="relative group">
        <button
          type="button"
          disabled={!isUnlocked}
          onClick={() => {
            if (isUnlocked && assessmentStatus?.final_quiz?.quiz_id) {
              window.location.href = `/practice/quiz/question?courseId=${parsedCourseId}&quizType=final&quizId=${assessmentStatus.final_quiz.quiz_id}`;
            } else {
              alert(lockReason);
            }
          }}
          className={twMerge(
            "flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-2xs",
            isUnlocked
              ? "bg-[#065F46] hover:bg-[#044E39] text-white border border-[#065F46] cursor-pointer"
              : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-60 pointer-events-none"
          )}
          title={lockReason}
        >
          <span>🏁 Làm bài kiểm tra cuối khóa</span>
          {isUnlocked ? (
            <span className="text-[10px] bg-emerald-300 text-emerald-950 font-black px-1.5 py-0.5 rounded-md uppercase">MỞ KHÓA</span>
          ) : (
            <span className="text-[10px] bg-gray-200 text-gray-600 font-bold px-1.5 py-0.5 rounded-md">ĐANG KHÓA</span>
          )}
        </button>
      </div>
    );
  })()}

  <button
    onClick={handleGoNext}
    disabled={!hasNext}
    className="flex items-center gap-2 px-6 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#C0392B] hover:bg-[#A93226] transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-sm"
  >
    <span>Bài tiếp theo</span>
  </button>
 </div>
 </div>
 </footer>
 </div>
 );
}

// ─── Exported Master Component ────────────────────────────────────────────────
export function LessonWorkspace() {
 return (
 <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center font-semibold text-[#8A8478]">Đang tải khoá học Trợ lý AI MindNova...</div>}>
 <LessonWorkspaceContent />
 </Suspense>
 );
}
