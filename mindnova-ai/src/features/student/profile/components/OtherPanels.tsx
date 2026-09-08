"use client";

import { useState, useEffect } from "react";
import { axiosClient } from "@/src/shared/lib/axios";
import { MonitorIcon } from "./icons";
import toast from "react-hot-toast";

function ActiveSessionsBox() {
 return (
 <div className="mt-4 p-4 rounded-xl bg-transparent border border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
 <div className="flex items-start gap-3.5">
 <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/5 text-primary shrink-0">
 <MonitorIcon />
 </div>
 <div className="space-y-1">
 <p className="text-sm font-semibold text-foreground leading-tight">Quản lý Thiết bị &amp; Phiên Đăng nhập</p>
 <p className="text-xs font-normal text-muted-foreground leading-relaxed">Phát hiện 2 trình duyệt/thiết bị đang duy trì kết nối an toàn với tài khoản này.</p>
 </div>
 </div>
 
 <button
 type="button"
 onClick={() => toast.error("Hệ thống an ninh ghi nhận: Không có truy cập bất thường nào từ các thiết bị lạ.")}
 className="shrink-0 px-4 py-2 rounded-full bg-transparent hover:bg-muted text-xs font-semibold text-primary transition-all duration-200 cursor-pointer focus:outline-none"
 >
 Kiểm tra nhật ký kết nối
 </button>
 </div>
 );
}

export function SecurityPanel() {
 const [currentPw, setCurrentPw] = useState("");
 const [newPw, setNewPw] = useState("");
 const [confirmPw, setConfirmPw] = useState("");
 const [updated, setUpdated] = useState(false);

 const canSave = currentPw.length > 0 && newPw.length >= 6 && newPw === confirmPw;

 async function handleUpdate() {
 if (!canSave) return;

 try {
 await axiosClient.post("/api/profile/change-password", {
 current_password: currentPw,
 new_password: newPw,
 new_password_confirmation: confirmPw,
 });

 setUpdated(true);
 setTimeout(() => {
 setUpdated(false);
 setCurrentPw("");
 setNewPw("");
 setConfirmPw("");
 }, 2500);
 } catch (error: any) {
 const message = error?.response?.data?.message || error?.response?.data?.errors?.new_password?.[0] || "Không thể đổi mật khẩu. Vui lòng thử lại.";
 toast(message);
 }
 }

 return (
 <div className="flex flex-col gap-6">
 <div className="pb-2 flex items-center justify-between">
 <div>
 <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">Bảo mật &amp; Mật khẩu</h2>
 <p className="text-xs sm:text-sm font-normal text-muted-foreground mt-1.5 leading-relaxed">
 Quản lý khóa bảo vệ riêng tư và theo dõi các phiên kết nối thiết bị của bạn.
 </p>
 </div>
 <span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
 Bảo mật chuẩn SSL 256-bit
 </span>
 </div>

 <div className="flex flex-col gap-5 max-w-lg">
 {[
 { id: "current-pw", label: "Mật khẩu hiện tại", value: currentPw, set: setCurrentPw, placeholder: "Nhập mật khẩu đang sử dụng..." },
 { id: "new-pw", label: "Mật khẩu mới", value: newPw, set: setNewPw, placeholder: "Tối thiểu 6 ký tự mật khẩu mạnh..." },
 { id: "confirm-pw", label: "Xác nhận mật khẩu mới", value: confirmPw, set: setConfirmPw, placeholder: "Nhập lại mật khẩu mới vừa đặt..." },
 ].map(({ id, label, value, set, placeholder }) => (
 <div key={id}>
 <label htmlFor={id} className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1.5">
 {label}
 </label>
 <input
 id={id}
 type="password"
 value={value}
 onChange={(e) => set(e.target.value)}
 placeholder={placeholder}
 className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm font-normal text-foreground bg-transparent border border-border/60 focus:border-primary focus:bg-primary/5 focus:outline-none transition-all duration-200"
 />
 </div>
 ))}

 {newPw.length > 0 && newPw !== confirmPw && (
 <p className="text-xs font-medium text-primary bg-primary/5 px-3 py-2 rounded-xl flex items-center gap-1.5">
 <span>️</span>
 <span>Mật khẩu xác nhận chưa trùng khớp với mật khẩu mới.</span>
 </p>
 )}

 <div className="flex justify-end pt-4">
 <button
 type="button"
 onClick={handleUpdate}
 disabled={!canSave && !updated}
 className="px-8 py-2.5 rounded-full text-sm font-medium text-primary-foreground bg-primary hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer flex items-center gap-2"
 >
 <span>{updated ? "Đã cập nhật mật khẩu an toàn!" : "Cập nhật Mật khẩu"}</span>
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
 description: "Cho phép Trợ lý Nova AI phân tích chuyên sâu và chủ động điều chỉnh syllabus.", 
 value: aiSuggestions, 
 handler: handleAiSuggestionsToggle 
 },
 ];

 if (isLoading) {
 return (
 <div className="flex flex-col gap-6">
 <div className="pb-2">
 <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">Cài đặt Thông báo &amp; Hệ thống</h2>
 <p className="text-xs sm:text-sm font-normal text-muted-foreground mt-1.5 leading-relaxed">
 Tùy biến trải nghiệm rèn luyện trực tuyến và các kênh tương tác của hệ thống.
 </p>
 </div>
 <div className="animate-pulse">
 {[1, 2, 3].map((i) => (
 <div key={i} className="h-16 bg-muted/50 rounded-xl mb-2" />
 ))}
 </div>
 </div>
 );
 }

 return (
 <div className="flex flex-col gap-6">
 <div className="pb-2">
 <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">Cài đặt Thông báo &amp; Hệ thống</h2>
 <p className="text-xs sm:text-sm font-normal text-muted-foreground mt-1.5 leading-relaxed">
 Tùy biến trải nghiệm rèn luyện trực tuyến và các kênh tương tác của hệ thống.
 </p>
 </div>

 <div className="flex flex-col">
 {toggles.map(({ id, label, description, value, handler }) => (
 <div
 key={id}
 onClick={handler}
 className={`group flex items-center justify-between gap-4 py-4 border-b border-border/40 last:border-0 hover:bg-muted/30 transition-all duration-200 px-2 sm:px-4 rounded-xl ${isSaving ? "opacity-75 cursor-not-allowed" : "cursor-pointer"}`}
 >
 <div className="space-y-1">
 <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{label}</p>
 <p className="text-xs font-normal text-muted-foreground leading-relaxed">{description}</p>
 </div>
 <button
 type="button"
 role="switch"
 aria-checked={value}
 onClick={(e) => {
 e.stopPropagation();
 handler();
 }}
 disabled={isSaving}
 className={`relative w-12 h-6.5 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 shrink-0 ${isSaving ? "cursor-not-allowed" : "cursor-pointer"} ${
 value ? " bg-primary " : "bg-muted-foreground/30"
 }`}
 >
 <span
 className={`absolute top-1 left-1 w-4.5 h-4.5 rounded-full bg-card shadow-sm transition-transform duration-200 ${
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
