import React from "react";
import Link from "next/link";

export function QuizStartContent() {
  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto min-h-full flex flex-col gap-8">
      {/* ─── Synchronized Hero Banner matching /courses & /study-plan ─── */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#EEF2FF]/90 via-[#F6F6FB] to-[#E0F2FE]/80 border border-[#6B6BFF]/25 p-6 sm:p-8 shadow-[0_8px_30px_rgba(107,107,255,0.07)] transition-all duration-300 hover:shadow-[0_12px_36px_rgba(107,107,255,0.12)]">
        {/* Subtle animated background glow balls */}
        <div className="absolute -top-16 -right-16 w-60 h-60 rounded-full bg-[#6B6BFF]/10 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full bg-[#4CD7F6]/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#6B6BFF]/30 text-xs font-semibold text-[#4648D4] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
              <span className="w-2 h-2 rounded-full bg-[#10B981] absolute" />
              Đánh giá Năng lực Thực chiến • Module 4
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A2E] leading-tight">
              Kiểm tra thực chiến: {" "}
              <span className="bg-gradient-to-r from-[#4648D4] via-[#6063EE] to-[#4CD7F6] bg-clip-text text-transparent drop-shadow-2xs font-bold">
                Tích hợp API & AI Stream 🚀
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-[#64647A] leading-relaxed font-normal">
              Thử sức và kiểm nghiệm mức độ thông tuệ về Xử lý Route Handlers, Streaming LLM và Logic Bất đồng bộ trong Next.js 15. Hệ thống kết hợp phân tích điểm mạnh yếu theo thời gian thực cùng <span className="text-[#5052EE] font-semibold">Gia sư Nova</span>.
            </p>

            {/* Breadcrumb pill inside header */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-[#64647A]">
              <span className="font-medium bg-[#EAEAF4] px-2.5 py-1 rounded-md text-[#4F46E5]">Khóa học</span>
              <span>➔</span>
              <span className="font-medium text-[#4F46E5]">Next.js 15 AI Master</span>
              <span>➔</span>
              <span className="font-semibold text-[#0D9488] bg-[#EAF8F5] px-2.5 py-1 rounded-md border border-[#0D9488]/20">Đánh giá Năng lực</span>
            </div>
          </div>

          {/* Readiness Widget matching Course Mastery card */}
          <div className="group shrink-0 bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-[#6B6BFF]/20 flex flex-col justify-center min-w-[320px] sm:min-w-[380px] shadow-sm hover:border-[#6B6BFF]/50 hover:-translate-y-0.5 transition-all duration-300">
            <div className="w-full flex items-center justify-between gap-4 mb-3">
              <span className="text-xs font-semibold text-[#7878A0] group-hover:text-[#4648D4] transition-colors">Trạng thái học viên ↗</span>
              <span className="text-[11px] font-semibold text-[#0D9488] bg-[#CCFBF1] px-2.5 py-0.5 rounded-full border border-[#10B981]/20">
                Sẵn sàng 100%
              </span>
            </div>

            <div className="text-2xl sm:text-3xl font-bold text-[#1A1A2E] my-1 flex items-baseline justify-between gap-6">
              <div className="flex items-center gap-1.5">
                <span className="text-[#4648D4]">Level 1</span>
                <span className="text-xs font-medium text-[#9090B0]">(Thực chiến)</span>
              </div>
              <span className="text-xs font-semibold text-[#10B981] bg-[#D1FAE5] px-2 py-0.5 rounded-md">
                Active
              </span>
            </div>

            <div className="w-full h-2 bg-[#F4F4FA] rounded-full mt-2 overflow-hidden p-0.5 border border-[#EAEAF4]/80">
              <div
                className="h-full bg-gradient-to-r from-[#4CD7F6] via-[#6B6BFF] to-[#10B981] rounded-full shadow-[0_0_8px_rgba(107,107,255,0.4)] transition-all duration-1000 w-full"
              />
            </div>

            <p className="text-xs font-medium text-[#6B6BFF] mt-3 flex items-center justify-between">
              <span>🔥 Hãy tự tin chinh phục!</span>
              <span className="text-[#4648D4] font-semibold">Thời gian: 15 Phút ➔</span>
            </p>
          </div>
        </div>
      </section>

      {/* ─── Main Assessment Content Workspace ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Area: Assessment Specs & AI Insights (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6 w-full">
          
          {/* Main Specifications Card */}
          <div className="bg-white rounded-2xl p-7 shadow-sm border border-[#EAEAF4] transition-all duration-300 hover:shadow-md flex flex-col gap-7">
            
            <div className="flex items-center justify-between border-b border-[#F0F0F8] pb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#5052EE] flex items-center justify-center font-semibold border border-[#5052EE]/20">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#1A1A2E]">Thông tin bộ đánh giá năng lực</h3>
                  <p className="text-xs font-normal text-[#64647A]">Thông số cấu hình bài kiểm tra tiêu chuẩn theo khung MindNova AI</p>
                </div>
              </div>
              <span className="hidden sm:inline-block text-xs font-semibold text-[#5052EE] bg-[#EEF2FF] px-3 py-1 rounded-full border border-[#5052EE]/20">
                Chuẩn AI Kiểm định
              </span>
            </div>

            {/* 4 Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Stat 1: Số lượng câu hỏi */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-[#F8FAFC] border border-[#EAEAF4]/80 hover:border-[#5052EE]/30 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-[#EEF2FF] text-[#5052EE] flex items-center justify-center shrink-0 border border-[#5052EE]/20 shadow-2xs">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium text-[#7878A0] mb-0.5">Số lượng câu hỏi</p>
                  <p className="text-base font-bold text-[#1A1A2E]">10 Câu trắc nghiệm</p>
                </div>
              </div>

              {/* Stat 2: Thời gian */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-[#F8FAFC] border border-[#EAEAF4]/80 hover:border-[#0D9488]/30 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center shrink-0 border border-[#0284C7]/20 shadow-2xs">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium text-[#7878A0] mb-0.5">Thời gian giới hạn</p>
                  <p className="text-base font-bold text-[#1A1A2E]">15 Phút</p>
                </div>
              </div>

              {/* Stat 3: Điểm đạt */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-[#F8FAFC] border border-[#EAEAF4]/80 hover:border-[#9333EA]/30 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-[#F3E8FF] text-[#9333EA] flex items-center justify-center shrink-0 border border-[#9333EA]/20 shadow-2xs">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium text-[#7878A0] mb-0.5">Điều kiện đạt (Pass)</p>
                  <p className="text-base font-bold text-[#1A1A2E]">70% (Từ 7/10 câu)</p>
                </div>
              </div>

              {/* Stat 4: Lượt thử thách */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-[#F8FAFC] border border-[#EAEAF4]/80 hover:border-[#10B981]/30 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-[#EAF8F5] text-[#0D9488] flex items-center justify-center shrink-0 border border-[#0D9488]/20 shadow-2xs">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium text-[#7878A0] mb-0.5">Lượt làm lại</p>
                  <p className="text-base font-bold text-[#1A1A2E]">Không giới hạn</p>
                </div>
              </div>
            </div>

            {/* Instructions list */}
            <div className="pt-2 border-t border-[#F0F0F8]">
              <h4 className="text-xs font-semibold text-[#5052EE] mb-4 flex items-center gap-2">
                <span>📋 Quy chế &amp; hướng dẫn làm bài</span>
              </h4>
              <ul className="grid grid-cols-1 gap-3.5">
                <li className="flex items-start gap-3 text-xs sm:text-sm font-normal text-[#374151] p-3 rounded-xl bg-[#F8F9FC] border border-[#F0F0F8] hover:border-[#5052EE]/20 transition-colors">
                  <span className="w-5 h-5 rounded-full bg-[#D1FAE5] text-[#059669] flex items-center justify-center shrink-0 font-semibold text-xs mt-0.5">✓</span>
                  <span>Hãy kiểm tra kết nối mạng Internet ổn định và môi trường yên tĩnh trước khi nhấn nút <span className="font-semibold text-[#1A1A2E]">Bắt Đầu</span>.</span>
                </li>
                <li className="flex items-start gap-3 text-xs sm:text-sm font-normal text-[#374151] p-3 rounded-xl bg-[#F8F9FC] border border-[#F0F0F8] hover:border-[#5052EE]/20 transition-colors">
                  <span className="w-5 h-5 rounded-full bg-[#D1FAE5] text-[#059669] flex items-center justify-center shrink-0 font-semibold text-xs mt-0.5">✓</span>
                  <span>Đồng hồ bấm giờ sẽ lập tức kích hoạt đếm ngược <span className="font-semibold text-[#1A1A2E]">15 phút</span>. Bài sẽ tự động nộp khi hết thời gian.</span>
                </li>
                <li className="flex items-start gap-3 text-xs sm:text-sm font-normal text-[#374151] p-3 rounded-xl bg-[#F8F9FC] border border-[#F0F0F8] hover:border-[#5052EE]/20 transition-colors">
                  <span className="w-5 h-5 rounded-full bg-[#D1FAE5] text-[#059669] flex items-center justify-center shrink-0 font-semibold text-xs mt-0.5">✓</span>
                  <span>Bạn có thể linh hoạt nhấp bỏ qua câu hỏi khó để làm trước các câu khác và quay trở lại soát bài bất cứ lúc nào.</span>
                </li>
                <li className="flex items-start gap-3 text-xs sm:text-sm font-normal text-[#374151] p-3 rounded-xl bg-[#F8F9FC] border border-[#F0F0F8] hover:border-[#5052EE]/20 transition-colors">
                  <span className="w-5 h-5 rounded-full bg-[#D1FAE5] text-[#059669] flex items-center justify-center shrink-0 font-semibold text-xs mt-0.5">✓</span>
                  <span>Ngay sau khi nộp bài, <span className="font-semibold text-[#5052EE]">Gia sư AI Nova</span> sẽ chấm điểm và cung cấp báo cáo chi tiết giải mã nguyên nhân Đúng/Sai cho từng câu.</span>
                </li>
              </ul>
            </div>

          </div>

          {/* ─── AI Tutor Insight Box (Synchronized with Nova AI Style) ─── */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#EEF2FF] via-[#F3F4FC] to-[#EAF8F5] border border-[#5052EE]/25 p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row gap-5 items-start">
            {/* Glowing avatar icon */}
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#4648D4] via-[#5052EE] to-[#0D9488] text-white flex items-center justify-center shrink-0 shadow-[0_4px_15px_rgba(80,82,238,0.35)] relative">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
                <path d="M4 11a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7z" />
                <path d="M9 16v.01" />
                <path d="M15 16v.01" />
              </svg>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#10B981] rounded-full border-2 border-white animate-pulse" />
            </div>

            <div className="flex-1 space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-base sm:text-lg font-bold text-[#1A1A2E] flex items-center gap-2">
                  <span>💡 Lời khuyên vàng từ Gia sư AI Nova</span>
                </h4>
                <span className="text-[11px] font-semibold bg-white px-2.5 py-0.5 rounded-full text-[#0D9488] border border-[#0D9488]/20 shadow-2xs">
                  ✨ AI Tips
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#374151] font-normal leading-relaxed italic bg-white/85 backdrop-blur-md p-4 rounded-xl border border-white/70 shadow-2xs">
                &quot;Qua phân tích big-data từ các học viên lớp trước, <span className="font-semibold text-[#1A1A2E]">Câu số 4</span> và <span className="font-semibold text-[#1A1A2E]">Câu số 7</span> về chiến lược Fallback của Gemini và OpenAI là hai chốt chặn thách thức nhất! Bạn hãy đặc biệt chú ý sự khác biệt trong việc quản lý <em>ReadableStream</em> và Header timeout. Hãy giữ tâm trí tỉnh táo nhé, mình cam đoan bạn sẽ vượt qua dễ dàng!&quot;
              </p>

              <div className="flex items-center gap-2 text-[11px] font-medium text-[#5052EE]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5052EE]" />
                <span>Phóng tầm quan sát bởi trí tuệ nhân tạo MindNova Co-Pilot</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Area: Launch & History Panel (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6 w-full">
          
          {/* Action Start Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EAEAF4] transition-all duration-300 hover:shadow-md flex flex-col gap-6">
            
            {/* Styled Tech Gradient Art Banner */}
            <div className="w-full h-46 rounded-xl bg-gradient-to-br from-[#1A1A2E] via-[#2D2B60] to-[#0E4E5D] p-5 flex flex-col justify-between relative overflow-hidden shadow-inner group/banner">
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-[#4CD7F6]/20 blur-2xl group-hover/banner:scale-125 transition-transform duration-700" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-[#6B6BFF]/25 blur-2xl" />

              <div className="relative z-10 flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#4CD7F6] text-[11px] font-semibold border border-white/20">
                  AI Proctored
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
              </div>

              <div className="relative z-10 space-y-1">
                <p className="text-xs font-semibold text-[#E0F2FE]/80">Module 04 Exam</p>
                <h4 className="text-base font-bold text-white tracking-tight leading-snug">
                  Next.js 15 AI Route &amp; Streaming Master
                </h4>
              </div>

              {/* Background watermark code icon */}
              <div className="absolute right-3 bottom-3 opacity-10 pointer-events-none text-white font-mono text-6xl font-bold">
                &lt;/&gt;
              </div>
            </div>

            {/* Prerequisites Section */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-[#64647A] flex items-center gap-1.5">
                <span>⚡ Kiến thức nền tảng cần có</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-[#EEF2FF] text-[#5052EE] text-xs font-medium rounded-lg border border-[#5052EE]/15 shadow-2xs">
                  Next.js 15 App Router
                </span>
                <span className="px-3 py-1.5 bg-[#EAF8F5] text-[#0D9488] text-xs font-medium rounded-lg border border-[#0D9488]/15 shadow-2xs">
                  LLM API &amp; Stream
                </span>
                <span className="px-3 py-1.5 bg-[#FFF8EB] text-[#D97706] text-xs font-medium rounded-lg border border-[#D97706]/15 shadow-2xs">
                  Async / Await Logic
                </span>
              </div>
            </div>

            <hr className="border-[#F0F0F8]" />

            {/* Interactive Start Quiz Button */}
            <div className="space-y-4">
              <Link href="/practice/quiz/question" className="w-full block text-decoration-none">
                <button
                  type="button"
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#4648D4] via-[#5052EE] to-[#0D9488] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-3 shadow-[0_8px_25px_rgba(80,82,238,0.35)] hover:shadow-[0_12px_32px_rgba(80,82,238,0.5)] hover:-translate-y-1 transition-all duration-300 group/btn cursor-pointer"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                  <span>🚀 Bắt Đầu Làm Bài Ngay</span>
                  <span className="group-hover/btn:translate-x-1.5 transition-transform duration-300 text-lg">➔</span>
                </button>
              </Link>

              <p className="text-center text-[#64647A] text-[11px] px-2 leading-relaxed font-normal">
                Bằng việc nhấn bắt đầu, bạn xác nhận tuân thủ <br />
                <span className="text-[#5052EE] font-medium underline underline-offset-3 cursor-pointer hover:text-[#4648D4] transition-colors">
                  Quy chế Đánh giá &amp; Đạo đức Học thuật MindNova
                </span>.
              </p>
            </div>

          </div>

          {/* Recent Activity Card */}
          <div className="bg-[#F8F9FC] rounded-2xl p-6 border border-[#EAEAF4] shadow-2xs flex flex-col gap-4 transition-all duration-300 hover:border-[#5052EE]/25">
            <div className="flex items-center justify-between border-b border-[#EAEAF4] pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#EAF8F5] text-[#0D9488] flex items-center justify-center border border-[#0D9488]/20">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <h4 className="text-sm font-bold text-[#1A1A2E]">Lịch sử làm bài gần đây</h4>
              </div>
              <span className="text-[11px] font-semibold text-[#64647A] bg-[#EAEAF4] px-2.5 py-0.5 rounded-full">
                Chưa có điểm
              </span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-dashed border-[#CBD5E1] flex flex-col items-center justify-center text-center gap-2 py-6">
              <div className="w-10 h-10 rounded-full bg-[#EEF2FF] text-[#5052EE] flex items-center justify-center text-lg shadow-2xs">
                📈
              </div>
              <p className="text-xs font-semibold text-[#1A1A2E]">Bạn chưa thực hiện lượt làm bài nào</p>
              <p className="text-[11px] font-normal text-[#64647A] max-w-[220px]">
                Hãy hoàn thành bài thi đầu tiên để mở khóa báo cáo phân tích năng lực cốt lõi từ AI nhé!
              </p>
              <span className="mt-1 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF8F5] text-[#0D9488] text-[11px] font-semibold border border-[#0D9488]/20">
                🌟 Cơ hội đạt điểm tối đa trong hôm nay!
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
