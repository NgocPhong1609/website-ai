"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, FileArchive, FileText, Link2, MessageCircle, Video, Sparkles } from "lucide-react";
import type { 
 CourseDetailProgressCard, 
 CourseDetailAIInsight, 
 CourseDetailInstructor, 
 CourseDetailResourceItem 
} from "../../types";

// ─── Sub-components ───────────────────────────────────────────────────────────
function ProgressCard({ progress }: { progress?: CourseDetailProgressCard }) {
 if (!progress) {
 return (
 <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 text-sm text-[#64748B]">
 Chưa có dữ liệu tiến độ cho khóa học này.
 </div>
 );
 }
 const percentage = progress.progress_percentage ?? 0;
 const completed = progress.completed_lessons_count ?? 0;
 const total = progress.total_lessons_count ?? 0;
 const timeLeft = progress.time_left_text ?? "";
 const statusTag = progress.status_tag ?? "";

 return (
 <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm hover:border-[#94A3B8] transition-all duration-300">
 <div className="flex items-center justify-between gap-2 mb-3">
 <div>
 <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">Tiến độ khóa học</span>
 <h3 className="text-2xl font-semibold text-[#0F172A] mt-1">{percentage}% Hoàn thành</h3>
 </div>
 <span className="text-[11px] font-bold text-[#0F172A] bg-[#E8F6F3] px-2.5 py-1 rounded-md border border-[#0F172A]/20">
 {statusTag}
 </span>
 </div>

 <div className="w-full h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden p-0 border border-[#E2E8F0] mt-4">
 <div 
 className="h-full bg-[#0F172A] rounded-full transition-all duration-1000" 
 style={{ width: `${percentage}%` }} 
 />
 </div>

 <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#E2E8F0] text-xs font-medium text-[#64748B]">
 <span className="flex items-center gap-1.5 text-[#0F172A]">
 <span className="font-semibold text-[#64748B]">Thời gian:</span>
 <span>{timeLeft.replace(" thời lượng còn lại", "")}</span>
 </span>
 <span className="font-bold text-[#0F172A] bg-[#F1F5F9] px-2.5 py-1 rounded-md border border-[#E2E8F0]">
 {completed}/{total} Bài
 </span>
 </div>
 </div>
 );
}

function AiInsightCard({ aiInsight }: { aiInsight?: CourseDetailAIInsight }) {
 if (!aiInsight) {
 return (
 <div className="bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-5 text-sm text-[#64748B]">
 Chưa có gợi ý AI cho khóa học này.
 </div>
 );
 }
 const title = aiInsight.title || "Gia sư Trí tuệ Nova";
 const statusTag = aiInsight.status_tag || "";
 const summaryText = aiInsight.summary_text || "";
 const suggestionText = aiInsight.suggestion_text || "";
 const actionLabel = aiInsight.action_label || "Mở khung chat Gia sư Nova";

 return (
 <div className="bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-5 relative overflow-hidden transition-all duration-300 hover:border-[#94A3B8]">

 <div className="flex items-center justify-between mb-4">
 <div className="flex items-center gap-2">
 <div className="w-8 h-8 rounded-lg bg-[#3B82F6] text-white flex items-center justify-center">
 <Sparkles size={18} className="text-white" />
 </div>
 <span className="text-xs sm:text-sm font-bold text-[#0F172A]">{title}</span>
 </div>
 <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white text-[11px] font-bold text-[#0F172A] border border-[#E2E8F0]">
 <span>{statusTag}</span>
 </div>
 </div>

 <p className="text-xs sm:text-[13px] text-[#64748B] leading-relaxed font-normal">
 {summaryText}
 </p>

 {suggestionText && (
 <div className="mt-3 p-3 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#0F172A] flex items-start gap-2.5">
 <div>
 <span className="font-bold text-[#3B82F6] block mb-0.5">Gợi ý ôn luyện từ AI:</span>
 <span className="text-[#64748B] leading-relaxed">{suggestionText}</span>
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
 className="w-full mt-4 py-2.5 rounded-lg text-xs font-bold text-white bg-[#3B82F6] hover:bg-[#2563EB] transition-all cursor-pointer text-center block"
 >
 {actionLabel}
 </button>
 </div>
 );
}

function ResourceTypeIcon({ type, title }: { type?: string; title?: string }) {
 const value = `${type || ""} ${title || ""}`.toLowerCase();
 if (value.includes("pdf") || value.includes("doc")) return <FileText size={14} aria-label="Tài liệu" />;
 if (value.includes("zip")) return <FileArchive size={14} aria-label="Tệp nén" />;
 if (value.includes("chat") || value.includes("discord")) return <MessageCircle size={14} aria-label="Thảo luận" />;
 if (value.includes("video")) return <Video size={14} aria-label="Video" />;
 return <Link2 size={14} aria-label="Liên kết" />;
}

function ResourcesCard({ resources = [] }: { resources?: CourseDetailResourceItem[] }) {
  const displayList = resources ?? [];

  const handleResourceClick = (res: CourseDetailResourceItem) => {
    toast(`Đang kích hoạt tải/kết nối tới tài liệu: "${res.title}"...`);
  };

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 hover:border-[#94A3B8] transition-all duration-300">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E2E8F0]">
        <h3 className="text-xs font-bold text-[#3B82F6] uppercase tracking-wider block">
          Tài Liệu & Học Liệu
        </h3>
        <span className="text-[11px] font-medium bg-[#EFF6FF] text-[#2563EB] px-2 py-0.5 rounded-md">
          {displayList.length} files
        </span>
      </div>

      <div className="space-y-1">
        {displayList.length === 0 && (
          <p className="text-xs text-[#64748B] px-1">Chưa có tài liệu hỗ trợ.</p>
        )}
        {displayList.map((res, idx) => (
          <button
            key={res.id || idx}
            type="button"
            onClick={() => handleResourceClick(res)}
            className="w-full text-left p-2.5 rounded-md hover:bg-[#F8FAFC] transition-colors flex items-center justify-between gap-3 group cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-8 h-8 rounded-md bg-[#F1F5F9] text-[#64748B] group-hover:text-[#3B82F6] group-hover:bg-[#EFF6FF] flex items-center justify-center shrink-0 transition-colors">
                <ResourceTypeIcon type={res.type} title={res.title} />
              </span>
              <div className="min-w-0">
                <span className="text-xs font-medium text-[#0F172A] truncate block group-hover:text-[#3B82F6] transition-colors">
                  {res.title}
                </span>
                {res.size && (
                  <span className="text-[11px] text-[#94A3B8] font-normal block mt-0.5">
                    {res.size}
                  </span>
                )}
              </div>
            </div>
            <span className="text-[11px] font-medium text-[#94A3B8] group-hover:text-[#3B82F6] inline-flex items-center gap-1 shrink-0 transition-colors">
              <Download size={14} aria-hidden />
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
import { CheckoutModal } from "@/src/features/student/checkout/components/CheckoutModal";
import toast from "react-hot-toast";

function InstructorCard({ instructor }: { instructor?: CourseDetailInstructor & { is_verified?: boolean; avatar_url?: string } }) {
 if (!instructor?.name) {
 return (
 <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 text-sm text-[#64748B] text-center">
 Chưa có thông tin giảng viên.
 </div>
 );
 }
 const name = instructor.name;
 const role = instructor.role || "Giảng viên";
 const bio = instructor.bio || "";
 const isVerified = instructor.is_verified ?? false;
 const avatarSrc = instructor.avatar_url || (instructor as any)?.avatar || null;

 return (
 <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 hover:border-[#94A3B8] transition-all">
 <div className="flex items-start gap-4 mb-4">
 <Avatar
 src={avatarSrc}
 fallback={name}
 size="lg"
 className="w-14 h-14 text-lg font-bold bg-[#EFF6FF] text-[#2563EB]"
 />
 <div>
 <div className="flex items-center gap-1.5 mb-1">
 <h3 className="text-base font-semibold text-[#0F172A]">{name}</h3>
 <VerifiedTeacherBadge isVerified={isVerified} size="sm" />
 </div>
 <p className="text-xs text-[#64748B] font-medium mb-1.5">{role}</p>
 </div>
 </div>
 
 <p className="text-xs text-[#64748B] leading-relaxed mb-4">
 {bio}
 </p>

 <button
 type="button"
 onClick={() => toast(`Đang kết nối tới trang hồ sơ cá nhân và lịch trực giảng chi tiết của ${name}...`)}
 className="w-full py-2.5 rounded-lg text-xs font-semibold text-[#0F172A] bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] transition-colors cursor-pointer"
 >
 Xem hồ sơ giảng viên
 </button>
 </div>
 );
}

function EnrollCard({ price, courseId }: { price?: number, courseId?: string | number }) {
 const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

 return (
 <>
 <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 hover:border-[#94A3B8] transition-all duration-300">
 <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-[#E2E8F0]">
 <div>
 <span className="text-xs font-bold text-[#3B82F6] uppercase tracking-wider block">Phí Đăng Ký</span>
 <h3 className="text-2xl font-semibold text-[#0F172A] mt-1">
 {Number(price) === 0 ? 'Miễn phí' : `${Number(price).toLocaleString()} VND`}
 </h3>
 </div>
 </div>
 <p className="text-xs text-[#64748B] mb-5 leading-relaxed">
 Đăng ký khóa học để kích hoạt Trợ lý Trí tuệ AI Nova và theo dõi lộ trình học tập cá nhân hóa.
 </p>
 <button 
 type="button"
 onClick={() => setIsCheckoutModalOpen(true)}
 className="w-full py-3 rounded-lg text-sm font-bold text-white bg-[#3B82F6] hover:bg-[#2563EB] transition-all flex justify-center items-center gap-2 cursor-pointer"
 >
 <span>Đăng ký ngay</span>
 </button>
 </div>
 <CheckoutModal 
 isOpen={isCheckoutModalOpen} 
 onClose={() => setIsCheckoutModalOpen(false)} 
 courseId={Number(courseId || 1)} 
 />
 </>
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
