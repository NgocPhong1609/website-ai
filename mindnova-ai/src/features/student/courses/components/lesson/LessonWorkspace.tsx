"use client";

import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { useQueryClient } from "@tanstack/react-query";
import { useGetCourseDetail, useInvalidateCourseDetail, completeLesson, fetchQuiz, checkQuizAnswer, submitQuiz, useGetDiscussions, useCreateDiscussion, useUpdateDiscussion, useDeleteDiscussion } from "../../api";
import type { CourseDetailLessonItem, CourseDetailData } from "../../types";
import { CustomVideoPlayer } from "./CustomVideoPlayer";
import { VerifiedTeacherBadge } from "@/src/shared/components/VerifiedTeacherBadge";

// ─── Icons ────────────────────────────────────────────────────────────────────
function CheckIcon() {
 return (
 <></>
 );
}

function PlayCircleIcon({ className }: { className?: string }) {
 return (
 <></>
 );
}

function ChevronIcon({ className }: { className?: string }) {
 return (
 <></>
 );
}

// ─── Interfaces ───────────────────────────────────────────────────────────────
export interface LessonData {
 id: string;
 title: string;
 type: 'video' | 'article' | 'quiz_module' | string;
 duration: string;
 durationSeconds: number;
 completed: boolean;
 videoUrl: string;
 hasUploadedVideo: boolean;
 content: string; // HTML for article
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
 quiz_id: number;
 title: string;
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
 const [answerResult, setAnswerResult] = useState<boolean | null>(null);
 const [answered, setAnswered] = useState(false);
 const [correctCount, setCorrectCount] = useState(0);
 const [phase, setPhase] = useState<'quiz' | 'result'>('quiz');
 const [submitting, setSubmitting] = useState(false);
 const [submittingFinal, setSubmittingFinal] = useState(false);
 const [allAnswers, setAllAnswers] = useState<Record<string, string>>({});
 const [quizResult, setQuizResult] = useState<any>(null);
 const [timeLeft, setTimeLeft] = useState<number | null>(null);
 const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
 const hasCompletedRef = useRef(false);

 // Load quiz
 useEffect(() => {
 setLoading(true);
 setError("");
 setCurrentIndex(0);
 setSelectedAnswer("");
 setAnswerResult(null);
 setAnswered(false);
 setCorrectCount(0);
 setPhase('quiz');
 setAllAnswers({});
 setQuizResult(null);
 hasCompletedRef.current = false;

 fetchQuiz(lesson.id)
 .then((data) => {
 setQuizData(data);
 if (data.time_limit_minutes > 0) {
 setTimeLeft(data.time_limit_minutes * 60);
 }
 setLoading(false);
 })
 .catch(() => {
 setError("Không thể tải bài kiểm tra.");
 setLoading(false);
 });
 }, [lesson.id]);

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
 if (!selectedAnswer || !quizData || answered) return;
 setSubmitting(true);
 setAnswered(true);

