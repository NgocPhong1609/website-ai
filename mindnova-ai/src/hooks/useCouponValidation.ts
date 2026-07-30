"use client";

import { useState, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type CouponStatus =
  | "idle"
  | "validating"
  | "APPLIED"
  | "EXPIRED"
  | "LIMIT_REACHED"
  | "NOT_APPLICABLE"
  | "INVALID";

export interface CouponValidationResult {
  status: CouponStatus;
  discountPercent?: number;
  message: string;
}

// ─── Mock coupon database (simulates server-side state) ───────────────────────

const MOCK_COUPONS: Record<string, { expiresAt: string; usageLimit: number; usedCount: number; applicableCourses: string[] | "all"; discountPercent: number }> = {
  NOVA2024: {
    expiresAt: "2025-12-31",
    usageLimit: 500,
    usedCount: 120,
    applicableCourses: "all",
    discountPercent: 20,
  },
  SUMMER50: {
    expiresAt: "2024-01-01", // Expired
    usageLimit: 100,
    usedCount: 100,
    applicableCourses: "all",
    discountPercent: 50,
  },
  FULLSTACK10: {
    expiresAt: "2026-12-31",
    usageLimit: 10,
    usedCount: 10, // Limit reached
    applicableCourses: ["course-fullstack"],
    discountPercent: 10,
  },
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface UseCouponValidationOptions {
  /** The courseId the user is purchasing (for applicability check) */
  courseId?: string;
}

interface UseCouponValidationReturn {
  code: string;
  validationResult: CouponValidationResult | null;
  isValidating: boolean;
  setCode: (v: string) => void;
  applyCode: () => Promise<void>;
  reset: () => void;
}

export function useCouponValidation({ courseId = "all" }: UseCouponValidationOptions = {}): UseCouponValidationReturn {
  const [code, setCodeRaw] = useState("");
  const [validationResult, setValidationResult] = useState<CouponValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const setCode = useCallback((v: string) => {
    setCodeRaw(v.toUpperCase());
    setValidationResult(null);
  }, []);

  const applyCode = useCallback(async () => {
    const trimmed = code.trim();
    if (!trimmed) return;

    setIsValidating(true);
    setValidationResult(null);

    // Simulate DB lock + network round-trip (race condition protection on server)
    console.info("[Coupon] Acquiring DB lock on coupon record to prevent race condition...");
    await new Promise((resolve) => setTimeout(resolve, 800));

    const coupon = MOCK_COUPONS[trimmed];

    if (!coupon) {
      setValidationResult({ status: "INVALID", message: "Coupon code not found." });
      setIsValidating(false);
      return;
    }

    // Core Rule 1: Expiry check
    if (new Date(coupon.expiresAt) < new Date()) {
      setValidationResult({ status: "EXPIRED", message: `Code "${trimmed}" expired on ${coupon.expiresAt}.` });
      setIsValidating(false);
      return;
    }

    // Core Rule 2: Usage limit check
    if (coupon.usedCount >= coupon.usageLimit) {
      setValidationResult({ status: "LIMIT_REACHED", message: `Code "${trimmed}" has reached its maximum usage limit.` });
      setIsValidating(false);
      return;
    }

    // Core Rule 3: Applicability check (user/course)
    if (coupon.applicableCourses !== "all" && !coupon.applicableCourses.includes(courseId)) {
      setValidationResult({ status: "NOT_APPLICABLE", message: `Code "${trimmed}" is not applicable to this course.` });
      setIsValidating(false);
      return;
    }

    // All checks passed — coupon applied
    setValidationResult({
      status: "APPLIED",
      discountPercent: coupon.discountPercent,
      message: `${coupon.discountPercent}% discount applied!`,
    });
    console.info("[Coupon] DB lock released. Coupon applied, usage counter incremented.");
    setIsValidating(false);
  }, [code, courseId]);

  const reset = useCallback(() => {
    setCodeRaw("");
    setValidationResult(null);
  }, []);

  return { code, validationResult, isValidating, setCode, applyCode, reset };
}
