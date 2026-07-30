"use client";

import React, { useState } from "react";
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
import { WithdrawalModal } from "./WithdrawalModal";

function Topbar() {
  return (
    <header className="h-16 shrink-0 flex items-center gap-4 px-8 bg-white border-b border-[#F0F0F8]">
      <div className="relative flex-1 max-w-[400px]">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0B0C8] pointer-events-none">
          <SearchIcon size={14} />
        </span>
        <input
          id="revenue-search"
          type="search"
          placeholder="Search transactions or statements..."
          className="w-full pl-9 pr-4 h-9 rounded-2xl text-[13px] text-[#1A1A2E] placeholder:text-[#B0B0C8] bg-[#F6F6FB] border border-[#EAEAF4] focus:outline-none focus:border-[#6B6BFF] transition-all"
        />
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-1.5 text-[#7878A0]">
        <button type="button" className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-all">
          <BellIcon size={17} />
        </button>
      </div>
      <div className="flex items-center gap-3 pl-3 border-l border-[#EAEAF4]">
        <div className="flex flex-col items-end leading-tight">
          <span className="text-[12px] font-bold text-[#1A1A2E]">Minh Nguyễn</span>
          <span className="text-[10px] text-[#9090B0] font-bold">Professional Instructor</span>
        </div>
        <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs font-black shadow-md">
          MN
        </div>
      </div>
    </header>
  );
}

