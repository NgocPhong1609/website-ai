"use client";

import Image from "next/image";
import { twMerge } from "tailwind-merge";
import {
  SearchIcon,
  BellIcon,
  MessageIcon,
  SettingsIcon,
  DownloadIcon,
  WalletIcon,
  TrendUpIcon,
  ClockIcon,
  UsersIcon,
  InfoCircleIcon,
  ChevronDownIcon,
  FilterIcon,
  BuildingBankIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  BarChartIcon,
  BrainIcon,
  CodeIcon,
  PieChartIcon,
  SparklesIcon,
  DollarSignIcon,
} from "./icons";
import { useState } from "react";
import { WithdrawalModal } from "./WithdrawalModal";

// ─── Topbar ───────────────────────────────────────────────────────────────────

function Topbar() {
  return (
    <header className="h-16 shrink-0 flex items-center gap-4 px-8 bg-white border-b border-[#F0F0F8]">
      {/* Search */}
      <div className="relative flex-1 max-w-[400px]">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0B0C8] pointer-events-none">
          <SearchIcon size={14} />
        </span>
        <input
          id="revenue-search"
          type="search"
          placeholder="Tìm kiếm giao dịch, báo cáo..."
          className="w-full pl-9 pr-4 h-9 rounded-full text-[13px] text-[#1A1A2E] placeholder:text-[#B0B0C8] bg-[#F6F6FB] border border-[#EAEAF4] focus:outline-none focus:border-[#6B6BFF] focus:ring-2 focus:ring-[#6B6BFF]/10 transition-all duration-200"
        />
      </div>

      <div className="flex-1" />

      {/* Icons */}
      <div className="flex items-center gap-1.5 text-[#7878A0]">
        <button type="button" className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#F4F4FA] hover:text-[#4648D4] transition-all relative">
          <BellIcon size={17} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
        </button>
        <button type="button" className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#F4F4FA] hover:text-[#4648D4] transition-all">
          <MessageIcon size={17} />
        </button>
        <button type="button" className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#F4F4FA] hover:text-[#4648D4] transition-all">
          <SettingsIcon size={17} />
        </button>
      </div>

      {/* Profile */}
      <div className="flex items-center gap-3 pl-3 border-l border-[#EAEAF4] cursor-pointer group">
        <div className="flex flex-col items-end leading-tight">
          <span className="text-[12px] font-bold text-[#1A1A2E] group-hover:text-[#4648D4] transition-colors">Minh Nguyễn</span>
          <span className="text-[10px] text-[#9090B0]">Professional Instructor</span>
        </div>
        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-[#EAEAF4] bg-slate-200">
          <Image
            src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop"
            alt="Avatar"
            width={32}
            height={32}
            className="w-full h-full object-cover"
            unoptimized
          />
        </div>
      </div>
    </header>
  );
}

// ─── Header & Stats ───────────────────────────────────────────────────────────

