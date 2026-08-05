"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import type { QuizGradingResult } from "../../types";

interface QuizReviewItem {
  number: number;
  question: string;
  correctAnswer: string;
  aiExplanation: string;
  category: string;
}

const REVIEW_QUESTIONS_DATA: QuizReviewItem[] = [
  {
    number: 1,
    category: "Cấu trúc Route Handlers",
    question: "Trong Next.js 15 App Router, quy ước đặt tên tệp nào sau đây được bắt buộc sử dụng để định nghĩa một Route Handler chịu trách nhiệm xử lý các HTTP request (GET, POST)?",
    correctAnswer: "A. route.ts hoặc route.js đặt bên trong một thư mục thuộc app/",
    aiExplanation: "Trong Next.js 15 App Router, tệp route.ts được thiết kế riêng cho các API endpoint dạng RESTful hoặc Webhooks. Bạn không thể đặt trùng route.ts và page.ts trong cùng một cấp thư mục."
  },
  {
    number: 2,
    category: "Cơ chế Caching",
    question: "Sự khác biệt căn bản về cơ chế bộ nhớ đệm (caching) giữa hàm export async function GET() và POST() trong Route Handlers là gì?",
    correctAnswer: "A. GET có thể được cache tùy thuộc vào dynamic config, trong khi POST luôn luôn thực thi theo thời gian thực (opt-out of cache)",
    aiExplanation: "Các yêu cầu POST mang tính chất biến đổi dữ liệu (mutation) nên mặc định Next.js sẽ không bao giờ lưu đệm (no-cache) nhằm đảm bảo dữ liệu mới nhất được ghi nhận."
  },
  {
    number: 3,
    category: "Tham số Động (Params)",
    question: "Từ Next.js 15 trở đi, tham số động (dynamic routing parameters) trong các Route Handlers như { params } có sự thay đổi mang tính cốt lõi nào khi truy xuất?",
    correctAnswer: "A. params là một Promise bất đồng bộ và bắt buộc phải dùng await trước khi trích xuất giá trị id",
    aiExplanation: "Next.js 15 đã chuyển dịch params từ đối tượng đồng bộ sang Promise bất đồng bộ nhằm tối ưu hóa tiến trình serverless và khả năng chuẩn bị dữ liệu song song."
  },
  {
    number: 4,
    category: "✨ AI Golden Tip • Stream Fallback",
    question: "Trong chiến lược Fallback giữa Google Gemini và OpenAI, khi dòng truyền streaming từ một nhà cung cấp gặp trở ngại kỹ thuật, cách quản lý đối tượng ReadableStream nào dưới đây đảm bảo không phá vỡ kết nối hiện tại của Client?",
    correctAnswer: "A. Sử dụng TransformStream để bọc luồng dữ liệu; khi phát hiện lỗi nghẽn mạch, ngay lập tức đóng Reader hiện tại và chuyển (pipe) sang luồng ReadableStream của AI Provider dự phòng",
    aiExplanation: "Bằng cách sử dụng TransformStream làm trung gian, client chỉ nhìn thấy một dòng chuỗi vô vần xuyên suốt. Kỹ thuật này ngăn chặn lỗi HTTP 500 và giúp trải nghiệm học viên mượt mà tuyệt hảo!"
  },
  {
    number: 5,
    category: "Cơ chế Streaming LLM",
    question: "Để khởi tạo một luồng phát tín hiệu thời gian thực (Real-time AI Stream) trong Next.js Route Handlers, đối tượng trả về chuẩn hóa cần tuân thủ cấu trúc nào?",
    correctAnswer: 'A. new Response(readableStream, { headers: { "Content-Type": "text/event-stream" } })',
    aiExplanation: "Định dạng Server-Sent Events (SSE) yêu cầu kiểu nội dung text/event-stream kèm theo luồng dữ liệu nhị phân ReadableStream để trình duyệt liên tục lắng nghe token chớp nhoáng."
  },
  {
    number: 6,
    category: "Môi trường Runtime",
    question: "Trong cấu hình tệp Route Handlers cho các dịch vụ AI Stream tốc độ cực cao, khai báo export const runtime = 'edge' mang đến sức mạnh thực thi nào?",
    correctAnswer: "A. Thực thi trên mạng lưới Edge của Cloudflare/Vercel với độ trễ khởi động (cold start) gần như bằng 0 và sử dụng bộ API chuẩn Web V8",
    aiExplanation: "Edge Runtime gạt bỏ những mô-đun Node.js cồng kềnh, đưa luồng tính toán đến trung tâm dữ liệu gần học viên nhất, giảm tốc độ khởi tạo xuống dưới vài milli-giây."
  },
  {
    number: 7,
    category: "✨ AI Golden Tip • Timeout Fallback",
    question: "Để kiểm soát hiệu quả vấn đề treo kết nối khi LLM Provider không phản hồi (Header Timeout Fallback), kỹ thuật lập trình bất đồng bộ nào nên được gắn vào cấu hình Fetch API?",
    correctAnswer: "A. Tạo đối tượng AbortController kết hợp setTimeout để tự động kích hoạt abort signal sau số giây quy định, mở đường gọi fallback lập tức",
    aiExplanation: "Nếu máy chủ AI Provider bị nghẽn lệnh không gửi header về trong hạn định, tín hiệu signal từ AbortController sẽ chủ động dập gắt luồng gọi cũ, giúp hệ thống không bị treo vô thời hạn."
  },
  {
    number: 8,
    category: "Vercel AI SDK",
    question: "Khi sử dụng thư viện chuyên dụng Vercel AI SDK (hoặc @ai-sdk/react) kết hợp cùng Next.js 15, hàm phương thức nào có nhiệm vụ đóng gói đầu ra của LLM thành một chuỗi dữ liệu Stream hợp lệ để trả về cho Custom Hook useChat()?",
    correctAnswer: "A. result.toDataStreamResponse() hoặc streamText(...)",
    aiExplanation: "Các phương thức như streamText hoặc toDataStreamResponse tự động định dạng luồng token thành giao thức tương thích trực tiếp với React Custom Hook useChat() ở phía client."
  },
  {
    number: 9,
    category: "Bảo mật & Rate Limiting",
    question: "Để bảo vệ các điểm truy cập AI Route Handlers trong Next.js khỏi tình trạng spam requests và khai thác token tài khoản trái phép, lớp chắn bảo mật nào nên được đặt ở tiền tuyến?",
    correctAnswer: "A. Next.js Middleware kết hợp kiểm soát Rate Limiting và Bearer Token Authentication",
    aiExplanation: "Middleware thực thi ngay tại viền mạng trước khi request chạm vào Route Handler, cho phép từ chối ngay lập tức các IP có tần suất truy cập đáng ngờ."
  },
  {
    number: 10,
    category: "Tối ưu Tài nguyên Server",
    question: "Khi người dùng vô tình bấm thả hoặc đóng thẻ tab trình duyệt trong khi dòng AI Streaming vẫn đang cuồn cuộn chảy trả về, phương pháp tối ưu resource nào trong Route Handlers giúp ngắt tiến trình LLM backend tức thời?",
    correctAnswer: "A. Lắng nghe sự kiện request.signal (AbortSignal) từ HTTP request gốc, nếu client ngắt kết nối thì tự động hủy tiến trình phát streaming",
    aiExplanation: "Việc ngắt luồng ngay khi Client rớt mạng giúp hệ thống tiết kiệm triệt để lượng Token tiêu hao và giảm chi phí hạ tầng Server cho đơn vị cung cấp dịch vụ LLM."
  }
];

