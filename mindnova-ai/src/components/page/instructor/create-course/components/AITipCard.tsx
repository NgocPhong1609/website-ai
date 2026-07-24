// ─── AITipCard ─────────────────────────────────────────────────────────────────
// Ambient AI suggestion card displayed below the thumbnail uploader.

import { SparklesIcon, PlusIcon } from "./icons";
import { AI_TIP } from "../constants";

export function AITipCard() {
  return (
    <div className="rounded-xl border border-[#DDD8FF] bg-gradient-to-br from-[#F5F3FF] to-[#EEF0FF] p-4 flex flex-col gap-2.5">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#6B6BFF]">
          {/* Animated sparkle icon */}
          <span className="animate-pulse">
            <SparklesIcon size={14} />
          </span>
          <span className="text-[12px] font-semibold">Gợi ý từ AI</span>
        </div>

        {/* Regenerate hint */}
        <button
          type="button"
          aria-label="Tạo gợi ý mới"
          className="w-6 h-6 rounded-md flex items-center justify-center text-[#9090B0] hover:text-[#6B6BFF] hover:bg-white/70 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#6B6BFF]/30"
        >
          <PlusIcon size={12} />
        </button>
      </div>

      {/* Tip text */}
      <p className="text-[12px] text-[#5A5A8A] leading-relaxed italic">
        {AI_TIP}
      </p>
    </div>
  );
}
