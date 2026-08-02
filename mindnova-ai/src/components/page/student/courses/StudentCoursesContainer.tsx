"use client";

import React, { useState, useMemo } from "react";
import { CoursesHeader } from "./CoursesHeader";
import { MyCourseCard } from "./MyCourseCard";
import { ExploreMoreCard } from "./ExploreMoreCard";
import { MY_COURSES } from "./constants";

export function StudentCoursesContainer() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAiTip, setShowAiTip] = useState(true);

  const inProgressCount = useMemo(
    () => MY_COURSES.filter((c) => c.status === "in-progress").length,
    []
  );
  const completedCount = useMemo(
    () => MY_COURSES.filter((c) => c.status === "completed").length,
    []
  );

  const filteredCourses = useMemo(() => {
    return MY_COURSES.filter((c) => {
      if (activeTab === "in-progress" && c.status !== "in-progress") return false;
      if (activeTab === "completed" && c.status !== "completed") return false;
      if (activeTab === "not-started" && c.status !== "not-started") return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = c.title.toLowerCase().includes(q);
        const matchInstructor = c.instructorName?.toLowerCase().includes(q) || false;
        const matchCategory = c.category?.toLowerCase().includes(q) || false;
        return matchTitle || matchInstructor || matchCategory;
      }
      return true;
    });
  }, [activeTab, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F4F4F8] p-6 md:p-8 flex flex-col font-sans max-w-7xl mx-auto w-full">
      <CoursesHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        inProgressCount={inProgressCount}
        completedCount={completedCount}
        totalCount={MY_COURSES.length}
      />

      {/* AI Study Mentor Card */}
      {showAiTip && (
        <div className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 border border-indigo-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#4F46E5] text-white flex items-center justify-center font-black text-xl shadow-sm shrink-0">
              🤖
            </div>
            <div>
              <h3 className="text-sm font-black text-indigo-950 flex items-center gap-2">
                <span>Trợ lý AI Tối ưu Lộ trình Học tập</span>
                <span className="px-2 py-0.5 rounded-md bg-indigo-200/60 text-[#4F46E5] text-[10px] font-extrabold uppercase">
                  Personalized
                </span>
              </h3>
              <p className="text-xs text-indigo-900 mt-0.5 font-medium leading-relaxed">
                Bạn đang duy trì chuỗi học tập cực tốt! Khóa học <span className="font-extrabold text-[#4F46E5]">&quot;Next.js 16 Fullstack Mastery&quot;</span> đã đạt 72% tiến độ. Hãy ưu tiên hoàn thành module <span className="underline font-bold">&quot;Route Handlers&quot;</span> hôm nay để sớm mở khóa Chứng chỉ Blockchain nhé.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowAiTip(false)}
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-indigo-100/50 text-[#4F46E5] text-xs font-extrabold border border-indigo-200 shadow-2xs transition-all shrink-0 cursor-pointer"
          >
            Đã hiểu ✕
          </button>
        </div>
      )}

      {/* Search & Action Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            🔍
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm khóa học, tên giảng viên hoặc chuyên ngành..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-bold text-gray-900 placeholder:text-gray-400 placeholder:font-normal bg-white border border-gray-200 focus:outline-none focus:border-[#4F46E5] transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-700 text-xs font-bold cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold shrink-0">
          <span>Sắp xếp theo:</span>
          <select className="appearance-none px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-gray-800 font-extrabold shadow-2xs cursor-pointer focus:outline-none">
            <option value="recent">⏱️ Truy cập gần đây nhất</option>
            <option value="progress-desc">🔥 Tiến độ cao nhất</option>
            <option value="title-asc">alphabet A ➔ Z</option>
          </select>
        </div>
      </div>

      {/* Course Grid Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12 items-stretch">
        {filteredCourses.map((course) => (
          <MyCourseCard key={course.id} course={course} />
        ))}

        <ExploreMoreCard />
      </div>

      {filteredCourses.length === 0 && (
        <div className="bg-white p-12 rounded-2xl border border-gray-200 shadow-2xs text-center flex flex-col items-center justify-center max-w-md mx-auto my-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-[#4F46E5] text-2xl flex items-center justify-center mb-4 border border-indigo-100">
            📂
          </div>
          <h3 className="text-base font-black text-gray-900">Không tìm thấy khóa học phù hợp</h3>
          <p className="text-xs text-gray-500 mt-1 mb-6">
            Không có chuyên đề hoặc khóa học nào phù hợp với bộ lọc &quot;{searchQuery || activeTab}&quot; của bạn.
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveTab("all");
              setSearchQuery("");
            }}
            className="px-5 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-extrabold text-xs shadow-2xs transition-all cursor-pointer"
          >
            Hiển thị toàn bộ danh sách ➔
          </button>
        </div>
      )}
    </div>
  );
}
