"use client";

import { useCourseRating } from "@/src/hooks/useCourseRating";

// ─── Types & Interfaces ───────────────────────────────────────────────────────

interface CourseRatingCardProps {
  courseId: number;
  progress: number;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StarSelector({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (val: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => onChange(star)}
          className="text-amber-400 hover:scale-110 transition-transform focus:outline-none disabled:cursor-not-allowed disabled:hover:scale-100"
          aria-label={`Rate ${star} out of 5 stars`}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={star <= value ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={star <= value ? "text-amber-400" : "text-gray-300"}
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      ))}
      <span className="text-xs font-bold text-gray-700 ml-1.5">{value}.0 / 5.0</span>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CourseRatingCard({ courseId, progress }: CourseRatingCardProps) {
  const {
    isEligible,
    rating,
    reviewText,
    isSubmitting,
    isSaved,
    profanityError,
    hasExistingRating,
    setRating,
    setReviewText,
    handleSubmit,
  } = useCourseRating({
    courseId,
    courseProgress: progress,
    minProgressThreshold: 20,
    initialRating: progress >= 20 ? { rating: 5, reviewText: "This course provided solid foundational explanations of Next.js route handlers!", updatedAt: "just now" } : null,
  });

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm relative overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[14px] font-bold text-[#111827] flex items-center gap-2">
          <span>Course Review</span>
          {hasExistingRating && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EEF2FF] text-[#4F46E5] border border-indigo-100">
              Your Review
            </span>
          )}
        </h3>
      </div>

      {!isEligible ? (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-center flex flex-col items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-600">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <p className="text-xs font-bold">Review Locked</p>
          <p className="text-[11px] text-amber-700 leading-relaxed">
            Please complete at least <strong>20% of the course</strong> before submitting a review (current progress: {progress}%).
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#4B5563]">Rating</label>
            <StarSelector value={rating} onChange={setRating} disabled={isSubmitting} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#4B5563]">Feedback</label>
            <textarea
              rows={3}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              disabled={isSubmitting}
              placeholder="Share your experience with this course..."
              className={`w-full px-3 py-2 rounded-xl text-xs text-[#111827] bg-[#F9FAFB] border focus:outline-none focus:bg-white resize-none transition-all ${
                profanityError ? "border-red-400 focus:border-red-500" : "border-[#E5E7EB] focus:border-[#4F46E5]"
              }`}
            />
          </div>

          {profanityError && (
            <p className="text-[11px] font-semibold text-red-500 bg-red-50 p-2 rounded-lg border border-red-200">
              {profanityError}
            </p>
          )}

          {isSaved && !profanityError && (
            <p className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
              ✓ Review saved successfully! Submissions overwrite existing reviews per course rules.
            </p>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !reviewText.trim()}
            className="w-full py-2 rounded-xl text-xs font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : hasExistingRating ? "Update Review" : "Submit Review"}
          </button>
        </div>
      )}
    </div>
  );
}
