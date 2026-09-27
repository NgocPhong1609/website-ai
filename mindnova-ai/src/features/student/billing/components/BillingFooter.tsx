import toast from "react-hot-toast";
import { Shield } from "lucide-react";

// ─── Security Footer ──────────────────────────────────────────────────────────

export function BillingFooter() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-3 py-4 rounded-xl bg-slate-50/80 border border-slate-200 mt-2 text-xs text-slate-500">
      {/* Security badges with gentle typography */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-slate-500">
          <Shield size={14} />
          <span className="font-medium">
            Thanh toán An toàn &amp; Bảo mật
          </span>
        </div>
      </div>

      {/* Support link */}
      <p className="font-normal">
        Bạn cần trợ giúp về hóa đơn?{" "}
        <button
          type="button"
          onClick={() => toast("Chuyên viên tài chính của MindNova đang sẵn sàng hỗ trợ bạn 24/7 qua Live Chat!")}
          className="font-semibold text-blue-600 hover:text-blue-600 underline underline-offset-2 transition-colors duration-150 cursor-pointer focus:outline-none"
        >
          Liên hệ Trung tâm Hỗ trợ
        </button>
      </p>
    </div>
  );
}
