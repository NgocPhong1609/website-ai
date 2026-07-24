"use client";

import Link from "next/link";
import { twMerge } from "tailwind-merge";
import {
  SearchIcon,
  BellIcon,
  SettingsIcon,
  ArrowLeftIcon,
  ArchiveIcon,
  MoreHorizontalIcon,
  FileIcon,
  BoldIcon,
  ItalicIcon,
  CodeIcon,
  LinkIcon,
  ImageIcon,
  PaperclipIcon,
  AtSignIcon,
  SmileIcon,
  SparklesIcon,
  SendIcon,
} from "./icons";

// ─── Topbar ───────────────────────────────────────────────────────────────────

function Topbar() {
  return (
    <header className="h-16 shrink-0 flex items-center gap-4 px-6 bg-[#FAFAFE] border-b border-[#F0F0F8]">
      {/* Search */}
      <div className="relative flex-1 max-w-[360px]">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0B0C8] pointer-events-none">
          <SearchIcon size={14} />
        </span>
        <input
          id="discussion-search"
          type="search"
          placeholder="Tìm kiếm nội dung..."
          className="w-full pl-9 pr-4 h-10 rounded-full text-sm text-[#1A1A2E] placeholder:text-[#B0B0C8] bg-white border border-[#EAEAF4] focus:outline-none focus:border-[#6B6BFF] focus:ring-2 focus:ring-[#6B6BFF]/10 transition-all duration-200"
        />
      </div>

      <div className="flex-1" />

      {/* Icons */}
      <div className="flex items-center gap-2 text-[#7878A0]">
        <button type="button" aria-label="Thông báo" className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white hover:shadow-sm hover:text-[#4648D4] transition-all relative">
          <BellIcon size={18} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-red-500" />
        </button>
        <button type="button" aria-label="Cài đặt" className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white hover:shadow-sm hover:text-[#4648D4] transition-all">
          <SettingsIcon size={18} />
        </button>
      </div>

      {/* Profile */}
      <div className="flex items-center gap-3 pl-4 border-l border-[#EAEAF4] cursor-pointer group">
        <div className="flex flex-col items-end leading-tight">
          <span className="text-[13px] font-bold text-[#1A1A2E] group-hover:text-[#4648D4] transition-colors">Dr. Emily Chen</span>
          <span className="text-[10px] text-[#9090B0]">Senior Instructor</span>
        </div>
        <div className="w-9 h-9 rounded-full overflow-hidden shrink-0">
          <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-500 text-xs font-bold">
            EC
          </div>
        </div>
      </div>
    </header>
  );
}

// ─── Post Message Card ────────────────────────────────────────────────────────

function StudentPost() {
  return (
    <div className="bg-[#F6F8FD] rounded-2xl p-6 border border-[#EEF0F8]">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
             {/* Mock avatar */}
             <div className="w-full h-full bg-gradient-to-br from-slate-300 to-slate-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-[14px] font-bold text-[#1A1A2E]">Minh Nguyễn</span>
            <span className="text-[12px] text-[#9090B0]">Học viên • 2 giờ trước</span>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-[#E8EDF8] text-[#4A6BB2] text-[10px] font-bold tracking-widest uppercase shrink-0">
          Bài tập 4.2
        </span>
      </div>

      <div className="text-[14px] text-[#464554] leading-relaxed mb-5">
        <p className="mb-4">
          Thưa thầy, em đang gặp khó khăn khi áp dụng <strong>Material</strong> <code className="text-[#6B6BFF] bg-[#EEF0FF] px-1.5 py-0.5 rounded text-[13px]">Tonal Layering</code>. Làm sao để đảm bảo độ tương phản (Accessibility) khi sử dụng các bảng màu Surface và Surface-variant cạnh nhau?
        </p>
        <p>Em có đính kèm file thiết kế Figma bên dưới, mong thầy góp ý ạ!</p>
      </div>

      {/* Attachment */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#EAEAF4] w-fit hover:border-[#C5C6FF] transition-colors cursor-pointer group">
        <div className="w-8 h-8 rounded-lg bg-[#EEF0FF] text-[#6B6BFF] flex items-center justify-center group-hover:bg-[#6B6BFF] group-hover:text-white transition-colors">
          <FileIcon size={16} />
        </div>
        <div className="flex flex-col pr-4">
          <span className="text-[13px] font-semibold text-[#1A1A2E] group-hover:text-[#4648D4] transition-colors">exercise_v1.fig</span>
          <span className="text-[11px] text-[#9090B0]">12.4 MB</span>
        </div>
      </div>
    </div>
  );
}

// ─── Reply Editor Card ────────────────────────────────────────────────────────

function ReplyEditor() {
  return (
    <div className="rounded-2xl border-2 border-[#EAEAF4] bg-white overflow-hidden focus-within:border-[#C5C6FF] transition-colors flex flex-col shadow-sm">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#FAFAFE] border-b border-[#F0F0F8]">
        <div className="flex items-center gap-1 text-[#64647A]">
          <button type="button" aria-label="Bold" className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#EAEAF4] hover:text-[#1A1A2E] transition-colors"><BoldIcon /></button>
          <button type="button" aria-label="Italic" className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#EAEAF4] hover:text-[#1A1A2E] transition-colors"><ItalicIcon /></button>
          <button type="button" aria-label="Code" className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#EAEAF4] hover:text-[#1A1A2E] transition-colors"><CodeIcon /></button>
          <div className="w-px h-4 bg-[#D0D0E8] mx-1" />
          <button type="button" aria-label="Link" className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#EAEAF4] hover:text-[#1A1A2E] transition-colors"><LinkIcon /></button>
          <button type="button" aria-label="Image" className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#EAEAF4] hover:text-[#1A1A2E] transition-colors"><ImageIcon /></button>
          <button type="button" aria-label="Attachment" className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#EAEAF4] hover:text-[#1A1A2E] transition-colors"><PaperclipIcon /></button>
          <div className="w-px h-4 bg-[#D0D0E8] mx-1" />
          <button type="button" aria-label="Mention" className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#EAEAF4] hover:text-[#1A1A2E] transition-colors"><AtSignIcon /></button>
          <button type="button" aria-label="Emoji" className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#EAEAF4] hover:text-[#1A1A2E] transition-colors"><SmileIcon /></button>
        </div>
        
        <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-[#6B6BFF] hover:bg-[#EEF0FF] transition-colors">
          <SparklesIcon size={12} />
          AI Gợi ý câu trả lời
        </button>
      </div>

      {/* Editor Area */}
      <div className="p-4 flex gap-3 min-h-[160px]">
        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 mt-1">
          <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-500 text-xs font-bold">EC</div>
        </div>
        <textarea
          placeholder="Nhập câu trả lời hoặc hướng dẫn cho học viên..."
          className="w-full resize-none bg-transparent text-[14px] text-[#1A1A2E] placeholder:text-[#C4C4D8] focus:outline-none leading-relaxed"
        />
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-[#F0F0F8]">
        <div className="flex items-center gap-5">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 rounded border-[#D0D0E8] text-[#6B6BFF] focus:ring-[#6B6BFF]/30 cursor-pointer" />
            <span className="text-[12px] text-[#64647A] group-hover:text-[#1A1A2E] transition-colors">Đánh dấu là câu trả lời hay nhất</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 rounded border-[#D0D0E8] text-[#6B6BFF] focus:ring-[#6B6BFF]/30 cursor-pointer" />
            <span className="text-[12px] text-[#64647A] group-hover:text-[#1A1A2E] transition-colors">Công khai cho cả lớp</span>
          </label>
        </div>

        <div className="flex items-center gap-3">
          <button type="button" className="text-[13px] font-bold text-[#64647A] hover:text-[#1A1A2E] transition-colors px-3 py-2">
            Hủy
          </button>
          <button type="button" className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-[13px] font-bold text-white bg-[#4648D4] hover:bg-[#3D40C0] shadow-[0_4px_14px_rgba(70,72,212,0.3)] hover:shadow-[0_6px_20px_rgba(70,72,212,0.4)] transition-all hover:-translate-y-0.5">
            Gửi phản hồi <SendIcon size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Right Panels ─────────────────────────────────────────────────────────────

function StudentInfoCard() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#EAEAF4] shadow-sm flex flex-col items-center">
      <h3 className="text-[14px] font-extrabold text-[#1A1A2E] w-full text-left mb-4">Thông tin học viên</h3>
      
      <div className="flex items-center gap-3 w-full mb-6">
        <div className="w-11 h-11 rounded-full bg-[#00A3FF] flex items-center justify-center text-white text-lg font-bold shrink-0 shadow-sm">
          M
        </div>
        <div className="flex flex-col">
          <span className="text-[14px] font-bold text-[#1A1A2E]">Minh Nguyễn</span>
          <span className="text-[11px] text-[#9090B0]">Tham gia: T3/2024</span>
        </div>
      </div>

      <div className="flex gap-3 w-full mb-5">
        <div className="flex-1 rounded-xl bg-[#F6F8FD] border border-[#EEF0F8] p-3 flex flex-col items-center justify-center gap-1">
          <span className="text-[10px] font-bold text-[#9090B0] uppercase tracking-widest">Tiến độ</span>
          <span className="text-[18px] font-extrabold text-[#4648D4]">68%</span>
        </div>
        <div className="flex-1 rounded-xl bg-[#F6F8FD] border border-[#EEF0F8] p-3 flex flex-col items-center justify-center gap-1">
          <span className="text-[10px] font-bold text-[#9090B0] uppercase tracking-widest">Bài tập</span>
          <span className="text-[18px] font-extrabold text-[#00A3FF]">12/18</span>
        </div>
      </div>

      <button className="w-full py-2.5 rounded-xl border border-[#C5C6FF] text-[12px] font-bold text-[#4648D4] hover:bg-[#EEF0FF] transition-colors">
        Xem hồ sơ đầy đủ
      </button>
    </div>
  );
}

function AIMentorCard() {
  return (
    <div className="rounded-2xl border border-[#C5C6FF] bg-gradient-to-br from-[#EEF0FF] to-[#E6E8FF] p-5 shadow-sm">
      <h3 className="flex items-center gap-1.5 text-[14px] font-extrabold text-[#4648D4] mb-3">
        <SparklesIcon size={14} /> Gợi ý Mentor AI
      </h3>
      <p className="text-[12px] text-[#464554] leading-relaxed mb-4 italic">
        &ldquo;Mình thường gặp khó khăn với nguyên lý 60-30-10. Hãy gợi ý cậu ấy xem lại Video &lsquo;Color Balance&rsquo; ở chương 3.&rdquo;
      </p>
      
      <div className="flex flex-col gap-2">
        <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-[#D5D5FF] text-[11px] font-semibold text-[#464554] hover:border-[#6B6BFF] hover:text-[#4648D4] transition-all text-left">
          <LinkIcon size={12} className="shrink-0 text-[#9090B0]" />
          Link: Resource về Accessibility
        </button>
        <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-[#D5D5FF] text-[11px] font-semibold text-[#464554] hover:border-[#6B6BFF] hover:text-[#4648D4] transition-all text-left">
          <FileIcon size={12} className="shrink-0 text-[#9090B0]" />
          Chương 3: Video Color Balance
        </button>
      </div>
    </div>
  );
}

function RelatedQuestionsCard() {
  const qns = [
    { title: "Lỗi không render được token màu trong CSS?", status: "Cần giải đáp", statusColor: "text-[#00A3FF]", author: "Hoàng Anh", time: "1 ngày trước" },
    { title: "Grid system cho Tablet?", status: "Đã giải quyết", statusColor: "text-[#9090B0]", author: "Lan Chi", time: "3 ngày trước" },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#EAEAF4] shadow-sm flex flex-col">
      <h3 className="text-[14px] font-extrabold text-[#1A1A2E] mb-4">Câu hỏi liên quan</h3>
      <div className="flex flex-col gap-4">
        {qns.map((q, i) => (
          <div key={i} className="flex flex-col gap-1 group cursor-pointer">
            <span className={twMerge("text-[10px] font-bold uppercase tracking-widest", q.statusColor)}>
              {q.status}
            </span>
            <span className="text-[13px] font-bold text-[#1A1A2E] group-hover:text-[#4648D4] transition-colors leading-snug">
              {q.title}
            </span>
            <span className="text-[10px] text-[#9090B0]">
              Từ: {q.author} • {q.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Container ───────────────────────────────────────────────────────────

export function DiscussionReplyContainer() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8FF]">
      <Topbar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1000px] mx-auto px-6 py-6 lg:py-10">
          
          {/* Header */}
          <Link href="/instructor/discussions" className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#6B6BFF] hover:text-[#4648D4] transition-colors mb-4">
            <ArrowLeftIcon /> Quay lại danh sách thảo luận
          </Link>

          <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
            <div className="flex flex-col gap-1.5">
              <h1 className="text-[28px] font-extrabold text-[#1A1A2E] tracking-tight">Phản hồi & Mentoring</h1>
              <p className="text-[13px] text-[#64647A]">
                Khóa học: <span className="font-semibold text-[#464554]">UI/UX Design Masterclass 2024</span> • Chương 4: Visual Design Systems
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#DDDDF0] bg-white text-[13px] font-semibold text-[#464554] hover:bg-[#F4F4FA] hover:border-[#C5C6FF] transition-all">
                <ArchiveIcon /> Lưu trữ
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-[#DDDDF0] bg-white text-[#9090B0] hover:bg-[#F4F4FA] hover:border-[#C5C6FF] hover:text-[#464554] transition-all">
                <MoreHorizontalIcon />
              </button>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
            
            {/* Left: Thread Content */}
            <div className="flex flex-col gap-6">
              <StudentPost />
              <ReplyEditor />
            </div>

            {/* Right: Sidebar context */}
            <div className="flex flex-col gap-4">
              <StudentInfoCard />
              <AIMentorCard />
              <RelatedQuestionsCard />
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}
