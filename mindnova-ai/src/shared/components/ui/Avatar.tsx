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

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "User avatar",
  fallback = "U",
  size = "md",
  className,
  imgClassName,
}) => {
  const [error, setError] = useState(false);

  React.useEffect(() => {
    setError(false);
  }, [src]);

  const baseClasses =
    "relative inline-flex items-center justify-center overflow-hidden rounded-full bg-indigo-50 border border-indigo-100 flex-shrink-0";
  const mergedClasses = twMerge(baseClasses, sizeClasses[size], className);

  if (src && !error) {
    return (
      <div className={mergedClasses}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className={twMerge("w-full h-full object-cover", imgClassName)}
          onError={() => setError(true)}
        />
      </div>
    );
  }

  return (
    <div className={mergedClasses}>
      <span className="font-semibold text-indigo-600 uppercase">
        {fallback.slice(0, 2)}
      </span>
    </div>
  );
};
