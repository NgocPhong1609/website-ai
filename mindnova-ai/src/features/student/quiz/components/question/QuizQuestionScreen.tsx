"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useGetStudentQuiz, useSubmitQuiz } from "../../api";
import type { QuizGradingResult } from "../../types";

interface QuizQuestionScreenProps {
  lessonId: string;
  courseTitle?: string;
}

export function QuizQuestionScreen({ lessonId, courseTitle = "Chuyên đề Kỹ thuật AI & Fullstack" }: QuizQuestionScreenProps) {
  const router = useRouter();
  const { data: quiz, isLoading, isError } = useGetStudentQuiz(lessonId);
  const { mutateAsync: submitQuiz, isPending: isSubmitting } = useSubmitQuiz();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  // Store all selected answers mapped by Question ID (as strings to guarantee strict comparison accuracy)
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Initialize timer once quiz data loads
  useEffect(() => {
    if (quiz && timeRemaining === 0 && !isFinished) {
      setTimeRemaining(quiz.time_limit_minutes * 60);
    }
  }, [quiz, timeRemaining, isFinished]);

  const handleSubmit = async (finalAnswers: Record<string, string | number> = answers) => {
    if (!quiz || isSubmitting) return;
    try {
      const timeTaken = quiz.time_limit_minutes * 60 - timeRemaining;
      const res: QuizGradingResult = await submitQuiz({
        lessonId,
        answers: finalAnswers,
        time_taken_seconds: timeTaken > 0 ? timeTaken : 180,
      });
      
      // Persist grading report for seamless SPA transition to result dashboard
      if (typeof window !== "undefined") {
        localStorage.setItem("mindnova_last_quiz_result", JSON.stringify(res));
      }

      setIsFinished(true);
      router.push("/practice/quiz/result");
    } catch (error) {
      console.error("Lỗi khi nộp bài:", error);
      setErrorNotice("Đã xảy ra sự cố khi kết nối đến API nộp bài. Vui lòng thử lại!");
    }
  };

  // Timer countdown
  useEffect(() => {
    if (timeRemaining <= 0 || isFinished || !quiz) return;
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(answers);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeRemaining, isFinished, quiz, answers]);

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Guarantee string saving for consistent exact matching across render cycles
  const handleSelectAnswer = (questionId: string | number, answerId: string | number) => {
    setAnswers((prev) => ({ ...prev, [String(questionId)]: String(answerId) }));
  };

  const handleUserInitiatedSubmit = () => {
    if (!quiz) return;
    const currentAnswered = Object.keys(answers).filter(key => answers[key] != null && answers[key] !== "").length;

    if (currentAnswered === 0) {
      if (!confirm("⚠️ Bạn chưa chọn bất kỳ câu trả lời nào! Bạn có chắc chắn muốn nộp bài trắng (nhận 0 điểm) ngay bây giờ không?")) {
        return;
      }
    } else if (currentAnswered < quiz.questions.length) {
      if (!confirm(`⚠️ Bạn mới trả lời ${currentAnswered}/${quiz.questions.length} câu hỏi. Bạn có chắc chắn muốn kết thúc và nộp bài ngay không?`)) {
        return;
      }
    } else if (currentIndex < quiz.questions.length - 1) {
      if (!confirm(`✨ Bạn đã trả lời trọn vẹn ${quiz.questions.length}/${quiz.questions.length} câu! Bạn có xác nhận muốn nộp bài chấm điểm ngay không?`)) {
        return;
      }
    }
    handleSubmit(answers);
  };

  const handleNext = () => {
    if (quiz && currentIndex < quiz.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleUserInitiatedSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex flex-col justify-between p-6">
        <div className="h-16 bg-white rounded-2xl animate-pulse border border-[#EAEAF4]" />
        <div className="max-w-[820px] w-full mx-auto space-y-6 my-12 animate-pulse">
          <div className="h-24 bg-white rounded-2xl border border-[#EAEAF4]" />
          <div className="space-y-4">
            <div className="h-16 bg-white rounded-xl border border-[#EAEAF4]" />
            <div className="h-16 bg-white rounded-xl border border-[#EAEAF4]" />
            <div className="h-16 bg-white rounded-xl border border-[#EAEAF4]" />
            <div className="h-16 bg-white rounded-xl border border-[#EAEAF4]" />
          </div>
        </div>
        <div className="h-20 bg-white rounded-2xl animate-pulse border border-[#EAEAF4]" />
      </div>
    );
  }

  if (isError || !quiz) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl border border-[#EAEAF4] text-center max-w-md shadow-2xs space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#FFF2F2] text-[#E11D48] flex items-center justify-center mx-auto text-xl font-bold">✕</div>
          <h3 className="text-base font-semibold text-[#1A1A2E]">Không thể tải bộ câu hỏi đánh giá</h3>
          <p className="text-xs text-[#7878A0]">Hệ thống máy chủ API gặp cản trở kết nối. Bạn vui lòng thử tải lại trang hoặc kiểm tra lại đường truyền.</p>
          <Link href="/practice" className="inline-block px-5 py-2.5 rounded-xl bg-[#5052EE] text-white text-xs font-semibold hover:bg-[#4648D4] transition-colors">
            Quay lại Trung tâm đánh giá
          </Link>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentIndex];
  const progress = Math.round(((currentIndex + 1) / quiz.questions.length) * 100);
  const selectedAnswerId = answers[String(question?.id)];

  // Calculate answered count to give user clear confidence in state preservation
  const answeredCount = Object.keys(answers).filter(key => answers[key] != null && answers[key] !== "").length;

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex flex-col font-sans">
      {/* ─── Topbar ────────────────────────────────────────────────────────── */}
      <header className="h-18 bg-white/95 backdrop-blur-md border-b border-[#EAEAF4] flex items-center justify-between px-6 shrink-0 sticky top-0 z-20 shadow-2xs">
        <div className="flex items-center gap-4">
          <Link href="/practice" className="p-2 hover:bg-[#F0F2F8] rounded-full transition-colors text-[#64647A] flex items-center justify-center" title="Quay lại">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </Link>
          <div className="h-7 w-[1px] bg-[#EAEAF4]"></div>
          <div className="flex flex-col">
            <span className="text-[#4648D4] font-semibold text-base sm:text-lg leading-tight">{quiz.title}</span>
            <span className="text-[#7878A0] text-[11px] font-normal leading-tight mt-0.5">Đánh giá Năng lực Thực chiến từ CSDL Máy chủ</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF8F5] text-[#0D9488] text-xs font-semibold border border-[#0D9488]/20">
            <span>✓ Đã làm: {answeredCount}/{quiz.questions.length} câu</span>
          </div>

          <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full shadow-2xs border transition-all ${timeRemaining < 60 ? "bg-[#FFF2F2] text-[#E11D48] border-[#E11D48]/30 animate-pulse" : "bg-[#EEF2FF] text-[#5052EE] border-[#5052EE]/20"}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span className="text-xs sm:text-sm font-semibold tracking-wide">{formatTime(timeRemaining)} <span className="text-[11px] font-normal opacity-80 hidden sm:inline">phút còn lại</span></span>
          </div>
        </div>
      </header>

      {/* ─── Main Content ────────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto pb-36">
        <div className="max-w-[820px] mx-auto px-6 pt-7 sm:pt-8">
          {errorNotice && (
            <div className="mb-6 p-4 rounded-xl bg-[#FFF2F2] border border-[#E11D48]/30 text-[#E11D48] text-xs flex items-center justify-between">
              <span>⚠️ {errorNotice}</span>
              <button onClick={() => setErrorNotice(null)} className="font-semibold px-2">✕</button>
            </div>
          )}

          {/* ─── Question Navigation Palette (State Preservation Matrix) ─── */}
          <div className="mb-7 bg-white p-4.5 rounded-2xl border border-[#EAEAF4] shadow-2xs">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-semibold text-[#1A1A2E] flex items-center gap-1.5">
                <span>📍 Bảng chọn nhanh câu hỏi (Các câu đã chọn được bảo lưu tuyệt đối):</span>
              </span>
              <span className="text-[#7878A0]">Nhấp vào số bất kỳ để di chuyển</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {quiz.questions.map((q, idx) => {
                const isAnswered = answers[String(q.id)] != null;
                const isCurrent = currentIndex === idx;
                return (
                  <button
                    key={String(q.id)}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-9 h-9 rounded-xl text-xs font-semibold flex items-center justify-center transition-all cursor-pointer border relative ${
                      isCurrent
                        ? "ring-2 ring-[#5052EE] ring-offset-2 bg-[#5052EE] text-white border-[#5052EE]"
                        : isAnswered
                        ? "bg-[#EEF2FF] text-[#5052EE] border-[#5052EE]/30 hover:bg-[#5052EE]/15"
                        : "bg-[#F8FAFC] text-[#64647A] border-[#EAEAF4] hover:bg-white hover:border-[#5052EE]/40"
                    }`}
                    title={`Câu số ${idx + 1}: ${isAnswered ? "Đã chọn đáp án" : "Chưa làm"}`}
                  >
                    <span>{idx + 1}</span>
                    {isAnswered && !isCurrent && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#10B981] rounded-full border border-white flex items-center justify-center text-[8px] text-white font-bold">✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-7">
            <span className="text-[#5052EE] text-[11px] font-semibold tracking-wider uppercase bg-[#EEF2FF] px-3 py-1 rounded-full border border-[#5052EE]/20">
              Câu hỏi số {currentIndex + 1} / {quiz.questions.length}
            </span>

            <div className="flex items-end justify-between mt-3.5">
              <h1 className="text-lg sm:text-xl font-semibold text-[#1A1A2E] leading-relaxed max-w-[85%]" title={question?.content}>
                {question?.content}
              </h1>
              <span className="text-xs font-medium text-[#7878A0] mb-1 shrink-0 ml-4">Tiến độ: {progress}%</span>
            </div>
            
            <div className="w-full h-1.5 bg-[#EAEAF4] rounded-full mt-4 overflow-hidden p-0.5">
              <div className="h-full bg-gradient-to-r from-[#4648D4] via-[#5052EE] to-[#0D9488] rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          {/* ─── Answers List with High-Contrast Selected UI Effect ─── */}
          <div className="flex flex-col gap-3.5">
            {question?.answers.map((answer, i) => {
              // Guaranteed string matching prevents ANY mismatch between number/string IDs!
              const isSelected = selectedAnswerId != null && String(selectedAnswerId) === String(answer.id);
              const letter = String.fromCharCode(65 + i); // A, B, C, D
              return (
                <div 
                  key={String(answer.id)}
                  onClick={() => handleSelectAnswer(question.id, answer.id)}
                  className={`group flex items-start sm:items-center p-4 sm:p-4.5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    isSelected 
                      ? "border-[#5052EE] bg-[#EEF2FF] shadow-[0_4px_18px_rgba(80,82,238,0.14)] -translate-y-0.5 z-10" 
                      : "border-[#EAEAF4] bg-white hover:border-[#5052EE]/40 hover:bg-[#F8FAFC] hover:shadow-2xs"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 transition-all ${
                    isSelected 
                      ? "bg-gradient-to-br from-[#4648D4] to-[#5052EE] text-white shadow-[0_2px_8px_rgba(80,82,238,0.35)] scale-105" 
                      : "bg-[#F0F2F8] text-[#64647A] group-hover:bg-[#E2E8F0]"
                  }`}>
                    {letter}
                  </div>

                  <span className={`ml-3.5 text-sm sm:text-base flex-1 leading-relaxed transition-colors ${
                    isSelected ? "font-bold text-[#1A1A2E]" : "font-normal text-[#374151] group-hover:text-[#1A1A2E]"
                  }`}>
                    {answer.content}
                  </span>

                  {/* Distinct active checked indicator badge */}
                  {isSelected && (
                    <div className="shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5052EE] text-white text-xs font-semibold ml-3 shadow-xs animate-fadeIn">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                      <span>Đã chọn</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* AI Tutor Hint */}
          <div className="mt-8 bg-gradient-to-r from-[#EEF2FF]/80 via-[#F3F4FC] to-[#EAF8F5]/80 border border-[#5052EE]/20 rounded-2xl p-5 shadow-2xs flex gap-4 items-start">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4648D4] via-[#5052EE] to-[#0D9488] text-white flex items-center justify-center shrink-0 shadow-[0_3px_12px_rgba(80,82,238,0.3)]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
              </svg>
            </div>
            <div className="pt-0.5">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-semibold text-[#5052EE] uppercase tracking-wider mb-1">💡 Gia sư Nova Co-Pilot gợi ý</h4>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded-full text-[#0D9488] font-medium border border-[#0D9488]/20">AI Hint</span>
              </div>
              <p className="text-xs sm:text-sm text-[#374151] font-normal leading-relaxed">
                Hãy chú ý các lựa chọn đáp án của bạn đều được hệ thống tự động ghi nhớ và bảo lưu qua các nút chuyển câu hỏi bên dưới cho tới khi chính thức nộp bài!
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* ─── Footer Action Bar ──────────────────────────────────────────────── */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#EAEAF4] py-3.5 px-6 z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <div className="max-w-[820px] mx-auto flex items-center justify-between">
          <button 
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#EAEAF4] bg-[#F8FAFC] text-[#374151] font-medium text-xs sm:text-sm hover:bg-[#EAEAF4]/60 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Câu trước
          </button>

          <div className="flex items-center gap-4 sm:gap-6">
            <button 
              onClick={handleUserInitiatedSubmit}
              disabled={isSubmitting}
              className="text-xs sm:text-sm font-medium text-[#7878A0] hover:text-[#5052EE] hover:underline transition-all cursor-pointer disabled:opacity-50"
            >
              Nộp bài sớm
            </button>

            <button 
              onClick={handleNext}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#4648D4] via-[#5052EE] to-[#0D9488] hover:opacity-95 text-white font-semibold text-xs sm:text-sm shadow-[0_4px_15px_rgba(80,82,238,0.35)] hover:-translate-y-0.5 transition-all focus:outline-none disabled:opacity-70 disabled:pointer-events-none cursor-pointer"
            >
              {currentIndex === quiz.questions.length - 1 ? (isSubmitting ? "Đang chấm điểm..." : "🚀 Nộp bài thi") : "Câu tiếp theo"}
              {currentIndex < quiz.questions.length - 1 && (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              )}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
