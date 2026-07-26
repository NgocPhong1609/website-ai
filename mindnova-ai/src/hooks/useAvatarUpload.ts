"use client";

import { useState, useCallback, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IAvatarUploadResult, IStudentProfile } from "../types/student";


interface AvatarValidationError {
  type: "format" | "size";
  message: string;
}

interface UseAvatarUploadReturn {
  previewUrl: string | null;
  rawImageUrl: string | null;
  uploadError: AvatarValidationError | null;
  isUploading: boolean;
  isDragging: boolean;
  isCropperOpen: boolean;
  zoomLevel: number;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  triggerFilePicker: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  setZoomLevel: (zoom: number) => void;
  handleApplyCrop: () => void;
  handleCancelCrop: () => void;
}

const ALLOWED_FORMATS = ["image/jpeg", "image/png"] as const;
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB Strict Rule

async function mockUploadAvatar(croppedBase64: string): Promise<IAvatarUploadResult> {
  await new Promise((resolve) => setTimeout(resolve, 800)); // Simulated S3/Cloud storage upload
  return { success: true, avatarUrl: croppedBase64 };
}

export function useAvatarUpload(): UseAvatarUploadReturn {
  const queryClient = useQueryClient();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [rawImageUrl, setRawImageUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<AvatarValidationError | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const triggerFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const validateAndProcessFile = useCallback((file: File) => {
    setUploadError(null);

    // Core Rule: Validate image format strictly (JPG/PNG only)
    if (!(ALLOWED_FORMATS as readonly string[]).includes(file.type)) {
      setUploadError({ type: "format", message: "Core Rule Enforcement: Only JPG and PNG image formats are supported." });
      return;
    }

    // Core Rule: Validate file size (max 5MB)
    if (file.size > MAX_SIZE_BYTES) {
      setUploadError({
        type: "size",
        message: `Core Rule Enforcement: File exceeds 5MB size limit (${(file.size / 1024 / 1024).toFixed(2)}MB uploaded).`,
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setRawImageUrl(reader.result as string);
      setZoomLevel(1.0);
      setIsCropperOpen(true);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndProcessFile(file);
      e.target.value = "";
    }
  }, [validateAndProcessFile]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndProcessFile(file);
    }
  }, [validateAndProcessFile]);

  const mutation = useMutation<IAvatarUploadResult, Error, string>({
    mutationFn: mockUploadAvatar,
    onSuccess: (result) => {
      if (result.success) {
        setPreviewUrl(result.avatarUrl);
        setIsCropperOpen(false);
        // Automatically update cached profile with new avatar URL
        queryClient.setQueryData<IStudentProfile>(["student-profile"], (old) =>
          old ? { ...old, avatarUrl: result.avatarUrl } : undefined
        );
      }
    },
  });

  const handleApplyCrop = useCallback(() => {
    if (rawImageUrl) {
      mutation.mutate(rawImageUrl);
    }
  }, [rawImageUrl, mutation]);

  const handleCancelCrop = useCallback(() => {
    setIsCropperOpen(false);
    setRawImageUrl(null);
  }, []);

  return {
    previewUrl,
    rawImageUrl,
    uploadError,
    isUploading: mutation.isPending,
    isDragging,
    isCropperOpen,
    zoomLevel,
    fileInputRef,
    triggerFilePicker,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    setZoomLevel,
    handleApplyCrop,
    handleCancelCrop,
  };
}
