"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetQuizAttemptResult } from "../../api";
import type { QuizGradingResult, QuestionResultDetail } from "../../types";
import toast from "react-hot-toast";
import { axiosClient } from "@shared/lib/axios";
import { Lightbulb, ArrowLeft } from "lucide-react";
import { AiQuizResultView } from "./AiQuizResultView";

export function QuizResultContent() {
 const router = useRouter();
 const searchParams = useSearchParams();
 const aiQuizId = searchParams ? searchParams.get("aiQuizId") : null;
 const attemptId = searchParams ? searchParams.get("attemptId") : null;
 const courseId = searchParams ? (searchParams.get("courseId") || searchParams.get("course_id")) : null;

 // Fetch attempt result directly from DB if attemptId is present
 const { data: dbAttemptResult, isLoading: isAttemptLoading } = useGetQuizAttemptResult(attemptId || "");

 // State cho đề AI
 const [aiQuiz, setAiQuiz] = useState<any>(null);
 const [isAiLoading, setIsAiLoading] = useState<boolean>(!!aiQuizId);
 const [expandedExplanations, setExpandedExplanations] = useState<Record<string, boolean>>({});
 const [isGeneratingSimilar, setIsGeneratingSimilar] = useState<boolean>(false);

 // State cho đề tĩnh & tự luận
 const [staticResult, setStaticResult] = useState<QuizGradingResult | null>(null);
 const [isStaticLoading, setIsStaticLoading] = useState<boolean>(!aiQuizId && !attemptId);
 const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
 const [selectedFilter, setSelectedFilter] = useState<"all" | "mc" | "essay">("all");


 // 1. Tải kết quả bài thi AI nếu có aiQuizId
 useEffect(() => {
 if (!aiQuizId) return;

 const fetchAiQuizResult = async () => {
 setIsAiLoading(true);
 try {
 const res = await axiosClient.get(`/api/student/practice/ai-quizzes/${aiQuizId}`);
 if (res.data && res.data.data) {
 setAiQuiz(res.data.data);
 }
 } catch (err) {
 console.error("Lỗi khi tải kết quả thi AI:", err);
 } finally {
 setIsAiLoading(false);
 }
 };

 fetchAiQuizResult();
 }, [aiQuizId]);

 // 2. Ưu tiên dữ liệu từ Database theo attemptId, nếu không có mới dùng localStorage
 useEffect(() => {
 if (aiQuizId) return;

 if (dbAttemptResult) {
   setStaticResult(dbAttemptResult);
   setIsStaticLoading(false);
 } else if (!attemptId && typeof window !== "undefined") {
   const stored = localStorage.getItem("mindnova_last_quiz_result");
   if (stored) {
     try {
       setStaticResult(JSON.parse(stored) as QuizGradingResult);
     } catch (e) {
       console.error("Lỗi parse localStorage:", e);
     }
   }
   setIsStaticLoading(false);
 }
 }, [aiQuizId, attemptId, dbAttemptResult]);


 // Toggle xem giải thích chi tiết AI
 const toggleExplanation = (id: string | number) => {
 setExpandedExplanations((prev) => ({
 ...prev,
 [String(id)]: !prev[String(id)],
 }));
 };

 // Tạo 10 câu hỏi tương tự cùng chủ đề
 const handleGenerateSimilar = async () => {
 if (!aiQuiz?.topic) return;

 setIsGeneratingSimilar(true);
 try {
 const res = await axiosClient.post(`/api/student/practice/generate-ai-quiz`, {
 topic: aiQuiz.topic,
 title: `Luyện tập chuyên sâu: ${aiQuiz.topic}`,
 question_count: 10,
 difficulty: aiQuiz.difficulty || "Trung bình",
 question_types: ["Trắc nghiệm", "Đúng / Sai"],
 time_limit_minutes: 15,
 custom_prompt: "Tạo các bài toán biến thể nâng cao tư duy dựa trên chủ đề này",
 });

 if (res.data && res.data.data?.id) {
 router.push(`/practice/quiz/question?aiQuizId=${res.data.data.id}`);
 } else {
 toast.error("Chưa tạo được bộ đề tương tự, vui lòng thử lại!");
 }
 } catch (e) {
 console.error(e);
 toast.error("Đã xảy ra lỗi khi tạo bộ đề mới.");
 } finally {
 setIsGeneratingSimilar(false);
 }
 };

 if (isAiLoading || isStaticLoading) {
 return (
 <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6">
 <div className="max-w-[860px] mx-auto space-y-8 animate-pulse">
 {/* Breadcrumb Skeleton */}
 <div className="flex items-center justify-between">
 <div className="h-4 bg-slate-200 rounded w-48"></div>
 <div className="h-6 bg-slate-200 rounded-full w-24"></div>
 </div>

 {/* Score Banner Skeleton */}
 <div className="h-48 sm:h-40 bg-white border border-slate-200 rounded-3xl shadow-sm"></div>

 {/* Details Header Skeleton */}
 <div className="flex items-center justify-between px-2 pt-2">
 <div className="h-5 bg-slate-200 rounded w-40"></div>
 <div className="h-6 bg-slate-200 rounded-full w-32"></div>
 </div>

 {/* Questions Skeleton */}
 <div className="space-y-5">
 {[1, 2, 3].map((i) => (
 <div key={i} className="p-5 sm:p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
 <div className="flex justify-between items-start gap-4">
 <div className="h-5 bg-slate-200 rounded w-3/4"></div>
 <div className="h-6 bg-slate-200 rounded-full w-20 shrink-0"></div>
 </div>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
 <div className="h-12 bg-slate-50 rounded-xl border border-slate-200"></div>
 <div className="h-12 bg-slate-50 rounded-xl border border-slate-200"></div>
 <div className="h-12 bg-slate-50 rounded-xl border border-slate-200"></div>
 <div className="h-12 bg-slate-50 rounded-xl border border-slate-200"></div>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 );
 }

 // ═════════════════════════════════════════════════════════════════════════════
 // ─── GIAO DIỆN 1: BÀI THI AI (AI QUIZ RESULT VIEW) ──────────────────────────
 // ═════════════════════════════════════════════════════════════════════════════
 if (aiQuizId && aiQuiz) {
 return (
 <AiQuizResultView
 aiQuiz={aiQuiz}
 aiQuizId={aiQuizId}
 expandedExplanations={expandedExplanations}
 toggleExplanation={toggleExplanation}
 isGeneratingSimilar={isGeneratingSimilar}
 handleGenerateSimilar={handleGenerateSimilar}
 />
 );
 }

 // ═════════════════════════════════════════════════════════════════════════════
 // ─── GIAO DIỆN 2: BÀI THI TĨNH & TỰ LUẬN KHÓA HỌC (STATIC QUIZ VIEW) ───────
 // ═════════════════════════════════════════════════════════════════════════════
 const displayData: QuizGradingResult = staticResult || {
 attempt_id: 1042,
 module_id: "67",
 score: 80,
 score_10: 8.0,
 total_score_max: 100,
 accuracy: "80%",
 passed: true,
 correct_count: 8,
 total_questions: 10,
 time_taken_formatted: "4 phút 25 giây",
 quiz_title: "Kiểm tra thực chiến",
 ai_insight: "Bạn đã nắm vững nền tảng kiến thức và trình bày bài làm rất ấn tượng!",
 ai_coach_suggestion: "Hãy mở Bảng soát bài chi tiết để đối chiếu nhận xét Rubric tự luận nhé.",
 topic_performance: [
 { id: "1", topic_title: "Kiến trúc & Cấu trúc cốt lõi", sub_title: "Nắm vững lý thuyết nền tảng", score_percentage: 100, status_label: "Tốt (100%)", status_color: "indigo" },
 { id: "2", topic_title: "Kỹ năng lập trình & Giải thuật", sub_title: "Xử lý luồng dữ liệu & logic", score_percentage: 85, status_label: "Tốt (85%)", status_color: "indigo" },
 { id: "3", topic_title: "Xử lý Tự luận & Biện luận kỹ thuật", sub_title: "Đáp ứng tiêu chí Rubric", score_percentage: 75, status_label: "Khá (75%)", status_color: "teal" },
 ],
 action_cards: [],
 };

 const targetModuleId = displayData.module_id || "67";
 const displayScore10 = displayData.score_10 != null 
 ? Number(displayData.score_10).toFixed(1) 
 : (Math.round((displayData.score / 100) * 100) / 10).toFixed(1);

 const questionResultsList: QuestionResultDetail[] = displayData.question_results || [];
 const mcCount = questionResultsList.filter(q => q.type === 'multiple_choice').length;
 const essayCount = questionResultsList.filter(q => q.type === 'essay').length;

 const filteredQuestions = questionResultsList.filter(q => {
 if (selectedFilter === "mc") return q.type === "multiple_choice";
 if (selectedFilter === "essay") return q.type === "essay";
 return true;
 });

 return (
 <div className="flex-1 overflow-y-auto bg-slate-50 min-h-screen relative">
 
 {/* ─── Modal Soát bài thi tĩnh & tự luận Rubric ─── */}
 {isReviewModalOpen && (
 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 animate-fadeIn">
 <div className="bg-white w-full max-w-4xl rounded-3xl border border-slate-200 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-scaleUp">
 
 <div className="p-6 bg-gradient-to-r from-blue-50 via-slate-100 to-emerald-50 border-b border-slate-200 flex items-center justify-between shrink-0">
 <div className="space-y-1">
 <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-white text-xs font-semibold text-blue-600 border border-blue-600/20">
 <span> Soát Lỗi Chi Tiết từ Gia Sư AI Nova</span>
 </div>
 <h3 className="text-lg sm:text-xl font-bold text-slate-900">Bảng Đối Chiếu Đáp Án, Bài Làm Tự Luận &amp; Nhận Xét Rubric</h3>
 </div>
 <button 
 type="button"
 onClick={() => setIsReviewModalOpen(false)}
 className="w-10 h-10 rounded-xl bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 flex items-center justify-center font-semibold text-lg transition-colors cursor-pointer"
 title="Đóng cửa sổ"
 >
 
 </button>
 </div>

 <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50">
 <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-200">
 <button 
 onClick={() => setSelectedFilter("all")}
 className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${selectedFilter === "all" ? "bg-blue-600 text-white" : "bg-white text-slate-500 border border-slate-200"}`}
 >
 Tất cả ({questionResultsList.length > 0 ? questionResultsList.length : 10} Câu)
 </button>
 <button 
 onClick={() => setSelectedFilter("mc")}
 className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${selectedFilter === "mc" ? "bg-slate-900 text-white" : "bg-white text-slate-900 border border-slate-900/30"}`}
 >
 Trắc nghiệm ({mcCount > 0 ? mcCount : 8} Câu)
 </button>
 <button 
 onClick={() => setSelectedFilter("essay")}
 className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${selectedFilter === "essay" ? "bg-amber-600 text-white" : "bg-white text-amber-600 border border-amber-600/30"}`}
 >
 Tự luận AI chấm ({essayCount} câu)
 </button>
 </div>

 <div className="space-y-5">
 {filteredQuestions.length > 0 ? (
 filteredQuestions.map((item) => (
 <div key={item.question_id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-4 hover:border-blue-600/30 transition-colors">
 <div className="flex items-center justify-between gap-3 flex-wrap">
 <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-50 text-blue-600 border border-blue-600/15">
 Câu #{item.order} • {item.type === 'essay' ? 'Tự luận AI' : 'Trắc nghiệm'}
 </span>
 
 <div className="flex items-center gap-2">
 <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
 item.score >= (item.max_score * 0.8) 
 ? "bg-emerald-50 text-slate-900 border-slate-900/20" 
 : item.score > 0 
 ? "bg-slate-100 text-amber-600 border-amber-600/30"
 : "bg-blue-50 text-blue-600 border-blue-600/20"
 }`}>
 Điểm: {item.score} / {item.max_score} điểm
 </span>
 </div>
 </div>

 <h4 className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed">
 {item.content}
 </h4>
 {item.image_url && (
 <img
 src={item.image_url}
 alt={`Hình minh họa câu hỏi: ${item.content}`}
 className="max-h-72 w-full rounded-xl border border-slate-200 bg-white object-contain"
 />
 )}

 {item.type === 'essay' ? (
 <div className="space-y-3 pt-1">
 <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
 <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600"> Bài làm tự luận của bạn:</span>
 <p className="text-xs sm:text-sm text-slate-900 whitespace-pre-line leading-relaxed font-normal">
 {item.user_answer_text && item.user_answer_text.trim() !== "" 
 ? item.user_answer_text 
 : <span className="text-blue-600 italic">(Học viên chưa nhập câu trả lời)</span>
 }
 </p>
 </div>

 {item.sample_answer && (
 <div className="p-4 rounded-xl bg-emerald-50/60 border border-slate-900/20 space-y-1">
 <span className="text-[11px] font-bold uppercase tracking-wider text-slate-900"> Đáp án tham khảo mẫu:</span>
 <p className="text-xs sm:text-sm text-emerald-800 whitespace-pre-line leading-relaxed font-normal">
 {item.sample_answer}
 </p>
 </div>
 )}

 <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50/80 via-slate-100 to-emerald-50/80 border border-blue-600/20 space-y-2">
 <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
 <span> Nhận xét đánh giá từ Gia sư AI MindNova:</span>
 </span>
 <p className="text-xs sm:text-sm text-slate-900 leading-relaxed">
 {item.feedback || "Đã ghi nhận bài làm."}
 </p>

 {item.ai_analysis?.matched_points && item.ai_analysis.matched_points.length > 0 && (
 <div className="pt-2 border-t border-slate-200 space-y-1">
 <span className="text-[10px] font-bold text-slate-900 uppercase"> Ý đạt điểm (Matched Points):</span>
 <ul className="list-disc list-inside space-y-0.5 text-xs text-emerald-800">
 {item.ai_analysis.matched_points.map((pt, pIdx) => (
 <li key={pIdx}>{pt}</li>
 ))}
 </ul>
 </div>
 )}

 {item.ai_analysis?.missing_points && item.ai_analysis.missing_points.length > 0 && (
 <div className="pt-1 space-y-1">
 <span className="text-[10px] font-bold text-amber-600 uppercase">Ý cần bổ sung:</span>
 <ul className="list-disc list-inside space-y-0.5 text-xs text-amber-800">
 {item.ai_analysis.missing_points.map((pt, pIdx) => (
 <li key={pIdx}>{pt}</li>
 ))}
 </ul>
 </div>
 )}
 </div>
 </div>
 ) : (
 <div className="space-y-3 pt-1">
 {item.selection_type === 'multiple_choice' && item.answer_options ? (
 <div className="space-y-2">
 {item.answer_options.map((answer) => {
 const isSelected = item.selected_answer_ids?.includes(answer.id) ?? false;
 const isCorrectAnswer = item.correct_answer_ids?.includes(answer.id) ?? false;
 const state = isSelected && isCorrectAnswer
 ? 'selected-correct'
 : isSelected
 ? 'selected-incorrect'
 : isCorrectAnswer
 ? 'missed-correct'
 : 'neutral';
 const style = state === 'selected-correct'
 ? 'bg-emerald-50 border-emerald-500/30 text-slate-900'
 : state === 'selected-incorrect'
 ? 'bg-rose-50 border-rose-200 text-rose-700'
 : state === 'missed-correct'
 ? 'bg-amber-50 border-amber-500/30 text-amber-800'
 : 'bg-slate-50 border-slate-200 text-slate-400';
 const label = state === 'selected-correct'
 ? 'Đã chọn · đúng'
 : state === 'selected-incorrect'
 ? 'Đã chọn · chưa đúng'
 : state === 'missed-correct'
 ? 'Đáp án đúng bị bỏ lỡ'
 : '';

 return (
 <div key={answer.id} data-answer-state={state} className={`p-3.5 rounded-xl border text-xs sm:text-sm flex items-center justify-between ${style}`}>
 <span className="flex-1">
 {answer.content}
 {answer.image_url && (
 <img
 src={answer.image_url}
 alt={`Hình minh họa đáp án: ${answer.content}`}
 className="mt-2 max-h-40 w-full rounded-lg border border-current/15 bg-white object-contain"
 />
 )}
 </span>
 {label && <span className="text-[11px] font-semibold">{label}</span>}
 </div>
 );
 })}
 </div>
 ) : (
 <>
 <div className={`p-3.5 rounded-xl border text-xs sm:text-sm font-semibold flex items-center gap-2 ${
 item.is_correct 
 ? "bg-emerald-50 border-slate-900/20 text-slate-900" 
 : "bg-blue-50 border-blue-600/20 text-blue-600"
 }`}>
 <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 text-white font-bold" style={{ backgroundColor: item.is_correct ? '#0f172a' : '#2563EB' }}>
 {item.is_correct ? '' : ''}
 </span>
 <span>Đáp án bạn chọn: {item.user_answer_text || 'Chưa chọn'}</span>
 </div>

 {!item.is_correct && item.correct_answer && (
 <div className="p-3.5 rounded-xl bg-emerald-50 border border-slate-900/20 text-xs sm:text-sm font-semibold text-slate-900">
 <span>Đáp án chuẩn xác từ CSDL: {item.correct_answer}</span>
 </div>
 )}
 {item.answer_options
 ?.filter((answer) => answer.image_url && (
 answer.content === item.user_answer_text || answer.content === item.correct_answer
 ))
 .map((answer) => (
 <img
 key={answer.id}
 src={answer.image_url || undefined}
 alt={`Hình minh họa đáp án: ${answer.content}`}
 className="max-h-40 w-full rounded-lg border border-slate-200 bg-white object-contain"
 />
 ))}
 </>
 )}

 <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
 <p className="text-[11px] font-semibold tracking-wide text-blue-600 uppercase flex items-center gap-1.5">
 <span> Gia sư AI MindNova giải thích</span>
 </p>
 <p className="text-xs sm:text-sm text-slate-900 font-normal leading-relaxed">
 {item.feedback || "Các yêu cầu trắc nghiệm được đánh giá theo dữ liệu chuẩn xác."}
 </p>
 </div>
 </div>
 )}
 </div>
 ))
 ) : (
 <div className="text-center py-12 text-slate-500 text-sm">
 Không có câu hỏi nào thuộc phân loại đã chọn.
 </div>
 )}
 </div>
 </div>

 <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
 <button 
 type="button"
 onClick={() => setIsReviewModalOpen(false)}
 className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-xs sm:text-sm hover:opacity-95 transition-all shadow-2xs cursor-pointer"
 >
 Đã hiểu rõ &amp; Đóng bảng soát bài
 </button>
 </div>
 </div>
 </div>
 )}

 <div className="max-w-[1020px] mx-auto px-6 py-8 pb-24 space-y-7">
 
 {/* Header Breadcrumb */}
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2 text-xs text-slate-500">
 <Link href="/practice" className="hover:text-blue-600 transition-colors text-decoration-none">Trung tâm thực chiến</Link>
 <span></span>
 <span className="text-slate-900 font-medium">Báo cáo kiểm tra Năng lực AI</span>
 </div>
 <span className="text-xs font-medium px-3 py-1 rounded-full bg-slate-50 text-blue-600 border border-blue-600/15">
 Mã định danh lượt thi: #{displayData.attempt_id}
 </span>
 </div>

 {/* Top Score Card */}
 <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
 <div className="md:col-span-7 from-white via-[#FAFBFF] to-slate-100 rounded-xl border border-slate-200 shadow-2xs relative overflow-hidden p-8 flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-md">
 <div className="absolute top-0 right-0 w-44 h-44 rounded-full bg-slate-50 blur-2xl pointer-events-none" />
 <div className="absolute bottom-0 left-0 w-44 h-44 rounded-full bg-blue-600/10 blur-2xl pointer-events-none" />

 <div className={`absolute top-5 right-5 px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-2xs border ${displayData.passed ? "bg-emerald-50 text-slate-900 border-slate-900/20" : "bg-blue-50 text-blue-600 border-blue-600/20"}`}>
 <span className={`w-2 h-2 rounded-full ${displayData.passed ? "bg-slate-900" : "bg-blue-600"} animate-pulse`} />
 {displayData.passed ? "Đạt Yêu Cầu (Passed)" : "Chưa Đạt (Need Practice)"}
 </div>

 <div className="relative z-10 mt-2 space-y-1">
 <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">Điểm Thành Tích Chung (Thang Điểm 10)</p>
 <div className="flex items-baseline justify-center gap-1.5 my-2">
 <span className="text-6xl sm:text-7xl font-bold bg-blue-600 bg-clip-text text-transparent tracking-tight">
 {displayScore10}
 </span>
 <span className="text-2xl font-semibold text-slate-500">/10.0</span>
 </div>
 </div>

 <p className="text-xs text-slate-500 mt-1">Bài thi: <span className="font-medium text-slate-900">{displayData.quiz_title || "Kiểm tra thực chiến"}</span></p>

 <div className="relative z-10 grid grid-cols-2 gap-8 w-full max-w-xs mt-7 pt-5 border-t border-slate-200">
 <div>
 <p className="text-xs font-normal text-slate-500 mb-1">Tỷ lệ chính xác</p>
 <p className="text-sm sm:text-base font-semibold text-slate-900 flex items-center justify-center gap-1">
 <span className="text-slate-900"> {displayData.correct_count}</span> / {displayData.total_questions} Câu
 </p>
 </div>
 <div className="border-l border-slate-200">
 <p className="text-xs font-normal text-slate-500 mb-1">Thời gian làm bài</p>
 <p className="text-sm sm:text-base font-semibold text-slate-900">
 {displayData.time_taken_formatted || `${displayData.time_taken_seconds || 180} giây`}
 </p>
 </div>
 </div>
 </div>

 <div className="md:col-span-5 bg-white rounded-xl border border-slate-200 shadow-2xs p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:border-blue-600/30">
 <div className="space-y-4">
 <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
 <div className="flex items-center gap-2.5 text-blue-600">
 
 <h3 className="font-semibold text-base text-slate-900">Nhận xét từ Gia sư AI</h3>
 </div>
 <span className="text-[11px] bg-emerald-50 text-slate-900 px-2.5 py-0.5 rounded-full font-medium border border-slate-900/15">
 MindNova Co-Pilot
 </span>
 </div>

 <p className="text-xs sm:text-sm text-slate-900 leading-relaxed font-normal bg-slate-50 p-4 rounded-xl border border-slate-200">
 &ldquo;{displayData.ai_insight || "Bạn đã nắm vững nền tảng kiến thức và trình bày bài làm rất ấn tượng!"}&rdquo;
 </p>
 </div>
 
 <div className="pt-4 border-t border-slate-100 mt-4 space-y-1.5">
 <p className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase"> Chiến thuật tiếp theo</p>
 <p className="text-xs sm:text-sm font-semibold text-blue-600 bg-slate-50/50 p-3 rounded-xl border border-blue-600/15">
 {displayData.ai_coach_suggestion || "Hãy mở Bảng soát bài chi tiết để đối chiếu nhận xét Rubric tự luận nhé."}
 </p>
 </div>
 </div>
 </div>

 {/* Topic Performance */}
 <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 sm:p-7 transition-all duration-300 hover:shadow-md">
 <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
 <div>
 <h3 className="text-base sm:text-lg font-semibold text-slate-900">Phân tích độ thành thạo theo chủ đề (Topic Mastery)</h3>
 <p className="text-xs text-slate-500 mt-0.5">Trí tuệ nhân tạo phân rã mức độ thông hiểu kỹ thuật từ bài thi của bạn</p>
 </div>
 <span className="text-xs text-blue-600 bg-slate-50/60 px-3 py-1 rounded-full font-medium hidden sm:inline-block border border-blue-600/15">
 3 Chủ đề cốt lõi
 </span>
 </div>
 
 <div className="flex flex-col gap-6">
 {(displayData.topic_performance || []).map((t, idx) => (
 <div key={t.id || idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-600/20 transition-colors space-y-2.5">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
 <div>
 <h4 className="font-semibold text-sm sm:text-base text-slate-900">{t.topic_title}</h4>
 <p className="text-xs text-slate-500 mt-0.5">{t.sub_title}</p>
 </div>
 <span className={`self-start sm:self-center px-3 py-1 rounded-full text-xs font-medium border ${t.score_percentage >= 80 ? "bg-emerald-50 text-slate-900 border-slate-900/20" : t.score_percentage >= 60 ? "bg-slate-50 text-blue-600 border-blue-600/20" : "bg-blue-50 text-blue-600 border-blue-600/20"}`}>
 {t.status_label}
 </span>
 </div>
 
 <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden p-0.5">
 <div 
 className={`h-full rounded-full transition-all duration-700 ${t.score_percentage >= 80 ? " bg-slate-900 " : t.score_percentage >= 60 ? " bg-blue-600 " : " from-[#F43F5E] to-blue-600"}`}
 style={{ width: `${t.score_percentage}%` }}
 />
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Action Cards */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 <div 
 onClick={() => setIsReviewModalOpen(true)}
 className="bg-white rounded-xl p-6 border border-slate-200 shadow-2xs transition-all duration-300 hover:shadow-md hover:border-blue-600/50 hover:-translate-y-0.5 flex flex-col justify-between group cursor-pointer"
 >
 <div>
 
 <h4 className="font-semibold text-base text-slate-900 mt-5 mb-2 group-hover:text-blue-600 transition-colors">
 Xem lại câu hỏi &amp; Bài làm tự luận
 </h4>
 <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
 Soát lại từng chi tiết đáp án trắc nghiệm và bài làm tự luận kèm nhận xét AI và Rubric.
 </p>
 </div>

 <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:text-blue-600">
 <span>Bắt đầu soát bài</span>
 <span className="group-hover:translate-x-1.5 transition-transform duration-200"></span>
 </div>
 </div>

 <Link href={`/practice/quiz/question?lessonId=${targetModuleId}`} className="text-decoration-none block">
 <div className="h-full bg-white rounded-xl p-6 border border-slate-200 shadow-2xs transition-all duration-300 hover:shadow-md hover:border-slate-900/50 hover:-translate-y-0.5 flex flex-col justify-between group cursor-pointer">
 <div>
 
 <h4 className="font-semibold text-base text-slate-900 mt-5 mb-2 group-hover:text-slate-900 transition-colors">
 Luyện tập lại bộ đề thi này
 </h4>
 <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
 Vào lại chế độ thi kiểm nghiệm để thực hành kỹ năng làm bài tự luận và trắc nghiệm.
 </p>
 </div>

 <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-900 group-hover:text-slate-900">
 <span>Luyện tập thêm</span>
 <span className="group-hover:translate-x-1.5 transition-transform duration-200"></span>
 </div>
 </div>
 </Link>

 <Link href="/practice" className="text-decoration-none block">
 <div className="h-full bg-white rounded-xl p-6 border border-slate-200 shadow-2xs transition-all duration-300 hover:shadow-md hover:border-blue-600/50 hover:-translate-y-0.5 flex flex-col justify-between group cursor-pointer">
 <div>
 
 <h4 className="font-semibold text-base text-slate-900 mt-5 mb-2 group-hover:text-blue-600 transition-colors">
 Chuyển sang Module chủ đề khác
 </h4>
 <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
 Quay về Trung tâm đánh giá để lựa chọn các chuyên đề khóa học khác.
 </p>
 </div>

 <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:text-blue-600">
 <span>Tiếp tục hành trình</span>
 <span className="group-hover:translate-x-1.5 transition-transform duration-200"></span>
 </div>
 </div>
 </Link>
 </div>

 {/* Footer Buttons */}
 <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
 <Link href="/practice" className="text-decoration-none">
 <button type="button" className="px-7 py-3 bg-blue-600 hover:opacity-95 text-white rounded-xl font-semibold text-xs sm:text-sm shadow-[0_6px_20px_rgba(59, 130, 246,0.3)] hover:-translate-y-0.5 transition-all cursor-pointer flex items-center gap-2">
 <span></span>
 <span>Quay lại Trung tâm đánh giá</span>
 </button>
 </Link>

 <Link href={`/practice/quiz/question?lessonId=${targetModuleId}`} className="text-decoration-none">
 <button type="button" className="px-7 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 rounded-xl font-medium text-xs sm:text-sm shadow-2xs hover:border-blue-600/30 transition-all cursor-pointer flex items-center gap-2">
 <span></span>
 <span>Làm lại bài với đề mới</span>
 </button>
 </Link>
 </div>

 </div>
 </div>
 );
}
