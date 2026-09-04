"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useGetPracticeOverview } from "../../api";
import { SelfAssessmentModal } from "../self-assessment/SelfAssessmentModal";
import toast from "react-hot-toast";

export function QuizStartContent() {
 const { data, isLoading, isError } = useGetPracticeOverview();
 const [selectedModId, setSelectedModId] = useState<string>("ai_generator");
 const [isSelfAssessmentOpen, setIsSelfAssessmentOpen] = useState<boolean>(false);

 // State cho Form AI Generator
 const [topic, setTopic] = useState("");
 const [title, setTitle] = useState("");
 const [questionCount, setQuestionCount] = useState<number>(10);
 const [difficulty, setDifficulty] = useState<string>("Trung bình");
 const [questionTypes, setQuestionTypes] = useState<string[]>(["Trắc nghiệm"]);
 const [timeLimit, setTimeLimit] = useState<number>(15);
 const [customPrompt, setCustomPrompt] = useState("");
 
 const [isGenerating, setIsGenerating] = useState(false);
 const [generatedQuiz, setGeneratedQuiz] = useState<any>(null);

 // State cho Lịch sử Đề AI cá nhân & Modal Xem Lại
 const [myHistoryQuizzes, setMyHistoryQuizzes] = useState<any[]>([]);
 const [reviewingQuiz, setReviewingQuiz] = useState<any>(null);

 const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/api\/?$/, "");

 // Hàm load lịch sử đề thi
 const fetchMyHistory = async () => {
 try {
 const res = await fetch(`${baseUrl}/api/student/practice/ai-quizzes/history`, {
 method: "GET",
 headers: {
 "Accept": "application/json",
 "Content-Type": "application/json",
 },
 });

 if (res.ok) {
 const json = await res.json();
 setMyHistoryQuizzes(json.data || []);
 }
 } catch (e) {
 console.warn("Chưa lấy được lịch sử bài thi:", e);
 }
 };

 // Hàm xóa đề thi khỏi lịch sử
 const handleDeleteQuiz = async (quizId: number | string, e: React.MouseEvent) => {
 e.stopPropagation();
 if (!confirm("Bạn có chắc chắn muốn xóa bài kiểm tra này không?")) return;

 try {
 const res = await fetch(`${baseUrl}/api/student/practice/ai-quizzes/${quizId}`, {
 method: "DELETE",
 headers: {
 "Accept": "application/json",
 "Content-Type": "application/json",
 },
 });

 if (res.ok) {
 setMyHistoryQuizzes((prev) => prev.filter((q) => q.id !== quizId));
 if (reviewingQuiz?.id === quizId) setReviewingQuiz(null);
 } else {
 toast.error("Xóa bài thi thất bại!");
 }
 } catch (err) {
 console.error(err);
 toast.error("Đã xảy ra lỗi khi xóa bài thi.");
 }
 };

 useEffect(() => {
 fetchMyHistory();
 }, []);

 const defaultModules = [
 {
 id: "ai_generator",
 title: "Khảo Sát Động: Tự Tạo Bộ Đề Đánh Giá Cùng AI ",
 badge_title: "AI On-Demand • Tự Động",
 course_title: "Trí Tuệ Nhân Tạo Sinh Đề",
 description: "Nhập chủ đề bất kỳ để Gia sư AI thiết kế một bộ đề khảo sát riêng biệt, lưu trữ lịch sử và chấm điểm chi tiết cho riêng bạn.",
 time_limit_minutes: 15,
 questions_count: 10,
 passing_percentage: 70,
 },
 {
 id: "mod1",
 title: "Kiểm tra Nền tảng: Mạng Thần Kinh & Deep Learning",
 badge_title: "Đánh giá Năng lực • Module 1",
 course_title: "AI & Neural Network Foundations",
 description: "Kiểm nghiệm vững chắc tư duy kiến trúc Mạng Thần Kinh (ANN/CNN), cơ chế Attention trong Transformer.",
 time_limit_minutes: 15,
 questions_count: 10,
 passing_percentage: 70,
 },
 {
 id: "mod2",
 title: "Kiểm tra Chuyên môn: Next.js 15 & React 19 Server Actions",
 badge_title: "Đánh giá Năng lực • Module 2",
 course_title: "Modern Next.js 15 & React 19",
 description: "Đọ sức sâu với cơ chế React 19 Actions, useActionState, Suspense Boundaries.",
 time_limit_minutes: 15,
 questions_count: 10,
 passing_percentage: 70,
 },
 {
 id: "mod3",
 title: "Kiểm tra Chuyên sâu: Bảo mật, Middleware & Rate Limiting",
 badge_title: "Đánh giá Năng lực • Module 3",
 course_title: "Next.js 15 Security & Scaling",
 description: "Phân tích khả năng thiết lập tường lửa Middleware, quản lý token bảo mật Sanctum/JWT.",
 time_limit_minutes: 15,
 questions_count: 10,
 passing_percentage: 70,
 }
 ];

 const currentMod = defaultModules.find(m => String(m.id) === String(selectedModId)) || defaultModules[0];
 const isAiSelected = selectedModId === "ai_generator";

 const handleToggleType = (type: string) => {
 if (questionTypes.includes(type)) {
 if (questionTypes.length > 1) setQuestionTypes(questionTypes.filter(t => t !== type));
 } else {
 setQuestionTypes([...questionTypes, type]);
 }
 };

 const handleGenerateAiQuiz = async () => {
 if (!topic.trim()) {
 toast("Vui lòng nhập chủ đề bạn muốn kiểm tra!");
 return;
 }

 setIsGenerating(true);
 try {
 const res = await fetch(`${baseUrl}/api/student/practice/generate-ai-quiz`, {
 method: "POST",
 headers: {
 "Accept": "application/json",
 "Content-Type": "application/json",
 },
 body: JSON.stringify({
 topic,
 title: title || undefined,
 question_count: questionCount,
 difficulty,
 question_types: questionTypes,
 time_limit_minutes: timeLimit,
 custom_prompt: customPrompt || undefined,
 }),
 });

 const json = await res.json();
 if (res.ok && json.data) {
 setGeneratedQuiz(json.data);
 fetchMyHistory();
 } else {
 toast.error(json.message || "Tạo đề thi thất bại, vui lòng thử lại!");
 }
 } catch (err: any) {
 console.error(err);
 toast.error("Đã xảy ra lỗi kết nối đến máy chủ.");
 } finally {
 setIsGenerating(false);
 }
 };

 return (
 <div className="p-6 md:p-8 max-w-[1400px] mx-auto min-h-full flex flex-col gap-8 bg-[#F8F9FC]">

 {/* Hero Banner */}
 <section className="relative overflow-hidden rounded-2xl bg-[#FEFCF9] border border-[#E8E2D9] p-6 sm:p-8 shadow-sm">
 <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
 <div className="space-y-3 max-w-2xl">
 <div className="flex items-center gap-2 text-xs font-medium text-[#8A8478]">
 <Link href="/courses" className="hover:text-[#C0392B] transition-colors">Khoá học của tôi</Link>
 <span>•</span>
 <span className="text-[#2C3039] font-semibold bg-[#EAF8F5] px-2.5 py-0.5 rounded-full border border-[#2C3039]/20">
 Trung tâm Kiểm tra &amp; Đánh giá
 </span>
 </div>

 <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E8E2D9] text-xs font-semibold text-[#C0392B] shadow-sm">
 <span className="w-2 h-2 rounded-full bg-[#2C3039] animate-ping" />
 <span className="w-2 h-2 rounded-full bg-[#2C3039] absolute" />
 Ngân hàng đề thi AI &amp; Khảo sát Động
 </div>

 <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2C3039] leading-tight">
 Trung tâm Kiểm tra &amp; Đánh giá:{" "}
 <span className="text-[#C0392B] font-bold">
 AI &amp; Fullstack
 </span>
 </h1>
 <p className="text-xs sm:text-sm text-[#8A8478]">
 Tự do tạo đề thi theo sở thích, theo dõi lịch sử làm bài và nhận phân tích chi tiết từ Gia sư AI.
 </p>
 </div>
 </div>
 </section>

 {/* Module Selector */}
 <div className="space-y-3.5">
 <div className="flex items-center justify-between px-1">
 <h2 className="text-base sm:text-lg font-semibold text-[#2C3039]">Danh sách Chuyên đề Đánh giá</h2>
 <span className="text-xs text-[#8A8478]">Chọn chuyên đề cố định hoặc tạo đề tùy biến với AI</span>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
 {defaultModules.map((mod, index) => {
 const isSelected = String(mod.id) === String(selectedModId);
 const isSpecialAi = mod.id === "ai_generator";

 return (
 <div
 key={String(mod.id)}
 onClick={() => {
 setSelectedModId(String(mod.id));
 if (!isSpecialAi) setGeneratedQuiz(null);
 }}
 className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
 isSelected
 ? "bg-white border-[#C0392B] shadow-md ring-2 ring-[#C0392B] -translate-y-1"
 : isSpecialAi 
 ? " from-[#F5F3FF] to-white border-[#C7D2FE] hover:border-[#C0392B]" 
 : "bg-white border-[#E8E2D9] hover:shadow-sm"
 }`}
 >
 <div className="space-y-4">
 <div className="flex items-center justify-between">

 <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${isSelected ? "bg-[#C0392B] text-white" : isSpecialAi ? "bg-[#FAF7F2] text-[#C0392B]" : "bg-[#F1F5F9] text-[#64748B]"}`}>
 {isSpecialAi ? "AI Tùy Biến" : `Module ${index}`}
 </span>
 </div>

 <div>
 <span className="text-[11px] font-semibold text-[#8A8478] uppercase tracking-wider block mb-1">
 {isSpecialAi ? " TỰ DO TẠO ĐỀ" : mod.course_title}
 </span>
 <h3 className="text-sm font-bold text-[#2C3039] leading-snug line-clamp-2">
 {mod.title.replace(/^Kiểm tra [^:]+:\s*/, "")}
 </h3>
 </div>
 </div>

 <div className="mt-5 pt-3 border-t border-[#F0F2F8] flex items-center justify-between text-xs text-[#8A8478]">
 <span>{isSpecialAi ? " Linh hoạt" : `${mod.time_limit_minutes} phút`}</span>
 <span className="text-[#C0392B] font-semibold">{isSpecialAi ? " Đề AI" : `${mod.questions_count} câu`}</span>
 </div>
 </div>
 );
 })}
 </div>
 </div>

 {/* Main Workspace (8 cols trái + 4 cols phải) */}
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
 
 {/* Left Area (8 cols): Form tạo đề hoặc Preview */}
 <div className="lg:col-span-8 flex flex-col gap-6 w-full">
 {isAiSelected ? (
 <div className="bg-white rounded-2xl p-7 border border-[#E8E2D9] shadow-sm space-y-6">
 {!generatedQuiz ? (
 <>
 <div className="border-b border-[#F0F2F8] pb-4">
 <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FAF7F2] text-[#C0392B] border border-[#C0392B]/20 inline-block mb-1.5">
 Thiết lập Đề thi AI
 </span>
 <h2 className="text-xl font-bold text-[#2C3039]">Nhập Thông Tin Để AI Soạn Đề Cho Bạn</h2>
 </div>

 {/* 1. Thông tin chính */}
 <div className="space-y-4">
 <div>
 <label className="text-xs font-bold text-[#374151] block mb-1.5">1. Chủ đề bài kiểm tra <span className="text-red-500">*</span></label>
 <input
 type="text"
 placeholder="Ví dụ: React Hooks, Vue 3 Composition API, Laravel Authentication, Toán 12..."
 value={topic}
 onChange={(e) => setTopic(e.target.value)}
 className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#C0392B]"
 />
 </div>

 <div>
 <label className="text-xs font-bold text-[#374151] block mb-1.5">Tên bài kiểm tra <span className="text-xs font-normal text-[#94A3B8]">(Để trống AI sẽ tự đặt)</span></label>
 <input
 type="text"
 placeholder="Ví dụ: Khảo sát kiến thức chuyên sâu"
 value={title}
 onChange={(e) => setTitle(e.target.value)}
 className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#C0392B]"
 />
 </div>
 </div>

 {/* 2 & 3. Số câu & Độ khó */}
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
 <div>
 <label className="text-xs font-bold text-[#374151] block mb-2">2. Số lượng câu hỏi</label>
 <div className="flex gap-2">
 {[5, 10, 15, 20].map((num) => (
 <button
 key={num}
 type="button"
 onClick={() => setQuestionCount(num)}
 className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${questionCount === num ? "bg-[#C0392B] text-white border-[#C0392B]" : "bg-[#F8FAFC] text-[#475569] border-[#E2E8F0]"}`}
 >
 {num} câu
 </button>
 ))}
 </div>
 </div>

 <div>
 <label className="text-xs font-bold text-[#374151] block mb-2">3. Chọn độ khó</label>
 <div className="grid grid-cols-4 gap-2">
 {[
 { label: "Dễ", colorClass: "bg-[#27AE60]" },
 { label: "Trung bình", colorClass: "bg-[#F59E0B]" },
 { label: "Khó", colorClass: "bg-[#E11D48]" },
 { label: "Ngẫu nhiên", colorClass: "bg-[#64748B]" }
 ].map((d) => (
 <button
 key={d.label}
 type="button"
 onClick={() => setDifficulty(d.label)}
 className={`py-2 rounded-xl text-[11px] font-bold border flex flex-col items-center gap-1 cursor-pointer ${difficulty === d.label ? "bg-[#C0392B] text-white border-[#C0392B]" : "bg-[#F8FAFC] text-[#475569] border-[#E2E8F0]"}`}
 >
 <span className={`w-2.5 h-2.5 rounded-full ${d.colorClass}`}></span>
 <span>{d.label}</span>
 </button>
 ))}
 </div>
 </div>
 </div>

 {/* 4. Dạng câu hỏi */}
 <div className="pt-2">
 <label className="text-xs font-bold text-[#374151] block mb-2">4. Dạng câu hỏi</label>
 <div className="flex flex-wrap gap-2.5">
 {["Trắc nghiệm", "Đúng / Sai", "Điền vào chỗ trống", "Tự luận ngắn"].map((type) => {
 const isChecked = questionTypes.includes(type);
 return (
 <button
 key={type}
 type="button"
 onClick={() => handleToggleType(type)}
 className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 cursor-pointer ${isChecked ? "bg-[#FAF7F2] border-[#C0392B] text-[#C0392B]" : "bg-white border-[#E2E8F0] text-[#64748B]"}`}
 >
 <span>{isChecked ? "" : "○"}</span>
 {type}
 </button>
 );
 })}
 </div>
 </div>

 {/* 5. Thời gian làm bài */}
 <div className="pt-2">
 <label className="text-xs font-bold text-[#374151] block mb-2">5. Thời gian làm bài</label>
 <div className="flex flex-wrap gap-2">
 {[
 { label: "Không giới hạn", value: 0 },
 { label: "5 phút", value: 5 },
 { label: "10 phút", value: 10 },
 { label: "15 phút", value: 15 },
 { label: "30 phút", value: 30 },
 ].map((t) => (
 <button
 key={t.label}
 type="button"
 onClick={() => setTimeLimit(t.value)}
 className={`px-4 py-2 rounded-xl text-xs font-semibold border cursor-pointer ${timeLimit === t.value ? "bg-[#2C3039] text-white border-[#2C3039]" : "bg-[#F8FAFC] text-[#475569] border-[#E2E8F0]"}`}
 >
 {t.label}
 </button>
 ))}
 </div>
 </div>

 {/* 6. Yêu cầu thêm */}
 <div className="pt-2">
 <label className="text-xs font-bold text-[#374151] block mb-1.5">6. Yêu cầu thêm cho AI</label>
 <textarea
 rows={3}
 placeholder="Ví dụ: Ưu tiên các bài toán thực tế, giải thích chi tiết..."
 value={customPrompt}
 onChange={(e) => setCustomPrompt(e.target.value)}
 className="w-full p-3.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#C0392B]"
 />
 </div>

 {/* Nút Tạo Đề */}
 <button
 type="button"
 disabled={isGenerating}
 onClick={handleGenerateAiQuiz}
 className="w-full py-4 bg-[#C0392B] text-white font-bold rounded-xl text-sm shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
 >
 {isGenerating ? (
 <>
 <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
 <span>AI Đang Soạn Đề &amp; Lưu Vào CSDL...</span>
 </>
 ) : (
 <>
 <span> Xác Nhận &amp; Khởi Tạo Bộ Đề Với AI</span>
 <span></span>
 </>
 )}
 </button>
 </>
 ) : (
 /* Card sau khi tạo đề thành công */
 <div className="space-y-6">
 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
 <div className="space-y-2 max-w-xl">
 <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EAF8F5] text-[#2C3039] border border-[#2C3039]/20 inline-block">
 Bộ Đề AI Đã Lưu Thành Công
 </span>
 <h2 className="text-xl sm:text-2xl font-bold text-[#2C3039]">
 {generatedQuiz.title}
 </h2>
 <p className="text-xs text-[#8A8478]">
 Chủ đề: <span className="font-medium text-[#C0392B]">{generatedQuiz.topic}</span>
 </p>
 </div>

 <Link href={`/practice/quiz/question?aiQuizId=${generatedQuiz.id}`} className="w-full sm:w-auto">
 <button type="button" className="w-full sm:w-auto px-7 py-3.5 bg-[#2C3039] text-white font-bold rounded-xl text-xs sm:text-sm shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer">
 <span> Bắt Đầu Làm Bài Ngay</span>
 <span></span>
 </button>
 </Link>
 </div>

 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
 <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E8E2D9]">
 <span className="text-xs text-[#8A8478] block mb-1">Số câu hỏi</span>
 <span className="text-base font-bold text-[#2C3039]">{generatedQuiz.questions_count} Câu</span>
 </div>
 <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E8E2D9]">
 <span className="text-xs text-[#8A8478] block mb-1">Thời gian</span>
 <span className="text-base font-bold text-[#2C3039]">{generatedQuiz.time_limit_minutes > 0 ? `${generatedQuiz.time_limit_minutes} Phút` : "Tự do"}</span>
 </div>
 <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E8E2D9]">
 <span className="text-xs text-[#8A8478] block mb-1">Độ khó</span>
 <span className="text-base font-bold text-[#C0392B]">{generatedQuiz.difficulty}</span>
 </div>
 <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E8E2D9]">
 <span className="text-xs text-[#8A8478] block mb-1">Cơ chế</span>
 <span className="text-sm font-semibold text-[#2C3039]">AI Chấm Điểm</span>
 </div>
 </div>

 <p className="text-sm text-[#374151] leading-relaxed">
 {generatedQuiz.description}
 </p>

 <button
 type="button"
 onClick={() => setGeneratedQuiz(null)}
 className="text-xs font-semibold text-[#C0392B] hover:underline cursor-pointer"
 >
 ← Tạo một bộ đề khác
 </button>
 </div>
 )}
 </div>
 ) : (
 /* Module có sẵn */
 <div className="bg-white rounded-2xl p-7 border border-[#E8E2D9] shadow-sm space-y-7">
 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
 <div className="space-y-2 max-w-xl">
 <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#EAF8F5] text-[#2C3039] border border-[#2C3039]/20 inline-block">
 {currentMod.badge_title}
 </span>
 <h2 className="text-xl sm:text-2xl font-semibold text-[#2C3039]">
 {currentMod.title}
 </h2>
 <p className="text-xs text-[#8A8478]">
 Chương trình: <span className="font-medium text-[#C0392B]">{currentMod.course_title}</span>
 </p>
 </div>

 <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto shrink-0">
 <button
 type="button"
 onClick={() => setIsSelfAssessmentOpen(true)}
 className="px-5 py-3.5 bg-white border border-[#2C3039]/40 hover:bg-[#EAF8F5] text-[#2C3039] font-bold rounded-xl text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
 >
 <span> Đánh giá năng lực AI (Tự luyện)</span>
 </button>

 <Link href={`/practice/quiz/question?lessonId=${currentMod.id}`} className="w-full sm:w-auto shrink-0">
 <button type="button" className="w-full sm:w-auto px-7 py-3.5 bg-[#C0392B] text-white font-semibold rounded-xl text-xs sm:text-sm shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer">
 <span> Bắt Đầu Làm Bài Ngay</span>
 <span></span>
 </button>
 </Link>
 </div>
 </div>

 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
 <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E8E2D9]">
 <span className="text-xs text-[#8A8478] block mb-1">Số câu hỏi</span>
 <span className="text-base font-bold text-[#2C3039]">{currentMod.questions_count} Câu</span>
 </div>
 <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E8E2D9]">
 <span className="text-xs text-[#8A8478] block mb-1">Thời gian</span>
 <span className="text-base font-bold text-[#2C3039]">{currentMod.time_limit_minutes} Phút</span>
 </div>
 <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E8E2D9]">
 <span className="text-xs text-[#8A8478] block mb-1">Điều kiện đạt</span>
 <span className="text-base font-bold text-[#2C3039]">{currentMod.passing_percentage}% Chuẩn</span>
 </div>
 <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E8E2D9]">
 <span className="text-xs text-[#8A8478] block mb-1">Cơ chế</span>
 <span className="text-sm font-semibold text-[#C0392B]">Xáo trộn đề</span>
 </div>
 </div>

 <p className="text-sm text-[#374151] leading-relaxed">
 {currentMod.description}
 </p>
 </div>
 )}

 {/* Hướng dẫn chung */}
 <div className="bg-white rounded-2xl p-7 border border-[#E8E2D9] shadow-sm space-y-4">
 <div className="flex items-center gap-2 border-b border-[#F0F2F8] pb-3">
 <span></span>
 <h3 className="text-base font-semibold text-[#2C3039]">Hướng dẫn &amp; Quy định kiểm tra</h3>
 </div>
 <div className="space-y-2 text-xs sm:text-sm text-[#475569]">
 <p>• Các đề thi do AI tạo sẽ được tự động lưu vào danh mục lịch sử cá nhân ở góc bên phải.</p>
 <p>• Bất kỳ lúc nào bạn cũng có thể bấm vào từng đề cũ để xem lại đáp án và giải thích chi tiết của AI.</p>
 </div>
 </div>
 </div>

 {/* Right Area (4 cols): LỊCH SỬ ĐỀ AI CỦA BẠN & XEM LẠI */}
 <div className="lg:col-span-4 flex flex-col gap-6 w-full">
 <div className="bg-white rounded-2xl p-6 border border-[#E8E2D9] shadow-sm space-y-5">
 <div className="flex items-center justify-between border-b border-[#F0F2F8] pb-3.5">
 <div className="flex items-center gap-2">
 <span className="text-base"></span>
 <h3 className="text-sm font-bold text-[#2C3039]">Lịch Sử Đề AI Của Bạn</h3>
 </div>
 <span className="text-[11px] font-semibold text-[#C0392B] bg-[#FAF7F2] px-2.5 py-0.5 rounded-full">
 {myHistoryQuizzes.length} đề
 </span>
 </div>

 {myHistoryQuizzes.length === 0 ? (
 <div className="text-center py-8 text-xs text-[#94A3B8] space-y-2">
 <p>Bạn chưa tạo bài kiểm tra AI nào.</p>
 <p className="text-[11px] text-[#C0392B]">Hãy tạo thử 1 đề ở cột bên trái nhé!</p>
 </div>
 ) : (
 <div className="flex flex-col gap-3 max-h-[480px] overflow-y-auto pr-1">
 {myHistoryQuizzes.map((quiz) => (
 <div
 key={quiz.id}
 className="p-3.5 rounded-xl border border-[#E8E2D9] bg-[#F8FAFC] hover:border-[#C0392B]/40 hover:bg-white transition-all flex flex-col gap-2.5 group relative"
 >
 <div className="flex items-start justify-between gap-2">
 <h4 className="text-xs font-bold text-[#2C3039] line-clamp-1 group-hover:text-[#C0392B]">
 {quiz.title}
 </h4>
 <div className="flex items-center gap-1.5 shrink-0">
 {quiz.is_completed ? (
 <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${quiz.score >= 70 ? "bg-[#FAF7F2] text-[#2C3039]" : "bg-[#FAF7F2] text-[#C0392B]"}`}>
 {quiz.score}%
 </span>
 ) : (
 <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#F5F0E8] text-[#D97706]">
 Chưa làm
 </span>
 )}

 {/* Nút Xóa bài thi */}
 <button
 type="button"
 onClick={(e) => handleDeleteQuiz(quiz.id, e)}
 title="Xóa bài thi này"
 className="w-6 h-6 rounded-lg flex items-center justify-center text-[#94A3B8] hover:text-[#C0392B] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
 >
 <></>
 </button>
 </div>
 </div>

 <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-1 border-t border-[#F0F2F8]">
 <span>{quiz.questions_count} câu • {quiz.difficulty}</span>

 <div className="flex items-center gap-3">
 {quiz.is_completed ? (
 <>
 <button
 type="button"
 onClick={() => setReviewingQuiz(quiz)}
 className="text-[11px] font-bold text-[#C0392B] hover:underline cursor-pointer flex items-center gap-1"
 >
 <span>️</span> Xem lại
 </button>
 <Link
 href={`/practice/quiz/question?aiQuizId=${quiz.id}`}
 className="text-[11px] font-bold text-[#2C3039] hover:underline flex items-center gap-1"
 >
 <span></span> Làm lại
 </Link>
 </>
 ) : (
 <Link
 href={`/practice/quiz/question?aiQuizId=${quiz.id}`}
 className="text-[11px] font-bold text-[#2C3039] hover:underline flex items-center gap-1"
 >
 Làm bài 
 </Link>
 )}
 </div>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 </div>

 </div>

 {/* Modal Tự Luyện AI (Self Assessment Modal) */}
 <SelfAssessmentModal
 courseId={currentMod.id}
 courseTitle={currentMod.course_title || currentMod.title}
 isOpen={isSelfAssessmentOpen}
 onClose={() => setIsSelfAssessmentOpen(false)}
 />

 {/* ─── MODAL XEM LẠI BÀI THI CHI TIẾT ─── */}
 {reviewingQuiz && (
 <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
 <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#E8E2D9] overflow-hidden animate-in fade-in zoom-in duration-200">

 {/* Modal Header */}
 <div className="p-6 border-b border-[#F0F2F8] flex items-center justify-between from-[#EEF2FF] to-white">
 <div>
 <span className="text-xs font-bold text-[#C0392B] uppercase tracking-wider">Xem lại kết quả bài thi</span>
 <h3 className="text-lg font-bold text-[#2C3039]">{reviewingQuiz.title}</h3>
 <p className="text-xs text-[#64748B] mt-0.5">
 Điểm số: <strong className={reviewingQuiz.score >= 70 ? "text-[#2C3039]" : "text-[#C0392B]"}>{reviewingQuiz.score}%</strong> 
 {" • "} Đúng: {reviewingQuiz.correct_count || 0}/{reviewingQuiz.questions_count} câu
 </p>
 </div>
 <button
 type="button"
 onClick={() => setReviewingQuiz(null)}
 className="w-9 h-9 rounded-full bg-white border border-[#E8E2D9] flex items-center justify-center text-sm font-bold text-[#64748B] hover:bg-[#FAF7F2] hover:text-[#C0392B] transition-all cursor-pointer"
 >
 
 </button>
 </div>

 {/* Modal Body */}
 <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-[#F8FAFC]">
 {reviewingQuiz.questions_data?.map((q: any, idx: number) => {
 const userAns = reviewingQuiz.user_answers?.[String(q.id)] || "";
 const rawCorrect = q.correct_answer || "";
 const type = q.type || (q.options && q.options.length > 0 ? "multiple_choice" : "essay");

 let isCorrect = false;
 const cleanUserLetter = userAns.trim().charAt(0).toUpperCase();
 const cleanCorrectLetter = String(rawCorrect).trim().charAt(0).toUpperCase();

 if (type === "multiple_choice" || type === "true_false") {
 isCorrect = cleanUserLetter !== "" && cleanUserLetter === cleanCorrectLetter;
 } else if (type === "fill_blank") {
 const u = userAns.trim().toLowerCase();
 const c = String(rawCorrect).trim().toLowerCase();
 isCorrect = u !== "" && (u === c || c.includes(u));
 } else if (type === "essay") {
 isCorrect = userAns.trim().length >= 8;
 }

 const isEssayOrFill = type === "essay" || type === "fill_blank" || (!q.options || q.options.length === 0);

 return (
 <div key={q.id || idx} className="p-5 rounded-2xl bg-white border border-[#E8E2D9] shadow-xs space-y-3.5">
 <div className="flex items-start justify-between gap-3">
 <h4 className="text-sm font-bold text-[#2C3039] leading-relaxed">
 Câu {idx + 1}: {q.question}
 </h4>
 <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full shrink-0 ${isCorrect ? "bg-[#FAF7F2] text-[#2C3039]" : "bg-[#FAF7F2] text-[#C0392B]"}`}>
 {isCorrect ? " Đúng" : " Sai"}
 </span>
 </div>

 {isEssayOrFill ? (
 <div className="space-y-2 text-xs">
 <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
 <span className="font-semibold text-[#64748B] block mb-1">️ Bài làm của bạn:</span>
 <p className="text-[#2C3039]">{userAns || <em className="text-[#94A3B8]">Chưa nhập câu trả lời</em>}</p>
 </div>
 <div className="p-3 rounded-xl bg-[#FAF7F2]/40 border border-[#2C3039]/30">
 <span className="font-semibold text-[#065F46] block mb-1"> Đáp án chuẩn / Hướng dẫn:</span>
 <p className="text-[#065F46] font-medium">{rawCorrect}</p>
 </div>
 </div>
 ) : (
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
 {q.options?.map((opt: string, optIdx: number) => {
 const optKey = opt.trim().charAt(0).toUpperCase();
 const isChosen = cleanUserLetter === optKey;
 const isRightKey = cleanCorrectLetter === optKey;

 let optStyle = "bg-[#F8FAFC] border-[#E8E2D9] text-[#475569]";
 if (isRightKey) {
 optStyle = "bg-[#FAF7F2]/70 border-[#2C3039] text-[#065F46] font-bold";
 } else if (isChosen && !isRightKey) {
 optStyle = "bg-[#FAF7F2]/70 border-[#C0392B] text-[#991B1B] font-bold";
 }

 return (
 <div key={optIdx} className={`p-3 rounded-xl border text-xs flex items-center justify-between transition-all ${optStyle}`}>
 <span>{opt}</span>
 {isChosen && (
 <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isRightKey ? "bg-[#2C3039] text-white" : "bg-[#C0392B] text-white"}`}>
 Bạn chọn
 </span>
 )}
 </div>
 );
 })}
 </div>
 )}

 {q.explanation && (
 <div className="p-3.5 rounded-xl bg-[#FAF7F2]/70 border border-[#C0392B]/20 text-xs text-[#374151] space-y-1">
 <span className="font-bold text-[#C0392B] block"> Lời giải thích của AI:</span>
 <p className="leading-relaxed">{q.explanation}</p>
 </div>
 )}
 </div>
 );
 })}
 </div>

 {/* Modal Footer */}
 <div className="p-4 border-t border-[#F0F2F8] bg-white flex justify-end">
 <button
 type="button"
 onClick={() => setReviewingQuiz(null)}
 className="px-6 py-2.5 rounded-xl bg-[#C0392B] text-white text-xs font-bold hover:opacity-90 cursor-pointer"
 >
 Đóng
 </button>
 </div>

 </div>
 </div>
 )}

 </div>
 );
}