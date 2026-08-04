import { ShieldIcon, LockIcon } from "./icons";

// ─── Security Footer ──────────────────────────────────────────────────────────

export function BillingFooter() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-3 py-4 rounded-2xl bg-[#F8FAFC]/80 border border-[#EAEAF4] mt-2 text-xs text-[#7878A0]">
      {/* Security badges with gentle typography */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-[#64647A]">
          <ShieldIcon size={14} />
          <span className="font-medium">
            Thanh toán An toàn &amp; Bảo mật
          </span>
        </div>
        <div className="flex items-center gap-2 text-[#64647A]">
          <LockIcon size={14} />
          <span className="font-medium">
            Mã hóa Tiêu chuẩn 256-bit SSL
          </span>
        </div>
      </div>

      {/* Support link */}
      <p className="font-normal">
        Bạn cần trợ giúp về hóa đơn?{" "}
        <button
          type="button"
          onClick={() => alert("Chuyên viên tài chính của MindNova đang sẵn sàng hỗ trợ bạn 24/7 qua Live Chat!")}
          className="font-semibold text-[#5052EE] hover:text-[#4648D4] underline underline-offset-2 transition-colors duration-150 cursor-pointer focus:outline-none"
        >
          Liên hệ Trung tâm Hỗ trợ
        </button>
      </p>
    </div>
  );
}
