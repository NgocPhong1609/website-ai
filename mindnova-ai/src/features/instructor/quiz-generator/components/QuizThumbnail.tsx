"use client";

import React from "react";

const FALLBACK_THUMBNAIL = "/icons/exam.svg";

export function QuizThumbnail({ title, src }: { title: string; src?: string | null }) {
  return (
    <img
      src={src || FALLBACK_THUMBNAIL}
      alt={`Ảnh đại diện quiz ${title}`}
      onError={(event) => {
        event.currentTarget.onerror = null;
        event.currentTarget.src = FALLBACK_THUMBNAIL;
      }}
      className="h-36 w-full rounded-xl border border-[#EAEAF4] bg-[#F8FAFC] object-cover"
    />
  );
}
