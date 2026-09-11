import Link from "next/link";
import { Sparkles } from "lucide-react";
import { AI_SUGGESTION } from "../constants";
import type { AiSuggestion } from "../types";

interface AiSuggestionCardProps {
 suggestion?: AiSuggestion;
}

export function AiSuggestionCard({ suggestion = AI_SUGGESTION }: AiSuggestionCardProps) {
 return (
 <div className="group relative overflow-hidden rounded-xl bg-white border border-slate-100 p-5 hover:border-slate-200 hover:shadow-sm transition-all duration-300 w-full">
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
 <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-50 text-xs font-medium text-slate-500 border border-slate-200">
 Thời gian: {suggestion?.estimated || "15 phút"}
 </span>
 </div>
 </div>

 {/* Message Content */}
 <p className="text-sm sm:text-base font-semibold text-slate-900 tracking-tight leading-snug group-hover:text-blue-600 transition-colors duration-200">
 {suggestion?.message || "Chúng tôi nhận thấy bạn vừa dành 20 phút xử lý vướng mắc về Hydration errors. Hãy thử ôn tập chuyên sâu học phần Server vs Client Leaf Node Components nhé!"}
 </p>

 <div className="flex items-center gap-2 text-xs text-slate-500 font-normal bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
 <span className="text-blue-600 font-semibold">Lý do đề xuất:</span>
 <span>{suggestion?.reason || "Điểm kiểm tra kỹ năng State & Client Components lần trước là 58%."}</span>
 </div>

 {/* Compact Interactive Actions */}
 <div className="flex flex-wrap items-center gap-3 pt-1">
 <Link
 href={suggestion?.action_url || "/courses/lesson"}
 className="inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-lg text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-200 text-decoration-none shadow-sm"
 >
 <span>{suggestion?.action_text || "Vào bài ôn tập ngay"}</span>
 </Link>

 <Link
 href="/study-plan"
 className="py-2.5 px-4 rounded-lg text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all text-decoration-none shadow-sm"
 >
 Cấu hình mục tiêu AI
 </Link>
 </div>
 </div>
 </div>
 </div>
 );
}
