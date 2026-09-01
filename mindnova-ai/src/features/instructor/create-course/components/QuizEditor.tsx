"use client";

import React, { useState, useEffect } from "react";
import { quizGeneratorApi } from "@/src/features/instructor/quiz-generator/api/quizGeneratorApi";
import { QuestionCardMultipleChoice } from "@/src/features/instructor/quiz-generator/components/QuestionCardMultipleChoice";
import { QuestionCardEssay } from "@/src/features/instructor/quiz-generator/components/QuestionCardEssay";
import { SelectQuizModal } from "@/src/features/instructor/quiz-generator/components/SelectQuizModal";
import type { GeneratedQuestion, DifficultyType } from "@/src/features/instructor/quiz-generator/types/quizGenerator.types";
import type { DraftQuizData } from "../types";

interface QuizEditorProps {
  value?: DraftQuizData | any;
  onChange: (value: DraftQuizData | any) => void;
  quizId?: number;
  courseId?: number;
}

export function QuizEditor({ value, onChange, quizId, courseId }: QuizEditorProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState<boolean>(false);
  const [selectedQuizId, setSelectedQuizId] = useState<number | undefined>(quizId || value?.id || value?.quiz_id);
  const [title, setTitle] = useState<string>(value?.title || "Bài kiểm tra mới");
  const [description, setDescription] = useState<string>(value?.description || "");
  const [timeLimit, setTimeLimit] = useState<number>(value?.time_limit_minutes || 15);
  const [passingScore, setPassingScore] = useState<number>(value?.passing_score || 70);
  const [difficulty, setDifficulty] = useState<DifficultyType>(value?.difficulty || "mixed");
  const [filterType, setFilterType] = useState<"all" | "multiple_choice" | "essay">("all");
  const effectiveQuizId = selectedQuizId || quizId || value?.id || value?.quiz_id;
  const hasMountedRef = React.useRef(false);
  const hasLoadedFromApiRef = React.useRef(false);

  const [questions, setQuestions] = useState<GeneratedQuestion[]>(() => {
    if (value?.questions && Array.isArray(value.questions) && value.questions.length > 0) {
      return value.questions.map((q: any, idx: number) => normalizeQuestion(q, idx));
    }
    // Start empty — will be populated from API or remain empty for new quizzes
    return [];
  });

  // Sync value prop changes to internal state (only when value actually has questions from parent)
  useEffect(() => {
    if (value && !hasLoadedFromApiRef.current) {
      if (value.title) setTitle(value.title);
      if (value.description !== undefined) setDescription(value.description || "");
      if (value.time_limit_minutes !== undefined) setTimeLimit(value.time_limit_minutes);
      if (value.passing_score !== undefined) setPassingScore(value.passing_score);
      if (value.difficulty) setDifficulty(value.difficulty);
      if (Array.isArray(value.questions) && value.questions.length > 0) {
        setQuestions(value.questions.map((q: any, idx: number) => normalizeQuestion(q, idx)));
      }
    }
  }, [value]);

  // Fetch full details from API if quiz_id exists — always prioritize API data
  useEffect(() => {
    if (effectiveQuizId) {
      setIsLoading(true);
      quizGeneratorApi
        .getQuizById(Number(effectiveQuizId))
        .then((data) => {
          if (data) {
            hasLoadedFromApiRef.current = true;
            if (data.title) setTitle(data.title);
            if (data.description) setDescription(data.description || "");
            if (data.time_limit_minutes) setTimeLimit(data.time_limit_minutes);
            if (data.passing_score) setPassingScore(data.passing_score);
            if (data.difficulty) setDifficulty(data.difficulty);
            if (Array.isArray(data.questions) && data.questions.length > 0) {
              setQuestions(data.questions.map((q: any, idx: number) => normalizeQuestion(q, idx)));
            }
          }
        })
        .catch((err) => {
          console.warn("Failed to load quiz by id:", err);
        })
        .finally(() => setIsLoading(false));
    }
  }, [effectiveQuizId]);

  // Mark mount complete after initial render
  useEffect(() => {
    hasMountedRef.current = true;
  }, []);

  function normalizeQuestion(q: any, idx: number): GeneratedQuestion {
    const isEssay = q.type === "essay" || q.type === "tu_luan";
    const isMcq = !isEssay && (
      q.type === "multiple_choice" || 
      q.type === "trac_nghiem" || 
      (Array.isArray(q.answers) && q.answers.length > 0) || 
      (Array.isArray(q.options) && q.options.length > 0)
    );
    
    let optionsList: string[] = ["Đáp án 1", "Đáp án 2", "Đáp án 3", "Đáp án 4"];
    let correctIdx = 0;

    if (isMcq) {
      if (Array.isArray(q.options) && q.options.length > 0) {
        optionsList = q.options;
        correctIdx = typeof q.correct_answer_index === "number" ? q.correct_answer_index : 0;
      } else if (Array.isArray(q.answers) && q.answers.length > 0) {
        optionsList = q.answers.map((a: any) => a.content || a.answer || "");
        const foundIdx = q.answers.findIndex((a: any) => Boolean(a.is_correct));
        correctIdx = foundIdx >= 0 ? foundIdx : 0;
      }
    } else {
      optionsList = [];
      correctIdx = 0;
    }

    return {
      id: q.id ? String(q.id) : `q_${Date.now()}_${idx}`,
      type: isEssay ? "essay" : "multiple_choice",
      question: q.question || q.content || `Câu hỏi #${idx + 1}`,
      options: isEssay ? [] : optionsList,
      correct_answer_index: isEssay ? null : correctIdx,
      explanation: q.explanation || "",
      sample_answer: q.sample_answer || "",
      rubric: q.rubric || "",
      points: parseFloat(q.points) || (isEssay ? 2.5 : 0.5),
      difficulty: q.difficulty || "medium",
      reviewStatus: "approved",
    };
  }

  // Notify parent on change — only after mount to avoid overwriting with empty/default data
  const notifyParent = (
    newQuestions: GeneratedQuestion[],
    newTitle = title,
    newTime = timeLimit,
    newScore = passingScore,
    newDiff = difficulty,
    newDesc = description,
    forcedQuizId?: number
  ) => {
    if (!hasMountedRef.current) return;
    const targetId = forcedQuizId || selectedQuizId || effectiveQuizId;
    const payload = {
      id: targetId,
      quiz_id: targetId,
      title: newTitle,
      description: newDesc,
      time_limit_minutes: newTime,
      passing_score: newScore,
      difficulty: newDiff,
      total_questions: newQuestions.length,
      questions: newQuestions,
    };
    if (typeof window !== "undefined" && targetId) {
      try {
        window.localStorage.setItem(`instructor_quiz_${targetId}`, JSON.stringify(payload));
      } catch (e) {}
    }
    onChange(payload);
  };

  const handleSelectQuizFromBank = (quizDetails: any) => {
    if (!quizDetails) return;
    const newQuizId = quizDetails.id || quizDetails.quiz_id;
    setSelectedQuizId(newQuizId);
    if (quizDetails.title) setTitle(quizDetails.title);
    if (quizDetails.description) setDescription(quizDetails.description || "");
    if (quizDetails.time_limit_minutes) setTimeLimit(quizDetails.time_limit_minutes);
    if (quizDetails.passing_score) setPassingScore(quizDetails.passing_score);
    if (quizDetails.difficulty) setDifficulty(quizDetails.difficulty);

    const rawQs = Array.isArray(quizDetails.questions) ? quizDetails.questions : [];
    const normQuestions = rawQs.map((q: any, idx: number) => normalizeQuestion(q, idx));
    setQuestions(normQuestions);

    notifyParent(
      normQuestions,
      quizDetails.title || title,
      quizDetails.time_limit_minutes || timeLimit,
      quizDetails.passing_score || passingScore,
      quizDetails.difficulty || difficulty,
      quizDetails.description || description,
      newQuizId
    );
  };

  const handleUpdateQuestion = (id: string, updated: Partial<GeneratedQuestion>) => {
    const nextQuestions = questions.map((q) => (q.id === id ? { ...q, ...updated } : q));
    setQuestions(nextQuestions);
    notifyParent(nextQuestions);
  };

  const handleDeleteQuestion = (id: string) => {
    const nextQuestions = questions.filter((q) => q.id !== id);
    setQuestions(nextQuestions);
    notifyParent(nextQuestions);
  };

  const handleAddQuestion = (type: "multiple_choice" | "essay") => {
    const newQ: GeneratedQuestion =
      type === "multiple_choice"
        ? {
            id: `q_${Date.now()}`,
            type: "multiple_choice",
            question: "Nội dung câu hỏi trắc nghiệm mới...",
            options: ["Lựa chọn A", "Lựa chọn B", "Lựa chọn C", "Lựa chọn D"],
            correct_answer_index: 0,
            explanation: "Giải thích đáp án...",
            points: 0.5,
            difficulty: "medium",
            reviewStatus: "approved",
          }
        : {
            id: `q_${Date.now()}`,
            type: "essay",
            question: "Nội dung câu hỏi tự luận mới...",
            options: [],
            correct_answer_index: null,
            explanation: "",
            sample_answer: "Gợi ý câu trả lời mẫu...",
            rubric: "Thang điểm chấm: 1.0đ",
            points: 1.0,
            difficulty: "medium",
            reviewStatus: "approved",
          };

    const nextQuestions = [...questions, newQ];
    setQuestions(nextQuestions);
    notifyParent(nextQuestions);
  };

  const mcQuestions = questions.filter((q) => q.type === "multiple_choice");
  const essayQuestions = questions.filter((q) => q.type === "essay");

  const filteredQuestions = questions.filter((q) => {
    if (filterType === "all") return true;
    return q.type === filterType;
  });

  const rawTotal = questions.reduce((sum, q) => sum + (parseFloat(String(q.points)) || 0), 0);
  const totalPoints = Number(rawTotal.toFixed(2));
  const isValidTotal = Math.abs(totalPoints - 10) < 0.001;
  const isLess = totalPoints < 10;

  if (isLoading) {
    return (
      <div className="p-12 text-center flex flex-col items-center justify-center gap-3 bg-white rounded-3xl border border-gray-100">
        <div className="w-8 h-8 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
        <span className="text-xs font-bold text-gray-500">Đang tải dữ liệu bài kiểm tra...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Import from Bank Banner */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100">
        <div className="flex items-center gap-3">
          <span className="text-xl">🪄</span>
          <div>
            <h4 className="text-xs font-black text-[#1A1A2E]">Chèn đề thi từ Ngân Hàng Quiz</h4>
            <p className="text-[11px] font-medium text-gray-500">
              {selectedQuizId
                ? `Đang liên kết với Bài thi #${selectedQuizId}`
                : "Bạn có thể chèn một đề thi đã được tạo sẵn từ Bộ Tạo Bài Kiểm Tra AI vào bài học này."}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsSelectModalOpen(true)}
          className="px-4 py-2 bg-[#C0392B] hover:bg-[#a02c20] text-white text-xs font-extrabold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <span>📥</span>
          <span>{selectedQuizId ? "Đổi đề thi khác" : "Chọn từ Ngân hàng Quiz"}</span>
        </button>
      </div>

      <SelectQuizModal
        isOpen={isSelectModalOpen}
        onClose={() => setIsSelectModalOpen(false)}
        onSelectQuiz={handleSelectQuizFromBank}
        courseId={courseId}
      />

      {/* Quiz Meta Settings */}
      <div className="p-6 rounded-3xl bg-[#FAF8FF] border border-indigo-100 flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black text-[#1A1A2E] mb-1">Tên bài kiểm tra <span className="text-rose-500">*</span></label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                const val = e.target.value;
                setTitle(val);
                notifyParent(questions, val);
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-[#1A1A2E] focus:outline-none focus:border-[#C0392B]"
              placeholder="VD: Kiểm tra cuối chương 1"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-[#1A1A2E] mb-1">Mô tả ngắn</label>
            <input
              type="text"
              value={description}
              onChange={(e) => {
                const val = e.target.value;
                setDescription(val);
                notifyParent(questions, title, timeLimit, passingScore, difficulty, val);
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-medium text-[#1A1A2E] focus:outline-none focus:border-[#C0392B]"
              placeholder="Mục tiêu đánh giá kiến thức..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-indigo-50">
          <div>
            <label className="block text-xs font-black text-gray-700 mb-1">Thời gian làm bài (Phút)</label>
            <input
              type="number"
              min={1}
              max={180}
              value={timeLimit}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 15;
                setTimeLimit(val);
                notifyParent(questions, title, val);
              }}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-800 focus:outline-none focus:border-[#C0392B]"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-gray-700 mb-1">Điểm đạt (%)</label>
            <input
              type="number"
              min={0}
              max={100}
              value={passingScore}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 70;
                setPassingScore(val);
                notifyParent(questions, title, timeLimit, val);
              }}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-800 focus:outline-none focus:border-[#C0392B]"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-gray-700 mb-1">Độ khó chung</label>
            <select
              value={difficulty}
              onChange={(e) => {
                const val = e.target.value as DifficultyType;
                setDifficulty(val);
                notifyParent(questions, title, timeLimit, passingScore, val);
              }}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-800 focus:outline-none focus:border-[#C0392B]"
            >
              <option value="easy">🟢 Dễ</option>
              <option value="medium">🟡 Trung bình</option>
              <option value="hard">🔴 Khó</option>
              <option value="mixed">⚡ Hỗn hợp</option>
            </select>
          </div>
        </div>
      </div>

      {/* Score Validation Banner */}
      <div>
        {isValidTotal ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs font-bold flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="text-base">✅</span>
              <span>Tổng điểm chuẩn hợp lệ: <strong>10 / 10 điểm</strong>. Bài thi sẵn sàng lưu.</span>
            </div>
            <span className="px-2.5 py-1 bg-emerald-600 text-white text-[10px] font-black uppercase rounded-lg">Standard 10.0</span>
          </div>
        ) : isLess ? (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs font-bold flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="text-base">⚠️</span>
              <span>Tổng điểm chưa đủ 10 (Hiện tại: <strong>{totalPoints} / 10</strong>). Vui lòng tăng điểm câu hỏi.</span>
            </div>
            <span className="px-2.5 py-1 bg-amber-600 text-white text-[10px] font-black uppercase rounded-lg">Thiếu {Number((10 - totalPoints).toFixed(2))}đ</span>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 text-xs font-bold flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="text-base">⚠️</span>
              <span>Tổng điểm vượt quá 10 (Hiện tại: <strong>{totalPoints} / 10</strong>). Vui lòng giảm điểm câu hỏi.</span>
            </div>
            <span className="px-2.5 py-1 bg-rose-600 text-white text-[10px] font-black uppercase rounded-lg">Vượt {Number((totalPoints - totalPoints).toFixed(2))}đ</span>
          </div>
        )}
      </div>

      {/* Question Filter & Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#FAF8FF] border border-indigo-50">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterType("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              filterType === "all"
                ? "bg-[#C0392B] text-white shadow-xs"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            Tất cả ({questions.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType("multiple_choice")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              filterType === "multiple_choice"
                ? "bg-[#C0392B] text-white shadow-xs"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            Trắc nghiệm ({mcQuestions.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType("essay")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              filterType === "essay"
                ? "bg-[#C0392B] text-white shadow-xs"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            Tự luận ({essayQuestions.length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleAddQuestion("multiple_choice")}
            className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-[#C0392B] text-xs font-extrabold rounded-xl border border-indigo-100 transition-all cursor-pointer"
          >
            + Trắc nghiệm
          </button>
          <button
            type="button"
            onClick={() => handleAddQuestion("essay")}
            className="px-3.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-extrabold rounded-xl border border-purple-100 transition-all cursor-pointer"
          >
            + Tự luận
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="flex flex-col gap-4 max-h-[550px] overflow-y-auto pr-1">
        {filteredQuestions.length === 0 ? (
          <div className="p-10 text-center rounded-2xl bg-white border border-gray-200 text-gray-500 font-medium text-xs">
            {isLoading ? 'Đang tải câu hỏi...' : 'Chưa có câu hỏi nào. Nhấn "+ Trắc nghiệm" hoặc "+ Tự luận" ở trên để thêm.'}
          </div>
        ) : (
          filteredQuestions.map((q, idx) => {
            if (q.type === "essay") {
              return (
                <QuestionCardEssay
                  key={q.id}
                  question={q}
                  index={idx}
                  onUpdate={handleUpdateQuestion}
                  onApprove={() => {}}
                  onDelete={handleDeleteQuestion}
                  onRegenerate={() => {}}
                />
              );
            }
            return (
              <QuestionCardMultipleChoice
                key={q.id}
                question={q}
                index={idx}
                onUpdate={handleUpdateQuestion}
                onApprove={() => {}}
                onDelete={handleDeleteQuestion}
                onRegenerate={() => {}}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
