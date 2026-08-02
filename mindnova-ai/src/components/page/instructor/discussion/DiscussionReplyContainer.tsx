"use client";

import React, { useState } from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import {
  SearchIcon,
  BellIcon,
  SettingsIcon,
  ArrowLeftIcon,
  ArchiveIcon,
  MoreHorizontalIcon,
  FileIcon,
  BoldIcon,
  ItalicIcon,
  CodeIcon,
  LinkIcon,
  ImageIcon,
  PaperclipIcon,
  AtSignIcon,
  SmileIcon,
  SparklesIcon,
  SendIcon,
} from "./icons";

// ─── Types & Mock Data ────────────────────────────────────────────────────────

export interface CommentThread {
  id: string;
  studentName: string;
  studentEmail: string;
  course: string;
  lesson: string;
  timeAgo: string;
  content: string;
  isPinned: boolean;
  isBestAnswer: boolean;
  isResolved: boolean;
  needsAttention: boolean;
  replyText?: string;
}

const INITIAL_THREADS: CommentThread[] = [
  {
    id: "thr-1",
    studentName: "Minh Nguyễn",
    studentEmail: "minh.ng@example.com",
    course: "UI/UX Design Masterclass",
    lesson: "Chapter 4: Material Tonal Layering",
    timeAgo: "2 hours ago",
    content: "Thưa thầy, em đang gặp khó khăn khi áp dụng Material Tonal Layering. Làm sao để đảm bảo độ tương phản (Accessibility) khi sử dụng các bảng màu Surface và Surface-variant cạnh nhau?",
    isPinned: true,
    isBestAnswer: false,
    isResolved: false,
    needsAttention: true,
  },
  {
    id: "thr-2",
    studentName: "An Trần",
    studentEmail: "an.tran@tech.vn",
    course: "Next.js 15 Fullstack Architecture",
    lesson: "Chapter 2: Server Actions",
    timeAgo: "5 hours ago",
    content: "When should we invoke revalidatePath vs revalidateTag in an optimistic form submission workflow?",
    isPinned: false,
    isBestAnswer: true,
    isResolved: true,
    needsAttention: false,
    replyText: "Great question An! Use revalidateTag when you have granular granular cached fetch endpoints, and revalidatePath for full structural layout invalidations.",
  },
  {
    id: "thr-3",
    studentName: "Bảo Lê",
    studentEmail: "bao.le@dev.com",
    course: "UI/UX Design Masterclass",
    lesson: "Chapter 1: Auto-Layout Essentials",
    timeAgo: "1 day ago",
    content: "My flex gap is wrapping incorrectly when switching mobile responsive breakpoints in Figma.",
    isPinned: false,
    isBestAnswer: false,
    isResolved: false,
    needsAttention: true,
  },
];

function Topbar() {
  return (
    <header className="h-16 shrink-0 flex items-center gap-4 px-6 bg-white border-b border-[#F0F0F8]">
      <div className="relative flex-1 max-w-[360px]">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0B0C8] pointer-events-none">
          <SearchIcon size={14} />
        </span>
        <input
          type="search"
          placeholder="Search thread or topic..."
          className="w-full pl-9 pr-4 h-10 rounded-2xl text-sm text-[#1A1A2E] placeholder:text-[#B0B0C8] bg-[#F6F6FB] border border-[#EAEAF4] focus:outline-none focus:border-[#6B6BFF] transition-all"
        />
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-2 text-[#7878A0]">
        <button type="button" className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-all">
          <BellIcon size={18} />
        </button>
      </div>
      <div className="flex items-center gap-3 pl-4 border-l border-[#EAEAF4]">
        <div className="flex flex-col items-end leading-tight">
          <span className="text-[13px] font-bold text-[#1A1A2E]">Dr. Minh Khôi</span>
          <span className="text-[10px] text-[#9090B0] font-bold">Senior Instructor</span>
        </div>
        <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-md">
          MK
        </div>
      </div>
    </header>
  );
}

// ─── Main Discussion Reply Container (Section 3.2) ─────────────────────────────

