"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Loader2, AlertTriangle } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { fetchVideoUrl } from "../../api";
import type { LessonData } from "./LessonWorkspace";

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
 <div className="relative w-full aspect-video bg-[#0f172a] rounded-2xl overflow-hidden flex items-center justify-center border border-[#E2E8F0]">
 <div className="flex flex-col items-center gap-3">
 <div className="w-10 h-10 border-3 border-[#3B82F6] border-t-transparent rounded-full animate-spin" />
 <span className="text-sm text-[#64748B] font-medium">Đang tải video...</span>
 </div>
 </div>
 );
 }

 if (error) {
 return (
 <div className="relative w-full aspect-video bg-[#F8FAFC] rounded-2xl overflow-hidden flex items-center justify-center border border-[#E2E8F0]">
 <div className="flex flex-col items-center gap-3 text-[#64748B]">
 <AlertTriangle size={28} strokeWidth={1.75} aria-hidden />
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
 <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-sm border border-[#E2E8F0]">
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
 isFullscreen ? "rounded-none fixed inset-0 z-[9999]" : "rounded-2xl border border-[#E2E8F0]"
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
 <Loader2 className="w-12 h-12 text-white animate-spin" aria-hidden />
 </div>
 )}

 {/* YouTube-style center play (paused) */}
 <div
 className={twMerge(
 "absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-200",
 !isPlaying && showControls ? "opacity-100" : "opacity-0"
 )}
 >
 <button
 type="button"
 onClick={togglePlay}
 aria-label="Phát video"
 className="w-[68px] h-[68px] rounded-full bg-black/70 hover:bg-black/85 text-white flex items-center justify-center pointer-events-auto transition-transform hover:scale-110"
 >
 <Play className="w-9 h-9 fill-current ml-1" />
 </button>
 </div>

 {/* Controls Overlay */}
 <div
 className={twMerge(
 "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-12 pb-3 px-3 sm:px-4 transition-opacity duration-300 flex flex-col gap-1.5",
 showControls ? "opacity-100 visible" : "opacity-0 invisible"
 )}
 >
 {/* Progress Bar (Hoverable & Draggable) */}
 <div
 className="relative w-full h-1 hover:h-1.5 bg-white/30 rounded-full cursor-pointer group/progress transition-all"
 onClick={handleSeekDrag}
 onMouseMove={handleProgressHover}
 onMouseLeave={() => setHoverTime(null)}
 >
 {/* Buffered / Progress Fill */}
 <div
 className="absolute top-0 left-0 h-full bg-[#FF0000] rounded-full pointer-events-none"
 style={{ width: `${progressPercent}%` }}
 />
 {/* Thumb */}
 <div
 className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-[#FF0000] rounded-full shadow-sm scale-0 group-hover/progress:scale-100 transition-transform pointer-events-none ring-2 ring-white"
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
 <button type="button" onClick={togglePlay} className="hover:text-white/80 transition-colors focus:outline-none" aria-label={isPlaying ? "Tạm dừng" : "Phát"}>
 {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
 </button>

 <button onClick={() => skipTime(-10)} className="hover:text-[#E2E8F0] transition-colors focus:outline-none hidden sm:block" title="Tua lại 10s">
 <Rewind10Icon />
 </button>
 <button onClick={() => skipTime(10)} className="hover:text-[#E2E8F0] transition-colors focus:outline-none hidden sm:block" title="Tua đi 10s">
 <Forward10Icon />
 </button>

 <div className="flex items-center gap-2 group/volume relative">
 <button type="button" onClick={toggleMute} className="hover:text-white/80 transition-colors focus:outline-none" aria-label={isMuted ? "Bật tiếng" : "Tắt tiếng"}>
 {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
 </button>
 {/* Volume Slider (appears on hover) */}
 <input
 type="range"
 min="0"
 max="1"
 step="0.05"
 value={isMuted ? 0 : volume}
 onChange={handleVolumeChange}
 className="w-0 opacity-0 group-hover/volume:w-20 group-hover/volume:opacity-100 transition-all duration-300 accent-[#FF0000] cursor-pointer h-1 rounded-full appearance-none bg-white/30 outline-none"
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
 playbackRate === rate ? "text-[#F1F5F9] font-bold" : "text-white/80 font-medium"
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
 <button type="button" onClick={toggleFullscreen} className="hover:text-white/80 transition-colors focus:outline-none" aria-label={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}>
 {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
 </button>
 </div>
 </div>
 </div>
 </div>
 );
}
