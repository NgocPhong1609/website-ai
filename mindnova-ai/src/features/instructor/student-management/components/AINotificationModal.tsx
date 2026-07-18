"use client";

// ─── AINotificationModal ──────────────────────────────────────────────────────
// Modal soạn thảo và gửi thông báo AI cho học viên.
// Hai cột: form bên trái + draft preview bên phải.

import { useState, useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";
import { SparklesIcon, PlusIcon } from "./icons";

// ─── Local icons ──────────────────────────────────────────────────────────────

const S = {
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor" as const,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

function XIcon() {
  return (
    <svg {...S} width={16} height={16} strokeWidth={2.5}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg {...S} width={14} height={14} strokeWidth={2}>
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg {...S} width={14} height={14} strokeWidth={2}>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function BoldIcon()   { return <svg {...S} width={13} height={13} strokeWidth={2.5}><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" /><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" /></svg>; }
function ItalicIcon() { return <svg {...S} width={13} height={13} strokeWidth={2.5}><line x1="19" y1="4" x2="10" y2="4" /><line x1="14" y1="20" x2="5" y2="20" /><line x1="15" y1="4" x2="9" y2="20" /></svg>; }
function UnderlineIcon() { return <svg {...S} width={13} height={13} strokeWidth={2.5}><path d="M6 3v7a6 6 0 0 0 12 0V3" /><line x1="4" y1="21" x2="20" y2="21" /></svg>; }
function ListIcon()   { return <svg {...S} width={13} height={13} strokeWidth={2}><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>; }
function LinkIcon()   { return <svg {...S} width={13} height={13} strokeWidth={2}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>; }
function ChevronDownIcon() { return <svg {...S} width={13} height={13} strokeWidth={2.5}><polyline points="6 9 12 15 18 9" /></svg>; }

// ─── Types ────────────────────────────────────────────────────────────────────

interface AINotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Mock generated draft ─────────────────────────────────────────────────────

const MOCK_DRAFT = `🚀 **Chào mừng các bạn đến với giai đoạn bứt phá!**

Chào các bạn học viên lớp AI Foundations,

Tôi nhận thấy tinh thần học tập của lớp chúng ta trong tuần qua vô cùng ấn tượng. Để tiếp thêm động lực cho các bạn chuẩn bị bước vào chương cuối của khóa học, tôi đã mở thêm một số tài liệu tham khảo nâng cao trong phần tài nguyên.

Đừng quên:

• Hoàn thành bài tập Lab số 4 trước thứ Sáu.
• Tham gia buổi Q&A trực tuyến vào tối thứ Tư.
• Xem lại video tóm tắt Module 3 trước khi lên lớp.

Chúc các bạn học tập hiệu quả và đạt kết quả tốt nhất! 💪`;

// ─── Suggestion Chip ──────────────────────────────────────────────────────────

const SUGGESTION_CHIPS = [
  { icon: "🏫", label: "Khởi lệ học tập" },
  { icon: "📅", label: "Nhắc lịch thi"   },
  { icon: "🔄", label: "Cập nhật nội dung"},
  { icon: "💬", label: "Thông báo thảo luận"},
];

function SuggestionChip({
  icon, label, active, onClick,
}: {
  icon: string; label: string; active: boolean; onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={twMerge(
        "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#6B6BFF]/30",
        active
          ? "border-[#6B6BFF] bg-[#EEF0FF] text-[#4648D4]"
          : "border-[#EAEAF4] text-[#64647A] bg-white hover:border-[#C5C6FF] hover:text-[#4648D4]",
      )}
    >
      <span>{icon}</span>
      {label}
    </button>
  );
}

// ─── Rich Text Toolbar ────────────────────────────────────────────────────────

function EditorToolbar({ onFormat }: { onFormat: (cmd: string) => void }) {
  const tools = [
    { icon: <BoldIcon />,       cmd: "bold",          label: "Đậm"         },
    { icon: <ItalicIcon />,     cmd: "italic",        label: "Nghiêng"     },
    { icon: <UnderlineIcon />,  cmd: "underline",     label: "Gạch chân"   },
    { icon: <ListIcon />,       cmd: "insertUnorderedList", label: "Danh sách" },
    { icon: <LinkIcon />,       cmd: "link",          label: "Liên kết"    },
  ];

  return (
    <div className="flex items-center gap-0.5 px-2 py-1.5 bg-[#F8F8FD] border-b border-[#EAEAF4]">
      {tools.map(({ icon, cmd, label }) => (
        <button
          key={cmd}
          type="button"
          aria-label={label}
          onMouseDown={(e) => { e.preventDefault(); onFormat(cmd); }}
          className="w-7 h-7 rounded-md flex items-center justify-center text-[#64647A] hover:text-[#4648D4] hover:bg-[#EEF0FF] transition-all duration-150 focus:outline-none"
        >
          {icon}
        </button>
      ))}
    </div>
  );
}

// ─── Draft Preview Area ───────────────────────────────────────────────────────

function DraftPreview({
  content,
  onRefresh,
  onCopy,
}: {
  content: string;
  onRefresh: () => void;
  onCopy: () => void;
}) {
  const editorRef = useRef<HTMLDivElement>(null);

  // Render markdown-like bold syntax
  const renderContent = (raw: string) => {
    return raw
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/•/g, "•")
      .split("\n")
      .map((line, i) => {
        if (!line.trim()) return `<br/>`;
        if (line.startsWith("•")) return `<li class="ml-4 list-disc text-[13px] text-[#464554] leading-relaxed">${line.slice(1).trim()}</li>`;
        return `<p class="text-[13px] text-[#464554] leading-relaxed">${line}</p>`;
      })
      .join("");
  };

  const handleFormat = (cmd: string) => {
    if (cmd === "link") {
      const url = prompt("Nhập URL:");
      if (url) document.execCommand("createLink", false, url);
    } else {
      document.execCommand(cmd, false);
    }
    editorRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Sub-header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[12px] font-semibold text-[#464554]">Dự thảo được tạo:</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Tạo lại"
            onClick={onRefresh}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9090B0] hover:text-[#4648D4] hover:bg-[#EEF0FF] transition-all duration-150"
          >
            <RefreshIcon />
          </button>
          <button
            type="button"
            aria-label="Sao chép"
            onClick={onCopy}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9090B0] hover:text-[#4648D4] hover:bg-[#EEF0FF] transition-all duration-150"
          >
            <CopyIcon />
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col rounded-xl border border-[#DDDDF0] bg-white overflow-hidden focus-within:border-[#6B6BFF] focus-within:ring-2 focus-within:ring-[#6B6BFF]/15 transition-all duration-150">
        <EditorToolbar onFormat={handleFormat} />
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          className="flex-1 px-4 py-3 text-[13px] text-[#464554] leading-relaxed overflow-y-auto focus:outline-none min-h-[280px] max-h-[340px]"
          dangerouslySetInnerHTML={{ __html: renderContent(content) }}
        />
      </div>
    </div>
  );
}

// ─── Loading Shimmer ──────────────────────────────────────────────────────────

function GeneratingShimmer() {
  return (
    <div className="flex flex-col gap-3 px-4 py-3">
      {[80, 100, 65, 90, 75, 55].map((w, i) => (
        <div
          key={i}
          className="h-3 rounded-full bg-gradient-to-r from-[#EEF0FF] via-[#D5D5FF] to-[#EEF0FF] animate-pulse"
          style={{ width: `${w}%`, animationDelay: `${i * 100}ms` }}
        />
      ))}
      <div className="flex items-center gap-2 mt-2 text-[12px] text-[#6B6BFF] font-semibold animate-pulse">
        <SparklesIcon size={12} />
        AI đang soạn thảo...
      </div>
    </div>
  );
}

// ─── Left Panel ───────────────────────────────────────────────────────────────

function LeftPanel({
  recipient, setRecipient,
  topic, setTopic,
  activeChip, setActiveChip,
  onGenerate, isGenerating,
}: {
  recipient: string;
  setRecipient: (v: string) => void;
  topic: string;
  setTopic: (v: string) => void;
  activeChip: string | null;
  setActiveChip: (v: string | null) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}) {
  const RECIPIENTS = [
    "Tất cả học viên",
    "Lớp AI Foundations",
    "Lớp Data Science AI",
    "Lớp Prompt Engineering",
    "Học viên chưa hoàn thành",
  ];

  return (
    <div className="flex flex-col gap-4 pr-5 border-r border-[#F0F0F8]">
      {/* Recipient */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="recipient-select" className="text-[12px] font-semibold text-[#464554]">
          Gửi đến:
        </label>
        <div className="relative">
          <select
            id="recipient-select"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full appearance-none h-10 px-3 pr-9 rounded-xl border border-[#DDDDF0] bg-[#FAFAFE] text-sm text-[#1A1A2E] focus:outline-none focus:border-[#6B6BFF] focus:ring-2 focus:ring-[#6B6BFF]/15 transition-all duration-150 cursor-pointer"
          >
            {RECIPIENTS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#9090B0]">
            <ChevronDownIcon />
          </div>
        </div>
      </div>

      {/* Topic input */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="notification-topic" className="text-[12px] font-semibold text-[#464554]">
          Chủ đề hoặc ý chính:
        </label>
        <textarea
          id="notification-topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Nhập chủ đề hoặc ý chính..."
          rows={5}
          className="w-full px-3 py-2.5 rounded-xl border border-[#DDDDF0] bg-[#FAFAFE] text-[13px] text-[#1A1A2E] placeholder:text-[#C4C4D8] focus:outline-none focus:border-[#6B6BFF] focus:ring-2 focus:ring-[#6B6BFF]/15 transition-all duration-150 resize-none leading-relaxed"
        />
      </div>

      {/* Suggestion chips */}
      <div className="flex flex-col gap-2">
        <span className="text-[12px] font-semibold text-[#464554]">Gợi ý chủ đề:</span>
        <div className="flex flex-wrap gap-2">
          {SUGGESTION_CHIPS.map(({ icon, label }) => (
            <SuggestionChip
              key={label}
              icon={icon}
              label={label}
              active={activeChip === label}
              onClick={() => {
                setActiveChip(activeChip === label ? null : label);
                if (activeChip !== label) setTopic(label);
              }}
            />
          ))}
        </div>
      </div>

      {/* Generate CTA */}
      <button
        type="button"
        id="btn-generate-draft"
        onClick={onGenerate}
        disabled={isGenerating}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-[13px] font-semibold text-white bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] shadow-[0_4px_14px_rgba(70,72,212,0.35)] hover:shadow-[0_6px_20px_rgba(70,72,212,0.5)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:pointer-events-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4648D4]/40"
      >
        {isGenerating ? (
          <>
            <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            Đang tạo...
          </>
        ) : (
          <>
            <span className="animate-pulse"><SparklesIcon size={13} /></span>
            Tạo dự thảo bằng AI
          </>
        )}
      </button>
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

export function AINotificationModal({ isOpen, onClose }: AINotificationModalProps) {
  const [recipient, setRecipient] = useState("Tất cả học viên");
  const [topic, setTopic] = useState("");
  const [activeChip, setActiveChip] = useState<string | null>(null);
  const [draft, setDraft] = useState(MOCK_DRAFT);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  // Trap focus & handle ESC
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setDraft("");
    await new Promise((r) => setTimeout(r, 1800));
    setDraft(MOCK_DRAFT);
    setIsGenerating(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(draft.replace(/\*\*(.*?)\*\*/g, "$1")).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveDraft = () => {
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1200);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[3px]"
        onClick={onClose}
        aria-hidden
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          role="dialog"
          aria-modal
          aria-label="Tạo thông báo mới bằng AI"
          className="pointer-events-auto w-full max-w-[740px] bg-white rounded-2xl border border-[#EAEAF4] shadow-[0_24px_80px_rgba(70,72,212,0.18)] overflow-hidden"
        >
          {/* Modal header */}
          <div className="flex items-start gap-3 px-6 py-5 border-b border-[#F0F0F8]">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6B6BFF] to-[#4648D4] flex items-center justify-center text-white shadow-[0_4px_14px_rgba(107,107,255,0.4)] shrink-0">
              <SparklesIcon size={17} />
            </div>
            <div className="flex-1">
              <h2 className="text-[16px] font-extrabold text-[#1A1A2E] tracking-tight">
                Tạo thông báo mới
              </h2>
              <p className="text-[12px] text-[#9090B0] mt-0.5">
                Sử dụng AI để soạn thảo thông báo chuyên nghiệp trong giây lát.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng"
              className="w-8 h-8 rounded-xl flex items-center justify-center text-[#9090B0] hover:text-[#1A1A2E] hover:bg-[#F4F4FA] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#EAEAF4] shrink-0"
            >
              <XIcon />
            </button>
          </div>

          {/* Two-column body */}
          <div className="grid grid-cols-[280px_1fr] gap-0 max-h-[520px]">
            {/* Left form */}
            <div className="px-5 py-5 overflow-y-auto">
              <LeftPanel
                recipient={recipient}
                setRecipient={setRecipient}
                topic={topic}
                setTopic={setTopic}
                activeChip={activeChip}
                setActiveChip={setActiveChip}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
              />
            </div>

            {/* Right draft */}
            <div className="px-5 py-5 flex flex-col overflow-y-auto">
              {isGenerating ? (
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[12px] font-semibold text-[#464554]">Dự thảo được tạo:</span>
                  </div>
                  <div className="flex-1 rounded-xl border border-[#DDDDF0] bg-white overflow-hidden">
                    <div className="px-3 py-2 bg-[#F8F8FD] border-b border-[#EAEAF4] flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-5 h-4 rounded bg-[#EAEAF4]" />
                      ))}
                    </div>
                    <GeneratingShimmer />
                  </div>
                </div>
              ) : draft ? (
                <DraftPreview
                  content={draft}
                  onRefresh={handleGenerate}
                  onCopy={handleCopy}
                />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 text-[#C4C4D8] border-2 border-dashed border-[#EAEAF4] rounded-xl">
                  <span className="text-4xl">✦</span>
                  <p className="text-[12px] font-semibold text-center">
                    Nhập chủ đề và nhấn{" "}
                    <span className="text-[#6B6BFF]">"Tạo dự thảo bằng AI"</span>
                    <br />để xem kết quả ở đây.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Modal footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#F0F0F8]">
            {copied && (
              <span className="text-[11px] text-emerald-600 font-semibold mr-auto">
                ✓ Đã sao chép vào clipboard!
              </span>
            )}
            {saved && (
              <span className="text-[11px] text-[#6B6BFF] font-semibold mr-auto animate-pulse">
                ✓ Đã lưu nháp!
              </span>
            )}
            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-5 py-2.5 text-sm font-semibold text-[#64647A] hover:text-[#1A1A2E] transition-colors duration-150 focus:outline-none"
            >
              Lưu nháp
            </button>
            <button
              type="button"
              id="btn-send-notification-modal"
              disabled={!draft || isGenerating}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] shadow-[0_4px_14px_rgba(70,72,212,0.35)] hover:shadow-[0_6px_20px_rgba(70,72,212,0.5)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4648D4]/40"
            >
              Gửi thông báo
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
