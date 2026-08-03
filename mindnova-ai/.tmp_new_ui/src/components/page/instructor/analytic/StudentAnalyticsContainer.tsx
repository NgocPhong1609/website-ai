"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { AIInsightsTab } from "./AIInsightsTab";
import {
  ClockIcon,
  AwardIcon,
  SparklesIcon,
  MailIcon,
  AlignLeftIcon,
  ChevronDownIcon,
  BrainIcon,
  DatabaseIcon,
  CodeIcon,
  CheckCircleIcon,
} from "./icons";

function StudentNavigationTabs({ active }: { active: "students" | "analytics" }) {
  return (
    <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-gray-200 shadow-2xs w-fit">
      <Link
        href="/instructor/students"
        className={twMerge(
          "px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer",
          active === "students"
            ? "bg-[#4F46E5] text-white shadow-sm"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        )}
      >
        <span>👥 Danh sách &amp; Chăm sóc Học viên</span>
      </Link>

      <Link
        href="/instructor/analytics"
        className={twMerge(
          "px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer",
          active === "analytics"
            ? "bg-[#4F46E5] text-white shadow-sm"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        )}
      >
        <span>📈 Phân tích Tương tác &amp; AI Insights</span>
      </Link>
    </div>
  );
}

function InteractionChart() {
  const bars = [40, 65, 30, 90, 50, 45, 80];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs flex flex-col justify-between h-[270px]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-black text-gray-900">Biểu Đồ Tương Tác Học Tập</h3>
          <p className="text-[11px] text-gray-500 mt-0.5">Tối ưu hóa tần suất hoạt động theo từng ngày trong tuần.</p>
        </div>
        <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 text-xs font-bold text-gray-600 border border-gray-200 hover:text-gray-900 transition-colors">
          <span>7 ngày qua</span>
          <ChevronDownIcon size={12} />
        </button>
      </div>
      <div className="flex-1 flex items-end justify-between gap-3 px-2 pt-2 border-t border-gray-100">
        {bars.map((val, i) => (
          <div key={i} className="w-full flex flex-col items-center gap-2 group">
            <div className="w-full flex justify-center flex-1 items-end">
              <div
                className={twMerge(
                  "w-full max-w-[28px] rounded-t-lg transition-all duration-300",
                  i === 3 ? "bg-[#4F46E5]" : "bg-indigo-100 group-hover:bg-indigo-300"
                )}
                style={{ height: `${val}%` }}
              />
            </div>
            <span className="text-[10px] font-extrabold text-gray-400">
              {["T2", "T3", "T4", "T5", "T6", "T7", "CN"][i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ value, label, icon, isAccent }: { value: string; label: string; icon: React.ReactNode; isAccent?: boolean }) {
  return (
    <div className={twMerge(
      "rounded-2xl border p-4.5 flex flex-col justify-center gap-2 relative overflow-hidden h-[128px] shadow-2xs",
      isAccent ? "bg-indigo-50 border-indigo-200" : "bg-white border-gray-200"
    )}>
      <div className={twMerge(
        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-2xs",
        isAccent ? "bg-white text-[#4F46E5] border-indigo-100" : "bg-gray-50 text-emerald-600 border-gray-100"
      )}>
        {icon}
      </div>
      <div>
        <span className="text-xl font-black text-gray-900 block leading-tight">{value}</span>
        <span className="text-xs font-bold text-gray-500 mt-0.5 block">{label}</span>
      </div>
    </div>
  );
}

function NewStudentsList() {
  const students = [
    { name: "An Nguyễn", email: "an.nguyen@example.com", initial: "AN", color: "bg-indigo-600", status: "ĐANG HOẠT ĐỘNG", statusColor: "text-emerald-700 bg-emerald-50 border-emerald-200", course: "AI Mastery & LLMs for Beginners" },
    { name: "Lê Huy", email: "huy.le@example.com", initial: "LH", color: "bg-teal-600", status: "TẠM VẮNG MẶT", statusColor: "text-amber-700 bg-amber-50 border-amber-200", course: "Fullstack Next.js 16 & Turbo Pro" },
    { name: "Phan Anh Tấn", email: "tan.phan@example.com", initial: "PT", color: "bg-purple-600", status: "ĐANG HOẠT ĐỘNG", statusColor: "text-emerald-700 bg-emerald-50 border-emerald-200", course: "Python Data Science Pro" }
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs flex flex-col overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-gray-100">
        <div>
          <h3 className="text-sm font-black text-gray-900">Danh Sách Học Viên Mới Gia Nhập</h3>
          <p className="text-xs text-gray-500 mt-0.5">Theo dõi hồ sơ và tiến độ chi tiết của học viên mới ghi danh trong tháng.</p>
        </div>
        <Link href="/instructor/students" className="text-xs font-bold text-[#4F46E5] hover:underline focus:outline-none">
          Xem Toàn Bộ Học Viên ➔
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr className="bg-gray-50/70 border-b border-gray-200 text-[11px] font-black text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-3.5">Học Viên Ghi Danh</th>
              <th className="px-6 py-3.5">Trạng Thái Tương Tác</th>
              <th className="px-6 py-3.5">Khóa Học Gia Nhập</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs font-medium">
            {students.map((s, i) => (
              <tr key={i} className="hover:bg-gray-50/80 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={twMerge("w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-xs", s.color)}>
                      {s.initial}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-extrabold text-gray-900">{s.name}</span>
                      <span className="text-[11px] text-gray-400">{s.email}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={twMerge("px-2.5 py-1 rounded-md text-[10px] font-bold uppercase block w-fit border", s.statusColor)}>
                    {s.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-extrabold text-gray-800">
                  {s.course}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CourseProgressCard({ title, level, progress, icon, isComplete }: { title: string; level: string; progress: number; icon: React.ReactNode; isComplete?: boolean }) {
  return (
    <div className="rounded-xl border border-gray-200 p-3.5 flex flex-col gap-2.5 bg-white shadow-2xs">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={twMerge("w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border", isComplete ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-indigo-50 text-[#4F46E5] border-indigo-100")}>
            {icon}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-gray-900 truncate">{title}</span>
            <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Cấp độ: {level}</span>
          </div>
        </div>
        <span className="text-xs font-extrabold text-[#4F46E5] shrink-0">{progress}%</span>
      </div>

      <div className="flex flex-col gap-1 mt-0.5">
        <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
          <div className={twMerge("h-full rounded-full transition-all duration-500", progress === 100 ? "bg-emerald-500" : "bg-[#4F46E5]")} style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between items-center text-[10px] text-gray-400 font-semibold">
          {isComplete ? (
            <span className="text-emerald-600 flex items-center gap-1">✓ Hoàn thành: 15 Th05</span>
          ) : (
            <span>Học lần cuối: 2 giờ trước</span>
          )}
        </div>
      </div>
    </div>
  );
}

function StudentProfileSidebar() {
  return (
    <aside className="w-[340px] shrink-0 bg-white border-l border-gray-200 flex flex-col justify-between h-full min-h-[calc(100vh-64px)] shadow-xs">
      <div className="overflow-y-auto pb-6 flex-1">
        {/* Profile Header */}
        <div className="pt-8 pb-6 px-6 flex flex-col items-center bg-gray-50/70 border-b border-gray-100">
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-sm overflow-hidden bg-slate-200">
              <Image
                src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop"
                alt="Avatar"
                width={80}
                height={80}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white shadow-2xs" />
          </div>
          <h2 className="text-base font-black text-gray-900">An Nguyễn</h2>
          <span className="text-xs text-gray-500 mt-0.5 mb-3">an.nguyen@example.com</span>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase">Hoạt động</span>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-[10px] font-bold uppercase">Học viên VIP</span>
          </div>
        </div>

        {/* Courses Section */}
        <div className="p-5 flex flex-col gap-3.5">
          <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider">Khóa học đang theo học</h3>
          <div className="flex flex-col gap-3">
            <CourseProgressCard title="AI Foundations & Neural Nets" level="Trung cấp" progress={85} icon={<BrainIcon size={16} />} />
            <CourseProgressCard title="Data Science Professional" level="Nâng cao" progress={42} icon={<DatabaseIcon size={16} />} />
            <CourseProgressCard title="Python for Beginners" level="Cơ bản" progress={100} icon={<CodeIcon size={16} />} isComplete />
          </div>
        </div>
      </div>

      {/* Action footer */}
      <div className="p-4 bg-white border-t border-gray-200 flex items-center gap-3 shrink-0">
        <button type="button" className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 transition-all cursor-pointer">
          <MailIcon size={14} />
          <span>Gửi Email</span>
        </button>
        <button type="button" className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-extrabold text-white bg-[#4F46E5] hover:bg-[#4338CA] shadow-2xs transition-all cursor-pointer">
          <AlignLeftIcon size={14} />
          <span>Ghi chú AI</span>
        </button>
      </div>
    </aside>
  );
}

export function StudentAnalyticsContainer() {
  const [activeTab, setActiveTab] = useState<"analytics" | "ai_insights">("analytics");

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F4F8] font-sans">
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col gap-6 pb-16">
            <StudentNavigationTabs active="analytics" />

            {/* Header & Tab Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
              <div>
                <h1 className="text-xl font-black text-gray-900 tracking-tight">Quản lý &amp; Phân tích Học viên</h1>
                <p className="text-xs text-gray-500 mt-1">
                  Kiểm soát mức độ tương tác, lộ trình tiếp thu kiến thức và chẩn đoán các điểm nghẽn bài học với AI.
                </p>
              </div>

              <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white border border-gray-200 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setActiveTab("analytics")}
                  className={twMerge(
                    "px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer",
                    activeTab === "analytics" ? "bg-[#4F46E5] text-white shadow-2xs" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  Báo cáo Tương tác &amp; Tiến độ
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("ai_insights")}
                  className={twMerge(
                    "px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5",
                    activeTab === "ai_insights" ? "bg-[#4F46E5] text-white shadow-2xs" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  <span>Phân tích AI Chuyên sâu</span>
                </button>
              </div>
            </div>

            {activeTab === "ai_insights" ? (
              <AIInsightsTab />
            ) : (
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] gap-5">
                  <InteractionChart />
                  <div className="flex flex-col gap-3.5 justify-between">
                    <StatCard value="124 Giờ" label="Tổng Thời Gian Học Tập" icon={<ClockIcon size={20} />} isAccent />
                    <StatCard value="12 Chứng Chỉ" label="Hoàn Thành Xuất Sắc" icon={<AwardIcon size={20} />} />
                  </div>
                </div>

                <NewStudentsList />
              </div>
            )}
          </div>
        </main>

        {activeTab === "analytics" && (
          <div className="hidden xl:block">
            <StudentProfileSidebar />
          </div>
        )}
      </div>
    </div>
  );
}