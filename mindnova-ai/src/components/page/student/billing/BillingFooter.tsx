import { ShieldIcon, LockIcon } from "./icons";

// ─── Security Footer ──────────────────────────────────────────────────────────

export function BillingFooter() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-2 py-1">
      {/* Security badges */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-1.5 text-[#9090B0]">
          <ShieldIcon size={13} />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9090B0]">
            Secure Checkout
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[#9090B0]">
          <LockIcon size={13} />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9090B0]">
            256-bit SSL
          </span>
        </div>
      </div>

      {/* Support link */}
      <p className="text-[11px] text-[#9090B0]">
        Need help with billing?{" "}
        <a
          href="/support"
          className="font-semibold text-[#6B6BFF] hover:text-[#4648D4] underline underline-offset-2 transition-colors duration-150"
        >
          Contact Support
        </a>
      </p>
    </div>
  );
}
