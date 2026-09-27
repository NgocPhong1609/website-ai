import Link from "next/link";
import { Sparkles } from "lucide-react";
import type { AiSuggestion } from "../types";

interface AiSuggestionCardProps {
 suggestion?: AiSuggestion;
}

export function AiSuggestionCard({ suggestion }: AiSuggestionCardProps) {
 // No real suggestion yet (new learner / not onboarded): invite them to personalise instead of showing sample text.
 if (!suggestion?.message) {
 return (
 <div className="rounded-xl bg-white border border-dashed border-slate-200 p-5 w-full flex flex-col sm:flex-row sm:items-center gap-4">
 <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
 <Sparkles size={20} aria-hidden />
 </div>
 <div className="flex-1 min-w-0">
 <p className="text-sm font-semibold text-slate-900">Chưa có gợi ý cá nhân hóa</p>
 <p className="text-xs text-slate-500 mt-1">Hoàn tất khảo sát mục tiêu học tập để Trợ lý AI Nova đề xuất bài ôn tập phù hợp với bạn.</p>
 </div>
 <Link href="/onboarding" className="shrink-0 inline-flex items-center justify-center py-2.5 px-4 rounded-lg text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors">
 Thiết lập mục tiêu
 </Link>
 </div>
 );
 }

 return (
 <div className="group relative overflow-hidden rounded-xl bg-white border border-slate-200 p-5 hover:border-blue-500 hover:shadow-md transition-all duration-300 w-full focus:outline-none focus:border-blue-500">
 <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
 <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-500 text-white flex items-center justify-center shrink-0 shadow-sm">
 <Sparkles size={20} />
 </div>

 <div className="flex-1 min-w-0 space-y-2.5">
 {/* Badge & Metadata Header */}
 <div className="flex flex-wrap items-center justify-between gap-2">
 <div className="flex items-center gap-2">
 <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold border border-blue-100">
 Gợi ý từ Trợ lý AI Nova
 </span>
 {suggestion.estimated && (
 <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-50 text-xs font-medium text-slate-500 border border-slate-200">
 Thời gian: {suggestion.estimated}
 </span>
 )}
 </div>
 </div>

 {/* Message Content */}
 <p className="text-sm sm:text-base font-semibold text-slate-900 tracking-tight leading-snug transition-colors duration-200">
 {suggestion.message}
 </p>

 {suggestion.reason && (
 <div className="flex items-center gap-2 text-xs text-slate-500 font-normal bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
 <span className="text-blue-600 font-semibold">Lý do đề xuất:</span>
 <span>{suggestion.reason}</span>
 </div>
 )}

 {/* Compact Interactive Actions */}
 <div className="flex flex-wrap items-center gap-3 pt-1">
 <Link
 href={suggestion.action_url || "/study-plan"}
 className="inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-lg text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-200 text-decoration-none shadow-sm"
 >
 <span>{suggestion.action_text || "Xem lộ trình"}</span>
 </Link>

 <Link
 href="/study-plan"
 className="py-2.5 px-4 rounded-lg text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all text-decoration-none shadow-sm"
 >
 Nhờ AI hỗ trợ
 </Link>
 </div>
 </div>
 </div>
 </div>
 );
}
