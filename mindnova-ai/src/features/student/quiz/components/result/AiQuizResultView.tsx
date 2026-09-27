"use client";

import Link from "next/link";
import { ArrowLeft, Lightbulb } from "lucide-react";

interface AiQuizResultViewProps {
 aiQuiz: any;
 aiQuizId: string;
 expandedExplanations: Record<string, boolean>;
 toggleExplanation: (id: string | number) => void;
 isGeneratingSimilar: boolean;
 handleGenerateSimilar: () => void;
}

/** Result screen for AI-generated practice quizzes. */
export function AiQuizResultView({
 aiQuiz,
 aiQuizId,
 expandedExplanations,
 toggleExplanation,
 isGeneratingSimilar,
 handleGenerateSimilar,
}: AiQuizResultViewProps) {
 const isPassed = (aiQuiz.score || 0) >= (aiQuiz.passing_percentage || 70);

 return (
 <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6">
 <div className="max-w-[860px] mx-auto space-y-8">

 {/* Breadcrumb */}
 <div className="flex items-center justify-between text-xs text-slate-500">
 <div className="flex items-center gap-2">
 <Link href="/practice" className="hover:text-blue-600 transition-colors">Trung tâm thực chiến</Link>
 <span></span>
 <span className="text-slate-900 font-medium">Báo cáo kết quả bài thi AI</span>
 </div>
 <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-medium border border-blue-600/20 shadow-sm">
 Mã đề: #{aiQuiz.id}
 </span>
 </div>

 {/* Score Banner */}
 <div className={`p-6 sm:p-8 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative shadow-md transition-all ${
 isPassed 
 ? " bg-gradient-to-br from-emerald-50 via-white to-[#F0FDFA] border-emerald-500/20" 
 : " bg-gradient-to-br from-blue-50 via-white to-slate-50 border-blue-600/20"
 }`}>
 <div className="space-y-2.5 text-center md:text-left relative z-10">
 <span className={`text-[11px] font-semibold px-3 py-1 rounded-full tracking-wide inline-block shadow-sm border ${
 isPassed ? "bg-emerald-500 text-white border-transparent" : "bg-white text-blue-600 border-blue-600/20"
 }`}>
 {isPassed ? "Đạt chuẩn đánh giá" : "Cần cố gắng thêm"}
 </span>
 <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">{aiQuiz.title}</h1>
 <p className="text-xs sm:text-sm text-slate-500">
 Chủ đề: <span className="font-medium text-blue-600">{aiQuiz.topic}</span> • Độ khó: <span className="font-medium text-slate-500">{aiQuiz.difficulty}</span>
 </p>
 </div>

 <div className="flex flex-col items-center relative z-10 bg-white/60 backdrop-blur-sm px-6 py-4 rounded-xl border border-white/50 shadow-sm">
 <div className={`text-5xl font-bold tracking-tight bg-clip-text text-transparent ${isPassed ? "bg-gradient-to-r from-emerald-500 to-emerald-600" : "bg-gradient-to-r from-blue-600 to-blue-700"}`}>
 {aiQuiz.score}%
 </div>
 <span className="text-xs font-medium text-slate-500 mt-1.5">
 Đúng <span className={isPassed ? "text-emerald-500 font-semibold" : "text-blue-600 font-semibold"}>{aiQuiz.correct_count || 0}</span> / {aiQuiz.questions_count} câu
 </span>
 </div>
 </div>

 {/* Chi tiết từng câu hỏi */}
 <div className="space-y-5">
 <div className="flex items-center justify-between px-2">
 <h2 className="text-base font-medium text-slate-900">Chi tiết bài làm &amp; Hướng dẫn giải</h2>
 <span className="text-xs text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">Tổng cộng {aiQuiz.questions_count} câu hỏi</span>
 </div>

 {aiQuiz.questions_data?.map((q: any, idx: number) => {
 const userAns = aiQuiz.user_answers?.[String(q.id)] || "";
 const rawCorrect = q.correct_answer || "";
 const type = q.type || (q.options && q.options.length > 0 ? "multiple_choice" : "essay");

 const cleanUser = userAns.trim().charAt(0).toUpperCase();
 const cleanCorrect = String(rawCorrect).trim().charAt(0).toUpperCase();

 let isCorrect = false;
 if (type === "multiple_choice" || type === "true_false") {
 isCorrect = cleanUser !== "" && cleanUser === cleanCorrect;
 } else if (type === "fill_blank") {
 const u = userAns.trim().toLowerCase();
 const c = String(rawCorrect).trim().toLowerCase();
 isCorrect = u !== "" && (u === c || c.includes(u));
 } else if (type === "essay") {
 isCorrect = userAns.trim().length >= 8;
 }

 const isExpanded = !!expandedExplanations[String(q.id || idx)];
 const isEssayOrFill = type === "essay" || type === "fill_blank" || (!q.options || q.options.length === 0);

 return (
 <div key={q.id || idx} className="p-5 sm:p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4 hover:border-slate-300 transition-colors">
 <div className="flex items-start justify-between gap-4">
 <h3 className="text-sm sm:text-base font-medium text-slate-900 leading-relaxed">
 <span className="text-blue-600 font-semibold mr-1">Câu {idx + 1}:</span> {q.question}
 </h3>
 <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full shrink-0 border ${
 isCorrect ? "bg-emerald-50 text-emerald-500 border-emerald-500/20" : "bg-rose-50 text-rose-700 border-rose-200"
 }`}>
 {isCorrect ? "Chính xác" : "Chưa đúng"}
 </span>
 </div>

 {isEssayOrFill ? (
 <div className="space-y-2 text-xs sm:text-sm">
 <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
 <span className="font-semibold text-slate-500 block mb-1">Bài làm của bạn:</span>
 <p className="text-slate-900">{userAns || <em className="text-slate-500">Bỏ trống</em>}</p>
 </div>
 <div className="p-3.5 rounded-xl bg-slate-50/40 border border-slate-900/30">
 <span className="font-semibold text-emerald-800 block mb-1">Đáp số / Gợi ý chuẩn:</span>
 <p className="text-emerald-800 font-medium">{rawCorrect}</p>
 </div>
 </div>
 ) : (
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 {q.options?.map((opt: string, optIdx: number) => {
 const optKey = opt.trim().charAt(0).toUpperCase();
 const isChosen = cleanUser === optKey;
 const isRightKey = cleanCorrect === optKey;

 let style = "bg-slate-50 border-slate-200 text-slate-500";
 if (isRightKey) {
 style = "bg-emerald-50 border-emerald-500/40 text-emerald-800 font-medium shadow-xs";
 } else if (isChosen && !isRightKey) {
 style = "bg-rose-50 border-rose-300 text-rose-800 font-medium shadow-xs";
 }

 return (
 <div key={optIdx} className={`p-3.5 rounded-xl border text-xs sm:text-sm flex items-center justify-between transition-colors ${style}`}>
 <span>{opt}</span>
 {isChosen && (
 <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${isRightKey ? "bg-emerald-500 text-white" : "bg-rose-600 text-white"}`}>
 Bạn chọn
 </span>
 )}
 </div>
 );
 })}
 </div>
 )}

 <div className="pt-2">
 <div className="p-4 rounded-xl bg-slate-50/70 border border-blue-600/20 space-y-2">
 <div className="flex items-center justify-between">
 <span className="text-xs font-bold text-blue-600 flex items-center gap-1.5">
 <Lightbulb size={14} aria-hidden /> Hướng dẫn giải từ AI:
 </span>
 <button
 type="button"
 onClick={() => toggleExplanation(q.id || idx)}
 className="text-xs font-bold text-blue-600 hover:underline cursor-pointer flex items-center gap-1"
 >
 {isExpanded ? "Thu gọn ▲" : "Xem chi tiết từng bước ▼"}
 </button>
 </div>

 <p className="text-xs sm:text-sm text-slate-900 leading-relaxed">
 {q.explanation || "Áp dụng định lý và công thức đặc trưng để tìm ra đáp số."}
 </p>

 {isExpanded && (
 <div className="mt-3 pt-3 border-t border-blue-600/15 text-xs text-slate-900 space-y-1 bg-white/80 p-3 rounded-lg">
 <strong className="text-blue-600 block"> Phương pháp ghi nhớ:</strong>
 <p>• Xác định điều kiện xác định và áp dụng đúng công thức tổng quát trước khi thay số.</p>
 <p>• Thử các trường hợp đặc biệt để loại trừ nhanh các phương án sai.</p>
 </div>
 )}
 </div>
 </div>
 </div>
 );
 })}
 </div>

 {/* Action Footer */}
 <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
 <Link href="/practice" className="w-full sm:w-auto text-decoration-none">
 <button type="button" className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer">
 <ArrowLeft className="inline h-4 w-4 mr-1 align-text-bottom" aria-hidden />Về Trung tâm Đánh giá
 </button>
 </Link>

 <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
 <Link href={`/practice/quiz/question?aiQuizId=${aiQuiz.id}`} className="w-full sm:w-auto text-decoration-none">
 <button type="button" className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-600/20 text-xs sm:text-sm font-medium hover:bg-blue-100 transition-all cursor-pointer shadow-xs">
 Làm lại đề này
 </button>
 </Link>

 <button
 type="button"
 disabled={isGeneratingSimilar}
 onClick={handleGenerateSimilar}
 className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs sm:text-sm font-medium shadow-sm hover:bg-blue-700 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
 >
 {isGeneratingSimilar ? (
 <span>AI đang soạn 10 câu mới...</span>
 ) : (
 <span>Luyện tiếp: Tạo 10 câu tương tự</span>
 )}
 </button>
 </div>
 </div>
 </div>
 </div>
 );
}
