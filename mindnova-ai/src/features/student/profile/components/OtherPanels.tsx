"use client";

import { useState } from "react";
import { axiosClient } from "@/src/shared/lib/axios";
import { MonitorIcon } from "./icons";

function ActiveSessionsBox() {
  return (
    <div className="mt-2 rounded-2xl border border-[#EAEAF4] bg-[#F8FAFC] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
      <div className="flex items-start gap-3.5">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#5052EE] border border-[#5052EE]/15 shrink-0 shadow-2xs">
          <MonitorIcon />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-[#1A1A2E] leading-tight">Quản lý Thiết bị &amp; Phiên Đăng nhập</p>
          <p className="text-xs font-normal text-[#64647A] leading-relaxed">Phát hiện 2 trình duyệt/thiết bị đang duy trì kết nối an toàn với tài khoản này.</p>
        </div>
      </div>
      
      <button
        type="button"
        onClick={() => alert("Hệ thống an ninh ghi nhận: Không có truy cập bất thường nào từ các thiết bị lạ.")}
        className="shrink-0 px-4 py-2 rounded-xl bg-white hover:bg-[#EEF2FF] border border-[#EAEAF4] hover:border-[#5052EE]/30 text-xs font-semibold text-[#5052EE] transition-all duration-200 shadow-2xs cursor-pointer focus:outline-none"
      >
        Kiểm tra nhật ký kết nối
      </button>
    </div>
  );
}

export function SecurityPanel() {
  const [step, setStep] = useState<"REQUEST" | "VERIFY" | "SUCCESS">("REQUEST");
  const [otp, setOtp] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const canSave = otp.length >= 6 && newPw.length >= 6 && newPw === confirmPw;

  async function handleRequestOtp() {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await axiosClient.post("/api/profile/change-password/request-otp");
      setStep("VERIFY");
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || "Không thể gửi OTP.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUpdate() {
    if (!canSave) return;
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await axiosClient.post("/api/profile/change-password", {
        otp,
        new_password: newPw,
        new_password_confirmation: confirmPw,
      });
      setStep("SUCCESS");
      setTimeout(() => {
        setStep("REQUEST");
        setOtp("");
        setNewPw("");
        setConfirmPw("");
      }, 3000);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || "Đổi mật khẩu thất bại.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="border-b border-[#EAEAF4] pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-[#1A1A2E] tracking-normal">Bảo mật &amp; Mật khẩu</h2>
          <p className="text-xs sm:text-sm font-normal text-[#7878A0] mt-1 leading-relaxed">
            Quản lý khóa bảo vệ riêng tư và theo dõi các phiên kết nối thiết bị của bạn.
          </p>
        </div>
        <span className="hidden sm:inline-flex px-3 py-1 rounded-xl bg-[#EAF8F5] text-[#0D9488] border border-[#0D9488]/20 text-xs font-medium">
          🛡️ Bảo mật chuẩn SSL 256-bit
        </span>
      </div>

      <div className="flex flex-col gap-5 max-w-lg">
        {errorMsg && (
          <div className="p-3 rounded-xl text-xs font-medium bg-red-50 text-red-600 border border-red-200">
            {errorMsg}
          </div>
        )}

        {step === "REQUEST" && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-[#4A4A68]">Để đảm bảo an toàn, chúng tôi sẽ gửi mã OTP đến email của bạn trước khi đổi mật khẩu.</p>
            <button
              type="button"
              onClick={handleRequestOtp}
              disabled={isLoading}
              className="w-fit px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#5052EE] via-[#6063EE] to-[#0D9488] shadow-sm hover:opacity-95 disabled:opacity-50"
            >
              {isLoading ? "Đang gửi..." : "Gửi mã OTP qua Email"}
            </button>
          </div>
        )}

        {step === "VERIFY" && (
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-[#4A4A68] mb-1.5">Mã OTP (gửi qua email)</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#F8FAFC] focus:bg-white border border-[#E4E6F0] focus:border-[#5052EE] shadow-2xs focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-[#4A4A68] mb-1.5">Mật khẩu mới</label>
              <input
                type="password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="Tối thiểu 6 ký tự..."
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#F8FAFC] focus:bg-white border border-[#E4E6F0] focus:border-[#5052EE] shadow-2xs focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-[#4A4A68] mb-1.5">Xác nhận mật khẩu mới</label>
              <input
                type="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                placeholder="Nhập lại mật khẩu..."
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#F8FAFC] focus:bg-white border border-[#E4E6F0] focus:border-[#5052EE] shadow-2xs focus:outline-none transition-all"
              />
            </div>

            {newPw.length > 0 && newPw !== confirmPw && (
              <p className="text-xs font-medium text-[#EF4444] bg-[#FEE2E2] px-3 py-2 rounded-xl border border-[#EF4444]/20">
                ⚠️ Mật khẩu xác nhận chưa trùng khớp.
              </p>
            )}

            <div className="flex justify-end pt-2 border-t border-[#F0F2FA] gap-3">
              <button
                type="button"
                onClick={() => setStep("REQUEST")}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-[#4A4A68] hover:bg-[#F8FAFC]"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleUpdate}
                disabled={!canSave || isLoading}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#5052EE] via-[#6063EE] to-[#0D9488] shadow-sm hover:opacity-95 disabled:opacity-50"
              >
                {isLoading ? "Đang xử lý..." : "Đổi mật khẩu"}
              </button>
            </div>
          </div>
        )}

        {step === "SUCCESS" && (
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 flex items-center gap-3">
            <span className="text-xl">✅</span>
            <span className="text-sm font-semibold text-emerald-700">Mật khẩu đã được thay đổi thành công!</span>
          </div>
        )}
      </div>

      <hr className="border-t border-[#EAEAF4] mt-1" />

      <ActiveSessionsBox />
    </div>
  );
}

export function SettingsPanel() {
  const [notifications, setNotifications] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState(true);

  const toggles = [
    { id: "notif",  label: "Thông báo qua Email",       description: "Nhận thông báo cập nhật khoá học mới và lời nhắc học tập mỗi ngày.", value: notifications, set: setNotifications },
    { id: "weekly", label: "Báo cáo Tiến độ Hàng tuần",  description: "Tự động nhận bản tóm tắt thống kê chuyên cần và hiệu suất vào mỗi cuối tuần.", value: weeklyReport,   set: setWeeklyReport   },
    { id: "ai-sug", label: "Gợi ý AI Cá nhân hoá",      description: "Cho phép Trợ lý Nova AI phân tích chuyên sâu và chủ động điều chỉnh syllabus.", value: aiSuggestions,  set: setAiSuggestions  },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="border-b border-[#EAEAF4] pb-4">
        <h2 className="text-base sm:text-lg font-semibold text-[#1A1A2E] tracking-normal">Cài đặt Thông báo &amp; Hệ thống</h2>
        <p className="text-xs sm:text-sm font-normal text-[#7878A0] mt-1 leading-relaxed">
          Tùy biến trải nghiệm rèn luyện trực tuyến và các kênh tương tác của hệ thống.
        </p>
      </div>

      <div className="flex flex-col gap-3.5">
        {toggles.map(({ id, label, description, value, set }) => (
          <div
            key={id}
            onClick={() => set(!value)}
            className="group flex items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border border-[#E2E4F0] bg-[#F8FAFC]/70 hover:bg-white transition-all duration-200 shadow-2xs hover:shadow-sm cursor-pointer"
          >
            <div className="space-y-1">
              <p className="text-sm font-semibold text-[#1A1A2E] group-hover:text-[#5052EE] transition-colors">{label}</p>
              <p className="text-xs font-normal text-[#64647A] leading-relaxed">{description}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={value}
              onClick={(e) => {
                e.stopPropagation();
                set(!value);
              }}
              className={`relative w-12 h-6.5 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#5052EE]/30 shrink-0 cursor-pointer ${
                value ? "bg-gradient-to-r from-[#5052EE] via-[#6063EE] to-[#0D9488]" : "bg-[#CBD5E1]"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4.5 h-4.5 rounded-full bg-white shadow-md transition-transform duration-200 ${
                  value ? "translate-x-5.5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
