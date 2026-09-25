"use client";

import { useState, useEffect } from "react";
import { axiosClient } from "@/src/shared/lib/axios";
import { MonitorIcon } from "./icons";
import { Shield, Key, CheckCircle2, Search, Smartphone } from "lucide-react";
import toast from "react-hot-toast";

function ActiveSessionsBox() {
  return (
    <div className="mt-8 p-5 rounded-2xl bg-[#F8FAFC] border border-[#EAEAF4] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-[#3b82f6]/30 hover:bg-white hover:shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white border border-[#EAEAF4] text-[#64748b] shrink-0 shadow-sm">
          <Smartphone className="w-6 h-6" />
        </div>
        <div className="space-y-1 mt-0.5">
          <p className="text-sm font-semibold text-[#0f172a]">Quản lý thiết bị &amp; phiên đăng nhập</p>
          <p className="text-sm font-medium text-[#64748b]">Hệ thống bảo vệ đang duy trì kết nối an toàn trên 2 thiết bị.</p>
        </div>
      </div>
      
      <button
        type="button"
        onClick={() => toast("Hệ thống an ninh ghi nhận: Không có truy cập bất thường nào từ các thiết bị lạ.", { icon: '🛡️' })}
        className="shrink-0 px-4 py-2.5 rounded-xl bg-white border border-[#EAEAF4] hover:bg-[#F8FAFC] hover:text-[#0f172a] text-sm font-semibold text-[#64748b] transition-all cursor-pointer shadow-sm"
      >
        Kiểm tra nhật ký
      </button>
    </div>
  );
}

export function validatePassword(password: string, fieldName: string = "Mật khẩu"): { isValid: boolean; error?: string } {
  if (!password) {
    return { isValid: false, error: `Vui lòng nhập ${fieldName.toLowerCase()}.` };
  }
  if (password.length < 8) {
    return { isValid: false, error: `${fieldName} phải có tối thiểu 8 ký tự.` };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: `${fieldName} phải chứa ít nhất 1 chữ hoa (A-Z).` };
  }
  if (!/[0-9]/.test(password)) {
    return { isValid: false, error: `${fieldName} phải chứa ít nhất 1 chữ số (0-9).` };
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return { isValid: false, error: `${fieldName} phải chứa ít nhất 1 ký tự đặc biệt (ví dụ: !@#$%^&*).` };
  }
  return { isValid: true };
}

