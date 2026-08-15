"use client";

import React from "react";
import { useRouter } from "next/navigation";
import type { 
  CourseDetailProgressCard, 
  CourseDetailAIInsight, 
  CourseDetailInstructor, 
  CourseDetailResourceItem 
} from "../../types";

// ─── Icons ────────────────────────────────────────────────────────────────────
function ClockIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="text-[#5052EE]" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" className="text-[#9333EA]" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" fill="currentColor" />
    </svg>
  );
}

function FileIcon({ type }: { type: string }) {
  if (type === "zip") {
    return (
      <span className="w-9 h-9 rounded-xl bg-[#FFF8EB] text-[#D97706] border border-[#D97706]/20 flex items-center justify-center font-bold text-[11px] shrink-0">
        ZIP
      </span>
    );
  }
  if (type === "chat" || type === "discord") {
    return (
      <span className="w-9 h-9 rounded-xl bg-[#EEF2FF] text-[#5052EE] border border-[#5052EE]/20 flex items-center justify-center font-bold text-[11px] shrink-0">
        CHAT
      </span>
    );
  }
  return (
    <span className="w-9 h-9 rounded-xl bg-[#E0F2FE] text-[#0284C7] border border-[#0284C7]/20 flex items-center justify-center font-bold text-[11px] shrink-0">
      DOC
    </span>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function ProgressCard({ progress }: { progress?: CourseDetailProgressCard }) {
  const percentage = progress?.progress_percentage ?? 65;
  const completed = progress?.completed_lessons_count ?? 14;
  const total = progress?.total_lessons_count ?? 22;
  const timeLeft = progress?.time_left_text ?? "8h 15m thời lượng còn lại";
  const statusTag = progress?.status_tag ?? "Vượt chỉ tiêu +15%";

  return (
    <div className="bg-white rounded-2xl border border-[#EAEAF4] p-5 shadow-2xs hover:shadow-sm transition-all duration-300">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div>
          <span className="text-xs font-semibold text-[#5052EE] uppercase tracking-wider block">Tiến độ khóa học</span>
          <h3 className="text-2xl font-bold text-[#1A1A2E] mt-0.5">{percentage}% Hoàn thành</h3>
        </div>
        <span className="text-[11px] font-medium text-[#10B981] bg-[#EAF8F5] px-2.5 py-1 rounded-full border border-[#10B981]/20">
          {statusTag}
        </span>
      </div>

      <div className="w-full h-2.5 bg-[#F4F5FC] rounded-full overflow-hidden p-0.5 border border-[#EAEAF4]">
        <div 
          className="h-full bg-gradient-to-r from-[#4CD7F6] via-[#6B6BFF] to-[#10B981] rounded-full transition-all duration-1000 shadow-2xs" 
          style={{ width: `${percentage}%` }} 
        />
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#F0F0F8] text-xs font-medium text-[#64647A]">
        <span className="flex items-center gap-1.5 text-[#1A1A2E]">
          <ClockIcon />
          <span>{timeLeft}</span>
        </span>
        <span className="font-semibold text-[#5052EE] bg-[#EEF2FF] px-2.5 py-0.5 rounded-lg border border-[#5052EE]/25">
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
  const actionLabel = aiInsight?.action_label || "Mở khung chat Gia sư Nova ➔";

  return (
    <div className="bg-gradient-to-br from-[#F5F3FF]/90 via-white to-[#EEF2FF]/85 rounded-2xl border border-[#9333EA]/30 p-5 shadow-[0_6px_25px_rgba(147,51,234,0.07)] relative overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(147,51,234,0.12)]">
      <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-[#9333EA]/10 blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#F3E8FF] text-[#9333EA] flex items-center justify-center shadow-2xs border border-[#9333EA]/20">
            <SparklesIcon />
          </div>
          <span className="text-xs sm:text-sm font-bold text-[#1A1A2E]">{title}</span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/95 text-[11px] font-medium text-[#10B981] border border-[#10B981]/20 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
          <span className="w-2 h-2 rounded-full bg-[#10B981] absolute" />
          <span>{statusTag}</span>
        </div>
      </div>

      <p className="text-xs sm:text-[13px] text-[#4B5563] leading-relaxed font-normal">
        {summaryText}
      </p>

      {suggestionText && (
        <div className="mt-3 p-3 rounded-xl bg-white/95 border border-[#6B6BFF]/25 text-xs text-[#1A1A2E] flex items-start gap-2.5 shadow-2xs">
          <span className="text-base leading-none mt-0.5">💡</span>
          <div>
            <span className="font-semibold text-[#5052EE] block mb-0.5">Gợi ý ôn luyện từ AI:</span>
            <span className="text-[#64647A] leading-relaxed">{suggestionText}</span>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          window.dispatchEvent(
            new CustomEvent("open-ai-tutor-chat", {
              detail: {
                initialQuery: "Chào Nova, hãy hướng dẫn và giải thích cho tôi các công thức toán học tối ưu trong bài học tiếp theo (RMSprop & Adam Optimizer) nhé! 💡",
                autoSend: true,
              },
            })
          );
        }}
        className="w-full mt-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#9333EA] via-[#6B6BFF] to-[#5052EE] hover:brightness-110 transition-all shadow-2xs cursor-pointer text-center block"
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
    alert(`📥 Đang kích hoạt tải/kết nối tới tài liệu: "${res.title}"...`);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#EAEAF4] p-5 shadow-2xs">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold text-[#5052EE] uppercase tracking-wider">
          📁 Tài Liệu & Học Liệu Hỗ Trợ
        </h3>
        <span className="text-[11px] text-[#7878A0]">{displayList.length} files</span>
      </div>

      <div className="space-y-2.5">
        {displayList.map((res, idx) => (
          <button
            key={res.id || idx}
            type="button"
            onClick={() => handleResourceClick(res)}
            className="w-full text-left p-3 rounded-xl border border-[#EAEAF4] hover:border-[#6B6BFF]/35 hover:bg-[#EEF2FF]/40 transition-all duration-150 flex items-center justify-between gap-3 group cursor-pointer shadow-2xs"
          >
            <div className="flex items-center gap-3 min-w-0">
              <FileIcon type={res.type || "doc"} />
              <div className="min-w-0">
                <span className="text-xs font-semibold text-[#1A1A2E] truncate block group-hover:text-[#5052EE] transition-colors">
                  {res.title}
                </span>
                {res.size && (
                  <span className="text-[11px] text-[#7878A0] font-normal">
                    Dung lượng / Thông tin: {res.size}
                  </span>
                )}
              </div>
            </div>
            <span className="w-7 h-7 rounded-lg bg-[#F8FAFC] border border-[#EAEAF4] group-hover:bg-[#5052EE] group-hover:text-white group-hover:border-[#5052EE] flex items-center justify-center text-[#64647A] text-xs transition-all shrink-0">
              ⬇
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function InstructorCard({ instructor }: { instructor?: CourseDetailInstructor }) {
  const name = instructor?.name || "TS. Nguyễn Ngọc Phong";
  const role = instructor?.role || "Chuyên gia Kiến trúc Trí tuệ Nhân tạo";
  const bio = instructor?.bio || "Hơn 12 năm kinh nghiệm thiết kế mô hình AI và dẫn dắt các dự án điện toán đám mây thế hệ mới tại các học viện công nghệ hàng đầu.";

  return (
    <div className="bg-white rounded-2xl border border-[#EAEAF4] p-5 shadow-2xs flex flex-col items-center text-center relative overflow-hidden group hover:border-[#6B6BFF]/30 transition-all">
      <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-r from-[#EEF2FF] via-[#E0F2FE] to-[#EEF2FF] border-b border-[#EAEAF4]" />

      <div className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-tr from-[#5052EE] to-[#4CD7F6] p-1 shadow-md mb-3 mt-3">
        <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-bold text-xl text-[#5052EE]">
          NP
        </div>
      </div>

      <span className="text-[11px] font-medium text-[#5052EE] bg-[#EEF2FF] px-2.5 py-0.5 rounded-full border border-[#5052EE]/20 mb-1">
        Giảng viên Chủ trì • Chuyên gia AI
      </span>

      <h3 className="text-base font-bold text-[#1A1A2E]">{name}</h3>
      <p className="text-xs text-[#0D9488] font-semibold mb-2">{role}</p>
      <p className="text-xs text-[#64647A] leading-relaxed max-w-xs font-normal mb-4">
        {bio}
      </p>

      <button
        type="button"
        onClick={() => alert(`👨‍🏫 Đang kết nối tới trang hồ sơ cá nhân và lịch trực giảng chi tiết của ${name}...`)}
        className="w-full py-2 rounded-xl text-xs font-semibold text-[#5052EE] bg-[#EEF2FF]/80 hover:bg-[#EEF2FF] border border-[#5052EE]/20 transition-all cursor-pointer shadow-2xs"
      >
        Xem hồ sơ giảng viên ↗
      </button>
    </div>
  );
}

function EnrollCard({ price, courseId }: { price?: number, courseId?: string | number }) {
  const router = useRouter();
  
  return (
    <div className="bg-white rounded-2xl border border-[#EAEAF4] p-5 shadow-2xs hover:shadow-sm transition-all duration-300">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div>
          <span className="text-xs font-semibold text-[#10B981] uppercase tracking-wider block">Phí Đăng Ký</span>
          <h3 className="text-2xl font-bold text-[#1A1A2E] mt-0.5">{Number(price) === 0 ? 'Miễn phí' : `${Number(price).toLocaleString()} VND`}</h3>
        </div>
      </div>
      <p className="text-xs text-[#64647A] mb-4 leading-relaxed">
        Đăng ký khóa học để kích hoạt Gia sư Trí tuệ AI Nova và theo dõi lộ trình học tập cá nhân hóa.
      </p>
      <button 
        type="button"
        onClick={() => router.push(`/checkout?courseId=${courseId}`)}
        className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#4648D4] via-[#5052EE] to-[#0D9488] shadow-[0_4px_14px_rgba(80,82,238,0.3)] hover:shadow-[0_6px_20px_rgba(80,82,238,0.45)] hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 cursor-pointer"
      >
        <span>Đăng ký ngay</span>
        <span>➔</span>
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
    <aside className="w-full lg:w-[330px] xl:w-[360px] shrink-0 flex flex-col gap-5">
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
