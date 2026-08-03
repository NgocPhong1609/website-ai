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
  const [videoUrl, setVideoUrl] = useState((lesson as any).videoUrl || (lesson as any).video_url || "");
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
        deleteTempMedia.mutate(mediaId);
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
        videoUrl: type === 'video' ? videoUrl : undefined,
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
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-black text-gray-900">
            {type === 'video' ? '🎬 Soạn thảo Video' : type === 'quiz' ? '📝 Soạn thảo Trắc nghiệm' : '📄 Soạn thảo Tài liệu'}
          </h2>
          <button 
            type="button" 
            onClick={handleClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-black text-gray-900">Tên bài học</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm border border-gray-200 focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 outline-none transition-all font-bold text-gray-900"
              placeholder="Nhập tên bài học..."
            />
          </div>

          <div className="flex flex-col gap-1.5 flex-1 min-h-[400px]">
            {type === 'quiz' ? (
              <QuizEditor 
                value={quizData}
                onChange={setQuizData}
              />
            ) : type === 'video' ? (
              <div className="flex flex-col gap-3 mb-6 p-5 border border-gray-200 rounded-2xl bg-gray-50/50 shadow-2xs">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-black text-gray-900">Nguồn video bài học</label>
                  <div className="flex gap-2 p-1 rounded-xl bg-gray-100 border border-gray-200">
                    <button 
                      type="button" 
                      onClick={() => handleVideoMethodChange('url')}
                      className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-colors ${videoMethod === 'url' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      Dùng URL
                    </button>
                    <button 
                      type="button" 
                      onClick={() => handleVideoMethodChange('upload')}
                      className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-colors ${videoMethod === 'upload' ? 'bg-[#4F46E5] text-white shadow-2xs' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      Tải lên máy chủ
                    </button>
                  </div>
                </div>
                
                {videoMethod === 'url' ? (
                  <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="Nhập đường dẫn video (YouTube, Vimeo, v.v.)..."
                    className="w-full px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-200 focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 outline-none"
                  />
                ) : (
                  (!videoUrl || isUploadingVideo) && (
                    <div className="w-full p-9 rounded-2xl border-2 border-dashed border-gray-300 bg-white hover:bg-indigo-50/30 hover:border-[#4F46E5] transition-all flex flex-col items-center justify-center text-center group shadow-2xs relative mt-1">
                      <input type="file" accept="video/mp4,video/quicktime,.mp4,.mov" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" onChange={handleVideoFileUpload} disabled={isUploadingVideo} />
                      <div className="text-[#4F46E5] group-hover:scale-110 transition-transform mb-2">
                        <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21.2 15c.7-1.2 1-2.5.7-3.9-.6-2-2.4-3.5-4.4-3.5h-.5C16.3 5.3 14.3 3.6 12 3.6c-3 0-5.5 2.5-5.5 5.5v.5C4.5 9.7 3 11.6 3 13.7c0 2.5 2 4.5 4.5 4.5h13.7" />
                          <polyline points="16 16 12 12 8 16" />
                          <line x1="12" y1="12" x2="12" y2="21" />
                        </svg>
                      </div>
                      {isUploadingVideo ? (
                        <>
                          <h5 className="text-sm font-black text-gray-900">Đang tải lên và xử lý... {videoUploadProgress}%</h5>
                          <div className="w-full h-2 mt-4 bg-gray-200 rounded-full overflow-hidden max-w-[200px]">
                            <div className="h-full bg-[#4F46E5] transition-all duration-300" style={{ width: `${videoUploadProgress}%` }} />
                          </div>
                        </>
                      ) : (
                        <>
                          <h5 className="text-sm font-black text-gray-900">Kéo và thả tệp video MP4 hoặc MOV vào đây</h5>
                          <p className="text-xs font-medium text-gray-500 max-w-md mt-1 leading-relaxed">
                            Hệ thống AI tự động nén, chuyển mã video đa độ phân giải (<strong className="text-[#4F46E5]">1080p, 720p, 480p</strong>) và tạo hình thu nhỏ thông minh.
                          </p>
                          <button
                            type="button"
                            className="mt-4 px-5 py-2 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-extrabold shadow-2xs transition-all pointer-events-none"
                          >
                            Chọn tệp video từ máy tính
                          </button>
                        </>
                      )}
                    </div>
                  )
                )}

                {videoUrl && !isUploadingVideo && (
                  <div className="mt-3 flex flex-col gap-3">
                    <div className="w-full bg-black rounded-2xl overflow-hidden border border-gray-200 flex items-center justify-center relative shadow-sm">
                      <video 
                        src={videoUrl} 
                        controls 
                        className="w-full max-h-[350px] object-contain"
                      />
                    </div>
                    {videoMethod === 'upload' && (
                      <div className="flex justify-end">
                        <label className="cursor-pointer px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-gray-800 hover:bg-gray-700 transition-colors shadow-2xs flex items-center gap-2">
                          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                          Thay thế video khác
                          <input type="file" accept="video/mp4,video/quicktime,.mp4,.mov" className="hidden" onChange={handleVideoFileUpload} />
                        </label>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : null}

            {type === 'document' && (
              <>
                <label className="text-sm font-black text-gray-900">Nội dung chi tiết</label>
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
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-colors cursor-pointer"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || isUploadingVideo || activeImageUploads > 0}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black text-white bg-[#4F46E5] shadow-2xs hover:bg-[#4338CA] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
