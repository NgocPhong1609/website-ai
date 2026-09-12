"use client";

import { useState } from "react";
import {
  deleteLessonAttachment,
  downloadLessonAttachment,
  LessonAttachment,
  renameLessonAttachment,
  uploadLessonAttachments,
} from "../api";

const MAX_FILE_SIZE = 25 * 1024 * 1024;
const ALLOWED_EXTENSIONS = new Set(["doc", "docx", "xls", "xlsx", "ppt", "pptx", "pdf"]);

interface LessonAttachmentsProps {
  lessonId: string | number;
  initialAttachments: LessonAttachment[];
  readOnly?: boolean;
  audience?: "instructor" | "student";
}

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function LessonAttachments({
  lessonId,
  initialAttachments,
  readOnly = false,
  audience = "instructor",
}: LessonAttachmentsProps) {
  const [attachments, setAttachments] = useState(initialAttachments);
  const [names, setNames] = useState<Record<number, string>>(
    Object.fromEntries(initialAttachments.map((attachment) => [attachment.id, attachment.display_name])),
  );
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFiles = async (files: File[]) => {
    setError("");
    const invalid = files.find((file) => {
      const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
      return !ALLOWED_EXTENSIONS.has(extension) || file.size > MAX_FILE_SIZE;
    });
    if (invalid) {
      setError("Chỉ nhận DOC, DOCX, XLS, XLSX, PPT, PPTX, PDF và mỗi file không vượt quá 25 MB.");
      return;
    }

    setIsUploading(true);
    try {
      const uploaded = await uploadLessonAttachments(lessonId, files);
      setAttachments((current) => [...current, ...uploaded]);
      setNames((current) => ({
        ...current,
        ...Object.fromEntries(uploaded.map((attachment) => [attachment.id, attachment.display_name])),
      }));
    } catch {
      setError("Không thể tải tài liệu lên. Vui lòng thử lại.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRename = async (attachment: LessonAttachment) => {
    const displayName = names[attachment.id]?.trim();
    if (!displayName || displayName === attachment.display_name) return;
    const updated = await renameLessonAttachment(lessonId, attachment.id, displayName);
    setAttachments((current) => current.map((item) => item.id === updated.id ? updated : item));
  };

  const handleDownload = async (attachment: LessonAttachment) => {
    const signedUrl = await downloadLessonAttachment(lessonId, attachment.id, audience);
    window.open(signedUrl, "_blank", "noopener,noreferrer");
  };

  const handleDelete = async (attachment: LessonAttachment) => {
    await deleteLessonAttachment(lessonId, attachment.id);
    setAttachments((current) => current.filter((item) => item.id !== attachment.id));
  };

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-[#0F172A]">Tài liệu đính kèm</h3>
          {!readOnly && <p className="text-xs text-[#64748B]">DOC, Excel, PowerPoint hoặc PDF — tối đa 25 MB/file.</p>}
        </div>
        {!readOnly && (
          <label className="cursor-pointer rounded-lg bg-[#3B82F6] px-3 py-2 text-xs font-bold text-white hover:bg-[#2563EB]">
            {isUploading ? "Đang tải..." : "Chọn tài liệu"}
            <input
              aria-label="Chọn tài liệu"
              className="hidden"
              type="file"
              multiple
              disabled={isUploading}
              accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf"
              onChange={(event) => {
                const files = Array.from(event.target.files ?? []);
                if (files.length > 0) void handleFiles(files);
                event.target.value = "";
              }}
            />
          </label>
        )}
      </div>

      {error && <p role="alert" className="text-xs font-semibold text-red-600">{error}</p>}
      {attachments.length === 0 ? (
        <p className="text-xs text-[#64748B]">Chưa có tài liệu đính kèm.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {attachments.map((attachment) => (
            <li key={attachment.id} className="flex flex-wrap items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white p-3">
              {readOnly ? (
                <span className="min-w-0 flex-1 truncate text-sm font-semibold text-[#0F172A]">{attachment.display_name}</span>
              ) : (
                <input
                  className="min-w-0 flex-1 rounded-md border border-[#E2E8F0] px-2 py-1 text-sm font-semibold text-[#0F172A]"
                  value={names[attachment.id] ?? attachment.display_name}
                  onChange={(event) => setNames((current) => ({ ...current, [attachment.id]: event.target.value }))}
                />
              )}
              <span className="text-xs uppercase text-[#64748B]">{attachment.extension} · {formatBytes(attachment.size_bytes)}</span>
              {!readOnly && (
                <button type="button" aria-label={`Lưu tên ${names[attachment.id]}`} onClick={() => void handleRename(attachment)} className="text-xs font-bold text-[#3B82F6]">Lưu tên</button>
              )}
              <button type="button" aria-label={`Tải ${names[attachment.id] ?? attachment.display_name}`} onClick={() => void handleDownload(attachment)} className="text-xs font-bold text-[#3B82F6]">Tải xuống</button>
              {!readOnly && (
                <button type="button" aria-label={`Xóa ${names[attachment.id] ?? attachment.display_name}`} onClick={() => void handleDelete(attachment)} className="text-xs font-bold text-red-600">Xóa</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
