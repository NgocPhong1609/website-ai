"use client";

import React from "react";
import { useRouter } from "next/navigation";
import type { 
 CourseDetailProgressCard, 
 CourseDetailAIInsight, 
 CourseDetailInstructor, 
 CourseDetailResourceItem 
} from "../../types";

// ─── Sub-components ───────────────────────────────────────────────────────────
function ProgressCard({ progress }: { progress?: CourseDetailProgressCard }) {
 const percentage = progress?.progress_percentage ?? 65;
 const completed = progress?.completed_lessons_count ?? 14;
 const total = progress?.total_lessons_count ?? 22;
 const timeLeft = progress?.time_left_text ?? "8h 15m thời lượng còn lại";
 const statusTag = progress?.status_tag ?? "Vượt chỉ tiêu +15%";

 return (
 <div className="bg-white rounded-xl border border-[#E8E2D9] p-5 shadow-sm hover:border-[#B8B0A3] transition-all duration-300">
 <div className="flex items-center justify-between gap-2 mb-3">
 <div>
 <span className="text-xs font-bold text-[#8A8478] uppercase tracking-wider block">Tiến độ khóa học</span>
 <h3 className="text-2xl font-bold text-[#2C3039] mt-1 font-[family-name:var(--font-playfair-display)]">{percentage}% Hoàn thành</h3>
 </div>
 <span className="text-[11px] font-bold text-[#2C3039] bg-[#E8F6F3] px-2.5 py-1 rounded-md border border-[#2C3039]/20">
 {statusTag}
 </span>
 </div>

 <div className="w-full h-1.5 bg-[#F5F0E8] rounded-full overflow-hidden p-0 border border-[#E8E2D9] mt-4">
 <div 
 className="h-full bg-[#2C3039] rounded-full transition-all duration-1000" 
 style={{ width: `${percentage}%` }} 
 />
 </div>

 <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#E8E2D9] text-xs font-medium text-[#8A8478]">
 <span className="flex items-center gap-1.5 text-[#2C3039]">
 <span className="font-semibold text-[#8A8478]">Thời gian:</span>
 <span>{timeLeft.replace(" thời lượng còn lại", "")}</span>
 </span>
 <span className="font-bold text-[#2C3039] bg-[#F5F0E8] px-2.5 py-1 rounded-md border border-[#E8E2D9]">
 {completed}/{total} Bài
 </span>
 </div>
 </div>
 );
}

