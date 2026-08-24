"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { QuizGradingResult, QuestionResultDetail } from "../../types";

export function QuizResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const aiQuizId = searchParams.get("aiQuizId");

  // State cho đề AI
  const [aiQuiz, setAiQuiz] = useState<any>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(!!aiQuizId);
  const [expandedExplanations, setExpandedExplanations] = useState<Record<string, boolean>>({});
  const [isGeneratingSimilar, setIsGeneratingSimilar] = useState<boolean>(false);

  // State cho đề tĩnh & tự luận
  const [staticResult, setStaticResult] = useState<QuizGradingResult | null>(null);
  const [isStaticLoading, setIsStaticLoading] = useState<boolean>(!aiQuizId);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<"all" | "mc" | "essay">("all");

  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/api\/?$/, "");

  // 1. Tải kết quả bài thi AI nếu có aiQuizId
  useEffect(() => {
    if (!aiQuizId) return;

    const fetchAiQuizResult = async () => {
      setIsAiLoading(true);
      try {
        const res = await fetch(`${baseUrl}/api/student/practice/ai-quizzes/${aiQuizId}`);
        if (res.ok) {
          const json = await res.json();
          setAiQuiz(json.data);
        }
      } catch (err) {
        console.error("Lỗi khi tải kết quả thi AI:", err);
      } finally {
        setIsAiLoading(false);
      }
    };

    fetchAiQuizResult();
  }, [aiQuizId, baseUrl]);

  // 2. Tải kết quả bài thi tĩnh từ localStorage nếu không có aiQuizId
  useEffect(() => {
    if (aiQuizId) return;

    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("mindnova_last_quiz_result");
      if (stored) {
        try {
          setStaticResult(JSON.parse(stored) as QuizGradingResult);
        } catch (e) {
          console.error("Lỗi parse localStorage:", e);
        }
      }
    }
    setIsStaticLoading(false);
  }, [aiQuizId]);

  // Toggle xem giải thích chi tiết AI
  const toggleExplanation = (id: string | number) => {
    setExpandedExplanations((prev) => ({
      ...prev,
      [String(id)]: !prev[String(id)],
    }));
  };

  // Tạo 10 câu hỏi tương tự cùng chủ đề
  const handleGenerateSimilar = async () => {
    if (!aiQuiz?.topic) return;

    setIsGeneratingSimilar(true);
    try {
      const res = await fetch(`${baseUrl}/api/student/practice/generate-ai-quiz`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: aiQuiz.topic,
          title: `Luyện tập chuyên sâu: ${aiQuiz.topic}`,
          question_count: 10,
          difficulty: aiQuiz.difficulty || "Trung bình",
          question_types: ["Trắc nghiệm", "Đúng / Sai"],
          time_limit_minutes: 15,
          custom_prompt: "Tạo các bài toán biến thể nâng cao tư duy dựa trên chủ đề này",
        }),
      });

      const json = await res.json();
      if (res.ok && json.data?.id) {
        router.push(`/practice/quiz/question?aiQuizId=${json.data.id}`);
      } else {
        alert("Chưa tạo được bộ đề tương tự, vui lòng thử lại!");
      }
    } catch (e) {
      console.error(e);
      alert("Đã xảy ra lỗi khi tạo bộ đề mới.");
    } finally {
      setIsGeneratingSimilar(false);
    }
  };

  if (isAiLoading || isStaticLoading) {
    return (
      <div className="flex-1 min-h-screen bg-[#F8F9FC] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#5052EE] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-semibold text-[#64748B]">Đang tổng hợp báo cáo đánh giá năng lực từ AI...</span>
        </div>
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // ─── GIAO DIỆN 1: BÀI THI AI (AI QUIZ RESULT VIEW) ──────────────────────────
  // ═════════════════════════════════════════════════════════════════════════════
  if (aiQuizId && aiQuiz) {
    const isPassed = (aiQuiz.score || 0) >= (aiQuiz.passing_percentage || 70);

    return (
      <div className="min-h-screen bg-[#F8F9FC] py-10 px-4 sm:px-6">
        <div className="max-w-[860px] mx-auto space-y-8">

          {/* Breadcrumb */}
          <div className="flex items-center justify-between text-xs text-[#7878A0]">
            <div className="flex items-center gap-2">
              <Link href="/practice" className="hover:text-[#5052EE] transition-colors">Trung tâm thực chiến</Link>
              <span>➔</span>
              <span className="text-[#1A1A2E] font-medium">Báo cáo kết quả bài thi AI</span>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#EEF2FF] text-[#5052EE] font-semibold border border-[#5052EE]/15">
              Mã đề: #{aiQuiz.id}
            </span>
          </div>

          {/* Score Banner */}
          <div className={`p-8 rounded-3xl border shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 ${
            isPassed 
              ? "bg-gradient-to-br from-[#ECFDF5] via-white to-[#F0FDFA] border-[#10B981]/30" 
              : "bg-gradient-to-br from-[#FFF1F2] via-white to-[#FEF2F2] border-[#EF4444]/30"
          }`}>
            <div className="space-y-2 text-center md:text-left">
              <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block ${
                isPassed ? "bg-[#D1FAE5] text-[#065F46]" : "bg-[#FEE2E2] text-[#991B1B]"
              }`}>
                {isPassed ? "🎉 Đạt Chuẩn Đánh Giá" : "💪 Cần Cố Gắng Thêm"}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A2E]">{aiQuiz.title}</h1>
              <p className="text-xs sm:text-sm text-[#64647A]">
                Chủ đề: <strong className="text-[#5052EE]">{aiQuiz.topic}</strong> • Độ khó: <strong>{aiQuiz.difficulty}</strong>
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className={`text-5xl font-black ${isPassed ? "text-[#10B981]" : "text-[#EF4444]"}`}>
                {aiQuiz.score}%
              </div>
              <span className="text-xs font-semibold text-[#64647A] mt-1">
                Đúng {aiQuiz.correct_count || 0}/{aiQuiz.questions_count} câu
              </span>
            </div>
          </div>

          {/* Chi tiết từng câu hỏi */}
          <div className="space-y-5">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-base font-bold text-[#1A1A2E]">📋 Chi tiết bài làm &amp; Hướng dẫn giải</h2>
              <span className="text-xs text-[#64647A]">Tổng cộng {aiQuiz.questions_count} câu hỏi</span>
            </div>

            {aiQuiz.questions_data?.map((q: any, idx: number) => {
              const userAns = aiQuiz.user_answers?.[String(q.id)] || "";
              const rawCorrect = q.correct_answer || "";
              const type = q.type || (q.options && q.options.length > 0 ? "multiple_choice" : "essay");

              const cleanUser = userAns.trim().charAt(0).toUpperCase();
              const cleanCorrect = String(rawCorrect).trim().charAt(0).toUpperCase();

              let isCorrect = false;
              if (type === "multiple_choice" || type === "true_false") {
                isCorrect = cleanUser !== "" && cleanUser === cleanCorrect;
              } else if (type === "fill_blank") {
                const u = userAns.trim().toLowerCase();
                const c = String(rawCorrect).trim().toLowerCase();
                isCorrect = u !== "" && (u === c || c.includes(u));
              } else if (type === "essay") {
                isCorrect = userAns.trim().length >= 8;
              }

              const isExpanded = !!expandedExplanations[String(q.id || idx)];
              const isEssayOrFill = type === "essay" || type === "fill_blank" || (!q.options || q.options.length === 0);

              return (
                <div key={q.id || idx} className="p-6 rounded-2xl bg-white border border-[#EAEAF4] shadow-xs space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-sm sm:text-base font-bold text-[#1A1A2E] leading-relaxed">
                      Câu {idx + 1}: {q.question}
                    </h3>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full shrink-0 ${
                      isCorrect ? "bg-[#D1FAE5] text-[#065F46]" : "bg-[#FEE2E2] text-[#991B1B]"
                    }`}>
                      {isCorrect ? "✓ Chính xác" : "✗ Chưa đúng"}
                    </span>
                  </div>

                  {isEssayOrFill ? (
                    <div className="space-y-2 text-xs sm:text-sm">
                      <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                        <span className="font-semibold text-[#64748B] block mb-1">✍️ Bài làm của bạn:</span>
                        <p className="text-[#1A1A2E]">{userAns || <em className="text-[#94A3B8]">Bỏ trống</em>}</p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-[#D1FAE5]/40 border border-[#10B981]/30">
                        <span className="font-semibold text-[#065F46] block mb-1">🎯 Đáp số / Gợi ý chuẩn:</span>
                        <p className="text-[#065F46] font-medium">{rawCorrect}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {q.options?.map((opt: string, optIdx: number) => {
                        const optKey = opt.trim().charAt(0).toUpperCase();
                        const isChosen = cleanUser === optKey;
                        const isRightKey = cleanCorrect === optKey;

                        let style = "bg-[#F8FAFC] border-[#EAEAF4] text-[#475569]";
                        if (isRightKey) {
                          style = "bg-[#D1FAE5]/70 border-[#10B981] text-[#065F46] font-bold";
                        } else if (isChosen && !isRightKey) {
                          style = "bg-[#FEE2E2]/70 border-[#EF4444] text-[#991B1B] font-bold";
                        }

                        return (
                          <div key={optIdx} className={`p-3.5 rounded-xl border text-xs sm:text-sm flex items-center justify-between ${style}`}>
                            <span>{opt}</span>
                            {isChosen && (
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isRightKey ? "bg-[#10B981] text-white" : "bg-[#EF4444] text-white"}`}>
                                Bạn chọn
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="pt-2">
                    <div className="p-4 rounded-xl bg-[#EEF2FF]/70 border border-[#5052EE]/20 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#5052EE] flex items-center gap-1.5">
                          <span>💡</span> Hướng dẫn giải từ AI:
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleExplanation(q.id || idx)}
                          className="text-xs font-bold text-[#4648D4] hover:underline cursor-pointer flex items-center gap-1"
                        >
                          {isExpanded ? "Thu gọn ▲" : "Xem chi tiết từng bước ▼"}
                        </button>
                      </div>

                      <p className="text-xs sm:text-sm text-[#374151] leading-relaxed">
                        {q.explanation || "Áp dụng định lý và công thức đặc trưng để tìm ra đáp số."}
                      </p>

                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-[#5052EE]/15 text-xs text-[#475569] space-y-1 bg-white/80 p-3 rounded-lg">
                          <strong className="text-[#5052EE] block">📌 Phương pháp ghi nhớ:</strong>
                          <p>• Xác định điều kiện xác định và áp dụng đúng công thức tổng quát trước khi thay số.</p>
                          <p>• Thử các trường hợp đặc biệt để loại trừ nhanh các phương án sai.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Footer */}
          <div className="p-6 rounded-3xl bg-white border border-[#EAEAF4] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link href="/practice" className="w-full sm:w-auto">
              <button type="button" className="w-full sm:w-auto px-6 py-3 rounded-xl border border-[#EAEAF4] text-xs sm:text-sm font-semibold text-[#475569] hover:bg-[#F8FAFC] cursor-pointer">
                ← Về Trung tâm Đánh giá
              </button>
            </Link>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <Link href={`/practice/quiz/question?aiQuizId=${aiQuiz.id}`} className="w-full sm:w-auto">
                <button type="button" className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#EEF2FF] text-[#5052EE] border border-[#5052EE]/30 text-xs sm:text-sm font-bold hover:bg-[#E0E7FF] transition-all flex items-center justify-center gap-2 cursor-pointer">
                  <span>🔄</span>
                  <span>Làm lại đề này</span>
                </button>
              </Link>

              <button
                type="button"
                disabled={isGeneratingSimilar}
                onClick={handleGenerateSimilar}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#4648D4] via-[#5052EE] to-[#0D9488] text-white text-xs sm:text-sm font-bold shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isGeneratingSimilar ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>AI đang soạn 10 câu mới...</span>
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    <span>Luyện tiếp: Tạo 10 câu tương tự</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // ─── GIAO DIỆN 2: BÀI THI TĨNH & TỰ LUẬN KHÓA HỌC (STATIC QUIZ VIEW) ───────
  // ═════════════════════════════════════════════════════════════════════════════
  const displayData: QuizGradingResult = staticResult || {
    attempt_id: 1042,
    module_id: "67",
    score: 80,
    score_10: 8.0,
    total_score_max: 100,
    accuracy: "80%",
    passed: true,
    correct_count: 8,
    total_questions: 10,
    time_taken_formatted: "4 phút 25 giây",
    quiz_title: "Kiểm tra thực chiến",
    ai_insight: "Bạn đã nắm vững nền tảng kiến thức và trình bày bài làm rất ấn tượng!",
    ai_coach_suggestion: "Hãy mở Bảng soát bài chi tiết để đối chiếu nhận xét Rubric tự luận nhé.",
    topic_performance: [
      { id: "1", topic_title: "Kiến trúc & Cấu trúc cốt lõi", sub_title: "Nắm vững lý thuyết nền tảng", score_percentage: 100, status_label: "Tốt (100%)", status_color: "indigo" },
      { id: "2", topic_title: "Kỹ năng lập trình & Giải thuật", sub_title: "Xử lý luồng dữ liệu & logic", score_percentage: 85, status_label: "Tốt (85%)", status_color: "indigo" },
      { id: "3", topic_title: "Xử lý Tự luận & Biện luận kỹ thuật", sub_title: "Đáp ứng tiêu chí Rubric", score_percentage: 75, status_label: "Khá (75%)", status_color: "teal" },
    ],
    action_cards: [],
  };

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

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8F9FC] min-h-screen relative">
      
      {/* ─── Modal Soát bài thi tĩnh & tự luận Rubric ─── */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 animate-fadeIn">
          <div className="bg-white w-full max-w-4xl rounded-3xl border border-[#EAEAF4] shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-scaleUp">
            
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

            <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-[#F8FAFC]">
              <div className="flex flex-wrap gap-2 pb-2 border-b border-[#EAEAF4]">
                <button 
                  onClick={() => setSelectedFilter("all")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${selectedFilter === "all" ? "bg-[#5052EE] text-white" : "bg-white text-[#64647A] border border-[#EAEAF4]"}`}
                >
                  Tất cả ({questionResultsList.length > 0 ? questionResultsList.length : 10} Câu)
                </button>
                <button 
                  onClick={() => setSelectedFilter("mc")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${selectedFilter === "mc" ? "bg-[#0D9488] text-white" : "bg-white text-[#0D9488] border border-[#0D9488]/30"}`}
                >
                  🔘 Trắc nghiệm ({mcCount > 0 ? mcCount : 8} Câu)
                </button>
                <button 
                  onClick={() => setSelectedFilter("essay")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${selectedFilter === "essay" ? "bg-[#D97706] text-white" : "bg-white text-[#D97706] border border-[#D97706]/30"}`}
                >
                  ✏️ Tự luận AI Chấm ({essayCount > 0 ? essayCount : 2} Câu)
                </button>
              </div>

              <div className="space-y-5">
                {filteredQuestions.length > 0 ? (
                  filteredQuestions.map((item) => (
                    <div key={item.question_id} className="bg-white rounded-2xl p-5 border border-[#EAEAF4] shadow-2xs space-y-4 hover:border-[#5052EE]/30 transition-colors">
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

                      <h4 className="text-sm sm:text-base font-semibold text-[#1A1A2E] leading-relaxed">
                        {item.content}
                      </h4>

                      {item.type === 'essay' ? (
                        <div className="space-y-3 pt-1">
                          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#EAEAF4] space-y-1">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5052EE]">📝 Bài làm tự luận của bạn:</span>
                            <p className="text-xs sm:text-sm text-[#1A1A2E] whitespace-pre-line leading-relaxed font-normal">
                              {item.user_answer_text && item.user_answer_text.trim() !== "" 
                                ? item.user_answer_text 
                                : <span className="text-[#E11D48] italic">(Học viên chưa nhập câu trả lời)</span>
                              }
                            </p>
                          </div>

                          {item.sample_answer && (
                            <div className="p-4 rounded-xl bg-[#EAF8F5]/60 border border-[#0D9488]/20 space-y-1">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0D9488]">💡 Đáp án tham khảo mẫu:</span>
                              <p className="text-xs sm:text-sm text-[#065F46] whitespace-pre-line leading-relaxed font-normal">
                                {item.sample_answer}
                              </p>
                            </div>
                          )}

                          <div className="p-4 rounded-xl bg-gradient-to-r from-[#EEF2FF]/80 via-[#F3F4FC] to-[#EAF8F5]/80 border border-[#5052EE]/20 space-y-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5052EE] flex items-center gap-1.5">
                              <span>🤖 Nhận xét đánh giá từ Gia sư AI MindNova:</span>
                            </span>
                            <p className="text-xs sm:text-sm text-[#374151] leading-relaxed">
                              {item.feedback || "Đã ghi nhận bài làm."}
                            </p>

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
        
        {/* Header Breadcrumb */}
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

        {/* Top Score Card */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          <div className="md:col-span-7 bg-gradient-to-br from-white via-[#FAFBFF] to-[#F3F4FC] rounded-2xl border border-[#EAEAF4] shadow-2xs relative overflow-hidden p-8 flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-sm">
            <div className="absolute top-0 right-0 w-44 h-44 rounded-full bg-[#6B6BFF]/10 blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-44 h-44 rounded-full bg-[#4CD7F6]/10 blur-2xl pointer-events-none" />

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

        {/* Topic Performance */}
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

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        {/* Footer Buttons */}
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