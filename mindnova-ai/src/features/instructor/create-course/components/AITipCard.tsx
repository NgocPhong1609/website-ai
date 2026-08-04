import React from "react";
import { SparklesIcon, PlusIcon } from "./icons";
import { AI_TIP } from "../constants";

export function AITipCard() {
  return (
    <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-3.5 flex flex-col gap-2 shadow-2xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[#4F46E5]">
          <span className="animate-pulse">
            <SparklesIcon size={14} />
          </span>
          <span className="text-xs font-black uppercase tracking-wider">Gợi ý từ AI MindNova</span>
        </div>

        <button
          type="button"
          onClick={() => alert("Đang tạo lời khuyên mới từ AI...")}
          aria-label="Tạo gợi ý mới"
          className="w-6 h-6 rounded-lg flex items-center justify-center text-indigo-400 hover:text-[#4F46E5] hover:bg-indigo-100/60 transition-all cursor-pointer"
        >
          <PlusIcon size={12} />
        </button>
      </div>

      <p className="text-[11px] font-medium text-gray-600 leading-relaxed italic">
        {AI_TIP}
      </p>
    </div>
  );
}