function AiInsightCard({ aiInsight }: { aiInsight?: CourseDetailAIInsight }) {
 const title = aiInsight?.title || "Gia sư Trí tuệ Nova";
 const statusTag = aiInsight?.status_tag || "Online 24/7";
 const summaryText = aiInsight?.summary_text || "Bạn đang duy trì tốc độ ghi nhớ xuất sắc! Bài học tiếp theo chứa các công thức toán học tối ưu, hãy đảm bảo bạn nắm chắc giải thuật trước khi thi.";
 const suggestionText = aiInsight?.suggestion_text || "Xem nhanh biểu đồ đạo hàm trong tài liệu Notebook trước khi vào bài giảng video.";
 const actionLabel = aiInsight?.action_label || "Mở khung chat Gia sư Nova";

 return (
 <div className="bg-[#FEFCF9] rounded-xl border border-[#E8E2D9] p-5 relative overflow-hidden transition-all duration-300 hover:border-[#B8B0A3]">

 <div className="flex items-center justify-between mb-4">
 <div className="flex items-center gap-2">
 <div className="w-8 h-8 rounded-lg bg-[#2C3039] text-white flex items-center justify-center font-bold text-xs font-[family-name:var(--font-playfair-display)]">
 AI
 </div>
 <span className="text-xs sm:text-sm font-bold text-[#2C3039]">{title}</span>
 </div>
 <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white text-[11px] font-bold text-[#2C3039] border border-[#E8E2D9]">
 <span>{statusTag}</span>
 </div>
 </div>

 <p className="text-xs sm:text-[13px] text-[#4A4F5C] leading-relaxed font-normal">
 {summaryText}
 </p>

 {suggestionText && (
 <div className="mt-3 p-3 rounded-lg bg-white border border-[#E8E2D9] text-xs text-[#2C3039] flex items-start gap-2.5">
 <div>
 <span className="font-bold text-[#C0392B] block mb-0.5">Gợi ý ôn luyện từ AI:</span>
 <span className="text-[#8A8478] leading-relaxed">{suggestionText}</span>
 </div>
 </div>
 )}

 <button
 type="button"
 onClick={() => {
 window.dispatchEvent(
 new CustomEvent("open-ai-tutor-chat", {
 detail: {
 initialQuery: "Chào Nova, hãy hướng dẫn và giải thích cho tôi các công thức toán học tối ưu trong bài học tiếp theo (RMSprop & Adam Optimizer) nhé!",
 autoSend: true,
 },
 })
 );
 }}
 className="w-full mt-4 py-2.5 rounded-lg text-xs font-bold text-white bg-[#C0392B] hover:bg-[#A93226] transition-all cursor-pointer text-center block"
 >
 {actionLabel}
 </button>
 </div>
 );
}

function ResourcesCard({ resources = [] }: { resources?: CourseDetailResourceItem[] }) {
 const defaultResources: CourseDetailResourceItem[] = [
 { id: "1", title: "Source Code & Notebooks (PyTorch 2.0)", type: "zip", size: "45.8 MB", url: "#" },
 { id: "2", title: "Tài liệu Stanford CS231n Deep Learning", type: "pdf", size: "Tham khảo", url: "#" },
 { id: "3", title: "Phòng thảo luận Discord chuyên đề AI", type: "chat", size: "1,248 Members", url: "#" },
 ];

 const displayList = resources && resources.length > 0 ? resources : defaultResources;

 const handleResourceClick = (res: CourseDetailResourceItem) => {
 alert(`Đang kích hoạt tải/kết nối tới tài liệu: "${res.title}"...`);
 };

 return (
 <div className="bg-white rounded-xl border border-[#E8E2D9] p-5 hover:border-[#B8B0A3] transition-all">
 <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E8E2D9]">
 <h3 className="text-xs font-bold text-[#8A8478] uppercase tracking-wider">
 Tài Liệu & Học Liệu Hỗ Trợ
 </h3>
 <span className="text-[11px] text-[#B8B0A3] font-bold">{displayList.length} files</span>
 </div>

 <div className="space-y-2.5">
 {displayList.map((res, idx) => (
 <button
 key={res.id || idx}
 type="button"
 onClick={() => handleResourceClick(res)}
 className="w-full text-left p-3 rounded-lg border border-[#E8E2D9] hover:border-[#2C3039] hover:bg-[#F5F0E8] transition-all duration-150 flex items-center justify-between gap-3 group cursor-pointer"
 >
 <div className="flex items-center gap-3 min-w-0">
 <span className="text-xs font-bold text-[#2C3039] bg-white px-2 py-1 rounded border border-[#E8E2D9] uppercase w-10 text-center">
 {res.type || "DOC"}
 </span>
 <div className="min-w-0">
 <span className="text-xs font-bold text-[#2C3039] truncate block transition-colors">
 {res.title}
 </span>
 {res.size && (
 <span className="text-[11px] text-[#8A8478] font-normal">
 {res.size}
 </span>
 )}
 </div>
 </div>
 <span className="text-xs font-bold text-[#8A8478] group-hover:text-[#2C3039]">
 Tải về
 </span>
 </button>
 ))}
 </div>
 </div>
 );
}

import { VerifiedTeacherBadge } from "@/src/shared/components/VerifiedTeacherBadge";
import { Avatar } from "@/src/shared/components/ui/Avatar";

