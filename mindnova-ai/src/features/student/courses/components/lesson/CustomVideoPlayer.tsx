"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { twMerge } from "tailwind-merge";
import { fetchVideoUrl } from "../../api";
import type { LessonData } from "./LessonWorkspace";

// --- Icons ---
function PlayIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
}

function Rewind10Icon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12.5 8.5L7 12l5.5 3.5V8.5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M18.5 8.5L13 12l5.5 3.5V8.5z" />
    </svg>
  );
}

function Forward10Icon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.5 15.5L17 12l-5.5-3.5v7z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.5 15.5L11 12 5.5 8.5v7z" />
    </svg>
  );
}

function VolumeIcon({ muted, className = "w-5 h-5" }: { muted: boolean; className?: string }) {
  if (muted) {
    return (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
      </svg>
    );
  }
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
  );
}

function FullscreenIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
    </svg>
  );
}

function MinimizeIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L4 20m0 0h4m-4 0v-4m11-11l5-5m-5 0h4m-4 0v4M9 9L4 4m0 0h4M4 4v4m11 11l5 5m-5 0h4m-4 0v-4" />
    </svg>
  );
}

function SpinnerIcon({ className = "w-8 h-8 animate-spin text-white" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

function formatTime(seconds: number): string {
 if (isNaN(seconds)) return "00:00";
 const m = Math.floor(seconds / 60);
 const s = Math.floor(seconds % 60);
 return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function CustomVideoPlayer({
 lesson,
 onComplete,
}: {
 lesson: LessonData;
 onComplete: () => void;
}) {
 const containerRef = useRef<HTMLDivElement>(null);
 const videoRef = useRef<HTMLVideoElement>(null);

 const [signedUrl, setSignedUrl] = useState<string>("");
 const [isExternal, setIsExternal] = useState(false);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string>("");
 const completedRef = useRef(false);

 // --- Player State ---
 const [isPlaying, setIsPlaying] = useState(false);
 const [currentTime, setCurrentTime] = useState(0);
 const [duration, setDuration] = useState(0);
 const [volume, setVolume] = useState(1);
 const [isMuted, setIsMuted] = useState(false);
 const [isFullscreen, setIsFullscreen] = useState(false);
 const [playbackRate, setPlaybackRate] = useState(1);
 const [showControls, setShowControls] = useState(true);
 const [showSpeedMenu, setShowSpeedMenu] = useState(false);
 const [isWaiting, setIsWaiting] = useState(false);
 const [hoverTime, setHoverTime] = useState<number | null>(null);
 const [hoverPercent, setHoverPercent] = useState<number>(0);

 const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

 // --- Fetch Video URL ---
 useEffect(() => {
 completedRef.current = false;
 setError("");
 setLoading(true);
 setIsPlaying(false);
 setCurrentTime(0);
 setDuration(0);

 const externalUrl = lesson.videoUrl;
 if (
 externalUrl &&
 (externalUrl.includes("youtube.com") ||
 externalUrl.includes("youtu.be") ||
 externalUrl.includes("vimeo.com"))
 ) {
 setIsExternal(true);
 setSignedUrl(externalUrl);
 setLoading(false);
 return;
 }

 if (lesson.hasUploadedVideo) {
 fetchVideoUrl(lesson.id)
 .then((result) => {
 if (result.source === "external") setIsExternal(true);
 setSignedUrl(result.signed_url);
 setLoading(false);
 })
 .catch(() => {
 if (lesson.videoUrl) {
 setSignedUrl(lesson.videoUrl);
 setIsExternal(true);
 } else {
 setError("Không thể tải video. Vui lòng thử lại sau.");
 }
 setLoading(false);
 });
 } else if (lesson.videoUrl) {
 setSignedUrl(lesson.videoUrl);
 setIsExternal(true); // Treat direct mp4 urls as external too
 setLoading(false);
 } else {
 setError("Video chưa được tải lên.");
 setLoading(false);
 }
 }, [lesson.id, lesson.videoUrl, lesson.hasUploadedVideo]);

 // --- Auto Hide Controls Logic ---
 const resetControlsTimeout = useCallback(() => {
 setShowControls(true);
 if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
 
 // Only auto-hide if playing
 if (isPlaying) {
 controlsTimeoutRef.current = setTimeout(() => {
 setShowControls(false);
 setShowSpeedMenu(false);
 }, 2500);
 }
 }, [isPlaying]);

 useEffect(() => {
 resetControlsTimeout();
 return () => {
 if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
 };
 }, [isPlaying, resetControlsTimeout]);

 // --- Fallback Completion for Iframe (YouTube / Vimeo) ---
 useEffect(() => {
 if (loading || error) return;
 
 const isIframe = isExternal && (
 signedUrl.includes("youtube.com") ||
 signedUrl.includes("youtu.be") ||
 signedUrl.includes("vimeo.com")
 );

 if (!isIframe) return;
 if (completedRef.current) return;

 const timer = setTimeout(() => {
 if (!completedRef.current) {
 completedRef.current = true;
 onComplete();
 }
 }, 5000);
 
 return () => clearTimeout(timer);
 }, [loading, error, isExternal, signedUrl, onComplete]);

 // --- Fullscreen Handling ---
 useEffect(() => {
 const handleFullscreenChange = () => {
 setIsFullscreen(!!document.fullscreenElement);
 };
 document.addEventListener("fullscreenchange", handleFullscreenChange);
 return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
 }, []);

 const toggleFullscreen = () => {
 if (!containerRef.current) return;
 if (!document.fullscreenElement) {
 containerRef.current.requestFullscreen().catch((err) => {
 console.error(`Error attempting to enable full-screen mode: ${err.message}`);
 });
 } else {
 if (document.exitFullscreen) {
 document.exitFullscreen();
 }
 }
 };

 // --- Video Event Handlers ---
 const togglePlay = () => {
 if (!videoRef.current) return;
 if (videoRef.current.paused) {
 videoRef.current.play();
 } else {
 videoRef.current.pause();
 }
 };

 const handleTimeUpdate = () => {
 if (!videoRef.current) return;
 setCurrentTime(videoRef.current.currentTime);
 
 if (completedRef.current) return;
 const threshold = Math.max(videoRef.current.duration - 10, 0);
 if (videoRef.current.currentTime >= threshold && videoRef.current.duration > 0) {
 completedRef.current = true;
 onComplete();
 }
 };

 const handleLoadedMetadata = () => {
 if (!videoRef.current) return;
 setDuration(videoRef.current.duration);
 if (playbackRate !== 1) {
 videoRef.current.playbackRate = playbackRate;
 }
 };

 const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
 const time = parseFloat(e.target.value);
 setCurrentTime(time);
 if (videoRef.current) {
 videoRef.current.currentTime = time;
 }
 };

 const handleSeekDrag = (e: React.MouseEvent<HTMLDivElement>) => {
 if (!videoRef.current) return;
 const rect = e.currentTarget.getBoundingClientRect();
 const pos = (e.clientX - rect.left) / rect.width;
 const time = pos * duration;
 setCurrentTime(time);
 videoRef.current.currentTime = time;
 };

 const handleProgressHover = (e: React.MouseEvent<HTMLDivElement>) => {
 const rect = e.currentTarget.getBoundingClientRect();
 let pos = (e.clientX - rect.left) / rect.width;
 pos = Math.max(0, Math.min(1, pos));
 setHoverPercent(pos * 100);
 setHoverTime(pos * duration);
 };

 const skipTime = (amount: number) => {
 if (videoRef.current) {
 let newTime = videoRef.current.currentTime + amount;
 newTime = Math.max(0, Math.min(newTime, duration));
 videoRef.current.currentTime = newTime;
 setCurrentTime(newTime);
 }
 };

 const toggleMute = () => {
 if (videoRef.current) {
 videoRef.current.muted = !isMuted;
 setIsMuted(!isMuted);
 if (!isMuted && volume === 0) {
 setVolume(1);
 videoRef.current.volume = 1;
 }
 }
 };

 const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 const val = parseFloat(e.target.value);
 setVolume(val);
 if (videoRef.current) {
 videoRef.current.volume = val;
 videoRef.current.muted = val === 0;
 setIsMuted(val === 0);
 }
 };

 const changePlaybackRate = (rate: number) => {
 setPlaybackRate(rate);
 if (videoRef.current) {
 videoRef.current.playbackRate = rate;
 }
 setShowSpeedMenu(false);
 };

 // --- Rendering Load/Error ---
 if (loading) {
 return (
 <div className="relative w-full aspect-video bg-[#0f172a] rounded-2xl overflow-hidden flex items-center justify-center border border-[#E8E2D9]">
 <div className="flex flex-col items-center gap-3">
 <div className="w-10 h-10 border-3 border-[#C0392B] border-t-transparent rounded-full animate-spin" />
 <span className="text-sm text-[#8A8478] font-medium">Đang tải video...</span>
 </div>
 </div>
 );
 }

 if (error) {
 return (
 <div className="relative w-full aspect-video bg-[#FEFCF9] rounded-2xl overflow-hidden flex items-center justify-center border border-[#E8E2D9]">
 <div className="flex flex-col items-center gap-3 text-[#8A8478]">
 <></>
 <span className="text-sm font-medium">{error}</span>
 </div>
 </div>
 );
 }

 // YouTube / Vimeo Handling
 if (
 isExternal &&
 (signedUrl.includes("youtube.com") ||
 signedUrl.includes("youtu.be") ||
 signedUrl.includes("vimeo.com"))
 ) {
 let embedUrl = signedUrl;
 if (signedUrl.includes("youtube.com/watch")) {
 const url = new URL(signedUrl);
 const videoId = url.searchParams.get("v");
 if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0&controls=1`;
 } else if (signedUrl.includes("youtu.be/")) {
 const videoId = signedUrl.split("youtu.be/")[1]?.split("?")[0];
 if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0&controls=1`;
 }

 return (
 <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-sm border border-[#E8E2D9]">
 <iframe
 src={embedUrl}
 title={lesson.title}
 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
 allowFullScreen
 className="w-full h-full border-0 absolute inset-0"
 />
 </div>
 );
 }

 // --- Custom Player Rendering ---
 const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

 return (
 <div
 ref={containerRef}
 className={twMerge(
 "relative w-full aspect-video bg-black overflow-hidden shadow-sm flex items-center justify-center group select-none",
 isFullscreen ? "rounded-none fixed inset-0 z-[9999]" : "rounded-2xl border border-[#E8E2D9]"
 )}
 onMouseMove={resetControlsTimeout}
 onMouseLeave={() => isPlaying && setShowControls(false)}
 onContextMenu={(e) => e.preventDefault()} // Security: Prevent native right-click menu!
 >
 {/* Video Element (Hidden Native Controls) */}
 <video
 ref={videoRef}
 src={signedUrl}
 className="w-full h-full object-contain cursor-pointer"
 playsInline
 disablePictureInPicture
 controlsList="nodownload noremoteplayback"
 onTimeUpdate={handleTimeUpdate}
 onLoadedMetadata={handleLoadedMetadata}
 onPlay={() => setIsPlaying(true)}
 onPause={() => setIsPlaying(false)}
 onWaiting={() => setIsWaiting(true)}
 onPlaying={() => setIsWaiting(false)}
 onEnded={() => setIsPlaying(false)}
 onClick={togglePlay}
 onDoubleClick={toggleFullscreen}
 />

 {/* Buffering Indicator */}
 {isWaiting && (
 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
 <div className="text-white/80">
 <SpinnerIcon />
 </div>
 </div>
 )}

 {/* Center Play/Pause Button (Shows briefly when toggled or hovered when paused) */}
 <div
 className={twMerge(
 "absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300",
 !isPlaying && showControls ? "opacity-100" : "opacity-0"
 )}
 >
 <button
 onClick={togglePlay}
 className="w-16 h-16 sm:w-20 sm:h-20 bg-[#C0392B]/90 hover:bg-[#A93226] text-white rounded-full flex items-center justify-center backdrop-blur-md shadow-[0_4px_24px_rgba(79,70,229,0.4)] pointer-events-auto transform transition-transform hover:scale-105"
 >
 {isPlaying ? <PauseIcon /> : <PlayIcon />}
 </button>
 </div>

 {/* Controls Overlay */}
 <div
 className={twMerge(
 "absolute inset-x-0 bottom-0 from-black/90 via-black/50 to-transparent pt-12 pb-4 px-4 sm:px-6 transition-opacity duration-300 flex flex-col gap-2",
 showControls ? "opacity-100 visible" : "opacity-0 invisible"
 )}
 >
 {/* Progress Bar (Hoverable & Draggable) */}
 <div
 className="relative w-full h-2 sm:h-1.5 bg-white/20 rounded-full cursor-pointer group/progress transition-all hover:h-3 sm:hover:h-2"
 onClick={handleSeekDrag}
 onMouseMove={handleProgressHover}
 onMouseLeave={() => setHoverTime(null)}
 >
 {/* Buffered / Progress Fill */}
 <div
 className="absolute top-0 left-0 h-full bg-[#C0392B] rounded-full transition-all duration-100 ease-linear pointer-events-none"
 style={{ width: `${progressPercent}%` }}
 />
 {/* Thumb */}
 <div
 className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-md scale-0 group-hover/progress:scale-100 transition-transform pointer-events-none"
 style={{ left: `calc(${progressPercent}% - 8px)` }}
 />
 {/* Hover Tooltip */}
 {hoverTime !== null && (
 <div
 className="absolute -top-10 px-2 py-1 bg-black/80 text-white text-xs rounded shadow-lg pointer-events-none -translate-x-1/2 whitespace-nowrap"
 style={{ left: `${hoverPercent}%` }}
 >
 {formatTime(hoverTime)}
 </div>
 )}
 </div>

 {/* Bottom Controls Row */}
 <div className="flex items-center justify-between text-white mt-1">
 {/* Left: Play, Skip, Volume, Time */}
 <div className="flex items-center gap-3 sm:gap-5">
 <button onClick={togglePlay} className="hover:text-[#E8E2D9] transition-colors focus:outline-none">
 {isPlaying ? <PauseIcon /> : <PlayIcon />}
 </button>

 <button onClick={() => skipTime(-10)} className="hover:text-[#E8E2D9] transition-colors focus:outline-none hidden sm:block" title="Tua lại 10s">
 <Rewind10Icon />
 </button>
 <button onClick={() => skipTime(10)} className="hover:text-[#E8E2D9] transition-colors focus:outline-none hidden sm:block" title="Tua đi 10s">
 <Forward10Icon />
 </button>

 <div className="flex items-center gap-2 group/volume relative">
 <button onClick={toggleMute} className="hover:text-[#E8E2D9] transition-colors focus:outline-none">
 <VolumeIcon muted={isMuted} />
 </button>
 {/* Volume Slider (appears on hover) */}
 <input
 type="range"
 min="0"
 max="1"
 step="0.05"
 value={isMuted ? 0 : volume}
 onChange={handleVolumeChange}
 className="w-0 opacity-0 group-hover/volume:w-20 group-hover/volume:opacity-100 transition-all duration-300 accent-[#C0392B] cursor-pointer h-1.5 rounded-full appearance-none bg-white/30 outline-none"
 />
 </div>

 <div className="text-[13px] font-medium tracking-wide font-mono hidden sm:block">
 {formatTime(currentTime)} <span className="text-white/50 mx-1">/</span> {formatTime(duration)}
 </div>
 </div>

 {/* Right: Speed, Resolution, Fullscreen */}
 <div className="flex items-center gap-3 sm:gap-5 relative">
 <div className="text-[13px] font-medium tracking-wide font-mono sm:hidden">
 {formatTime(currentTime)}
 </div>

 {/* Playback Speed */}
 <div className="relative">
 <button
 onClick={() => setShowSpeedMenu(!showSpeedMenu)}
 className="text-[13px] font-semibold bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition-colors"
 >
 {playbackRate}x
 </button>

 {/* Speed Menu Popup */}
 {showSpeedMenu && (
 <div className="absolute bottom-full right-0 mb-2 w-24 bg-[#111827]/95 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl py-2 flex flex-col overflow-hidden z-50">
 {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
 <button
 key={rate}
 onClick={() => changePlaybackRate(rate)}
 className={twMerge(
 "px-4 py-2 text-sm text-left hover:bg-white/10 transition-colors",
 playbackRate === rate ? "text-[#F5F0E8] font-bold" : "text-white/80 font-medium"
 )}
 >
 {rate === 1 ? "Chuẩn" : `${rate}x`}
 </button>
 ))}
 </div>
 )}
 </div>

 {/* Resolution button removed as requested */}

 {/* Fullscreen */}
 <button onClick={toggleFullscreen} className="hover:text-[#E8E2D9] transition-colors focus:outline-none">
 {isFullscreen ? <MinimizeIcon /> : <FullscreenIcon />}
 </button>
 </div>
 </div>
 </div>
 </div>
 );
}
