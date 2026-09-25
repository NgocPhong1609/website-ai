"use client";

import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { CheckCircle2, AlertTriangle, Lightbulb, Bot, Target, MessageSquare, ClipboardList, Eye, GraduationCap, X, FileEdit, Check, Lock, Flag, Trophy, PartyPopper, ChevronsUpDown, ArrowLeft, ChevronRight, BookOpen, Sparkles, Pencil, Trash2 } from "lucide-react";
import { Avatar } from "@/src/shared/components/ui/Avatar";
import { LessonStatusIcon, lessonDisplayTitle } from "../LessonStatusIcon";
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
import { NoDataAvailable } from "@/src/shared/components/ui";
import { quizGeneratorApi } from "@/src/features/instructor/quiz-generator/api/quizGeneratorApi";
import toast from "react-hot-toast";
import { LessonAttachments } from "@/src/features/instructor/lesson-management/components/LessonAttachments";
import type { LessonAttachment } from "@/src/features/instructor/lesson-management/api";

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
 attachments?: LessonAttachment[];
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
 case 'video': return 'bg-[#F1F5F9] text-[#0F172A]';
 case 'article': return 'bg-[#ECFDF5] text-[#0F172A]';
 case 'quiz_module': return 'bg-[#FFFBEB] text-[#F59E0B]';
 default: return 'bg-[#F1F5F9] text-[#64748B]';
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
 <div className="w-full p-12 flex flex-col items-center justify-center text-gray-400 bg-blue-50/50 rounded-xl border border-blue-100">
 <BookOpen size={28} strokeWidth={1.75} aria-hidden />
 <span className="text-sm font-medium mt-3">Nội dung bài học chưa được cập nhật.</span>
 </div>
 );
 }

 return (
 <div className="flex flex-col gap-4">
 {/* Reading progress bar */}
 {!completedRef.current && (
 <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/50 border border-blue-100">
 <BookOpen size={16} className="text-[#3B82F6] shrink-0" aria-hidden />
 <div className="flex-1">
 <div className="w-full h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
 <div
 className="h-full bg-[#3B82F6] rounded-full transition-all duration-1000"
 style={{ width: `${progressPercent}%` }}
 />
 </div>
 </div>
 <span className="text-[11px] font-semibold text-[#64748B] shrink-0">
 {Math.floor(timeSpent / 60)}:{String(timeSpent % 60).padStart(2, '0')} / {Math.floor(requiredTime / 60)}:{String(requiredTime % 60).padStart(2, '0')}
 </span>
 </div>
 )}

 {/* CKEditor HTML Content — Styled Container */}
 <div
 className="ck-content prose prose-sm sm:prose max-w-none
 bg-white rounded-xl border border-blue-100 p-6 sm:p-8 shadow-sm
 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-[#0F172A] [&_h1]:mb-4 [&_h1]:mt-6
 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[#0F172A] [&_h2]:mb-3 [&_h2]:mt-5
 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-[#0F172A] [&_h3]:mb-2 [&_h3]:mt-4
 [&_h4]:text-base [&_h4]:font-semibold [&_h4]:text-[#0F172A] [&_h4]:mb-2
 [&_p]:text-[15px] [&_p]:text-[#0F172A] [&_p]:leading-relaxed [&_p]:mb-4
 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:text-[#0F172A]
 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:text-[#0F172A]
 [&_li]:mb-1.5 [&_li]:text-[15px] [&_li]:leading-relaxed
 [&_a]:text-[#0F172A] [&_a]:underline [&_a]:hover:text-[#2563EB]
 [&_img]:rounded-xl [&_img]:shadow-sm [&_img]:my-4 [&_img]:max-w-full [&_img]:h-auto
 [&_blockquote]:border-l-4 [&_blockquote]:border-[#3B82F6] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-[#64748B] [&_blockquote]:my-4
 [&_table]:w-full [&_table]:border-collapse [&_table]:my-4
 [&_th]:bg-[#F1F5F9] [&_th]:border [&_th]:border-blue-100 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_th]:text-sm
 [&_td]:border [&_td]:border-blue-100 [&_td]:px-3 [&_td]:py-2 [&_td]:text-sm
 [&_pre]:bg-[#1F2937] [&_pre]:text-gray-200 [&_pre]:rounded-xl [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:my-4
 [&_code]:font-mono [&_code]:text-sm
 [&_hr]:border-blue-100 [&_hr]:my-6
 [&_figure]:my-4 [&_figure]:mx-auto
 [&_figcaption]:text-center [&_figcaption]:text-sm [&_figcaption]:text-[#64748B] [&_figcaption]:mt-2
 [&_strong]:font-bold [&_em]:italic
 [&_mark]:bg-yellow-200 [&_mark]:px-1 [&_mark]:rounded"
 dangerouslySetInnerHTML={{ __html: lesson.content }}
 />
 {lesson.attachments && lesson.attachments.length > 0 && (
   <LessonAttachments
     lessonId={lesson.id}
     initialAttachments={lesson.attachments}
     readOnly
     audience="student"
   />
 )}
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
 <div className="w-full p-12 flex flex-col items-center justify-center bg-blue-50/50 rounded-xl border border-blue-100">
 <div className="w-10 h-10 border-3 border-[#3B82F6] border-t-transparent rounded-full animate-spin" />
 <span className="text-sm text-[#64748B] font-medium mt-3">Đang tải bài kiểm tra...</span>
 </div>
 );
 }

 if (error || !quizData || quizData.questions.length === 0) {
 return (
 <div className="w-full p-12 flex flex-col items-center justify-center text-gray-400 bg-blue-50/50 rounded-xl border border-blue-100">
 <AlertTriangle size={28} strokeWidth={1.75} aria-hidden />
 <span className="text-sm font-medium mt-3">{error || "Bài kiểm tra chưa có câu hỏi."}</span>
 </div>
 );
 }

 // Result Phase
 if (submittingFinal) {
 return (
 <div className="w-full p-12 flex flex-col items-center justify-center bg-blue-50/50 rounded-xl border border-blue-100">
 <div className="w-10 h-10 border-3 border-[#3B82F6] border-t-transparent rounded-full animate-spin" />
 <span className="text-sm text-[#64748B] font-medium mt-3">Đang nộp bài...</span>
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
      <div className="w-full bg-white rounded-xl border border-blue-100 shadow-sm p-8 flex flex-col items-center gap-6">
        <div className={twMerge(
          "w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold",
          passed ? "bg-blue-50/50 text-[#065F46]" : "bg-blue-50/50 text-[#3B82F6]"
        )}>
          {passed ? <PartyPopper size={16} className="inline mr-1" /> : <AlertTriangle size={16} className="inline mr-1" />}
        </div>

        <h2 className="text-2xl font-bold text-[#0F172A]">
          {passed ? "Chúc mừng! Bạn đã vượt qua!" : "Chưa đạt yêu cầu"}
        </h2>

        <div className="text-center space-y-1">
          <p className="text-2xl font-semibold text-[#0F172A]">
            {score10} / 10 điểm
          </p>
          <p className="text-xs font-semibold text-[#64748B]">
            Tỷ lệ đạt: {scorePercent}% — Yêu cầu tối thiểu: {quizData?.passing_score}%
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">
            (Đã trả lời đúng {actualCorrect}/{totalQ} câu)
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-xs">
          <div className="w-full h-3 bg-[#F1F5F9] rounded-full overflow-hidden">
            <div
              className={twMerge(
                "h-full rounded-full transition-all duration-700",
                passed ? "bg-[#059669]" : "bg-[#2563EB]"
              )}
              style={{ width: `${scorePercent}%` }}
            />
          </div>
        </div>

 {passed ? (
 <div className="flex flex-col items-center gap-3">
 <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-50/50 text-[#065F46] font-semibold text-sm">
 HOÀN THÀNH
 </div>
 <button
 onClick={handleRetry}
 className="px-4 py-2 text-sm text-[#0F172A] hover:text-[#2563EB] font-medium transition-colors cursor-pointer"
 >
 Làm lại để luyện tập
 </button>
 </div>
 ) : (
 <button
 onClick={handleRetry}
 className="px-6 py-3 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold text-sm transition-colors cursor-pointer shadow-sm"
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
 <div className="w-full bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden">
 {/* Quiz Header */}
 <div className="flex items-center justify-between px-6 py-4 bg-blue-50/50 border-b border-blue-100">
 <div className="flex items-center gap-3">
 <span className="text-sm font-bold text-[#0F172A]">{quizData.title}</span>
 <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#F1F5F9] text-[#0F172A]">
 Câu {currentIndex + 1}/{quizData.questions.length}
 </span>
 </div>
 {timeLeft !== null && (
 <span className={twMerge(
 "text-sm font-semibold px-3 py-1 rounded-full",
 timeLeft < 60 ? "bg-[#EFF6FF] text-[#3B82F6] animate-pulse" : "bg-[#F1F5F9] text-[#64748B]"
 )}>
 {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
 </span>
 )}
 </div>

 {/* Question */}
 <div className="p-6 sm:p-8">
  <h3 className="text-lg font-bold text-[#0F172A] mb-6 leading-relaxed">
  {question.content}
  </h3>

  {/* Answers - MCQ or Essay */}
  {((question as any).type === "essay" || !question.answers || question.answers.length === 0) ? (
  <div className="flex flex-col gap-3 mb-6">
  <label className="text-xs font-bold text-[#0F172A]">Câu trả lời tự luận của bạn:</label>
  <textarea
  value={essayText}
  onChange={(e) => setEssayText(e.target.value)}
  disabled={answered}
  rows={4}
  placeholder="Nhập nội dung bài làm tự luận của bạn..."
  className="w-full p-4 rounded-xl border border-blue-100 text-sm text-[#0F172A] focus:border-[#3B82F6] focus:outline-none bg-white font-medium shadow-2xs"
  />

  {answered && (
  <div className="p-5 rounded-xl bg-blue-50/50 border border-blue-100 flex flex-col gap-4 text-xs animate-fadeIn mt-2 shadow-2xs">
  {essayResult[question.id] ? (
  <div className="flex flex-col gap-3 p-4 rounded-xl bg-white border border-blue-100 shadow-2xs">
    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
      <div className="flex items-center gap-2">
        <Bot size={16} className="text-[#2563EB]" />
        <span className="font-semibold text-[#0F172A] text-sm">Kết quả đánh giá từ Gia sư AI (Gemini):</span>
      </div>
      <div className="px-3 py-1 rounded-full bg-[#E8F8F0] text-[#27AE60] font-semibold text-xs">
        <Target size={14} className="inline mr-1 text-[#27AE60]" /> Điểm: {essayResult[question.id].score} / {essayResult[question.id].max_score || (question as any).points || 2.5} điểm
      </div>
    </div>

    <p className="text-[#64748B] font-medium text-xs leading-relaxed bg-[#F1F5F9]/50 p-3 rounded-lg border border-blue-100/60">
      <MessageSquare size={14} className="inline mr-1 text-[#0F172A]" /> <strong>Nhận xét AI:</strong> {essayResult[question.id].feedback}
    </p>

    {Array.isArray(essayResult[question.id].ai_analysis?.matched_points) && essayResult[question.id].ai_analysis.matched_points.length > 0 && (
      <div className="flex flex-col gap-1">
        <span className="font-bold text-[#27AE60] text-[11px]"><CheckCircle2 size={12} className="inline mr-1" /> Ý trả lời tốt:</span>
        <ul className="list-disc list-inside text-[#27AE60] text-xs space-y-0.5 pl-1">
          {essayResult[question.id].ai_analysis.matched_points.map((pt: string, pIdx: number) => (
            <li key={pIdx}>{pt}</li>
          ))}
        </ul>
      </div>
    )}

    {Array.isArray(essayResult[question.id].ai_analysis?.missing_points) && essayResult[question.id].ai_analysis.missing_points.length > 0 && (
      <div className="flex flex-col gap-1">
        <span className="font-bold text-[#3B82F6] text-[11px]"><AlertTriangle size={12} className="inline mr-1" /> Cần bổ sung / hoàn thiện:</span>
        <ul className="list-disc list-inside text-[#2563EB] text-xs space-y-0.5 pl-1">
          {essayResult[question.id].ai_analysis.missing_points.map((pt: string, pIdx: number) => (
            <li key={pIdx}>{pt}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
  ) : (
  <div className="p-3 rounded-xl bg-[#E8F8F0] border border-[#27AE60]/20 text-[#27AE60] text-xs font-bold flex items-center justify-between">
    <span><CheckCircle2 size={14} className="inline mr-1 text-[#27AE60]" /> Đã nộp bài tự luận - Thang điểm: <strong>{(question as any).points || 2.5} điểm</strong></span>
    <span className="px-2.5 py-0.5 rounded bg-[#27AE60] text-white text-[10px] uppercase font-bold">Đã ghi nhận</span>
  </div>
  )}

  <div className="flex flex-col gap-1.5">
    <span className="text-[#0F172A] font-semibold text-xs"><Lightbulb size={12} className="inline mr-1 text-[#D97706]" /> Đáp án tham khảo mẫu từ Giảng viên:</span>
    <p className="text-[#64748B] font-medium leading-relaxed whitespace-pre-line bg-white p-4 rounded-xl border border-blue-100 shadow-2xs">
      {(question as any).sample_answer || "Yêu cầu học viên phân tích đầy đủ các luận điểm chính trong bài học."}
    </p>
  </div>

  {(question as any).rubric && (
  <div className="flex flex-col gap-1.5 pt-2 border-t border-blue-100">
  <span className="font-semibold text-[#3B82F6] text-xs"><ClipboardList size={12} className="inline mr-1 text-[#3B82F6]" /> Thang điểm & Rubric chấm điểm:</span>
  <p className="text-[#2563EB] font-medium leading-relaxed whitespace-pre-line bg-[#EFF6FF]/60 p-3.5 rounded-xl border border-[#3B82F6]/20">
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
  let ansStyle = "bg-white border-blue-100 hover:border-[#2563EB] hover:bg-blue-50/50";

  if (answered && isSelected) {
  ansStyle = answerResult
  ? "bg-blue-50/50 border-[#34D399] text-[#065F46]"
  : "bg-blue-50/50 border-[#60A5FA] text-[#3B82F6]";
  } else if (isSelected) {
  ansStyle = "bg-[#F1F5F9] border-[#3B82F6]";
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
  isSelected && !answered ? "bg-[#3B82F6] text-white border-[#3B82F6]" :
  answered && isSelected && answerResult ? "bg-[#059669] text-white border-[#059669]" :
  answered && isSelected && !answerResult ? "bg-[#2563EB] text-white border-[#2563EB]" :
  "bg-[#F1F5F9] text-[#64748B] border-blue-100"
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
  answerResult ? "bg-blue-50/50 text-[#065F46]" : "bg-blue-50/50 text-[#3B82F6]"
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
  className="px-6 py-2.5 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold text-sm transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-sm flex items-center gap-2"
  >
  {submitting ? (
    ((question as any).type === "essay" || !question.answers || question.answers.length === 0)
      ? <span className="flex items-center gap-1.5"><Bot size={14} /> Gia sư AI đang chấm điểm...</span>
      : "Đang kiểm tra..."
  ) : "Trả lời"}
  </button>
 ) : (
 <button
 onClick={handleNext}
 className="px-6 py-2.5 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold text-sm transition-colors cursor-pointer shadow-sm flex items-center gap-2"
 >
 {isLast ? "Hoàn thành" : "Câu tiếp theo"}
 <ChevronRight size={16} aria-hidden />
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
        attachments: l.attachments || [],
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
 const [confirmDeleteId, setConfirmDeleteId] = useState<string | number | null>(null);

 const handlePostComment = (e: React.FormEvent) => {
 e.preventDefault();
 if (!newCommentText.trim() || isSubmittingDiscussion) return;
 submitDiscussion(
 { lessonId: activeLessonId, content: newCommentText.trim() },
 {
 onSuccess: () => {
 setNewCommentText("");
 toast.success("Gửi thảo luận thành công!");
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
 toast.success("Cập nhật thảo luận thành công!");
 }
 }
 );
 };

 const handleDeleteDiscussion = (discussionId: string | number) => {
 setConfirmDeleteId(discussionId);
 };

 const confirmDelete = () => {
 if (!confirmDeleteId) return;
 deleteDiscussion(
 { lessonId: activeLessonId, discussionId: confirmDeleteId },
 { onSuccess: () => { toast.success("Xóa thảo luận thành công!"); } }
 );
 setConfirmDeleteId(null);
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
 <div className="w-full h-screen flex flex-col items-center justify-center bg-blue-50/50 p-6">
 <div className="bg-white p-8 rounded-xl shadow-sm max-w-md w-full text-center border border-blue-100">
 <h2 className="text-xl font-bold text-[#0F172A] mb-2">Không tìm thấy khóa học</h2>
 <p className="text-sm text-[#64748B] mb-6">Vui lòng chọn một khóa học để bắt đầu học.</p>
 <a href="/courses" className="inline-flex items-center justify-center w-full px-5 py-3 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold transition-all shadow-sm">
 Xem danh sách khóa học
 </a>
 </div>
 </div>
 );
 }

 if (isLoading || !activeLesson) {
 return (
 <div className="w-full h-screen flex flex-col items-center justify-center bg-blue-50/50">
 <div className="w-12 h-12 border-4 border-[#3B82F6] border-t-transparent rounded-full animate-spin mb-4"></div>
 <p className="text-[#64748B] font-semibold text-sm">Đang tải dữ liệu bài học...</p>
 </div>
 );
 }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 relative font-sans">
      <style>{`main { padding-bottom: 0 !important; }`}</style>
      {/* ─── Instructor Preview Mode Sticky Banner ─── */}
      {isPreview && (
        <div className="sticky top-0 z-50 bg-slate-900 text-white px-6 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md animate-fadeIn">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-md bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
              <Eye size={14} className="inline mr-1" /> XEM TRƯỚC
            </span>
            <span className="text-xs font-semibold text-slate-200">
              <GraduationCap size={14} className="inline mr-1 text-slate-400" /> Giao diện Học viên - Giảng viên trải nghiệm Video, Bài đọc & Thi thử Quiz (Dữ liệu tiến độ không lưu vào hệ thống)
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
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 backdrop-blur-sm"
          >
            <X size={16} />
            <span>Thoát</span>
          </button>
        </div>
      )}

      {/* ─── Top Header & Breadcrumb ─── */}
      <header className="w-full bg-white border-b border-slate-200 px-6 py-3.5 sticky top-0 z-30 transition-all">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <Link
              href={`/courses/detail?courseId=${parsedCourseId}`}
              className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-all shrink-0 shadow-sm"
              title="Quay lại chi tiết Khóa học"
              aria-label="Quay lại chi tiết Khóa học"
            >
              <ArrowLeft size={18} strokeWidth={2.5} />
            </Link>
            <div className="min-w-0">
              <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1 truncate">
                <Link href="/courses" className="hover:text-slate-900 transition-colors">Khoá học</Link>
                <ChevronRight size={12} className="text-slate-300 shrink-0" aria-hidden />
                <span className="text-slate-700 truncate">{apiDetail?.header_info?.title || (apiDetail as any)?.title || "Khóa học"}</span>
              </nav>
              <h1 className="text-lg sm:text-xl font-semibold text-slate-900 truncate tracking-tight">{activeLesson.title}</h1>
            </div>
          </div>

          {/* Progress Bar - Right side */}
          <div className="flex items-center gap-3 shrink-0 whitespace-nowrap">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tiến độ khoá học</span>
            <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
              <div className="h-full bg-blue-600 rounded-full transition-all duration-700" style={{ width: `${computedProgressPercentage}%` }} />
            </div>
            <span className="text-sm font-bold text-slate-900">{computedProgressPercentage}%</span>
          </div>
        </div>
      </header>

      {/* ─── Main Content Grid ─── */}
      <div className="max-w-[1400px] w-full mx-auto p-4 sm:p-6 lg:p-8 pb-28 lg:pb-32 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

        {/* ─── Left Column (8 cols): Lesson Content ─── */}
        <main className="lg:col-span-8 flex flex-col gap-6 w-full min-w-0">

          {/* AI Notice */}
          <div className="w-full px-5 py-4 rounded-xl bg-gradient-to-r from-indigo-50 via-blue-50 to-sky-50 border border-indigo-100/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm relative overflow-hidden">
            {/* Decorative background glow */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-400/10 blur-2xl rounded-full pointer-events-none" />
            
            <div className="flex items-center gap-4 min-w-0 relative z-10">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(79,70,229,0.3)]">
                <Sparkles size={22} />
              </div>
              <div className="min-w-0">
                <p className="text-[14px] font-bold text-slate-900 mb-0.5 tracking-tight flex items-center gap-2">
                  MindNova AI
                </p>
                <p className="text-[13px] text-slate-600 leading-relaxed font-medium truncate" title="Bạn có thể sử dụng khu vực Thảo luận bên dưới để đặt câu hỏi trực tiếp cho AI trong quá trình học">
                  Bạn có thể sử dụng khu vực Thảo luận bên dưới để đặt câu hỏi trực tiếp cho AI trong quá trình học
                </p>
              </div>
            </div>
          </div>

          {/* ─── Content by Type ─── */}
          <div className="rounded-[24px] overflow-hidden border border-slate-200/80 bg-black shadow-sm ring-4 ring-slate-50/50">
            {activeLesson.type === 'video' && (
              <CustomVideoPlayer lesson={activeLesson} onComplete={handleLessonComplete} />
            )}

            {activeLesson.type === 'article' && (
              <div className="bg-white"><ArticleRenderer lesson={activeLesson} onComplete={handleLessonComplete} /></div>
            )}

            {(activeLesson.type === 'quiz_module' || activeLesson.type === 'quiz') && (
              <div className="bg-white"><QuizRenderer lesson={activeLesson} onComplete={handleLessonComplete} /></div>
            )}

            {/* Fallback for unknown type — show as video */}
            {!['video', 'article', 'quiz_module', 'quiz'].includes(activeLesson.type) && (
              <CustomVideoPlayer lesson={activeLesson} onComplete={handleLessonComplete} />
            )}
          </div>

  {/* ─── Tabs: Content Info / AI / Discussion ─── */}
  <div className="bg-white rounded-xl border border-slate-200 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col">
    <div className="p-4 bg-slate-50 border-b border-slate-200">
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-200/70 rounded-xl overflow-x-auto">
        <button
          onClick={() => setActiveTab("content")}
          className={twMerge(
            "px-5 py-2.5 font-bold text-[13px] rounded-lg transition-all cursor-pointer whitespace-nowrap focus:outline-none flex-1 text-center",
            activeTab === "content" ? "bg-white text-blue-700 shadow-sm ring-1 ring-black/5" : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
          )}
        >
          Nội dung học
        </button>
        <button
          onClick={() => setActiveTab("ai_tips")}
          className={twMerge(
            "px-5 py-2.5 font-bold text-[13px] rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 focus:outline-none flex-1",
            activeTab === "ai_tips" ? "bg-white text-blue-700 shadow-sm ring-1 ring-black/5" : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
          )}
        >
          <span>Cố vấn AI Nova</span>
          <span className={twMerge("px-2 py-0.5 rounded-md text-[10px] font-bold", activeTab === "ai_tips" ? "bg-blue-100 text-blue-700" : "bg-slate-300 text-slate-600")}>0</span>
        </button>
        <button
          onClick={() => setActiveTab("discussion")}
          className={twMerge(
            "px-5 py-2.5 font-bold text-[13px] rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 focus:outline-none flex-1",
            activeTab === "discussion" ? "bg-white text-blue-700 shadow-sm ring-1 ring-black/5" : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
          )}
        >
          <span>Thảo luận & Ghi chú</span>
          <span className={twMerge("px-2 py-0.5 rounded-md text-[10px] font-bold", activeTab === "discussion" ? "bg-blue-100 text-blue-700" : "bg-slate-300 text-slate-600")}>{apiDiscussions?.length || 0}</span>
        </button>
      </div>
    </div>

    <div className="p-6 sm:p-8 bg-white min-h-[300px]">
      {/* Tab 1: Content Info */}
      {activeTab === "content" && (
        <div className="flex flex-col gap-6 animate-fadeIn">
          <div className="flex flex-wrap items-center gap-2">
            <span className={twMerge("inline-flex items-center px-3 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase shadow-sm", getLessonTypeColor(activeLesson.type))}>
              {getLessonTypeLabel(activeLesson.type)}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-600 shadow-sm">
              <span>Thời lượng:</span> {activeLesson.duration}
            </span>
            {activeLesson.completed ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm uppercase tracking-wide">
                <CheckCircle2 size={12} strokeWidth={3} /> HOÀN THÀNH
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 shadow-sm uppercase tracking-wide">
                Đang học
              </span>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: AI Tips */}
      {activeTab === "ai_tips" && (
        <div className="flex flex-col gap-5 animate-fadeIn">
          <div className="p-5 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles size={22} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm mb-1">Phân tích chuyên sâu từ MindNova</h3>
              <p className="text-[13px] text-slate-600 leading-relaxed">Các lưu ý chuyên môn được đúc kết từ thực tiễn. Tính năng đang trong quá trình thử nghiệm và sớm ra mắt.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Discussion */}
      {activeTab === "discussion" && (
        <div className="flex flex-col gap-6 animate-fadeIn">
          {/* Discussion Input */}
          <form onSubmit={handlePostComment} className="flex flex-col gap-3 p-5 rounded-xl bg-slate-50 border border-slate-200 shadow-[0_2px_10px_rgb(0,0,0,0.02)] transition-all focus-within:bg-white focus-within:border-blue-300 focus-within:shadow-[0_4px_20px_rgb(37,99,235,0.08)]">
            <h4 className="font-semibold text-[14px] text-slate-900 flex items-center gap-2">
              <MessageSquare size={16} className="text-blue-600" />
              Gửi câu hỏi hoặc ghi chú học tập
            </h4>
            <textarea
              rows={3}
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="Bạn có thắc mắc gì về bài học này không? Nhập nội dung vào đây..."
              className="w-full p-4 rounded-xl border border-slate-200 bg-white text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none shadow-sm"
            />
            <div className="flex justify-end mt-1">
              <button disabled={isSubmittingDiscussion} type="submit" className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-[13px] font-bold transition-all disabled:opacity-50 cursor-pointer shadow-sm flex items-center gap-2">
                <MessageSquare size={16} />
                {isSubmittingDiscussion ? "Đang gửi..." : "Gửi thảo luận"}
              </button>
            </div>
          </form>

          {/* Discussion List */}
          <div className="flex flex-col gap-6">
            {isDiscussionsLoading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-blue-600 animate-spin" />
                <span className="text-[13px] font-semibold text-slate-500">Đang tải thảo luận...</span>
              </div>
            ) : apiDiscussions?.length === 0 ? (
              <div className="py-8">
                <NoDataAvailable
                  icon={MessageSquare}
                  title="Chưa có thảo luận"
                  description="Chưa có thảo luận nào cho bài học này. Hãy để lại câu hỏi để tương tác cùng AI hoặc giảng viên!"
                  variant="compact"
                />
              </div>
            ) : (
              apiDiscussions?.map((item) => (
                <div key={item.id} className="flex flex-col gap-4">
                  {/* Student Question */}
                  {editingDiscussionId === item.id ? (
                    <form onSubmit={(e) => handleEditDiscussionSubmit(e, item.id)} className="p-5 rounded-xl border border-blue-200 bg-blue-50/50 flex flex-col gap-3 shadow-sm">
                      <textarea
                        value={editDiscussionText}
                        onChange={(e) => setEditDiscussionText(e.target.value)}
                        rows={3}
                        className="w-full resize-none rounded-xl border border-slate-200 bg-white p-4 text-[13px] text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 shadow-sm"
                      />
                      <div className="flex justify-end gap-2 mt-1">
                        <button
                          type="button"
                          onClick={() => setEditingDiscussionId(null)}
                          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 shadow-sm"
                        >
                          Hủy
                        </button>
                        <button
                          type="submit"
                          disabled={isUpdatingDiscussion}
                          className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-sm disabled:opacity-60"
                        >
                          {isUpdatingDiscussion ? "Đang lưu..." : "Lưu thay đổi"}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="p-5 rounded-xl border border-slate-200/60 bg-white shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
                      <Avatar src={item.student.avatar} fallback={item.student.name.slice(0, 2)} size="md" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="font-semibold text-[13px] text-slate-900">{item.student.name}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-[11px] font-semibold text-slate-400">{new Date(item.created_at).toLocaleString('vi-VN')}</span>
                            <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
                              <button
                                onClick={() => handleEditDiscussion(item.id, item.content)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                                title="Sửa"
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteDiscussion(item.id)}
                                disabled={isDeletingDiscussion}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all disabled:opacity-60"
                                title="Xóa"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                        <p className="text-[13px] text-slate-600 leading-relaxed whitespace-pre-wrap">{item.content}</p>
                      </div>
                    </div>
                  )}

                  {/* Teacher Replies */}
                  {item.replies.map((reply) => (
                    <div key={reply.id} className="ml-10 p-5 rounded-xl border border-slate-200/60 bg-slate-50/80 shadow-sm flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-emerald-600 text-white font-bold shrink-0 shadow-sm text-sm">
                        GV
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="font-semibold text-[13px] text-slate-900 flex items-center gap-1.5">
                            <span>{reply.user.name}</span>
                            <VerifiedTeacherBadge isVerified={(reply.user as any).is_verified ?? true} size="xs" />
                            <span className="px-2 py-0.5 rounded-md text-[9px] font-bold text-emerald-700 bg-emerald-100 uppercase tracking-wider">Giảng viên</span>
                          </span>
                          <span className="text-[11px] font-semibold text-slate-400">{new Date(reply.created_at).toLocaleString('vi-VN')}</span>
                        </div>
                        <p className="text-[13px] text-slate-600 leading-relaxed whitespace-pre-wrap">{reply.content}</p>
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
  <aside className="lg:col-span-4 w-full flex flex-col gap-6 sticky top-24 max-h-[calc(100vh-100px)] overflow-y-auto pr-1">

    {/* Progress Header */}
    <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-6 flex flex-col gap-4 shrink-0">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[17px] font-semibold text-slate-900 flex items-center gap-2">
            <span>Lộ trình Học tập</span>
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-1">Tiến trình hoàn thành toàn khóa</p>
        </div>
        <span className="text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-xl shrink-0 shadow-sm">
          {completedCount}/{totalLessonCount} Bài học
        </span>
      </div>
      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-[2px] border border-slate-200/50">
        <div className="h-full bg-blue-600 rounded-full transition-all duration-700 shadow-sm" style={{ width: `${computedProgressPercentage}%` }} />
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
              "rounded-xl border transition-all duration-200 overflow-hidden shadow-sm",
              isModuleCurrent ? "bg-white border-blue-200 ring-4 ring-blue-50/50" : "bg-white border-slate-200/60 hover:border-slate-300"
            )}
          >
            {/* Module Header */}
            <div
              onClick={() => toggleModule(mod.id)}
              className="flex items-start justify-between p-5 cursor-pointer hover:bg-slate-50/80 transition-colors group select-none"
            >
              <div className="flex items-start gap-4 min-w-0 pr-2">
                <div className={twMerge(
                  "w-8 h-8 rounded-full flex items-center justify-center font-bold text-[13px] shrink-0 mt-0.5 transition-all shadow-sm",
                  isModuleCompleted ? "bg-emerald-500 text-white border border-emerald-600" :
                  isModuleCurrent ? "bg-blue-50 border-2 border-blue-500 text-blue-700" :
                  "bg-slate-100 text-slate-500 border border-slate-200"
                )}>
                  {isModuleCompleted ? <Check size={14} strokeWidth={3} aria-hidden /> : moduleIndex + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 truncate">{mod.title}</p>
                  <h3 className="text-[15px] font-semibold text-slate-900 mt-1 leading-snug">Nhiều bài học</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs font-semibold text-slate-500">
                      {modCompletedCount}/{mod.lessons.length} bài đã học
                    </span>
                    {isModuleCurrent && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-sm" />}
                  </div>
                </div>
              </div>
              <button className="text-slate-400 group-hover:text-slate-700 transition-colors p-1 shrink-0 bg-slate-50 rounded-lg group-hover:bg-slate-200/50" type="button" aria-label="Thu gọn hoặc mở rộng học phần">
                <ChevronsUpDown size={16} strokeWidth={2.5} />
              </button>
            </div>

            {/* Lessons */}
            {isExpanded && (
              <div className="flex flex-col border-t border-slate-200/60 p-2 gap-1.5 bg-slate-50/50">
                {mod.lessons.map((lesson) => {
                  const isCurrent = lesson.id === activeLessonId;
                  const isCompleted = lesson.completed;

                  return (
                    <div
                      key={lesson.id}
                      onClick={() => handleSelectLesson(lesson.id)}
                      className={twMerge(
                        "flex items-center justify-between py-3 px-3.5 rounded-xl relative cursor-pointer transition-all duration-200 border",
                        isCurrent ? "bg-white border-blue-200 shadow-sm ring-1 ring-blue-100" : "bg-transparent border-transparent hover:border-slate-200/60 hover:bg-white hover:shadow-sm"
                      )}
                    >
                      {isCurrent && <div className="absolute left-0 top-3 bottom-3 w-[4px] bg-blue-600 rounded-r-full shadow-sm" />}

                      <div className="flex items-center gap-3 min-w-0 pl-1 pr-2">
                        <div className={twMerge(
                          "w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all shadow-sm",
                          isCompleted ? "bg-emerald-50 text-emerald-600 border border-emerald-200" :
                          isCurrent ? "bg-blue-50 border-2 border-blue-500 text-blue-700" :
                          "border border-slate-200 text-slate-400 bg-white"
                        )}>
                          <LessonStatusIcon
                            lesson={{
                              type: lesson.type,
                              title: lesson.title,
                              status: isCompleted ? "completed" : isCurrent ? "current" : undefined,
                              completed: isCompleted,
                            }}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className={twMerge(
                            "text-[13px] leading-snug truncate",
                            isCurrent ? "text-slate-900 font-semibold" : "text-slate-700 font-bold"
                          )}>
                            {lessonDisplayTitle(lesson.title)}
                          </h4>
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            {/* Lesson Type Label */}
                            <span className={twMerge(
                              "inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider shadow-sm",
                              getLessonTypeColor(lesson.type)
                            )}>
                              {getLessonTypeLabel(lesson.type)}
                            </span>
                            <span className="text-[11px] font-bold text-slate-400"> {lesson.duration}</span>
                            {/* Status Badge */}
                            {isCurrent && !isCompleted && (
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-bold text-blue-700 bg-blue-50 border border-blue-200 uppercase tracking-wider shadow-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                                ĐANG HỌC
                              </span>
                            )}
                            {isCompleted && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 uppercase tracking-wider shadow-sm">
                                HOÀN THÀNH
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 text-slate-400">
                        <ChevronRight size={16} className={isCurrent ? "text-blue-600" : "text-slate-300"} aria-hidden />
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

  {/* ─── Bottom Toolbar ─── */}
  <footer className="w-full bg-white border-t border-slate-200 px-4 md:px-8 py-3.5 mt-auto sticky bottom-0 z-40 shadow-[0_-4px_20px_rgb(0,0,0,0.02)]">
    <div className="max-w-[1400px] mx-auto w-full flex items-center justify-center">
      {/* Navigation Buttons - Centered & Evenly Spaced */}
      <div className="w-full flex items-center justify-center gap-3 flex-wrap">
        {/* Previous Button */}
        <button
          onClick={handleGoPrevious}
          disabled={!hasPrevious}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-[13px] transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-sm hover:shadow whitespace-nowrap"
        >
          <ArrowLeft size={16} strokeWidth={2.5} aria-hidden />
          <span className="hidden sm:inline">Bài trước</span>
        </button>

        {/* Completion status indicator */}
        {activeLesson.completed ? (
          <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-[12px] border border-emerald-200 uppercase tracking-wider shadow-sm whitespace-nowrap">
            <CheckCircle2 size={16} strokeWidth={2.5} aria-hidden />
            <span className="hidden md:inline">Hoàn thành</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-[12px] border border-slate-200/60 shadow-sm whitespace-nowrap">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
            <span className="hidden md:inline">Đang học tự động ghi nhận</span>
          </div>
        )}

        {/* Next Button */}
        <button
          onClick={handleGoNext}
          disabled={!hasNext}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-[0_4px_12px_rgba(37,99,235,0.25)] hover:shadow-[0_4px_16px_rgba(37,99,235,0.35)] uppercase tracking-wide whitespace-nowrap"
        >
          <span>Bài tiếp theo</span>
          <ChevronRight size={16} strokeWidth={3} aria-hidden />
        </button>
      </div>
    </div>
  </footer>

  {/* ─── Confirm Delete Dialog ─── */}
  {confirmDeleteId !== null && (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-6 max-w-sm w-full mx-4 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
            <Trash2 size={20} className="text-rose-500" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">Xác nhận xóa</h3>
            <p className="text-[13px] text-slate-500">Bạn có chắc muốn xóa bình luận này? Hành động này không thể hoàn tác.</p>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={() => setConfirmDeleteId(null)}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={confirmDelete}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-rose-500 hover:bg-rose-600 transition-colors shadow-sm"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  )}

  </div>
  );
}

// ─── Exported Master Component ────────────────────────────────────────────────
export function LessonWorkspace() {
 return (
 <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center font-semibold text-[#64748B]">Đang tải khoá học Trợ lý AI MindNova...</div>}>
 <LessonWorkspaceContent />
 </Suspense>
 );
}
