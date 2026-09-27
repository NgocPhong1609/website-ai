"use client";

import React from "react";
import { twMerge } from "tailwind-merge";
import { X } from "lucide-react";

export interface StudentDetailData {
  id: number | string;
  name: string;
  email: string;
  avatar_url?: string;
  course: {
    id: number | string;
    title: string;
  };
  progress: number;
  status: string;
  average_score?: number | null;
  total_credits?: number;
  quiz_scores?: any[];
  enrolled_at?: string;
}

export function StudentDetailSidebar({ student, onClose }: { student: StudentDetailData | null, onClose: () => void }) {
  if (!student) return null;

  const initials = student.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col animate-slideInRight font-sans">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-bold text-slate-900 text-sm">Hồ Sơ Học Viên</h3>
        <button onClick={onClose} aria-label="Đóng hồ sơ học viên" className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors cursor-pointer">
          <X size={20} aria-hidden />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
        <div className="flex flex-col items-center gap-2 mb-2 text-center">
          {student.avatar_url ? (
            <img src={student.avatar_url} alt={student.name} className="w-16 h-16 rounded-lg shadow-sm object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-blue-500 text-white font-bold text-xl flex items-center justify-center shadow-sm">
              {initials}
            </div>
          )}
          <div>
            <h4 className="font-bold text-base text-slate-900">{student.name}</h4>
            <p className="text-xs text-slate-500">{student.email}</p>
          </div>
          <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold uppercase">
            {student.status}
          </span>
        </div>

        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs flex flex-col gap-3">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase block">Khóa học ghi danh</span>
            <span className="font-semibold text-slate-900">{student.course?.title || "Chưa có"}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Tiến độ học</span>
              <span className="font-bold text-blue-500 text-sm">{student.progress}%</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Điểm trung bình</span>
              <span className="font-bold text-slate-800 text-sm">{student.average_score !== null && student.average_score !== undefined ? `${student.average_score}/100` : "N/A"}</span>
            </div>
          </div>

          {student.enrolled_at && (
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Ngày tham gia</span>
              <span className="font-semibold text-slate-700">{new Date(student.enrolled_at).toLocaleDateString("vi-VN")}</span>
            </div>
          )}
        </div>

        {Array.isArray(student.quiz_scores) && student.quiz_scores.length > 0 && (
          <div className="bg-white p-4 rounded-lg border border-slate-200 text-xs flex flex-col gap-2">
            <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wide">Điểm Các Bài Kiểm Tra</h5>
            <div className="flex flex-col gap-1.5">
              {student.quiz_scores.map((q: any, i: number) => (
                <div key={i} className="flex items-center justify-between text-[11px] p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="font-bold text-slate-800 truncate max-w-[150px]">{q.title}</span>
                  <span className="font-bold text-blue-500">{q.score}/100</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-slate-100 bg-slate-50">
        <a href={`mailto:${student.email}`} className="w-full py-2.5 rounded-lg bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold shadow-sm transition-colors text-center block">
          Gửi Email Trực Tiếp
        </a>
      </div>
    </div>
  );
}
