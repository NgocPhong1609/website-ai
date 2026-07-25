"use client";

// ─── Step3SettingsPrice ──────────────────────────────────────────────────────
// Bước 3: Cài đặt hiển thị + Cấu hình giá & Thanh toán + Preview khóa học.

import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { SparklesIcon, ChevronDownIcon } from "./icons";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Step3Data {
  isDraft: boolean;
  isPublic: boolean;
  allowRating: boolean;
  currency: string;
  basePrice: string;
  salePrice: string;
}

export interface Step3SettingsPriceProps {
  courseTitle?: string;
  thumbnailPreview?: string | null;
}

// ─── SVG helpers ─────────────────────────────────────────────────────────────

const SVG = {
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor" as const,
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

function EyeIcon() {
  return (
    <svg {...SVG} width={15} height={15}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function StarIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={13}
      height={13}
      fill={filled ? "#F59E0B" : "none"}
      stroke="#F59E0B"
      strokeWidth={2}
      aria-hidden
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function PlusCircleIcon({ size = 16 }: { size?: number }) {
  return (
    <svg {...SVG} width={size} height={size}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}

function GiftIcon({ size = 16 }: { size?: number }) {
  return (
    <svg {...SVG} width={size} height={size}>
      <polyline points="20 12 20 22 4 22 4 12" />
      <rect x="2" y="7" width="20" height="5" />
      <line x1="12" y1="22" x2="12" y2="7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  );
}

function TagIcon({ size = 16 }: { size?: number }) {
  return (
    <svg {...SVG} width={size} height={size}>
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

function CheckShieldIcon() {
  return (
    <svg {...SVG} width={28} height={28} strokeWidth={1.7}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

// ─── Toggle Switch ────────────────────────────────────────────────────────────

function Toggle({
  id,
  checked,
  onChange,
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={twMerge(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#6B6BFF]/40 focus:ring-offset-2",
        checked ? "bg-[#6B6BFF]" : "bg-[#D0D0E8]",
      )}
    >
      <span
        className={twMerge(
          "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.2)] transform transition-transform duration-200",
          checked ? "translate-x-5" : "translate-x-0",
        )}
      />
    </button>
  );
}

// ─── Settings Card ─────────────────────────────────────────────────────────

interface ToggleRowProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

function ToggleRow({
  id,
  label,
  description,
  checked,
  onChange,
}: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-[13px] font-semibold text-[#1A1A2E]">
          {label}
        </span>
        <span className="text-[11px] text-[#9090B0] leading-relaxed">
          {description}
        </span>
      </div>
      <Toggle id={id} checked={checked} onChange={onChange} />
    </div>
  );
}

function SettingsCard({
  isDraft,
  setIsDraft,
  isPublic,
  setIsPublic,
  allowRating,
  setAllowRating,
}: {
  isDraft: boolean;
  setIsDraft: (v: boolean) => void;
  isPublic: boolean;
  setIsPublic: (v: boolean) => void;
  allowRating: boolean;
  setAllowRating: (v: boolean) => void;
}) {
  return (
    <div className="rounded-2xl border border-[#EAEAF4] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-[#F0F0F8]">
        <span className="w-6 h-6 rounded-md bg-[#EEF0FF] text-[#6B6BFF] flex items-center justify-center">
          <EyeIcon />
        </span>
        <span className="text-[14px] font-bold text-[#1A1A2E]">
          Cài đặt hiển thị
        </span>
      </div>

      {/* Toggle rows */}
      <div className="px-5 divide-y divide-[#F4F4FA]">
        <ToggleRow
          id="toggle-draft"
          label="Chế độ Draft"
          description="Lưu khóa học dưới dạng bản nháp, chỉ bạn mới có thể xem."
          checked={isDraft}
          onChange={setIsDraft}
        />
        <ToggleRow
          id="toggle-public"
          label="Hiển thị công khai"
          description="Cho phép học viên tìm thấy khóa học trên nền tảng."
          checked={isPublic}
          onChange={setIsPublic}
        />
        <ToggleRow
          id="toggle-rating"
          label="Cho phép đánh giá"
          description="Học viên có thể để lại phản hồi và xếp hạng sao."
          checked={allowRating}
          onChange={setAllowRating}
        />
      </div>
    </div>
  );
}

// ─── AI Assistant Card ────────────────────────────────────────────────────────

function AIAssistantCard({ onApply }: { onApply: () => void }) {
  return (
    <div className="rounded-2xl border border-[#C5C6FF] bg-gradient-to-br from-[#F5F3FF] to-[#EEF0FF] p-5 flex flex-col gap-3">
      <div className="flex items-center gap-2 text-[#6B6BFF]">
        <span className="animate-pulse">
          <SparklesIcon size={14} />
        </span>
        <span className="text-[13px] font-bold">MindNova AI Assistant</span>
      </div>
      <p className="text-[12px] text-[#5A5A8A] leading-relaxed italic">
        &ldquo;Dựa trên nội dung khóa học về{" "}
        <strong className="not-italic font-semibold text-[#4648D4]">
          Trí tuệ Nhân tạo
        </strong>
        , tôi gợi ý mức giá từ{" "}
        <strong className="not-italic font-semibold text-[#4648D4]">
          1,200,000đ
        </strong>{" "}
        đến{" "}
        <strong className="not-italic font-semibold text-[#4648D4]">
          1,800,000đ
        </strong>{" "}
        để đạt tỷ lệ chuyển đổi tối ưu nhất.&rdquo;
      </p>
      <button
        type="button"
        id="btn-apply-ai-suggestion"
        onClick={onApply}
        className="w-full py-2.5 rounded-xl text-[13px] font-semibold text-white bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] shadow-[0_4px_14px_rgba(70,72,212,0.35)] hover:shadow-[0_6px_20px_rgba(70,72,212,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4648D4]/40"
      >
        Áp dụng đề xuất AI
      </button>
    </div>
  );
}

// ─── Pricing Card ─────────────────────────────────────────────────────────────

function PricingCard({
  currency,
  setCurrency,
  basePrice,
  setBasePrice,
  salePrice,
  setSalePrice,
}: {
  currency: string;
  setCurrency: (v: string) => void;
  basePrice: string;
  setBasePrice: (v: string) => void;
  salePrice: string;
  setSalePrice: (v: string) => void;
}) {
  const base = Number(basePrice.replace(/[^0-9]/g, ""));
  const sale = Number(salePrice.replace(/[^0-9]/g, ""));
  const discount =
    base > 0 && sale > 0 && sale < base
      ? Math.round(((base - sale) / base) * 100)
      : null;

  // Projected revenue (100 students × salePrice)
  const revenue = (sale || base) * 100;
  const instructorShare = Math.round(revenue * 0.7);

  const fmt = (n: number) => n.toLocaleString("vi-VN") + "đ";

  return (
    <div className="rounded-2xl border border-[#EAEAF4] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-[#F0F0F8]">
        <span className="w-6 h-6 rounded-md bg-[#EEF0FF] text-[#6B6BFF] flex items-center justify-center">
          <TagIcon size={13} />
        </span>
        <span className="text-[14px] font-bold text-[#1A1A2E]">
          Cấu hình giá & Thanh toán
        </span>
      </div>

      <div className="px-5 py-4 flex flex-col gap-4">
        {/* Currency */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="currency-select"
            className="text-[12px] font-semibold text-[#464554]"
          >
            Loại tiền tệ
          </label>
          <div className="relative">
            <select
              id="currency-select"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full appearance-none h-10 px-3 pr-9 rounded-xl border border-[#DDDDF0] bg-[#FAFAFE] text-sm text-[#1A1A2E] focus:outline-none focus:border-[#6B6BFF] focus:ring-2 focus:ring-[#6B6BFF]/15 transition-all duration-150 cursor-pointer"
            >
              <option value="VND">Việt Nam Đồng (VNĐ)</option>
              <option value="USD">US Dollar (USD)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#9090B0]">
              <ChevronDownIcon size={14} />
            </div>
          </div>
        </div>

        {/* Price row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Base price */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="base-price-s3"
              className="text-[12px] font-semibold text-[#464554]"
            >
              Giá gốc (VNĐ)
            </label>
            <div className="flex rounded-xl border border-[#DDDDF0] bg-[#FAFAFE] overflow-hidden focus-within:border-[#6B6BFF] focus-within:ring-2 focus-within:ring-[#6B6BFF]/15 transition-all duration-150">
              <input
                id="base-price-s3"
                type="text"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                placeholder="0"
                className="flex-1 h-10 px-3 text-sm font-semibold text-[#1A1A2E] bg-transparent focus:outline-none"
              />
              <span className="h-10 flex items-center px-2.5 text-[12px] font-bold text-[#4648D4] border-l border-[#DDDDF0]">
                đ
              </span>
            </div>
          </div>

          {/* Sale price */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="sale-price-s3"
              className="text-[12px] font-semibold text-[#464554]"
            >
              Giá khuyến mãi (VNĐ)
            </label>
            <div
              className={twMerge(
                "flex rounded-xl border overflow-hidden focus-within:ring-2 transition-all duration-150",
                salePrice
                  ? "border-[#6B6BFF] bg-[#F5F3FF] focus-within:ring-[#6B6BFF]/20"
                  : "border-[#DDDDF0] bg-[#FAFAFE] focus-within:border-[#6B6BFF] focus-within:ring-[#6B6BFF]/15",
              )}
            >
              <input
                id="sale-price-s3"
                type="text"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                placeholder="0"
                className="flex-1 h-10 px-3 text-sm font-semibold text-[#1A1A2E] bg-transparent focus:outline-none"
              />
              <span
                className={twMerge(
                  "h-10 flex items-center px-2.5 text-[12px] font-bold border-l",
                  salePrice
                    ? "text-[#6B6BFF] border-[#C5C6FF]"
                    : "text-[#4648D4] border-[#DDDDF0]",
                )}
              >
                đ
              </span>
            </div>
            {discount !== null && (
              <p className="text-[11px] text-emerald-600 font-semibold">
                ✦ Giảm {discount}% so với giá gốc
              </p>
            )}
          </div>
        </div>

        {/* Extra perks */}
        <div className="flex flex-col gap-2">
          <p className="text-[11px] font-bold text-[#9090B0] tracking-widest uppercase">
            Ưu đãi thêm
          </p>
          {[
            {
              Icon: TagIcon,
              label: "Tạo mã giảm giá (Coupon)",
              desc: "Khuyến khích học viên đăng ký sớm",
            },
            {
              Icon: GiftIcon,
              label: "Gói quà tặng thành viên",
              desc: "Mua khóa học làm quà cho người khác",
            },
          ].map(({ Icon, label, desc }) => (
            <div
              key={label}
              className="flex items-center gap-3 p-3 rounded-xl border border-[#EAEAF4] bg-[#FAFAFE] hover:border-[#C5C6FF] hover:bg-[#F5F3FF] cursor-pointer transition-all duration-150 group"
            >
              <span className="w-8 h-8 rounded-lg bg-[#EEF0FF] text-[#6B6BFF] flex items-center justify-center shrink-0">
                <Icon size={14} />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-[#1A1A2E] group-hover:text-[#4648D4] transition-colors">
                  {label}
                </p>
                <p className="text-[11px] text-[#9090B0]">{desc}</p>
              </div>
              <span className="text-[#9090B0] group-hover:text-[#6B6BFF] transition-colors shrink-0">
                <PlusCircleIcon size={16} />
              </span>
            </div>
          ))}
        </div>

        {/* Revenue projection */}
        <div className="rounded-xl bg-[#EEF0FF] p-4 flex flex-col gap-2">
          <p className="text-[11px] font-semibold text-[#6B6BFF]">
            Dự kiến doanh thu (tính trên 100 học viên)
          </p>
          <p className="text-[22px] font-extrabold text-[#1A1A2E] leading-none">
            {fmt(revenue)}
          </p>
          <div className="h-2 rounded-full bg-white overflow-hidden mt-1">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#6B6BFF] to-[#4648D4]"
              style={{ width: "70%" }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-[#9090B0] font-medium">
            <span>Lợi nhuận của bạn (70%)</span>
            <span className="font-semibold text-[#4648D4]">
              {fmt(instructorShare)}
            </span>
            <span>Phí MindNova (30%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Course Preview Card ──────────────────────────────────────────────────────

function CoursePreviewCard({
  title,
  thumbnailPreview,
  basePrice,
  salePrice,
}: {
  title: string;
  thumbnailPreview?: string | null;
  basePrice: string;
  salePrice: string;
}) {
  const hasThumb = !!thumbnailPreview;

  return (
    <div className="flex items-start gap-4 p-4 rounded-xl border border-[#EAEAF4] bg-white">
      {/* Thumbnail */}
      <div className="w-28 h-20 rounded-lg overflow-hidden shrink-0 bg-gradient-to-br from-[#4648D4]/20 to-[#6B6BFF]/20">
        {hasThumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnailPreview!}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#6B6BFF]/40">
            <svg
              viewBox="0 0 24 24"
              width={28}
              height={28}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <p className="text-[13px] font-bold text-[#1A1A2E] line-clamp-2 leading-snug">
          {title || "Làm chủ Trí tuệ Nhân tạo với MindNova AI"}
        </p>
        {/* Stars */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <StarIcon key={i} filled={i <= 4} />
          ))}
          <span className="text-[11px] text-[#9090B0] ml-1">(0 đánh giá)</span>
        </div>
        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-[16px] font-extrabold text-[#4648D4]">
            {salePrice ? salePrice : basePrice || "0"}
            <span className="text-[13px] font-semibold">đ</span>
          </span>
          {salePrice && basePrice && (
            <span className="text-[12px] text-[#B0B0C8] line-through">
              {basePrice}đ
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Ready Panel ──────────────────────────────────────────────────────────────

function ReadyPanel() {
  return (
    <div className="rounded-2xl bg-[#1A1A2E] p-6 flex flex-col items-center gap-4 text-center">
      <div className="w-14 h-14 rounded-full bg-[#6B6BFF]/20 border border-[#6B6BFF]/40 flex items-center justify-center text-[#6B6BFF]">
        <CheckShieldIcon />
      </div>
      <div>
        <p className="text-[15px] font-bold text-white">Đã sẵn sàng!</p>
        <p className="text-[11px] text-[#9090B0] leading-relaxed mt-1 max-w-[180px]">
          Mọi thiết lập đã hoàn tất. Sau khi nhấn &ldquo;Đăng&rdquo;, đội ngũ
          quản trị sẽ duyệt khóa học trong 2–4h.
        </p>
      </div>
      <button
        type="button"
        className="w-full py-2.5 rounded-xl text-[13px] font-semibold text-white bg-[#6B6BFF] hover:bg-[#5B5BEF] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#6B6BFF]/40"
      >
        Chính sách kiểm duyệt
      </button>
    </div>
  );
}

// ─── Main Step3 Component ─────────────────────────────────────────────────────

export function Step3SettingsPrice({
  courseTitle,
  thumbnailPreview,
}: Step3SettingsPriceProps) {
  const [isDraft, setIsDraft] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [allowRating, setAllowRating] = useState(true);
  const [currency, setCurrency] = useState("VND");
  const [basePrice, setBasePrice] = useState("2.500.000");
  const [salePrice, setSalePrice] = useState("1.450.000");

  const handleAISuggestion = () => {
    setBasePrice("2.500.000");
    setSalePrice("1.450.000");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top two-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Settings + AI Assistant */}
        <div className="flex flex-col gap-4">
          <SettingsCard
            isDraft={isDraft}
            setIsDraft={setIsDraft}
            isPublic={isPublic}
            setIsPublic={setIsPublic}
            allowRating={allowRating}
            setAllowRating={setAllowRating}
          />
          <AIAssistantCard onApply={handleAISuggestion} />
        </div>

        {/* Right: Pricing config */}
        <PricingCard
          currency={currency}
          setCurrency={setCurrency}
          basePrice={basePrice}
          setBasePrice={setBasePrice}
          salePrice={salePrice}
          setSalePrice={setSalePrice}
        />
      </div>

      {/* Bottom: Course preview */}
      <div className="rounded-2xl border border-[#EAEAF4] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0F0F8]">
          <span className="text-[14px] font-bold text-[#1A1A2E]">
            Bản xem trước thể khóa học
          </span>
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-[11px] font-bold text-emerald-700 tracking-wide uppercase">
            Live Preview
          </span>
        </div>

        <div className="p-5 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-5 items-start">
          <CoursePreviewCard
            title={courseTitle || "Làm chủ Trí tuệ Nhân tạo với MindNova AI"}
            thumbnailPreview={thumbnailPreview}
            basePrice={basePrice}
            salePrice={salePrice}
          />
          <ReadyPanel />
        </div>
      </div>
    </div>
  );
}
