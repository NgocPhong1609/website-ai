"use client";

import React, { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { axiosClient } from "@/src/shared/lib/axios";

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
  const [threads, setThreads] = useState<CommentThread[]>([]);
  const [filter, setFilter] = useState<"all" | "unanswered" | "needs_attention">("all");
  const [activeTab, setActiveTab] = useState<"inbox" | "announcements">("inbox");
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<any>(null);

  // Announcement WYSIWYG & Rate Limiting State (Section 3.2)
  const [announcementSubject, setAnnouncementSubject] = useState("");
  const [announcementBody, setAnnouncementBody] = useState("");
  const [sentCountThisWeek, setSentCountThisWeek] = useState(1); // Max 2 emails per week to prevent spam
  const [announcementNotice, setAnnouncementNotice] = useState<string | null>(null);
  
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
    } catch (e) {
      console.error("Resolve error", e);
    }
  };

  const deleteThread = async (id: string) => {
    if (confirm("Bạn có chắc muốn xóa cuộc thảo luận này?")) {
      try {
        await axiosClient.delete(`/api/instructor/discussions/${id}`);
        setThreads((prev) => prev.filter((t) => t.id !== id));
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
    } catch (e) {
      console.error("Reply error", e);
    }
  };

  const handleSendAnnouncement = () => {
    if (sentCountThisWeek >= 2) {
      setAnnouncementNotice("⚠️ Đang áp dụng giới hạn chống spam: Để tránh spam, thông báo giới hạn 2 lần/tuần.");
      return;
    }
    setSentCountThisWeek((prev) => prev + 1);
    setAnnouncementNotice("✓ Gửi thông báo thành công! Thông báo sẽ được gửi trong 5 phút tới.");
    setTimeout(() => setAnnouncementNotice(null), 6000);
  };

  const filteredThreads = threads;

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8FF]">
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1080px] mx-auto px-6 py-8 flex flex-col gap-8">
          
          {/* Header Banner with Switcher */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[#EAEAF4]">
            <div>
              <h1 className="text-[26px] font-extrabold text-[#1A1A2E] tracking-tight">Thảo luận Hỏi đáp &amp; Thông báo Lớp học</h1>
              <p className="text-[13px] text-[#64647A] mt-1">
                Quản lý hộp thư giải đáp thắc mắc, đánh dấu câu trả lời hay nhất và gửi thông báo chống spam cho lớp học.
              </p>
            </div>

            {/* Feature Tab Selector */}
            <div className="flex items-center gap-2 p-1 rounded-2xl bg-white border border-[#EAEAF4] shadow-xs">
              <button
                type="button"
                onClick={() => setActiveTab("inbox")}
                className={twMerge(
                  "px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
                  activeTab === "inbox" ? "bg-[#4F46E5] text-white shadow-2xs" : "text-[#6B7280] hover:text-[#111827] hover:bg-white/60"
                )}
              >
                Hộp thư Hỏi đáp
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("announcements")}
                className={twMerge(
                  "px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
                  activeTab === "announcements" ? "bg-[#4F46E5] text-white shadow-2xs" : "text-[#6B7280] hover:text-[#111827] hover:bg-white/60"
                )}
              >
                Thông báo Lớp học
              </button>
            </div>
          </div>

          {activeTab === "inbox" ? (
            /* Tab 1: Q&A Unified Inbox */
            <div className="flex flex-col gap-6 animate-fadeIn">
              {/* Inbox Filters */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl border border-gray-200">
                  {[
                    { id: "all", label: "Tất cả thảo luận" },
                    { id: "needs_attention", label: "Cần phản hồi" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setFilter(tab.id as any)}
                      className={twMerge(
                        "px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer",
                        filter === tab.id
                          ? "bg-[#6B6BFF] text-white shadow-sm"
                          : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
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
                <div className="p-16 text-center rounded-3xl bg-white border border-[#EAEAF4] flex flex-col items-center gap-2 text-gray-400">
                  <span className="text-4xl">📭</span>
                  <p className="text-sm font-black text-[#1A1A2E]">Tuyệt vời! Tất cả thảo luận đã được trả lời!</p>
                  <p className="text-xs">Không có thảo luận nào cần bạn chú ý ở bộ lọc hiện tại.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {filteredThreads.map((thread: any) => (
                    <div key={thread.id} className="p-6 rounded-3xl bg-white border border-[#EAEAF4] shadow-xs flex flex-col gap-5">
                      
                      {/* Thread Top Info */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-sm flex items-center justify-center shadow-sm">
                            {thread.studentName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-black text-[#1A1A2E]">{thread.studentName}</h4>
                              <span className="text-[11px] font-bold text-gray-400">({thread.timeAgo})</span>
                            </div>
                            <p className="text-xs font-semibold text-indigo-600 mt-0.5">
                              {thread.course} • <span className="text-gray-500">{thread.lesson}</span>
                            </p>
                          </div>
                        </div>

                        {/* Status Tags */}
                        <div className="flex items-center gap-2">
                          {thread.isPinned && (
                            <span className="px-3 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-black">
                              📌 Đã ghim
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content Body */}
                      <div className="p-4 rounded-2xl bg-[#F8F9FF] border border-[#EAEAF4] text-sm font-medium text-gray-800 leading-relaxed">
                        {thread.content}
                      </div>

                      {/* Previous Reply Display */}
                      {thread.replyText && (
                        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50/60 to-teal-50/20 border border-emerald-200 text-xs font-medium text-gray-800 flex flex-col gap-2">
                          <div className="flex items-center gap-2 font-black text-emerald-800 text-xs">
                            <span className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center font-bold">✓</span>
                            <span>Phản hồi của giảng viên:</span>
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
                              {thread.isPinned ? "Bỏ ghim bình luận" : "📌 Ghim bình luận"}
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleResolvedStatus(thread.id, thread.isResolved)}
                              className={twMerge(
                                "px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer",
                                thread.isResolved ? "bg-emerald-600 text-white shadow-sm" : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200"
                              )}
                            >
                              {thread.isResolved ? "✅ Đã phản hồi" : "✔️ Xác nhận đã phản hồi"}
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => deleteThread(thread.id)}
                            className="text-gray-400 hover:text-red-600 font-extrabold text-xs px-2 py-1 transition-colors cursor-pointer"
                          >
                            🗑️ Xóa thảo luận
                          </button>
                        </div>

                        {!thread.isResolved && (
                          <div className="flex items-center gap-3 pt-2">
                            <input
                              type="text"
                              placeholder="Viết hướng dẫn hoặc ví dụ mã hữu ích..."
                              value={draftReplies[thread.id] || ""}
                              onChange={(e) => setDraftReplies((prev) => ({ ...prev, [thread.id]: e.target.value }))}
                              className="flex-1 px-4 py-3 rounded-2xl border border-[#D5D5FF] bg-white text-xs font-bold focus:outline-none focus:border-[#6B6BFF]"
                            />
                            <button
                              type="button"
                              onClick={() => submitReply(thread.id, draftReplies[thread.id] || "")}
                              className="px-6 py-3 rounded-2xl bg-[#1A1A2E] hover:bg-[#4648D4] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
                            >
                              Gửi trả lời ➔
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Tab 2: Cohort Announcer & Rate Limiting (Section 3.2) */
            <div className="flex flex-col gap-6 animate-fadeIn max-w-3xl mx-auto w-full">
              <div className="p-7 rounded-3xl bg-white border border-[#EAEAF4] shadow-xs flex flex-col gap-6">
                
                <div className="flex items-center justify-between border-b border-gray-100 pb-5">
                  <div className="flex items-center gap-3">
                    <span className="w-12 h-12 rounded-2xl bg-indigo-50 text-[#6B6BFF] flex items-center justify-center font-black text-2xl">
                      📢
                    </span>
                    <div>
                      <h3 className="text-base font-black text-[#1A1A2E]">Soạn thông báo cho toàn bộ lớp</h3>
                      <p className="text-xs text-gray-400">Gửi các thông báo quan trọng về chương trình học đến toàn bộ học viên.</p>
                    </div>
                  </div>

                  {/* Spam Rate-Limit Meter (Section 3.2) */}
                  <div className="text-right">
                    <span className={twMerge("px-3 py-1 rounded-xl text-xs font-black font-mono border", sentCountThisWeek >= 2 ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-emerald-50 text-emerald-700 border-emerald-200")}>
                      Hạn mức gửi hàng tuần: {sentCountThisWeek} / 2
                    </span>
                    <p className="text-[10px] font-bold text-gray-400 mt-1">Đang áp dụng giới hạn chống spam</p>
                  </div>
                </div>

                {announcementNotice && (
                  <div className={twMerge("p-4 rounded-2xl font-bold text-xs flex items-center gap-2", sentCountThisWeek >= 2 ? "bg-amber-50 border border-amber-300 text-amber-900" : "bg-emerald-50 border border-emerald-300 text-emerald-800")}>
                    <span>💡</span>
                    <span>{announcementNotice}</span>
                  </div>
                )}

                {/* WYSIWYG Editor Simulation */}
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-wide mb-1.5">Tiêu đề thông báo</label>
                    <input
                      type="text"
                      value={announcementSubject}
                      onChange={(e) => setAnnouncementSubject(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border-2 border-indigo-200 text-sm font-black text-[#1A1A2E] focus:outline-none focus:border-[#6B6BFF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-wide mb-1.5">Nội dung thông báo</label>
                    <div className="border border-gray-300 rounded-2xl overflow-hidden bg-white">
                      {/* Fake WYSIWYG Toolbar */}
                      <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-200 text-gray-600 text-xs font-bold">
                        <span className="px-2 py-0.5 rounded bg-white border cursor-pointer"><b>B</b></span>
                        <span className="px-2 py-0.5 rounded bg-white border cursor-pointer"><i>I</i></span>
                        <span className="px-2 py-0.5 rounded bg-white border cursor-pointer"><u>U</u></span>
                        <span className="h-4 w-px bg-gray-300 mx-1" />
                        <span className="px-2 py-0.5 rounded bg-white border cursor-pointer">🔗 Liên kết</span>
                        <span className="px-2 py-0.5 rounded bg-white border cursor-pointer">🖼️ Hình ảnh</span>
                        <span className="px-2 py-0.5 rounded bg-white border cursor-pointer">📝 Khối mã</span>
                      </div>
                      <textarea
                        rows={6}
                        value={announcementBody}
                        onChange={(e) => setAnnouncementBody(e.target.value)}
                        className="w-full p-4 text-xs font-medium text-[#1A1A2E] leading-relaxed focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Broadcast Footer Button */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <p className="text-xs text-gray-400 font-semibold">
                    Học viên sẽ nhận được thông báo trực tiếp trong hệ thống và qua email đã xác thực.
                  </p>
                  <button
                    type="button"
                    onClick={handleSendAnnouncement}
                    disabled={sentCountThisWeek >= 2}
                    className="px-8 py-3.5 bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] hover:opacity-95 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg transition-all disabled:opacity-50 cursor-pointer"
                  >
                    🚀 Gửi thông báo cho toàn lớp
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}