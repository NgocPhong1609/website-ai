"use client";

import { useState, useCallback, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AvatarValidationError {
  type: "format" | "size";
  message: string;
}

interface UseAvatarUploadReturn {
  previewUrl: string | null;
  uploadError: AvatarValidationError | null;
  isUploading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  triggerFilePicker: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ALLOWED_FORMATS = ["image/jpeg", "image/png"] as const;
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAvatarUpload(): UseAvatarUploadReturn {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<AvatarValidationError | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const triggerFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    // Validate format
    if (!(ALLOWED_FORMATS as readonly string[]).includes(file.type)) {
      setUploadError({ type: "format", message: "Only JPG and PNG images are allowed." });
      e.target.value = "";
      return;
    }

    // Validate size
    if (file.size > MAX_SIZE_BYTES) {
      setUploadError({ type: "size", message: `File is too large. Maximum size is 5MB (uploaded: ${(file.size / 1024 / 1024).toFixed(1)}MB).` });
      e.target.value = "";
      return;
    }

    // Preview
    const reader = new FileReader();
    reader.onloadstart = () => setIsUploading(true);
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
      setIsUploading(false);
      // In production: POST /api/profile/avatar with FormData
      console.info("[Avatar] File validated. Ready to upload:", file.name, `(${(file.size / 1024).toFixed(0)}KB)`);
    };
    reader.readAsDataURL(file);
  }, []);

  return {
    previewUrl,
    uploadError,
    isUploading,
    fileInputRef,
    triggerFilePicker,
    handleFileChange,
  };
}
