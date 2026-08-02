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
    <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
        <div className="flex items-center gap-2.5">
          <span className="text-lg">💬</span>
          <h3 className="text-base font-black text-gray-900 tracking-tight">Bình Luận Theo Mốc Thời Gian</h3>
        </div>
        <span className="text-xs font-mono font-black px-2.5 py-1 rounded-xl bg-indigo-50 text-[#4F46E5] border border-indigo-100">
          {comments.length} Thảo luận
        </span>
      </div>

      {/* New Comment Form */}
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-gray-600">Gắn vào mốc thời gian:</span>
          <input
            type="text"
            value={timestampInput}
            onChange={(e) => setTimestampInput(e.target.value)}
            placeholder="01:30"
            className="w-24 px-3 py-1.5 rounded-xl font-mono text-xs font-bold text-center bg-white text-[#4F46E5] border border-gray-300 focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 transition-all"
            aria-label="Mốc thời gian video theo phút và giây"
          />
          <span className="text-[11px] text-gray-400 font-medium">Định dạng: MM:SS</span>
        </div>

        <textarea
          rows={2}
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          placeholder="Đặt câu hỏi hoặc chia sẻ nhận xét về khoảnh khắc video này..."
          disabled={isSubmitting}
          className={`w-full p-3 rounded-xl text-xs font-medium bg-white text-gray-900 border placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/10 transition-all resize-none ${
            profanityError ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-[#4F46E5]"
          }`}
        />

        {profanityError && (
          <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
            <span>✕</span>
            <span>{profanityError}</span>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleAddComment}
            disabled={isSubmitting || !newCommentText.trim()}
            className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-[#4F46E5] hover:bg-[#4338CA] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs cursor-pointer uppercase tracking-wider"
          >
            {isSubmitting ? "⌛ Đang đăng..." : "✉️ Đăng bình luận"}
          </button>
        </div>
      </div>

      {/* Comment List */}
      {comments.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-sm font-bold text-gray-500">💭 Chưa có thảo luận nào.</p>
          <p className="text-xs text-gray-400 mt-1 font-medium">Hãy là người đầu tiên đặt câu hỏi!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-white hover:bg-indigo-50/30 border border-gray-200 hover:border-indigo-100 transition-all flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#4F46E5] flex items-center justify-center text-[11px] font-black text-white">
                    {item.authorName[0]}
                  </div>
                  <span className="text-xs font-black text-gray-900">{item.authorName}</span>
                  <span className="text-[11px] text-gray-400 font-medium">• {item.createdAt}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleJumpToTimestamp(item.timestampSec)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-mono font-extrabold bg-indigo-50 text-[#4F46E5] hover:bg-indigo-100 border border-indigo-100 transition-colors cursor-pointer"
                  title="Nhảy đến mốc thời gian này trong video"
                >
                  <span>▶ {item.timestampFormatted}</span>
                </button>
              </div>

              <p className="text-xs text-gray-700 leading-relaxed pl-9 font-medium">
                {item.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
