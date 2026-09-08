"use client";

import { useEffect, useState } from "react";
import { quizGeneratorApi } from "../api/quizGeneratorApi";
import type { QuizImageValue } from "../types/quizGenerator.types";

interface QuizImageFieldProps {
  label: string;
  purpose: "thumbnail" | "question" | "answer";
  value: QuizImageValue;
  onChange: (value: QuizImageValue) => void;
}

const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const maxBytes = 5 * 1024 * 1024;

export function QuizImageField({ label, purpose, value, onChange }: QuizImageFieldProps) {
  const [externalUrl, setExternalUrl] = useState(value.url || "");
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => setExternalUrl(value.url || ""), [value.url]);

  const upload = async (file?: File) => {
    if (!file) return;
    if (!allowedTypes.includes(file.type)) {
      setError("Ảnh phải có định dạng JPEG, PNG, WebP hoặc GIF.");
      return;
    }
    if (file.size > maxBytes) {
      setError("Kích thước ảnh không được vượt quá 5 MB.");
      return;
    }

    setError(null);
    setIsUploading(true);
    try {
      const uploaded = await quizGeneratorApi.uploadMedia(file, purpose);
      onChange({ url: uploaded.url, r2_key: uploaded.r2_key });
    } catch (uploadError: any) {
      setError(uploadError?.response?.data?.message || "Không thể tải ảnh lên.");
    } finally {
      setIsUploading(false);
    }
  };

  const applyExternalUrl = () => {
    try {
      const parsed = new URL(externalUrl);
      if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error();
      setError(null);
      onChange({ url: externalUrl, r2_key: null });
    } catch {
      setError("URL ảnh phải dùng HTTP hoặc HTTPS.");
    }
  };

  return (
    <div className="space-y-2 rounded-xl border border-[#E8E2D9] p-3">
      <span className="block text-xs font-bold text-gray-700">{label}</span>
      {value.url && (
        <img src={value.url} alt={`Xem trước ${label}`} className="h-28 w-full rounded-lg border object-contain" />
      )}
      <div className="flex flex-wrap gap-2">
        <label className="cursor-pointer rounded-lg bg-indigo-50 px-3 py-2 text-xs font-bold text-[#C0392B]">
          {isUploading ? "Đang tải..." : "Tải ảnh"}
          <input
            type="file"
            aria-label={`Tải ${label.toLowerCase()}`}
            accept="image/jpeg,image/png,image/webp,image/gif"
            disabled={isUploading}
            className="sr-only"
            onChange={(event) => upload(event.target.files?.[0])}
          />
        </label>
        {value.url && (
          <button type="button" aria-label={`Xóa ${label}`} onClick={() => onChange({ url: null, r2_key: null })} className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600">
            Xóa ảnh
          </button>
        )}
      </div>
      <div className="flex gap-2">
        <input
          type="url"
          aria-label={`URL ngoài cho ${label}`}
          value={externalUrl}
          onChange={(event) => setExternalUrl(event.target.value)}
          placeholder="https://example.com/image.png"
          className="min-w-0 flex-1 rounded-lg border px-3 py-2 text-xs"
        />
        <button type="button" aria-label={`Dùng URL cho ${label}`} onClick={applyExternalUrl} className="rounded-lg border px-3 py-2 text-xs font-bold">
          Dùng URL
        </button>
      </div>
      {error && <p className="text-xs font-semibold text-red-600">{error}</p>}
    </div>
  );
}
