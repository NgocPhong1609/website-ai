"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { CheckCircle2, AlertTriangle, Lightbulb, Bot, Target, MessageSquare, ClipboardList, Check, PartyPopper, ChevronRight, Loader2 } from "lucide-react";
import { Skeleton } from "@/src/shared/components/ui/Skeleton";
import { twMerge } from "tailwind-merge";
import { axiosClient } from "@/src/shared/lib/axios";
import { checkQuizAnswer, submitQuiz } from "../../api";
import { quizGeneratorApi } from "@/src/features/instructor/quiz-generator/api/quizGeneratorApi";
import type { LessonData, QuizData } from "./types";

// ─── Quiz Component ───────────────────────────────────────────────────────────
export function QuizRenderer({
 lesson,
 onComplete,
 isPreview = false,
}: {
 lesson: LessonData;
 onComplete: () => void;
 isPreview?: boolean;
}) {
  const [previewFinished, setPreviewFinished] = useState(false);
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
    setPreviewFinished(false);
    setError("");
    setCurrentIndex(0);
    setSelectedAnswer("");
    setEssayText("");
    setAnswerResult(null);
    setAnswered(false);
    setCorrectCount(0);
    setAllAnswers({});

    // Restore saved quiz result if student already completed this quiz
    if (!isPreview && typeof window !== "undefined") {
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
      if (!isPreview && typeof window !== "undefined") {
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
  }, [lesson, normalizeQuestions, isPreview]);

  const handleFinishQuiz = useCallback(async (currentAnswers: Record<string, string>) => {
    if (!quizData) return;
    if (isPreview) {
      if (timerRef.current) clearInterval(timerRef.current);
      setTimeLeft(null);
      setPreviewFinished(true);
      return;
    }
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
  }, [quizData, lesson.id, timeLeft, onComplete, isPreview]);

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
      if (isPreview) {
        setAnswered(true);
        setAnswerResult(true);
        setAllAnswers((prev) => ({ ...prev, [currentQ.id]: essayText }));
        return;
      }
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

 if (previewFinished) {
 return <p className="p-8 text-center text-slate-700">Đã hoàn thành lượt xem thử. Kết quả và tiến độ không được lưu.</p>;
 }

 if (loading) {
 return (
 <div role="status" aria-busy="true" aria-label="Đang tải bài kiểm tra" className="w-full p-6 rounded-xl border border-slate-200 bg-white space-y-4">
 <Skeleton className="h-5 w-2/3" />
 {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
 </div>
 );
 }

 if (error || !quizData || quizData.questions.length === 0) {
 return (
 <div className="w-full p-12 flex flex-col items-center justify-center text-slate-400 bg-blue-50/50 rounded-xl border border-blue-100">
 <AlertTriangle size={28} strokeWidth={1.75} aria-hidden />
 <span className="text-sm font-medium mt-3">{error || "Bài kiểm tra chưa có câu hỏi."}</span>
 </div>
 );
 }

 // Result Phase
 if (submittingFinal) {
 return (
 <div className="w-full p-12 flex flex-col items-center justify-center bg-blue-50/50 rounded-xl border border-blue-100">
 <Loader2 className="w-10 h-10 text-blue-500 animate-spin" aria-hidden />
 <span className="text-sm text-slate-500 font-medium mt-3">Đang nộp bài...</span>
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
          passed ? "bg-blue-50/50 text-emerald-800" : "bg-blue-50/50 text-blue-500"
        )}>
          {passed ? <PartyPopper size={16} className="inline mr-1" /> : <AlertTriangle size={16} className="inline mr-1" />}
        </div>

        <h2 className="text-2xl font-bold text-slate-900">
          {passed ? "Chúc mừng! Bạn đã vượt qua!" : "Chưa đạt yêu cầu"}
        </h2>

        <div className="text-center space-y-1">
          <p className="text-2xl font-semibold text-slate-900">
            {score10} / 10 điểm
          </p>
          <p className="text-xs font-semibold text-slate-500">
            Tỷ lệ đạt: {scorePercent}% — Yêu cầu tối thiểu: {quizData?.passing_score}%
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            (Đã trả lời đúng {actualCorrect}/{totalQ} câu)
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-xs">
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={twMerge(
                "h-full rounded-full transition-all duration-700",
                passed ? "bg-emerald-600" : "bg-blue-600"
              )}
              style={{ width: `${scorePercent}%` }}
            />
          </div>
        </div>

 {passed ? (
 <div className="flex flex-col items-center gap-3">
 <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-50/50 text-emerald-800 font-semibold text-sm">
 HOÀN THÀNH
 </div>
 <button
 onClick={handleRetry}
 className="px-4 py-2 text-sm text-slate-900 hover:text-blue-600 font-medium transition-colors cursor-pointer"
 >
 Làm lại để luyện tập
 </button>
 </div>
 ) : (
 <button
 onClick={handleRetry}
 className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm transition-colors cursor-pointer shadow-sm"
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
 <span className="text-sm font-bold text-slate-900">{quizData.title}</span>
 <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-900">
 Câu {currentIndex + 1}/{quizData.questions.length}
 </span>
 </div>
 {timeLeft !== null && (
 <span className={twMerge(
 "text-sm font-semibold px-3 py-1 rounded-full",
 timeLeft < 60 ? "bg-blue-50 text-blue-500 animate-pulse" : "bg-slate-100 text-slate-500"
 )}>
 {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
 </span>
 )}
 </div>

 {/* Question */}
 <div className="p-6 sm:p-8">
  <h3 className="text-lg font-bold text-slate-900 mb-6 leading-relaxed">
  {question.content}
  </h3>

  {/* Answers - MCQ or Essay */}
  {((question as any).type === "essay" || !question.answers || question.answers.length === 0) ? (
  <div className="flex flex-col gap-3 mb-6">
  <label className="text-xs font-bold text-slate-900">Câu trả lời tự luận của bạn:</label>
  <textarea
  value={essayText}
  onChange={(e) => setEssayText(e.target.value)}
  disabled={answered}
  rows={4}
  placeholder="Nhập nội dung bài làm tự luận của bạn..."
  className="w-full p-4 rounded-xl border border-blue-100 text-sm text-slate-900 focus:border-blue-500 focus:outline-none bg-white font-medium shadow-2xs"
  />

  {answered && (
  <div className="p-5 rounded-xl bg-blue-50/50 border border-blue-100 flex flex-col gap-4 text-xs animate-fadeIn mt-2 shadow-2xs">
  {essayResult[question.id] ? (
  <div className="flex flex-col gap-3 p-4 rounded-xl bg-white border border-blue-100 shadow-2xs">
    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
      <div className="flex items-center gap-2">
        <Bot size={16} className="text-blue-600" />
        <span className="font-semibold text-slate-900 text-sm">Kết quả đánh giá từ Gia sư AI (Gemini):</span>
      </div>
      <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 font-semibold text-xs">
        <Target size={14} className="inline mr-1 text-emerald-600" /> Điểm: {essayResult[question.id].score} / {essayResult[question.id].max_score || (question as any).points || 2.5} điểm
      </div>
    </div>

    <p className="text-slate-500 font-medium text-xs leading-relaxed bg-slate-100/50 p-3 rounded-lg border border-blue-100/60">
      <MessageSquare size={14} className="inline mr-1 text-slate-900" /> <strong>Nhận xét AI:</strong> {essayResult[question.id].feedback}
    </p>

    {Array.isArray(essayResult[question.id].ai_analysis?.matched_points) && essayResult[question.id].ai_analysis.matched_points.length > 0 && (
      <div className="flex flex-col gap-1">
        <span className="font-bold text-emerald-600 text-[11px]"><CheckCircle2 size={12} className="inline mr-1" /> Ý trả lời tốt:</span>
        <ul className="list-disc list-inside text-emerald-600 text-xs space-y-0.5 pl-1">
          {essayResult[question.id].ai_analysis.matched_points.map((pt: string, pIdx: number) => (
            <li key={pIdx}>{pt}</li>
          ))}
        </ul>
      </div>
    )}

    {Array.isArray(essayResult[question.id].ai_analysis?.missing_points) && essayResult[question.id].ai_analysis.missing_points.length > 0 && (
      <div className="flex flex-col gap-1">
        <span className="font-bold text-blue-500 text-[11px]"><AlertTriangle size={12} className="inline mr-1" /> Cần bổ sung / hoàn thiện:</span>
        <ul className="list-disc list-inside text-blue-600 text-xs space-y-0.5 pl-1">
          {essayResult[question.id].ai_analysis.missing_points.map((pt: string, pIdx: number) => (
            <li key={pIdx}>{pt}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
  ) : (
  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-600/20 text-emerald-600 text-xs font-bold flex items-center justify-between">
    <span><CheckCircle2 size={14} className="inline mr-1 text-emerald-600" /> {isPreview ? "Xem thử tự luận — đối chiếu đáp án và tiêu chí bên dưới." : <>Đã nộp bài tự luận - Thang điểm: <strong>{(question as any).points || 2.5} điểm</strong></>}</span>
    <span className="px-2.5 py-0.5 rounded bg-emerald-600 text-white text-[10px] uppercase font-bold">{isPreview ? "Không lưu" : "Đã ghi nhận"}</span>
  </div>
  )}

  <div className="flex flex-col gap-1.5">
    <span className="text-slate-900 font-semibold text-xs"><Lightbulb size={12} className="inline mr-1 text-amber-600" /> Đáp án tham khảo mẫu từ Giảng viên:</span>
    <p className="text-slate-500 font-medium leading-relaxed whitespace-pre-line bg-white p-4 rounded-xl border border-blue-100 shadow-2xs">
      {(question as any).sample_answer || "Yêu cầu học viên phân tích đầy đủ các luận điểm chính trong bài học."}
    </p>
  </div>

  {(question as any).rubric && (
  <div className="flex flex-col gap-1.5 pt-2 border-t border-blue-100">
  <span className="font-semibold text-blue-500 text-xs"><ClipboardList size={12} className="inline mr-1 text-blue-500" /> Thang điểm & Rubric chấm điểm:</span>
  <p className="text-blue-600 font-medium leading-relaxed whitespace-pre-line bg-blue-50/60 p-3.5 rounded-xl border border-blue-500/20">
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
  let ansStyle = "bg-white border-blue-100 hover:border-blue-600 hover:bg-blue-50/50";

  if (answered && isSelected) {
  ansStyle = answerResult
  ? "bg-blue-50/50 border-[#34D399] text-emerald-800"
  : "bg-blue-50/50 border-blue-400 text-blue-500";
  } else if (isSelected) {
  ansStyle = "bg-slate-100 border-blue-500";
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
  isSelected && !answered ? "bg-blue-500 text-white border-blue-500" :
  answered && isSelected && answerResult ? "bg-emerald-600 text-white border-emerald-600" :
  answered && isSelected && !answerResult ? "bg-blue-600 text-white border-blue-600" :
  "bg-slate-100 text-slate-500 border-blue-100"
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
  answerResult ? "bg-blue-50/50 text-emerald-800" : "bg-blue-50/50 text-blue-500"
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
  className="px-6 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-sm flex items-center gap-2"
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
 className="px-6 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm transition-colors cursor-pointer shadow-sm flex items-center gap-2"
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
