"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

interface ActorMode {
  id: "student" | "instructor";
  label: string;
  subText: string;
  href: string;
  badge: string;
  icon: string;
}

const ACTOR_MODES: ActorMode[] = [
  {
    id: "student",
    label: "Học viên (Student)",
    subText: "Học tập, Lộ trình AI Tutor & Quiz",
    href: "/",
    badge: "Student",
    icon: "🎓",
  },
  {
    id: "instructor",
    label: "Giảng viên (Instructor)",
    subText: "Tạo khóa học AI, Quản lý & Doanh thu",
    href: "/instructor/courses",
    badge: "Instructor",
    icon: "👨‍🏫",
  },
];

export function ActorSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Determine current active mode based on path
  const currentMode =
    pathname?.startsWith("/instructor")
      ? ACTOR_MODES[1]
      : ACTOR_MODES[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectMode = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 hover:bg-white hover:border-[#4F46E5] text-[#111827] text-xs font-bold transition-all shadow-2xs cursor-pointer"
        aria-expanded={isOpen}
      >
        <span>{currentMode.icon}</span>
        <span className="hidden md:inline font-extrabold">{currentMode.label}</span>
        <span className="md:hidden font-extrabold">{currentMode.badge}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-[#6B7280] transition-transform ${isOpen ? "rotate-180 text-[#4F46E5]" : ""}`}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-white border border-gray-200 shadow-lg p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-2 border-b border-gray-100 mb-1">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#6B7280]">
              Chuyển đổi phân hệ (PRD Actors)
            </p>
          </div>
          <div className="space-y-1">
            {ACTOR_MODES.map((mode) => {
              const isCurrent = currentMode.id === mode.id;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => handleSelectMode(mode.href)}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 cursor-pointer ${
                    isCurrent
                      ? "bg-[#EEF2FF] border border-indigo-100 text-[#4F46E5]"
                      : "hover:bg-gray-50 text-[#111827]"
                  }`}
                >
                  <span className="text-lg shrink-0 mt-0.5">{mode.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-extrabold truncate">{mode.label}</p>
                      {isCurrent && (
                        <span className="w-2 h-2 rounded-full bg-[#4F46E5] shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] font-medium text-[#6B7280] mt-0.5 truncate">
                      {mode.subText}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
