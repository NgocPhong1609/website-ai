"use client";

import { useCallback, useState } from "react";
import {
  UploadIcon,
  ShareIcon,
  PartyPopperIcon,
  ArrowRightIcon,
  VerifiedBadgeIcon,
  GraduationCapIcon,
  StopwatchIcon,
  MedalIcon,
} from "./icons";
import { ICertificate, ICertificateEligibility } from "../../../../types/student";
import { COURSE_DETAIL } from "../courses";

// ─── Constants ────────────────────────────────────────────────────────────────

const MIN_SCORE_THRESHOLD = 80; // Average score >= 80% required
const STUDENT_NAME = "Alex Johnson"; // In production: from auth session

// ─── Mock existing certificate (simulates a previously earned cert) ─────────
// This would come from: GET /api/certificates?courseId=X
const EXISTING_CERTIFICATE: ICertificate | null = null; // null = not yet earned

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Generates a cryptographically-style unique certificate ID.
 * In production, this is generated server-side and stored in the database.
 */
function generateCertificateId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const segments = [4, 4, 4, 4];
  return segments
    .map((len) =>
      Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
    )
    .join("-");
}

function checkEligibility(): ICertificateEligibility {
  const progress = COURSE_DETAIL.progress;
  const avgScore = COURSE_DETAIL.avgScore ?? 0;

  return {
    isEligible: progress >= 100 && avgScore >= MIN_SCORE_THRESHOLD,
    progress,
    avgScore,
    minScoreThreshold: MIN_SCORE_THRESHOLD,
  };
}

// ─── Eligibility Gate Card ────────────────────────────────────────────────────

interface EligibilityGateProps {
  eligibility: ICertificateEligibility;
}

function EligibilityGate({ eligibility }: EligibilityGateProps) {
  const { progress, avgScore, minScoreThreshold } = eligibility;
  const progressMet = progress >= 100;
  const scoreMet = avgScore >= minScoreThreshold;

  return (
    <div className="bg-white border border-[#EAEAF4] rounded-2xl p-8 shadow-sm">
      <h2 className="text-[18px] font-bold text-[#1A1A2E] mb-2">Certificate Requirements</h2>
      <p className="text-[14px] text-[#7878A0] mb-6 leading-relaxed">
        Complete all requirements below to automatically unlock your verified certificate.
      </p>

      <div className="space-y-6">
        {/* Requirement 1: Course Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${progressMet ? "bg-emerald-500" : "bg-gray-200"}`}>
                {progressMet ? (
                  <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span className="text-[9px] font-bold text-gray-400">1</span>
                )}
              </div>
              <span className="text-[14px] font-semibold text-[#1A1A2E]">Complete all lessons</span>
            </div>
            <span className={`text-[14px] font-bold ${progressMet ? "text-emerald-600" : "text-[#6B6BFF]"}`}>
              {progress}% / 100%
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden ml-7">
            <div
              className={`h-full rounded-full transition-all duration-700 ${progressMet ? "bg-emerald-500" : "bg-[#6B6BFF]"}`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          {!progressMet && (
            <p className="text-[12px] text-[#A0A0C0] mt-1.5 ml-7">{100 - progress}% remaining to complete</p>
          )}
        </div>

        {/* Requirement 2: Average Score */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${scoreMet ? "bg-emerald-500" : "bg-gray-200"}`}>
                {scoreMet ? (
                  <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span className="text-[9px] font-bold text-gray-400">2</span>
                )}
              </div>
              <span className="text-[14px] font-semibold text-[#1A1A2E]">Average quiz score ≥ {minScoreThreshold}%</span>
            </div>
            <span className={`text-[14px] font-bold ${scoreMet ? "text-emerald-600" : avgScore >= minScoreThreshold * 0.8 ? "text-amber-500" : "text-[#EF4444]"}`}>
              {avgScore}% / {minScoreThreshold}%
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden ml-7">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                scoreMet ? "bg-emerald-500" : avgScore >= minScoreThreshold * 0.8 ? "bg-amber-400" : "bg-[#EF4444]"
              }`}
              style={{ width: `${Math.min((avgScore / minScoreThreshold) * 100, 100)}%` }}
            />
          </div>
          {!scoreMet && (
            <p className="text-[12px] text-[#A0A0C0] mt-1.5 ml-7">Need {minScoreThreshold - avgScore}% more to reach the threshold</p>
          )}
        </div>
      </div>

      <div className="mt-8 p-4 rounded-xl bg-[#F8F9FC] border border-[#EAEAF4] text-center">
        <p className="text-[13px] text-[#7878A0]">
          Once both requirements are met, your certificate will be <strong>automatically generated</strong> with a unique verification ID.
        </p>
      </div>
    </div>
  );
}

// ─── Certificate Card ─────────────────────────────────────────────────────────

interface CertificateCardProps {
  certificate: ICertificate;
}

