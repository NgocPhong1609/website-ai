"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Avatar } from "@/src/shared/components/ui/Avatar";
import { twMerge } from "tailwind-merge";
import { axiosClient } from "@/src/shared/lib/axios";
import { ArrowRight, Bell, Menu, MessageSquare, X } from "lucide-react";
import { useChatGlobalUnread } from "@/src/hooks/useChatGlobalUnread";

function UserAvatar() {
 const [user, setUser] = useState<any>(null);
 const [isDropdownOpen, setIsDropdownOpen] = useState(false);
 const dropdownRef = React.useRef<HTMLDivElement>(null);

 const loadUser = React.useCallback(() => {
 try {
 const userInfoRaw = window.localStorage.getItem("userInfo");
 if (userInfoRaw) {
 setUser(JSON.parse(userInfoRaw));
 }
 } catch (e) {
 console.error("Error parsing user info", e);
 }
 }, []);

 React.useEffect(() => {
 loadUser();
 window.addEventListener("user:updated", loadUser);
 window.addEventListener("storage", loadUser);
 return () => {
 window.removeEventListener("user:updated", loadUser);
 window.removeEventListener("storage", loadUser);
 };
 }, [loadUser]);

 React.useEffect(() => {
 const handleClickOutside = (event: MouseEvent) => {
 if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
 setIsDropdownOpen(false);
 }
 };
 document.addEventListener("mousedown", handleClickOutside);
 return () => document.removeEventListener("mousedown", handleClickOutside);
 }, []);

 const handleLogout = async () => {
 try {
 await axiosClient.post("/api/logout");
 } catch (error) {
 console.error("Logout API failed", error);
 } finally {
 window.localStorage.removeItem("accessToken");
 window.localStorage.removeItem("userInfo");
 document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
 document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
 window.location.replace("/login");
 }
 };

 const getInitial = (name: string) => {
 if (!name) return "U";
 return name.charAt(0).toUpperCase();
 };

 const name = user?.name || "Teacher";
 const avatarUrl = user?.avatar_url || user?.avatar || user?.profile_image || null;
 const initial = getInitial(name);

 return (
 <div className="relative" ref={dropdownRef}>
 <button 
 onClick={() => setIsDropdownOpen(!isDropdownOpen)}
 className="block focus:outline-none"
 >
 <Avatar src={avatarUrl} fallback={initial} size="sm" className="cursor-pointer hover:scale-105 transition-all shadow-sm shrink-0" />
 </button>

 {isDropdownOpen && (
 <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50">
 <Link
 href="/instructor/profile"
 onClick={() => setIsDropdownOpen(false)}
 className="block px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
 >
 Thông tin tài khoản
 </Link>
 <button
 onClick={handleLogout}
 className="w-full text-left px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
 >
 Đăng xuất
 </button>
 </div>
 )}
 </div>
 );
}

export interface AlertItem {
 id: string;
 title: string;
 desc: string;
 type: "urgent" | "info" | "security";
 timestamp: string;
 actionText?: string;
 actionHref?: string;
 read: boolean;
}

const INITIAL_ALERTS: AlertItem[] = [
 {
 id: "alt-1",
 title: "Thảo luận cần phản hồi (Mentoring SLA)",
 desc: "3 học viên đặt câu hỏi trong 'UI/UX Design Masterclass' đang chờ phản hồi từ bạn.",
 type: "urgent",
 timestamp: "10 phút trước",
 actionText: "Mở Hòm thư Hỏi đáp",
 actionHref: "/instructor/discussions",
 read: false,
 },
 {
 id: "alt-2",
 title: "Chu kỳ thanh toán học phí hoàn tất",
 desc: "15,400,000đ từ doanh thu học phí đã hoàn tất thời gian bảo lưu 30 ngày và chuyển vào Số dư Khả dụng.",
 type: "info",
 timestamp: "2 giờ trước",
 actionText: "Xem Doanh thu",
 actionHref: "/instructor/revenue",
 read: false,
 },
 {
 id: "alt-3",
 title: "Bảo mật dữ liệu học viên được kích hoạt",
 desc: "Hệ thống tự động mã hóa thông tin thanh toán và tài khoản của học viên trong các báo cáo xuất dữ liệu.",
 type: "security",
 timestamp: "1 ngày trước",
 read: true,
 },
];

