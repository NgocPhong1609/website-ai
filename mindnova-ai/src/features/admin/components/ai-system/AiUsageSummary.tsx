"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { AiMetricProvenance, AiUsage } from "../../ai-system/types";

const panel = "min-w-0 rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm";
const sources = { provider: "Nhà cung cấp", estimated: "Ước tính", mixed: "Nguồn hỗn hợp", unavailable: "Chưa có nguồn dữ liệu" };

function provenance(metric: AiMetricProvenance) {
  return `${sources[metric.source]} · ${metric.sourced_requests}/${metric.recorded_requests} yêu cầu${metric.coverage === "partial" ? " · Dữ liệu một phần" : ""}`;
}

export function AiUsageSummary({ usage, compact = false }: { usage: AiUsage; compact?: boolean }) {
  const unavailable = "Chưa có dữ liệu";
  const metrics = [
    { title: "Yêu cầu đã ghi nhận", value: usage.available ? usage.requests.total.toLocaleString("vi-VN") : unavailable, note: `${usage.requests.successful} thành công · ${usage.requests.failed} thất bại · ${usage.requests.status_unavailable} chưa rõ trạng thái` },
    { title: "Token đầu vào", value: usage.available && usage.tokens.available && usage.tokens.input !== null ? usage.tokens.input.toLocaleString("vi-VN") : unavailable, note: provenance(usage.tokens) },
    { title: "Token đầu ra", value: usage.available && usage.tokens.available && usage.tokens.output !== null ? usage.tokens.output.toLocaleString("vi-VN") : unavailable, note: provenance(usage.tokens) },
    { title: "Chi phí", value: usage.available && usage.cost.available && usage.cost.amount !== null && usage.cost.currency ? `${usage.cost.amount.toFixed(4)} ${usage.cost.currency}` : unavailable, note: provenance(usage.cost) },
  ];
  const hasTrend = usage.available && usage.daily_trend.some((point) => point.requests > 0);

  return <div className="space-y-4">
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => <section key={metric.title} aria-label={metric.title} className={panel}>
        <h3 className="text-sm text-slate-600">{metric.title}</h3>
        <p className="mt-2 break-words text-2xl font-semibold text-[#0F172A]">{metric.value}</p>
        <p className="mt-2 text-xs leading-5 text-slate-600">{metric.note}</p>
      </section>)}
    </div>
    <p className="text-xs leading-5 text-slate-600">Chỉ bao gồm các yêu cầu đã được ghi nhận từ {usage.from} đến {usage.to}; không đại diện cho mọi hoạt động AI.</p>
    {!compact && <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
      <section aria-label="Xu hướng yêu cầu" className={panel}>
        <h2 className="font-semibold text-[#0F172A]">Yêu cầu theo ngày</h2>
        {hasTrend ? <div className="mt-4 h-56 min-w-0" role="img" aria-label={`Biểu đồ ${usage.requests.total} yêu cầu từ ${usage.from} đến ${usage.to}`}>
          <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 600, height: 224 }}>
            <LineChart data={usage.daily_trend} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
              <XAxis dataKey="date" tickFormatter={(date: string) => date.slice(5)} tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} width={38} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="requests" name="Yêu cầu" stroke="#0f766e" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div> : <p className="py-10 text-sm text-slate-600">{usage.available ? "Chưa có yêu cầu được ghi nhận trong kỳ này." : unavailable}</p>}
      </section>
      <section aria-label="Sử dụng theo nhà cung cấp" className={panel}>
        <h2 className="font-semibold text-[#0F172A]">Nhà cung cấp & mô hình</h2>
        {usage.available && usage.provider_breakdown.length > 0 ? <ul className="mt-3 divide-y divide-slate-100">
          {usage.provider_breakdown.map((row) => <li key={`${row.provider}:${row.model}`} className="flex items-start justify-between gap-3 py-3 text-sm">
            <div className="min-w-0 break-words"><p className="font-medium">{row.provider}</p><p className="text-xs text-slate-600">{row.model ?? "Chưa ghi nhận mô hình"}</p></div>
            <span className="shrink-0">{row.requests.toLocaleString("vi-VN")} yêu cầu</span>
          </li>)}
        </ul> : <p className="py-10 text-sm text-slate-600">Chưa có dữ liệu nhà cung cấp trong kỳ này.</p>}
      </section>
    </div>}
  </div>;
}
