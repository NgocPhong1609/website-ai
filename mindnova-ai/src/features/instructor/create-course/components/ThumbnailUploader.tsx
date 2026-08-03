"use client";

// ─── ThumbnailUploader ────────────────────────────────────────────────────────
// Drag-and-drop + click-to-upload area for the course thumbnail image.

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { ImageIcon, XIcon } from "./icons";

interface ThumbnailUploaderProps {
  preview: string | null;
  onChange: (file: File, preview: string) => void;
  onRemove: () => void;
}

export function ThumbnailUploader({
  preview,
  onChange,
  onRemove,
}: ThumbnailUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const url = URL.createObjectURL(file);
      onChange(file, url);
    },
    [onChange],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  // ── Has preview ────────────────────────────────────────────────────────────
  if (preview) {
    return (
      <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-[#EAEAF4] group">
        <Image src={preview} alt="Ảnh bìa khóa học" fill className="object-cover" />
        {/* Remove overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <button
            type="button"
            onClick={onRemove}
            aria-label="Xóa ảnh bìa"
            className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-red-500 hover:bg-white transition-all duration-150"
          >
            <XIcon size={15} />
          </button>
        </div>
      </div>
    );
  }

  // ── Empty / drag zone ──────────────────────────────────────────────────────
  return (
    <button
      type="button"
      id="thumbnail-upload-area"
      aria-label="Tải ảnh bìa lên"
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={twMerge(
        "w-full aspect-[4/3] rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#6B6BFF]/40",
        isDragging
          ? "border-[#6B6BFF] bg-[#6B6BFF]/5 scale-[1.02]"
          : "border-[#D5D5F0] bg-[#F8F8FF] hover:border-[#6B6BFF] hover:bg-[#F4F4FF]",
      )}
    >
      {/* Icon */}
      <div
        className={twMerge(
          "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200",
          isDragging ? "text-[#6B6BFF]" : "text-[#9090B0]",
        )}
      >
        <ImageIcon size={28} />
      </div>

      <div className="flex flex-col items-center gap-1 text-center">
        <p className="text-sm font-semibold text-[#4648D4]">Tải ảnh lên</p>
        <p className="text-[11px] text-[#9090B0] uppercase tracking-wide">
          JPG, PNG hoặc WEBP
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={handleChange}
        aria-label="Chọn ảnh bìa"
      />
    </button>
  );
}
