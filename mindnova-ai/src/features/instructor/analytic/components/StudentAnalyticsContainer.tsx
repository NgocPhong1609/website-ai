"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { AIInsightsTab } from "./AIInsightsTab";
import { EngagementDashboard } from "../../student-management/components/EngagementDashboard";
import { StudentDetailSidebar } from "../../student-management/components/StudentDetailSidebar";
import { Sparkles, Users } from "lucide-react";


function StudentNavigationTabs({ active }: { active: "students" | "analytics" }) {
 return (
 <div className="flex items-center gap-2 p-1.5 bg-white rounded-xl border border-slate-200 shadow-sm w-fit">
 <Link
 href="/instructor/students"
 className={twMerge(
 "px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer",
 active === "students"
 ? "bg-blue-500 text-white shadow-sm"
 : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
 )}
 >
 <span><Users className="inline h-4 w-4 mr-1.5 align-text-bottom" aria-hidden />Danh sách &amp; Chăm sóc Học viên</span>
 </Link>

 <Link
 href="/instructor/analytics"
 className={twMerge(
 "px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer",
 active === "analytics"
 ? "bg-blue-500 text-white shadow-sm"
 : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
 )}
 >
 <span><Sparkles className="inline h-4 w-4 mr-1.5 align-text-bottom" aria-hidden />Phân tích Tương tác &amp; AI Insights</span>
 </Link>
 </div>
 );
}



export function StudentAnalyticsContainer() {
 const [activeTab, setActiveTab] = useState<"analytics" | "ai_insights">("analytics");
 const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

 return (
 <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
 <div className="flex flex-1 overflow-hidden">
 <main className="flex-1 overflow-y-auto">
 <div className="max-w-[1600px] w-full mx-auto px-6 lg:px-12 py-6 flex flex-col gap-6 pb-16">
 <StudentNavigationTabs active="analytics" />

 {/* Header & Tab Toggle */}
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
 <div>
 <h1 className="text-xl font-bold text-slate-900 tracking-tight">Quản lý &amp; Phân tích Học viên</h1>
 <p className="text-xs text-slate-500 mt-1">
 Kiểm soát mức độ tương tác, lộ trình tiếp thu kiến thức và chẩn đoán các điểm nghẽn bài học với AI.
 </p>
 </div>

 <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white border border-slate-200 shadow-sm">
 <button
 type="button"
 onClick={() => setActiveTab("analytics")}
 className={twMerge(
 "px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer",
 activeTab === "analytics" ? "bg-blue-500 text-white shadow-sm" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
 )}
 >
 Báo cáo Tương tác &amp; Tiến độ
 </button>
 <button
 type="button"
 onClick={() => setActiveTab("ai_insights")}
 className={twMerge(
 "px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5",
 activeTab === "ai_insights" ? "bg-blue-500 text-white shadow-sm" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
 )}
 >
 <span>Phân tích AI Chuyên sâu</span>
 </button>
 </div>
 </div>

 {activeTab === "ai_insights" ? (
 <AIInsightsTab />
 ) : (
 <EngagementDashboard onSelectStudent={setSelectedStudent} />
 )}
 </div>
 </main>

 {activeTab === "analytics" && selectedStudent && (
 <StudentDetailSidebar 
   student={{
     id: selectedStudent,
     name: `Học viên #${selectedStudent}`,
     email: "student@example.com",
     course: { id: "", title: "Khóa học" },
     progress: 0,
     status: "Đang học"
   }} 
   onClose={() => setSelectedStudent(null)} 
 />
 )}
 </div>
 </div>
 );
}