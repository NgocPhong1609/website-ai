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
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs relative overflow-hidden">
      <div className="flex items-center gap-2 mb-2.5 text-[#4F46E5]">
        <span className="text-xl">🎖️</span>
        <h3 className="text-sm font-black text-gray-900">Chứng Chỉ Tốt Nghiệp AI</h3>
      </div>

      <p className="text-xs font-semibold text-gray-600 leading-relaxed mb-4">
        Nhận chứng chỉ số được bảo mật bởi Trí tuệ Nhân tạo MindNova. Yêu cầu <strong>100% tiến độ</strong> và <strong>≥80% điểm trung bình</strong>.
      </p>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-2 p-3.5 rounded-xl bg-gray-50 border border-gray-200 mb-4 text-center">
        <div>
          <p className="text-[10px] font-mono font-black text-gray-400 uppercase tracking-wider mb-1">Tiến Độ</p>
          <p className={`text-sm font-black font-mono ${progress >= 100 ? "text-emerald-600" : "text-[#4F46E5]"}`}>
            {progress}% / 100%
          </p>
        </div>
        <div>
          <p className="text-[10px] font-mono font-black text-gray-400 uppercase tracking-wider mb-1">Điểm TB Quiz</p>
          <p className={`text-sm font-black font-mono ${avgScore >= 80 ? "text-emerald-600" : "text-amber-500"}`}>
            {avgScore}% / 80%
          </p>
        </div>
      </div>

      {/* Claim Button / Status Message */}
      {isClaimed ? (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center">
          <p className="text-xs font-extrabold flex items-center justify-center gap-1">
            <span>✓ Đã nhận Chứng Chỉ Blockchain</span>
          </p>
          <p className="font-mono text-[10px] opacity-80 mt-1 select-all break-all">
            {eligibility.certificateId}
          </p>
          <button
            type="button"
            onClick={() => alert(`Đang tải xuống chứng chỉ ${eligibility.certificateId}...`)}
            className="mt-2.5 text-[11px] font-extrabold text-[#4F46E5] hover:underline uppercase tracking-wider cursor-pointer"
          >
            📥 Tải xuống PDF
          </button>
        </div>
      ) : isEligible ? (
        <button
          type="button"
          onClick={claimCertificate}
          disabled={isClaiming}
          className="w-full py-3 rounded-xl text-xs font-black text-white bg-[#4F46E5] hover:bg-[#4338CA] shadow-2xs active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all uppercase tracking-wider cursor-pointer"
        >
          {isClaiming ? "⌛ Đang tạo chứng chỉ bảo mật..." : "🎖️ Nhận Chứng Chỉ AI Ngay"}
        </button>
      ) : (
        <div className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-gray-100 text-gray-500 text-xs font-extrabold cursor-not-allowed border border-gray-200 uppercase tracking-wider">
          <span>🔒</span>
          <span>
            {progress < 100
              ? "Hoàn tất toàn bộ bài giảng để mở khóa"
              : "Nâng điểm trung bình lên trên 80% để mở"}
          </span>
        </div>
      )}
    </div>
  );
}
