"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { Flame, Snowflake, X } from "lucide-react";
import type { StudyStreak } from "../types";
import { DayOfWeek } from "./DashboardStatsPanel";
import axios from "axios";

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
        alert("Không tìm thấy thông tin đăng nhập (Token). Vui lòng đăng nhập lại!");
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
      alert(error.response?.data?.message || "Lỗi điểm danh! Hãy thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div 
        onClick={() => setShowModal(true)}
        className="group cursor-pointer bg-white rounded-2xl p-5 border border-[#EAEAF4] shadow-sm hover:shadow-md hover:border-[#F59E0B]/40 transition-all duration-300 flex flex-col justify-between gap-4"
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64647A] group-hover:text-[#D97706] transition-colors">Chuỗi chuyên cần ↗</span>
            <div className="w-9 h-9 rounded-xl bg-[#FFF9ED] text-[#D97706] flex items-center justify-center shadow-sm border border-[#F59E0B]/20">
              <Flame size={16} fill="currentColor" />
            </div>
          </div>
          
          <div className="flex items-baseline justify-between">
             <span className="text-3xl font-black text-[#1A1A2E]">{streakDays} <span className="text-sm font-bold text-[#7878A0]">Ngày</span></span>
            <button
              onClick={(e) => { e.stopPropagation(); handleCheckIn(); }}
              disabled={isCheckedIn || isLoading}
              className={twMerge(
                "text-xs font-bold px-3 py-1.5 rounded-lg transition-all shadow-sm z-10 border",
                isCheckedIn ? "bg-[#F0FDF4] text-[#16A34A] border-[#16A34A]/20 cursor-default" : "bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white hover:scale-105"
              )}
            >
              {isLoading ? "Đang xử lý..." : (isCheckedIn ? "Đã điểm danh ✓" : "Điểm danh ngay")}
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-1.5 pt-4 border-t border-[#F0F0F8] mt-auto">
          {weekDays.map((d) => (
             <div key={d} className="flex flex-col items-center gap-1.5">
               <span className="text-[10px] font-bold text-[#A0A0C0] uppercase">{d}</span>
               <div className={twMerge(
                 "w-full h-1.5 rounded-full transition-all duration-300",
                 activeDays[d] || (d === todayKey && isCheckedIn) ? "bg-gradient-to-r from-[#F59E0B] to-[#D97706]" : "bg-[#F4F4FA]",
                 d === todayKey && !isCheckedIn && "bg-[#EAEAF4] relative overflow-hidden after:absolute after:inset-0 after:bg-[#F59E0B]/50 after:animate-pulse"
               )}/>
             </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0B0B19]/80 backdrop-blur-md" onClick={() => setShowModal(false)}>
          <div 
            className="bg-white w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl relative flex flex-col lg:flex-row border border-[#EAEAF4]" 
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 z-20 text-[#64647A] hover:bg-[#F4F4FA] p-2.5 rounded-full transition-colors bg-white shadow-sm">
              <X size={18} />
            </button>

            <div className="w-full lg:w-7/12 p-6 sm:p-8 bg-[#FAFAFC] border-r border-[#EAEAF4]">
              <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
                <div className="flex items-center gap-4 bg-white px-2 py-1 rounded-xl shadow-sm border border-[#EAEAF4]">
                  <button onClick={handlePrevMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F4F4FA] text-[#64647A] font-bold transition-colors">&lt;</button>
                  <h3 className="text-lg font-black text-[#1A1A2E] min-w-[140px] text-center">Tháng {viewMonth + 1}, {viewYear}</h3>
                  <button onClick={handleNextMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F4F4FA] text-[#64647A] font-bold transition-colors">&gt;</button>
                </div>
                
                <div className="flex gap-2">
                  <span className="text-xs font-bold text-[#0284C7] bg-[#E0F2FE] px-3 py-2 rounded-lg flex items-center gap-1.5 border border-[#0284C7]/20 shadow-sm">
                    <Snowflake size={14} fill="currentColor" /> Băng bảo vệ: {streakFreezeCount}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-2 text-center mb-3">
                {weekDays.map(d => <div key={d} className="text-[11px] font-black text-[#A0A0C0] uppercase tracking-wider">{d}</div>)}
              </div>
              
              <div className="grid grid-cols-7 gap-2 sm:gap-3">
                {Array.from({ length: startOffset }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square rounded-xl bg-transparent" />
                ))}
                
                {calendarDays.map((date) => {
                  let bgClass = "bg-white border border-[#EAEAF4] text-[#A0A0C0] hover:border-[#8A8478]/30 cursor-default"; 
                  if (date.isCheckedIn) {
                    bgClass = "bg-gradient-to-tr from-[#27AE60] to-[#34D399] text-white shadow-md border-transparent font-bold";
                  } else if (date.isPast) {
                    bgClass = "bg-[#FEE2E2] text-[#EF4444] border-transparent font-bold opacity-70"; 
                  }
                  
                  return (
                    <div 
                      key={date.day} 
                      className={twMerge(
                        "aspect-square rounded-xl flex items-center justify-center text-sm sm:text-base transition-all duration-300 relative group/date",
                        bgClass,
                        date.isToday && !date.isCheckedIn && "border-2 border-[#F59E0B] text-[#D97706] bg-[#FFF9ED] shadow-[0_0_15px_rgba(245,158,11,0.2)]"
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
                <div className="mb-4 drop-shadow-xl inline-flex text-[#F59E0B]">
                  <Flame size={72} fill="currentColor" strokeWidth={1} />
                </div>
                <h2 className="text-4xl font-black text-[#1A1A2E] tracking-tight">{streakDays} <span className="text-xl font-bold text-[#7878A0]">Ngày</span></h2>
                <p className="text-sm font-semibold text-[#D97706] mt-2">Duy trì thói quen cực tốt!</p>
              </div>

              {(!isCheckedIn && viewMonth === today.getMonth() && viewYear === today.getFullYear()) && (
                <button 
                  onClick={handleCheckIn}
                  className="w-full py-4 mb-6 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white rounded-2xl font-bold text-sm shadow-[0_8px_20px_rgba(245,158,11,0.3)] hover:-translate-y-1 transition-all active:scale-95"
                >
                  {isLoading ? "Đang xử lý..." : "Xác nhận điểm danh hôm nay"}
                </button>
              )}

              <div className="mt-auto bg-[#F8FAFC] rounded-2xl p-5 border border-[#EAEAF4] relative">
                 <div className="absolute -top-3 left-4 bg-gradient-to-r from-[#C0392B] to-[#C0392B] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> AI Lịch trình
                 </div>
                 
                 <div className="mt-3">
                   <p className="text-sm text-[#1A1A2E] font-medium leading-relaxed">
                     {aiInsight.message}
                   </p>
                   {aiInsight.actionLabel && (
                     <button className="mt-4 w-full py-2.5 bg-white border border-[#C0392B] text-[#C0392B] font-bold text-xs rounded-xl hover:bg-[#EEF2FF] transition-colors">
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