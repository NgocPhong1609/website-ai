import { BookOpen, Check, ListChecks, Video } from "lucide-react";

type LessonLike = {
  type?: string;
  status?: string;
  completed?: boolean;
  title?: string;
};

const iconClass = "w-3.5 h-3.5";

export function lessonKind(lesson: LessonLike): "video" | "quiz" | "article" {
  const type = (lesson.type || "").toLowerCase();
  const title = lesson.title || "";

  if (
    type.includes("quiz") ||
    type.includes("exam") ||
    type.includes("test") ||
    type.includes("assessment") ||
    /(quiz|kiểm tra|bài thi|đánh giá)/i.test(title)
  ) {
    return "quiz";
  }

  if (type.includes("video") || /video/i.test(title)) {
    return "video";
  }

  return "article";
}

export function lessonDisplayTitle(title: string) {
  const stripped = title
    .replace(/^(?:[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\uFE0F\u200D]\s*)+/u, "")
    .trim();
  return stripped || title;
}

export function LessonStatusIcon({ lesson }: { lesson: LessonLike }) {
  const completed = lesson.status === "completed" || lesson.completed === true;
  const kind = lessonKind(lesson);

  if (completed) {
    return (
      <span role="img" aria-label="Đã hoàn thành" className="inline-flex">
        <Check className={iconClass} strokeWidth={2.5} aria-hidden />
      </span>
    );
  }

  if (kind === "quiz") {
    return (
      <span role="img" aria-label="Bài kiểm tra" className="inline-flex">
        <ListChecks className={iconClass} strokeWidth={2} aria-hidden />
      </span>
    );
  }

  if (kind === "video") {
    return (
      <span role="img" aria-label="Bài video" className="inline-flex">
        <Video className={iconClass} strokeWidth={2} aria-hidden />
      </span>
    );
  }

  return (
    <span role="img" aria-label="Bài đọc" className="inline-flex">
      <BookOpen className={iconClass} strokeWidth={2} aria-hidden />
    </span>
  );
}
