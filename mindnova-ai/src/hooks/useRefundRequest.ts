"use client";

import { useCallback, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type RefundStatus = "idle" | "processing" | "AUTO_APPROVED" | "MANUAL_REVIEW" | "INELIGIBLE";

export interface RefundResult {
  status: RefundStatus;
  reason: string;
  ticketId?: string;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface UseRefundRequestOptions {
  purchasedAt: string;   // ISO date string
  courseProgress: number; // 0-100
}

interface UseRefundRequestReturn {
  refundStatus: RefundStatus;
  refundResult: RefundResult | null;
  isProcessing: boolean;
  requestRefund: () => Promise<void>;
}

/**
 * Core Rule: Refund auto-approve if:
 * - Time since purchase <= 7 days AND
 * - Course learning progress <= 10%
 *
 * Otherwise: status → MANUAL_REVIEW for admin.
 */
export function useRefundRequest({ purchasedAt, courseProgress }: UseRefundRequestOptions): UseRefundRequestReturn {
  const [refundResult, setRefundResult] = useState<RefundResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const requestRefund = useCallback(async () => {
    setIsProcessing(true);
    setRefundResult(null);

    // Simulate server processing
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const daysSincePurchase = Math.floor(
      (Date.now() - new Date(purchasedAt).getTime()) / (1000 * 60 * 60 * 24)
    );

    console.info("[Refund] Evaluating refund eligibility:", {
      daysSincePurchase,
      courseProgress,
      withinWindow: daysSincePurchase <= 7,
      lowProgress: courseProgress <= 10,
    });

    // Core Rule: Auto-approve conditions
    if (daysSincePurchase <= 7 && courseProgress <= 10) {
      setRefundResult({
        status: "AUTO_APPROVED",
        reason: `Refund approved automatically. Purchase was ${daysSincePurchase} day(s) ago and course progress is ${courseProgress}% (≤10%).`,
        ticketId: `REFUND-${Date.now().toString(36).toUpperCase()}`,
      });
    } else {
      const reasons: string[] = [];
      if (daysSincePurchase > 7) reasons.push(`purchase was ${daysSincePurchase} days ago (limit: 7 days)`);
      if (courseProgress > 10) reasons.push(`course progress is ${courseProgress}% (limit: 10%)`);

      setRefundResult({
        status: "MANUAL_REVIEW",
        reason: `Refund sent to admin for manual review. Reason: ${reasons.join(" and ")}.`,
        ticketId: `REVIEW-${Date.now().toString(36).toUpperCase()}`,
      });
    }

    setIsProcessing(false);
  }, [purchasedAt, courseProgress]);

  return {
    refundStatus: refundResult?.status ?? "idle",
    refundResult,
    isProcessing,
    requestRefund,
  };
}
