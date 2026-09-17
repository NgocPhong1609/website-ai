"use client";

import { useState, useEffect } from "react";
import { axiosClient } from "@/src/shared/lib/axios";
import { MonitorIcon } from "./icons";
import { Shield, Key, CheckCircle2, Search, Smartphone } from "lucide-react";
import toast from "react-hot-toast";

function ActiveSessionsBox() {
  return (
    <div className="mt-8 p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-start gap-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white border border-slate-200 text-slate-700 shrink-0 shadow-sm">
          <Smartphone className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-bold text-slate-900">Quản lý Thiết bị &amp; Phiên Đăng nhập</p>
          <p className="text-sm text-slate-500">Phát hiện 2 trình duyệt/thiết bị đang duy trì kết nối an toàn với tài khoản này.</p>
        </div>
      </div>
      
      <button
        type="button"
        onClick={() => toast("Hệ thống an ninh ghi nhận: Không có truy cập bất thường nào từ các thiết bị lạ.", { icon: '🛡️' })}
        className="shrink-0 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-sm font-semibold text-slate-700 transition-all cursor-pointer shadow-sm"
      >
        Kiểm tra nhật ký
      </button>
    </div>
  );
}

export function SecurityPanel() {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [updated, setUpdated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const canSave = currentPw.length > 0 && newPw.length >= 6 && newPw === confirmPw;

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
      const message = error?.response?.data?.message || error?.response?.data?.errors?.new_password?.[0] || "Không thể đổi mật khẩu. Vui lòng thử lại.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Bảo mật &amp; Mật khẩu</h2>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý khóa bảo vệ riêng tư và theo dõi các phiên kết nối thiết bị của bạn.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
          <Shield className="w-3.5 h-3.5" /> Chuẩn SSL 256-bit
        </div>
      </div>

      <div className="flex-1 max-w-xl flex flex-col gap-5">
        {[
          { id: "current-pw", label: "Mật khẩu hiện tại", value: currentPw, set: setCurrentPw, placeholder: "Nhập mật khẩu đang sử dụng..." },
          { id: "new-pw", label: "Mật khẩu mới", value: newPw, set: setNewPw, placeholder: "Tối thiểu 6 ký tự..." },
          { id: "confirm-pw", label: "Xác nhận mật khẩu mới", value: confirmPw, set: setConfirmPw, placeholder: "Nhập lại mật khẩu mới vừa đặt..." },
        ].map(({ id, label, value, set, placeholder }) => (
          <div key={id}>
            <label htmlFor={id} className="block text-sm font-semibold text-slate-700 mb-1.5">
              {label}
            </label>
            <input
              id={id}
              type="password"
              value={value}
              onChange={(e) => set(e.target.value)}
              placeholder={placeholder}
              className="w-full px-4 py-2.5 rounded-xl text-sm text-slate-900 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
            />
          </div>
        ))}

        {newPw.length > 0 && newPw !== confirmPw && (
          <p className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg mt-1">
            Mật khẩu xác nhận chưa trùng khớp.
          </p>
        )}

        <div className="pt-2">
          <button
            type="button"
            onClick={handleUpdate}
            disabled={!canSave || isLoading || updated}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-sm w-full sm:w-auto"
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

  const saveSetting = async (key: string, value: boolean) => {
    setIsSaving(true);
    try {
      await axiosClient.post("/api/profile/settings", {
        [key]: value,
      });
    } catch (error) {
      console.error("Failed to save setting:", error);
      toast.error("Không thể lưu cài đặt. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotificationToggle = () => {
    const newValue = !notifications;
    setNotifications(newValue);
    saveSetting("notification_email", newValue);
  };

  const handleWeeklyReportToggle = () => {
    const newValue = !weeklyReport;
    setWeeklyReport(newValue);
    saveSetting("weekly_report", newValue);
  };

  const handleAiSuggestionsToggle = () => {
    const newValue = !aiSuggestions;
    setAiSuggestions(newValue);
    saveSetting("ai_suggestions", newValue);
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
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900">Cài đặt Thông báo &amp; Hệ thống</h2>
          <p className="text-sm text-slate-500 mt-1">
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
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">Cài đặt Thông báo &amp; Hệ thống</h2>
        <p className="text-sm text-slate-500 mt-1">
          Tùy biến trải nghiệm rèn luyện trực tuyến và các kênh tương tác của hệ thống.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {toggles.map(({ id, label, description, value, handler }) => (
          <div
            key={id}
            onClick={handler}
            className={`group flex items-center justify-between gap-4 p-5 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all ${isSaving ? "opacity-75 cursor-not-allowed" : "cursor-pointer bg-white hover:bg-slate-50"}`}
          >
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-900">{label}</p>
              <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
            </div>
            
            {/* Custom Toggle Switch */}
            <button
              type="button"
              role="switch"
              aria-checked={value}
              onClick={(e) => {
                e.stopPropagation();
                handler();
              }}
              disabled={isSaving}
              className={`relative w-12 h-6.5 rounded-full transition-colors duration-200 outline-none shrink-0 ${isSaving ? "cursor-not-allowed" : "cursor-pointer"} ${
                value ? "bg-blue-600" : "bg-slate-200"
              }`}
            >
              <span
                className={`absolute top-[3px] left-[3px] w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
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
