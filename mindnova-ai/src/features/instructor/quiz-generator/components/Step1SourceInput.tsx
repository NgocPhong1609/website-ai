"use client";

import React, { useEffect, useState } from "react";
import { QuizConfig } from "../types/quizGenerator.types";
import { quizGeneratorApi } from "../api/quizGeneratorApi";
import { AlertTriangle, ArrowRight, BookOpen, GraduationCap, RefreshCw, Search, Target } from "lucide-react";
import { Skeleton } from "@/src/shared/components/ui/Skeleton";

interface Step1SourceInputProps {
  config: QuizConfig;
  onChangeConfig: (fields: Partial<QuizConfig>) => void;
  onNext: () => void;
  embeddedMode?: boolean;
}

export function Step1SourceInput({ config, onChangeConfig, onNext }: Step1SourceInputProps) {
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [selectedCourseDetails, setSelectedCourseDetails] = useState<any>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showWarning, setShowWarning] = useState(false);

  // Fetch instructor's owned courses without auto-selecting any course
  useEffect(() => {
    let isMounted = true;
    setIsLoadingCourses(true);
    quizGeneratorApi
      .getInstructorCourses()
      .then((res) => {
        if (isMounted && res?.data && Array.isArray(res.data)) {
          setCourses(res.data);
        }
      })
      .catch((err) => {
        console.warn("Failed to load courses:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoadingCourses(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch selected course modules & lessons whenever course_id changes
  useEffect(() => {
    let cancelled = false;
    setSelectedCourseDetails(null);
    if (config.course_id) {
      setIsLoadingDetails(true);
      quizGeneratorApi
        .getCourseDetails(config.course_id)
        .then((res) => {
          const detail = res?.data || res;
          if (!cancelled) setSelectedCourseDetails(detail);
        })
        .catch(() => {
          if (!cancelled) setSelectedCourseDetails(null);
        })
        .finally(() => {
          if (!cancelled) setIsLoadingDetails(false);
        });
    } else {
      setSelectedCourseDetails(null);
    }
    return () => { cancelled = true; };
  }, [config.course_id]);

  const handleSelectCourse = (course: any) => {
    setShowWarning(false);
    onChangeConfig({
      source_type: "course",
      course_id: course.id,
      course_title: course.title,
      module_id: undefined,
      module_title: undefined,
      title: `Đề kiểm tra: ${course.title}`,
    });
  };

  const handleResetCourseSelection = () => {
    onChangeConfig({
      source_type: "course",
      course_id: undefined,
      course_title: undefined,
      module_id: undefined,
      module_title: undefined,
      title: "Kiểm tra kiến thức",
    });
    setSelectedCourseDetails(null);
  };

  // Filter course list by search term
  const filteredCourses = courses.filter((c) =>
    (c.title || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Extract module & lesson list for preview
  const rawModules = selectedCourseDetails?.modules;
  const rawLessons = selectedCourseDetails?.lessons || selectedCourseDetails?.direct_lessons;
  const modulesList = Array.isArray(rawModules) ? rawModules : [];
  const selectedModule = modulesList.find((m: any) => Number(m.id) === config.module_id);
  const sourceModules = config.module_id ? (selectedModule ? [selectedModule] : []) : modulesList;
  const lessonsList: any[] = [];

  if (modulesList.length > 0) {
    sourceModules.forEach((m: any) => {
      if (Array.isArray(m.lessons)) {
        m.lessons.forEach((l: any) => {
          if (!config.module_id || (!["quiz", "quiz_module"].includes(l.type) && String(l.content || "").replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim())) {
            lessonsList.push({ ...l, module_title: m.title });
          }
        });
      }
    });
  }

  if (!config.module_id && lessonsList.length === 0 && Array.isArray(rawLessons)) {
    rawLessons.forEach((l: any) => {
      lessonsList.push(l);
    });
  }

  return (
    <div className="p-8 bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col gap-6 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-blue-50 text-blue-500 text-xs font-bold rounded-lg border border-blue-100 uppercase tracking-wider">
            Bước 1 / 5
          </span>
          <h2 className="text-xl font-bold text-slate-900">Chọn Khóa Học</h2>
        </div>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Chọn khóa học bạn muốn sử dụng để AI tạo đề bài kiểm tra.
        </p>
      </div>

      {/* Main Content Area */}
      {!config.course_id ? (
        <div className="flex flex-col gap-5">
          {/* Search Box */}
          <div className="relative">
            <Search className="h-4 w-4 shrink-0" aria-hidden />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm khóa học của bạn..."
              className="w-full pl-11 pr-4 py-3.5 rounded-lg border-2 border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-xs"
            />
          </div>

          {/* Course Selection List */}
          {isLoadingCourses ? (
            <div role="status" aria-busy="true" aria-label="Đang tải danh sách khóa học" className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-4 rounded-xl border border-slate-200 bg-white flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="p-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-center flex flex-col gap-2">
              <AlertTriangle className="h-6 w-6 shrink-0" aria-hidden />
              <span className="font-semibold text-sm">Bạn chưa có khóa học nào trong tài khoản.</span>
              <span className="text-xs font-medium text-amber-800">
                Hãy tạo khóa học trước trong bảng điều khiển để tiếp tục tạo bài thi AI.
              </span>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="p-6 rounded-lg bg-slate-50 border border-slate-200 text-center text-xs font-bold text-slate-500">
              Không tìm thấy khóa học nào phù hợp với từ khóa "{searchTerm}".
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[420px] overflow-y-auto pr-1">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="p-5 rounded-lg border-2 border-slate-200 hover:border-blue-600/50 bg-white transition-all duration-200 flex flex-col justify-between gap-4 shadow-sm hover:shadow-md group"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-500 border border-blue-100 flex items-center justify-center text-xl shrink-0 font-bold group-hover:scale-105 transition-transform">
                      <BookOpen className="h-5 w-5" aria-hidden />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase text-blue-500 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
                          {course.status === "published" ? "Đã xuất bản" : "Bản nháp"}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 truncate" title={course.title}>
                        {course.title}
                      </h4>
                      <div className="flex items-center gap-3 text-xs font-bold text-slate-500 mt-1.5">
                        <span>{course.modules_count ?? course.modules?.length ?? 0} Modules</span>
                        <span>•</span>
                        <span>{course.lessons_count ?? 0} Lessons</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelectCourse(course)}
                    className="w-full py-2.5 px-4 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <span><Target className="inline h-4 w-4 mr-1 align-text-bottom" aria-hidden />Chọn khóa học này</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* When Course IS Selected */
        <div className="flex flex-col gap-5">
          {/* Selected Course Banner */}
          <div className="p-5 rounded-lg bg-emerald-50/60 border-2 border-emerald-300 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-2xl font-bold shadow-md shrink-0">
                <GraduationCap className="h-5 w-5" aria-hidden />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-md">
                    Khóa học đã chọn
                  </span>
                </div>
                <h3 className="text-base font-bold text-emerald-950 mt-1">
                  {config.course_title || `Khóa học #${config.course_id}`}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetCourseSelection}
              className="px-4 py-2 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shrink-0 shadow-sm"
            >
              <span><RefreshCw className="inline h-4 w-4 mr-1 align-text-bottom" aria-hidden />Thay đổi khóa học</span>
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="quiz-source-module" className="text-xs font-bold text-slate-900">Phạm vi nội dung</label>
            <select
              id="quiz-source-module"
              value={config.module_id ?? ""}
              disabled={isLoadingDetails || !selectedCourseDetails}
              onChange={(event) => {
                const module = modulesList.find((m: any) => Number(m.id) === Number(event.target.value));
                onChangeConfig({
                  module_id: module ? Number(module.id) : undefined,
                  module_title: module?.title,
                  title: `Đề kiểm tra: ${module?.title || config.course_title || selectedCourseDetails?.title}`,
                });
              }}
              className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500"
            >
              <option value="">Toàn khóa học</option>
              {modulesList.map((module: any) => <option key={module.id} value={module.id}>{module.title}</option>)}
            </select>
            <p className="text-xs text-slate-500">
              {config.module_id
                ? "AI chỉ đọc nội dung bài học trong chương đã chọn. Sau khi bạn duyệt và lưu, quiz sẽ được đặt ở cuối chương này."
                : "AI sử dụng nội dung toàn khóa học. Bạn có thể chọn một chương để tạo quiz riêng."}
            </p>
          </div>

          {/* Selected Course Modules & Lessons Preview Card */}
          <div className="p-5 rounded-lg bg-white border border-slate-200 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Nội dung được dùng để tạo quiz
                </h4>
                <p className="text-[11px] font-bold text-slate-500 mt-0.5">
                  {config.module_id ? `Chương: ${selectedModule?.title || config.module_title || "Đang tải"}` : "AI sẽ sử dụng dữ liệu thực tế từ bài học trong khóa này để sinh bộ câu hỏi."}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold shrink-0">
                <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-500 border border-blue-100">
                  {sourceModules.length} Modules
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-800 border border-sky-100">
                  {lessonsList.length} Lessons
                </span>
              </div>
            </div>

            {isLoadingDetails ? (
              <div role="status" aria-busy="true" aria-label="Đang nạp danh sách bài học" className="flex flex-col gap-1.5 pt-2 border-t border-slate-100">
                {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-7 w-full" />)}
              </div>
            ) : lessonsList.length > 0 ? (
              <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Các bài học được trích xuất:
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1">
                  {lessonsList.map((les, idx) => (
                    <span
                      key={les.id || idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-bold truncate max-w-xs"
                      title={les.title}
                    >
                      Bài {idx + 1}: {les.title}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-[11px] font-bold text-slate-400 pt-2 border-t border-slate-100">
                {config.module_id ? "Chương này chưa có nội dung bài học dạng văn bản để tạo quiz. Hãy bổ sung nội dung hoặc chọn chương khác." : "Khóa học hiện chưa có bài học nào. AI sẽ sử dụng thông tin tổng quan của khóa học để thiết kế câu hỏi."}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Warning Alert if User Tries to Continue Without Selecting Course */}
      {showWarning && !config.course_id && (
        <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 font-bold text-xs flex items-center gap-2 animate-fadeIn shadow-sm">
          <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden />
          <span>Vui lòng chọn một khóa học trước khi tiếp tục.</span>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="flex items-center justify-end border-t border-slate-100 pt-4 mt-2">
        <button
          type="button"
          onClick={() => {
            if (!config.course_id) {
              setShowWarning(true);
              return;
            }
            onNext();
          }}
          disabled={!config.course_id || isLoadingDetails || !selectedCourseDetails || Boolean(config.module_id && lessonsList.length === 0)}
          className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-lg shadow-lg hover:scale-[1.02] transition-all disabled:opacity-40 disabled:hover:scale-100 cursor-pointer disabled:cursor-not-allowed"
        >
          Tiếp theo: Cấu hình Quiz<ArrowRight className="inline h-4 w-4 ml-1 align-text-bottom" aria-hidden />
        </button>
      </div>
    </div>
  );
}
