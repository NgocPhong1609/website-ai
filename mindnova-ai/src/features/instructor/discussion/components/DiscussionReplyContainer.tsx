"use client";

import React, { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { axiosClient } from "@/src/shared/lib/axios";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { VerifiedTeacherBadge } from "@/src/shared/components/VerifiedTeacherBadge";

// ─── Types ────────────────────────────────────────────────────────

export interface CommentThread {
 id: string;
 studentName: string;
 studentEmail?: string;
 course: string;
 lesson: string;
 timeAgo: string;
 content: string;
 isPinned: boolean;
 isBestAnswer: boolean;
 isResolved: boolean;
 needsAttention: boolean;
 replyText?: string;
 bestAnswerReplyId?: string;
 allReplies?: any[];
}

// ─── Main Discussion Reply Container (Section 3.2) ─────────────────────────────

export function DiscussionReplyContainer() {
 const searchParams = useSearchParams();
 const router = useRouter();
 const pathname = usePathname();

 const [threads, setThreads] = useState<CommentThread[]>([]);
 const [filter, setFilter] = useState<"all" | "unanswered" | "needs_attention">(() => {
 const f = searchParams.get("filter");
 if (f === "needs_attention" || f === "unanswered") return f as any;
 return "all";
 });
 const [loading, setLoading] = useState(false);
 const [pagination, setPagination] = useState<any>(null);
 
 const [draftReplies, setDraftReplies] = useState<Record<string, string>>({});

 const formatTimeAgo = (dateStr: string) => {
 const diff = Date.now() - new Date(dateStr).getTime();
 const minutes = Math.floor(diff / 60000);
 if (minutes < 60) return `${minutes} phút trước`;
 const hours = Math.floor(minutes / 60);
 if (hours < 24) return `${hours} giờ trước`;
 return `${Math.floor(hours / 24)} ngày trước`;
 };

 const fetchDiscussions = async () => {
 setLoading(true);
 try {
 const res = await axiosClient.get("/api/instructor/discussions", {
 params: { filter }
 });
 const data = res.data.data.data.map((item: any) => {
 let bestReply = item.replies?.find((r: any) => r.is_best_answer);
 let instructorReply = item.replies?.find((r: any) => !r.is_best_answer);
 return {
 id: item.id.toString(),
 studentName: item.student.name,
 course: item.course?.title || "Khóa học chung",
 lesson: item.lesson.title,
 timeAgo: formatTimeAgo(item.created_at),
 content: item.content,
 isPinned: item.is_pinned,
 isBestAnswer: !!bestReply,
 isResolved: item.is_resolved,
 needsAttention: item.status === 'open' || item.replies?.length === 0,
 replyText: bestReply?.content || instructorReply?.content || undefined,
 bestAnswerReplyId: bestReply?.id,
 allReplies: item.replies
 };
 });
 setThreads(data);
 setPagination(res.data.data.meta);
 } catch (error) {
 console.error("Failed to fetch discussions", error);
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 fetchDiscussions();
 }, [filter]);

 // Thread Actions
 const togglePin = async (id: string) => {
 try {
 await axiosClient.patch(`/api/instructor/discussions/${id}/pin`);
 setThreads((prev) => prev.map((t) => (t.id === id ? { ...t, isPinned: !t.isPinned } : t)));
 } catch (e) {
 console.error("Pin error", e);
 }
 };

 const toggleResolvedStatus = async (id: string, currentStatus: boolean) => {
 try {
 await axiosClient.patch(`/api/instructor/discussions/${id}/resolved`);
 setThreads((prev) => prev.map((t) => (t.id === id ? { ...t, isResolved: !currentStatus, needsAttention: currentStatus } : t)));
 window.dispatchEvent(new Event("discussion-updated"));
 } catch (e) {
 console.error("Resolve error", e);
 }
 };

 const deleteThread = async (id: string) => {
 if (confirm("Bạn có chắc muốn xóa cuộc thảo luận này?")) {
 try {
 await axiosClient.delete(`/api/instructor/discussions/${id}`);
 setThreads((prev) => prev.filter((t) => t.id !== id));
 window.dispatchEvent(new Event("discussion-updated"));
 } catch (e) {
 console.error("Delete error", e);
 }
 }
 };

 const submitReply = async (id: string, reply: string) => {
 if (!reply.trim()) return;
 try {
 await axiosClient.post(`/api/instructor/discussions/${id}/replies`, { content: reply });
 setThreads((prev) =>
 prev.map((t) => (t.id === id ? { ...t, replyText: reply, isResolved: false, needsAttention: false } : t))
 );
 setDraftReplies((prev) => ({ ...prev, [id]: "" }));
 window.dispatchEvent(new Event("discussion-updated"));
 } catch (e) {
 console.error("Reply error", e);
 }
 };



 const filteredThreads = threads;

 return (
 <div className="flex flex-col min-h-screen bg-[#FAF8FF]">
 <main className="flex-1 overflow-y-auto">
 <div className="max-w-[1080px] mx-auto px-6 py-8 flex flex-col gap-8">
 
 {/* Header Banner with Switcher */}
 <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[#E8E2D9]">
 <div>
 <h1 className="text-[26px] font-extrabold text-[#2C3039] tracking-tight">Thảo luận Hỏi đáp &amp; Thông báo Lớp học</h1>
 <p className="text-[13px] text-[#8A8478] mt-1">
 Quản lý hộp thư giải đáp thắc mắc, đánh dấu câu trả lời hay nhất và gửi thông báo chống spam cho lớp học.
 </p>
 </div>
 
 <button
 type="button"
 onClick={() => router.push('/instructor/messages')}
 className="px-5 py-2.5 -[#C0392B] hover:-[#C0392B] text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
 >
 <></>
 Mở phòng trao đổi
 </button>
 </div>

 {/* Q&A Unified Inbox */}
 <div className="flex flex-col gap-6 animate-fadeIn">
 {/* Inbox Filters */}
 <div className="flex items-center justify-between flex-wrap gap-4">
 <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl border border-[#E8E2D9]">
 {[
 { id: "all", label: "Tất cả thảo luận" },
 { id: "needs_attention", label: "Cần phản hồi" },
 ].map((tab) => (
 <button
 key={tab.id}
 type="button"
 onClick={() => {
 setFilter(tab.id as any);
 const newParams = new URLSearchParams(searchParams.toString());
 newParams.set("filter", tab.id);
 router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
 }}
 className={twMerge(
 "px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer",
 filter === tab.id
 ? "bg-[#FAF7F2] text-white shadow-sm"
 : "bg-white text-[#8A8478] border border-[#E8E2D9] hover:bg-[#FEFCF9]"
 )}
 >
 {tab.label}
 </button>
 ))}
 </div>

 <p className="text-xs font-bold text-gray-400">
 Đang hiển thị <strong className="text-gray-800">{pagination?.total || filteredThreads.length}</strong> cuộc thảo luận đang hoạt động
 </p>
 </div>

 {/* Thread Cards List */}
 {loading ? (
 <div className="p-16 text-center text-gray-400 font-medium">Đang tải dữ liệu...</div>
 ) : filteredThreads.length === 0 ? (
 <div className="p-16 text-center rounded-3xl bg-white border border-[#E8E2D9] flex flex-col items-center gap-2 text-gray-400">
 <span className="text-4xl"></span>
 <p className="text-sm font-black text-[#2C3039]">Tuyệt vời! Tất cả thảo luận đã được trả lời!</p>
 <p className="text-xs">Không có thảo luận nào cần bạn chú ý ở bộ lọc hiện tại.</p>
 </div>
 ) : (
 <div className="flex flex-col gap-6">
 {filteredThreads.map((thread: any) => (
 <div key={thread.id} className="p-6 rounded-3xl bg-white border border-[#E8E2D9] shadow-xs flex flex-col gap-5">
 
 {/* Thread Top Info */}
 <div className="flex items-start justify-between gap-4">
 <div className="flex items-center gap-3.5">
 <div className="w-11 h-11 rounded-2xl -[#C0392B] -[#C0392B] text-white font-black text-sm flex items-center justify-center shadow-sm">
 {thread.studentName.slice(0, 2).toUpperCase()}
 </div>
 <div>
 <div className="flex items-center gap-2">
 <h4 className="text-sm font-black text-[#2C3039]">{thread.studentName}</h4>
 <span className="text-[11px] font-bold text-gray-400">({thread.timeAgo})</span>
 </div>
 <p className="text-xs font-semibold -[#C0392B] mt-0.5">
 {thread.course} • <span className="text-[#8A8478]">{thread.lesson}</span>
 </p>
 </div>
 </div>

 {/* Status Tags */}
 <div className="flex items-center gap-2">
 {thread.isPinned && (
 <span className="px-3 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-black">
 Đã ghim
 </span>
 )}
 </div>
 </div>

 {/* Content Body */}
 <div className="p-4 rounded-2xl bg-[#F8F9FF] border border-[#E8E2D9] text-sm font-medium text-gray-800 leading-relaxed">
 {thread.content}
 </div>

 {/* Previous Reply Display */}
 {thread.replyText && (
 <div className="p-5 rounded-2xl from-emerald-50/60 to-teal-50/20 border -[#FAF7F2] text-xs font-medium text-gray-800 flex flex-col gap-2">
 <div className="flex items-center gap-2 font-black -[#2C3039] text-xs">
 
 <span>Phản hồi của giảng viên:</span>
 <VerifiedTeacherBadge isVerified={true} size="xs" />
 </div>
 <p className="text-sm leading-relaxed pl-7">{thread.replyText}</p>
 </div>
 )}

 {/* Action & Reply Bar */}
 <div className="flex flex-col gap-3 pt-3 border-t border-gray-100">
 <div className="flex items-center justify-between gap-4 flex-wrap">
 <div className="flex items-center gap-2">
 <button
 type="button"
 onClick={() => togglePin(thread.id)}
 className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xs transition-all cursor-pointer"
 >
 {thread.isPinned ? "Bỏ ghim bình luận" : " Ghim bình luận"}
 </button>
 <button
 type="button"
 onClick={() => toggleResolvedStatus(thread.id, thread.isResolved)}
 className={twMerge(
 "px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer",
 thread.isResolved ? "-[#2C3039] text-white shadow-sm" : "bg-emerald-50 hover:-[#FAF7F2] -[#2C3039] border -[#FAF7F2]"
 )}
 >
 {thread.isResolved ? " Đã phản hồi" : "️ Xác nhận đã phản hồi"}
 </button>
 </div>

 <button
 type="button"
 onClick={() => deleteThread(thread.id)}
 className="text-gray-400 hover:text-red-600 font-extrabold text-xs px-2 py-1 transition-colors cursor-pointer"
 >
 Xóa thảo luận
 </button>
 </div>

 {!thread.isResolved && (
 <div className="flex items-center gap-3 pt-2">
 <input
 type="text"
 placeholder="Viết hướng dẫn hoặc ví dụ mã hữu ích..."
 value={draftReplies[thread.id] || ""}
 onChange={(e) => setDraftReplies((prev) => ({ ...prev, [thread.id]: e.target.value }))}
 className="flex-1 px-4 py-3 rounded-2xl border border-[#D5D5FF] bg-white text-xs font-bold focus:outline-none focus:border-[#E8E2D9]"
 />
 <button
 type="button"
 onClick={() => submitReply(thread.id, draftReplies[thread.id] || "")}
 className="px-6 py-3 rounded-2xl bg-[#1A1A2E] hover:bg-[#C0392B] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
 >
 Gửi trả lời 
 </button>
 </div>
 )}
 </div>

 </div>
 ))}
 </div>
 )}
 </div>
 </div>
 </main>
 </div>
 );
}