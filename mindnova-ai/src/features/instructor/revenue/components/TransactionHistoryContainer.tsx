"use client";

import { twMerge } from "tailwind-merge";
import {
  SearchIcon,
  BellIcon,
  MessageIcon,
  GridIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BookOpenIcon,
  WalletIcon,
  SparklesIcon,
  BuildingBankIcon,
  TrendUpIcon,
} from "./icons";

// ─── Topbar ───────────────────────────────────────────────────────────────────

function Topbar() {
  return (
    <header className="h-16 shrink-0 flex items-center gap-4 px-8 bg-white border-b border-[#F0F0F8]">
      <div className="relative flex-1 max-w-[400px]">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0B0C8] pointer-events-none">
          <SearchIcon size={14} />
        </span>
        <input
          id="txn-search"
          type="search"
          placeholder="Tìm kiếm giao dịch..."
          className="w-full pl-9 pr-4 h-9 rounded-full text-[13px] text-[#1A1A2E] placeholder:text-[#B0B0C8] bg-[#F6F6FB] border border-[#EAEAF4] focus:outline-none focus:border-[#6B6BFF] focus:ring-2 focus:ring-[#6B6BFF]/10 transition-all duration-200"
        />
      </div>

      <div className="flex-1" />

      {/* Icons */}
      <div className="flex items-center gap-1.5 text-[#7878A0]">
        <button type="button" className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#F4F4FA] hover:text-[#4648D4] transition-all relative">
          <BellIcon size={17} />
        </button>
        <button type="button" className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#F4F4FA] hover:text-[#4648D4] transition-all">
          <MessageIcon size={17} />
        </button>
        <button type="button" className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#F4F4FA] hover:text-[#4648D4] transition-all">
          <GridIcon size={17} />
        </button>
      </div>

      {/* Profile */}
      <div className="flex items-center gap-3 pl-3 border-l border-[#EAEAF4] cursor-pointer group">
        <div className="flex flex-col items-end leading-tight">
          <span className="text-[12px] font-bold text-[#1A1A2E] group-hover:text-[#4648D4] transition-colors">Alex Rivera</span>
          <span className="text-[9px] font-bold text-[#9090B0] uppercase tracking-wider">Premium Instructor</span>
        </div>
        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-[#EAEAF4] bg-slate-200">
           <img
            src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop"
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}

// ─── Header & Filters ─────────────────────────────────────────────────────────

function PageHeader() {
  return (
    <div className="flex flex-col mb-8">
      <h1 className="text-[24px] font-extrabold text-[#1A1A2E] tracking-tight">Lịch sử Giao dịch</h1>
      <p className="text-[13px] text-[#64647A] mt-1">
        Theo dõi và quản lý mọi dòng tiền từ hoạt động giảng dạy của bạn.
      </p>
    </div>
  );
}

function Filters() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-center bg-white border border-[#EAEAF4] rounded-xl p-1 shadow-sm">
        <button className="px-6 py-2 text-[13px] font-bold text-[#4648D4] bg-[#F4F4FA] rounded-lg shadow-sm">
          Tất cả
        </button>
        <button className="px-6 py-2 text-[13px] font-semibold text-[#64647A] hover:text-[#1A1A2E] transition-colors">
          Tiền vào
        </button>
        <button className="px-6 py-2 text-[13px] font-semibold text-[#64647A] hover:text-[#1A1A2E] transition-colors">
          Tiền ra
        </button>
        <button className="px-6 py-2 text-[13px] font-semibold text-[#64647A] hover:text-[#1A1A2E] transition-colors">
          Đang xử lý
        </button>
      </div>
      <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#DDDDF0] text-[13px] font-semibold text-[#464554] bg-white hover:bg-[#F4F4FA] transition-colors shadow-sm">
        <CalendarIcon /> Tháng này <ChevronDownIcon />
      </button>
    </div>
  );
}

// ─── Transaction Table ────────────────────────────────────────────────────────

