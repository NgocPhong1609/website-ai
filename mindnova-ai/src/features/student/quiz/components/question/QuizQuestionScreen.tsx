"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { useGetStudentQuiz, useSubmitQuiz } from "../../api";
import type { QuizGradingResult } from "../../types";

interface QuizQuestionScreenProps {
  lessonId?: string;
  courseTitle?: string;
}

export function QuizQuestionScreen({
  lessonId: propLessonId,
  courseTitle = "Chuyên đề Kỹ thuật AI & Fullstack",
}: QuizQuestionScreenProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const aiQuizId = searchParams.get("aiQuizId");
  const queryLessonId = searchParams.get("lessonId");
  const activeLessonId = propLessonId || queryLessonId || "";
  const quizStorageId = aiQuizId || activeLessonId || "default";

  const { data: staticQuiz, isLoading: isStaticLoading, isError: isStaticError } = useGetStudentQuiz(activeLessonId);
  const { mutateAsync: submitStaticQuiz, isPending: isSubmittingStatic } = useSubmitQuiz();

  const [aiQuizData, setAiQuizData] = useState<any>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(!!aiQuizId);
  const [isAiError, setIsAiError] = useState<boolean>(false);
  const [isSubmittingAi, setIsSubmittingAi] = useState<boolean>(false);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const isFinishedRef = useRef(false);
  const answersRef = useRef<Record<string, string>>({});
  answersRef.current = answers;

  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/api\/?$/, "");

  // 1. Tải đề thi
  useEffect(() => {
    if (!aiQuizId) return;

    const fetchAiQuiz = async () => {
      setIsAiLoading(true);
      try {
        const res = await fetch(`${baseUrl}/api/student/practice/ai-quizzes/${aiQuizId}`);
        if (!res.ok) throw new Error("Không thể tải đề AI");
        const json = await res.json();
        
        const rawQuiz = json.data;

        if (rawQuiz.is_completed) {
          router.replace(`/practice/quiz/result?aiQuizId=${aiQuizId}`);
          return;
        }

        const normalizedQuestions = (rawQuiz.questions_data || []).map((q: any, idx: number) => {
          const type = q.type || (q.options && q.options.length > 0 ? "multiple_choice" : "essay");
          return {
            id: String(q.id || idx + 1),
            type,
            content: q.question,
            rubric: q.rubric || null,
            answers: (q.options || []).map((opt: string) => {
              const letter = opt.trim().charAt(0);
              return {
                id: letter,
                content: opt,
              };
            }),
          };
        });

        const savedDraft = localStorage.getItem(`mindnova_draft_answers_${quizStorageId}`);
        if (savedDraft) {
          try {
            setAnswers(JSON.parse(savedDraft));
          } catch (e) {
            console.error(e);
          }
        }

        setAiQuizData({
          id: rawQuiz.id,
          title: rawQuiz.title,
          time_limit_minutes: rawQuiz.time_limit_minutes || 15,
          questions: normalizedQuestions,
          is_ai: true,
        });
      } catch (err) {
        console.error(err);
        setIsAiError(true);
      } finally {
        setIsAiLoading(false);
      }
    };

    fetchAiQuiz();
  }, [aiQuizId, baseUrl, quizStorageId, router]);

  const quiz = aiQuizId ? aiQuizData : staticQuiz;
  const isLoading = aiQuizId ? isAiLoading : isStaticLoading;
  const isError = aiQuizId ? isAiError : isStaticError;
  const isSubmitting = isSubmittingAi || isSubmittingStatic;

  // 2. Bảo lưu mốc Deadline thời gian thực
  useEffect(() => {
    if (!quiz || isFinished) return;

    const deadlineKey = `mindnova_deadline_${quizStorageId}`;
    let deadlineTimestamp = Number(localStorage.getItem(deadlineKey));

    if (!deadlineTimestamp || isNaN(deadlineTimestamp)) {
      const minutes = quiz.time_limit_minutes > 0 ? quiz.time_limit_minutes : 15;
      deadlineTimestamp = Date.now() + minutes * 60 * 1000;
      localStorage.setItem(deadlineKey, String(deadlineTimestamp));
    }

    const initialRemaining = Math.max(0, Math.floor((deadlineTimestamp - Date.now()) / 1000));
    setTimeRemaining(initialRemaining);

    if (initialRemaining <= 0) {
      handleSubmit(answersRef.current);
    }
  }, [quiz, isFinished, quizStorageId]);

  // 3. Hàm nộp bài tập trung
  const handleSubmit = useCallback(async (finalAnswers: Record<string, string> = answersRef.current) => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;
    setIsFinished(true);

    localStorage.removeItem(`mindnova_deadline_${quizStorageId}`);
    localStorage.removeItem(`mindnova_draft_answers_${quizStorageId}`);

    try {
      if (aiQuizId) {
        setIsSubmittingAi(true);
        const res = await fetch(`${baseUrl}/api/student/practice/ai-quizzes/${aiQuizId}/submit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify({ answers: finalAnswers }),
        });

        if (!res.ok) throw new Error("Chấm điểm AI thất bại");
        router.push(`/practice/quiz/result?aiQuizId=${aiQuizId}`);
      } else {
        const timeTaken = (quiz?.time_limit_minutes || 15) * 60 - timeRemaining;
        const res: QuizGradingResult = await submitStaticQuiz({
          lessonId: activeLessonId,
          answers: finalAnswers,
          time_taken_seconds: timeTaken > 0 ? timeTaken : 180,
        });

        if (typeof window !== "undefined") {
          localStorage.setItem("mindnova_last_quiz_result", JSON.stringify(res));
        }
        router.push("/practice/quiz/result");
      }
    } catch (error) {
      console.error("Lỗi khi nộp bài:", error);
      setErrorNotice("Đã xảy ra sự cố khi nộp bài. Vui lòng thử lại!");
    } finally {
      setIsSubmittingAi(false);
    }
  }, [aiQuizId, baseUrl, quizStorageId, quiz, timeRemaining, submitStaticQuiz, activeLessonId, router]);

  // 4. Chốt chặn thoát phòng thi
  useEffect(() => {
    if (!quiz || isFinished) return;

    window.history.pushState(null, "", window.location.href);

    const handlePopState = async () => {
      if (isFinishedRef.current) return;
      const confirmExit = confirm(
        "⚠️ CẢNH BÁO RỜI PHÒNG THI:\n" +
        "Bạn vừa nhấn nút Quay lại (Back). Hệ thống sẽ TỰ ĐỘNG THU BÀI và CHẤM ĐIỂM ngay lập tức.\n\n" +
        "Bạn có chắc chắn muốn nộp bài và thoát không?"
      );

      if (confirmExit) {
        await handleSubmit(answersRef.current);
      } else {
        window.history.pushState(null, "", window.location.href);
      }
    };

    const handleGlobalLinkClick = (e: MouseEvent) => {
      if (isFinishedRef.current) return;
      const target = (e.target as HTMLElement).closest("a");
      if (target && target.href && !target.href.includes("/practice/quiz/")) {
        e.preventDefault();
        const confirmExit = confirm(
          "⚠️ CẢNH BÁO RỜI PHÒNG THI:\n" +
          "Bạn đang chuyển sang trang khác. Hệ thống sẽ TỰ ĐỘNG THU BÀI và CHẤM ĐIỂM ngay bây giờ.\n\n" +
          "Bạn có chắc chắn muốn nộp bài và chuyển trang?"
        );
        if (confirmExit) {
          handleSubmit(answersRef.current).then(() => {
            window.location.href = target.href;
          });
        }
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isFinishedRef.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("popstate", handlePopState);
    document.addEventListener("click", handleGlobalLinkClick, true);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("click", handleGlobalLinkClick, true);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [quiz, isFinished, handleSubmit]);

  // 5. Đếm ngược thời gian
  useEffect(() => {
    if (timeRemaining <= 0 || isFinished || !quiz) return;
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(answersRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeRemaining, isFinished, quiz, handleSubmit]);

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleSelectAnswer = (questionId: string | number, answerValue: string) => {
    setAnswers((prev) => {
      const updated = { ...prev, [String(questionId)]: answerValue };
      localStorage.setItem(`mindnova_draft_answers_${quizStorageId}`, JSON.stringify(updated));
      return updated;
    });
  };

  const handleExitQuiz = async () => {
    if (!quiz) return;
    const confirmExit = confirm(
      "⚠️ CẢNH BÁO THOÁT BÀI THI:\n" +
      "Hệ thống sẽ TỰ ĐỘNG THU BÀI và CHẤM ĐIỂM theo các câu bạn đã làm.\n\n" +
      "Bạn có chắc chắn muốn nộp bài và thoát không?"
    );

    if (confirmExit) {
      await handleSubmit(answersRef.current);
    }
  };

  const handleUserInitiatedSubmit = () => {
    if (!quiz) return;
    const currentAnswered = Object.keys(answers).filter((k) => answers[k] != null && answers[k].trim() !== "").length;

    if (currentAnswered === 0) {
      if (!confirm("⚠️ Bạn chưa nhập câu trả lời nào! Bạn có chắc muốn nộp bài sớm không?")) return;
    } else if (currentAnswered < quiz.questions.length) {
      if (!confirm(`⚠️ Bạn đã hoàn thành ${currentAnswered}/${quiz.questions.length} câu. Bạn có chắc muốn nộp bài không?`)) return;
    } else {
      if (!confirm("✨ Bạn đã hoàn tất tất cả câu hỏi! Nộp bài và chấm điểm ngay?")) return;
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
          </div>
        </div>
        <div className="h-20 bg-white rounded-2xl animate-pulse border border-[#EAEAF4]" />
      </div>
    );
  }

  if (isError || !quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl border border-[#EAEAF4] text-center max-w-md shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#FFF2F2] text-[#E11D48] flex items-center justify-center mx-auto text-xl font-bold">✕</div>
          <h3 className="text-base font-bold text-[#1A1A2E]">Không thể tải bộ câu hỏi</h3>
          <p className="text-xs text-[#7878A0]">Hệ thống không tìm thấy nội dung bài kiểm tra hoặc bài thi đã được nộp.</p>
          <Link href="/practice" className="inline-block px-5 py-2.5 rounded-xl bg-[#5052EE] text-white text-xs font-bold hover:bg-[#4648D4]">
            Quay lại
          </Link>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentIndex];
  const progress = Math.round(((currentIndex + 1) / quiz.questions.length) * 100);
  const currentAnswerVal = answers[String(question?.id)] || "";
  const answeredCount = Object.keys(answers).filter((k) => answers[k] != null && answers[k].trim() !== "").length;
  const isEssayType = question?.type === "essay" || (!question?.answers || question?.answers.length === 0);

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex flex-col font-sans">
      <header className="h-18 bg-white/95 backdrop-blur-md border-b border-[#EAEAF4] flex items-center justify-between px-6 shrink-0 sticky top-0 z-20 shadow-2xs">
        <div className="flex items-center gap-4">
          <button 
            type="button"
            onClick={handleExitQuiz} 
            title="Thoát và nộp bài ngay"
            className="p-2 hover:bg-[#FEE2E2] hover:text-[#EF4444] rounded-full transition-colors text-[#64647A] cursor-pointer"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <div className="h-7 w-[1px] bg-[#EAEAF4]"></div>
          <div className="flex flex-col">
            <span className="text-[#4648D4] font-bold text-base sm:text-lg leading-tight">{quiz.title}</span>
            <span className="text-[#7878A0] text-[11px] font-normal leading-tight mt-0.5">
              {aiQuizId ? "✨ Khảo sát AI Đa Dạng Hình Thức" : courseTitle}
            </span>
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
            <span className="text-xs sm:text-sm font-semibold tracking-wide">{formatTime(timeRemaining)}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-36">
        <div className="max-w-[820px] mx-auto px-6 pt-7 sm:pt-8">
          {errorNotice && (
            <div className="mb-6 p-4 rounded-xl bg-[#FFF2F2] border border-[#E11D48]/30 text-[#E11D48] text-xs flex items-center justify-between">
              <span>⚠️ {errorNotice}</span>
              <button onClick={() => setErrorNotice(null)} className="font-semibold px-2">✕</button>
            </div>
          )}

          <div className="mb-7 bg-white p-4.5 rounded-2xl border border-[#EAEAF4] shadow-2xs">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-semibold text-[#1A1A2E]">📍 Bảng chọn nhanh câu hỏi:</span>
              <span className="text-[#7878A0]">Nhấp vào số để chuyển câu</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {quiz.questions.map((q: any, idx: number) => {
                const isAnswered = answers[String(q.id)] != null && answers[String(q.id)].trim() !== "";
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
                        ? "bg-[#EEF2FF] text-[#5052EE] border-[#5052EE]/30"
                        : "bg-[#F8FAFC] text-[#64647A] border-[#EAEAF4] hover:bg-white"
                    }`}
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
            <div className="flex items-center gap-2">
              <span className="text-[#5052EE] text-[11px] font-bold tracking-wider uppercase bg-[#EEF2FF] px-3 py-1 rounded-full border border-[#5052EE]/20">
                Câu hỏi số {currentIndex + 1} / {quiz.questions.length}
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F1F5F9] text-[#64748B]">
                {isEssayType ? "✍️ Tự luận / Điền từ" : question?.type === "true_false" ? "⚖️ Đúng / Sai" : "🔘 Trắc nghiệm"}
              </span>
            </div>

            <div className="flex items-end justify-between mt-3.5">
              <h1 className="text-lg sm:text-xl font-bold text-[#1A1A2E] leading-relaxed max-w-[85%]">
                {question?.content}
              </h1>
              <span className="text-xs font-medium text-[#7878A0] mb-1 shrink-0 ml-4">Tiến độ: {progress}%</span>
            </div>
            
            <div className="w-full h-1.5 bg-[#EAEAF4] rounded-full mt-4 overflow-hidden p-0.5">
              <div className="h-full bg-gradient-to-r from-[#4648D4] via-[#5052EE] to-[#0D9488] rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          {isEssayType ? (
            <div className="bg-white rounded-2xl border-2 border-[#5052EE]/30 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#EAEAF4] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] text-[#5052EE] flex items-center justify-center font-bold text-sm">
                    ✏️
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-[#1A1A2E]">Câu trả lời tự luận của bạn</h3>
                    <p className="text-[11px] text-[#7878A0]">Hãy trình bày các bước giải chi tiết để AI chấm điểm.</p>
                  </div>
                </div>
                <span className="text-[11px] bg-[#EAF8F5] text-[#0D9488] px-2.5 py-1 rounded-full font-medium border border-[#0D9488]/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
                  Tự động lưu nháp
                </span>
              </div>

              {question?.rubric && (
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#EAEAF4] text-xs text-[#64647A] space-y-1">
                  <span className="font-semibold text-[#5052EE] uppercase tracking-wider text-[10px] block">📌 Tiêu chí chấm điểm (Rubric):</span>
                  <p className="whitespace-pre-line text-xs text-[#374151] leading-relaxed">{question.rubric}</p>
                </div>
              )}

              <textarea
                rows={6}
                value={currentAnswerVal}
                onChange={(e) => handleSelectAnswer(question.id, e.target.value)}
                placeholder="Nhập câu trả lời hoặc các bước giải chi tiết của bạn tại đây..."
                className="w-full p-4 rounded-xl border-2 border-[#EAEAF4] focus:border-[#5052EE] focus:ring-4 focus:ring-[#5052EE]/10 text-sm leading-relaxed bg-white shadow-xs focus:outline-none transition-all"
              />
              <div className="flex justify-between items-center text-xs text-[#7878A0]">
                <span>Ký tự: {currentAnswerVal.length}</span>
                {currentAnswerVal.trim().length > 0 ? (
                  <span className="text-[#10B981] font-semibold">✓ Đã lưu nháp</span>
                ) : (
                  <span className="text-[#F59E0B]">⚠️ Chưa nhập câu trả lời</span>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3.5">
              {question?.answers?.map((answer: any, i: number) => {
                const isSelected = currentAnswerVal != null && String(currentAnswerVal).toUpperCase() === String(answer.id).toUpperCase();
                const letter = answer.id || String.fromCharCode(65 + i);

                return (
                  <div 
                    key={String(answer.id || i)}
                    onClick={() => handleSelectAnswer(question.id, letter)}
                    className={`group flex items-start sm:items-center p-4 sm:p-4.5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? "border-[#5052EE] bg-[#EEF2FF] shadow-[0_4px_18px_rgba(80,82,238,0.14)] -translate-y-0.5 z-10" 
                        : "border-[#EAEAF4] bg-white hover:border-[#5052EE]/40 hover:bg-[#F8FAFC]"
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 transition-all ${
                      isSelected 
                        ? "bg-gradient-to-br from-[#4648D4] to-[#5052EE] text-white shadow-sm scale-105" 
                        : "bg-[#F0F2F8] text-[#64647A]"
                    }`}>
                      {letter}
                    </div>

                    <span className={`ml-3.5 text-sm sm:text-base flex-1 leading-relaxed transition-colors ${
                      isSelected ? "font-bold text-[#1A1A2E]" : "font-normal text-[#374151]"
                    }`}>
                      {answer.content}
                    </span>

                    {isSelected && (
                      <div className="shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5052EE] text-white text-xs font-semibold ml-3 shadow-xs">
                        <span>Đã chọn</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          
          <div className="mt-8 bg-gradient-to-r from-[#EEF2FF]/80 via-[#F3F4FC] to-[#EAF8F5]/80 border border-[#5052EE]/20 rounded-2xl p-5 shadow-2xs flex gap-4 items-start">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4648D4] via-[#5052EE] to-[#0D9488] text-white flex items-center justify-center shrink-0">
              ✨
            </div>
            <div className="pt-0.5">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-[#5052EE] uppercase tracking-wider mb-1">Gia sư Nova AI</h4>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded-full text-[#0D9488] font-medium border border-[#0D9488]/20">AI Co-Pilot</span>
              </div>
              <p className="text-xs sm:text-sm text-[#374151] leading-relaxed">
                Hệ thống tự động lưu bài làm liên tục. Rời khỏi phòng thi bằng nút Quay lại hoặc menu Sidebar sẽ kích hoạt tính năng tự động nộp bài ngay.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#EAEAF4] py-3.5 px-6 z-20 shadow-md">
        <div className="max-w-[820px] mx-auto flex items-center justify-between">
          <button 
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#EAEAF4] bg-[#F8FAFC] text-[#374151] font-semibold text-xs sm:text-sm hover:bg-[#EAEAF4]/60 disabled:opacity-30 cursor-pointer"
          >
            ← Câu trước
          </button>

          <div className="flex items-center gap-4 sm:gap-6">
            <button 
              onClick={handleUserInitiatedSubmit}
              disabled={isSubmitting}
              className="text-xs sm:text-sm font-medium text-[#7878A0] hover:text-[#5052EE] hover:underline cursor-pointer disabled:opacity-50"
            >
              Nộp bài sớm
            </button>

            <button 
              onClick={handleNext}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#4648D4] via-[#5052EE] to-[#0D9488] hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-md hover:-translate-y-0.5 transition-all cursor-pointer disabled:opacity-70"
            >
              {currentIndex === quiz.questions.length - 1 ? (isSubmitting ? "Đang chấm điểm..." : "🚀 Nộp bài thi") : "Câu tiếp theo →"}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}