function PageHeader({ onOpenWithdrawal }: { onOpenWithdrawal: () => void }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex flex-col">
        <h1 className="text-[26px] font-extrabold text-[#1A1A2E] tracking-tight">Doanh thu & Tài chính</h1>
        <p className="text-[13px] text-[#64647A] mt-1">
          Theo dõi thu nhập và quản lý các giao dịch của bạn tại MindNova.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#DDDDF0] text-[13px] font-bold text-[#464554] bg-white hover:bg-[#F4F4FA] transition-colors">
          <DownloadIcon /> Xem báo cáo bán hàng
        </button>
        <button 
          onClick={onOpenWithdrawal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold text-white bg-[#4648D4] hover:bg-[#3D40C0] shadow-[0_4px_14px_rgba(70,72,212,0.3)] hover:shadow-[0_6px_20px_rgba(70,72,212,0.4)] transition-all hover:-translate-y-0.5"
        >
          <WalletIcon /> Rút tiền ngay
        </button>
      </div>
    </div>
  );
}

function StatCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
      {/* Total Revenue */}
      <div className="bg-white rounded-2xl p-5 border border-[#EAEAF4] shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col relative overflow-hidden">
        <div className="absolute right-4 top-4 text-[#F0F0F8] scale-150 transform translate-x-2 -translate-y-2">
          <DollarSignIcon size={48} />
        </div>
        <span className="text-[12px] font-bold text-[#64647A] uppercase tracking-wide">Tổng doanh thu <span className="normal-case font-medium text-[#9090B0]">(Tháng này)</span></span>
        <span className="text-[24px] font-extrabold text-[#1A1A2E] mt-2 leading-tight">128.450.000đ</span>
        <div className="flex items-center gap-1.5 mt-3 text-[11px] font-bold text-[#4648D4]">
          <TrendUpIcon /> +12.5% so với tháng trước
        </div>
      </div>

      {/* Available Balance */}
      <div className="bg-white rounded-2xl p-5 border border-[#EAEAF4] shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col">
        <span className="text-[12px] font-bold text-[#64647A] uppercase tracking-wide">Số dư khả dụng</span>
        <span className="text-[24px] font-extrabold text-[#4648D4] mt-2 leading-tight">42.180.000đ</span>
        <div className="flex items-center gap-1.5 mt-3 text-[11px] font-medium text-[#9090B0]">
          <ClockIcon /> Cập nhật 5 phút trước
        </div>
      </div>

      {/* New Registrations */}
      <div className="bg-white rounded-2xl p-5 border border-[#EAEAF4] shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col">
        <span className="text-[12px] font-bold text-[#64647A] uppercase tracking-wide">Lượt đăng ký mới</span>
        <span className="text-[24px] font-extrabold text-[#1A1A2E] mt-2 leading-tight">342</span>
        <div className="flex items-center gap-1.5 mt-3 text-[11px] font-bold text-[#4648D4]">
          <UsersIcon /> +48 học viên hôm nay
        </div>
      </div>

      {/* Refund Rate */}
      <div className="bg-white rounded-2xl p-5 border border-[#EAEAF4] shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col">
        <span className="text-[12px] font-bold text-[#64647A] uppercase tracking-wide">Tỷ lệ hoàn tiền</span>
        <span className="text-[24px] font-extrabold text-[#1A1A2E] mt-2 leading-tight">0.8%</span>
        <div className="flex items-center gap-1.5 mt-3 text-[11px] font-medium text-[#9090B0]">
          <InfoCircleIcon /> Thấp hơn mức trung bình 1.2%
        </div>
      </div>
    </div>
  );
}

// ─── Middle Section (Chart & Transactions) ────────────────────────────────────

