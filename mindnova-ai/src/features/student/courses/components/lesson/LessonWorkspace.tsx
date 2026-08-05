"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { MY_COURSES } from "../../constants/data";
import type { MyCourse } from "../../types";
import { useGetCourseDetail } from "../../api";

// ─── Icons matched exactly with CurriculumAccordion.tsx & CourseHeader.tsx ────
function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function PlayCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

// ─── Interfaces ────────────────────────────────────────────────────────────────
interface LessonData {
  id: string;
  title: string;
  duration: string;
  durationSeconds: number;
  completed: boolean;
  tag: string;
  description: string;
  codeTitle: string;
  codeSnippet: string;
  videoUrl: string; // Real embedded video URL
  aiTips: { title: string; content: string; type: "tip" | "warning" | "best_practice" }[];
}

interface ModuleData {
  id: string;
  title: string;
  subtitle: string;
  lessons: LessonData[];
}

interface CommentItem {
  id: string;
  author: string;
  avatar: string;
  role: string;
  time: string;
  content: string;
  isAi?: boolean;
}
// ─── Inner Workspace Content (Needs Suspense boundary due to useSearchParams) ───
function LessonWorkspaceContent() {
  const searchParams = useSearchParams();
  const courseIdParam = searchParams.get("courseId");
  const initialLessonParam = searchParams.get("lessonId");

  const parsedCourseId = courseIdParam ? Number(courseIdParam) : 1;
  const { data: apiDetail, isLoading } = useGetCourseDetail(parsedCourseId);

  // Load interactive curriculum state
  const [curriculum, setCurriculum] = useState<ModuleData[]>([]);
  const [activeLessonId, setActiveLessonId] = useState<string>("");
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  React.useEffect(() => {
    if (apiDetail && apiDetail.modules) {
      const mapped: ModuleData[] = apiDetail.modules.map((mod) => ({
        id: mod.id.toString(),
        title: mod.title,
        subtitle: mod.duration || "",
        lessons: mod.lessons.map((l) => ({
          id: l.id.toString(),
          title: l.title,
          duration: l.duration,
          durationSeconds: 0,
          completed: l.status === "completed",
          tag: "Bài học",
          description: "Mô tả bài học",
          codeTitle: "",
          codeSnippet: "",
          videoUrl: l.video_url || "https://www.youtube.com/embed/Sklc_fQBmcs",
          aiTips: [],
        })),
      }));
      setCurriculum(mapped);

      const initialExpanded: Record<string, boolean> = {};
      mapped.forEach((mod) => {
        initialExpanded[mod.id] = true;
      });
      setExpandedModules(initialExpanded);

      const allL = mapped.flatMap((m) => m.lessons);
      if (initialLessonParam) {
        const match = allL.find((l) => l.id === initialLessonParam || l.id.endsWith(initialLessonParam));
        if (match) setActiveLessonId(match.id);
      } else {
        const firstIncomplete = allL.find((l) => !l.completed);
        setActiveLessonId(firstIncomplete ? firstIncomplete.id : allL[0]?.id || "");
      }
    }
  }, [apiDetail, initialLessonParam]);

  // Derive all lessons flat list for easy Previous / Next sequencing
  const allLessons = React.useMemo(() => {
    return curriculum.flatMap((m) => m.lessons);
  }, [curriculum]);

  const activeLesson: LessonData | undefined = React.useMemo(() => {
    return allLessons.find((l) => l.id === activeLessonId) || allLessons[0];
  }, [allLessons, activeLessonId]);

  const currentCourse: MyCourse = MY_COURSES.find((c) => c.id === parsedCourseId) || MY_COURSES[0];

  // Tab & interactive copy states
  const [activeTab, setActiveTab] = useState<"content" | "ai_tips" | "discussion">("content");
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const toggleModule = (modId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [modId]: !prev[modId],
    }));
  };

  // Interactive Comments Mockup
  const [comments, setComments] = useState<CommentItem[]>([
    {
      id: "c1",
      author: "Gia sư AI Nova 🤖",
      avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop",
      role: "Trợ lý Trí tuệ Nhân tạo",
      time: "Vừa mới ghi chú",
      content: "👋 Chào bạn! Tại chuyên đề này, phần kiến thức quan trọng nhất nằm ở kỹ thuật quản lý luồng Stream và cấu hình bộ nhớ đệm Cache. Nếu bạn gặp bất kỳ vướng mắc nào, hãy đặt câu hỏi tại đây nhé!",
      isAi: true,
    },
    {
      id: "c2",
      author: "Nguyễn Quang Khải",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
      role: "Học viện viên Pro",
      time: "2 giờ trước",
      content: "Cho mình hỏi nếu kết hợp Route Handlers với Vercel AI SDK thì việc báo cáo tiến độ token tiêu thụ nên đặt ở bước nào tốt nhất ạ?",
    },
  ]);
  const [newCommentText, setNewCommentText] = useState<string>("");

  // Real-time progress tracker calculation
  const totalLessonCount = allLessons.length;
  const completedCount = allLessons.filter((l) => l.completed).length;
  const computedProgressPercentage = Math.round((completedCount / (totalLessonCount || 1)) * 100);

  // Handle switching lessons
  const handleSelectLesson = (lessonId: string) => {
    setActiveLessonId(lessonId);
    setActiveTab("content");
  };

  // Handle Mark as Completed Toggle
  const handleToggleCompleted = () => {
    setCurriculum((prevMod) =>
      prevMod.map((mod) => ({
        ...mod,
        lessons: mod.lessons.map((lesson) =>
          lesson.id === activeLessonId ? { ...lesson, completed: !lesson.completed } : lesson
        ),
      }))
    );
  };

  // Handle Copy Code
  const handleCopyCode = () => {
    if (activeLesson?.codeSnippet && typeof navigator !== "undefined") {
      navigator.clipboard.writeText(activeLesson.codeSnippet);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // Handle Post Comment
  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    const item: CommentItem = {
      id: `user-${Date.now()}`,
      author: "Bạn (Học viên MindNova)",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop",
      role: "Trực tuyến",
      time: "Vừa xong",
      content: newCommentText.trim(),
    };
    setComments((prev) => [item, ...prev]);
    setNewCommentText("");
  };

  const currentIndex = allLessons.findIndex((l) => l.id === activeLessonId);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < allLessons.length - 1;

  const handleGoPrevious = () => {
    if (hasPrevious) {
      handleSelectLesson(allLessons[currentIndex - 1].id);
    }
  };

  const handleGoNext = () => {
    if (hasNext) {
      handleSelectLesson(allLessons[currentIndex + 1].id);
    }
  };

  if (!activeLesson) {
    return <div className="p-12 text-center text-[#6B7280]">Không tìm thấy bài học nào cho khóa này.</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white pb-24 relative">
      {/* ─── Top Header & Breadcrumb Bar (Synchronized with CourseHeader / Courses) ─── */}
      <header className="w-full bg-white border-b border-[#E5E7EB] px-6 py-4 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href={`/courses/detail?courseId=${currentCourse.id}`}
              className="w-9 h-9 rounded-xl bg-white border border-[#E5E7EB] hover:bg-gray-50 flex items-center justify-center text-[#4B5563] hover:text-[#111827] transition-colors shrink-0 text-decoration-none shadow-2xs"
              title="Quay lại chi tiết Khóa học"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="min-w-0">
              <nav className="flex items-center gap-2 text-[13px] font-medium text-[#6B7280] mb-0.5 truncate">
                <Link href="/courses" className="hover:text-[#111827] transition-colors text-decoration-none">
                  Khoá học
                </Link>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <path d="M9 18l6-6-6-6" />
                </svg>
                <span className="text-[#4F46E5] font-semibold truncate">{currentCourse.title}</span>
              </nav>
              <h1 className="text-base sm:text-lg font-bold text-[#111827] truncate">
                {activeLesson.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#EEF2FF] text-[#4F46E5]">
              <span className="w-2 h-2 rounded-full bg-[#4F46E5]" />
              <span>Tiến độ: {computedProgressPercentage}% ({completedCount}/{totalLessonCount} bài)</span>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Main Workspace Content Grid (Matched with max-w-[1400px] layout) ───── */}
      <div className="max-w-[1400px] w-full mx-auto p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ─── Left Column (8 cols): Video Player & Lesson Content ────────────── */}
        <main className="lg:col-span-8 flex flex-col gap-6 w-full min-w-0">
          
          {/* Synchronized AI Notice Card */}
          <div className="w-full p-4 rounded-xl bg-[#EEF2FF] border border-[#C7D2FE] flex items-center justify-between gap-3 text-[#1E1B4B]">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-2 h-2 rounded-full bg-[#4F46E5] shrink-0" />
              <span className="text-[#4F46E5] font-bold text-xs sm:text-sm shrink-0">Gia sư AI Nova:</span>
              <span className="text-xs sm:text-sm text-[#4B5563] truncate">Video bài giảng nhúng trực tiếp. Hãy theo dõi thực hành mã nguồn ở các thẻ Tab phía dưới!</span>
            </div>
            <span className="hidden sm:inline-block px-2.5 py-1 rounded text-[10px] font-bold bg-[#4F46E5] text-white tracking-wider uppercase shrink-0">
              4K Stream
            </span>
          </div>

          {/* Real Embedded Video Player Container */}
          <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-sm border border-[#E5E7EB]">
            <iframe
              src={activeLesson.videoUrl || "https://www.youtube.com/embed/wm5gMKuwSYk?rel=0&modestbranding=1"}
              title={activeLesson.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-0 absolute inset-0"
            ></iframe>
          </div>

          {/* ─── Interactive Tab Selector ─────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
            <div className="flex items-center border-b border-[#E5E7EB] px-6 gap-6 bg-white overflow-x-auto">
              <button
                onClick={() => setActiveTab("content")}
                className={twMerge(
                  "py-3.5 font-semibold text-xs sm:text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 focus:outline-none",
                  activeTab === "content" 
                    ? "border-[#4F46E5] text-[#4F46E5]" 
                    : "border-transparent text-[#6B7280] hover:text-[#111827]"
                )}
              >
                <span>Nội dung & Mã nguồn</span>
              </button>
              <button
                onClick={() => setActiveTab("ai_tips")}
                className={twMerge(
                  "py-3.5 font-semibold text-xs sm:text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 focus:outline-none",
                  activeTab === "ai_tips" 
                    ? "border-[#4F46E5] text-[#4F46E5]" 
                    : "border-transparent text-[#6B7280] hover:text-[#111827]"
                )}
              >
                <span>Cố vấn AI Nova</span>
                <span className="px-2 py-0.5 rounded-full bg-[#EEF2FF] text-[#4F46E5] text-[10px] font-bold">
                  {activeLesson.aiTips.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab("discussion")}
                className={twMerge(
                  "py-3.5 font-semibold text-xs sm:text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 focus:outline-none",
                  activeTab === "discussion" 
                    ? "border-[#4F46E5] text-[#4F46E5]" 
                    : "border-transparent text-[#6B7280] hover:text-[#111827]"
                )}
              >
                <span>Thảo luận & Ghi chú</span>
                <span className="px-2 py-0.5 rounded-full bg-[#F3F4F6] text-[#4B5563] text-[10px] font-bold">
                  {comments.length}
                </span>
              </button>
            </div>

            <div className="p-6 sm:p-8">
              {/* Tab 1: Content & Code */}
              {activeTab === "content" && (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#EEF2FF] text-[#4F46E5]">
                      {activeLesson.tag}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F3F4F6] text-[#4B5563]">
                      <span>Thời lượng:</span> {activeLesson.duration}
                    </span>
                    {activeLesson.completed ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#D1FAE5] text-[#065F46]">
                        ✓ Đã học xong
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#EEF2FF] text-[#4F46E5]">
                        Đang học
                      </span>
                    )}
                  </div>

                  <div>
                    <h2 className="text-[22px] sm:text-[24px] font-bold text-[#111827] mb-2 leading-snug">
                      {activeLesson.title}
                    </h2>
                    <p className="text-[15px] text-[#4B5563] leading-relaxed">
                      {activeLesson.description}
                    </p>
                  </div>

                  {/* Clean Developer Code Block */}
                  <div className="bg-[#1F2937] rounded-xl overflow-hidden border border-[#374151] shadow-sm">
                    <div className="flex items-center justify-between px-5 py-3 bg-[#111827] border-b border-[#374151]">
                      <span className="text-xs text-gray-300 font-mono font-semibold">{activeLesson.codeTitle}</span>
                      <button 
                        onClick={handleCopyCode}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#374151] hover:bg-[#4B5563] text-white text-xs font-medium transition-colors cursor-pointer"
                      >
                        {copiedCode ? (
                          <span className="text-[#10B981] font-semibold flex items-center gap-1">
                            ✓ Đã sao chép
                          </span>
                        ) : (
                          <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                            <span>Sao chép mã</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="p-5 overflow-x-auto">
                      <pre className="text-sm font-mono text-gray-200 leading-relaxed">
                        <code>{activeLesson.codeSnippet}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: AI Tutor Advisory Tips */}
              {activeTab === "ai_tips" && (
                <div className="flex flex-col gap-5">
                  <div className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] flex items-center gap-4">
                    <span className="text-2xl">🤖</span>
                    <div>
                      <h3 className="font-bold text-[#111827] text-sm sm:text-base">Phân tích chuyên sâu từ MindNova Co-Pilot</h3>
                      <p className="text-xs sm:text-sm text-[#6B7280]">Các lưu ý chuyên môn được đúc kết từ thực tiễn lập trình và tần suất lỗi của học viên.</p>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    {activeLesson.aiTips.map((tip, idx) => (
                      <div 
                        key={idx} 
                        className={twMerge(
                          "p-5 rounded-xl border flex flex-col gap-2 transition-all",
                          tip.type === "best_practice" ? "bg-[#EEF2FF] border-[#C7D2FE]" :
                          tip.type === "warning" ? "bg-[#FEF3C7] border-[#FDE68A]" : "bg-[#F9FAFB] border-[#E5E7EB]"
                        )}
                      >
                        <h4 className={twMerge("font-bold text-sm sm:text-base flex items-center gap-2", tip.type === "warning" ? "text-[#92400E]" : "text-[#111827]")}>
                          {tip.title}
                        </h4>
                        <p className={twMerge("text-sm leading-relaxed", tip.type === "warning" ? "text-[#78350F]" : "text-[#4B5563]")}>
                          {tip.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Discussion Forum & Notes */}
              {activeTab === "discussion" && (
                <div className="flex flex-col gap-6">
                  <form onSubmit={handlePostComment} className="flex flex-col gap-3 p-5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
                    <h4 className="font-semibold text-sm text-[#111827]">Gửi câu hỏi cho Gia sư AI hoặc thảo luận cùng lớp học</h4>
                    <textarea
                      rows={3}
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      placeholder="Nhập câu hỏi hoặc ghi chú học tập cá nhân..."
                      className="w-full p-3.5 rounded-xl border border-[#E5E7EB] bg-white text-[#111827] text-sm placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 transition-all resize-none"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-sm"
                      >
                        Gửi thảo luận
                      </button>
                    </div>
                  </form>

                  <div className="flex flex-col gap-4">
                    {comments.map((item) => (
                      <div 
                        key={item.id} 
                        className={twMerge(
                          "p-4 sm:p-5 rounded-xl border transition-all flex items-start gap-3.5",
                          item.isAi ? "bg-[#EEF2FF]/50 border-[#C7D2FE]" : "bg-white border-[#E5E7EB]"
                        )}
                      >
                        <Image
                          src={item.avatar}
                          alt={item.author}
                          width={40}
                          height={40}
                          className="rounded-full object-cover shrink-0 border border-gray-200"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-bold text-sm text-[#111827] flex items-center gap-2">
                              {item.author}
                              {item.isAi && <span className="px-2 py-0.5 rounded text-[10px] font-bold text-white bg-[#4F46E5] uppercase tracking-wider">Co-Pilot</span>}
                            </span>
                            <span className="text-xs text-[#6B7280]">{item.time}</span>
                          </div>
                          <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">{item.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* ─── Right Column (4 cols): Upgraded Module Card Accordion Sidebar ────── */}
        <aside className="lg:col-span-4 w-full flex flex-col gap-5 sticky top-24 max-h-[calc(100vh-100px)] overflow-y-auto pr-1">
          
          {/* Progress Overview Header Card */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-5 flex flex-col gap-3.5 shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[17px] font-extrabold text-[#111827] flex items-center gap-2">
                  <span>Lộ trình Học tập</span>
                </h2>
                <p className="text-[12px] font-medium text-[#6B7280] mt-0.5">Tiến trình hoàn thành toàn khóa</p>
              </div>
              <span className="text-xs font-bold text-[#4F46E5] bg-[#EEF2FF] border border-[#C7D2FE]/60 px-3 py-1.5 rounded-full shrink-0 shadow-2xs">
                {completedCount}/{totalLessonCount} Bài học
              </span>
            </div>

            {/* Progress bar with subtle glow */}
            <div className="w-full h-2.5 bg-[#F3F4F6] rounded-full overflow-hidden p-0.5 border border-[#E5E7EB]">
              <div 
                className="h-full bg-[#4F46E5] rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(79,70,229,0.35)]" 
                style={{ width: `${computedProgressPercentage}%` }}
              />
            </div>
          </div>

          {/* Module Accordion Cards (Exact design alignment with CurriculumAccordion) */}
          <div className="flex flex-col gap-4">
            {curriculum.map((mod, moduleIndex) => {
              const isExpanded = expandedModules[mod.id] ?? true;
              const modCompletedCount = mod.lessons.filter((l) => l.completed).length;
              const isModuleCompleted = mod.lessons.length > 0 && modCompletedCount === mod.lessons.length;
              const isModuleCurrent = mod.lessons.some((l) => l.id === activeLessonId);

              return (
                <div 
                  key={mod.id} 
                  className={twMerge(
                    "rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm",
                    isModuleCurrent ? "bg-[#F8FAFC] border-[#A5B4FC]" : "bg-white border-[#E5E7EB]"
                  )}
                >
                  {/* Clickable Module Header */}
                  <div 
                    onClick={() => toggleModule(mod.id)}
                    className="flex items-start justify-between p-4.5 cursor-pointer hover:bg-gray-50/70 transition-colors group select-none"
                  >
                    <div className="flex items-start gap-3.5 min-w-0 pr-2">
                      {/* Number / Status Badge */}
                      <div className={twMerge(
                        "w-8 h-8 rounded-full flex items-center justify-center font-bold text-[13px] shrink-0 mt-0.5 transition-all shadow-2xs",
                        isModuleCompleted 
                          ? "bg-[#4F46E5] text-white" 
                          : isModuleCurrent 
                            ? "bg-white border-2 border-[#4F46E5] text-[#4F46E5]" 
                            : "bg-gray-100 text-gray-500"
                      )}>
                        {isModuleCompleted ? <CheckIcon /> : moduleIndex + 1}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#4F46E5] truncate">
                          {mod.title}
                        </p>
                        <h3 className="text-[15px] font-bold text-[#111827] mt-1 leading-snug">
                          {mod.subtitle || "Khái niệm chuyên sâu & thực tiễn"}
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[12px] font-semibold text-[#6B7280]">
                            {modCompletedCount}/{mod.lessons.length} bài đã học
                          </span>
                          {isModuleCurrent && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5]" />
                          )}
                        </div>
                      </div>
                    </div>

                    <button className="text-[#9CA3AF] group-hover:text-[#4F46E5] transition-colors p-1 shrink-0">
                      <ChevronIcon className={twMerge("transition-transform duration-300", isExpanded ? "rotate-180" : "")} />
                    </button>
                  </div>

                  {/* Lesson Cards inside Module */}
                  {isExpanded && (
                    <div className="flex flex-col border-t border-[#E5E7EB] pt-2.5 pb-3 px-3 gap-2 bg-white/60">
                      {mod.lessons.map((lesson) => {
                        const isCurrent = lesson.id === activeLessonId;
                        const isCompleted = lesson.completed;

                        return (
                          <div
                            key={lesson.id}
                            onClick={() => handleSelectLesson(lesson.id)}
                            className={twMerge(
                              "flex items-center justify-between py-3 px-3.5 rounded-xl relative cursor-pointer transition-all duration-150 border",
                              isCurrent 
                                ? "bg-[#EEF2FF] border-[#A5B4FC] shadow-xs" 
                                : "bg-white border-[#E5E7EB]/60 hover:border-[#E5E7EB] hover:bg-[#F9FAFB]"
                            )}
                          >
                            {/* Left indicator accent for active lesson */}
                            {isCurrent && (
                              <div className="absolute left-0 top-2 bottom-2 w-[3.5px] bg-[#4F46E5] rounded-r-full" />
                            )}

                            <div className="flex items-center gap-3 min-w-0 pr-2">
                              {/* Status Icon */}
                              <div className={twMerge(
                                "w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all",
                                isCompleted 
                                  ? "bg-[#4F46E5] text-white shadow-2xs" 
                                  : isCurrent 
                                    ? "bg-white border-2 border-[#4F46E5] text-[#4F46E5]" 
                                    : "border-2 border-gray-300 text-transparent bg-gray-50"
                              )}>
                                {isCompleted ? <CheckIcon /> : isCurrent ? <PlayCircleIcon /> : <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />}
                              </div>

                              <div className="min-w-0 flex-1">
                                <h4 className={twMerge(
                                  "text-[13.5px] sm:text-[14px] leading-snug truncate",
                                  isCurrent ? "text-[#4F46E5] font-extrabold" : "text-[#111827] font-bold"
                                )}>
                                  {lesson.title}
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[11px] font-medium text-[#6B7280]">⏱️ {lesson.duration}</span>
                                  {isCurrent && (
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9.5px] font-black text-[#4F46E5] bg-white border border-[#A5B4FC] uppercase tracking-wider shadow-2xs">
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                                      ĐANG HỌC
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Chevron or Check status indicator right */}
                            <div className="shrink-0 text-[#9CA3AF]">
                              {isCurrent ? (
                                <span className="w-2.5 h-2.5 rounded-full bg-[#4F46E5] inline-block animate-ping" />
                              ) : (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-40 hover:opacity-100 transition-opacity"><polyline points="9 18 15 12 9 6"/></svg>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

      </div>

      {/* ─── Sticky Bottom Action Toolbar (Synchronized with CourseHeader buttons) ─── */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] px-6 py-3.5 z-40 shadow-sm">
        <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-4">
          
          <button 
            onClick={handleGoPrevious}
            disabled={!hasPrevious}
            className="flex items-center gap-2 px-5 py-2 rounded-xl border border-[#E5E7EB] bg-white hover:bg-gray-50 text-[#4B5563] font-semibold text-xs sm:text-sm transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-sm"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            <span>Bài trước</span>
          </button>

          <button 
            onClick={handleToggleCompleted}
            className={twMerge(
              "flex items-center gap-2 px-5 py-2 rounded-xl font-semibold text-xs sm:text-sm transition-all cursor-pointer",
              activeLesson.completed
                ? "bg-[#4F46E5] text-white shadow-sm hover:bg-[#4338CA]"
                : "bg-[#EEF2FF] text-[#4F46E5] border border-[#C7D2FE] hover:bg-[#E0E7FF]"
            )}
            title="Đánh dấu tiến độ học tập"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{activeLesson.completed ? "Đã học xong (Hoàn tất)" : "Đánh dấu Hoàn thành"}</span>
          </button>

          <div className="flex items-center gap-3">
            <Link 
              href={`/practice/quiz/question?lessonId=mod${currentCourse.id}`}
              className="px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#4B5563] bg-white border border-[#E5E7EB] hover:bg-gray-50 transition-all text-decoration-none shadow-sm block"
            >
              📝 Khảo sát Năng lực
            </Link>

            <button 
              onClick={handleGoNext}
              disabled={!hasNext}
              className="flex items-center gap-2 px-6 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-sm"
            >
              <span>Bài tiếp theo</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>

        </div>
      </footer>
    </div>
  );
}

// ─── Exported Master Component with Suspense ──────────────────────────────────
export function LessonWorkspace() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center font-semibold text-[#6B7280]">Đang tải khoá học Trợ lý AI MindNova...</div>}>
      <LessonWorkspaceContent />
    </Suspense>
  );
}
