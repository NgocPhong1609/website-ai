"use client";

import { useState } from "react";
import { RichTextEditor } from "../../shared/components/RichTextEditor";
import type { Lesson, LessonType } from "./Step2CourseStructure";

interface CreateLessonEditModalProps {
  lesson: Lesson;
  onSave: (id: string, updates: Partial<Lesson>) => void;
  onClose: () => void;
}

export function CreateLessonEditModal({ lesson, onSave, onClose }: CreateLessonEditModalProps) {
  const [title, setTitle] = useState(lesson.title);
  const [type, setType] = useState<LessonType>(lesson.type);
  const [content, setContent] = useState((lesson as any).content || "");

  const handleSave = () => {
    onSave(lesson.id, { title, type, content } as any);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-full overflow-hidden animate-fadeIn">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0F0F8]">
          <h2 className="text-[16px] font-bold text-[#1A1A2E]">Soạn thảo bài học</h2>
          <button 
            type="button" 
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9090B0] hover:bg-[#F4F4FA] transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#1A1A2E]">Tên bài học</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm border border-[#EAEAF4] focus:border-[#6B6BFF] focus:ring-2 focus:ring-[#6B6BFF]/20 outline-none transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#1A1A2E]">Loại bài học</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl text-sm border border-[#EAEAF4] focus:border-[#6B6BFF] focus:ring-2 focus:ring-[#6B6BFF]/20 outline-none transition-all appearance-none bg-white"
              >
                <option value="video">Video bài giảng</option>
                <option value="document">Tài liệu đọc</option>
                <option value="quiz">Bài kiểm tra</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 flex-1 min-h-[400px]">
            <label className="text-sm font-semibold text-[#1A1A2E]">Nội dung chi tiết</label>
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Soạn nội dung phong phú cho bài học..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#F0F0F8] flex justify-end gap-3 bg-[#FAFAFE]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-[#64647A] hover:bg-[#EAEAF4] transition-colors"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            Lưu bài học
          </button>
        </div>

      </div>
    </div>
  );
}
