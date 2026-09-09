import type { WritableAiConfig } from "../../ai-system/types";
import type { AiConfigErrors } from "../../ai-system/validation";

export function AiPromptEditor({ prompts, errors, disabled, onChange }: {
  prompts: WritableAiConfig["prompts"];
  errors?: AiConfigErrors["prompts"];
  disabled: boolean;
  onChange: (name: keyof WritableAiConfig["prompts"], value: string) => void;
}) {
  return <section className="rounded-2xl border border-[#FAF7F2] bg-white p-4 shadow-sm">
    <h2 className="text-lg font-semibold text-[#2C3039]">System Prompt</h2>
    <div className="mt-4 grid gap-4 xl:grid-cols-2">
      {([ ["ai_tro_giang", "AI Trợ giảng"], ["ai_cham_bai", "AI Chấm bài"] ] as const).map(([name, label]) => <div key={name} className="min-w-0">
        <label htmlFor={name} className="text-sm font-medium">{label}</label>
        <p id={`${name}-help`} className="mt-1 text-xs leading-5 text-slate-600">{name === "ai_tro_giang" ? "Áp dụng cho trợ giảng. Nội dung bắt buộc, tối đa 4000 ký tự." : "Đã lưu · Chưa áp dụng vào luồng chấm bài. Nội dung bắt buộc, tối đa 4000 ký tự."}</p>
        <textarea id={name} value={prompts[name]} rows={7} disabled={disabled}
          onChange={(event) => onChange(name, event.target.value)} aria-invalid={Boolean(errors?.[name])}
          aria-describedby={`${name}-help ${name}-count${errors?.[name] ? ` ${name}-error` : ""}`}
          className="mt-2 w-full resize-y rounded-xl border border-slate-200 px-3 py-2 text-sm leading-6 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100 disabled:bg-slate-50" />
        <p id={`${name}-count`} className="text-right text-xs text-slate-600">{Array.from(prompts[name]).length}/4000 ký tự</p>
        {errors?.[name] && <p id={`${name}-error`} className="mt-1 text-xs text-[#C0392B]">{errors[name]}</p>}
      </div>)}
    </div>
  </section>;
}
