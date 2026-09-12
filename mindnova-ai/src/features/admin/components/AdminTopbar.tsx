"use client";
import { Avatar } from "@/src/shared/components/ui/Avatar";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { jsPDF } from "jspdf";
import { Bell, Check, ChevronDown, LogOut, Menu, RefreshCw, Search } from "lucide-react";
import { adminApi } from "@/src/features/admin/lib/admin-api";

type ExportFormat = "json" | "doc" | "pdf";

export function AdminTopbar({ onOpenNav }: { onOpenNav?: () => void }) {
 const router = useRouter();
 const [isExporting, setIsExporting] = useState(false);
 const [isRefreshing, setIsRefreshing] = useState(false);
 const [exportFormat, setExportFormat] = useState<ExportFormat>("json");
 const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
 const [statusMessage, setStatusMessage] = useState<string | null>(null);
 const exportMenuRef = useRef<HTMLDivElement | null>(null);

 const exportLabel: Record<ExportFormat, string> = {
 json: "JSON",
 doc: "DOC",
 pdf: "PDF",
 };

 useEffect(() => {
 const handleClickOutside = (event: MouseEvent) => {
 if (!exportMenuRef.current) return;

 if (!exportMenuRef.current.contains(event.target as Node)) {
 setIsExportMenuOpen(false);
 }
 };

 document.addEventListener("mousedown", handleClickOutside);
 return () => document.removeEventListener("mousedown", handleClickOutside);
 }, []);

 const downloadBlob = (blob: Blob, filename: string) => {
 const url = URL.createObjectURL(blob);
 const link = document.createElement("a");
 link.href = url;
 link.download = filename;
 link.click();
 URL.revokeObjectURL(url);
 };

 const exportAsDoc = (payload: Record<string, unknown>, date: string) => {
 const escapedJson = JSON.stringify(payload, null, 2)
 .replace(/&/g, "&amp;")
 .replace(/</g, "&lt;")
 .replace(/>/g, "&gt;");

 const html = `<!doctype html>
<html>
<head>
 <meta charset="utf-8" />
 <title>MindNova Admin Export</title>
 <style>
 body { font-family: Arial, sans-serif; font-size: 11pt; color: #111827; }
 h1 { font-size: 16pt; margin: 0 0 10px; }
 p { margin: 0 0 10px; color: #475569; }
 pre { white-space: pre-wrap; word-break: break-word; line-height: 1.4; }
 </style>
</head>
<body>
 <h1>MindNova Admin Export</h1>
 <p>Ngày xuất: ${new Date().toLocaleString("vi-VN")}</p>
 <pre>${escapedJson}</pre>
</body>
</html>`;

 const blob = new Blob(["\ufeff", html], { type: "application/msword;charset=utf-8" });
 downloadBlob(blob, `mindnova-admin-export-${date}.doc`);
 };

 const exportAsPdf = (payload: Record<string, unknown>, date: string) => {
 const doc = new jsPDF({ unit: "pt", format: "a4" });
 const margin = 36;
 const pageWidth = doc.internal.pageSize.getWidth();
 const pageHeight = doc.internal.pageSize.getHeight();
 const maxWidth = pageWidth - margin * 2;
 const lineHeight = 14;

 doc.setFont("helvetica", "bold");
 doc.setFontSize(12);
 doc.text("MindNova Admin Export", margin, margin);

 doc.setFont("helvetica", "normal");
 doc.setFontSize(10);
 doc.text(`Ngay xuat: ${new Date().toLocaleString("vi-VN")}`, margin, margin + 16);

 const lines = doc.splitTextToSize(JSON.stringify(payload, null, 2), maxWidth);
 let y = margin + 36;

 lines.forEach((line: string) => {
 if (y > pageHeight - margin) {
 doc.addPage();
 y = margin;
 }

 doc.text(line, margin, y);
 y += lineHeight;
 });

 doc.save(`mindnova-admin-export-${date}.pdf`);
 };

 const buildExportPayload = async (): Promise<Record<string, unknown>> => {
 const endpoints = {
 users: "/admin/users",
 analytics: "/admin/analytics/dashboard?period=monthly",
 content_courses: "/admin/content/courses",
 content_resources: "/admin/content/resources",
 content_question_bank: "/admin/content/question-bank",
 moderation_flags: "/admin/moderation/flags",
 support_tickets: "/admin/support/tickets",
 } as const;

 const exportResult: Record<string, unknown> = {
 exported_at: new Date().toISOString(),
 };

 const entries = Object.entries(endpoints) as Array<[keyof typeof endpoints, string]>;
 const settled = await Promise.allSettled(entries.map(([, path]) => adminApi<unknown>(path)));

 settled.forEach((result, index) => {
 const [key] = entries[index];

 if (result.status === "fulfilled") {
 exportResult[key] = result.value;
 } else {
 exportResult[key] = {
 error: result.reason instanceof Error ? result.reason.message : "Không thể tải dữ liệu.",
 };
 }
 });

 return exportResult;
 };

 const handleExportData = async () => {
 setStatusMessage(null);
 setIsExporting(true);

 try {
 const date = new Date().toISOString().slice(0, 10);
 const exportResult = await buildExportPayload();

 if (exportFormat === "json") {
 const blob = new Blob([JSON.stringify(exportResult, null, 2)], { type: "application/json;charset=utf-8" });
 downloadBlob(blob, `mindnova-admin-export-${date}.json`);
 }

 if (exportFormat === "doc") {
 exportAsDoc(exportResult, date);
 }

 if (exportFormat === "pdf") {
 exportAsPdf(exportResult, date);
 }

 setStatusMessage("Đã xuất dữ liệu thành công.");
 } catch (error) {
 setStatusMessage(error instanceof Error ? error.message : "Xuất dữ liệu thất bại.");
 } finally {
 setIsExporting(false);
 }
 };

 const handleRefreshData = async () => {
 setStatusMessage(null);
 setIsRefreshing(true);

 try {
 window.dispatchEvent(new Event("admin:refresh-data"));
 router.refresh();
 setStatusMessage("Đã làm mới dữ liệu.");
 } finally {
 setIsRefreshing(false);
 }
 };

 const handleLogout = async () => {
 setStatusMessage(null);

 try {
 await adminApi<{ message?: string }>("/logout", { method: "POST" });
 } catch {
 // Ignore backend logout errors and continue local cleanup.
 } finally {
 window.localStorage.removeItem("accessToken");
 window.localStorage.removeItem("userInfo");
 document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
 document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
 window.location.replace("/login");
 }
 };

 return (
 <header className="flex h-14 shrink-0 items-center gap-2 border-b border-slate-200 bg-white/80 px-3 backdrop-blur-xl sm:gap-4 sm:px-5">
 {onOpenNav ? (
 <button
 type="button"
 aria-label="Mở menu"
 onClick={onOpenNav}
 className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-[#3B82F6] hover:text-[#2563EB] lg:hidden"
 >
 <Menu className="h-5 w-5" aria-hidden />
 </button>
 ) : null}
 <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
      <div className="hidden items-center gap-2 rounded-full border border-emerald-300/80 bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-800 shadow-xs sm:flex">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
        </span>
        Online sync
      </div>

 <div className="relative max-w-xl flex-1">
 <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
 <input
 type="search"
 placeholder="Tìm nhanh người dùng, khóa học, doanh thu..."
 className="w-full rounded-2xl border border-slate-200 bg-slate-50/90 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-[#3B82F6] focus:bg-white focus:ring-4 focus:ring-blue-100"
 />
 </div>
 </div>

 <div className="flex shrink-0 items-center gap-2 overflow-x-auto sm:gap-3">
 <div className="relative" ref={exportMenuRef}>
 <button
 type="button"
 onClick={() => setIsExportMenuOpen((current) => !current)}
 className="inline-flex items-center gap-1 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-[#3B82F6] hover:bg-blue-50 hover:text-[#2563EB]"
 >
 Định dạng: {exportLabel[exportFormat]}
 <ChevronDown className="h-4 w-4" aria-hidden />
 </button>

 {isExportMenuOpen && (
 <div className="absolute right-0 z-20 mt-2 min-w-[156px] rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_18px_40px_-22px_rgba(15,23,42,0.45)]">
 {(["json", "doc", "pdf"] as ExportFormat[]).map((format) => (
 <button
 key={format}
 type="button"
 onClick={() => {
 setExportFormat(format);
 setIsExportMenuOpen(false);
 }}
 className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${
 exportFormat === format
 ? "bg-blue-50 font-semibold text-[#2563EB]"
 : "text-slate-700 hover:bg-slate-50"
 }`}
 >
 <span>{exportLabel[format]}</span>
 {exportFormat === format && <Check className="h-4 w-4 text-[#2563EB]" aria-hidden />}
 </button>
 ))}
 </div>
 )}
 </div>
 <button
 type="button"
 onClick={() => void handleExportData()}
 disabled={isExporting}
 className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-[#3B82F6] hover:bg-blue-50 hover:text-[#2563EB] disabled:cursor-not-allowed disabled:opacity-60"
 >
 {isExporting ? "Đang xuất..." : `Xuất ${exportLabel[exportFormat]}`}
 </button>
 <button
 type="button"
 onClick={() => void handleRefreshData()}
 disabled={isRefreshing}
 className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#3B82F6] to-[#2563EB] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_30px_-15px_rgba(37,99,235,0.9)] transition hover:from-[#2563EB] hover:to-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-60"
 >
 <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} aria-hidden />
 {isRefreshing ? "Đang làm mới..." : "Làm mới dữ liệu"}
 </button>

 <button
 type="button"
 aria-label="Notifications"
 className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:border-[#3B82F6] hover:text-[#2563EB]"
 >
 <Bell className="h-5 w-5" aria-hidden />
 <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[#3B82F6] ring-2 ring-white" />
 </button>

 <button
 type="button"
 onClick={handleLogout}
 className="inline-flex items-center gap-2 rounded-2xl border border-[#DBEAFE] bg-[#EFF6FF] px-4 py-2.5 text-sm font-semibold text-[#1D4ED8] transition hover:bg-[#DBEAFE] hover:text-[#2563EB]"
 >
 <LogOut className="h-4 w-4" aria-hidden />
 Đăng xuất
 </button>
 <Avatar fallback="A" size="md" className="shadow-[0_14px_24px_-14px_rgba(37,99,235,0.9)]" />
 </div>

 {statusMessage && (
 <p className="ml-2 text-xs font-medium text-slate-600">{statusMessage}</p>
 )}
 </header>
 );
}