function RevenueChart() {
  return (
    <div className="bg-white rounded-2xl border border-[#EAEAF4] p-6 flex flex-col shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-[15px] font-extrabold text-[#1A1A2E]">Biểu đồ doanh thu</h3>
        <div className="flex items-center bg-[#F4F4FA] rounded-lg p-1">
          <button className="px-4 py-1.5 text-[12px] font-bold text-[#464554] bg-white rounded shadow-sm">Tuần</button>
          <button className="px-4 py-1.5 text-[12px] font-semibold text-[#9090B0] hover:text-[#464554] transition-colors">Tháng</button>
          <button className="px-4 py-1.5 text-[12px] font-semibold text-[#9090B0] hover:text-[#464554] transition-colors">Năm</button>
        </div>
      </div>
      
      {/* Mock Chart Area */}
      <div className="flex-1 min-h-[220px] flex items-end justify-between gap-4 px-2 relative">
        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none border-b border-[#F0F0F8]">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-full h-px bg-[#F0F0F8] mb-[60px]" />
          ))}
        </div>
        {/* Bars */}
        {[30, 45, 80, 55, 60, 40, 70].map((h, i) => (
          <div key={i} className="relative flex flex-col items-center w-full max-w-[32px] group cursor-pointer z-10">
            <div 
              className={twMerge("w-full rounded-t-lg transition-all duration-300", i === 2 ? "bg-[#6B6BFF]" : "bg-[#EAEAF4] group-hover:bg-[#C5C6FF]")}
              style={{ height: \`\${h * 2}px\` }}
            />
            <span className={twMerge("mt-3 text-[10px] font-bold", i === 2 ? "text-[#1A1A2E]" : "text-[#9090B0]")}>
              {["T2", "T3", "Hôm nay", "T5", "T6", "T7", "CN"][i]}
            </span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-8 mt-8 pt-6 border-t border-[#F0F0F8]">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#6B6BFF]" />
            <span className="text-[11px] font-semibold text-[#9090B0]">Khóa học bán chạy nhất:</span>
          </div>
          <span className="text-[13px] font-bold text-[#1A1A2E] ml-4">AI Mastery for Business</span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00A3FF]" />
            <span className="text-[11px] font-semibold text-[#9090B0]">Nguồn thu chính:</span>
          </div>
          <span className="text-[13px] font-bold text-[#1A1A2E] ml-4">Đăng ký trực tiếp (85%)</span>
        </div>
      </div>
    </div>
  );
}

function RecentTransactions() {
  const items = [
    { type: "buy", title: "Bán khóa học", detail: "Lê Anh Tuấn • 14:20", amount: "+1.250.000đ", color: "text-emerald-600", bg: "bg-emerald-50", icon: <CheckCircleIcon size={14} /> },
    { type: "withdraw", title: "Rút tiền (MB Bank)", detail: "Đã hoàn thành • 09:15", amount: "-15.000.000đ", color: "text-[#464554]", bg: "bg-[#F0F0F8]", icon: <BuildingBankIcon size={14} /> },
    { type: "buy", title: "Bán khóa học", detail: "Nguyễn Trần Nhã...", amount: "+1.250.000đ", color: "text-emerald-600", bg: "bg-emerald-50", icon: <CheckCircleIcon size={14} /> },
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#EAEAF4] flex flex-col shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between p-6 pb-4">
        <h3 className="text-[15px] font-extrabold text-[#1A1A2E]">Giao dịch gần đây</h3>
        <button className="text-[12px] font-bold text-[#6B6BFF] hover:underline">Tất cả</button>
      </div>

      <div className="flex flex-col px-4 gap-2 flex-1">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-[#FAFAFE] transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className={twMerge("w-9 h-9 rounded-full flex items-center justify-center shrink-0", item.bg, item.color)}>
                {item.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-bold text-[#1A1A2E]">{item.title}</span>
                <span className="text-[11px] text-[#9090B0] mt-0.5">{item.detail}</span>
              </div>
            </div>
            <span className={twMerge("text-[13px] font-extrabold", item.type === "buy" ? "text-[#6B6BFF]" : "text-[#1A1A2E]")}>
              {item.amount}
            </span>
          </div>
        ))}
      </div>

      <div className="p-4 m-4 mt-2 bg-gradient-to-r from-[#EEF0FF] to-[#E6E8FF] rounded-xl flex items-start gap-3">
        <div className="text-[#6B6BFF] mt-0.5 shrink-0"><ShieldCheckIcon /></div>
        <p className="text-[11px] text-[#4648D4] leading-relaxed font-medium">
          Mọi giao dịch của bạn đều được mã hóa và bảo vệ bởi hệ thống MindNova Secure.
        </p>
      </div>
    </div>
  );
}

// ─── Bottom Section (Course Revenue Table) ────────────────────────────────────

function RevenueByCourseTable() {
  const courses = [
    { name: "AI Mastery for Business", icon: <BrainIcon />, color: "bg-[#6B6BFF]", students: 156, rev: "65.400.000đ", conv: 72, status: "TĂNG TRƯỞNG", statusColor: "text-emerald-600 bg-emerald-50" },
    { name: "Machine Learning Basics", icon: <CodeIcon />, color: "bg-[#00A3FF]", students: 84, rev: "32.800.000đ", conv: 45, status: "ỔN ĐỊNH", statusColor: "text-[#4648D4] bg-[#EEF0FF]" },
    { name: "Data Visualization Secrets", icon: <PieChartIcon />, color: "bg-[#9D4EDD]", students: 102, rev: "30.250.000đ", conv: 68, status: "TĂNG TRƯỞNG", statusColor: "text-emerald-600 bg-emerald-50" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#EAEAF4] shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
      <div className="p-6 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F0F0F8]">
        <div>
          <h3 className="text-[16px] font-extrabold text-[#1A1A2E]">Chi tiết doanh số theo khóa học</h3>
          <p className="text-[12px] text-[#9090B0] mt-1">Dữ liệu tổng hợp từ 30 ngày qua</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#DDDDF0] text-[12px] font-semibold text-[#464554] bg-white hover:bg-[#F4F4FA]">
            Tháng này <ChevronDownIcon />
          </button>
          <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#DDDDF0] text-[#64647A] hover:bg-[#F4F4FA]">
            <FilterIcon />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-[#FAFAFE] border-b border-[#F0F0F8]">
              <th className="px-6 py-4 text-[11px] font-bold text-[#9090B0] uppercase tracking-wide">Tên khóa học</th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#9090B0] uppercase tracking-wide">Học viên mới</th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#9090B0] uppercase tracking-wide">Doanh thu</th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#9090B0] uppercase tracking-wide">Tỷ lệ chuyển đổi</th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#9090B0] uppercase tracking-wide">Trạng thái</th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#9090B0] uppercase tracking-wide text-right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c, i) => (
              <tr key={i} className="border-b border-[#F0F0F8] last:border-0 hover:bg-[#FAFAFE] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={twMerge("w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm", c.color)}>
                      {c.icon}
                    </div>
                    <span className="text-[13px] font-bold text-[#1A1A2E] truncate max-w-[180px]">{c.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-[13px] font-bold text-[#464554]">{c.students}</td>
                <td className="px-6 py-4 text-[13px] font-extrabold text-[#1A1A2E]">{c.rev}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 rounded-full bg-[#F0F0F8] overflow-hidden min-w-[60px]">
                      <div className="h-full rounded-full bg-[#6B6BFF]" style={{ width: \`\${c.conv}%\` }} />
                    </div>
                    <span className="text-[12px] font-bold text-[#64647A] w-7">{c.conv}%</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={twMerge("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest", c.statusColor)}>
                    {c.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-[#9090B0] hover:text-[#4648D4] hover:bg-[#EEF0FF] transition-colors">
                    <BarChartIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 flex items-center justify-between border-t border-[#F0F0F8]">
        <span className="text-[12px] font-medium text-[#9090B0]">Hiển thị 3 trên 12 khóa học</span>
        <div className="flex items-center gap-2">
          <button className="text-[12px] font-semibold text-[#B0B0C8] cursor-not-allowed px-2 py-1">Trước</button>
          <button className="text-[12px] font-semibold text-[#4648D4] hover:bg-[#EEF0FF] rounded px-3 py-1 transition-colors">Sau</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Container ───────────────────────────────────────────────────────────

export function RevenueContainer() {
  const [isWithdrawalOpen, setIsWithdrawalOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8FF]">
      <Topbar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1100px] mx-auto px-8 py-8 flex flex-col gap-8 pb-32">
          <PageHeader onOpenWithdrawal={() => setIsWithdrawalOpen(true)} />
          <StatCards />
          
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
            <RevenueChart />
            <RecentTransactions />
          </div>

          <RevenueByCourseTable />
        </div>
      </main>

      {/* Footer Links & Floating AI Button */}
      <div className="fixed bottom-0 right-0 left-0 lg:left-[240px] px-8 py-4 bg-white/80 backdrop-blur border-t border-[#F0F0F8] flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center gap-6 pointer-events-auto">
          <button className="text-[11px] font-semibold text-[#9090B0] hover:text-[#464554]">Chính sách thanh toán</button>
          <button className="text-[11px] font-semibold text-[#9090B0] hover:text-[#464554]">Điều khoản sử dụng</button>
          <button className="text-[11px] font-semibold text-[#9090B0] hover:text-[#464554]">Trung tâm trợ giúp</button>
        </div>
        
        <div className="flex items-center gap-6 pointer-events-auto">
          <span className="text-[11px] text-[#B0B0C8]">© 2024 MindNova AI Education. All rights reserved.</span>
          <button className="flex items-center gap-2 px-5 py-3 rounded-full text-[13px] font-bold text-white bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] shadow-[0_4px_14px_rgba(70,72,212,0.35)] hover:shadow-[0_6px_20px_rgba(70,72,212,0.5)] transition-all hover:-translate-y-0.5 group">
            <span className="group-hover:rotate-12 transition-transform"><SparklesIcon size={14} /></span>
            Phân tích bằng AI
          </button>
        </div>
      </div>

      <WithdrawalModal 
        isOpen={isWithdrawalOpen} 
        onClose={() => setIsWithdrawalOpen(false)} 
      />
    </div>
  );
}