export function DiscussionReplyContainer() {
  const [threads, setThreads] = useState<CommentThread[]>(INITIAL_THREADS);
  const [filter, setFilter] = useState<"all" | "unanswered" | "needs_attention">("needs_attention");
  const [activeTab, setActiveTab] = useState<"inbox" | "announcements">("inbox");

  // Announcement WYSIWYG & Rate Limiting State (Section 3.2)
  const [announcementSubject, setAnnouncementSubject] = useState("🚀 New Course Module Uploaded: Server Actions & Drizzle ORM");
  const [announcementBody, setAnnouncementBody] = useState("Hello Cohort! We just published three new hands-on practice workshops for Module 2. Make sure to complete the diagnostic practice quiz before Friday.");
  const [sentCountThisWeek, setSentCountThisWeek] = useState(1); // Max 2 emails per week to prevent spam
  const [announcementNotice, setAnnouncementNotice] = useState<string | null>(null);

  // Thread Actions
  const togglePin = (id: string) => {
    setThreads((prev) => prev.map((t) => (t.id === id ? { ...t, isPinned: !t.isPinned } : t)));
  };

  const toggleBestAnswer = (id: string) => {
    setThreads((prev) => prev.map((t) => (t.id === id ? { ...t, isBestAnswer: !t.isBestAnswer, isResolved: true, needsAttention: false } : t)));
  };

  const deleteThread = (id: string) => {
    setThreads((prev) => prev.filter((t) => t.id !== id));
  };

  const submitReply = (id: string, reply: string) => {
    if (!reply.trim()) return;
    setThreads((prev) =>
      prev.map((t) => (t.id === id ? { ...t, replyText: reply, isResolved: true, needsAttention: false } : t))
    );
  };

  const handleSendAnnouncement = () => {
    if (sentCountThisWeek >= 2) {
      setAnnouncementNotice("⚠️ Rate-Limit Rule Triggered: To preserve student inbox trust and prevent spam, announcements are limited to 2 bulk email broadcasts per week.");
      return;
    }
    setSentCountThisWeek((prev) => prev + 1);
    setAnnouncementNotice("✓ Broadcast Sent Successfully! Your cohort email will arrive within 5 minutes.");
    setTimeout(() => setAnnouncementNotice(null), 6000);
  };

  const filteredThreads = threads.filter((t) => {
    if (filter === "unanswered") return !t.replyText;
    if (filter === "needs_attention") return t.needsAttention || !t.replyText;
    return true;
  });

  const [draftReplies, setDraftReplies] = useState<Record<string, string>>({});

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8FF]">
      <Topbar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1080px] mx-auto px-6 py-8 flex flex-col gap-8">
          
          {/* Header Banner with Switcher */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[#EAEAF4]">
            <div>
              <h1 className="text-[26px] font-extrabold text-[#1A1A2E] tracking-tight">Q&amp;A Discussions &amp; Cohort Announcements (Section 3.2)</h1>
              <p className="text-[13px] text-[#64647A] mt-1">
                Manage threaded mentoring inboxes, award best answers, and broadcast spam-protected cohort notifications.
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
                Hòm thư Hỏi đáp ({threads.filter((t) => t.needsAttention).length})
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
                    { id: "needs_attention", label: "Cần phản hồi" },
                    { id: "unanswered", label: "Chưa trả lời" },
                    { id: "all", label: "Tất cả thảo luận" },
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
                  Showing <strong className="text-gray-800">{filteredThreads.length}</strong> active mentoring threads
                </p>
              </div>

              {/* Thread Cards List */}
              {filteredThreads.length === 0 ? (
                <div className="p-16 text-center rounded-3xl bg-white border border-[#EAEAF4] flex flex-col items-center gap-2 text-gray-400">
                  <span className="text-4xl">📭</span>
                  <p className="text-sm font-black text-[#1A1A2E]">All mentoring inquiries answered!</p>
                  <p className="text-xs">Zero threads require attention under the current filter.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {filteredThreads.map((thread) => (
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
                              📌 Pinned to Top
                            </span>
                          )}
                          {thread.isBestAnswer && (
                            <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-black flex items-center gap-1">
                              🏆 Best Answer Awarded
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
                            <span>Instructor Mentoring Reply:</span>
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
                              className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xs transition-all"
                            >
                              {thread.isPinned ? "Unpin Comment" : "📌 Pin Comment"}
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleBestAnswer(thread.id)}
                              className={twMerge(
                                "px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer",
                                thread.isBestAnswer ? "bg-emerald-600 text-white shadow-sm" : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200"
                              )}
                            >
                              🏆 Mark Best Answer &amp; Resolve
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => deleteThread(thread.id)}
                            className="text-gray-400 hover:text-red-600 font-extrabold text-xs px-2 py-1 transition-colors"
                          >
                            🗑️ Delete Thread
                          </button>
                        </div>

                        {!thread.replyText && (
                          <div className="flex items-center gap-3 pt-2">
                            <input
                              type="text"
                              placeholder="Write helpful mentoring guidance or code example..."
                              value={draftReplies[thread.id] || ""}
                              onChange={(e) => setDraftReplies((prev) => ({ ...prev, [thread.id]: e.target.value }))}
                              className="flex-1 px-4 py-3 rounded-2xl border border-[#D5D5FF] bg-white text-xs font-bold focus:outline-none focus:border-[#6B6BFF]"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                submitReply(thread.id, draftReplies[thread.id] || "");
                                setDraftReplies((prev) => ({ ...prev, [thread.id]: "" }));
                              }}
                              className="px-6 py-3 rounded-2xl bg-[#1A1A2E] hover:bg-[#4648D4] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
                            >
                              Send Reply ➔
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
                      <h3 className="text-base font-black text-[#1A1A2E]">Cohort-Wide Rich Text Announcer</h3>
                      <p className="text-xs text-gray-400">Broadcast important syllabus milestones to all enrolled email addresses.</p>
                    </div>
                  </div>

                  {/* Spam Rate-Limit Meter (Section 3.2) */}
                  <div className="text-right">
                    <span className={twMerge("px-3 py-1 rounded-xl text-xs font-black font-mono border", sentCountThisWeek >= 2 ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-emerald-50 text-emerald-700 border-emerald-200")}>
                      Weekly Quota: {sentCountThisWeek} / 2 Emails
                    </span>
                    <p className="text-[10px] font-bold text-gray-400 mt-1">Anti-Spam Rate Limiting Enforced</p>
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
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-wide mb-1.5">Announcement Subject</label>
                    <input
                      type="text"
                      value={announcementSubject}
                      onChange={(e) => setAnnouncementSubject(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border-2 border-indigo-200 text-sm font-black text-[#1A1A2E] focus:outline-none focus:border-[#6B6BFF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-wide mb-1.5">WYSIWYG Rich Text Content</label>
                    <div className="border border-gray-300 rounded-2xl overflow-hidden bg-white">
                      {/* Fake WYSIWYG Toolbar */}
                      <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-200 text-gray-600 text-xs font-bold">
                        <span className="px-2 py-0.5 rounded bg-white border cursor-pointer"><b>B</b></span>
                        <span className="px-2 py-0.5 rounded bg-white border cursor-pointer"><i>I</i></span>
                        <span className="px-2 py-0.5 rounded bg-white border cursor-pointer"><u>U</u></span>
                        <span className="h-4 w-px bg-gray-300 mx-1" />
                        <span className="px-2 py-0.5 rounded bg-white border cursor-pointer">🔗 Link</span>
                        <span className="px-2 py-0.5 rounded bg-white border cursor-pointer">🖼️ Image</span>
                        <span className="px-2 py-0.5 rounded bg-white border cursor-pointer">📝 Code Block</span>
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
                    Recipients will receive notifications directly inside their dashboard &amp; verified email inbox.
                  </p>
                  <button
                    type="button"
                    onClick={handleSendAnnouncement}
                    disabled={sentCountThisWeek >= 2}
                    className="px-8 py-3.5 bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] hover:opacity-95 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg transition-all disabled:opacity-50 cursor-pointer"
                  >
                    🚀 Broadcast To Cohort Now
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
