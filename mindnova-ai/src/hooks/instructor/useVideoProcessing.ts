"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export type ProcessingStage = "idle" | "uploading" | "compressing" | "transcoding" | "thumbnails" | "ready" | "error";

export interface VideoItem {
  id: string;
  fileName: string;
  fileSizeMb: number;
  format: "mp4" | "mov" | "other";
  uploadProgress: number; // 0 to 100
  stage: ProcessingStage;
  stageLabel: string;
  resolutions: string[]; // e.g. ["1080p", "720p", "480p"]
  thumbnailUrl?: string;
  errorMsg?: string;
}

export interface UseVideoProcessingReturn {
  videos: VideoItem[];
  isProcessingAny: boolean;
  uploadError: string | null;
  handleDropFiles: (files: FileList | File[]) => void;
  removeVideo: (id: string) => void;
  clearAllCompleted: () => void;
}

const MEMORY_STORAGE_KEY = "mindnova_instructor_video_queue";

export function useVideoProcessing(): UseVideoProcessingReturn {
  const [videos, setVideos] = useState<VideoItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(MEMORY_STORAGE_KEY);
        if (saved) return JSON.parse(saved) as VideoItem[];
      } catch {
        // ignore
      }
    }
    return [
      {
        id: "vid-init-1",
        fileName: "Module2-ServerActions-FullstackDemo.mp4",
        fileSizeMb: 142.5,
        format: "mp4",
        uploadProgress: 100,
        stage: "ready",
        stageLabel: "✓ Ready in 1080p, 720p, 480p + Auto-Thumbnail Generated",
        resolutions: ["1080p (HD)", "720p (HD)", "480p (SD)"],
        thumbnailUrl: "/thumbnails/server-actions-preview.jpg",
      },
    ];
  });

  const [uploadError, setUploadError] = useState<string | null>(null);
  const timersRef = useRef<Record<string, NodeJS.Timeout>>({});

  // Synchronize queue to storage so instructor can navigate away while processing completes asynchronously
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(videos));
      } catch {
        // ignore
      }
    }
  }, [videos]);

  const isProcessingAny = videos.some(
    (v) => v.stage !== "ready" && v.stage !== "idle" && v.stage !== "error"
  );

  // Background state transition simulation
  const startAsynchronousProcessing = useCallback((id: string) => {
    // Stage 1: Upload progress loop
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 25) + 15;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);

        // Transition to Stage 2: Compressing
        setVideos((prev) =>
          prev.map((v) =>
            v.id === id ? { ...v, uploadProgress: 100, stage: "compressing", stageLabel: "⚙️ Compressing raw video stream..." } : v
          )
        );

        // Transition to Stage 3: Transcoding resolutions
        setTimeout(() => {
          setVideos((prev) =>
            prev.map((v) =>
              v.id === id ? { ...v, stage: "transcoding", stageLabel: "🔄 Transcoding to multiple resolutions (1080p, 720p, 480p)..." } : v
            )
          );

          // Transition to Stage 4: Auto-generating thumbnail
          setTimeout(() => {
            setVideos((prev) =>
              prev.map((v) =>
                v.id === id ? { ...v, stage: "thumbnails", stageLabel: "🖼️ Auto-generating high-contrast timestamp thumbnails..." } : v
              )
            );

            // Transition to Stage 5: Ready
            setTimeout(() => {
              setVideos((prev) =>
                prev.map((v) =>
                  v.id === id
                    ? {
                        ...v,
                        stage: "ready",
                        stageLabel: "✓ Ready in 1080p, 720p, 480p + Auto-Thumbnail Generated",
                        resolutions: ["1080p (HD)", "720p (HD)", "480p (SD)"],
                      }
                    : v
                )
              );
            }, 2500);
          }, 2800);
        }, 3000);
      } else {
        setVideos((prev) =>
          prev.map((v) =>
            v.id === id
              ? { ...v, uploadProgress: currentProgress, stageLabel: `⬆️ Uploading stream (${currentProgress}%)...` }
              : v
          )
        );
      }
    }, 450);

    timersRef.current[id] = interval;
  }, []);

  const handleDropFiles = useCallback((incomingFiles: FileList | File[]) => {
    setUploadError(null);
    const fileArray = Array.from(incomingFiles);
    if (fileArray.length === 0) return;

    const newItems: VideoItem[] = [];

    for (const file of fileArray) {
      const ext = file.name.split(".").pop()?.toLowerCase() || "";
      const isVideo = ext === "mp4" || ext === "mov" || file.type.startsWith("video/");

      if (!isVideo) {
        setUploadError(`Unsupported format for "${file.name}". Strict rule: Only standard MP4 and MOV video formats are accepted.`);
        continue;
      }

      const newId = `vid-${Date.now()}-${Math.floor(Math.random() * 9999)}`;
      const item: VideoItem = {
        id: newId,
        fileName: file.name,
        fileSizeMb: Number((file.size / (1024 * 1024)).toFixed(2)) || 50,
        format: ext === "mov" ? "mov" : "mp4",
        uploadProgress: 0,
        stage: "uploading",
        stageLabel: "⬆️ Initializing chunk upload (0%)...",
        resolutions: [],
      };

      newItems.push(item);
      // Initiate async backend worker simulation per file
      setTimeout(() => startAsynchronousProcessing(newId), 100);
    }

    if (newItems.length > 0) {
      setVideos((prev) => [...newItems, ...prev]);
    }
  }, [startAsynchronousProcessing]);

  const removeVideo = useCallback((id: string) => {
    if (timersRef.current[id]) {
      clearInterval(timersRef.current[id]);
      delete timersRef.current[id];
    }
    setVideos((prev) => prev.filter((v) => v.id !== id));
  }, []);

  const clearAllCompleted = useCallback(() => {
    setVideos((prev) => prev.filter((v) => v.stage !== "ready"));
  }, []);

  return {
    videos,
    isProcessingAny,
    uploadError,
    handleDropFiles,
    removeVideo,
    clearAllCompleted,
  };
}
