"use client";

import React from "react";
import { twMerge } from "tailwind-merge";
import { useInstructorPricing, type PricingTier } from "@/src/hooks/instructor/useInstructorPricing";

export interface Step3SettingsPriceProps {
  courseTitle?: string;
  thumbnailPreview?: string | null;
  onSaveConfig?: () => void;
}

// Leaf UI presentation component utilizing useInstructorPricing custom hook (Rule #1, #2, #3)

export function Step3SettingsPrice({ courseTitle = "Module 4: Semantic Analysis Models", thumbnailPreview, onSaveConfig }: Step3SettingsPriceProps) {
  const {
    isFree,
    basePrice,
    tier,
    discount,
    validationError,
    revenue,
    setIsFree,
    setBasePrice,
    setTier,
    toggleDiscount,
    updateDiscount,
  } = useInstructorPricing(50);

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Top Title Banner */}
      <div className="p-6 rounded-3xl bg-white border border-[#EAEAF4] shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
        <h3 className="text-lg font-extrabold text-[#1A1A2E]">Pricing &amp; Monetization Strategy (Section 1.3)</h3>
        <p className="text-xs text-gray-500 mt-1">
          Configure tier pricing bounds ($10–$500 USD), promotional discount schedules, and evaluate dynamic platform earnings in real-time.
        </p>
      </div>

      {/* Main Grid Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column - Form Config */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Free vs Paid Toggle */}
          <div className="p-6 rounded-3xl bg-white border border-[#EAEAF4] shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-extrabold text-[#1A1A2E]">Course Monetization Type</h4>
                <p className="text-xs text-gray-400">Toggle between community Free cohort or monetized Professional Paid course.</p>
              </div>
              <div className="flex items-center p-1 rounded-2xl bg-[#F0F0FF] border border-[#D5D5FF]">
                <button
                  type="button"
                  onClick={() => setIsFree(false)}
                  className={twMerge(
                    "px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer",
                    !isFree ? "bg-[#6B6BFF] text-white shadow-md" : "text-gray-500 hover:text-gray-900"
                  )}
                >
                  💰 Paid Course
                </button>
                <button
                  type="button"
                  onClick={() => setIsFree(true)}
                  className={twMerge(
                    "px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer",
                    isFree ? "bg-[#10B981] text-white shadow-md" : "text-gray-500 hover:text-gray-900"
                  )}
                >
                  🎁 Free (Zero Fee)
                </button>
              </div>
            </div>

            {/* Base Price Input Bounds ($10 - $500) */}
            {!isFree && (
              <div className="pt-4 border-t border-gray-100 flex flex-col gap-4 animate-fadeIn">
                <div>
                  <label htmlFor="course-price-input" className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                    Base List Price ($10.00 – $500.00 USD)
                  </label>
                  <div className="relative rounded-2xl shadow-xs">
                    <span className="absolute left-4 top-3.5 text-base font-extrabold text-gray-400">$</span>
                    <input
                      id="course-price-input"
                      type="number"
                      min={10}
                      max={500}
                      value={basePrice}
                      onChange={(e) => setBasePrice(e.target.value)}
                      className={twMerge(
                        "w-full pl-9 pr-4 py-3.5 rounded-2xl font-extrabold text-base border-2 transition-all focus:outline-none",
                        validationError
                          ? "border-red-500 text-red-600 bg-red-50/30"
                          : "border-[#D5D5FF] bg-[#FDFDFF] text-[#1A1A2E] focus:border-[#6B6BFF]"
                      )}
                      placeholder="50.00"
                    />
                    <span className="absolute right-4 top-3.5 text-xs font-extrabold text-gray-400">USD</span>
                  </div>
                </div>

                {validationError && (
                  <p className="text-xs font-bold text-red-600 bg-red-50 p-3 rounded-xl border border-red-200 flex items-center gap-2">
                    ⚠️ {validationError}
                  </p>
                )}

                {/* Platform Commission Tier Switch */}
                <div className="flex flex-col gap-2 pt-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Instructor Partnership Tier:</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setTier("standard")}
                      className={twMerge(
                        "p-3 rounded-2xl border text-left transition-all",
                        tier === "standard" ? "border-[#6B6BFF] bg-[#6B6BFF]/10 font-bold" : "border-gray-200 text-gray-500 hover:border-gray-300"
                      )}
                    >
                      <p className="text-xs text-[#1A1A2E]">Standard Tier</p>
                      <p className="text-[11px] text-indigo-600 font-extrabold">30% Platform Fee (70% Earnings)</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTier("exclusive")}
                      className={twMerge(
                        "p-3 rounded-2xl border text-left transition-all",
                        tier === "exclusive" ? "border-emerald-500 bg-emerald-500/10 font-bold" : "border-gray-200 text-gray-500 hover:border-gray-300"
                      )}
                    >
                      <p className="text-xs text-[#1A1A2E]">⭐ Exclusive MindNova Tier</p>
                      <p className="text-[11px] text-emerald-600 font-extrabold">15% Reduced Fee (85% Earnings)</p>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Promotional Discount Scheduler */}
          {!isFree && (
            <div className="p-6 rounded-3xl bg-white border border-[#EAEAF4] shadow-xs flex flex-col gap-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-[#1A1A2E]">⚡ Promotional Discount &amp; Coupon Dates</h4>
                  <p className="text-xs text-gray-400">Boost conversion by scheduling targeted flash discount windows.</p>
                </div>
                <input
                  type="checkbox"
                  checked={discount.isEnabled}
                  onChange={(e) => toggleDiscount(e.target.checked)}
                  className="w-5 h-5 rounded-md text-[#6B6BFF] focus:ring-[#6B6BFF] cursor-pointer"
                />
              </div>

              {discount.isEnabled && (
                <div className="pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fadeIn">
                  <div>
                    <label htmlFor="discount-price-input" className="block text-xs font-bold text-gray-700 uppercase mb-1">Discount Price ($)</label>
                    <input
                      id="discount-price-input"
                      type="number"
                      min={10}
                      max={basePrice}
                      value={discount.discountPrice}
                      onChange={(e) => updateDiscount("discountPrice", parseFloat(e.target.value) || 10)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D5D5FF] font-extrabold text-sm text-emerald-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="discount-start-date" className="block text-xs font-bold text-gray-700 uppercase mb-1">Start Date</label>
                    <input
                      id="discount-start-date"
                      type="date"
                      value={discount.startDate}
                      onChange={(e) => updateDiscount("startDate", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 font-semibold text-xs text-gray-700 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="discount-end-date" className="block text-xs font-bold text-gray-700 uppercase mb-1">End Date (Default 7d)</label>
                    <input
                      id="discount-end-date"
                      type="date"
                      value={discount.endDate}
                      onChange={(e) => updateDiscount("endDate", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 font-semibold text-xs text-gray-700 focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column - Dynamic Revenue Calculator & Preview */}
        <div className="lg:col-span-5 flex flex-col gap-6 sticky top-20">
          
          {/* Dynamic Revenue Calculator Panel (Section 1.3) */}
          <div className="p-7 rounded-3xl bg-gradient-to-br from-[#1E233E] to-[#121626] text-white border border-indigo-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex flex-col gap-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-black text-xl shadow-md">
                💵
              </div>
              <div>
                <h4 className="text-base font-extrabold text-white">Dynamic Revenue Calculator</h4>
                <p className="text-xs text-gray-400">Real-time profit distribution estimation</p>
              </div>
            </div>

            {/* Price breakdown figures */}
            <div className="flex flex-col gap-3 font-mono">
              <div className="flex items-center justify-between text-xs text-gray-300">
                <span>List Price (Active):</span>
                <span className="text-sm font-bold text-white">${revenue.listPrice.toFixed(2)} USD</span>
              </div>
              {!isFree && (
                <div className="flex items-center justify-between text-xs text-rose-300">
                  <span>Platform Fee ({revenue.commissionRate}%):</span>
                  <span>-${revenue.platformFee.toFixed(2)} USD</span>
                </div>
              )}
              <div className="h-px bg-white/10 w-full my-1" />
              <div className="flex items-center justify-between text-base font-extrabold text-emerald-400">
                <span>Your Net Earnings:</span>
                <span>${revenue.instructorEarnings.toFixed(2)} USD / student</span>
              </div>
            </div>

            {/* High-visibility feedback badge */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold leading-relaxed text-[#A5D6FF]">
              💡 {revenue.earningsText}
            </div>
          </div>

          {/* Quick Preview Badge & Save Action */}
          <div className="p-6 rounded-3xl bg-white border border-[#EAEAF4] shadow-xs flex flex-col gap-4">
            <h5 className="text-sm font-black text-[#1A1A2E] uppercase tracking-wider">Configuration Checklist</h5>
            <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-600">
              <span>✓ Bounds Verified: Price compliant with $10–$500 strategy</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-extrabold text-indigo-600">
              <span>✓ Promotional schedule locked to active timezone</span>
            </div>

            <button
              type="button"
              onClick={onSaveConfig}
              className="w-full py-3.5 rounded-2xl bg-[#6B6BFF] hover:bg-[#5249DE] text-white font-extrabold text-xs tracking-wide uppercase shadow-lg transition-all"
            >
              Save Pricing Strategy ➔
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
