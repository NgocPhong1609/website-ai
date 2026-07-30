"use client";

import { useState, useCallback, useMemo } from "react";

export type PricingTier = "standard" | "exclusive";

export interface DiscountConfig {
  isEnabled: boolean;
  discountPrice: number;
  startDate: string;
  endDate: string;
}

export interface RevenueBreakdown {
  listPrice: number;
  commissionRate: number; // e.g. 30 or 15
  platformFee: number;
  instructorEarnings: number;
  earningsText: string;
}

export interface UseInstructorPricingReturn {
  isFree: boolean;
  basePrice: number;
  tier: PricingTier;
  discount: DiscountConfig;
  validationError: string | null;
  revenue: RevenueBreakdown;
  setIsFree: (val: boolean) => void;
  setBasePrice: (val: number | string) => void;
  setTier: (tier: PricingTier) => void;
  toggleDiscount: (enable?: boolean) => void;
  updateDiscount: (field: keyof DiscountConfig, value: unknown) => void;
}

const MIN_PRICE = 10;
const MAX_PRICE = 500;

export function useInstructorPricing(initialPrice = 50): UseInstructorPricingReturn {
  const [isFree, setIsFreeState] = useState(false);
  const [basePrice, setBasePriceState] = useState<number>(initialPrice);
  const [tier, setTier] = useState<PricingTier>("standard");
  const [validationError, setValidationError] = useState<string | null>(null);

  // Default promotional dates: starts today, ends 7 days from today
  const defaultStart = new Date().toISOString().slice(0, 10);
  const defaultEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const [discount, setDiscount] = useState<DiscountConfig>({
    isEnabled: false,
    discountPrice: Math.max(MIN_PRICE, Math.floor(initialPrice * 0.7)),
    startDate: defaultStart,
    endDate: defaultEnd,
  });

  const setIsFree = useCallback((val: boolean) => {
    setIsFreeState(val);
    setValidationError(null);
  }, []);

  const setBasePrice = useCallback((val: number | string) => {
    const num = typeof val === "string" ? parseFloat(val) || 0 : val;
    setBasePriceState(num);

    if (!isFree) {
      if (num < MIN_PRICE || num > MAX_PRICE) {
        setValidationError(`Strict Bounds Rule: Price must be set between $${MIN_PRICE} and $${MAX_PRICE} USD.`);
      } else {
        setValidationError(null);
      }
    }
  }, [isFree]);

  const toggleDiscount = useCallback((enable?: boolean) => {
    setDiscount((prev) => {
      const nextState = enable !== undefined ? enable : !prev.isEnabled;
      return {
        ...prev,
        isEnabled: nextState,
        discountPrice: Math.min(prev.discountPrice, basePrice - 5 > MIN_PRICE ? basePrice - 5 : MIN_PRICE),
      };
    });
  }, [basePrice]);

  const updateDiscount = useCallback((field: keyof DiscountConfig, value: unknown) => {
    setDiscount((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "discountPrice" && typeof value === "number") {
        if (value >= basePrice || value < MIN_PRICE) {
          setValidationError(`Discount must be below base price ($${basePrice}) and above minimum ($${MIN_PRICE}).`);
        } else {
          setValidationError(null);
        }
      }
      return updated;
    });
  }, [basePrice]);

  // Dynamic Revenue Calculator (Section 1.3)
  const revenue: RevenueBreakdown = useMemo(() => {
    if (isFree) {
      return {
        listPrice: 0,
        commissionRate: 0,
        platformFee: 0,
        instructorEarnings: 0,
        earningsText: "Free course — ($0.00 platform commission). Ideal for cohort community building!",
      };
    }

    const activePrice = discount.isEnabled ? discount.discountPrice : basePrice;
    const rate = tier === "exclusive" ? 15 : 30; // 15% for exclusive instructors, 30% standard
    const platformFee = Number(((activePrice * rate) / 100).toFixed(2));
    const instructorEarnings = Number((activePrice - platformFee).toFixed(2));

    return {
      listPrice: activePrice,
      commissionRate: rate,
      platformFee,
      instructorEarnings,
      earningsText: `If you set $${activePrice}, you earn $${instructorEarnings} after ${rate}% platform fees.`,
    };
  }, [isFree, basePrice, discount.isEnabled, discount.discountPrice, tier]);

  return {
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
  };
}
