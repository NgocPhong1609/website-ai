import { ShieldIcon, LockIcon } from "./icons";
import toast from "react-hot-toast";

// ─── Security Footer ──────────────────────────────────────────────────────────

export function BillingFooter() {
 return (
 <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-3 py-4 rounded-2xl bg-[#F8FAFC]/80 border border-[#e2e8f0] mt-2 text-xs text-[#64748b]">
 {/* Security badges with gentle typography */}
 <div className="flex items-center gap-6">
 <div className="flex items-center gap-2 text-[#64748b]">
 <ShieldIcon size={14} />
 <span className="font-medium">
 Thanh toán An toàn &amp; Bảo mật
 </span>
 </div>
 <div className="flex items-center gap-2 text-[#64748b]">
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
 onClick={() => toast("Chuyên viên tài chính của MindNova đang sẵn sàng hỗ trợ bạn 24/7 qua Live Chat!")}
 className="font-semibold text-[#2563eb] hover:text-[#2563eb] underline underline-offset-2 transition-colors duration-150 cursor-pointer focus:outline-none"
 >
 Liên hệ Trung tâm Hỗ trợ
 </button>
 </p>
 </div>
 );
}
