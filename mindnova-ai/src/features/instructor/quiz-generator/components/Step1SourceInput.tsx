"use client";

import React, { useEffect, useState } from "react";
import { QuizConfig } from "../types/quizGenerator.types";
import { quizGeneratorApi } from "../api/quizGeneratorApi";

interface Step1SourceInputProps {
 config: QuizConfig;
 onChangeConfig: (fields: Partial<QuizConfig>) => void;
 onNext: () => void;
}

export function Step1SourceInput({ config, onChangeConfig, onNext }: Step1SourceInputProps) {
 const [courses, setCourses] = useState<any[]>([]);
 const [isLoadingCourses, setIsLoadingCourses] = useState(true);
 const [selectedCourseDetails, setSelectedCourseDetails] = useState<any>(null);
 const [isLoadingDetails, setIsLoadingDetails] = useState(false);

 // Fetch instructor's owned courses
 useEffect(() => {
 let isMounted = true;
 setIsLoadingCourses(true);
 quizGeneratorApi
 .getInstructorCourses()
 .then((res) => {
 if (isMounted && res?.data && Array.isArray(res.data)) {
 setCourses(res.data);
 // If source_type is default or empty, auto-select course mode if instructor has courses
 if (res.data.length > 0) {
 if (!config.course_id) {
 const firstCourse = res.data[0];
 onChangeConfig({
 source_type: "course",
 course_id: firstCourse.id,
 course_title: firstCourse.title,
 title: `Đề kiểm tra: ${firstCourse.title}`,
 });
 } else if (config.source_type !== "course") {
 // Ensure course mode is optionable
 }
 } else {
 // No courses owned, fallback to topic or content
 if (config.source_type === "course") {
 onChangeConfig({ source_type: "topic" });
 }
 }
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
 if (config.course_id && config.source_type === "course") {
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
 }, [config.course_id, config.source_type]);

 const handleSelectCourse = (courseId: number) => {
 const course = courses.find((c) => c.id === courseId);
 if (course) {
 onChangeConfig({
 source_type: "course",
 course_id: course.id,
 course_title: course.title,
 title: `Đề kiểm tra: ${course.title}`,
 });
 }
 };

 const isContentValid =
 config.source_type === "course"
 ? Boolean(config.course_id && config.course_id > 0)
 : config.source_type === "content"
 ? config.source_content.trim().length >= 10
 : config.topic.trim().length >= 3;

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

 // Fallback if course has no modules but direct lessons exist
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
       <h2 className="text-xl font-black text-[#2C3039]">Nguồn Dữ Liệu Tạo Đề Bài Kiểm Tra</h2>
     </div>
     <p className="text-xs text-[#8A8478] font-medium mt-1">
       Chọn nguồn dữ liệu bài học hoặc chủ đề để AI tự động phân tích ngữ cảnh và trích xuất câu hỏi chuẩn xác.
     </p>
   </div>

   {/* 3 Source Types Selection */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
 {/* Option 1: Course-Based */}
 <button
 type="button"
 onClick={() => {
 const firstCourse = courses[0];
 onChangeConfig({
 source_type: "course",
 course_id: firstCourse ? firstCourse.id : undefined,
 course_title: firstCourse ? firstCourse.title : undefined,
 title: firstCourse ? `Đề kiểm tra: ${firstCourse.title}` : config.title,
 });
 }}
 className={`p-5 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer flex flex-col gap-2 relative ${
 config.source_type === "course"
 ? "border-[#C0392B] bg-indigo-50/40 shadow-[0_4px_20px_rgba(79,70,229,0.08)]"
 : "border-[#E8E2D9] hover:border-gray-300 bg-white"
 }`}
 >
 <div className="flex items-center justify-between">
 
 <input
 type="radio"
 checked={config.source_type === "course"}
 onChange={() => {}}
 className="w-4 h-4 text-[#C0392B]"
 />
 </div>
 <div className="flex items-center gap-1.5">
 <h3 className="text-sm font-extrabold text-[#2C3039]">1. Chọn Từ Khóa Học</h3>
 <span className="px-1.5 py-0.5 -[#FAF7F2] -[#2C3039] text-[10px] font-black rounded-md">
 Tự động
 </span>
 </div>
 <p className="text-xs text-[#8A8478] font-medium leading-relaxed">
 AI đọc toàn bộ bài học thuộc khóa học của bạn để tạo câu hỏi bám sát chương trình.
 </p>
 </button>

 {/* Option 2: Content-Based */}
 <button
 type="button"
 onClick={() => onChangeConfig({ source_type: "content" })}
 className={`p-5 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer flex flex-col gap-2 ${
 config.source_type === "content"
 ? "border-[#C0392B] bg-indigo-50/40 shadow-[0_4px_20px_rgba(79,70,229,0.08)]"
 : "border-[#E8E2D9] hover:border-gray-300 bg-white"
 }`}
 >
 <div className="flex items-center justify-between">
 
 <input
 type="radio"
 checked={config.source_type === "content"}
 onChange={() => {}}
 className="w-4 h-4 text-[#C0392B]"
 />
 </div>
 <h3 className="text-sm font-extrabold text-[#2C3039]">2. Dán Nội Dung Thủ Công</h3>
 <p className="text-xs text-[#8A8478] font-medium leading-relaxed">
 Dán bài giảng, tài liệu PDF hoặc văn bản bất kỳ để AI tạo câu hỏi từ đoạn văn bản đó.
 </p>
 </button>

 {/* Option 3: Topic-Based */}
 <button
 type="button"
 onClick={() => onChangeConfig({ source_type: "topic" })}
 className={`p-5 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer flex flex-col gap-2 ${
 config.source_type === "topic"
 ? "border-[#C0392B] bg-indigo-50/40 shadow-[0_4px_20px_rgba(79,70,229,0.08)]"
 : "border-[#E8E2D9] hover:border-gray-300 bg-white"
 }`}
 >
 <div className="flex items-center justify-between">
 
 <input
 type="radio"
 checked={config.source_type === "topic"}
 onChange={() => {}}
 className="w-4 h-4 text-[#C0392B]"
 />
 </div>
 <h3 className="text-sm font-extrabold text-[#2C3039]">3. Tạo Theo Chủ Đề Tự Nhiên</h3>
 <p className="text-xs text-[#8A8478] font-medium leading-relaxed">
 Nhập tên chủ đề (VD: "Toán hệ nhị phân", "React Hooks"). AI sẽ tự sinh câu hỏi kiến thức.
 </p>
 </button>
 </div>

  {/* Interactive Input Form Area */}
  {config.source_type === "course" ? (
    <div className="flex flex-col gap-4 p-6 rounded-2xl bg-[#FAF8FF] border border-gray-100">
      {config.course_id ? (
        <div className="p-3.5 rounded-xl bg-white border border-indigo-100 flex items-center justify-between text-xs font-bold text-indigo-950 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎓</span>
            <div>
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider block">Khóa học đang soạn</span>
              <span className="text-xs font-black text-indigo-950">{config.course_title || `Khóa học #${config.course_id}`}</span>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-extrabold text-[11px]">
            Đã chọn
          </span>
        </div>
      ) : (
        <div>
          <label className="block text-xs font-extrabold text-[#2C3039] mb-2 uppercase tracking-wider">
            Chọn khóa học của bạn do bạn quản lý:
          </label>
          {isLoadingCourses ? (
            <div className="p-4 bg-white rounded-xl border border-[#E8E2D9] text-xs font-bold text-[#8A8478] animate-pulse">
              Đang tải danh sách khóa học...
            </div>
          ) : courses.length === 0 ? (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex flex-col gap-1">
              <span>⚠️ Bạn chưa có khóa học nào trong tài khoản.</span>
              <span className="text-[11px] font-medium text-amber-700">
                Hãy chọn phương thức "Dán nội dung thủ công" hoặc "Tạo theo chủ đề" ở trên để tiếp tục.
              </span>
            </div>
          ) : (
            <select
              value={config.course_id || ""}
              onChange={(e) => handleSelectCourse(Number(e.target.value))}
              className="w-full p-3.5 rounded-xl border-2 border-gray-200 bg-white text-xs font-bold text-[#2C3039] focus:outline-none focus:border-[#C0392B] shadow-xs"
            >
              <option value="" disabled>-- Chọn khóa học --</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} (ID: #{c.id})
                </option>
              ))}
            </select>
          )}
        </div>
      )}

 {/* Selected Course Breakdown & Verification Card */}
 {config.course_id && (
 <div className="p-5 rounded-2xl bg-white border -[#FAF7F2] shadow-sm flex flex-col gap-3">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 
 <div>
 <h4 className="text-xs font-black text-[#2C3039]">
 {config.course_title || "Khóa học đã chọn"}
 </h4>
 <p className="text-[11px] font-bold -[#2C3039] flex items-center gap-1">
 <span></span>
 <span>AI sẽ sử dụng nội dung thực tế của các bài học trong khóa học này để tạo đề.</span>
 </p>
 </div>
 </div>

 <div className="flex items-center gap-2 text-xs font-bold">
 <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-[#C0392B] border -[#FAF7F2]">
 {modulesList.length} Modules
 </span>
 <span className="px-2.5 py-1 rounded-lg bg-purple-50 -[#C0392B] border -[#FAF7F2]">
 {lessonsList.length} Lessons
 </span>
 </div>
 </div>

 {/* Lesson Verification Badge Chips */}
 {isLoadingDetails ? (
 <div className="text-[11px] font-bold text-gray-400 animate-pulse">
 Đang nạp danh sách các bài học thuộc khóa học...
 </div>
 ) : lessonsList.length > 0 ? (
 <div className="flex flex-col gap-1.5 pt-2 border-t border-gray-100">
 <span className="text-[11px] font-bold text-[#8A8478] uppercase tracking-wider">
 Các bài học được AI trích xuất (Tối đa {lessonsList.length} bài):
 </span>
 <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1">
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
 <div className="text-[11px] font-bold text-gray-400">
 Khóa học hiện chưa có bài học nào. AI sẽ sử dụng thông tin tổng quan của khóa học để thiết kế câu hỏi.
 </div>
 )}
 </div>
 )}
 </div>
 ) : config.source_type === "content" ? (
 <div className="flex flex-col gap-2">
 <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
 <span>Nội dung tài liệu / Bài giảng (Tối thiểu 10 ký tự)</span>
 <span className="text-gray-400 font-mono text-[11px]">{config.source_content.length} ký tự</span>
 </label>
 <textarea
 value={config.source_content}
 onChange={(e) => onChangeConfig({ source_content: e.target.value })}
 rows={7}
 placeholder="Dán nội dung bài học, tài liệu lý thuyết hoặc ghi chú khóa học vào đây..."
 className="w-full p-4 rounded-2xl border border-[#E8E2D9] bg-[#FAF8FF] text-xs font-medium text-gray-800 leading-relaxed focus:outline-none focus:border-[#C0392B] focus:bg-white transition-all shadow-inner"
 />
 </div>
 ) : (
 <div className="flex flex-col gap-2">
 <label className="text-xs font-bold text-gray-700">Chủ đề hoặc Yêu cầu kiến thức (Topic)</label>
 <input
 type="text"
 value={config.topic}
 onChange={(e) => onChangeConfig({ topic: e.target.value })}
 placeholder="VD: Toán nhị phân và logic máy tính, JavaScript ES6 Async/Await..."
 className="w-full p-4 rounded-2xl border border-[#E8E2D9] bg-[#FAF8FF] text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#C0392B] focus:bg-white transition-all shadow-inner"
 />
 <div className="flex items-center gap-2 mt-1">
 <span className="text-[11px] font-bold text-gray-400">Gợi ý chủ đề nhanh:</span>
 {["Hệ nhị phân", "React Hooks", "Cấu trúc dữ liệu & Giải thuật", "SQL Join & Index"].map((item) => (
 <button
 key={item}
 type="button"
 onClick={() => onChangeConfig({ topic: item })}
 className="px-2.5 py-1 bg-gray-100 hover:bg-indigo-50 hover:text-[#C0392B] text-[#8A8478] text-[11px] font-extrabold rounded-lg transition-all cursor-pointer"
 >
 + {item}
 </button>
 ))}
 </div>
 </div>
 )}

 {/* Footer Navigation */}
 <div className="flex items-center justify-end border-t border-gray-100 pt-4 mt-2">
 <button
 type="button"
 onClick={onNext}
 disabled={!isContentValid}
 className="px-8 py-3 bg-[#C0392B] to-[#6366F1] hover:from-[#4338CA] hover: text-white font-black text-xs rounded-2xl shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
 >
 Tiếp theo: Cấu hình thông số 
 </button>
 </div>
 </div>
 );
}
