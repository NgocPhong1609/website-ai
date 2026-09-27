// ─── Lesson Type Labels ───────────────────────────────────────────────────────
export function getLessonTypeLabel(type: string): string {
 switch (type) {
 case 'video': return 'Video';
 case 'article': return 'Văn bản';
 case 'quiz_module': return 'Câu hỏi';
 default: return 'Bài học';
 }
}

export function getLessonTypeColor(type: string): string {
 switch (type) {
 case 'video': return 'bg-slate-100 text-slate-900';
 case 'article': return 'bg-emerald-50 text-slate-900';
 case 'quiz_module': return 'bg-amber-50 text-amber-500';
 default: return 'bg-slate-100 text-slate-500';
 }
}
