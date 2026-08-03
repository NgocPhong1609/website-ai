

================================================================
File: H:\du_an\website\mindnova-ai\app\(protected)\(instructor)\instructor\analytics\page.tsx
================================================================

import { StudentAnalyticsContainer } from "@/src/components/page/instructor/analytic";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Analytics — MindNova AI",
  description:
    "Phân tích chuyên sâu về lộ trình học tập và tương tác của từng cá nhân.",
};

export default function AnalyticsPage() {
  return <StudentAnalyticsContainer />;
}


================================================================
File: H:\du_an\website\mindnova-ai\app\(protected)\(instructor)\instructor\courses\page.tsx
================================================================

import { CourseManagementContainer } from "@/src/components/page/instructor/management";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Courses — MindNova AI",
  description: "Quản lý toàn bộ khóa học của bạn trên MindNova AI.",
};

export default function CoursesPage() {
  return <CourseManagementContainer />;
}


================================================================
File: H:\du_an\website\mindnova-ai\app\(protected)\(instructor)\instructor\courses\[courseId]\edit\page.tsx
================================================================

import React from "react";
import { Metadata } from "next";
import { EditCourseContainer } from "@/src/components/page/instructor/edit-course";

export const metadata: Metadata = {
  title: "Chỉnh sửa Khóa học — MindNova Instructor Suite",
  description: "Trung tâm tinh chỉnh thông tin cơ bản, cấu trúc chương bài, giá bán và tối ưu SEO cho khóa học bằng AI.",
};

interface EditCoursePageProps {
  params: Promise<{ courseId: string }>;
}

export default async function EditCourseDynamicPage({ params }: EditCoursePageProps) {
  const { courseId } = await params;
  return <EditCourseContainer courseId={courseId || "c1"} />;
}


================================================================
File: H:\du_an\website\mindnova-ai\app\(protected)\(instructor)\instructor\courses\[courseId]\lessons\page.tsx
================================================================

import { LessonManagementContainer } from "@/src/components/page/instructor/lesson-management";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý Bài học — MindNova AI",
  description:
    "Quản lý nội dung và cấu trúc bài giảng cho khóa học của bạn trên MindNova AI.",
};

// Route: /instructor/courses/[courseId]/lessons
export default function LessonsPage() {
  return <LessonManagementContainer />;
}


================================================================
File: H:\du_an\website\mindnova-ai\app\(protected)\(instructor)\instructor\create-course\page.tsx
================================================================

import { CreateCourseContainer } from "@/src/components/page/instructor/create-course";

export default function CreateCoursePage() {
  return <CreateCourseContainer />;
}


================================================================
File: H:\du_an\website\mindnova-ai\app\(protected)\(instructor)\instructor\discussions\page.tsx
================================================================

import { DiscussionReplyContainer } from "@/src/components/page/instructor/discussion";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Phản hồi & Mentoring — MindNova AI",
  description: "Giải đáp thắc mắc và hỗ trợ học viên.",
};

export default function DiscussionsPage() {
  return <DiscussionReplyContainer />;
}


================================================================
File: H:\du_an\website\mindnova-ai\app\(protected)\(instructor)\instructor\edit-course\page.tsx
================================================================

import React from "react";
import { Metadata } from "next";
import { EditCourseContainer } from "@/src/components/page/instructor/edit-course";

export const metadata: Metadata = {
  title: "Chỉnh sửa Khóa học — MindNova Instructor Suite",
  description: "Trung tâm tinh chỉnh thông tin cơ bản, cấu trúc chương bài, giá bán và tối ưu SEO cho khóa học bằng AI.",
};

export default function EditCourseGeneralPage() {
  return <EditCourseContainer courseId="c1" />;
}


================================================================
File: H:\du_an\website\mindnova-ai\app\(protected)\(instructor)\instructor\page.tsx
================================================================

import { CourseManagementContainer } from "@/src/components/page/instructor/management";

export default function InstructorPage() {
  return <CourseManagementContainer />;
}



================================================================
File: H:\du_an\website\mindnova-ai\app\(protected)\(instructor)\instructor\pricing\page.tsx
================================================================

import { PricingContainer } from "@/src/components/page/instructor/pricing";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý Giá & Kiếm tiền — MindNova AI",
  description:
    "Cấu hình mô hình doanh thu, định giá và quản lý chương trình khuyến mãi cho khóa học của bạn.",
};

export default function PricingPage() {
  return <PricingContainer />;
}


================================================================
File: H:\du_an\website\mindnova-ai\app\(protected)\(instructor)\instructor\revenue\history\page.tsx
================================================================

import { TransactionHistoryContainer } from "@/src/components/page/instructor/revenue";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lịch sử Giao dịch — MindNova AI",
  description: "Theo dõi và quản lý mọi dòng tiền từ hoạt động giảng dạy.",
};

export default function TransactionHistoryPage() {
  return <TransactionHistoryContainer />;
}


================================================================
File: H:\du_an\website\mindnova-ai\app\(protected)\(instructor)\instructor\revenue\page.tsx
================================================================

import { RevenueContainer } from "@/src/components/page/instructor/revenue";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Doanh thu & Tài chính — MindNova AI",
  description: "Theo dõi thu nhập và quản lý các giao dịch của bạn.",
};

export default function RevenuePage() {
  return <RevenueContainer />;
}


================================================================
File: H:\du_an\website\mindnova-ai\app\(protected)\(instructor)\instructor\revenue\sales-report\page.tsx
================================================================

import { SalesReportContainer } from "@/src/components/page/instructor/revenue/SalesReportContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detailed Sales Analytics — MindNova AI",
  description: "Detailed sales reports and analytics.",
};

export default function SalesReportPage() {
  return <SalesReportContainer />;
}


================================================================
File: H:\du_an\website\mindnova-ai\app\(protected)\(instructor)\instructor\students\page.tsx
================================================================

import { StudentManagementContainer } from "@/src/components/page/instructor/student-management";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý Học viên — MindNova AI",
  description:
    "Theo dõi, hỗ trợ và tương tác với cộng đồng học viên MindNova AI.",
};

export default function StudentsPage() {
  return <StudentManagementContainer />;
}


================================================================
File: H:\du_an\website\mindnova-ai\app\(protected)\(instructor)\layout.tsx
================================================================

import { InstructorSidebar, InstructorTopbar } from "@/src/components/page/instructor/management";
import { SidebarProvider } from "@/src/components/ui";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý Khóa học — MindNova AI Instructor",
  description:
    "Bảng điều khiển giảng viên MindNova AI — quản lý khóa học, học viên và doanh thu.",
};

export default function InstructorLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen overflow-hidden bg-[#F4F4F8]">
        <InstructorSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <InstructorTopbar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}


================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\analytic\AIInsightsTab.tsx
================================================================

"use client";

import React, { useState } from "react";
import { twMerge } from "tailwind-merge";

export interface AIInsightItem {
  id: string;
  lessonTitle: string;
  timestamp: string;
  issueType: "drop_off" | "rewind_spike" | "quiz_failure";
  metricDetail: string;
  aiSuggestion: string;
  priority: "high" | "medium" | "low";
  isResolved: boolean;
}

const INITIAL_INSIGHTS: AIInsightItem[] = [
  {
    id: "ins-1",
    lessonTitle: "Lesson 2.1: Building Type-Safe Server Actions",
    timestamp: "04:12",
    issueType: "rewind_spike",
    metricDetail: "42% học viên tua lại tại mốc 4:12 (+340% so với mức thông thường).",
    aiSuggestion: "Học viên đang gặp trở ngại khi xử lý dữ liệu phức tạp JavaScript Dates qua ranh giới RSC. Đề xuất bổ sung sơ đồ kiến trúc trực quan hoặc bài đọc AI giải thích sâu ở đoạn này.",
    priority: "high",
    isResolved: false,
  },
  {
    id: "ins-2",
    lessonTitle: "Lesson 3.2: Production Challenge (Drizzle ORM)",
    timestamp: "12:05",
    issueType: "quiz_failure",
    metricDetail: "68% tỷ lệ chọn sai tại Câu hỏi số #3 (Cú pháp Connection Pooling).",
    aiSuggestion: "Cách đặt câu hỏi ở phương án gây nhiễu số 2 chưa rõ ràng về nghĩa. Sử dụng công cụ AI Rapid-Review để tối ưu hóa và tạo lại thang điểm chính xác hơn.",
    priority: "high",
    isResolved: false,
  },
  {
    id: "ins-3",
    lessonTitle: "Lesson 1.2: Configuring App Router Routing",
    timestamp: "18:40",
    issueType: "drop_off",
    metricDetail: "22% học viên dừng phát video ở đoạn giải thích dòng lệnh CLI kéo dài.",
    aiSuggestion: "Chia chuỗi video dài này thành 2 video ngắn 5 phút hoặc chuyển thành bài giảng dạng Tài liệu văn bản tương tác có thể sao chép code.",
    priority: "medium",
    isResolved: false,
  },
];

export function AIInsightsTab() {
  const [insights, setInsights] = useState<AIInsightItem[]>(INITIAL_INSIGHTS);
  const [filter, setFilter] = useState<"all" | "high" | "unresolved">("unresolved");

  const resolveItem = (id: string) => {
    setInsights((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isResolved: true } : item))
    );
  };

  const filtered = insights.filter((i) => {
    if (filter === "unresolved") return !i.isResolved;
    if (filter === "high") return i.priority === "high";
    return true;
  });

  return (
    <div className="w-full flex flex-col gap-5 animate-fadeIn">
      {/* Header Summary Box */}
      <div className="p-6 rounded-2xl bg-[#4F46E5] text-white border border-indigo-400 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl font-black border border-white/20 shrink-0">
            🧠
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-black text-white">Đề Xuất Cải Tiến Nội Dung AI Chuyên Sâu</h3>
              <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-400/30 text-white border border-emerald-300/40">
                Live Behavioral Telemetry
              </span>
            </div>
            <p className="text-xs text-indigo-100 max-w-xl mt-1">
              Hệ thống trí tuệ nhân tạo liên tục giám sát tỷ lệ rời bài, tầng suất tua lại và kết quả kiểm tra để phát hiện và cảnh báo điểm nghẽn cổ chai của học viên.
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/10 border border-white/10 text-xs font-bold shrink-0">
          <button
            type="button"
            onClick={() => setFilter("unresolved")}
            className={twMerge(
              "px-3.5 py-1.5 rounded-lg transition-all cursor-pointer",
              filter === "unresolved" ? "bg-white text-indigo-900 shadow-2xs font-extrabold" : "text-white/80 hover:bg-white/10"
            )}
          >
            Cần Xử Lý ({insights.filter((i) => !i.isResolved).length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("high")}
            className={twMerge(
              "px-3.5 py-1.5 rounded-lg transition-all cursor-pointer",
              filter === "high" ? "bg-rose-500 text-white font-extrabold shadow-2xs" : "text-white/80 hover:bg-white/10"
            )}
          >
            Ưu Tiên Cao ({insights.filter((i) => i.priority === "high").length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={twMerge(
              "px-3.5 py-1.5 rounded-lg transition-all cursor-pointer",
              filter === "all" ? "bg-white text-indigo-900 shadow-2xs font-extrabold" : "text-white/80 hover:bg-white/10"
            )}
          >
            Tất cả ({insights.length})
          </button>
        </div>
      </div>

      {/* Insights List Grid */}
      {filtered.length === 0 ? (
        <div className="p-14 text-center rounded-2xl bg-white border border-gray-200 shadow-2xs flex flex-col items-center gap-2 text-gray-500">
          <span className="text-4xl">🎉</span>
          <p className="text-sm font-black text-gray-900">Tất cả các điểm nghẽn bài học đều đã được giải quyết!</p>
          <p className="text-xs max-w-md">Các chỉ số tương tác bài giảng của bạn đang ở tình trạng tối ưu hóa xuất sắc.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={twMerge(
                "p-5 rounded-2xl bg-white border transition-all duration-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5",
                item.priority === "high" && !item.isResolved
                  ? "border-rose-200 bg-rose-50/10"
                  : "border-gray-200",
                item.isResolved && "opacity-60 bg-gray-50/50 border-gray-200"
              )}
            >
              <div className="flex flex-col gap-2.5 flex-1">
                {/* Title & Badge */}
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={twMerge(
                      "px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border",
                      item.issueType === "rewind_spike" && "bg-amber-50 text-amber-800 border-amber-200",
                      item.issueType === "quiz_failure" && "bg-rose-50 text-rose-800 border-rose-200",
                      item.issueType === "drop_off" && "bg-purple-50 text-purple-800 border-purple-200"
                    )}
                  >
                    {item.issueType === "rewind_spike" && "🔄 Tần suất tua lại cao"}
                    {item.issueType === "quiz_failure" && "⚠️ Khó khăn làm bài"}
                    {item.issueType === "drop_off" && "📉 Nguy cơ rời bài"}
                  </span>

                  <span className="text-sm font-extrabold text-gray-900">{item.lessonTitle}</span>
                  <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-mono text-xs font-black border border-gray-200">
                    ⏱️ {item.timestamp}
                  </span>
                </div>

                {/* Telemetry metric explanation */}
                <p className="text-xs font-bold text-gray-600 pl-1">
                  📊 <span className="text-gray-900 font-black">{item.metricDetail}</span>
                </p>

                {/* AI Rationale & Remediation Suggestion */}
                <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs font-medium text-indigo-950 leading-relaxed flex items-start gap-2.5">
                  <span className="text-base shrink-0">💡</span>
                  <div>
                    <strong className="font-extrabold text-[#4F46E5]">Đề xuất từ AI MindNova: </strong>
                    {item.aiSuggestion}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex sm:flex-col gap-2 shrink-0 w-full md:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => alert(`Đang điều hướng đến studio chỉnh sửa tại mốc ${item.timestamp}...`)}
                  className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-extrabold shadow-2xs transition-all whitespace-nowrap cursor-pointer"
                >
                  ⚡ Tối Ưu Hóa Ngay ➔
                </button>
                {!item.isResolved && (
                  <button
                    type="button"
                    onClick={() => resolveItem(item.id)}
                    className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 font-bold text-xs transition-all border border-gray-200 hover:border-emerald-300 cursor-pointer"
                  >
                    ✓ Đánh Dấu Đã Cải Tiến
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\analytic\icons.tsx
================================================================

// ─── Analytics Icons ──────────────────────────────────────────────────────────

const B = {
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor" as const,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

export function SearchIcon({ size = 15 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

export function BellIcon({ size = 18 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={1.8}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

export function HelpCircleIcon({ size = 18 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={1.8}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

export function SettingsIcon({ size = 18 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={1.8}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

export function ClockIcon({ size = 20 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={1.8}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export function AwardIcon({ size = 20 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={1.8}>
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  );
}

export function SparklesIcon({ size = 16 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2}>
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  );
}

export function MailIcon({ size = 14 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

export function AlignLeftIcon({ size = 14 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2}>
      <line x1="17" y1="10" x2="3" y2="10" />
      <line x1="21" y1="6" x2="3" y2="6" />
      <line x1="21" y1="14" x2="3" y2="14" />
      <line x1="17" y1="18" x2="3" y2="18" />
    </svg>
  );
}

export function ChevronDownIcon({ size = 14 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function BrainIcon({ size = 16 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2}>
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
    </svg>
  );
}

export function DatabaseIcon({ size = 16 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}

export function CodeIcon({ size = 16 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2}>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

export function CheckCircleIcon({ size = 16 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}


================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\analytic\index.ts
================================================================

// ─── Analytics Feature Public API ─────────────────────────────────────────────

export { StudentAnalyticsContainer } from "./StudentAnalyticsContainer";
export { AIInsightsTab } from "./AIInsightsTab";


================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\analytic\StudentAnalyticsContainer.tsx
================================================================

"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { AIInsightsTab } from "./AIInsightsTab";
import {
  ClockIcon,
  AwardIcon,
  SparklesIcon,
  MailIcon,
  AlignLeftIcon,
  ChevronDownIcon,
  BrainIcon,
  DatabaseIcon,
  CodeIcon,
  CheckCircleIcon,
} from "./icons";

function StudentNavigationTabs({ active }: { active: "students" | "analytics" }) {
  return (
    <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-gray-200 shadow-2xs w-fit">
      <Link
        href="/instructor/students"
        className={twMerge(
          "px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer",
          active === "students"
            ? "bg-[#4F46E5] text-white shadow-sm"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        )}
      >
        <span>👥 Danh sách &amp; Chăm sóc Học viên</span>
      </Link>

      <Link
        href="/instructor/analytics"
        className={twMerge(
          "px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer",
          active === "analytics"
            ? "bg-[#4F46E5] text-white shadow-sm"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        )}
      >
        <span>📈 Phân tích Tương tác &amp; AI Insights</span>
      </Link>
    </div>
  );
}

function InteractionChart() {
  const bars = [40, 65, 30, 90, 50, 45, 80];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs flex flex-col justify-between h-[270px]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-black text-gray-900">Biểu Đồ Tương Tác Học Tập</h3>
          <p className="text-[11px] text-gray-500 mt-0.5">Tối ưu hóa tần suất hoạt động theo từng ngày trong tuần.</p>
        </div>
        <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 text-xs font-bold text-gray-600 border border-gray-200 hover:text-gray-900 transition-colors">
          <span>7 ngày qua</span>
          <ChevronDownIcon size={12} />
        </button>
      </div>
      <div className="flex-1 flex items-end justify-between gap-3 px-2 pt-2 border-t border-gray-100">
        {bars.map((val, i) => (
          <div key={i} className="w-full flex flex-col items-center gap-2 group">
            <div className="w-full flex justify-center flex-1 items-end">
              <div
                className={twMerge(
                  "w-full max-w-[28px] rounded-t-lg transition-all duration-300",
                  i === 3 ? "bg-[#4F46E5]" : "bg-indigo-100 group-hover:bg-indigo-300"
                )}
                style={{ height: `${val}%` }}
              />
            </div>
            <span className="text-[10px] font-extrabold text-gray-400">
              {["T2", "T3", "T4", "T5", "T6", "T7", "CN"][i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ value, label, icon, isAccent }: { value: string; label: string; icon: React.ReactNode; isAccent?: boolean }) {
  return (
    <div className={twMerge(
      "rounded-2xl border p-4.5 flex flex-col justify-center gap-2 relative overflow-hidden h-[128px] shadow-2xs",
      isAccent ? "bg-indigo-50 border-indigo-200" : "bg-white border-gray-200"
    )}>
      <div className={twMerge(
        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-2xs",
        isAccent ? "bg-white text-[#4F46E5] border-indigo-100" : "bg-gray-50 text-emerald-600 border-gray-100"
      )}>
        {icon}
      </div>
      <div>
        <span className="text-xl font-black text-gray-900 block leading-tight">{value}</span>
        <span className="text-xs font-bold text-gray-500 mt-0.5 block">{label}</span>
      </div>
    </div>
  );
}

function NewStudentsList() {
  const students = [
    { name: "An Nguyễn", email: "an.nguyen@example.com", initial: "AN", color: "bg-indigo-600", status: "ĐANG HOẠT ĐỘNG", statusColor: "text-emerald-700 bg-emerald-50 border-emerald-200", course: "AI Mastery & LLMs for Beginners" },
    { name: "Lê Huy", email: "huy.le@example.com", initial: "LH", color: "bg-teal-600", status: "TẠM VẮNG MẶT", statusColor: "text-amber-700 bg-amber-50 border-amber-200", course: "Fullstack Next.js 16 & Turbo Pro" },
    { name: "Phan Anh Tấn", email: "tan.phan@example.com", initial: "PT", color: "bg-purple-600", status: "ĐANG HOẠT ĐỘNG", statusColor: "text-emerald-700 bg-emerald-50 border-emerald-200", course: "Python Data Science Pro" }
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs flex flex-col overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-gray-100">
        <div>
          <h3 className="text-sm font-black text-gray-900">Danh Sách Học Viên Mới Gia Nhập</h3>
          <p className="text-xs text-gray-500 mt-0.5">Theo dõi hồ sơ và tiến độ chi tiết của học viên mới ghi danh trong tháng.</p>
        </div>
        <Link href="/instructor/students" className="text-xs font-bold text-[#4F46E5] hover:underline focus:outline-none">
          Xem Toàn Bộ Học Viên ➔
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr className="bg-gray-50/70 border-b border-gray-200 text-[11px] font-black text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-3.5">Học Viên Ghi Danh</th>
              <th className="px-6 py-3.5">Trạng Thái Tương Tác</th>
              <th className="px-6 py-3.5">Khóa Học Gia Nhập</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs font-medium">
            {students.map((s, i) => (
              <tr key={i} className="hover:bg-gray-50/80 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={twMerge("w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-xs", s.color)}>
                      {s.initial}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-extrabold text-gray-900">{s.name}</span>
                      <span className="text-[11px] text-gray-400">{s.email}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={twMerge("px-2.5 py-1 rounded-md text-[10px] font-bold uppercase block w-fit border", s.statusColor)}>
                    {s.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-extrabold text-gray-800">
                  {s.course}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CourseProgressCard({ title, level, progress, icon, isComplete }: { title: string; level: string; progress: number; icon: React.ReactNode; isComplete?: boolean }) {
  return (
    <div className="rounded-xl border border-gray-200 p-3.5 flex flex-col gap-2.5 bg-white shadow-2xs">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={twMerge("w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border", isComplete ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-indigo-50 text-[#4F46E5] border-indigo-100")}>
            {icon}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-gray-900 truncate">{title}</span>
            <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Cấp độ: {level}</span>
          </div>
        </div>
        <span className="text-xs font-extrabold text-[#4F46E5] shrink-0">{progress}%</span>
      </div>

      <div className="flex flex-col gap-1 mt-0.5">
        <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
          <div className={twMerge("h-full rounded-full transition-all duration-500", progress === 100 ? "bg-emerald-500" : "bg-[#4F46E5]")} style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between items-center text-[10px] text-gray-400 font-semibold">
          {isComplete ? (
            <span className="text-emerald-600 flex items-center gap-1">✓ Hoàn thành: 15 Th05</span>
          ) : (
            <span>Học lần cuối: 2 giờ trước</span>
          )}
        </div>
      </div>
    </div>
  );
}

function StudentProfileSidebar() {
  return (
    <aside className="w-[340px] shrink-0 bg-white border-l border-gray-200 flex flex-col justify-between h-full min-h-[calc(100vh-64px)] shadow-xs">
      <div className="overflow-y-auto pb-6 flex-1">
        {/* Profile Header */}
        <div className="pt-8 pb-6 px-6 flex flex-col items-center bg-gray-50/70 border-b border-gray-100">
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-sm overflow-hidden bg-slate-200">
              <Image
                src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop"
                alt="Avatar"
                width={80}
                height={80}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white shadow-2xs" />
          </div>
          <h2 className="text-base font-black text-gray-900">An Nguyễn</h2>
          <span className="text-xs text-gray-500 mt-0.5 mb-3">an.nguyen@example.com</span>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase">Hoạt động</span>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-[10px] font-bold uppercase">Học viên VIP</span>
          </div>
        </div>

        {/* Courses Section */}
        <div className="p-5 flex flex-col gap-3.5">
          <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider">Khóa học đang theo học</h3>
          <div className="flex flex-col gap-3">
            <CourseProgressCard title="AI Foundations & Neural Nets" level="Trung cấp" progress={85} icon={<BrainIcon size={16} />} />
            <CourseProgressCard title="Data Science Professional" level="Nâng cao" progress={42} icon={<DatabaseIcon size={16} />} />
            <CourseProgressCard title="Python for Beginners" level="Cơ bản" progress={100} icon={<CodeIcon size={16} />} isComplete />
          </div>
        </div>
      </div>

      {/* Action footer */}
      <div className="p-4 bg-white border-t border-gray-200 flex items-center gap-3 shrink-0">
        <button type="button" className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 transition-all cursor-pointer">
          <MailIcon size={14} />
          <span>Gửi Email</span>
        </button>
        <button type="button" className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-extrabold text-white bg-[#4F46E5] hover:bg-[#4338CA] shadow-2xs transition-all cursor-pointer">
          <AlignLeftIcon size={14} />
          <span>Ghi chú AI</span>
        </button>
      </div>
    </aside>
  );
}

export function StudentAnalyticsContainer() {
  const [activeTab, setActiveTab] = useState<"analytics" | "ai_insights">("analytics");

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F4F8] font-sans">
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col gap-6 pb-16">
            <StudentNavigationTabs active="analytics" />

            {/* Header & Tab Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
              <div>
                <h1 className="text-xl font-black text-gray-900 tracking-tight">Quản lý &amp; Phân tích Học viên</h1>
                <p className="text-xs text-gray-500 mt-1">
                  Kiểm soát mức độ tương tác, lộ trình tiếp thu kiến thức và chẩn đoán các điểm nghẽn bài học với AI.
                </p>
              </div>

              <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white border border-gray-200 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setActiveTab("analytics")}
                  className={twMerge(
                    "px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer",
                    activeTab === "analytics" ? "bg-[#4F46E5] text-white shadow-2xs" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  Báo cáo Tương tác &amp; Tiến độ
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("ai_insights")}
                  className={twMerge(
                    "px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5",
                    activeTab === "ai_insights" ? "bg-[#4F46E5] text-white shadow-2xs" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  <span>Phân tích AI Chuyên sâu</span>
                </button>
              </div>
            </div>

            {activeTab === "ai_insights" ? (
              <AIInsightsTab />
            ) : (
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] gap-5">
                  <InteractionChart />
                  <div className="flex flex-col gap-3.5 justify-between">
                    <StatCard value="124 Giờ" label="Tổng Thời Gian Học Tập" icon={<ClockIcon size={20} />} isAccent />
                    <StatCard value="12 Chứng Chỉ" label="Hoàn Thành Xuất Sắc" icon={<AwardIcon size={20} />} />
                  </div>
                </div>

                <NewStudentsList />
              </div>
            )}
          </div>
        </main>

        {activeTab === "analytics" && (
          <div className="hidden xl:block">
            <StudentProfileSidebar />
          </div>
        )}
      </div>
    </div>
  );
}


================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\create-course\AIOutlineModal.tsx
================================================================

"use client";

import React, { useState, useCallback } from "react";
import { twMerge } from "tailwind-merge";

export interface OutlineChapter {
  title: string;
  lessons: string[];
}

export interface GeneratedOutline {
  chapters: OutlineChapter[];
}

export interface AIOutlineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply?: (outline: GeneratedOutline) => void;
}

type WizardStep = "params" | "preview";
type GenerationState = "idle" | "loading" | "done" | "error";

export function AIOutlineModal({ isOpen, onClose, onApply }: AIOutlineModalProps) {
  const [step, setStep] = useState<WizardStep>("params");
  const [genState, setGenState] = useState<GenerationState>("idle");

  // Step 1: Course Parameters (Section 2.1)
  const [topic, setTopic] = useState("Fullstack Next.js & Serverless Architectures");
  const [targetAudience, setTargetAudience] = useState("Intermediate Web Developers & Bootcamp Graduates");
  const [skillLevel, setSkillLevel] = useState("Intermediate to Advanced");
  const [methodology, setMethodology] = useState("80/20 Practical Application vs Theoretical Concepts");

  // Step 2: Generated Skeleton Tree
  const [outline, setOutline] = useState<GeneratedOutline>({ chapters: [] });
  const [editingChapterIdx, setEditingChapterIdx] = useState<number | null>(null);

  const handleGenerate = useCallback(() => {
    if (!topic.trim()) return;
    setGenState("loading");
    setStep("preview");

    setTimeout(() => {
      const is8020 = methodology.includes("80/20");
      setOutline({
        chapters: [
          {
            title: `Module 1: ${topic} Foundations & Architecture`,
            lessons: [
              "Why this technology matters: Core Paradigms (20% Theory)",
              "Hands-On Lab: Initializing Type-Safe Project Environment (80% Practice)",
              "Live Build: Setting up OAuth Authentication Providers",
            ],
          },
          {
            title: "Module 2: Advanced Edge Caching & Database Connectivity",
            lessons: [
              "RSC vs Client Component Execution Boundaries",
              "Hands-On Workshop: Optimistic UI & React Server Actions",
              "Production Challenge: Connecting PostgreSQL with Drizzle ORM",
            ],
          },
          {
            title: "Module 3: Enterprise Deployment & Observability",
            lessons: [
              "Automated CI/CD Pipelines with GitHub & Vercel",
              "Real-World Case Study: Diagnosing Memory Leaks in Server Actions",
              "Final Capstone Project Architecture Submission",
            ],
          },
        ],
      });
      setGenState("done");
    }, 1800);
  }, [topic, methodology]);

  const handleApply = () => {
    if (onApply && outline.chapters.length > 0) {
      onApply(outline);
    }
    onClose();
  };

  const updateLessonTitle = (cIdx: number, lIdx: number, newTitle: string) => {
    const updated = { ...outline };
    updated.chapters[cIdx].lessons[lIdx] = newTitle;
    setOutline(updated);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl border border-[#EAEAF4] shadow-[0_25px_80px_rgba(0,0,0,0.25)] max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#1A1A2E] to-[#2B2D62] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-[#6B6BFF] flex items-center justify-center text-xl font-bold shadow-md">
              🪄
            </span>
            <div>
              <h3 className="text-base font-black text-white">AI Teaching Co-Creator Wizard (Section 2.1)</h3>
              <p className="text-xs text-indigo-200">Architect structured course curriculums based on domain best practices.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white font-black text-lg p-2 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
          {step === "params" ? (
            <div className="flex flex-col gap-5 animate-fadeIn">
              <div>
                <label className="block text-xs font-black text-[#1A1A2E] uppercase tracking-wide mb-1.5">
                  Course Topic &amp; Core Domain
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-[#D5D5FF] text-[#1A1A2E] font-bold text-sm focus:outline-none focus:border-[#6B6BFF] transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-[#1A1A2E] uppercase tracking-wide mb-1.5">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-gray-300 text-xs font-bold text-[#1A1A2E] focus:outline-none focus:border-[#6B6BFF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-[#1A1A2E] uppercase tracking-wide mb-1.5">
                    Target Skill Level
                  </label>
                  <select
                    value={skillLevel}
                    onChange={(e) => setSkillLevel(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-gray-300 text-xs font-bold text-[#1A1A2E] bg-white focus:outline-none focus:border-[#6B6BFF]"
                  >
                    <option value="Beginner">Beginner (Foundations)</option>
                    <option value="Intermediate to Advanced">Intermediate to Advanced</option>
                    <option value="Executive Mastery">Executive Mastery</option>
                  </select>
                </div>
              </div>

              {/* Teaching Methodology Selection */}
              <div>
                <label className="block text-xs font-black text-[#1A1A2E] uppercase tracking-wide mb-2">
                  Pedagogical Methodology (Architecture Strategy)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMethodology("80/20 Practical Application vs Theoretical Concepts")}
                    className={twMerge(
                      "p-4 rounded-2xl border-2 text-left transition-all",
                      methodology.includes("80/20")
                        ? "border-[#6B6BFF] bg-[#F0F0FF] text-[#4648D4] shadow-xs font-bold"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    )}
                  >
                    <p className="text-xs font-extrabold">🚀 80/20 Practical vs Theory (Recommended)</p>
                    <p className="text-[11px] font-semibold text-gray-500 mt-1">
                      Heavily project-based syllabus; 80% hands-on building &amp; capstone application, 20% fundamental core concepts.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethodology("Theoretical Deep-Dive & Academic Analysis")}
                    className={twMerge(
                      "p-4 rounded-2xl border-2 text-left transition-all",
                      !methodology.includes("80/20")
                        ? "border-[#6B6BFF] bg-[#F0F0FF] text-[#4648D4] shadow-xs font-bold"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    )}
                  >
                    <p className="text-xs font-extrabold">🎓 Comprehensive Academic Mastery</p>
                    <p className="text-[11px] font-semibold text-gray-500 mt-1">
                      Deep theoretical immersion with research case studies, algorithmic proofing, and formal architectural defense.
                    </p>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Step 2: Skeleton Tree Preview & Edit */
            <div className="flex flex-col gap-6 animate-fadeIn">
              {genState === "loading" ? (
                <div className="py-20 flex flex-col items-center justify-center gap-4 text-center">
                  <div className="w-10 h-10 border-4 border-[#6B6BFF] border-t-transparent rounded-full animate-spin" />
                  <h4 className="text-sm font-extrabold text-[#1A1A2E]">Architecting course outline via best practices...</h4>
                  <p className="text-xs text-gray-500 max-w-sm">
                    Structuring chapters with a strict 80/20 ratio of practical application to theoretical paradigms.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-emerald-600 px-3 py-1 bg-emerald-50 rounded-xl border border-emerald-200">
                      ✓ AI Curriculum Tree Generated
                    </span>
                    <button
                      type="button"
                      onClick={() => setStep("params")}
                      className="text-xs font-bold text-indigo-600 hover:underline"
                    >
                      ← Modify Parameters
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 font-semibold">
                    Review and manually tweak the generated chapters and lesson titles before populating your live builder.
                  </p>

                  <div className="flex flex-col gap-4 max-h-[360px] overflow-y-auto pr-2">
                    {outline.chapters.map((ch, cIdx) => (
                      <div key={cIdx} className="p-4 rounded-2xl bg-[#F8F9FF] border border-[#EAEAF4] flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <h5 className="text-sm font-black text-[#1A1A2E]">
                            {cIdx + 1}. {ch.title}
                          </h5>
                          <span className="text-[10px] font-bold text-gray-400 uppercase">{ch.lessons.length} Lessons</span>
                        </div>

                        <ul className="flex flex-col gap-2">
                          {ch.lessons.map((lessonTitle, lIdx) => (
                            <li key={lIdx} className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-gray-200 shadow-2xs">
                              <span className="text-xs text-indigo-500 font-extrabold">🔹</span>
                              <input
                                type="text"
                                value={lessonTitle}
                                onChange={(e) => updateLessonTitle(cIdx, lIdx, e.target.value)}
                                className="flex-1 text-xs font-bold text-gray-800 bg-transparent focus:outline-none focus:text-[#6B6BFF]"
                              />
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 px-6 bg-[#F8F9FF] border-t border-[#EAEAF4] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-extrabold text-gray-500 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>

          {step === "params" ? (
            <button
              type="button"
              onClick={handleGenerate}
              className="px-6 py-2.5 bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] text-white text-xs font-extrabold rounded-xl shadow-md hover:opacity-95 transition-all flex items-center gap-2"
            >
              <span>✨ Generate Curriculum Tree</span>
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={genState === "loading"}
                className="px-4 py-2 bg-white border border-[#D5D5FF] text-[#4648D4] text-xs font-extrabold rounded-xl hover:bg-[#FAF8FF] transition-all disabled:opacity-50"
              >
                🔄 Regenerate
              </button>
              <button
                type="button"
                onClick={handleApply}
                disabled={genState === "loading"}
                className="px-6 py-2.5 bg-[#1A1A2E] text-white text-xs font-black rounded-xl shadow-md hover:bg-[#4648D4] transition-all disabled:opacity-50"
              >
                ✓ Apply To Curriculum Builder
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\create-course\AITipCard.tsx
================================================================

import React from "react";
import { SparklesIcon, PlusIcon } from "./icons";
import { AI_TIP } from "./constants";

export function AITipCard() {
  return (
    <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-3.5 flex flex-col gap-2 shadow-2xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[#4F46E5]">
          <span className="animate-pulse">
            <SparklesIcon size={14} />
          </span>
          <span className="text-xs font-black uppercase tracking-wider">Gợi ý từ AI MindNova</span>
        </div>

        <button
          type="button"
          onClick={() => alert("Đang tạo lời khuyên mới từ AI...")}
          aria-label="Tạo gợi ý mới"
          className="w-6 h-6 rounded-lg flex items-center justify-center text-indigo-400 hover:text-[#4F46E5] hover:bg-indigo-100/60 transition-all cursor-pointer"
        >
          <PlusIcon size={12} />
        </button>
      </div>

      <p className="text-[11px] font-medium text-gray-600 leading-relaxed italic">
        {AI_TIP}
      </p>
    </div>
  );
}


================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\create-course\constants\index.ts
================================================================

import type { Step } from "../types";

// ─── Create Course Constants ──────────────────────────────────────────────────

export const STEPS: Step[] = [
  { id: 1, label: "Thông tin chính" },
  { id: 2, label: "Nội dung bài học" },
  { id: 3, label: "Cài đặt & Giá" },
];

export const COURSE_FIELDS = [
  "Lập trình & Công nghệ",
  "Trí tuệ nhân tạo",
  "Khoa học dữ liệu",
  "Thiết kế UI/UX",
  "Marketing số",
  "Kinh doanh",
  "Ngoại ngữ",
  "Khác",
] as const;

export const MAX_TITLE_LENGTH = 100;
export const MAX_DESCRIPTION_LENGTH = 500;

export const AI_TIP =
  '"Một khóa học thành công thường bắt đầu bằng tiêu đề rõ ràng, chứa từ khóa chuyên môn và ảnh bìa sáng tạo."';


================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\create-course\CourseStudio.tsx
================================================================

"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { StepIndicator } from "./StepIndicator";
import { Step1BasicInfo } from "./Step1BasicInfo";
import { Step2CourseStructure } from "./Step2CourseStructure";
import { Step3SettingsPrice } from "./Step3SettingsPrice";
import { AIOutlineModal } from "./AIOutlineModal";
import type { CourseBasicInfo, StepKey } from "./types";
import {
  SparklesIcon,
  BookOpenIcon,
  TagIcon,
  SettingsIcon,
  CheckIcon,
  SaveIcon,
  EyeIcon,
  TrashIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
} from "./icons";

interface CourseStudioProps {
  mode: "create" | "edit";
  courseId?: string;
}

export function CourseStudio({ mode, courseId = "c1" }: CourseStudioProps) {
  const [step, setStep] = useState<StepKey | 4>(1); // 4 = Advanced settings in edit mode
  const [isOutlineOpen, setIsOutlineOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [status, setStatus] = useState<"published" | "draft">("published");

  const [formData, setFormData] = useState<CourseBasicInfo>({
    title: mode === "edit" ? "Mastering Next.js 16 & AI Integration Professional" : "",
    description:
      mode === "edit"
        ? "Khóa học chuyên sâu hướng dẫn từ A-Z kiến trúc Fullstack hiện đại cùng tích hợp LLM Agent vào thực nghiệm."
        : "",
    field: "Trí tuệ nhân tạo",
    difficulty: "beginner",
    thumbnailFile: null,
    thumbnailPreview: mode === "edit" ? "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop" : null,
    outline: [],
  });

  const handleChange = useCallback(
    <K extends keyof CourseBasicInfo>(key: K, value: CourseBasicInfo[K]) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleApplyOutline = (chapters: any[]) => {
    handleChange("outline", chapters);
  };

  const handleNext = () => {
    if (step < 3) setStep((s) => ((s as number) + 1) as StepKey);
    else alert("Khóa học đã được hoàn tất trên hệ thống MindNova AI!");
  };

  const handleBack = () => {
    if ((step as number) > 1) setStep((s) => ((s as number) - 1) as StepKey);
  };

  const handleSaveEdit = () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 600);
  };

  const createStepLabels: Record<1 | 2 | 3, string> = {
    1: "Thông tin cơ bản",
    2: "Nội dung khóa học",
    3: "Cài đặt & Giá",
  };

  return (
    <div className="min-h-screen bg-[#F4F4F8] flex flex-col font-sans pb-16">
      {/* ── Header Bar ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 px-6 py-4 shadow-2xs">
        <div className="max-w-6xl mx-auto flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link
                href="/instructor/courses"
                className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors shadow-2xs"
                title="Quay lại danh sách khóa học"
              >
                <ArrowLeftIcon size={18} />
              </Link>
              <div>
                <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-gray-500 mb-0.5 font-semibold">
                  <Link href="/instructor/courses" className="hover:text-[#4F46E5] transition-colors">
                    Khóa học của tôi
                  </Link>
                  <span>/</span>
                  <span className="text-[#4F46E5] font-extrabold">
                    {mode === "create" ? "Studio Tạo Khóa Học AI" : `Chỉnh sửa khóa học #${courseId}`}
                  </span>
                </nav>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-lg font-black text-gray-900 tracking-tight truncate max-w-md md:max-w-xl">
                    {mode === "create" ? createStepLabels[step as 1 | 2 | 3] || "Studio Khóa học" : formData.title}
                  </h1>
                  {mode === "edit" && (
                    <span
                      className={twMerge(
                        "px-2.5 py-0.5 rounded-md text-[11px] font-extrabold tracking-wider uppercase border",
                        status === "published"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      )}
                    >
                      {status === "published" ? "Published" : "Draft Mode"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {mode === "edit" ? (
                <>
                  <Link
                    href={`/courses/${courseId}`}
                    target="_blank"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-gray-700 bg-gray-50 border border-gray-200 hover:bg-white hover:border-[#4F46E5] transition-all shadow-2xs"
                  >
                    <EyeIcon size={14} />
                    <span className="hidden sm:inline">Xem trước</span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    disabled={isSaving}
                    className={twMerge(
                      "flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold text-white transition-all shadow-sm cursor-pointer",
                      saveSuccess
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : "bg-[#4F46E5] hover:bg-[#4338CA] active:scale-95"
                    )}
                  >
                    {isSaving ? (
                      <span>⏳ Đang lưu...</span>
                    ) : saveSuccess ? (
                      <>
                        <CheckIcon size={14} />
                        <span>Đã lưu thay đổi</span>
                      </>
                    ) : (
                      <>
                        <SaveIcon size={14} />
                        <span>Lưu & Cập nhật</span>
                      </>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    id="btn-save-draft"
                    onClick={() => alert("Đã lưu bản nháp của bạn!")}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-gray-700 border border-gray-200 bg-white hover:bg-gray-50 transition-all cursor-pointer shadow-2xs"
                  >
                    💾 Lưu nháp
                  </button>
                  <button
                    type="button"
                    id="btn-finish-publish"
                    onClick={() => setIsOutlineOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-[#4F46E5] hover:bg-[#4338CA] shadow-2xs transition-all cursor-pointer"
                  >
                    <SparklesIcon size={13} />
                    <span>Sinh đề cương AI</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Navigation Bar / Steps Indicator */}
          {mode === "create" ? (
            <StepIndicator currentStep={step as StepKey} />
          ) : (
            <div className="flex items-center gap-1.5 p-1.5 bg-gray-50 rounded-2xl border border-gray-200 shadow-2xs overflow-x-auto">
              <button
                type="button"
                onClick={() => setStep(1)}
                className={twMerge(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap shrink-0",
                  step === 1
                    ? "bg-[#4F46E5] text-white shadow-sm"
                    : "text-gray-600 hover:bg-white hover:text-gray-900"
                )}
              >
                <span>📝</span>
                <span>Thông tin tổng quan &amp; SEO</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(2)}
                className={twMerge(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap shrink-0",
                  step === 2
                    ? "bg-[#4F46E5] text-white shadow-sm"
                    : "text-gray-600 hover:bg-white hover:text-gray-900"
                )}
              >
                <BookOpenIcon size={14} />
                <span>Chương trình & Nội dung AI</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className={twMerge(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap shrink-0",
                  step === 3
                    ? "bg-[#4F46E5] text-white shadow-sm"
                    : "text-gray-600 hover:bg-white hover:text-gray-900"
                )}
              >
                <TagIcon size={14} />
                <span>Giá bán & Khuyến mãi</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(4)}
                className={twMerge(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap shrink-0",
                  step === 4
                    ? "bg-[#4F46E5] text-white shadow-sm"
                    : "text-gray-600 hover:bg-white hover:text-gray-900"
                )}
              >
                <SettingsIcon size={14} />
                <span>Cài đặt nâng cao</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ── Studio Workspace Content ────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 pt-8 flex flex-col gap-6">
        {step === 1 && (
          <div className="flex flex-col gap-6">
            <Step1BasicInfo data={formData} onChange={handleChange} />
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-black text-gray-900">Trung tâm Điều hành Chương bài &amp; Video</h2>
                <p className="text-xs text-gray-500 mt-1">
                  Hệ thống hỗ trợ tải lên video hàng loạt (Bulk Uploader), chia chương linh hoạt và tích hợp đề kiểm tra trắc nghiệm sinh tự động từ AI.
                </p>
              </div>
              <Link
                href={`/instructor/courses/${courseId || "new"}/lessons`}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-extrabold text-xs shadow-2xs transition-all shrink-0 cursor-pointer"
              >
                <BookOpenIcon size={15} />
                <span>Mở Studio Quản Lý Bài Giảng &amp; Video ➔</span>
              </Link>
            </div>

            <Step2CourseStructure />
          </div>
        )}

        {step === 3 && (
          <Step3SettingsPrice
            courseTitle={formData.title || "Khóa học chưa đặt tên"}
            thumbnailPreview={formData.thumbnailPreview}
          />
        )}

        {step === 4 && mode === "edit" && (
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs flex flex-col gap-6 max-w-3xl mx-auto w-full animate-fadeIn">
            <div>
              <h2 className="text-base font-black text-gray-900">Cấu hình Quyền học tập</h2>
              <p className="text-xs text-gray-500 mt-0.5">Quản lý cấp chứng chỉ tự động và khóa bình luận diễn đàn.</p>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50">
              <div>
                <span className="block text-xs font-bold text-gray-900">🏆 Cấp Chứng Chỉ Tốt Nghiệp Tự Động (Blockchain ID)</span>
                <span className="text-[11px] text-gray-500">Tự động sinh mã chứng nhận khi học viên đạt trên 80% tiến độ bài giảng</span>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 text-[#4F46E5] rounded focus:ring-[#4F46E5] cursor-pointer" />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50">
              <div>
                <span className="block text-xs font-bold text-gray-900">💬 Hòm thư thảo luận trực tiếp</span>
                <span className="text-[11px] text-gray-500">Cho phép học viên đặt câu hỏi Hỏi-Đáp bên dưới từng bài video</span>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 text-[#4F46E5] rounded focus:ring-[#4F46E5] cursor-pointer" />
            </div>

            <div className="mt-4 pt-6 border-t border-rose-100 flex flex-col gap-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
                <TrashIcon size={14} />
                <span>Khu Vực Nguy Hiểm (Danger Zone)</span>
              </h3>
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="block text-xs font-bold text-rose-950">Xóa vĩnh viễn khóa học này</span>
                  <span className="text-[11px] text-rose-800">Hành động này không thể hoàn tác. Toàn bộ video và dữ liệu bài giảng sẽ bị xóa.</span>
                </div>
                <button
                  type="button"
                  onClick={() => alert("Vui lòng liên hệ Admin hệ thống để thao tác hủy khóa học đang có học viên tham dự.")}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-xs transition-all shrink-0 cursor-pointer"
                >
                  Xóa bài giảng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Mode Wizard Navigation Footer */}
        {mode === "create" && (
          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between bg-white p-5 rounded-2xl shadow-2xs">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 1}
              className="flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-xs font-bold text-gray-700 border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shadow-2xs"
            >
              <span>← Quay lại</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-[#4F46E5] hover:bg-[#4338CA] shadow-2xs transition-all cursor-pointer"
            >
              {step === 3 ? (
                <>
                  <SparklesIcon size={14} />
                  <span>Hoàn tất &amp; Đăng khóa học</span>
                </>
              ) : (
                <>
                  <span>Tiếp theo</span>
                  <ArrowRightIcon size={14} />
                </>
              )}
            </button>
          </div>
        )}
      </main>

      <AIOutlineModal
        isOpen={isOutlineOpen}
        onClose={() => setIsOutlineOpen(false)}
        onApply={handleApplyOutline}
      />
    </div>
  );
}


================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\create-course\CreateCourseContainer.tsx
================================================================

"use client";

import React from "react";
import { CourseStudio } from "./CourseStudio";

export function CreateCourseContainer() {
  return <CourseStudio mode="create" />;
}


================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\create-course\icons.tsx
================================================================

// ─── Create Course — Icons ─────────────────────────────────────────────────────

const BASE = {
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor" as const,
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

export function ImageIcon({ size = 32 }: { size?: number }) {
  return (
    <svg {...BASE} width={size} height={size}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

export function PlusCircleIcon({ size = 16 }: { size?: number }) {
  return (
    <svg {...BASE} width={size} height={size}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}

export function SparklesIcon({ size = 14 }: { size?: number }) {
  return (
    <svg {...BASE} width={size} height={size} strokeWidth={2}>
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  );
}

export function PlusIcon({ size = 14 }: { size?: number }) {
  return (
    <svg {...BASE} width={size} height={size}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export function ArrowRightIcon({ size = 16 }: { size?: number }) {
  return (
    <svg {...BASE} width={size} height={size}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export function HelpCircleIcon({ size = 18 }: { size?: number }) {
  return (
    <svg {...BASE} width={size} height={size}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

export function BellIcon({ size = 18 }: { size?: number }) {
  return (
    <svg {...BASE} width={size} height={size}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

export function CheckIcon({ size = 12 }: { size?: number }) {
  return (
    <svg {...BASE} width={size} height={size} strokeWidth={2.5}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function SaveIcon({ size = 13 }: { size?: number }) {
  return (
    <svg {...BASE} width={size} height={size}>
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}

export function BookOpenIcon({ size = 13 }: { size?: number }) {
  return (
    <svg {...BASE} width={size} height={size}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

export function ChevronDownIcon({ size = 16 }: { size?: number }) {
  return (
    <svg {...BASE} width={size} height={size}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function RobotIcon({ size = 14 }: { size?: number }) {
  return (
    <svg {...BASE} width={size} height={size}>
      <rect x="3" y="8" width="18" height="13" rx="2" />
      <path d="M8 8V6a4 4 0 0 1 8 0v2" />
      <circle cx="9" cy="13" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="13" r="1" fill="currentColor" stroke="none" />
      <path d="M9 17h6" />
    </svg>
  );
}

export function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg {...BASE} width={size} height={size}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function EyeIcon({ size = 16 }: { size?: number }) {
  return (
    <svg {...BASE} width={size} height={size}>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function TrashIcon({ size = 16 }: { size?: number }) {
  return (
    <svg {...BASE} width={size} height={size}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

export function TagIcon({ size = 16 }: { size?: number }) {
  return (
    <svg {...BASE} width={size} height={size}>
      <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
      <path d="M7 7h.01" />
    </svg>
  );
}

export function SettingsIcon({ size = 16 }: { size?: number }) {
  return (
    <svg {...BASE} width={size} height={size}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V15Z" />
    </svg>
  );
}

export function UploadIcon({ size = 16 }: { size?: number }) {
  return (
    <svg {...BASE} width={size} height={size}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

export function ArrowLeftIcon({ size = 16 }: { size?: number }) {
  return (
    <svg {...BASE} width={size} height={size}>
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}



================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\create-course\index.ts
================================================================

export { CreateCourseContainer } from "./CreateCourseContainer";
export { CourseStudio } from "./CourseStudio";
export { Step1BasicInfo } from "./Step1BasicInfo";
export { Step2CourseStructure } from "./Step2CourseStructure";
export { Step3SettingsPrice } from "./Step3SettingsPrice";
export { ThumbnailUploader } from "./ThumbnailUploader";
export { AITipCard } from "./AITipCard";
export { StepIndicator } from "./StepIndicator";
export { AIOutlineModal } from "./AIOutlineModal";


================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\create-course\Step1BasicInfo.tsx
================================================================

"use client";

import React, { useCallback, useState } from "react";
import { twMerge } from "tailwind-merge";
import { ThumbnailUploader } from "./ThumbnailUploader";
import { AITipCard } from "./AITipCard";
import { ChevronDownIcon } from "./icons";
import {
  COURSE_FIELDS,
  MAX_TITLE_LENGTH,
  MAX_DESCRIPTION_LENGTH,
} from "./constants";
import type { CourseBasicInfo, DifficultyLevel } from "./types";

interface CharCountProps {
  current: number;
  max: number;
}

function CharCount({ current, max }: CharCountProps) {
  const isNearLimit = current > max * 0.8;
  return (
    <span
      className={twMerge(
        "text-xs font-mono transition-colors duration-150",
        isNearLimit ? "text-amber-600 font-bold" : "text-gray-400 font-medium",
        current >= max && "text-rose-600 font-bold"
      )}
    >
      {current}/{max}
    </span>
  );
}

interface DifficultyToggleProps {
  value: DifficultyLevel;
  onChange: (v: DifficultyLevel) => void;
}

function DifficultyToggle({ value, onChange }: DifficultyToggleProps) {
  const options: { key: DifficultyLevel; label: string }[] = [
    { key: "beginner", label: "Cơ bản" },
    { key: "advanced", label: "Nâng cao" },
  ];

  return (
    <div className="flex gap-2" role="group" aria-label="Trình độ khóa học">
      {options.map(({ key, label }) => (
        <button
          key={key}
          id={`difficulty-${key}`}
          type="button"
          aria-pressed={value === key}
          onClick={() => onChange(key)}
          className={twMerge(
            "px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer",
            value === key
              ? "border-[#4F46E5] bg-[#4F46E5] text-white shadow-2xs"
              : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-900 hover:bg-gray-50/70"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

interface Step1BasicInfoProps {
  data: CourseBasicInfo;
  onChange: <K extends keyof CourseBasicInfo>(key: K, value: CourseBasicInfo[K]) => void;
}

export function Step1BasicInfo({ data, onChange }: Step1BasicInfoProps) {
  const [aiTip, setAiTip] = useState<string | null>(null);

  const handleThumbnail = useCallback(
    (file: File, preview: string) => {
      onChange("thumbnailFile", file);
      onChange("thumbnailPreview", preview);
    },
    [onChange]
  );

  const handleThumbnailRemove = useCallback(() => {
    onChange("thumbnailFile", null);
    onChange("thumbnailPreview", null);
  }, [onChange]);

  const handleAIOptimize = () => {
    setAiTip(
      "AI gợi ý: Thêm từ khóa 'Agentic Workflow' và 'RAG' vào tiêu đề phụ để gia tăng 35% lưu lượng tìm kiếm tự nhiên (SEO)."
    );
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4 bg-white p-5 rounded-2xl shadow-2xs">
        <div>
          <h2 className="text-base font-black text-gray-900">Thông tin cơ bản khóa học</h2>
          <p className="text-xs text-gray-500 mt-0.5">Cập nhật tiêu đề và mô tả chính hiển thị trên danh mục học viện MindNova.</p>
        </div>
        <button
          type="button"
          onClick={handleAIOptimize}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#EEF2FF] hover:bg-indigo-100 text-[#4F46E5] text-xs font-black transition-all border border-indigo-200 shadow-2xs cursor-pointer"
        >
          <span>✨</span>
          <span>AI Tối ưu hóa</span>
        </button>
      </div>

      {aiTip && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 text-indigo-950 text-xs font-bold flex items-start justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <span className="text-base">🤖</span>
            <span>{aiTip}</span>
          </div>
          <button type="button" onClick={() => setAiTip(null)} className="text-gray-400 hover:text-gray-700 font-extrabold cursor-pointer">✕</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
        {/* Left column: Thumbnail + AI tip */}
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-xs font-black text-gray-900 uppercase tracking-wider">Ảnh bìa khóa học</p>
            <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
              Tải lên hình ảnh đại diện tỷ lệ 4:3 hấp dẫn để thu hút học viên trên sàn MindNova.
            </p>
          </div>

          <ThumbnailUploader
            preview={data.thumbnailPreview}
            onChange={handleThumbnail}
            onRemove={handleThumbnailRemove}
          />

          <AITipCard />
        </div>

        {/* Right column: Text fields */}
        <div className="flex flex-col gap-5 bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
          {/* Course title */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="course-title" className="text-xs font-black text-gray-900 uppercase tracking-wider">
                Tên khóa học <span className="text-rose-500">*</span>
              </label>
              <CharCount current={data.title.length} max={MAX_TITLE_LENGTH} />
            </div>
            <input
              id="course-title"
              type="text"
              value={data.title}
              maxLength={MAX_TITLE_LENGTH}
              placeholder="Ví dụ: Lập trình Trí tuệ Nhân tạo AI Mastery với LLM & RAG 2026..."
              onChange={(e) => onChange("title", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-xs font-bold text-gray-900 placeholder:text-gray-400 placeholder:font-normal bg-gray-50/50 border border-gray-200 focus:outline-none focus:border-[#4F46E5] focus:bg-white transition-all shadow-2xs"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="course-description" className="text-xs font-black text-gray-900 uppercase tracking-wider">
                Mô tả ngắn <span className="text-rose-500">*</span>
              </label>
              <CharCount current={data.description.length} max={MAX_DESCRIPTION_LENGTH} />
            </div>
            <textarea
              id="course-description"
              value={data.description}
              maxLength={MAX_DESCRIPTION_LENGTH}
              rows={4}
              placeholder="Nhập tóm tắt khóa học giúp học viên nhanh chóng nắm bắt được giá trị kiến thức, cơ hội việc làm và mục tiêu đạt được sau tốt nghiệp..."
              onChange={(e) => onChange("description", e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-xs font-medium text-gray-900 placeholder:text-gray-400 placeholder:font-normal bg-gray-50/50 border border-gray-200 focus:outline-none focus:border-[#4F46E5] focus:bg-white transition-all resize-none leading-relaxed shadow-2xs"
            />
          </div>

          {/* Field + Difficulty row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start pt-1">
            {/* Field select */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="course-field" className="text-xs font-black text-gray-900 uppercase tracking-wider">
                Lĩnh vực Chuyên môn
              </label>
              <div className="relative">
                <select
                  id="course-field"
                  value={data.field}
                  onChange={(e) => onChange("field", e.target.value)}
                  className="w-full appearance-none px-4 py-2.5 pr-10 rounded-xl text-xs font-bold text-gray-900 bg-gray-50/50 border border-gray-200 focus:outline-none focus:border-[#4F46E5] focus:bg-white transition-all cursor-pointer shadow-2xs"
                >
                  <option value="" disabled className="text-gray-400 font-normal">
                    -- Chọn lĩnh vực --
                  </option>
                  {COURSE_FIELDS.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-gray-500">
                  <ChevronDownIcon size={14} />
                </div>
              </div>
            </div>

            {/* Difficulty */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-black text-gray-900 uppercase tracking-wider">Trình độ Khóa học</span>
              <DifficultyToggle
                value={data.difficulty}
                onChange={(v) => onChange("difficulty", v)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\create-course\Step2CourseStructure.tsx
================================================================

"use client";

import React, { useState, useCallback, useRef, type DragEvent, type KeyboardEvent } from "react";
import { twMerge } from "tailwind-merge";
import { useCourseStructure, type CoursePublishStatus, type LessonType, type ChapterNode, type LessonNode } from "@/src/hooks/instructor/useCourseStructure";
import { useVideoProcessing, type VideoItem } from "@/src/hooks/instructor/useVideoProcessing";

function GripIcon({ size = 16 }: { size?: number }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="9" cy="6" r="1.5" />
      <circle cx="15" cy="6" r="1.5" />
      <circle cx="9" cy="12" r="1.5" />
      <circle cx="15" cy="12" r="1.5" />
      <circle cx="9" cy="18" r="1.5" />
      <circle cx="15" cy="18" r="1.5" />
    </svg>
  );
}

function VideoIcon({ size = 16 }: { size?: number }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function QuizIcon({ size = 16 }: { size?: number }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="13" height="4" rx="1" />
      <rect x="9" y="10" width="13" height="4" rx="1" />
      <rect x="9" y="18" width="13" height="4" rx="1" />
      <line x1="2" y1="4" x2="7" y2="4" />
      <line x1="2" y1="12" x2="7" y2="12" />
      <line x1="2" y1="20" x2="7" y2="20" />
    </svg>
  );
}

function DocIcon({ size = 16 }: { size?: number }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="16" y2="17" />
    </svg>
  );
}

function PlusIcon({ size = 14 }: { size?: number }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function TrashIcon({ size = 14 }: { size?: number }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

function UploadCloudIcon() {
  return (
    <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.2 15c.7-1.2 1-2.5.7-3.9-.6-2-2.4-3.5-4.4-3.5h-.5C16.3 5.3 14.3 3.6 12 3.6c-3 0-5.5 2.5-5.5 5.5v.5C4.5 9.7 3 11.6 3 13.7c0 2.5 2 4.5 4.5 4.5h13.7" />
      <polyline points="16 16 12 12 8 16" />
      <line x1="12" y1="12" x2="12" y2="21" />
    </svg>
  );
}

function getLessonIcon(type: LessonType) {
  if (type === "video") return <VideoIcon size={14} />;
  if (type === "quiz") return <QuizIcon size={14} />;
  return <DocIcon size={14} />;
}

function getLessonColor(type: LessonType) {
  if (type === "video") return "text-[#4F46E5] bg-indigo-50 border border-indigo-100";
  if (type === "quiz") return "text-emerald-700 bg-emerald-50 border border-emerald-200";
  return "text-amber-700 bg-amber-50 border border-amber-200";
}

function CourseStatusBadge({ status, onStatusChange }: { status: CoursePublishStatus; onStatusChange: (s: CoursePublishStatus) => void }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-black text-gray-500 uppercase tracking-wider">Trang Thái:</span>
      <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 border border-gray-200">
        <button
          type="button"
          onClick={() => onStatusChange("draft")}
          className={twMerge(
            "px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer",
            status === "draft" ? "bg-gray-800 text-white shadow-2xs" : "text-gray-600 hover:text-gray-900"
          )}
        >
          Draft
        </button>
        <button
          type="button"
          onClick={() => onStatusChange("review")}
          className={twMerge(
            "px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer",
            status === "review" ? "bg-amber-500 text-white shadow-2xs" : "text-amber-700 hover:bg-amber-50"
          )}
        >
          Under Review
        </button>
        <button
          type="button"
          onClick={() => onStatusChange("published")}
          className={twMerge(
            "px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer",
            status === "published" ? "bg-emerald-600 text-white shadow-2xs" : "text-emerald-700 hover:bg-emerald-50"
          )}
        >
          Published ✓
        </button>
      </div>
    </div>
  );
}

interface LessonRowProps {
  lesson: LessonNode;
  chapterId: string;
  index: number;
  onUpdate: (chapterId: string, lessonId: string, updates: Partial<LessonNode>) => void;
  onDelete: (chapterId: string, lessonId: string) => void;
  onDragStart: (e: DragEvent, chapterId: string, lessonId: string) => void;
  onDrop: (e: DragEvent, chapterId: string, lessonId: string) => void;
  onDragOver: (e: DragEvent) => void;
}

function LessonRow({ lesson, chapterId, index, onUpdate, onDelete, onDragStart, onDrop, onDragOver }: LessonRowProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(lesson.title);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const commitEdit = () => {
    const trimmed = draft.trim();
    if (trimmed) onUpdate(chapterId, lesson.id, { title: trimmed });
    else setDraft(lesson.title);
    setEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") commitEdit();
    if (e.key === "Escape") {
      setDraft(lesson.title);
      setEditing(false);
    }
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, chapterId, lesson.id)}
      onDrop={(e) => {
        setIsDragOver(false);
        onDrop(e, chapterId, lesson.id);
      }}
      onDragOver={(e) => {
        onDragOver(e);
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      className={twMerge(
        "group flex items-center justify-between gap-3 px-4 py-3 rounded-xl border transition-all duration-150 select-none",
        isDragOver
          ? "border-[#4F46E5] bg-indigo-50 shadow-2xs"
          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/70"
      )}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span className="text-gray-300 group-hover:text-gray-500 cursor-grab active:cursor-grabbing transition-colors shrink-0" title="Kéo thả để sắp xếp">
          <GripIcon size={16} />
        </span>

        <span className={twMerge("shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold shadow-2xs", getLessonColor(lesson.type))}>
          {getLessonIcon(lesson.type)}
        </span>

        <div className="flex-1 min-w-0">
          {editing ? (
            <input
              ref={inputRef}
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={handleKeyDown}
              className="w-full text-xs font-bold text-gray-900 bg-white border-2 border-[#4F46E5] rounded-lg px-2 py-1 focus:outline-none"
            />
          ) : (
            <div className="flex items-center gap-2 truncate">
              <span className="text-xs font-bold text-gray-900 truncate">
                {index + 1}. {lesson.title}
              </span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 border border-gray-200 shrink-0">
                {lesson.type === "video" ? "Video" : lesson.type === "quiz" ? "Trắc nghiệm" : "Tài liệu"}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {!editing && (
          <button
            type="button"
            onClick={() => {
              setEditing(true);
              setTimeout(() => inputRef.current?.focus(), 50);
            }}
            className="px-2.5 py-1 text-xs font-extrabold text-[#4F46E5] bg-indigo-50 hover:bg-indigo-100 rounded-md transition-all cursor-pointer border border-indigo-200"
          >
            Sửa tên
          </button>
        )}
        <button
          type="button"
          onClick={() => onDelete(chapterId, lesson.id)}
          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
          title="Xóa bài học"
        >
          <TrashIcon size={15} />
        </button>
      </div>
    </div>
  );
}

export function Step2CourseStructure() {
  const {
    chapters,
    status,
    versionMeta,
    canSubmitForReview,
    validationError,
    setStatus,
    addChapter,
    updateChapterTitle,
    deleteChapter,
    addLesson,
    updateLesson,
    deleteLesson,
    moveLesson,
    createVersionSnapshot,
  } = useCourseStructure("draft");

  const { videos, isProcessingAny, uploadError, handleDropFiles, removeVideo } = useVideoProcessing();
  const [dragSource, setDragSource] = useState<{ chapterId: string; lessonId: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragStart = useCallback((e: DragEvent, chapterId: string, lessonId: string) => {
    setDragSource({ chapterId, lessonId });
  }, []);

  const handleDrop = useCallback((e: DragEvent, targetChapterId: string, targetLessonId: string) => {
    e.preventDefault();
    if (!dragSource) return;
    moveLesson(dragSource.chapterId, targetChapterId, dragSource.lessonId);
    setDragSource(null);
  }, [dragSource, moveLesson]);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
  }, []);

  const onDropZone = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      handleDropFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="w-full flex flex-col gap-8 animate-fadeIn">
      {/* Top Banner: Status & Architecture Builder */}
      <div className="w-full p-5 rounded-2xl bg-white border border-gray-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 className="text-base font-black text-gray-900">Xây Dựng Khai Triển Chương Trình Học</h3>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-indigo-50 text-[#4F46E5] border border-indigo-200">
              {versionMeta.version}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Kéo thả bài học giữa các chuyên đề linh hoạt. Điều kiện xuất bản đòi hỏi tối thiểu $\ge 1$ chuyên đề và $\ge 1$ bài giảng.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 shrink-0">
          <CourseStatusBadge status={status} onStatusChange={setStatus} />
          {status === "published" && (
            <button
              type="button"
              onClick={createVersionSnapshot}
              className="px-4 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl text-xs font-extrabold shadow-2xs transition-all cursor-pointer"
            >
              ⚡ Phát hành phiên bản mới
            </button>
          )}
        </div>
      </div>

      {validationError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs flex items-center gap-3">
          <span className="text-base">🛑</span>
          <span>{validationError}</span>
        </div>
      )}

      {/* Bulk Video Uploader Zone */}
      <div className="w-full flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h4 className="text-sm font-black text-gray-900 flex items-center gap-2">
            <span>🎬 Bulk Video Uploader (Tải Lên Nhiều Video MP4/MOV)</span>
            {isProcessingAny && (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                ⚙️ Đang mã hóa video ngầm trong hệ thống...
              </span>
            )}
          </h4>
          <span className="text-xs text-gray-500 font-medium">
            Giảng viên có thể rời trang trong khi quá trình xử lý diễn ra
          </span>
        </div>

        {uploadError && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
            ⚠️ {uploadError}
          </div>
        )}

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDropZone}
          onClick={() => fileInputRef.current?.click()}
          className="w-full p-9 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50/60 hover:bg-indigo-50/30 hover:border-[#4F46E5] cursor-pointer transition-all flex flex-col items-center justify-center text-center group shadow-2xs"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="video/mp4,video/quicktime,.mp4,.mov"
            className="hidden"
            onChange={(e) => e.target.files && handleDropFiles(e.target.files)}
          />
          <div className="text-[#4F46E5] group-hover:scale-110 transition-transform mb-2">
            <UploadCloudIcon />
          </div>
          <h5 className="text-sm font-black text-gray-900">Kéo và thả tệp video MP4 hoặc MOV vào đây</h5>
          <p className="text-xs font-medium text-gray-500 max-w-md mt-1 leading-relaxed">
            Hệ thống AI tự động nén, chuyển mã video đa độ phân giải (<strong className="text-[#4F46E5]">1080p, 720p, 480p</strong>) và tạo hình thu nhỏ thông minh.
          </p>
          <button
            type="button"
            className="mt-4 px-5 py-2 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-extrabold shadow-2xs transition-all cursor-pointer"
          >
            Chọn tệp video từ máy tính
          </button>
        </div>

        {/* Processing State Queue Visualizer */}
        {videos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
            {videos.map((vid: VideoItem) => (
              <div key={vid.id} className="p-4 rounded-2xl bg-white border border-gray-200 shadow-2xs flex flex-col justify-between gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-9 h-9 rounded-xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center font-black text-xs shrink-0 border border-indigo-100">
                      {vid.format.toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-gray-900 truncate" title={vid.fileName}>{vid.fileName}</p>
                      <p className="text-[11px] font-semibold text-gray-400 mt-0.5">{vid.fileSizeMb} MB • Transcode: 1080p / 720p / 480p</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeVideo(vid.id)}
                    className="text-gray-400 hover:text-rose-600 font-black text-sm transition-colors p-1"
                    title="Xóa khỏi danh sách"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className={vid.stage === "ready" ? "text-emerald-700 font-extrabold" : "text-[#4F46E5]"}>{vid.stageLabel}</span>
                    <span className="font-mono">{vid.stage === "ready" ? "100%" : `${vid.uploadProgress}%`}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className={twMerge(
                        "h-full transition-all duration-300 rounded-full",
                        vid.stage === "ready" ? "bg-emerald-500" : "bg-[#4F46E5] animate-pulse"
                      )}
                      style={{ width: `${vid.stage === "ready" ? 100 : Math.max(10, vid.uploadProgress)}%` }}
                    />
                  </div>
                  {vid.resolutions.length > 0 && (
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Luồng HD đã sẵn sàng:</span>
                      {vid.resolutions.map((res) => (
                        <span key={res} className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                          ✓ {res}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chapters & Lessons Visual Tree Builder */}
      <div className="w-full flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-black text-gray-900">Danh Sách Chuyên Đề Bài Giảng ({chapters.length})</h4>
            <p className="text-xs text-gray-500">Mỗi chuyên đề đánh dấu một giai đoạn kiến thức trong giáo trình của bạn.</p>
          </div>
          <button
            type="button"
            onClick={() => addChapter(`Chuyên đề ${chapters.length + 1}: Bổ trợ thực hành nâng cao`)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-extrabold shadow-2xs transition-all cursor-pointer w-fit shrink-0"
          >
            <PlusIcon size={14} />
            <span>Thêm Chuyên Đề Mới</span>
          </button>
        </div>

        {chapters.length === 0 ? (
          <div className="p-14 rounded-2xl bg-white border border-dashed border-gray-300 text-center flex flex-col items-center gap-2.5 text-gray-500 shadow-2xs">
            <span className="text-4xl">📚</span>
            <p className="text-sm font-black text-gray-900">Giáo trình của bạn đang chưa có chuyên đề nào.</p>
            <p className="text-xs max-w-sm">Hãy tạo chuyên đề đầu tiên để bắt đầu thêm bài học video, trắc nghiệm hoặc tài liệu.</p>
            <button
              type="button"
              onClick={() => addChapter("Chuyên đề 1: Nền tảng Core Architecture")}
              className="mt-2 px-5 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-extrabold rounded-xl shadow-2xs transition-all cursor-pointer"
            >
              + Tạo Chuyên Đề Đầu Tiên
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {chapters.map((chap: ChapterNode, cIndex: number) => (
              <div key={chap.id} className="p-5 rounded-2xl bg-white border border-gray-200 shadow-2xs flex flex-col gap-4">
                {/* Chapter Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-3.5 gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="w-8 h-8 rounded-xl bg-[#4F46E5] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
                      {cIndex + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        value={chap.title}
                        onChange={(e) => updateChapterTitle(chap.id, e.target.value)}
                        className="w-full text-sm font-black text-gray-900 bg-transparent focus:outline-none focus:border-b-2 focus:border-[#4F46E5] transition-colors truncate"
                        placeholder="Tên chuyên đề..."
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => addLesson(chap.id, `Bài học ${chap.lessons.length + 1}: Phân tích & Thực hành`, "video")}
                      className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-[#4F46E5] border border-indigo-200 text-xs font-bold transition-all cursor-pointer"
                    >
                      + Thêm Video
                    </button>
                    <button
                      type="button"
                      onClick={() => addLesson(chap.id, `Trắc nghiệm ôn tập #${chap.lessons.length + 1}`, "quiz")}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition-all cursor-pointer"
                    >
                      + Thêm Quiz
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteChapter(chap.id)}
                      className="p-1.5 text-gray-400 hover:text-rose-600 transition-all cursor-pointer ml-1"
                      title="Xóa chuyên đề"
                    >
                      <TrashIcon size={16} />
                    </button>
                  </div>
                </div>

                {/* Lessons List in Chapter */}
                <div className="flex flex-col gap-2.5 min-h-[50px] rounded-xl p-2 bg-gray-50/70 border border-gray-200">
                  {chap.lessons.length === 0 ? (
                    <p className="text-center text-xs font-bold text-gray-400 py-6">
                      Chuyên đề này chưa có bài giảng. Nhấn <strong className="text-[#4F46E5]">+ Thêm Video</strong> để xây dựng chi tiết.
                    </p>
                  ) : (
                    chap.lessons.map((les: LessonNode, lIndex: number) => (
                      <LessonRow
                        key={les.id}
                        lesson={les}
                        chapterId={chap.id}
                        index={lIndex}
                        onUpdate={updateLesson}
                        onDelete={deleteLesson}
                        onDragStart={handleDragStart}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                      />
                    ))
                  )}
                </div>

                {/* AI Co-Creator Quick Action Tag */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-1 text-[11px] font-bold text-gray-400 gap-1">
                  <span className="flex items-center gap-1 text-[#4F46E5]">
                    ✨ Trợ lý AI: Sẵn sàng phân tích transcript video &amp; tự động tạo câu hỏi trắc nghiệm đánh giá cho chuyên đề này.
                  </span>
                  <span>Tổng {chap.lessons.length} bài học</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Gate Indicator & Review Submission */}
      <div className="p-6 rounded-2xl bg-gray-900 text-white flex flex-col sm:flex-row items-center justify-between gap-5 shadow-sm">
        <div className="flex items-center gap-3.5">
          <span className="text-3xl">{canSubmitForReview ? "🟢" : "⚠️"}</span>
          <div>
            <h4 className="text-sm font-black text-white">Cổng Kiểm Duyệt Khóa Học MindNova</h4>
            <p className="text-xs text-gray-300 mt-0.5 leading-relaxed">
              {canSubmitForReview
                ? "✓ Cấu trúc giáo trình đạt chuẩn. Bạn đã sẵn sàng gửi phê duyệt để đưa lên sàn!"
                : "Yêu cầu bắt buộc: Thêm ít nhất 1 chuyên đề và 1 bài học để mở khóa nút gửi kiểm duyệt."}
            </p>
          </div>
        </div>
        <button
          type="button"
          disabled={!canSubmitForReview}
          onClick={() => {
            if (canSubmitForReview) {
              setStatus("review");
              alert("Đã gửi hồ sơ khóa học tới ban kiểm duyệt thành công!");
            }
          }}
          className={twMerge(
            "px-6 py-3 rounded-xl text-xs font-black tracking-wider uppercase transition-all shrink-0 cursor-pointer",
            canSubmitForReview
              ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xs hover:scale-105"
              : "bg-gray-700 text-gray-400 cursor-not-allowed"
          )}
        >
          Gửi Phê Duyệt Ngay ➔
        </button>
      </div>
    </div>
  );
}


================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\create-course\Step3SettingsPrice.tsx
================================================================

"use client";

import React from "react";
import { twMerge } from "tailwind-merge";
import { useInstructorPricing } from "@/src/hooks/instructor/useInstructorPricing";

export interface Step3SettingsPriceProps {
  courseTitle?: string;
  thumbnailPreview?: string | null;
  onSaveConfig?: () => void;
}

export function Step3SettingsPrice({ courseTitle = "Khóa học AI mới", thumbnailPreview, onSaveConfig }: Step3SettingsPriceProps) {
  const {
    isFree,
    basePrice,
    tier,
    discount,
    validationError,
    revenue,
    setIsFree,
    setBasePrice,
    setTier,
    toggleDiscount,
    updateDiscount,
  } = useInstructorPricing(50);

  return (
    <div className="w-full flex flex-col gap-6 animate-fadeIn">
      {/* Top Title Banner */}
      <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-2xs">
        <h3 className="text-base font-black text-gray-900">Cấu hình Giá bán &amp; Doanh thu</h3>
        <p className="text-xs text-gray-500 mt-1">
          Thiết lập khoảng giá tiêu chuẩn cho khóa học ($10–$500 USD), lên lịch chương trình ưu đãi khuyến mãi và dự toán thu nhập thực tế theo thời gian thực.
        </p>
      </div>

      {/* Main Grid Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column - Form Config */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          
          {/* Free vs Paid Toggle */}
          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-2xs flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-black text-gray-900">Hình Thức Phát Hành Khóa Học</h4>
                <p className="text-xs text-gray-500">Lựa chọn giữa miễn phí cống hiến cho cộng đồng hoặc thu phí chuyên nghiệp.</p>
              </div>
              <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 border border-gray-200 w-fit shrink-0">
                <button
                  type="button"
                  onClick={() => setIsFree(false)}
                  className={twMerge(
                    "px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer",
                    !isFree ? "bg-[#4F46E5] text-white shadow-2xs" : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  💰 Khóa Thu Phí
                </button>
                <button
                  type="button"
                  onClick={() => setIsFree(true)}
                  className={twMerge(
                    "px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer",
                    isFree ? "bg-emerald-600 text-white shadow-2xs" : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  🎁 Miễn Phí
                </button>
              </div>
            </div>

            {!isFree && (
              <div className="pt-4 border-t border-gray-100 flex flex-col gap-4 animate-fadeIn">
                <div>
                  <label htmlFor="course-price-input" className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1.5">
                    Giá Bán Nêm Yết ($10.00 – $500.00 USD)
                  </label>
                  <div className="relative rounded-xl shadow-2xs">
                    <span className="absolute left-3.5 top-3 text-base font-extrabold text-gray-400">$</span>
                    <input
                      id="course-price-input"
                      type="number"
                      min={10}
                      max={500}
                      value={basePrice}
                      onChange={(e) => setBasePrice(e.target.value)}
                      className={twMerge(
                        "w-full pl-8 pr-12 py-3 rounded-xl font-black font-mono text-sm border transition-all focus:outline-none",
                        validationError
                          ? "border-rose-300 text-rose-600 bg-rose-50/20"
                          : "border-gray-200 bg-gray-50/50 text-gray-900 focus:border-[#4F46E5] focus:bg-white"
                      )}
                      placeholder="50.00"
                    />
                    <span className="absolute right-3.5 top-3 text-xs font-extrabold text-gray-500">USD</span>
                  </div>
                </div>

                {validationError && (
                  <p className="text-xs font-bold text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200 flex items-center gap-2">
                    ⚠️ {validationError}
                  </p>
                )}

                <div className="flex flex-col gap-2 pt-1">
                  <label className="text-xs font-black text-gray-700 uppercase tracking-wider">Cấp Độ Hợp Tác Giảng Viên:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setTier("standard")}
                      className={twMerge(
                        "p-3.5 rounded-xl border text-left transition-all cursor-pointer",
                        tier === "standard"
                          ? "border-[#4F46E5] bg-indigo-50/50 shadow-2xs"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      )}
                    >
                      <p className="text-xs font-extrabold text-gray-900">Đối Tác Tiêu Chuẩn</p>
                      <p className="text-[11px] text-indigo-700 font-bold mt-0.5">30% phí hệ thống (Nhận 70%)</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTier("exclusive")}
                      className={twMerge(
                        "p-3.5 rounded-xl border text-left transition-all cursor-pointer",
                        tier === "exclusive"
                          ? "border-emerald-500 bg-emerald-50/50 shadow-2xs"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      )}
                    >
                      <p className="text-xs font-extrabold text-gray-900">⭐ Hợp Tác Độc Quyền MindNova</p>
                      <p className="text-[11px] text-emerald-700 font-bold mt-0.5">Ưu đãi chỉ 15% phí (Nhận 85%)</p>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Promotional Discount Scheduler */}
          {!isFree && (
            <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-2xs flex flex-col gap-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-gray-900">⚡ Lên Lịch Giảm Giá &amp; Khuyến Mãi Flash Sale</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Tăng tỷ lệ chuyển đổi học viên bằng các đợt giảm giá ngắn hạn hấp dẫn.</p>
                </div>
                <input
                  type="checkbox"
                  checked={discount.isEnabled}
                  onChange={(e) => toggleDiscount(e.target.checked)}
                  className="w-5 h-5 rounded-md text-[#4F46E5] focus:ring-[#4F46E5] border-gray-300 cursor-pointer"
                  aria-label="Kích hoạt giảm giá"
                />
              </div>

              {discount.isEnabled && (
                <div className="pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fadeIn">
                  <div>
                    <label htmlFor="discount-price-input" className="block text-xs font-bold text-gray-700 uppercase mb-1">Giá Khuyến Mãi ($)</label>
                    <input
                      id="discount-price-input"
                      type="number"
                      min={10}
                      max={basePrice}
                      value={discount.discountPrice}
                      onChange={(e) => updateDiscount("discountPrice", parseFloat(e.target.value) || 10)}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 font-black font-mono text-xs text-emerald-600 focus:outline-none focus:border-emerald-500 bg-gray-50/50"
                    />
                  </div>
                  <div>
                    <label htmlFor="discount-start-date" className="block text-xs font-bold text-gray-700 uppercase mb-1">Ngày Bắt Đầu</label>
                    <input
                      id="discount-start-date"
                      type="date"
                      value={discount.startDate}
                      onChange={(e) => updateDiscount("startDate", e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 font-bold text-xs text-gray-700 focus:outline-none bg-gray-50/50"
                    />
                  </div>
                  <div>
                    <label htmlFor="discount-end-date" className="block text-xs font-bold text-gray-700 uppercase mb-1">Ngày Kết Thúc (7 ngày)</label>
                    <input
                      id="discount-end-date"
                      type="date"
                      value={discount.endDate}
                      onChange={(e) => updateDiscount("endDate", e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 font-bold text-xs text-gray-700 focus:outline-none bg-gray-50/50"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column - Dynamic Revenue Calculator & Preview */}
        <div className="lg:col-span-5 flex flex-col gap-5 sticky top-20">
          
          {/* Dynamic Revenue Calculator Panel */}
          <div className="p-6 rounded-2xl bg-[#4F46E5] text-white border border-indigo-400 shadow-sm flex flex-col gap-5">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white font-black text-xl border border-white/20 shrink-0">
                💵
              </div>
              <div>
                <h4 className="text-sm font-black text-white">Bảng Dự Toán Doanh Thu AI</h4>
                <p className="text-xs text-indigo-100 mt-0.5">Phân tích dòng tiền lợi nhuận sau chiết khấu</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 font-mono text-xs">
              <div className="flex items-center justify-between text-indigo-100">
                <span>Giá Bán Nêm Yết (Active):</span>
                <span className="font-extrabold text-white text-sm">${revenue.listPrice.toFixed(2)} USD</span>
              </div>
              {!isFree && (
                <div className="flex items-center justify-between text-rose-200">
                  <span>Phí Hạ Tầng Nền Tang ({revenue.commissionRate}%):</span>
                  <span>-${revenue.platformFee.toFixed(2)} USD</span>
                </div>
              )}
              <div className="h-px bg-white/10 w-full my-0.5" />
              <div className="flex items-center justify-between text-indigo-100">
                <span>Tỷ lệ phân chia Giảng viên (PRO Tier):</span>
                <span className="font-extrabold text-white text-sm">80.0%</span>
              </div>
              <div className="flex items-center justify-between text-sm font-black text-emerald-300">
                <span>Thu Nháp Ròng Tích Lũy:</span>
                <span>${revenue.instructorEarnings.toFixed(2)} USD / học viên</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/10 border border-white/20 text-xs font-bold leading-relaxed text-white">
              💡 {revenue.earningsText}
            </div>
          </div>

          {/* Quick Preview Badge & Save Action */}
          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-2xs flex flex-col gap-4">
            <h5 className="text-xs font-black text-gray-900 uppercase tracking-wider">Danh Sách Tiêu Chuẩn Phê Duyệt</h5>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-700">
                <span>✓ Giá niêm yết tuân thủ khung tiêu chuẩn $10–$500 USD</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-extrabold text-indigo-700">
                <span>✓ Lịch trình khuyến mãi được đồng bộ hóa thời gian AI</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (onSaveConfig) onSaveConfig();
                else alert("Cấu hình chiến lược định giá đã được lưu!");
              }}
              className="w-full py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-extrabold text-xs shadow-2xs transition-all cursor-pointer uppercase tracking-wider mt-1"
            >
              Lưu Thiết Lập Giá ➔
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\create-course\StepIndicator.tsx
================================================================

import React from "react";
import { twMerge } from "tailwind-merge";
import { CheckIcon } from "./icons";
import type { StepKey } from "./types";
import { STEPS } from "./constants";

interface StepIndicatorProps {
  currentStep: StepKey;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-0 w-full max-w-md mx-auto py-2">
      {STEPS.map((step, index) => {
        const isDone = step.id < currentStep;
        const isActive = step.id === currentStep;
        const isLast = index === STEPS.length - 1;

        return (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5 min-w-[80px]">
              <div
                aria-current={isActive ? "step" : undefined}
                className={twMerge(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300",
                  isDone
                    ? "bg-[#4F46E5] text-white shadow-2xs"
                    : isActive
                    ? "bg-[#4F46E5] text-white ring-4 ring-indigo-100 shadow-sm"
                    : "bg-gray-200 text-gray-500"
                )}
              >
                {isDone ? <CheckIcon size={14} /> : step.id}
              </div>

              <span
                className={twMerge(
                  "text-[11px] transition-colors duration-200 text-center",
                  isActive
                    ? "text-gray-900 font-extrabold"
                    : isDone
                    ? "text-[#4F46E5] font-bold"
                    : "text-gray-400 font-medium"
                )}
              >
                {step.label}
              </span>
            </div>

            {!isLast && (
              <div className="flex-1 h-[2px] mx-2 mb-5 rounded-full overflow-hidden bg-gray-200">
                <div
                  className="h-full bg-[#4F46E5] transition-all duration-500 ease-out"
                  style={{ width: isDone ? "100%" : "0%" }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}


================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\create-course\ThumbnailUploader.tsx
================================================================

"use client";

import React, { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { ImageIcon, XIcon } from "./icons";

interface ThumbnailUploaderProps {
  preview: string | null;
  onChange: (file: File, preview: string) => void;
  onRemove: () => void;
}

export function ThumbnailUploader({
  preview,
  onChange,
  onRemove,
}: ThumbnailUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const url = URL.createObjectURL(file);
      onChange(file, url);
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  if (preview) {
    return (
      <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-gray-200 group shadow-2xs">
        <Image
          src={preview}
          alt="Ảnh bìa khóa học"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <button
            type="button"
            onClick={onRemove}
            aria-label="Xóa ảnh bìa"
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-rose-600 hover:bg-rose-50 transition-all cursor-pointer shadow-sm"
          >
            <XIcon size={15} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      id="thumbnail-upload-area"
      aria-label="Tải ảnh bìa lên"
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={twMerge(
        "w-full aspect-[4/3] rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer",
        isDragging
          ? "border-[#4F46E5] bg-indigo-50/50 scale-[1.01]"
          : "border-gray-300 bg-gray-50/60 hover:border-[#4F46E5] hover:bg-indigo-50/20 shadow-2xs"
      )}
    >
      <div
        className={twMerge(
          "w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200",
          isDragging ? "text-[#4F46E5]" : "text-gray-400"
        )}
      >
        <ImageIcon size={26} />
      </div>

      <div className="flex flex-col items-center gap-0.5 text-center">
        <p className="text-xs font-black text-[#4F46E5]">Tải ảnh bìa (4:3)</p>
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
          JPG, PNG hoặc WEBP (Tối đa 5MB)
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={handleChange}
        aria-label="Chọn ảnh bìa"
      />
    </button>
  );
}


================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\create-course\types\index.ts
================================================================

// ─── Create Course — Types ─────────────────────────────────────────────────────

export type StepKey = 1 | 2 | 3;

export interface Step {
  id: StepKey;
  label: string;
}

export type DifficultyLevel = "beginner" | "advanced";

export interface CourseBasicInfo {
  title: string;
  description: string;
  field: string;
  difficulty: DifficultyLevel;
  thumbnailFile: File | null;
  thumbnailPreview: string | null;
}


================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\discussion\DiscussionReplyContainer.tsx
================================================================

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import {
  SearchIcon,
  BellIcon,
  SettingsIcon,
  ArrowLeftIcon,
  ArchiveIcon,
  MoreHorizontalIcon,
  FileIcon,
  BoldIcon,
  ItalicIcon,
  CodeIcon,
  LinkIcon,
  ImageIcon,
  PaperclipIcon,
  AtSignIcon,
  SmileIcon,
  SparklesIcon,
  SendIcon,
} from "./icons";

// ─── Types & Mock Data ────────────────────────────────────────────────────────

export interface CommentThread {
  id: string;
  studentName: string;
  studentEmail: string;
  course: string;
  lesson: string;
  timeAgo: string;
  content: string;
  isPinned: boolean;
  isBestAnswer: boolean;
  isResolved: boolean;
  needsAttention: boolean;
  replyText?: string;
}

const INITIAL_THREADS: CommentThread[] = [
  {
    id: "thr-1",
    studentName: "Minh Nguyễn",
    studentEmail: "minh.ng@example.com",
    course: "UI/UX Design Masterclass",
    lesson: "Chapter 4: Material Tonal Layering",
    timeAgo: "2 hours ago",
    content: "Thưa thầy, em đang gặp khó khăn khi áp dụng Material Tonal Layering. Làm sao để đảm bảo độ tương phản (Accessibility) khi sử dụng các bảng màu Surface và Surface-variant cạnh nhau?",
    isPinned: true,
    isBestAnswer: false,
    isResolved: false,
    needsAttention: true,
  },
  {
    id: "thr-2",
    studentName: "An Trần",
    studentEmail: "an.tran@tech.vn",
    course: "Next.js 15 Fullstack Architecture",
    lesson: "Chapter 2: Server Actions",
    timeAgo: "5 hours ago",
    content: "When should we invoke revalidatePath vs revalidateTag in an optimistic form submission workflow?",
    isPinned: false,
    isBestAnswer: true,
    isResolved: true,
    needsAttention: false,
    replyText: "Great question An! Use revalidateTag when you have granular granular cached fetch endpoints, and revalidatePath for full structural layout invalidations.",
  },
  {
    id: "thr-3",
    studentName: "Bảo Lê",
    studentEmail: "bao.le@dev.com",
    course: "UI/UX Design Masterclass",
    lesson: "Chapter 1: Auto-Layout Essentials",
    timeAgo: "1 day ago",
    content: "My flex gap is wrapping incorrectly when switching mobile responsive breakpoints in Figma.",
    isPinned: false,
    isBestAnswer: false,
    isResolved: false,
    needsAttention: true,
  },
];

function Topbar() {
  return (
    <header className="h-16 shrink-0 flex items-center gap-4 px-6 bg-white border-b border-[#F0F0F8]">
      <div className="relative flex-1 max-w-[360px]">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0B0C8] pointer-events-none">
          <SearchIcon size={14} />
        </span>
        <input
          type="search"
          placeholder="Search thread or topic..."
          className="w-full pl-9 pr-4 h-10 rounded-2xl text-sm text-[#1A1A2E] placeholder:text-[#B0B0C8] bg-[#F6F6FB] border border-[#EAEAF4] focus:outline-none focus:border-[#6B6BFF] transition-all"
        />
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-2 text-[#7878A0]">
        <button type="button" className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-all">
          <BellIcon size={18} />
        </button>
      </div>
      <div className="flex items-center gap-3 pl-4 border-l border-[#EAEAF4]">
        <div className="flex flex-col items-end leading-tight">
          <span className="text-[13px] font-bold text-[#1A1A2E]">Dr. Minh Khôi</span>
          <span className="text-[10px] text-[#9090B0] font-bold">Senior Instructor</span>
        </div>
        <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-md">
          MK
        </div>
      </div>
    </header>
  );
}

// ─── Main Discussion Reply Container (Section 3.2) ─────────────────────────────

export function DiscussionReplyContainer() {
  const [threads, setThreads] = useState<CommentThread[]>(INITIAL_THREADS);
  const [filter, setFilter] = useState<"all" | "unanswered" | "needs_attention">("needs_attention");
  const [activeTab, setActiveTab] = useState<"inbox" | "announcements">("inbox");

  // Announcement WYSIWYG & Rate Limiting State (Section 3.2)
  const [announcementSubject, setAnnouncementSubject] = useState("🚀 New Course Module Uploaded: Server Actions & Drizzle ORM");
  const [announcementBody, setAnnouncementBody] = useState("Hello Cohort! We just published three new hands-on practice workshops for Module 2. Make sure to complete the diagnostic practice quiz before Friday.");
  const [sentCountThisWeek, setSentCountThisWeek] = useState(1); // Max 2 emails per week to prevent spam
  const [announcementNotice, setAnnouncementNotice] = useState<string | null>(null);

  // Thread Actions
  const togglePin = (id: string) => {
    setThreads((prev) => prev.map((t) => (t.id === id ? { ...t, isPinned: !t.isPinned } : t)));
  };

  const toggleBestAnswer = (id: string) => {
    setThreads((prev) => prev.map((t) => (t.id === id ? { ...t, isBestAnswer: !t.isBestAnswer, isResolved: true, needsAttention: false } : t)));
  };

  const deleteThread = (id: string) => {
    setThreads((prev) => prev.filter((t) => t.id !== id));
  };

  const submitReply = (id: string, reply: string) => {
    if (!reply.trim()) return;
    setThreads((prev) =>
      prev.map((t) => (t.id === id ? { ...t, replyText: reply, isResolved: true, needsAttention: false } : t))
    );
  };

  const handleSendAnnouncement = () => {
    if (sentCountThisWeek >= 2) {
      setAnnouncementNotice("⚠️ Rate-Limit Rule Triggered: To preserve student inbox trust and prevent spam, announcements are limited to 2 bulk email broadcasts per week.");
      return;
    }
    setSentCountThisWeek((prev) => prev + 1);
    setAnnouncementNotice("✓ Broadcast Sent Successfully! Your cohort email will arrive within 5 minutes.");
    setTimeout(() => setAnnouncementNotice(null), 6000);
  };

  const filteredThreads = threads.filter((t) => {
    if (filter === "unanswered") return !t.replyText;
    if (filter === "needs_attention") return t.needsAttention || !t.replyText;
    return true;
  });

  const [draftReplies, setDraftReplies] = useState<Record<string, string>>({});

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8FF]">
      <Topbar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1080px] mx-auto px-6 py-8 flex flex-col gap-8">
          
          {/* Header Banner with Switcher */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[#EAEAF4]">
            <div>
              <h1 className="text-[26px] font-extrabold text-[#1A1A2E] tracking-tight">Q&amp;A Discussions &amp; Cohort Announcements (Section 3.2)</h1>
              <p className="text-[13px] text-[#64647A] mt-1">
                Manage threaded mentoring inboxes, award best answers, and broadcast spam-protected cohort notifications.
              </p>
            </div>

            {/* Feature Tab Selector */}
            <div className="flex items-center gap-2 p-1 rounded-2xl bg-white border border-[#EAEAF4] shadow-xs">
              <button
                type="button"
                onClick={() => setActiveTab("inbox")}
                className={twMerge(
                  "px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
                  activeTab === "inbox" ? "bg-[#4F46E5] text-white shadow-2xs" : "text-[#6B7280] hover:text-[#111827] hover:bg-white/60"
                )}
              >
                Hòm thư Hỏi đáp ({threads.filter((t) => t.needsAttention).length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("announcements")}
                className={twMerge(
                  "px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
                  activeTab === "announcements" ? "bg-[#4F46E5] text-white shadow-2xs" : "text-[#6B7280] hover:text-[#111827] hover:bg-white/60"
                )}
              >
                Thông báo Lớp học
              </button>
            </div>
          </div>

          {activeTab === "inbox" ? (
            /* Tab 1: Q&A Unified Inbox */
            <div className="flex flex-col gap-6 animate-fadeIn">
              {/* Inbox Filters */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl border border-gray-200">
                  {[
                    { id: "needs_attention", label: "Cần phản hồi" },
                    { id: "unanswered", label: "Chưa trả lời" },
                    { id: "all", label: "Tất cả thảo luận" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setFilter(tab.id as any)}
                      className={twMerge(
                        "px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer",
                        filter === tab.id
                          ? "bg-[#6B6BFF] text-white shadow-sm"
                          : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <p className="text-xs font-bold text-gray-400">
                  Showing <strong className="text-gray-800">{filteredThreads.length}</strong> active mentoring threads
                </p>
              </div>

              {/* Thread Cards List */}
              {filteredThreads.length === 0 ? (
                <div className="p-16 text-center rounded-3xl bg-white border border-[#EAEAF4] flex flex-col items-center gap-2 text-gray-400">
                  <span className="text-4xl">📭</span>
                  <p className="text-sm font-black text-[#1A1A2E]">All mentoring inquiries answered!</p>
                  <p className="text-xs">Zero threads require attention under the current filter.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {filteredThreads.map((thread) => (
                    <div key={thread.id} className="p-6 rounded-3xl bg-white border border-[#EAEAF4] shadow-xs flex flex-col gap-5">
                      
                      {/* Thread Top Info */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-sm flex items-center justify-center shadow-sm">
                            {thread.studentName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-black text-[#1A1A2E]">{thread.studentName}</h4>
                              <span className="text-[11px] font-bold text-gray-400">({thread.timeAgo})</span>
                            </div>
                            <p className="text-xs font-semibold text-indigo-600 mt-0.5">
                              {thread.course} • <span className="text-gray-500">{thread.lesson}</span>
                            </p>
                          </div>
                        </div>

                        {/* Status Tags */}
                        <div className="flex items-center gap-2">
                          {thread.isPinned && (
                            <span className="px-3 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-black">
                              📌 Pinned to Top
                            </span>
                          )}
                          {thread.isBestAnswer && (
                            <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-black flex items-center gap-1">
                              🏆 Best Answer Awarded
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content Body */}
                      <div className="p-4 rounded-2xl bg-[#F8F9FF] border border-[#EAEAF4] text-sm font-medium text-gray-800 leading-relaxed">
                        {thread.content}
                      </div>

                      {/* Previous Reply Display */}
                      {thread.replyText && (
                        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50/60 to-teal-50/20 border border-emerald-200 text-xs font-medium text-gray-800 flex flex-col gap-2">
                          <div className="flex items-center gap-2 font-black text-emerald-800 text-xs">
                            <span className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center font-bold">✓</span>
                            <span>Instructor Mentoring Reply:</span>
                          </div>
                          <p className="text-sm leading-relaxed pl-7">{thread.replyText}</p>
                        </div>
                      )}

                      {/* Action & Reply Bar */}
                      <div className="flex flex-col gap-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => togglePin(thread.id)}
                              className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xs transition-all"
                            >
                              {thread.isPinned ? "Unpin Comment" : "📌 Pin Comment"}
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleBestAnswer(thread.id)}
                              className={twMerge(
                                "px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer",
                                thread.isBestAnswer ? "bg-emerald-600 text-white shadow-sm" : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200"
                              )}
                            >
                              🏆 Mark Best Answer &amp; Resolve
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => deleteThread(thread.id)}
                            className="text-gray-400 hover:text-red-600 font-extrabold text-xs px-2 py-1 transition-colors"
                          >
                            🗑️ Delete Thread
                          </button>
                        </div>

                        {!thread.replyText && (
                          <div className="flex items-center gap-3 pt-2">
                            <input
                              type="text"
                              placeholder="Write helpful mentoring guidance or code example..."
                              value={draftReplies[thread.id] || ""}
                              onChange={(e) => setDraftReplies((prev) => ({ ...prev, [thread.id]: e.target.value }))}
                              className="flex-1 px-4 py-3 rounded-2xl border border-[#D5D5FF] bg-white text-xs font-bold focus:outline-none focus:border-[#6B6BFF]"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                submitReply(thread.id, draftReplies[thread.id] || "");
                                setDraftReplies((prev) => ({ ...prev, [thread.id]: "" }));
                              }}
                              className="px-6 py-3 rounded-2xl bg-[#1A1A2E] hover:bg-[#4648D4] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
                            >
                              Send Reply ➔
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Tab 2: Cohort Announcer & Rate Limiting (Section 3.2) */
            <div className="flex flex-col gap-6 animate-fadeIn max-w-3xl mx-auto w-full">
              <div className="p-7 rounded-3xl bg-white border border-[#EAEAF4] shadow-xs flex flex-col gap-6">
                
                <div className="flex items-center justify-between border-b border-gray-100 pb-5">
                  <div className="flex items-center gap-3">
                    <span className="w-12 h-12 rounded-2xl bg-indigo-50 text-[#6B6BFF] flex items-center justify-center font-black text-2xl">
                      📢
                    </span>
                    <div>
                      <h3 className="text-base font-black text-[#1A1A2E]">Cohort-Wide Rich Text Announcer</h3>
                      <p className="text-xs text-gray-400">Broadcast important syllabus milestones to all enrolled email addresses.</p>
                    </div>
                  </div>

                  {/* Spam Rate-Limit Meter (Section 3.2) */}
                  <div className="text-right">
                    <span className={twMerge("px-3 py-1 rounded-xl text-xs font-black font-mono border", sentCountThisWeek >= 2 ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-emerald-50 text-emerald-700 border-emerald-200")}>
                      Weekly Quota: {sentCountThisWeek} / 2 Emails
                    </span>
                    <p className="text-[10px] font-bold text-gray-400 mt-1">Anti-Spam Rate Limiting Enforced</p>
                  </div>
                </div>

                {announcementNotice && (
                  <div className={twMerge("p-4 rounded-2xl font-bold text-xs flex items-center gap-2", sentCountThisWeek >= 2 ? "bg-amber-50 border border-amber-300 text-amber-900" : "bg-emerald-50 border border-emerald-300 text-emerald-800")}>
                    <span>💡</span>
                    <span>{announcementNotice}</span>
                  </div>
                )}

                {/* WYSIWYG Editor Simulation */}
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-wide mb-1.5">Announcement Subject</label>
                    <input
                      type="text"
                      value={announcementSubject}
                      onChange={(e) => setAnnouncementSubject(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border-2 border-indigo-200 text-sm font-black text-[#1A1A2E] focus:outline-none focus:border-[#6B6BFF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-wide mb-1.5">WYSIWYG Rich Text Content</label>
                    <div className="border border-gray-300 rounded-2xl overflow-hidden bg-white">
                      {/* Fake WYSIWYG Toolbar */}
                      <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-200 text-gray-600 text-xs font-bold">
                        <span className="px-2 py-0.5 rounded bg-white border cursor-pointer"><b>B</b></span>
                        <span className="px-2 py-0.5 rounded bg-white border cursor-pointer"><i>I</i></span>
                        <span className="px-2 py-0.5 rounded bg-white border cursor-pointer"><u>U</u></span>
                        <span className="h-4 w-px bg-gray-300 mx-1" />
                        <span className="px-2 py-0.5 rounded bg-white border cursor-pointer">🔗 Link</span>
                        <span className="px-2 py-0.5 rounded bg-white border cursor-pointer">🖼️ Image</span>
                        <span className="px-2 py-0.5 rounded bg-white border cursor-pointer">📝 Code Block</span>
                      </div>
                      <textarea
                        rows={6}
                        value={announcementBody}
                        onChange={(e) => setAnnouncementBody(e.target.value)}
                        className="w-full p-4 text-xs font-medium text-[#1A1A2E] leading-relaxed focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Broadcast Footer Button */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <p className="text-xs text-gray-400 font-semibold">
                    Recipients will receive notifications directly inside their dashboard &amp; verified email inbox.
                  </p>
                  <button
                    type="button"
                    onClick={handleSendAnnouncement}
                    disabled={sentCountThisWeek >= 2}
                    className="px-8 py-3.5 bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] hover:opacity-95 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg transition-all disabled:opacity-50 cursor-pointer"
                  >
                    🚀 Broadcast To Cohort Now
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}


================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\discussion\icons.tsx
================================================================

// ─── Discussion Icons ──────────────────────────────────────────────────────────

const B = {
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor" as const,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

export function SearchIcon({ size = 15 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

export function BellIcon({ size = 18 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={1.8}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

export function SettingsIcon({ size = 18 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={1.8}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

export function ArrowLeftIcon({ size = 14 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2}>
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

export function ArchiveIcon({ size = 14 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2}>
      <polyline points="21 8 21 21 3 21 3 8" />
      <rect x="1" y="3" width="22" height="5" />
      <line x1="10" y1="12" x2="14" y2="12" />
    </svg>
  );
}

export function MoreHorizontalIcon({ size = 16 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2}>
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  );
}

export function FileIcon({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2} className={className}>
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <polyline points="13 2 13 9 20 9" />
    </svg>
  );
}

export function BoldIcon() { return <svg {...B} width={13} height={13} strokeWidth={2.5}><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" /><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" /></svg>; }
export function ItalicIcon() { return <svg {...B} width={13} height={13} strokeWidth={2.5}><line x1="19" y1="4" x2="10" y2="4" /><line x1="14" y1="20" x2="5" y2="20" /><line x1="15" y1="4" x2="9" y2="20" /></svg>; }
export function CodeIcon() { return <svg {...B} width={13} height={13} strokeWidth={2}><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>; }
export function LinkIcon({ size = 13, className }: { size?: number; className?: string }) { return <svg {...B} width={size} height={size} strokeWidth={2} className={className}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>; }
export function ImageIcon() { return <svg {...B} width={13} height={13} strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>; }
export function PaperclipIcon() { return <svg {...B} width={13} height={13} strokeWidth={2}><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>; }
export function AtSignIcon() { return <svg {...B} width={13} height={13} strokeWidth={2}><circle cx="12" cy="12" r="4" /><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" /></svg>; }
export function SmileIcon() { return <svg {...B} width={13} height={13} strokeWidth={2}><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>; }

export function SparklesIcon({ size = 14 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2}>
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  );
}

export function SendIcon({ size = 14 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2}>
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}


================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\discussion\index.ts
================================================================

// ─── Discussion Feature Public API ──────────────────────────────────────────

export { DiscussionReplyContainer } from "./DiscussionReplyContainer";


================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\edit-course\EditCourseContainer.tsx
================================================================

"use client";

import React from "react";
import { CourseStudio } from "@/src/components/page/instructor/create-course";

interface EditCourseProps {
  courseId?: string;
}

export function EditCourseContainer({ courseId = "c1" }: EditCourseProps) {
  return <CourseStudio mode="edit" courseId={courseId} />;
}


================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\edit-course\icons.tsx
================================================================

import React from "react";

export function SparklesIcon({ size = 16 }: { size?: number }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}

export function EyeIcon({ size = 16 }: { size?: number }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function SaveIcon({ size = 16 }: { size?: number }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}

export function CheckIcon({ size = 16 }: { size?: number }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function TrashIcon({ size = 16 }: { size?: number }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

export function BookOpenIcon({ size = 16 }: { size?: number }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

export function TagIcon({ size = 16 }: { size?: number }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
      <path d="M7 7h.01" />
    </svg>
  );
}

export function SettingsIcon({ size = 16 }: { size?: number }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V15Z" />
    </svg>
  );
}

export function UploadIcon({ size = 16 }: { size?: number }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

export function ArrowLeftIcon({ size = 16 }: { size?: number }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}


================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\edit-course\index.ts
================================================================

export { EditCourseContainer } from "./EditCourseContainer";


================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\lesson-management\icons.tsx
================================================================

// ─── Lesson Management — Icons ────────────────────────────────────────────────

const B = {
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor" as const,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

export function GripIcon({ size = 16 }: { size?: number }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      <circle cx="9" cy="6" r="1.5" /><circle cx="15" cy="6" r="1.5" />
      <circle cx="9" cy="12" r="1.5" /><circle cx="15" cy="12" r="1.5" />
      <circle cx="9" cy="18" r="1.5" /><circle cx="15" cy="18" r="1.5" />
    </svg>
  );
}

export function VideoIcon({ size = 14 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={1.8}>
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

export function DocumentIcon({ size = 14 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={1.8}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

export function PencilIcon({ size = 13 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2}>
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  );
}

export function TrashIcon({ size = 13 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

export function ChevronUpIcon({ size = 14 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2}>
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}

export function ChevronDownIcon({ size = 14 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function ChevronLeftIcon({ size = 14 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

export function PlusIcon({ size = 14 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export function PlusCircleIcon({ size = 18 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={1.8}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}

export function ClockIcon({ size = 12 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={1.8}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export function SparklesIcon({ size = 14 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2}>
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  );
}

export function EyeIcon({ size = 14 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={1.8}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function LayersIcon({ size = 14 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={1.8}>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

export function FilterIcon({ size = 14 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2}>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

export function SortIcon({ size = 14 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2}>
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

export function MessageCircleIcon({ size = 18 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={1.8}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export function SearchIcon({ size = 15 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

export function BellIcon({ size = 18 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={1.8}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

export function HelpCircleIcon({ size = 18 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={1.8}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}


================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\lesson-management\index.ts
================================================================

// ─── Lesson Management — Public API ──────────────────────────────────────────

export { LessonManagementContainer } from "./LessonManagementContainer";


================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\lesson-management\LessonAIQuizModal.tsx
================================================================

"use client";

import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import { useAIQuizGenerator, type GeneratedQuestion } from "@/src/hooks/instructor/useAIQuizGenerator";

export interface LessonAIQuizModalProps {
  lessonTitle?: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirmDecks?: (questions: GeneratedQuestion[]) => void;
}

// Leaf UI Presentation Component for Section 2.2 Rapid-Review Quiz Interface

export function LessonAIQuizModal({ lessonTitle = "Building Type-Safe Server Actions", isOpen, onClose, onConfirmDecks }: LessonAIQuizModalProps) {
  const {
    isGenerating,
    questions,
    transcriptSource,
    setTranscriptSource,
    generateFromTranscript,
    approveQuestion,
    editQuestion,
    discardQuestion,
    approvedCount,
  } = useAIQuizGenerator();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftQ, setDraftQ] = useState("");
  const [draftA, setDraftA] = useState("");

  if (!isOpen) return null;

  const activeQuestions = questions.filter((q) => q.reviewStatus !== "discarded");

  const startEdit = (q: GeneratedQuestion) => {
    setEditingId(q.id);
    setDraftQ(q.question);
    setDraftA(q.correctAnswer);
  };

  const commitEdit = (id: string) => {
    if (draftQ.trim() && draftA.trim()) {
      editQuestion(id, draftQ.trim(), draftA.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl border border-[#EAEAF4] shadow-[0_30px_90px_rgba(0,0,0,0.3)] max-w-4xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Top Header */}
        <div className="p-6 bg-gradient-to-r from-[#1E233E] via-[#2B2D62] to-[#121626] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#6B6BFF] to-[#F368E0] flex items-center justify-center text-2xl font-black shadow-md">
              🪄
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">AI Quiz &amp; Challenge Co-Creator (Section 2.2)</h3>
                <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-md bg-white/10 text-indigo-300 border border-white/10">
                  Rapid Review UI
                </span>
              </div>
              <p className="text-xs text-gray-300 font-semibold mt-0.5">
                Target Lesson: <strong className="text-emerald-300">{lessonTitle}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-black">
              ✓ Approved: {approvedCount}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-white font-extrabold text-xl transition-colors p-1"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6 bg-[#FAF8FF]">
          
          {/* Transcript Source Box */}
          {questions.length === 0 && (
            <div className="p-6 rounded-3xl bg-white border border-[#EAEAF4] shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-extrabold text-[#1A1A2E] flex items-center gap-2">
                  <span>📜 Video Transcript / Lesson Text Source</span>
                </h4>
                <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                  Auto-populated from upload stream
                </span>
              </div>
              <p className="text-xs text-gray-500">
                The AI analyzes semantic vocabulary, code blocks, and architectural concepts in your text to generate highly accurate assessment rubrics.
              </p>
              <textarea
                value={transcriptSource}
                onChange={(e) => setTranscriptSource(e.target.value)}
                rows={5}
                className="w-full p-4 rounded-2xl border border-indigo-200 bg-[#F8F9FF] text-xs font-medium text-gray-700 leading-relaxed focus:outline-none focus:border-[#6B6BFF] transition-colors"
                placeholder="Paste lesson transcript or markdown notes here..."
              />
              <button
                type="button"
                onClick={() => generateFromTranscript(lessonTitle)}
                disabled={isGenerating || !transcriptSource.trim()}
                className="self-end px-8 py-3 bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] text-white text-xs font-black rounded-2xl shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50"
              >
                {isGenerating ? "⚡ Extracting Rubrics..." : "⚡ Generate Diagnostic Quiz Decks Now"}
              </button>
            </div>
          )}

          {isGenerating && (
            <div className="py-20 flex flex-col items-center justify-center gap-4 text-center">
              <div className="w-10 h-10 border-4 border-[#6B6BFF] border-t-transparent rounded-full animate-spin" />
              <h4 className="text-base font-extrabold text-[#1A1A2E]">Analyzing lesson transcript semantics...</h4>
              <p className="text-xs font-semibold text-gray-500 max-w-sm">
                Formulating contextually accurate multiple-choice questions, true/false logic, and practical coding challenges.
              </p>
            </div>
          )}

          {/* Rapid Review Decks */}
          {!isGenerating && activeQuestions.length > 0 && (
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between px-2">
                <div>
                  <h4 className="text-sm font-extrabold text-[#1A1A2E]">Rapid-Review Interface</h4>
                  <p className="text-xs text-gray-500 font-semibold">
                    You retain full editorial control: Click <strong className="text-emerald-600">Approve</strong>, <strong className="text-indigo-600">Edit</strong>, or <strong className="text-red-500">Discard</strong>.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => generateFromTranscript(lessonTitle)}
                  className="text-xs font-bold text-[#5153DF] hover:underline"
                >
                  🔄 Regenerate Decks
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {activeQuestions.map((q, idx) => {
                  const isEditing = editingId === q.id;
                  const isApproved = q.reviewStatus === "approved" || q.reviewStatus === "edited";

                  return (
                    <div
                      key={q.id}
                      className={twMerge(
                        "p-6 rounded-3xl bg-white border-2 transition-all duration-200 shadow-sm flex flex-col gap-4",
                        isApproved
                          ? "border-emerald-500/50 bg-emerald-50/10 shadow-[0_4px_20px_rgba(16,185,129,0.05)]"
                          : "border-[#EAEAF4]"
                      )}
                    >
                      {/* Top Tag & Status */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-700 font-black text-xs flex items-center justify-center">
                            #{idx + 1}
                          </span>
                          <span className="text-[11px] font-black uppercase px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 border">
                            {q.type.replace("_", " ")}
                          </span>
                          {isApproved && (
                            <span className="text-xs font-extrabold text-emerald-600 flex items-center gap-1">
                              ✓ Approved for Deck
                            </span>
                          )}
                        </div>

                        {/* Rapid-Review Actions Bar (Section 2.2) */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => approveQuestion(q.id)}
                            disabled={isApproved}
                            className={twMerge(
                              "px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer",
                              isApproved ? "bg-emerald-500 text-white cursor-default" : "bg-emerald-50 hover:bg-emerald-500 text-emerald-700 hover:text-white border border-emerald-200"
                            )}
                          >
                            {isApproved ? "Approved ✓" : "✓ Approve"}
                          </button>
                          <button
                            type="button"
                            onClick={() => (isEditing ? commitEdit(q.id) : startEdit(q))}
                            className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-500 text-indigo-700 hover:text-white border border-indigo-200 text-xs font-extrabold transition-all"
                          >
                            {isEditing ? "Save Edit" : "✎ Edit"}
                          </button>
                          <button
                            type="button"
                            onClick={() => discardQuestion(q.id)}
                            className="px-3.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-500 text-red-600 hover:text-white border border-red-200 text-xs font-extrabold transition-all"
                          >
                            ✕ Discard
                          </button>
                        </div>
                      </div>

                      {/* Question Content */}
                      {isEditing ? (
                        <div className="flex flex-col gap-3 pt-2">
                          <div>
                            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Question Text</label>
                            <input
                              type="text"
                              value={draftQ}
                              onChange={(e) => setDraftQ(e.target.value)}
                              className="w-full p-3 rounded-xl border border-[#6B6BFF] font-bold text-sm text-[#1A1A2E]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-emerald-700 uppercase mb-1">Correct Answer</label>
                            <input
                              type="text"
                              value={draftA}
                              onChange={(e) => setDraftA(e.target.value)}
                              className="w-full p-3 rounded-xl border border-emerald-500 font-extrabold text-sm text-emerald-700 bg-emerald-50/50"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-3">
                          <h5 className="text-base font-extrabold text-[#1A1A2E] leading-snug">
                            {q.question}
                          </h5>

                          {q.codeSnippet && (
                            <pre className="p-3.5 rounded-2xl bg-[#1E233E] text-indigo-200 font-mono text-xs overflow-x-auto border border-indigo-500/30">
                              <code>{q.codeSnippet}</code>
                            </pre>
                          )}

                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 font-bold text-sm text-emerald-800">
                              <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-xs">
                                ✓
                              </span>
                              <span>Correct Answer: {q.correctAnswer}</span>
                            </div>

                            {q.distractors.map((dist, dIdx) => (
                              <div key={dIdx} className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium text-gray-500">
                                <span className="w-5 h-5 rounded-full bg-gray-300 text-white flex items-center justify-center font-bold text-[10px]">
                                  ✕
                                </span>
                                <span>Distractor {dIdx + 1}: {dist}</span>
                              </div>
                            ))}
                          </div>

                          <div className="mt-1 p-3 rounded-xl bg-[#F0F0FF] text-xs font-medium text-[#4A4B68]">
                            <strong className="text-[#5153DF]">🤖 AI Pedagogical Rationale:</strong> {q.explanation}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {!isGenerating && questions.length > 0 && activeQuestions.length === 0 && (
            <div className="p-12 text-center rounded-3xl bg-white border border-gray-200 flex flex-col items-center gap-3 text-gray-500">
              <span className="text-4xl">🗑️</span>
              <p className="text-sm font-bold text-[#1A1A2E]">All generated questions were discarded.</p>
              <button
                type="button"
                onClick={() => generateFromTranscript(lessonTitle)}
                className="mt-2 px-6 py-2.5 bg-[#6B6BFF] text-white text-xs font-extrabold rounded-2xl shadow-md"
              >
                🔄 Generate New Questions
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 bg-white border-t border-[#EAEAF4] flex items-center justify-between">
          <p className="text-xs font-extrabold text-gray-500">
            Approved decks automatically bind to student interactive practice sessions.
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-extrabold transition-all"
            >
              Close Without Applying
            </button>
            <button
              type="button"
              onClick={() => {
                if (onConfirmDecks) onConfirmDecks(activeQuestions.filter((q) => q.reviewStatus !== "pending"));
                onClose();
              }}
              disabled={approvedCount === 0}
              className="px-6 py-2.5 bg-[#1A1A2E] hover:bg-[#4648D4] text-white text-xs font-black rounded-xl shadow-lg transition-all disabled:opacity-50 cursor-pointer"
            >
              ✓ Save ({approvedCount}) Approved To Lesson
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\lesson-management\LessonManagementContainer.tsx
================================================================

"use client";

// ─── LessonManagementContainer ────────────────────────────────────────────────
// Màn hình quản lý bài học chi tiết cho một khóa học — drag/drop chapters +
// lessons, filter tabs, AI assist card, add chapter CTA, và chat FAB.

import { useState, useCallback } from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { LessonAIQuizModal } from "./LessonAIQuizModal";
import {
  GripIcon,
  VideoIcon,
  DocumentIcon,
  PencilIcon,
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  PlusIcon,
  PlusCircleIcon,
  ClockIcon,
  SparklesIcon,
  EyeIcon,
  LayersIcon,
  FilterIcon,
  SortIcon,
} from "./icons";

// ─── Types ────────────────────────────────────────────────────────────────────

type LessonStatus = "published" | "draft";
type LessonType   = "video" | "document" | "quiz";
type FilterTab    = "all" | "public" | "draft";

interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  duration: string; // "MM:SS"
  status: LessonStatus;
}

interface Chapter {
  id: string;
  index: number;
  title: string;
  lessons: Lesson[];
  collapsed: boolean;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const INITIAL_CHAPTERS: Chapter[] = [
  {
    id: "ch1",
    index: 1,
    title: "Giới thiệu về Generative AI",
    collapsed: false,
    lessons: [
      { id: "l1", title: "Bài học 1.1: Khái niệm cơ bản & Lịch sử hình thành", type: "video",    duration: "15:20", status: "published" },
      { id: "l2", title: "Bài học 1.2: Các mô hình ngôn ngữ lớn (LLMs) hoạt động như thế nào?", type: "document", duration: "22:45", status: "published" },
    ],
  },
  {
    id: "ch2",
    index: 2,
    title: "Kỹ thuật Prompt Engineering cơ bản",
    collapsed: false,
    lessons: [
      { id: "l3", title: "Bài học 2.1: Cấu trúc của một Prompt hiệu quả",        type: "video", duration: "18:05", status: "draft"     },
      { id: "l4", title: "Bài học 2.2: Kỹ thuật Few-shot vs Zero-shot prompting", type: "video", duration: "25:10", status: "published" },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function totalDuration(chapters: Chapter[]): string {
  let secs = 0;
  chapters.forEach((ch) =>
    ch.lessons.forEach((l) => {
      const [m, s] = l.duration.split(":").map(Number);
      secs += (m || 0) * 60 + (s || 0);
    }),
  );
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  return `${h} giờ ${m} phút`;
}

function totalLessons(chapters: Chapter[]): number {
  return chapters.reduce((a, c) => a + c.lessons.length, 0);
}

function publishedLessons(chapters: Chapter[]): number {
  return chapters.reduce(
    (a, c) => a + c.lessons.filter((l) => l.status === "published").length,
    0,
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function LessonStatusBadge({ status }: { status: LessonStatus }) {
  return (
    <span
      className={twMerge(
        "text-[10px] font-semibold px-2 py-0.5 rounded-full",
        status === "published"
          ? "bg-[#EEF0FF] text-[#4648D4]"
          : "bg-amber-100 text-amber-700",
      )}
    >
      {status === "published" ? "Đã xuất bản" : "Đang soạn thảo"}
    </span>
  );
}

// ─── Lesson Icon ──────────────────────────────────────────────────────────────

function LessonTypeIcon({ type }: { type: LessonType }) {
  return (
    <span className="w-6 h-6 rounded-md bg-[#F4F4FA] text-[#9090B0] flex items-center justify-center shrink-0">
      {type === "video"    && <VideoIcon size={12} />}
      {type === "document" && <DocumentIcon size={12} />}
      {type === "quiz"     && <VideoIcon size={12} />}
    </span>
  );
}

// ─── Lesson Row ───────────────────────────────────────────────────────────────

interface LessonRowProps {
  lesson: Lesson;
  onDelete: () => void;
  onGenerateQuiz: () => void;
}

function LessonRow({ lesson, onDelete, onGenerateQuiz }: LessonRowProps) {
  return (
    <div className="group flex items-center gap-3 px-4 py-3 hover:bg-[#FAFAFE] transition-colors duration-100 border-b border-[#F4F4FA] last:border-0">
      {/* Drag handle */}
      <span className="text-[#D0D0E8] cursor-grab opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <GripIcon size={14} />
      </span>

      {/* Type icon */}
      <LessonTypeIcon type={lesson.type} />

      {/* Title */}
      <p className="flex-1 text-[13px] text-[#1A1A2E] font-medium truncate min-w-0">
        {lesson.title}
      </p>

      {/* 🪄 Generate Quiz button (Section 2.2) */}
      <button
        type="button"
        onClick={onGenerateQuiz}
        className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-[#6B6BFF] text-[#5153DF] hover:text-white border border-indigo-200 hover:border-transparent text-[11px] font-extrabold transition-all shadow-xs shrink-0 flex items-center gap-1 cursor-pointer"
        title="AI analysis of lesson transcript to auto-generate multiple choice rubric"
      >
        <span>🪄 Generate Quiz</span>
      </button>

      {/* Duration */}
      <span className="flex items-center gap-1 text-[11px] text-[#9090B0] shrink-0 font-mono">
        <ClockIcon size={11} />
        {lesson.duration}
      </span>

      {/* Status badge */}
      <LessonStatusBadge status={lesson.status} />

      {/* Actions (hover) */}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          type="button"
          aria-label="Chỉnh sửa bài học"
          className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9090B0] hover:text-[#4648D4] hover:bg-[#EEF0FF] transition-all duration-150"
        >
          <PencilIcon size={12} />
        </button>
        <button
          type="button"
          aria-label="Xóa bài học"
          onClick={onDelete}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9090B0] hover:text-red-500 hover:bg-red-50 transition-all duration-150"
        >
          <TrashIcon size={12} />
        </button>
      </div>
    </div>
  );
}

// ─── Chapter Card ─────────────────────────────────────────────────────────────

interface ChapterCardProps {
  chapter: Chapter;
  onToggle: () => void;
  onAddLesson: () => void;
  onDeleteLesson: (lessonId: string) => void;
  onDelete: () => void;
  onGenerateQuiz: (lessonTitle: string) => void;
}

function ChapterCard({ chapter, onToggle, onAddLesson, onDeleteLesson, onDelete, onGenerateQuiz }: ChapterCardProps) {
  return (
    <div className="rounded-2xl border border-[#EAEAF4] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden">
      {/* Chapter header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-[#FAFAFE] transition-colors">
        {/* Drag handle */}
        <span className="text-[#D0D0E8] cursor-grab shrink-0">
          <GripIcon size={16} />
        </span>

        {/* Chapter badge */}
        <span className="px-2.5 py-1 rounded-lg bg-[#6B6BFF] text-white text-[11px] font-bold tracking-wide shrink-0">
          Chương {chapter.index}
        </span>

        {/* Title */}
        <span className="flex-1 text-[13px] font-semibold text-[#1A1A2E] truncate min-w-0">
          {chapter.title}
        </span>

        {/* Chapter actions */}
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            type="button"
            aria-label="Chỉnh sửa chương"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9090B0] hover:text-[#4648D4] hover:bg-[#EEF0FF] transition-all duration-150"
          >
            <PencilIcon size={13} />
          </button>
          <button
            type="button"
            aria-label="Xóa chương"
            onClick={onDelete}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9090B0] hover:text-red-500 hover:bg-red-50 transition-all duration-150"
          >
            <TrashIcon size={13} />
          </button>
          <button
            type="button"
            aria-label={chapter.collapsed ? "Mở rộng chương" : "Thu gọn chương"}
            onClick={onToggle}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9090B0] hover:text-[#4648D4] hover:bg-[#EEF0FF] transition-all duration-150"
          >
            {chapter.collapsed ? <ChevronDownIcon size={14} /> : <ChevronUpIcon size={14} />}
          </button>
        </div>
      </div>

      {/* Lesson list (collapsible) */}
      {!chapter.collapsed && (
        <div className="border-t border-[#F4F4FA]">
          {chapter.lessons.map((lesson) => (
            <LessonRow
              key={lesson.id}
              lesson={lesson}
              onDelete={() => onDeleteLesson(lesson.id)}
              onGenerateQuiz={() => onGenerateQuiz(lesson.title)}
            />
          ))}

          {/* Add lesson CTA */}
          <button
            type="button"
            onClick={onAddLesson}
            className="w-full flex items-center gap-2 px-4 py-3 text-[12px] font-semibold text-[#6B6BFF] hover:bg-[#F5F3FF] transition-colors duration-150 border-t border-dashed border-[#D5D5FF] group"
          >
            <PlusIcon size={13} />
            Thêm bài học mới vào chương {chapter.index}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── AI Assist Card ───────────────────────────────────────────────────────────

function AIAssistCard({ onQuizGenerate, onSuggestChapter }: {
  onQuizGenerate: () => void;
  onSuggestChapter: () => void;
}) {
  return (
    <div className="rounded-2xl border border-[#C5C6FF] bg-gradient-to-r from-[#F5F3FF] to-[#EEF0FF] p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
      {/* Icon + text */}
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <div className="flex items-center gap-2 text-[#6B6BFF]">
          <span className="animate-pulse"><SparklesIcon size={13} /></span>
          <span className="text-[10px] font-bold tracking-widest uppercase">
            MindNova AI Assist
          </span>
        </div>
        <p className="text-[14px] font-bold text-[#1A1A2E]">
          Sử dụng AI để tối ưu lộ trình học tập
        </p>
        <p className="text-[12px] text-[#64647A] leading-relaxed max-w-[420px]">
          Hệ thống AI của chúng tôi có thể giúp bạn tự động sinh câu hỏi Quiz,
          tóm tắt bài giảng hoặc đề xuất thêm các chương học dựa trên xu hướng
          thị trường.
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onQuizGenerate}
          className="px-4 py-2.5 rounded-xl border border-[#C5C6FF] text-[13px] font-semibold text-[#4648D4] bg-white hover:bg-[#EEF0FF] hover:border-[#6B6BFF] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#6B6BFF]/30"
        >
          Sinh câu hỏi Quiz
        </button>
        <button
          type="button"
          id="btn-suggest-chapter"
          onClick={onSuggestChapter}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-white bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] shadow-[0_4px_14px_rgba(70,72,212,0.35)] hover:shadow-[0_6px_20px_rgba(70,72,212,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4648D4]/40"
        >
          <PlusIcon size={13} />
          Gợi ý Chương mới
        </button>
      </div>
    </div>
  );
}

// ─── Filter Tabs + Stats ──────────────────────────────────────────────────────

interface FilterBarProps {
  active: FilterTab;
  onChange: (t: FilterTab) => void;
  total: number;
  published: number;
  draft: number;
  totalHours: string;
  totalChapters: number;
}

function FilterBar({ active, onChange, total, published, draft, totalHours, totalChapters }: FilterBarProps) {
  const TABS: { id: FilterTab; label: string; count: number }[] = [
    { id: "all",    label: "Tất cả",   count: total     },
    { id: "public", label: "Công khai", count: published },
    { id: "draft",  label: "Bản nháp", count: draft     },
  ];

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Tabs */}
      <div className="flex items-center gap-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={twMerge(
              "px-3.5 py-1.5 rounded-xl text-[12px] font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#6B6BFF]/30",
              active === tab.id
                ? "bg-[#6B6BFF] text-white shadow-[0_2px_8px_rgba(107,107,255,0.3)]"
                : "bg-[#F4F4FA] text-[#64647A] hover:bg-[#EAEAF4]",
            )}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Stats */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-[12px] text-[#464554]">
          <ClockIcon size={13} />
          <span className="text-[11px] font-semibold text-[#9090B0]">Tổng thời lượng</span>
          <span className="font-bold text-[#1A1A2E]">{totalHours}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[12px] text-[#464554]">
          <LayersIcon size={13} />
          <span className="text-[11px] font-semibold text-[#9090B0]">Tổng chương</span>
          <span className="font-bold text-[#1A1A2E]">
            {String(totalChapters).padStart(2, "0")} Chương
          </span>
        </div>

        {/* Sort icons */}
        <div className="flex items-center gap-1">
          <button type="button" aria-label="Lọc" className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9090B0] hover:text-[#4648D4] hover:bg-[#EEF0FF] transition-all">
            <FilterIcon size={14} />
          </button>
          <button type="button" aria-label="Sắp xếp" className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9090B0] hover:text-[#4648D4] hover:bg-[#EEF0FF] transition-all">
            <SortIcon size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function AddChapterButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      id="btn-add-chapter"
      onClick={onClick}
      className="w-full flex flex-col items-center justify-center gap-2 py-7 rounded-2xl border-2 border-dashed border-gray-300 bg-white hover:border-[#4F46E5] hover:bg-indigo-50/30 transition-all duration-200 group cursor-pointer shadow-2xs"
    >
      <span className="w-10 h-10 rounded-xl border-2 border-dashed border-gray-300 group-hover:border-[#4F46E5] group-hover:bg-indigo-50 flex items-center justify-center text-gray-400 group-hover:text-[#4F46E5] transition-all">
        <PlusCircleIcon size={20} />
      </span>
      <span className="text-xs font-black text-gray-500 group-hover:text-[#4F46E5] transition-colors duration-200 uppercase tracking-wider">
        Thêm Chuyên Đề / Chương Mới
      </span>
    </button>
  );
}

// ─── Main Container ───────────────────────────────────────────────────────────

export function LessonManagementContainer() {
  const [chapters, setChapters] = useState<Chapter[]>(INITIAL_CHAPTERS);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [activeQuizLesson, setActiveQuizLesson] = useState<string | null>(null);

  // ── Derived stats ───────────────────────────────────────────────────────────
  const allLessons   = totalLessons(chapters);
  const pubLessons   = publishedLessons(chapters);
  const draftLessons = allLessons - pubLessons;
  const duration     = totalDuration(chapters);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const toggleChapter = useCallback((id: string) => {
    setChapters((prev) =>
      prev.map((ch) => ch.id === id ? { ...ch, collapsed: !ch.collapsed } : ch),
    );
  }, []);

  const deleteChapter = useCallback((id: string) => {
    setChapters((prev) => prev.filter((ch) => ch.id !== id));
  }, []);

  const deleteLesson = useCallback((chapterId: string, lessonId: string) => {
    setChapters((prev) =>
      prev.map((ch) =>
        ch.id === chapterId
          ? { ...ch, lessons: ch.lessons.filter((l) => l.id !== lessonId) }
          : ch,
      ),
    );
  }, []);

  const addLesson = useCallback((chapterId: string) => {
    const newLesson: Lesson = {
      id: `l${Date.now()}`,
      title: `Bài học mới`,
      type: "video",
      duration: "00:00",
      status: "draft",
    };
    setChapters((prev) =>
      prev.map((ch) =>
        ch.id === chapterId ? { ...ch, lessons: [...ch.lessons, newLesson] } : ch,
      ),
    );
  }, []);

  const addChapter = useCallback(() => {
    const newChapter: Chapter = {
      id: `ch${Date.now()}`,
      index: chapters.length + 1,
      title: `Chương ${chapters.length + 1}: Chương học mới`,
      lessons: [],
      collapsed: false,
    };
    setChapters((prev) => [...prev, newChapter]);
  }, [chapters.length]);

  // ── Filtered chapters ──────────────────────────────────────────────────────
  const filteredChapters = chapters.map((ch) => ({
    ...ch,
    lessons:
      activeFilter === "all"
        ? ch.lessons
        : ch.lessons.filter((l) =>
            activeFilter === "public" ? l.status === "published" : l.status === "draft",
          ),
  })).filter((ch) => activeFilter === "all" || ch.lessons.length > 0);

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F4F8]">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[900px] mx-auto px-6 py-6 flex flex-col gap-6">
          <Link
            href="/instructor/courses"
            className="flex items-center gap-1.5 text-xs text-[#4F46E5] font-bold hover:underline transition-colors w-fit"
          >
            <ChevronLeftIcon size={14} />
            <span>Quay lại danh sách khóa học</span>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-black text-gray-900 tracking-tight leading-tight">
                Generative AI Masterclass
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Trung tâm quản lý nội dung học liệu và cấu trúc bài giảng AI
              </p>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                id="btn-preview-course"
                onClick={() => alert("Mở giao diện học tập xem trước...")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 transition-all cursor-pointer shadow-2xs"
              >
                <EyeIcon size={14} />
                <span>Xem trước</span>
              </button>
              <button
                type="button"
                id="btn-add-lesson"
                onClick={() => addLesson(chapters[0]?.id || "ch1")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-[#4F46E5] hover:bg-[#4338CA] shadow-2xs transition-all cursor-pointer"
              >
                <PlusIcon size={14} />
                <span>Thêm bài giảng</span>
              </button>
            </div>
          </div>

          <FilterBar
            active={activeFilter}
            onChange={setActiveFilter}
            total={allLessons}
            published={pubLessons}
            draft={draftLessons}
            totalHours={duration}
            totalChapters={chapters.length}
          />

          <div className="flex flex-col gap-4">
            {filteredChapters.map((chapter) => (
              <ChapterCard
                key={chapter.id}
                chapter={chapter}
                onToggle={() => toggleChapter(chapter.id)}
                onAddLesson={() => addLesson(chapter.id)}
                onDeleteLesson={(lid) => deleteLesson(chapter.id, lid)}
                onDelete={() => deleteChapter(chapter.id)}
                onGenerateQuiz={(title) => setActiveQuizLesson(title)}
              />
            ))}

            {filteredChapters.length === 0 && (
              <div className="flex items-center justify-center py-20 text-xs font-bold text-gray-400 bg-white rounded-2xl border border-gray-200">
                Không có bài giảng nào phù hợp với bộ lọc này.
              </div>
            )}
          </div>

          <AIAssistCard
            onQuizGenerate={() => setActiveQuizLesson("Toàn bộ khóa học (General Rubric)")}
            onSuggestChapter={() => addChapter()}
          />

          <AddChapterButton onClick={addChapter} />
        </div>
      </div>

      <LessonAIQuizModal
        isOpen={!!activeQuizLesson}
        lessonTitle={activeQuizLesson || ""}
        onClose={() => setActiveQuizLesson(null)}
      />
    </div>
  );
}


================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\management\AIBanner.tsx
================================================================

// ─── AIBanner ─────────────────────────────────────────────────────────────────
// Promotional AI banner at the top of the course management page (Minimalist Rule #7)

import Link from "next/link";
import { SparklesIcon } from "./icons";

export function AIBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 p-6 flex items-center justify-between shadow-2xs">
      {/* Left content */}
      <div className="relative z-10 flex flex-col gap-3 max-w-lg">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF2FF] text-[#4F46E5] text-xs font-bold w-fit border border-indigo-100">
          <SparklesIcon />
          <span>MindNova AI Assistant</span>
        </div>
        <h2 className="text-[#111827] font-extrabold text-xl tracking-tight">
          Hỗ trợ AI: Sinh đề cương tự động
        </h2>
        <p className="text-[#6B7280] text-sm leading-relaxed font-medium">
          Sử dụng Trí tuệ Nhân tạo để tự động tạo cấu trúc chương học logic và toàn diện dựa trên tiêu đề khóa học chỉ trong vài giây.
        </p>
        <Link
          id="btn-ai-banner-cta"
          href="/instructor/create-course"
          className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#4F46E5] hover:bg-[#4338CA] active:bg-[#3730A3] shadow-2xs hover:shadow-sm transition-all duration-150 w-fit cursor-pointer"
        >
          <SparklesIcon />
          <span>Thử ngay bây giờ</span>
        </Link>
      </div>

      {/* Right decorative graphic (Minimalist Indigo) */}
      <div
        aria-hidden="true"
        className="relative z-10 hidden md:flex items-center justify-center w-32 h-32 mr-4 shrink-0 bg-[#F8FAFC] rounded-2xl border border-gray-100 p-4"
      >
        <svg viewBox="0 0 120 120" fill="none" className="w-full h-full text-[#4F46E5]">
          <circle cx="60" cy="60" r="44" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.2" />
          <circle cx="60" cy="60" r="30" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
          <circle cx="60" cy="32" r="5" fill="currentColor" opacity="0.9" />
          <circle cx="84" cy="48" r="5" fill="currentColor" opacity="0.7" />
          <circle cx="84" cy="72" r="5" fill="currentColor" opacity="0.7" />
          <circle cx="60" cy="88" r="5" fill="currentColor" opacity="0.9" />
          <circle cx="36" cy="72" r="5" fill="currentColor" opacity="0.7" />
          <circle cx="36" cy="48" r="5" fill="currentColor" opacity="0.7" />
          <line x1="60" y1="32" x2="84" y2="48" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
          <line x1="84" y1="48" x2="84" y2="72" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
          <line x1="84" y1="72" x2="60" y2="88" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
          <line x1="60" y1="88" x2="36" y2="72" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
          <line x1="36" y1="72" x2="36" y2="48" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
          <line x1="36" y1="48" x2="60" y2="32" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
          <circle cx="60" cy="60" r="8" fill="currentColor" opacity="0.15" />
          <circle cx="60" cy="60" r="4" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}


================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\management\constants\data.ts
================================================================

import type { Course } from "../types";

// ─── Mock Data — Course Management ────────────────────────────────────────────
// Replace with real API calls in production.

export const MOCK_COURSES: Course[] = [
  {
    id: "1",
    title: "Cơ bản về Generative AI",
    thumbnail: "/thumbnails/generative-ai.jpg",
    status: "published",
    durationHours: 12,
    totalLessons: 45,
  },
  {
    id: "2",
    title: "Deep Learning Nâng Cao",
    thumbnail: "/thumbnails/deep-learning.jpg",
    status: "draft",
    durationHours: 24,
    totalLessons: 82,
  },
  {
    id: "3",
    title: "Nghệ thuật Prompt Engineering",
    thumbnail: "/thumbnails/prompt.jpg",
    status: "published",
    durationHours: 8,
    totalLessons: 30,
  },
  {
    id: "4",
    title: "Python cho Data Science",
    thumbnail: "/thumbnails/python-ds.jpg",
    status: "published",
    durationHours: 30,
    totalLessons: 120,
  },
  {
    id: "5",
    title: "Đạo đức & Bảo mật trong AI",
    thumbnail: "/thumbnails/ethics-ai.jpg",
    status: "draft",
    durationHours: 10,
    totalLessons: 25,
  },
];

export const TOTAL_COURSES = 24;
export const ACTIVE_COURSES = 18;
export const DRAFT_COURSES = 6;

export const MONTHLY_REVENUE = "42,5M ₫";
export const REVENUE_GROWTH = "+12.5%";


================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\management\CourseCard.tsx
================================================================

"use client";

// ─── CourseCard ───────────────────────────────────────────────────────────────
// Individual course card with minimalist white card, crisp border, and indigo actions (Rule #7).

import Link from "next/link";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import type { Course } from "./types";
import {
  PencilIcon,
  BookOpenIcon,
  TagIcon,
  ClockIcon,
} from "./icons";

function StatusBadge({ status }: { status: Course["status"] }) {
  const isPublished = status === "published";
  return (
    <span
      className={twMerge(
        "absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[11px] font-extrabold tracking-wide z-10 shadow-2xs",
        isPublished
          ? "bg-emerald-600 text-white"
          : "bg-gray-800 text-white/90",
      )}
    >
      {isPublished ? "Published" : "Draft"}
    </span>
  );
}

function EditButton({ courseId }: { courseId: string }) {
  return (
    <Link
      href={`/instructor/courses/${courseId}/edit`}
      id={`btn-edit-course-${courseId}`}
      aria-label="Chỉnh sửa khóa học"
      className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#4F46E5] shadow-sm hover:bg-white hover:text-[#4338CA] hover:scale-105 active:scale-95 transition-all duration-150 z-10 cursor-pointer border border-gray-100"
    >
      <PencilIcon />
    </Link>
  );
}

function CourseThumbnail({ title, thumbnail }: Pick<Course, "title" | "thumbnail">) {
  if (!thumbnail) return null;

  return (
    <div className="relative w-full aspect-[16/9] bg-gray-100 overflow-hidden border-b border-gray-100">
      <Image
        src={thumbnail}
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>
  );
}

function CourseActionButtons({ courseId }: { courseId: string }) {
  return (
    <div className="grid grid-cols-2 gap-2 p-3.5 mt-auto border-t border-gray-100 bg-gray-50/50">
      <Link
        href={`/instructor/courses/${courseId}/lessons`}
        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-[#111827] bg-white border border-gray-200 hover:bg-[#EEF2FF] hover:text-[#4F46E5] hover:border-indigo-200 active:scale-98 transition-all duration-150 cursor-pointer shadow-2xs"
      >
        <span className="text-[#4F46E5]">
          <BookOpenIcon />
        </span>
        <span>Nội dung AI</span>
      </Link>

      <Link
        href="/instructor/revenue"
        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-[#111827] bg-white border border-gray-200 hover:bg-[#EEF2FF] hover:text-[#4F46E5] hover:border-indigo-200 active:scale-98 transition-all duration-150 cursor-pointer shadow-2xs"
      >
        <span className="text-[#4F46E5]">
          <TagIcon />
        </span>
        <span>Giá & Doanh thu</span>
      </Link>
    </div>
  );
}

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <article
      aria-label={`Khóa học: ${course.title}`}
      className="group relative flex flex-col rounded-2xl bg-white border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-md transition-all duration-200 shadow-2xs h-full"
    >
      <div className="relative">
        <CourseThumbnail title={course.title} thumbnail={course.thumbnail} />
        <StatusBadge status={course.status} />
        <EditButton courseId={course.id} />
      </div>

      <div className="p-5 flex flex-col gap-2 flex-1">
        <h3 className="text-[16px] font-bold text-[#111827] line-clamp-2 group-hover:text-[#4F46E5] transition-colors duration-150 leading-snug">
          {course.title}
        </h3>
        <p className="flex items-center gap-1.5 text-[13px] text-[#6B7280] font-medium mt-auto">
          <span className="text-gray-400"><ClockIcon /></span>
          <span>{course.durationHours} giờ &bull; {course.totalLessons} bài học</span>
        </p>
      </div>

      <CourseActionButtons courseId={course.id} />
    </article>
  );
}


================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\management\CourseFilterTabs.tsx
================================================================

"use client";

// ─── CourseFilterTabs ─────────────────────────────────────────────────────────
// Filter tabs with minimalist Rule #7 styles: Tất cả / Đang dạy / Bản nháp

import { useState } from "react";
import { twMerge } from "tailwind-merge";
import {
  TOTAL_COURSES,
  ACTIVE_COURSES,
  DRAFT_COURSES,
} from "./constants/data";

type FilterKey = "all" | "active" | "draft";

interface Tab {
  key: FilterKey;
  label: string;
  count: number;
}

const TABS: Tab[] = [
  { key: "all", label: "Tất cả", count: TOTAL_COURSES },
  { key: "active", label: "Đang dạy", count: ACTIVE_COURSES },
  { key: "draft", label: "Bản nháp", count: DRAFT_COURSES },
];

interface CourseFilterTabsProps {
  onFilterChange?: (key: FilterKey) => void;
}

export function CourseFilterTabs({ onFilterChange }: CourseFilterTabsProps) {
  const [active, setActive] = useState<FilterKey>("all");

  function handleSelect(key: FilterKey) {
    setActive(key);
    onFilterChange?.(key);
  }

  return (
    <div
      role="tablist"
      aria-label="Lọc khóa học"
      className="flex items-center gap-1.5 bg-white border border-gray-200 p-1.5 rounded-xl shadow-2xs shrink-0"
    >
      {TABS.map(({ key, label, count }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            id={`tab-${key}`}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => handleSelect(key)}
            className={twMerge(
              "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer",
              isActive
                ? "bg-[#4F46E5] text-white shadow-2xs"
                : "text-[#6B7280] hover:text-[#111827] hover:bg-gray-50",
            )}
          >
            <span>{label}</span>
            <span
              className={twMerge(
                "text-[11px] font-extrabold px-1.5 py-0.5 rounded-md transition-colors",
                isActive
                  ? "bg-white/20 text-white"
                  : "bg-gray-100 text-[#6B7280]",
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}


================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\management\CourseManagementContainer.tsx
================================================================

"use client";

import React from "react";
import { AIBanner } from "./AIBanner";
import { RevenueCard } from "./RevenueCard";
import { CourseFilterTabs } from "./CourseFilterTabs";
import { CourseCard } from "./CourseCard";
import { CreateCourseCard } from "./CreateCourseCard";
import { CoursePagination } from "./CoursePagination";
import { MOCK_COURSES } from "./constants/data";

export function CourseManagementContainer() {
  return (
    <div className="min-h-screen bg-[#F4F4F8] font-sans">
      <div className="max-w-[1200px] w-full mx-auto p-6 lg:p-8 flex flex-col gap-8 pb-20 animate-fadeIn">
        {/* ── Page Header & Filter Tabs ───────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">
              Quản lý khóa học
            </h1>
            <p className="mt-1.5 text-xs text-gray-500 font-medium max-w-xl leading-relaxed">
              Theo dõi, phân tích và tối ưu hóa hệ thống tài liệu giáo dục của bạn với sự hỗ trợ của trí tuệ nhân tạo MindNova AI.
            </p>
          </div>

          <CourseFilterTabs />
        </div>

        {/* ── Banner + Revenue Row ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          <AIBanner />
          <RevenueCard />
        </div>

        {/* ── Course Grid ──────────────────────────────────────────────────────── */}
        <section aria-label="Danh sách khóa học">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {MOCK_COURSES.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
            <CreateCourseCard />
          </div>
        </section>

        {/* ── Pagination ───────────────────────────────────────────────────────── */}
        <CoursePagination />
      </div>
    </div>
  );
}


================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\management\CoursePagination.tsx
================================================================

"use client";

import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";
import { TOTAL_COURSES } from "./constants/data";

const PAGE_SIZE = 6;
const TOTAL_PAGES = Math.ceil(TOTAL_COURSES / PAGE_SIZE);

export function CoursePagination() {
  const [page, setPage] = useState(1);

  const from = (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, TOTAL_COURSES);

  const pages = Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-200 text-xs">
      <p className="font-bold text-gray-500">
        Hiển thị <span className="text-gray-900">{from}–{to}</span> trong số <span className="text-gray-900">{TOTAL_COURSES}</span> khóa học
      </p>

      <div className="flex items-center gap-1.5" role="navigation" aria-label="Phân trang">
        <button
          id="btn-page-prev"
          type="button"
          aria-label="Trang trước"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-600 border border-gray-200 bg-white hover:bg-gray-50 hover:text-gray-900 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shadow-2xs"
        >
          <ChevronLeftIcon />
        </button>
        {pages.map((p) => (
          <button
            key={p}
            id={`btn-page-${p}`}
            type="button"
            aria-label={`Trang ${p}`}
            aria-current={p === page ? "page" : undefined}
            onClick={() => setPage(p)}
            className={twMerge(
              "w-8 h-8 rounded-xl font-extrabold transition-all cursor-pointer shadow-2xs",
              p === page
                ? "bg-[#4F46E5] text-white border border-[#4F46E5]"
                : "text-gray-600 border border-gray-200 bg-white hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            {p}
          </button>
        ))}

        <button
          id="btn-page-next"
          type="button"
          aria-label="Trang sau"
          disabled={page === TOTAL_PAGES}
          onClick={() => setPage((p) => Math.min(TOTAL_PAGES, p + 1))}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-600 border border-gray-200 bg-white hover:bg-gray-50 hover:text-gray-900 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shadow-2xs"
        >
          <ChevronRightIcon />
        </button>
      </div>
    </div>
  );
}


================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\management\CreateCourseCard.tsx
================================================================

// ─── CreateCourseCard ─────────────────────────────────────────────────────────
// Minimalist create course card (Rule #7)

import Link from "next/link";
import { PlusIcon } from "./icons";

export function CreateCourseCard() {
  return (
    <Link
      href="/instructor/create-course"
      id="btn-create-course-card"
      aria-label="Tạo khóa học mới"
      className="group flex flex-col items-center justify-center gap-4 rounded-2xl bg-white border-2 border-dashed border-gray-300 hover:border-[#4F46E5] text-center p-8 hover:bg-[#EEF2FF]/40 active:scale-98 transition-all duration-200 min-h-[220px] cursor-pointer shadow-2xs hover:shadow-sm"
    >
      <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-[#6B7280] group-hover:border-[#4F46E5] group-hover:text-white group-hover:bg-[#4F46E5] group-hover:scale-105 transition-all duration-200 shadow-2xs">
        <PlusIcon size={22} />
      </div>

      <div className="flex flex-col gap-1 max-w-[200px]">
        <p className="text-[15px] font-bold text-[#111827] group-hover:text-[#4F46E5] transition-colors">
          Tạo khóa học mới
        </p>
        <p className="text-[12px] text-[#6B7280] font-medium leading-relaxed">
          Bắt đầu hành trình thiết kế bài giảng AI ngay hôm nay.
        </p>
      </div>
    </Link>
  );
}


================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\management\icons.tsx
================================================================

// ─── Inline SVG icons for Course Management ───────────────────────────────────
// Kept local to avoid importing a heavy icon library.

const BASE = {
  width: 14,
  height: 14,
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor" as const,
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

export function SparklesIcon({ size = 14 }: { size?: number }) {
  return (
    <svg {...BASE} width={size} height={size}>
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  );
}

export function DiscussionsNavIcon() {
  return (
    <svg {...BASE}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

export function PencilIcon() {
  return (
    <svg {...BASE}>
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  );
}

export function PlusIcon({ size = 28 }: { size?: number }) {
  return (
    <svg {...BASE} width={size} height={size} strokeWidth={1.5}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export function UploadIcon() {
  return (
    <svg {...BASE}>
      <polyline points="16 16 12 12 8 16" />
      <line x1="12" y1="12" x2="12" y2="21" />
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
    </svg>
  );
}

export function BookOpenIcon() {
  return (
    <svg {...BASE}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

export function LayersIcon() {
  return (
    <svg {...BASE}>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

export function TagIcon() {
  return (
    <svg {...BASE}>
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

export function ClockIcon() {
  return (
    <svg {...BASE}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export function BellIcon() {
  return (
    <svg {...BASE} width={18} height={18}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

export function MessageIcon() {
  return (
    <svg {...BASE} width={18} height={18}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export function SearchIcon() {
  return (
    <svg {...BASE} width={15} height={15}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

export function ChevronLeftIcon() {
  return (
    <svg {...BASE} width={14} height={14}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

export function ChevronRightIcon() {
  return (
    <svg {...BASE} width={14} height={14}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export function TrendUpIcon() {
  return (
    <svg {...BASE} width={12} height={12}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

// ─── Instructor nav icons ──────────────────────────────────────────────────────

const NAV_SVG = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor" as const,
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

export function CourseManagementNavIcon() {
  return (
    <svg {...NAV_SVG}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

export function StudentManagementNavIcon() {
  return (
    <svg {...NAV_SVG}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export function AITeachingNavIcon() {
  return (
    <svg {...NAV_SVG}>
      <circle cx="12" cy="12" r="2.5" />
      <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
    </svg>
  );
}

export function RevenueNavIcon() {
  return (
    <svg {...NAV_SVG}>
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

export function SettingsNavIcon() {
  return (
    <svg {...NAV_SVG}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

export function HelpNavIcon() {
  return (
    <svg {...NAV_SVG}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}


================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\management\index.ts
================================================================

// ─── Instructor Management — Public API ──────────────────────────────────────

export { CourseManagementContainer } from "./CourseManagementContainer";
export { InstructorSidebar } from "./InstructorSidebar";
export { InstructorTopbar } from "./InstructorTopbar";
export { AIBanner } from "./AIBanner";
export { RevenueCard } from "./RevenueCard";
export { CourseCard } from "./CourseCard";
export { CreateCourseCard } from "./CreateCourseCard";
export { CourseFilterTabs } from "./CourseFilterTabs";
export { CoursePagination } from "./CoursePagination";
export type * from "./types";


================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\management\InstructorSidebar.tsx
================================================================

"use client";

// ─── InstructorSidebar (Modular & Data-Driven via Props) ────────────────────────
// Dedicated sidebar for the instructor dashboard using data-driven configuration.

import React from "react";
import Link from "next/link";
import {
  Sidebar as RootSidebar,
  SidebarLogo,
  useSidebar,
  type SidebarGroupConfig,
} from "@/src/components/ui";
import {
  CourseManagementNavIcon,
  StudentManagementNavIcon,
  AITeachingNavIcon,
  RevenueNavIcon,
  SettingsNavIcon,
  HelpNavIcon,
  DiscussionsNavIcon,
} from "./icons";

// ─── Sub-components ───────────────────────────────────────────────────────────

function LogoMark() {
  return (
    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4648D4] to-[#383AB8] text-white flex items-center justify-center font-black text-lg shadow-md shrink-0 border border-indigo-100">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="2.5" fill="white" />
        <path
          d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function CreateCourseCTA() {
  const { setMobileOpen } = useSidebar();
  return (
    <div className="px-1 py-1 shrink-0">
      <Link
        href="/instructor/create-course"
        onClick={() => {
          if (typeof window !== "undefined" && window.innerWidth < 768) {
            setMobileOpen(false);
          }
        }}
        title="Create New Course"
        className="flex items-center justify-center gap-2 px-4 py-3 w-full rounded-xl text-xs font-black text-white bg-[#4648D4] hover:bg-[#383AB8] shadow-md transition-all duration-200"
      >
        <svg aria-hidden viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" className="shrink-0">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        <span className="truncate tracking-wide uppercase font-black">TẠO KHÓA HỌC MỚI</span>
      </Link>
    </div>
  );
}

function SidebarUserProfile() {
  return (
    <div className="flex items-center gap-3 py-2 px-2">
      <div className="w-9 h-9 rounded-full bg-[#4648D4]/15 text-[#4648D4] flex items-center justify-center text-sm font-black shadow-2xs shrink-0 border border-[#4648D4]/20">
        N
      </div>
      <div className="flex flex-col min-w-0 leading-tight">
        <span className="text-sm font-black text-gray-900 truncate">Nguyễn Minh Anh</span>
        <span className="text-[11px] text-gray-500 font-bold truncate">Senior AI Instructor</span>
      </div>
    </div>
  );
}

// ─── Main Data-Driven Export ──────────────────────────────────────────────────

export function InstructorSidebar() {
  // TRUYỀN DATA BẰNG PROPS
  const instructorGroups: SidebarGroupConfig[] = [
    {
      title: "QUẢN LÝ & GIẢNG DẠY",
      items: [
        { label: "Quản lý Khóa học", href: "/instructor", icon: <CourseManagementNavIcon /> },
        { label: "Tạo Khóa Học AI", href: "/instructor/create-course", icon: <AITeachingNavIcon /> },
        { label: "Thảo luận & Hỏi đáp", href: "/instructor/discussions", icon: <DiscussionsNavIcon /> },
        { label: "Phân tích Học viên", href: "/instructor/analytics", icon: <StudentManagementNavIcon /> },
        { label: "Quản lý Doanh thu", href: "/instructor/revenue", icon: <RevenueNavIcon /> },
      ],
    },
  ];

  return (
    <RootSidebar
      header={
        <SidebarLogo
          href="/instructor"
          logoText="Instructor Portal"
          subText="Professional Suite"
          icon={<LogoMark />}
        />
      }
      groups={instructorGroups}
      cta={<CreateCourseCTA />}
      footer={<SidebarUserProfile />}
    />
  );
}


================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\management\InstructorTopbar.tsx
================================================================

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { BellIcon } from "./icons";
import { SidebarOpenButton, ActorSwitcher } from "@/src/components/ui";

const NAV_SVG = {
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor" as const,
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

function HelpIcon() {
  return (
    <svg {...NAV_SVG} width={18} height={18}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function UserAvatar() {
  return (
    <div className="w-9 h-9 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] flex items-center justify-center text-white text-[13px] font-extrabold shadow-sm shrink-0 cursor-pointer hover:scale-105 transition-all">
      MN
    </div>
  );
}

export interface AlertItem {
  id: string;
  title: string;
  desc: string;
  type: "urgent" | "info" | "security";
  timestamp: string;
  actionText?: string;
  actionHref?: string;
  read: boolean;
}

const INITIAL_ALERTS: AlertItem[] = [
  {
    id: "alt-1",
    title: "Thảo luận cần phản hồi (Mentoring SLA)",
    desc: "3 học viên đặt câu hỏi trong 'UI/UX Design Masterclass' đang chờ phản hồi từ bạn.",
    type: "urgent",
    timestamp: "10 phút trước",
    actionText: "Mở Hòm thư Hỏi đáp ➔",
    actionHref: "/instructor/discussions",
    read: false,
  },
  {
    id: "alt-2",
    title: "Chu kỳ thanh toán học phí hoàn tất",
    desc: "15,400,000đ từ doanh thu học phí đã hoàn tất thời gian bảo lưu 30 ngày và chuyển vào Số dư Khả dụng.",
    type: "info",
    timestamp: "2 giờ trước",
    actionText: "Xem Doanh thu ➔",
    actionHref: "/instructor/revenue",
    read: false,
  },
  {
    id: "alt-3",
    title: "Bảo mật dữ liệu học viên được kích hoạt",
    desc: "Hệ thống tự động mã hóa thông tin thanh toán và tài khoản của học viên trong các báo cáo xuất dữ liệu.",
    type: "security",
    timestamp: "1 ngày trước",
    read: true,
  },
];

export function InstructorTopbar() {
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const unreadCount = alerts.filter((a) => !a.read).length;

  const markAllRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  };

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <header className="h-16 shrink-0 flex items-center justify-between px-6 bg-white border-b border-gray-200 relative z-40 shadow-2xs">
      {/* Brand & Context */}
      <div className="flex items-center gap-3">
        <SidebarOpenButton />
        <Link
          href="/instructor"
          className="text-lg font-black text-[#111827] tracking-tight hover:text-[#4F46E5] transition-colors shrink-0 flex items-center gap-2"
        >
          <span>MindNova Instructor</span>
          <span className="text-[10px] font-extrabold bg-[#EEF2FF] text-[#4F46E5] px-2.5 py-0.5 rounded-full border border-indigo-100">
            PRO
          </span>
        </Link>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        
        {/* Proactive SLA Badge (Clean style per Rule #7) */}
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={() => setIsAlertOpen((p) => !p)}
            className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gray-50 text-[#111827] border border-gray-200 hover:bg-[#EEF2FF] hover:text-[#4F46E5] hover:border-indigo-100 text-xs font-bold transition-all cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
            <span>{unreadCount} thảo luận mới</span>
          </button>
        )}

        {/* Bell Button */}
        <div className="relative">
          <button
            type="button"
            aria-label="Toggle Alert Center"
            onClick={() => setIsAlertOpen((p) => !p)}
            className={twMerge(
              "relative w-9 h-9 rounded-xl flex items-center justify-center border border-gray-200 transition-all cursor-pointer",
              isAlertOpen ? "bg-[#4F46E5] text-white border-[#4F46E5] shadow-2xs" : "bg-gray-50 text-[#6B7280] hover:bg-[#EEF2FF] hover:text-[#4F46E5] hover:border-indigo-100"
            )}
          >
            <BellIcon />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center border-2 border-white px-0.5">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Interactive Alert Dropdown */}
          {isAlertOpen && (
            <div className="absolute right-0 top-12 w-80 sm:w-96 rounded-2xl bg-white border border-gray-200 shadow-lg p-5 flex flex-col gap-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h3 className="text-sm font-extrabold text-[#111827] flex items-center gap-2">
                    <span>Thông báo Giảng viên</span>
                  </h3>
                  <p className="text-[11px] text-[#6B7280] font-medium mt-0.5">Cập nhật thảo luận & doanh thu</p>
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllRead}
                    className="text-xs font-bold text-[#4F46E5] hover:underline whitespace-nowrap cursor-pointer"
                  >
                    Đọc tất cả
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                {alerts.length === 0 ? (
                  <div className="py-8 text-center text-xs font-medium text-[#6B7280]">
                    Bạn không có thông báo mới nào.
                  </div>
                ) : (
                  alerts.map((item) => (
                    <div
                      key={item.id}
                      className={twMerge(
                        "p-3.5 rounded-xl border transition-all flex flex-col gap-1.5 relative",
                        !item.read ? "bg-[#F8FAFC] border-indigo-100 shadow-2xs" : "bg-white border-gray-100 opacity-70"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold text-[#111827] leading-snug">{item.title}</span>
                        <button
                          type="button"
                          onClick={() => dismissAlert(item.id)}
                          className="text-[#6B7280] hover:text-red-600 font-bold text-xs px-1 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>

                      <p className="text-xs text-[#6B7280] leading-relaxed">{item.desc}</p>
                      
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] font-bold text-gray-400">{item.timestamp}</span>
                        {item.actionText && item.actionHref && (
                          <Link
                            href={item.actionHref}
                            onClick={() => setIsAlertOpen(false)}
                            className="text-[11px] font-bold text-[#4F46E5] hover:underline flex items-center gap-1"
                          >
                            {item.actionText}
                          </Link>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setIsAlertOpen(false)}
                  className="text-xs font-bold text-[#6B7280] hover:text-[#111827] cursor-pointer"
                >
                  Đóng lại
                </button>
              </div>

            </div>
          )}
        </div>

        <ActorSwitcher />

        {/* Avatar */}
        <UserAvatar />
      </div>
    </header>
  );
}


================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\management\RevenueCard.tsx
================================================================

// ─── RevenueCard ──────────────────────────────────────────────────────────────
// Monthly revenue summary card shown next to the AI banner (Minimalist Rule #7)

import Link from "next/link";
import { TrendUpIcon } from "./icons";
import { MONTHLY_REVENUE, REVENUE_GROWTH } from "./constants/data";

export function RevenueCard() {
  return (
    <div className="rounded-2xl bg-white border border-gray-200 p-6 flex flex-col justify-between h-full min-h-[120px] shadow-2xs">
      <div className="flex flex-col gap-2">
        <p className="text-[#6B7280] text-[11px] font-extrabold uppercase tracking-widest">
          Doanh thu tháng này
        </p>

        <p className="text-[#111827] text-2xl font-black tracking-tight mt-1">
          {MONTHLY_REVENUE}
        </p>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-100 w-fit mt-1">
          <span className="text-emerald-600 font-bold">
            <TrendUpIcon />
          </span>
          <span className="text-emerald-700 text-[12px] font-bold">
            +{REVENUE_GROWTH}
          </span>
          <span className="text-[#6B7280] text-[11px] font-medium">so với tháng trước</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
        <span className="text-[#6B7280] font-medium">Trạng thái: Ổn định</span>
        <Link href="/instructor/revenue" className="text-[#4F46E5] font-bold hover:underline cursor-pointer">
          Chi tiết ➔
        </Link>
      </div>
    </div>
  );
}


================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\management\types\index.ts
================================================================

// ─── Instructor Course Management — Types ─────────────────────────────────────

export type CourseStatus = "published" | "draft";

export type CourseAction = "upload" | "lessons" | "curriculum" | "pricing";

export interface Course {
  id: string;
  title: string;
  /** Thumbnail image URL or null for the "create new" placeholder */
  thumbnail: string | null;
  status: CourseStatus;
  durationHours: number;
  totalLessons: number;
}

export interface CourseStat {
  label: string;
  count: number;
}


================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\pricing\CouponSection.tsx
================================================================

"use client";

// ─── CouponSection ────────────────────────────────────────────────────────────
// Quản lý mã giảm giá — hiển thị table + dialog tạo mã mới.

import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { GiftIcon, PlusCircleIcon, PencilIcon, TrashIcon } from "./icons";

// ─── Types ────────────────────────────────────────────────────────────────────

type CouponStatus = "active" | "expired";
type DiscountType = "percent" | "fixed";

interface Coupon {
  id: string;
  code: string;
  type: DiscountType;
  value: string;
  used: number;
  total: number;
  status: CouponStatus;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const INITIAL_COUPONS: Coupon[] = [
  { id: "c1", code: "MINDNOVA20", type: "percent",  value: "20%",         used: 45, total: 100, status: "active"  },
  { id: "c2", code: "SUMMERAI",   type: "fixed",    value: "200.000 VNĐ", used: 12, total: 50,  status: "active"  },
  { id: "c3", code: "EARLYBIRD",  type: "percent",  value: "35%",         used: 50, total: 50,  status: "expired" },
];

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: CouponStatus }) {
  const isActive = status === "active";
  return (
    <span
      className={twMerge(
        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold",
        isActive
          ? "bg-emerald-100 text-emerald-700"
          : "bg-[#F0F0F8] text-[#9090B0]",
      )}
    >
      <span
        className={twMerge(
          "w-1.5 h-1.5 rounded-full",
          isActive ? "bg-emerald-500" : "bg-[#C0C0D8]",
        )}
      />
      {isActive ? "Đang hoạt động" : "Đã kết thúc"}
    </span>
  );
}

// ─── Create Coupon Dialog ─────────────────────────────────────────────────────

interface CreateDialogProps {
  onClose: () => void;
  onAdd: (coupon: Coupon) => void;
}

function CreateCouponDialog({ onClose, onAdd }: CreateDialogProps) {
  const [code, setCode] = useState("");
  const [type, setType] = useState<DiscountType>("percent");
  const [value, setValue] = useState("");
  const [total, setTotal] = useState("100");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !value.trim()) return;
    onAdd({
      id: `c${Date.now()}`,
      code: code.trim().toUpperCase(),
      type,
      value: type === "percent" ? `${value}%` : `${value} VNĐ`,
      used: 0,
      total: Number(total) || 100,
      status: "active",
    });
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          role="dialog"
          aria-modal
          aria-label="Tạo mã giảm giá mới"
          className="pointer-events-auto w-full max-w-[420px] bg-white rounded-2xl border border-[#EAEAF4] shadow-[0_20px_60px_rgba(70,72,212,0.15)] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-[#F0F0F8]">
            <div className="w-8 h-8 rounded-xl bg-[#EEF0FF] text-[#6B6BFF] flex items-center justify-center">
              <GiftIcon size={15} />
            </div>
            <div className="flex-1">
              <h3 className="text-[14px] font-bold text-[#1A1A2E]">Tạo mã giảm giá</h3>
              <p className="text-[11px] text-[#9090B0]">Tạo mã ưu đãi cho khóa học của bạn</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng"
              className="w-7 h-7 rounded-lg text-[#9090B0] hover:bg-[#F4F4FA] hover:text-[#1A1A2E] flex items-center justify-center transition-all duration-150"
            >
              ✕
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-5 py-5">
            {/* Code */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="coupon-code" className="text-[12px] font-semibold text-[#464554]">
                Mã code
              </label>
              <input
                id="coupon-code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="VD: SUMMER2025"
                required
                className="h-10 px-3 rounded-xl border border-[#DDDDF0] bg-[#FAFAFE] text-sm font-mono text-[#1A1A2E] placeholder:text-[#C4C4D8] focus:outline-none focus:border-[#6B6BFF] focus:ring-2 focus:ring-[#6B6BFF]/15 transition-all duration-150"
              />
            </div>

            {/* Type */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[12px] font-semibold text-[#464554]">Loại giảm giá</span>
              <div className="grid grid-cols-2 gap-2">
                {(["percent", "fixed"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={twMerge(
                      "py-2 rounded-xl border text-[12px] font-semibold transition-all duration-150",
                      type === t
                        ? "border-[#6B6BFF] bg-[#F5F3FF] text-[#4648D4]"
                        : "border-[#EAEAF4] text-[#9090B0] hover:border-[#C5C6FF]",
                    )}
                  >
                    {t === "percent" ? "Phần trăm (%)" : "Cố định (đ)"}
                  </button>
                ))}
              </div>
            </div>

            {/* Value + Total */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="coupon-value" className="text-[12px] font-semibold text-[#464554]">
                  Giá trị
                </label>
                <div className="flex rounded-xl border border-[#DDDDF0] bg-[#FAFAFE] overflow-hidden focus-within:border-[#6B6BFF] focus-within:ring-2 focus-within:ring-[#6B6BFF]/15">
                  <input
                    id="coupon-value"
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="0"
                    required
                    min="0"
                    className="flex-1 h-10 px-3 text-sm text-[#1A1A2E] bg-transparent focus:outline-none"
                  />
                  <span className="h-10 flex items-center px-2.5 text-[11px] font-bold text-[#4648D4] border-l border-[#DDDDF0] bg-[#F0F0FF]">
                    {type === "percent" ? "%" : "VNĐ"}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="coupon-total" className="text-[12px] font-semibold text-[#464554]">
                  Số lượng tối đa
                </label>
                <input
                  id="coupon-total"
                  type="number"
                  value={total}
                  onChange={(e) => setTotal(e.target.value)}
                  min="1"
                  className="h-10 px-3 rounded-xl border border-[#DDDDF0] bg-[#FAFAFE] text-sm text-[#1A1A2E] focus:outline-none focus:border-[#6B6BFF] focus:ring-2 focus:ring-[#6B6BFF]/15 transition-all duration-150"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 h-10 rounded-xl border border-[#EAEAF4] text-sm text-[#64647A] hover:bg-[#F4F4FA] transition-all duration-150"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 h-10 rounded-xl bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] text-sm font-semibold text-white shadow-[0_4px_14px_rgba(70,72,212,0.35)] hover:shadow-[0_6px_20px_rgba(70,72,212,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                Tạo mã
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

// ─── Coupon Table Row ─────────────────────────────────────────────────────────

function CouponRow({
  coupon,
  onDelete,
}: {
  coupon: Coupon;
  onDelete: (id: string) => void;
}) {
  return (
    <tr className="group hover:bg-[#FAFAFE] transition-colors duration-100">
      <td className="px-4 py-3 text-left">
        <span className="font-mono text-[13px] font-bold text-[#4648D4] bg-[#EEF0FF] px-2 py-0.5 rounded-md">
          {coupon.code}
        </span>
      </td>
      <td className="px-4 py-3 text-[12px] text-[#464554]">
        {coupon.type === "percent" ? "Phần trăm (%)" : "Cố định (đ)"}
      </td>
      <td className="px-4 py-3 text-[13px] font-semibold text-[#1A1A2E]">
        {coupon.value}
      </td>
      <td className="px-4 py-3 text-[12px] text-[#464554]">
        <span className="font-semibold text-[#1A1A2E]">{coupon.used}</span>
        <span className="text-[#9090B0]">/{coupon.total}</span>
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={coupon.status} />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <button
            type="button"
            aria-label={`Sửa mã ${coupon.code}`}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9090B0] hover:text-[#4648D4] hover:bg-[#EEF0FF] transition-all duration-150"
          >
            <PencilIcon size={13} />
          </button>
          <button
            type="button"
            aria-label={`Xóa mã ${coupon.code}`}
            onClick={() => onDelete(coupon.id)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9090B0] hover:text-red-500 hover:bg-red-50 transition-all duration-150"
          >
            <TrashIcon size={13} />
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export function CouponSection() {
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [showDialog, setShowDialog] = useState(false);

  const handleAdd = (c: Coupon) => setCoupons((prev) => [c, ...prev]);
  const handleDelete = (id: string) =>
    setCoupons((prev) => prev.filter((c) => c.id !== id));

  return (
    <>
      <div className="rounded-2xl border border-[#EAEAF4] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#F0F0F8]">
          <div className="flex items-center gap-2 flex-1">
            <span className="w-6 h-6 rounded-md bg-[#EEF0FF] text-[#6B6BFF] flex items-center justify-center">
              <GiftIcon size={14} />
            </span>
            <div>
              <p className="text-[14px] font-bold text-[#1A1A2E]">Quản lý mã giảm giá</p>
              <p className="text-[11px] text-[#9090B0]">
                Tạo mã ưu đãi để thúc đẩy doanh số bán hàng trong các dịp đặc biệt.
              </p>
            </div>
          </div>
          <button
            type="button"
            id="btn-create-coupon"
            onClick={() => setShowDialog(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-semibold text-[#4648D4] bg-[#EEF0FF] border border-[#D5D5FF] hover:bg-[#6B6BFF] hover:text-white hover:border-transparent hover:shadow-[0_4px_12px_rgba(107,107,255,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#6B6BFF]/30"
          >
            <PlusCircleIcon size={13} />
            Tạo mã mới
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAFAFE] border-b border-[#F0F0F8]">
                {["Mã Code", "Loại Giảm", "Giá Trị", "Số Lượng", "Trạng Thái", "Thao Tác"].map(
                  (col) => (
                    <th
                      key={col}
                      className="px-4 py-2.5 text-[11px] font-bold text-[#9090B0] tracking-wide uppercase whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F4FA]">
              {coupons.map((c) => (
                <CouponRow key={c.id} coupon={c} onDelete={handleDelete} />
              ))}
              {coupons.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-[13px] text-[#B0B0C8]">
                    Chưa có mã giảm giá nào. Hãy tạo mã đầu tiên!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showDialog && (
        <CreateCouponDialog
          onClose={() => setShowDialog(false)}
          onAdd={handleAdd}
        />
      )}
    </>
  );
}


================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\pricing\icons.tsx
================================================================

// ─── Pricing Feature — Icons ──────────────────────────────────────────────────

const BASE = {
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor" as const,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

export function SparklesIcon({ size = 14 }: { size?: number }) {
  return (
    <svg {...BASE} width={size} height={size} strokeWidth={2}>
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  );
}

export function SaveIcon({ size = 14 }: { size?: number }) {
  return (
    <svg {...BASE} width={size} height={size} strokeWidth={2}>
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}

export function TagIcon({ size = 14 }: { size?: number }) {
  return (
    <svg {...BASE} width={size} height={size} strokeWidth={2}>
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

export function PlusCircleIcon({ size = 14 }: { size?: number }) {
  return (
    <svg {...BASE} width={size} height={size} strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}

export function PencilIcon({ size = 13 }: { size?: number }) {
  return (
    <svg {...BASE} width={size} height={size} strokeWidth={2}>
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  );
}

export function TrashIcon({ size = 13 }: { size?: number }) {
  return (
    <svg {...BASE} width={size} height={size} strokeWidth={2}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

export function TrendUpIcon({ size = 13 }: { size?: number }) {
  return (
    <svg {...BASE} width={size} height={size} strokeWidth={2}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

export function InfoIcon({ size = 13 }: { size?: number }) {
  return (
    <svg {...BASE} width={size} height={size} strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

export function GiftIcon({ size = 16 }: { size?: number }) {
  return (
    <svg {...BASE} width={size} height={size} strokeWidth={2}>
      <polyline points="20 12 20 22 4 22 4 12" />
      <rect x="2" y="7" width="20" height="5" />
      <line x1="12" y1="22" x2="12" y2="7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  );
}

export function CheckIcon({ size = 13 }: { size?: number }) {
  return (
    <svg {...BASE} width={size} height={size} strokeWidth={2.5}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function ChevronRightIcon({ size = 14 }: { size?: number }) {
  return (
    <svg {...BASE} width={size} height={size} strokeWidth={2}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export function FreeIcon({ size = 22 }: { size?: number }) {
  return (
    <svg {...BASE} width={size} height={size} strokeWidth={1.7}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export function PaidIcon({ size = 22 }: { size?: number }) {
  return (
    <svg {...BASE} width={size} height={size} strokeWidth={1.7}>
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}

export function SubscribeIcon({ size = 22 }: { size?: number }) {
  return (
    <svg {...BASE} width={size} height={size} strokeWidth={1.7}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}


================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\pricing\index.ts
================================================================

// ─── Pricing Feature — Public API ────────────────────────────────────────────

export { PricingContainer } from "./PricingContainer";


================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\pricing\PricingContainer.tsx
================================================================

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { PricingModelSection } from "./PricingModelSection";
import { CouponSection } from "./CouponSection";
import { SaveIcon, ChevronRightIcon } from "./icons";

const TABS = [
  { id: "pricing", label: "Giá & Kiếm tiền" },
  { id: "content", label: "Nội dung học liệu" },
  { id: "students", label: "Học viên đăng ký" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function PageTabs({ active, onChange }: { active: TabId; onChange: (t: TabId) => void }) {
  return (
    <div className="flex items-center gap-2 border-b border-gray-200 px-6 bg-white">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={twMerge(
            "relative px-4 py-3 text-xs font-black transition-all duration-150 cursor-pointer",
            active === tab.id ? "text-[#4F46E5]" : "text-gray-400 hover:text-gray-700"
          )}
        >
          {tab.label}
          <span
            className={twMerge(
              "absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#4F46E5] transition-all duration-200",
              active === tab.id ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
            )}
          />
        </button>
      ))}
    </div>
  );
}

function Breadcrumb() {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
      <Link href="/instructor/courses" className="hover:text-[#4F46E5] transition-colors">
        Khóa học của tôi
      </Link>
      <ChevronRightIcon size={12} />
      <span className="text-gray-700">Generative AI Masterclass 2026</span>
    </nav>
  );
}

function PageHeader({ onSave }: { onSave: () => void }) {
  return (
    <div className="px-6 pt-5 pb-4 bg-white border-b border-gray-200 shadow-2xs">
      <Breadcrumb />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-2.5 gap-3">
        <div>
          <h1 className="text-lg font-black text-gray-900 tracking-tight">
            Quản Lý Giá &amp; Kiếm Tiền: Generative AI Masterclass
          </h1>
          <p className="text-xs text-gray-500 mt-0.5 max-w-[540px] leading-relaxed">
            Cấu hình mô hình doanh thu, định giá niêm yết và quản lý các chiến lược mã giảm giá khuyến mãi cho khóa học của bạn trên sàn MindNova AI.
          </p>
        </div>
        <button
          type="button"
          id="btn-save-pricing"
          onClick={onSave}
          className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-extrabold text-white bg-[#4F46E5] hover:bg-[#4338CA] shadow-2xs transition-all cursor-pointer shrink-0"
        >
          <SaveIcon size={14} />
          <span>Lưu thiết lập</span>
        </button>
      </div>
    </div>
  );
}

function SaveToast({ visible }: { visible: boolean }) {
  return (
    <div
      className={twMerge(
        "fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-900 text-white text-xs font-bold shadow-lg transition-all duration-300",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      )}
    >
      <span className="w-4.5 h-4.5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px] font-black">
        ✓
      </span>
      Đã cập nhật chiến lược định giá thành công!
    </div>
  );
}

export function PricingContainer() {
  const [activeTab, setActiveTab] = useState<TabId>("pricing");
  const [toastVisible, setToastVisible] = useState(false);

  const handleSave = () => {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2800);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-[#F4F4F8]">
      {/* Sticky page header & tab bar */}
      <div className="sticky top-0 z-10 bg-white shadow-2xs">
        <PageHeader onSave={handleSave} />
        <PageTabs active={activeTab} onChange={setActiveTab} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        {activeTab === "pricing" && (
          <div className="max-w-[900px] mx-auto flex flex-col gap-6 pb-12 animate-fadeIn">
            <PricingModelSection />
            <CouponSection />
          </div>
        )}

        {activeTab === "content" && (
          <div className="max-w-[900px] mx-auto flex items-center justify-center py-24 text-gray-400 font-bold text-xs">
            📚 Danh sách bài giảng và nội dung học liệu AI sẽ hiển thị tại tab này.
          </div>
        )}

        {activeTab === "students" && (
          <div className="max-w-[900px] mx-auto flex items-center justify-center py-24 text-gray-400 font-bold text-xs">
            👥 Báo cáo chuyên sâu và danh sách học viên đăng ký khóa học sẽ hiển thị tại đây.
          </div>
        )}
      </div>

      <SaveToast visible={toastVisible} />
    </div>
  );
}


================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\pricing\PricingModelSection.tsx
================================================================

"use client";

// ─── PricingModelSection ──────────────────────────────────────────────────────
// Card chọn mô hình định giá + input giá cơ bản & khuyến mãi.

import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { SparklesIcon, CheckIcon, InfoIcon, FreeIcon, PaidIcon, SubscribeIcon } from "./icons";

// ─── Types ────────────────────────────────────────────────────────────────────

type PricingModel = "free" | "paid" | "subscription";

interface ModelOption {
  id: PricingModel;
  label: string;
  description: string;
  Icon: React.FC<{ size?: number }>;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const MODELS: ModelOption[] = [
  {
    id: "free",
    label: "Cung cấp miễn phí",
    description: "Thu hút học viên & xây dựng cộng đồng.",
    Icon: FreeIcon,
  },
  {
    id: "paid",
    label: "Cung cấp trả phí",
    description: "Tối ưu hóa doanh thu từ nội dung cao cấp.",
    Icon: PaidIcon,
  },
  {
    id: "subscription",
    label: "Cho thuê",
    description: "Cho phép truy cập trong thời gian giới hạn.",
    Icon: SubscribeIcon,
  },
];

// ─── AI Insight Panel ─────────────────────────────────────────────────────────

function AIInsightPanel({ onApply }: { onApply: (price: string) => void }) {
  return (
    <div className="rounded-xl border border-[#DDD9FF] bg-[#F7F5FF] p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <SparklesIcon size={14} />
        <span className="text-[12px] font-bold text-[#4648D4] tracking-wide uppercase">
          AI Pricing Insight
        </span>
      </div>
      <p className="text-[12px] text-[#64647A] leading-relaxed">
        Dựa trên 24 khóa học tương tự về AI, mức giá tối ưu cho thị trường Việt Nam là:
      </p>

      {/* Price range bar */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between text-[11px] font-semibold text-[#4648D4]">
          <span>890k</span>
          <span>1.1M</span>
        </div>
        <div className="h-2 rounded-full bg-[#DDD9FF] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#6B6BFF] to-[#4648D4]"
            style={{ width: "65%" }}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={() => onApply("990.000")}
        className="w-full py-2 rounded-lg border border-[#6B6BFF] text-[12px] font-semibold text-[#4648D4] hover:bg-[#6B6BFF] hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#6B6BFF]/30"
      >
        Áp dụng giá gợi ý
      </button>
    </div>
  );
}

// ─── Revenue Stat Panel ───────────────────────────────────────────────────────

function RevenueStatPanel() {
  return (
    <div className="rounded-xl border border-[#EAEAF4] bg-[#FAFAFE] p-4 flex flex-col gap-2">
      <span className="text-[10px] font-bold text-[#9090B0] tracking-widest uppercase">
        Thống kê doanh thu dự kiến
      </span>
      <div className="flex items-end gap-2">
        <span className="text-[22px] font-extrabold text-[#1A1A2E] leading-none">
          24.5M
        </span>
        <span className="text-[13px] text-[#9090B0] mb-0.5">/tháng</span>
      </div>
      <div className="flex items-center gap-1.5 text-emerald-600 text-[12px] font-semibold">
        <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
          ↑
        </span>
        +12% so với trung bình
      </div>
    </div>
  );
}

// ─── Model Option Card ────────────────────────────────────────────────────────

function ModelCard({
  option,
  isSelected,
  onSelect,
}: {
  option: ModelOption;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isSelected}
      className={twMerge(
        "relative flex flex-col items-center gap-2 p-4 rounded-xl border text-center cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#6B6BFF]/30",
        isSelected
          ? "border-[#6B6BFF] bg-[#F5F3FF] shadow-[0_0_0_3px_rgba(107,107,255,0.18)]"
          : "border-[#EAEAF4] bg-white hover:border-[#C5C6FF] hover:bg-[#FAFAFE]",
      )}
    >
      {/* Radio dot */}
      <span
        className={twMerge(
          "absolute top-2.5 right-2.5 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200",
          isSelected
            ? "border-[#6B6BFF] bg-[#6B6BFF]"
            : "border-[#D0D0E8] bg-white",
        )}
      >
        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
      </span>

      {/* Icon */}
      <span
        className={twMerge(
          "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200",
          isSelected
            ? "bg-[#6B6BFF]/15 text-[#6B6BFF]"
            : "bg-[#F4F4FA] text-[#9090B0]",
        )}
      >
        <option.Icon size={22} />
      </span>

      <span
        className={twMerge(
          "text-[12px] font-semibold leading-snug transition-colors duration-150",
          isSelected ? "text-[#1A1A2E]" : "text-[#464554]",
        )}
      >
        {option.label}
      </span>
      <span className="text-[11px] text-[#9090B0] leading-relaxed">
        {option.description}
      </span>
    </button>
  );
}

// ─── Price Inputs ─────────────────────────────────────────────────────────────

function PriceInputs({
  basePrice,
  salePrice,
  onBaseChange,
  onSaleChange,
}: {
  basePrice: string;
  salePrice: string;
  onBaseChange: (v: string) => void;
  onSaleChange: (v: string) => void;
}) {
  return (
    <div className="flex items-start gap-4 flex-wrap">
      {/* Base price */}
      <div className="flex flex-col gap-1.5 flex-1 min-w-[160px]">
        <label htmlFor="base-price" className="text-[12px] font-semibold text-[#464554]">
          Giá cơ bản
        </label>
        <div className="flex items-center gap-0 rounded-xl border border-[#DDDDF0] bg-[#FAFAFE] overflow-hidden focus-within:border-[#6B6BFF] focus-within:ring-2 focus-within:ring-[#6B6BFF]/15 transition-all duration-150">
          <input
            id="base-price"
            type="text"
            value={basePrice}
            onChange={(e) => onBaseChange(e.target.value)}
            placeholder="0"
            className="flex-1 h-10 px-3 text-sm font-semibold text-[#1A1A2E] bg-transparent focus:outline-none placeholder:text-[#C4C4D8]"
          />
          <span className="h-10 flex items-center px-3 text-[12px] font-bold text-[#4648D4] border-l border-[#DDDDF0] bg-[#F0F0FF]">
            VND
          </span>
        </div>
      </div>

      {/* Sale price */}
      <div className="flex flex-col gap-1.5 flex-1 min-w-[160px]">
        <label htmlFor="sale-price" className="text-[12px] font-semibold text-[#464554]">
          Giá khuyến mãi <span className="font-normal text-[#9090B0]">(Tùy chọn)</span>
        </label>
        <div className="flex items-center gap-0 rounded-xl border border-[#DDDDF0] bg-[#FAFAFE] overflow-hidden focus-within:border-[#6B6BFF] focus-within:ring-2 focus-within:ring-[#6B6BFF]/15 transition-all duration-150">
          <input
            id="sale-price"
            type="text"
            value={salePrice}
            onChange={(e) => onSaleChange(e.target.value)}
            placeholder="Nhập giá ưu đãi..."
            className="flex-1 h-10 px-3 text-sm text-[#1A1A2E] bg-transparent focus:outline-none placeholder:text-[#C4C4D8]"
          />
          <span className="h-10 flex items-center px-3 text-[12px] font-bold text-[#4648D4] border-l border-[#DDDDF0] bg-[#F0F0FF]">
            VND
          </span>
        </div>
        {salePrice && (
          <p className="flex items-center gap-1 text-[11px] text-[#9090B0]">
            <InfoIcon size={11} />
            Giá này sẽ được hiển thị kèm giá gốc gạch ngang.
          </p>
        )}
      </div>
    </div>
  );
}

// ─── AI Badge ─────────────────────────────────────────────────────────────────

function AIBadge() {
  return (
    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] text-[10px] font-bold text-white tracking-wide shadow-[0_2px_8px_rgba(107,107,255,0.35)]">
      <SparklesIcon size={9} />
      AI Recommended
    </span>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export function PricingModelSection() {
  const [model, setModel] = useState<PricingModel>("paid");
  const [basePrice, setBasePrice] = useState("1.200.000");
  const [salePrice, setSalePrice] = useState("");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-4">
      {/* Left: main card */}
      <div className="rounded-2xl border border-[#EAEAF4] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-5 flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-[#EEF0FF] text-[#6B6BFF] flex items-center justify-center">
              <PaidIcon size={14} />
            </span>
            <span className="text-[14px] font-bold text-[#1A1A2E]">Mô hình định giá</span>
          </div>
          <AIBadge />
        </div>

        {/* Model cards */}
        <div className="grid grid-cols-3 gap-3">
          {MODELS.map((opt) => (
            <ModelCard
              key={opt.id}
              option={opt}
              isSelected={model === opt.id}
              onSelect={() => setModel(opt.id)}
            />
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-[#F4F4FA]" />

        {/* Price inputs */}
        {model !== "free" && (
          <PriceInputs
            basePrice={basePrice}
            salePrice={salePrice}
            onBaseChange={setBasePrice}
            onSaleChange={setSalePrice}
          />
        )}

        {model === "free" && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-100">
            <CheckIcon size={13} />
            <p className="text-[12px] text-emerald-700 font-medium">
              Khóa học sẽ hiển thị miễn phí — không cần cấu hình giá.
            </p>
          </div>
        )}
      </div>

      {/* Right: AI panels */}
      <div className="flex flex-col gap-3">
        <AIInsightPanel onApply={(p) => { setBasePrice(p); setModel("paid"); }} />
        <RevenueStatPanel />
      </div>
    </div>
  );
}


================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\revenue\icons.tsx
================================================================

// ─── Revenue Icons ─────────────────────────────────────────────────────────────

const B = {
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor" as const,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

export function SearchIcon({ size = 15 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

export function BellIcon({ size = 18 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={1.8}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

export function MessageIcon({ size = 18 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={1.8}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export function SettingsIcon({ size = 18 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={1.8}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

export function DownloadIcon({ size = 14 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

export function WalletIcon({ size = 14 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2}>
      <path d="M22 12V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2" />
      <path d="M22 12H18a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2h4" />
    </svg>
  );
}

export function TrendUpIcon({ size = 12 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2.5}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

export function ClockIcon({ size = 12 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2.5}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export function UsersIcon({ size = 12 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2.5}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export function InfoCircleIcon({ size = 12 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2.5}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

export function ChevronDownIcon({ size = 12 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2.5}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function FilterIcon({ size = 14 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2}>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

export function CheckCircleIcon({ size = 16 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

export function BuildingBankIcon({ size = 16 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2}>
      <rect x="3" y="21" width="18" height="2" />
      <polygon points="12 2 22 7 2 7 12 2" />
      <line x1="6" y1="21" x2="6" y2="11" />
      <line x1="10" y1="21" x2="10" y2="11" />
      <line x1="14" y1="21" x2="14" y2="11" />
      <line x1="18" y1="21" x2="18" y2="11" />
    </svg>
  );
}

export function ShieldCheckIcon({ size = 14 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

export function BarChartIcon({ size = 14 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2}>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

export function BrainIcon({ size = 14 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2}>
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
    </svg>
  );
}

export function CodeIcon({ size = 14 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2}>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

export function PieChartIcon({ size = 14 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2}>
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  );
}

export function SparklesIcon({ size = 14 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2}>
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  );
}

export function DollarSignIcon({ size = 20 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={1.5}>
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

export function CalendarIcon({ size = 14 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

export function GridIcon({ size = 16 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2}>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

export function ChevronLeftIcon({ size = 12 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2.5}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

export function ChevronRightIcon({ size = 12 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2.5}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export function TrendRightIcon({ size = 12 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2.5}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function LockIcon({ size = 14, className }: { size?: number; className?: string }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2} className={className}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export function PencilIcon({ size = 14 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2}>
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  );
}

export function ArrowRightIcon({ size = 14 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export function BookOpenIcon({ size = 14 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}


================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\revenue\index.ts
================================================================

// ─── Revenue Feature Public API ─────────────────────────────────────────────

export { RevenueContainer } from "./RevenueContainer";
export { SalesReportContainer } from "./SalesReportContainer";
export { TransactionHistoryContainer } from "./TransactionHistoryContainer";


================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\revenue\RevenueContainer.tsx
================================================================

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import {
  WalletIcon,
  TrendUpIcon,
  ClockIcon,
  InfoCircleIcon,
  SparklesIcon,
} from "./icons";
import { WithdrawalModal } from "./WithdrawalModal";

function RevenueNavigationTabs({ active }: { active: "overview" | "report" | "history" }) {
  return (
    <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-gray-200 shadow-2xs w-fit">
      <Link
        href="/instructor/revenue"
        className={twMerge(
          "px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer",
          active === "overview"
            ? "bg-[#4F46E5] text-white shadow-sm"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        )}
      >
        <span>📊 Tổng quan Doanh thu</span>
      </Link>

      <Link
        href="/instructor/revenue/sales-report"
        className={twMerge(
          "px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer",
          active === "report"
            ? "bg-[#4F46E5] text-white shadow-sm"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        )}
      >
        <span>📈 Báo cáo Bán hàng</span>
      </Link>

      <Link
        href="/instructor/revenue/history"
        className={twMerge(
          "px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer",
          active === "history"
            ? "bg-[#4F46E5] text-white shadow-sm"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        )}
      >
        <span>📜 Lịch sử Giao dịch</span>
      </Link>
    </div>
  );
}

function PageHeader({ onOpenWithdrawal, onToggleForecast }: { onOpenWithdrawal: () => void; onToggleForecast: () => void }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-black text-gray-900 tracking-tight">Quản lý Doanh thu &amp; Tài chính</h1>
        <p className="text-xs text-gray-500 mt-1">
          Theo dõi số dư khả dụng, doanh thu bán khóa học và các khoản hoa hồng theo tỷ lệ chia sẻ của Giảng viên.
        </p>
      </div>
      <div className="flex items-center gap-2.5 flex-wrap">
        <button
          type="button"
          onClick={onToggleForecast}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-indigo-200 text-xs font-extrabold text-[#4F46E5] bg-indigo-50/80 hover:bg-indigo-100 transition-all cursor-pointer shadow-2xs"
        >
          <SparklesIcon size={15} />
          <span>Dự báo Thu nhập AI</span>
        </button>
        <button
          type="button"
          onClick={onOpenWithdrawal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-[#4F46E5] hover:bg-[#4338CA] active:scale-95 shadow-sm transition-all cursor-pointer"
        >
          <WalletIcon />
          <span>Yêu cầu Rút tiền</span>
        </button>
      </div>
    </div>
  );
}

function StatCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs flex flex-col justify-between">
        <span className="text-xs font-black text-gray-500 uppercase tracking-wide">Tổng Doanh Thu (Tháng này)</span>
        <span className="text-2xl font-black text-gray-900 mt-2">128,450,000đ</span>
        <div className="flex items-center gap-1.5 mt-3 text-xs font-extrabold text-emerald-600">
          <TrendUpIcon />
          <span>+12.5% so với tháng trước</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs flex flex-col justify-between">
        <span className="text-xs font-black text-gray-500 uppercase tracking-wide">Số Dư Khả Dụng Ngay</span>
        <span className="text-2xl font-black text-[#4F46E5] mt-2">42,180,000đ</span>
        <div className="flex items-center gap-1.5 mt-3 text-xs font-bold text-gray-400">
          <ClockIcon />
          <span>Đã qua hạn hoàn tiền 30 ngày</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs flex flex-col justify-between">
        <span className="text-xs font-black text-gray-500 uppercase tracking-wide">Quỹ Bảo Lãnh (Escrow)</span>
        <span className="text-2xl font-black text-amber-600 mt-2">15,400,000đ</span>
        <div className="flex items-center gap-1.5 mt-3 text-xs font-bold text-amber-700">
          <InfoCircleIcon />
          <span>Tạm giữ chờ cấn trừ đơn mới</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs flex flex-col justify-between">
        <span className="text-xs font-black text-gray-500 uppercase tracking-wide">Tỷ Lệ Hoàn Tiền (Refund)</span>
        <span className="text-2xl font-black text-gray-900 mt-2">0.8%</span>
        <div className="flex items-center gap-1.5 mt-3 text-xs font-extrabold text-emerald-600">
          <InfoCircleIcon />
          <span>Cực kỳ an toàn (Trung bình: 2.4%)</span>
        </div>
      </div>
    </div>
  );
}

function AIForecastSection({ onClose }: { onClose: () => void }) {
  return (
    <div className="p-6 rounded-2xl bg-white border border-indigo-200 shadow-sm flex flex-col gap-5 animate-fadeIn">
      <div className="flex items-center justify-between border-b border-indigo-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center text-xl font-black shadow-2xs">
            🤖
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-gray-900">Dự Báo &amp; Tối Ưu Hóa Thu Nhập AI</h3>
              <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800">
                AI Predictive Engine
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Phóng tác đà tăng trưởng thu nhập dựa trên số lượng ghi danh thực tế và lưu lượng từ liên kết giới thiệu.
            </p>
          </div>
        </div>
        <button type="button" onClick={onClose} aria-label="Đóng bảng dự báo" className="text-gray-400 hover:text-gray-700 font-black text-base p-1 cursor-pointer">
          ✕
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-500 uppercase">Thu Nhập Cuối Tháng Dự Kiến</span>
          <span className="text-xl font-black text-[#4F46E5] mt-1.5">184,500,000đ</span>
          <span className="text-xs font-semibold text-emerald-600 mt-1">▲ Dự kiến tăng trưởng +43% so với kỳ trước</span>
        </div>
        
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-500 uppercase">Khóa Học Đứng Đầu Chuyển Đổi</span>
          <span className="text-base font-black text-gray-900 truncate mt-1.5">AI Mastery for Business</span>
          <span className="text-xs font-semibold text-gray-500 mt-1">Chiếm 68% doanh số từ nguồn liên kết chia sẻ</span>
        </div>

        <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200 flex flex-col justify-between gap-3">
          <div>
            <span className="text-xs font-black text-indigo-900 uppercase flex items-center gap-1.5">
              <span>⚡ Đề xuất nhanh từ AI</span>
            </span>
            <p className="text-xs font-medium text-indigo-950 mt-1 leading-relaxed">
              Khóa &ldquo;Machine Learning Basics&rdquo; đang giảm nhẹ 14% lượt xem. Khuyến nghị tạo ngay mã giảm giá 20% hoặc đẩy link giới thiệu.
            </p>
          </div>
          <Link
            href="/instructor"
            className="px-4 py-2 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-extrabold transition-all text-center shadow-2xs"
          >
            Tạo Mã Khuyến Mãi Ngay ➔
          </Link>
        </div>
      </div>
    </div>
  );
}

function RevenueChart() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-black text-gray-900">Biểu Đồ Nguồn Thu &amp; Tỷ Lệ Chiết Khấu</h3>
          <p className="text-xs text-gray-500 mt-0.5">Tỷ lệ phân chia tự động tùy thuộc vào nguồn ghi danh của học viên.</p>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1 rounded-xl bg-indigo-50 text-[#4F46E5] border border-indigo-200 text-xs font-bold">
            🚀 Link Giới thiệu Giảng viên: 85% Thực nhận
          </span>
          <span className="px-3 py-1 rounded-xl bg-gray-100 text-gray-700 border border-gray-200 text-xs font-bold">
            🛒 Chợ Khóa học Chung: 70% Thực nhận
          </span>
        </div>
      </div>
      
      {/* Visual Bar Chart Simulation */}
      <div className="flex-1 min-h-[200px] flex items-end justify-between gap-3 px-2 sm:px-6 pt-6 border-t border-gray-100 relative">
        {[35, 52, 90, 60, 68, 48, 85].map((h, i) => (
          <div key={i} className="relative flex flex-col items-center w-full max-w-[42px] group cursor-pointer">
            <div
              className={twMerge(
                "w-full rounded-xl transition-all duration-300",
                i === 2 || i === 6 ? "bg-[#4F46E5] shadow-sm" : "bg-gray-100 group-hover:bg-indigo-200"
              )}
              style={{ height: `${h * 2}px` }}
            />
            <span className={twMerge("mt-2.5 text-xs font-extrabold", i === 2 || i === 6 ? "text-[#4F46E5]" : "text-gray-400")}>
              {["T2", "T3", "Hnay", "T5", "T6", "T7", "CN"][i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentTransactions() {
  const items = [
    { id: "TX-921", title: "Khóa AI Mastery", detail: "Link Giới thiệu Giảng viên (Hoa hồng 85%)", amount: "+2,550,000đ", status: "KHẢ DỤNG", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
    { id: "TX-918", title: "Khóa ML Basics", detail: "Chợ Khóa học Chung (Hoa hồng 70%)", amount: "+840,000đ", status: "ESCROW TẠM GIỮ", color: "text-amber-700 bg-amber-50 border-amber-200" },
    { id: "TX-890", title: "Rút tiền về Ngân hàng", detail: "MB Bank - **** 1234", amount: "-15,000,000đ", status: "ĐÃ XỬ LÝ", color: "text-indigo-700 bg-indigo-50 border-indigo-200" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 flex flex-col shadow-2xs overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-gray-100">
        <h3 className="text-sm font-black text-gray-900">Giao dịch mới cập nhật</h3>
        <Link href="/instructor/revenue/history" className="text-xs font-extrabold text-[#4F46E5] hover:underline">
          Xem tất cả ➔
        </Link>
      </div>

      <div className="flex flex-col p-4 gap-2.5 flex-1">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50/70 border border-gray-100 hover:border-gray-200 transition-all">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-extrabold text-gray-900">{item.title}</span>
                <span className="text-[11px] font-mono font-bold text-gray-400">({item.id})</span>
              </div>
              <p className="text-xs font-medium text-gray-500 mt-0.5">{item.detail}</p>
            </div>
            <div className="text-right">
              <span className="block text-xs font-black font-mono text-gray-900">{item.amount}</span>
              <span className={twMerge("inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-md mt-1 uppercase border", item.color)}>
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs font-medium text-gray-500">
        <span>🔒 Quỹ tạm giữ (Escrow) sẽ tự động cộng vào khả dụng sau 30 ngày.</span>
      </div>
    </div>
  );
}

export function RevenueContainer() {
  const [isWithdrawalOpen, setIsWithdrawalOpen] = useState(false);
  const [showForecast, setShowForecast] = useState(true);

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F4F8] font-sans">
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col gap-6 pb-16">
          
          {/* Top Tabs Navigation */}
          <RevenueNavigationTabs active="overview" />

          {/* Page Title & Actions */}
          <PageHeader
            onOpenWithdrawal={() => setIsWithdrawalOpen(true)}
            onToggleForecast={() => setShowForecast((prev) => !prev)}
          />

          {/* KPI Stat Cards */}
          <StatCards />

          {/* AI Forecast Section */}
          {showForecast && <AIForecastSection onClose={() => setShowForecast(false)} />}
          
          {/* Charts & Transaction Table */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
            <RevenueChart />
            <RecentTransactions />
          </div>
        </div>
      </main>

      <WithdrawalModal
        isOpen={isWithdrawalOpen}
        onClose={() => setIsWithdrawalOpen(false)}
      />
    </div>
  );
}

================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\revenue\SalesReportContainer.tsx
================================================================

"use client";

import React from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import {
  CalendarIcon,
  DownloadIcon,
  TrendUpIcon,
  TrendRightIcon,
} from "./icons";

function RevenueNavigationTabs({ active }: { active: "overview" | "report" | "history" }) {
  return (
    <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-gray-200 shadow-2xs w-fit">
      <Link
        href="/instructor/revenue"
        className={twMerge(
          "px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer",
          active === "overview"
            ? "bg-[#4F46E5] text-white shadow-sm"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        )}
      >
        <span>📊 Tổng quan Doanh thu</span>
      </Link>

      <Link
        href="/instructor/revenue/sales-report"
        className={twMerge(
          "px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer",
          active === "report"
            ? "bg-[#4F46E5] text-white shadow-sm"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        )}
      >
        <span>📈 Báo cáo Bán hàng</span>
      </Link>

      <Link
        href="/instructor/revenue/history"
        className={twMerge(
          "px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer",
          active === "history"
            ? "bg-[#4F46E5] text-white shadow-sm"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        )}
      >
        <span>📜 Lịch sử Giao dịch</span>
      </Link>
    </div>
  );
}

function DatePickerHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-black text-gray-900 tracking-tight">Báo cáo Bán hàng &amp; Chuyển đổi</h1>
        <p className="text-xs text-gray-500 mt-1">
          Phân tích chi tiết lượt xem, doanh số thuần và tỷ lệ chuyển đổi học viên từ các nền tảng quảng bá.
        </p>
      </div>
      <div className="flex items-center gap-2.5 flex-wrap">
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 shadow-2xs">
          <CalendarIcon />
          <span>Tháng hiện tại</span>
        </div>
        <button type="button" className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer">
          <DownloadIcon />
          <span>Xuất CSV</span>
        </button>
        <button type="button" className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-[#4F46E5] hover:bg-[#4338CA] shadow-sm transition-all cursor-pointer">
          <DownloadIcon />
          <span>Xuất Báo cáo PDF</span>
        </button>
      </div>
    </div>
  );
}

function StatCards() {
  const stats = [
    { label: "Tổng Doanh Thu", val: "128,450,000đ", diff: "+12.5%", isUp: true, color: "bg-emerald-500", width: 82 },
    { label: "Doanh Thu Ròng", val: "115,200,000đ", diff: "+8.2%", isUp: true, color: "bg-[#4F46E5]", width: 75 },
    { label: "Hoàn Tiền (Refund)", val: "1,450,000đ", diff: "-2.1%", isUp: false, color: "bg-rose-500", width: 40 },
    { label: "Giá Trị Đơn Trung Bình", val: "1,850,000đ", diff: "+5.4%", isUp: true, color: "bg-indigo-400", width: 65 },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <div key={i} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{s.label}</span>
          <div className="flex items-end justify-between mt-2">
            <span className="text-xl font-black text-gray-900 leading-tight">{s.val}</span>
            <span className={twMerge("text-xs font-black", s.isUp ? "text-emerald-600" : "text-rose-600")}>
              {s.diff}
            </span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full mt-3 overflow-hidden">
            <div className={twMerge("h-full rounded-full transition-all duration-500", s.color)} style={{ width: `${s.width}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function RevenueVsRefundsChart() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs p-6 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-black text-gray-900">Biểu Đồ Tương Quan Doanh Thu vs Hoàn Tiền</h3>
          <p className="text-xs text-gray-500 mt-0.5">Theo dõi luồng dòng tiền hàng ngày và tỷ lệ giữ chân học viên.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#4F46E5]" />
            <span className="text-xs font-bold text-gray-700">Doanh thu bán mới</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500" />
            <span className="text-xs font-bold text-gray-700">Hoàn tiền</span>
          </div>
        </div>
      </div>

      {/* Visual Chart Bars */}
      <div className="min-h-[220px] flex items-end justify-between gap-3 pt-4 border-t border-gray-100 px-2 sm:px-6">
        {[45, 60, 30, 85, 90, 75, 95].map((h, idx) => (
          <div key={idx} className="flex flex-col items-center w-full max-w-[48px] group">
            <div className="w-full flex items-end justify-center gap-1">
              <div className="w-full rounded-t-lg bg-[#4F46E5] transition-all group-hover:opacity-85" style={{ height: `${h * 1.8}px` }} />
              <div className="w-1.5 rounded-t-lg bg-rose-400" style={{ height: `${Math.max(4, h * 0.15)}px` }} />
            </div>
            <span className="mt-2 text-xs font-extrabold text-gray-500">
              {["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4", "Tuần 5", "Tuần 6", "Nay"][idx]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MarketingSourcesTable() {
  const sources = [
    { name: "Facebook Ads", sub: "Quảng cáo mạng xã hội", initials: "FB", bg: "bg-blue-50 text-blue-700 border-blue-200", leads: "1,240", conv: "156", rate: 12.58, rev: "38,420,000đ", trend: "up" },
    { name: "Google Search", sub: "Tìm kiếm tự nhiên & SEO", initials: "GG", bg: "bg-rose-50 text-rose-700 border-rose-200", leads: "890", conv: "92", rate: 10.33, rev: "42,150,000đ", trend: "up" },
    { name: "Email Marketing", sub: "Bản tin học thuật hàng tuần", initials: "EM", bg: "bg-purple-50 text-purple-700 border-purple-200", leads: "2,100", conv: "48", rate: 2.28, rev: "16,280,000đ", trend: "flat" },
    { name: "Chương trình Tiếp thị (Referral)", sub: "Đối tác liên kết & Học viên cũ", initials: "RF", bg: "bg-emerald-50 text-emerald-700 border-emerald-200", leads: "320", conv: "45", rate: 14.06, rev: "31,600,000đ", trend: "up" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs flex flex-col overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border-b border-gray-100 gap-2">
        <div>
          <h3 className="text-sm font-black text-gray-900">Hiệu Năng Các Nênh Tảng Quảng Bá</h3>
          <p className="text-xs text-gray-500">Dữ liệu phân bổ lượt xem và tỷ lệ chốt đơn theo từng trang giới thiệu.</p>
        </div>
        <span className="text-xs font-bold text-[#4F46E5] bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-100">
          ✨ AI Tracking 100% chính xác
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/70 text-[11px] font-black text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-3.5">Nguồn Quảng Bá</th>
              <th className="px-6 py-3.5">Lượt Quan Tâm (Leads)</th>
              <th className="px-6 py-3.5">Ghi Danh Thành Công</th>
              <th className="px-6 py-3.5">Tỷ Lệ Chuyển Đổi</th>
              <th className="px-6 py-3.5">Doanh Thu Đưa Về</th>
              <th className="px-6 py-3.5 text-center">Xu Hướng</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs font-medium">
            {sources.map((s, i) => (
              <tr key={i} className="hover:bg-gray-50/80 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={twMerge("w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 border", s.bg)}>
                      {s.initials}
                    </div>
                    <div>
                      <div className="font-extrabold text-gray-900">{s.name}</div>
                      <div className="text-[11px] text-gray-500">{s.sub}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-gray-700">{s.leads}</td>
                <td className="px-6 py-4 font-extrabold text-indigo-900">{s.conv}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2.5">
                    <span className="font-extrabold text-gray-900 w-12">{s.rate}%</span>
                    <div className="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full bg-[#4F46E5]" style={{ width: `${s.rate * 5}%` }} />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-black font-mono text-gray-900">{s.rev}</td>
                <td className="px-6 py-4 text-center">
                  {s.trend === "up" ? (
                    <span className="text-emerald-600 inline-block">
                      <TrendUpIcon size={16} />
                    </span>
                  ) : (
                    <span className="text-gray-400 inline-block">
                      <TrendRightIcon size={16} />
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function SalesReportContainer() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F4F4F8] font-sans">
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col gap-6 pb-16">
          <RevenueNavigationTabs active="report" />
          <DatePickerHeader />
          <StatCards />
          <RevenueVsRefundsChart />
          <MarketingSourcesTable />
        </div>
      </main>
    </div>
  );
}


================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\revenue\TransactionHistoryContainer.tsx
================================================================

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import {
  CalendarIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BookOpenIcon,
  WalletIcon,
  SparklesIcon,
  BuildingBankIcon,
  TrendUpIcon,
} from "./icons";

function RevenueNavigationTabs({ active }: { active: "overview" | "report" | "history" }) {
  return (
    <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-gray-200 shadow-2xs w-fit">
      <Link
        href="/instructor/revenue"
        className={twMerge(
          "px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer",
          active === "overview"
            ? "bg-[#4F46E5] text-white shadow-sm"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        )}
      >
        <span>📊 Tổng quan Doanh thu</span>
      </Link>

      <Link
        href="/instructor/revenue/sales-report"
        className={twMerge(
          "px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer",
          active === "report"
            ? "bg-[#4F46E5] text-white shadow-sm"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        )}
      >
        <span>📈 Báo cáo Bán hàng</span>
      </Link>

      <Link
        href="/instructor/revenue/history"
        className={twMerge(
          "px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer",
          active === "history"
            ? "bg-[#4F46E5] text-white shadow-sm"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        )}
      >
        <span>📜 Lịch sử Giao dịch</span>
      </Link>
    </div>
  );
}

function PageHeader() {
  return (
    <div className="flex flex-col">
      <h1 className="text-xl font-black text-gray-900 tracking-tight">Lịch Sử Giao Dịch &amp; Đối Soát</h1>
      <p className="text-xs text-gray-500 mt-1">
        Kiểm soát dòng tiền chi tiết, các lệnh rút tiền hoa hồng và lịch sử bán khóa học theo thời gian thực.
      </p>
    </div>
  );
}

function Filters({ activeFilter, onSelect }: { activeFilter: string; onSelect: (val: string) => void }) {
  const tabs = [
    { id: "all", label: "Tất cả giao dịch" },
    { id: "in", label: "Tiền vào (Doanh thu)" },
    { id: "out", label: "Tiền ra (Rút tiền)" },
    { id: "pending", label: "Đang cấn trừ Escrow" },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-2xs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelect(tab.id)}
            className={twMerge(
              "px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer",
              activeFilter === tab.id
                ? "bg-[#4F46E5] text-white shadow-2xs"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 bg-white shadow-2xs">
        <CalendarIcon />
        <span>Tháng này</span>
        <ChevronDownIcon />
      </div>
    </div>
  );
}

function TransactionTable({ activeFilter }: { activeFilter: string }) {
  const allTransactions = [
    {
      type: "in",
      date: "24 Th05, 2026",
      time: "14:30 PM",
      id: "#TXN-90231",
      title: "Bán khóa học AI Mastery for Business",
      subtitle: "Học viên: Lê Văn An • Link Giới thiệu (85%)",
      icon: <BookOpenIcon size={16} />,
      iconColor: "text-indigo-600 bg-indigo-50 border-indigo-100",
      status: "THÀNH CÔNG",
      statusStyle: "text-emerald-700 bg-emerald-50 border-emerald-200",
      amount: "+2,550,000đ",
      amountStyle: "text-emerald-600 font-black",
    },
    {
      type: "out",
      date: "22 Th05, 2026",
      time: "09:15 AM",
      id: "#TXN-88142",
      title: "Yêu cầu rút tiền hoa hồng về Ngân hàng",
      subtitle: "MB Bank - **** 1234 • Chuyển khoản nhanh 24/7",
      icon: <WalletIcon size={16} />,
      iconColor: "text-purple-600 bg-purple-50 border-purple-100",
      status: "ĐANG XỬ LÝ",
      statusStyle: "text-indigo-700 bg-indigo-50 border-indigo-200",
      amount: "-15,000,000đ",
      amountStyle: "text-gray-900 font-bold",
    },
    {
      type: "pending",
      date: "20 Th05, 2026",
      time: "16:45 PM",
      id: "#TXN-87002",
      title: "Bán khóa học Machine Learning Basics",
      subtitle: "Học viên: Nguyễn Thị Mai • Đang tạm giữ Escrow 30 ngày",
      icon: <SparklesIcon size={16} />,
      iconColor: "text-amber-600 bg-amber-50 border-amber-100",
      status: "ESCROW TẠM GIỮ",
      statusStyle: "text-amber-700 bg-amber-50 border-amber-200",
      amount: "+840,000đ",
      amountStyle: "text-amber-600 font-extrabold",
    },
    {
      type: "in",
      date: "19 Th05, 2026",
      time: "11:00 AM",
      id: "#TXN-86551",
      title: "Bán khóa học Next.js 16 & Turbo Professional",
      subtitle: "Học viên: Trần Đức Thắng • Chợ khóa học (70%)",
      icon: <BookOpenIcon size={16} />,
      iconColor: "text-emerald-600 bg-emerald-50 border-emerald-100",
      status: "THÀNH CÔNG",
      statusStyle: "text-emerald-700 bg-emerald-50 border-emerald-200",
      amount: "+1,850,000đ",
      amountStyle: "text-emerald-600 font-black",
    },
  ];

  const filtered = activeFilter === "all" ? allTransactions : allTransactions.filter(t => t.type === activeFilter);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs flex flex-col overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[750px]">
          <thead>
            <tr className="bg-gray-50/70 border-b border-gray-200 text-[11px] font-black text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-3.5 w-[170px]">Thời Gian</th>
              <th className="px-6 py-3.5 w-[140px]">Mã Giao Dịch</th>
              <th className="px-6 py-3.5">Nội Dung Đối Soát</th>
              <th className="px-6 py-3.5 w-[150px]">Trạng Thái</th>
              <th className="px-6 py-3.5 text-right w-[150px]">Số Tiền</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs font-medium">
            {filtered.length > 0 ? (
              filtered.map((t, i) => (
                <tr key={i} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-extrabold text-gray-900">{t.date}</span>
                      <span className="text-[11px] text-gray-400 mt-0.5">{t.time}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold font-mono text-gray-600">{t.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={twMerge("w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border", t.iconColor)}>
                        {t.icon}
                      </div>
                      <div>
                        <div className="font-extrabold text-gray-900">{t.title}</div>
                        <div className="text-[11px] font-semibold text-gray-500 mt-0.5">{t.subtitle}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={twMerge("px-2.5 py-1 rounded-md text-[10px] font-bold uppercase block w-fit border", t.statusStyle)}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={twMerge("font-mono text-sm", t.amountStyle)}>{t.amount}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-bold">
                  Không tìm thấy giao dịch nào thuộc bộ lọc này.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100 bg-gray-50/50">
        <span className="text-xs font-semibold text-gray-500">Hiển thị {filtered.length} trên tổng số {allTransactions.length} giao dịch gần đây</span>
        <div className="flex items-center gap-1">
          <button aria-label="Trang trước" className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 cursor-not-allowed">
            <ChevronLeftIcon />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#4F46E5] text-white font-extrabold text-xs shadow-2xs">1</button>
          <button aria-label="Trang sau" className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 cursor-not-allowed">
            <ChevronRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

function BottomCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center shrink-0 border border-indigo-100">
          <BuildingBankIcon size={22} />
        </div>
        <div>
          <span className="text-xs font-bold text-gray-500 block uppercase">Số dư khả dụng</span>
          <span className="text-xl font-black text-gray-900 mt-0.5 block">42,180,000đ</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
          <TrendUpIcon size={22} />
        </div>
        <div>
          <span className="text-xs font-bold text-gray-500 block uppercase">Thu nhập Tích lũy Tháng</span>
          <span className="text-xl font-black text-emerald-600 mt-0.5 block">128,450,000đ</span>
        </div>
      </div>

      <div className="bg-indigo-50/50 rounded-2xl border border-indigo-200 p-5 flex items-center justify-between gap-3 shadow-2xs">
        <div>
          <span className="text-sm font-black text-[#4F46E5] block">Yêu Cầu Rút Tiền Hoa Hồng</span>
          <span className="text-xs text-indigo-900/80 font-medium mt-0.5 block">Hệ thống thanh toán nhanh 24/7</span>
        </div>
        <Link
          href="/instructor/revenue"
          className="px-5 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-extrabold shadow-sm transition-all shrink-0"
        >
          Rút Ngay ➔
        </Link>
      </div>
    </div>
  );
}

export function TransactionHistoryContainer() {
  const [activeFilter, setActiveFilter] = useState("all");

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F4F8] font-sans">
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col gap-6 pb-16">
          <RevenueNavigationTabs active="history" />
          <PageHeader />
          <Filters activeFilter={activeFilter} onSelect={setActiveFilter} />
          <TransactionTable activeFilter={activeFilter} />
          <BottomCards />
        </div>
      </main>
    </div>
  );
}


================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\revenue\WithdrawalModal.tsx
================================================================

import React, { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { XIcon, ArrowRightIcon } from "./icons";

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export type PayoutMethodType = "bank" | "paypal" | "stripe";

export function WithdrawalModal({ isOpen, onClose }: WithdrawalModalProps) {
  const [amount, setAmount] = useState("10,000,000");
  const [payoutMethod, setPayoutMethod] = useState<PayoutMethodType>("bank");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const availableBalanceNum = 42180000; // 42,180,000 VND
  const escrowHoldingBalance = 15400000;
  const minWithdrawalNum = 1000000;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setStatusMessage(null);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const cleanAmountNum = parseInt(amount.replace(/[^0-9]/g, "") || "0", 10);
  const isBelowMinimum = cleanAmountNum < minWithdrawalNum;
  const isExceedingAvailable = cleanAmountNum > availableBalanceNum;
  const canSubmit = !isBelowMinimum && !isExceedingAvailable && cleanAmountNum > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setStatusMessage("⚡ Yêu cầu thanh toán đã được tiếp nhận! Hệ thống sẽ chuyển khoản tự động trong 24h.");
    setTimeout(() => {
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-gray-200 shadow-xl flex flex-col overflow-hidden font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-[#4F46E5] text-white">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-lg font-black shadow-2xs">
              💳
            </span>
            <div>
              <h2 className="text-base font-black text-white">Yêu Cầu Rút Tiền Hoa Hồng</h2>
              <p className="text-xs text-indigo-100">Hệ thống thanh toán tự động an toàn cho Giảng viên</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng cửa sổ"
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <XIcon size={18} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5 overflow-y-auto max-h-[80vh]">
          
          {/* Balance Breakdown */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-800 uppercase">Khả Dụng Ngay</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-200 text-emerald-900">Sẵn sàng</span>
              </div>
              <span className="text-lg font-black text-emerald-900 mt-1.5">42,180,000đ</span>
              <span className="text-[11px] font-medium text-emerald-700 mt-0.5">Đã qua kỳ hoàn hạn 30 ngày</span>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col justify-between" title="Số dư tạm giữ trong thời gian 30 ngày bảo lưu khóa học">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-800 uppercase">Tạm giữ (Escrow)</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-amber-200 text-amber-900">30 Ngày</span>
              </div>
              <span className="text-lg font-black text-amber-900 mt-1.5">15,400,000đ</span>
              <span className="text-[11px] font-medium text-amber-700 mt-0.5">Chờ hết thời hạn hoàn tiền</span>
            </div>
          </div>

          {/* Amount Input */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-gray-800 uppercase">Số tiền muosn rút</label>
              <span className="text-[11px] font-bold text-gray-500">Tối thiểu: 1,000,000đ</span>
            </div>
            <div className="relative flex items-center">
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={twMerge(
                  "w-full h-11 pl-4 pr-32 rounded-xl border font-bold text-base focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 transition-all",
                  isBelowMinimum || isExceedingAvailable ? "border-rose-400 bg-rose-50/20 text-rose-700" : "border-gray-200 bg-white text-gray-900 focus:border-[#4F46E5]"
                )}
              />
              <div className="absolute right-2.5 flex items-center gap-1.5">
                <span className="text-xs font-black text-gray-400">VNĐ</span>
                <button
                  type="button"
                  onClick={() => setAmount("42,180,000")}
                  className="px-2.5 py-1 rounded-lg bg-indigo-50 text-[#4F46E5] font-extrabold text-xs hover:bg-[#4F46E5] hover:text-white transition-all cursor-pointer border border-indigo-200 hover:border-[#4F46E5]"
                >
                  Tối đa
                </button>
              </div>
            </div>

            {isBelowMinimum && (
              <p className="text-xs font-bold text-rose-600 flex items-center gap-1 mt-0.5">
                ⚠️ Số tiền yêu cầu phải từ 1,000,000 VNĐ trở lên.
              </p>
            )}
            {isExceedingAvailable && (
              <p className="text-xs font-bold text-rose-600 flex items-center gap-1 mt-0.5">
                ⚠️ Số tiền vượt quá số dư khả dụng ngay. Không thể rút trước tiền đang trong quỹ bảo lãnh Escrow.
              </p>
            )}
          </div>

          {/* Payout Method Selection */}
          <div className="flex flex-col gap-2.5">
            <label className="text-xs font-black text-gray-800 uppercase">Cổng Nhận Tiền Đã Xác Minh</label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: "bank", title: "Chuyển khoản Ngân hàng", icon: "🏦", verified: true, desc: "MB Bank - **** 1234" },
                { id: "paypal", title: "PayPal Quốc tế", icon: "🌐", verified: true, desc: "minh.ng@paypal.me" },
                { id: "stripe", title: "Stripe Connect", icon: "⚡", verified: false, desc: "Chưa thiết lập KYC" },
              ].map((m) => (
                <div
                  key={m.id}
                  onClick={() => m.verified && setPayoutMethod(m.id as any)}
                  className={twMerge(
                    "p-3 rounded-xl border transition-all flex flex-col justify-between gap-2 relative",
                    payoutMethod === m.id ? "border-[#4F46E5] bg-indigo-50/50 shadow-2xs" : "border-gray-200 bg-white hover:border-indigo-300",
                    !m.verified ? "opacity-50 cursor-not-allowed bg-gray-50" : "cursor-pointer"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base">{m.icon}</span>
                    <span className={twMerge("text-[10px] font-bold px-1.5 py-0.5 rounded-md", m.verified ? "bg-emerald-100 text-emerald-800" : "bg-gray-200 text-gray-600")}>
                      {m.verified ? "Đã duyệt" : "Chưa nối"}
                    </span>
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-gray-900 leading-tight">{m.title}</h5>
                    <p className="text-[10px] font-medium text-gray-500 truncate mt-0.5">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {statusMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-between shadow-sm">
              <span>{statusMessage}</span>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Action Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit || !!statusMessage}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-extrabold text-white bg-[#4F46E5] hover:bg-[#4338CA] active:scale-98 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <span>Xác Nhan & Gửi Yêu Cầu Rút Tiền</span>
            <ArrowRightIcon size={16} />
          </button>
        </div>

        {/* Footer */}
        <div className="py-3 bg-gray-50 border-t border-gray-100 text-center">
          <span className="text-xs font-medium text-gray-500">
            Thời gian nhận tiền dự kiến qua hệ thống tự động: <strong className="text-gray-700 font-bold">Ngay lập tức đến 24 giờ làm việc</strong>
          </span>
        </div>
        
      </div>
    </div>
  );
}


================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\student-management\AINotificationModal.tsx
================================================================

"use client";

// ─── AINotificationModal ──────────────────────────────────────────────────────
// Modal soạn thảo và gửi thông báo AI cho học viên.
// Hai cột: form bên trái + draft preview bên phải.

import { useState, useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";
import { SparklesIcon, PlusIcon } from "./icons";

// ─── Local icons ──────────────────────────────────────────────────────────────

const S = {
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor" as const,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

function XIcon() {
  return (
    <svg {...S} width={16} height={16} strokeWidth={2.5}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg {...S} width={14} height={14} strokeWidth={2}>
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg {...S} width={14} height={14} strokeWidth={2}>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function BoldIcon()   { return <svg {...S} width={13} height={13} strokeWidth={2.5}><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" /><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" /></svg>; }
function ItalicIcon() { return <svg {...S} width={13} height={13} strokeWidth={2.5}><line x1="19" y1="4" x2="10" y2="4" /><line x1="14" y1="20" x2="5" y2="20" /><line x1="15" y1="4" x2="9" y2="20" /></svg>; }
function UnderlineIcon() { return <svg {...S} width={13} height={13} strokeWidth={2.5}><path d="M6 3v7a6 6 0 0 0 12 0V3" /><line x1="4" y1="21" x2="20" y2="21" /></svg>; }
function ListIcon()   { return <svg {...S} width={13} height={13} strokeWidth={2}><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>; }
function LinkIcon()   { return <svg {...S} width={13} height={13} strokeWidth={2}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>; }
function ChevronDownIcon() { return <svg {...S} width={13} height={13} strokeWidth={2.5}><polyline points="6 9 12 15 18 9" /></svg>; }

// ─── Types ────────────────────────────────────────────────────────────────────

interface AINotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Mock generated draft ─────────────────────────────────────────────────────

const MOCK_DRAFT = `🚀 **Chào mừng các bạn đến với giai đoạn bứt phá!**

Chào các bạn học viên lớp AI Foundations,

Tôi nhận thấy tinh thần học tập của lớp chúng ta trong tuần qua vô cùng ấn tượng. Để tiếp thêm động lực cho các bạn chuẩn bị bước vào chương cuối của khóa học, tôi đã mở thêm một số tài liệu tham khảo nâng cao trong phần tài nguyên.

Đừng quên:

• Hoàn thành bài tập Lab số 4 trước thứ Sáu.
• Tham gia buổi Q&A trực tuyến vào tối thứ Tư.
• Xem lại video tóm tắt Module 3 trước khi lên lớp.

Chúc các bạn học tập hiệu quả và đạt kết quả tốt nhất! 💪`;

// ─── Suggestion Chip ──────────────────────────────────────────────────────────

const SUGGESTION_CHIPS = [
  { icon: "🏫", label: "Khởi lệ học tập" },
  { icon: "📅", label: "Nhắc lịch thi"   },
  { icon: "🔄", label: "Cập nhật nội dung"},
  { icon: "💬", label: "Thông báo thảo luận"},
];

function SuggestionChip({
  icon, label, active, onClick,
}: {
  icon: string; label: string; active: boolean; onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={twMerge(
        "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#6B6BFF]/30",
        active
          ? "border-[#6B6BFF] bg-[#EEF0FF] text-[#4648D4]"
          : "border-[#EAEAF4] text-[#64647A] bg-white hover:border-[#C5C6FF] hover:text-[#4648D4]",
      )}
    >
      <span>{icon}</span>
      {label}
    </button>
  );
}

// ─── Rich Text Toolbar ────────────────────────────────────────────────────────

function EditorToolbar({ onFormat }: { onFormat: (cmd: string) => void }) {
  const tools = [
    { icon: <BoldIcon />,       cmd: "bold",          label: "Đậm"         },
    { icon: <ItalicIcon />,     cmd: "italic",        label: "Nghiêng"     },
    { icon: <UnderlineIcon />,  cmd: "underline",     label: "Gạch chân"   },
    { icon: <ListIcon />,       cmd: "insertUnorderedList", label: "Danh sách" },
    { icon: <LinkIcon />,       cmd: "link",          label: "Liên kết"    },
  ];

  return (
    <div className="flex items-center gap-0.5 px-2 py-1.5 bg-[#F8F8FD] border-b border-[#EAEAF4]">
      {tools.map(({ icon, cmd, label }) => (
        <button
          key={cmd}
          type="button"
          aria-label={label}
          onMouseDown={(e) => { e.preventDefault(); onFormat(cmd); }}
          className="w-7 h-7 rounded-md flex items-center justify-center text-[#64647A] hover:text-[#4648D4] hover:bg-[#EEF0FF] transition-all duration-150 focus:outline-none"
        >
          {icon}
        </button>
      ))}
    </div>
  );
}

// ─── Draft Preview Area ───────────────────────────────────────────────────────

function DraftPreview({
  content,
  onRefresh,
  onCopy,
}: {
  content: string;
  onRefresh: () => void;
  onCopy: () => void;
}) {
  const editorRef = useRef<HTMLDivElement>(null);

  // Render markdown-like bold syntax
  const renderContent = (raw: string) => {
    return raw
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/•/g, "•")
      .split("\n")
      .map((line, i) => {
        if (!line.trim()) return `<br/>`;
        if (line.startsWith("•")) return `<li class="ml-4 list-disc text-[13px] text-[#464554] leading-relaxed">${line.slice(1).trim()}</li>`;
        return `<p class="text-[13px] text-[#464554] leading-relaxed">${line}</p>`;
      })
      .join("");
  };

  const handleFormat = (cmd: string) => {
    if (cmd === "link") {
      const url = prompt("Nhập URL:");
      if (url) document.execCommand("createLink", false, url);
    } else {
      document.execCommand(cmd, false);
    }
    editorRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Sub-header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[12px] font-semibold text-[#464554]">Dự thảo được tạo:</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Tạo lại"
            onClick={onRefresh}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9090B0] hover:text-[#4648D4] hover:bg-[#EEF0FF] transition-all duration-150"
          >
            <RefreshIcon />
          </button>
          <button
            type="button"
            aria-label="Sao chép"
            onClick={onCopy}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9090B0] hover:text-[#4648D4] hover:bg-[#EEF0FF] transition-all duration-150"
          >
            <CopyIcon />
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col rounded-xl border border-[#DDDDF0] bg-white overflow-hidden focus-within:border-[#6B6BFF] focus-within:ring-2 focus-within:ring-[#6B6BFF]/15 transition-all duration-150">
        <EditorToolbar onFormat={handleFormat} />
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          className="flex-1 px-4 py-3 text-[13px] text-[#464554] leading-relaxed overflow-y-auto focus:outline-none min-h-[280px] max-h-[340px]"
          dangerouslySetInnerHTML={{ __html: renderContent(content) }}
        />
      </div>
    </div>
  );
}

// ─── Loading Shimmer ──────────────────────────────────────────────────────────

function GeneratingShimmer() {
  return (
    <div className="flex flex-col gap-3 px-4 py-3">
      {[80, 100, 65, 90, 75, 55].map((w, i) => (
        <div
          key={i}
          className="h-3 rounded-full bg-gradient-to-r from-[#EEF0FF] via-[#D5D5FF] to-[#EEF0FF] animate-pulse"
          style={{ width: `${w}%`, animationDelay: `${i * 100}ms` }}
        />
      ))}
      <div className="flex items-center gap-2 mt-2 text-[12px] text-[#6B6BFF] font-semibold animate-pulse">
        <SparklesIcon size={12} />
        AI đang soạn thảo...
      </div>
    </div>
  );
}

// ─── Left Panel ───────────────────────────────────────────────────────────────

function LeftPanel({
  recipient, setRecipient,
  topic, setTopic,
  activeChip, setActiveChip,
  onGenerate, isGenerating,
}: {
  recipient: string;
  setRecipient: (v: string) => void;
  topic: string;
  setTopic: (v: string) => void;
  activeChip: string | null;
  setActiveChip: (v: string | null) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}) {
  const RECIPIENTS = [
    "Tất cả học viên",
    "Lớp AI Foundations",
    "Lớp Data Science AI",
    "Lớp Prompt Engineering",
    "Học viên chưa hoàn thành",
  ];

  return (
    <div className="flex flex-col gap-4 pr-5 border-r border-[#F0F0F8]">
      {/* Recipient */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="recipient-select" className="text-[12px] font-semibold text-[#464554]">
          Gửi đến:
        </label>
        <div className="relative">
          <select
            id="recipient-select"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full appearance-none h-10 px-3 pr-9 rounded-xl border border-[#DDDDF0] bg-[#FAFAFE] text-sm text-[#1A1A2E] focus:outline-none focus:border-[#6B6BFF] focus:ring-2 focus:ring-[#6B6BFF]/15 transition-all duration-150 cursor-pointer"
          >
            {RECIPIENTS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#9090B0]">
            <ChevronDownIcon />
          </div>
        </div>
      </div>

      {/* Topic input */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="notification-topic" className="text-[12px] font-semibold text-[#464554]">
          Chủ đề hoặc ý chính:
        </label>
        <textarea
          id="notification-topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Nhập chủ đề hoặc ý chính..."
          rows={5}
          className="w-full px-3 py-2.5 rounded-xl border border-[#DDDDF0] bg-[#FAFAFE] text-[13px] text-[#1A1A2E] placeholder:text-[#C4C4D8] focus:outline-none focus:border-[#6B6BFF] focus:ring-2 focus:ring-[#6B6BFF]/15 transition-all duration-150 resize-none leading-relaxed"
        />
      </div>

      {/* Suggestion chips */}
      <div className="flex flex-col gap-2">
        <span className="text-[12px] font-semibold text-[#464554]">Gợi ý chủ đề:</span>
        <div className="flex flex-wrap gap-2">
          {SUGGESTION_CHIPS.map(({ icon, label }) => (
            <SuggestionChip
              key={label}
              icon={icon}
              label={label}
              active={activeChip === label}
              onClick={() => {
                setActiveChip(activeChip === label ? null : label);
                if (activeChip !== label) setTopic(label);
              }}
            />
          ))}
        </div>
      </div>

      {/* Generate CTA */}
      <button
        type="button"
        id="btn-generate-draft"
        onClick={onGenerate}
        disabled={isGenerating}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-[13px] font-semibold text-white bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] shadow-[0_4px_14px_rgba(70,72,212,0.35)] hover:shadow-[0_6px_20px_rgba(70,72,212,0.5)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:pointer-events-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4648D4]/40"
      >
        {isGenerating ? (
          <>
            <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            Đang tạo...
          </>
        ) : (
          <>
            <span className="animate-pulse"><SparklesIcon size={13} /></span>
            Tạo dự thảo bằng AI
          </>
        )}
      </button>
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

export function AINotificationModal({ isOpen, onClose }: AINotificationModalProps) {
  const [recipient, setRecipient] = useState("Tất cả học viên");
  const [topic, setTopic] = useState("");
  const [activeChip, setActiveChip] = useState<string | null>(null);
  const [draft, setDraft] = useState(MOCK_DRAFT);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  // Trap focus & handle ESC
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setDraft("");
    await new Promise((r) => setTimeout(r, 1800));
    setDraft(MOCK_DRAFT);
    setIsGenerating(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(draft.replace(/\*\*(.*?)\*\*/g, "$1")).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveDraft = () => {
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1200);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[3px]"
        onClick={onClose}
        aria-hidden
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          role="dialog"
          aria-modal
          aria-label="Tạo thông báo mới bằng AI"
          className="pointer-events-auto w-full max-w-[740px] bg-white rounded-2xl border border-[#EAEAF4] shadow-[0_24px_80px_rgba(70,72,212,0.18)] overflow-hidden"
        >
          {/* Modal header */}
          <div className="flex items-start gap-3 px-6 py-5 border-b border-[#F0F0F8]">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6B6BFF] to-[#4648D4] flex items-center justify-center text-white shadow-[0_4px_14px_rgba(107,107,255,0.4)] shrink-0">
              <SparklesIcon size={17} />
            </div>
            <div className="flex-1">
              <h2 className="text-[16px] font-extrabold text-[#1A1A2E] tracking-tight">
                Tạo thông báo mới
              </h2>
              <p className="text-[12px] text-[#9090B0] mt-0.5">
                Sử dụng AI để soạn thảo thông báo chuyên nghiệp trong giây lát.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng"
              className="w-8 h-8 rounded-xl flex items-center justify-center text-[#9090B0] hover:text-[#1A1A2E] hover:bg-[#F4F4FA] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#EAEAF4] shrink-0"
            >
              <XIcon />
            </button>
          </div>

          {/* Two-column body */}
          <div className="grid grid-cols-[280px_1fr] gap-0 max-h-[520px]">
            {/* Left form */}
            <div className="px-5 py-5 overflow-y-auto">
              <LeftPanel
                recipient={recipient}
                setRecipient={setRecipient}
                topic={topic}
                setTopic={setTopic}
                activeChip={activeChip}
                setActiveChip={setActiveChip}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
              />
            </div>

            {/* Right draft */}
            <div className="px-5 py-5 flex flex-col overflow-y-auto">
              {isGenerating ? (
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[12px] font-semibold text-[#464554]">Dự thảo được tạo:</span>
                  </div>
                  <div className="flex-1 rounded-xl border border-[#DDDDF0] bg-white overflow-hidden">
                    <div className="px-3 py-2 bg-[#F8F8FD] border-b border-[#EAEAF4] flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-5 h-4 rounded bg-[#EAEAF4]" />
                      ))}
                    </div>
                    <GeneratingShimmer />
                  </div>
                </div>
              ) : draft ? (
                <DraftPreview
                  content={draft}
                  onRefresh={handleGenerate}
                  onCopy={handleCopy}
                />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 text-[#C4C4D8] border-2 border-dashed border-[#EAEAF4] rounded-xl">
                  <span className="text-4xl">✦</span>
                  <p className="text-[12px] font-semibold text-center">
                    Nhập chủ đề và nhấn{" "}
                    <span className="text-[#6B6BFF]">"Tạo dự thảo bằng AI"</span>
                    <br />để xem kết quả ở đây.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Modal footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#F0F0F8]">
            {copied && (
              <span className="text-[11px] text-emerald-600 font-semibold mr-auto">
                ✓ Đã sao chép vào clipboard!
              </span>
            )}
            {saved && (
              <span className="text-[11px] text-[#6B6BFF] font-semibold mr-auto animate-pulse">
                ✓ Đã lưu nháp!
              </span>
            )}
            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-5 py-2.5 text-sm font-semibold text-[#64647A] hover:text-[#1A1A2E] transition-colors duration-150 focus:outline-none"
            >
              Lưu nháp
            </button>
            <button
              type="button"
              id="btn-send-notification-modal"
              disabled={!draft || isGenerating}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] shadow-[0_4px_14px_rgba(70,72,212,0.35)] hover:shadow-[0_6px_20px_rgba(70,72,212,0.5)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4648D4]/40"
            >
              Gửi thông báo
            </button>
          </div>
        </div>
      </div>
    </>
  );
}


================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\student-management\icons.tsx
================================================================

// ─── Student Management — Icons ───────────────────────────────────────────────

const B = {
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor" as const,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

export function SearchIcon({ size = 15 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

export function BellIcon({ size = 18 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={1.8}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

export function MessageIcon({ size = 18 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={1.8}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export function DownloadIcon({ size = 14 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

export function SparklesIcon({ size = 14 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2}>
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  );
}

export function ChevronDownIcon({ size = 13 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function ChevronLeftIcon({ size = 14 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

export function ChevronRightIcon({ size = 14 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export function TrendUpIcon({ size = 12 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

export function PlusIcon({ size = 13 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2.5}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export function FilterIcon({ size = 13 }: { size?: number }) {
  return (
    <svg {...B} width={size} height={size} strokeWidth={2}>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}


================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\student-management\index.ts
================================================================

// ─── Student Management — Public API ─────────────────────────────────────────

export { StudentManagementContainer } from "./StudentManagementContainer";


================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\student-management\RightPanels.tsx
================================================================

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { SparklesIcon, TrendUpIcon, PlusIcon } from "./icons";

interface Discussion {
  id: string;
  name: string;
  avatarInitials: string;
  avatarColor: string;
  message: string;
  time: string;
}

const DISCUSSIONS: Discussion[] = [
  {
    id: "d1",
    name: "Nam Đặng",
    avatarInitials: "NĐ",
    avatarColor: "bg-indigo-600",
    message: "\"Thưa thầy, làm sao để tối ưu hóa Prompt cho GPT-4 trong...\"",
    time: "1 phút trước",
  },
  {
    id: "d2",
    name: "Phương Vy",
    avatarInitials: "PV",
    avatarColor: "bg-teal-600",
    message: "\"Bài tập 3 chương 2 có lỗi logic ở phần thuật toán không ạ?\"",
    time: "2 giờ trước",
  },
  {
    id: "d3",
    name: "Khánh Hoàng",
    avatarInitials: "KH",
    avatarColor: "bg-purple-600",
    message: "\"Cảm ơn thầy và tài liệu bổ trợ hữu ích!\"",
    time: "Hôm qua",
  },
];

function DiscussionAvatar({ initials, color }: { initials: string; color: string }) {
  return (
    <div className={twMerge("w-8 h-8 rounded-xl flex items-center justify-center text-white text-[11px] font-black shrink-0 shadow-2xs", color)}>
      <span>{initials}</span>
    </div>
  );
}

function DiscussionPanel() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-2xs overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <span className="text-xs font-black text-gray-900 tracking-wider uppercase">
          Thảo luận mới nhất
        </span>
        <span className="px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-[10px] font-black">
          3 CHƯA ĐỌC
        </span>
      </div>

      <div className="divide-y divide-gray-100">
        {DISCUSSIONS.map((d) => (
          <div key={d.id} className="flex items-start gap-3 p-3.5 hover:bg-gray-50/80 transition-colors cursor-pointer">
            <DiscussionAvatar initials={d.avatarInitials} color={d.avatarColor} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-extrabold text-gray-900 truncate">{d.name}</span>
                <span className="text-[10px] text-gray-400 font-medium shrink-0">{d.time}</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 mt-0.5 italic">
                {d.message}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3.5 border-t border-gray-100 text-center bg-gray-50/50">
        <Link href="/instructor/discussions" className="text-xs font-bold text-[#4F46E5] hover:underline block w-full">
          Xem tất cả thảo luận học viên ➔
        </Link>
      </div>
    </div>
  );
}

const QUICK_TAGS = ["Động viên học tập", "Nhắc lịch kiểm tra", "Cập nhật bài giảng mới"];

function AIAnnouncementPanel({ onOpenModal }: { onOpenModal: () => void }) {
  const [topic, setTopic] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  return (
    <div className="rounded-2xl border border-indigo-200 bg-indigo-50/20 shadow-2xs overflow-hidden">
      <div className="p-4 border-b border-indigo-100 flex items-center gap-2 bg-indigo-50/50">
        <span className="text-[#4F46E5]"><SparklesIcon size={16} /></span>
        <span className="text-xs font-black text-[#4F46E5] tracking-wide uppercase">Trợ lý Thông báo AI</span>
      </div>

      <div className="p-4 flex flex-col gap-3">
        <p className="text-xs text-gray-600 leading-relaxed">
          Soạn thảo và gửi thông báo khích lệ tự động tới toàn bộ cohort bằng sức mạnh AI MindNova.
        </p>

        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Nhập ý chính hoặc chủ đề cần phát đi..."
          rows={3}
          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#4F46E5] resize-none shadow-2xs"
        />

        <div className="flex items-center gap-1.5 flex-wrap">
          {QUICK_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={twMerge(
                "px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer",
                activeTag === tag
                  ? "bg-[#4F46E5] text-white border-[#4F46E5]"
                  : "border-gray-200 text-gray-600 bg-white hover:border-indigo-300 hover:text-indigo-600"
              )}
            >
              + {tag}
            </button>
          ))}
        </div>

        <button
          type="button"
          id="btn-ai-announcement"
          onClick={onOpenModal}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-extrabold text-white bg-[#4F46E5] hover:bg-[#4338CA] shadow-sm transition-all cursor-pointer mt-1"
        >
          <PlusIcon size={14} />
          <span>Tạo Thông Báo Bằng AI Ngay</span>
        </button>
      </div>
    </div>
  );
}

interface StatBarProps {
  label: string;
  value: string;
  percent: number;
  color: "blue" | "red" | "purple";
}

function StatBar({ label, value, percent, color }: StatBarProps) {
  const barColor = {
    blue: "bg-[#4F46E5]",
    red: "bg-rose-500",
    purple: "bg-indigo-400",
  }[color];

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-600 font-bold">{label}</span>
        <span className={twMerge("text-xs font-black font-mono", color === "red" ? "text-rose-600" : "text-indigo-900")}>
          {value}
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
        <div className={twMerge("h-full rounded-full transition-all duration-700", barColor)} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function ProgressStatsPanel() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-2xs overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <span className="text-xs font-black text-gray-900 tracking-wider uppercase">
          Thống Kê Tổng Quan Khóa Học
        </span>
      </div>

      <div className="p-4 flex flex-col gap-4">
        <StatBar label="Tỷ lệ hoàn thành trung bình" value="68%" percent={68} color="blue" />
        <StatBar label="Tỷ lệ rớt chứng chỉ dự kiến" value="4.2%" percent={4.2} color="red" />
        <StatBar label="Học viên tích cực (Tuần qua)" value="1,240" percent={75} color="purple" />

        <div className="rounded-xl bg-emerald-50/80 border border-emerald-200 p-3.5 flex items-start gap-2.5">
          <span className="text-emerald-600 mt-0.5 shrink-0"><TrendUpIcon size={16} /></span>
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-black text-emerald-800 uppercase tracking-wider">Gợi ý Tối ưu AI</span>
            <p className="text-xs text-emerald-700 leading-relaxed font-medium">
              Tỷ lệ thảo luận tăng 15%. Nên ưu tiên giải đáp các câu hỏi chưa đọc để duy trì tỷ lệ giữ chân học viên!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RightPanels({ onOpenModal }: { onOpenModal: () => void }) {
  return (
    <div className="flex flex-col gap-5 w-full">
      <DiscussionPanel />
      <AIAnnouncementPanel onOpenModal={onOpenModal} />
      <ProgressStatsPanel />
    </div>
  );
}


================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\student-management\StudentManagementContainer.tsx
================================================================

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { StudentTable } from "./StudentTable";
import { RightPanels } from "./RightPanels";
import { AINotificationModal } from "./AINotificationModal";
import { DownloadIcon, SparklesIcon } from "./icons";

function StudentNavigationTabs({ active }: { active: "students" | "analytics" }) {
  return (
    <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-gray-200 shadow-2xs w-fit">
      <Link
        href="/instructor/students"
        className={twMerge(
          "px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer",
          active === "students"
            ? "bg-[#4F46E5] text-white shadow-sm"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        )}
      >
        <span>👥 Danh sách &amp; Chăm sóc Học viên</span>
      </Link>

      <Link
        href="/instructor/analytics"
        className={twMerge(
          "px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer",
          active === "analytics"
            ? "bg-[#4F46E5] text-white shadow-sm"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        )}
      >
        <span>📈 Phân tích Tương tác &amp; AI Insights</span>
      </Link>
    </div>
  );
}

function PageHeader({ onOpenModal }: { onOpenModal: () => void }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-black text-gray-900 tracking-tight leading-tight">
          Danh Sách &amp; Quản Trị Học Viên
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Theo dõi tiến độ học tập, điểm trắc nghiệm và gửi thông báo khích lệ học viên trên hệ thống MindNova AI.
        </p>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap shrink-0">
        <button
          type="button"
          id="btn-export-report"
          onClick={() => alert("Đang tải xuống báo cáo danh sách học viên CSV...")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 transition-all cursor-pointer shadow-2xs"
        >
          <DownloadIcon size={14} />
          <span>Xuất Danh Sách CSV</span>
        </button>

        <button
          type="button"
          id="btn-send-notification"
          onClick={onOpenModal}
          className="flex items-center gap-2 px-4.5 py-2 rounded-xl text-xs font-extrabold text-white bg-[#4F46E5] hover:bg-[#4338CA] shadow-sm transition-all cursor-pointer"
        >
          <SparklesIcon size={14} />
          <span>Gửi Thông Báo AI</span>
        </button>
      </div>
    </div>
  );
}

export function StudentManagementContainer() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F4F8] font-sans">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col gap-6 pb-16">
          <StudentNavigationTabs active="students" />
          <PageHeader onOpenModal={() => setModalOpen(true)} />

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6 items-start">
            <div className="min-w-0">
              <StudentTable />
            </div>

            <div className="flex flex-col gap-4">
              <RightPanels onOpenModal={() => setModalOpen(true)} />
            </div>
          </div>
        </div>
      </div>

      <AINotificationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}


================================================================
File: H:\du_an\website\mindnova-ai\src\components\page\instructor\student-management\StudentTable.tsx
================================================================

"use client";

import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

export type ProgressStatus = "completed" | "in-progress" | "at-risk";

export interface Student {
  id: string;
  name: string;
  email: string;
  avatarInitials: string;
  avatarColor: string;
  course: string;
  progress: number;
  status: ProgressStatus;
  joinDate: string;
  lastActive: string;
  quizAverage: number;
  currentStudyNode: string;
}

const STUDENTS: Student[] = [
  { id: "s1", name: "An Nguyễn", email: "an.nguyen@example.com", avatarInitials: "AN", avatarColor: "bg-indigo-600", course: "AI Foundations", progress: 89, status: "completed", joinDate: "12/10/2026", lastActive: "2 giờ trước", quizAverage: 94, currentStudyNode: "Chuyên đề 3: Enterprise AI" },
  { id: "s2", name: "Minh Trần", email: "minh.tran@gmail.com", avatarInitials: "MT", avatarColor: "bg-teal-600", course: "Data Science AI", progress: 42, status: "in-progress", joinDate: "05/11/2026", lastActive: "1 ngày trước", quizAverage: 78, currentStudyNode: "Chuyên đề 2: Mô hình Hóa Dữ liệu" },
  { id: "s3", name: "Linh Hoàng", email: "linh.h@web.vn", avatarInitials: "LH", avatarColor: "bg-rose-600", course: "AI Foundations", progress: 95, status: "completed", joinDate: "15/09/2026", lastActive: "5 phút trước", quizAverage: 98, currentStudyNode: "Dự án tốt nghiệp Capstone" },
  { id: "s4", name: "Bảo Lê", email: "bao.le@company.com", avatarInitials: "BL", avatarColor: "bg-amber-600", course: "Prompt Engineering", progress: 12, status: "at-risk", joinDate: "01/12/2026", lastActive: "8 ngày trước", quizAverage: 52, currentStudyNode: "Chuyên đề 1: Kiến trúc Nền tảng" },
  { id: "s5", name: "Hà Phạm", email: "ha.pham@email.vn", avatarInitials: "HP", avatarColor: "bg-sky-600", course: "AI Foundations", progress: 67, status: "in-progress", joinDate: "20/10/2026", lastActive: "3 giờ trước", quizAverage: 82, currentStudyNode: "Chuyên đề 2: Tinh chỉnh LLM" },
  { id: "s6", name: "Duy Ngô", email: "duy.ngo@dev.io", avatarInitials: "DN", avatarColor: "bg-violet-600", course: "Data Science AI", progress: 78, status: "in-progress", joinDate: "08/11/2026", lastActive: "4 giờ trước", quizAverage: 85, currentStudyNode: "Chuyên đề 3: Trực quan hóa AI" },
  { id: "s7", name: "Trang Vũ", email: "trang.vu@studio.vn", avatarInitials: "TV", avatarColor: "bg-pink-600", course: "Prompt Engineering", progress: 100, status: "completed", joinDate: "30/09/2026", lastActive: "Hôm qua", quizAverage: 91, currentStudyNode: "Đã hoàn tất chứng chỉ" },
  { id: "s8", name: "Khoa Đặng", email: "khoa.dang@mail.com", avatarInitials: "KĐ", avatarColor: "bg-emerald-600", course: "AI Foundations", progress: 55, status: "in-progress", joinDate: "14/11/2026", lastActive: "6 giờ trước", quizAverage: 74, currentStudyNode: "Chuyên đề 2: Tinh chỉnh LLM" },
  { id: "s9", name: "Mai Đinh", email: "mai.dinh@uni.edu", avatarInitials: "MĐ", avatarColor: "bg-cyan-600", course: "Data Science AI", progress: 31, status: "at-risk", joinDate: "22/10/2026", lastActive: "14 ngày trước", quizAverage: 48, currentStudyNode: "Chuyên đề 1: Python Data Prep" },
  { id: "s10", name: "Phúc Bùi", email: "phuc.bui@startup.io", avatarInitials: "PB", avatarColor: "bg-red-600", course: "Prompt Engineering", progress: 84, status: "in-progress", joinDate: "03/12/2026", lastActive: "Vừa mới xong", quizAverage: 89, currentStudyNode: "Chuyên đề 3: Tự động hóa Agentic" },
];

const COLS = ["Hồ Sơ Học Viên", "Khóa Học Ghi Danh", "Tiến Độ & Trạng Thái", "Điểm Kiểm Tra", "Hoạt Động Gần Nhất", "Chuyên Đề Đang Theo"];

function ProgressBadge({ progress, status }: { progress: number; status: ProgressStatus }) {
  const colorMap: Record<ProgressStatus, { bar: string; text: string; label: string }> = {
    completed: { bar: "bg-emerald-500", text: "text-emerald-700", label: "Hoàn tất" },
    "in-progress": { bar: "bg-[#4F46E5]", text: "text-[#4F46E5]", label: "Đang học" },
    "at-risk": { bar: "bg-rose-500", text: "text-rose-600", label: "Nguy cơ trễ" },
  };
  const { bar, text, label } = colorMap[status];

  return (
    <div className="flex flex-col gap-1.5 min-w-[95px]">
      <div className="flex items-center justify-between gap-2">
        <span className={twMerge("text-xs font-black font-mono", text)}>{progress}%</span>
        <span className={twMerge("text-[10px] font-extrabold px-2 py-0.5 rounded-md leading-none border", status === "completed" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : status === "in-progress" ? "bg-indigo-50 text-[#4F46E5] border-indigo-200" : "bg-rose-50 text-rose-700 border-rose-200")}>
          {label}
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
        <div className={twMerge("h-full rounded-full transition-all duration-500", bar)} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <div className={twMerge("w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-black shrink-0 shadow-2xs", color)}>
      {initials}
    </div>
  );
}

export function StudentTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("TẤT CẢ");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filtered = STUDENTS.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = filterCourse === "TẤT CẢ" || s.course === filterCourse;
    return matchesSearch && matchesCourse;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const displayed = filtered.slice((page - 1) * pageSize, page * pageSize);

  const moduleDist = [
    { module: "Chuyên đề 1: Nền tảng Core AI", count: 3, percentage: 30, color: "bg-indigo-400" },
    { module: "Chuyên đề 2: Tinh chỉnh & RAG", count: 4, percentage: 40, color: "bg-[#4F46E5]" },
    { module: "Chuyên đề 3: Đồ án Thực tiễn", count: 3, percentage: 30, color: "bg-emerald-500" },
  ];

  return (
    <div className="w-full flex flex-col gap-5 animate-fadeIn">
      {/* Top Banner & Privacy Guarantee */}
      <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
            <span>👥 Quản Trị &amp; Theo Dõi Tiến Độ Tranh Đua Học Viên</span>
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Phân tích tỷ lệ tương tác, tần suất nộp bài và hiệu suất hoàn thành chứng chỉ theo thời gian thực.
          </p>
        </div>

        {/* Strict Data Exemption Tag */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-50/70 border border-indigo-100 text-indigo-950 text-xs font-extrabold shrink-0">
          <span className="text-base">🔒</span>
          <span>Bảo mật quyền riêng tư: Thông tin thanh toán &amp; mật khẩu được bảo vệ an toàn</span>
        </div>
      </div>

      {/* Cohort Heatmap Distribution */}
      <div className="p-6 rounded-2xl bg-[#4F46E5] text-white border border-indigo-400 shadow-sm flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-base font-black text-white flex items-center gap-2">
              <span>🔥 Bản Đồ Nhiệt Phân Bổ Tiến Độ Học Tập Trắc Nghiệm</span>
            </h4>
            <p className="text-xs text-indigo-100 mt-0.5">Biểu đồ tổng hợp cho thấy phần lớn học viên của bạn đang tích cực theo học ở chuyên đề nào.</p>
          </div>
          <span className="px-3.5 py-1.5 rounded-xl bg-white/10 font-mono text-xs font-black text-white border border-white/20 shrink-0">
            Tổng Sĩ Số: 2,482 Học Viên
          </span>
        </div>

        {/* Visual Bar Stack */}
        <div className="flex flex-col gap-2">
          <div className="w-full h-8 rounded-xl bg-white/10 overflow-hidden flex p-1 gap-1 border border-white/10">
            {moduleDist.map((m) => (
              <div
                key={m.module}
                className={twMerge("h-full rounded-lg transition-all flex items-center justify-center font-black text-[11px] text-white shadow-2xs truncate px-2", m.color)}
                style={{ width: `${m.percentage}%` }}
              >
                {m.module} ({m.percentage}%)
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-[11px] font-extrabold text-indigo-100 px-1">
            <span>Giai đoạn Khởi tạo (30%)</span>
            <span>Thực hành Chuyên sâu (40%)</span>
            <span>Đồ án Tốt nghiệp Capstone (30%)</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
        <input
          id="search-student"
          type="search"
          placeholder="🔍 Tìm theo họ tên hoặc email..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          className="w-full sm:w-72 px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#4F46E5] bg-gray-50/50"
        />

        <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
          {["TẤT CẢ", "AI Foundations", "Data Science AI", "Prompt Engineering"].map((crs) => (
            <button
              key={crs}
              type="button"
              onClick={() => {
                setFilterCourse(crs);
                setPage(1);
              }}
              className={twMerge(
                "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer",
                filterCourse === crs ? "bg-[#4F46E5] text-white shadow-2xs font-extrabold" : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
              )}
            >
              {crs}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table Grid */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/70 text-[11px] font-black text-gray-500 uppercase tracking-wider">
                {COLS.map((col) => (
                  <th key={col} className="px-6 py-3.5 whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs font-medium">
              {displayed.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-14 text-center text-xs font-bold text-gray-400">
                    Không tìm thấy hồ sơ học viên nào khớp với tiêu chí lựa chọn của bạn.
                  </td>
                </tr>
              ) : (
                displayed.map((st) => (
                  <tr key={st.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar initials={st.avatarInitials} color={st.avatarColor} />
                        <div className="min-w-0">
                          <p className="font-extrabold text-gray-900 truncate">{st.name}</p>
                          <p className="text-[11px] font-medium text-gray-400 truncate">{st.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 whitespace-nowrap">
                        {st.course}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <ProgressBadge progress={st.progress} status={st.status} />
                    </td>
                    <td className="px-6 py-4">
                      <span className={twMerge("font-mono text-xs font-black px-2.5 py-1 rounded-lg border", st.quizAverage >= 80 ? "text-emerald-700 bg-emerald-50 border-emerald-200" : "text-amber-700 bg-amber-50 border-amber-200")}>
                        {st.quizAverage}/100
                      </span>
                    </td>
                    <td className="px-6 py-4 font-extrabold text-xs text-gray-500 whitespace-nowrap">
                      ⏱️ {st.lastActive}
                    </td>
                    <td className="px-6 py-4 text-xs font-black text-gray-800">
                      📍 {st.currentStudyNode}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-4 px-6 bg-gray-50/60 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs font-bold text-gray-500">
            Hiển thị trang <strong className="text-gray-900 font-extrabold">{page}</strong> trên <strong className="text-gray-900 font-extrabold">{totalPages}</strong> ({filtered.length} học viên khớp)
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Trang trước"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-40 transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeftIcon size={16} />
            </button>
            <button
              type="button"
              aria-label="Trang sau"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-40 transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronRightIcon size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


================================================================
File: H:\du_an\website\mindnova-ai\src\features\instructor\create-course\components\CreateCourseContainer.tsx
================================================================

"use client";

// ─── CreateCourseContainer ─────────────────────────────────────────────────────
// Root client component that manages the multi-step form.
// All data is stored in Zustand store (draft) — NO API calls until "Hoàn tất & Đăng".

import { useEffect, useCallback, useState } from "react";
import Link from "next/link";
import { StepIndicator } from "./StepIndicator";
import { Step1BasicInfo } from "./Step1BasicInfo";
import { Step2CourseStructure } from "./Step2CourseStructure";
import { Step3SettingsPrice } from "./Step3SettingsPrice";
import { AIOutlineModal } from "./AIOutlineModal";
import { ArrowRightIcon, SaveIcon, BookOpenIcon, SparklesIcon } from "./icons";
import type { CourseBasicInfo, StepKey } from "../types";
import type { GeneratedOutline } from "./AIOutlineModal";
import { useCreateCourse, useUploadCourseThumbnail, useUpdateCoursePrice, useUpdateCourseStatus } from "../api";
import { useCreateModule, useCreateLesson, useUpdateLesson, useCreateQuiz } from "../../lesson-management/api";
import { useCreateCourseStore } from "../stores/createCourseStore";

// ─── Footer bar ───────────────────────────────────────────────────────────────

interface FormFooterProps {
  step: StepKey;
  onBack: () => void;
  onNext: () => void;
}

function FormFooter({ step, onBack, onNext }: FormFooterProps) {
  const isFirst = step === 1;

  return (
    <div className="flex items-center justify-between pt-1 mt-1 border-t border-[#F0F0F8]">
      {/* Left info */}
      <div className="flex items-center gap-1.5 text-[#9090B0]">
        <SaveIcon size={12} />
        <span className="text-[12px]">Dữ liệu được lưu tạm tự động</span>
      </div>

      {/* CTA row */}
      <div className="flex items-center gap-3">
        {isFirst ? (
          <Link
            href="/instructor"
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-[#64647A] border border-[#EAEAF4] bg-white hover:bg-[#F4F4FA] hover:text-[#1A1A2E] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#EAEAF4]"
          >
            Hủy bỏ
          </Link>
        ) : (
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-[#64647A] border border-[#EAEAF4] bg-white hover:bg-[#F4F4FA] hover:text-[#1A1A2E] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#EAEAF4]"
          >
            ← Quay lại
          </button>
        )}

        <button
          id="btn-next-step"
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] shadow-[0_4px_14px_rgba(70,72,212,0.35)] hover:shadow-[0_6px_20px_rgba(70,72,212,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4648D4]/40"
        >
          Tiếp theo
          <ArrowRightIcon size={15} />
        </button>
      </div>
    </div>
  );
}

// ─── Footer bottom bar ────────────────────────────────────────────────────────

function PageFooter() {
  return (
    <div className="flex items-center justify-between text-[11px] text-[#B0B0C8]">
      <div className="flex items-center gap-1.5">
        <SaveIcon size={11} />
        <span>Dữ liệu được lưu tạm tự động</span>
      </div>
      <button
        type="button"
        className="flex items-center gap-1.5 hover:text-[#4648D4] transition-colors duration-150"
      >
        <BookOpenIcon size={11} />
        <span>Xem lại nguyên tắc tạo nội dung</span>
      </button>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function CreateCourseContainer() {
  // ── Zustand store ─────────────────────────────────────────────────────────────
  const step = useCreateCourseStore((s) => s.step);
  const courseInfo = useCreateCourseStore((s) => s.courseInfo);
  const modules = useCreateCourseStore((s) => s.modules);
  const settings = useCreateCourseStore((s) => s.settings);
  const setCourseInfo = useCreateCourseStore((s) => s.setCourseInfo);
  const setStep = useCreateCourseStore((s) => s.setStep);
  const goNext = useCreateCourseStore((s) => s.goNext);
  const goBack = useCreateCourseStore((s) => s.goBack);
  const resetDraft = useCreateCourseStore((s) => s.resetDraft);
  const hydrate = useCreateCourseStore((s) => s.hydrate);

  // ── AI Outline Modal ──────────────────────────────────────────────────────────
  const [isOutlineOpen, setIsOutlineOpen] = useState(false);

  // ── Publishing state ──────────────────────────────────────────────────────────
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [step2Error, setStep2Error] = useState<string | null>(null);

  // ── API mutations (only used at final publish) ────────────────────────────────
  const { mutateAsync: createCourse } = useCreateCourse();
  const { mutateAsync: uploadThumbnail } = useUploadCourseThumbnail();
  const { mutateAsync: updatePrice } = useUpdateCoursePrice();
  const { mutateAsync: updateStatus } = useUpdateCourseStatus();
  const { mutateAsync: createModule } = useCreateModule();
  const { mutateAsync: createLesson } = useCreateLesson();
  const { mutateAsync: createQuiz } = useCreateQuiz();

  // ── Hydrate on mount ──────────────────────────────────────────────────────────
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // ── AI outline handler ────────────────────────────────────────────────────────
  const handleApplyOutline = useCallback((_outline: GeneratedOutline) => {
    // In production: convert outline chapters → modules and merge into form
    setIsOutlineOpen(false);
  }, []);

  // ── Course info change handler ────────────────────────────────────────────────
  const handleChange = useCallback(
    <K extends keyof CourseBasicInfo>(key: K, value: CourseBasicInfo[K]) => {
      setCourseInfo(key, value);
    },
    [setCourseInfo],
  );

  // ── Step validation & navigation ──────────────────────────────────────────────
  const handleNext = useCallback(() => {
    if (step === 1) {
      if (!courseInfo.title.trim()) {
        alert("Vui lòng nhập tên khóa học.");
        return;
      }
      if (!courseInfo.thumbnailFile) {
        alert("Vui lòng tải lên ảnh bìa khóa học.");
        return;
      }
    }
    if (step === 2) {
      let isValid = true;
      let errorMessage = "";
      
      if (modules.length === 0) {
        isValid = false;
        errorMessage = "Vui lòng thêm ít nhất một chương học.";
      } else {
        for (const mod of modules) {
          if (mod.lessons.length === 0) {
            isValid = false;
            errorMessage = `Chương "${mod.title}" chưa có bài học nào.`;
            break;
          }
          for (const lesson of mod.lessons) {
            if (lesson.type === "quiz") {
              if (!lesson.quizData || !lesson.quizData.questions || lesson.quizData.questions.length === 0) {
                isValid = false;
                errorMessage = `Bài kiểm tra "${lesson.title}" chưa có câu hỏi nào.`;
                break;
              }
              for (const q of lesson.quizData.questions) {
                if (!q.content?.trim()) {
                  isValid = false;
                  errorMessage = `Có câu hỏi bị để trống nội dung trong bài kiểm tra "${lesson.title}".`;
                  break;
                }
                if (!q.answers || q.answers.length < 2) {
                  isValid = false;
                  errorMessage = `Câu hỏi trong bài "${lesson.title}" phải có ít nhất 2 đáp án.`;
                  break;
                }
                const hasCorrect = q.answers.some(ans => ans.is_correct);
                if (!hasCorrect) {
                  isValid = false;
                  errorMessage = `Câu hỏi trong bài "${lesson.title}" chưa chọn đáp án đúng.`;
                  break;
                }
                const hasEmptyOption = q.answers.some(ans => !ans.content?.trim());
                if (hasEmptyOption) {
                  isValid = false;
                  errorMessage = `Không được để trống câu trả lời trong bài "${lesson.title}".`;
                  break;
                }
              }
            } else {
              if (!lesson.content?.trim() && !lesson.temp_media_ids?.length) {
                isValid = false;
                errorMessage = `Bài học "${lesson.title}" chưa có nội dung hoặc video.`;
                break;
              }
            }
            if (!isValid) break;
          }
          if (!isValid) break;
        }
      }
      
      if (!isValid) {
        setStep2Error(errorMessage);
        return;
      }
      setStep2Error(null);
    }
    // Step 1, 2: Just move to next step. NO API calls.
    if (step < 3) {
      goNext();
    }
  }, [step, courseInfo, modules, goNext]);

  const handleBack = useCallback(() => {
    goBack();
  }, [goBack]);

  // ── Final publish (Step 3 only) ───────────────────────────────────────────────
  const handlePublish = useCallback(async () => {
    setPublishError(null);
    setIsPublishing(true);

    try {
      // 1. Create Course
      if (!courseInfo.thumbnailFile) {
        throw new Error("Vui lòng tải lên ảnh bìa khóa học.");
      }

      const courseData = await createCourse({
        title: courseInfo.title,
        description: courseInfo.description,
        level: courseInfo.difficulty,
        category_id: 1, // TODO: Map from courseInfo.field when backend supports it
        thumbnail: courseInfo.thumbnailFile,
      });

      const courseId = courseData.id;

      // 3. Create modules and lessons
      for (const mod of modules) {
        const createdModule = await createModule({
          courseId,
          title: mod.title,
          order: mod.order,
        });

        const moduleId = createdModule.id;

        // Create lessons
        for (const lesson of mod.lessons) {
          let finalContent = lesson.content || "";

          // Strip large poster data URLs from content to prevent DB bloat
          finalContent = finalContent.replace(/poster="data:image\/[^"]+"/g, 'poster=""');

          // Create the lesson first
          const payloadType = lesson.type === 'quiz' ? 'quiz_module' : (lesson.type === 'document' ? 'article' : lesson.type);
          const createdLesson = await createLesson({
            courseId,
            moduleId,
            payload: {
              title: lesson.title,
              type: payloadType,
              content: finalContent,
              order: lesson.order,
              status: 'published',
              temp_media_ids: lesson.temp_media_ids,
              video_url: lesson.video_url
            }
          });

          const lessonId = createdLesson.id;

          // Handle quiz data
          if (lesson.type === 'quiz' && lesson.quizData) {
            await createQuiz({ lessonId, payload: lesson.quizData });
          }
        }
      }

      // 4. Update price
      const priceNum = Number(settings.basePrice.replace(/[^0-9]/g, ""));
      await updatePrice({ courseId, price: priceNum });

      // 5. Publish
      if (!settings.isDraft) {
        await updateStatus({ courseId, status: "published" });
      }

      // 6. Success — clean up draft and redirect
      resetDraft();
      alert("🎉 Xuất bản khóa học thành công!");
      window.location.href = "/instructor/courses";
    } catch (error: any) {
      console.error("Publish failed:", error);
      
      let errorMsg = "Có lỗi xảy ra khi xuất bản. Vui lòng thử lại.";
      if (error.response?.data) {
        const data = error.response.data;
        if (data.message) {
          errorMsg = `Lỗi: ${data.message}`;
        }
        if (data.errors) {
          errorMsg += ` - Chi tiết: ${JSON.stringify(data.errors)}`;
        }
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      setPublishError(errorMsg);
    } finally {
      setIsPublishing(false);
    }
  }, [
    courseInfo,
    modules,
    settings,
    createCourse,
    uploadThumbnail,
    createModule,
    updatePrice,
    updateStatus,
    resetDraft,
    createLesson,
    createQuiz,
  ]);

  // ── Step labels ───────────────────────────────────────────────────────────────
  const stepLabels: Record<StepKey, string> = {
    1: "Thông tin cơ bản",
    2: "Nội dung bài học",
    3: "Cài đặt & Giá: Hoàn tất",
  };

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#F8F8FD] flex flex-col">
      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="py-6 px-6 bg-white border-b border-[#F0F0F8]">
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-[12px] text-[#9090B0]">
            <Link href="/instructor/courses" className="hover:text-[#4648D4] transition-colors">
              Khóa học của tôi
            </Link>
            <span className="mx-1">/</span>
            <span className="text-[#464554] font-medium">Tạo khóa học mới</span>
          </nav>

          {/* Title + CTA row */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h1 className="text-[22px] font-extrabold text-[#1A1A2E] tracking-tight leading-snug">
              {stepLabels[step]}
            </h1>

            <div className="flex items-center gap-3 shrink-0">
              {/* Back button */}
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-[#464554] border border-[#DDDDF0] bg-white hover:bg-[#F4F4FA] hover:border-[#C5C6FF] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#EAEAF4]"
                >
                  ← Quay lại
                </button>
              )}

              {/* Save draft */}
              <button
                type="button"
                id="btn-save-draft"
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-[#464554] border border-[#DDDDF0] bg-white hover:bg-[#F4F4FA] hover:border-[#C5C6FF] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#EAEAF4]"
              >
                Lưu nháp
              </button>

              {/* Finish & Publish (only functional at Step 3) */}
              <button
                id="btn-finish-publish"
                type="button"
                onClick={step === 3 ? handlePublish : handleNext}
                disabled={isPublishing}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] shadow-[0_4px_14px_rgba(70,72,212,0.35)] hover:shadow-[0_6px_20px_rgba(70,72,212,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4648D4]/40 disabled:opacity-70"
              >
                {step === 3 ? (
                  <>
                    <SparklesIcon size={13} />
                    {isPublishing ? "Đang xử lý..." : "Hoàn tất & Đăng"}
                  </>
                ) : (
                  <>
                    Tiếp theo
                    <ArrowRightIcon size={14} />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Step indicator */}
          <StepIndicator currentStep={step} />
        </div>
      </div>

      {/* ── Form card ───────────────────────────────────────────────── */}
      <div className="flex-1 px-6 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Publish error banner */}
          {publishError && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center justify-between">
              <span>{publishError}</span>
              <button
                type="button"
                onClick={() => setPublishError(null)}
                className="text-red-500 hover:text-red-700 ml-3"
              >
                ✕
              </button>
            </div>
          )}

          <div className={step === 3 ? "flex flex-col gap-0" : "bg-white rounded-2xl border border-[#EAEAF4] shadow-[0_2px_20px_rgba(70,72,212,0.06)] p-6 flex flex-col gap-6"}>
            {/* Step content */}
            {step === 1 && (
              <Step1BasicInfo data={courseInfo} onChange={handleChange} />
            )}

            {step === 2 && (
              <Step2CourseStructure error={step2Error} />
            )}

            {step === 3 && (
              <Step3SettingsPrice
                courseTitle={courseInfo.title}
                thumbnailPreview={courseInfo.thumbnailPreview}
              />
            )}

            {/* Form footer with CTA (hidden on step 3 — CTAs are in header) */}
            {step !== 3 && (
              <FormFooter step={step} onBack={handleBack} onNext={handleNext} />
            )}
          </div>

          {/* Page bottom bar */}
          <div className="mt-4 px-1">
            <PageFooter />
          </div>
        </div>
      </div>

      {/* ── AI Outline Modal ── */}
      <AIOutlineModal
        isOpen={isOutlineOpen}
        onClose={() => setIsOutlineOpen(false)}
        onApply={handleApplyOutline}
      />
    </div>
  );
}


================================================================
File: H:\du_an\website\mindnova-ai\src\features\instructor\create-course\components\CreateLessonEditModal.tsx
================================================================

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { RichTextEditor } from "../../shared/components/RichTextEditor";
import { QuizEditor } from "./QuizEditor";
import type { DraftLesson, DraftLessonType, DraftQuizData } from "../types";
import { useUploadTempMedia, useDeleteTempMedia } from "../api";

interface CreateLessonEditModalProps {
  lesson: DraftLesson;
  onSave: (id: string, updates: Partial<DraftLesson>) => void;
  onClose: () => void;
}

export function CreateLessonEditModal({ lesson, onSave, onClose }: CreateLessonEditModalProps) {
  const [title, setTitle] = useState(lesson.title);
  const [type, setType] = useState<DraftLessonType>(lesson.type);
  const [content, setContent] = useState((lesson as any).content || "");
  const [quizData, setQuizData] = useState<DraftQuizData | undefined>(lesson.quizData);

  const [tempMediaMap, setTempMediaMap] = useState<Map<string, number>>(new Map());
  const [isSaving, setIsSaving] = useState(false);
  
  const [videoMethod, setVideoMethod] = useState<'upload' | 'url'>('upload');
  const [videoUrl, setVideoUrl] = useState(lesson.video_url || "");
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);

  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [activeImageUploads, setActiveImageUploads] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const uploadTempMedia = useUploadTempMedia();
  const deleteTempMedia = useDeleteTempMedia();

  const hasUnsavedChanges = 
    title !== lesson.title ||
    type !== lesson.type ||
    content !== ((lesson as any).content || "") ||
    JSON.stringify(quizData || null) !== JSON.stringify(lesson.quizData || null);

  const handleVideoUpload = async (file: File, onProgress: (p: number) => void) => {
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    setIsUploadingVideo(true);

    try {
      const result = await uploadTempMedia.mutateAsync({
        file,
        signal: abortController.signal,
        onUploadProgress: (progressEvent: any) => {
          if (progressEvent.total) {
            onProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
          }
        }
      });

      if (result && result.url && result.media_id) {
        setTempMediaMap(prev => {
          const newMap = new Map(prev);
          newMap.set(result.url, result.media_id);
          return newMap;
        });
        return { url: result.url, media_id: result.media_id };
      }
      throw new Error("Upload failed");
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handleVideoMethodChange = (method: 'upload' | 'url') => {
    setVideoMethod(method);
    setVideoUrl("");
    setVideoUploadProgress(0);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsUploadingVideo(false);
  };

  const handleVideoFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const { url } = await handleVideoUpload(file, (progress) => {
        setVideoUploadProgress(progress);
      });
      setVideoUrl(url);
    } catch (error: any) {
      if (error.name !== 'CanceledError') {
        alert("Có lỗi xảy ra khi tải video. Vui lòng thử lại.");
        console.error(error);
      }
    } finally {
      setVideoUploadProgress(0);
    }
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    setActiveImageUploads(prev => prev + 1);
    try {
      const result = await uploadTempMedia.mutateAsync({ file });
      if (result && result.url && result.media_id) {
        setTempMediaMap(prev => {
          const newMap = new Map(prev);
          newMap.set(result.url, result.media_id);
          return newMap;
        });
        return result.url;
      }
      throw new Error("Upload failed");
    } finally {
      setActiveImageUploads(prev => Math.max(0, prev - 1));
    }
  };

  const handleClose = useCallback(() => {
    if (isSaving) {
      alert("Hệ thống đang lưu dữ liệu. Vui lòng chờ trong giây lát.");
      return;
    }
    if (isUploadingVideo || activeImageUploads > 0) {
      if (!confirm("Tiến trình tải lên đang diễn ra. Bạn có chắc chắn muốn dừng tải lên và đóng?")) {
        return;
      }
      abortControllerRef.current?.abort();
    } else if (hasUnsavedChanges) {
      if (!confirm("Bạn có thay đổi chưa lưu. Bạn có chắc chắn muốn đóng?")) {
        return;
      }
    }
    
    if (tempMediaMap.size > 0) {
      Array.from(tempMediaMap.values()).forEach(mediaId => {
        deleteTempMedia.mutate(mediaId).catch(console.error);
      });
    }
    setTempMediaMap(new Map());
    onClose();
  }, [isSaving, isUploadingVideo, activeImageUploads, hasUnsavedChanges, tempMediaMap, onClose, deleteTempMedia]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges || isUploadingVideo || isSaving || activeImageUploads > 0) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [hasUnsavedChanges, isUploadingVideo, isSaving, activeImageUploads, handleClose]);

  const handleSave = () => {
    setIsSaving(true);
    try {
      let finalContent = content;
      finalContent = finalContent.replace(/poster="data:image\/[^"]+"/g, 'poster=""');

      const usedTempMediaIds: number[] = [...(lesson.temp_media_ids || [])];
      
      Array.from(tempMediaMap.entries()).forEach(([url, id]) => {
        if (finalContent.includes(url) || (videoUrl && videoUrl.includes(url))) {
          usedTempMediaIds.push(id);
        } else {
          deleteTempMedia.mutate(id);
        }
      });

      onSave(lesson.id, { 
        title, 
        type, 
        content: finalContent, 
        quizData: type === 'quiz' ? quizData : undefined, 
        video_url: type === 'video' ? videoUrl : undefined,
        temp_media_ids: usedTempMediaIds 
      } as any);
      setTempMediaMap(new Map());
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-full overflow-hidden animate-fadeIn">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0F0F8]">
          <h2 className="text-[16px] font-bold text-[#1A1A2E]">Soạn thảo bài học</h2>
          <button 
            type="button" 
            onClick={handleClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9090B0] hover:bg-[#F4F4FA] transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#1A1A2E]">Tên bài học</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm border border-[#EAEAF4] focus:border-[#6B6BFF] focus:ring-2 focus:ring-[#6B6BFF]/20 outline-none transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#1A1A2E]">Loại bài học</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl text-sm border border-[#EAEAF4] focus:border-[#6B6BFF] focus:ring-2 focus:ring-[#6B6BFF]/20 outline-none transition-all appearance-none bg-white"
              >
                <option value="video">Video bài giảng</option>
                <option value="document">Tài liệu đọc</option>
                <option value="quiz">Bài kiểm tra</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 flex-1 min-h-[400px]">
            {type === 'quiz' ? (
              <QuizEditor 
                value={quizData}
                onChange={setQuizData}
              />
            ) : type === 'video' ? (
              <div className="flex flex-col gap-3 mb-6 p-4 border border-[#EAEAF4] rounded-xl bg-[#F8F8FC]">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-[#1A1A2E]">Video bài học</label>
                  <div className="flex gap-2">
                    <button 
                      type="button" 
                      onClick={() => handleVideoMethodChange('url')}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${videoMethod === 'url' ? 'bg-[#4648D4] text-white' : 'bg-white text-[#64647A] border border-[#EAEAF4]'}`}
                    >
                      Dùng URL
                    </button>
                    <button 
                      type="button" 
                      onClick={() => handleVideoMethodChange('upload')}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${videoMethod === 'upload' ? 'bg-[#4648D4] text-white' : 'bg-white text-[#64647A] border border-[#EAEAF4]'}`}
                    >
                      Tải lên
                    </button>
                  </div>
                </div>
                
                {videoMethod === 'url' ? (
                  <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="Nhập đường dẫn video (YouTube, Vimeo, v.v.)..."
                    className="w-full px-4 py-2.5 rounded-xl text-sm border border-[#EAEAF4] focus:border-[#6B6BFF] focus:ring-2 focus:ring-[#6B6BFF]/20 outline-none"
                  />
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-[#64647A] hover:bg-[#464554] transition-colors">
                        Chọn file video
                        <input type="file" accept="video/*" className="hidden" onChange={handleVideoFileUpload} disabled={isUploadingVideo} />
                      </label>
                      <span className="text-sm text-[#9090B0] truncate flex-1">
                        {isUploadingVideo ? `Đang tải lên... ${videoUploadProgress}%` : (videoUrl || "Chưa chọn file")}
                      </span>
                    </div>
                    {isUploadingVideo && (
                      <div className="w-full h-2 bg-[#EAEAF4] rounded-full overflow-hidden">
                        <div className="h-full bg-[#4648D4] transition-all duration-300" style={{ width: `${videoUploadProgress}%` }} />
                      </div>
                    )}
                    {videoUrl && !isUploadingVideo && videoUrl.includes('r2.dev') && (
                      <div className="text-xs text-[#059669] font-medium bg-[#ECFDF5] px-3 py-1.5 rounded-lg inline-flex max-w-fit">
                        Video đã được tải lên Cloudflare R2
                      </div>
                    )}
                  </div>
                )}

                {videoUrl && !isUploadingVideo && (
                  <div className="mt-2 w-full bg-black rounded-xl overflow-hidden border border-[#EAEAF4] flex items-center justify-center relative">
                    <video 
                      src={videoUrl} 
                      controls 
                      className="w-full max-h-[350px] object-contain"
                    />
                  </div>
                )}
              </div>
            ) : null}

            {type === 'document' && (
              <>
                <label className="text-sm font-semibold text-[#1A1A2E]">Nội dung chi tiết</label>
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Soạn nội dung phong phú cho bài học..."
                  onVideoUpload={handleVideoUpload}
                  onImageUpload={handleImageUpload}
                />
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#F0F0F8] flex justify-end gap-3 bg-[#FAFAFE]">
          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-[#64647A] hover:bg-[#EAEAF4] transition-colors"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || isUploadingVideo || activeImageUploads > 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:-translate-y-0 disabled:cursor-not-allowed"
          >
            {(isSaving || activeImageUploads > 0) ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {(activeImageUploads > 0) ? 'Đang tải ảnh...' : 'Đang lưu...'}
              </>
            ) : 'Lưu bài học'}
          </button>
        </div>

      </div>
    </div>
  );
}


================================================================
File: H:\du_an\website\mindnova-ai\src\features\instructor\create-course\types\index.ts
================================================================

// ─── Create Course — Types ─────────────────────────────────────────────────────

export type StepKey = 1 | 2 | 3;

export interface Step {
  id: StepKey;
  label: string;
}

export type DifficultyLevel = "beginner" | "advanced";

export interface CourseBasicInfo {
  title: string;
  description: string;
  field: string;
  difficulty: DifficultyLevel;
  thumbnailFile: File | null;
  thumbnailPreview: string | null;
}

// ─── Draft Types (for in-memory course creation) ──────────────────────────────

export type DraftLessonType = "video" | "quiz" | "document";

// ─── Quiz Draft Types ─────────────────────────────────────────────────────────

export interface DraftAnswer {
  id: string;
  content: string;
  is_correct: boolean;
}

export interface DraftQuestion {
  id: string;
  content: string;
  answers: DraftAnswer[];
}

export interface DraftQuizData {
  title: string;
  time_limit_minutes: number;
  passing_score: number;
  questions: DraftQuestion[];
}

// ─── Video Upload Types ───────────────────────────────────────────────────────

export interface PendingVideoUpload {
  blobUrl: string;
  file: File;
}

// ─── Lesson Draft ─────────────────────────────────────────────────────────────

export interface DraftLesson {
  id: string;
  title: string;
  type: DraftLessonType;
  content?: string;
  order: number;
  quizData?: DraftQuizData;
  temp_media_ids?: number[];
  video_url?: string;
  // pendingVideos are tracked separately in the store to avoid serialization issues
}

export interface DraftModule {
  id: string;
  title: string;
  description: string;
  order: number;
  expanded: boolean;
  lessons: DraftLesson[];
  showAiSuggestion?: boolean;
}

export interface Step3Data {
  isDraft: boolean;
  isPublic: boolean;
  allowRating: boolean;
  currency: string;
  basePrice: string;
  salePrice: string;
}

export interface CourseDraft {
  courseInfo: CourseBasicInfo;
  modules: DraftModule[];
  settings: Step3Data;
}


================================================================
File: H:\du_an\website\mindnova-ai\src\features\instructor\index.ts
================================================================

// Create Course
export * from './create-course/components/CreateCourseContainer';
export * from './create-course/components/CreateLessonEditModal';
export * from './create-course/types';

// Lesson Management
export * from './lesson-management/components/LessonEditModal';
export * from './lesson-management/components/LessonManagementContainer';
export * from './lesson-management/api';

// Shared
export * from './shared/components/RichTextEditor';


================================================================
File: H:\du_an\website\mindnova-ai\src\features\instructor\lesson-management\api\index.ts
================================================================

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../../../../shared/lib/axios";

// ─── Interfaces ─────────────────────────────────────────────────────────────

export interface Lesson {
  id: string | number;
  title: string;
  type: "video" | "document" | "quiz" | "article" | "quiz_module";
  duration_seconds: number;
  status: "published" | "draft";
  content?: string;
  signed_url?: string;
  order: number;
  quizData?: any;
}

export interface Chapter {
  id: string | number;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface ModulesResponse {
  data: Chapter[];
}

// ─── Hooks ──────────────────────────────────────────────────────────────────

export function useCourseModules(courseId: string) {
  return useQuery({
    queryKey: ["instructor", "course", courseId, "modules"],
    queryFn: async (): Promise<Chapter[]> => {
      if (!courseId) return [];
      const { data } = await axiosClient.get<ModulesResponse>(`/api/instructor/courses/${courseId}/modules`);
      return data.data;
    },
    enabled: !!courseId,
  });
}

export function useCreateModule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ courseId, title, description, order }: { courseId: string; title: string; description?: string; order: number }) => {
      const { data } = await axiosClient.post(`/api/instructor/courses/${courseId}/modules`, {
        title,
        description,
        order,
      });
      return data.data;
    },
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: ["instructor", "course", courseId, "modules"] });
    },
  });
}

export function useUpdateModule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ courseId, moduleId, title, description }: { courseId: string; moduleId: string | number; title: string; description?: string }) => {
      const { data } = await axiosClient.put(`/api/instructor/modules/${moduleId}`, {
        title,
        description,
      });
      return data.data;
    },
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: ["instructor", "course", courseId, "modules"] });
    },
  });
}

export function useDeleteModule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ courseId, moduleId }: { courseId: string; moduleId: string | number }) => {
      await axiosClient.delete(`/api/instructor/modules/${moduleId}`);
    },
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: ["instructor", "course", courseId, "modules"] });
    },
  });
}

export function useCreateLesson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ courseId, moduleId, payload }: { courseId: string; moduleId: string | number; payload: any }) => {
      const { data } = await axiosClient.post(`/api/instructor/modules/${moduleId}/lessons`, payload);
      return data.data;
    },
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: ["instructor", "course", courseId, "modules"] });
    },
  });
}

export function useUpdateLesson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ courseId, lessonId, payload }: { courseId: string; lessonId: string | number; payload: any }) => {
      const { data } = await axiosClient.put(`/api/instructor/lessons/${lessonId}`, payload);
      return data.data;
    },
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: ["instructor", "course", courseId, "modules"] });
    },
  });
}

export function useDeleteLesson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ courseId, lessonId }: { courseId: string; lessonId: string | number }) => {
      await axiosClient.delete(`/api/instructor/lessons/${lessonId}`);
    },
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: ["instructor", "course", courseId, "modules"] });
    },
  });
}

// ─── Quiz Hooks ─────────────────────────────────────────────────────────────

export function useCreateQuiz() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ lessonId, payload }: { lessonId: string | number; payload: any }) => {
      const { data } = await axiosClient.post(`/api/instructor/lessons/${lessonId}/quiz`, payload);
      return data.data;
    },
    onSuccess: (_, { lessonId }) => {
      queryClient.invalidateQueries({ queryKey: ["instructor", "lesson", lessonId, "quiz"] });
    },
  });
}

export function useUploadContentMedia() {
  return useMutation({
    mutationFn: async ({ lessonId, file, onUploadProgress }: { lessonId: string | number; file: File; onUploadProgress?: (progressEvent: any) => void }) => {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await axiosClient.post(
        `/api/instructor/lessons/${lessonId}/content-media`,
        formData,
        {
          onUploadProgress,
        }
      );
      return data.data;
    },
  });
}

export function useUploadTempMedia() {
  return useMutation({
    mutationFn: async ({ file, onUploadProgress, signal }: { file: File; onUploadProgress?: (progressEvent: any) => void; signal?: AbortSignal }) => {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await axiosClient.post(
        `/api/instructor/media/temp`,
        formData,
        {
          onUploadProgress,
          signal
        }
      );
      return data;
    },
  });
}

export function useDeleteTempMedia() {
  return useMutation({
    mutationFn: async (mediaId: number | string) => {
      const { data } = await axiosClient.delete(`/api/instructor/media/temp/${mediaId}`);
      return data;
    },
  });
}


================================================================
File: H:\du_an\website\mindnova-ai\src\features\instructor\lesson-management\components\LessonEditModal.tsx
================================================================

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { RichTextEditor } from "../../shared/components/RichTextEditor";
import { QuizEditor } from "../../create-course/components/QuizEditor";
import { twMerge } from "tailwind-merge";
import { useUploadTempMedia, useDeleteTempMedia } from "../api";
import type { DraftQuizData } from "../../create-course/types";

interface LessonEditModalProps {
  lesson: {
    id: string;
    title: string;
    type: "video" | "article" | "quiz_module";
    status: "published" | "draft";
    content?: string;
    video_url?: string;
    quizData?: DraftQuizData;
  };
  onSave: (id: string, updates: any) => Promise<void> | void;
  onClose: () => void;
}

export function LessonEditModal({ lesson, onSave, onClose }: LessonEditModalProps) {
  const [title, setTitle] = useState(lesson.title);
  const [type, setType] = useState(lesson.type);
  const [status, setStatus] = useState(lesson.status);
  const [content, setContent] = useState(lesson.content || "");
  const [videoUrl, setVideoUrl] = useState(() => {
    if (lesson.video_url) return lesson.video_url;
    if (lesson.type === 'video' && lesson.content) {
      const match = lesson.content.match(/url="([^"]+)"/);
      if (match) return match[1];
      const match2 = lesson.content.match(/https?:\/\/[^\s"'><]+/);
      if (match2) return match2[0];
    }
    return "";
  });
  const [videoMethod, setVideoMethod] = useState<'upload' | 'url'>('url');
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);
  const [quizData, setQuizData] = useState<DraftQuizData | undefined>(lesson.quizData);
  const [tempMediaMap, setTempMediaMap] = useState<Map<string, number>>(new Map());
  const [isSaving, setIsSaving] = useState(false);
  const [activeImageUploads, setActiveImageUploads] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const hasUnsavedChanges = 
    title !== lesson.title ||
    type !== lesson.type ||
    status !== lesson.status ||
    content !== (lesson.content || "") ||
    videoUrl !== (lesson.video_url || "") ||
    JSON.stringify(quizData || null) !== JSON.stringify(lesson.quizData || null);

  const uploadTempMedia = useUploadTempMedia();
  const deleteTempMedia = useDeleteTempMedia();

  const handleClose = useCallback(() => {
    if (isSaving) {
      alert("Hệ thống đang lưu dữ liệu. Vui lòng chờ trong giây lát.");
      return;
    }
    if (isUploadingVideo || activeImageUploads > 0) {
      if (!confirm("Tiến trình tải lên đang diễn ra. Bạn có chắc chắn muốn dừng tải lên và đóng?")) {
        return;
      }
      abortControllerRef.current?.abort();
    } else if (hasUnsavedChanges) {
      if (!confirm("Bạn có thay đổi chưa lưu. Bạn có chắc chắn muốn đóng?")) {
        return;
      }
    }
    
    // Cleanup any orphaned temp media
    Array.from(tempMediaMap.values()).forEach(id => {
      deleteTempMedia.mutate(id);
    });
    setTempMediaMap(new Map());
    onClose();
  }, [isSaving, isUploadingVideo, activeImageUploads, hasUnsavedChanges, tempMediaMap, onClose, deleteTempMedia]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges || isUploadingVideo || isSaving || activeImageUploads > 0) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isUploadingVideo, tempMediaMap.size, hasUnsavedChanges, isSaving, handleClose]);

  const handleVideoUpload = async (file: File, onProgress: (p: number) => void) => {
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const result = await uploadTempMedia.mutateAsync({
      file,
      signal: abortController.signal,
      onUploadProgress: (progressEvent: any) => {
        if (progressEvent.total) {
          onProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
        }
      }
    });

    if (result && result.url && result.media_id) {
      setTempMediaMap(prev => {
        const newMap = new Map(prev);
        newMap.set(result.url, result.media_id);
        return newMap;
      });
      return { url: result.url, media_id: result.media_id };
    }
    throw new Error("Upload failed");
  };

  const handleVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingVideo(true);
    setVideoUploadProgress(0);
    try {
      const result = await handleVideoUpload(file, setVideoUploadProgress);
      setVideoUrl(result.url);
    } catch (err: any) {
      if (err?.name === 'CanceledError' || err?.code === 'ERR_CANCELED' || err?.message === 'canceled') {
        console.log("Upload cancelled by user");
      } else {
        console.error(err);
        alert("Đã xảy ra lỗi khi tải video.");
      }
    } finally {
      setIsUploadingVideo(false);
      setVideoUploadProgress(0);
    }
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    setActiveImageUploads(prev => prev + 1);
    try {
      const result = await uploadTempMedia.mutateAsync({ file });
      if (result && result.url && result.media_id) {
        setTempMediaMap(prev => {
          const newMap = new Map(prev);
          newMap.set(result.url, result.media_id);
          return newMap;
        });
        return result.url;
      }
      throw new Error("Upload failed");
    } finally {
      setActiveImageUploads(prev => Math.max(0, prev - 1));
    }
  };

  const handleVideoMethodChange = (method: 'upload' | 'url') => {
    if (isUploadingVideo) {
      if (!window.confirm("Video đang được tải lên. Bạn có chắc chắn muốn dừng tải lên và chuyển phương thức?")) {
        return;
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      setIsUploadingVideo(false);
      setVideoUploadProgress(0);
    }
    setVideoMethod(method);
  };

  const handleSave = async () => {
    setIsSaving(true);
    let finalContent = content;

    try {
      finalContent = finalContent.replace(/poster="data:image\/[^"]+"/g, 'poster=""');

      const usedTempMediaIds: number[] = [];
      Array.from(tempMediaMap.entries()).forEach(([url, id]) => {
        if (finalContent.includes(url) || (videoUrl && videoUrl.includes(url))) {
          usedTempMediaIds.push(id);
        } else {
          deleteTempMedia.mutate(id);
        }
      });

      const updates: any = {
        title,
        type,
        status,
        content: finalContent,
        video_url: type === 'video' ? videoUrl : undefined,
        quizData: type === 'quiz_module' ? quizData : undefined,
        temp_media_ids: usedTempMediaIds
      };
      
      await onSave(lesson.id, updates);
      setTempMediaMap(new Map());
    } catch (e) {
      console.error("Lỗi khi lưu bài học:", e);
      alert("Đã xảy ra lỗi khi lưu bài học. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={handleClose}
      />
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-full overflow-hidden animate-fadeIn">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0F0F8]">
          <h2 className="text-[16px] font-bold text-[#1A1A2E]">Chỉnh sửa bài học</h2>
          <button 
            type="button" 
            onClick={handleClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9090B0] hover:bg-[#F4F4FA] transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#1A1A2E]">Tên bài học</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm border border-[#EAEAF4] focus:border-[#6B6BFF] focus:ring-2 focus:ring-[#6B6BFF]/20 outline-none transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#1A1A2E]">Loại bài học</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl text-sm border border-[#EAEAF4] focus:border-[#6B6BFF] focus:ring-2 focus:ring-[#6B6BFF]/20 outline-none transition-all appearance-none bg-white"
              >
                <option value="video">Video bài giảng</option>
                <option value="article">Tài liệu đọc</option>
                <option value="quiz_module">Bài kiểm tra</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#1A1A2E]">Trạng thái</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  checked={status === 'published'} 
                  onChange={() => setStatus('published')}
                  className="w-4 h-4 text-[#4648D4] focus:ring-[#6B6BFF]"
                />
                <span className="text-sm text-[#464554]">Đã xuất bản</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  checked={status === 'draft'} 
                  onChange={() => setStatus('draft')}
                  className="w-4 h-4 text-[#4648D4] focus:ring-[#6B6BFF]"
                />
                <span className="text-sm text-[#464554]">Bản nháp</span>
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 flex-1 min-h-[400px]">
            {type === 'quiz_module' ? (
              <QuizEditor 
                value={quizData}
                onChange={setQuizData}
              />
            ) : type === 'video' ? (
              <div className="flex flex-col gap-3 mb-6 p-4 border border-[#EAEAF4] rounded-xl bg-[#F8F8FC]">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-[#1A1A2E]">Video bài học</label>
                  <div className="flex gap-2">
                    <button 
                      type="button" 
                      onClick={() => handleVideoMethodChange('url')}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${videoMethod === 'url' ? 'bg-[#4648D4] text-white' : 'bg-white text-[#64647A] border border-[#EAEAF4]'}`}
                    >
                      Dùng URL
                    </button>
                    <button 
                      type="button" 
                      onClick={() => handleVideoMethodChange('upload')}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${videoMethod === 'upload' ? 'bg-[#4648D4] text-white' : 'bg-white text-[#64647A] border border-[#EAEAF4]'}`}
                    >
                      Tải lên
                    </button>
                  </div>
                </div>
                
                {videoMethod === 'url' ? (
                  <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="Nhập đường dẫn video (YouTube, Vimeo, v.v.)..."
                    className="w-full px-4 py-2.5 rounded-xl text-sm border border-[#EAEAF4] focus:border-[#6B6BFF] focus:ring-2 focus:ring-[#6B6BFF]/20 outline-none"
                  />
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-[#64647A] hover:bg-[#464554] transition-colors">
                        Chọn file video
                        <input type="file" accept="video/*" className="hidden" onChange={handleVideoFileUpload} disabled={isUploadingVideo} />
                      </label>
                      <span className="text-sm text-[#9090B0] truncate flex-1">
                        {isUploadingVideo ? `Đang tải lên... ${videoUploadProgress}%` : (videoUrl || "Chưa chọn file")}
                      </span>
                    </div>
                    {isUploadingVideo && (
                      <div className="w-full h-2 bg-[#EAEAF4] rounded-full overflow-hidden">
                        <div className="h-full bg-[#4648D4] transition-all duration-300" style={{ width: `${videoUploadProgress}%` }} />
                      </div>
                    )}
                    {videoUrl && !isUploadingVideo && videoUrl.includes('r2.dev') && (
                      <div className="text-xs text-[#059669] font-medium bg-[#ECFDF5] px-3 py-1.5 rounded-lg inline-flex max-w-fit">
                        Video đã được tải lên Cloudflare R2
                      </div>
                    )}
                  </div>
                )}

                {videoUrl && !isUploadingVideo && (
                  <div className="mt-2 w-full bg-black rounded-xl overflow-hidden border border-[#EAEAF4] flex items-center justify-center relative">
                    <video 
                      src={videoUrl} 
                      controls 
                      className="w-full max-h-[350px] object-contain"
                    />
                  </div>
                )}
              </div>
            ) : (
              <>
                <label className="text-sm font-semibold text-[#1A1A2E]">Nội dung chi tiết</label>
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Nhập nội dung bài học..."
                  onVideoUpload={handleVideoUpload}
                  onImageUpload={handleImageUpload}
                />
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#F0F0F8] bg-[#F8F8FC]">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-[#64647A] bg-white border border-[#EAEAF4] hover:bg-[#F4F4FA] transition-colors disabled:opacity-50"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || isUploadingVideo || activeImageUploads > 0}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:-translate-y-0 disabled:cursor-not-allowed"
          >
            {(isSaving || activeImageUploads > 0) ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {(activeImageUploads > 0) ? 'Đang tải ảnh...' : 'Đang lưu...'}
              </>
            ) : 'Lưu thay đổi'}
          </button>
        </div>
      </div>
    </div>
  );
}


================================================================
File: H:\du_an\website\mindnova-ai\src\features\instructor\lesson-management\components\LessonManagementContainer.tsx
================================================================

"use client";

// ─── LessonManagementContainer ────────────────────────────────────────────────
// Màn hình quản lý bài học chi tiết cho một khóa học — drag/drop chapters +
// lessons, filter tabs, AI assist card, add chapter CTA, và chat FAB.

import { useState, useCallback, useId, useEffect } from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { LessonEditModal } from "./LessonEditModal";
import { useInstructorCourse } from "../../management/api/courses";
import { useCourseModules, useCreateModule, useDeleteModule, useUpdateModule, useCreateLesson, useUpdateLesson, useDeleteLesson, useCreateQuiz } from "../api";
import {
  GripIcon,
  VideoIcon,
  DocumentIcon,
  PencilIcon,
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  PlusIcon,
  PlusCircleIcon,
  ClockIcon,
  SparklesIcon,
  EyeIcon,
  LayersIcon,
  FilterIcon,
  SortIcon,
  MessageCircleIcon,
  SearchIcon,
  BellIcon,
  HelpCircleIcon,
} from "./icons";

// ─── Types ────────────────────────────────────────────────────────────────────

type LessonStatus = "published" | "draft";
type LessonType   = "video" | "article" | "quiz_module";
type FilterTab    = "all" | "public" | "draft";

interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  duration_seconds: number;
  status: LessonStatus;
  content?: string;
  quizData?: any;
}

interface Chapter {
  id: string;
  index: number;
  title: string;
  lessons: Lesson[];
  collapsed: boolean;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

// No INITIAL_CHAPTERS needed anymore

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDurationSeconds(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  
  const pad = (num: number) => num.toString().padStart(2, "0");
  
  if (h > 0) {
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  }
  return `${pad(m)}:${pad(s)}`;
}

function totalDuration(chapters: Chapter[]): string {
  let secs = 0;
  chapters.forEach((ch) =>
    ch.lessons.forEach((l) => {
      secs += l.duration_seconds || 0;
    }),
  );
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  return `${h} giờ ${m} phút`;
}

function totalLessons(chapters: Chapter[]): number {
  return chapters.reduce((a, c) => a + c.lessons.length, 0);
}

function publishedLessons(chapters: Chapter[]): number {
  return chapters.reduce(
    (a, c) => a + c.lessons.filter((l) => l.status === "published").length,
    0,
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function LessonStatusBadge({ status }: { status: LessonStatus }) {
  return (
    <span
      className={twMerge(
        "text-[10px] font-semibold px-2 py-0.5 rounded-full",
        status === "published"
          ? "bg-[#EEF0FF] text-[#4648D4]"
          : "bg-amber-100 text-amber-700",
      )}
    >
      {status === "published" ? "Đã xuất bản" : "Đang soạn thảo"}
    </span>
  );
}

function XCloseIcon({ size = 16 }: { size?: number }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// ─── Lesson Icon ──────────────────────────────────────────────────────────────

function LessonTypeIcon({ type }: { type: LessonType }) {
  if (type === "video") return <VideoIcon size={14} />;
  if (type === "quiz_module") return <HelpCircleIcon size={14} />;
  return <DocumentIcon size={14} />;
}

function getLessonColor(type: LessonType) {
  if (type === "video") return "text-[#4648D4] bg-[#EEEEFF]";
  if (type === "quiz_module") return "text-[#059669] bg-[#ECFDF5]";
  return "text-[#D97706] bg-[#FFFBEB]";
}

// ─── Lesson Row ───────────────────────────────────────────────────────────────

interface LessonRowProps {
  lesson: Lesson;
  onEdit: () => void;
  onDelete: () => void;
}

function LessonRow({ lesson, onEdit, onDelete }: LessonRowProps) {
  return (
    <div
      className={twMerge(
        "group flex items-center gap-3 px-4 py-3 rounded-xl border border-[#EAEAF4] bg-white hover:border-[#D5D5FF] hover:bg-[#FAFAFE] transition-all duration-150"
      )}
    >
      {/* Drag handle */}
      <span className="text-[#C8C8E0] group-hover:text-[#9090B0] cursor-grab active:cursor-grabbing transition-colors shrink-0">
        <GripIcon size={14} />
      </span>

      {/* Type badge */}
      <span
        className={twMerge(
          "shrink-0 w-6 h-6 rounded-md flex items-center justify-center",
          getLessonColor(lesson.type)
        )}
      >
        <LessonTypeIcon type={lesson.type} />
      </span>

      {/* Title */}
      <div className="flex-1 min-w-0 flex items-center gap-2">
        <span className="text-sm text-[#1A1A2E] truncate block">
          {lesson.title}
        </span>
        <LessonStatusBadge status={lesson.status} />
      </div>

      {/* Duration */}
      <span className="flex items-center gap-1 text-[11px] text-[#9090B0] shrink-0 font-mono">
        <ClockIcon size={11} />
        {formatDurationSeconds(lesson.duration_seconds || 0)}
      </span>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          type="button"
          aria-label="Soạn thảo bài học"
          onClick={onEdit}
          className="w-6 h-6 rounded-md flex items-center justify-center text-[#9090B0] hover:text-[#4648D4] hover:bg-[#EEEEFF] transition-all"
        >
          <PencilIcon size={13} />
        </button>
        <button
          type="button"
          aria-label="Xóa bài học"
          onClick={onDelete}
          className="w-6 h-6 rounded-md flex items-center justify-center text-[#9090B0] hover:text-red-500 hover:bg-red-50 transition-all"
        >
          <TrashIcon size={13} />
        </button>
      </div>
    </div>
  );
}

// ─── Chapter Card ─────────────────────────────────────────────────────────────

interface ChapterCardProps {
  chapter: Chapter;
  onToggle: () => void;
  onAddLesson: () => void;
  onEditLesson: (lesson: Lesson) => void;
  onDeleteLesson: (lessonId: string) => void;
  onEdit: () => void;
  onDelete: () => void;
}

function ChapterCard({ chapter, onToggle, onAddLesson, onEditLesson, onDeleteLesson, onEdit, onDelete }: ChapterCardProps) {
  return (
    <div className="rounded-2xl border border-[#EAEAF4] bg-white shadow-[0_2px_12px_rgba(70,72,212,0.05)] transition-all duration-200">
      {/* Chapter header */}
      <div className="flex items-center gap-3 px-5 py-4 group">
        {/* Drag handle */}
        <span className="text-[#C8C8E0] group-hover:text-[#9090B0] cursor-grab active:cursor-grabbing transition-colors shrink-0">
          <GripIcon size={16} />
        </span>

        {/* Collapse/expand toggle */}
        <button
          type="button"
          aria-label={chapter.collapsed ? "Mở rộng" : "Thu gọn"}
          onClick={onToggle}
          className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[#9090B0] hover:text-[#4648D4] hover:bg-[#EEEEFF] transition-all"
        >
          {chapter.collapsed ? <ChevronDownIcon size={16} /> : <ChevronUpIcon size={16} />}
        </button>

        {/* Left accent */}
        <div className="w-1 h-8 rounded-full bg-[#4648D4] shrink-0" />

        {/* Number + title + description */}
        <div
          className="flex flex-col flex-1 min-w-0 cursor-pointer"
          onClick={onToggle}
        >
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#9090B0]">
            Chương {chapter.index}
          </span>
          <span className="text-base font-bold text-[#1A1A2E] truncate">
            {chapter.title}
          </span>
        </div>

        {/* Lesson count badge */}
        <span className="shrink-0 px-2.5 py-1 rounded-full bg-[#EEF0FF] text-[11px] font-semibold text-[#4648D4]">
          {chapter.lessons.length} bài
        </span>

        {/* Module actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            type="button"
            aria-label="Chỉnh sửa chương"
            onClick={onEdit}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9090B0] hover:text-[#4648D4] hover:bg-[#EEEEFF] transition-all"
          >
            <PencilIcon size={13} />
          </button>
          <button
            type="button"
            aria-label="Xóa chương"
            onClick={onDelete}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9090B0] hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <TrashIcon size={14} />
          </button>
        </div>
      </div>

      {/* Lesson list (collapsible) */}
      {!chapter.collapsed && (
        <div className="px-5 pb-4 flex flex-col gap-2 border-t border-[#F4F4FA] pt-3">
          {chapter.lessons.map((lesson) => (
            <LessonRow
              key={lesson.id}
              lesson={lesson}
              onEdit={() => onEditLesson(lesson)}
              onDelete={() => onDeleteLesson(lesson.id)}
            />
          ))}

          {/* Add lesson CTA */}
          <button
            type="button"
            onClick={onAddLesson}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-[#D5D5FF] text-[#6B6BFF] text-sm font-medium hover:border-[#6B6BFF] hover:bg-[#F5F3FF] transition-all duration-200 group mt-1"
          >
            <span className="group-hover:rotate-90 transition-transform duration-200">
              <PlusIcon size={14} />
            </span>
            Thêm bài giảng mới
          </button>
        </div>
      )}
    </div>
  );
}

// ─── AI Assist Card ───────────────────────────────────────────────────────────

function AIAssistCard({ onQuizGenerate, onSuggestChapter }: {
  onQuizGenerate: () => void;
  onSuggestChapter: () => void;
}) {
  return (
    <div className="rounded-2xl border border-[#C5C6FF] bg-gradient-to-r from-[#F5F3FF] to-[#EEF0FF] p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
      {/* Icon + text */}
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <div className="flex items-center gap-2 text-[#6B6BFF]">
          <span className="animate-pulse"><SparklesIcon size={13} /></span>
          <span className="text-[10px] font-bold tracking-widest uppercase">
            MindNova AI Assist
          </span>
        </div>
        <p className="text-[14px] font-bold text-[#1A1A2E]">
          Sử dụng AI để tối ưu lộ trình học tập
        </p>
        <p className="text-[12px] text-[#64647A] leading-relaxed max-w-[420px]">
          Hệ thống AI của chúng tôi có thể giúp bạn tự động sinh câu hỏi Quiz,
          tóm tắt bài giảng hoặc đề xuất thêm các chương học dựa trên xu hướng
          thị trường.
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onQuizGenerate}
          className="px-4 py-2.5 rounded-xl border border-[#C5C6FF] text-[13px] font-semibold text-[#4648D4] bg-white hover:bg-[#EEF0FF] hover:border-[#6B6BFF] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#6B6BFF]/30"
        >
          Sinh câu hỏi Quiz
        </button>
        <button
          type="button"
          id="btn-suggest-chapter"
          onClick={onSuggestChapter}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-white bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] shadow-[0_4px_14px_rgba(70,72,212,0.35)] hover:shadow-[0_6px_20px_rgba(70,72,212,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4648D4]/40"
        >
          <PlusIcon size={13} />
          Gợi ý Chương mới
        </button>
      </div>
    </div>
  );
}

// ─── Filter Tabs + Stats ──────────────────────────────────────────────────────

interface FilterBarProps {
  active: FilterTab;
  onChange: (t: FilterTab) => void;
  total: number;
  published: number;
  draft: number;
  totalHours: string;
  totalChapters: number;
}

function FilterBar({ active, onChange, total, published, draft, totalHours, totalChapters }: FilterBarProps) {
  const TABS: { id: FilterTab; label: string; count: number }[] = [
    { id: "all",    label: "Tất cả",   count: total     },
    { id: "public", label: "Công khai", count: published },
    { id: "draft",  label: "Bản nháp", count: draft     },
  ];

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Tabs */}
      <div className="flex items-center gap-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={twMerge(
              "px-3.5 py-1.5 rounded-xl text-[12px] font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#6B6BFF]/30",
              active === tab.id
                ? "bg-[#6B6BFF] text-white shadow-[0_2px_8px_rgba(107,107,255,0.3)]"
                : "bg-[#F4F4FA] text-[#64647A] hover:bg-[#EAEAF4]",
            )}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Stats */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-[12px] text-[#464554]">
          <ClockIcon size={13} />
          <span className="text-[11px] font-semibold text-[#9090B0]">Tổng thời lượng</span>
          <span className="font-bold text-[#1A1A2E]">{totalHours}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[12px] text-[#464554]">
          <LayersIcon size={13} />
          <span className="text-[11px] font-semibold text-[#9090B0]">Tổng chương</span>
          <span className="font-bold text-[#1A1A2E]">
            {String(totalChapters).padStart(2, "0")} Chương
          </span>
        </div>

        {/* Sort icons */}
        <div className="flex items-center gap-1">
          <button type="button" aria-label="Lọc" className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9090B0] hover:text-[#4648D4] hover:bg-[#EEF0FF] transition-all">
            <FilterIcon size={14} />
          </button>
          <button type="button" aria-label="Sắp xếp" className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9090B0] hover:text-[#4648D4] hover:bg-[#EEF0FF] transition-all">
            <SortIcon size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page Topbar ──────────────────────────────────────────────────────────────

function PageTopbar() {
  return (
    <header className="h-14 shrink-0 flex items-center gap-3 px-6 bg-white border-b border-[#F0F0F8]">
      {/* Brand */}
      <Link
        href="/instructor"
        className="text-[15px] font-extrabold text-[#4648D4] tracking-tight hover:text-[#3D40C0] transition-colors shrink-0"
      >
        MindNova AI
      </Link>

      <div className="w-px h-5 bg-[#EAEAF4] mx-1" aria-hidden />

      {/* Context breadcrumb */}
      <div className="flex items-center gap-1.5 text-[12px] text-[#64647A] shrink-0">
        <LayersIcon size={13} />
        <span className="font-semibold">Quản lý Khóa học</span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search */}
      <div className="relative hidden sm:block w-52">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0B0C8] pointer-events-none">
          <SearchIcon size={14} />
        </span>
        <input
          id="lesson-search"
          type="search"
          placeholder="Tìm kiếm bài học..."
          className="w-full pl-9 pr-3 h-9 rounded-xl text-sm text-[#1A1A2E] placeholder:text-[#B0B0C8] bg-[#F6F6FB] border border-[#EAEAF4] focus:outline-none focus:border-[#6B6BFF] focus:ring-2 focus:ring-[#6B6BFF]/10 transition-all duration-200"
        />
      </div>

      {/* Icons */}
      <div className="flex items-center gap-1">
        <button type="button" aria-label="Thông báo" className="relative w-8 h-8 rounded-xl flex items-center justify-center text-[#7878A0] hover:bg-[#F4F4FA] hover:text-[#4648D4] transition-all duration-150">
          <BellIcon size={17} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-400 border border-white" />
        </button>
        <button type="button" aria-label="Trợ giúp" className="w-8 h-8 rounded-xl flex items-center justify-center text-[#7878A0] hover:bg-[#F4F4FA] hover:text-[#4648D4] transition-all duration-150">
          <HelpCircleIcon size={17} />
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6B6BFF] to-[#4648D4] flex items-center justify-center text-white text-[12px] font-bold shadow-[0_2px_8px_rgba(107,107,255,0.35)] cursor-pointer ml-0.5">
          N
        </div>
      </div>
    </header>
  );
}

// ─── Add Chapter CTA ──────────────────────────────────────────────────────────

function AddChapterButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      id="btn-add-chapter"
      onClick={onClick}
      className="w-full flex flex-col items-center justify-center gap-2 py-7 rounded-2xl border-2 border-dashed border-[#D5D5F0] bg-white hover:border-[#6B6BFF] hover:bg-[#F5F3FF] transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-[#6B6BFF]/30"
    >
      <span className="w-10 h-10 rounded-full border-2 border-dashed border-[#C5C6FF] group-hover:border-[#6B6BFF] group-hover:bg-[#EEF0FF] flex items-center justify-center text-[#9090B0] group-hover:text-[#6B6BFF] transition-all duration-200">
        <PlusCircleIcon size={20} />
      </span>
      <span className="text-[13px] font-semibold text-[#9090B0] group-hover:text-[#6B6BFF] transition-colors duration-200">
        Thêm Chương mới
      </span>
    </button>
  );
}

// ─── Page Footer ─────────────────────────────────────────────────────────────

function PageFooter() {
  return (
    <footer className="border-t border-[#F0F0F8] bg-white px-6 py-3 flex items-center justify-between text-[11px] text-[#B0B0C8]">
      <span>© 2024 MindNova AI Education Platform. All rights reserved.</span>
      <div className="flex items-center gap-4">
        {["Hướng dẫn giảng viên", "Chính sách bảo mật", "Hỗ trợ"].map((l) => (
          <button key={l} type="button" className="hover:text-[#4648D4] transition-colors duration-150">
            {l}
          </button>
        ))}
      </div>
    </footer>
  );
}

// ─── Chat FAB ────────────────────────────────────────────────────────────────

function ChatFAB() {
  return (
    <button
      type="button"
      id="btn-chat-fab"
      aria-label="Mở hộp chat hỗ trợ"
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-gradient-to-br from-[#6B6BFF] to-[#4648D4] text-white flex items-center justify-center shadow-[0_8px_24px_rgba(107,107,255,0.5)] hover:shadow-[0_10px_30px_rgba(107,107,255,0.65)] hover:scale-110 active:scale-95 transition-all duration-200"
    >
      <MessageCircleIcon size={18} />
    </button>
  );
}

// ─── Chapter Modal ────────────────────────────────────────────────────────────

interface ChapterModalProps {
  isOpen: boolean;
  editingChapter: Chapter | null;
  onSave: (title: string, description: string) => void;
  onClose: () => void;
}

function ChapterModal({ isOpen, editingChapter, onSave, onClose }: ChapterModalProps) {
  const [title, setTitle] = useState(editingChapter?.title || "");
  const [description, setDescription] = useState((editingChapter as any)?.description || "");
  const [titleError, setTitleError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setTitle(editingChapter?.title || "");
      setDescription((editingChapter as any)?.description || "");
      setTitleError("");
    }
  }, [isOpen, editingChapter]);

  const handleSave = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setTitleError("Tên module không được để trống");
      return;
    }
    setTitleError("");
    onSave(trimmedTitle, description.trim());
    setTitle("");
    setDescription("");
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setTitleError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0F0F8]">
          <h2 className="text-[16px] font-bold text-[#1A1A2E]">
            {editingChapter ? "Chỉnh sửa Module" : "Thêm Module mới"}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9090B0] hover:bg-[#F4F4FA] transition-colors"
          >
            <XCloseIcon size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 flex flex-col gap-5">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="chapter-title" className="text-sm font-semibold text-[#1A1A2E]">
              Tên Module <span className="text-red-500">*</span>
            </label>
            <input
              id="chapter-title"
              type="text"
              autoFocus
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (titleError) setTitleError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
              }}
              placeholder="Ví dụ: Giới thiệu về Machine Learning"
              className={twMerge(
                "w-full px-4 py-3 rounded-xl text-sm text-[#1A1A2E] placeholder-[#B0B0C8] bg-white border transition-all duration-200 focus:outline-none focus:ring-4",
                titleError
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
                  : "border-[#EAEAF4] focus:border-[#6B6BFF] focus:ring-[#6B6BFF]/10",
              )}
            />
            {titleError && (
              <p className="text-[12px] text-red-500 font-medium">{titleError}</p>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="chapter-desc" className="text-sm font-semibold text-[#1A1A2E]">
              Mô tả
            </label>
            <textarea
              id="chapter-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Mô tả ngắn gọn nội dung module này..."
              className="w-full px-4 py-3 rounded-xl text-sm text-[#1A1A2E] placeholder-[#B0B0C8] bg-white border border-[#EAEAF4] focus:outline-none focus:border-[#6B6BFF] focus:ring-4 focus:ring-[#6B6BFF]/10 transition-all duration-200 resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#F0F0F8] flex justify-end gap-3 bg-[#FAFAFE]">
          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-[#64647A] hover:bg-[#EAEAF4] transition-colors"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            {editingChapter ? "Lưu thay đổi" : "Thêm Module"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Container ───────────────────────────────────────────────────────────

export function LessonManagementContainer({ courseId }: { courseId: string }) {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [editingLesson, setEditingLesson] = useState<{
    chapterId: string;
    lesson: Lesson;
  } | null>(null);

  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);

  // Collapse state since it's not stored in DB
  const [collapsedChapters, setCollapsedChapters] = useState<Record<string, boolean>>({});

  const { data: course } = useInstructorCourse(courseId);
  const { data: chaptersData = [], isLoading } = useCourseModules(courseId);
  const createModule = useCreateModule();
  const updateModule = useUpdateModule();
  const deleteModuleMutation = useDeleteModule();
  const createLesson = useCreateLesson();
  const updateLessonMutation = useUpdateLesson();
  const deleteLessonMutation = useDeleteLesson();
  const createQuizMutation = useCreateQuiz();

  // Enhance chapter data with collapsed state
  const chapters = chaptersData.map((ch, i) => ({
    ...ch,
    index: i + 1,
    collapsed: !!collapsedChapters[ch.id],
    lessons: ch.lessons.map((l) => ({ ...l }))
  }));

  // ── Derived stats ───────────────────────────────────────────────────────────
  const allLessons   = totalLessons(chapters as any);
  const pubLessons   = publishedLessons(chapters as any);
  const draftLessons = allLessons - pubLessons;
  const duration     = totalDuration(chapters as any);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const toggleChapter = useCallback((id: string) => {
    setCollapsedChapters((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const deleteChapter = useCallback((id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa chương này?")) {
      deleteModuleMutation.mutate({ courseId, moduleId: id });
    }
  }, [courseId, deleteModuleMutation]);

  const updateLesson = useCallback(async (chapterId: string, lessonId: string, updates: Partial<Lesson>) => {
    await updateLessonMutation.mutateAsync({ courseId, lessonId, payload: updates });
    if (updates.quizData) {
      await createQuizMutation.mutateAsync({ lessonId, payload: updates.quizData });
    }
  }, [courseId, updateLessonMutation, createQuizMutation]);

  const deleteLesson = useCallback((chapterId: string, lessonId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa bài học này?")) {
      deleteLessonMutation.mutate({ courseId, lessonId });
    }
  }, [courseId, deleteLessonMutation]);

  const addLesson = useCallback((chapterId: string) => {
    createLesson.mutate({
      courseId,
      moduleId: chapterId,
      payload: {
        title: "Bài học mới",
        type: "video",
        order: chapters.find(c => c.id === chapterId)?.lessons.length || 0,
        status: "draft"
      }
    });
  }, [courseId, chapters, createLesson]);

  const openAddChapterModal = useCallback(() => {
    setEditingChapter(null);
    setIsChapterModalOpen(true);
  }, []);

  const openEditChapterModal = useCallback((chapter: Chapter) => {
    setEditingChapter(chapter);
    setIsChapterModalOpen(true);
  }, []);

  const handleChapterModalSave = useCallback((title: string, description: string) => {
    if (editingChapter) {
      updateModule.mutate({
        courseId,
        moduleId: editingChapter.id,
        title,
        description,
      });
    } else {
      createModule.mutate({
        courseId,
        title,
        description,
        order: chapters.length,
      });
    }
    setIsChapterModalOpen(false);
    setEditingChapter(null);
  }, [editingChapter, updateModule, createModule, courseId, chapters.length]);

  // ── Filtered chapters ──────────────────────────────────────────────────────
  const filteredChapters = chapters.map((ch) => ({
    ...ch,
    lessons:
      activeFilter === "all"
        ? ch.lessons
        : ch.lessons.filter((l) =>
            activeFilter === "public" ? l.status === "published" : l.status === "draft",
          ),
  })).filter((ch) => activeFilter === "all" || ch.lessons.length > 0);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8FF]">
      <PageTopbar />

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[860px] mx-auto px-6 py-6 flex flex-col gap-5">

          {/* Back link */}
          <Link
            href="/instructor/courses"
            className="flex items-center gap-1 text-[13px] text-[#6B6BFF] font-semibold hover:text-[#4648D4] transition-colors w-fit"
          >
            <ChevronLeftIcon size={14} />
            Quay lại danh sách khóa học
          </Link>

          {/* Page header */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 suppressHydrationWarning className="text-[26px] font-extrabold text-[#1A1A2E] tracking-tight leading-tight">
                {course?.title || "Khóa học"}
              </h1>
              <p className="text-[13px] text-[#9090B0] mt-1">
                Quản lý nội dung và cấu trúc bài giảng
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                id="btn-preview-course"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#DDDDF0] text-[13px] font-semibold text-[#464554] bg-white hover:bg-[#F4F4FA] hover:border-[#C5C6FF] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#EAEAF4]"
              >
                <EyeIcon size={13} />
                Xem trước
              </button>
              <button
                type="button"
                id="btn-add-lesson"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-white bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] shadow-[0_4px_14px_rgba(70,72,212,0.35)] hover:shadow-[0_6px_20px_rgba(70,72,212,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4648D4]/40"
              >
                <PlusIcon size={13} />
                Thêm Bài học mới
              </button>
            </div>
          </div>

          {/* Filter + stats bar */}
          <FilterBar
            active={activeFilter}
            onChange={setActiveFilter}
            total={allLessons}
            published={pubLessons}
            draft={draftLessons}
            totalHours={duration}
            totalChapters={chapters.length}
          />

          {/* Chapter list */}
          <div className="flex flex-col gap-3">
            {filteredChapters.map((chapter) => (
              <ChapterCard
                key={chapter.id}
                chapter={chapter as any}
                onToggle={() => toggleChapter(chapter.id.toString())}
                onAddLesson={() => addLesson(chapter.id.toString())}
                onEditLesson={(lesson) => setEditingLesson({ chapterId: chapter.id.toString(), lesson: lesson as any })}
                onDeleteLesson={(lid) => deleteLesson(chapter.id.toString(), lid.toString())}
                onEdit={() => openEditChapterModal(chapter as any)}
                onDelete={() => deleteChapter(chapter.id.toString())}
              />
            ))}

            {filteredChapters.length === 0 && (
              <div className="flex items-center justify-center py-16 text-[13px] text-[#B0B0C8]">
                Không có bài học nào phù hợp với bộ lọc này.
              </div>
            )}
          </div>

          {/* AI Assist */}
          <AIAssistCard
            onQuizGenerate={() => alert("Đang sinh câu hỏi Quiz...")}
            onSuggestChapter={openAddChapterModal}
          />

          {/* Add Chapter CTA */}
          <AddChapterButton onClick={openAddChapterModal} />
        </div>
      </div>

      <PageFooter />
      <ChatFAB />

      {/* Modals */}
      <ChapterModal
        isOpen={isChapterModalOpen}
        editingChapter={editingChapter}
        onSave={handleChapterModalSave}
        onClose={() => {
          setIsChapterModalOpen(false);
          setEditingChapter(null);
        }}
      />

      {editingLesson && (
        <LessonEditModal
          lesson={editingLesson.lesson}
          onSave={async (id, updates) => {
            try {
              await updateLesson(editingLesson.chapterId, id, updates);
              setEditingLesson(null);
            } catch (err) {
              console.error(err);
              throw err; // throw so LessonEditModal catch block can handle it!
            }
          }}
          onClose={() => setEditingLesson(null)}
        />
      )}
    </div>
  );
}


================================================================
File: H:\du_an\website\mindnova-ai\src\features\instructor\shared\components\RichTextEditor.tsx
================================================================

"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";

const videoMetadataCache = new Map<string, { name: string; size: string }>();

const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const renderVideoPreview = (url: string) => {
  const meta = videoMetadataCache.get(url);
  const displayName = meta?.name || 'Video đã tải lên';
  const displaySize = meta?.size ? ` • ${meta.size}` : '';

  return `
    <div style="width: 100%; max-width: 100%; padding: 24px; border-radius: 12px; background-color: #F4F4FA; border: 2px dashed #D5D5F0; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 12px; cursor: default;">
      <div style="width: 48px; height: 48px; border-radius: 50%; background-color: #EEF0FF; color: #4648D4; display: flex; align-items: center; justify-content: center;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M23 7L16 12L23 17V7Z"></path>
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
        </svg>
      </div>
      <div style="text-align: center;">
        <div style="font-family: sans-serif; font-size: 14px; font-weight: 600; color: #1A1A2E;">${displayName}</div>
        <div style="font-family: sans-serif; font-size: 12px; color: #64647A; margin-top: 4px;">Click để xem/đổi video (Preview tạm thời tắt)${displaySize}</div>
      </div>
    </div>
  `;
};

// CKEditor accesses `window` at module level — must be loaded client-only
const CKEditorComponent = dynamic(
  () =>
    Promise.all([
      import("@ckeditor/ckeditor5-react"),
      import("@ckeditor/ckeditor5-build-classic"),
    ]).then(([{ CKEditor }, { default: ClassicEditor }]) => {
      // MindNova custom video plugin
      function MindNovaVideoPlugin(editor: any) {
        let ButtonView: any = null;

        const getButtonViewClass = () => {
          if (ButtonView) return ButtonView;
          try {
            // Try to create a standard button to extract its constructor
            // This must be done lazily to ensure other plugins have initialized
            const templateBtn = editor.ui.componentFactory.create('undo') || editor.ui.componentFactory.create('bold');
            if (templateBtn) {
              ButtonView = templateBtn.constructor;
            }
          } catch (e) {
            console.warn("Could not extract ButtonView from factory:", e);
          }
          return ButtonView;
        };

        editor.ui.componentFactory.add('mindNovaVideo', (locale: any) => {
          const BtnClass = getButtonViewClass();
          if (!BtnClass) return null;

          const view = new BtnClass(locale);
          view.set({
            label: 'Video',
            icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M23 7L16 12L23 17V7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
            tooltip: true
          });
          view.on('execute', () => {
            window.dispatchEvent(new CustomEvent('mindNovaVideoAction'));
          });
          return view;
        });

        // Balloon toolbar actions
        editor.ui.componentFactory.add('mindNovaVideoReplaceFile', (locale: any) => {
          const BtnClass = getButtonViewClass();
          if (!BtnClass) return null;
          const btn = new BtnClass(locale);
          btn.set({ label: 'Đổi video', withText: true, tooltip: true });
          btn.on('execute', () => {
            window.dispatchEvent(new CustomEvent('mindNovaVideoReplaceFile'));
          });
          return btn;
        });

        editor.ui.componentFactory.add('mindNovaVideoReplaceLink', (locale: any) => {
          const BtnClass = getButtonViewClass();
          if (!BtnClass) return null;
          const btn = new BtnClass(locale);
          btn.set({ label: 'Đổi liên kết', withText: true, tooltip: true });
          btn.on('execute', () => {
            window.dispatchEvent(new CustomEvent('mindNovaVideoReplaceLink'));
          });
          return btn;
        });

        editor.ui.componentFactory.add('mindNovaVideoDelete', (locale: any) => {
          const BtnClass = getButtonViewClass();
          if (!BtnClass) return null;
          const btn = new BtnClass(locale);
          btn.set({ label: 'Xóa video', withText: true, tooltip: true });
          btn.on('execute', () => {
            editor.model.change((writer: any) => {
              const selection = editor.model.document.selection;
              const el = selection.getSelectedElement();
              if (el && el.is('element', 'media')) {
                writer.remove(el);
              }
            });
          });
          return btn;
        });
      }

      // Return a wrapper component
      function CKEditorWrapper({
        value,
        onChange,
        placeholder,
        onEditorReady,
        onImageUpload,
      }: {
        value: string;
        onChange: (v: string) => void;
        placeholder?: string;
        onEditorReady?: (editor: any) => void;
        onImageUpload?: (file: File) => Promise<string>;
      }) {
        function CustomUploadAdapterPlugin(editor: any) {
          if (!onImageUpload) return;
          editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
            return {
              upload: () => {
                return loader.file.then((file: File) => 
                  onImageUpload(file).then(url => ({ default: url }))
                );
              },
              abort: () => {}
            };
          };
        }

        return (
          <div className="prose prose-sm max-w-none ckeditor-wrapper relative">
            <CKEditor
              editor={ClassicEditor}
              data={value}
              onReady={(editor: any) => {
                if (onEditorReady) onEditorReady(editor);
              }}
              onChange={(_event: unknown, editor: { getData: () => string }) => {
                onChange(editor.getData());
              }}
              config={{
                extraPlugins: [MindNovaVideoPlugin, CustomUploadAdapterPlugin],
                placeholder: placeholder || "Nhập nội dung...",
                toolbar: [
                  "heading",
                  "|",
                  "bold",
                  "italic",
                  "link",
                  "bulletedList",
                  "numberedList",
                  "|",
                  "outdent",
                  "indent",
                  "|",
                  "imageUpload",
                  "blockQuote",
                  "insertTable",
                  "undo",
                  "redo",
                ],
                mediaEmbed: {
                  previewsInData: true,
                  toolbar: ['mindNovaVideoReplaceFile', 'mindNovaVideoReplaceLink', 'mindNovaVideoDelete'],
                  extraProviders: [
                    {
                      name: 'blobVideo',
                      url: /^blob:.*?/,
                      html: (match: RegExpMatchArray) => renderVideoPreview(match[0])
                    },
                    {
                      name: 'hostedVideo',
                      url: /^https?:\/\/.+?\.(mp4|mov|avi|webm)(?:\?.*)?$/i,
                      html: (match: RegExpMatchArray) => renderVideoPreview(match[0])
                    }
                  ]
                }
              }}
            />
          </div>
        );
      }
      return CKEditorWrapper;
    }),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[300px] bg-slate-50 border border-slate-200 rounded animate-pulse" />
    ),
  },
);

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onVideoUpload?: (file: File, onProgress: (progress: number) => void) => Promise<{ url: string, media_id: number }>;
  onImageUpload?: (file: File) => Promise<string>;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  onVideoUpload,
  onImageUpload,
}: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false);
  const [editorInstance, setEditorInstance] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Custom UI states
  const [showMenu, setShowMenu] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkInput, setLinkInput] = useState("");
  // Track if we are replacing an existing video or adding a new one
  const [isReplacing, setIsReplacing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    setMounted(true);

    const handleAction = () => {
      setIsReplacing(false);
      setShowMenu(true);
    };

    const handleReplaceFile = () => {
      setIsReplacing(true);
      fileInputRef.current?.click();
    };

    const handleReplaceLink = () => {
      setIsReplacing(true);
      setLinkInput("");
      setShowLinkDialog(true);
    };

    window.addEventListener('mindNovaVideoAction', handleAction);
    window.addEventListener('mindNovaVideoReplaceFile', handleReplaceFile);
    window.addEventListener('mindNovaVideoReplaceLink', handleReplaceLink);

    return () => {
      window.removeEventListener('mindNovaVideoAction', handleAction);
      window.removeEventListener('mindNovaVideoReplaceFile', handleReplaceFile);
      window.removeEventListener('mindNovaVideoReplaceLink', handleReplaceLink);
    };
  }, []);

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onVideoUpload || !editorInstance) return;

    // Reset input immediately so user can select same file again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
    setShowMenu(false);

    // Validations
    const validMimeTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm', 'video/x-matroska'];
    const maxFileSize = 2 * 1024 * 1024 * 1024; // 2GB

    if (!validMimeTypes.includes(file.type)) {
      alert("Định dạng video không được hỗ trợ. Vui lòng chọn file MP4, MOV, AVI, WEBM, hoặc MKV.");
      return;
    }

    if (file.size > maxFileSize) {
      alert("Dung lượng video vượt quá giới hạn 2GB.");
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const result = await onVideoUpload(file, (progress) => {
        setUploadProgress(progress);
      });

      // Insert Cloudflare URL directly
      const videoUrl = result.url;

      videoMetadataCache.set(videoUrl, { name: file.name, size: formatBytes(file.size) });

      if (isReplacing) {
        editorInstance.model.change((writer: any) => {
          const selection = editorInstance.model.document.selection;
          const el = selection.getSelectedElement();
          if (el && el.is('element', 'media')) {
            writer.setAttribute('url', videoUrl, el);
            // Store media_id in a custom attribute if needed, but CKEditor mediaEmbed doesn't easily support extra attributes.
            // We'll extract temp_media_ids from the raw HTML content later.
          }
        });
      } else {
        editorInstance.execute('mediaEmbed', videoUrl);
      }
    } catch (error: any) {
      console.error("Video upload failed:", error);
      const serverError = error.response?.data?.message || error.response?.data?.error || error.message || "Unknown error";
      alert(`Tải video lên thất bại.\nChi tiết: ${serverError}\nVui lòng kiểm tra Console.`);
    } finally {
      setIsUploading(false);
      setIsReplacing(false);
    }
  };

  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkInput.trim() || !editorInstance) return;

    if (isReplacing) {
      editorInstance.model.change((writer: any) => {
        const selection = editorInstance.model.document.selection;
        const el = selection.getSelectedElement();
        if (el && el.is('element', 'media')) {
          writer.setAttribute('url', linkInput.trim(), el);
        }
      });
    } else {
      editorInstance.execute('mediaEmbed', linkInput.trim());
    }

    setShowLinkDialog(false);
    setLinkInput("");
    setIsReplacing(false);
  };

  if (!mounted) {
    return (
      <div className="w-full h-[300px] bg-slate-50 border border-slate-200 rounded animate-pulse" />
    );
  }

  return (
    <div className="flex flex-col gap-2 relative z-0">
      <input
        type="file"
        accept="video/*"
        ref={fileInputRef}
        onChange={handleVideoUpload}
        className="hidden"
      />

      {showMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
          <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 w-56 bg-white rounded-xl shadow-lg border border-[#EAEAF4] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-1.5 flex flex-col">
              <button
                type="button"
                disabled={isUploading}
                onClick={() => {
                  setShowMenu(false);
                  fileInputRef.current?.click();
                }}
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#1A1A2E] hover:bg-[#F4F4FA] hover:text-[#4648D4] rounded-lg transition-colors w-full text-left disabled:opacity-50"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                Tải video từ máy
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  setShowLinkDialog(true);
                }}
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#1A1A2E] hover:bg-[#F4F4FA] hover:text-[#4648D4] rounded-lg transition-colors w-full text-left"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
                Gắn liên kết video
              </button>
            </div>
          </div>
        </>
      )}

      {showLinkDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setShowLinkDialog(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-[#F0F0F8]">
              <h2 className="text-lg font-bold text-[#1A1A2E]">Gắn liên kết Video</h2>
            </div>
            <form onSubmit={handleLinkSubmit}>
              <div className="p-6">
                <label className="block text-sm font-semibold text-[#1A1A2E] mb-2">Đường dẫn Video (URL)</label>
                <input
                  autoFocus
                  type="url"
                  placeholder="https://..."
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm border border-[#EAEAF4] focus:border-[#6B6BFF] focus:ring-2 focus:ring-[#6B6BFF]/20 outline-none transition-all"
                  required
                />
              </div>
              <div className="px-6 py-4 bg-[#FAFAFE] border-t border-[#F0F0F8] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowLinkDialog(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-[#64647A] hover:bg-[#EAEAF4] transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#4648D4] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  Thêm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <CKEditorComponent
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onEditorReady={setEditorInstance}
        onImageUpload={onImageUpload}
      />

      {isUploading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg border border-[#EAEAF4]">
          <div className="w-12 h-12 border-4 border-[#F4F4FA] border-t-[#4648D4] rounded-full animate-spin mb-4"></div>
          <div className="text-[#1A1A2E] font-medium mb-1">Đang tải video lên...</div>
          <div className="text-[#64647A] text-sm">{Math.round(uploadProgress)}%</div>
          <div className="w-48 h-1.5 bg-[#F4F4FA] rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-[#4648D4] transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}

================================================================
File: H:\du_an\website\mindnova-ai\src\hooks\instructor\useAIQuizGenerator.ts
================================================================

"use client";

import { useState, useCallback } from "react";

export type QuestionType = "multiple_choice" | "true_false" | "coding_challenge";
export type ReviewStatus = "pending" | "approved" | "edited" | "discarded";

export interface GeneratedQuestion {
  id: string;
  type: QuestionType;
  question: string;
  correctAnswer: string;
  distractors: string[]; // for multiple choice
  explanation: string;
  codeSnippet?: string;
  reviewStatus: ReviewStatus;
}

export interface UseAIQuizGeneratorReturn {
  isGenerating: boolean;
  questions: GeneratedQuestion[];
  transcriptSource: string;
  setTranscriptSource: (txt: string) => void;
  generateFromTranscript: (lessonTitle: string) => void;
  approveQuestion: (id: string) => void;
  editQuestion: (id: string, newText: string, newAnswer: string) => void;
  discardQuestion: (id: string) => void;
  approvedCount: number;
}

const MOCK_TRANSCRIPT_SAMPLE = `In Next.js 15, React Server Components (RSC) are the default rendering paradigm. Because Server Components run exclusively on the Node or Edge runtime, they can directly query databases and private internal microservices without exposing sensitive environment variables or serialization overhead to the browser client. To handle interactivity, such as onClick event listeners and state management hooks (useState, useEffect), engineers must prepend the 'use client' boundary directive at the top of the deepest leaf component possible to keep client JavaScript bundles lean and highly optimized.`;

export function useAIQuizGenerator(): UseAIQuizGeneratorReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [transcriptSource, setTranscriptSource] = useState<string>(MOCK_TRANSCRIPT_SAMPLE);

  const generateFromTranscript = useCallback((lessonTitle: string) => {
    setIsGenerating(true);
    setQuestions([]);

    console.info(`[AI Co-Creator] Analyzing transcript for "${lessonTitle}"...`);
    console.info(`[AI Co-Creator] Extracting contextual multiple-choice & coding challenges...`);

    setTimeout(() => {
      const generated: GeneratedQuestion[] = [
        {
          id: "q-ai-101",
          type: "multiple_choice",
          question: "Why should the 'use client' directive be placed at the deepest leaf components possible in Next.js App Router?",
          correctAnswer: "To minimize client JavaScript bundle sizes and optimize network hydration payload.",
          distractors: [
            "Because React Server Components cannot render inside CSS grid containers.",
            "To bypass Node.js memory limit restrictions during API route execution.",
            "To force Server Actions to run synchronously within localStorage.",
          ],
          explanation: "Pushing 'use client' down ensures that heavy surrounding wrapper layouts remain server-rendered and zero-bundle.",
          reviewStatus: "pending",
        },
        {
          id: "q-ai-102",
          type: "true_false",
          question: "React Server Components (RSC) allow developers to directly access secure backend resources without exposing environment keys to the browser client.",
          correctAnswer: "True",
          distractors: ["False"],
          explanation: "Server Components run strictly on the server; client bundles never receive server private variables.",
          reviewStatus: "pending",
        },
        {
          id: "q-ai-103",
          type: "coding_challenge",
          question: "Identify the missing Edge async response wrapper in this custom Route Handler validation pattern:",
          correctAnswer: "export async function POST(req: NextRequest) { const body = await req.json(); ... }",
          distractors: [
            "export function POST(req) { return req.body; }",
            "const handler = (req, res) => { res.send(200); };",
          ],
          codeSnippet: `// Broken code snippet from lesson transcript:\nexport function POST(req) {\n  const data = req.json();\n  return new Response("OK");\n}`,
          explanation: "Edge Route Handlers must be async functions and await req.json() to properly unpack stream buffers.",
          reviewStatus: "pending",
        },
      ];

      setQuestions(generated);
      setIsGenerating(false);
    }, 1800);
  }, []);

  const approveQuestion = useCallback((id: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, reviewStatus: "approved" } : q))
    );
  }, []);

  const editQuestion = useCallback((id: string, newText: string, newAnswer: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, question: newText, correctAnswer: newAnswer, reviewStatus: "edited" } : q
      )
    );
  }, []);

  const discardQuestion = useCallback((id: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, reviewStatus: "discarded" } : q))
    );
  }, []);

  const approvedCount = questions.filter((q) => q.reviewStatus === "approved" || q.reviewStatus === "edited").length;

  return {
    isGenerating,
    questions,
    transcriptSource,
    setTranscriptSource,
    generateFromTranscript,
    approveQuestion,
    editQuestion,
    discardQuestion,
    approvedCount,
  };
}


================================================================
File: H:\du_an\website\mindnova-ai\src\hooks\instructor\useCourseStructure.ts
================================================================

"use client";

import { useState, useCallback } from "react";

export type CoursePublishStatus = "draft" | "review" | "published";
export type LessonType = "video" | "quiz" | "document";

export interface LessonNode {
  id: string;
  title: string;
  type: LessonType;
  durationSeconds?: number;
  videoUrl?: string;
  description?: string;
}

export interface ChapterNode {
  id: string;
  title: string;
  description?: string;
  lessons: LessonNode[];
  showAiSuggestion?: boolean;
}

export interface CourseVersionMeta {
  version: string;
  lastUpdated: string;
  isLockedForStudents: boolean;
}

export interface UseCourseStructureReturn {
  chapters: ChapterNode[];
  status: CoursePublishStatus;
  versionMeta: CourseVersionMeta;
  canSubmitForReview: boolean;
  validationError: string | null;
  setStatus: (newStatus: CoursePublishStatus) => void;
  addChapter: (title?: string) => void;
  updateChapterTitle: (chapterId: string, title: string) => void;
  deleteChapter: (chapterId: string) => void;
  addLesson: (chapterId: string, title?: string, type?: LessonType) => void;
  updateLesson: (chapterId: string, lessonId: string, updates: Partial<LessonNode>) => void;
  deleteLesson: (chapterId: string, lessonId: string) => void;
  moveLesson: (fromChapterId: string, toChapterId: string, lessonId: string, targetIndex?: number) => void;
  handleSubmitForReview: () => boolean;
  createVersionSnapshot: () => void;
}

const INITIAL_CHAPTERS: ChapterNode[] = [
  {
    id: "chap-1",
    title: "Module 1: Architecture Foundations & Server Components",
    description: "Understanding RSC paradigms and modern Next.js caching models.",
    lessons: [
      { id: "les-101", title: "Why React Server Components? (80/20 Practice)", type: "video", durationSeconds: 620 },
      { id: "les-102", title: "Configuring App Router Routing Architectures", type: "document" },
      { id: "les-103", title: "Module 1 Practical Understanding Check", type: "quiz" },
    ],
  },
  {
    id: "chap-2",
    title: "Module 2: Edge Data Fetching & Cache Revalidation",
    description: "Mastering fetch tag invalidation and Server Actions.",
    showAiSuggestion: true,
    lessons: [
      { id: "les-201", title: "Building Type-Safe Server Actions", type: "video", durationSeconds: 890 },
      { id: "les-202", title: "Optimistic UI Updates & Error Boundary Defense", type: "video", durationSeconds: 540 },
    ],
  },
];

export function useCourseStructure(initialStatus: CoursePublishStatus = "draft"): UseCourseStructureReturn {
  const [chapters, setChapters] = useState<ChapterNode[]>(INITIAL_CHAPTERS);
  const [status, setStatusState] = useState<CoursePublishStatus>(initialStatus);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [versionMeta, setVersionMeta] = useState<CourseVersionMeta>({
    version: "v1.0.0-draft",
    lastUpdated: new Date().toISOString(),
    isLockedForStudents: false,
  });

  // Rule: Course must have >= 1 chapter and >= 1 lesson overall to be submitted for review
  const totalLessonsCount = chapters.reduce((sum, ch) => sum + ch.lessons.length, 0);
  const canSubmitForReview = chapters.length >= 1 && totalLessonsCount >= 1;

  const setStatus = useCallback((newStatus: CoursePublishStatus) => {
    if (newStatus === "review" && !canSubmitForReview) {
      setValidationError("Cannot submit for review: A course must contain at least 1 chapter and 1 lesson.");
      return;
    }
    setValidationError(null);
    setStatusState(newStatus);
  }, [canSubmitForReview]);

  const addChapter = useCallback((title = "New Curriculum Module") => {
    const newChap: ChapterNode = {
      id: `chap-${Date.now()}`,
      title,
      description: "Click to edit chapter overview...",
      lessons: [],
    };
    setChapters((prev) => [...prev, newChap]);
    setValidationError(null);
  }, []);

  const updateChapterTitle = useCallback((chapterId: string, title: string) => {
    setChapters((prev) =>
      prev.map((ch) => (ch.id === chapterId ? { ...ch, title } : ch))
    );
  }, []);

  const deleteChapter = useCallback((chapterId: string) => {
    setChapters((prev) => prev.filter((ch) => ch.id !== chapterId));
  }, []);

  const addLesson = useCallback((chapterId: string, title = "New Interactive Lesson", type: LessonType = "video") => {
    const newLesson: LessonNode = {
      id: `les-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title,
      type,
      durationSeconds: type === "video" ? 360 : undefined,
    };
    setChapters((prev) =>
      prev.map((ch) => (ch.id === chapterId ? { ...ch, lessons: [...ch.lessons, newLesson] } : ch))
    );
    setValidationError(null);
  }, []);

  const updateLesson = useCallback((chapterId: string, lessonId: string, updates: Partial<LessonNode>) => {
    setChapters((prev) =>
      prev.map((ch) => {
        if (ch.id !== chapterId) return ch;
        return {
          ...ch,
          lessons: ch.lessons.map((ls) => (ls.id === lessonId ? { ...ls, ...updates } : ls)),
        };
      })
    );
  }, []);

  const deleteLesson = useCallback((chapterId: string, lessonId: string) => {
    setChapters((prev) =>
      prev.map((ch) => {
        if (ch.id !== chapterId) return ch;
        return {
          ...ch,
          lessons: ch.lessons.filter((ls) => ls.id !== lessonId),
        };
      })
    );
  }, []);

  // Effortlessly move lesson across chapters (Drag-and-drop support)
  const moveLesson = useCallback((fromChapterId: string, toChapterId: string, lessonId: string, targetIndex?: number) => {
    setChapters((prev) => {
      const sourceChap = prev.find((c) => c.id === fromChapterId);
      if (!sourceChap) return prev;
      const lessonToMove = sourceChap.lessons.find((l) => l.id === lessonId);
      if (!lessonToMove) return prev;

      return prev.map((ch) => {
        if (ch.id === fromChapterId && ch.id === toChapterId) {
          // Reordering within same chapter
          const filtered = ch.lessons.filter((l) => l.id !== lessonId);
          const idx = targetIndex !== undefined ? targetIndex : filtered.length;
          const updated = [...filtered];
          updated.splice(idx, 0, lessonToMove);
          return { ...ch, lessons: updated };
        }
        if (ch.id === fromChapterId) {
          return { ...ch, lessons: ch.lessons.filter((l) => l.id !== lessonId) };
        }
        if (ch.id === toChapterId) {
          const filtered = ch.lessons;
          const idx = targetIndex !== undefined ? targetIndex : filtered.length;
          const updated = [...filtered];
          updated.splice(idx, 0, lessonToMove);
          return { ...ch, lessons: updated };
        }
        return ch;
      });
    });
  }, []);

  // Rule: Submit for review gate enforcement
  const handleSubmitForReview = useCallback((): boolean => {
    if (!canSubmitForReview) {
      setValidationError("Submission Blocked: You must add at least 1 chapter and 1 lesson before submitting for review.");
      return false;
    }
    setValidationError(null);
    setStatusState("review");
    return true;
  }, [canSubmitForReview]);

  // Rule: Changes to published courses must be version-controlled so students are not disrupted mid-lesson
  const createVersionSnapshot = useCallback(() => {
    setVersionMeta((prev) => {
      const parts = prev.version.replace("v", "").split(".");
      const major = Number(parts[0]) || 1;
      const minor = (Number(parts[1]) || 0) + 1;
      return {
        version: `v${major}.${minor}.0`,
        lastUpdated: new Date().toISOString(),
        isLockedForStudents: true, // Seamless mid-lesson lock for active students
      };
    });
  }, []);

  return {
    chapters,
    status,
    versionMeta,
    canSubmitForReview,
    validationError,
    setStatus,
    addChapter,
    updateChapterTitle,
    deleteChapter,
    addLesson,
    updateLesson,
    deleteLesson,
    moveLesson,
    handleSubmitForReview,
    createVersionSnapshot,
  };
}


================================================================
File: H:\du_an\website\mindnova-ai\src\hooks\instructor\useInstructorPricing.ts
================================================================

"use client";

import { useState, useCallback, useMemo } from "react";

export type PricingTier = "standard" | "exclusive";

export interface DiscountConfig {
  isEnabled: boolean;
  discountPrice: number;
  startDate: string;
  endDate: string;
}

export interface RevenueBreakdown {
  listPrice: number;
  commissionRate: number; // e.g. 30 or 15
  platformFee: number;
  instructorEarnings: number;
  earningsText: string;
}

export interface UseInstructorPricingReturn {
  isFree: boolean;
  basePrice: number;
  tier: PricingTier;
  discount: DiscountConfig;
  validationError: string | null;
  revenue: RevenueBreakdown;
  setIsFree: (val: boolean) => void;
  setBasePrice: (val: number | string) => void;
  setTier: (tier: PricingTier) => void;
  toggleDiscount: (enable?: boolean) => void;
  updateDiscount: (field: keyof DiscountConfig, value: unknown) => void;
}

const MIN_PRICE = 10;
const MAX_PRICE = 500;

export function useInstructorPricing(initialPrice = 50): UseInstructorPricingReturn {
  const [isFree, setIsFreeState] = useState(false);
  const [basePrice, setBasePriceState] = useState<number>(initialPrice);
  const [tier, setTier] = useState<PricingTier>("standard");
  const [validationError, setValidationError] = useState<string | null>(null);

  // Default promotional dates: starts today, ends 7 days from today
  const defaultStart = new Date().toISOString().slice(0, 10);
  const defaultEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const [discount, setDiscount] = useState<DiscountConfig>({
    isEnabled: false,
    discountPrice: Math.max(MIN_PRICE, Math.floor(initialPrice * 0.7)),
    startDate: defaultStart,
    endDate: defaultEnd,
  });

  const setIsFree = useCallback((val: boolean) => {
    setIsFreeState(val);
    setValidationError(null);
  }, []);

  const setBasePrice = useCallback((val: number | string) => {
    const num = typeof val === "string" ? parseFloat(val) || 0 : val;
    setBasePriceState(num);

    if (!isFree) {
      if (num < MIN_PRICE || num > MAX_PRICE) {
        setValidationError(`Strict Bounds Rule: Price must be set between $${MIN_PRICE} and $${MAX_PRICE} USD.`);
      } else {
        setValidationError(null);
      }
    }
  }, [isFree]);

  const toggleDiscount = useCallback((enable?: boolean) => {
    setDiscount((prev) => {
      const nextState = enable !== undefined ? enable : !prev.isEnabled;
      return {
        ...prev,
        isEnabled: nextState,
        discountPrice: Math.min(prev.discountPrice, basePrice - 5 > MIN_PRICE ? basePrice - 5 : MIN_PRICE),
      };
    });
  }, [basePrice]);

  const updateDiscount = useCallback((field: keyof DiscountConfig, value: unknown) => {
    setDiscount((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "discountPrice" && typeof value === "number") {
        if (value >= basePrice || value < MIN_PRICE) {
          setValidationError(`Discount must be below base price ($${basePrice}) and above minimum ($${MIN_PRICE}).`);
        } else {
          setValidationError(null);
        }
      }
      return updated;
    });
  }, [basePrice]);

  // Dynamic Revenue Calculator (Section 1.3)
  const revenue: RevenueBreakdown = useMemo(() => {
    if (isFree) {
      return {
        listPrice: 0,
        commissionRate: 0,
        platformFee: 0,
        instructorEarnings: 0,
        earningsText: "Free course — ($0.00 platform commission). Ideal for cohort community building!",
      };
    }

    const activePrice = discount.isEnabled ? discount.discountPrice : basePrice;
    const rate = tier === "exclusive" ? 15 : 30; // 15% for exclusive instructors, 30% standard
    const platformFee = Number(((activePrice * rate) / 100).toFixed(2));
    const instructorEarnings = Number((activePrice - platformFee).toFixed(2));

    return {
      listPrice: activePrice,
      commissionRate: rate,
      platformFee,
      instructorEarnings,
      earningsText: `If you set $${activePrice}, you earn $${instructorEarnings} after ${rate}% platform fees.`,
    };
  }, [isFree, basePrice, discount.isEnabled, discount.discountPrice, tier]);

  return {
    isFree,
    basePrice,
    tier,
    discount,
    validationError,
    revenue,
    setIsFree,
    setBasePrice,
    setTier,
    toggleDiscount,
    updateDiscount,
  };
}


================================================================
File: H:\du_an\website\mindnova-ai\src\hooks\instructor\useVideoProcessing.ts
================================================================

"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export type ProcessingStage = "idle" | "uploading" | "compressing" | "transcoding" | "thumbnails" | "ready" | "error";

export interface VideoItem {
  id: string;
  fileName: string;
  fileSizeMb: number;
  format: "mp4" | "mov" | "other";
  uploadProgress: number; // 0 to 100
  stage: ProcessingStage;
  stageLabel: string;
  resolutions: string[]; // e.g. ["1080p", "720p", "480p"]
  thumbnailUrl?: string;
  errorMsg?: string;
}

export interface UseVideoProcessingReturn {
  videos: VideoItem[];
  isProcessingAny: boolean;
  uploadError: string | null;
  handleDropFiles: (files: FileList | File[]) => void;
  removeVideo: (id: string) => void;
  clearAllCompleted: () => void;
}

const MEMORY_STORAGE_KEY = "mindnova_instructor_video_queue";

export function useVideoProcessing(): UseVideoProcessingReturn {
  const [videos, setVideos] = useState<VideoItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(MEMORY_STORAGE_KEY);
        if (saved) return JSON.parse(saved) as VideoItem[];
      } catch {
        // ignore
      }
    }
    return [
      {
        id: "vid-init-1",
        fileName: "Module2-ServerActions-FullstackDemo.mp4",
        fileSizeMb: 142.5,
        format: "mp4",
        uploadProgress: 100,
        stage: "ready",
        stageLabel: "✓ Ready in 1080p, 720p, 480p + Auto-Thumbnail Generated",
        resolutions: ["1080p (HD)", "720p (HD)", "480p (SD)"],
        thumbnailUrl: "/thumbnails/server-actions-preview.jpg",
      },
    ];
  });

  const [uploadError, setUploadError] = useState<string | null>(null);
  const timersRef = useRef<Record<string, NodeJS.Timeout>>({});

  // Synchronize queue to storage so instructor can navigate away while processing completes asynchronously
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(videos));
      } catch {
        // ignore
      }
    }
  }, [videos]);

  const isProcessingAny = videos.some(
    (v) => v.stage !== "ready" && v.stage !== "idle" && v.stage !== "error"
  );

  // Background state transition simulation
  const startAsynchronousProcessing = useCallback((id: string) => {
    // Stage 1: Upload progress loop
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 25) + 15;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);

        // Transition to Stage 2: Compressing
        setVideos((prev) =>
          prev.map((v) =>
            v.id === id ? { ...v, uploadProgress: 100, stage: "compressing", stageLabel: "⚙️ Compressing raw video stream..." } : v
          )
        );

        // Transition to Stage 3: Transcoding resolutions
        setTimeout(() => {
          setVideos((prev) =>
            prev.map((v) =>
              v.id === id ? { ...v, stage: "transcoding", stageLabel: "🔄 Transcoding to multiple resolutions (1080p, 720p, 480p)..." } : v
            )
          );

          // Transition to Stage 4: Auto-generating thumbnail
          setTimeout(() => {
            setVideos((prev) =>
              prev.map((v) =>
                v.id === id ? { ...v, stage: "thumbnails", stageLabel: "🖼️ Auto-generating high-contrast timestamp thumbnails..." } : v
              )
            );

            // Transition to Stage 5: Ready
            setTimeout(() => {
              setVideos((prev) =>
                prev.map((v) =>
                  v.id === id
                    ? {
                        ...v,
                        stage: "ready",
                        stageLabel: "✓ Ready in 1080p, 720p, 480p + Auto-Thumbnail Generated",
                        resolutions: ["1080p (HD)", "720p (HD)", "480p (SD)"],
                      }
                    : v
                )
              );
            }, 2500);
          }, 2800);
        }, 3000);
      } else {
        setVideos((prev) =>
          prev.map((v) =>
            v.id === id
              ? { ...v, uploadProgress: currentProgress, stageLabel: `⬆️ Uploading stream (${currentProgress}%)...` }
              : v
          )
        );
      }
    }, 450);

    timersRef.current[id] = interval;
  }, []);

  const handleDropFiles = useCallback((incomingFiles: FileList | File[]) => {
    setUploadError(null);
    const fileArray = Array.from(incomingFiles);
    if (fileArray.length === 0) return;

    const newItems: VideoItem[] = [];

    for (const file of fileArray) {
      const ext = file.name.split(".").pop()?.toLowerCase() || "";
      const isVideo = ext === "mp4" || ext === "mov" || file.type.startsWith("video/");

      if (!isVideo) {
        setUploadError(`Unsupported format for "${file.name}". Strict rule: Only standard MP4 and MOV video formats are accepted.`);
        continue;
      }

      const newId = `vid-${Date.now()}-${Math.floor(Math.random() * 9999)}`;
      const item: VideoItem = {
        id: newId,
        fileName: file.name,
        fileSizeMb: Number((file.size / (1024 * 1024)).toFixed(2)) || 50,
        format: ext === "mov" ? "mov" : "mp4",
        uploadProgress: 0,
        stage: "uploading",
        stageLabel: "⬆️ Initializing chunk upload (0%)...",
        resolutions: [],
      };

      newItems.push(item);
      // Initiate async backend worker simulation per file
      setTimeout(() => startAsynchronousProcessing(newId), 100);
    }

    if (newItems.length > 0) {
      setVideos((prev) => [...newItems, ...prev]);
    }
  }, [startAsynchronousProcessing]);

  const removeVideo = useCallback((id: string) => {
    if (timersRef.current[id]) {
      clearInterval(timersRef.current[id]);
      delete timersRef.current[id];
    }
    setVideos((prev) => prev.filter((v) => v.id !== id));
  }, []);

  const clearAllCompleted = useCallback(() => {
    setVideos((prev) => prev.filter((v) => v.stage !== "ready"));
  }, []);

  return {
    videos,
    isProcessingAny,
    uploadError,
    handleDropFiles,
    removeVideo,
    clearAllCompleted,
  };
}
