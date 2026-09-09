import type { AiPackage, WritableAiConfig } from "../../ai-system/types";
import type { AiConfigErrors } from "../../ai-system/validation";

export function AiPackageEditor({ packages, errors, disabled, onChange }: {
  packages: WritableAiConfig["packages"];
  errors?: AiConfigErrors["packages"];
  disabled: boolean;
  onChange: (tier: keyof WritableAiConfig["packages"], field: keyof AiPackage, value: number | null) => void;
}) {
  return <section className="space-y-3">
    <h2 className="text-lg font-semibold text-[#2C3039]">Hạn mức gói AI</h2>
    <p className="text-xs leading-5 text-slate-600">Hạn mức yêu cầu áp dụng cho AI Trợ giảng. Hạn mức token được lưu để cấu hình, chưa được thực thi trong luồng hiện tại.</p>
    <div className="grid gap-4 md:grid-cols-2">
      {([ ["free", "Free", 2000], ["premium", "Premium", 10000] ] as const).map(([tier, title, max]) => <fieldset key={tier} disabled={disabled} className="min-w-0 rounded-2xl border border-[#FAF7F2] bg-white p-4 shadow-sm">
        <legend className="px-1 font-semibold text-[#2C3039]">{title}</legend>
        {([ ["daily_requests", "Yêu cầu / ngày"], ["daily_tokens", "Token / ngày"] ] as const).map(([field, label]) => {
          const id = `${tier}-${field}`;
          const error = errors?.[tier]?.[field];
          const value = packages[tier][field];
          return <div key={field} className="mt-3">
            <label htmlFor={id} className="text-sm font-medium">{title} · {label}</label>
            <input id={id} type="number" min={1} max={field === "daily_requests" ? max : undefined} step={1}
              value={value === null || Number.isNaN(value) ? "" : value}
              onChange={(event) => onChange(tier, field, event.target.value === "" ? (field === "daily_tokens" ? null : NaN) : Number(event.target.value))}
              aria-invalid={Boolean(error)} aria-describedby={`${id}-help${error ? ` ${id}-error` : ""}`}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100 disabled:bg-slate-50" />
            <p id={`${id}-help`} className="mt-1 text-xs leading-5 text-slate-600">{field === "daily_requests" ? `Số nguyên từ 1–${max}${tier === "premium" ? ", không thấp hơn Free" : ""}.` : "Để trống nếu chưa thể áp dụng hạn mức token."}</p>
            {error && <p id={`${id}-error`} className="mt-1 text-xs text-[#C0392B]">{error}</p>}
          </div>;
        })}
      </fieldset>)}
    </div>
  </section>;
}
