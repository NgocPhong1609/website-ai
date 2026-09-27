"use client";

import React, { useState } from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

import { useQuery } from "@tanstack/react-query";
import { getLatestDiscussions, getAnalytics } from "../api";
import { Plus, Sparkles, TrendingUp } from "lucide-react";

function DiscussionAvatar({ initials, color }: { initials: string; color: string }) {
 return (
 <div className={twMerge("w-8 h-8 rounded-lg flex items-center justify-center text-white text-[11px] font-bold shrink-0 shadow-sm", color)}>
 <span>{initials}</span>
 </div>
 );
}

function DiscussionPanel({ courseId }: { courseId?: string }) {
 const { data, isLoading } = useQuery({
 queryKey: ["latest-discussions", courseId],
 queryFn: () => getLatestDiscussions({ limit: 3 }),
 });

 const discussions = data || [];
 const unreadCount = discussions.filter((d: any) => d.status === 'open' && !d.is_resolved).length;

 return (
 <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
 <div className="flex items-center justify-between p-4 border-b border-slate-100">
 <span className="text-xs font-bold text-slate-900 tracking-wider uppercase">
 Thảo luận mới nhất
 </span>
 <span className="px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-[10px] font-bold">
 {unreadCount > 0 ? `${unreadCount} CHƯA ĐỌC` : "0 CHƯA ĐỌC"}
 </span>
 </div>

 <div className="divide-y divide-slate-100 min-h-[100px]">
 {isLoading ? (
 <div className="flex items-center justify-center p-6">
 
 </div>
 ) : discussions.length === 0 ? (
 <div className="p-4 text-center text-xs text-slate-400 font-bold">Chưa có thảo luận nào.</div>
 ) : (
 discussions.map((d: any) => {
 const initials = d.student?.name ? d.student.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase() : "HV";
 const color = "text-blue-500";
 return (
 <div key={d.id} className="flex items-start gap-3 p-3.5 hover:bg-slate-50/80 transition-colors cursor-pointer">
 {d.student?.avatar_url ? (
 <img src={d.student.avatar_url} alt={d.student.name} className="w-8 h-8 rounded-lg shadow-sm object-cover shrink-0" />
 ) : (
 <DiscussionAvatar initials={initials} color={color} />
 )}
 <div className="flex-1 min-w-0">
 <div className="flex items-center justify-between gap-1">
 <span className="text-xs font-semibold text-slate-900 truncate">{d.student?.name || "Học viên"}</span>
 <span className="text-[10px] text-slate-400 font-medium shrink-0">
 {new Date(d.created_at).toLocaleDateString('vi-VN')}
 </span>
 </div>
 <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mt-0.5 italic">
 "{d.content}"
 </p>
 </div>
 </div>
 );
 })
 )}
 </div>

 <div className="p-3.5 border-t border-slate-100 text-center bg-slate-50/50">
 <Link href="/instructor/discussions" className="text-xs font-bold text-blue-500 hover:underline block w-full">
 Xem tất cả thảo luận học viên 
 </Link>
 </div>
 </div>
 );
}

const QUICK_TAGS = ["Động viên học tập", "Nhắc lịch kiểm tra", "Cập nhật bài giảng mới"];

function AIAnnouncementPanel({ onOpenModal }: { onOpenModal: (topic?: string) => void }) {
 const [topic, setTopic] = useState("");
 const [activeTag, setActiveTag] = useState<string | null>(null);

 return (
 <div className="rounded-lg border-slate-200 bg-blue-50/20 shadow-sm overflow-hidden">
 <div className="p-4 border-b border-slate-200 text-slate-900 flex items-center gap-2 bg-blue-50/50">
 <span className="text-blue-500"><Sparkles size={16} /></span>
 <span className="text-xs font-bold text-blue-500 tracking-wide uppercase">Trợ lý Thông báo AI</span>
 </div>

 <div className="p-4 flex flex-col gap-3">
 <p className="text-xs text-slate-500 leading-relaxed">
 Soạn thảo và gửi thông báo khích lệ tự động tới toàn bộ cohort bằng sức mạnh AI MindNova.
 </p>

 <textarea
 value={topic}
 onChange={(e) => setTopic(e.target.value)}
 placeholder="Nhập ý chính hoặc chủ đề cần phát đi..."
 rows={3}
 className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 resize-none shadow-sm"
 />

 <div className="flex items-center gap-1.5 flex-wrap">
 {QUICK_TAGS.map((tag) => (
 <button
 key={tag}
 type="button"
 onClick={() => setActiveTag(activeTag === tag ? null : tag)}
 className={twMerge(
 "px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer",
 activeTag === tag
 ? "bg-blue-500 text-white border-blue-500"
 : "border-slate-200 text-slate-500 bg-white hover:bg-blue-600 hover:bg-blue-600"
 )}
 >
 + {tag}
 </button>
 ))}
 </div>

 <button
 type="button"
 id="btn-ai-announcement"
 onClick={() => onOpenModal(activeTag || topic)}
 className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-xs font-semibold text-white bg-blue-500 hover:bg-blue-600 shadow-sm transition-all cursor-pointer mt-1"
 >
 <Plus size={14} />
 <span>Tạo Thông Báo Bằng AI Ngay</span>
 </button>
 </div>
 </div>
 );
}

