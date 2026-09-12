"use client";

import React, { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  imgClassName?: string;
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-lg",
};

const R2_PUBLIC_BASE = "https://pub-bfe1280f0c5041a4bd4e8104c0aa9ae6.r2.dev";

export function formatAvatarUrl(url?: string | null): string | null {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("data:") || trimmed.startsWith("blob:")) {
    return trimmed;
  }

  // Handle R2 domain strings missing protocol
  if (
    trimmed.includes(".r2.dev") ||
    trimmed.includes(".cloudflarestorage.com")
  ) {
    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
      return `https://${trimmed.replace(/^\/+/, "")}`;
    }
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  const rawBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const baseUrl = rawBase.replace(/\/+$/, "").replace(/\/api$/, "");

  // Normalize localhost:8000 or 127.0.0.1:8000 origin mismatches
  if (trimmed.startsWith("http://localhost:8000") || trimmed.startsWith("http://127.0.0.1:8000")) {
    const path = trimmed.replace(/^http:\/\/(localhost|127\.0\.0\.1):8000/, "");
    return `${baseUrl}${path.startsWith("/") ? path : "/" + path}`;
  }

  if (trimmed.startsWith("/")) {
    return `${baseUrl}${trimmed}`;
  }

  return `${baseUrl}/${trimmed}`;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "User avatar",
  fallback = "U",
  size = "md",
  className,
  imgClassName,
}) => {
  const [currentSrc, setCurrentSrc] = useState<string | null>(null);
  const [hasFailed, setHasFailed] = useState(false);

  React.useEffect(() => {
    setHasFailed(false);
    setCurrentSrc(formatAvatarUrl(src));
  }, [src]);

  const baseClasses =
    "relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-[#C0392B] text-white flex-shrink-0 shadow-2xs";
  const mergedClasses = twMerge(baseClasses, sizeClasses[size], className);

  const handleError = () => {
    // If backend URL failed and src was relative, try fallback to R2 Public Bucket
    if (src && typeof src === "string" && !src.startsWith("http://") && !src.startsWith("https://") && R2_PUBLIC_BASE) {
      const cleanPath = src.replace(/^\/+/, "");
      const r2Url = `${R2_PUBLIC_BASE}/${cleanPath}`;
      if (currentSrc !== r2Url) {
        setCurrentSrc(r2Url);
        return;
      }
    }
    setHasFailed(true);
  };

  if (currentSrc && !hasFailed) {
    return (
      <div className={mergedClasses}>
        <img
          src={currentSrc}
          alt={alt}
          referrerPolicy="no-referrer"
          className={twMerge("w-full h-full object-cover", imgClassName)}
          onError={handleError}
        />
      </div>
    );
  }

  const getInitials = (str: string) => {
    if (!str) return "U";
    const trimmed = str.trim();
    const parts = trimmed.split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return trimmed.slice(0, 2).toUpperCase();
  };

  return (
    <div className={mergedClasses}>
      <span className="font-black text-white uppercase">
        {getInitials(fallback)}
      </span>
    </div>
  );
};
