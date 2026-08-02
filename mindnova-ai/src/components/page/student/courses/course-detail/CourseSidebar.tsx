"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { COURSE_DETAIL } from "@/src/components/page/student/courses/constants/detail";
import type { ILesson, IModule, IResource } from "@/src/components/page/student/courses/types";
import { CertificateClaimCard } from "./CertificateClaimCard";
import { CourseRatingCard } from "./CourseRatingCard";

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4l3 3" />
    </svg>
  );
}

function getResourceIcon(type: IResource["type"]) {
  switch (type) {
    case "zip": return "📦";
    case "link": return "🔗";
    case "chat": return "💬";
    default: return "📄";
  }
}

function CourseProgressCard() {
  const { progress = 72, lessonsLeftTime = "Còn lại ~4.5 giờ" } = COURSE_DETAIL;
  const allLessons = COURSE_DETAIL.modules.flatMap((m: IModule) => m.lessons);
  const completedCount = allLessons.filter((l: ILesson) => l.status === "completed").length;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs">
      <div className="flex items-end justify-between mb-3">
        <span className="text-xs font-mono font-black text-gray-400 uppercase tracking-wider">
          Tiến Độ Chuyên Đề
        </span>
        <span className="text-3xl font-mono font-black text-[#4F46E5] leading-none">{progress}%</span>
      </div>

      <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden border border-gray-200/60">
        <div
          className="h-full rounded-full bg-[#4F46E5] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center gap-2 mt-4 text-xs font-bold text-gray-600 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
        <ClockIcon />
        <span>
          Đã học {completedCount}/{allLessons.length} bài • {lessonsLeftTime}
        </span>
      </div>
    </div>
  );
}

function AiInsightCard() {
  return (
    <div className="bg-gradient-to-br from-indigo-50/50 to-white rounded-2xl border border-indigo-100 p-6 shadow-2xs relative overflow-hidden">
      <div className="flex items-center gap-2 mb-2.5 text-[#4F46E5]">
        <span className="text-lg">🤖</span>
        <span className="text-xs font-mono font-black uppercase tracking-wider">
          Trợ Lý AI Nhận Định
        </span>
      </div>

      <p className="text-xs font-semibold text-gray-700 leading-relaxed mb-4">
        &ldquo;Bạn đang tiến bộ vững vàng! Phần lớn học viên gặp trở ngại ở chuyên đề <strong>Route Handlers</strong> nhưng bạn đã vươn xa 72% lộ trình. Hãy chuẩn bị sẵn cho bài tập thực chiến.&rdquo;
      </p>

      <button
        type="button"
        onClick={() => window.location.href = "/study-plan"}
        className="w-full py-2.5 rounded-xl text-xs font-extrabold text-white bg-[#4F46E5] hover:bg-[#4338CA] transition-all uppercase tracking-wider cursor-pointer shadow-2xs active:scale-[0.99]"
      >
        ⚡ Nhận tóm tắt 5 phút từ AI ➔
      </button>
    </div>
  );
}

function ResourcesCard() {
  const { resources = [] } = COURSE_DETAIL;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs">
      <h3 className="text-xs font-mono font-black text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
        <span>📚</span>
        <span>Tài Liệu &amp; Mã Nguồn Đính Kèm</span>
      </h3>
      <ul className="flex flex-col gap-3">
        {resources.map((res: IResource) => (
          <li key={res.id}>
            <a
              href={res.url}
              className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-indigo-50/50 border border-gray-200 hover:border-indigo-100 transition-all text-xs font-black text-gray-800 hover:text-[#4F46E5]"
            >
              <span className="text-base">{getResourceIcon(res.type)}</span>
              <span className="truncate">{res.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function InstructorCard() {
  const { instructor } = COURSE_DETAIL;
  if (!instructor) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs flex flex-col items-center text-center">
      <div className="relative w-16 h-16 rounded-full overflow-hidden mb-3 border-2 border-[#4F46E5]/20 shadow-sm">
        <Image
          src={instructor.avatarUrl || "/placeholder-avatar.png"}
          alt={instructor.name || "Giảng viên"}
          fill
          className="object-cover"
        />
      </div>
      <h3 className="text-base font-black text-gray-900">{instructor.name || "Dr. Alex Wright"}</h3>
      <p className="text-xs font-semibold text-gray-500 mt-0.5">{instructor.role || "Chuyên gia Trí tuệ Nhân tạo & Cloud"}</p>

      <div className="mt-4 w-full pt-4 border-t border-gray-100 flex items-center justify-center">
        <Link
          href="#"
          onClick={(e) => { e.preventDefault(); alert(`Đang truy cập hồ sơ của giảng viên ${instructor.name}!`); }}
          className="text-xs font-extrabold text-[#4F46E5] hover:underline uppercase tracking-wider"
        >
          Xem Hồ Sơ Chuyên Gia ➔
        </Link>
      </div>
    </div>
  );
}

export function CourseSidebar() {
  return (
    <aside className="w-full lg:w-[350px] shrink-0 flex flex-col gap-6" aria-label="Course sidebar statistics">
      <CourseProgressCard />
      <CertificateClaimCard courseId={COURSE_DETAIL.id} progress={COURSE_DETAIL.progress} />
      <AiInsightCard />
      <CourseRatingCard courseId={COURSE_DETAIL.id} progress={COURSE_DETAIL.progress} />
      <ResourcesCard />
      <InstructorCard />
    </aside>
  );
}
