// ─── RevenueCard ──────────────────────────────────────────────────────────────
// Monthly revenue summary card shown next to the AI banner.

import { TrendUpIcon } from "./icons";
import {
  MONTHLY_REVENUE,
  REVENUE_GROWTH,
} from "../constants/data";

export function RevenueCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#4648D4] to-[#6B6BFF] p-6 flex flex-col justify-between h-full min-h-[120px]">
      {/* Decorative blob */}
      <div
        aria-hidden="true"
        className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-white/10 blur-2xl pointer-events-none"
      />

      <div className="relative z-10 flex flex-col gap-3">
        <p className="text-white/70 text-xs font-medium uppercase tracking-widest">
          Tổng doanh thu tháng này
        </p>

        <p className="text-white text-3xl font-extrabold tracking-tight leading-none">
          {MONTHLY_REVENUE}
        </p>

        {/* Growth badge */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-400/20 border border-green-400/30 w-fit">
          <span className="text-green-300">
            <TrendUpIcon />
          </span>
          <span className="text-green-300 text-xs font-semibold">
            {REVENUE_GROWTH}
          </span>
          <span className="text-white/50 text-xs">so với tháng trước</span>
        </div>
      </div>

      {/* Subtle decorative bar chart */}
      <div
        aria-hidden="true"
        className="absolute bottom-4 right-4 flex items-end gap-1 opacity-20"
      >
        {[40, 60, 45, 75, 55, 90, 70].map((h, i) => (
          <div
            key={i}
            className="w-2 rounded-sm bg-white"
            style={{ height: `${h * 0.5}px` }}
          />
        ))}
      </div>
    </div>
  );
}