interface StatBarProps {
 label: string;
 value: string;
 percent: number;
 color: "blue" | "red" | "purple";
}

function StatBar({ label, value, percent, color }: StatBarProps) {
 const barColor = {
 blue: "bg-blue-500",
 red: "bg-rose-500",
 purple: "text-blue-500",
 }[color];

 return (
 <div className="flex flex-col gap-1.5">
 <div className="flex items-center justify-between">
 <span className="text-xs text-slate-500 font-bold">{label}</span>
 <span className={twMerge("text-xs font-bold font-mono", color === "red" ? "text-rose-600" : "text-blue-500")}>
 {value}
 </span>
 </div>
 <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
 <div className={twMerge("h-full rounded-full transition-all duration-700", barColor)} style={{ width: `${percent}%` }} />
 </div>
 </div>
 );
}

function ProgressStatsPanel({ courseId }: { courseId?: string }) {
 const { data, isLoading } = useQuery({
 queryKey: ["student-analytics", courseId],
 queryFn: () => getAnalytics({ course_id: courseId === "TẤT CẢ" ? undefined : courseId }),
 });

 return (
 <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
 <div className="p-4 border-b border-slate-100">
 <span className="text-xs font-bold text-slate-900 tracking-wider uppercase">
 Thống Kê Tổng Quan Khóa Học
 </span>
 </div>

 <div className="p-4 flex flex-col gap-4">
 {isLoading ? (
 <div className="flex items-center justify-center py-6">
 
 </div>
 ) : (
 <>
 <StatBar label="Tỷ lệ hoàn thành trung bình" value={`${data?.average_progress || 0}%`} percent={data?.average_progress || 0} color="blue" />
 <StatBar label="Tỷ lệ rớt chứng chỉ dự kiến" value={`${data?.at_risk_rate || 0}%`} percent={data?.at_risk_rate || 0} color="red" />
 <StatBar label="Học viên tích cực (Tuần qua)" value={`${data?.active_students || 0}`} percent={data?.total_students ? (data.active_students / data.total_students) * 100 : 0} color="purple" />

 <div className="rounded-lg bg-emerald-50/80 border-slate-200 p-3.5 flex items-start gap-2.5 mt-2">
 <span className="text-slate-900 mt-0.5 shrink-0"><TrendingUp size={16} /></span>
 <div className="flex flex-col gap-0.5">
 <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">Gợi ý Tối ưu AI</span>
 <p className="text-xs text-slate-900 leading-relaxed font-medium">
 {data?.at_risk_rate > 10 
 ? "Tỷ lệ rớt chứng chỉ đang cao, bạn nên gửi thông báo AI khích lệ các học viên có tiến độ dưới 30%!" 
 : "Học viên đang duy trì tiến độ tốt. Hãy tiếp tục giải đáp thảo luận để duy trì sự tương tác!"}
 </p>
 </div>
 </div>
 </>
 )}
 </div>
 </div>
 );
}

export function RightPanels({ onOpenModal, courseId }: { onOpenModal: (topic?: string) => void, courseId?: string }) {
 return (
 <div className="flex flex-col gap-5 w-full">
 <DiscussionPanel courseId={courseId} />
 <AIAnnouncementPanel onOpenModal={() => onOpenModal()} />
 <ProgressStatsPanel courseId={courseId} />
 </div>
 );
}