"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Avatar } from "@/src/shared/components/ui/Avatar";
import { axiosClient } from "@/src/shared/lib/axios";
import { readStoredUser } from "@/src/shared/lib/userStorage";
import { twMerge } from "tailwind-merge";
import { NotificationModal } from "./NotificationModal";
import { useChatGlobalUnread } from "@/src/hooks/useChatGlobalUnread";

function BellIcon() {
 return (
 <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
 <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
 <path d="M13.73 21a2 2 0 0 1-3.46 0" />
 </svg>
 );
}

function SettingsIcon() {
 return (
 <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
 <circle cx="12" cy="12" r="3" />
 <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
 </svg>
 );
}

export function DashboardTopbar() {
 const router = useRouter();
 const [isLoggedIn, setIsLoggedIn] = useState(false);
 const [isMounted, setIsMounted] = useState(false);
 const [notifications, setNotifications] = useState<any[]>([]);
 const [showNotif, setShowNotif] = useState(false);
 const [selectedNotification, setSelectedNotification] = useState<any | null>(null);
 const [user, setUser] = useState<any>(null);
 const [token, setToken] = useState<string | null>(null);
 const [userId, setUserId] = useState<number | null>(null);

 const chatUnreadCount = useChatGlobalUnread(token, userId);

 const syncUserFromStorage = () => {
 const storedUser = readStoredUser();
 setUser(storedUser ?? null);

 const userInfoRaw = window.localStorage.getItem("userInfo");
 if (userInfoRaw) {
 try {
 setUserId(JSON.parse(userInfoRaw).id);
 } catch (e) {
 console.error("Failed to parse userInfo", e);
 }
 }
 };

 const fetchNotifications = async () => {
 try {
 const res = await axiosClient.get("/api/student/notifications");
 if (res.data && res.data.data) {
 setNotifications(res.data.data);
 }
 } catch (error) {
 console.error("Failed to fetch notifications", error);
 }
 };

 useEffect(() => {
 setIsMounted(true);
 syncUserFromStorage();

 const storedToken = window.localStorage.getItem("accessToken");
 setToken(storedToken);

 if (storedToken) {
 setIsLoggedIn(true);
 fetchNotifications();
 }

 const handleUserUpdated = () => syncUserFromStorage();
 window.addEventListener("user:updated", handleUserUpdated);
 return () => window.removeEventListener("user:updated", handleUserUpdated);
 }, []);

 const handleDeleteRead = async () => {
 if (window.confirm("Bạn có chắc muốn xóa tất cả thông báo đã đọc?")) {
 try {
 await axiosClient.delete("/api/student/notifications/read");
 setNotifications((prev) => prev.filter((n) => !n.is_read));
 } catch (error) {
 console.error("Failed to delete read notifications", error);
 }
 }
 };

 const markAsRead = async (id: number) => {
 try {
 await axiosClient.patch(`/api/student/notifications/${id}/read`);
 setNotifications((prev) =>
 prev.map((n) => (n.id === id ? { ...n, is_read: 1 } : n))
 );
 } catch (error) {
 console.error("Failed to mark as read", error);
 }
 };

 const clearAuthCookies = () => {
 document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
 document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
 };

 const unreadCount = notifications.filter((n) => !n.is_read).length;

 return (
 <>
 <header className="sticky top-0 z-50 h-18 shrink-0 flex items-center justify-end gap-4 px-6 lg:px-8 bg-[#FEFCF9]/95 backdrop-blur-sm border-b border-[#E8E2D9] transition-all duration-200">
 <div className="flex items-center gap-3">
 <div className="flex items-center gap-1 bg-[#F5F0E8] p-1 rounded-lg border border-[#E8E2D9]">
 {/* Chat Button */}
 <a
 href="/messages"
 aria-label="Messages"
 className="group/chat relative w-9 h-9 rounded-md flex items-center justify-center text-[#8A8478] hover:text-[#C0392B] hover:bg-white transition-all duration-200 focus:outline-none"
 >
 <div className="group-hover/chat:scale-105 transition-transform duration-200">
 <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
 </svg>
 </div>
 {chatUnreadCount > 0 && (
 <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#C0392B] animate-pulse ring-2 ring-white" />
 )}
 </a>

 {/* Notifications */}
 <div className="relative">
 <button
 type="button"
 onClick={() => setShowNotif(!showNotif)}
 aria-label="Notifications"
 className="group/bell relative w-9 h-9 rounded-md flex items-center justify-center text-[#8A8478] hover:text-[#C0392B] hover:bg-white transition-all duration-200 focus:outline-none"
 >
 <div className="group-hover/bell:rotate-6 transition-transform duration-200">
 <BellIcon />
 </div>
 {unreadCount > 0 && (
 <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#C0392B] animate-pulse ring-2 ring-white" />
 )}
 </button>

 {/* Notification Dropdown */}
 {showNotif && (
 <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-[#E8E2D9] overflow-hidden z-50">
 <div className="px-4 py-3 border-b border-[#F5F0E8] flex items-center justify-between bg-[#FAF7F2]">
 <h3 className="text-sm font-semibold text-[#2C3039]">
 Thông báo ({notifications.length}/50)
 </h3>
 {unreadCount > 0 && (
 <span className="text-[10px] font-semibold bg-[#FADBD8] text-[#C0392B] px-2 py-0.5 rounded-full">
 {unreadCount} mới
 </span>
 )}
 </div>

 <div className="max-h-[360px] overflow-y-auto">
 {notifications.length === 0 ? (
 <div className="p-6 text-center">
 <p className="text-sm text-[#B8B0A3] font-medium">
 Bạn chưa có thông báo nào
 </p>
 </div>
 ) : (
 <div className="flex flex-col divide-y divide-[#F5F0E8]">
 {notifications.map((notif) => {
 const senderAvatar = notif.sender?.avatar || "";

 return (
 <div
 key={notif.id}
 onClick={() => {
 if (!notif.is_read) markAsRead(notif.id);
 if (notif.action_url) {
 window.location.href = notif.action_url;
 } else {
 setSelectedNotification(notif);
 }
 setShowNotif(false);
 }}
 className={twMerge(
 "px-5 py-4 transition-colors duration-200 cursor-pointer flex gap-4 items-start",
 !notif.is_read
 ? "bg-[#FDF6E3]/60 hover:bg-[#FDF6E3]"
 : "bg-white hover:bg-[#FAF7F2]"
 )}
 >
 <div className="relative shrink-0 mt-0.5">
 <Avatar
 fallback="NV"
 src={senderAvatar}
 className="w-[46px] h-[46px] rounded-full text-[#C0392B] bg-[#FADBD8]"
 />
 <span
 className={twMerge(
 "absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-[2.5px] border-white shadow-sm",
 !notif.is_read ? "bg-[#C0392B]" : "bg-[#27AE60]"
 )}
 />
 </div>

 <div className="flex-1 min-w-0">
 <p
 className={twMerge(
 "text-[14px] text-[#2C3039] leading-tight mb-1",
 !notif.is_read ? "font-bold" : "font-semibold"
 )}
 >
 {notif.title || "Thông báo mới"}
 </p>
 <p className="text-[13px] text-[#8A8478] line-clamp-2 leading-relaxed mb-1.5">
 {notif.content}
 </p>
 <p className="text-[11px] text-[#B8B0A3] font-medium">
 {new Date(notif.created_at).toLocaleString("vi-VN")}
 </p>
 </div>
 </div>
 );
 })}
 </div>
 )}
 </div>

 {/* Footer action */}
 <div className="px-4 py-3 border-t border-[#F5F0E8] flex items-center justify-center bg-[#FAF7F2]">
 <button
 onClick={handleDeleteRead}
 disabled={notifications.filter((n) => n.is_read).length === 0}
 className="text-xs font-semibold text-[#C0392B] hover:text-[#A93226] disabled:text-[#B8B0A3] transition-colors"
 >
 Xóa thông báo đã đọc
 </button>
 </div>
 </div>
 )}
 </div>

 {/* Settings */}
 <button
 type="button"
 aria-label="Settings"
 className="group/settings w-9 h-9 rounded-md flex items-center justify-center text-[#8A8478] hover:text-[#C0392B] hover:bg-white transition-all duration-200 focus:outline-none"
 >
 <div className="group-hover/settings:rotate-30 transition-transform duration-300">
 <SettingsIcon />
 </div>
 </button>
 </div>

 <span className="w-px h-6 bg-[#E8E2D9] hidden sm:block" />

 {/* Profile Avatar or Login/Register Links */}
 {isMounted && isLoggedIn ? (
 <button
 type="button"
 onClick={() => router.push("/profile")}
 className="relative group flex items-center gap-2 cursor-pointer focus:outline-none hover:opacity-90"
 aria-label="Đi tới trang cá nhân"
 >
 <div className="group/avatar hover:scale-105 active:scale-95 transition-transform duration-200">
 <Avatar
 src={user?.avatar_url || user?.avatar || null}
 fallback={(
 (user?.name || "MN")
 .trim()
 .split(/\s+/)
 .slice(-2)
 .map((part: string) => part[0])
 .join("") || "MN"
 ).toUpperCase()}
 size="md"
 className="ring-2 ring-[#E8E2D9] hover:ring-[#C0392B]/40 transition-all duration-200"
 />
 </div>
 {user?.name && (
 <span className="hidden md:inline text-sm font-semibold text-[#2C3039]">
 {user.name}
 </span>
 )}
 <span
 className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#27AE60] border-2 border-white shadow-xs"
 title="Online"
 />
 </button>
 ) : isMounted && !isLoggedIn ? (
 <div className="flex items-center gap-3 relative z-[9999] pointer-events-auto">
 <Link
 href="/login"
 onClick={clearAuthCookies}
 className="px-4 py-2 text-sm font-semibold text-[#8A8478] hover:text-[#2C3039] hover:bg-[#F5F0E8] rounded-lg transition-all relative z-[9999]"
 >
 Đăng nhập
 </Link>
 <Link
 href="/login?mode=register"
 onClick={clearAuthCookies}
 className="px-4 py-2 text-sm font-semibold text-white bg-[#2C3039] hover:bg-[#1C1D23] rounded-lg transition-all shadow-sm relative z-[9999]"
 >
 Đăng ký
 </Link>
 </div>
 ) : null}
 </div>
 </header>

 {/* Notification Modal */}
 <NotificationModal
 isOpen={!!selectedNotification}
 onClose={() => setSelectedNotification(null)}
 notification={selectedNotification}
 />
 </>
 );
}