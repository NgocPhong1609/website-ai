import Image from "next/image";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import type { AdvancedRecommendation } from "../types";
import { Card } from "@/src/shared/components";

interface AdvancedRecommendationsSectionProps {
  recommendations?: AdvancedRecommendation[];
}

export function AdvancedRecommendationsSection({ recommendations = [] }: AdvancedRecommendationsSectionProps) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <section className="w-full flex flex-col gap-8 my-4">
      {/* Section Header */}
      <div className="w-full flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#E8E8F2]">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D1FAE5]/90 text-[#0D9488] text-xs font-bold uppercase tracking-wider border border-[#10B981]/30 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
            <span className="w-2 h-2 rounded-full bg-[#10B981] absolute" />
            <span>✨ Personalized AI Selection</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A2E] tracking-tight">
            Advanced Learning <span className="bg-gradient-to-r from-[#10B981] via-[#0D9488] to-[#4648D4] bg-clip-text text-transparent font-bold">Recommendations</span>
          </h2>
          <p className="text-sm text-[#64647A] leading-relaxed">
            Next-level engineering bootcamps and deep architectural tracks matched precisely to your current skill profile and career roadmap.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs sm:text-sm font-bold text-[#4648D4] bg-[#EEF2FF] px-4 py-2 rounded-2xl border border-[#6B6BFF]/30 shadow-2xs">
            ⚡ Top {recommendations.length} Curated Tracks
          </span>
        </div>
      </div>

      {/* Recommendations Grid (Spans 100% width, 3 generous columns on desktop) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
        {recommendations.map((rec) => {
          const studentsCount = rec.studentsCount ?? 0;
          const tags = rec.tags ?? [];
          const aiMatch = rec.aiMatch ?? "Recommended Track";

          const displayTags = tags.slice(0, 3); // Max 3 tags to guarantee uniform card height alignment

          return (
            <Card
              key={rec.id}
              variant="default"
              hoverEffect="lift"
              padding="none"
              className="group border-[#E8E8F2] flex flex-col justify-between w-full h-full min-h-[460px] shadow-sm overflow-hidden bg-white"
            >
              <div className="flex flex-col flex-1">
                {/* Standardized Thumbnail Header matching ContinueLearning h-52 */}
                <div className="relative h-52 w-full bg-[#1A1A2E] overflow-hidden shrink-0">
                  {rec.thumbnailUrl ? (
                    <Image
                      src={rec.thumbnailUrl}
                      alt={rec.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.95] group-hover:brightness-100"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#1E1B4B] via-[#312E81] to-[#4C1D95]" />
                  )}

                  {/* Dark overlay gradient for crisp badge contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A2E]/90 via-[#1A1A2E]/25 to-transparent pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 z-10 max-w-[60%]">
                    <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[#4CD7F6] text-[11px] font-bold truncate border border-white/20 shadow-sm">
                      {rec.category}
                    </span>
                  </div>

                  <div className="absolute top-4 right-4 z-10">
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#10B981] to-[#0D9488] text-white text-[11px] font-bold shadow-md tracking-wide flex items-center gap-1">
                      <span>🎯 {aiMatch.replace(" AI Profile Match", "")}</span>
                    </span>
                  </div>

                  {/* Overlaid Level & Duration Bar */}
                  <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between gap-2 text-white z-10">
                    <span className="text-xs font-bold tracking-wide bg-white/20 backdrop-blur-md text-white px-2.5 py-1 rounded-lg border border-white/25 flex items-center gap-1">
                      <span>⚡ {rec.level}</span>
                    </span>
                    <span className="text-xs font-bold text-[#E2E8F0] drop-shadow-md bg-black/60 px-2.5 py-1 rounded-lg border border-white/15">
                      ⏱️ {rec.duration.split("•")[0]}
                    </span>
                  </div>
                </div>

                {/* Body Content with Standardized Spacing & Clamping */}
                <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    <Link href="/courses/detail" className="block focus:outline-none min-w-0 group/title">
                      <h3 className="text-lg font-bold text-[#1A1A2E] leading-snug line-clamp-2 min-h-[3.25rem] group-hover:text-[#4648D4] group-hover/title:text-[#4648D4] transition-colors duration-200">
                        {rec.title}
                      </h3>
                    </Link>

                    {/* Instructor & Rating Metadata */}
                    <div className="flex items-center justify-between gap-2 text-xs text-[#64647A] mt-3.5 pb-3.5 border-b border-[#F0F0F8]">
                      <span className="truncate font-medium text-[#4B5563] flex items-center gap-1.5">
                        👨‍🏫 {rec.instructor.split("•")[0]}
                      </span>
                      <span className="font-bold text-[#10B981] shrink-0 flex items-center gap-1">
                        ★ {rec.rating.toFixed(1)} <span className="text-[#8888A8] font-normal">({studentsCount})</span>
                      </span>
                    </div>
                  </div>

                  {/* Skills Tag Roll - Standardized to max 3 tags for consistent row height */}
                  {displayTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      {displayTags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-lg bg-[#F8F9FE] group-hover:bg-[#EEF2FF] text-[#4648D4] text-[11px] font-bold transition-colors duration-200 border border-[#E4E4F4] group-hover:border-[#6B6BFF]/30 truncate max-w-[140px]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer CTA */}
              <div className="px-6 pb-6 pt-0 mt-auto">
                <Link
                  href="/courses/detail"
                  className="group/btn w-full py-3.5 px-5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-[#5052EE] via-[#6669F6] to-[#4CD7F6] hover:from-[#3D3FD6] hover:via-[#5254E2] hover:to-[#33BAE0] shadow-[0_6px_20px_rgba(96,99,238,0.35)] hover:shadow-[0_8px_28px_rgba(96,99,238,0.5)] transition-all duration-200 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#6B6BFF]/40"
                >
                  <span>Enroll in Advanced Track</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="group-hover/btn:translate-x-1.5 transition-transform duration-200">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
