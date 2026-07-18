"use client";

import Image from "next/image";
import { twMerge } from "tailwind-merge";
import {
  SearchIcon,
  BellIcon,
  HelpCircleIcon,
  SettingsIcon,
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

// ─── Topbar ───────────────────────────────────────────────────────────────────

function Topbar() {
  return (
    <header className="h-16 shrink-0 flex items-center gap-4 px-6 bg-white border-b border-[#F0F0F8]">
      {/* Search */}
      <div className="relative flex-1 max-w-[380px]">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0B0C8] pointer-events-none">
          <SearchIcon size={14} />
        </span>
        <input
          id="analytics-search"
          type="search"
          placeholder="Tìm kiếm học viên, khóa học..."
          className="w-full pl-9 pr-4 h-10 rounded-xl text-sm text-[#1A1A2E] placeholder:text-[#B0B0C8] bg-[#F6F6FB] border border-[#EAEAF4] focus:outline-none focus:border-[#6B6BFF] focus:ring-2 focus:ring-[#6B6BFF]/10 focus:bg-white transition-all duration-200"
        />
      </div>

      <div className="flex-1" />

      {/* Icons */}
      <div className="flex items-center gap-1.5 text-[#7878A0]">
        <button type="button" aria-label="Thông báo" className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-[#F4F4FA] hover:text-[#4648D4] transition-all">
          <BellIcon size={18} />
        </button>
        <button type="button" aria-label="Trợ giúp" className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-[#F4F4FA] hover:text-[#4648D4] transition-all">
          <HelpCircleIcon size={18} />
        </button>
        <button type="button" aria-label="Cài đặt" className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-[#F4F4FA] hover:text-[#4648D4] transition-all">
          <SettingsIcon size={18} />
        </button>
      </div>

      {/* Profile */}
      <div className="flex items-center gap-3 pl-3 border-l border-[#EAEAF4] cursor-pointer group">
        <div className="flex flex-col items-end leading-tight">
          <span className="text-[13px] font-bold text-[#1A1A2E] group-hover:text-[#4648D4] transition-colors">Dr. Minh Khôi</span>
          <span className="text-[10px] font-bold tracking-wide text-[#9090B0] uppercase">Senior Instructor</span>
        </div>
        <div className="w-10 h-10 rounded-full border border-[#EAEAF4] overflow-hidden shrink-0 relative">
          {/* Fallback avatar block for structural integrity, imagine an Image here */}
          <div className="w-full h-full bg-slate-200" />
        </div>
      </div>
    </header>
  );
}

// ─── Main Content (Left) ──────────────────────────────────────────────────────

function InteractionChart() {
  // Mock bars for the chart
  const bars = [40, 65, 30, 90, 50, 45, 80];

  return (
    <div className="bg-white rounded-2xl border border-[#EAEAF4] p-5 flex flex-col h-[280px]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[14px] font-bold text-[#1A1A2E]">Biểu đồ Tương tác</h3>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F4F4FA] text-[12px] font-semibold text-[#64647A] hover:text-[#4648D4] transition-colors">
          7 ngày qua <ChevronDownIcon size={12} />
        </button>
      </div>
      <div className="flex-1 flex items-end justify-between gap-2">
        {bars.map((val, i) => (
          <div key={i} className="w-full flex justify-center group relative">
            <div
              className={twMerge(
                "w-full max-w-[24px] rounded-t-md transition-all duration-300",
                i === 3 ? "bg-[#C5C6FF]" : "bg-[#F0F0F8] group-hover:bg-[#EAEAF4]"
              )}
              style={{ height: \`\${val}%\` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({
  value, label, icon, color
}: {
  value: string; label: string; icon: React.ReactNode; color: "blue" | "purple";
}) {
  return (
    <div className={twMerge(
      "rounded-2xl border p-5 flex flex-col justify-center gap-2 relative overflow-hidden h-[132px]",
      color === "blue" ? "bg-[#F0FAFF] border-[#D0F0FF]" : "bg-[#F5F3FF] border-[#EAE0FF]"
    )}>
      <div className={twMerge(
        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mb-1",
        color === "blue" ? "bg-white text-[#00A3FF]" : "bg-white text-[#9D4EDD]"
      )}>
        {icon}
      </div>
      <div className="flex flex-col">
        <span className={twMerge(
          "text-[22px] font-extrabold leading-none",
          color === "blue" ? "text-[#007AB8]" : "text-[#7B2CBF]"
        )}>
          {value}
        </span>
        <span className={twMerge(
          "text-[12px] font-semibold mt-1",
          color === "blue" ? "text-[#00A3FF]" : "text-[#9D4EDD]"
        )}>
          {label}
        </span>
      </div>
    </div>
  );
}

function NewStudentsList() {
  const students = [
    { name: "An Nguyễn", email: "an.nguyen@example.com", initial: "AN", color: "from-[#C5C6FF] to-[#9090B0]", status: "ĐANG HOẠT ĐỘNG", statusColor: "text-emerald-600 bg-emerald-50", course: "AI Fundamentals" },
    { name: "Lê Huy", email: "huy.le@example.com", initial: "LH", color: "from-[#B0E0E6] to-[#5F9EA0]", status: "VẮNG MẶT", statusColor: "text-amber-600 bg-amber-50", course: "Data Science 101" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#EAEAF4] flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0F0F8]">
        <h3 className="text-[13px] font-bold text-[#1A1A2E]">Danh sách học viên mới</h3>
        <button className="text-[12px] font-semibold text-[#6B6BFF] hover:underline focus:outline-none">
          Xem tất cả
        </button>
      </div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#FAFAFE] border-b border-[#F0F0F8]">
            <th className="px-5 py-3 text-[11px] font-bold text-[#9090B0] uppercase tracking-wide">Học viên</th>
            <th className="px-5 py-3 text-[11px] font-bold text-[#9090B0] uppercase tracking-wide">Trạng thái</th>
            <th className="px-5 py-3 text-[11px] font-bold text-[#9090B0] uppercase tracking-wide">Khóa học gần nhất</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s, i) => (
            <tr key={i} className="border-b border-[#F0F0F8] last:border-0 hover:bg-[#FAFAFE] transition-colors">
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className={twMerge("w-9 h-9 rounded-full flex items-center justify-center text-white text-[12px] font-bold shrink-0 bg-gradient-to-br", s.color)}>
                    {s.initial}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-semibold text-[#1A1A2E]">{s.name}</span>
                    <span className="text-[12px] text-[#9090B0]">{s.email}</span>
                  </div>
                </div>
              </td>
              <td className="px-5 py-3.5">
                <span className={twMerge("px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide inline-block", s.statusColor)}>
                  {s.status.replace(" ", "\\n")}
                </span>
              </td>
              <td className="px-5 py-3.5">
                <span className="text-[13px] font-semibold text-[#464554]">{s.course}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Profile Sidebar (Right) ──────────────────────────────────────────────────

function CourseProgressCard({
  title, level, progress, icon, color, completedAt
}: {
  title: string; level: string; progress: number; icon: React.ReactNode; color: string; completedAt?: string;
}) {
  return (
    <div className="rounded-xl border border-[#EAEAF4] p-4 flex flex-col gap-3 bg-white">
      <div className="flex gap-3">
        <div className={twMerge("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white", color)}>
          {icon}
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-[14px] font-bold text-[#1A1A2E] truncate">{title}</span>
          <span className="text-[11px] text-[#9090B0] font-medium uppercase tracking-wide">Cấp độ: {level}</span>
        </div>
        {!completedAt && (
          <span className="text-[14px] font-bold text-[#6B6BFF] shrink-0">{progress}%</span>
        )}
      </div>

      <div className="flex flex-col gap-1.5 mt-1">
        <div className="w-full h-1.5 rounded-full bg-[#F0F0F8] overflow-hidden">
          <div
            className={twMerge("h-full rounded-full transition-all duration-500", progress === 100 ? "bg-emerald-500" : "bg-[#6B6BFF]")}
            style={{ width: \`\${progress}%\` }}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] text-[#A0A0C0]">
          {completedAt ? (
            <>
              <span>Hoàn thành: {completedAt}</span>
              <CheckCircleIcon size={12} />
            </>
          ) : (
            <span>Lần cuối: {progress > 50 ? "2 giờ trước" : "Hôm qua"}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function StudentProfileSidebar() {
  return (
    <aside className="w-[340px] shrink-0 bg-white border-l border-[#F0F0F8] flex flex-col relative h-[calc(100vh-64px)] overflow-hidden">
      {/* Scrollable area */}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Profile Header */}
        <div className="relative pt-12 pb-6 px-6 flex flex-col items-center bg-gradient-to-b from-[#F5F3FF] to-white border-b border-[#F0F0F8]">
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-md overflow-hidden bg-slate-200">
              <Image
                src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop"
                alt="Avatar"
                width={80}
                height={80}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white" />
          </div>
          <h2 className="text-[18px] font-extrabold text-[#1A1A2E]">An Nguyễn</h2>
          <span className="text-[13px] text-[#9090B0] mt-0.5 mb-3">an.nguyen@example.com</span>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest">Hoạt động</span>
            <span className="px-2.5 py-1 rounded-full bg-[#F0E6FF] text-[#9D4EDD] text-[10px] font-bold uppercase tracking-widest">Premium Plan</span>
          </div>
        </div>

        {/* Courses Section */}
        <div className="p-6 flex flex-col gap-4">
          <h3 className="text-[12px] font-bold text-[#9090B0] uppercase tracking-widest">Khóa học đang tham gia</h3>
          <div className="flex flex-col gap-4">
            <CourseProgressCard
              title="AI Foundations"
              level="Trung cấp"
              progress={85}
              icon={<BrainIcon />}
              color="bg-gradient-to-br from-[#6B6BFF] to-[#4648D4]"
            />
            <CourseProgressCard
              title="Data Science Pro"
              level="Nâng cao"
              progress={42}
              icon={<DatabaseIcon />}
              color="bg-gradient-to-br from-[#00A3FF] to-[#007AB8]"
            />
            <CourseProgressCard
              title="Python for Beginners"
              level="Cơ bản"
              progress={100}
              icon={<CodeIcon />}
              color="bg-emerald-500"
              completedAt="15 Th05, 2024"
            />
          </div>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-[#F0F0F8] flex items-center gap-3">
        <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-[#DDDDF0] text-[13px] font-bold text-[#464554] bg-white hover:bg-[#F4F4FA] hover:border-[#C5C6FF] transition-all">
          <MailIcon />
          Gửi Email
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-bold text-white bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] shadow-[0_4px_14px_rgba(70,72,212,0.35)] hover:shadow-[0_6px_20px_rgba(70,72,212,0.5)] transition-all relative overflow-hidden group">
          <AlignLeftIcon />
          Ghi chú
          <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center scale-75 group-hover:scale-100 transition-transform">
            <SparklesIcon size={12} />
          </span>
        </button>
      </div>
    </aside>
  );
}

// ─── Main Container ───────────────────────────────────────────────────────────

export function StudentAnalyticsContainer() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8FF]">
      <Topbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Main Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[800px] mx-auto px-8 py-8 flex flex-col gap-6">
            {/* Header */}
            <div>
              <h1 className="text-[26px] font-extrabold text-[#1A1A2E] tracking-tight">Quản lý Học viên</h1>
              <p className="text-[14px] text-[#64647A] mt-1">Phân tích chuyên sâu về lộ trình học tập và tương tác của từng cá nhân.</p>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-[1fr_200px] gap-6">
              <InteractionChart />
              <div className="flex flex-col gap-4">
                <StatCard value="124 giờ" label="Tổng thời gian học" icon={<ClockIcon />} color="blue" />
                <StatCard value="12 Chứng chỉ" label="Đã hoàn thành xuất sắc" icon={<AwardIcon />} color="purple" />
              </div>
            </div>

            {/* Students Table */}
            <NewStudentsList />
          </div>
        </main>

        {/* Right: Profile Sidebar */}
        <StudentProfileSidebar />
      </div>
    </div>
  );
}
// ─── End of StudentAnalyticsContainer ────────────────────────────────────────
