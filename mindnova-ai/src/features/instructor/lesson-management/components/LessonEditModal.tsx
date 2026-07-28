"use client";

import { useState } from "react";
import { RichTextEditor } from "../../shared/components/RichTextEditor";
import { QuizEditor } from "../../create-course/components/QuizEditor";
import { twMerge } from "tailwind-merge";
import { useUploadTempMedia, useDeleteTempMedia } from "../api";
import type { DraftQuizData } from "../../create-course/types";

interface LessonEditModalProps {
  lesson: {
    id: string;
    title: string;
    type: "video" | "article" | "quiz_module";
    status: "published" | "draft";
    content?: string;
    quizData?: DraftQuizData;
  };
  onSave: (id: string, updates: any) => void;
  onClose: () => void;
}

export function LessonEditModal({ lesson, onSave, onClose }: LessonEditModalProps) {
  const [title, setTitle] = useState(lesson.title);
  const [type, setType] = useState(lesson.type);
  const [status, setStatus] = useState(lesson.status);
  const [content, setContent] = useState(lesson.content || "");
  const [quizData, setQuizData] = useState<DraftQuizData | undefined>(lesson.quizData);
  const [tempMediaMap, setTempMediaMap] = useState<Map<string, number>>(new Map());
  const [isSaving, setIsSaving] = useState(false);
  const uploadTempMedia = useUploadTempMedia();
  const deleteTempMedia = useDeleteTempMedia();

  const handleVideoUpload = async (file: File, onProgress: (p: number) => void) => {
    const result = await uploadTempMedia.mutateAsync({
      file,
      onUploadProgress: (progressEvent: any) => {
        if (progressEvent.total) {
          onProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
        }
      }
    });

    if (result && result.url && result.media_id) {
      setTempMediaMap(prev => {
        const newMap = new Map(prev);
        newMap.set(result.url, result.media_id);
        return newMap;
      });
      return { url: result.url, media_id: result.media_id };
    }
    throw new Error("Upload failed");
  };

  const handleClose = () => {
    if (tempMediaMap.size > 0) {
      Array.from(tempMediaMap.values()).forEach(mediaId => {
        deleteTempMedia.mutate(mediaId);
      });
    }
    onClose();
  };

  const handleSave = async () => {
    setIsSaving(true);
    let finalContent = content;

    try {
      finalContent = finalContent.replace(/poster="data:image\/[^"]+"/g, 'poster=""');

      const usedTempMediaIds: number[] = [];
      const contentUrls = Array.from(finalContent.matchAll(/https?:\/\/[^\s"'><]+/g)).map(m => m[0]);
      
      Array.from(tempMediaMap.entries()).forEach(([url, id]) => {
        if (contentUrls.some(cUrl => cUrl.includes(url))) {
          usedTempMediaIds.push(id);
        } else {
          deleteTempMedia.mutate(id);
        }
      });

      onSave(lesson.id, { 
        title, 
        type, 
        status, 
        content: finalContent, 
        quizData, 
        temp_media_ids: usedTempMediaIds 
      });
      setTempMediaMap(new Map());
    } catch (e) {
      console.error("Lỗi khi lưu bài học:", e);
      alert("Đã xảy ra lỗi khi lưu bài học. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={handleClose}
      />
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-full overflow-hidden animate-fadeIn">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0F0F8]">
          <h2 className="text-[16px] font-bold text-[#1A1A2E]">Chỉnh sửa bài học</h2>
          <button 
            type="button" 
            onClick={handleClose}
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
                <option value="article">Tài liệu đọc</option>
                <option value="quiz_module">Bài kiểm tra</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#1A1A2E]">Trạng thái</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  checked={status === 'published'} 
                  onChange={() => setStatus('published')}
                  className="w-4 h-4 text-[#4648D4] focus:ring-[#6B6BFF]"
                />
                <span className="text-sm text-[#464554]">Đã xuất bản</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  checked={status === 'draft'} 
                  onChange={() => setStatus('draft')}
                  className="w-4 h-4 text-[#4648D4] focus:ring-[#6B6BFF]"
                />
                <span className="text-sm text-[#464554]">Bản nháp</span>
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 flex-1 min-h-[400px]">
            {type === 'quiz_module' ? (
              <QuizEditor 
                value={quizData}
                onChange={setQuizData}
              />
            ) : (
              <>
                <label className="text-sm font-semibold text-[#1A1A2E]">Nội dung chi tiết</label>
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Nhập nội dung bài học hoặc chọn video..."
                  onVideoUpload={handleVideoUpload}
                />
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#F0F0F8] bg-[#F8F8FC]">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-[#64647A] bg-white border border-[#EAEAF4] hover:bg-[#F4F4FA] transition-colors disabled:opacity-50"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl font-medium text-white bg-[#4648D4] hover:bg-[#3435A0] transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang lưu...
              </>
            ) : 'Lưu thay đổi'}
          </button>
        </div>
      </div>
    </div>
  );
}