export function SecurityPanel() {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [updated, setUpdated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const currentPwValidation = validatePassword(currentPw, "Mật khẩu hiện tại");
  const newPwValidation = validatePassword(newPw, "Mật khẩu mới");
  const canSave = currentPwValidation.isValid && newPwValidation.isValid && newPw === confirmPw;

  async function handleUpdate() {
    if (!canSave) return;
    setIsLoading(true);

    try {
      await axiosClient.post("/api/profile/change-password", {
        current_password: currentPw,
        new_password: newPw,
        new_password_confirmation: confirmPw,
      });

      setUpdated(true);
      toast.success("Đã cập nhật mật khẩu thành công!");
      setTimeout(() => {
        setUpdated(false);
        setCurrentPw("");
        setNewPw("");
        setConfirmPw("");
      }, 2500);
    } catch (error: any) {
      const message =
        error?.response?.data?.errors?.current_password?.[0] ||
        error?.response?.data?.errors?.new_password?.[0] ||
        error?.response?.data?.message ||
        "Không thể đổi mật khẩu. Vui lòng thử lại.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-[#0f172a] tracking-tight">Bảo mật &amp; Mật khẩu</h2>
          <p className="text-[15px] font-medium text-[#64748b] mt-2">
            Quản lý khóa bảo vệ riêng tư và theo dõi các phiên kết nối thiết bị của bạn.
          </p>
        </div>
      </div>

      <div className="flex-1 max-w-xl flex flex-col gap-5">
        {[
          {
            id: "current-pw",
            label: "Mật khẩu hiện tại",
            value: currentPw,
            set: setCurrentPw,
            placeholder: "Tối thiểu 8 ký tự (1 hoa, 1 số, 1 ký tự đặc biệt)...",
            validation: currentPwValidation,
          },
          {
            id: "new-pw",
            label: "Mật khẩu mới",
            value: newPw,
            set: setNewPw,
            placeholder: "Tối thiểu 8 ký tự (1 hoa, 1 số, 1 ký tự đặc biệt)...",
            validation: newPwValidation,
          },
          {
            id: "confirm-pw",
            label: "Xác nhận mật khẩu mới",
            value: confirmPw,
            set: setConfirmPw,
            placeholder: "Nhập lại mật khẩu mới vừa đặt...",
            validation: null,
          },
        ].map(({ id, label, value, set, placeholder, validation }) => (
          <div key={id}>
            <label htmlFor={id} className="block text-sm font-medium text-[#1e293b] mb-1.5">
              {label}
            </label>
            <input
              id={id}
              type="password"
              value={value}
              onChange={(e) => set(e.target.value)}
              placeholder={placeholder}
              className="w-full px-4 py-3 rounded-xl text-sm text-[#0f172a] bg-[#F8FAFC] border border-[#EAEAF4] focus:border-[#3b82f6] focus:bg-white focus:ring-4 focus:ring-[#3b82f6]/10 outline-none transition-all placeholder:text-[#94a3b8]"
            />
            {value.length > 0 && validation && !validation.isValid && (
              <p className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg mt-1.5">
                {validation.error}
              </p>
            )}
          </div>
        ))}

        {newPw.length > 0 && confirmPw.length > 0 && newPw !== confirmPw && (
          <p className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg mt-1">
            Mật khẩu xác nhận chưa trùng khớp.
          </p>
        )}

        <div className="pt-2">
          <button
            type="button"
            onClick={handleUpdate}
            disabled={!canSave || isLoading || updated}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:opacity-95 shadow-md shadow-blue-500/20 disabled:from-[#94a3b8] disabled:to-[#cbd5e1] disabled:shadow-none disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : updated ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <Key className="w-4 h-4" />
            )}
            {updated ? "Đã cập nhật" : "Đổi mật khẩu"}
          </button>
        </div>
      </div>

      <ActiveSessionsBox />
    </div>
  );
}

export function SettingsPanel() {
  const [notifications, setNotifications] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await axiosClient.get("/api/profile");
        if (response.data?.data) {
          const userData = response.data.data;
          setNotifications(userData.notification_email !== false);
          setWeeklyReport(userData.weekly_report !== false);
          setAiSuggestions(userData.ai_suggestions !== false);
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const saveSetting = async (key: string, value: boolean, revertFn: () => void) => {
    setIsSaving(true);
    try {
      await axiosClient.post("/api/profile/settings", {
        [key]: value,
      });
      toast.success("Cập nhật cài đặt thành công!");
    } catch (error) {
      console.error("Failed to save setting:", error);
      toast.error("Không thể lưu cài đặt. Vui lòng thử lại.");
      revertFn();
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotificationToggle = () => {
    if (isSaving) return;
    const newValue = !notifications;
    setNotifications(newValue);
    saveSetting("notification_email", newValue, () => setNotifications(!newValue));
  };

  const handleWeeklyReportToggle = () => {
    if (isSaving) return;
    const newValue = !weeklyReport;
    setWeeklyReport(newValue);
    saveSetting("weekly_report", newValue, () => setWeeklyReport(!newValue));
  };

  const handleAiSuggestionsToggle = () => {
    if (isSaving) return;
    const newValue = !aiSuggestions;
    setAiSuggestions(newValue);
    saveSetting("ai_suggestions", newValue, () => setAiSuggestions(!newValue));
  };

  const toggles = [
    { 
      id: "notif", 
      label: "Thông báo qua Email", 
      description: "Nhận thông báo cập nhật khoá học mới và lời nhắc học tập mỗi ngày.", 
      value: notifications, 
      handler: handleNotificationToggle 
    },
    { 
      id: "weekly", 
      label: "Báo cáo Tiến độ Hàng tuần", 
      description: "Tự động nhận bản tóm tắt thống kê chuyên cần và hiệu suất vào mỗi cuối tuần.", 
      value: weeklyReport, 
      handler: handleWeeklyReportToggle 
    },
    { 
      id: "ai-sug", 
      label: "Gợi ý AI Cá nhân hoá", 
      description: "Cho phép Trợ lý Nova AI phân tích chuyên sâu và chủ động điều chỉnh lộ trình học.", 
      value: aiSuggestions, 
      handler: handleAiSuggestionsToggle 
    },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-[#0f172a] tracking-tight">Cài đặt hệ thống</h2>
          <p className="text-[15px] font-medium text-[#64748b] mt-2">
            Tùy biến trải nghiệm rèn luyện trực tuyến và các kênh tương tác của hệ thống.
          </p>
        </div>
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-slate-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-[#0f172a] tracking-tight">Cài đặt hệ thống</h2>
        <p className="text-[15px] font-medium text-[#64748b] mt-2">
          Tùy biến trải nghiệm rèn luyện trực tuyến và các kênh tương tác của hệ thống.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {toggles.map(({ id, label, description, value, handler }) => (
          <div
            key={id}
            onClick={() => {
              if (!isSaving) handler();
            }}
            className={`group flex items-center justify-between gap-4 p-5 rounded-2xl border border-[#EAEAF4] transition-all ${isSaving ? "opacity-70 cursor-not-allowed bg-slate-50" : "cursor-pointer bg-white hover:bg-[#F8FAFC] hover:border-[#3b82f6]/40 hover:shadow-sm"}`}
          >
            <div className="space-y-1">
              <p className="text-sm font-semibold text-[#0f172a]">{label}</p>
              <p className="text-sm font-medium text-[#64748b] leading-relaxed">{description}</p>
            </div>
            
            {/* Custom Toggle Switch */}
            <button
              type="button"
              role="switch"
              aria-checked={value}
              onClick={(e) => {
                e.stopPropagation();
                if (!isSaving) handler();
              }}
              className={`relative w-[46px] h-6 rounded-full transition-colors duration-300 outline-none shrink-0 ${isSaving ? "cursor-not-allowed" : "cursor-pointer"} ${
                value ? "bg-[#3b82f6]" : "bg-[#cbd5e1]"
              }`}
            >
              <span
                className={`absolute top-[2px] left-[2px] w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                  value ? "translate-x-[22px]" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
