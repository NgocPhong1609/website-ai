import Image from "next/image";
import Link from "next/link";
import type { AdvancedRecommendation } from "../types";

interface AdvancedRecommendationsSectionProps {
  recommendations?: AdvancedRecommendation[];
}

export function AdvancedRecommendationsSection({ recommendations = [] }: AdvancedRecommendationsSectionProps) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <section className="w-full flex flex-col gap-6">
      {/* Section Header */}
      <div className="w-full flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-3 border-b border-[#F0F0F8]">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CCFBF1] text-[#0D9488] text-xs font-semibold border border-[#10B981]/20 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
            <span className="w-2 h-2 rounded-full bg-[#10B981] absolute" />
            <span>✨ Đề xuất AI dành riêng cho bạn</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A2E] tracking-tight">
            Lộ trình học tập <span className="bg-gradient-to-r from-[#10B981] via-[#0D9488] to-[#4648D4] bg-clip-text text-transparent font-bold">chuyên sâu AI</span>
          </h2>
          <p className="text-xs font-normal text-[#64647A] leading-relaxed">
            Các khóa đào tạo kiến trúc hệ thống và thực chiến cường độ cao được AI chẩn đoán chính xác với năng lực và mục tiêu nghề nghiệp của bạn.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold text-[#5052EE] bg-[#EEF2FF] px-3.5 py-1.5 rounded-full border border-[#5052EE]/20 shadow-2xs">
            ⚡ Top {recommendations.length} lộ trình hàng đầu
          </span>
        </div>
      </div>

      {/* Recommendations Grid (Compact & Proportional Cards) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((rec) => {
          const studentsCount = rec.studentsCount ?? 0;
          const tags = rec.tags ?? [];
          const aiMatch = rec.aiMatch ?? "95% phù hợp";
          const displayTags = tags.slice(0, 3);

          return (
            <div
              key={rec.id}
              className="group bg-white border border-[#EAEAF4] rounded-2xl flex flex-col justify-between w-full h-full shadow-sm hover:shadow-md hover:border-[#5052EE]/40 transition-all duration-300 overflow-hidden"
            >
              <div className="flex flex-col flex-1">
                {/* Compact Thumbnail Header matching h-44 */}
                <div className="relative h-44 w-full bg-[#1A1A2E] overflow-hidden shrink-0">
                  {rec.thumbnailUrl ? (
                    <Image
                      src={rec.thumbnailUrl}
                      alt={rec.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 brightness-[0.96] group-hover:brightness-100"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#1E1B4B] via-[#312E81] to-[#4C1D95]" />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A2E]/80 via-transparent to-transparent opacity-90" />

                  {/* Top Badges */}
                  <div className="absolute top-3.5 left-3.5 flex items-center gap-2 z-10 max-w-[60%]">
                    <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[#4CD7F6] text-xs font-semibold truncate border border-white/20 shadow-2xs">
                      {rec.category}
                    </span>
                  </div>

                  <div className="absolute top-3.5 right-3.5 z-10">
                    <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-[#10B981] to-[#0D9488] text-white text-xs font-semibold shadow-xs flex items-center gap-1">
                      <span>🎯 {aiMatch.replace(" AI Profile Match", "").replace("Match", "")} phù hợp</span>
                    </span>
                  </div>

                  {/* Overlaid Level & Duration Bar */}
                  <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between gap-2 text-white z-10">
                    <span className="text-xs font-medium bg-white/20 backdrop-blur-md text-white px-2.5 py-0.5 rounded-lg border border-white/25">
                      ⚡ {rec.level === "Advanced Specialization" ? "Chuyên sâu" : rec.level === "Expert Track" ? "Chuyên gia" : "Thực chiến"}
                    </span>
                    <span className="text-xs font-semibold text-[#E2E8F0] drop-shadow-md bg-black/60 px-2.5 py-0.5 rounded-lg border border-white/15">
                      ⏱️ {rec.duration.split("•")[0]}
                    </span>
                  </div>
                </div>

                {/* Clean Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between gap-3">
                  <div>
                    <Link href="/explore" className="block text-decoration-none focus:outline-none min-w-0 group/title">
                      <h3 className="text-base sm:text-lg font-bold text-[#1A1A2E] leading-snug line-clamp-2 group-hover:text-[#5052EE] group-hover/title:text-[#5052EE] transition-colors duration-200">
                        {rec.title}
                      </h3>
                    </Link>

                    {/* Instructor & Rating Metadata */}
                    <div className="flex items-center justify-between gap-2 text-xs text-[#64647A] mt-3 pb-3 border-b border-[#F0F0F8]">
                      <span className="truncate font-medium text-[#4B5563] flex items-center gap-1.5">
                        👨‍🏫 {rec.instructor.split("•")[0]}
                      </span>
                      <span className="font-semibold text-[#10B981] shrink-0 flex items-center gap-1">
                        ★ {rec.rating.toFixed(1)} <span className="text-[#8888A8] font-normal">({studentsCount})</span>
                      </span>
                    </div>
                  </div>

                  {/* Compact Tags */}
                  {displayTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
                      {displayTags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 rounded-lg bg-[#F8F9FC] group-hover:bg-[#EEF2FF] text-[#5052EE] text-xs font-medium transition-colors duration-200 border border-[#EAEAF4] group-hover:border-[#5052EE]/20 truncate max-w-[140px]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer CTA */}
              <div className="px-5 pb-5 pt-0 mt-auto">
                <Link
                  href="/explore"
                  className="group/btn w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#4648D4] via-[#5052EE] to-[#0D9488] shadow-[0_4px_14px_rgba(80,82,238,0.3)] hover:shadow-[0_6px_20px_rgba(80,82,238,0.45)] transition-all duration-200 flex items-center justify-center gap-2 hover:-translate-y-0.5 text-decoration-none"
                >
                  <span>Khám phá khóa học</span>
                  <span className="group-hover/btn:translate-x-1 transition-transform">➔</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
