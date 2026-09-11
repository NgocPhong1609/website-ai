"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useGetPracticeOverview } from "../../api";
import { SelfAssessmentModal } from "../self-assessment/SelfAssessmentModal";
import toast from "react-hot-toast";
import { Sparkles, Brain, History, Settings, X, Clock, ListChecks, Wand2, FileText, CheckCircle2, XCircle, ArrowRight, BookOpen, Trash2, Eye, PlayCircle } from "lucide-react";

export function QuizStartContent() {
  const { data, isLoading, isError } = useGetPracticeOverview();
  const [selectedModId, setSelectedModId] = useState<string>("ai_generator");
  const [isSelfAssessmentOpen, setIsSelfAssessmentOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"ai_generator" | "default_modules" | "history">("ai_generator");

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
        toast.success("Đã xóa bài thi");
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
      title: "Khảo Sát Động: Tự Tạo Bộ Đề Đánh Giá Cùng AI",
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
    <div className="p-6 md:p-8 max-w-[1200px] mx-auto min-h-[85vh] flex flex-col gap-8 bg-white">
      
      {/* Header & Tabs Navigation */}
      <div className="space-y-6 text-center mt-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Trung tâm Kiểm tra & Đánh giá</h1>
          <p className="text-[15px] text-muted-foreground mt-3">Nền tảng đánh giá năng lực thông minh được cung cấp bởi Gia sư Nova.</p>
        </div>

        <div className="flex items-center justify-center gap-8 border-b border-border">
          <button
            onClick={() => setActiveTab("ai_generator")}
            className={`pb-3 text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === "ai_generator"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Wand2 className="w-4 h-4" />
            Khởi tạo Đề AI
          </button>
          <button
            onClick={() => setActiveTab("default_modules")}
            className={`pb-3 text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === "default_modules"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Chuyên đề Mặc định
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`pb-3 text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === "history"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <History className="w-4 h-4" />
            Lịch sử & Báo cáo
          </button>
        </div>
      </div>

      {/* TAB CONTENT: AI GENERATOR */}
      {activeTab === "ai_generator" && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-3xl mx-auto w-full">
          {!generatedQuiz ? (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-600" />
                  Cấu hình Đề thi AI
                </h2>
                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-bold text-foreground block mb-2">Chủ đề bài kiểm tra *</label>
                    <input
                      type="text"
                      placeholder="Ví dụ: React Hooks, Toán 12, Lịch sử thế giới..."
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-foreground placeholder:text-stone-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-foreground block mb-2">Tên bài kiểm tra <span className="font-normal text-muted-foreground">(Tùy chọn)</span></label>
                    <input
                      type="text"
                      placeholder="Ví dụ: Khảo sát kiến thức chuyên sâu"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-foreground placeholder:text-stone-400"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-3">Số lượng câu hỏi</label>
                  <div className="flex gap-3">
                    {[5, 10, 15, 20].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setQuestionCount(num)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
                          questionCount === num ? "bg-blue-600-muted text-blue-600 border-blue-200 shadow-sm" : "bg-white text-muted-foreground border-border hover:border-blue-300 hover:bg-blue-600-muted/50"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-3">Độ khó</label>
                  <div className="grid grid-cols-2 gap-3">
                    {["Dễ", "Trung bình", "Khó", "Ngẫu nhiên"].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDifficulty(d)}
                        className={`py-2.5 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
                          difficulty === d ? "bg-blue-600-muted text-blue-600 border-blue-200 shadow-sm" : "bg-white text-muted-foreground border-border hover:border-blue-300 hover:bg-blue-600-muted/50"
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-3">Dạng câu hỏi</label>
                <div className="flex flex-wrap gap-3">
                  {["Trắc nghiệm", "Đúng / Sai", "Điền vào chỗ trống", "Tự luận ngắn"].map((type) => {
                    const isChecked = questionTypes.includes(type);
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleToggleType(type)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all cursor-pointer flex items-center gap-2 ${
                          isChecked ? "bg-blue-600-muted border-blue-200 text-blue-600 shadow-sm" : "bg-white border-border text-muted-foreground hover:border-blue-300 hover:bg-blue-600-muted/50"
                        }`}
                      >
                        {isChecked ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border border-stone-300" />}
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-3 flex items-center gap-1.5"><Clock className="w-4 h-4 text-muted-foreground" /> Thời gian làm bài</label>
                <div className="flex flex-wrap gap-3">
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
                      className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
                        timeLimit === t.value ? "bg-blue-600-muted text-blue-600 border-blue-200 shadow-sm" : "bg-white text-muted-foreground border-border hover:border-blue-300 hover:bg-blue-600-muted/50"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-3">Yêu cầu bổ sung cho AI</label>
                <textarea
                  rows={3}
                  placeholder="Ví dụ: Ưu tiên các bài toán thực tế, giải thích chi tiết..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="w-full p-4 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-foreground placeholder:text-stone-400"
                />
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={handleGenerateAiQuiz}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-600-hover text-white font-semibold rounded-xl text-sm shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-pulse" />
                      <span>Đang khởi tạo đề thi...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      <span>Khởi tạo bộ đề</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-8 border border-border rounded-3xl bg-white shadow-sm space-y-6">
                <div className="space-y-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-success-bg text-success border border-emerald-100">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Đã tạo thành công
                  </span>
                  <h2 className="text-2xl font-bold text-foreground tracking-tight">{generatedQuiz.title}</h2>
                  <p className="text-[15px] text-muted-foreground flex items-center gap-2"><ListChecks className="w-4 h-4" /> Chủ đề: <span className="font-semibold text-foreground">{generatedQuiz.topic}</span></p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-y border-border py-6">
                  <div>
                    <span className="text-xs text-muted-foreground block mb-1">Số câu hỏi</span>
                    <span className="text-base font-bold text-foreground">{generatedQuiz.questions_count} Câu</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block mb-1">Thời gian</span>
                    <span className="text-base font-bold text-foreground">{generatedQuiz.time_limit_minutes > 0 ? `${generatedQuiz.time_limit_minutes} Phút` : "Tự do"}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block mb-1">Độ khó</span>
                    <span className="text-base font-bold text-foreground">{generatedQuiz.difficulty}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block mb-1">Cơ chế</span>
                    <span className="text-sm font-semibold text-blue-600 flex items-center gap-1"><Brain className="w-4 h-4" /> AI Chấm</span>
                  </div>
                </div>

                <p className="text-sm text-stone-700 leading-relaxed bg-muted p-4 rounded-xl border border-border">{generatedQuiz.description}</p>
                
                <div className="flex items-center gap-3 pt-4">
                  <Link href={`/practice/quiz/question?aiQuizId=${generatedQuiz.id}`} className="flex-1">
                    <button type="button" className="w-full py-3 bg-blue-600 hover:bg-blue-600-hover text-white font-semibold rounded-xl text-sm shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2">
                      Bắt Đầu Làm Bài Ngay
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setGeneratedQuiz(null)}
                    className="px-6 py-3 bg-white border border-border text-stone-700 font-semibold rounded-xl text-sm hover:bg-muted transition-colors cursor-pointer"
                  >
                    Tạo đề khác
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: DEFAULT MODULES */}
      {activeTab === "default_modules" && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {defaultModules.filter(m => m.id !== "ai_generator").map((mod) => (
              <div key={mod.id} className="p-7 bg-white border border-border rounded-3xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-full space-y-6">
                <div className="space-y-4">
                  <span className="inline-block text-[11px] font-bold px-3 py-1 rounded-full bg-secondary text-muted-foreground tracking-wide uppercase">
                    {mod.badge_title}
                  </span>
                  <h3 className="text-xl font-bold text-foreground leading-tight">{mod.title.replace(/^Kiểm tra [^:]+:\s*/, "")}</h3>
                  <p className="text-[15px] text-muted-foreground line-clamp-3 leading-relaxed">{mod.description}</p>
                </div>
                
                <div className="space-y-5 pt-2">
                  <div className="flex items-center justify-between text-sm text-muted-foreground py-3.5 border-y border-border">
                    <span className="font-semibold flex items-center gap-1.5"><ListChecks className="w-4 h-4" /> {mod.questions_count} câu</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {mod.time_limit_minutes} phút</span>
                  </div>
                  
                  <div className="flex gap-3">
                    <Link href={`/practice/quiz/question?lessonId=${mod.id}`} className="flex-1">
                      <button type="button" className="w-full py-3.5 bg-blue-600 text-white font-semibold rounded-xl text-sm hover:bg-blue-600-hover shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2">
                        Bắt đầu thi
                      </button>
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedModId(String(mod.id));
                        setIsSelfAssessmentOpen(true);
                      }}
                      className="px-6 py-3.5 bg-white border-[1.5px] border-border text-stone-700 font-semibold rounded-xl text-sm hover:bg-muted hover:border-stone-300 transition-colors cursor-pointer"
                      title="Tự luyện"
                    >
                      Luyện
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: HISTORY */}
      {activeTab === "history" && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-5xl mx-auto w-full">
          {myHistoryQuizzes.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-border rounded-3xl bg-muted/50 flex flex-col items-center justify-center gap-3">
              <History className="w-12 h-12 text-stone-300" />
              <p className="text-muted-foreground font-medium">Bạn chưa có bài thi nào trong lịch sử.</p>
              <button 
                onClick={() => setActiveTab("ai_generator")} 
                className="text-blue-600 font-bold hover:underline mt-2 flex items-center gap-1.5"
              >
                <Wand2 className="w-4 h-4" /> Khởi tạo đề ngay
              </button>
            </div>
          ) : (
            <div className="overflow-hidden border border-border rounded-2xl bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-muted border-b border-border">
                    <tr>
                      <th className="px-6 py-4 font-bold text-muted-foreground">Tên Đề Thi</th>
                      <th className="px-6 py-4 font-bold text-muted-foreground">Chủ đề</th>
                      <th className="px-6 py-4 font-bold text-muted-foreground">Kết quả</th>
                      <th className="px-6 py-4 font-bold text-muted-foreground text-right">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {myHistoryQuizzes.map((quiz) => (
                      <tr key={quiz.id} className="hover:bg-muted transition-colors group">
                        <td className="px-6 py-4 font-bold text-foreground flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-600-muted text-blue-600 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          {quiz.title}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground font-medium">{quiz.difficulty} <span className="mx-1 text-stone-300">•</span> {quiz.questions_count} câu</td>
                        <td className="px-6 py-4">
                          {quiz.is_completed ? (
                            <span className={`inline-flex items-center gap-1.5 font-bold px-2.5 py-1 rounded-full text-xs ${quiz.score >= 70 ? "bg-success-bg text-success" : "bg-blue-600-muted text-red-700"}`}>
                              {quiz.score >= 70 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                              {quiz.score}%
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full text-xs">
                              <Clock className="w-3.5 h-3.5" /> Chưa làm
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-3 items-center">
                            {quiz.is_completed ? (
                              <>
                                <button
                                  onClick={() => setReviewingQuiz(quiz)}
                                  className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center gap-1"
                                >
                                  <Eye className="w-3.5 h-3.5" /> Xem lại
                                </button>
                                <Link href={`/practice/quiz/question?aiQuizId=${quiz.id}`} className="text-xs font-semibold text-blue-600 hover:text-blue-600-hover transition-colors flex items-center gap-1">
                                  <PlayCircle className="w-3.5 h-3.5" /> Làm lại
                                </Link>
                              </>
                            ) : (
                              <Link href={`/practice/quiz/question?aiQuizId=${quiz.id}`} className="text-xs font-semibold text-blue-600 hover:text-blue-600-hover transition-colors flex items-center gap-1">
                                <PlayCircle className="w-3.5 h-3.5" /> Làm bài ngay
                              </Link>
                            )}
                            <button
                              onClick={(e) => handleDeleteQuiz(quiz.id, e)}
                              className="text-stone-400 hover:text-blue-600 transition-colors ml-2 cursor-pointer p-1.5 hover:bg-blue-600-muted rounded-md"
                              title="Xóa đề"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL XEM LẠI BÀI THI CHI TIẾT */}
      {reviewingQuiz && (
        <div className="fixed inset-0 z-50 bg-foreground/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-muted rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border flex items-center justify-between bg-white shrink-0">
              <div>
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5" /> Báo cáo kết quả bài thi
                </span>
                <h3 className="text-xl font-bold text-foreground tracking-tight">{reviewingQuiz.title}</h3>
                <p className="text-[15px] text-muted-foreground mt-2 flex items-center gap-2 font-medium">
                  Điểm số: <strong className={`px-2 py-0.5 rounded-md ${reviewingQuiz.score >= 70 ? "bg-emerald-100 text-success" : "bg-red-100 text-red-700"}`}>{reviewingQuiz.score}%</strong> 
                  <span className="text-stone-300">•</span> Đúng: <strong className="text-foreground">{reviewingQuiz.correct_count || 0}/{reviewingQuiz.questions_count}</strong> câu
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReviewingQuiz(null)}
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-stone-200 hover:text-foreground transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1">
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
                  <div key={q.id || idx} className="p-6 rounded-2xl bg-white border border-border shadow-sm space-y-5">
                    <div className="flex items-start justify-between gap-4">
                      <h4 className="text-base font-bold text-foreground leading-relaxed">
                        <span className="text-stone-400 font-medium">Câu {idx + 1}.</span> {q.question}
                      </h4>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full shrink-0 flex items-center gap-1.5 ${isCorrect ? "bg-success-bg text-success border border-emerald-100" : "bg-blue-600-muted text-red-700 border border-red-100"}`}>
                        {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {isCorrect ? "Đúng" : "Sai"}
                      </span>
                    </div>

                    {isEssayOrFill ? (
                      <div className="space-y-4 text-sm">
                        <div className="p-4 rounded-xl border border-border bg-muted">
                          <span className="font-semibold text-muted-foreground block mb-2">Bài làm của bạn:</span>
                          <p className="text-foreground font-medium">{userAns || <em className="text-stone-400 font-normal">Chưa nhập câu trả lời</em>}</p>
                        </div>
                        <div className="p-4 rounded-xl border border-emerald-200 bg-success-bg text-emerald-800">
                          <span className="font-semibold block mb-2 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Đáp án chuẩn / Hướng dẫn:</span>
                          <p className="font-medium">{rawCorrect}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-3">
                        {q.options?.map((opt: string, optIdx: number) => {
                          const optKey = opt.trim().charAt(0).toUpperCase();
                          const isChosen = cleanUserLetter === optKey;
                          const isRightKey = cleanCorrectLetter === optKey;

                          let optStyle = "bg-white border-border text-stone-700";
                          if (isRightKey) {
                            optStyle = "bg-success-bg border-emerald-200 text-emerald-800 font-semibold";
                          } else if (isChosen && !isRightKey) {
                            optStyle = "bg-blue-600-muted border-blue-200 text-red-700 font-semibold";
                          }

                          return (
                            <div key={optIdx} className={`px-4 py-3 rounded-xl border text-sm flex items-center justify-between transition-all ${optStyle}`}>
                              <span>{opt}</span>
                              {isChosen && (
                                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${isRightKey ? "bg-emerald-600 text-white" : "bg-blue-600 text-white"}`}>
                                  {isRightKey ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                                  Bạn chọn
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {q.explanation && (
                      <div className="p-4 rounded-xl border border-red-100 bg-blue-600-muted/50 text-sm">
                        <span className="font-bold text-blue-800 block mb-1 flex items-center gap-1.5"><Brain className="w-4 h-4" /> Gia sư Nova giải thích:</span>
                        <p className="leading-relaxed text-blue-900/80">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <SelfAssessmentModal
        courseId={currentMod.id}
        courseTitle={currentMod.course_title || currentMod.title}
        isOpen={isSelfAssessmentOpen}
        onClose={() => setIsSelfAssessmentOpen(false)}
      />
    </div>
  );
}
