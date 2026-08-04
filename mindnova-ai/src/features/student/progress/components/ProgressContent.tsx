"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRightIcon, SparklesIcon } from "./icons";

export function ProgressContent() {
  const [viewMode, setViewMode] = useState<"linear" | "module">("linear");

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto min-h-full flex flex-col gap-8">
      {/* ─── Synchronized Hero Banner matching /courses & /study-plan ─── */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#EEF2FF]/90 via-[#F6F6FB] to-[#E0F2FE]/80 border border-[#6B6BFF]/25 p-6 sm:p-8 shadow-[0_8px_30px_rgba(107,107,255,0.07)] transition-all duration-300 hover:shadow-[0_12px_36px_rgba(107,107,255,0.12)]">
        {/* Subtle animated background glow balls */}
        <div className="absolute -top-16 -right-16 w-60 h-60 rounded-full bg-[#6B6BFF]/10 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full bg-[#4CD7F6]/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            {/* Breadcrumb pill inside header */}
            <div className="flex items-center gap-2 text-xs font-medium text-[#64647A]">
              <Link href="/courses" className="hover:text-[#5052EE] transition-colors text-decoration-none font-medium">
                Khoá học của tôi
              </Link>
              <ChevronRightIcon className="w-3.5 h-3.5 text-[#A0A0C0]" />
              <span className="text-[#0D9488] font-semibold bg-[#EAF8F5] px-2.5 py-0.5 rounded-full border border-[#0D9488]/20">
                Tiến trình học tập
              </span>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#6B6BFF]/30 text-xs font-semibold text-[#4648D4] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
              <span className="w-2 h-2 rounded-full bg-[#10B981] absolute" />
              Đang học trực tuyến • Học kỳ II
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A2E] leading-tight">
              Tiến trình Học tập: {" "}
              <span className="bg-gradient-to-r from-[#4648D4] via-[#6063EE] to-[#4CD7F6] bg-clip-text text-transparent drop-shadow-2xs font-bold">
                AI &amp; Neural Networks
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-[#64647A] leading-relaxed font-normal">
              Theo dõi toàn cảnh lộ trình tiếp thu kiến thức, thời gian rèn luyện, và tốc độ nắm bắt các năng lực cốt lõi. Hệ thống được giám sát và tối ưu hóa 24/7 bởi <span className="text-[#5052EE] font-semibold">Gia sư Trí tuệ Nhân tạo Nova</span>.
            </p>
          </div>

          {/* Interactive Progress Mastery Widget matching Course Mastery card */}
          <div className="group shrink-0 bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-[#6B6BFF]/20 flex flex-col justify-center min-w-[320px] sm:min-w-[380px] shadow-sm hover:border-[#6B6BFF]/50 hover:-translate-y-0.5 transition-all duration-300">
            <div className="w-full flex items-center justify-between gap-4 mb-2">
              <span className="text-xs font-semibold text-[#7878A0] group-hover:text-[#4648D4] transition-colors">Tổng quan tiến độ ↗</span>
              <span className="text-[11px] font-semibold text-[#0D9488] bg-[#CCFBF1] px-2.5 py-0.5 rounded-full border border-[#10B981]/20">
                Vượt chỉ tiêu
              </span>
            </div>

            <div className="text-2xl sm:text-3xl font-bold text-[#1A1A2E] my-1 flex items-baseline justify-between gap-6">
              <div>
                <span className="text-[#4648D4]">65%</span>
                <span className="text-xs font-medium text-[#9090B0] ml-1.5">hoàn tất</span>
              </div>
              <span className="text-xs font-medium text-[#64647A]">
                14 / 22 Bài học
              </span>
            </div>

            <div className="w-full h-2 bg-[#F4F4FA] rounded-full mt-2.5 overflow-hidden p-0.5 border border-[#EAEAF4]/80">
              <div
                className="h-full bg-gradient-to-r from-[#4CD7F6] via-[#6B6BFF] to-[#10B981] rounded-full shadow-[0_0_8px_rgba(107,107,255,0.4)] transition-all duration-1000 group-hover:brightness-110"
                style={{ width: "65%" }}
              />
            </div>

            <p className="text-xs font-medium text-[#6B6BFF] mt-3 flex items-center justify-between">
              <span>🔥 Tiếp tục phát huy nhé!</span>
              <span className="text-[#4648D4] font-semibold">Module 2 ➔</span>
            </p>
          </div>
        </div>
      </section>

      {/* ─── 3 Key Metrics Row (Soft & Elegant Typography) ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Study Time */}
        <div className="bg-white border border-[#EAEAF4] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-5 group hover:border-[#5052EE]/40">
          <div className="w-13 h-13 rounded-2xl bg-[#EEF2FF] text-[#5052EE] flex items-center justify-center shrink-0 border border-[#5052EE]/20 shadow-2xs group-hover:scale-105 transition-transform">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-[#7878A0] mb-1">Tổng thời gian học</p>
            <div className="flex items-baseline justify-between flex-wrap gap-1">
              <span className="text-xl sm:text-2xl font-bold text-[#1A1A2E]">12.5 Giờ</span>
              <span className="text-[11px] font-semibold text-[#059669] bg-[#D1FAE5] px-2.5 py-0.5 rounded-full border border-[#059669]/20">
                ⚡ +2.4h tuần này
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Quiz Average */}
        <div className="bg-white border border-[#EAEAF4] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-5 group hover:border-[#0D9488]/40">
          <div className="w-13 h-13 rounded-2xl bg-[#EAF8F5] text-[#0D9488] flex items-center justify-center shrink-0 border border-[#0D9488]/20 shadow-2xs group-hover:scale-105 transition-transform">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 15l-2 5l9-9l-12 0l9-9l-2 5"></path>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-[#7878A0] mb-1">Điểm trung bình Quiz</p>
            <div className="flex items-baseline justify-between flex-wrap gap-1">
              <span className="text-xl sm:text-2xl font-bold text-[#1A1A2E]">88%</span>
              <span className="text-[11px] font-semibold text-[#0284C7] bg-[#E0F2FE] px-2.5 py-0.5 rounded-full border border-[#0284C7]/20">
                🏆 Top 5% lớp
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Skills Mastered */}
        <div className="bg-white border border-[#EAEAF4] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-5 group hover:border-[#9333EA]/40">
          <div className="w-13 h-13 rounded-2xl bg-[#F3E8FF] text-[#9333EA] flex items-center justify-center shrink-0 border border-[#9333EA]/20 shadow-2xs group-hover:scale-105 transition-transform">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-[#7878A0] mb-1">Kỹ năng thành thạo</p>
            <div className="flex items-baseline justify-between flex-wrap gap-1">
              <span className="text-xl sm:text-2xl font-bold text-[#1A1A2E]">4 / 10</span>
              <span className="text-[11px] font-semibold text-[#9333EA] bg-[#F3E8FF] px-2.5 py-0.5 rounded-full border border-[#9333EA]/20">
                🎯 Core Mastery
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ─── Main Roadmap & AI Co-Pilot Analytics Workspace ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Area: Visual Roadmap (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6 w-full">
          
          <div className="bg-white rounded-2xl p-7 shadow-sm border border-[#EAEAF4] transition-all duration-300 hover:shadow-md flex flex-col gap-6">
            
            {/* Roadmap Header with Interactive Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F0F0F8] pb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#5052EE] flex items-center justify-center font-semibold border border-[#5052EE]/20">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
                    <line x1="9" y1="3" x2="9" y2="18"></line>
                    <line x1="15" y1="6" x2="15" y2="21"></line>
                  </svg>
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[#1A1A2E]">Bản đồ lộ trình học tập (Roadmap)</h2>
                  <p className="text-xs font-normal text-[#64647A]">Cấu trúc chương trình học AI theo từng tầng năng lực chuyên sâu</p>
                </div>
              </div>

              {/* Interactive Segment Toggle */}
              <div className="flex items-center bg-[#F8FAFC] border border-[#EAEAF4] p-1 rounded-xl shadow-2xs">
                <button
                  type="button"
                  onClick={() => setViewMode("linear")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    viewMode === "linear"
                      ? "bg-gradient-to-r from-[#4648D4] to-[#5052EE] text-white shadow-sm font-semibold"
                      : "text-[#64647A] hover:text-[#1A1A2E] font-normal"
                  }`}
                >
                  Tuyến tính
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("module")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    viewMode === "module"
                      ? "bg-gradient-to-r from-[#4648D4] to-[#5052EE] text-white shadow-sm font-semibold"
                      : "text-[#64647A] hover:text-[#1A1A2E] font-normal"
                  }`}
                >
                  Theo Mô-đun
                </button>
              </div>
            </div>

            {/* Timeline View */}
            <div className="relative pl-2 py-2">
              {/* Vertical Connector Line */}
              <div className="absolute left-[19px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-[#10B981] via-[#5052EE] to-[#D1D5DB]" />

              <div className="flex flex-col gap-7">
                
                {/* Module 1 - Completed */}
                <div className="relative flex items-start gap-5 group">
                  <div className="relative z-10 w-8 h-8 rounded-full bg-[#D1FAE5] border-2 border-white text-[#059669] flex items-center justify-center shrink-0 shadow-sm mt-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  
                  <div className="flex-1 bg-[#F8F9FC] border border-[#EAEAF4] rounded-xl p-4 sm:p-5 hover:border-[#059669]/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-[#059669] bg-[#D1FAE5] px-2 py-0.5 rounded-md">Module 01</span>
                        <span className="text-xs font-normal text-[#64647A]">4 Bài học &bull; Đã kiểm định</span>
                      </div>
                      <h3 className="text-sm sm:text-base font-semibold text-[#1A1A2E]">Nền tảng Học Sâu &amp; Cơ lượng tử (Foundations of Deep Learning)</h3>
                      <p className="text-xs font-normal text-[#64647A]">Nắm bắt cấu trúc mạng Notron cơ sở, hàm kích hoạt và nguyên lý Tensor cơ bản.</p>
                    </div>

                    <Link href="/courses" className="shrink-0 text-decoration-none">
                      <button type="button" className="px-4 py-2 rounded-lg bg-white border border-[#EAEAF4] hover:bg-[#EEF2FF] hover:border-[#5052EE]/30 text-[#5052EE] font-semibold text-xs transition-all shadow-2xs flex items-center gap-1.5">
                        <span>🔄 Ôn tập lại</span>
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Module 2 - Active */}
                <div className="relative flex items-start gap-5">
                  <div className="relative z-10 w-8 h-8 rounded-full bg-[#EEF2FF] border-2 border-white flex items-center justify-center shrink-0 shadow-[0_0_0_4px_rgba(80,82,238,0.2)] mt-6 animate-pulse">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#5052EE]" />
                  </div>

                  <div className="flex-1 bg-gradient-to-r from-white via-[#F6F6FB] to-[#EEF2FF]/50 border-2 border-[#5052EE]/35 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold text-[#5052EE] bg-[#EEF2FF] px-2.5 py-0.5 rounded-md border border-[#5052EE]/20">Module 02 • Đang học</span>
                          <span className="text-xs font-medium text-[#D97706] bg-[#FFF8EB] px-2.5 py-0.5 rounded-md border border-[#D97706]/20">⚡ Tiếp tục ngay</span>
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-[#1A1A2E]">Giải thuật Tối ưu &amp; Mạch Qubit (Optimization &amp; Qubits)</h3>
                        <p className="text-xs font-normal text-[#64647A]">
                          Bài học hiện tại: <span className="text-[#5052EE] font-semibold">RMSprop Optimization &amp; Adam Optimizer</span>
                        </p>
                      </div>

                      <Link href="/courses" className="shrink-0 text-decoration-none">
                        <button type="button" className="px-5 py-2.5 bg-gradient-to-r from-[#4648D4] via-[#5052EE] to-[#0D9488] hover:brightness-110 text-white rounded-xl font-semibold text-xs shadow-[0_4px_15px_rgba(80,82,238,0.3)] hover:shadow-[0_6px_20px_rgba(80,82,238,0.4)] hover:-translate-y-0.5 transition-all flex items-center gap-2">
                          <span>▶ Tiếp tục học</span>
                          <span>➔</span>
                        </button>
                      </Link>
                    </div>

                    {/* Progress Bar inside Active Card */}
                    <div className="space-y-1 pt-3 border-t border-[#EAEAF4]/80">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="text-[#64647A]">Tiến trình Module</span>
                        <span className="text-[#5052EE] font-semibold">35% Hoàn thành (3 / 8 Bài)</span>
                      </div>
                      <div className="w-full h-2 bg-[#F0F0F8] rounded-full overflow-hidden p-0.5 border border-[#EAEAF4]">
                        <div className="w-[35%] h-full bg-gradient-to-r from-[#4648D4] to-[#0D9488] rounded-full shadow-xs transition-all duration-1000" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Module 3 - Locked */}
                <div className="relative flex items-start gap-5 opacity-75 hover:opacity-100 transition-opacity">
                  <div className="relative z-10 w-8 h-8 rounded-full bg-[#F3F4F6] border-2 border-white text-[#9CA3AF] flex items-center justify-center shrink-0 shadow-sm mt-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </div>

                  <div className="flex-1 bg-white border border-[#EAEAF4] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-[#64647A] bg-[#EAEAF4] px-2 py-0.5 rounded-md">Module 03</span>
                        <span className="text-xs font-normal text-[#9CA3AF]">6 Bài học &bull; Chưa mở khóa</span>
                      </div>
                      <h3 className="text-sm sm:text-base font-semibold text-[#4B5563]">Chuẩn hóa &amp; Siêu tham số (Regularization &amp; Hyperparameters)</h3>
                      <p className="text-xs font-normal text-[#9CA3AF]">Kỹ thuật Dropout, Batch Normalization và căn chỉnh tỷ lệ học thuật toán AI.</p>
                    </div>

                    <span className="shrink-0 px-3 py-1.5 rounded-lg bg-[#F8FAFC] text-[#64647A] font-medium text-xs border border-[#EAEAF4] flex items-center gap-1.5">
                      <span>🔒 Cần hoàn tất Module 02</span>
                    </span>
                  </div>
                </div>

                {/* Module 4 - Locked */}
                <div className="relative flex items-start gap-5 opacity-75 hover:opacity-100 transition-opacity">
                  <div className="relative z-10 w-8 h-8 rounded-full bg-[#F3F4F6] border-2 border-white text-[#9CA3AF] flex items-center justify-center shrink-0 shadow-sm mt-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </div>

                  <div className="flex-1 bg-white border border-[#EAEAF4] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-[#64647A] bg-[#EAEAF4] px-2 py-0.5 rounded-md">Module 04</span>
                        <span className="text-xs font-normal text-[#9CA3AF]">8 Bài học &bull; Chưa mở khóa</span>
                      </div>
                      <h3 className="text-sm sm:text-base font-semibold text-[#4B5563]">Mô hình Chuỗi &amp; Trí tuệ Tạo sinh (Sequence &amp; Generative AI)</h3>
                      <p className="text-xs font-normal text-[#9CA3AF]">Làm việc với RNNs, LSTMs, Transformers và ứng dụng LLM trong hệ thống thực tiễn.</p>
                    </div>

                    <span className="shrink-0 px-3 py-1.5 rounded-lg bg-[#F8FAFC] text-[#64647A] font-medium text-xs border border-[#EAEAF4] flex items-center gap-1.5">
                      <span>🔒 Cần hoàn tất Module 03</span>
                    </span>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>

        {/* Right Area: Nova AI Insights & Performance (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6 w-full">
          
          {/* Nova's AI Analytics & Recommendations Card */}
          <div className="bg-gradient-to-br from-white via-[#F6F6FB] to-[#EEF2FF]/70 rounded-2xl p-6 border border-[#5052EE]/25 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-5">
            
            <div className="flex items-center justify-between border-b border-[#EAEAF4] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4648D4] to-[#0D9488] text-white flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(80,82,238,0.3)]">
                  <SparklesIcon className="w-5 h-5 animate-spin-slow" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1A1A2E]">Gia sư Nova phân tích</h3>
                  <p className="text-[11px] font-normal text-[#64647A]">Cập nhật trí tuệ nhân tạo theo thời gian thực</p>
                </div>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
            </div>

            {/* Recommendation 1 */}
            <div className="bg-white p-4 rounded-xl border border-[#EAEAF4] shadow-2xs space-y-2 hover:border-[#0D9488]/30 transition-colors">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-[#0D9488] flex items-center gap-1.5">
                  <span>💡 Trọng tâm cần chú ý</span>
                </h4>
                <span className="text-[10px] bg-[#EAF8F5] text-[#0D9488] px-2 py-0.5 rounded-full font-semibold">Ưu tiên cao</span>
              </div>
              <p className="text-xs font-normal text-[#374151] leading-relaxed">
                Kiến thức về <span className="font-semibold text-[#1A1A2E]">Đạo hàm và giải thuật Lan truyền ngược (Backpropagation)</span> sẽ là xương sống cho bài trắc nghiệm tiếp theo.
              </p>
              <Link href="/courses" className="block text-decoration-none">
                <span className="text-xs font-semibold text-[#5052EE] hover:text-[#4648D4] inline-flex items-center gap-1 pt-1 cursor-pointer">
                  <span>📖 Mở bài học ôn tập ngay</span>
                  <span>➔</span>
                </span>
              </Link>
            </div>

            {/* Recommendation 2 */}
            <div className="bg-white p-4 rounded-xl border border-[#EAEAF4] shadow-2xs space-y-2 hover:border-[#5052EE]/30 transition-colors">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-[#5052EE] flex items-center gap-1.5">
                  <span>🎯 Cột mốc kế tiếp</span>
                </h4>
                <span className="text-[10px] bg-[#EEF2FF] text-[#5052EE] px-2 py-0.5 rounded-full font-semibold">+40% Ghi nhớ</span>
              </div>
              <p className="text-xs font-normal text-[#374151] leading-relaxed">
                Hoàn tất bài <span className="font-semibold text-[#1A1A2E]">Quiz Đánh giá Module 2</span> trong tuần này để kích hoạt huy hiệu <span className="text-[#9333EA] font-semibold">Quantum Pioneer</span> và duy trì phong độ!
              </p>
            </div>

            <hr className="border-[#EAEAF4]" />

            {/* Performance Stats List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#1A1A2E] tracking-wide">
                🏆 Bảng vàng thành tích cá nhân
              </h4>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#EAEAF4]/80">
                <div className="flex items-center gap-2.5">
                  <span className="text-base">🔥</span>
                  <span className="text-xs font-medium text-[#4B5563]">Chuẩn chuyên cần (Streak)</span>
                </div>
                <span className="text-xs font-semibold text-[#D97706] bg-[#FFF8EB] px-3 py-1 rounded-full border border-[#D97706]/20">
                  5 Ngày liên tiếp
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#EAEAF4]/80">
                <div className="flex items-center gap-2.5">
                  <span className="text-base">⭐</span>
                  <span className="text-xs font-medium text-[#4B5563]">Xếp loại năng lực</span>
                </div>
                <span className="text-xs font-semibold text-[#0D9488] bg-[#EAF8F5] px-3 py-1 rounded-full border border-[#0D9488]/20">
                  A+ (Top 5%)
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#EAEAF4]/80">
                <div className="flex items-center gap-2.5">
                  <span className="text-base">💎</span>
                  <span className="text-xs font-medium text-[#4B5563]">Điểm kinh nghiệm (XP)</span>
                </div>
                <span className="text-xs font-semibold text-[#5052EE] bg-[#EEF2FF] px-3 py-1 rounded-full border border-[#5052EE]/20">
                  1,250 PTS
                </span>
              </div>
            </div>

          </div>

          {/* Supportive Help Card */}
          <div className="bg-white rounded-2xl p-5 border border-[#EAEAF4] shadow-2xs flex items-center gap-4 hover:border-[#5052EE]/30 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-[#F8FAFC] text-[#5052EE] flex items-center justify-center shrink-0 border border-[#EAEAF4] text-lg">
              💬
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-[#1A1A2E] mb-0.5">Cần hỗ trợ về lộ trình?</h4>
              <p className="text-[11px] font-normal text-[#64647A] leading-relaxed">Gia sư Nova luôn trực 24/7 tại khung chat phía dưới bên phải để giải đáp mọi thắc mắc.</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