 try {
 const result = await checkQuizAnswer(lesson.id, quizData.questions[currentIndex].id, selectedAnswer);
 setAnswerResult(result.correct);
 if (result.correct) {
 setCorrectCount((c) => c + 1);
 }
 setAllAnswers(prev => ({ ...prev, [quizData.questions[currentIndex].id]: selectedAnswer }));
 } catch {
 // If API fails, treat as incorrect locally
 setAnswerResult(false);
 setAllAnswers(prev => ({ ...prev, [quizData.questions[currentIndex].id]: selectedAnswer }));
 }
 setSubmitting(false);
 };

 const handleNext = () => {
 if (!quizData) return;
 if (currentIndex < quizData.questions.length - 1) {
 setCurrentIndex((i) => i + 1);
 setSelectedAnswer("");
 setAnswerResult(null);
 setAnswered(false);
 } else {
 // Finished all questions
 handleFinishQuiz(allAnswers);
 }
 };

 const handleRetry = () => {
 setCurrentIndex(0);
 setSelectedAnswer("");
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
 // Re-fetch to get re-shuffled questions
 setLoading(true);
 fetchQuiz(lesson.id)
 .then((data) => {
 setQuizData(data);
 setLoading(false);
 })
 .catch(() => {
 setError("Không thể tải lại bài kiểm tra.");
 setLoading(false);
 });
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

 return (
 <div className="w-full bg-white rounded-2xl border border-[#E8E2D9] shadow-sm p-8 flex flex-col items-center gap-6">
 <div className={twMerge(
 "w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold",
 passed ? "bg-[#FAF7F2] text-[#2C3039]" : "bg-[#FAF7F2] text-[#C0392B]"
 )}>
 {passed ? "" : ""}
 </div>

 <h2 className="text-2xl font-bold text-[#2C3039]">
 {passed ? "Chúc mừng! Bạn đã vượt qua!" : "Chưa đạt yêu cầu"}
 </h2>

 <div className="text-center">
 <p className="text-lg font-semibold text-[#374151] mb-1">
 Bạn đúng {actualCorrect}/{totalQ} câu
 </p>
 <p className="text-sm text-[#8A8478]">
 Điểm: {scorePercent}% — Yêu cầu tối thiểu: {quizData?.passing_score}%
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

 {/* Answers */}
 <div className="flex flex-col gap-3 mb-6">
 {question.answers.map((ans, idx) => {
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
 key={ans.id}
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

 {/* Answer feedback */}
 {answered && (
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
 disabled={!selectedAnswer || submitting}
 className="px-6 py-2.5 rounded-xl bg-[#C0392B] hover:bg-[#A93226] text-white font-semibold text-sm transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-sm"
 >
 {submitting ? "Đang kiểm tra..." : "Trả lời"}
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
 const courseIdParam = searchParams.get("courseId");
 const initialLessonParam = searchParams.get("lessonId");

 const parsedCourseId = courseIdParam ? Number(courseIdParam) : 1;
 const { data: apiDetail, isLoading, error } = useGetCourseDetail(parsedCourseId);
 const invalidateCourseDetail = useInvalidateCourseDetail();
 const queryClient = useQueryClient();

 useEffect(() => {
 if (error && (error as any).response?.status === 403) {
 window.location.href = `/courses/detail?courseId=${parsedCourseId}`;
 }
 }, [error, parsedCourseId]);

 const [activeLessonId, setActiveLessonId] = useState<string>("");
 const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

 // Compute curriculum directly from API response to avoid anti-pattern syncing
 const curriculum: ModuleData[] = React.useMemo(() => {
 if (!apiDetail || !apiDetail.modules) return [];
 return apiDetail.modules.map((mod) => ({
 id: mod.id.toString(),
 title: mod.title,
 subtitle: mod.duration || "",
 lessons: mod.lessons.map((l: CourseDetailLessonItem) => ({
 id: l.id.toString(),
 title: l.title,
 type: l.type || 'video',
 duration: l.duration,
 durationSeconds: l.duration_seconds || 0,
 completed: l.status === "completed",
 videoUrl: l.video_url || "",
 hasUploadedVideo: l.has_uploaded_video || false,
 content: l.content || "",
 })),
 }));
 }, [apiDetail]);

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

 if (!activeLesson) {
 return <div className="p-12 text-center text-[#8A8478]">Không tìm thấy bài học nào cho khóa này.</div>;
 }

 // Course title from API
 const courseTitle = apiDetail?.header_info?.title || "Khóa học";

 // Render check for enrollment
 if (apiDetail && !apiDetail.header_info?.is_enrolled) {
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

 {activeLesson.type === 'quiz_module' && (
 <QuizRenderer lesson={activeLesson} onComplete={handleLessonComplete} />
 )}

 {/* Fallback for unknown type — show as video */}
 {!['video', 'article', 'quiz_module'].includes(activeLesson.type) && (
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

 <div className="flex items-center gap-3">
 <Link
 href={`/practice/quiz/question?lessonId=${parsedCourseId}`}
 className="flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#4A4F5C] bg-white border border-[#E8E2D9] hover:bg-[#FEFCF9] transition-all text-decoration-none shadow-sm block"
 >
 <span> Kiểm tra tổng quát</span>
 </Link>
 <button
 onClick={handleGoNext}
 disabled={!hasNext}
 className="flex items-center gap-2 px-6 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#C0392B] hover:bg-[#A93226] transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-sm"
 >
 <span>Bài tiếp theo</span>
 <></>
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