function InstructorCard({ instructor }: { instructor?: CourseDetailInstructor & { is_verified?: boolean; avatar_url?: string } }) {
 const name = instructor?.name || "TS. Nguyễn Ngọc Phong";
 const role = instructor?.role || "Chuyên gia Kiến trúc Trí tuệ Nhân tạo";
 const bio = instructor?.bio || "Hơn 12 năm kinh nghiệm thiết kế mô hình AI và dẫn dắt các dự án điện toán đám mây thế hệ mới tại các học viện công nghệ hàng đầu.";
 const isVerified = instructor?.is_verified ?? true;
 const avatarSrc = instructor?.avatar_url || (instructor as any)?.avatar || null;

 return (
 <div className="bg-white rounded-xl border border-[#E8E2D9] p-5 flex flex-col items-center text-center relative overflow-hidden group hover:border-[#B8B0A3] transition-all">
 <div className="relative z-10 mb-3 mt-3">
 <Avatar
 src={avatarSrc}
 fallback={name}
 size="xl"
 className="w-20 h-20 text-xl font-bold border border-[#E8E2D9] bg-[#F5F0E8] text-[#2C3039]"
 />
 </div>

 <span className="text-[11px] font-bold text-[#2C3039] bg-[#F5F0E8] px-2.5 py-0.5 rounded-full border border-[#E8E2D9] mb-2">
 Giảng viên Chủ trì
 </span>

 <div className="flex items-center gap-1 mb-1">
 <h3 className="text-base font-bold text-[#2C3039] font-[family-name:var(--font-playfair-display)]">{name}</h3>
 <VerifiedTeacherBadge isVerified={isVerified} size="sm" />
 </div>
 <p className="text-xs text-[#8A8478] font-bold mb-3">{role}</p>
 <p className="text-xs text-[#4A4F5C] leading-relaxed max-w-xs font-normal mb-5 border-t border-[#E8E2D9] pt-4">
 {bio}
 </p>

 <button
 type="button"
 onClick={() => alert(`Đang kết nối tới trang hồ sơ cá nhân và lịch trực giảng chi tiết của ${name}...`)}
 className="w-full py-2.5 rounded-lg text-xs font-bold text-[#2C3039] bg-white hover:bg-[#F5F0E8] border border-[#E8E2D9] hover:border-[#B8B0A3] transition-all cursor-pointer"
 >
 Xem hồ sơ giảng viên
 </button>
 </div>
 );
}

function EnrollCard({ price, courseId }: { price?: number, courseId?: string | number }) {
 const router = useRouter();
 
 return (
 <div className="bg-white rounded-xl border border-[#E8E2D9] p-5 hover:border-[#B8B0A3] transition-all duration-300">
 <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-[#E8E2D9]">
 <div>
 <span className="text-xs font-bold text-[#C0392B] uppercase tracking-wider block">Phí Đăng Ký</span>
 <h3 className="text-2xl font-bold text-[#2C3039] mt-1 font-[family-name:var(--font-playfair-display)]">
 {Number(price) === 0 ? 'Miễn phí' : `${Number(price).toLocaleString()} VND`}
 </h3>
 </div>
 </div>
 <p className="text-xs text-[#8A8478] mb-5 leading-relaxed">
 Đăng ký khóa học để kích hoạt Trợ lý Trí tuệ AI Nova và theo dõi lộ trình học tập cá nhân hóa.
 </p>
 <button 
 type="button"
 onClick={() => router.push(`/checkout?courseId=${courseId}`)}
 className="w-full py-3 rounded-lg text-sm font-bold text-white bg-[#C0392B] hover:bg-[#A93226] transition-all flex justify-center items-center gap-2 cursor-pointer"
 >
 <span>Đăng ký ngay</span>
 </button>
 </div>
 );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export interface CourseSidebarProps {
 progress?: CourseDetailProgressCard;
 aiInsight?: CourseDetailAIInsight;
 instructor?: CourseDetailInstructor;
 resources?: CourseDetailResourceItem[];
 isEnrolled?: boolean;
 price?: number;
 courseId?: string | number;
}

export function CourseSidebar({ progress, aiInsight, instructor, resources, isEnrolled, price, courseId }: CourseSidebarProps) {
 return (
 <aside className="w-full lg:w-[330px] xl:w-[360px] shrink-0 flex flex-col gap-6">
 {isEnrolled !== false ? (
 <>
 <ProgressCard progress={progress} />
 <AiInsightCard aiInsight={aiInsight} />
 </>
 ) : (
 <EnrollCard price={price} courseId={courseId} />
 )}
 <ResourcesCard resources={resources} />
 <InstructorCard instructor={instructor} />
 </aside>
 );
}
