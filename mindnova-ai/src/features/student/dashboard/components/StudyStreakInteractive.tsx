"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { Flame, Snowflake, X } from "lucide-react";
import type { StudyStreak } from "../types";
import { DayOfWeek } from "./DashboardStatsPanel";
import axios from "axios";
import toast from "react-hot-toast";

interface StudyStreakInteractiveProps {
  data: StudyStreak;
  weeklyActivity?: Record<DayOfWeek, boolean>;
  todayKey?: DayOfWeek;
  checkedInDates?: string[]; 
  streakFreezeCount?: number;
  aiInsight?: {
    type: "warning" | "praise" | "suggestion";
    message: string;
    actionLabel?: string;
  };
}

export function StudyStreakInteractive({ 
  data, 
  weeklyActivity, 
  todayKey = "CN",
  checkedInDates = [], 
  streakFreezeCount = 1,
  aiInsight = {
    type: "warning",
    message: "Hệ thống AI nhận thấy bạn thường có xu hướng quên học vào các ngày Thứ 6 (tỷ lệ drop 68%). Bạn có muốn thiết lập nhắc nhở tự động qua Email vào chiều mai không?",
    actionLabel: "Bật nhắc nhở Thứ 6"
  }
}: StudyStreakInteractiveProps) {
  const router = useRouter();
  const { days } = data;
  const weekDays: DayOfWeek[] = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
  
  const [activeDays, setActiveDays] = useState<Record<DayOfWeek, boolean>>(
    weeklyActivity || { "T2": false, "T3": false, "T4": false, "T5": false, "T6": false, "T7": false, "CN": false }
  );
  const [streakDays, setStreakDays] = useState(days);
  
  const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' });
  
  const [isCheckedIn, setIsCheckedIn] = useState(
    checkedInDates.includes(todayStr) || 
    (data as any)?.is_checked_in_today || 
    false
  );
  
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const calendarDays = useMemo(() => {
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
    const startOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1; 

    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isCurrentMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth();
      const isToday = isCurrentMonth && day === today.getDate();
      const isPast = (viewYear < today.getFullYear()) || (viewYear === today.getFullYear() && viewMonth < today.getMonth()) || (isCurrentMonth && day < today.getDate());
      
      return {
        day,
        dateStr,
        isCheckedIn: checkedInDates.includes(dateStr) || (isToday && isCheckedIn),
        isToday,
        isPast
      };
    });
  }, [viewYear, viewMonth, checkedInDates, isCheckedIn, today]);

  const startOffset = useMemo(() => {
    const idx = new Date(viewYear, viewMonth, 1).getDay();
    return idx === 0 ? 6 : idx - 1;
  }, [viewYear, viewMonth]);

  const handlePrevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(prev => prev - 1); } 
    else { setViewMonth(prev => prev - 1); }
  };
  
  const handleNextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(prev => prev + 1); } 
    else { setViewMonth(prev => prev + 1); }
  };

  // ─── GỌI TRỰC TIẾP XUỐNG LARAVEL BẰNG TOKEN LẤY TỪ LOCALSTORAGE ───
  const handleCheckIn = async () => {
    if (isCheckedIn || isLoading) return;
    setIsLoading(true);

    try {
      // 🚀 Sửa lại đúng tên key 'accessToken' mà bạn vừa nhìn thấy trong LocalStorage
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

      if (!token) {
        toast.error("Không tìm thấy thông tin đăng nhập (Token). Vui lòng đăng nhập lại!");
        setIsLoading(false);
        return;
      }

      // Gói thẳng xuống Laravel Backend kèm theo Bearer Token
      const response = await axios.post('http://localhost:8000/api/student/check-in', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json"
        }
      });

      // Thành công -> Cập nhật giao diện ngay lập tức
      setIsCheckedIn(true);
      setStreakDays(response.data.data?.current_streak || (prev => prev + 1));
      setActiveDays(prev => ({ ...prev, [todayKey]: true }));

      // F5 ngầm để đồng bộ dữ liệu vĩnh viễn vào Database
      router.refresh(); 

    } catch (error: any) {
      console.error("Lỗi đồng bộ hệ thống:", error);
      toast.error(error.response?.data?.message || "Lỗi điểm danh! Hãy thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div 
        onClick={() => setShowModal(true)}
        className="group cursor-pointer bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-500/40 transition-all duration-300 flex flex-col justify-between gap-4 h-full"
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 group-hover:text-blue-600 transition-colors uppercase tracking-wider">Chuỗi chuyên cần ↗</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shadow-sm border border-amber-500/20">
              <Flame size={16} fill="currentColor" />
            </div>
          </div>
          
          <div className="flex items-baseline justify-between">
             <span className="text-3xl font-bold text-slate-900">{streakDays} <span className="text-sm font-medium text-slate-500">Ngày</span></span>
            <button
              onClick={(e) => { e.stopPropagation(); handleCheckIn(); }}
              disabled={isCheckedIn || isLoading}
              className={twMerge(
                "text-xs font-medium px-3 py-1.5 rounded-lg transition-all shadow-sm z-10 border",
                isCheckedIn ? "bg-emerald-50 text-emerald-600 border-emerald-600/20 cursor-default" : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:scale-105"
              )}
            >
              {isLoading ? "Đang xử lý..." : (isCheckedIn ? "Đã điểm danh ✓" : "Điểm danh ngay")}
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-1.5 pt-4 border-t border-slate-100 mt-auto">
          {weekDays.map((d) => (
             <div key={d} className="flex flex-col items-center gap-1.5">
               <span className="text-[10px] font-medium text-slate-500 uppercase">{d}</span>
               <div className={twMerge(
                 "w-full h-1.5 rounded-full transition-all duration-300",
                 activeDays[d] || (d === todayKey && isCheckedIn) ? "bg-gradient-to-r from-blue-500 to-blue-600" : "bg-slate-100",
                 d === todayKey && !isCheckedIn && "bg-slate-200 relative overflow-hidden after:absolute after:inset-0 after:bg-blue-500/50 after:animate-pulse"
               )}/>
             </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/80 backdrop-blur-md" onClick={() => setShowModal(false)}>
          <div 
            className="bg-white w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl relative flex flex-col lg:flex-row border border-slate-200" 
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 z-20 text-slate-500 hover:bg-slate-100 p-2.5 rounded-full transition-colors bg-white shadow-sm">
              <X size={18} />
            </button>

            <div className="w-full lg:w-7/12 p-6 sm:p-8 bg-slate-50/50 border-r border-slate-100">
              <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
                <div className="flex items-center gap-4 bg-white px-2 py-1 rounded-xl shadow-sm border border-slate-200">
                  <button onClick={handlePrevMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 font-medium transition-colors">&lt;</button>
                  <h3 className="text-lg font-bold text-slate-900 min-w-[140px] text-center">Tháng {viewMonth + 1}, {viewYear}</h3>
                  <button onClick={handleNextMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 font-medium transition-colors">&gt;</button>
                </div>
                
                <div className="flex gap-2">
                  <span className="text-xs font-medium text-amber-600 bg-amber-50 px-3 py-2 rounded-xl flex items-center gap-1.5 border border-amber-100 shadow-sm">
                    <Snowflake size={14} fill="currentColor" className="text-amber-500" /> Băng bảo vệ: {streakFreezeCount}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-2 text-center mb-3">
                {weekDays.map(d => <div key={d} className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">{d}</div>)}
              </div>
              
              <div className="grid grid-cols-7 gap-2 sm:gap-3">
                {Array.from({ length: startOffset }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square rounded-xl bg-transparent" />
                ))}
                
                {calendarDays.map((date) => {
                  let bgClass = "bg-white border border-slate-100 text-slate-500 hover:border-slate-200 cursor-default"; 
                  if (date.isCheckedIn) {
                    bgClass = "bg-blue-100 text-blue-700 shadow-sm font-semibold border border-blue-200";
                  } else if (date.isPast) {
                    bgClass = "bg-slate-50 text-slate-300 border-transparent font-normal"; 
                  }
                  
                  return (
                    <div 
                      key={date.day} 
                      className={twMerge(
                        "aspect-square rounded-xl flex items-center justify-center text-sm sm:text-base transition-all duration-300 relative group/date",
                        bgClass,
                        date.isToday && !date.isCheckedIn && "border-2 border-dashed border-amber-300 text-amber-600 bg-amber-50"
                      )}
                    >
                      {date.day}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="w-full lg:w-5/12 p-6 sm:p-8 flex flex-col bg-white">
              <div className="text-center mb-8 pt-4">
                <div className="mb-4 drop-shadow-xl inline-flex text-amber-500">
                  <Flame size={72} fill="currentColor" strokeWidth={1} />
                </div>
                <h2 className="text-4xl font-semibold text-slate-900 tracking-tight">{streakDays} <span className="text-xl font-medium text-slate-500">Ngày</span></h2>
                <p className="text-sm font-medium text-slate-500 mt-2">{data.message || "Duy trì thói quen cực tốt!"}</p>
              </div>

              {(!isCheckedIn && viewMonth === today.getMonth() && viewYear === today.getFullYear()) && (
                <button 
                  onClick={handleCheckIn}
                  className="w-full py-4 mb-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-medium text-sm shadow-sm hover:-translate-y-1 transition-all active:scale-95"
                >
                  {isLoading ? "Đang xử lý..." : "Xác nhận điểm danh hôm nay"}
                </button>
              )}

              <div className="mt-auto bg-white rounded-2xl p-5 border border-slate-100 relative shadow-sm">
                 <div className="absolute -top-3 left-4 bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" /> AI LỊCH TRÌNH
                 </div>
                 
                 <div className="mt-2">
                   <p className="text-sm text-slate-600 font-normal leading-relaxed">
                     {aiInsight.message}
                   </p>
                   {aiInsight.actionLabel && (
                     <button className="mt-4 w-full py-2 bg-slate-50 border border-slate-200 text-slate-700 font-medium text-xs rounded-xl hover:bg-slate-100 transition-colors">
                       {aiInsight.actionLabel}
                     </button>
                   )}
                 </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}