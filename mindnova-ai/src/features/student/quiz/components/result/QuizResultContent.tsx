"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import type { QuizGradingResult, QuestionResultDetail } from "../../types";

export function QuizResultContent() {
  const [result, setResult] = useState<QuizGradingResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<"all" | "mc" | "essay">("all");

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

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#5052EE] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-semibold text-gray-600">Đang tải kết quả chấm điểm AI...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="p-8 max-w-2xl mx-auto my-12 text-center bg-white rounded-2xl border border-gray-200 shadow-sm space-y-6">
        <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-2xl mx-auto font-bold border border-amber-200">
          ⚠️
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-gray-900">Không tìm thấy dữ liệu bài thi</h2>
          <p className="text-sm text-gray-600">
            Bạn vừa truy cập trang kết quả trực tiếp hoặc chưa có lượt làm bài nào được ghi nhận.
          </p>
        </div>
        <Link href="/practice">
          <button type="button" className="px-6 py-3 bg-[#5052EE] text-white font-bold text-xs rounded-xl shadow-md hover:bg-[#383AB8] transition-all cursor-pointer">
             Quay lại Trung tâm Luyện tập &amp; Kiểm tra
          </button>
        </Link>
      </div>
    );
  }

  const displayData: QuizGradingResult = result;
  const targetModuleId = displayData.module_id || "67";
  const displayScore10 = displayData.score_10 != null 
    ? Number(displayData.score_10).toFixed(1) 
    : (Math.round((displayData.score / 100) * 100) / 10).toFixed(1);

  const questionResultsList: QuestionResultDetail[] = displayData.question_results || [];
  const mcCount = questionResultsList.filter(q => q.type === 'multiple_choice').length;
  const essayCount = questionResultsList.filter(q => q.type === 'essay').length;

  const filteredQuestions = questionResultsList.filter(q => {
    if (selectedFilter === "mc") return q.type === "multiple_choice";
    if (selectedFilter === "essay") return q.type === "essay";
    return true;
  });

  if (loading) {
    return (
      <div className="flex-1 min-h-screen bg-[#F8F9FC] flex items-center justify-center p-6">
        <div className="text-center text-[#64647A] text-sm font-medium animate-pulse">Đang tổng hợp báo cáo đánh giá năng lực từ Gia sư AI Nova...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8F9FC] min-h-screen relative">
      
      {/* ─── Interactive Review Modal / Slide-over ─── */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 animate-fadeIn">
          <div className="bg-white w-full max-w-4xl rounded-3xl border border-[#EAEAF4] shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-scaleUp">
            
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-[#EEF2FF] via-[#F3F4FC] to-[#EAF8F5] border-b border-[#EAEAF4] flex items-center justify-between shrink-0">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-white text-xs font-semibold text-[#5052EE] border border-[#5052EE]/20">
                  <span>💡 Soát Lỗi Chi Tiết từ Gia Sư AI Nova</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#1A1A2E]">Bảng Đối Chiếu Đáp Án, Bài Làm Tự Luận &amp; Nhận Xét Rubric</h3>
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
              
              {/* Category Filter Tabs */}
              <div className="flex flex-wrap gap-2 pb-2 border-b border-[#EAEAF4]">
                <button 
                  onClick={() => setSelectedFilter("all")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${selectedFilter === "all" ? "bg-[#5052EE] text-white" : "bg-white text-[#64647A] border border-[#EAEAF4]"}`}
                >
                  Tất cả ({questionResultsList.length > 0 ? questionResultsList.length : 20} Câu)
                </button>
                <button 
                  onClick={() => setSelectedFilter("mc")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${selectedFilter === "mc" ? "bg-[#0D9488] text-white" : "bg-white text-[#0D9488] border border-[#0D9488]/30"}`}
                >
                  🔘 Trắc nghiệm ({mcCount > 0 ? mcCount : 15} Câu)
                </button>
                <button 
                  onClick={() => setSelectedFilter("essay")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${selectedFilter === "essay" ? "bg-[#D97706] text-white" : "bg-white text-[#D97706] border border-[#D97706]/30"}`}
                >
                  ✏️ Tự luận AI Chấm ({essayCount > 0 ? essayCount : 5} Câu)
                </button>
              </div>

              {/* Render Question Breakdown List */}
              <div className="space-y-5">
                {filteredQuestions.length > 0 ? (
                  filteredQuestions.map((item) => (
                    <div key={item.question_id} className="bg-white rounded-2xl p-5 border border-[#EAEAF4] shadow-2xs space-y-4 hover:border-[#5052EE]/30 transition-colors">
                      
                      {/* Top Header Badge */}
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#EEF2FF] text-[#5052EE] border border-[#5052EE]/15">
                          Câu #{item.order} • {item.type === 'essay' ? '✏️ Tự luận AI' : '🔘 Trắc nghiệm'}
                        </span>
                        
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                            item.score >= (item.max_score * 0.8) 
                              ? "bg-[#EAF8F5] text-[#0D9488] border-[#0D9488]/20" 
                              : item.score > 0 
                              ? "bg-[#FEF3C7] text-[#D97706] border-[#D97706]/30"
                              : "bg-[#FFF2F2] text-[#E11D48] border-[#E11D48]/20"
                          }`}>
                            Điểm: {item.score} / {item.max_score} điểm
                          </span>
                        </div>
                      </div>

                      {/* Question Content */}
                      <h4 className="text-sm sm:text-base font-semibold text-[#1A1A2E] leading-relaxed">
                        {item.content}
                      </h4>

                      {/* Content Depending on Type */}
                      {item.type === 'essay' ? (
                        <div className="space-y-3 pt-1">
                          {/* Student Typed Answer */}
                          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#EAEAF4] space-y-1">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5052EE]">📝 Bài làm tự luận của bạn:</span>
                            <p className="text-xs sm:text-sm text-[#1A1A2E] whitespace-pre-line leading-relaxed font-normal">
                              {item.user_answer_text && item.user_answer_text.trim() !== "" 
                                ? item.user_answer_text 
                                : <span className="text-[#E11D48] italic">(Học viên chưa nhập câu trả lời)</span>
                              }
                            </p>
                          </div>

                          {/* Reference Answer */}
                          {item.sample_answer && (
                            <div className="p-4 rounded-xl bg-[#EAF8F5]/60 border border-[#0D9488]/20 space-y-1">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0D9488]">💡 Đáp án tham khảo mẫu:</span>
                              <p className="text-xs sm:text-sm text-[#065F46] whitespace-pre-line leading-relaxed font-normal">
                                {item.sample_answer}
                              </p>
                            </div>
                          )}

                          {/* AI Feedback & Rubric Point Matching */}
                          <div className="p-4 rounded-xl bg-gradient-to-r from-[#EEF2FF]/80 via-[#F3F4FC] to-[#EAF8F5]/80 border border-[#5052EE]/20 space-y-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5052EE] flex items-center gap-1.5">
                              <span>🤖 Nhận xét đánh giá từ Gia sư AI MindNova:</span>
                            </span>
                            <p className="text-xs sm:text-sm text-[#374151] leading-relaxed">
                              {item.feedback || "Đã ghi nhận bài làm."}
                            </p>

                            {/* Matched Rubric Points */}
                            {item.ai_analysis?.matched_points && item.ai_analysis.matched_points.length > 0 && (
                              <div className="pt-2 border-t border-[#EAEAF4] space-y-1">
                                <span className="text-[10px] font-bold text-[#0D9488] uppercase">✓ Ý đạt điểm (Matched Points):</span>
                                <ul className="list-disc list-inside space-y-0.5 text-xs text-[#065F46]">
                                  {item.ai_analysis.matched_points.map((pt, pIdx) => (
                                    <li key={pIdx}>{pt}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Missing Rubric Points */}
                            {item.ai_analysis?.missing_points && item.ai_analysis.missing_points.length > 0 && (
                              <div className="pt-1 space-y-1">
                                <span className="text-[10px] font-bold text-[#D97706] uppercase">⚠️ Ý cần bổ sung (Missing Points):</span>
                                <ul className="list-disc list-inside space-y-0.5 text-xs text-[#92400E]">
                                  {item.ai_analysis.missing_points.map((pt, pIdx) => (
                                    <li key={pIdx}>{pt}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        /* Multiple Choice Details */
                        <div className="space-y-3 pt-1">
                          <div className={`p-3.5 rounded-xl border text-xs sm:text-sm font-semibold flex items-center gap-2 ${
                            item.is_correct 
                              ? "bg-[#EAF8F5] border-[#0D9488]/20 text-[#0D9488]" 
                              : "bg-[#FFF2F2] border-[#E11D48]/20 text-[#E11D48]"
                          }`}>
                            <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 text-white font-bold" style={{ backgroundColor: item.is_correct ? '#10B981' : '#E11D48' }}>
                              {item.is_correct ? '✓' : '✕'}
                            </span>
                            <span>Đáp án bạn chọn: {item.user_answer_text || 'Chưa chọn'}</span>
                          </div>

                          {!item.is_correct && item.correct_answer && (
                            <div className="p-3.5 rounded-xl bg-[#EAF8F5] border border-[#0D9488]/20 text-xs sm:text-sm font-semibold text-[#0D9488]">
                              <span>Đáp án chuẩn xác từ CSDL: {item.correct_answer}</span>
                            </div>
                          )}

                          <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#EAEAF4] space-y-1.5">
                            <p className="text-[11px] font-semibold tracking-wide text-[#5052EE] uppercase flex items-center gap-1.5">
                              <span>🤖 Gia sư AI MindNova giải thích</span>
                            </p>
                            <p className="text-xs sm:text-sm text-[#374151] font-normal leading-relaxed">
                              {item.feedback || "Các yêu cầu trắc nghiệm được đánh giá theo dữ liệu chuẩn xác."}
                            </p>
                          </div>
                        </div>
                      )}

                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-[#7878A0] text-sm">
                    Không có câu hỏi nào thuộc phân loại đã chọn.
                  </div>
                )}
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
          
          {/* Score Card (7 cols) - NORMALIZED 10-POINT SCALE DISPLAY */}
          <div className="md:col-span-7 bg-gradient-to-br from-white via-[#FAFBFF] to-[#F3F4FC] rounded-2xl border border-[#EAEAF4] shadow-2xs relative overflow-hidden p-8 flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-sm">
            <div className="absolute top-0 right-0 w-44 h-44 rounded-full bg-[#6B6BFF]/10 blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-44 h-44 rounded-full bg-[#4CD7F6]/10 blur-2xl pointer-events-none" />

            {/* Status Badge */}
            <div className={`absolute top-5 right-5 px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-2xs border ${displayData.passed ? "bg-[#EAF8F5] text-[#0D9488] border-[#0D9488]/20" : "bg-[#FFF2F2] text-[#E11D48] border-[#E11D48]/20"}`}>
              <span className={`w-2 h-2 rounded-full ${displayData.passed ? "bg-[#10B981]" : "bg-[#E11D48]"} animate-pulse`} />
              {displayData.passed ? "Đạt Yêu Cầu (Passed)" : "Chưa Đạt (Need Practice)"}
            </div>

            <div className="relative z-10 mt-2 space-y-1">
              <p className="text-xs font-semibold tracking-wider text-[#7878A0] uppercase">Điểm Thành Tích Chung (Thang Điểm 10)</p>
              <div className="flex items-baseline justify-center gap-1.5 my-2">
                <span className="text-6xl sm:text-7xl font-bold bg-gradient-to-r from-[#4648D4] via-[#5052EE] to-[#0D9488] bg-clip-text text-transparent tracking-tight">
                  {displayScore10}
                </span>
                <span className="text-2xl font-semibold text-[#7878A0]">/10.0</span>
              </div>
            </div>

            <p className="text-xs text-[#64647A] mt-1">Bài thi: <span className="font-medium text-[#1A1A2E]">{displayData.quiz_title || "Kiểm tra thực chiến"}</span></p>

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
                &ldquo;{displayData.ai_insight || "Bạn đã nắm vững nền tảng kiến thức và trình bày bài làm rất ấn tượng!"}&rdquo;
              </p>
            </div>
            
            <div className="pt-4 border-t border-[#F0F2F8] mt-4 space-y-1.5">
              <p className="text-[11px] font-semibold tracking-wide text-[#7878A0] uppercase">🎯 Chiến thuật tiếp theo</p>
              <p className="text-xs sm:text-sm font-semibold text-[#5052EE] bg-[#EEF2FF]/50 p-3 rounded-xl border border-[#5052EE]/15">
                {displayData.ai_coach_suggestion || "Hãy mở Bảng soát bài chi tiết để đối chiếu nhận xét Rubric tự luận nhé."}
              </p>
            </div>
          </div>
        </div>

        {/* ─── Middle Section: Topic Performance ──────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-[#EAEAF4] shadow-2xs p-6 sm:p-7 transition-all duration-300 hover:shadow-sm">
          <div className="flex items-center justify-between border-b border-[#F0F2F8] pb-4 mb-6">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-[#1A1A2E]">Phân tích độ thành thạo theo chủ đề (Topic Mastery)</h3>
              <p className="text-xs text-[#7878A0] mt-0.5">Trí tuệ nhân tạo phân rã mức độ thông hiểu kỹ thuật từ bài thi của bạn</p>
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
                Xem lại câu hỏi &amp; Bài làm tự luận
              </h4>
              <p className="text-xs sm:text-sm text-[#64647A] leading-relaxed font-normal">
                Soát lại từng chi tiết đáp án trắc nghiệm và bài làm tự luận kèm nhận xét AI và Rubric.
              </p>
            </div>

            <div className="mt-6 pt-3 border-t border-[#F0F2F8] flex items-center justify-between text-xs font-semibold text-[#5052EE] group-hover:text-[#4648D4]">
              <span>Bắt đầu soát bài</span>
              <span className="group-hover:translate-x-1.5 transition-transform duration-200">➔</span>
            </div>
          </div>

          {/* Card 2: AI Practice Supplemental Link */}
          <Link href={`/practice/quiz/question?lessonId=${targetModuleId}`} className="text-decoration-none block">
            <div className="h-full bg-white rounded-2xl p-6 border border-[#EAEAF4] shadow-2xs transition-all duration-300 hover:shadow-md hover:border-[#0D9488]/50 hover:-translate-y-0.5 flex flex-col justify-between group cursor-pointer">
              <div>
                <div className="w-11 h-11 rounded-xl bg-[#EAF8F5] text-[#0D9488] border border-[#0D9488]/20 flex items-center justify-center font-semibold text-base group-hover:scale-105 transition-transform">
                  🤖
                </div>
                <h4 className="font-semibold text-base text-[#1A1A2E] mt-5 mb-2 group-hover:text-[#0D9488] transition-colors">
                  Luyện tập lại bộ đề thi này
                </h4>
                <p className="text-xs sm:text-sm text-[#64647A] leading-relaxed font-normal">
                  Vào lại chế độ thi kiểm nghiệm để thực hành kỹ năng làm bài tự luận và trắc nghiệm.
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
                  Quay về Trung tâm đánh giá để lựa chọn các chuyên đề khóa học khác.
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
              <span>Làm lại bài với đề mới</span>
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
