"use client";

// ─── PricingContainer ─────────────────────────────────────────────────────────
// Main container for the Quản lý Giá & Kiếm tiền page.

import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { PricingModelSection } from "./PricingModelSection";
import { CouponSection } from "./CouponSection";
import { SaveIcon, ChevronRightIcon } from "./icons";

// ─── Top nav tabs ─────────────────────────────────────────────────────────────

const TABS = [
  { id: "pricing", label: "Giá & Kiếm tiền" },
  { id: "content", label: "Nội dung" },
  { id: "students", label: "Học viên" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function PageTabs({ active, onChange }: { active: TabId; onChange: (t: TabId) => void }) {
  return (
    <div className="flex items-center gap-1 border-b border-[#F0F0F8] px-6 bg-white">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={twMerge(
            "relative px-4 py-3.5 text-[13px] font-semibold transition-all duration-150 focus:outline-none",
            active === tab.id
              ? "text-[#4648D4]"
              : "text-[#9090B0] hover:text-[#464554]",
          )}
        >
          {tab.label}
          {/* Underline indicator */}
          <span
            className={twMerge(
              "absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#6B6BFF] transition-all duration-200",
              active === tab.id ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0",
            )}
          />
        </button>
      ))}
    </div>
  );
}

// ─── Breadcrumb ───────────────────────────────────────────────────────────────

function Breadcrumb() {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-[12px] text-[#9090B0]">
      <span className="hover:text-[#4648D4] cursor-pointer transition-colors">My Courses</span>
      <ChevronRightIcon size={12} />
      <span className="hover:text-[#4648D4] cursor-pointer transition-colors">
        Generative AI Masterclass
      </span>
    </nav>
  );
}

// ─── Page Header ──────────────────────────────────────────────────────────────

function PageHeader({ onSave }: { onSave: () => void }) {
  return (
    <div className="px-6 pt-5 pb-4 bg-white border-b border-[#F0F0F8]">
      <Breadcrumb />
      <div className="flex items-start justify-between mt-2">
        <div>
          <h1 className="text-[16px] font-extrabold text-[#1A1A2E] tracking-tight">
            Giá & Kiếm tiền: Generative AI
          </h1>
          <p className="text-[12px] text-[#9090B0] mt-0.5 max-w-[480px] leading-relaxed">
            Cấu hình mô hình doanh thu, định giá và quản lý các chương trình khuyến mãi cho khóa học của bạn.
          </p>
        </div>
        <button
          type="button"
          id="btn-save-pricing"
          onClick={onSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] shadow-[0_4px_14px_rgba(70,72,212,0.35)] hover:shadow-[0_6px_20px_rgba(70,72,212,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4648D4]/40 shrink-0"
        >
          <SaveIcon size={14} />
          Lưu cài đặt
        </button>
      </div>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function SaveToast({ visible }: { visible: boolean }) {
  return (
    <div
      className={twMerge(
        "fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-[#1A1A2E] text-white text-[13px] font-semibold shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all duration-300",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none",
      )}
    >
      <span className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px]">
        ✓
      </span>
      Đã lưu cài đặt thành công!
    </div>
  );
}

// ─── Main Container ───────────────────────────────────────────────────────────

export function PricingContainer() {
  const [activeTab, setActiveTab] = useState<TabId>("pricing");
  const [toastVisible, setToastVisible] = useState(false);

  const handleSave = () => {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2800);
  };

  return (
    <div className="flex flex-col h-full bg-[#FAF8FF]">
      {/* Sticky page header */}
      <div className="sticky top-0 z-10 bg-white shadow-[0_1px_0_#F0F0F8]">
        <PageHeader onSave={handleSave} />
        <PageTabs active={activeTab} onChange={setActiveTab} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {activeTab === "pricing" && (
          <div className="max-w-[900px] mx-auto flex flex-col gap-6">
            <PricingModelSection />
            <CouponSection />
          </div>
        )}

        {activeTab === "content" && (
          <div className="max-w-[900px] mx-auto flex items-center justify-center py-20 text-[#B0B0C8] text-sm">
            Nội dung khóa học sẽ hiển thị ở đây.
          </div>
        )}

        {activeTab === "students" && (
          <div className="max-w-[900px] mx-auto flex items-center justify-center py-20 text-[#B0B0C8] text-sm">
            Danh sách học viên sẽ hiển thị ở đây.
          </div>
        )}
      </div>

      <SaveToast visible={toastVisible} />
    </div>
  );
}
