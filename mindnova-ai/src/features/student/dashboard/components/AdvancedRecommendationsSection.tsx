import Image from "next/image";
import Link from "next/link";
import { VerifiedTeacherBadge } from "@/src/shared/components/VerifiedTeacherBadge";
import type { AdvancedRecommendation } from "../types";

interface AdvancedRecommendationsSectionProps {
 recommendations?: AdvancedRecommendation[];
}

export function AdvancedRecommendationsSection({ recommendations = [] }: AdvancedRecommendationsSectionProps) {
 if (!recommendations || recommendations.length === 0) return null;

 return (
 <section className="w-full flex flex-col gap-6">
 {/* Section Header */}
 <div className="w-full flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-3 border-b border-[#E8E2D9]">
 <div className="space-y-1.5 max-w-2xl">
 <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F6F3] text-[#2C3039] text-xs font-semibold border border-[#2C3039]/20">
 Đề xuất AI dành riêng cho bạn
 </span>
 <h2 className="text-xl sm:text-2xl font-bold text-[#2C3039] tracking-tight font-[family-name:var(--font-playfair-display)]">
 Lộ trình học tập <span className="text-[#C0392B]">chuyên sâu AI</span>
 </h2>
 <p className="text-xs font-normal text-[#8A8478] leading-relaxed">
 Các khóa đào tạo kiến trúc hệ thống và thực chiến cường độ cao được AI chẩn đoán chính xác với năng lực và mục tiêu nghề nghiệp của bạn.
 </p>
 </div>

 <div className="flex items-center gap-2 shrink-0">
 <span className="text-xs font-semibold text-[#2C3039] bg-[#F5F0E8] px-3.5 py-1.5 rounded-full border border-[#E8E2D9]">
 Top {recommendations.length} lộ trình hàng đầu
 </span>
 </div>
 </div>

 {/* Recommendations Grid */}
 <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {recommendations.map((rec) => {
 const studentsCount = rec.studentsCount ?? 0;
 const tags = rec.tags ?? [];
 const aiMatch = rec.aiMatch ?? "95% phù hợp";
 const displayTags = tags.slice(0, 3);

 return (
 <div
 key={rec.id}
 className="group bg-white border border-[#E8E2D9] rounded-xl flex flex-col justify-between w-full h-full hover:border-[#B8B0A3] transition-all duration-300 overflow-hidden"
 >
 <div className="flex flex-col flex-1">
 {/* Thumbnail Header */}
 <div className="relative h-44 w-full bg-[#2C3039] overflow-hidden shrink-0">
 {rec.thumbnailUrl ? (
 <Image
 src={rec.thumbnailUrl}
 alt={rec.title}
 fill
 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
 className="object-cover group-hover:scale-105 transition-transform duration-500 brightness-[0.96] group-hover:brightness-100"
 />
 ) : (
 <div className="w-full h-full bg-[#4A4F5C]" />
 )}

 <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

 {/* Top Badges */}
 <div className="absolute top-3.5 left-3.5 flex items-center gap-2 z-10 max-w-[60%]">
 <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-semibold truncate border border-white/20">
 {rec.category}
 </span>
 </div>

 <div className="absolute top-3.5 right-3.5 z-10">
 <span className="px-2.5 py-1 rounded-full bg-[#27AE60] text-white text-xs font-semibold">
 {aiMatch.replace(" AI Profile Match", "").replace("Match", "")} phù hợp
 </span>
 </div>

 {/* Overlaid Level & Duration Bar */}
 <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between gap-2 text-white z-10">
 <span className="text-xs font-medium bg-white/20 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-md border border-white/25">
 {rec.level === "Advanced Specialization" ? "Chuyên sâu" : rec.level === "Expert Track" ? "Chuyên gia" : "Thực chiến"}
 </span>
 <span className="text-xs font-semibold text-white/90 bg-black/50 px-2.5 py-0.5 rounded-md">
 {rec.duration.split("•")[0]}
 </span>
 </div>
 </div>

 {/* Body Content */}
 <div className="p-5 flex-1 flex flex-col justify-between gap-3">
 <div>
 <Link href="/explore" className="block text-decoration-none focus:outline-none min-w-0 group/title">
 <h3 className="text-base sm:text-lg font-bold text-[#2C3039] leading-snug line-clamp-2 group-hover:text-[#C0392B] group-hover/title:text-[#C0392B] transition-colors duration-200 font-[family-name:var(--font-playfair-display)]">
 {rec.title}
 </h3>
 </Link>

 {/* Instructor & Rating */}
 <div className="flex items-center justify-between gap-2 text-xs text-[#8A8478] mt-3 pb-3 border-b border-[#F5F0E8]">
 <span className="truncate font-medium text-[#4A4F5C] flex items-center gap-1.5">
 <span>{rec.instructor.split("•")[0]}</span>
 <VerifiedTeacherBadge isVerified={true} size="xs" />
 </span>
 <span className="font-semibold text-[#D4A574] shrink-0 flex items-center gap-1">
 {rec.rating.toFixed(1)} <span className="text-[#B8B0A3] font-normal">({studentsCount})</span>
 </span>
 </div>
 </div>

 {/* Tags */}
 {displayTags.length > 0 && (
 <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
 {displayTags.map((tag) => (
 <span
 key={tag}
 className="px-2.5 py-0.5 rounded-md bg-[#FAF7F2] group-hover:bg-[#F5F0E8] text-[#4A4F5C] text-xs font-medium transition-colors duration-200 border border-[#E8E2D9] truncate max-w-[140px]"
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
 className="group/btn w-full py-2.5 px-4 rounded-lg text-xs sm:text-sm font-semibold text-white bg-[#C0392B] hover:bg-[#A93226] transition-all duration-200 flex items-center justify-center gap-2 hover:-translate-y-0.5 text-decoration-none"
 >
 <span>Khám phá khóa học</span>
 </Link>
 </div>
 </div>
 );
 })}
 </div>
 </section>
 );
}