function PageHeader({ onOpenWithdrawal, onToggleForecast }: { onOpenWithdrawal: () => void; onToggleForecast: () => void }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex flex-col">
        <h1 className="text-[26px] font-extrabold text-[#1A1A2E] tracking-tight">Financial Suite &amp; Performance Analytics (Section 4)</h1>
        <p className="text-[13px] text-[#64647A] mt-1">
          Monitor escrow balances, evaluate promotional revenue share tiers, and leverage AI financial forecasting.
        </p>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={onToggleForecast}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-indigo-200 text-xs font-black text-[#5153DF] bg-indigo-50 hover:bg-indigo-100 transition-all cursor-pointer shadow-xs"
        >
          <span>🤖 AI Financial Forecast (Section 4.3)</span>
        </button>
        <button
          type="button"
          onClick={onOpenWithdrawal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-[#1A1A2E] hover:bg-[#4648D4] shadow-md transition-all cursor-pointer"
        >
          <WalletIcon /> Request Withdrawal
        </button>
      </div>
    </div>
  );
}

function StatCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
      <div className="bg-white rounded-3xl p-6 border border-[#EAEAF4] shadow-xs flex flex-col justify-between">
        <span className="text-xs font-black text-[#64647A] uppercase tracking-wide">Total Revenue (Month)</span>
        <span className="text-2xl font-black text-[#1A1A2E] mt-2">128,450,000đ</span>
        <div className="flex items-center gap-1.5 mt-3 text-[11px] font-black text-emerald-600">
          <TrendUpIcon /> +12.5% vs previous cycle
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-[#EAEAF4] shadow-xs flex flex-col justify-between">
        <span className="text-xs font-black text-[#64647A] uppercase tracking-wide">Immediate Available Balance</span>
        <span className="text-2xl font-black text-[#6B6BFF] mt-2">42,180,000đ</span>
        <div className="flex items-center gap-1.5 mt-3 text-[11px] font-bold text-gray-400">
          <ClockIcon /> Cleared 30-day refund window
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-[#EAEAF4] shadow-xs flex flex-col justify-between">
        <span className="text-xs font-black text-[#64647A] uppercase tracking-wide">Escrow Holding Balance</span>
        <span className="text-2xl font-black text-amber-600 mt-2">15,400,000đ</span>
        <div className="flex items-center gap-1.5 mt-3 text-[11px] font-bold text-amber-700">
          <InfoCircleIcon /> Withheld during student refund window
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-[#EAEAF4] shadow-xs flex flex-col justify-between">
        <span className="text-xs font-black text-[#64647A] uppercase tracking-wide">Refund Rate (Section 4.2)</span>
        <span className="text-2xl font-black text-[#1A1A2E] mt-2">0.8%</span>
        <div className="flex items-center gap-1.5 mt-3 text-[11px] font-black text-emerald-600">
          <InfoCircleIcon /> Optimum (Industry average 2.4%)
        </div>
      </div>
    </div>
  );
}

// ─── AI Revenue Forecasting Box (Section 4.3) ─────────────────────────────────

function AIForecastSection({ onClose }: { onClose: () => void }) {
  return (
    <div className="p-7 rounded-3xl bg-gradient-to-br from-[#1E233E] via-[#2D316A] to-[#141628] text-white border-2 border-indigo-400/50 shadow-[0_15px_60px_rgba(0,0,0,0.25)] flex flex-col gap-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6B6BFF] to-[#F368E0] flex items-center justify-center text-2xl font-black shadow-md">
            📈
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-white">AI Financial Forecasting &amp; Optimization (Section 4.3)</h3>
              <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                Predictive Analytics Engine
              </span>
            </div>
            <p className="text-xs text-indigo-200 mt-0.5">
              Projected monthly revenue trajectory based on daily student enrollment momentum and historical refund frequency.
            </p>
          </div>
        </div>
        <button type="button" onClick={onClose} className="text-gray-400 hover:text-white font-black text-xl p-1">✕</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-1">
          <span className="text-[11px] font-bold text-gray-300 uppercase">Projected EOM Earnings</span>
          <span className="text-2xl font-black text-emerald-300">184,500,000đ</span>
          <span className="text-xs text-gray-400 mt-1">Expected end-of-month tally (+43% surge)</span>
        </div>
        
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-1">
          <span className="text-[11px] font-bold text-gray-300 uppercase">Top Converting Catalyst</span>
          <span className="text-lg font-black text-white truncate">AI Mastery for Business</span>
          <span className="text-xs text-indigo-300 mt-1">Responsible for 68% of affiliate referral traffic</span>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/40 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-black text-amber-300 uppercase flex items-center gap-1">
              <span>⚡ AI Action Recommendation</span>
            </span>
            <p className="text-xs font-semibold text-gray-200 mt-1.5 leading-relaxed">
              &ldquo;Machine Learning Basics&rdquo; has seen a 14% conversion dip this week. Consider creating a 20% discount coupon or promoting an affiliate link.
            </p>
          </div>
          <button
            type="button"
            onClick={() => alert("Redirecting to Step 3 Pricing Strategy to create a limited promotional coupon...")}
            className="mt-3 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#1A1A2E] text-xs font-black transition-all text-center cursor-pointer"
          >
            Apply Discount Coupon ➔
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Middle Section (Chart & Revenue Share Rules) ─────────────────────────────

function RevenueChart() {
  return (
    <div className="bg-white rounded-3xl border border-[#EAEAF4] p-6 flex flex-col shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-black text-[#1A1A2E]">Revenue Flow Matrix &amp; Share Rules (Section 4.1)</h3>
          <p className="text-xs text-gray-400 mt-0.5">Dynamic revenue split varies based on student purchase attribution source.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-indigo-50 text-indigo-800 border border-indigo-200 text-xs font-black">
            🚀 Referral Affiliate Link: 85% Instructor Share (15% Platform Fee)
          </span>
          <span className="px-3 py-1 rounded-xl bg-gray-100 text-gray-700 border border-gray-200 text-xs font-bold">
            🛒 Organic Marketplace: 70% Share (30% Fee)
          </span>
        </div>
      </div>
      
      {/* Visual Bar Representation */}
      <div className="flex-1 min-h-[200px] flex items-end justify-between gap-4 px-4 pt-6 border-t border-gray-100 relative">
        {[35, 52, 90, 60, 68, 48, 85].map((h, i) => (
          <div key={i} className="relative flex flex-col items-center w-full max-w-[36px] group cursor-pointer z-10">
            <div
              className={twMerge(
                "w-full rounded-xl transition-all duration-300",
                i === 2 || i === 6 ? "bg-[#6B6BFF] shadow-[0_4px_16px_rgba(107,107,255,0.4)]" : "bg-gray-200 group-hover:bg-indigo-300"
              )}
              style={{ height: `${h * 2}px` }}
            />
            <span className={twMerge("mt-2.5 text-[11px] font-black", i === 2 || i === 6 ? "text-[#1A1A2E]" : "text-gray-400")}>
              {["Mon", "Tue", "Today", "Thu", "Fri", "Sat", "Sun"][i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentTransactions() {
  const items = [
    { id: "TX-921", title: "Course Sale: AI Mastery", detail: "Referral Affiliate Link (85% Tier)", amount: "+2,550,000đ", status: "CLEARED", color: "text-emerald-700 bg-emerald-50" },
    { id: "TX-918", title: "Course Sale: ML Basics", detail: "Organic Marketplace (70% Tier)", amount: "+840,000đ", status: "IN ESCROW", color: "text-amber-700 bg-amber-50" },
    { id: "TX-890", title: "Bank Disbursement", detail: "MB Bank - **** 1234", amount: "-15,000,000đ", status: "COMPLETED", color: "text-indigo-700 bg-indigo-50" },
  ];

  return (
    <div className="bg-white rounded-3xl border border-[#EAEAF4] flex flex-col shadow-xs overflow-hidden">
      <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100">
        <h3 className="text-sm font-black text-[#1A1A2E]">Verified Transaction Logs</h3>
        <span className="text-xs font-bold text-[#5153DF]">Section 4.2 Record</span>
      </div>

      <div className="flex flex-col p-4 gap-3 flex-1">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 border border-gray-200 hover:bg-white transition-all">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-[#1A1A2E]">{item.title}</span>
                <span className="text-[10px] font-mono font-extrabold text-gray-400">({item.id})</span>
              </div>
              <p className="text-[11px] font-bold text-gray-500 mt-0.5">{item.detail}</p>
            </div>
            <div className="text-right">
              <span className="block text-xs font-black font-mono text-[#1A1A2E]">{item.amount}</span>
              <span className={twMerge("inline-block text-[9px] font-extrabold px-1.5 py-0.5 rounded mt-0.5 uppercase", item.color)}>
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-[#F0F0FF] border-t border-[#EAEAF4] flex items-center gap-2 text-xs font-bold text-[#4648D4]">
        <span>🔒</span>
        <span>Escrow withholding automatically releases 30 days post-purchase.</span>
      </div>
    </div>
  );
}

// ─── Main Revenue Container ───────────────────────────────────────────────────

export function RevenueContainer() {
  const [isWithdrawalOpen, setIsWithdrawalOpen] = useState(false);
  const [showForecast, setShowForecast] = useState(true);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8FF]">
      <Topbar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1150px] mx-auto px-8 py-8 flex flex-col gap-8 pb-32">
          <PageHeader
            onOpenWithdrawal={() => setIsWithdrawalOpen(true)}
            onToggleForecast={() => setShowForecast((prev) => !prev)}
          />
          <StatCards />

          {showForecast && <AIForecastSection onClose={() => setShowForecast(false)} />}
          
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
            <RevenueChart />
            <RecentTransactions />
          </div>
        </div>
      </main>

      {/* Footer / Floating AI Forecast Button */}
      <div className="fixed bottom-0 right-0 left-0 lg:left-[240px] px-8 py-4 bg-white/85 backdrop-blur border-t border-[#F0F0F8] flex items-center justify-between z-10">
        <span className="text-xs font-bold text-gray-400">© 2026 MindNova AI Education Suite. Compliant with Section 4 Financial Specifications.</span>
        
        <button
          type="button"
          onClick={() => setShowForecast(true)}
          className="flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-extrabold text-white bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] shadow-lg transition-all hover:scale-105 cursor-pointer"
        >
          <span>✨ Re-open AI Revenue Forecast</span>
        </button>
      </div>

      <WithdrawalModal
        isOpen={isWithdrawalOpen}
        onClose={() => setIsWithdrawalOpen(false)}
      />
    </div>
  );
}