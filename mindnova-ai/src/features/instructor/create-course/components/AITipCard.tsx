import React from "react";
import { SparklesIcon, PlusIcon } from "./icons";
import { AI_TIP } from "../constants";

export function AITipCard() {
 return (
 <div className="rounded-xl border -[#FAF7F2] bg-indigo-50/50 p-3.5 flex flex-col gap-2 shadow-2xs">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-1.5 text-[#C0392B]">
 <span className="animate-pulse">
 <SparklesIcon size={14} />
 </span>
 <span className="text-xs font-black uppercase tracking-wider">Gợi ý từ AI MindNova</span>
 </div>

 <button
 type="button"
 onClick={() => alert("Đang tạo lời khuyên mới từ AI...")}
 aria-label="Tạo gợi ý mới"
 className="w-6 h-6 rounded-lg flex items-center justify-center -[#C0392B] hover:text-[#C0392B] hover:-[#FAF7F2]/60 transition-all cursor-pointer"
 >
 <PlusIcon size={12} />
 </button>
 </div>

 <p className="text-[11px] font-medium text-[#8A8478] leading-relaxed italic">
 {AI_TIP}
 </p>
 </div>
 );
}