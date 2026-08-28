"use client";

import React, { useState } from "react";
import { axiosClient } from "@/src/shared/lib/axios";

interface SelfAssessmentModalProps {
 courseId: string | number;
 courseTitle: string;
 isOpen: boolean;
 onClose: () => void;
}

interface QuestionItem {
 id: string;
 order: number;
 content: string;
 lesson_title: string;
 options: { id: string; content: string }[];
}

interface AssessmentData {
 course_id: number;
 course_title: string;
 title: string;
 total_questions: number;
 questions: QuestionItem[];
 secret_key: string;
}

interface ResultData {
 course_title: string;
 score_text: string;
 correct_count: number;
 total_questions: number;
 score_percentage: number;
 passed: boolean;
 credits_awarded: number;
 ai_insight: string;
 review_lessons: string[];
 question_details: {
 id: string;
 content: string;
 is_correct: boolean;
 lesson_title: string;
 user_choice: string;
 correct_choice: string;
 explanation: string;
 }[];
}

export function SelfAssessmentModal({
 courseId,
 courseTitle,
 isOpen,
 onClose,
}: SelfAssessmentModalProps) {
 const [step, setStep] = useState<"intro" | "generating" | "testing" | "submitting" | "results">("intro");
 const [assessment, setAssessment] = useState<AssessmentData | null>(null);
 const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
 const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
 const [results, setResults] = useState<ResultData | null>(null);
 const [errorMsg, setErrorMsg] = useState<string>("");

 if (!isOpen) return null;

 const handleStartGeneration = async () => {
 setStep("generating");
 setErrorMsg("");
 try {
 const response = await axiosClient.post(`/api/student/courses/${courseId}/self-assessment/generate`);
 if (response.data && response.data.data) {
 setAssessment(response.data.data);
 setCurrentQuestionIndex(0);
 setUserAnswers({});
 setStep("testing");
 } else {
 throw new Error("Dữ liệu tạo bài đánh giá không hợp lệ.");
 }
 } catch (err: any) {
 console.error("Generate self-assessment error:", err);
 setErrorMsg(err.response?.data?.message || err.message || "Không thể khởi tạo bài đánh giá năng lực.");
 setStep("intro");
 }
 };

 const handleOptionSelect = (questionId: string, optionId: string) => {
 setUserAnswers((prev) => ({
 ...prev,
 [questionId]: optionId,
 }));
 };

 const handleSubmitQuiz = async () => {
 if (!assessment) return;
 setStep("submitting");
 setErrorMsg("");
 try {
 const payload = {
 course_id: assessment.course_id,
 secret_key: assessment.secret_key,
 answers: userAnswers,
 time_taken_seconds: 120,
 };

 const response = await axiosClient.post("/api/student/self-assessment/submit", payload);
 if (response.data && response.data.data) {
 setResults(response.data.data);
 setStep("results");
 } else {
 throw new Error("Dữ liệu kết quả không hợp lệ.");
 }
 } catch (err: any) {
 console.error("Submit self-assessment error:", err);
 setErrorMsg(err.response?.data?.message || err.message || "Không thể chấm điểm bài làm.");
 setStep("testing");
 }
 };

 const handleReset = () => {
 setStep("intro");
 setAssessment(null);
 setResults(null);
 setUserAnswers({});
 setErrorMsg("");
 };

 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
 <div className="bg-white rounded-3xl border border-[#E8E2D9] shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden relative transition-all">

 {/* Modal Header */}
 <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0F2F8] from-[#EEF2FF] to-[#EAF8F5]">
 <div className="flex items-center gap-2.5">
 <span className="text-xl"></span>
 <div>
 <h3 className="text-base font-bold text-[#1E1B4B]">
 Đánh giá Năng lực AI — {courseTitle}
 </h3>
 <span className="text-[11px] font-semibold text-[#2C3039]">
 Tự kiểm tra bằng AI • Không tính tín chỉ • Không ảnh hưởng GPA
 </span>
 </div>
 </div>

 <button
 onClick={onClose}
 className="w-8 h-8 rounded-full bg-white border border-[#E8E2D9] flex items-center justify-center text-[#8A8478] hover:bg-gray-100 transition-colors"
 >
 
 </button>
 </div>

 {/* Error Banner */}
 {errorMsg && (
 <div className="mx-6 mt-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center justify-between">
 <span>️ {errorMsg}</span>
 <button onClick={() => setErrorMsg("")} className="font-bold underline">Ẩn</button>
 </div>
 )}

 {/* Modal Body */}
 <div className="p-6 overflow-y-auto flex-1">

 {/* STEP 1: INTRO */}
 {step === "intro" && (
 <div className="space-y-6 text-center py-4">
 

 <div className="space-y-2 max-w-lg mx-auto">
 <h4 className="text-xl font-bold text-[#2C3039]">
 Bắt Đầu Bài Đánh Giá Năng Lực
 </h4>
 <p className="text-xs sm:text-sm text-[#8A8478] leading-relaxed">
 Gia sư AI Nova sẽ tự động đọc **toàn bộ nội dung các bài học** của khóa <strong className="text-[#C0392B]">{courseTitle}</strong> để tạo ngẫu nhiên bộ **10 câu hỏi trắc nghiệm** phù hợp với năng lực của bạn.
 </p>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left max-w-xl mx-auto">
 <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E8E2D9]">
 <span className="text-xs text-[#8A8478] font-medium block mb-0.5">Số lượng câu hỏi</span>
 <span className="text-sm font-bold text-[#2C3039]">10 Câu Trắc Nghiệm</span>
 </div>
 <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E8E2D9]">
 <span className="text-xs text-[#8A8478] font-medium block mb-0.5">Tín chỉ học tập</span>
 <span className="text-sm font-bold text-[#2C3039]">0 Tín (Tự luyện)</span>
 </div>
 <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E8E2D9]">
 <span className="text-xs text-[#8A8478] font-medium block mb-0.5">Thời gian đề xuất</span>
 <span className="text-sm font-bold text-[#C0392B]">15 Phút</span>
 </div>
 </div>

 <div className="pt-4 flex items-center justify-center gap-3">
 <button
 type="button"
 onClick={onClose}
 className="px-5 py-3 rounded-xl border border-gray-300 text-xs sm:text-sm font-semibold text-[#8A8478] hover:bg-[#FEFCF9] transition-colors"
 >
 Hủy bỏ
 </button>
 <button
 type="button"
 onClick={handleStartGeneration}
 className="px-7 py-3 rounded-xl bg-[#C0392B] text-white text-xs sm:text-sm font-bold shadow-md hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer"
 >
 <span> Tạo Bộ Câu Hỏi Bằng AI</span>
 <span></span>
 </button>
 </div>
 </div>
 )}

 {/* STEP 2: GENERATING LOADING STATE */}
 {step === "generating" && (
 <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
 <div className="relative w-16 h-16">
 <div className="w-16 h-16 rounded-full border-4 border-[#EEF2FF] border-t-[#C0392B] animate-spin" />
 <div className="absolute inset-0 flex items-center justify-center text-xl"></div>
 </div>
 <div className="space-y-1 max-w-md">
 <h4 className="text-base font-bold text-[#2C3039] animate-pulse">
 Đang tạo bài đánh giá năng lực...
 </h4>
 <p className="text-xs text-[#8A8478] leading-relaxed">
 AI đang tổng hợp kiến thức từ tất cả các bài học trong khóa để biên soạn 10 câu hỏi phù hợp nhất với bạn.
 </p>
 </div>
 </div>
 )}

 {/* STEP 3: TESTING (QUIZ INTERFACE) */}
 {step === "testing" && assessment && (
 <div className="space-y-6">
 {/* Question Progress Header */}
 <div className="flex items-center justify-between border-b border-gray-100 pb-3">
 <div>
 <span className="text-xs font-bold text-[#C0392B] uppercase tracking-wider">
 Câu hỏi {currentQuestionIndex + 1} / {assessment.questions.length}
 </span>
 <span className="text-xs text-gray-400 block font-normal">
 Bài học liên quan: <strong className="text-gray-700">{assessment.questions[currentQuestionIndex]?.lesson_title}</strong>
 </span>
 </div>
 <div className="w-36 h-2 bg-gray-100 rounded-full overflow-hidden">
 <div
 className="h-full bg-[#C0392B] transition-all duration-300"
 style={{ width: `${((currentQuestionIndex + 1) / assessment.questions.length) * 100}%` }}
 />
 </div>
 </div>

 {/* Current Question */}
 {(() => {
 const q = assessment.questions[currentQuestionIndex];
 if (!q) return null;

 return (
 <div className="space-y-4">
 <h4 className="text-sm sm:text-base font-bold text-[#2C3039] leading-relaxed">
 {q.order}. {q.content}
 </h4>

 <div className="grid grid-cols-1 gap-2.5 pt-2">
 {q.options.map((opt) => {
 const isSelected = userAnswers[q.id] === opt.id;
 return (
 <div
 key={opt.id}
 onClick={() => handleOptionSelect(q.id, opt.id)}
 className={`p-4 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all flex items-center justify-between ${
 isSelected
 ? "bg-[#FAF7F2] border-[#C0392B] text-[#1E1B4B] font-semibold ring-1 ring-[#C0392B]"
 : "bg-white border-[#E8E2D9] text-gray-700 hover:-[#C0392B] hover:bg-[#FEFCF9]"
 }`}
 >
 <span className="leading-relaxed">{opt.content}</span>
 <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
 isSelected ? "border-[#C0392B] bg-[#C0392B]" : "border-gray-300"
 }`}>
 {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
 </div>
 </div>
 );
 })}
 </div>
 </div>
 );
 })()}

 {/* Navigation Controls */}
 <div className="flex items-center justify-between pt-4 border-t border-gray-100">
 <button
 type="button"
 disabled={currentQuestionIndex === 0}
 onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
 className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold text-[#8A8478] hover:bg-[#FEFCF9] disabled:opacity-40"
 >
 ← Câu trước
 </button>

 {currentQuestionIndex < assessment.questions.length - 1 ? (
 <button
 type="button"
 onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
 className="px-5 py-2.5 rounded-xl bg-[#C0392B] text-white text-xs font-semibold hover:bg-[#4338CA] transition-colors"
 >
 Câu tiếp theo →
 </button>
 ) : (
 <button
 type="button"
 onClick={handleSubmitQuiz}
 className="px-6 py-2.5 rounded-xl bg-[#2C3039] text-white text-xs font-bold hover:bg-[#0F766E] shadow-sm transition-colors flex items-center gap-1.5"
 >
 <span> Nộp Bài Đánh Giá</span>
 </button>
 )}
 </div>
 </div>
 )}

 {/* STEP 4: SUBMITTING LOADING STATE */}
 {step === "submitting" && (
 <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
 <div className="w-12 h-12 rounded-full border-4 border-[#FAF7F2] border-t-[#2C3039] animate-spin" />
 <h4 className="text-base font-bold text-[#2C3039] animate-pulse">
 Đang chấm điểm bài đánh giá...
 </h4>
 </div>
 )}

 {/* STEP 5: RESULTS SCREEN */}
 {step === "results" && results && (
 <div className="space-y-6">
 {/* Score Header Card */}
 <div className="p-6 rounded-2xl from-[#EEF2FF] via-[#F6F6FB] to-[#EAF8F5] border border-[#C0392B]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
 <div>
 <span className="text-xs font-bold text-[#2C3039] bg-white px-3 py-1 rounded-full border border-[#2C3039]/20 shadow-2xs inline-block mb-1.5">
 Kết quả tự đánh giá bằng AI
 </span>
 <h4 className="text-xl font-bold text-[#2C3039]">
 Bạn đạt: <span className="text-[#C0392B]">{results.score_text}</span> ({results.score_percentage}%)
 </h4>
 <p className="text-xs text-[#8A8478] mt-1">
 Bài tự luyện — Không tính tín chỉ và không ảnh hưởng điểm khóa học chính thức.
 </p>
 </div>

 <div className="shrink-0 w-20 h-20 rounded-2xl bg-white border border-[#C0392B]/30 flex flex-col items-center justify-center shadow-sm">
 <span className="text-2xl font-bold text-[#C0392B]">{results.score_percentage}%</span>
 <span className="text-[10px] text-gray-400 font-semibold uppercase">{results.passed ? "Đạt Chuẩn" : "Cần Ôn Tập"}</span>
 </div>
 </div>

 {/* AI Tutor Insight */}
 <div className="p-4.5 rounded-2xl bg-[#FAF7F2] border border-[#C7D2FE] space-y-2">
 <div className="flex items-center gap-2 text-xs font-bold text-[#C0392B]">
 <span> Lời khuyên từ Gia sư AI Nova:</span>
 </div>
 <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
 "{results.ai_insight}"
 </p>
 </div>

 {/* Lessons to Review */}
 {results.review_lessons && results.review_lessons.length > 0 && (
 <div className="p-4.5 rounded-2xl bg-[#FFF8EB] border border-[#FDE68A] space-y-2">
 <span className="text-xs font-bold text-[#D97706] block">
 Bài học bạn nên đọc lại:
 </span>
 <ul className="text-xs text-gray-700 space-y-1 pl-4 list-disc">
 {results.review_lessons.map((les, idx) => (
 <li key={idx} className="font-semibold text-gray-800">{les}</li>
 ))}
 </ul>
 </div>
 )}

 {/* Detailed Breakdown */}
 <div className="space-y-3 pt-2">
 <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
 Chi tiết từng câu hỏi ({results.question_details?.length || 0} câu)
 </h5>

 <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
 {results.question_details?.map((det, idx) => (
 <div
 key={det.id}
 className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
 det.is_correct ? "bg-emerald-50/60 -[#FAF7F2] -[#2C3039]" : "bg-rose-50/60 border-rose-200 text-rose-900"
 }`}
 >
 <div className="flex items-start justify-between gap-2">
 <span className="font-semibold">
 {idx + 1}. {det.content}
 </span>
 <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
 det.is_correct ? "-[#FAF7F2] -[#2C3039]" : "bg-rose-100 text-rose-800"
 }`}>
 {det.is_correct ? " Đúng" : " Chưa chính xác"}
 </span>
 </div>

 <p className="text-[11px] text-[#8A8478]">
 <strong>Giải thích AI:</strong> {det.explanation}
 </p>
 </div>
 ))}
 </div>
 </div>

 {/* Action Buttons */}
 <div className="flex items-center justify-between pt-4 border-t border-gray-100">
 <button
 type="button"
 onClick={handleReset}
 className="px-5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-[#FEFCF9] transition-colors"
 >
 Thử Sức Lại Lần Nữa (AI Tạo Bộ Đề Mới)
 </button>

 <button
 type="button"
 onClick={onClose}
 className="px-6 py-2.5 rounded-xl bg-[#C0392B] text-white text-xs font-bold hover:bg-[#4338CA] transition-colors"
 >
 Đóng
 </button>
 </div>
 </div>
 )}

 </div>

 </div>
 </div>
 );
}
