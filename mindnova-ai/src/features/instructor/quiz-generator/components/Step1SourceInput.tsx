"use client";

import React, { useEffect, useState } from "react";
import { QuizConfig } from "../types/quizGenerator.types";
import { quizGeneratorApi } from "../api/quizGeneratorApi";

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
    if (config.course_id) {
      setIsLoadingDetails(true);
      quizGeneratorApi
        .getCourseDetails(config.course_id)
        .then((res) => {
          const detail = res?.data || res;
          setSelectedCourseDetails(detail);
        })
        .catch(() => {
          setSelectedCourseDetails(null);
        })
        .finally(() => {
          setIsLoadingDetails(false);
        });
    } else {
      setSelectedCourseDetails(null);
    }
  }, [config.course_id]);

  const handleSelectCourse = (course: any) => {
    setShowWarning(false);
    onChangeConfig({
      source_type: "course",
      course_id: course.id,
      course_title: course.title,
      title: `Đề kiểm tra: ${course.title}`,
    });
  };

  const handleResetCourseSelection = () => {
    onChangeConfig({
      source_type: "course",
      course_id: undefined,
      course_title: undefined,
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
  const lessonsList: any[] = [];

  if (modulesList.length > 0) {
    modulesList.forEach((m: any) => {
      if (Array.isArray(m.lessons)) {
        m.lessons.forEach((l: any) => {
          lessonsList.push({ ...l, module_title: m.title });
        });
      }
    });
  }

  if (lessonsList.length === 0 && Array.isArray(rawLessons)) {
    rawLessons.forEach((l: any) => {
      lessonsList.push(l);
    });
  }

  return (
    <div className="p-8 bg-white rounded-3xl border border-[#E8E2D9] shadow-sm flex flex-col gap-6 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-indigo-50 text-[#C0392B] text-xs font-black rounded-lg border border-indigo-100 uppercase tracking-wider">
            Bước 1 / 5
          </span>
          <h2 className="text-xl font-black text-[#2C3039]">Chọn Khóa Học</h2>
        </div>
        <p className="text-xs text-[#8A8478] font-medium mt-1">
          Chọn khóa học bạn muốn sử dụng để AI tạo đề bài kiểm tra.
        </p>
      </div>

      {/* Main Content Area */}
      {!config.course_id ? (
        <div className="flex flex-col gap-5">
          {/* Search Box */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm khóa học của bạn..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-gray-200 bg-[#FAF8FF] text-xs font-bold text-[#2C3039] focus:outline-none focus:border-[#C0392B] focus:bg-white transition-all shadow-xs"
            />
          </div>

          {/* Course Selection List */}
          {isLoadingCourses ? (
            <div className="p-8 bg-[#FAF8FF] rounded-2xl border border-gray-100 text-center text-xs font-bold text-[#8A8478] animate-pulse">
              Đang tải danh sách khóa học của bạn...
            </div>
          ) : courses.length === 0 ? (
            <div className="p-8 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-center flex flex-col gap-2">
              <span className="text-2xl">⚠️</span>
              <span className="font-extrabold text-sm">Bạn chưa có khóa học nào trong tài khoản.</span>
              <span className="text-xs font-medium text-amber-800">
                Hãy tạo khóa học trước trong bảng điều khiển để tiếp tục tạo bài thi AI.
              </span>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 text-center text-xs font-bold text-gray-500">
              Không tìm thấy khóa học nào phù hợp với từ khóa "{searchTerm}".
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[420px] overflow-y-auto pr-1">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="p-5 rounded-2xl border-2 border-[#E8E2D9] hover:border-[#C0392B]/50 bg-white transition-all duration-200 flex flex-col justify-between gap-4 shadow-2xs hover:shadow-md group"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-[#C0392B] border border-indigo-100 flex items-center justify-center text-xl shrink-0 font-bold group-hover:scale-105 transition-transform">
                      📚
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase text-[#C0392B] bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md">
                          {course.status === "published" ? "Đã xuất bản" : "Bản nháp"}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-[#2C3039] truncate" title={course.title}>
                        {course.title}
                      </h4>
                      <div className="flex items-center gap-3 text-xs font-bold text-[#8A8478] mt-1.5">
                        <span>{course.modules_count ?? course.modules?.length ?? 0} Modules</span>
                        <span>•</span>
                        <span>{course.lessons_count ?? 0} Lessons</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelectCourse(course)}
                    className="w-full py-2.5 px-4 bg-[#C0392B] hover:bg-[#4338CA] text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer shadow-2xs flex items-center justify-center gap-1.5"
                  >
                    <span>🎯 Chọn khóa học này</span>
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
          <div className="p-5 rounded-2xl bg-emerald-50/60 border-2 border-emerald-300 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl font-bold shadow-md shrink-0">
                🎓
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-md">
                    Khóa học đã chọn
                  </span>
                </div>
                <h3 className="text-base font-black text-emerald-950 mt-1">
                  {config.course_title || `Khóa học #${config.course_id}`}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetCourseSelection}
              className="px-4 py-2 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 shadow-2xs"
            >
              <span>🔄 Thay đổi khóa học</span>
            </button>
          </div>

          {/* Selected Course Modules & Lessons Preview Card */}
          <div className="p-5 rounded-2xl bg-white border border-[#E8E2D9] shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black text-[#2C3039]">
                  Chi tiết nội dung khóa học được trích xuất
                </h4>
                <p className="text-[11px] font-bold text-[#8A8478] mt-0.5">
                  AI sẽ sử dụng dữ liệu thực tế từ bài học trong khóa này để sinh bộ câu hỏi.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold shrink-0">
                <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-[#C0392B] border border-indigo-100">
                  {modulesList.length} Modules
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 border border-purple-100">
                  {lessonsList.length} Lessons
                </span>
              </div>
            </div>

            {isLoadingDetails ? (
              <div className="text-[11px] font-bold text-gray-400 animate-pulse pt-2">
                Đang nạp danh sách các bài học thuộc khóa học...
              </div>
            ) : lessonsList.length > 0 ? (
              <div className="flex flex-col gap-1.5 pt-2 border-t border-gray-100">
                <span className="text-[11px] font-bold text-[#8A8478] uppercase tracking-wider">
                  Các bài học được trích xuất:
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1">
                  {lessonsList.map((les, idx) => (
                    <span
                      key={les.id || idx}
                      className="px-2.5 py-1 rounded-lg bg-[#FEFCF9] border border-[#E8E2D9] text-gray-700 text-[11px] font-bold truncate max-w-xs"
                      title={les.title}
                    >
                      Bài {idx + 1}: {les.title}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-[11px] font-bold text-gray-400 pt-2 border-t border-gray-100">
                Khóa học hiện chưa có bài học nào. AI sẽ sử dụng thông tin tổng quan của khóa học để thiết kế câu hỏi.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Warning Alert if User Tries to Continue Without Selecting Course */}
      {showWarning && !config.course_id && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 font-bold text-xs flex items-center gap-2 animate-fadeIn shadow-2xs">
          <span className="text-base">⚠️</span>
          <span>Vui lòng chọn một khóa học trước khi tiếp tục.</span>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="flex items-center justify-end border-t border-gray-100 pt-4 mt-2">
        <button
          type="button"
          onClick={() => {
            if (!config.course_id) {
              setShowWarning(true);
              return;
            }
            onNext();
          }}
          disabled={!config.course_id}
          className="px-8 py-3 bg-[#C0392B] hover:bg-[#4338CA] text-white font-black text-xs rounded-2xl shadow-lg hover:scale-[1.02] transition-all disabled:opacity-40 disabled:hover:scale-100 cursor-pointer disabled:cursor-not-allowed"
        >
          Tiếp theo: Cấu hình Quiz ➡️
        </button>
      </div>
    </div>
  );
}