function TransactionTable() {
  const transactions = [
    {
      date: "24 Th05, 2024",
      time: "14:30 PM",
      id: "#TXN-90231",
      title: "Bán khóa học AI Mastery",
      subtitle: "Học viên: Le Van A",
      icon: <BookOpenIcon size={14} />,
      iconColor: "text-[#6B6BFF]",
      iconBg: "bg-[#EEF0FF]",
      status: "THÀNH CÔNG",
      statusStyle: "text-emerald-600 bg-emerald-50",
      amount: "+1.250.000đ",
      amountStyle: "text-emerald-500 font-bold",
    },
    {
      date: "22 Th05, 2024",
      time: "09:15 AM",
      id: "#TXN-88142",
      title: "Rút tiền về ngân hàng",
      subtitle: "Techcombank - ****4210",
      icon: <WalletIcon size={14} />,
      iconColor: "text-[#9D4EDD]",
      iconBg: "bg-[#F4E8FF]",
      status: "ĐANG XỬ LÝ",
      statusStyle: "text-[#00A3FF] bg-[#E5F5FF]",
      amount: "-5.000.000đ",
      amountStyle: "text-[#64647A] font-semibold",
    },
    {
      date: "20 Th05, 2024",
      time: "16:45 PM",
      id: "#TXN-87002",
      title: "Phí đăng ký AI Assistant Pro",
      subtitle: "Gói tháng Instructor Plus",
      icon: <SparklesIcon size={14} />,
      iconColor: "text-[#4648D4]",
      iconBg: "bg-[#E6E8FF]",
      status: "THÀNH CÔNG",
      statusStyle: "text-emerald-600 bg-emerald-50",
      amount: "-250.000đ",
      amountStyle: "text-[#64647A] font-semibold",
    },
    {
      date: "19 Th05, 2024",
      time: "11:00 AM",
      id: "#TXN-86551",
      title: "Bán khóa học Data Science",
      subtitle: "Học viên: Nguyen Thi B",
      icon: <BookOpenIcon size={14} />,
      iconColor: "text-[#6B6BFF]",
      iconBg: "bg-[#EEF0FF]",
      status: "THÀNH CÔNG",
      statusStyle: "text-emerald-600 bg-emerald-50",
      amount: "+850.000đ",
      amountStyle: "text-emerald-500 font-bold",
    },
  ];

  return (
    <div className="bg-white rounded-3xl border border-[#EAEAF4] shadow-sm flex flex-col mb-8 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-[#FAFAFE] border-b border-[#EAEAF4]">
              <th className="px-8 py-5 text-[12px] font-bold text-[#64647A] w-[180px]">Ngày</th>
              <th className="px-8 py-5 text-[12px] font-bold text-[#64647A] w-[160px]">ID Giao dịch</th>
              <th className="px-8 py-5 text-[12px] font-bold text-[#64647A]">Mô tả</th>
              <th className="px-8 py-5 text-[12px] font-bold text-[#64647A] w-[140px]">Trạng thái</th>
              <th className="px-8 py-5 text-[12px] font-bold text-[#64647A] text-right w-[160px]">Số tiền</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, i) => (
              <tr key={i} className="border-b border-[#F0F0F8] hover:bg-[#FAFAFE] transition-colors">
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="text-[13px] font-bold text-[#1A1A2E]">{t.date}</span>
                    <span className="text-[11px] text-[#9090B0] mt-0.5">{t.time}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="text-[13px] font-semibold text-[#64647A]">{t.id}</span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className={twMerge("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", t.iconBg, t.iconColor)}>
                      {t.icon}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold text-[#1A1A2E]">{t.title}</span>
                      <span className="text-[12px] text-[#64647A] mt-0.5">{t.subtitle}</span>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={twMerge("px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-center block w-fit", t.statusStyle)}>
                    {t.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <span className={twMerge("text-[14px]", t.amountStyle)}>{t.amount}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-8 py-5 flex items-center justify-between border-t border-[#F0F0F8]">
        <span className="text-[13px] font-medium text-[#64647A]">Hiển thị 1 - 4 trên 128 giao dịch</span>
        <div className="flex items-center gap-1.5">
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#EAEAF4] text-[#B0B0C8] cursor-not-allowed">
            <ChevronLeftIcon />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#4648D4] text-white font-bold text-[13px] shadow-sm">1</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#EAEAF4] text-[#464554] font-semibold text-[13px] hover:bg-[#F4F4FA]">2</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#EAEAF4] text-[#464554] font-semibold text-[13px] hover:bg-[#F4F4FA]">3</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#EAEAF4] text-[#464554] hover:bg-[#F4F4FA]">
            <ChevronRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Bottom Cards ─────────────────────────────────────────────────────────────

function BottomCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-2xl border border-[#EAEAF4] p-6 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-[#EEF0FF] text-[#4648D4] flex items-center justify-center shrink-0">
          <BuildingBankIcon size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-[13px] font-medium text-[#64647A]">Số dư hiện tại</span>
          <span className="text-[20px] font-extrabold text-[#1A1A2E]">24.500.000đ</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#EAEAF4] p-6 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
          <TrendUpIcon size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-[13px] font-medium text-[#64647A]">Thu nhập tháng này</span>
          <span className="text-[20px] font-extrabold text-[#1A1A2E]">8.120.000đ</span>
        </div>
      </div>

      <div className="bg-[#FAFAFE] rounded-2xl border border-[#C5C6FF] border-dashed p-6 flex items-center justify-between shadow-sm">
        <div className="flex flex-col">
          <span className="text-[14px] font-extrabold text-[#4648D4]">Yêu cầu rút tiền</span>
          <span className="text-[12px] text-[#64647A] mt-1">Nhanh chóng & An toàn</span>
        </div>
        <button className="px-6 py-2.5 rounded-xl bg-[#4648D4] hover:bg-[#3D40C0] text-white text-[13px] font-bold shadow-[0_4px_14px_rgba(70,72,212,0.3)] transition-all hover:-translate-y-0.5">
          Rút ngay
        </button>
      </div>
    </div>
  );
}

// ─── Main Container ───────────────────────────────────────────────────────────

export function TransactionHistoryContainer() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8FF]">
      <Topbar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1100px] mx-auto px-8 py-10">
          <PageHeader />
          <Filters />
          <TransactionTable />
          <BottomCards />
        </div>
      </main>
    </div>
  );
}
