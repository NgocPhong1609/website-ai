import { UPCOMING_PAYMENT } from "../constants";
import { RefreshIcon } from "./icons";

// ─── Upcoming Payment Card ────────────────────────────────────────────────────

export function UpcomingPaymentCard() {
  const { amount, dueDate, plan } = UPCOMING_PAYMENT;

  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#6B6BFF] to-[#4648D4] p-5 flex flex-col gap-3 text-white relative overflow-hidden shadow-[0_8px_32px_rgba(107,107,255,0.45)] min-w-[200px]">
      {/* Decorative circles */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5" />
      <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/5" />

      {/* Label */}
      <p className="relative text-[10px] font-bold uppercase tracking-[0.15em] text-white/70">
        Upcoming Payment
      </p>

      {/* Amount */}
      <div className="relative">
        <p className="text-4xl font-extrabold tracking-tight leading-none">
          ${amount.toFixed(2)}
        </p>
        <p className="text-xs text-white/70 mt-1.5">Due on {dueDate}</p>
      </div>

      {/* Divider */}
      <div className="relative h-px bg-white/20" />

      {/* Plan name */}
      <div className="relative flex items-center gap-2">
        <RefreshIcon size={13} />
        <p className="text-xs font-medium text-white/90">{plan}</p>
      </div>
    </div>
  );
}
