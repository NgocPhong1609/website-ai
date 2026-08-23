"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useGetPracticeOverview } from "../../api";
import type { PracticeOverviewData, AssessmentModuleItem } from "../../types";
import { SelfAssessmentModal } from "../self-assessment/SelfAssessmentModal";

export function QuizStartContent() {
  const { data, isLoading, isError } = useGetPracticeOverview();
  const [selectedModId, setSelectedModId] = useState<string>("");
  const [isSelfAssessmentOpen, setIsSelfAssessmentOpen] = useState<boolean>(false);

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 max-w-[1400px] mx-auto min-h-full flex flex-col gap-8 bg-[#F8F9FC]">
        <div className="h-56 bg-white rounded-2xl animate-pulse border border-[#EAEAF4]" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          <div className="h-36 bg-white rounded-2xl animate-pulse border border-[#EAEAF4]" />
          <div className="h-36 bg-white rounded-2xl animate-pulse border border-[#EAEAF4]" />
          <div className="h-36 bg-white rounded-2xl animate-pulse border border-[#EAEAF4]" />
          <div className="h-36 bg-white rounded-2xl animate-pulse border border-[#EAEAF4]" />
        </div>
        <div className="h-80 bg-white rounded-2xl animate-pulse border border-[#EAEAF4]" />
      </div>
    );
  }

  // Elegant default sample fallback if API server is temporarily unreachable
  const defaultModules: AssessmentModuleItem[] = [
    {
      id: "mod1",
      title: "Kiểm tra Nền tảng: Mạng Thần Kinh & Deep Learning",
      badge_title: "Đánh giá Năng lực • Module 1",
      course_title: "AI & Neural Network Foundations",
      description: "Kiểm nghiệm vững chắc tư duy kiến trúc Mạng Thần Kinh (ANN/CNN), cơ chế Attention trong Transformer và xử lý Overfitting trong bài toán thực tế.",
      questions_count_text: "10 Câu trắc nghiệm",
      time_limit_text: "15 Phút",
      passing_condition_text: "70% (Từ 7/10 câu)",
      attempts_allowed_text: "Không giới hạn (Xáo trộn tự động)",
      time_limit_minutes: 15,
      questions_count: 10,
      passing_percentage: 70,
      readiness: {
        status_label: "Trạng thái chuẩn bị ↗",
        percentage_text: "Sẵn sàng 100%",
        level_text: "Level 1",
        level_subtext: "(AI Foundations)",
        status_tag: "Active",
        action_prompt: "🧠 Hãy tự tin thử sức!",
        time_prompt: "Thời gian: 15 Phút ➔",
      },
      ai_insight: {
        title: "💡 Lời khuyên từ Gia sư Trí tuệ Nhân tạo Nova",
        tag: "✨ AI Advisory • Mod 1",
        content: '"Đối với học phần Nền tảng Mạng thần kinh, sự nhầm lẫn phổ biến nhất là chức năng của hàm kích hoạt ReLU và kỹ thuật Dropout để chống Overfitting! Bạn hãy tỉnh táo phân tách từng layer trong Transformer nhé!"',
        footer: "Hệ thống giám sát chuyên môn MindNova Co-Pilot",
      },
      prerequisites: [
        { id: 1, name: "Deep Learning Basics", color: "indigo", bg_class: "bg-[#EEF2FF]", text_class: "text-[#5052EE]", border_class: "border-[#5052EE]/20" },
        { id: 2, name: "Transformer Architecture", color: "teal", bg_class: "bg-[#EAF8F5]", text_class: "text-[#0D9488]", border_class: "border-[#0D9488]/20" },
        { id: 3, name: "Optimization & Loss", color: "amber", bg_class: "bg-[#FFF8EB]", text_class: "text-[#D97706]", border_class: "border-[#D97706]/20" },
      ],
    },
    {
      id: "mod2",
      title: "Kiểm tra Chuyên môn: Next.js 15 & React 19 Server Actions",
      badge_title: "Đánh giá Năng lực • Module 2",
      course_title: "Modern Next.js 15 & React 19",
      description: "Đọ sức sâu với cơ chế React 19 Actions, useActionState, Suspense Boundaries và tối ưu hóa Render trên Server vs Client.",
      questions_count_text: "10 Câu trắc nghiệm",
      time_limit_text: "15 Phút",
      passing_condition_text: "70% (Từ 7/10 câu)",
      attempts_allowed_text: "Không giới hạn (Xáo trộn tự động)",
      time_limit_minutes: 15,
      questions_count: 10,
      passing_percentage: 70,
      readiness: {
        status_label: "Trạng thái chuẩn bị ↗",
        percentage_text: "Sẵn sàng 100%",
        level_text: "Level 2",
        level_subtext: "(React 19 Core)",
        status_tag: "Active",
        action_prompt: "⚛️ Chinh phục Server Actions!",
        time_prompt: "Thời gian: 15 Phút ➔",
      },
      ai_insight: {
        title: "💡 Lời khuyên từ Gia sư Trí tuệ Nhân tạo Nova",
        tag: "✨ AI Advisory • Mod 2",
        content: '"Trong React 19 và Next.js 15, sự khác biệt căn bản nằm ở việc truyền tham số bất đồng bộ trong Server Components và cách sử dụng custom hook useActionState cho biểu mẫu! Hãy đặc biệt chú ý nhé!"',
        footer: "Hệ thống giám sát chuyên môn MindNova Co-Pilot",
      },
      prerequisites: [
        { id: 1, name: "React 19 Server Actions", color: "indigo", bg_class: "bg-[#EEF2FF]", text_class: "text-[#5052EE]", border_class: "border-[#5052EE]/20" },
        { id: 2, name: "Suspense & Streaming UI", color: "teal", bg_class: "bg-[#EAF8F5]", text_class: "text-[#0D9488]", border_class: "border-[#0D9488]/20" },
        { id: 3, name: "Server vs Client Tree", color: "amber", bg_class: "bg-[#FFF8EB]", text_class: "text-[#D97706]", border_class: "border-[#D97706]/20" },
      ],
    },
    {
      id: "mod3",
      title: "Kiểm tra Thực chiến: Tích hợp API & AI Stream 🚀",
      badge_title: "Đánh giá Năng lực • Module 3",
      course_title: "Next.js 15 AI Master Pro",
      description: "Thử sức và kiểm nghiệm mức độ thông tuệ về Xử lý Route Handlers, Streaming LLM và Logic Bất đồng bộ trong Next.js 15. Hệ thống kết hợp phân tích năng lực theo thời gian thực cùng Gia sư Nova.",
      questions_count_text: "10 Câu trắc nghiệm",
      time_limit_text: "15 Phút",
      passing_condition_text: "70% (Từ 7/10 câu)",
      attempts_allowed_text: "Không giới hạn (Xáo trộn tự động)",
      time_limit_minutes: 15,
      questions_count: 10,
      passing_percentage: 70,
      readiness: {
        status_label: "Trạng thái chuẩn bị ↗",
        percentage_text: "Sẵn sàng 100%",
        level_text: "Level 3",
        level_subtext: "(AI Streaming)",
        status_tag: "Active",
        action_prompt: "🔥 Hãy tự tin chinh phục!",
        time_prompt: "Thời gian: 15 Phút ➔",
      },
      ai_insight: {
        title: "💡 Lời khuyên từ Gia sư Trí tuệ Nhân tạo Nova",
        tag: "✨ AI Advisory • Mod 3",
        content: '"Qua phân tích học viện, chiến lược Fallback của Gemini và OpenAI cùng quản lý ReadableStream là các chốt chặn kiến trúc quan trọng nhất! Hãy giữ tâm trí tỉnh táo để hoàn thành tốt nhé!"',
        footer: "Hệ thống giám sát chuyên môn MindNova Co-Pilot",
      },
      prerequisites: [
        { id: 1, name: "Next.js 15 App Router", color: "indigo", bg_class: "bg-[#EEF2FF]", text_class: "text-[#5052EE]", border_class: "border-[#5052EE]/20" },
        { id: 2, name: "LLM API & Stream", color: "teal", bg_class: "bg-[#EAF8F5]", text_class: "text-[#0D9488]", border_class: "border-[#0D9488]/20" },
        { id: 3, name: "Async / Await Logic", color: "amber", bg_class: "bg-[#FFF8EB]", text_class: "text-[#D97706]", border_class: "border-[#D97706]/20" },
      ],
    },
    {
      id: "mod4",
      title: "Kiểm tra Chuyên sâu: Bảo mật, Middleware & Rate Limiting",
      badge_title: "Đánh giá Năng lực • Module 4",
      course_title: "Next.js 15 Security & Scaling",
      description: "Phân tích khả năng thiết lập tường lửa Middleware, quản lý token bảo mật Sanctum/JWT và kiểm soát giới hạn tài nguyên Rate Limiting cho hệ thống tải cao.",
      questions_count_text: "10 Câu trắc nghiệm",
      time_limit_text: "15 Phút",
      passing_condition_text: "70% (Từ 7/10 câu)",
      attempts_allowed_text: "Không giới hạn (Xáo trộn tự động)",
      time_limit_minutes: 15,
      questions_count: 10,
      passing_percentage: 70,
      readiness: {
        status_label: "Trạng thái chuẩn bị ↗",
        percentage_text: "Sẵn sàng 100%",
        level_text: "Level 4",
        level_subtext: "(Security Master)",
        status_tag: "Active",
        action_prompt: "🛡️ Bách chiến bách thắng!",
        time_prompt: "Thời gian: 15 Phút ➔",
      },
      ai_insight: {
        title: "💡 Lời khuyên từ Gia sư Trí tuệ Nhân tạo Nova",
        tag: "✨ AI Advisory • Mod 4",
        content: '"Bảo mật hệ thống AI bắt buộc phải đặt ở lớp tiền tuyến Middleware và phân tách quy trình xác minh qua Sanctum Token! Bạn đừng bỏ qua các cơ chế giới hạn tần suất throttle trong Laravel nhé!"',
        footer: "Hệ thống giám sát chuyên môn MindNova Co-Pilot",
      },
      prerequisites: [
        { id: 1, name: "Edge Middleware Security", color: "indigo", bg_class: "bg-[#EEF2FF]", text_class: "text-[#5052EE]", border_class: "border-[#5052EE]/20" },
        { id: 2, name: "API Rate Limiting", color: "teal", bg_class: "bg-[#EAF8F5]", text_class: "text-[#0D9488]", border_class: "border-[#0D9488]/20" },
        { id: 3, name: "Token & CORS Guard", color: "amber", bg_class: "bg-[#FFF8EB]", text_class: "text-[#D97706]", border_class: "border-[#D97706]/20" },
      ],
    },
  ];

  const content: PracticeOverviewData = (!isError && data && data.modules_list && data.modules_list.length > 0) ? data : {
    modules_list: defaultModules,
    assessment_info: defaultModules[2],
    readiness: defaultModules[2].readiness!,
    instructions: [
      "Hãy kiểm tra kết nối mạng Internet ổn định và chọn một không gian yên tĩnh trước khi nhấn nút Bắt Đầu.",
      "Đồng hồ bấm giờ sẽ lập tức kích hoạt đếm ngược 15 phút. Bài làm sẽ được ghi nhận khi bạn nộp bài hoặc khi thời gian kết thúc.",
      "Hệ thống tự động xáo trộn ngẫu nhiên thứ tự câu hỏi và vị trí các đáp án (A, B, C, D) trong mỗi lần truy cập nhằm phản ánh năng lực sát thực.",
      "Ngay sau khi nộp bài, Gia sư AI Nova sẽ ban hành bảng chấm điểm trung thực và lời giải chi tiết cho từng câu hỏi.",
    ],
    ai_insight: defaultModules[2].ai_insight!,
    prerequisites: defaultModules[2].prerequisites!,
    recent_attempts: {
      total_attempts: 0,
      best_score: "Chưa có điểm",
      message_title: "Bạn chưa có lượt làm bài ghi nhận",
      message_body: "Hãy chọn một chuyên đề ở trên và bắt đầu bài khảo sát đầu tiên để nhận thông số đánh giá chi tiết!",
      tag_text: "🌟 Đề thi động, xáo trộn tự động từng lượt!",
    }
  };

  const modulesList = content.modules_list || defaultModules;
  const currentMod = (selectedModId && modulesList.find(m => String(m.id) === String(selectedModId))) 
    || modulesList[2] 
    || modulesList[0] 
    || defaultModules[2];

  const assess = {
    ...content.assessment_info,
    ...currentMod,
  };
  const ready = currentMod.readiness || content.readiness || defaultModules[0].readiness!;
  const insight = currentMod.ai_insight || content.ai_insight || defaultModules[0].ai_insight!;
  const prereq = currentMod.prerequisites || content.prerequisites || defaultModules[0].prerequisites!;

  // Icon styling system matching Progress and History pages
  const moduleThemes = [
    { icon: "🧠", bg: "bg-[#EEF2FF]", text: "text-[#5052EE]", border: "border-[#5052EE]/25", badgeBg: "bg-[#EEF2FF]", badgeText: "text-[#5052EE]" },
    { icon: "⚛️", bg: "bg-[#EAF8F5]", text: "text-[#0D9488]", border: "border-[#0D9488]/25", badgeBg: "bg-[#EAF8F5]", badgeText: "text-[#0D9488]" },
    { icon: "🚀", bg: "bg-[#FFF8EB]", text: "text-[#D97706]", border: "border-[#D97706]/25", badgeBg: "bg-[#FFF8EB]", badgeText: "text-[#D97706]" },
    { icon: "🛡️", bg: "bg-[#F3E8FF]", text: "text-[#9333EA]", border: "border-[#9333EA]/25", badgeBg: "bg-[#F3E8FF]", badgeText: "text-[#9333EA]" }
  ];

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto min-h-full flex flex-col gap-8 bg-[#F8F9FC]">
      
      {/* ─── Synchronized Hero Banner (Cohesive with Progress & Courses) ─── */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#EEF2FF]/90 via-[#F6F6FB] to-[#E0F2FE]/80 border border-[#6B6BFF]/25 p-6 sm:p-8 shadow-[0_8px_30px_rgba(107,107,255,0.07)] transition-all duration-300 hover:shadow-[0_12px_36px_rgba(107,107,255,0.12)]">
        {/* Subtle background glow animations */}
        <div className="absolute -top-16 -right-16 w-60 h-60 rounded-full bg-[#6B6BFF]/10 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full bg-[#4CD7F6]/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            {/* Breadcrumb path */}
            <div className="flex items-center gap-2 text-xs font-medium text-[#64647A]">
              <Link href="/courses" className="hover:text-[#5052EE] transition-colors text-decoration-none font-medium">
                Khoá học của tôi
              </Link>
              <span className="text-[#A0A0C0]">•</span>
              <span className="text-[#0D9488] font-semibold bg-[#EAF8F5] px-2.5 py-0.5 rounded-full border border-[#0D9488]/20">
                Trung tâm Kiểm tra &amp; Đánh giá
              </span>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#6B6BFF]/30 text-xs font-semibold text-[#4648D4] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
              <span className="w-2 h-2 rounded-full bg-[#10B981] absolute" />
              Ngân hàng đề thi động • Kiểm tra tổng quát
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A2E] leading-tight">
              Trung tâm Kiểm tra &amp; Đánh giá: {" "}
              <span className="bg-gradient-to-r from-[#4648D4] via-[#6063EE] to-[#4CD7F6] bg-clip-text text-transparent font-bold drop-shadow-2xs">
                AI &amp; Fullstack
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-[#64647A] leading-relaxed font-normal">
              Tham gia các bài khảo sát trực quan để kiểm chứng sự thông hiểu về kiến trúc AI, Next.js 15 và bảo mật. Đề thi được xáo trộn tự động và chấm điểm giải mã chi tiết bởi <span className="text-[#5052EE] font-semibold">Gia sư Trí tuệ Nhân tạo Nova</span>.
            </p>
          </div>

          {/* Interactive Readiness Widget */}
          <div className="group shrink-0 bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-[#6B6BFF]/20 flex flex-col justify-center min-w-[310px] sm:min-w-[360px] shadow-sm hover:border-[#6B6BFF]/50 hover:-translate-y-0.5 transition-all duration-300">
            <div className="w-full flex items-center justify-between gap-4 mb-2">
              <span className="text-xs font-semibold text-[#7878A0] group-hover:text-[#4648D4] transition-colors">{ready.status_label}</span>
              <span className="text-[11px] font-semibold text-[#0D9488] bg-[#CCFBF1] px-2.5 py-0.5 rounded-full border border-[#10B981]/20">
                {ready.status_tag}
              </span>
            </div>

            <div className="text-2xl sm:text-3xl font-bold text-[#1A1A2E] my-1 flex items-baseline justify-between gap-4">
              <div>
                <span className="text-[#4648D4]">{ready.percentage_text.replace("Sẵn sàng ", "")}</span>
                <span className="text-xs font-medium text-[#9090B0] ml-1.5">chuẩn bị</span>
              </div>
              <span className="text-xs font-medium text-[#64647A]">
                {ready.level_text}
              </span>
            </div>

            <div className="w-full h-2 bg-[#F4F4FA] rounded-full mt-2.5 overflow-hidden p-0.5 border border-[#EAEAF4]/80">
              <div
                className="h-full bg-gradient-to-r from-[#4CD7F6] via-[#6B6BFF] to-[#10B981] rounded-full shadow-[0_0_8px_rgba(107,107,255,0.4)] transition-all duration-1000"
                style={{ width: "100%" }}
              />
            </div>

            <div className="text-xs font-semibold text-[#6B6BFF] mt-3.5 pt-3 border-t border-[#F0F2F8] flex items-center justify-between">
              <span>{ready.action_prompt}</span>
              <span className="text-[#4648D4]">{ready.time_prompt}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Module Showcase Gallery (Soft & Elegant Grid) ─── */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base sm:text-lg font-semibold text-[#1A1A2E] tracking-tight flex items-center gap-2">
            <span>Danh sách Chuyên đề Đánh giá</span>
          </h2>
          <span className="text-xs font-medium text-[#64647A]">
            Chọn chuyên đề phù hợp bên dưới để xem chi tiết
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {modulesList.map((mod, index) => {
            const isSelected = String(mod.id) === String(currentMod.id);
            const theme = moduleThemes[index % moduleThemes.length];
            const cleanTitle = mod.title.replace(/^Kiểm tra [^:]+:\s*/, "");

            return (
              <div
                key={String(mod.id)}
                onClick={() => setSelectedModId(String(mod.id))}
                className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between relative overflow-hidden group ${
                  isSelected 
                    ? "bg-white border-[#5052EE] shadow-[0_10px_30px_rgba(80,82,238,0.12)] ring-1 ring-[#5052EE] -translate-y-1.5 z-10" 
                    : "bg-white border-[#EAEAF4] shadow-2xs hover:shadow-md hover:border-[#6B6BFF]/40 hover:-translate-y-0.5"
                }`}
              >

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl ${theme.bg} ${theme.text} flex items-center justify-center text-xl shrink-0 border ${theme.border} shadow-2xs group-hover:scale-105 transition-transform`}>
                      {theme.icon}
                    </div>
                    <span className={`text-[11px] font-semibold px-3 py-1 rounded-full border ${
                      isSelected 
                        ? "bg-[#5052EE] text-white border-[#5052EE]" 
                        : `${theme.badgeBg} ${theme.badgeText} border-transparent`
                    }`}>
                      Module {index + 1}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-medium text-[#7878A0] uppercase tracking-wider block mb-1">
                      {mod.course_title?.split("&")[0]?.trim() || "Chuyên đề AI"}
                    </span>
                    <h3 className="text-sm font-semibold text-[#1A1A2E] leading-snug line-clamp-2 group-hover:text-[#5052EE] transition-colors">
                      {cleanTitle}
                    </h3>
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-[#F0F2F8] flex items-center justify-between text-xs font-medium text-[#64647A]">
                  <div className="flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#9090B0]">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>{mod.time_limit_minutes || 15} phút</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#5052EE] font-semibold">
                    <span>{mod.questions_count || 10} Câu hỏi</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Main Assessment Workspace & Specifications ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Area: Selected Topic Spec & Action Card (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6 w-full">
          
          <div className="bg-white rounded-2xl p-7 border border-[#EAEAF4] shadow-sm transition-all duration-300 hover:shadow-md space-y-7">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
              <div className="space-y-2 max-w-xl">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#EAF8F5] text-[#0D9488] border border-[#0D9488]/20 inline-block">
                  {assess.badge_title.split("(")[0].trim() || "Kiểm tra tổng quát"}
                </span>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#1A1A2E] tracking-tight leading-tight">
                  {assess.title}
                </h2>
                <p className="text-xs font-normal text-[#64647A]">
                  Thuộc chương trình: <span className="font-medium text-[#5052EE]">{assess.course_title}</span>
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto shrink-0">
                <button
                  type="button"
                  onClick={() => setIsSelfAssessmentOpen(true)}
                  className="px-5 py-3.5 bg-white border border-[#0D9488]/40 hover:bg-[#EAF8F5] text-[#0D9488] font-bold rounded-xl text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>🧠 Đánh giá năng lực AI (Tự luyện)</span>
                </button>

                <Link href={`/practice/quiz/question?lessonId=${currentMod.id}`} className="w-full sm:w-auto text-decoration-none shrink-0">
                  <button type="button" className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-[#4648D4] via-[#5052EE] to-[#0D9488] hover:opacity-95 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-[0_6px_20px_rgba(80,82,238,0.35)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2.5 cursor-pointer">
                    <span>🚀 Kiểm Tra Tổng Quát</span>
                    <span className="text-base">➔</span>
                  </button>
                </Link>
              </div>
            </div>

            <div className="h-[1px] w-full bg-[#F0F2F8]" />

            {/* Spec Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#EAEAF4] transition-colors hover:border-[#5052EE]/30">
                <span className="text-xs text-[#7878A0] font-normal block mb-1">Số lượng câu hỏi</span>
                <span className="text-base font-bold text-[#1A1A2E]">{assess.questions_count_text.replace(" Câu trắc nghiệm", "")} <span className="text-xs font-normal text-[#64647A]">Câu</span></span>
              </div>
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#EAEAF4] transition-colors hover:border-[#5052EE]/30">
                <span className="text-xs text-[#7878A0] font-normal block mb-1">Thời gian thi</span>
                <span className="text-base font-bold text-[#1A1A2E]">{assess.time_limit_text.replace(" Phút", "")} <span className="text-xs font-normal text-[#64647A]">Phút</span></span>
              </div>
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#EAEAF4] transition-colors hover:border-[#0D9488]/30">
                <span className="text-xs text-[#7878A0] font-normal block mb-1">Điều kiện đạt</span>
                <span className="text-base font-bold text-[#0D9488]">{assess.passing_percentage}% <span className="text-xs font-normal text-[#64647A]">Chuẩn</span></span>
              </div>
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#EAEAF4] transition-colors hover:border-[#5052EE]/30">
                <span className="text-xs text-[#7878A0] font-normal block mb-1">Cơ chế câu hỏi</span>
                <span className="text-sm font-semibold text-[#5052EE]">Xáo trộn tự động</span>
              </div>
            </div>

            <p className="text-sm text-[#374151] leading-relaxed font-normal">
              {assess.description}
            </p>
          </div>

          {/* Instructions Block */}
          <div className="bg-white rounded-2xl p-7 border border-[#EAEAF4] shadow-sm transition-all duration-300 hover:shadow-md space-y-5">
            <div className="flex items-center gap-2 border-b border-[#F0F2F8] pb-4">
              <span className="text-lg">📋</span>
              <h3 className="text-base font-semibold text-[#1A1A2E]">
                Hướng dẫn &amp; Quy định kiểm tra
              </h3>
            </div>
            
            <div className="space-y-3.5">
              {content.instructions.map((ins, idx) => (
                <div key={idx} className="flex items-start gap-3.5 text-sm text-[#475569] font-normal">
                  <span className="w-6 h-6 rounded-lg bg-[#EEF2FF] text-[#5052EE] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-[#5052EE]/20 shadow-2xs">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed flex-1 text-xs sm:text-sm text-[#374151] font-normal">{ins}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Area: AI Co-Pilot Advisory & Prerequisites (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6 w-full">
          
          {/* AI Advisory Panel */}
          <div className="bg-gradient-to-br from-[#EEF2FF] via-[#F6F6FB] to-[#EAF8F5] rounded-2xl p-6 border border-[#5052EE]/25 shadow-sm space-y-5 relative overflow-hidden group">
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4648D4] via-[#5052EE] to-[#0D9488] text-white flex items-center justify-center shadow-xs">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#5052EE] uppercase tracking-wider">Gia sư Trí tuệ AI Nova</h3>
                  <span className="text-[11px] text-[#7878A0] font-medium">Phụ trách chuyên môn</span>
                </div>
              </div>
              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white/90 text-[#0D9488] border border-[#0D9488]/20 shadow-2xs">
                AI Advisory
              </span>
            </div>

            <div className="bg-white/85 p-4.5 rounded-xl border border-[#5052EE]/15 backdrop-blur-sm text-xs sm:text-sm text-[#374151] font-normal leading-relaxed relative z-10 shadow-2xs">
              {insight.content}
            </div>

            <div className="text-[11px] font-normal text-[#7878A0] text-right italic relative z-10 pt-1">
              {insight.footer.replace("CSDL ", "")}
            </div>
          </div>

          {/* Core Prerequisites Panel */}
          <div className="bg-white rounded-2xl p-6 border border-[#EAEAF4] shadow-sm transition-all duration-300 hover:shadow-md space-y-4">
            <div className="flex items-center gap-2 border-b border-[#F0F2F8] pb-3.5">
              <span className="text-base">🎯</span>
              <h3 className="text-base font-semibold text-[#1A1A2E]">
                Kiến thức cốt lõi khuyến nghị
              </h3>
            </div>

            <p className="text-xs text-[#64647A] font-normal leading-relaxed">
              Để hoàn thành suất sắc bộ đề với điểm số trên 90%, bạn cần thành thạo các kỹ năng trọng tâm sau:
            </p>

            <div className="flex flex-col gap-3 pt-1">
              {prereq.map((p, idx) => (
                <div 
                  key={p.id || idx} 
                  className={`p-3.5 rounded-xl border ${p.bg_class || "bg-[#F8FAFC]"} ${p.border_class || "border-[#EAEAF4]"} flex items-center justify-between group transition-transform hover:-translate-y-0.5`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#5052EE]" />
                    <span className={`text-xs sm:text-sm font-semibold ${p.text_class || "text-[#374151]"}`}>{p.name}</span>
                  </div>
                  <span className="text-xs text-[#7878A0] font-medium opacity-80">✓ Khuyến khích</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      <SelfAssessmentModal
        courseId={currentMod.id}
        courseTitle={currentMod.course_title || currentMod.title}
        isOpen={isSelfAssessmentOpen}
        onClose={() => setIsSelfAssessmentOpen(false)}
      />

    </div>
  );
}