function CertificateCard({ certificate }: CertificateCardProps) {
  const formattedDate = new Date(certificate.issuedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const handleDownload = useCallback(() => {
    // In production: fetch the PDF from certificate.pdfUrl
    // Here we simulate a download action
    const link = document.createElement("a");
    link.href = certificate.pdfUrl ?? "#";
    link.download = `MindNova_Certificate_${certificate.uniqueId}.pdf`;
    link.click();
  }, [certificate]);

  const handleCopyId = useCallback(async () => {
    await navigator.clipboard.writeText(certificate.uniqueId).catch(console.error);
  }, [certificate.uniqueId]);

  return (
    <div className="bg-white border border-[#6B6BFF]/20 rounded-2xl overflow-hidden shadow-sm">
      {/* Certificate Visual */}
      <div className="relative bg-gradient-to-br from-[#1A1A2E] via-[#2B1B8A] to-[#3b3dbf] p-8 text-white">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#6B6BFF] rounded-full blur-[80px] opacity-30 transform translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#00D2FF] rounded-full blur-[60px] opacity-20 transform -translate-x-1/3 translate-y-1/3" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/60">
              Certificate of Completion
            </span>
            <VerifiedBadgeIcon className="w-6 h-6 text-[#00D2FF]" />
          </div>

          <p className="text-[13px] text-white/60 mb-1">This certifies that</p>
          <h2 className="text-[28px] font-bold mb-1 tracking-tight">{certificate.studentName}</h2>
          <p className="text-[13px] text-white/60 mb-4">has successfully completed</p>
          <h3 className="text-[20px] font-bold text-white/90">{certificate.courseName}</h3>

          <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-white/40 uppercase tracking-widest">Issued On</p>
              <p className="text-[13px] font-semibold text-white/80">{formattedDate}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-white/40 uppercase tracking-widest">Certificate ID</p>
              <button
                onClick={handleCopyId}
                className="text-[13px] font-mono font-semibold text-[#00D2FF] hover:text-white transition-colors"
                title="Click to copy"
              >
                {certificate.uniqueId}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-5 flex items-center gap-3">
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#5153DF] text-white rounded-xl text-[14px] font-bold hover:bg-[#4648D4] transition-colors shadow-md"
        >
          <UploadIcon className="w-4 h-4" />
          Download PDF
        </button>
        <button className="flex items-center justify-center gap-2 py-3 px-5 bg-[#F0F0FF] text-[#6B6BFF] rounded-xl text-[14px] font-bold hover:bg-[#EAEAF4] transition-colors">
          <ShareIcon className="w-4 h-4" />
          Share
        </button>
      </div>
    </div>
  );
}

// ─── Claim Banner ─────────────────────────────────────────────────────────────

interface ClaimBannerProps {
  onClaim: () => void;
  isClaiming: boolean;
}

function ClaimBanner({ onClaim, isClaiming }: ClaimBannerProps) {
  return (
    <div className="bg-white border border-[#6B6BFF]/20 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-full bg-gradient-to-r from-[#F0F0FF] to-transparent pointer-events-none" />

      <div className="flex items-center gap-5 relative z-10 w-full md:w-auto">
        <div className="w-16 h-16 rounded-full bg-[#EAEAF4] flex items-center justify-center shrink-0">
          <PartyPopperIcon className="w-8 h-8 text-[#5153DF]" />
        </div>
        <div>
          <p className="text-[11px] font-bold tracking-widest text-[#6B6BFF] uppercase mb-1">
            🎉 Congratulations!
          </p>
          <h2 className="text-[20px] font-bold text-[#1A1A2E]">You've Earned a Certificate!</h2>
          <p className="text-[14px] text-[#7878A0] mt-1">
            You've completed all lessons and achieved the required score. Your certificate is ready.
          </p>
        </div>
      </div>

      <button
        onClick={onClaim}
        disabled={isClaiming}
        className="relative z-10 flex items-center gap-2 px-8 py-4 bg-[#5153DF] text-white rounded-xl text-[15px] font-bold hover:bg-[#4648D4] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isClaiming ? (
          <>
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            Generating...
          </>
        ) : (
          <>
            <GraduationCapIcon className="w-5 h-5" />
            Claim Certificate
            <ArrowRightIcon className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────

function StatsBar({ totalCerts }: { totalCerts: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white border border-[#EAEAF4] rounded-2xl p-5 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#F0F0FF] text-[#6B6BFF] flex items-center justify-center shrink-0">
          <MedalIcon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-[24px] font-bold text-[#1A1A2E]">{totalCerts}</p>
          <p className="text-[13px] text-[#7878A0] font-medium">Total Earned</p>
        </div>
      </div>
      <div className="bg-white border border-[#EAEAF4] rounded-2xl p-5 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#EDFCF6] text-[#10B981] flex items-center justify-center shrink-0">
          <VerifiedBadgeIcon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-[24px] font-bold text-[#1A1A2E]">{totalCerts}</p>
          <p className="text-[13px] text-[#7878A0] font-medium">Verified</p>
        </div>
      </div>
      <div className="bg-white border border-[#EAEAF4] rounded-2xl p-5 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#FFF7ED] text-[#F59E0B] flex items-center justify-center shrink-0">
          <StopwatchIcon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-[24px] font-bold text-[#1A1A2E]">{totalCerts > 0 ? "2026" : "—"}</p>
          <p className="text-[13px] text-[#7878A0] font-medium">Latest Year</p>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CertificatesContent() {
  const eligibility = checkEligibility();
  const [certificate, setCertificate] = useState<ICertificate | null>(EXISTING_CERTIFICATE);
  const [isClaiming, setIsClaiming] = useState(false);

  /**
   * Core Rule: Certificate is auto-generated when:
   * - progress >= 100%
   * - avgScore >= minScoreThreshold (80%)
   *
   * The system generates a unique Certificate ID server-side.
   * In production: POST /api/certificates/claim { courseId }
   * → Returns: { certificate: ICertificate } with a server-generated uniqueId
   */
  const handleClaimCertificate = useCallback(async () => {
    if (!eligibility.isEligible || isClaiming || certificate) return;

    setIsClaiming(true);

    // Simulate API call to generate certificate with unique ID
    await new Promise<void>((resolve) => setTimeout(resolve, 1500));

    const newCertificate: ICertificate = {
      uniqueId: generateCertificateId(),
      courseId: COURSE_DETAIL.id,
      courseName: COURSE_DETAIL.title,
      studentName: STUDENT_NAME,
      issuedAt: new Date().toISOString(),
      pdfUrl: null, // In production: signed S3 URL to the generated PDF
    };

    setCertificate(newCertificate);
    setIsClaiming(false);
  }, [eligibility.isEligible, isClaiming, certificate]);

  const totalCerts = certificate ? 1 : 0;

  return (
    <div className="max-w-6xl mx-auto w-full p-8 lg:p-10 space-y-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex-1">
          <h3 className="text-[11px] font-bold tracking-widest text-[#6B6BFF] uppercase mb-2">
            Your Achievements
          </h3>
          <h1 className="text-3xl font-bold text-[#1A1A2E] leading-tight mb-3">
            Certificates & Credentials
          </h1>
          <p className="text-[14px] text-[#7878A0] max-w-2xl leading-relaxed">
            Celebrate your hard work. Here you can find all your verified AI-powered certifications,
            ready to be shared with the world.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <button className="flex items-center gap-2 px-5 py-3 bg-[#F0F0FF] text-[#6B6BFF] rounded-xl text-[14px] font-bold hover:bg-[#EAEAF4] transition-colors shadow-sm">
            <UploadIcon className="w-4 h-4" />
            Export All
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-[#5153DF] text-white rounded-xl text-[14px] font-bold hover:bg-[#4648D4] transition-colors shadow-md">
            <ShareIcon className="w-4 h-4" />
            Share Portfolio
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <StatsBar totalCerts={totalCerts} />

      {/* Claim Banner — only shown when eligible AND not yet claimed */}
      {eligibility.isEligible && !certificate && (
        <ClaimBanner onClaim={handleClaimCertificate} isClaiming={isClaiming} />
      )}

      {/* Earned Certificate */}
      {certificate ? (
        <div>
          <h2 className="text-[18px] font-bold text-[#1A1A2E] mb-4">Earned Certificates</h2>
          <CertificateCard certificate={certificate} />
        </div>
      ) : (
        /* Requirements Gate — shown when not yet eligible */
        <EligibilityGate eligibility={eligibility} />
      )}

      {/* In-progress courses section */}
      {!certificate && (
        <div className="bg-white border border-[#EAEAF4] rounded-2xl p-6 shadow-sm">
          <h2 className="text-[16px] font-bold text-[#1A1A2E] mb-4">Courses In Progress</h2>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#F8F9FC] border border-[#EAEAF4]">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-bold text-[#1A1A2E] truncate">{COURSE_DETAIL.title}</p>
              <p className="text-[13px] text-[#7878A0]">
                {eligibility.progress}% complete · Avg score: {eligibility.avgScore}%
              </p>
              <div className="mt-2 h-1.5 bg-[#EEF2FF] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#6B6BFF] rounded-full transition-all"
                  style={{ width: `${eligibility.progress}%` }}
                />
              </div>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[11px] text-[#7878A0] mb-1">Score required</p>
              <p className={`text-[14px] font-bold ${eligibility.avgScore >= MIN_SCORE_THRESHOLD ? "text-emerald-600" : "text-[#EF4444]"}`}>
                {eligibility.avgScore}% / {MIN_SCORE_THRESHOLD}%
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
