"use client";

import { useState, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type CertificateStatus = "ineligible_progress" | "ineligible_score" | "eligible" | "claimed";

export interface ICertificateEligibility {
  status: CertificateStatus;
  courseProgress: number;
  avgScore: number;
  minScoreThreshold: number;
  certificateId?: string;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface UseCertificateClaimOptions {
  courseId: number;
  courseProgress: number;
  avgScore: number;
  minScoreThreshold?: number;
}

interface UseCertificateClaimReturn {
  eligibility: ICertificateEligibility;
  isClaiming: boolean;
  claimCertificate: () => Promise<void>;
}

/**
 * Core Rule:
 * Auto-trigger when courseProgress === 100 AND avgScore >= minScoreThreshold (80%).
 * Generates a unique Certificate ID (format: MN-CERT-{courseId}-{timestamp}) to prevent forgery.
 */
export function useCertificateClaim({
  courseId,
  courseProgress,
  avgScore,
  minScoreThreshold = 80,
}: UseCertificateClaimOptions): UseCertificateClaimReturn {
  const [isClaiming, setIsClaiming] = useState(false);
  const [certId, setCertId] = useState<string | undefined>(undefined);

  const computeStatus = useCallback((): CertificateStatus => {
    if (certId) return "claimed";
    if (courseProgress < 100) return "ineligible_progress";
    if (avgScore < minScoreThreshold) return "ineligible_score";
    return "eligible";
  }, [certId, courseProgress, avgScore, minScoreThreshold]);

  const eligibility: ICertificateEligibility = {
    status: computeStatus(),
    courseProgress,
    avgScore,
    minScoreThreshold,
    certificateId: certId,
  };

  const claimCertificate = useCallback(async () => {
    if (computeStatus() !== "eligible") return;

    setIsClaiming(true);
    // Simulate: POST /api/certificates/claim { courseId }
    // Server generates PDF + unique cert ID atomically
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const uniqueCertId = `MN-CERT-${courseId}-${Date.now().toString(36).toUpperCase()}`;
    setCertId(uniqueCertId);
    setIsClaiming(false);

    console.info("[Certificate] Generated and stored:", uniqueCertId);
  }, [computeStatus, courseId]);

  return { eligibility, isClaiming, claimCertificate };
}
