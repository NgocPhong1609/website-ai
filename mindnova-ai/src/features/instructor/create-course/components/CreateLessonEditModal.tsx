"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { RichTextEditor } from "../../shared/components/RichTextEditor";
import { QuizEditor } from "./QuizEditor";
import type { DraftLesson, DraftLessonType, DraftQuizData } from "../types";
import { useUploadTempMedia, useDeleteTempMedia } from "../api";

interface CreateLessonEditModalProps {
  lesson: DraftLesson;
  onSave: (id: string, updates: Partial<DraftLesson>) => void;
  onClose: () => void;
}

export function CreateLessonEditModal({ lesson, onSave, onClose }: CreateLessonEditModalProps) {
  const [title, setTitle] = useState(lesson.title);
  const [type, setType] = useState<DraftLessonType>(lesson.type);
  const [content, setContent] = useState((lesson as any).content || "");
  const [quizData, setQuizData] = useState<DraftQuizData | undefined>(lesson.quizData);

  const [tempMediaMap, setTempMediaMap] = useState<Map<string, number>>(new Map());
  const [isSaving, setIsSaving] = useState(false);
  
  const [videoMethod, setVideoMethod] = useState<'upload' | 'url'>('upload');
  const [videoUrl, setVideoUrl] = useState(lesson.video_url || "");
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);

  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [activeImageUploads, setActiveImageUploads] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const uploadTempMedia = useUploadTempMedia();
  const deleteTempMedia = useDeleteTempMedia();

  const hasUnsavedChanges = 
    title !== lesson.title ||
    type !== lesson.type ||
    content !== ((lesson as any).content || "") ||
    JSON.stringify(quizData || null) !== JSON.stringify(lesson.quizData || null);

  const handleVideoUpload = async (file: File, onProgress: (p: number) => void) => {
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    setIsUploadingVideo(true);

    try {
      const result = await uploadTempMedia.mutateAsync({
        file,
        signal: abortController.signal,
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
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handleVideoMethodChange = (method: 'upload' | 'url') => {
    setVideoMethod(method);
    setVideoUrl("");
    setVideoUploadProgress(0);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsUploadingVideo(false);
  };

  const handleVideoFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const { url } = await handleVideoUpload(file, (progress) => {
        setVideoUploadProgress(progress);
      });
      setVideoUrl(url);
    } catch (error: any) {
      if (error.name !== 'CanceledError') {
        alert("Có lỗi xảy ra khi tải video. Vui lòng thử lại.");
        console.error(error);
      }
    } finally {
      setVideoUploadProgress(0);
    }
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    setActiveImageUploads(prev => prev + 1);
    try {
      const result = await uploadTempMedia.mutateAsync({ file });
      if (result && result.url && result.media_id) {
        setTempMediaMap(prev => {
          const newMap = new Map(prev);
          newMap.set(result.url, result.media_id);
          return newMap;
        });
        return result.url;
      }
      throw new Error("Upload failed");
    } finally {
      setActiveImageUploads(prev => Math.max(0, prev - 1));
    }
  };

  const handleClose = useCallback(() => {
    if (isSaving) {
      alert("Hệ thống đang lưu dữ liệu. Vui lòng chờ trong giây lát.");
      return;
    }
    if (isUploadingVideo || activeImageUploads > 0) {
      if (!confirm("Tiến trình tải lên đang diễn ra. Bạn có chắc chắn muốn dừng tải lên và đóng?")) {
        return;
      }
      abortControllerRef.current?.abort();
    } else if (hasUnsavedChanges) {
      if (!confirm("Bạn có thay đổi chưa lưu. Bạn có chắc chắn muốn đóng?")) {
        return;
      }
    }
    
    if (tempMediaMap.size > 0) {
      Array.from(tempMediaMap.values()).forEach(mediaId => {
        deleteTempMedia.mutate(mediaId).catch(console.error);
      });
    }
    setTempMediaMap(new Map());
    onClose();
  }, [isSaving, isUploadingVideo, activeImageUploads, hasUnsavedChanges, tempMediaMap, onClose, deleteTempMedia]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges || isUploadingVideo || isSaving || activeImageUploads > 0) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [hasUnsavedChanges, isUploadingVideo, isSaving, activeImageUploads, handleClose]);

  const handleSave = () => {
    setIsSaving(true);
    try {
      let finalContent = content;
      finalContent = finalContent.replace(/poster="data:image\/[^"]+"/g, 'poster=""');

      const usedTempMediaIds: number[] = [...(lesson.temp_media_ids || [])];
      
      Array.from(tempMediaMap.entries()).forEach(([url, id]) => {
        if (finalContent.includes(url) || (videoUrl && videoUrl.includes(url))) {
          usedTempMediaIds.push(id);
        } else {
          deleteTempMedia.mutate(id);
        }
      });

      onSave(lesson.id, { 
        title, 
        type, 
        content: finalContent, 
        quizData: type === 'quiz' ? quizData : undefined, 
        video_url: type === 'video' ? videoUrl : undefined,
        temp_media_ids: usedTempMediaIds 
      } as any);
      setTempMediaMap(new Map());
    } finally {
      setIsSaving(false);
    }
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
                <option value="document">Tài liệu đọc</option>
                <option value="quiz">Bài kiểm tra</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 flex-1 min-h-[400px]">
            {type === 'quiz' ? (
              <QuizEditor 
                value={quizData}
                onChange={setQuizData}
              />
            ) : type === 'video' ? (
              <div className="flex flex-col gap-3 mb-6 p-4 border border-[#EAEAF4] rounded-xl bg-[#F8F8FC]">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-[#1A1A2E]">Video bài học</label>
                  <div className="flex gap-2">
                    <button 
                      type="button" 
                      onClick={() => handleVideoMethodChange('url')}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${videoMethod === 'url' ? 'bg-[#4648D4] text-white' : 'bg-white text-[#64647A] border border-[#EAEAF4]'}`}
                    >
                      Dùng URL
                    </button>
                    <button 
                      type="button" 
                      onClick={() => handleVideoMethodChange('upload')}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${videoMethod === 'upload' ? 'bg-[#4648D4] text-white' : 'bg-white text-[#64647A] border border-[#EAEAF4]'}`}
                    >
                      Tải lên
                    </button>
                  </div>
                </div>
                
                {videoMethod === 'url' ? (
                  <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="Nhập đường dẫn video (YouTube, Vimeo, v.v.)..."
                    className="w-full px-4 py-2.5 rounded-xl text-sm border border-[#EAEAF4] focus:border-[#6B6BFF] focus:ring-2 focus:ring-[#6B6BFF]/20 outline-none"
                  />
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-[#64647A] hover:bg-[#464554] transition-colors">
                        Chọn file video
                        <input type="file" accept="video/*" className="hidden" onChange={handleVideoFileUpload} disabled={isUploadingVideo} />
                      </label>
                      <span className="text-sm text-[#9090B0] truncate flex-1">
                        {isUploadingVideo ? `Đang tải lên... ${videoUploadProgress}%` : (videoUrl || "Chưa chọn file")}
                      </span>
                    </div>
                    {isUploadingVideo && (
                      <div className="w-full h-2 bg-[#EAEAF4] rounded-full overflow-hidden">
                        <div className="h-full bg-[#4648D4] transition-all duration-300" style={{ width: `${videoUploadProgress}%` }} />
                      </div>
                    )}
                    {videoUrl && !isUploadingVideo && videoUrl.includes('r2.dev') && (
                      <div className="text-xs text-[#059669] font-medium bg-[#ECFDF5] px-3 py-1.5 rounded-lg inline-flex max-w-fit">
                        Video đã được tải lên Cloudflare R2
                      </div>
                    )}
                  </div>
                )}

                {videoUrl && !isUploadingVideo && (
                  <div className="mt-2 w-full bg-black rounded-xl overflow-hidden border border-[#EAEAF4] flex items-center justify-center relative">
                    <video 
                      src={videoUrl} 
                      controls 
                      className="w-full max-h-[350px] object-contain"
                    />
                  </div>
                )}
              </div>
            ) : null}

            {type === 'document' && (
              <>
                <label className="text-sm font-semibold text-[#1A1A2E]">Nội dung chi tiết</label>
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Soạn nội dung phong phú cho bài học..."
                  onVideoUpload={handleVideoUpload}
                  onImageUpload={handleImageUpload}
                />
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#F0F0F8] flex justify-end gap-3 bg-[#FAFAFE]">
          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-[#64647A] hover:bg-[#EAEAF4] transition-colors"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || isUploadingVideo || activeImageUploads > 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:-translate-y-0 disabled:cursor-not-allowed"
          >
            {(isSaving || activeImageUploads > 0) ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {(activeImageUploads > 0) ? 'Đang tải ảnh...' : 'Đang lưu...'}
              </>
            ) : 'Lưu bài học'}
          </button>
        </div>

      </div>
    </div>
  );
}
