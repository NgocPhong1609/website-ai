"use client";

import { MonitorIcon, TrashIcon } from "./icons";

function ActiveSessionsCard() {
 return (
 <div className="flex-1 min-w-0 rounded-2xl border border-[#E8E2D9] bg-white p-5 flex flex-col gap-3 shadow-2xs hover:shadow-sm transition-shadow duration-200">
 <div className="flex items-start gap-3.5">
 <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#FAF7F2] text-[#C0392B] border border-[#C0392B]/15 shrink-0 shadow-2xs">
 <MonitorIcon />
 </div>
 <div className="flex-1 min-w-0 space-y-1">
 <p className="text-xs sm:text-sm font-bold text-[#2C3039] leading-snug">Thiết bị đang đăng nhập</p>
 <p className="text-xs text-[#8A8478] leading-relaxed">Phát hiện 2 thiết bị và trình duyệt đang truy cập hoạt động.</p>
 <button
 type="button"
 onClick={() => alert("Chức năng đang được tích hợp cùng trang quản trị bảo mật!")}
 className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#C0392B] hover:text-[#C0392B] hover:underline underline-offset-2 transition-colors duration-200 focus:outline-none cursor-pointer"
 >
 <span>Quản lý danh sách thiết bị</span>
 <span></span>
 </button>
 </div>
 </div>
 </div>
 );
}

function DeactivateAccountCard() {
 return (
 <div className="flex-1 min-w-0 rounded-2xl border border-[#EF4444]/20 from-[#FEF2F2]/80 via-white to-[#FEF2F2]/50 p-5 flex flex-col gap-3 shadow-2xs hover:shadow-sm transition-shadow duration-200">
 <div className="flex items-start gap-3.5">
 <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#FAF7F2] text-[#C0392B] border border-[#EF4444]/20 shrink-0 shadow-2xs">
 <TrashIcon />
 </div>
 <div className="flex-1 min-w-0 space-y-1">
 <p className="text-xs sm:text-sm font-bold text-[#2C3039] leading-snug">Vô hiệu hoá Tài khoản</p>
 <p className="text-xs text-[#8A8478] leading-relaxed">Hành động này sẽ tạm ngưng tiến trình học và không thể tự khôi phục.</p>
 <button
 type="button"
 onClick={() => alert("Vui lòng liên hệ hỗ trợ viên MindNova để thực hiện quy trình vô hiệu hoá an toàn.")}
 className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#C0392B] hover:text-[#C0392B] hover:underline underline-offset-2 transition-colors duration-200 focus:outline-none cursor-pointer"
 >
 <span>Bắt đầu yêu cầu</span>
 <span></span>
 </button>
 </div>
 </div>
 </div>
 );
}

export function AccountActionsRow() {
 return (
 <div className="flex flex-col sm:flex-row gap-6">
 <ActiveSessionsCard />
 <DeactivateAccountCard />
 </div>
 );
}
