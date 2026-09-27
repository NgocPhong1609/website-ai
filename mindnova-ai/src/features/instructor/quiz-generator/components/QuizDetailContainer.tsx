"use client";

import { getErrorMessage } from "@/src/shared/lib/user-error";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
 AlertTriangle, ArrowLeft, BookOpen, CheckCircle2, FileText, GraduationCap, Link2Off, Loader2, Pencil, Save, Trash2,
} from "lucide-react";
import { Skeleton } from "@/src/shared/components/ui/Skeleton";
import { quizGeneratorApi } from "../api/quizGeneratorApi";
import { QuizImageField } from "./QuizImageField";

export function QuizDetailSkeleton() {
 return (
 <div role="status" aria-busy="true" aria-label="Đang tải chi tiết bài kiểm tra" className="max-w-5xl mx-auto flex flex-col gap-6 p-6 md:p-8">
 <div className="flex items-center justify-between">
 <Skeleton className="h-9 w-40" />
 <div className="flex gap-3">
 <Skeleton className="h-9 w-32" />
 <Skeleton className="h-9 w-28" />
 </div>
 </div>
 <div className="p-8 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
 <div className="flex gap-2">
 <Skeleton className="h-6 w-24" />
 <Skeleton className="h-6 w-40" />
 </div>
 <Skeleton className="h-8 w-2/3" />
 <Skeleton className="h-4 w-full" />
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
 {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16" />)}
 </div>
 </div>
 <Skeleton className="h-14 w-full rounded-xl" />
 {Array.from({ length: 3 }).map((_, i) => (
 <div key={i} className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
 <div className="flex justify-between">
 <div className="flex gap-2">
 <Skeleton className="h-6 w-16" />
 <Skeleton className="h-6 w-24" />
 </div>
 <Skeleton className="h-7 w-20" />
 </div>
 <Skeleton className="h-5 w-3/4" />
 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
 {Array.from({ length: 4 }).map((_, j) => <Skeleton key={j} className="h-12" />)}
 </div>
 </div>
 ))}
 </div>
 );
}

export function QuizDetailContainer({ quizId }: { quizId: number }) {
 const router = useRouter();

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

 const handleUpdateQuestionImage = (qIndex: number, image: { url: string | null; r2_key: string | null }) => {
 setEditedQuestions((previous) => previous.map((question, index) => index === qIndex
 ? { ...question, image_url: image.url, image_r2_key: image.r2_key }
 : question));
 };

 const handleUpdateAnswerImage = (qIndex: number, answerIndex: number, image: { url: string | null; r2_key: string | null }) => {
 setEditedQuestions((previous) => previous.map((question, index) => {
 if (index !== qIndex) return question;
 if (Array.isArray(question.answers)) {
 return {
 ...question,
 answers: question.answers.map((answer: any, currentIndex: number) => currentIndex === answerIndex
 ? { ...answer, image_url: image.url, image_r2_key: image.r2_key }
 : answer),
 };
 }
 const answerImages = Array.isArray(question.answer_images) ? [...question.answer_images] : [];
 answerImages[answerIndex] = image;
 return { ...question, answer_images: answerImages };
 }));
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
 thumbnail_url: quiz.thumbnail_url || null,
 thumbnail_r2_key: quiz.thumbnail_r2_key || null,
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
 setSavePointsSuccess("Đã cập nhật điểm và thang điểm bài kiểm tra thành công!");
 setTimeout(() => setSavePointsSuccess(null), 4000);
 } catch (err: any) {
 console.error("Save points error:", err);
 const apiMsg = getErrorMessage(err, "Không thể cập nhật bài kiểm tra. Vui lòng thử lại.");
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
 const apiMsg = getErrorMessage(err, "Không thể cập nhật bài kiểm tra. Vui lòng thử lại.");
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
 return <QuizDetailSkeleton />;
 }

 if (errorMsg || !quiz) {
 return (
 <div className="max-w-3xl mx-auto my-12 p-8 bg-white rounded-xl border border-rose-100 shadow-sm flex flex-col items-center text-center gap-4">
 <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center">
 <AlertTriangle className="h-6 w-6" aria-hidden />
 </div>
 <h2 className="text-lg font-bold text-slate-900">{errorMsg || "Không tìm thấy đề kiểm tra"}</h2>
 <p className="text-xs text-slate-500 font-medium">
 Đề kiểm tra có thể đã bị xóa hoặc bạn không có quyền truy cập.
 </p>
 <Link
 href="/instructor/quiz-generator"
 className="mt-2 px-5 py-2.5 bg-blue-600 text-white text-xs font-semibold rounded-lg shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-1.5"
 >
 <ArrowLeft className="h-4 w-4" aria-hidden />
 Quay lại danh sách đề kiểm tra
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
 className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-xs flex items-center gap-1.5"
 >
 <ArrowLeft className="h-4 w-4" aria-hidden />
 <span>Quay lại danh sách</span>
 </Link>

 <div className="flex items-center gap-3">
 {!isEditMode ? (
 <button
 type="button"
 onClick={handleStartEdit}
 className="px-4 py-2 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold hover:bg-blue-600 hover:text-white transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
 >
 <Pencil className="h-3.5 w-3.5" aria-hidden />
 <span>Chỉnh sửa Quiz</span>
 </button>
 ) : (
 <>
 <button
 type="button"
 onClick={handleCancelEdit}
 disabled={isSavingPoints}
 className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
 >
 Hủy
 </button>
 <button
 type="button"
 onClick={handleSavePoints}
 disabled={!isValidTotal || isSavingPoints}
 className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
 >
 {isSavingPoints ? (
 <>
 <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
 <span>Đang lưu...</span>
 </>
 ) : (
 <>
 <Save className="h-3.5 w-3.5" aria-hidden />
 <span>Lưu điểm</span>
 </>
 )}
 </button>
 </>
 )}

 <button
 type="button"
 onClick={() => setShowDeleteModal(true)}
 className="px-4 py-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold hover:bg-rose-100 transition-colors flex items-center gap-1.5 cursor-pointer"
 >
 <Trash2 className="h-3.5 w-3.5" aria-hidden />
 <span>Xóa đề này</span>
 </button>
 </div>
 </div>

 {savePointsSuccess && (
 <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn shadow-sm">
 <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
 <span>{savePointsSuccess}</span>
 </div>
 )}

 {savePointsError && (
 <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn shadow-sm">
 <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden />
 <span>{savePointsError}</span>
 </div>
 )}

 {/* Main Quiz Overview Header Card */}
 {isEditMode && (
 <QuizImageField
 label="Ảnh đại diện Quiz"
 purpose="thumbnail"
 value={{ url: quiz.thumbnail_url || null, r2_key: quiz.thumbnail_r2_key || null }}
 onChange={(image) => setQuiz((current: any) => ({ ...current, thumbnail_url: image.url, thumbnail_r2_key: image.r2_key }))}
 />
 )}
 <div className="p-6 md:p-8 rounded-xl bg-white text-slate-900 flex flex-col gap-5 shadow-sm border border-slate-200 relative overflow-hidden">
 {quiz.thumbnail_url && <img src={quiz.thumbnail_url} alt={`Ảnh đại diện ${quiz.title}`} className="h-44 w-full rounded-lg bg-slate-100 object-cover" />}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div className="flex items-center gap-2 flex-wrap">
 <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-bold rounded-lg uppercase tracking-wider flex items-center gap-1.5">
 {quiz.source_type === "course" ? (
 <><GraduationCap className="h-3 w-3" aria-hidden />Khóa học</>
 ) : quiz.source_type === "content" ? (
 <><FileText className="h-3 w-3" aria-hidden />Tài liệu</>
 ) : (
 <><BookOpen className="h-3 w-3" aria-hidden />Chủ đề</>
 )}
 </span>

 {attachedCourseName ? (
 <span className="px-3 py-1 bg-slate-50 text-slate-700 border border-slate-200 text-[10px] font-bold rounded-lg flex items-center gap-1.5">
 <GraduationCap className="h-3 w-3" aria-hidden />
 <span>Khóa: <strong className="font-semibold">{attachedCourseName}</strong></span>
 </span>
 ) : (
 <span className="px-3 py-1 bg-slate-50 text-slate-500 border border-slate-200 text-[10px] font-bold rounded-lg flex items-center gap-1.5">
 <Link2Off className="h-3 w-3" aria-hidden />
 <span>Chưa gắn vào khóa học</span>
 </span>
 )}

 <span
 className={`px-3 py-1 text-[10px] font-bold rounded-lg border uppercase tracking-wider ${
 quiz.status === "published"
 ? "bg-emerald-50 text-emerald-700 border-emerald-200"
 : "bg-amber-50 text-amber-700 border-amber-200"
 }`}
 >
 {quiz.status === "published" ? "Đã xuất bản" : "Bản nháp"}
 </span>
 </div>

 <span className="text-xs text-slate-500 font-semibold">
 Ngày tạo: {new Date(quiz.created_at || Date.now()).toLocaleDateString("vi-VN")}
 </span>
 </div>

 <div className="flex flex-col gap-2">
 <h1 className="text-2xl font-bold text-slate-900">{quiz.title}</h1>
 {quiz.description && (
 <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-3xl">
 {quiz.description}
 </p>
 )}
 </div>

 {/* Info Grid Pills */}
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
 <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col">
 <span className="text-[10px] text-slate-400 font-bold uppercase">Tổng số câu hỏi</span>
 <span className="text-base font-bold text-slate-900">{quiz.total_questions || quiz.questions?.length || 0} câu</span>
 </div>

 <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col">
 <span className="text-[10px] text-slate-400 font-bold uppercase">Cấu trúc câu hỏi</span>
 <span className="text-xs font-semibold text-slate-700 mt-1">
 {mcqQuestions.length} trắc nghiệm • {essayQuestions.length} tự luận
 </span>
 </div>

 <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col">
 <span className="text-[10px] text-slate-400 font-bold uppercase">Độ khó &amp; Thời gian</span>
 <span className="text-xs font-semibold text-slate-700 mt-1 uppercase">
 {quiz.difficulty || "mixed"} • {quiz.time_limit_minutes || 15} phút
 </span>
 </div>

 <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col">
 <span className="text-[10px] text-slate-400 font-bold uppercase">Tổng điểm chuẩn</span>
 <span className={`text-xs font-semibold mt-1 ${isValidTotal ? "text-slate-700" : "text-amber-600"}`}>
 {totalScore} / 10 điểm
 </span>
 </div>
 </div>
 </div>

 {/* Score Validation Banner */}
 <div>
 {isValidTotal ? (
 <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-sm">
 <div className="flex items-center gap-2">
 <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
 <span>Tổng điểm hợp lệ: <strong>10 / 10</strong>. Bài kiểm tra đạt chuẩn quy định 10 điểm.</span>
 </div>
 <span className="px-2.5 py-1 bg-emerald-600 text-white text-[10px] font-bold uppercase rounded-lg">Standard 10.0</span>
 </div>
 ) : isLess ? (
 <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center justify-between shadow-sm">
 <div className="flex items-center gap-2">
 <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" aria-hidden />
 <span>Tổng điểm chưa đủ 10 (Hiện tại: <strong>{totalScore} / 10</strong>). Vui lòng điều chỉnh điểm các câu hỏi.</span>
 </div>
 <div className="flex items-center gap-2">
 <span className="px-2.5 py-1 bg-amber-600 text-white text-[10px] font-bold uppercase rounded-lg">Thiếu {Number((10 - totalScore).toFixed(2))}đ</span>
 {!isEditMode && (
 <button
 type="button"
 onClick={handleStartEdit}
 className="px-3 py-1 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
 >
 <Pencil className="h-3 w-3" aria-hidden /> Sửa điểm ngay
 </button>
 )}
 </div>
 </div>
 ) : (
 <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-bold flex items-center justify-between shadow-sm">
 <div className="flex items-center gap-2">
 <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" aria-hidden />
 <span>Tổng điểm vượt quá 10 (Hiện tại: <strong>{totalScore} / 10</strong>). Vui lòng giảm điểm các câu hỏi.</span>
 </div>
 <div className="flex items-center gap-2">
 <span className="px-2.5 py-1 bg-rose-600 text-white text-[10px] font-bold uppercase rounded-lg">Vượt {Number((totalScore - 10).toFixed(2))}đ</span>
 {!isEditMode && (
 <button
 type="button"
 onClick={handleStartEdit}
 className="px-3 py-1 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
 >
 <Pencil className="h-3 w-3" aria-hidden /> Sửa điểm ngay
 </button>
 )}
 </div>
 </div>
 )}
 </div>

 {/* Questions Section Header */}
 <div className="flex items-center justify-between pt-2">
 <div className="flex items-center gap-3">
 <h2 className="text-lg font-bold text-slate-900">Danh Sách Câu Hỏi ({questionsToDisplay.length})</h2>
 {isEditMode && (
 <span className="px-3 py-1 rounded-lg bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200 flex items-center gap-1.5">
 <Pencil className="h-3 w-3" aria-hidden />
 <span>Đang ở chế độ chỉnh sửa điểm</span>
 </span>
 )}
 </div>

 <div className="flex items-center gap-2">
 <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
 Trắc nghiệm: {mcqQuestions.length}
 </span>
 <span className="px-3 py-1 rounded-lg bg-sky-50 text-sky-700 text-xs font-semibold border border-sky-100">
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
 className={`p-6 md:p-8 rounded-xl bg-white border transition-all duration-200 shadow-sm flex flex-col gap-4 relative ${
 isEditMode ? "border-blue-200 bg-blue-50/10" : "border-slate-200"
 }`}
 >
 {/* Question Header */}
 <div className="flex items-start justify-between gap-4">
 <div className="flex items-center gap-2 flex-wrap">
 <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-lg uppercase tracking-wider">
 Câu {idx + 1}
 </span>
 <span
 className={`px-2.5 py-0.5 text-[11px] font-bold rounded-lg border uppercase ${
 isMcq
 ? "bg-blue-50 text-blue-700 border-blue-100"
 : "bg-sky-50 text-sky-700 border-sky-100"
 }`}
 >
 {isMcq ? "Trắc nghiệm" : "Tự luận"}
 </span>
 <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-[11px] font-semibold rounded-lg uppercase">
 Độ khó: {q.difficulty || "medium"}
 </span>
 </div>

 {/* Point Display / Input field */}
 {isEditMode ? (
 <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50 border border-blue-100">
 <label className="text-xs font-semibold text-blue-700">Điểm tối đa:</label>
 <input
 type="number"
 step="0.25"
 min="0"
 value={currentPoint}
 onChange={(e) => handleUpdateQuestionPoint(idx, parseFloat(e.target.value))}
 className="w-24 p-2 rounded-lg bg-white border border-blue-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500 text-center"
 />
 <span className="text-xs font-bold text-slate-500">đ</span>
 </div>
 ) : (
 <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-lg border border-emerald-200">
 {currentPoint} điểm
 </span>
 )}
 </div>

 {/* Question Text */}
 <h3 className="text-base font-semibold text-slate-900 leading-relaxed">
 {q.content || q.question}
 </h3>
 {isEditMode ? (
 <QuizImageField
 label={`Ảnh câu hỏi ${idx + 1}`}
 purpose="question"
 value={{ url: q.image_url || null, r2_key: q.image_r2_key || null }}
 onChange={(image) => handleUpdateQuestionImage(idx, image)}
 />
 ) : q.image_url ? (
 <img src={q.image_url} alt={`Ảnh câu hỏi ${idx + 1}`} className="max-h-72 rounded-lg border border-slate-200 object-contain" />
 ) : null}

 {/* Multiple Choice Options */}
 {isMcq && (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
 {(() => {
 let opts: Array<{ text: string; isCorrect: boolean; imageUrl?: string | null; imageKey?: string | null }> = [];
 if (Array.isArray(q.answers) && q.answers.length > 0) {
 opts = q.answers.map((a: any) => ({
 text: a.content,
 isCorrect: Boolean(a.is_correct),
 imageUrl: a.image_url,
 imageKey: a.image_r2_key,
 }));
 } else if (Array.isArray(q.options)) {
 opts = q.options.map((optStr: string, optIdx: number) => ({
 text: optStr,
 isCorrect: optIdx === q.correct_answer_index,
 imageUrl: q.answer_images?.[optIdx]?.url,
 imageKey: q.answer_images?.[optIdx]?.r2_key,
 }));
 }

 return opts.map((opt, optIdx) => {
 const letter = String.fromCharCode(65 + optIdx);
 return (
 <div
 key={optIdx}
 className={`p-3.5 rounded-lg border flex items-center justify-between text-xs font-bold transition-all ${
 opt.isCorrect
 ? "bg-emerald-50/70 border-emerald-300 text-emerald-950 shadow-xs"
 : "bg-slate-50 border-slate-200 text-slate-700"
 }`}
 >
 <div className="flex items-center gap-3">
 <span
 className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
 opt.isCorrect
 ? "bg-emerald-600 text-white"
 : "bg-slate-200 text-slate-700"
 }`}
 >
 {letter}
 </span>
 <span>{opt.text}</span>
 {opt.imageUrl && <img src={opt.imageUrl} alt={`Ảnh đáp án ${letter}`} className="h-14 w-20 rounded-lg object-contain" />}
 </div>
 {opt.isCorrect && (
 <span className="px-2.5 py-0.5 rounded-lg bg-emerald-600 text-white text-[10px] font-bold uppercase">
 Đáp án đúng
 </span>
 )}
 {isEditMode && (
 <QuizImageField
 label={`Ảnh đáp án ${letter}`}
 purpose="answer"
 value={{ url: opt.imageUrl || null, r2_key: opt.imageKey || null }}
 onChange={(image) => handleUpdateAnswerImage(idx, optIdx, image)}
 />
 )}
 </div>
 );
 });
 })()}
 </div>
 )}

 {/* Rationale / Explanation for Multiple Choice */}
 {isMcq && q.explanation && (
 <div className="p-4 rounded-lg bg-blue-50/50 border border-blue-100 text-xs flex flex-col gap-1 mt-1">
 <span className="font-semibold text-blue-700 uppercase tracking-wider text-[10px]">
 Giải thích chi tiết (Rationale):
 </span>
 <p className="font-medium text-slate-800 leading-relaxed">{q.explanation}</p>
 </div>
 )}

 {/* Essay Sample Answer & Rubric */}
 {!isMcq && (
 <div className="flex flex-col gap-3 mt-2">
 {q.sample_answer && (
 <div className="p-4 rounded-lg bg-sky-50/50 border border-sky-100 text-xs flex flex-col gap-1">
 <span className="font-semibold text-sky-700 uppercase tracking-wider text-[10px]">
 Gợi ý / Đáp án tham khảo mẫu:
 </span>
 <p className="font-medium text-slate-800 leading-relaxed whitespace-pre-line">
 {q.sample_answer}
 </p>
 </div>
 )}

 <div className="p-4 rounded-lg bg-amber-50/50 border border-amber-200 text-xs flex flex-col gap-1">
 <span className="font-semibold text-amber-800 uppercase tracking-wider text-[10px]">
 Thang điểm / Rubric chấm điểm:
 </span>
 {isEditMode ? (
 <textarea
 value={q.rubric || ""}
 onChange={(e) => handleUpdateQuestionRubric(idx, e.target.value)}
 rows={3}
 className="w-full p-3 rounded-lg border border-amber-300 bg-white text-xs font-medium text-amber-950 focus:outline-none focus:border-amber-500 mt-1"
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
 <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xl flex items-center justify-between sticky bottom-4 z-40 animate-fadeIn">
 <div className="flex items-center gap-3">
 <span className="text-xs font-semibold text-slate-900">Cập nhật tổng điểm:</span>
 <span className={`text-sm font-bold px-3 py-1 rounded-lg border ${
 isValidTotal ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-amber-50 border-amber-200 text-amber-800"
 }`}>
 {totalScore} / 10 điểm
 </span>
 {!isValidTotal && (
 <span className="text-xs font-bold text-amber-800 flex items-center gap-1">
 <AlertTriangle className="h-3.5 w-3.5" aria-hidden /> Tổng điểm phải bằng 10 để lưu.
 </span>
 )}
 </div>

 <div className="flex items-center gap-3">
 <button
 type="button"
 onClick={handleCancelEdit}
 disabled={isSavingPoints}
 className="px-5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-all cursor-pointer"
 >
 Hủy
 </button>
 <button
 type="button"
 onClick={handleSavePoints}
 disabled={!isValidTotal || isSavingPoints}
 className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
 >
 {isSavingPoints ? (
 <>
 <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
 <span>Đang lưu điểm...</span>
 </>
 ) : (
 <>
 <Save className="h-4 w-4" aria-hidden />
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
 <div className="bg-white rounded-xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-200 flex flex-col gap-5">
 <div className="flex items-center gap-3 text-rose-600">
 <div className="w-10 h-10 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center">
 <AlertTriangle className="h-5 w-5" aria-hidden />
 </div>
 <div>
 <h3 className="text-base font-bold text-slate-900">Xác nhận xóa đề kiểm tra</h3>
 <p className="text-xs text-slate-500 font-medium">Hành động này không thể hoàn tác.</p>
 </div>
 </div>

 <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs flex flex-col gap-1.5">
 <span className="font-semibold text-slate-900">Bạn có chắc muốn xóa đề kiểm tra này?</span>
 <span className="font-bold text-blue-500">Đề: {quiz.title}</span>
 </div>

 {deleteError && (
 <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold space-y-2">
 <div className="flex items-start gap-1.5"><AlertTriangle className="h-4 w-4 shrink-0" aria-hidden /><span>{deleteError}</span></div>
 {deleteError.includes("gắn vào khóa học") && (
 <button
 type="button"
 onClick={() => handleDelete(true)}
 disabled={isDeleting}
 className="mt-2 w-full py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
 >
 <Trash2 className="h-4 w-4" aria-hidden />
 <span>Gỡ khỏi khóa học &amp; Xóa ngay</span>
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
 className="px-5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-all cursor-pointer"
 >
 Hủy
 </button>
 <button
 type="button"
 onClick={() => handleDelete()}
 disabled={isDeleting}
 className="px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
 >
 {isDeleting ? (
 <>
 <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
 <span>Đang xóa...</span>
 </>
 ) : (
 <>
 <Trash2 className="h-4 w-4" aria-hidden />
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
