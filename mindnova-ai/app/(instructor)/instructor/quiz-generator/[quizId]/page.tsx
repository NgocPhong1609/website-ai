"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { quizGeneratorApi } from "@/src/features/instructor/quiz-generator/api/quizGeneratorApi";
import { Loader } from "@/src/shared/components/ui/Loader";

export default function QuizDetailPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = Number(params.quizId);

  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Edit Points Mode State
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedQuestions, setEditedQuestions] = useState<any[]>([]);
  const [isSavingPoints, setIsSavingPoints] = useState(false);
  const [savePointsError, setSavePointsError] = useState<string | null>(null);
  const [savePointsSuccess, setSavePointsSuccess] = useState<string | null>(null);

  // Deletion modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (!quizId || isNaN(quizId)) {
      setErrorMsg("ID đề kiểm tra không hợp lệ.");
      setLoading(false);
      return;
    }

    setLoading(true);
    quizGeneratorApi
      .getQuizById(quizId)
      .then((data) => {
        if (data) {
          setQuiz(data);
          setEditedQuestions(JSON.parse(JSON.stringify(data.questions || [])));
        } else {
          setErrorMsg("Không tìm thấy đề kiểm tra.");
        }
      })
      .catch((err: any) => {
        console.error("Failed to load quiz details:", err);
        const status = err.response?.status;
        if (status === 403) {
          setErrorMsg("Bạn không có quyền thực hiện thao tác này.");
        } else if (status === 404) {
          setErrorMsg("Không tìm thấy đề kiểm tra.");
        } else {
          setErrorMsg("Không thể tải đề kiểm tra. Vui lòng thử lại.");
        }
      })
      .finally(() => setLoading(false));
  }, [quizId]);

  const questionsToDisplay = isEditMode ? editedQuestions : (quiz?.questions || []);

  const mcqQuestions = (questionsToDisplay || []).filter(
    (q: any) => q.type === "multiple_choice" || q.type === "trac_nghiem"
  );
  const essayQuestions = (questionsToDisplay || []).filter(
    (q: any) => q.type === "essay" || q.type === "tu_luan"
  );

  const rawTotal = (questionsToDisplay || []).reduce(
    (sum: number, q: any) => sum + (parseFloat(q.points) || 0),
    0
  );
  const totalScore = Number(rawTotal.toFixed(2));
  const isValidTotal = Math.abs(totalScore - 10) < 0.001;
  const isLess = totalScore < 10;
  const isMore = totalScore > 10;

  const handleStartEdit = () => {
    setEditedQuestions(JSON.parse(JSON.stringify(quiz.questions || [])));
    setIsEditMode(true);
    setSavePointsError(null);
    setSavePointsSuccess(null);
  };

  const handleCancelEdit = () => {
    setEditedQuestions(JSON.parse(JSON.stringify(quiz.questions || [])));
    setIsEditMode(false);
    setSavePointsError(null);
  };

  const handleUpdateQuestionPoint = (qIndex: number, newPoint: number) => {
    setEditedQuestions((prev) => {
      const copy = [...prev];
      copy[qIndex] = {
        ...copy[qIndex],
        points: isNaN(newPoint) || newPoint < 0 ? 0 : newPoint,
      };
      return copy;
    });
  };

  const handleUpdateQuestionRubric = (qIndex: number, newRubric: string) => {
    setEditedQuestions((prev) => {
      const copy = [...prev];
      copy[qIndex] = {
        ...copy[qIndex],
        rubric: newRubric,
      };
      return copy;
    });
  };

  const handleSavePoints = async () => {
    if (!isValidTotal) return;

    setIsSavingPoints(true);
    setSavePointsError(null);
    setSavePointsSuccess(null);

    try {
      const res = await quizGeneratorApi.updateQuiz(quizId, {
        title: quiz.title,
        description: quiz.description,
        source_type: quiz.source_type,
        source_content: quiz.source_content,
        course_id: quiz.attachments?.[0]?.course_id || quiz.course_id || null,
        difficulty: quiz.difficulty,
        time_limit_minutes: quiz.time_limit_minutes,
        passing_score: quiz.passing_score,
        status: quiz.status,
        questions: editedQuestions,
      });

      const updatedQuiz = res?.data || res;
      setQuiz(updatedQuiz);
      setEditedQuestions(JSON.parse(JSON.stringify(updatedQuiz.questions || [])));
      setIsEditMode(false);
      setSavePointsSuccess("✓ Đã cập nhật điểm và thang điểm bài kiểm tra thành công!");
      setTimeout(() => setSavePointsSuccess(null), 4000);
    } catch (err: any) {
      console.error("Save points error:", err);
      const apiMsg = err.response?.data?.message || err.message;
      if (apiMsg && typeof apiMsg === "string") {
        setSavePointsError(apiMsg);
      } else {
        setSavePointsError("Không thể lưu điểm. Vui lòng kiểm tra lại tổng điểm (phải bằng 10).");
      }
    } finally {
      setIsSavingPoints(false);
    }
  };

  const handleDelete = async (force: boolean = false) => {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await quizGeneratorApi.deleteQuiz(quizId, force);
      router.push("/instructor/quiz-generator");
    } catch (err: any) {
      console.error("Delete quiz error:", err);
      const apiMsg = err.response?.data?.message || err.message;
      if (apiMsg && typeof apiMsg === "string") {
        setDeleteError(apiMsg);
      } else {
        setDeleteError("Không thể xóa đề kiểm tra. Vui lòng thử lại.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-24 flex flex-col items-center justify-center gap-3">
        <Loader size="lg" />
        <span className="text-xs font-bold text-gray-500">Đang tải chi tiết bài kiểm tra...</span>
      </div>
    );
  }

  if (errorMsg || !quiz) {
    return (
      <div className="max-w-3xl mx-auto my-12 p-8 bg-white rounded-3xl border border-rose-100 shadow-sm flex flex-col items-center text-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-2xl font-bold">
          ⚠️
        </div>
        <h2 className="text-lg font-black text-[#1A1A2E]">{errorMsg || "Không tìm thấy đề kiểm tra"}</h2>
        <p className="text-xs text-gray-500 font-medium">
          Đề kiểm tra có thể đã bị xóa hoặc bạn không có quyền truy cập.
        </p>
        <Link
          href="/instructor/quiz-generator"
          className="mt-2 px-6 py-3 bg-[#4F46E5] text-white text-xs font-black rounded-2xl shadow-md hover:bg-[#4338CA] transition-all"
        >
          ← Quay lại danh sách đề kiểm tra
        </Link>
      </div>
    );
  }

  const attachedCourseName =
    quiz.attachments?.[0]?.course?.title || quiz.course_title || null;

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6 p-6 md:p-8 animate-fadeIn">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/instructor/quiz-generator"
          className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-extrabold text-gray-700 hover:border-indigo-300 hover:text-[#4F46E5] transition-all shadow-xs flex items-center gap-1.5"
        >
          <span>←</span>
          <span>Quay lại danh sách</span>
        </Link>

        <div className="flex items-center gap-3">
          {!isEditMode ? (
            <button
              type="button"
              onClick={handleStartEdit}
              className="px-4 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-[#4F46E5] text-xs font-extrabold hover:bg-[#4F46E5] hover:text-white transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>✏️</span>
              <span>Sửa điểm</span>
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={isSavingPoints}
                className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-extrabold transition-all cursor-pointer"
              >
                ✕ Hủy
              </button>
              <button
                type="button"
                onClick={handleSavePoints}
                disabled={!isValidTotal || isSavingPoints}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSavingPoints ? (
                  <span>⏳ Đang lưu...</span>
                ) : (
                  <>
                    <span>💾</span>
                    <span>Lưu điểm</span>
                  </>
                )}
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-extrabold hover:bg-rose-100 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>🗑</span>
            <span>Xóa đề này</span>
          </button>
        </div>
      </div>

      {savePointsSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold flex items-center gap-2 animate-fadeIn shadow-2xs">
          <span>✓</span>
          <span>{savePointsSuccess}</span>
        </div>
      )}

      {savePointsError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-extrabold flex items-center gap-2 animate-fadeIn shadow-2xs">
          <span>⚠️</span>
          <span>{savePointsError}</span>
        </div>
      )}

      {/* Main Quiz Overview Header Card */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#1E233E] via-[#2B2D62] to-[#121626] text-white flex flex-col gap-5 shadow-xl border border-white/10 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-[10px] font-black rounded-lg uppercase tracking-wider">
              {quiz.source_type === "course"
                ? "📚 Khóa học"
                : quiz.source_type === "content"
                ? "📜 Tài liệu"
                : "💡 Chủ đề"}
            </span>

            {attachedCourseName ? (
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black rounded-lg flex items-center gap-1.5">
                <span>🔗</span>
                <span>Khóa: <strong className="font-extrabold">{attachedCourseName}</strong></span>
              </span>
            ) : (
              <span className="px-3 py-1 bg-white/10 text-gray-300 border border-white/20 text-[10px] font-bold rounded-lg flex items-center gap-1.5">
                <span>⚪</span>
                <span>Chưa gắn vào khóa học</span>
              </span>
            )}

            <span
              className={`px-3 py-1 text-[10px] font-black rounded-lg border uppercase tracking-wider ${
                quiz.status === "published"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-xs"
                  : "bg-amber-500/20 text-amber-300 border-amber-400/30"
              }`}
            >
              {quiz.status === "published" ? "✓ Đã xuất bản" : "✎ Bản nháp"}
            </span>
          </div>

          <span className="text-xs text-indigo-200 font-semibold">
            📅 Ngày tạo: {new Date(quiz.created_at || Date.now()).toLocaleDateString("vi-VN")}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-black text-white">{quiz.title}</h1>
          {quiz.description && (
            <p className="text-xs text-indigo-200/90 font-medium leading-relaxed max-w-3xl">
              {quiz.description}
            </p>
          )}
        </div>

        {/* Info Grid Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/10">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col">
            <span className="text-[10px] text-indigo-300 font-bold uppercase">Tổng số câu hỏi</span>
            <span className="text-base font-black text-white">{quiz.total_questions || quiz.questions?.length || 0} câu</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col">
            <span className="text-[10px] text-indigo-300 font-bold uppercase">Cấu trúc câu hỏi</span>
            <span className="text-xs font-extrabold text-indigo-100 mt-1">
              {mcqQuestions.length} trắc nghiệm • {essayQuestions.length} tự luận
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col">
            <span className="text-[10px] text-indigo-300 font-bold uppercase">Độ khó &amp; Thời gian</span>
            <span className="text-xs font-extrabold text-indigo-100 mt-1 uppercase">
              {quiz.difficulty || "mixed"} • {quiz.time_limit_minutes || 15} phút
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col">
            <span className="text-[10px] text-indigo-300 font-bold uppercase">Tổng điểm chuẩn</span>
            <span className={`text-xs font-extrabold mt-1 ${isValidTotal ? "text-emerald-300" : "text-amber-300"}`}>
              {totalScore} / 10 điểm
            </span>
          </div>
        </div>
      </div>

      {/* Score Validation Banner */}
      <div>
        {isValidTotal ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="text-base">✓</span>
              <span>Tổng điểm hợp lệ: <strong>10 / 10</strong>. Bài kiểm tra đạt chuẩn quy định 10 điểm.</span>
            </div>
            <span className="px-2.5 py-1 bg-emerald-600 text-white text-[10px] font-black uppercase rounded-lg">Standard 10.0</span>
          </div>
        ) : isLess ? (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="text-base">⚠️</span>
              <span>Tổng điểm chưa đủ 10 (Hiện tại: <strong>{totalScore} / 10</strong>). Vui lòng điều chỉnh điểm các câu hỏi.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-amber-600 text-white text-[10px] font-black uppercase rounded-lg">Thiếu {Number((10 - totalScore).toFixed(2))}đ</span>
              {!isEditMode && (
                <button
                  type="button"
                  onClick={handleStartEdit}
                  className="px-3 py-1 bg-amber-800 hover:bg-amber-900 text-white text-xs font-black rounded-lg transition-all cursor-pointer"
                >
                  ✏️ Sửa điểm ngay
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-bold flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="text-base">⚠️</span>
              <span>Tổng điểm vượt quá 10 (Hiện tại: <strong>{totalScore} / 10</strong>). Vui lòng giảm điểm các câu hỏi.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-rose-600 text-white text-[10px] font-black uppercase rounded-lg">Vượt {Number((totalScore - 10).toFixed(2))}đ</span>
              {!isEditMode && (
                <button
                  type="button"
                  onClick={handleStartEdit}
                  className="px-3 py-1 bg-rose-800 hover:bg-rose-900 text-white text-xs font-black rounded-lg transition-all cursor-pointer"
                >
                  ✏️ Sửa điểm ngay
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Questions Section Header */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-black text-[#1A1A2E]">Danh Sách Câu Hỏi ({questionsToDisplay.length})</h2>
          {isEditMode && (
            <span className="px-3 py-1 rounded-xl bg-amber-100 text-amber-800 text-xs font-extrabold border border-amber-300 flex items-center gap-1.5 animate-pulse">
              <span>✏️ Đang ở chế độ chỉnh sửa điểm</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-lg bg-indigo-50 text-[#4F46E5] text-xs font-extrabold border border-indigo-100">
            Trắc nghiệm: {mcqQuestions.length}
          </span>
          <span className="px-3 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-extrabold border border-purple-100">
            Tự luận: {essayQuestions.length}
          </span>
        </div>
      </div>

      {/* Questions List */}
      <div className="flex flex-col gap-6">
        {questionsToDisplay.map((q: any, idx: number) => {
          const isMcq = q.type === "multiple_choice" || q.type === "trac_nghiem";
          const currentPoint = parseFloat(q.points) || 0;

          return (
            <div
              key={q.id || idx}
              className={`p-6 md:p-8 rounded-3xl bg-white border-2 transition-all duration-200 shadow-xs flex flex-col gap-4 relative ${
                isEditMode ? "border-indigo-300 bg-indigo-50/10" : "border-[#EAEAF4]"
              }`}
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-black rounded-xl uppercase tracking-wider">
                    Câu {idx + 1}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 text-[11px] font-black rounded-lg border uppercase ${
                      isMcq
                        ? "bg-indigo-50 text-[#4F46E5] border-indigo-100"
                        : "bg-purple-50 text-purple-700 border-purple-100"
                    }`}
                  >
                    {isMcq ? "Trắc nghiệm" : "Tự luận"}
                  </span>
                  <span className="px-2.5 py-0.5 bg-gray-100 text-gray-700 text-[11px] font-extrabold rounded-lg uppercase">
                    Độ khó: {q.difficulty || "medium"}
                  </span>
                </div>

                {/* Point Display / Input field */}
                {isEditMode ? (
                  <div className="flex items-center gap-2 p-2 rounded-2xl bg-indigo-50 border border-indigo-200">
                    <label className="text-xs font-extrabold text-[#4F46E5]">Điểm tối đa:</label>
                    <input
                      type="number"
                      step="0.25"
                      min="0"
                      value={currentPoint}
                      onChange={(e) => handleUpdateQuestionPoint(idx, parseFloat(e.target.value))}
                      className="w-24 p-2 rounded-xl bg-white border border-indigo-300 text-xs font-black text-[#1A1A2E] focus:outline-none focus:border-indigo-600 text-center"
                    />
                    <span className="text-xs font-bold text-gray-500">đ</span>
                  </div>
                ) : (
                  <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-100 shadow-2xs">
                    🎯 {currentPoint} điểm
                  </span>
                )}
              </div>

              {/* Question Text */}
              <h3 className="text-base font-extrabold text-[#1A1A2E] leading-relaxed">
                {q.content || q.question}
              </h3>

              {/* Multiple Choice Options */}
              {isMcq && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {(() => {
                    let opts: Array<{ text: string; isCorrect: boolean }> = [];
                    if (Array.isArray(q.answers) && q.answers.length > 0) {
                      opts = q.answers.map((a: any) => ({
                        text: a.content,
                        isCorrect: Boolean(a.is_correct),
                      }));
                    } else if (Array.isArray(q.options)) {
                      opts = q.options.map((optStr: string, optIdx: number) => ({
                        text: optStr,
                        isCorrect: optIdx === q.correct_answer_index,
                      }));
                    }

                    return opts.map((opt, optIdx) => {
                      const letter = String.fromCharCode(65 + optIdx);
                      return (
                        <div
                          key={optIdx}
                          className={`p-3.5 rounded-2xl border-2 flex items-center justify-between text-xs font-bold transition-all ${
                            opt.isCorrect
                              ? "bg-emerald-50/70 border-emerald-500 text-emerald-950 shadow-xs"
                              : "bg-gray-50 border-gray-200 text-gray-700"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                                opt.isCorrect
                                  ? "bg-emerald-500 text-white"
                                  : "bg-gray-200 text-gray-700"
                              }`}
                            >
                              {letter}
                            </span>
                            <span>{opt.text}</span>
                          </div>
                          {opt.isCorrect && (
                            <span className="px-2.5 py-0.5 rounded-lg bg-emerald-600 text-white text-[10px] font-black uppercase">
                              Đáp án đúng
                            </span>
                          )}
                        </div>
                      );
                    });
                  })()}
                </div>
              )}

              {/* Rationale / Explanation for Multiple Choice */}
              {isMcq && q.explanation && (
                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-xs flex flex-col gap-1 mt-1">
                  <span className="font-extrabold text-[#4F46E5] uppercase tracking-wider text-[10px]">
                    💡 Giải thích chi tiết (Rationale):
                  </span>
                  <p className="font-medium text-gray-800 leading-relaxed">{q.explanation}</p>
                </div>
              )}

              {/* Essay Sample Answer & Rubric */}
              {!isMcq && (
                <div className="flex flex-col gap-3 mt-2">
                  {q.sample_answer && (
                    <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 text-xs flex flex-col gap-1">
                      <span className="font-extrabold text-purple-700 uppercase tracking-wider text-[10px]">
                        📝 Gợi ý / Đáp án tham khảo mẫu:
                      </span>
                      <p className="font-medium text-gray-800 leading-relaxed whitespace-pre-line">
                        {q.sample_answer}
                      </p>
                    </div>
                  )}

                  <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 text-xs flex flex-col gap-1">
                    <span className="font-extrabold text-amber-800 uppercase tracking-wider text-[10px]">
                      📊 Thang điểm / Rubric chấm điểm:
                    </span>
                    {isEditMode ? (
                      <textarea
                        value={q.rubric || ""}
                        onChange={(e) => handleUpdateQuestionRubric(idx, e.target.value)}
                        rows={3}
                        className="w-full p-3 rounded-xl border border-amber-300 bg-white text-xs font-medium text-amber-950 focus:outline-none focus:border-amber-500 mt-1"
                        placeholder="- Ý 1: 40% = 1.0đ..."
                      />
                    ) : (
                      <p className="font-medium text-amber-950 leading-relaxed whitespace-pre-line">
                        {q.rubric || "Chưa có thang điểm chi tiết."}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Edit Mode Sticky Action Footer */}
      {isEditMode && (
        <div className="p-4 rounded-2xl bg-white border border-indigo-200 shadow-xl flex items-center justify-between sticky bottom-4 z-40 animate-fadeIn">
          <div className="flex items-center gap-3">
            <span className="text-xs font-extrabold text-[#1A1A2E]">Cập nhật tổng điểm:</span>
            <span className={`text-sm font-black px-3 py-1 rounded-xl border ${
              isValidTotal ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-amber-50 border-amber-200 text-amber-800"
            }`}>
              {totalScore} / 10 điểm
            </span>
            {!isValidTotal && (
              <span className="text-xs font-bold text-amber-800">
                ⚠️ Tổng điểm phải bằng 10 để lưu.
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCancelEdit}
              disabled={isSavingPoints}
              className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xs transition-all cursor-pointer"
            >
              ✕ Hủy
            </button>
            <button
              type="button"
              onClick={handleSavePoints}
              disabled={!isValidTotal || isSavingPoints}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isSavingPoints ? (
                <span>⏳ Đang lưu điểm...</span>
              ) : (
                <>
                  <span>💾</span>
                  <span>Lưu điểm</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-gray-100 flex flex-col gap-5">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center text-xl font-bold">
                ⚠️
              </div>
              <div>
                <h3 className="text-base font-black text-[#1A1A2E]">Xác nhận xóa đề kiểm tra</h3>
                <p className="text-xs text-gray-500 font-medium">Hành động này không thể hoàn tác.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs flex flex-col gap-1.5">
              <span className="font-extrabold text-[#1A1A2E]">Bạn có chắc muốn xóa đề kiểm tra này?</span>
              <span className="font-bold text-indigo-700">Đề: {quiz.title}</span>
            </div>

            {deleteError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold space-y-2">
                <div>⚠️ {deleteError}</div>
                {deleteError.includes("gắn vào khóa học") && (
                  <button
                    type="button"
                    onClick={() => handleDelete(true)}
                    disabled={isDeleting}
                    className="mt-2 w-full py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>⚡ Gỡ khỏi khóa học &amp; Xóa ngay</span>
                  </button>
                )}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteError(null);
                }}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xs transition-all cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => handleDelete()}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <span>⏳ Đang xóa...</span>
                ) : (
                  <>
                    <span>🗑</span>
                    <span>Xóa đề</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