export function QuizResultContent() {
  const [result, setResult] = useState<QuizGradingResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string>("all");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("mindnova_last_quiz_result");
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as QuizGradingResult;
          setResult(parsed);
        } catch (e) {
          console.error("Lỗi khi đọc kết quả thi:", e);
        }
      }
    }
    setLoading(false);
  }, []);

  const displayData: QuizGradingResult = result || {
    attempt_id: 1042,
    module_id: "mod3",
    score: 80,
    total_score_max: 100,
    accuracy: "80%",
    passed: true,
    correct_count: 8,
    total_questions: 10,
    time_taken_formatted: "4 phút 25 giây",
    quiz_title: "Kiểm tra Thực chiến: Tích hợp API & AI Stream 🚀",
    ai_insight: "Xuất sắc! Bạn nắm giữ tư duy kiến trúc Route Handlers và App Router cực kỳ vững chắc. Quản lý luồng ReadableStream và kỹ thuật chuyển qua lại giữa Gemini/OpenAI tại câu 4 và 7 được áp dụng chính xác.",
    ai_coach_suggestion: "Năng lực đạt điểm tối ưu. Tự tin chinh phục Module tiếp theo về Security & Middleware!",
    topic_performance: [
      { id: "1", topic_title: "Cấu trúc Route Handlers & App Router", sub_title: "Khái niệm cơ bản & Quy ước tệp route.ts", score_percentage: 100, status_label: "Tốt (100%)", status_color: "indigo" },
      { id: "2", topic_title: "Cơ chế Streaming LLM & ReadableStream", sub_title: "Xử lý luồng dữ liệu thời gian thực từ AI Provider", score_percentage: 85, status_label: "Tốt (85%)", status_color: "indigo" },
      { id: "3", topic_title: "Xử lý Lỗi & Timeout Fallback (Q4, Q7)", sub_title: "Quản lý AbortController & tự động chuyển mạch Provider", score_percentage: 75, status_label: "Khá (75%)", status_color: "teal" },
    ],
    action_cards: [
      { id: "a1", title: "Xem lại câu hỏi trắc nghiệm", description: "Soát lại từng chi tiết đáp án và lời giải trình tường tận của Gia sư AI MindNova cho 10 câu thi.", action_text: "Bắt đầu soát bài", icon_type: "review" },
      { id: "a2", title: "Luyện tập bổ trợ AI", description: "Vào lại chế độ kiểm nghiệm với bộ đề tự động xáo trộn ngẫu nhiên 100% câu hỏi và đáp án.", action_text: "Luyện tập thêm", icon_type: "practice" },
      { id: "a3", title: "Chuyển sang Module khác", description: "Tiến thẳng về danh mục 4 Chủ đề Thực chiến (Mạng thần kinh, React 19, Security) để bứt phá.", action_text: "Tiếp tục hành trình", icon_type: "continue" },
    ],
  };

  const targetModuleId = displayData.module_id || "mod3";

  if (loading) {
    return (
      <div className="flex-1 min-h-screen bg-[#F8F9FC] flex items-center justify-center p-6">
        <div className="text-center text-[#64647A] text-sm font-medium animate-pulse">Đang tổng hợp báo cáo đánh giá năng lực từ AI...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8F9FC] min-h-screen relative">
      {/* ─── Interactive Review Modal / Slide-over ─── */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 animate-fadeIn">
          <div className="bg-white w-full max-w-4xl rounded-2xl border border-[#EAEAF4] shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-scaleUp">
            
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-[#EEF2FF] via-[#F3F4FC] to-[#EAF8F5] border-b border-[#EAEAF4] flex items-center justify-between shrink-0">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-white text-xs font-semibold text-[#5052EE] border border-[#5052EE]/20">
                  <span>💡 Soát Lỗi Chi Tiết từ Gia Sư AI Nova</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#1A1A2E]">Bảng Đối Chiếu Đáp Án &amp; Lời Giải Thích Kỹ Thuật</h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="w-10 h-10 rounded-xl bg-white text-[#7878A0] hover:text-[#1A1A2E] hover:bg-[#F0F2F8] border border-[#EAEAF4] flex items-center justify-center font-semibold text-lg transition-colors cursor-pointer"
                title="Đóng cửa sổ"
              >
                ✕
              </button>
            </div>

            {/* Modal Content Scrollable Area */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-[#F8FAFC]">
              <div className="flex flex-wrap gap-2 pb-2 border-b border-[#EAEAF4]">
                <button 
                  onClick={() => setSelectedTopicFilter("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${selectedTopicFilter === "all" ? "bg-[#5052EE] text-white" : "bg-white text-[#64647A] border border-[#EAEAF4]"}`}
                >
                  Tất cả (10 Câu)
                </button>
                <button 
                  onClick={() => setSelectedTopicFilter("ai-tip")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${selectedTopicFilter === "ai-tip" ? "bg-[#0D9488] text-white" : "bg-white text-[#0D9488] border border-[#0D9488]/30"}`}
                >
                  ✨ Câu hỏi AI Golden Tips (Q4, Q7)
                </button>
              </div>

              <div className="space-y-5">
                {REVIEW_QUESTIONS_DATA
                  .filter(item => selectedTopicFilter === "all" ? true : (item.number === 4 || item.number === 7))
                  .map((item) => (
                    <div key={item.number} className="bg-white rounded-xl p-5 border border-[#EAEAF4] shadow-2xs space-y-4 hover:border-[#5052EE]/30 transition-colors">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#EEF2FF] text-[#5052EE] border border-[#5052EE]/15">
                          Câu #{item.number} • {item.category}
                        </span>
                        <span className="text-xs font-medium text-[#059669] bg-[#D1FAE5] px-2.5 py-0.5 rounded-md flex items-center gap-1">
                          ✓ Lời giải chuẩn xác
                        </span>
                      </div>

                      <h4 className="text-sm sm:text-base font-semibold text-[#1A1A2E] leading-relaxed">
                        {item.question}
                      </h4>

                      <div className="p-3.5 rounded-lg bg-[#EAF8F5]/60 border border-[#0D9488]/20 text-xs sm:text-sm font-semibold text-[#0D9488] flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#10B981] text-white flex items-center justify-center text-xs shrink-0">✓</span>
                        <span>{item.correctAnswer}</span>
                      </div>

                      <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#EAEAF4] space-y-1.5">
                        <p className="text-[11px] font-semibold tracking-wide text-[#5052EE] uppercase flex items-center gap-1.5">
                          <span>🤖 Gia sư AI MindNova giải mã</span>
                        </p>
                        <p className="text-xs sm:text-sm text-[#374151] font-normal leading-relaxed">
                          {item.aiExplanation}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white border-t border-[#EAEAF4] flex items-center justify-end gap-3 shrink-0">
              <button 
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="px-6 py-2.5 bg-gradient-to-r from-[#4648D4] via-[#5052EE] to-[#0D9488] text-white rounded-xl font-semibold text-xs sm:text-sm hover:opacity-95 transition-all shadow-2xs cursor-pointer"
              >
                Đã hiểu rõ &amp; Đóng bảng soát bài
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1020px] mx-auto px-6 py-8 pb-24 space-y-7">
        
        {/* Header navigation breadcrumb */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#7878A0]">
            <Link href="/practice" className="hover:text-[#5052EE] transition-colors text-decoration-none">Trung tâm thực chiến</Link>
            <span>➔</span>
            <span className="text-[#1A1A2E] font-medium">Báo cáo kiểm tra Năng lực AI</span>
          </div>
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#EEF2FF] text-[#5052EE] border border-[#5052EE]/15">
            Mã định danh lượt thi: #{displayData.attempt_id}
          </span>
        </div>

        {/* ─── Top Section: Score & AI Insight ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* Score Card (7 cols) */}
          <div className="md:col-span-7 bg-gradient-to-br from-white via-[#FAFBFF] to-[#F3F4FC] rounded-2xl border border-[#EAEAF4] shadow-2xs relative overflow-hidden p-8 flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-sm">
            <div className="absolute top-0 right-0 w-44 h-44 rounded-full bg-[#6B6BFF]/10 blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-44 h-44 rounded-full bg-[#4CD7F6]/10 blur-2xl pointer-events-none" />

            {/* Status Badge */}
            <div className={`absolute top-5 right-5 px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-2xs border ${displayData.passed ? "bg-[#EAF8F5] text-[#0D9488] border-[#0D9488]/20" : "bg-[#FFF2F2] text-[#E11D48] border-[#E11D48]/20"}`}>
              <span className={`w-2 h-2 rounded-full ${displayData.passed ? "bg-[#10B981]" : "bg-[#E11D48]"} animate-pulse`} />
              {displayData.passed ? "Đạt Yêu Cầu (Passed)" : "Chưa Đạt (Need Practice)"}
            </div>

            <div className="relative z-10 mt-2 space-y-1">
              <p className="text-xs font-semibold tracking-wider text-[#7878A0] uppercase">Điểm Thành Tích Chung</p>
              <div className="flex items-baseline justify-center gap-1.5 my-2">
                <span className="text-6xl sm:text-7xl font-bold bg-gradient-to-r from-[#4648D4] via-[#5052EE] to-[#0D9488] bg-clip-text text-transparent tracking-tight">
                  {displayData.score}
                </span>
                <span className="text-2xl font-semibold text-[#7878A0]">/100</span>
              </div>
            </div>

            <p className="text-xs text-[#64647A] mt-1">Bài thi: <span className="font-medium text-[#1A1A2E]">{displayData.quiz_title || "Kiểm tra thực chiến: Tích hợp API & AI Stream"}</span></p>

            <div className="relative z-10 grid grid-cols-2 gap-8 w-full max-w-xs mt-7 pt-5 border-t border-[#EAEAF4]/80">
              <div>
                <p className="text-xs font-normal text-[#7878A0] mb-1">Tỷ lệ chính xác</p>
                <p className="text-sm sm:text-base font-semibold text-[#1A1A2E] flex items-center justify-center gap-1">
                  <span className="text-[#059669]">✓ {displayData.correct_count}</span> / {displayData.total_questions} Câu
                </p>
              </div>
              <div className="border-l border-[#EAEAF4]">
                <p className="text-xs font-normal text-[#7878A0] mb-1">Thời gian làm bài</p>
                <p className="text-sm sm:text-base font-semibold text-[#1A1A2E]">
                  {displayData.time_taken_formatted || `${displayData.time_taken_seconds || 180} giây`}
                </p>
              </div>
            </div>
          </div>

          {/* AI Insight Card (5 cols) */}
          <div className="md:col-span-5 bg-white rounded-2xl border border-[#EAEAF4] shadow-2xs p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-sm hover:border-[#5052EE]/30">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#F0F2F8] pb-3.5">
                <div className="flex items-center gap-2.5 text-[#5052EE]">
                  <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] flex items-center justify-center font-semibold text-sm">✨</div>
                  <h3 className="font-semibold text-base text-[#1A1A2E]">Nhận xét từ Gia sư AI</h3>
                </div>
                <span className="text-[11px] bg-[#EAF8F5] text-[#0D9488] px-2.5 py-0.5 rounded-full font-medium border border-[#0D9488]/15">
                  MindNova Co-Pilot
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#374151] leading-relaxed font-normal bg-[#F8FAFC] p-4 rounded-xl border border-[#EAEAF4]/60">
                &ldquo;{displayData.ai_insight || "Bạn đã nắm vững nền tảng Route Handlers cơ bản trong Next.js 15, khả năng xử lý Stream rất ấn tượng!"}&rdquo;
              </p>
            </div>
            
            <div className="pt-4 border-t border-[#F0F2F8] mt-4 space-y-1.5">
              <p className="text-[11px] font-semibold tracking-wide text-[#7878A0] uppercase">🎯 Chiến thuật tiếp theo</p>
              <p className="text-xs sm:text-sm font-semibold text-[#5052EE] bg-[#EEF2FF]/50 p-3 rounded-xl border border-[#5052EE]/15">
                {displayData.ai_coach_suggestion || "Hãy tập trung kiểm chứng sâu hơn về xử lý lỗi Header Timeout nhé."}
              </p>
            </div>
          </div>
        </div>

        {/* ─── Middle Section: Topic Performance ──────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-[#EAEAF4] shadow-2xs p-6 sm:p-7 transition-all duration-300 hover:shadow-sm">
          <div className="flex items-center justify-between border-b border-[#F0F2F8] pb-4 mb-6">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-[#1A1A2E]">Phân tích độ thành thạo theo chủ đề (Topic Mastery)</h3>
              <p className="text-xs text-[#7878A0] mt-0.5">Trí tuệ nhân tạo phân rã mức độ thông hiểu kỹ thuật từ 10 câu hỏi của bạn</p>
            </div>
            <span className="text-xs text-[#5052EE] bg-[#EEF2FF]/60 px-3 py-1 rounded-full font-medium hidden sm:inline-block border border-[#5052EE]/15">
              3 Chủ đề cốt lõi
            </span>
          </div>
          
          <div className="flex flex-col gap-6">
            {(displayData.topic_performance || []).map((t, idx) => (
              <div key={t.id || idx} className="p-4 rounded-xl bg-[#F8FAFC] border border-[#EAEAF4]/70 hover:border-[#5052EE]/20 transition-colors space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-semibold text-sm sm:text-base text-[#1A1A2E]">{t.topic_title}</h4>
                    <p className="text-xs text-[#64647A] mt-0.5">{t.sub_title}</p>
                  </div>
                  <span className={`self-start sm:self-center px-3 py-1 rounded-full text-xs font-medium border ${t.score_percentage >= 80 ? "bg-[#EAF8F5] text-[#0D9488] border-[#0D9488]/20" : t.score_percentage >= 60 ? "bg-[#EEF2FF] text-[#5052EE] border-[#5052EE]/20" : "bg-[#FFF2F2] text-[#E11D48] border-[#E11D48]/20"}`}>
                    {t.status_label}
                  </span>
                </div>
                
                <div className="h-2 w-full bg-[#EAEAF4] rounded-full overflow-hidden p-0.5">
                  <div 
                    className={`h-full rounded-full transition-all duration-700 ${t.score_percentage >= 80 ? "bg-gradient-to-r from-[#10B981] to-[#0D9488]" : t.score_percentage >= 60 ? "bg-gradient-to-r from-[#4CD7F6] via-[#6B6BFF] to-[#5052EE]" : "bg-gradient-to-r from-[#F43F5E] to-[#E11D48]"}`}
                    style={{ width: `${t.score_percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Bottom Section: Fully Interactive Action Cards ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Open Answer Review Modal */}
          <div 
            onClick={() => setIsReviewModalOpen(true)}
            className="bg-white rounded-2xl p-6 border border-[#EAEAF4] shadow-2xs transition-all duration-300 hover:shadow-md hover:border-[#5052EE]/50 hover:-translate-y-0.5 flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-[#FFF2F2] text-[#E11D48] border border-[#E11D48]/20 flex items-center justify-center font-semibold text-base group-hover:scale-105 transition-transform">
                🔍
              </div>
              <h4 className="font-semibold text-base text-[#1A1A2E] mt-5 mb-2 group-hover:text-[#5052EE] transition-colors">
                Xem lại câu hỏi trắc nghiệm
              </h4>
              <p className="text-xs sm:text-sm text-[#64647A] leading-relaxed font-normal">
                Soát lại từng chi tiết đáp án và lời giải trình tường tận của Gia sư AI MindNova cho 10 câu thi.
              </p>
            </div>

            <div className="mt-6 pt-3 border-t border-[#F0F2F8] flex items-center justify-between text-xs font-semibold text-[#5052EE] group-hover:text-[#4648D4]">
              <span>Bắt đầu soát bài</span>
              <span className="group-hover:translate-x-1.5 transition-transform duration-200">➔</span>
            </div>
          </div>

          {/* Card 2: AI Practice Supplemental Link (Retake with randomized shuffled options) */}
          <Link href={`/practice/quiz/question?lessonId=${targetModuleId}`} className="text-decoration-none block">
            <div className="h-full bg-white rounded-2xl p-6 border border-[#EAEAF4] shadow-2xs transition-all duration-300 hover:shadow-md hover:border-[#0D9488]/50 hover:-translate-y-0.5 flex flex-col justify-between group cursor-pointer">
              <div>
                <div className="w-11 h-11 rounded-xl bg-[#EAF8F5] text-[#0D9488] border border-[#0D9488]/20 flex items-center justify-center font-semibold text-base group-hover:scale-105 transition-transform">
                  🤖
                </div>
                <h4 className="font-semibold text-base text-[#1A1A2E] mt-5 mb-2 group-hover:text-[#0D9488] transition-colors">
                  Luyện tập lại với đề xáo trộn mới
                </h4>
                <p className="text-xs sm:text-sm text-[#64647A] leading-relaxed font-normal">
                  Vào lại chế độ kiểm nghiệm với bộ đề tự động xáo trộn ngẫu nhiên 100% thứ tự câu và đáp án A/B/C/D.
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-[#F0F2F8] flex items-center justify-between text-xs font-semibold text-[#0D9488] group-hover:text-[#059669]">
                <span>Luyện tập thêm</span>
                <span className="group-hover:translate-x-1.5 transition-transform duration-200">➔</span>
              </div>
            </div>
          </Link>

          {/* Card 3: Switch to Other Modules on Practice Page */}
          <Link href="/practice" className="text-decoration-none block">
            <div className="h-full bg-white rounded-2xl p-6 border border-[#EAEAF4] shadow-2xs transition-all duration-300 hover:shadow-md hover:border-[#5052EE]/50 hover:-translate-y-0.5 flex flex-col justify-between group cursor-pointer">
              <div>
                <div className="w-11 h-11 rounded-xl bg-[#EEF2FF] text-[#5052EE] border border-[#5052EE]/20 flex items-center justify-center font-semibold text-base group-hover:scale-105 transition-transform">
                  ⚡
                </div>
                <h4 className="font-semibold text-base text-[#1A1A2E] mt-5 mb-2 group-hover:text-[#5052EE] transition-colors">
                  Chuyển sang Module chủ đề khác
                </h4>
                <p className="text-xs sm:text-sm text-[#64647A] leading-relaxed font-normal">
                  Tiến thẳng về danh mục 4 Chủ đề Thực chiến (Mạng thần kinh, React 19, Security) để bứt phá.
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-[#F0F2F8] flex items-center justify-between text-xs font-semibold text-[#5052EE] group-hover:text-[#4648D4]">
                <span>Tiếp tục hành trình</span>
                <span className="group-hover:translate-x-1.5 transition-transform duration-200">➔</span>
              </div>
            </div>
          </Link>

        </div>

        {/* ─── Footer Buttons ────────────────────────────────────────────────────── */}
        <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
          <Link href="/practice" className="text-decoration-none">
            <button type="button" className="px-7 py-3 bg-gradient-to-r from-[#4648D4] via-[#5052EE] to-[#0D9488] hover:opacity-95 text-white rounded-xl font-semibold text-xs sm:text-sm shadow-[0_6px_20px_rgba(80,82,238,0.3)] hover:-translate-y-0.5 transition-all cursor-pointer flex items-center gap-2">
              <span>➔</span>
              <span>Quay lại Trung tâm đánh giá</span>
            </button>
          </Link>

          <Link href={`/practice/quiz/question?lessonId=${targetModuleId}`} className="text-decoration-none">
            <button type="button" className="px-7 py-3 bg-white border border-[#EAEAF4] hover:bg-[#F8FAFC] text-[#374151] rounded-xl font-medium text-xs sm:text-sm shadow-2xs hover:border-[#5052EE]/30 transition-all cursor-pointer flex items-center gap-2">
              <span>🔄</span>
              <span>Làm lại bài với đề mới (Randomize)</span>
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