export function InstructorTopbar() {
 const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
 const [isAlertOpen, setIsAlertOpen] = useState(false);
 const [unansweredDiscussionsCount, setUnansweredDiscussionsCount] = useState(0);

 // Initialize token & userId from localStorage
 const [token, setToken] = useState<string | null>(null);
 const [userId, setUserId] = useState<number | null>(null);
 
 useEffect(() => {
 setToken(window.localStorage.getItem("accessToken"));
 const userInfoRaw = window.localStorage.getItem("userInfo");
 if (userInfoRaw) {
 try {
 setUserId(JSON.parse(userInfoRaw).id);
 } catch(e) {}
 }
 }, []);

 const chatUnreadCount = useChatGlobalUnread(token, userId);

 useEffect(() => {
 const fetchUnansweredCount = async () => {
 try {
 const res = await axiosClient.get("/api/instructor/discussions", {
 params: { filter: "needs_attention", per_page: 1 }
 });
 const total = res.data?.data?.meta?.total || 0;
 setUnansweredDiscussionsCount(total);
 
 setAlerts((prev) => {
 const filtered = prev.filter(a => a.id !== "alt-1");
 if (total > 0) {
 return [
 {
 id: "alt-1",
 title: "Thảo luận cần phản hồi (Mentoring SLA)",
 desc: `${total} học viên đặt câu hỏi đang chờ phản hồi từ bạn.`,
 type: "urgent",
 timestamp: "Vừa cập nhật",
 actionText: "Mở Hòm thư Hỏi đáp",
 actionHref: "/instructor/discussions?filter=needs_attention",
 read: false,
 },
 ...filtered
 ];
 }
 return filtered;
 });
 } catch (e) {}
 };

 fetchUnansweredCount();

 const handleUpdate = () => {
 fetchUnansweredCount();
 };
 
 window.addEventListener("discussion-updated", handleUpdate);
 return () => window.removeEventListener("discussion-updated", handleUpdate);
 }, []);

 const unreadCount = alerts.filter((a) => !a.read).length;

 const markAllRead = () => {
 setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
 };

 const dismissAlert = (id: string) => {
 setAlerts((prev) => prev.filter((a) => a.id !== id));
 };

 return (
 <header className="h-16 shrink-0 flex items-center justify-between px-6 bg-white border-b border-slate-200 relative z-40">
 {/* Brand & Context */}
 <div className="flex items-center gap-3">
 {/* Placeholder for sidebar open button if needed on mobile, removed SidebarOpenButton to avoid missing module error */}
 <button type="button" className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center border border-slate-200 bg-slate-50 text-slate-500">
 <Menu className="h-5 w-5" aria-hidden />
 </button>
 <Link
 href="/instructor"
 className="text-lg font-bold text-slate-900 tracking-tight hover:text-blue-600 transition-colors shrink-0 flex items-center gap-2"
 >
 <span>MindNova Instructor</span>
 <span className="text-[10px] font-semibold bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full border border-blue-100">
 PRO
 </span>
 </Link>
 </div>

 {/* Actions */}
 <div className="flex items-center gap-3">
 
 {/* Proactive SLA Badge (Clean style per Rule #7) */}
 {unansweredDiscussionsCount > 0 && (
 <Link
 href="/instructor/discussions?filter=needs_attention"
 className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 text-slate-900 border border-slate-200 hover:bg-slate-50 hover:text-blue-600 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer text-decoration-none"
 >
 <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 animate-pulse" />
 <span>{unansweredDiscussionsCount} thảo luận mới</span>
 </Link>
 )}

 {/* Chat Button */}
 <Link
 href="/instructor/messages"
 className="relative w-9 h-9 rounded-lg flex items-center justify-center border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-blue-600 transition-all cursor-pointer"
 >
 <MessageSquare className="h-[18px] w-[18px]" aria-hidden />
 {chatUnreadCount > 0 && (
 <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center border-2 border-white px-0.5 animate-pulse">
 {chatUnreadCount}
 </span>
 )}
 </Link>

 {/* Bell Button */}
 <div className="relative">
 <button
 type="button"
 aria-label="Toggle Alert Center"
 onClick={() => setIsAlertOpen((p) => !p)}
 className={twMerge(
 "relative w-9 h-9 rounded-lg flex items-center justify-center border border-slate-200 transition-all cursor-pointer",
 isAlertOpen ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-white text-slate-500 hover:bg-slate-50 hover:text-blue-600"
 )}
 >
 <Bell className="h-[18px] w-[18px]" aria-hidden />
 {unreadCount > 0 && (
 <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center border-2 border-white px-0.5">
 {unreadCount}
 </span>
 )}
 </button>

 {/* Interactive Alert Dropdown */}
 {isAlertOpen && (
 <div className="absolute right-0 top-12 w-80 sm:w-96 rounded-lg bg-white border border-slate-200 shadow-lg p-5 flex flex-col gap-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
 
 <div className="flex items-center justify-between pb-3 border-b border-slate-100">
 <div>
 <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
 <span>Thông báo Giảng viên</span>
 </h3>
 <p className="text-[11px] text-slate-500 font-medium mt-0.5">Cập nhật thảo luận & doanh thu</p>
 </div>
 {unreadCount > 0 && (
 <button
 type="button"
 onClick={markAllRead}
 className="text-xs font-bold text-blue-500 hover:underline whitespace-nowrap cursor-pointer"
 >
 Đọc tất cả
 </button>
 )}
 </div>

 <div className="flex flex-col gap-2.5 max-h-[380px] overflow-y-auto pr-1">
 {alerts.length === 0 ? (
 <div className="py-8 text-center text-xs font-medium text-slate-500">
 Bạn không có thông báo mới nào.
 </div>
 ) : (
 alerts.map((item) => {
 const content = (
 <>
 <div className="flex items-start justify-between gap-2">
 <span className="text-xs font-bold text-slate-900 leading-snug">{item.title}</span>
 <button
 type="button"
 onClick={(e) => {
 e.preventDefault();
 e.stopPropagation();
 dismissAlert(item.id);
 }}
 aria-label="Ẩn thông báo"
 className="text-slate-400 hover:text-slate-700 p-0.5 rounded cursor-pointer relative z-10"
 >
 <X className="h-3.5 w-3.5" aria-hidden />
 </button>
 </div>
 
 <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
 
 <div className="flex items-center justify-between pt-1">
 <span className="text-[10px] font-bold text-slate-400">{item.timestamp}</span>
 {item.actionText && item.actionHref && (
 <span
 className="text-[11px] font-bold text-blue-500 flex items-center gap-1 group-hover:underline"
 >
 {item.actionText}
 <ArrowRight className="h-3 w-3" aria-hidden />
 </span>
 )}
 </div>
 </>
 );

 return item.actionHref ? (
 <Link
 key={item.id}
 href={item.actionHref}
 onClick={() => setIsAlertOpen(false)}
 className={twMerge(
 "group p-3.5 rounded-lg border transition-all flex flex-col gap-1.5 relative block",
 !item.read ? "bg-blue-50 text-slate-900 shadow-sm hover:bg-blue-100" : "bg-white border-slate-100 opacity-70 hover:opacity-100"
 )}
 >
 {content}
 </Link>
 ) : (
 <div
 key={item.id}
 className={twMerge(
 "p-3.5 rounded-lg border transition-all flex flex-col gap-1.5 relative",
 !item.read ? "bg-blue-50 text-slate-900 shadow-sm" : "bg-white border-slate-100 opacity-70"
 )}
 >
 {content}
 </div>
 );
 })
 )}
 </div>

 <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
 <button
 type="button"
 onClick={() => setIsAlertOpen(false)}
 className="text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer"
 >
 Đóng lại
 </button>
 </div>

 </div>
 )}
 </div>

 {/* Avatar */}
 <UserAvatar />
 </div>
 </header>
 );
}
