"use client";

import { useLessonComments } from "@/src/hooks/useLessonComments";

interface LessonCommentsProps {
  lessonId: number;
  onJumpToTime?: (sec: number) => void;
}

export function LessonComments({ lessonId, onJumpToTime }: LessonCommentsProps) {
  const {
    comments,
    newCommentText,
    timestampInput,
    profanityError,
    isSubmitting,
    setNewCommentText,
    setTimestampInput,
    handleAddComment,
    handleJumpToTimestamp,
  } = useLessonComments({
    lessonId,
    onJumpToTimestamp: onJumpToTime,
  });

  return (
    <div className="rounded-2xl bg-[#0D1117] border border-gray-800 p-6 text-gray-300">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
        <div className="flex items-center gap-2.5">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#6B6BFF]">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <h3 className="text-lg font-bold text-white tracking-tight">Timestamped Discussions</h3>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#161B22] text-gray-400 border border-gray-700">
          {comments.length} Discussion Threads
        </span>
      </div>

      <div className="bg-[#161B22] p-4 rounded-xl border border-gray-800 mb-6 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-gray-400">Anchor to video timestamp:</span>
          <input
            type="text"
            value={timestampInput}
            onChange={(e) => setTimestampInput(e.target.value)}
            placeholder="01:30"
            className="w-24 px-3 py-1.5 rounded-lg font-mono text-xs font-bold text-center bg-[#0D1117] text-[#79C0FF] border border-gray-700 focus:outline-none focus:border-[#6B6BFF]"
            aria-label="Video Timestamp in minutes and seconds"
          />
          <span className="text-[11px] text-gray-500">Format: MM:SS</span>
        </div>

        <textarea
          rows={2}
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          placeholder="Ask a question or share insight regarding this specific video moment..."
          disabled={isSubmitting}
          className={`w-full p-3 rounded-lg text-sm bg-[#0D1117] text-white border placeholder-gray-500 focus:outline-none transition-all resize-none ${
            profanityError ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-gray-700 focus:border-[#6B6BFF]"
          }`}
        />

        {profanityError && (
          <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2">
            <span>✕</span>
            <span>{profanityError}</span>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleAddComment}
            disabled={isSubmitting || !newCommentText.trim()}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#6B6BFF] to-[#4F46E5] hover:opacity-95 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {isSubmitting ? "Posting..." : "Post Comment"}
          </button>
        </div>
      </div>

      {comments.length === 0 ? (
        <p className="text-center py-8 text-sm text-gray-500">
          No discussion threads yet. Be the first to start a conversation!
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-[#161B22]/60 hover:bg-[#161B22] border border-gray-800/80 transition-colors flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-[10px] font-bold text-white">
                    {item.authorName[0]}
                  </div>
                  <span className="text-xs font-bold text-gray-200">{item.authorName}</span>
                  <span className="text-[11px] text-gray-500">• {item.createdAt}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleJumpToTimestamp(item.timestampSec)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-[#6B6BFF]/15 text-[#A5D6FF] hover:bg-[#6B6BFF]/25 border border-[#6B6BFF]/30 transition-colors group"
                  title="Jump directly to this moment in video"
                >
                  <span>▶ {item.timestampFormatted}</span>
                </button>
              </div>

              <p className="text-sm text-gray-300 leading-relaxed pl-8">
                {item.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
