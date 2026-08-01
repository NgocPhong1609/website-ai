"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
    video_url?: string;
    quizData?: DraftQuizData;
  };
  onSave: (id: string, updates: any) => Promise<void> | void;
  onClose: () => void;
}

export function LessonEditModal({ lesson, onSave, onClose }: LessonEditModalProps) {
  const [title, setTitle] = useState(lesson.title);
  const [type, setType] = useState(lesson.type);
  const [status, setStatus] = useState(lesson.status);
  const [content, setContent] = useState(lesson.content || "");
  const [videoUrl, setVideoUrl] = useState(() => {
    if (lesson.video_url) return lesson.video_url;
    if (lesson.type === 'video' && lesson.content) {
      const match = lesson.content.match(/url="([^"]+)"/);
      if (match) return match[1];
      const match2 = lesson.content.match(/https?:\/\/[^\s"'><]+/);
      if (match2) return match2[0];
    }
    return "";
  });
  const [videoMethod, setVideoMethod] = useState<'upload' | 'url'>('url');
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);
  const [quizData, setQuizData] = useState<DraftQuizData | undefined>(lesson.quizData);
  const [tempMediaMap, setTempMediaMap] = useState<Map<string, number>>(new Map());
  const [isSaving, setIsSaving] = useState(false);
  const [activeImageUploads, setActiveImageUploads] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const hasUnsavedChanges = 
    title !== lesson.title ||
    type !== lesson.type ||
    status !== lesson.status ||
    content !== (lesson.content || "") ||
    videoUrl !== (lesson.video_url || "") ||
    JSON.stringify(quizData || null) !== JSON.stringify(lesson.quizData || null);

  const uploadTempMedia = useUploadTempMedia();
  const deleteTempMedia = useDeleteTempMedia();

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
    
    // Cleanup any orphaned temp media
    Array.from(tempMediaMap.values()).forEach(id => {
      deleteTempMedia.mutate(id);
    });
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
  }, [isUploadingVideo, tempMediaMap.size, hasUnsavedChanges, isSaving, handleClose]);

  const handleVideoUpload = async (file: File, onProgress: (p: number) => void) => {
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

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
  };

  const handleVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingVideo(true);
    setVideoUploadProgress(0);
    try {
      const result = await handleVideoUpload(file, setVideoUploadProgress);
      setVideoUrl(result.url);
    } catch (err: any) {
      if (err?.name === 'CanceledError' || err?.code === 'ERR_CANCELED' || err?.message === 'canceled') {
        console.log("Upload cancelled by user");
      } else {
        console.error(err);
        alert("Đã xảy ra lỗi khi tải video.");
      }
    } finally {
      setIsUploadingVideo(false);
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

  const handleVideoMethodChange = (method: 'upload' | 'url') => {
    if (isUploadingVideo) {
      if (!window.confirm("Video đang được tải lên. Bạn có chắc chắn muốn dừng tải lên và chuyển phương thức?")) {
        return;
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      setIsUploadingVideo(false);
      setVideoUploadProgress(0);
    }
    setVideoMethod(method);
  };

  const handleSave = async () => {
    setIsSaving(true);
    let finalContent = content;

    try {
      finalContent = finalContent.replace(/poster="data:image\/[^"]+"/g, 'poster=""');

      const usedTempMediaIds: number[] = [];
      Array.from(tempMediaMap.entries()).forEach(([url, id]) => {
        if (finalContent.includes(url) || (videoUrl && videoUrl.includes(url))) {
          usedTempMediaIds.push(id);
        } else {
          deleteTempMedia.mutate(id);
        }
      });

      const updates: any = {
        title,
        type,
        status,
        content: finalContent,
        video_url: type === 'video' ? videoUrl : undefined,
        quizData: type === 'quiz_module' ? quizData : undefined,
        temp_media_ids: usedTempMediaIds
      };
      
      await onSave(lesson.id, updates);
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
            ) : (
              <>
                <label className="text-sm font-semibold text-[#1A1A2E]">Nội dung chi tiết</label>
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Nhập nội dung bài học..."
                  onVideoUpload={handleVideoUpload}
                  onImageUpload={handleImageUpload}
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
            disabled={isSaving || isUploadingVideo || activeImageUploads > 0}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:-translate-y-0 disabled:cursor-not-allowed"
          >
            {(isSaving || activeImageUploads > 0) ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {(activeImageUploads > 0) ? 'Đang tải ảnh...' : 'Đang lưu...'}
              </>
            ) : 'Lưu thay đổi'}
          </button>
        </div>
      </div>
    </div>
  );
}
