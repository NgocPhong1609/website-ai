"use client";

import { useCertificateClaim } from "@/src/hooks/useCertificateClaim";

// ─── Types & Interfaces ───────────────────────────────────────────────────────

interface CertificateClaimCardProps {
  courseId: number;
  progress: number;
  avgScore?: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CertificateClaimCard({
  courseId,
  progress,
  avgScore = 85, // Mock average quiz score
}: CertificateClaimCardProps) {
  const { eligibility, isClaiming, claimCertificate } = useCertificateClaim({
    courseId,
    courseProgress: progress,
    avgScore,
    minScoreThreshold: 80,
  });

  const isClaimed = eligibility.status === "claimed";
  const isEligible = eligibility.status === "eligible";

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm relative overflow-hidden">
      <div className="flex items-center gap-2 mb-2 text-[#4F46E5]">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="7" />
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
        </svg>
        <h3 className="text-[14px] font-bold text-[#111827]">Course Certificate</h3>
      </div>

      <p className="text-[13px] text-[#6B7280] leading-relaxed mb-4">
        Earn a verifiable AI-secured completion certificate. Requires <strong>100% progress</strong> and <strong>≥80% average score</strong>.
      </p>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] mb-4 text-center">
        <div>
          <p className="text-[11px] font-semibold text-[#6B7280] uppercase">Progress</p>
          <p className={`text-sm font-bold ${progress >= 100 ? "text-emerald-600" : "text-[#4F46E5]"}`}>
            {progress}% / 100%
          </p>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-[#6B7280] uppercase">Avg Quiz Score</p>
          <p className={`text-sm font-bold ${avgScore >= 80 ? "text-emerald-600" : "text-amber-500"}`}>
            {avgScore}% / 80%
          </p>
        </div>
      </div>

      {/* Claim Button / Status Message */}
      {isClaimed ? (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center">
          <p className="text-xs font-bold flex items-center justify-center gap-1">
            <span>✓ Certificate Claimed</span>
          </p>
          <p className="font-mono text-[10px] opacity-80 mt-1 select-all break-all">
            {eligibility.certificateId}
          </p>
          <button
            type="button"
            onClick={() => alert(`Downloading certificate ${eligibility.certificateId}...`)}
            className="mt-2 text-[11px] font-bold underline text-emerald-700 hover:text-emerald-900 transition-colors"
          >
            Download PDF
          </button>
        </div>
      ) : isEligible ? (
        <button
          type="button"
          onClick={claimCertificate}
          disabled={isClaiming}
          className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#4F46E5] to-[#22D3EE] shadow-[0_4px_14px_rgba(79,70,229,0.35)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.45)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isClaiming ? "Generating Secured Certificate..." : "Claim Certificate"}
        </button>
      ) : (
        <div className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gray-100 text-gray-500 text-xs font-semibold cursor-not-allowed border border-gray-200">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span>
            {progress < 100
              ? "Complete remaining lessons to unlock"
              : "Raise average score above 80% to unlock"}
          </span>
        </div>
      )}
    </div>
  );
}
