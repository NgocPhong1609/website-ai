// ─── RevenueCard ──────────────────────────────────────────────────────────────
// Monthly revenue summary card shown next to the AI banner (Minimalist Rule #7)

import Link from "next/link";
import { TrendUpIcon } from "./icons";
import { MONTHLY_REVENUE, REVENUE_GROWTH } from "./constants/data";

export function RevenueCard() {
  return (
    <div className="rounded-2xl bg-white border border-gray-200 p-6 flex flex-col justify-between h-full min-h-[120px] shadow-2xs">
      <div className="flex flex-col gap-2">
        <p className="text-[#6B7280] text-[11px] font-extrabold uppercase tracking-widest">
          Doanh thu tháng này
        </p>

        <p className="text-[#111827] text-2xl font-black tracking-tight mt-1">
          {MONTHLY_REVENUE}
        </p>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-100 w-fit mt-1">
          <span className="text-emerald-600 font-bold">
            <TrendUpIcon />
          </span>
          <span className="text-emerald-700 text-[12px] font-bold">
            +{REVENUE_GROWTH}
          </span>
          <span className="text-[#6B7280] text-[11px] font-medium">so với tháng trước</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
        <span className="text-[#6B7280] font-medium">Trạng thái: Ổn định</span>
        <Link href="/instructor/revenue" className="text-[#4F46E5] font-bold hover:underline cursor-pointer">
          Chi tiết ➔
        </Link>
      </div>
    </div>
  );
}