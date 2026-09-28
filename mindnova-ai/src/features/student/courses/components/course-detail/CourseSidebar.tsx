"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, FileArchive, FileText, Link2, MessageCircle, Video, Sparkles } from "lucide-react";
import { StudentRefundModal } from "../StudentRefundModal";
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
 <div className="bg-white rounded-xl border border-slate-200 p-5 text-sm text-slate-500">
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
 <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-slate-400 transition-all duration-300">
 <div className="flex items-center justify-between gap-2 mb-3">
 <div>
 <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Tiến độ khóa học</span>
 <h3 className="text-2xl font-semibold text-slate-900 mt-1">{percentage}% Hoàn thành</h3>
 </div>
 <span className="text-[11px] font-bold text-slate-900 bg-emerald-50 px-2.5 py-1 rounded-md border border-slate-900/20">
 {statusTag}
 </span>
 </div>

 <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden p-0 border border-slate-200 mt-4">
 <div 
 className="h-full bg-slate-900 rounded-full transition-all duration-1000" 
 style={{ width: `${percentage}%` }} 
 />
 </div>

 <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200 text-xs font-medium text-slate-500">
 <span className="flex items-center gap-1.5 text-slate-900">
 <span className="font-semibold text-slate-500">Thời gian:</span>
 <span>{timeLeft.replace(" thời lượng còn lại", "")}</span>
 </span>
 <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
 {completed}/{total} Bài
 </span>
 </div>
 </div>
 );
}

function AiInsightCard({ aiInsight }: { aiInsight?: CourseDetailAIInsight }) {
 if (!aiInsight) {
 return (
 <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 text-sm text-slate-500">
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
 <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 relative overflow-hidden transition-all duration-300 hover:border-slate-400">

 <div className="flex items-center justify-between mb-4">
 <div className="flex items-center gap-2">
 <div className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center">
 <Sparkles size={18} className="text-white" />
 </div>
 <span className="text-xs sm:text-sm font-bold text-slate-900">{title}</span>
 </div>
 <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white text-[11px] font-bold text-slate-900 border border-slate-200">
 <span>{statusTag}</span>
 </div>
 </div>

 <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed font-normal">
 {summaryText}
 </p>

 {suggestionText && (
 <div className="mt-3 p-3 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 flex items-start gap-2.5">
 <div>
 <span className="font-bold text-blue-500 block mb-0.5">Gợi ý ôn luyện từ AI:</span>
 <span className="text-slate-500 leading-relaxed">{suggestionText}</span>
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
 className="w-full mt-4 py-2.5 rounded-lg text-xs font-bold text-white bg-blue-500 hover:bg-blue-600 transition-all cursor-pointer text-center block"
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
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-400 transition-all duration-300">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
        <h3 className="text-xs font-bold text-blue-500 uppercase tracking-wider block">
          Tài Liệu & Học Liệu
        </h3>
        <span className="text-[11px] font-medium bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md">
          {displayList.length} files
        </span>
      </div>

      <div className="space-y-1">
        {displayList.length === 0 && (
          <p className="text-xs text-slate-500 px-1">Chưa có tài liệu hỗ trợ.</p>
        )}
        {displayList.map((res, idx) => (
          <button
            key={res.id || idx}
            type="button"
            onClick={() => handleResourceClick(res)}
            className="w-full text-left p-2.5 rounded-md hover:bg-slate-50 transition-colors flex items-center justify-between gap-3 group cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-8 h-8 rounded-md bg-slate-100 text-slate-500 group-hover:text-blue-500 group-hover:bg-blue-50 flex items-center justify-center shrink-0 transition-colors">
                <ResourceTypeIcon type={res.type} title={res.title} />
              </span>
              <div className="min-w-0">
                <span className="text-xs font-medium text-slate-900 truncate block group-hover:text-blue-500 transition-colors">
                  {res.title}
                </span>
                {res.size && (
                  <span className="text-[11px] text-slate-400 font-normal block mt-0.5">
                    {res.size}
                  </span>
                )}
              </div>
            </div>
            <span className="text-[11px] font-medium text-slate-400 group-hover:text-blue-500 inline-flex items-center gap-1 shrink-0 transition-colors">
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
 <div className="bg-white rounded-xl border border-slate-200 p-5 text-sm text-slate-500 text-center">
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
 <div className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-400 transition-all">
 <div className="flex items-start gap-4 mb-4">
 <Avatar
 src={avatarSrc}
 fallback={name}
 size="lg"
 className="w-14 h-14 text-lg font-bold bg-blue-50 text-blue-600"
 />
 <div>
 <div className="flex items-center gap-1.5 mb-1">
 <h3 className="text-base font-semibold text-slate-900">{name}</h3>
 <VerifiedTeacherBadge isVerified={isVerified} size="sm" />
 </div>
 <p className="text-xs text-slate-500 font-medium mb-1.5">{role}</p>
 </div>
 </div>
 
 <p className="text-xs text-slate-500 leading-relaxed mb-4">
 {bio}
 </p>

 <button
 type="button"
 onClick={() => toast(`Đang kết nối tới trang hồ sơ cá nhân và lịch trực giảng chi tiết của ${name}...`)}
 className="w-full py-2.5 rounded-lg text-xs font-semibold text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
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
 <div className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-400 transition-all duration-300">
 <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-200">
 <div>
 <span className="text-xs font-bold text-blue-500 uppercase tracking-wider block">Phí Đăng Ký</span>
 <h3 className="text-2xl font-semibold text-slate-900 mt-1">
 {Number(price) === 0 ? 'Miễn phí' : `${Number(price).toLocaleString()} VND`}
 </h3>
 </div>
 </div>
 <p className="text-xs text-slate-500 mb-5 leading-relaxed">
 Đăng ký khóa học để kích hoạt Trợ lý Trí tuệ AI Nova và theo dõi lộ trình học tập cá nhân hóa.
 </p>
 <button 
 type="button"
 onClick={() => setIsCheckoutModalOpen(true)}
 className="w-full py-3 rounded-lg text-sm font-bold text-white bg-blue-500 hover:bg-blue-600 transition-all flex justify-center items-center gap-2 cursor-pointer"
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
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);

  return (
    <aside className="w-full lg:w-[330px] xl:w-[360px] shrink-0 flex flex-col gap-6">
      {isEnrolled !== false ? (
        <>
          <ProgressCard progress={progress} />
          <AiInsightCard aiInsight={aiInsight} />
          <button 
             onClick={() => setIsRefundModalOpen(true)}
             className="w-full py-2.5 rounded-lg text-xs font-semibold text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors cursor-pointer text-center"
          >
             Yêu cầu hoàn tiền
          </button>
          {courseId && (
            <StudentRefundModal 
               isOpen={isRefundModalOpen}
               onClose={() => setIsRefundModalOpen(false)}
               courseId={courseId}
            />
          )}
        </>
      ) : (
 <EnrollCard price={price} courseId={courseId} />
 )}
 <ResourcesCard resources={resources} />
 <InstructorCard instructor={instructor} />
 </aside>
 );
}
