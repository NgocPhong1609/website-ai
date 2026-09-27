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
      className="aspect-square w-28 shrink-0 rounded-lg border border-slate-200 bg-slate-50 object-cover sm:w-32"
    />
  );
}
