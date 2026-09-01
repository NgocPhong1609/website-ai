"use client";

// ─── AINotificationModal ──────────────────────────────────────────────────────
// Modal soạn thảo và gửi thông báo AI cho học viên.
// Hai cột: form bên trái + draft preview bên phải.

import { useState, useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";
import { SparklesIcon, PlusIcon } from "./icons";
import { generateAiNotification, sendNotification, getNotificationOptions } from "../api";
import { MultiSelect } from "@/src/shared/components/ui/MultiSelect";
import { SingleSelect } from "@/src/shared/components/ui/SingleSelect";
import { X as LucideX, RefreshCw, Copy, Bold, Italic, Underline, List, Link as LucideLink, ChevronDown } from "lucide-react";

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
 return <LucideX size={16} />;
}

function RefreshIcon() {
 return <RefreshCw size={14} />;
}

function CopyIcon() {
 return <Copy size={14} />;
}

function BoldIcon() { return <Bold size={14} />; }
function ItalicIcon() { return <Italic size={14} />; }
function UnderlineIcon() { return <Underline size={14} />; }
function ListIcon() { return <List size={14} />; }
function LinkIcon() { return <LucideLink size={14} />; }
function ChevronDownIcon() { return <ChevronDown size={14} />; }

// ─── Types ────────────────────────────────────────────────────────────────────

interface AINotificationModalProps {
 isOpen: boolean;
 onClose: () => void;
 initialTopic?: string;
}

// ─── Suggestion Chip ──────────────────────────────────────────────────────────

const SUGGESTION_CHIPS = [
 { icon: "", label: "Khởi lệ học tập" },
 { icon: "", label: "Nhắc lịch thi" },
 { icon: "", label: "Cập nhật nội dung"},
 { icon: "", label: "Thông báo thảo luận"},
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
 "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#C0392B]/30",
 active
 ? "border-[#E8E2D9] bg-[#EEF0FF] text-[#C0392B]"
 : "border-[#E8E2D9] text-[#8A8478] bg-white hover:border-[#C5C6FF] hover:text-[#C0392B]",
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
 { icon: <BoldIcon />, cmd: "bold", label: "Đậm" },
 { icon: <ItalicIcon />, cmd: "italic", label: "Nghiêng" },
 { icon: <UnderlineIcon />, cmd: "underline", label: "Gạch chân" },
 { icon: <ListIcon />, cmd: "insertUnorderedList", label: "Danh sách" },
 { icon: <LinkIcon />, cmd: "link", label: "Liên kết" },
 ];

 return (
 <div className="flex items-center gap-0.5 px-2 py-1.5 bg-[#F8F8FD] border-b border-[#E8E2D9]">
 {tools.map(({ icon, cmd, label }) => (
 <button
 key={cmd}
 type="button"
 aria-label={label}
 onMouseDown={(e) => { e.preventDefault(); onFormat(cmd); }}
 className="w-7 h-7 rounded-md flex items-center justify-center text-[#8A8478] hover:text-[#C0392B] hover:bg-[#EEF0FF] transition-all duration-150 focus:outline-none"
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
 className="w-7 h-7 rounded-lg flex items-center justify-center text-[#8A8478] hover:text-[#C0392B] hover:bg-[#EEF0FF] transition-all duration-150"
 >
 <RefreshIcon />
 </button>
 <button
 type="button"
 aria-label="Sao chép"
 onClick={onCopy}
 className="w-7 h-7 rounded-lg flex items-center justify-center text-[#8A8478] hover:text-[#C0392B] hover:bg-[#EEF0FF] transition-all duration-150"
 >
 <CopyIcon />
 </button>
 </div>
 </div>

 {/* Editor */}
 <div className="flex-1 flex flex-col rounded-xl border border-[#DDDDF0] bg-white overflow-hidden focus-within:border-[#E8E2D9] focus-within:ring-2 focus-within:ring-[#C0392B]/15 transition-all duration-150">
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
 className="h-3 rounded-full from-[#EEF0FF] via-[#D5D5FF] to-[#EEF0FF] animate-pulse"
 style={{ width: `${w}%`, animationDelay: `${i * 100}ms` }}
 />
 ))}
 <div className="flex items-center gap-2 mt-2 text-[12px] text-[#C0392B] font-semibold animate-pulse">
 <SparklesIcon size={12} />
 AI đang soạn thảo...
 </div>
 </div>
 );
}

