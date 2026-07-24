"use client";

import { twMerge } from "tailwind-merge";
import {
  SearchIcon,
  BellIcon,
  MessageIcon,
  GridIcon,
  CalendarIcon,
  ChevronDownIcon,
  DownloadIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TrendUpIcon,
  TrendRightIcon,
} from "./icons";
import { AdsHourlySection } from "@/src/components/page/ads-hourly";
import type { DragRange } from "@/src/components/page/ads-hourly";

// ─── Topbar ───────────────────────────────────────────────────────────────────

function Topbar() {
  return (
    <header className="h-16 shrink-0 flex items-center gap-4 px-8 bg-white border-b border-[#F0F0F8]">
      <h1 className="text-[15px] font-extrabold text-[#1A1A2E] tracking-tight">Detailed Sales Analytics</h1>
      <div className="flex-1" />
      {/* Search */}
      <div className="relative w-[280px]">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0B0C8] pointer-events-none">
          <SearchIcon size={14} />
        </span>
        <input
          id="sales-search"
          type="search"
          placeholder="Search reports..."
          className="w-full pl-9 pr-4 h-9 rounded-full text-[13px] text-[#1A1A2E] placeholder:text-[#B0B0C8] bg-[#F6F6FB] border border-[#EAEAF4] focus:outline-none focus:border-[#6B6BFF] focus:ring-2 focus:ring-[#6B6BFF]/10 transition-all duration-200"
        />
      </div>

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
    </header>
  );
}

// ─── Header & Stats ───────────────────────────────────────────────────────────

function DatePickerHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#DDDDF0] bg-white text-[13px] font-semibold text-[#464554]">
          <CalendarIcon /> 01/10/2023 - 31/10/2023
        </div>
        <button className="flex items-center gap-1 text-[13px] font-bold text-[#4648D4] hover:bg-[#EEF0FF] px-3 py-2 rounded-lg transition-colors">
          Change Range <ChevronDownIcon size={12} />
        </button>
      </div>
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#DDDDF0] text-[13px] font-bold text-[#464554] bg-white hover:bg-[#F4F4FA] transition-colors">
          <DownloadIcon /> Export CSV
        </button>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold text-white bg-[#4648D4] hover:bg-[#3D40C0] shadow-[0_4px_14px_rgba(70,72,212,0.3)] transition-all hover:-translate-y-0.5">
          <DownloadIcon /> Export PDF
        </button>
      </div>
    </div>
  );
}

