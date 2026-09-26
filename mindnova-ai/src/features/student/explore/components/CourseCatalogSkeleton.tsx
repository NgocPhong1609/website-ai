"use client";

import { twMerge } from "tailwind-merge";

export function CourseCatalogSkeleton() {
  return (
    <section className="w-full flex flex-col gap-8">
      {/* Catalog Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-4 w-full max-w-2xl">
          <div className="h-8 md:h-10 w-3/4 max-w-md bg-slate-200 rounded-lg animate-pulse" />
          <div className="h-4 w-full bg-slate-200 rounded-md animate-pulse" />
          <div className="h-4 w-5/6 bg-slate-200 rounded-md animate-pulse" />
        </div>
      </div>

      {/* Courses Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm h-full"
          >
            {/* Thumbnail */}
            <div className="h-44 w-full bg-slate-200 animate-pulse shrink-0" />

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
              <div className="flex-1 space-y-3">
                <div className="h-5 w-3/4 bg-slate-200 rounded-md animate-pulse" />
                <div className="h-5 w-1/2 bg-slate-200 rounded-md animate-pulse" />
                <div className="space-y-2 mt-4">
                  <div className="h-4 w-full bg-slate-200 rounded-md animate-pulse" />
                  <div className="h-4 w-5/6 bg-slate-200 rounded-md animate-pulse" />
                </div>
              </div>

              {/* Price & Time Box */}
              <div className="mt-5 bg-slate-100 rounded-xl h-12 w-full animate-pulse" />
            </div>

            {/* CTA */}
            <div className="px-5 pb-5 pt-0 mt-auto">
              <div className="h-10 w-full bg-slate-200 rounded-lg animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