// ─── Left Panel ───────────────────────────────────────────────────────────────

function LeftPanel({
 courseIds, setCourseIds,
 options, isLoadingOptions,
 topic, setTopic,
 tone, setTone,
 activeChip, setActiveChip,
 onGenerate, isGenerating,
}: {
 courseIds: (string | number)[];
 setCourseIds: (v: (string | number)[]) => void;
 options: { value: string | number; label: string }[];
 isLoadingOptions: boolean;
 topic: string;
 setTopic: (v: string) => void;
 tone: string;
 setTone: (v: string) => void;
 activeChip: string | null;
 setActiveChip: (v: string | null) => void;
 onGenerate: () => void;
 isGenerating: boolean;
}) {

 const TONE_OPTIONS = [
 { value: "friendly", label: "Thân thiện" },
 { value: "professional", label: "Chuyên nghiệp" },
 { value: "urgent", label: "Khẩn cấp" },
 { value: "encouraging", label: "Khích lệ" },
 ];

 return (
 <div className="flex flex-col gap-4 pr-5 border-r border-[#F0F0F8]">
 {/* Recipient */}
 <div className="flex flex-col gap-1.5">
 <label htmlFor="recipient-select" className="text-[12px] font-semibold text-[#464554]">
 Gửi đến:
 </label>
 <div className="relative">
 <MultiSelect
 options={options}
 value={courseIds}
 onChange={setCourseIds}
 placeholder="Chọn khóa học để gửi..."
 loading={isLoadingOptions}
 emptyText="Chưa có khóa học nào có học viên."
 />
 </div>
 </div>
 
 {/* Tone input */}
 <div className="flex flex-col gap-1.5">
 <label htmlFor="tone-select" className="text-[12px] font-semibold text-[#464554]">
 Giọng điệu:
 </label>
 <div className="relative">
 <SingleSelect
 options={TONE_OPTIONS}
 value={tone}
 onChange={setTone}
 />
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
 className="w-full px-3 py-2.5 rounded-xl border border-[#DDDDF0] bg-[#FAFAFE] text-[13px] text-[#2C3039] placeholder:text-[#C4C4D8] focus:outline-none focus:border-[#E8E2D9] focus:ring-2 focus:ring-[#C0392B]/15 transition-all duration-150 resize-none leading-relaxed"
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
 className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-[13px] font-semibold text-white bg-[#C0392B] shadow-[0_4px_14px_rgba(70,72,212,0.35)] hover:shadow-[0_6px_20px_rgba(70,72,212,0.5)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:pointer-events-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#C0392B]/40"
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

export function AINotificationModal({ isOpen, onClose, initialTopic = "" }: AINotificationModalProps) {
 const [courseIds, setCourseIds] = useState<(string | number)[]>([]);
 const [options, setOptions] = useState<{ value: string | number; label: string }[]>([]);
 const [isLoadingOptions, setIsLoadingOptions] = useState(false);
 
 const [topic, setTopic] = useState(initialTopic);
 const [tone, setTone] = useState("friendly");
 const [activeChip, setActiveChip] = useState<string | null>(null);
 const [draft, setDraft] = useState("");
 const [isGenerating, setIsGenerating] = useState(false);
 const [copied, setCopied] = useState(false);
 const [saved, setSaved] = useState(false);
 const [isSending, setIsSending] = useState(false);

 // Fetch course options when modal opens
 useEffect(() => {
 if (isOpen) {
 setIsLoadingOptions(true);
 getNotificationOptions()
 .then((data) => setOptions(data))
 .catch((err) => console.error("Failed to fetch notification options:", err))
 .finally(() => setIsLoadingOptions(false));
 } else {
 setCourseIds([]); // reset when closed
 }
 }, [isOpen]);

 // Sync initialTopic to topic when modal opens
 useEffect(() => {
 if (isOpen && initialTopic) {
 setTopic(initialTopic);
 const matchedChip = SUGGESTION_CHIPS.find(c => c.label === initialTopic);
 if (matchedChip) setActiveChip(initialTopic);
 else setActiveChip(null);
 } else if (isOpen) {
 setTopic("");
 setActiveChip(null);
 }
 }, [isOpen, initialTopic]);

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
 if (!topic.trim()) return;
 setIsGenerating(true);
 setDraft("");
 try {
 const result = await generateAiNotification({ prompt: topic, tone, course_id: 1 });
 setDraft(result.generated_content);
 } catch (err) {
 console.error(err);
 setDraft("Có lỗi xảy ra khi tạo dự thảo AI. Vui lòng thử lại.");
 } finally {
 setIsGenerating(false);
 }
 };

 const handleSend = async () => {
 if (!draft.trim() || courseIds.length === 0) return;
 setIsSending(true);
 try {
 await sendNotification({ content: draft, course_ids: courseIds });
 setSaved(true);
 setTimeout(() => { setSaved(false); onClose(); }, 1200);
 } catch (err) {
 console.error(err);
 } finally {
 setIsSending(false);
 }
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
 className="pointer-events-auto w-full max-w-[740px] bg-white rounded-2xl border border-[#E8E2D9] shadow-[0_24px_80px_rgba(70,72,212,0.18)] overflow-hidden"
 >
 {/* Modal header */}
 <div className="flex items-start gap-3 px-6 py-5 border-b border-[#F0F0F8]">
 <div className="w-10 h-10 rounded-xl bg-[#C0392B] flex items-center justify-center text-white shadow-[0_4px_14px_rgba(107,107,255,0.4)] shrink-0">
 <SparklesIcon size={17} />
 </div>
 <div className="flex-1">
 <h2 className="text-[16px] font-extrabold text-[#2C3039] tracking-tight">
 Tạo thông báo mới
 </h2>
 <p className="text-[12px] text-[#8A8478] mt-0.5">
 Sử dụng AI để soạn thảo thông báo chuyên nghiệp trong giây lát.
 </p>
 </div>
 <button
 type="button"
 onClick={onClose}
 aria-label="Đóng"
 className="w-8 h-8 rounded-xl flex items-center justify-center text-[#8A8478] hover:text-[#2C3039] hover:bg-[#E8E2D9] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#EAEAF4] shrink-0"
 >
 <XIcon />
 </button>
 </div>

 {/* Two-column body */}
 <div className="grid grid-cols-[280px_1fr] gap-0 max-h-[520px]">
 {/* Left form */}
 <div className="px-5 py-5 overflow-y-auto">
 <LeftPanel
 courseIds={courseIds}
 setCourseIds={setCourseIds}
 options={options}
 isLoadingOptions={isLoadingOptions}
 topic={topic}
 setTopic={setTopic}
 tone={tone}
 setTone={setTone}
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
 <div className="px-3 py-2 bg-[#F8F8FD] border-b border-[#E8E2D9] flex gap-1">
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
 <div className="flex-1 flex flex-col items-center justify-center gap-3 text-[#C4C4D8] border-2 border-dashed border-[#E8E2D9] rounded-xl">
 <span className="text-4xl"></span>
 <p className="text-[12px] font-semibold text-center">
 Nhập chủ đề và nhấn{" "}
 <span className="text-[#C0392B]">&quot;Tạo dự thảo bằng AI&quot;</span>
 <br />để xem kết quả ở đây.
 </p>
 </div>
 )}
 </div>
 </div>

 {/* Modal footer */}
 <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#F0F0F8]">
 {copied && (
 <span className="text-[11px] -[#2C3039] font-semibold mr-auto">
 Đã sao chép vào clipboard!
 </span>
 )}
 {saved && (
 <span className="text-[11px] text-[#C0392B] font-semibold mr-auto animate-pulse">
 Đã lưu nháp!
 </span>
 )}
 <button
 type="button"
 onClick={handleSaveDraft}
 className="px-5 py-2.5 text-sm font-semibold text-[#8A8478] hover:text-[#2C3039] transition-colors duration-150 focus:outline-none"
 >
 Lưu nháp
 </button>
 <button
 type="button"
 id="btn-send-notification-modal"
 onClick={handleSend}
 disabled={!draft || isGenerating || isSending || courseIds.length === 0}
 className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#C0392B] shadow-[0_4px_14px_rgba(70,72,212,0.35)] hover:shadow-[0_6px_20px_rgba(70,72,212,0.5)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#C0392B]/40"
 >
 {isSending ? (
 <>
 <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
 Đang gửi...
 </>
 ) : "Gửi thông báo"}
 </button>
 </div>
 </div>
 </div>
 </>
 );
}
