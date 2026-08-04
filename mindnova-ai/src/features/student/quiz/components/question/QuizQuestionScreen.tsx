"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useGetStudentQuiz, useSubmitQuiz } from "../../api";

interface QuizQuestionScreenProps {
  lessonId: string;
  courseTitle?: string;
}

export function QuizQuestionScreen({ lessonId, courseTitle = "Khóa học" }: QuizQuestionScreenProps) {
  const { data: quiz, isLoading, isError } = useGetStudentQuiz(lessonId);
  const { mutateAsync: submitQuiz, isPending: isSubmitting } = useSubmitQuiz();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isFinished, setIsFinished] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = useCallback(async (finalAnswers = answers) => {
    if (!quiz || isSubmitting) return;
    try {
      const timeTaken = (quiz.time_limit_minutes * 60) - timeRemaining;
      const res = await submitQuiz({
        lessonId,
        answers: finalAnswers,
        time_taken_seconds: timeTaken > 0 ? timeTaken : 0
      });
      setResult(res);
      setIsFinished(true);
    } catch (error) {
      console.error("Lỗi khi nộp bài:", error);
      alert("Đã xảy ra lỗi khi nộp bài. Vui lòng thử lại.");
    }
  }, [quiz, isSubmitting, timeRemaining, submitQuiz, lessonId, answers]);

  // Initialize timer
  useEffect(() => {
    if (quiz && timeRemaining === 0 && !isFinished) {
      setTimeRemaining(quiz.time_limit_minutes * 60);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining <= 0 || isFinished || !quiz) return;
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(answers);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeRemaining, isFinished, quiz, handleSubmit, answers]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')} remaining`;
  };

  const handleSelectAnswer = (questionId: string | number, answerId: string | number) => {
    setAnswers(prev => ({ ...prev, [String(questionId)]: Number(answerId) }));
  };

  const handleNext = () => {
    if (quiz && currentIndex < quiz.questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      handleSubmit(answers);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB]">Đang tải dữ liệu bài kiểm tra...</div>;
  }

  if (isError || !quiz) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB] text-red-500">Lỗi không thể tải bài kiểm tra.</div>;
  }

  if (isFinished && result) {
    // Ideally this redirects to QuizResultContent or renders it. For now, a simple result screen.
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-sm">
          <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 text-white text-2xl font-bold" style={{ backgroundColor: result.passed ? '#4CAF50' : '#F44336' }}>
            {result.passed ? '✓' : '✕'}
          </div>
          <h2 className="text-2xl font-bold mb-2">{result.passed ? 'Chúc mừng!' : 'Chưa đạt yêu cầu'}</h2>
          <p className="text-gray-500 mb-6">Bạn đã hoàn thành bài kiểm tra: {quiz.title}</p>
          <div className="flex justify-around bg-gray-50 p-4 rounded-xl mb-6">
            <div>
              <div className="text-sm text-gray-500">Điểm số</div>
              <div className="text-xl font-bold">{result.score}/{result.total_questions}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Độ chính xác</div>
              <div className="text-xl font-bold" style={{ color: result.accuracy >= quiz.passing_score ? '#4CAF50' : '#F44336' }}>{result.accuracy}%</div>
            </div>
          </div>
          <Link href="/courses" className="inline-block px-6 py-3 bg-[#6B6BFF] text-white font-semibold rounded-xl hover:bg-[#5452F6] transition-colors">
            Quay lại khóa học
          </Link>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentIndex];
  const progress = Math.round(((currentIndex) / quiz.questions.length) * 100);
  const selectedAnswerId = answers[String(question.id)];

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col font-sans">
      {/* ─── Topbar ────────────────────────────────────────────────────────── */}
      <header className="h-[72px] bg-white border-b border-[#F0F2F5] flex items-center justify-between px-6 shrink-0 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link href="/courses/quiz" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </Link>
          <div className="h-8 w-[1px] bg-gray-200"></div>
          <div className="flex flex-col">
            <span className="text-[#3b3dbf] font-bold text-lg leading-tight">{quiz.title}</span>
            <span className="text-gray-400 text-[11px] font-medium leading-tight">{courseTitle}</span>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full shadow-sm ${timeRemaining < 60 ? 'bg-red-50 text-red-500' : 'bg-[#EEF2FF] text-[#6B6BFF]'}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span className="text-[13px] font-bold tracking-wide">{formatTime(timeRemaining)}</span>
          </div>
        </div>
      </header>

      {/* ─── Main Content ────────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto pb-32">
        <div className="max-w-[760px] mx-auto px-6 pt-10">
          <div className="mb-8">
            <span className="text-[#6B6BFF] text-[11px] font-bold tracking-widest uppercase">Câu hỏi {currentIndex + 1} / {quiz.questions.length}</span>
            <div className="flex items-end justify-between mt-1">
              <h1 className="text-[24px] font-bold text-[#1F2937] leading-tight max-w-[80%] line-clamp-2" title={question.content}>
                {question.content}
              </h1>
              <span className="text-[13px] font-medium text-gray-500 mb-1">Hoàn thành: {progress}%</span>
            </div>
            
            <div className="w-full h-1.5 bg-[#EEF2FF] rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#6B6BFF] to-[#0891B2] rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {question.answers.map((answer, i) => {
              const isSelected = selectedAnswerId === answer.id;
              const letter = String.fromCharCode(65 + i); // A, B, C, D
              return (
                <div 
                  key={answer.id}
                  onClick={() => handleSelectAnswer(question.id, answer.id)}
                  className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all shadow-sm ${isSelected ? 'border-[#6B6BFF] bg-[#EEF2FF]/40' : 'border-[#F3F4F6] bg-white hover:border-gray-300'}`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-[15px] shrink-0 ${isSelected ? 'bg-[#6B6BFF] text-white shadow-sm' : 'bg-[#F3F4F6] text-gray-500'}`}>
                    {letter}
                  </div>
                  <span className={`ml-4 text-[15px] flex-1 ${isSelected ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                    {answer.content}
                  </span>
                  {isSelected && (
                    <div className="shrink-0 text-[#6B6BFF] ml-4">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* AI Tutor Hint (Stub) */}
          {question.content.includes('AI') && (
            <div className="mt-8 bg-white border border-[#F3F4F6] rounded-2xl p-6 shadow-sm flex gap-4 items-start">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#2E3192] text-white flex items-center justify-center shrink-0 shadow-md">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                </svg>
              </div>
              <div className="pt-0.5">
                <h4 className="text-[11px] font-bold text-[#6B6BFF] uppercase tracking-widest mb-1.5">AI Tutor Hint</h4>
                <p className="text-[14px] text-gray-600 leading-relaxed">
                  Chú ý từ khóa trong câu hỏi để tìm ra đáp án đúng nhất nhé!
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ─── Footer Action Bar ──────────────────────────────────────────────── */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-[#F0F2F5] py-4 px-6 z-20">
        <div className="max-w-[760px] mx-auto flex items-center justify-between">
          <button 
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold text-[14px] hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Trước
          </button>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => {
                if (confirm('Bạn có chắc chắn muốn bỏ qua và nộp bài?')) {
                  handleSubmit();
                }
              }}
              className="text-[14px] font-bold text-[#6B6BFF] hover:text-[#4648D4] hover:underline transition-all"
            >
              Nộp bài sớm
            </button>

            <button 
              onClick={handleNext}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#5452F6] hover:bg-[#4648D4] text-white font-bold text-[14px] shadow-[0_4px_14px_rgba(84,82,246,0.35)] hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-4 focus:ring-[#5452F6]/30 disabled:opacity-70 disabled:pointer-events-none"
            >
              {currentIndex === quiz.questions.length - 1 ? (isSubmitting ? 'Đang nộp...' : 'Nộp bài') : 'Câu tiếp theo'}
              {currentIndex < quiz.questions.length - 1 && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
