import type { AdminAiSystemData } from "../../ai-system/types";

export function AiProviderStatus({ providers }: { providers: AdminAiSystemData["providers"] }) {
  return <div className="grid gap-4 md:grid-cols-2">
    {([ ["primary", "AI chính"], ["backup", "AI dự phòng"] ] as const).map(([key, label]) => {
      const provider = providers[key];
      return <section key={key} aria-label={label} className="min-w-0 rounded-2xl border border-[#FAF7F2] bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-semibold text-[#2C3039]">{label}</h2>
          <span className={`rounded-xl px-2 py-1 text-xs font-medium ${provider.configured ? "bg-teal-50 text-teal-800" : "bg-orange-50 text-orange-800"}`}>{provider.configured ? "Đã cấu hình" : "Chưa cấu hình"}</span>
        </div>
        <p className="mt-3 break-words text-sm font-medium">{provider.name}</p>
        <p className="mt-1 break-words text-xs text-slate-600">{provider.model ?? "Chưa cấu hình mô hình"}</p>
        <p className="mt-3 text-xs leading-5 text-slate-600">{key === "primary" ? "Được gọi đầu tiên." : "Được gọi khi AI chính không xử lý được."} Trạng thái cấu hình không xác nhận kết nối trực tiếp.</p>
      </section>;
    })}
  </div>;
}