function StatCards() {
  const stats = [
    { label: "Total Revenue", val: "$42,850", diff: "+12.5%", isUp: true, color: "bg-[#00D47E]", width: 82 },
    { label: "Net Sales", val: "$38,200", diff: "+8.2%", isUp: true, color: "bg-[#00A3FF]", width: 68 },
    { label: "Refunds", val: "$1,450", diff: "-2.1%", isUp: false, color: "bg-[#F83A3A]", width: 54 },
    { label: "Avg. Order Value", val: "$124.50", diff: "+5.4%", isUp: true, color: "bg-[#6B6BFF]", width: 73 },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
      {stats.map((s, i) => (
        <div key={i} className="bg-white rounded-2xl p-5 border border-[#EAEAF4] shadow-sm flex flex-col relative overflow-hidden">
          <span className="text-[12px] font-semibold text-[#64647A] tracking-wide">{s.label}</span>
          <div className="flex items-end gap-2 mt-2">
            <span className="text-[20px] font-extrabold text-[#1A1A2E] leading-tight">{s.val}</span>
            <span className={twMerge("text-[10px] font-bold mb-1", s.isUp ? "text-emerald-500" : "text-rose-500")}>
              {s.diff}
            </span>
          </div>
          <div className="w-full h-1 bg-[#F0F0F8] rounded-full mt-4 overflow-hidden">
            <div className={twMerge("h-full rounded-full", s.color)} style={{ width: `${s.width}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Chart Section ────────────────────────────────────────────────────────────

function RevenueVsRefundsChart() {
  return (
    <div className="bg-white rounded-2xl border border-[#EAEAF4] shadow-sm p-6 mb-6 flex flex-col h-[360px]">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h3 className="text-[15px] font-extrabold text-[#1A1A2E]">Revenue vs Refunds</h3>
          <p className="text-[12px] text-[#9090B0] mt-1">Daily performance tracking for October 2023</p>
        </div>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#4648D4]" />
            <span className="text-[12px] font-semibold text-[#64647A]">Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#F83A3A]" />
            <span className="text-[12px] font-semibold text-[#64647A]">Refunds</span>
          </div>
        </div>
      </div>

      {/* Mock Chart Canvas */}
      <div className="flex-1 relative mt-2 w-full">
        {/* Horizontal Grids */}
        <div className="absolute inset-0 flex flex-col justify-between border-b border-[#F0F0F8]">
          {[1, 2, 3, 4].map(i => <div key={i} className="w-full h-px bg-[#F0F0F8]" />)}
        </div>
        
        {/* Lines */}
        <svg className="w-full h-full absolute inset-0 overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 200">
          <path d="M0,150 L100,130 L200,140 L300,100 L400,80 L500,110 L600,60 L700,50 L800,70 L900,40 L1000,50" fill="none" stroke="#4648D4" strokeWidth="2.5" />
          <path d="M0,190 L100,188 L200,189 L300,185 L400,186 L500,184 L600,185 L700,186 L800,182 L900,180 L1000,183" fill="none" stroke="#F83A3A" strokeWidth="1.5" strokeDasharray="4 4" />
          
          {/* Active Data Point Tooltip */}
          <circle cx="700" cy="50" r="4" fill="#4648D4" stroke="white" strokeWidth="2" />
        </svg>

        {/* Floating Tooltip */}
        <div className="absolute left-[70%] top-[10%] -translate-x-1/2 -translate-y-full mb-2 bg-white rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-[#EAEAF4] p-3 w-max z-10 pointer-events-none">
          <span className="block text-[9px] font-bold text-[#9090B0] uppercase tracking-widest mb-1">OCT 22, 2023</span>
          <div className="flex items-center gap-3">
            <span className="text-[14px] font-extrabold text-[#4648D4]">$2,840.00</span>
            <span className="text-[14px] font-extrabold text-[#F83A3A]">$42.00</span>
          </div>
        </div>

        {/* X-Axis labels */}
        <div className="absolute left-0 right-0 -bottom-8 flex justify-between text-[11px] font-semibold text-[#B0B0C8]">
          <span>Oct 01</span>
          <span>Oct 08</span>
          <span>Oct 15</span>
          <span>Oct 22</span>
          <span>Oct 31</span>
        </div>
      </div>
    </div>
  );
}

// ─── Table Section ────────────────────────────────────────────────────────────

function MarketingSourcesTable() {
  const sources = [
    { name: "Facebook Ads", sub: "Social Media Campaign", initials: "FB", bg: "bg-[#E6EFFF] text-[#00A3FF]", leads: "1,240", conv: "156", rate: 12.58, rev: "$18,420.00", trend: "up" },
    { name: "Google Search", sub: "PPC & Organic", initials: "GG", bg: "bg-[#FFE8E8] text-[#F83A3A]", leads: "890", conv: "92", rate: 10.33, rev: "$12,150.00", trend: "up" },
    { name: "Email Marketing", sub: "Monthly Newsletter", initials: "EM", bg: "bg-[#F0E6FF] text-[#9D4EDD]", leads: "2,100", conv: "48", rate: 2.28, rev: "$6,280.00", trend: "flat" },
    { name: "Referral Program", sub: "Affiliate Partners", initials: "RF", bg: "bg-[#E6F8F0] text-[#00D47E]", leads: "320", conv: "45", rate: 14.06, rev: "$6,000.00", trend: "up" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#EAEAF4] shadow-sm flex flex-col overflow-hidden mb-8">
      {/* Table Header/Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#F0F0F8] px-2 pt-2">
        <div className="flex items-center gap-1">
          <button className="px-5 py-3 text-[13px] font-bold text-[#4648D4] border-b-2 border-[#4648D4] bg-[#F8F8FD]">Marketing Sources</button>
          <button className="px-5 py-3 text-[13px] font-semibold text-[#64647A] hover:text-[#1A1A2E] hover:bg-[#FAFAFE] rounded-t-lg transition-colors border-b-2 border-transparent">Demographics</button>
          <button className="px-5 py-3 text-[13px] font-semibold text-[#64647A] hover:text-[#1A1A2E] hover:bg-[#FAFAFE] rounded-t-lg transition-colors border-b-2 border-transparent">Course Categories</button>
        </div>
        <div className="flex items-center gap-4 px-4 py-2 sm:py-0">
          <span className="text-[12px] font-medium text-[#9090B0]">Showing 1–10 of 24 sources</span>
          <div className="flex items-center gap-1.5">
            <button className="w-7 h-7 flex items-center justify-center rounded border border-[#EAEAF4] text-[#B0B0C8] hover:text-[#464554] hover:bg-[#F4F4FA]"><ChevronLeftIcon /></button>
            <button className="w-7 h-7 flex items-center justify-center rounded border border-[#EAEAF4] text-[#464554] hover:bg-[#F4F4FA]"><ChevronRightIcon /></button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-[#F0F0F8]">
              <th className="px-6 py-4 text-[11px] font-bold text-[#9090B0] uppercase tracking-wide">Source Channel</th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#9090B0] uppercase tracking-wide">Total Leads</th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#9090B0] uppercase tracking-wide">Conversions</th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#9090B0] uppercase tracking-wide">Conversion Rate</th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#9090B0] uppercase tracking-wide">Revenue Generated</th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#9090B0] uppercase tracking-wide">Trend</th>
            </tr>
          </thead>
          <tbody>
            {sources.map((s, i) => (
              <tr key={i} className="border-b border-[#F0F0F8] last:border-0 hover:bg-[#FAFAFE] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={twMerge("w-8 h-8 rounded flex items-center justify-center text-[10px] font-bold shrink-0", s.bg)}>
                      {s.initials}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold text-[#1A1A2E]">{s.name}</span>
                      <span className="text-[10px] font-medium text-[#9090B0]">{s.sub}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-[13px] font-semibold text-[#464554]">{s.leads}</td>
                <td className="px-6 py-4 text-[13px] font-semibold text-[#464554]">{s.conv}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] font-extrabold text-[#464554] w-[45px]">{s.rate}%</span>
                    <div className="flex-1 h-1.5 rounded-full bg-[#F0F0F8] overflow-hidden max-w-[60px]">
                      <div className="h-full rounded-full bg-[#A3A5F8]" style={{ width: `${s.rate * 3}%` }} />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-[13px] font-extrabold text-[#1A1A2E]">{s.rev}</td>
                <td className="px-6 py-4 text-center">
                  {s.trend === "up" ? (
                    <span className="text-emerald-500 inline-block"><TrendUpIcon size={16} /></span>
                  ) : (
                    <span className="text-[#B0B0C8] inline-block"><TrendRightIcon size={16} /></span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 flex items-center justify-center border-t border-[#F0F0F8] bg-[#FAFAFE]">
        <button className="text-[12px] font-bold text-[#6B6BFF] hover:underline">View All Channel Performance</button>
      </div>
    </div>
  );
}

// ─── Main Container ───────────────────────────────────────────────────────────

export function SalesReportContainer() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8FF]">
      <Topbar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-8">
          <DatePickerHeader />

          {/* ── 1.1 Metric Cards + 1.2 Hourly Chart ── */}
          <AdsHourlySection
            onRangeSelected={(range: DragRange) => {
              // TODO: replace with real bid-schedule navigation or modal
              console.log("[Bid Schedule] Selected range:", range);
            }}
          />

          <StatCards />
          <RevenueVsRefundsChart />
          <MarketingSourcesTable />

          <footer className="flex flex-col md:flex-row items-center justify-between gap-4 py-6 border-t border-[#EAEAF4] mt-8">
            <span className="text-[11px] font-medium text-[#9090B0]">
              © 2023 EduMaster Pro Instructor Console. All sales data is real-time.
            </span>
            <div className="flex items-center gap-4 text-[11px] font-medium text-[#9090B0]">
              <a href="#" className="hover:text-[#464554] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#464554] transition-colors">Data Processing Agreement</a>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
// ─── End of SalesReportContainer ─────────────────────────────────────────────
